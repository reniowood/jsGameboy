import Clock from './clock';
import Input from './input';
import GPU from './gpu';
import MMU from './mmu';
import CPU from './cpu';

export default class Gameboy {
  constructor() {
    this.clock = new Clock();
    this.Input = new Input();
    this.GPU = new GPU(this.clock);
    this.MMU = new MMU(this.GPU, this.Input);
    this.CPU = new CPU(this.clock, this.MMU);

    this.stop = undefined;
  }
  loadROM(rom) {
      this.MMU.loadROM(rom);
  }
  run() {
    const breakPoint = parseInt(document.getElementById('breakpoint').value, 16);

    if (!!breakPoint) {
      return new Promise((resolve, reject) => {
        this.stop = setInterval(() => {
          this.step();

          if (this.CPU.registers.PC() === breakPoint) {
            clearInterval(this.stop);

            resolve(true);
          }
        }, 1);
      });
    } else {
      return new Promise((resolve, reject) => {
        this.stop = setInterval(() => {
          this.frame();
        }, 16);

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
    this.CPU.reset();
    this.CPU.registers.A(0x01);
    this.CPU.registers.F(0xb0);
    this.CPU.registers.BC(0x0013);
    this.CPU.registers.DE(0x00d8);
    this.CPU.registers.HL(0x014d);
    this.CPU.registers.SP(0xfffe);
    this.CPU.registers.PC(0x100);

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
  frame() {
    const until = this.clock.cycles + 70224;

    do {
      this.step();
    } while (this.clock.cycles < until);
  }
  updateDebugger() {
    this.updateRegisters();
    this.updateMemory();
  }
  toHex(num) {
    return '0x' + num.toString(16);
  }

  toBin(num) {
    return num.toString(2);
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
    this.Input.keydown(key);
  }
  keyup(key) {
    this.Input.keyup(key);
  }
}
