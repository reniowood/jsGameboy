export default class Interrupt {
  constructor() {
    this.reset();
  }
  reset() {
    this.interruptEnabled = {
      VBlank: false,
      LCDStatus: false,
      timer: false,
      serial: false,
      input: false,
      getByte: () => (
        (this.interruptEnabled.VBlank ? 0x01 : 0x00) |
        (this.interruptEnabled.LCDStatus ? 0x02 : 0x00) |
        (this.interruptEnabled.timer ? 0x04 : 0x00) |
        (this.interruptEnabled.serial ? 0x08 : 0x00) |
        (this.interruptEnabled.input ? 0x10 : 0x00)
      ),
      setByte: (value) => {
        this.interruptEnabled.VBlank = value & 0x01 ? true : false;
        this.interruptEnabled.LCDStatus = value & 0x02 ? true : false;
        this.interruptEnabled.timer = value & 0x04 ? true : false;
        this.interruptEnabled.serial = value & 0x08 ? true : false;
        this.interruptEnabled.input = value & 0x10 ? true : false;
      }
    };
    this.interruptFlag = {
      VBlank: false,
      LCDStatus: false,
      timer: false,
      serial: false,
      input: false,
      getByte: () => (
        (this.interruptFlag.VBlank ? 0x01 : 0x00) |
        (this.interruptFlag.LCDStatus ? 0x02 : 0x00) |
        (this.interruptFlag.timer ? 0x04 : 0x00) |
        (this.interruptFlag.serial ? 0x08 : 0x00) |
        (this.interruptFlag.input ? 0x10 : 0x00)
      ),
      setByte: (value) => {
        this.interruptFlag.VBlank = value & 0x01 ? true : false;
        this.interruptFlag.LCDStatus = value & 0x02 ? true : false;
        this.interruptFlag.timer = value & 0x04 ? true : false;
        this.interruptFlag.serial = value & 0x08 ? true : false;
        this.interruptFlag.input = value & 0x10 ? true : false;
      }
    };
  }
  getIE() {
    return this.interruptEnabled.getByte();
  }
  getIF() {
    return this.interruptFlag.getByte();
  }
  setIE(value) {
    return this.interruptEnabled.setByte(value);
  }
  setIF(value) {
    return this.interruptFlag.setByte(value);
  }
}
