export default class MMU {
  constructor() {
    this.ROM = []; // 0x0000 - 0x3fff (bank 0) / 0x4000 - 0x7fff (other banks)
    this.reset();
  }
  reset() {
    this.BIOS = [
      0x31, 0xFE, 0xFF, 0xAF, 0x21, 0xFF, 0x9F, 0x32, 0xCB, 0x7C, 0x20, 0xFB, 0x21, 0x26, 0xFF, 0x0E,
      0x11, 0x3E, 0x80, 0x32, 0xE2, 0x0C, 0x3E, 0xF3, 0xE2, 0x32, 0x3E, 0x77, 0x77, 0x3E, 0xFC, 0xE0,
      0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1A, 0xCD, 0x95, 0x00, 0xCD, 0x96, 0x00, 0x13, 0x7B,
      0xFE, 0x34, 0x20, 0xF3, 0x11, 0xD8, 0x00, 0x06, 0x08, 0x1A, 0x13, 0x22, 0x23, 0x05, 0x20, 0xF9,
      0x3E, 0x19, 0xEA, 0x10, 0x99, 0x21, 0x2F, 0x99, 0x0E, 0x0C, 0x3D, 0x28, 0x08, 0x32, 0x0D, 0x20,
      0xF9, 0x2E, 0x0F, 0x18, 0xF3, 0x67, 0x3E, 0x64, 0x57, 0xE0, 0x42, 0x3E, 0x91, 0xE0, 0x40, 0x04,
      0x1E, 0x02, 0x0E, 0x0C, 0xF0, 0x44, 0xFE, 0x90, 0x20, 0xFA, 0x0D, 0x20, 0xF7, 0x1D, 0x20, 0xF2,
      0x0E, 0x13, 0x24, 0x7C, 0x1E, 0x83, 0xFE, 0x62, 0x28, 0x06, 0x1E, 0xC1, 0xFE, 0x64, 0x20, 0x06,
      0x7B, 0xE2, 0x0C, 0x3E, 0x87, 0xF2, 0xF0, 0x42, 0x90, 0xE0, 0x42, 0x15, 0x20, 0xD2, 0x05, 0x20,
      0x4F, 0x16, 0x20, 0x18, 0xCB, 0x4F, 0x06, 0x04, 0xC5, 0xCB, 0x11, 0x17, 0xC1, 0xCB, 0x11, 0x17,
      0x05, 0x20, 0xF5, 0x22, 0x23, 0x22, 0x23, 0xC9, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B,
      0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E,
      0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC,
      0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x3c, 0x42, 0xB9, 0xA5, 0xB9, 0xA5, 0x42, 0x4C,
      0x21, 0x04, 0x01, 0x11, 0xA8, 0x00, 0x1A, 0x13, 0xBE, 0x20, 0xFE, 0x23, 0x7D, 0xFE, 0x34, 0x20,
      0xF5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xFB, 0x86, 0x20, 0xFE, 0x3E, 0x01, 0xE0, 0x50
    ]; // 0x0000 - 0x00ff
    // Video RAM: 0x8000 - 0x9fff

    this.MBC_TYPE = {
      0x00: "ROM_ONLY",
      0x01: "ROM_MBC1",
      0x02: "ROM_MBC1_RAM",
      0x03: "ROM_MBC1_RAM_BAT",
      0x05: "ROM_MBC2",
      0x06: "ROM_MBC2_BAT",
      0x11: "ROM_MBC3",
      0x12: "ROM_MBC3_RAM",
      0x13: "ROM_MBC3_RAM_BAT",
      0x19: "ROM_MBC5",
      0x1a: "ROM_MBC5_RAM",
      0x1b: "ROM_MBC5_RAM_BAT"
    };
    this.MBC = this.MBC_TYPE[0x00];
    this.NUM_ROM_BANKS_TYPE = {
      0: 2,
      1: 4,
      2: 8,
      3: 16,
      4: 32,
      5: 64,
      6: 128,
      0x52: 72,
      0x53: 80,
      0x54: 96
    };
    this.NUM_ROM_BANKS = this.NUM_ROM_BANKS_TYPE[0];
    this.RAM_SIZE = {
      0: 0,
      1: 2048,
      2: 8196,
      3: 32768,
      4: 131072
    };
    this.NUM_RAM_BANKS_TYPE = {
      0: 0,
      1: 1,
      2: 1,
      3: 4,
      4: 16
    };
    this.NUM_RAM_BANKS = this.NUM_RAM_BANKS_TYPE[0];
    this.currentROMBank = 1;
    this.currentRAMBank = 0;

    this.cartridgeRAM = []; // 0xa000 - 0xbfff
    this.workingRAM = []; // 0xc000 - 0xdfff / 0xe000 - 0xfdff (shadow)
    for (let i=0; i<8192; i+=1) {
      this.workingRAM.push(0);
    }
    // Sprite Attribute Memory (OAM): 0xfe00 - 0xfea0
    // Memory-mapped I/O: 0xff00 - 0xff7f
    this.zeroPageRAM = []; // 0xff80 - 0xffff
    for (let i=0; i<128; i+=1) {
      this.zeroPageRAM.push(0);
    }

    this.isRAMEnabled = false;
    this.BANKING_MODE = {
      ROM: 0x00,
      RAM: 0x01
    };
    this.bankingMode = this.BANKING_MODE.ROM;

    this.isAccessible = true;
  }
  loadROM(rom) {
    this.ROM = rom;
    this.MBC = this.MBC_TYPE[rom[0x0147]];
    this.NUM_ROM_BANKS = this.NUM_ROM_BANKS_TYPE[rom[0x0148]];
    this.NUM_RAM_BANKS = this.NUM_RAM_BANKS_TYPE[rom[0x0149]];

    const RAMSize = this.MBC.startsWith("ROM_MBC2") ? 512 : this.RAM_SIZE[rom[0x0149]];
    for (let i=0; i<RAMSize; i+=1) {
      this.cartridgeRAM.push(0);
    }
  }
  setAccessible() {
    this.isAccessible = true;
  }
  setInaccessible() {
    this.isAccessible = false;
  }
  readByte(addr) {
    if (!this.isAccessible && addr < 0xff80) {
      this.clock.step();
      return 0xff;
    }

    const byte = this._readByte(addr);
    this.clock.step();
    return byte;
  }
  _readByte(addr) {
    switch (addr & 0xf000) {
      case 0x0000:
      case 0x1000:
      case 0x2000:
      case 0x3000:
        return this.ROM[addr];
      case 0x4000:
      case 0x5000:
      case 0x6000:
      case 0x7000:
        return this.ROM[(this.currentROMBank - 1) * 0x4000 + addr];
      case 0x8000:
      case 0x9000:
        return this.GPU.videoRAM[addr & 0x1fff];
      case 0xa000:
        if (this.MBC.startsWith("ROM_MBC2")) {
          return this.cartridgeRAM[addr & 0x1fff] & 0x0f;
        }
      case 0xb000:
        if (!this.MBC.startsWith("ROM_MBC2")) {
          return this.cartridgeRAM[this.currentRAMBank * 0x4000 + (addr & 0x1fff)];
        }

        break;
      case 0xc000:
      case 0xd000:
        return this.workingRAM[addr & 0x1fff];
      case 0xe000:
        return this.workingRAM[addr & 0x1fff];
      case 0xf000:
        switch (addr & 0x0f00) {
          case 0x0000:
          case 0x0100:
          case 0x0200:
          case 0x0300:
          case 0x0400:
          case 0x0500:
          case 0x0600:
          case 0x0700:
          case 0x0800:
          case 0x0900:
          case 0x0a00:
          case 0x0b00:
          case 0x0c00:
          case 0x0d00:
            return this.workingRAM[addr & 0x1fff];
          case 0x0e00:
            if (addr < 0xfea0) {
              return this.GPU.OAM[addr & 0xff];
            }

            return 0;
          case 0x0f00:
            if (addr === 0xffff) {
              return this.interrupt.getIE();
            }
            if (addr >= 0xff80) {
              return this.zeroPageRAM[addr & 0x7f];
            }

            if (addr === 0xff00) {
              return this.input.readByte();
            } else if (addr === 0xff04) {
              return this.clock.divider;
            } else if (addr === 0xff05) {
              return this.clock.counter;
            } else if (addr === 0xff06) {
              return this.clock.modulo;
            } else if (addr === 0xff07) {
              return this.clock.getControl();
            } else if (addr === 0xff0f) {
              return this.interrupt.getIF();
            } else {
              switch (addr & 0x00f0) {
                case 0x40:
                case 0x50:
                case 0x60:
                case 0x70:
                  return this.GPU.readByte(addr);
              }
            }

            return 0;
        }
    }
  }
  writeByte(addr, value) {
    if (!this.isAccessible && addr < 0xff80 && addr !== 0xff46) {
      this.clock.step();
      return 0xff;
    }

    const byte = this._writeByte(addr, value);
    this.clock.step();
    return byte;
  }
  _writeByte(addr, value) {
    switch (addr & 0xf000) {
      case 0x0000:
      case 0x1000:
        if (this.MBC.startsWith("ROM_MBC1") || this.MBC.startsWith("ROM_MBC3") || this.MBC.startsWith("ROM_MBC5")) {
          if (value & 0x0f === 0x0a) {
            this.isRAMEnabled = true;
          } else {
            this.isRAMEnabled = false;
          }
        } else if (this.MBC.startsWith("ROM_MBC2")) {
          if ((addr & 0xf0) >> 4 === 0) {
            if (value & 0x0f === 0x0a) {
              this.isRAMEnabled = true;
            } else {
              this.isRAMEnabled = false;
            }
          }
        }

        break;
      case 0x2000:
        if (this.MBC.startsWith("ROM_MBC5")) {
          this.currentROMBank &= 0x0100;
          this.currentROMBank |= value;
        }

        break;
      case 0x3000:
        if (this.MBC.startsWith("ROM_MBC1")) {
          const lower5Bits = value & 0x1f;
          const ROMBank = lower5Bits % 0x20 === 0 ? lower5Bits + 1 : lower5Bits;

          this.currentROMBank &= 0xe0;
          this.currentROMBank |= ROMBank;
        } else if (this.MBC.startsWith("ROM_MBC2")) {
          if ((addr & 0xf0) >> 4 === 1) {
            this.currentROMBank = value & 0x0f;
          }
        } else if (this.MBC.startsWith("ROM_MBC3")) {
          this.currentROMBank = (value & 0x7f) === 0 ? 1 : value & 0x7f;
        } else if (this.MBC.startsWith("ROM_MBC5")) {
          this.currentROMBank &= 0x00ff;
          this.currentROMBank |= (value & 0x01) << 8;
        }

        break;
      case 0x4000:
      case 0x5000:
        if (this.MBC.startsWith("ROM_MBC1")) {
          if (this.bankingMode === this.BANKING_MODE.ROM) {
            this.currentROMBank &= 0x9f;
            this.currentROMBank |= (value & 0x03) << 5;
          } else {
            this.currentRAMBank = value & 0x03;
          }
        } else if (this.MBC.startsWith("ROM_MBC3")) {
          this.currentRAMBank = value & 0x03;
        } else if (this.MBC.startsWith("ROM_MBC5")) {
          this.currentRAMBank = value & 0x0f;
        }

        break;
      case 0x6000:
      case 0x7000:
        if (this.MBC.startsWith("ROM_MBC1")) {
          if (value & 0x03 === 0x00) {
            this.bankingMode = this.BANKING_MODE.ROM;
          } else if (value & 0x01 === 0x01) {
            this.bankingMode = this.BANKING_MODE.RAM;
          }
        }

        break;
      case 0x8000:
      case 0x9000:
        this.GPU.videoRAM[addr & 0x1fff] = value;
        if (addr < 0x9800) {
          this.GPU.updateTile(addr, value);
        }

        return this.GPU.videoRAM[addr & 0x1fff];
      case 0xa000:
        if (this.MBC.startsWith("ROM_MBC2")) {
          return this.cartridgeRAM[addr & 0x1fff] = value & 0x0f;
        }

        break;
      case 0xb000:
        if (!this.MBC.startsWith("ROM_MBC2")) {
          return this.cartridgeRAM[this.currentRAMBank * 0x4000 + (addr & 0x1fff)] = value;
        }

        break;
      case 0xc000:
      case 0xd000:
        return this.workingRAM[addr & 0x1fff] = value;
      case 0xe000:
        return this.workingRAM[addr & 0x1fff] = value;
      case 0xf000:
        switch (addr & 0x0f00) {
          case 0x0000:
          case 0x0100:
          case 0x0200:
          case 0x0300:
          case 0x0400:
          case 0x0500:
          case 0x0600:
          case 0x0700:
          case 0x0800:
          case 0x0900:
          case 0x0a00:
          case 0x0b00:
          case 0x0c00:
          case 0x0d00:
            return this.workingRAM[addr & 0x1fff] = value;
          case 0x0e00:
            if (addr < 0xfea0) {
              this.GPU.OAM[addr & 0xff] = value;
              this.GPU.updateSprite(addr, value);

              return this.GPU.OAM[addr & 0xff];
            }

            return 0;
          case 0x0f00:
            if (addr === 0xffff) {
              return this.interrupt.setIE(value);
            }
            if (addr >= 0xff80) {
              return this.zeroPageRAM[addr & 0x7f] = value;
            }

            if (addr === 0xff00) {
              return this.input.writeByte(value);
            } else if (addr === 0xff04) {
              return this.clock.updateDivider(0);
            } else if (addr === 0xff05) {
              return this.clock.updateCounter(value);
            } else if (addr === 0xff06) {
              return this.clock.updateModulo(value);
            } else if (addr === 0xff07) {
              return this.clock.updateControl(value);
            } else if (addr === 0xff0f) { // IF
              return this.interrupt.setIF(value);
            } else if (addr === 0xff46) { // DMA
              this.GPU.startOAMDMA(value);
            } else {
              switch (addr & 0x00f0) {
                case 0x40:
                case 0x50:
                case 0x60:
                case 0x70:
                  return this.GPU.writeByte(addr, value);
              }
            }

            return 0;
        }
    }
  }
  readWord(addr) {
    const lowByte = this.readByte(addr);
    const highByte = this.readByte(addr + 1);
    
    return highByte << 8 | lowByte;
  }
  writeWord(addr, value) {
    this.writeByte(addr + 1, (value >> 8) & 0xff);
    this.writeByte(addr, value & 0xff);
  }
}
