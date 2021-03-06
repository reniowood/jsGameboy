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
    this.GPU = new GPU();
    this.clock = new Clock();
    this.MMU = new MMU();
    this.CPU = new CPU();

    this.interrupt.CPU = this.CPU;
    this.interrupt.clock = this.clock;
    this.GPU.interrupt = this.interrupt;
    this.GPU.MMU = this.MMU;
    this.clock.CPU = this.CPU;
    this.clock.GPU = this.GPU;
    this.clock.interrupt = this.interrupt;
    this.MMU.clock = this.clock;
    this.MMU.interrupt = this.interrupt;
    this.MMU.GPU = this.GPU;
    this.MMU.input = this.input;
    this.CPU.interrupt = this.interrupt;
    this.CPU.MMU = this.MMU;
    this.CPU.GPU = this.GPU;
    this.CPU.clock = this.clock;

    this.stop = undefined;
  }
  loadROM(rom) {
      this.MMU.loadROM(rom);
  }
  run() {
    const breakPoint = parseInt(document.getElementById('breakpoint').value, 16);

    if (!isNaN(breakPoint)) {
      return new Promise((resolve, reject) => {
        this.stop = setInterval(() => {
          if (this.frame(breakPoint)) {
            resolve(true);
          }
        }, 1);
      });
    } else {
      return new Promise((resolve, reject) => {
        this.stop = setInterval(() => {
          this.frame();
        }, 1);

        resolve(false);
      });
    }
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

    if (this.CPU.registers.PC() === 0x0100) {
      this.MMU.isInBIOS = false;
    }
  }
  frame(breakPoint) {
    let until = 70224;

    do {
      this.step();
      if (this.CPU.registers.PC() === breakPoint) {
        clearInterval(this.stop);

        return true;
      }

      until -= this.clock.lastInstCycles;
    } while (until >= 0);

    return false;
  }
  updateDebugger() {
    this.updateCycles();
    this.updateRegisters();
    this.updateMemory();

    document.getElementById('IME').value = this.CPU.IME;
  }
  toHex(num) {
    return '0x' + num.toString(16);
  }
  toBin(num) {
    return num.toString(2);
  }
  updateCycles() {
    document.getElementById('cycles').value = this.clock.lastInstCycles;
  }
  updateRegisters() {
    document.getElementById('regiA').value = this.toHex(this.CPU.registers.A());
    document.getElementById('regiF').value = this.toBin(this.CPU.registers.F() >> 4);
    document.getElementById('regiB').value = this.toHex(this.CPU.registers.B());
    document.getElementById('regiC').value = this.toHex(this.CPU.registers.C());
    document.getElementById('regiD').value = this.toHex(this.CPU.registers.D());
    document.getElementById('regiE').value = this.toHex(this.CPU.registers.E());
    document.getElementById('regiHL').value = this.toHex(this.CPU.registers.HL());
    document.getElementById('regiSP').value = this.toHex(this.CPU.registers.SP());
    document.getElementById('regiPC').value = this.toHex(this.CPU.registers.PC());
  }
  updateMemory() {
    // videoRAM
    const videoRAMElement = document.getElementById('videoRAM');
    while (videoRAMElement.firstChild) {
      videoRAMElement.removeChild(videoRAMElement.firstChild);
    }

    const videoRAM = this.GPU.videoRAM;
    const videoRAMSize = videoRAM.length;
    for (let i = 0; i < videoRAMSize; i += 16) {
      const ramLineElement = document.createElement('div');

      const addr = document.createElement('span');
      addr.innerHTML = `${(0x8000 + i).toString(16)}: `;
      ramLineElement.appendChild(addr);

      for (let j = 0; j < 16; j += 1) {
        const byte = document.createElement('span');
        byte.innerHTML = `${videoRAM[i + j].toString(16)} `;
        ramLineElement.appendChild(byte);
      }

      videoRAMElement.appendChild(ramLineElement);
    }
  }
  keydown(key) {
    this.input.keydown(key);
  }
  keyup(key) {
    this.input.keyup(key);
  }
}
