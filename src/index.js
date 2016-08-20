import Gameboy from './gameboy';

const keyCode = {
  B: 90,
  A: 88,
  START: 65,
  SELECT: 83,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
};

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
  gameboy.run().then((isFinished) => {
    if (isFinished) {
      setPause();
    }

    gameboy.updateDebugger();
  });
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

document.body.onkeydown = (event) => {
  switch (event.keyCode) {
    case keyCode.B:
      gameboy.keydown('B');
      break;
    case keyCode.A:
      gameboy.keydown('A');
      break;
    case keyCode.START:
      gameboy.keydown('START');
      break;
    case keyCode.SELECT:
      gameboy.keydown('SELECT');
      break;
    case keyCode.UP:
      gameboy.keydown('UP');
      break;
    case keyCode.DOWN:
      gameboy.keydown('DOWN');
      break;
    case keyCode.LEFT:
      gameboy.keydown('LEFT');
      break;
    case keyCode.RIGHT:
      gameboy.keydown('RIGHT');
      break;
  }
};

document.body.onkeyup = (event) => {
  switch (event.keyCode) {
    case keyCode.B:
      gameboy.keyup('B');
      break;
    case keyCode.A:
      gameboy.keyup('A');
      break;
    case keyCode.START:
      gameboy.keyup('START');
      break;
    case keyCode.SELECT:
      gameboy.keyup('SELECT');
      break;
    case keyCode.UP:
      gameboy.keyup('UP');
      break;
    case keyCode.DOWN:
      gameboy.keyup('DOWN');
      break;
    case keyCode.LEFT:
      gameboy.keyup('LEFT');
      break;
    case keyCode.RIGHT:
      gameboy.keyup('RIGHT');
      break;
  }
};
