import Gameboy from './gameboy';

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
  document.getElementById('run').disabled = true;
  document.getElementById('pause').disabled = false;
  document.getElementById('step').disabled = true;
  document.getElementById('frame').disabled = true;

  gameboy.run();
  gameboy.updateDebugger();
};

document.getElementById('pause').onclick = (event) => {
  document.getElementById('run').disabled = false;
  document.getElementById('pause').disabled = true;
  document.getElementById('step').disabled = false;
  document.getElementById('frame').disabled = false;

  gameboy.pause();
  gameboy.updateDebugger();
};

document.getElementById('reset').onclick = (event) => {
  document.getElementById('run').disabled = false;
  document.getElementById('pause').disabled = true;
  document.getElementById('step').disabled = false;
  document.getElementById('frame').disabled = false;

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

