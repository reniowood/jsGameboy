import Gameboy from './gameboy';

function setRun() {
  document.getElementById('run').disabled = true;
  document.getElementById('pause').disabled = false;
  document.getElementById('step').disabled = true;
  document.getElementById('frame').disabled = true;
}

function setPause() {
  document.getElementById('run').disabled = false;
  document.getElementById('pause').disabled = true;
  document.getElementById('step').disabled = false;
  document.getElementById('frame').disabled = false;
}

const gameboy = new Gameboy();

document.getElementById('fileInput').onchange = (event) => {
  const file = event.target.files[0];

  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      gameboy.reset();
      gameboy.loadROM(Array.prototype.map.call(e.target.result, (byteChar) => (byteChar.charCodeAt())));
      gameboy.updateDebugger();
    };
    fileReader.readAsBinaryString(file);
  }
};

document.getElementById('run').onclick = (event) => {
  setRun();
  if (gameboy.run()) {
    setPause();
  }
  gameboy.updateDebugger();
};

document.getElementById('pause').onclick = (event) => {
  setPause();

  gameboy.pause();
  gameboy.updateDebugger();
};

document.getElementById('reset').onclick = (event) => {
  setPause();

  gameboy.pause();
  gameboy.reset();
  gameboy.updateDebugger();
};

document.getElementById('step').onclick = (event) => {
  gameboy.step();
  gameboy.updateDebugger();
};

document.getElementById('frame').onclick = (event) => {
  gameboy.frame();
  gameboy.updateDebugger();
};

