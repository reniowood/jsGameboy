import Clock from './clock';
import Input from './input';
import Interrupt from './interrupt';
import GPU from './gpu';
import MMU from './mmu';
import CPU from './cpu';

export default class Gameboy {
  constructor() {
    this.input = new Input();
    this.interrupt = new Interrupt();
    this.clock = new Clock(this.interrupt);
    this.GPU = new GPU(this.clock, this.interrupt);
    this.MMU = new MMU(this.clock, this.interrupt, this.GPU, this.input);
    this.CPU = new CPU(this.clock, this.interrupt, this.MMU, this.GPU);

    this.stop = undefined;
  }
  loadROM(rom) {
      this.MMU.loadROM(rom);
  }
  run() {
    return new Promise((resolve, reject) => {
      this.stop = setInterval(() => {
        this.frame();
      }, 1);

      resolve(false);
    });
  }
  pause() {
    if (this.stop) {
      clearInterval(this.stop);
    }
  }
  reset() {
    this.clock.reset();
    this.interrupt.reset();

    this.CPU.reset();
    this.CPU.registers.A(0x01);
    this.CPU.registers.F(0xb0);
    this.CPU.registers.BC(0x0013);
    this.CPU.registers.DE(0x00d8);
    this.CPU.registers.HL(0x014d);
    this.CPU.registers.SP(0xfffe);
    this.CPU.registers.PC(0x101);

    this.MMU.reset();
    this.MMU.isInBIOS = false; 

    this.GPU.reset();
  }
  step() {
    this.CPU.step();
    this.GPU.step();

    if (this.CPU.registers.PC() === 0x0100) {
      this.MMU.isInBIOS = false;
    }
  }
  frame(breakPoint) {
    let until = 70224;

    do {
      this.step();

      until -= this.clock.lastInstCycles;
    } while (until >= 0);

    return false;
  }
  keydown(key) {
    this.input.keydown(key);
  }
  keyup(key) {
    this.input.keyup(key);
  }
}
