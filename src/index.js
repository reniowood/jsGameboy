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
      return false;
    case keyCode.A:
      gameboy.keydown('A');
      return false;
    case keyCode.START:
      gameboy.keydown('START');
      return false;
    case keyCode.SELECT:
      gameboy.keydown('SELECT');
      return false;
    case keyCode.UP:
      gameboy.keydown('UP');
      return false;
    case keyCode.DOWN:
      gameboy.keydown('DOWN');
      return false;
    case keyCode.LEFT:
      gameboy.keydown('LEFT');
      return false;
    case keyCode.RIGHT:
      gameboy.keydown('RIGHT');
      return false;
  }
};

document.body.onkeyup = (event) => {
  switch (event.keyCode) {
    case keyCode.B:
      gameboy.keyup('B');
      return false;
    case keyCode.A:
      gameboy.keyup('A');
      return false;
    case keyCode.START:
      gameboy.keyup('START');
      return false;
    case keyCode.SELECT:
      gameboy.keyup('SELECT');
      return false;
    case keyCode.UP:
      gameboy.keyup('UP');
      return false;
    case keyCode.DOWN:
      gameboy.keyup('DOWN');
      return false;
    case keyCode.LEFT:
      gameboy.keyup('LEFT');
      return false;
    case keyCode.RIGHT:
      gameboy.keyup('RIGHT');
      return false;
  }
};
