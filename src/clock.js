export default class Clock {
  constructor(interrupt) {
    this.interrupt = interrupt;

    this.reset();
  }
  reset() {
    this.CYCLES_PER_SECOND = 4194304;
    this.DIVIDER_SPEED = 16384;
    this.COUNTER_SPEED = [
      4096,
      262144,
      65536,
      16384
    ];

    this.lastInstCycles = 0;
    this.dividerCycles = 0;
    this.counterCycles = 0;

    // registers
    this.divider = 0;
    this.counter = 0;
    this.modulo = 0;
    this.control = {
      counterSpeed: this.COUNTER_SPEED[0],
      runningTimer: false
    };
  }
  updateCycles(lastInstCycles) {
    this.lastInstCycles = lastInstCycles;

    this.dividerCycles += lastInstCycles;
    const cyclesPerDivider = this.CYCLES_PER_SECOND / this.DIVIDER_SPEED;
    if (this.dividerCycles >= cyclesPerDivider) {
      this.divider += Math.floor(this.dividerCycles / cyclesPerDivider);
      if (this.divider > 0xff) {
        this.divider = this.divider - 0x100;
      }
      this.dividerCycles %= cyclesPerDivider;
    }

    if (this.control.runningTimer) {
      this.counterCycles += lastInstCycles;
      const cyclesPerCounter = this.CYCLES_PER_SECOND / this.control.counterSpeed;
      if (this.counterCycles >= cyclesPerCounter) {
        this.counter += Math.floor(this.counterCycles / cyclesPerCounter);
        if (this.counter > 0xff) {
          this.interrupt.interruptFlag.timer = true;
          this.counter = this.modulo + (this.counter - 0x100);
        }
        this.counterCycles %= cyclesPerCounter;
      }
    }
  }
  updateDivider(value) {
    this.divider = 0;
  }
  updateCounter(value) {
    this.counter = value;
  }
  updateModulo(value) {
    this.modulo = value;
  }
  updateControl(value) {
    this.control.counterSpeed = this.COUNTER_SPEED[value & 0x03];
    this.control.runningTimer = value & 0x04 ? true : false;
  }
  getControl() {
    return this.COUNTER_SPEED.indexOf(this.control.counterSpeed) | (this.control.runningTimer ? 0x04 : 0x00);
  }
}
