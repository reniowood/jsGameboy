export default class GPU {
  constructor(clock) {
    this.clock = clock;

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
    this.mode = this.MODE.HBLANK; 
    this.line = 0;

    this.videoRAM = [];
    for (let i=0; i<8192; i+=1) {
      this.videoRAM.push(0);
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
    this.objectPalette = [
      [
        [255, 255, 255, 255],
        [0, 0, 0, 255],
        [0, 0, 0, 255],
        [0, 0, 0, 255]
      ],
      [
        [255, 255, 255, 255],
        [0, 0, 0, 255],
        [0, 0, 0, 255],
        [0, 0, 0, 255]
      ]
    ];

    // Sprites
    this.OAM = [];
    for (let i=0; i<160; i+=1) {
      this.OAM.push(0);
    }
    this.sprites = [];
    for (let i=0; i<40; i+=1) {
      this.sprites.push({
        y: 0,
        x: 0,
        tile: 0,
        palette: 0,
        xFlip: false,
        yFlip: false,
        aboveBackground: 0,
      });
    }

    // LCDC
    this.screenX = 0;
    this.screenY = 0;
    this.isBackgroundOn = true;
    this.isSpritesOn = false;
    this.spriteHeight = 8;
    this.bgTileMap = 0;
    this.bgTileSet = 0;
    this.isWindowOn = false;
    this.windowTileMap = 0;
    this.isDisplayOn = true;

    // STAT
    this.STAT = 0xff41;

    this.registers = [];
    for (let i=0; i<12; i+=1) {
      this.registers.push(0);
    }
    this.registers[0xff47 - 0xff40] = 0xfc; // bgp
    this.registers[0xff48 - 0xff40] = 0xff; // obp0
    this.registers[0xff49 - 0xff40] = 0xff; // obp1
    this.registers[0xff4a - 0xff40] = 0x00; // wx
    this.registers[0xff4b - 0xff40] = 0x00; // wy
  }
  step() {
    this.cycles += this.clock.cycles;

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
        if (this.cycles >= 204) {
          this.cycles = 0;
          this.line += 1;

          if (this.line === 143) {
            this.writeByte(this.STAT, 0x01);
            this.canvas.putImageData(this.screen, 0, 0);
          } else {
            this.writeByte(this.STAT, 0x02);
          }
        }

        break;
      case this.MODE.VBLANK:
        if (this.cycles >= 456) {
          this.cycles = 0;
          this.line += 1;

          if (this.line === 154) {
            this.writeByte(this.STAT, 0x02);
            this.line = 0;
          }
        }
        break;
    }
  }
  updateSprite(addr, value) {
    const sprite = Math.floor((addr - 0xfe00) / 4);
    const index = (addr - 0xfe00) % 4;

    switch (index) {
      case 0:
        this.sprites[sprite].y = value + 16;
        break;
      case 1:
        this.sprites[sprite].x = value + 8;
        break;
      case 2:
        this.sprites[sprite].tile = value;
        break;
      case 3:
        this.sprites[sprite].palette = value & 0x10 ? 1 : 0;
        this.sprites[sprite].xFlip = value & 0x20 ? true : false;
        this.sprites[sprite].yFlip = value & 0x40 ? true : false;
        this.sprites[sprite].aboveBackground = value & 0x80 ? false : true;
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
  updatePalette(palette, value) {
    for (let i=0; i<4; i+=1) {
      switch ((value >> i*2) & 0x03) {
        case 0:
          palette[i] = [255, 255, 255, 255];

          break;
        case 1:
          palette[i] = [192, 192, 192, 255];

          break;
        case 2:
          palette[i] = [96, 96, 96, 255];

          break;
        case 3:
          palette[i] = [0, 0, 0, 255];

          break;
      }
    }

    return value;
  }
  renderBackground() {
    let renderedBackgroundRow = new Array(160).fill({
      color: 0,
      palette: this.palette,
    });

    const tileMapBase = this.bgTileMap === 0 ? 0x1800 : 0x1c00;
    const tileMapX = this.screenX >> 3;
    const tileMapY = (this.screenY + this.line) >> 3;
    const xInTile = this.screenX & 0x07;
    const yInTile = (this.screenY + this.line) & 0x07;

    let tileOffset = tileMapBase + tileMapY * 32 + tileMapX;
    let x = xInTile;
    for (let i = 0; i < 160; i += 1) {
      const tile = this.videoRAM[tileOffset];
      renderedBackgroundRow[i] = {
        color: this.tiles[tile][yInTile][x],
        palette: this.palette,
      };

      x = (x + 1) % 8;
      if (x === 0) {
        tileOffset += 1;
      }
    }

    return renderedBackgroundRow;
  }
  renderSprites(renderedBackgroundRow) {
    let renderedSpritesRow = new Array(160).fill({
      color: -1,
      palette: this.palette,
    });

    const filteredSprites = this.sprites.filter((sprite) => {
      return this.line >= sprite.y && this.line < sprite.y + this.spriteHeight;
    });
    const orderedSprites = filteredSprites.sort((a, b) => {
      if (a.x > b.x) {
        return -1;
      } else if (a.x < b.x) {
        return 1;
      } else {
        const indexA = this.sprites.indexOf(a);
        const indexB = this.sprites.indexOf(b);

        if (indexA > indexB) {
          return -1;
        } else if (indexA < indexB) {
          return 1;
        } else {
          return 0;
        }
      }

      return 0;
    });
    const sprites = orderedSprites.slice(Math.max(orderedSprites.length - 10, 0));

    for (let sprite of orderedSprites) {
      let tile, height;
      if (this.spriteHeight === 16) {
        if (this.line - sprite.y >= 8) {
          tile = sprite.tile - (sprite.tile % 2) + 1;
          height = 16;
        } else {
          tile = sprite.tile - (sprite.tile % 2);
          height = 8;
        }
      } else {
        tile = sprite.tile;
        height = 8;
      }

      let row;
      if (sprite.yFlip) {
        row = this.tiles[tile][height - (this.line - sprite.y) - 1];
      } else {
        row = this.tiles[tile][this.line - sprite.y + 8 - height];
      }

      for (let x=0; x<8; x+=1) {
        let pixel;
        if (sprite.xFlip) {
          pixel = row[8 - x - 1];
        } else {
          pixel = row[x];
        }

        if (sprite.aboveBackground || (renderedBackgroundRow[sprite.x + x].color === 0)) {
          renderedSpritesRow[sprite.x + x] = {
            color: pixel,
            palette: this.objectPalette[sprite.palette],
          };
        }
      }
    }

    return renderedSpritesRow;
  }
  renderRow(renderedRow) {
    const canvasOffset = this.line * 160 * 4;
    for (let i=0; i<160; i+=1) {
      if (renderedRow[i].color !== -1) {
        const color = renderedRow[i].palette[renderedRow[i].color];

        this.screen.data[canvasOffset + i * 4] = color[0];
        this.screen.data[canvasOffset + i * 4 + 1] = color[1];
        this.screen.data[canvasOffset + i * 4 + 2] = color[2];
        this.screen.data[canvasOffset + i * 4 + 3] = color[3];
      }
    }
  }
  render() {
    let renderedBackgroundRow = new Array(160).fill({
      color: 0,
      palette: this.palette,
    });

    if (this.isBackgroundOn) {
      renderedBackgroundRow = this.renderBackground();

      this.renderRow(renderedBackgroundRow);
    }

    let renderedSpritesRow = new Array(160).fill({
      color: -1,
      palette: this.palette,
    });

    if (this.isSpritesOn) {
      renderedSpritesRow = this.renderSprites(renderedBackgroundRow);

      this.renderRow(renderedSpritesRow);
    }
  }
  readByte(addr) {
    switch (addr & 0x00ff) {
      case 0x40: // LCD and GPU control
        return (this.isBackgroundOn ? 0x01 : 0x00) |
               (this.isSpritesOn ? 0x02 : 0x00) |
               (this.spriteHeight === 16 ? 0x04 : 0x00) |
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
        this.spriteHeight = (value & 0x04) ? 16 : 8;
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
        this.registers[addr - 0xff40] = value;
        return this.updatePalette(this.palette, value);
      case 0x48: // Object Palette 0
        this.registers[addr - 0xff40] = value;
        return this.updatePalette(this.objectPalette[0], value);
      case 0x49: // Object Palette 1
        this.registers[addr - 0xff40] = value;
        return this.updatePalette(this.objectPalette[1], value);
    }
  }
}
