export default class GPU {
  constructor(CPU) {
    this.CPU = CPU;

    this.reset();
  }
  reset() {
    const canvas = document.getElementById('screen');

    this.canvas = canvas.getContext('2d');
    this.screen = this.canvas.createImageData(160, 144);

    for (let i=0; i<160*144*4; i+=1) {
      this.screen.data[i] = 0xff;
    }

    this.canvas.putImageData(this.screen, 0, 0);

    this.MODE = {
      HBLANK: 0,
      VBLANK: 1,
      SCANLINE_OAM: 2,
      SCANLINE_VRAM: 3,
    };
    this.mode = this.MODE.SCANLINE_OAM; 
    this.cycles = 0;
    this.line = 0;

    this.videoRAM = [];
    for (let i=0; i<8192; i+=1) {
      this.videoRAM.push(0);
    }
    this.OAM = [];
    for (let i=0; i<256; i+=1) {
      this.OAM.push(0);
    }

    this.tiles = [];
    for (let i=0; i<384; i+=1) {
      this.tiles.push([]);
      for (let j=0; j<8; j+=1) {
        this.tiles[i].push([0, 0, 0, 0, 0, 0, 0, 0]);
      }
    }

    this.palette = [
      [255, 255, 255, 255],
      [0, 0, 0, 255],
      [0, 0, 0, 255],
      [0, 0, 0, 255]
    ];

    // LCDC
    this.screenX = 0;
    this.screenY = 0;
    this.isBackgroundOn = true;
    this.isSpritesOn = false;
    this.spriteSize = 8*8;
    this.bgTileMap = 0;
    this.bgTileSet = 0;
    this.isWindowOn = false;
    this.windowTileMap = 0;
    this.isDisplayOn = true;

    // STAT
    this.STAT = 0xff41;

    this.registers = [];
  }
  run() {
    switch (this.mode) {
      case this.MODE.SCANLINE_OAM:
        if (this.cycles >= 80) {
          this.writeByte(this.STAT, 0x03);
          this.cycles = 0;
        }

        break;
      case this.MODE.SCANLINE_VRAM:
        if (this.cycles >= 172) {
          this.writeByte(this.STAT, 0x00);
          this.cycles = 0;

          this.render();
        }

        break;
      case this.MODE.HBLANK:
        if (this.cycles >= 202) {
          if (this.line === 143) {
            this.writeByte(this.STAT, 0x01);
            this.canvas.putImageData(this.screen, 0, 0);
          } else {
            this.writeByte(this.STAT, 0x02);
            this.line += 1;
          }

          this.cycles = 0;
        }

        break;
      case this.MODE.VBLANK:
        if (this.cycles >= 456) {
          this.cycles = 0;
          this.line += 1;

          if (this.line === 153) {
            this.writeByte(this.STAT, 0x02);
            this.line = 0;
          }
        }
        break;
    }
  }
  updateTile(addr, value) {
    const baseAddr = addr & 0x1ffe; // two bytes needed to represent a 1x8 line
    const tileIndex = (baseAddr >> 4) & 0x1ff;

    const y = (baseAddr >> 1) & 0x07;
    for (let x=0; x<8; x+=1) {
      this.tiles[tileIndex][y][7 - x] = ((this.videoRAM[baseAddr] >> x) & 0x01) | (((this.videoRAM[baseAddr + 1] >> x) & 0x01) << 1);
    }
  }
  render() {
    const tileMapBase = this.bgTileMap === 0 ? 0x1800 : 0x1c00;
    const tileMapX = this.screenX >> 3;
    const tileMapY = (this.screenY + this.line) >> 3;
    const xInTile = this.screenX & 0x07;
    const yInTile = (this.screenY + this.line) & 0x07;

    const canvasOffset = this.line * 160 * 4;
    let tileOffset = tileMapBase + tileMapY * 32 + tileMapX;
    let x = xInTile;
    for (let pxNum = 0; pxNum < 160; pxNum += 1) {
      const tile = this.videoRAM[tileOffset];
      const color = this.palette[this.tiles[tile][yInTile][x]];

      this.screen.data[canvasOffset + pxNum * 4] = color[0];
      this.screen.data[canvasOffset + pxNum * 4 + 1] = color[1];
      this.screen.data[canvasOffset + pxNum * 4 + 2] = color[2];
      this.screen.data[canvasOffset + pxNum * 4 + 3] = color[3];

      x = (x + 1) % 8;
      if (x === 0) {
        tileOffset += 1;
      }
    }
  }
  readByte(addr) {
    switch (addr & 0x00ff) {
      case 0x40: // LCD and GPU control
        return (this.isBackgroundOn ? 0x01 : 0x00) |
               (this.isSpritesOn ? 0x02 : 0x00) |
               (this.spriteSize === 8*16 ? 0x04 : 0x00) |
               (this.bgTileMap === 1 ? 0x08 : 0x00) |
               (this.bgTileSet === 1 ? 0x10 : 0x00) |
               (this.isWindowOn ? 0x20 : 0x00) |
               (this.windowTileMap === 1 ? 0x40 : 0x00) |
               (this.isDisplayOn ? 0x80 : 0x00);
      case 0x41: // STAT
        return this.mode;
      case 0x42: // Scroll-Y
        return this.screenY;
      case 0x43: // Scroll-X
        return this.screenX;
      case 0x44: // Current scan line
        return this.line;
      default:
        return this.registers[addr - 0xff40];
    }
  }
  writeByte(addr, value) {
    this.registers[addr - 0xff40] = value;

    switch (addr & 0x00ff) {
      case 0x40: // LCD and GPU control
        this.isBackgroundOn = (value & 0x01) ? true : false;
        this.isSpritesOn = (value & 0x02) ? true : false;
        this.spriteSize = (value & 0x04) ? 8*16 : 8*8;
        this.bgTileMap = (value & 0x08) ? 1 : 0;
        this.bgTileSet = (value & 0x10) ? 1 : 0;
        this.isWindowOn = (value & 0x20) ? true : false;
        this.windowTileMap = (value & 0x40) ? 1 : 0;
        this.isDisplayOn = (value & 0x80) ? true : false;

        return value;
      case 0x41: // STAT
        switch (value & 0x03) {
          case 0x00: // HBLANK
            this.mode = this.MODE.HBLANK;

            break;
          case 0x01: // VBLANK
            this.mode = this.MODE.VBLANK;

            break;
          case 0x02: // SCANLINE_OAM
            this.mode = this.MODE.SCANLINE_OAM;

            break;
          case 0x03: // SCANLINE_VRAM
            this.mode = this.MODE.SCANLINE_VRAM;

            break;
        }

        this.cycles = 0;

        break;
      case 0x42: // Scroll-Y
        return this.screenY = value;
      case 0x43: // Scroll-X
        return this.screenX = value;
      case 0x47: // Background Palette
        for (let i=0; i<4; i+=1) {
          switch ((value >> i*2) & 0x03) {
            case 0:
              this.palette[i] = [255, 255, 255, 255];

              break;
            case 1:
              this.palette[i] = [192, 192, 192, 255];

              break;
            case 2:
              this.palette[i] = [96, 96, 96, 255];

              break;
            case 3:
              this.palette[i] = [0, 0, 0, 255];

              break;
          }
        }

        return value;
    }
  }
}
