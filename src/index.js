import Gameboy from './gameboy';

function getROMFromUrl(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = (event) => {
      const arrayBuffer = request.response;
      if (arrayBuffer) {
        resolve(new Uint8Array(arrayBuffer));
      } else {
        reject();
      }
    };

    request.send(null);
  });
}

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

const gameboy = new Gameboy();

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

getROMFromUrl('./roms/tetris.gb').then((rom) => {
  gameboy.reset();
  gameboy.loadROM(rom);
  gameboy.run();
}, () => (console.log('loading ROM is failed')));

