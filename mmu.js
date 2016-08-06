export default class MMU {
  constructor(CPU, GPU) {
    this.CPU = CPU;
    this.GPU = GPU;

    this.isInBIOS = true;

    this.BIOS = []; // 0x0000 - 0x00ff
    this.ROM = []; // 0x0000 - 0x3fff (bank 0) / 0x4000 - 0x7fff (other banks)
    // Video RAM: 0x8000 - 0x9fff
    this.cartridgeRAM = []; // 0xa000 - 0xbfff
    this.workingRAM = []; // 0xc000 - 0xdfff / 0xe000 - 0xfdff (shadow)
    // Sprite Attribute Memory (OAM): 0xfe00 - 0xfe9f
    // Memory-mapped I/O: 0xff00 - 0xff7f
    this.zeroPageRAM = []; // 0xff80 - 0xffff
  }
  loadROM(rom) {
    this.ROM = rom;
  }
  readByte(addr) {
    switch (addr & 0xf000) {
      case 0x0000:
      case 0x1000:
      case 0x2000:
      case 0x3000:
        if (this.isInBIOS) {
          if (addr < 0x0100) {
            return this.BIOS[addr];
          }

          if (this.CPU.registers.PC() === 0x0100) {
            this.isInBIOS = false;
          }
        }

        return this.ROM[addr];
      case 0x4000:
      case 0x5000:
      case 0x6000:
      case 0x7000:
        return this.ROM[addr];
      case 0x8000:
      case 0x9000:
        return this.GPU.videoRAM[addr & 0x1fff];
      case 0xa000:
      case 0xb000:
        return this.cartridgeRAM[addr & 0x1fff];
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
            if (addr >= 0xff80) {
              return this.zeroPageRAM[addr & 0x7f];
            }

            return 0;
        }
    }
  }
  writeByte(addr, value) {
    switch (addr & 0xf000) {
      case 0x0000:
      case 0x1000:
      case 0x2000:
      case 0x3000:
        if (this.isInBIOS) {
          if (addr < 0x0100) {
            return this.BIOS[addr];
          }

          if (this.registers.PC() === 0x0100) {
            this.isInBIOS = false;
          }
        }

        return this.ROM[addr];
      case 0x4000:
      case 0x5000:
      case 0x6000:
      case 0x7000:
        return this.ROM[addr];
      case 0x8000:
      case 0x9000:
        return this.GPU.videoRAM[addr & 0x1fff] = value;
      case 0xa000:
      case 0xb000:
        return this.cartridgeRAM[addr & 0x1fff] = value;
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
              return this.GPU.OAM[addr & 0xff] = value;
            }

            return 0;
          case 0x0f00:
            if (addr >= 0xff80) {
              return this.zeroPageRAM[addr & 0x7f] = value;
            }

            return 0;
        }
    }
  }
  readWord(addr) {
    return readWord(addr + 1) << 8 | readWord(addr);
  }
  writeWord(addr, value) {
    writeWord(addr, value & 0xff);
    writeWord(addr + 1, (value >> 8) & 0xff);
  }
}
