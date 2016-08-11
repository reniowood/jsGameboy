import CPU from './cpu';

const Z80 = new CPU();

document.getElementById('fileInput').onchange = (event) => {
  const file = event.target.files[0];

  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      Z80.MMU.loadROM(Array.prototype.map.call(e.target.result, (byteChar) => (byteChar.charCodeAt())));

      reset();
      updateRegisters();
      updateMemory();
    };
    fileReader.readAsBinaryString(file);
  }
};

let isRunning = false;
document.getElementById('run').onclick = (event) => {
  if (isRunning) {
    pause();
  } else {
    run();
  }
};

document.getElementById('reset').onclick = (event) => {
  pause();
  reset();

  updateRegisters();
  updateMemory();
};

document.getElementById('step').onclick = (event) => {
  Z80.step();

  updateRegisters();
  updateMemory();
};

document.getElementById('frame').onclick = (event) => {
  frame();

  updateRegisters();
  updateMemory();
};

function frame() {
  const until = Z80.cycles.clock + 70224;

  do {
    Z80.step();
  } while (Z80.cycles.clock < until);
}

function run() {
  const breakPoint = parseInt(document.getElementById('breakpoint').value, 16);
  if (!!breakPoint) {
    do {
      Z80.step();
    } while (Z80.registers.PC() !== breakPoint);

    updateRegisters();
    updateMemory();
  } else {
    document.getElementById('run').innerHTML = 'pause';
    isRunning = true;

    stopZ80 = setInterval(() => {
      frame();
    }, 16);
  }
}

let stopZ80 = undefined;
function pause() {
  if (stopZ80) {
    clearInterval(stopZ80);

    updateRegisters();
    updateMemory();

    document.getElementById('run').innerHTML = 'run';
    isRunning = false;
  }
}

function reset() {
  Z80.reset();
  Z80.MMU.reset();
  Z80.GPU.reset();

  Z80.registers.A(0x01);
  Z80.registers.F(0xb0);
  Z80.registers.BC(0x0013);
  Z80.registers.DE(0x00d8);
  Z80.registers.HL(0x014d);
  Z80.registers.SP(0xfffe);
  Z80.registers.PC(0x100);

  Z80.MMU.isInBIOS = false;
}

function toHex(num) {
  return '0x' + num.toString(16);
}

function toBin(num) {
  return num.toString(2);
}

function updateRegisters() {
  document.getElementById('regiA').value = toHex(Z80.registers.A());
  document.getElementById('regiF').value = toBin(Z80.registers.F() >> 4);
  document.getElementById('regiB').value = toHex(Z80.registers.B());
  document.getElementById('regiC').value = toHex(Z80.registers.C());
  document.getElementById('regiD').value = toHex(Z80.registers.D());
  document.getElementById('regiE').value = toHex(Z80.registers.E());
  document.getElementById('regiHL').value = toHex(Z80.registers.HL());
  document.getElementById('regiSP').value = toHex(Z80.registers.SP());
  document.getElementById('regiPC').value = toHex(Z80.registers.PC());
}

function updateMemory() {
  // videoRAM
  const videoRAMElement = document.getElementById('videoRAM');
  while (videoRAMElement.firstChild) {
    videoRAMElement.removeChild(videoRAMElement.firstChild);
  }

  const videoRAM = Z80.GPU.videoRAM;
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
