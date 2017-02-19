export default class GPU {
  constructor(clock, interrupt) {
    this.clock = clock;
    this.interrupt = interrupt;

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

    this.cycles = 0;
    this.line = 0;
    this.lineCompare = 0;

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
        y: -16,
        x: -8,
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
    this.MODE = {
      HBLANK: 0,
      VBLANK: 1,
      SCANLINE_OAM: 2,
      SCANLINE_VRAM: 3,
    };
    this.mode = this.MODE.HBLANK; 
    this.coincidenceFlag = false;
    this.HBlankInterrupt = false;
    this.VBlankInterrupt = false;
    this.OAMInterrupt = false;
    this.lineCompareInterrupt = false;

    this.registers = [];
    for (let i=0; i<12; i+=1) {
      this.registers.push(0);
    }
    this.registers[0xff47 - 0xff40] = 0xfc; // bgp
    this.registers[0xff47 - 0xff40] = 0xfc; // bgp
    this.registers[0xff48 - 0xff40] = 0xff; // obp0
    this.registers[0xff49 - 0xff40] = 0xff; // obp1
    this.registers[0xff4a - 0xff40] = 0x00; // wy
    this.registers[0xff4b - 0xff40] = 0x00; // wx
  }
  signed(n) {
    if (n & 0x80) {
      n = -((~n + 1) & 0xff);
    }

    return n;
  }
  step() {
    this.cycles += this.clock.lastInstCycles;

    switch (this.mode) {
      case this.MODE.HBLANK:
        if (this.cycles >= 204) {
          if (this.HBlankInterrupt) {
            this.interrupt.interruptFlag.LCDStatus = true;
          }

          if (this.line === 144) {
            if (this.VBlankInterrupt) {
              this.interrupt.interruptFlag.LCDStatus = true;
            }
            this.interrupt.interruptFlag.VBlank = true;

            this.canvas.putImageData(this.screen, 0, 0);

            this.mode = this.MODE.VBLANK;
          } else {
            this.mode = this.MODE.SCANLINE_OAM;
          }

          this.cycles = 0;
        }

        break;
      case this.MODE.SCANLINE_OAM:
        if (this.cycles >= 80) {
          this.mode = this.MODE.SCANLINE_VRAM;

          if (this.OAMInterrupt) {
            this.interrupt.interruptFlag.LCDStatus = true;
          }

          this.cycles = 0;
        }

        break;
      case this.MODE.SCANLINE_VRAM:
        if (this.cycles >= 172) {
          this.mode = this.MODE.HBLANK;

          this.coincidenceFlag = this.line === this.lineCompare;
          if (this.lineCompareInterrupt) {
            this.interrupt.interruptFlag.LCDStatus = true;
          }

          this.render();

          this.line += 1;
          this.cycles = 0;
        }

        break;
      case this.MODE.VBLANK:
        if (this.cycles >= 456) {
          this.line += 1;

          if (this.line === 154) {
            this.mode = this.MODE.HBLANK;

            this.line = 0;
          }

          this.cycles = 0;
        }

        break;
    }
  }
  updateSprite(addr, value) {
    const sprite = (addr - 0xfe00) >> 2;
    const index = (addr - 0xfe00) & 0x03;

    switch (index) {
      case 0:
        this.sprites[sprite].y = value - 16;
        break;
      case 1:
        this.sprites[sprite].x = value - 8;
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
    const tileMapY = ((this.screenY + this.line) & 0xff) >> 3;
    const xInTile = this.screenX & 0x07;
    const yInTile = (this.screenY + this.line) & 0x07;

    const tileBase = tileMapBase + tileMapY * 32;
    let tileOffset = tileMapX;
    let x = xInTile;
    for (let i = 0; i < 160; i += 1) {
      const tileIndex = this.videoRAM[tileBase + tileOffset];
      const tile = this.bgTileSet === 0 ? 256 + this.signed(tileIndex) : tileIndex;

      renderedBackgroundRow[i] = {
        color: this.tiles[tile][yInTile][x],
        palette: this.palette,
      };

      x = (x + 1) % 8;
      if (x === 0) {
        tileOffset = (tileOffset + 1) & 0x1f;
      }
    }

    return renderedBackgroundRow;
  }
  renderWindow(renderedBackgroundRow) {
    const windowX = this.registers[0xff4b - 0xff40];
    const windowY = this.registers[0xff4a - 0xff40];

    if (windowX < 0 || windowX > 166 || windowY < 0 || windowY > 143) {
      return renderedBackgroundRow;
    }

    if (this.line >= windowY) {
      const tileMapBase = this.windowTileMap === 0 ? 0x1800 : 0x1c00;
      const tileMapX = 0;
      const tileMapY = ((this.line - windowY) & 0xff) >> 3;
      const xInTile = 0;
      const yInTile = (this.line - windowY) & 0x07;

      const tileBase = tileMapBase + tileMapY * 32;
      let tileOffset = tileMapX;
      let x = xInTile;
      for (let i = windowX - 7; i < 160; i += 1) {
        const tileIndex = this.videoRAM[tileBase + tileOffset];
        const tile = this.bgTileSet === 0 ? 256 + this.signed(tileIndex) : tileIndex;

        renderedBackgroundRow[i] = {
          color: this.tiles[tile][yInTile][x],
          palette: this.palette,
        };

        x = (x + 1) % 8;
        if (x === 0) {
          tileOffset += 1;
        }
      }
      // console.log(this.line, windowY, this.line - windowY, renderedBackgroundRow.map((pixel) => (pixel.color)));
    }

    return renderedBackgroundRow;
  }
  renderSprites(renderedBackgroundRow) {
    let renderedSpritesRow = new Array(160).fill({
      color: -1,
      palette: this.palette,
    });

    const filteredSprites = this.sprites.filter((sprite) => {
      return sprite.x >= 0 && sprite.x < 160 && this.line >= sprite.y && this.line < sprite.y + this.spriteHeight;
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

    for (let sprite of sprites) {
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

        if (pixel !== 0 && (sprite.aboveBackground || (renderedBackgroundRow[sprite.x + x].color === 0))) {
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

    if (this.isWindowOn) {
      renderedBackgroundRow = this.renderWindow(renderedBackgroundRow);

      this.renderRow(renderedBackgroundRow);
    }

    if (this.isSpritesOn) {
      const renderedSpritesRow = this.renderSprites(renderedBackgroundRow);

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
        return this.mode |
               (this.coincidenceFlag ? 0x04 : 0x00) |
               (this.HBlankInterrupt ? 0x08 : 0x00) |
               (this.VBlankInterrupt ? 0x10 : 0x00) |
               (this.OAMInterrupt ? 0x20 : 0x00) |
               (this.lineCompareInterrupt ? 0x40 : 0x00);
      case 0x42: // Scroll-Y
        return this.screenY;
      case 0x43: // Scroll-X
        return this.screenX;
      case 0x44: // Current scan line
        return this.line;
      case 0x45: // LYC
        return this.lineCompare;
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
        this.coincidenceFlag = (value & 0x04) ? true : false;
        this.HBlankInterrupt = (value & 0x08) ? true : false;
        this.VBlankInterrupt = (value & 0x10) ? true : false;
        this.OAMInterrupt = (value & 0x20) ? true : false;
        this.lineCompareInterrupt = (value & 0x40) ? true : false;

        this.cycles = 0;

        break;
      case 0x42: // Scroll-Y
        return this.screenY = value;
      case 0x43: // Scroll-X
        return this.screenX = value;
      case 0x45:
        return this.lineCompare = value;
      case 0x47: // Background Palette
        this.registers[addr - 0xff40] = value;
        return this.updatePalette(this.palette, value);
      case 0x48: // Object Palette 0
        this.registers[addr - 0xff40] = value;
        return this.updatePalette(this.objectPalette[0], value);
      case 0x49: // Object Palette 1
        this.registers[addr - 0xff40] = value;
        return this.updatePalette(this.objectPalette[1], value);
      case 0x4a: // Window Y
      case 0x4b: // Window X
        return this.registers[addr - 0xff40] = value;
    }
  }
}
