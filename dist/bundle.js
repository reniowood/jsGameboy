/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _gameboy = __webpack_require__(1);

	var _gameboy2 = _interopRequireDefault(_gameboy);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getROMFromUrl(url) {
	  return new Promise(function (resolve, reject) {
	    var request = new XMLHttpRequest();
	    request.open('GET', url, true);
	    request.responseType = 'arraybuffer';
	    request.onload = function (event) {
	      var arrayBuffer = request.response;
	      if (arrayBuffer) {
	        resolve(new Uint8Array(arrayBuffer));
	      } else {
	        reject();
	      }
	    };

	    request.send(null);
	  });
	}

	var keyCode = {
	  B: 90,
	  A: 88,
	  START: 65,
	  SELECT: 83,
	  UP: 38,
	  DOWN: 40,
	  LEFT: 37,
	  RIGHT: 39
	};

	var gameboy = new _gameboy2.default();

	document.body.onkeydown = function (event) {
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

	document.body.onkeyup = function (event) {
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

	getROMFromUrl('./roms/tetris.gb').then(function (rom) {
	  gameboy.reset();
	  gameboy.loadROM(rom);
	  gameboy.run();
	}, function () {
	  return console.log('loading ROM is failed');
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _clock = __webpack_require__(2);

	var _clock2 = _interopRequireDefault(_clock);

	var _input = __webpack_require__(3);

	var _input2 = _interopRequireDefault(_input);

	var _interrupt = __webpack_require__(4);

	var _interrupt2 = _interopRequireDefault(_interrupt);

	var _gpu = __webpack_require__(5);

	var _gpu2 = _interopRequireDefault(_gpu);

	var _mmu = __webpack_require__(6);

	var _mmu2 = _interopRequireDefault(_mmu);

	var _cpu = __webpack_require__(7);

	var _cpu2 = _interopRequireDefault(_cpu);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Gameboy = function () {
	  function Gameboy() {
	    _classCallCheck(this, Gameboy);

	    this.input = new _input2.default();
	    this.interrupt = new _interrupt2.default();
	    this.clock = new _clock2.default(this.interrupt);
	    this.GPU = new _gpu2.default(this.clock, this.interrupt);
	    this.MMU = new _mmu2.default(this.clock, this.interrupt, this.GPU, this.input);
	    this.CPU = new _cpu2.default(this.clock, this.interrupt, this.MMU, this.GPU);

	    this.stop = undefined;
	  }

	  _createClass(Gameboy, [{
	    key: 'loadROM',
	    value: function loadROM(rom) {
	      this.MMU.loadROM(rom);
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      var _this = this;

	      return new Promise(function (resolve, reject) {
	        _this.stop = setInterval(function () {
	          _this.frame();
	        }, 1);

	        resolve(false);
	      });
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      if (this.stop) {
	        clearInterval(this.stop);
	      }
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
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
	  }, {
	    key: 'step',
	    value: function step() {
	      this.CPU.step();
	      this.GPU.step();

	      if (this.CPU.registers.PC() === 0x0100) {
	        this.MMU.isInBIOS = false;
	      }
	    }
	  }, {
	    key: 'frame',
	    value: function frame(breakPoint) {
	      var until = 70224;

	      do {
	        this.step();

	        until -= this.clock.lastInstCycles;
	      } while (until >= 0);

	      return false;
	    }
	  }, {
	    key: 'keydown',
	    value: function keydown(key) {
	      this.input.keydown(key);
	    }
	  }, {
	    key: 'keyup',
	    value: function keyup(key) {
	      this.input.keyup(key);
	    }
	  }]);

	  return Gameboy;
	}();

	exports.default = Gameboy;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Clock = function () {
	  function Clock(interrupt) {
	    _classCallCheck(this, Clock);

	    this.interrupt = interrupt;

	    this.reset();
	  }

	  _createClass(Clock, [{
	    key: "reset",
	    value: function reset() {
	      this.CYCLES_PER_SECOND = 4194304;
	      this.DIVIDER_SPEED = 16384;
	      this.COUNTER_SPEED = [4096, 262144, 65536, 16384];

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
	  }, {
	    key: "updateCycles",
	    value: function updateCycles(lastInstCycles) {
	      this.lastInstCycles = lastInstCycles;

	      this.dividerCycles += lastInstCycles;
	      var cyclesPerDivider = this.CYCLES_PER_SECOND / this.DIVIDER_SPEED;
	      if (this.dividerCycles >= cyclesPerDivider) {
	        this.divider += Math.floor(this.dividerCycles / cyclesPerDivider);
	        if (this.divider > 0xff) {
	          this.divider = this.divider - 0x100;
	        }
	        this.dividerCycles %= cyclesPerDivider;
	      }

	      if (this.control.runningTimer) {
	        this.counterCycles += lastInstCycles;
	        var cyclesPerCounter = this.CYCLES_PER_SECOND / this.control.counterSpeed;
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
	  }, {
	    key: "updateDivider",
	    value: function updateDivider(value) {
	      this.divider = 0;
	    }
	  }, {
	    key: "updateCounter",
	    value: function updateCounter(value) {
	      this.counter = value;
	    }
	  }, {
	    key: "updateModulo",
	    value: function updateModulo(value) {
	      this.modulo = value;
	    }
	  }, {
	    key: "updateControl",
	    value: function updateControl(value) {
	      this.control.counterSpeed = this.COUNTER_SPEED[value & 0x03];
	      this.control.runningTimer = value & 0x04 ? true : false;
	    }
	  }, {
	    key: "getControl",
	    value: function getControl() {
	      return this.COUNTER_SPEED.indexOf(this.control.counterSpeed) | (this.control.runningTimer ? 0x04 : 0x00);
	    }
	  }]);

	  return Clock;
	}();

	exports.default = Clock;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Input = function () {
	  function Input() {
	    _classCallCheck(this, Input);

	    this.column = 0;
	    this.p14 = 0x0f; // RIGHT, LEFT, UP, DOWN
	    this.p15 = 0x0f; // A, B, SELECT, START
	  }

	  _createClass(Input, [{
	    key: 'keydown',
	    value: function keydown(key) {
	      switch (key) {
	        case 'A':
	          this.p15 &= 0x0e;
	          break;
	        case 'B':
	          this.p15 &= 0x0d;
	          break;
	        case 'SELECT':
	          this.p15 &= 0x0b;
	          break;
	        case 'START':
	          this.p15 &= 0x07;
	          break;
	        case 'RIGHT':
	          this.p14 &= 0x0e;
	          break;
	        case 'LEFT':
	          this.p14 &= 0x0d;
	          break;
	        case 'UP':
	          this.p14 &= 0x0b;
	          break;
	        case 'DOWN':
	          this.p14 &= 0x07;
	          break;
	      }
	    }
	  }, {
	    key: 'keyup',
	    value: function keyup(key) {
	      switch (key) {
	        case 'A':
	          this.p15 |= 0x01;
	          break;
	        case 'B':
	          this.p15 |= 0x02;
	          break;
	        case 'SELECT':
	          this.p15 |= 0x04;
	          break;
	        case 'START':
	          this.p15 |= 0x08;
	          break;
	        case 'RIGHT':
	          this.p14 |= 0x01;
	          break;
	        case 'LEFT':
	          this.p14 |= 0x02;
	          break;
	        case 'UP':
	          this.p14 |= 0x04;
	          break;
	        case 'DOWN':
	          this.p14 |= 0x08;
	          break;
	      }
	    }
	  }, {
	    key: 'readByte',
	    value: function readByte() {
	      if (this.column === 0x01) {
	        return this.p15;
	      } else {
	        return this.p14;
	      }
	    }
	  }, {
	    key: 'writeByte',
	    value: function writeByte(value) {
	      this.column = value >> 4;
	    }
	  }]);

	  return Input;
	}();

	exports.default = Input;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Interrupt = function () {
	  function Interrupt() {
	    _classCallCheck(this, Interrupt);

	    this.reset();
	  }

	  _createClass(Interrupt, [{
	    key: "reset",
	    value: function reset() {
	      var _this = this;

	      this.interruptEnabled = {
	        VBlank: false,
	        LCDStatus: false,
	        timer: false,
	        serial: false,
	        input: false,
	        getByte: function getByte() {
	          return (_this.interruptEnabled.VBlank ? 0x01 : 0x00) | (_this.interruptEnabled.LCDStatus ? 0x02 : 0x00) | (_this.interruptEnabled.timer ? 0x04 : 0x00) | (_this.interruptEnabled.serial ? 0x08 : 0x00) | (_this.interruptEnabled.input ? 0x10 : 0x00);
	        },
	        setByte: function setByte(value) {
	          _this.interruptEnabled.VBlank = value & 0x01 ? true : false;
	          _this.interruptEnabled.LCDStatus = value & 0x02 ? true : false;
	          _this.interruptEnabled.timer = value & 0x04 ? true : false;
	          _this.interruptEnabled.serial = value & 0x08 ? true : false;
	          _this.interruptEnabled.input = value & 0x10 ? true : false;
	        }
	      };
	      this.interruptFlag = {
	        VBlank: false,
	        LCDStatus: false,
	        timer: false,
	        serial: false,
	        input: false,
	        getByte: function getByte() {
	          return (_this.interruptFlag.VBlank ? 0x01 : 0x00) | (_this.interruptFlag.LCDStatus ? 0x02 : 0x00) | (_this.interruptFlag.timer ? 0x04 : 0x00) | (_this.interruptFlag.serial ? 0x08 : 0x00) | (_this.interruptFlag.input ? 0x10 : 0x00);
	        },
	        setByte: function setByte(value) {
	          _this.interruptFlag.VBlank = value & 0x01 ? true : false;
	          _this.interruptFlag.LCDStatus = value & 0x02 ? true : false;
	          _this.interruptFlag.timer = value & 0x04 ? true : false;
	          _this.interruptFlag.serial = value & 0x08 ? true : false;
	          _this.interruptFlag.input = value & 0x10 ? true : false;
	        }
	      };
	    }
	  }, {
	    key: "getIE",
	    value: function getIE() {
	      return this.interruptEnabled.getByte();
	    }
	  }, {
	    key: "getIF",
	    value: function getIF() {
	      return this.interruptFlag.getByte();
	    }
	  }, {
	    key: "setIE",
	    value: function setIE(value) {
	      return this.interruptEnabled.setByte(value);
	    }
	  }, {
	    key: "setIF",
	    value: function setIF(value) {
	      return this.interruptFlag.setByte(value);
	    }
	  }]);

	  return Interrupt;
	}();

	exports.default = Interrupt;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GPU = function () {
	  function GPU(clock, interrupt) {
	    _classCallCheck(this, GPU);

	    this.clock = clock;
	    this.interrupt = interrupt;

	    this.reset();
	  }

	  _createClass(GPU, [{
	    key: 'reset',
	    value: function reset() {
	      var canvas = document.getElementById('screen');

	      this.canvas = canvas.getContext('2d');
	      this.screen = this.canvas.createImageData(160, 144);

	      for (var i = 0; i < 160 * 144 * 4; i += 1) {
	        this.screen.data[i] = 0xff;
	      }

	      this.canvas.putImageData(this.screen, 0, 0);

	      this.cycles = 0;
	      this.line = 0;
	      this.lineCompare = 0;

	      this.videoRAM = [];
	      for (var _i = 0; _i < 8192; _i += 1) {
	        this.videoRAM.push(0);
	      }

	      this.tiles = [];
	      for (var _i2 = 0; _i2 < 384; _i2 += 1) {
	        this.tiles.push([]);
	        for (var j = 0; j < 8; j += 1) {
	          this.tiles[_i2].push([0, 0, 0, 0, 0, 0, 0, 0]);
	        }
	      }

	      this.palette = [[255, 255, 255, 255], [0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]];
	      this.objectPalette = [[[255, 255, 255, 255], [0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]], [[255, 255, 255, 255], [0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]]];

	      // Sprites
	      this.OAM = [];
	      for (var _i3 = 0; _i3 < 160; _i3 += 1) {
	        this.OAM.push(0);
	      }
	      this.sprites = [];
	      for (var _i4 = 0; _i4 < 40; _i4 += 1) {
	        this.sprites.push({
	          y: -16,
	          x: -8,
	          tile: 0,
	          palette: 0,
	          xFlip: false,
	          yFlip: false,
	          aboveBackground: 0
	        });
	      }

	      // LCDC
	      this.screenX = 0;
	      this.screenY = 0;
	      this.isBackgroundOn = true;
	      this.isSpritesOn = false;
	      this.spriteHeight = 8;
	      this.bgTileMap = 0;
	      this.bgTileSet = 0;
	      this.isWindowOn = false;
	      this.windowTileMap = 0;
	      this.isDisplayOn = true;

	      // STAT
	      this.MODE = {
	        HBLANK: 0,
	        VBLANK: 1,
	        SCANLINE_OAM: 2,
	        SCANLINE_VRAM: 3
	      };
	      this.mode = this.MODE.HBLANK;
	      this.coincidenceFlag = false;
	      this.HBlankInterrupt = false;
	      this.VBlankInterrupt = false;
	      this.OAMInterrupt = false;
	      this.lineCompareInterrupt = false;

	      this.registers = [];
	      for (var _i5 = 0; _i5 < 12; _i5 += 1) {
	        this.registers.push(0);
	      }
	      this.registers[0xff47 - 0xff40] = 0xfc; // bgp
	      this.registers[0xff47 - 0xff40] = 0xfc; // bgp
	      this.registers[0xff48 - 0xff40] = 0xff; // obp0
	      this.registers[0xff49 - 0xff40] = 0xff; // obp1
	      this.registers[0xff4a - 0xff40] = 0x00; // wy
	      this.registers[0xff4b - 0xff40] = 0x00; // wx
	    }
	  }, {
	    key: 'signed',
	    value: function signed(n) {
	      if (n & 0x80) {
	        n = -(~n + 1 & 0xff);
	      }

	      return n;
	    }
	  }, {
	    key: 'step',
	    value: function step() {
	      this.cycles += this.clock.lastInstCycles;

	      switch (this.mode) {
	        case this.MODE.HBLANK:
	          if (this.cycles >= 204) {
	            if (this.HBlankInterrupt) {
	              this.interrupt.interruptFlag.LCDStatus = true;
	            }

	            if (this.line === 144) {
	              if (this.VBlankInterrupt) {
	                this.interrupt.interruptFlag.LCDStatus = true;
	              }
	              this.interrupt.interruptFlag.VBlank = true;

	              this.canvas.putImageData(this.screen, 0, 0);

	              this.mode = this.MODE.VBLANK;
	            } else {
	              this.mode = this.MODE.SCANLINE_OAM;
	            }

	            this.cycles = 0;
	          }

	          break;
	        case this.MODE.SCANLINE_OAM:
	          if (this.cycles >= 80) {
	            this.mode = this.MODE.SCANLINE_VRAM;

	            if (this.OAMInterrupt) {
	              this.interrupt.interruptFlag.LCDStatus = true;
	            }

	            this.cycles = 0;
	          }

	          break;
	        case this.MODE.SCANLINE_VRAM:
	          if (this.cycles >= 172) {
	            this.mode = this.MODE.HBLANK;

	            this.coincidenceFlag = this.line === this.lineCompare;
	            if (this.lineCompareInterrupt) {
	              this.interrupt.interruptFlag.LCDStatus = true;
	            }

	            this.render();

	            this.line += 1;
	            this.cycles = 0;
	          }

	          break;
	        case this.MODE.VBLANK:
	          if (this.cycles >= 456) {
	            this.line += 1;

	            if (this.line === 154) {
	              this.mode = this.MODE.HBLANK;

	              this.line = 0;
	            }

	            this.cycles = 0;
	          }

	          break;
	      }
	    }
	  }, {
	    key: 'updateSprite',
	    value: function updateSprite(addr, value) {
	      var sprite = addr - 0xfe00 >> 2;
	      var index = addr - 0xfe00 & 0x03;

	      switch (index) {
	        case 0:
	          this.sprites[sprite].y = value - 16;
	          break;
	        case 1:
	          this.sprites[sprite].x = value - 8;
	          break;
	        case 2:
	          this.sprites[sprite].tile = value;
	          break;
	        case 3:
	          this.sprites[sprite].palette = value & 0x10 ? 1 : 0;
	          this.sprites[sprite].xFlip = value & 0x20 ? true : false;
	          this.sprites[sprite].yFlip = value & 0x40 ? true : false;
	          this.sprites[sprite].aboveBackground = value & 0x80 ? false : true;
	          break;
	      }
	    }
	  }, {
	    key: 'updateTile',
	    value: function updateTile(addr, value) {
	      var baseAddr = addr & 0x1ffe; // two bytes needed to represent a 1x8 line
	      var tileIndex = baseAddr >> 4 & 0x1ff;

	      var y = baseAddr >> 1 & 0x07;
	      for (var x = 0; x < 8; x += 1) {
	        this.tiles[tileIndex][y][7 - x] = this.videoRAM[baseAddr] >> x & 0x01 | (this.videoRAM[baseAddr + 1] >> x & 0x01) << 1;
	      }
	    }
	  }, {
	    key: 'updatePalette',
	    value: function updatePalette(palette, value) {
	      for (var i = 0; i < 4; i += 1) {
	        switch (value >> i * 2 & 0x03) {
	          case 0:
	            palette[i] = [255, 255, 255, 255];

	            break;
	          case 1:
	            palette[i] = [192, 192, 192, 255];

	            break;
	          case 2:
	            palette[i] = [96, 96, 96, 255];

	            break;
	          case 3:
	            palette[i] = [0, 0, 0, 255];

	            break;
	        }
	      }

	      return value;
	    }
	  }, {
	    key: 'renderBackground',
	    value: function renderBackground() {
	      var renderedBackgroundRow = new Array(160).fill({
	        color: 0,
	        palette: this.palette
	      });

	      var tileMapBase = this.bgTileMap === 0 ? 0x1800 : 0x1c00;
	      var tileMapX = this.screenX >> 3;
	      var tileMapY = (this.screenY + this.line & 0xff) >> 3;
	      var xInTile = this.screenX & 0x07;
	      var yInTile = this.screenY + this.line & 0x07;

	      var tileBase = tileMapBase + tileMapY * 32;
	      var tileOffset = tileMapX;
	      var x = xInTile;
	      for (var i = 0; i < 160; i += 1) {
	        var tileIndex = this.videoRAM[tileBase + tileOffset];
	        var tile = this.bgTileSet === 0 ? 256 + this.signed(tileIndex) : tileIndex;

	        renderedBackgroundRow[i] = {
	          color: this.tiles[tile][yInTile][x],
	          palette: this.palette
	        };

	        x = (x + 1) % 8;
	        if (x === 0) {
	          tileOffset = tileOffset + 1 & 0x1f;
	        }
	      }

	      return renderedBackgroundRow;
	    }
	  }, {
	    key: 'renderWindow',
	    value: function renderWindow(renderedBackgroundRow) {
	      var windowX = this.registers[0xff4b - 0xff40];
	      var windowY = this.registers[0xff4a - 0xff40];

	      if (windowX < 0 || windowX > 166 || windowY < 0 || windowY > 143) {
	        return renderedBackgroundRow;
	      }

	      if (this.line >= windowY) {
	        var tileMapBase = this.windowTileMap === 0 ? 0x1800 : 0x1c00;
	        var tileMapX = 0;
	        var tileMapY = (this.line - windowY & 0xff) >> 3;
	        var xInTile = 0;
	        var yInTile = this.line - windowY & 0x07;

	        var tileBase = tileMapBase + tileMapY * 32;
	        var tileOffset = tileMapX;
	        var x = xInTile;
	        for (var i = windowX - 7; i < 160; i += 1) {
	          var tileIndex = this.videoRAM[tileBase + tileOffset];
	          var tile = this.bgTileSet === 0 ? 256 + this.signed(tileIndex) : tileIndex;

	          renderedBackgroundRow[i] = {
	            color: this.tiles[tile][yInTile][x],
	            palette: this.palette
	          };

	          x = (x + 1) % 8;
	          if (x === 0) {
	            tileOffset += 1;
	          }
	        }
	        // console.log(this.line, windowY, this.line - windowY, renderedBackgroundRow.map((pixel) => (pixel.color)));
	      }

	      return renderedBackgroundRow;
	    }
	  }, {
	    key: 'renderSprites',
	    value: function renderSprites(renderedBackgroundRow) {
	      var _this = this;

	      var renderedSpritesRow = new Array(160).fill({
	        color: -1,
	        palette: this.palette
	      });

	      var filteredSprites = this.sprites.filter(function (sprite) {
	        return sprite.x >= 0 && sprite.x < 160 && _this.line >= sprite.y && _this.line < sprite.y + _this.spriteHeight;
	      });
	      var orderedSprites = filteredSprites.sort(function (a, b) {
	        if (a.x > b.x) {
	          return -1;
	        } else if (a.x < b.x) {
	          return 1;
	        } else {
	          var indexA = _this.sprites.indexOf(a);
	          var indexB = _this.sprites.indexOf(b);

	          if (indexA > indexB) {
	            return -1;
	          } else if (indexA < indexB) {
	            return 1;
	          } else {
	            return 0;
	          }
	        }

	        return 0;
	      });
	      var sprites = orderedSprites.slice(Math.max(orderedSprites.length - 10, 0));

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = sprites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var sprite = _step.value;

	          var tile = void 0,
	              height = void 0;
	          if (this.spriteHeight === 16) {
	            if (this.line - sprite.y >= 8) {
	              tile = sprite.tile - sprite.tile % 2 + 1;
	              height = 16;
	            } else {
	              tile = sprite.tile - sprite.tile % 2;
	              height = 8;
	            }
	          } else {
	            tile = sprite.tile;
	            height = 8;
	          }

	          var row = void 0;
	          if (sprite.yFlip) {
	            row = this.tiles[tile][height - (this.line - sprite.y) - 1];
	          } else {
	            row = this.tiles[tile][this.line - sprite.y + 8 - height];
	          }

	          for (var x = 0; x < 8; x += 1) {
	            var pixel = void 0;
	            if (sprite.xFlip) {
	              pixel = row[8 - x - 1];
	            } else {
	              pixel = row[x];
	            }

	            if (pixel !== 0 && (sprite.aboveBackground || renderedBackgroundRow[sprite.x + x].color === 0)) {
	              renderedSpritesRow[sprite.x + x] = {
	                color: pixel,
	                palette: this.objectPalette[sprite.palette]
	              };
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return renderedSpritesRow;
	    }
	  }, {
	    key: 'renderRow',
	    value: function renderRow(renderedRow) {
	      var canvasOffset = this.line * 160 * 4;
	      for (var i = 0; i < 160; i += 1) {
	        if (renderedRow[i].color !== -1) {
	          var color = renderedRow[i].palette[renderedRow[i].color];

	          this.screen.data[canvasOffset + i * 4] = color[0];
	          this.screen.data[canvasOffset + i * 4 + 1] = color[1];
	          this.screen.data[canvasOffset + i * 4 + 2] = color[2];
	          this.screen.data[canvasOffset + i * 4 + 3] = color[3];
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var renderedBackgroundRow = new Array(160).fill({
	        color: 0,
	        palette: this.palette
	      });

	      if (this.isBackgroundOn) {
	        renderedBackgroundRow = this.renderBackground();

	        this.renderRow(renderedBackgroundRow);
	      }

	      if (this.isWindowOn) {
	        renderedBackgroundRow = this.renderWindow(renderedBackgroundRow);

	        this.renderRow(renderedBackgroundRow);
	      }

	      if (this.isSpritesOn) {
	        var renderedSpritesRow = this.renderSprites(renderedBackgroundRow);

	        this.renderRow(renderedSpritesRow);
	      }
	    }
	  }, {
	    key: 'readByte',
	    value: function readByte(addr) {
	      switch (addr & 0x00ff) {
	        case 0x40:
	          // LCD and GPU control
	          return (this.isBackgroundOn ? 0x01 : 0x00) | (this.isSpritesOn ? 0x02 : 0x00) | (this.spriteHeight === 16 ? 0x04 : 0x00) | (this.bgTileMap === 1 ? 0x08 : 0x00) | (this.bgTileSet === 1 ? 0x10 : 0x00) | (this.isWindowOn ? 0x20 : 0x00) | (this.windowTileMap === 1 ? 0x40 : 0x00) | (this.isDisplayOn ? 0x80 : 0x00);
	        case 0x41:
	          // STAT
	          return this.mode | (this.coincidenceFlag ? 0x04 : 0x00) | (this.HBlankInterrupt ? 0x08 : 0x00) | (this.VBlankInterrupt ? 0x10 : 0x00) | (this.OAMInterrupt ? 0x20 : 0x00) | (this.lineCompareInterrupt ? 0x40 : 0x00);
	        case 0x42:
	          // Scroll-Y
	          return this.screenY;
	        case 0x43:
	          // Scroll-X
	          return this.screenX;
	        case 0x44:
	          // Current scan line
	          return this.line;
	        case 0x45:
	          // LYC
	          return this.lineCompare;
	        default:
	          return this.registers[addr - 0xff40];
	      }
	    }
	  }, {
	    key: 'writeByte',
	    value: function writeByte(addr, value) {
	      this.registers[addr - 0xff40] = value;

	      switch (addr & 0x00ff) {
	        case 0x40:
	          // LCD and GPU control
	          this.isBackgroundOn = value & 0x01 ? true : false;
	          this.isSpritesOn = value & 0x02 ? true : false;
	          this.spriteHeight = value & 0x04 ? 16 : 8;
	          this.bgTileMap = value & 0x08 ? 1 : 0;
	          this.bgTileSet = value & 0x10 ? 1 : 0;
	          this.isWindowOn = value & 0x20 ? true : false;
	          this.windowTileMap = value & 0x40 ? 1 : 0;
	          this.isDisplayOn = value & 0x80 ? true : false;

	          return value;
	        case 0x41:
	          // STAT
	          this.mode = value & 0x03;
	          this.coincidenceFlag = value & 0x04 ? true : false;
	          this.HBlankInterrupt = value & 0x08 ? true : false;
	          this.VBlankInterrupt = value & 0x10 ? true : false;
	          this.OAMInterrupt = value & 0x20 ? true : false;
	          this.lineCompareInterrupt = value & 0x40 ? true : false;

	          this.cycles = 0;

	          break;
	        case 0x42:
	          // Scroll-Y
	          return this.screenY = value;
	        case 0x43:
	          // Scroll-X
	          return this.screenX = value;
	        case 0x45:
	          return this.lineCompare = value;
	        case 0x47:
	          // Background Palette
	          this.registers[addr - 0xff40] = value;
	          return this.updatePalette(this.palette, value);
	        case 0x48:
	          // Object Palette 0
	          this.registers[addr - 0xff40] = value;
	          return this.updatePalette(this.objectPalette[0], value);
	        case 0x49:
	          // Object Palette 1
	          this.registers[addr - 0xff40] = value;
	          return this.updatePalette(this.objectPalette[1], value);
	        case 0x4a: // Window Y
	        case 0x4b:
	          // Window X
	          return this.registers[addr - 0xff40] = value;
	      }
	    }
	  }]);

	  return GPU;
	}();

	exports.default = GPU;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MMU = function () {
	  function MMU(clock, interrupt, GPU, input) {
	    _classCallCheck(this, MMU);

	    this.clock = clock;
	    this.interrupt = interrupt;
	    this.GPU = GPU;
	    this.input = input;

	    this.ROM = []; // 0x0000 - 0x3fff (bank 0) / 0x4000 - 0x7fff (other banks)
	    this.reset();
	  }

	  _createClass(MMU, [{
	    key: "reset",
	    value: function reset() {
	      this.BIOS = [0x31, 0xFE, 0xFF, 0xAF, 0x21, 0xFF, 0x9F, 0x32, 0xCB, 0x7C, 0x20, 0xFB, 0x21, 0x26, 0xFF, 0x0E, 0x11, 0x3E, 0x80, 0x32, 0xE2, 0x0C, 0x3E, 0xF3, 0xE2, 0x32, 0x3E, 0x77, 0x77, 0x3E, 0xFC, 0xE0, 0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1A, 0xCD, 0x95, 0x00, 0xCD, 0x96, 0x00, 0x13, 0x7B, 0xFE, 0x34, 0x20, 0xF3, 0x11, 0xD8, 0x00, 0x06, 0x08, 0x1A, 0x13, 0x22, 0x23, 0x05, 0x20, 0xF9, 0x3E, 0x19, 0xEA, 0x10, 0x99, 0x21, 0x2F, 0x99, 0x0E, 0x0C, 0x3D, 0x28, 0x08, 0x32, 0x0D, 0x20, 0xF9, 0x2E, 0x0F, 0x18, 0xF3, 0x67, 0x3E, 0x64, 0x57, 0xE0, 0x42, 0x3E, 0x91, 0xE0, 0x40, 0x04, 0x1E, 0x02, 0x0E, 0x0C, 0xF0, 0x44, 0xFE, 0x90, 0x20, 0xFA, 0x0D, 0x20, 0xF7, 0x1D, 0x20, 0xF2, 0x0E, 0x13, 0x24, 0x7C, 0x1E, 0x83, 0xFE, 0x62, 0x28, 0x06, 0x1E, 0xC1, 0xFE, 0x64, 0x20, 0x06, 0x7B, 0xE2, 0x0C, 0x3E, 0x87, 0xF2, 0xF0, 0x42, 0x90, 0xE0, 0x42, 0x15, 0x20, 0xD2, 0x05, 0x20, 0x4F, 0x16, 0x20, 0x18, 0xCB, 0x4F, 0x06, 0x04, 0xC5, 0xCB, 0x11, 0x17, 0xC1, 0xCB, 0x11, 0x17, 0x05, 0x20, 0xF5, 0x22, 0x23, 0x22, 0x23, 0xC9, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x3c, 0x42, 0xB9, 0xA5, 0xB9, 0xA5, 0x42, 0x4C, 0x21, 0x04, 0x01, 0x11, 0xA8, 0x00, 0x1A, 0x13, 0xBE, 0x20, 0xFE, 0x23, 0x7D, 0xFE, 0x34, 0x20, 0xF5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xFB, 0x86, 0x20, 0xFE, 0x3E, 0x01, 0xE0, 0x50]; // 0x0000 - 0x00ff
	      // Video RAM: 0x8000 - 0x9fff

	      this.MBC_TYPE = {
	        0x00: "ROM_ONLY",
	        0x01: "ROM_MBC1",
	        0x02: "ROM_MBC1_RAM",
	        0x03: "ROM_MBC1_RAM_BAT",
	        0x05: "ROM_MBC2",
	        0x06: "ROM_MBC2_BAT",
	        0x11: "ROM_MBC3",
	        0x12: "ROM_MBC3_RAM",
	        0x13: "ROM_MBC3_RAM_BAT",
	        0x19: "ROM_MBC5",
	        0x1a: "ROM_MBC5_RAM",
	        0x1b: "ROM_MBC5_RAM_BAT"
	      };
	      this.MBC = this.MBC_TYPE[0x00];
	      this.NUM_ROM_BANKS_TYPE = {
	        0: 2,
	        1: 4,
	        2: 8,
	        3: 16,
	        4: 32,
	        5: 64,
	        6: 128,
	        0x52: 72,
	        0x53: 80,
	        0x54: 96
	      };
	      this.NUM_ROM_BANKS = this.NUM_ROM_BANKS_TYPE[0];
	      this.RAM_SIZE = {
	        0: 0,
	        1: 2048,
	        2: 8196,
	        3: 32768,
	        4: 131072
	      };
	      this.NUM_RAM_BANKS_TYPE = {
	        0: 0,
	        1: 1,
	        2: 1,
	        3: 4,
	        4: 16
	      };
	      this.NUM_RAM_BANKS = this.NUM_RAM_BANKS_TYPE[0];
	      this.currentROMBank = 1;
	      this.currentRAMBank = 0;

	      this.cartridgeRAM = []; // 0xa000 - 0xbfff
	      this.workingRAM = []; // 0xc000 - 0xdfff / 0xe000 - 0xfdff (shadow)
	      for (var i = 0; i < 8192; i += 1) {
	        this.workingRAM.push(0);
	      }
	      // Sprite Attribute Memory (OAM): 0xfe00 - 0xfea0
	      // Memory-mapped I/O: 0xff00 - 0xff7f
	      this.zeroPageRAM = []; // 0xff80 - 0xffff
	      for (var _i = 0; _i < 128; _i += 1) {
	        this.zeroPageRAM.push(0);
	      }

	      this.isRAMEnabled = false;
	      this.BANKING_MODE = {
	        ROM: 0x00,
	        RAM: 0x01
	      };
	      this.bankingMode = this.BANKING_MODE.ROM;
	    }
	  }, {
	    key: "loadROM",
	    value: function loadROM(rom) {
	      this.ROM = rom;
	      this.MBC = this.MBC_TYPE[rom[0x0147]];
	      this.NUM_ROM_BANKS = this.NUM_ROM_BANKS_TYPE[rom[0x0148]];
	      this.NUM_RAM_BANKS = this.NUM_RAM_BANKS_TYPE[rom[0x0149]];

	      var RAMSize = this.MBC.startsWith("ROM_MBC2") ? 512 : this.RAM_SIZE[rom[0x0149]];
	      for (var i = 0; i < RAMSize; i += 1) {
	        this.cartridgeRAM.push(0);
	      }
	    }
	  }, {
	    key: "readByte",
	    value: function readByte(addr) {
	      switch (addr & 0xf000) {
	        case 0x0000:
	        case 0x1000:
	        case 0x2000:
	        case 0x3000:
	          return this.ROM[addr];
	        case 0x4000:
	        case 0x5000:
	        case 0x6000:
	        case 0x7000:
	          return this.ROM[(this.currentROMBank - 1) * 0x4000 + addr];
	        case 0x8000:
	        case 0x9000:
	          return this.GPU.videoRAM[addr & 0x1fff];
	        case 0xa000:
	          if (this.MBC.startsWith("ROM_MBC2")) {
	            return this.cartridgeRAM[addr & 0x1fff] & 0x0f;
	          }
	        case 0xb000:
	          if (!this.MBC.startsWith("ROM_MBC2")) {
	            return this.cartridgeRAM[this.currentRAMBank * 0x4000 + (addr & 0x1fff)];
	          }

	          break;
	        case 0xc000:
	        case 0xd000:
	          return this.workingRAM[addr & 0x1fff];
	        case 0xe000:
	          return this.workingRAM[addr & 0x1fff];
	        case 0xf000:
	          switch (addr & 0x0f00) {
	            case 0x0000:
	            case 0x0100:
	            case 0x0200:
	            case 0x0300:
	            case 0x0400:
	            case 0x0500:
	            case 0x0600:
	            case 0x0700:
	            case 0x0800:
	            case 0x0900:
	            case 0x0a00:
	            case 0x0b00:
	            case 0x0c00:
	            case 0x0d00:
	              return this.workingRAM[addr & 0x1fff];
	            case 0x0e00:
	              if (addr < 0xfea0) {
	                return this.GPU.OAM[addr & 0xff];
	              }

	              return 0;
	            case 0x0f00:
	              if (addr === 0xffff) {
	                return this.interrupt.getIE();
	              }
	              if (addr >= 0xff80) {
	                return this.zeroPageRAM[addr & 0x7f];
	              }

	              if (addr === 0xff00) {
	                return this.input.readByte();
	              } else if (addr === 0xff04) {
	                return this.clock.divider;
	              } else if (addr === 0xff05) {
	                return this.clock.counter;
	              } else if (addr === 0xff06) {
	                return this.clock.modulo;
	              } else if (addr === 0xff07) {
	                return this.clock.getControl();
	              } else if (addr === 0xff0f) {
	                return this.interrupt.getIF();
	              } else {
	                switch (addr & 0x00f0) {
	                  case 0x40:
	                  case 0x50:
	                  case 0x60:
	                  case 0x70:
	                    return this.GPU.readByte(addr);
	                }
	              }

	              return 0;
	          }
	      }
	    }
	  }, {
	    key: "writeByte",
	    value: function writeByte(addr, value) {
	      switch (addr & 0xf000) {
	        case 0x0000:
	        case 0x1000:
	          if (this.MBC.startsWith("ROM_MBC1") || this.MBC.startsWith("ROM_MBC3") || this.MBC.startsWith("ROM_MBC5")) {
	            if (value & 0x0f === 0x0a) {
	              this.isRAMEnabled = true;
	            } else {
	              this.isRAMEnabled = false;
	            }
	          } else if (this.MBC.startsWith("ROM_MBC2")) {
	            if ((addr & 0xf0) >> 4 === 0) {
	              if (value & 0x0f === 0x0a) {
	                this.isRAMEnabled = true;
	              } else {
	                this.isRAMEnabled = false;
	              }
	            }
	          }

	          break;
	        case 0x2000:
	          if (this.MBC.startsWith("ROM_MBC5")) {
	            this.currentROMBank &= 0x0100;
	            this.currentROMBank |= value;
	          }
	        case 0x3000:
	          if (this.MBC.startsWith("ROM_MBC1")) {
	            var lower5Bits = value & 0x1f;
	            var ROMBank = lower5Bits % 0x20 === 0 ? lower5Bits + 1 : lower5Bits;

	            this.currentROMBank &= 0xe0;
	            this.currentROMBank |= ROMBank;
	          } else if (this.MBC.startsWith("ROM_MBC2")) {
	            if ((addr & 0xf0) >> 4 === 1) {
	              this.currentROMBank = value & 0x0f;
	            }
	          } else if (this.MBC.startsWith("ROM_MBC3")) {
	            this.currentROMBank = (value & 0x7f) === 0 ? 1 : value & 0x7f;
	          } else if (this.MBC.startsWith("ROM_MBC5")) {
	            this.currentROMBank &= 0x00ff;
	            this.currentROMBank |= (value & 0x01) << 8;
	          }

	          break;
	        case 0x4000:
	        case 0x5000:
	          if (this.MBC.startsWith("ROM_MBC1")) {
	            if (this.bankingMode === this.BANKING_MODE.ROM) {
	              this.currentROMBank &= 0x9f;
	              this.currentROMBank |= (value & 0x03) << 5;
	            } else {
	              this.currentRAMBank = value & 0x03;
	            }
	          } else if (this.MBC.startsWith("ROM_MBC3")) {
	            this.currentRAMBank = value & 0x03;
	          } else if (this.MBC.startsWith("ROM_MBC5")) {
	            this.currentRAMBank = value & 0x0f;
	          }

	          break;
	        case 0x6000:
	        case 0x7000:
	          if (this.MBC.startsWith("ROM_MBC1")) {
	            if (value & 0x03 === 0x00) {
	              this.bankingMode = this.BANKING_MODE.ROM;
	            } else if (value & 0x01 === 0x01) {
	              this.bankingMode = this.BANKING_MODE.RAM;
	            }
	          }

	          break;
	        case 0x8000:
	        case 0x9000:
	          this.GPU.videoRAM[addr & 0x1fff] = value;
	          if (addr < 0x9800) {
	            this.GPU.updateTile(addr, value);
	          }

	          return this.GPU.videoRAM[addr & 0x1fff];
	        case 0xa000:
	          if (this.MBC.startsWith("ROM_MBC2")) {
	            return this.cartridgeRAM[addr & 0x1fff] = value & 0x0f;
	          }
	        case 0xb000:
	          if (!this.MBC.startsWith("ROM_MBC2")) {
	            return this.cartridgeRAM[this.currentRAMBank * 0x4000 + (addr & 0x1fff)] = value;
	          }

	          break;
	        case 0xc000:
	        case 0xd000:
	          return this.workingRAM[addr & 0x1fff] = value;
	        case 0xe000:
	          return this.workingRAM[addr & 0x1fff] = value;
	        case 0xf000:
	          switch (addr & 0x0f00) {
	            case 0x0000:
	            case 0x0100:
	            case 0x0200:
	            case 0x0300:
	            case 0x0400:
	            case 0x0500:
	            case 0x0600:
	            case 0x0700:
	            case 0x0800:
	            case 0x0900:
	            case 0x0a00:
	            case 0x0b00:
	            case 0x0c00:
	            case 0x0d00:
	              return this.workingRAM[addr & 0x1fff] = value;
	            case 0x0e00:
	              if (addr < 0xfea0) {
	                this.GPU.OAM[addr & 0xff] = value;
	                this.GPU.updateSprite(addr, value);

	                return this.GPU.OAM[addr & 0xff];
	              }

	              return 0;
	            case 0x0f00:
	              if (addr === 0xffff) {
	                return this.interrupt.setIE(value);
	              }
	              if (addr >= 0xff80) {
	                return this.zeroPageRAM[addr & 0x7f] = value;
	              }

	              if (addr === 0xff00) {
	                return this.input.writeByte(value);
	              } else if (addr === 0xff04) {
	                return this.clock.updateDivider(value);
	              } else if (addr === 0xff05) {
	                return this.clock.updateCounter(value);
	              } else if (addr === 0xff06) {
	                return this.clock.updateModulo(value);
	              } else if (addr === 0xff07) {
	                return this.clock.updateControl(value);
	              } else if (addr === 0xff0f) {
	                // IF
	                return this.interrupt.setIF(value);
	              } else if (addr === 0xff46) {
	                // DMA
	                var base = 0xfe00;
	                for (var i = 0; i < 0xa0; i += 1) {
	                  var val = this.readByte((value << 8) + i);

	                  this.GPU.OAM[i] = val;
	                  this.GPU.updateSprite(base + i, val);
	                }
	              } else {
	                switch (addr & 0x00f0) {
	                  case 0x40:
	                  case 0x50:
	                  case 0x60:
	                  case 0x70:
	                    return this.GPU.writeByte(addr, value);
	                }
	              }

	              return 0;
	          }
	      }
	    }
	  }, {
	    key: "readWord",
	    value: function readWord(addr) {
	      return this.readByte(addr + 1) << 8 | this.readByte(addr);
	    }
	  }, {
	    key: "writeWord",
	    value: function writeWord(addr, value) {
	      this.writeByte(addr, value & 0xff);
	      this.writeByte(addr + 1, value >> 8 & 0xff);
	    }
	  }]);

	  return MMU;
	}();

	exports.default = MMU;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CPU = function () {
	  function CPU(clock, interrupt, MMU, GPU) {
	    _classCallCheck(this, CPU);

	    this.clock = clock;
	    this.interrupt = interrupt;
	    this.MMU = MMU;
	    this.GPU = GPU;

	    this.reset();
	    this.updateInstMap();
	  }

	  _createClass(CPU, [{
	    key: 'updateInstMap',
	    value: function updateInstMap() {
	      var _this = this;

	      this.instMap = [function () {
	        _this.NOP();_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_n_nn(_this.registers.BC, _this.MMU.readWord(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 2);
	        _this.updateCycles(3, 12);
	      }, function () {
	        _this.LD_n_A(function (value) {
	          return _this.MMU.writeByte(_this.registers.BC(), value);
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_nn(_this.registers.BC);_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_n(_this.registers.B(), _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.DEC_n(_this.registers.B(), _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_n(_this.registers.B, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RLCA();_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_SP(_this.MMU.readWord(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 2);
	        _this.updateCycles(3, 20);
	      }, function () {
	        _this.ADD_HLn(_this.registers.BC);_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_A_n(function () {
	          return _this.MMU.readByte(_this.registers.BC());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.DEC_nn(_this.registers.BC);_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_n(_this.registers.C(), _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.DEC_n(_this.registers.C(), _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_n(_this.registers.C, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RRCA();_this.updateCycles(1, 4);
	      }, function () {
	        _this.STOP();_this.updateCycles(0, 0);
	      }, function () {
	        _this.LD_n_nn(_this.registers.DE, _this.MMU.readWord(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 2);
	        _this.updateCycles(3, 12);
	      }, function () {
	        _this.LD_n_A(function (value) {
	          return _this.MMU.writeByte(_this.registers.DE(), value);
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_nn(_this.registers.DE);_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_n(_this.registers.D(), _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.DEC_n(_this.registers.D(), _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_n(_this.registers.D, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RLA();_this.updateCycles(1, 4);
	      }, function () {
	        _this.JR_n(_this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 12);
	      }, function () {
	        _this.ADD_HLn(_this.registers.DE);_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_A_n(function () {
	          return _this.MMU.readByte(_this.registers.DE());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.DEC_nn(_this.registers.DE);_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_n(_this.registers.E(), _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.DEC_n(_this.registers.E(), _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_n(_this.registers.E, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RRA();_this.updateCycles(1, 4);
	      }, function () {
	        var isActionTaken = _this.JR_cc_n('NZ', _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, isActionTaken ? 12 : 8);
	      }, function () {
	        _this.LD_n_nn(_this.registers.HL, _this.MMU.readWord(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 2);
	        _this.updateCycles(3, 12);
	      }, function () {
	        // LD (HL+), A = LDI (HL), A = LD (HL), A - INC_nn HL
	        _this.LD_n_A(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.INC_nn(_this.registers.HL);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_nn(_this.registers.HL);_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_n(_this.registers.H(), _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.DEC_n(_this.registers.H(), _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_n(_this.registers.H, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.DAA();_this.updateCycles(1, 4);
	      }, function () {
	        var isActionTaken = _this.JR_cc_n('Z', _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(1, isActionTaken ? 12 : 8);
	      }, function () {
	        _this.ADD_HLn(_this.registers.HL);_this.updateCycles(1, 8);
	      }, function () {
	        // LD A, (HL+) = LDI A, (HL) = LD A, (HL) - INC_nn HL
	        _this.LD_A_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });
	        _this.INC_nn(_this.registers.HL);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.DEC_nn(_this.registers.HL);_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_n(_this.registers.L(), _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.DEC_n(_this.registers.L(), _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_n(_this.registers.L, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.CPL();_this.updateCycles(1, 4);
	      }, function () {
	        var isActionTaken = _this.JR_cc_n('NC', _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(1, isActionTaken ? 12 : 8);
	      }, function () {
	        _this.LD_n_nn(_this.registers.SP, _this.MMU.readWord(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 2);
	        _this.updateCycles(3, 12);
	      }, function () {
	        // LD (HL-), A = LDD (HL), A = LD (HL), A - DEC_nn HL
	        _this.LD_n_A(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.DEC_nn(_this.registers.HL);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_nn(_this.registers.SP);_this.updateCycles(2, 8);
	      }, function () {
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.INC_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.DEC_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        _this.LD_nn_n(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        }, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.SCF();_this.updateCycles(1, 4);
	      }, function () {
	        var isActionTaken = _this.JR_cc_n('C', _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(1, isActionTaken ? 12 : 8);
	      }, function () {
	        _this.ADD_HLn(_this.registers.SP);_this.updateCycles(1, 8);
	      }, function () {
	        // LD A, (HL-) = LDD A, (HL) = LD A, (HL) - DEC_nn HL
	        _this.LD_A_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });
	        _this.DEC_nn(_this.registers.HL);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.DEC_nn(_this.registers.SP);_this.updateCycles(1, 8);
	      }, function () {
	        _this.INC_n(_this.registers.A(), _this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.DEC_n(_this.registers.A(), _this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_nn_n(_this.registers.A, _this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.CCF();_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.B, _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.B, _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.B, _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.B, _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.B, _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.B, _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.B, function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_n_A(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.C, _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.C, _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.C, _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.C, _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.C, _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.C, _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.C, function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_n_A(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.D, _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.D, _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.D, _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.D, _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.D, _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.D, _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.D, function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_n_A(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.E, _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.E, _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.E, _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.E, _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.E, _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.E, _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.E, function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_n_A(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.H, _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.H, _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.H, _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.H, _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.H, _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.H, _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.H, function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_n_A(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.L, _this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.L, _this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.L, _this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.L, _this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.L, _this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.L, _this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(_this.registers.L, function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_n_A(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_r1_r2(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        }, _this.registers.B);_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_r1_r2(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        }, _this.registers.C);_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_r1_r2(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        }, _this.registers.D);_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_r1_r2(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        }, _this.registers.E);_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_r1_r2(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        }, _this.registers.H);_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_r1_r2(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        }, _this.registers.L);_this.updateCycles(1, 8);
	      }, function () {
	        _this.HALT();_this.updateCycles(0, 0);
	      }, function () {
	        _this.LD_n_A(function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_A_n(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_A_n(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_A_n(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_A_n(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_A_n(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_A_n(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.LD_A_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.LD_A_n(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADD_An(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADD_An(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADD_An(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADD_An(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADD_An(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADD_An(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADD_An(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.ADD_An(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADC_An(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADC_An(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADC_An(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADC_An(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADC_An(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADC_An(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.ADC_An(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.ADC_An(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SUB_n(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SUB_n(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SUB_n(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SUB_n(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SUB_n(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SUB_n(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SUB_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.SUB_n(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SBC_n(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SBC_n(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SBC_n(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SBC_n(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SBC_n(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SBC_n(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.SBC_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.SBC_n(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.AND_n(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.AND_n(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.AND_n(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.AND_n(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.AND_n(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.AND_n(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.AND_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.AND_n(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.XOR_n(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.XOR_n(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.XOR_n(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.XOR_n(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.XOR_n(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.XOR_n(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.XOR_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.XOR_n(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.OR_n(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.OR_n(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.OR_n(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.OR_n(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.OR_n(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.OR_n(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.OR_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.OR_n(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        _this.CP_n(_this.registers.B);_this.updateCycles(1, 4);
	      }, function () {
	        _this.CP_n(_this.registers.C);_this.updateCycles(1, 4);
	      }, function () {
	        _this.CP_n(_this.registers.D);_this.updateCycles(1, 4);
	      }, function () {
	        _this.CP_n(_this.registers.E);_this.updateCycles(1, 4);
	      }, function () {
	        _this.CP_n(_this.registers.H);_this.updateCycles(1, 4);
	      }, function () {
	        _this.CP_n(_this.registers.L);_this.updateCycles(1, 4);
	      }, function () {
	        _this.CP_n(function () {
	          return _this.MMU.readByte(_this.registers.HL());
	        });_this.updateCycles(1, 8);
	      }, function () {
	        _this.CP_n(_this.registers.A);_this.updateCycles(1, 4);
	      }, function () {
	        var isActionTaken = _this.RET_cc('NZ');
	        _this.updateCycles(1, isActionTaken ? 20 : 8);
	      }, function () {
	        _this.POP_nn(_this.registers.BC);_this.updateCycles(1, 12);
	      }, function () {
	        var isActionTaken = _this.JP_cc_nn('NZ', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 16 : 12);
	      }, function () {
	        _this.JP_nn(_this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, 16);
	      }, function () {
	        var isActionTaken = _this.CALL_cc_nn('NZ', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 24 : 12);
	      }, function () {
	        _this.PUSH_nn(_this.registers.BC);_this.updateCycles(1, 16);
	      }, function () {
	        _this.ADD_An(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x00);_this.updateCycles(1, 16);
	      }, function () {
	        var isActionTaken = _this.RET_cc('Z');
	        _this.updateCycles(1, isActionTaken ? 20 : 8);
	      }, function () {
	        _this.RET();_this.updateCycles(1, 16);
	      }, function () {
	        var isActionTaken = _this.JP_cc_nn('Z', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 16 : 12);
	      }, function () {
	        var opcode = _this.MMU.readByte(_this.registers.PC());
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.cbInstMap[opcode]();
	        _this.registers.PC(_this.registers.PC() & 0xffff);
	        _this.updateCycles(0, 0);
	      }, function () {
	        var isActionTaken = _this.CALL_cc_nn('Z', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 24 : 12);
	      }, function () {
	        _this.CALL_nn(_this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, 24);
	      }, function () {
	        _this.ADC_An(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x08);
	        _this.updateCycles(1, 16);
	      }, function () {
	        var isActionTaken = _this.RET_cc('NC');
	        _this.updateCycles(1, isActionTaken ? 20 : 8);
	      }, function () {
	        _this.POP_nn(_this.registers.DE);_this.updateCycles(1, 12);
	      }, function () {
	        var isActionTaken = _this.JP_cc_nn('NC', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 16 : 12);
	      }, this.NOP, function () {
	        var isActionTaken = _this.CALL_cc_nn('NC', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 24 : 12);
	      }, function () {
	        _this.PUSH_nn(_this.registers.DE);_this.updateCycles(1, 16);
	      }, function () {
	        _this.SUB_n(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x10);_this.updateCycles(1, 16);
	      }, function () {
	        var isActionTaken = _this.RET_cc('C');
	        _this.updateCycles(1, isActionTaken ? 20 : 8);
	      }, function () {
	        _this.RETI();_this.updateCycles(1, 16);
	      }, function () {
	        var isActionTaken = _this.JP_cc_nn('C', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 16 : 12);
	      }, this.NOP, function () {
	        var isActionTaken = _this.CALL_cc_nn('C', _this.MMU.readWord(_this.registers.PC()));
	        _this.updateCycles(3, isActionTaken ? 24 : 12);
	      }, this.NOP, function () {
	        _this.SBC_n(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x18);
	        _this.updateCycles(1, 16);
	      }, function () {
	        _this.updateCycles(1, 4);
	        _this.LDH_n_A(_this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.POP_nn(_this.registers.HL);
	        _this.updateCycles(1, 12);
	      }, function () {
	        _this.LD_C_A();_this.updateCycles(2, 8);
	      }, this.NOP, this.NOP, function () {
	        _this.PUSH_nn(_this.registers.HL);_this.updateCycles(1, 16);
	      }, function () {
	        _this.AND_n(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x20);
	        _this.updateCycles(2, 16);
	      }, function () {
	        _this.ADD_SPn(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 16);
	      }, function () {
	        _this.JP_HL();
	        _this.updateCycles(1, 4);
	      }, function () {
	        _this.updateCycles(2, 8);
	        _this.LD_n_A(function (value) {
	          return _this.MMU.writeByte(_this.MMU.readWord(_this.registers.PC()), value);
	        });
	        _this.registers.PC(_this.registers.PC() + 2);
	        _this.updateCycles(1, 8);
	      }, this.NOP, this.NOP, this.NOP, function () {
	        _this.XOR_n(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x28);
	        _this.updateCycles(1, 16);
	      }, function () {
	        _this.updateCycles(1, 4);
	        _this.LDH_A_n(_this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.POP_nn(_this.registers.AF);
	        _this.updateCycles(1, 12);
	      }, function () {
	        _this.LD_A_C();_this.updateCycles(2, 8);
	      }, function () {
	        _this.DI();_this.updateCycles(1, 4);
	      }, this.NOP, function () {
	        _this.PUSH_nn(_this.registers.AF);_this.updateCycles(1, 16);
	      }, function () {
	        _this.OR_n(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x30);_this.updateCycles(1, 16);
	      }, function () {
	        _this.LDHL_SP_n(_this.MMU.readByte(_this.registers.PC()));
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 12);
	      }, function () {
	        _this.LD_SP_HL();_this.updateCycles(1, 8);
	      }, function () {
	        _this.updateCycles(1, 8);
	        _this.LD_A_n(function () {
	          return _this.MMU.readByte(_this.MMU.readWord(_this.registers.PC()));
	        });
	        _this.registers.PC(_this.registers.PC() + 2);
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.EI();_this.updateCycles(1, 4);
	      }, this.NOP, this.NOP, function () {
	        _this.CP_n(function () {
	          return _this.MMU.readByte(_this.registers.PC());
	        });
	        _this.registers.PC(_this.registers.PC() + 1);
	        _this.updateCycles(2, 8);
	      }, function () {
	        _this.RST_n(0x38);_this.updateCycles(1, 16);
	      }];

	      this.cbInstMap = [function () {
	        _this.RLC_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RLC_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RLC_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RLC_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RLC_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RLC_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.RLC_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.RLC_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RRC_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RRC_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RRC_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RRC_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RRC_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RRC_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.RRC_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.RRC_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RL_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RL_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RL_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RL_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RL_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RL_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.RL_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.RL_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RR_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RR_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RR_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RR_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RR_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.RR_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.RR_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.RR_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SLA_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SLA_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SLA_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SLA_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SLA_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SLA_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.SLA_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.SLA_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRA_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRA_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRA_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRA_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRA_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRA_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.SRA_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.SRA_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SWAP_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SWAP_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SWAP_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SWAP_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SWAP_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SWAP_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.SWAP_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.SWAP_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRL_n(_this.registers.B(), _this.registers.B);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRL_n(_this.registers.C(), _this.registers.C);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRL_n(_this.registers.D(), _this.registers.D);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRL_n(_this.registers.E(), _this.registers.E);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRL_n(_this.registers.H(), _this.registers.H);_this.updateCycles(2, 8);
	      }, function () {
	        _this.SRL_n(_this.registers.L(), _this.registers.L);_this.updateCycles(2, 8);
	      }, function () {
	        _this.updateCycles(1, 4);
	        var value = _this.MMU.readByte(_this.registers.HL());
	        _this.updateCycles(1, 4);
	        _this.SRL_n(value, function (value) {
	          return _this.MMU.writeByte(_this.registers.HL(), value);
	        });
	        _this.updateCycles(1, 8);
	      }, function () {
	        _this.SRL_n(_this.registers.A(), _this.registers.A);_this.updateCycles(2, 8);
	      }];

	      [this.BIT_b_r].forEach(function (op) {
	        var _loop = function _loop(i) {
	          _this.cbInstMap = _this.cbInstMap.concat([function () {
	            op.call(_this, i, _this.registers.B);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.C);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.D);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.E);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.H);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.L);_this.updateCycles(2, 8);
	          }, function () {
	            _this.updateCycles(1, 4);
	            var byte = _this.MMU.readByte(_this.registers.HL());
	            op.call(_this, i, function () {
	              return _this.MMU.readByte(_this.registers.HL());
	            });
	            _this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.A);_this.updateCycles(2, 8);
	          }]);
	        };

	        for (var i = 0; i < 8; i += 1) {
	          _loop(i);
	        }
	      });
	      [this.RES_b_r, this.SET_b_r].forEach(function (op) {
	        var _loop2 = function _loop2(i) {
	          _this.cbInstMap = _this.cbInstMap.concat([function () {
	            op.call(_this, i, _this.registers.B);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.C);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.D);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.E);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.H);_this.updateCycles(2, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.L);_this.updateCycles(2, 8);
	          }, function () {
	            _this.updateCycles(1, 4);
	            var byte = _this.MMU.readByte(_this.registers.HL());
	            _this.updateCycles(1, 4);
	            op.call(_this, i, function (value, index) {
	              if (value) {
	                _this.MMU.writeByte(_this.registers.HL(), byte | 1 << index);
	              } else {
	                _this.MMU.writeByte(_this.registers.HL(), byte & ~(1 << index));
	              }
	            });
	            _this.updateCycles(1, 8);
	          }, function () {
	            op.call(_this, i, _this.registers.A);_this.updateCycles(2, 8);
	          }]);
	        };

	        for (var i = 0; i < 8; i += 1) {
	          _loop2(i);
	        }
	      });
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var _this2 = this;

	      function registerGenerator(is16Bits) {
	        var register = 0;

	        return function (value, index) {
	          if (value === undefined) {
	            if (index !== undefined) {
	              return register >> index & 0x01;
	            } else {
	              return register;
	            }
	          }

	          if (index === undefined) {
	            register = value;
	          } else if (value) {
	            register |= 1 << index;
	          } else {
	            register &= ~(1 << index);
	          }

	          if (is16Bits) {
	            return register &= 0xffff;
	          } else {
	            return register &= 0xff;
	          }
	        };
	      }

	      this.registers = {
	        A: registerGenerator(),
	        F: function () {
	          var register = registerGenerator();

	          register.Z = function (set) {
	            return register(set, 7);
	          };
	          register.N = function (set) {
	            return register(set, 6);
	          };
	          register.H = function (set) {
	            return register(set, 5);
	          };
	          register.C = function (set) {
	            return register(set, 4);
	          };

	          return register;
	        }(),
	        B: registerGenerator(),
	        C: registerGenerator(),
	        D: registerGenerator(),
	        E: registerGenerator(),
	        H: registerGenerator(),
	        L: registerGenerator(),
	        SP: registerGenerator(true),
	        PC: registerGenerator(true),
	        HL: function HL(value) {
	          if (value === undefined) {
	            return _this2.registers.H() << 8 | _this2.registers.L();
	          }

	          _this2.registers.H(value >> 8 & 0xff);
	          _this2.registers.L(value & 0xff);
	        },
	        BC: function BC(value) {
	          if (value === undefined) {
	            return _this2.registers.B() << 8 | _this2.registers.C();
	          }

	          _this2.registers.B(value >> 8 & 0xff);
	          _this2.registers.C(value & 0xff);
	        },
	        DE: function DE(value) {
	          if (value === undefined) {
	            return _this2.registers.D() << 8 | _this2.registers.E();
	          }

	          _this2.registers.D(value >> 8 & 0xff);
	          _this2.registers.E(value & 0xff);
	        },
	        AF: function AF(value) {
	          if (value === undefined) {
	            return _this2.registers.A() << 8 | _this2.registers.F();
	          }

	          _this2.registers.A(value >> 8 & 0xff);
	          _this2.registers.F(value & 0xf0);
	        }
	      };

	      this.IME = false;
	      this.isHalted = false;
	      this.isStopped = false;
	    }
	  }, {
	    key: 'step',
	    value: function step() {
	      /*
	      const pcList = document.getElementById('lastTenPC');
	      const childNodes = pcList.childNodes;
	      while (childNodes.length >= 10) {
	        pcList.removeChild(childNodes[0]);
	      }
	      const pc = document.createElement('li');
	      pc.innerHTML = '0x' + this.registers.PC().toString(16);
	        pcList.appendChild(pc);
	      */

	      var opcode = this.MMU.readByte(this.registers.PC());
	      if (this.isHalted) {
	        this.clock.updateCycles(1, 4);
	      } else {
	        this.registers.PC(this.registers.PC() + 1);
	        this.instMap[opcode]();
	      }
	      this.registers.PC(this.registers.PC() & 0xffff);

	      if (this.IME) {
	        if (this.interrupt.interruptEnabled.VBlank && this.interrupt.interruptFlag.VBlank) {
	          this.isHalted = false;
	          this.IME = false;
	          this.interrupt.interruptFlag.VBlank = false;
	          this.RST_n(0x40);
	          this.updateCycles(3, 12);
	        } else if (this.interrupt.interruptEnabled.LCDStatus && this.interrupt.interruptFlag.LCDStatus) {
	          this.isHalted = false;
	          this.IME = false;
	          this.interrupt.interruptFlag.LCDStatus = false;
	          this.RST_n(0x48);
	          this.updateCycles(3, 12);
	        } else if (this.interrupt.interruptEnabled.timer && this.interrupt.interruptFlag.timer) {
	          this.isHalted = false;
	          this.IME = false;
	          this.interrupt.interruptFlag.timer = false;
	          this.RST_n(0x50);
	          this.updateCycles(3, 12);
	        } else if (this.interrupt.interruptEnabled.serial && this.interrupt.interruptFlag.serial) {
	          this.isHalted = false;
	          this.IME = false;
	          this.interrupt.interruptFlag.serial = false;
	          this.RST_n(0x58);
	          this.updateCycles(3, 12);
	        } else if (this.interrupt.interruptEnabled.input && this.interrupt.interruptFlag.input) {
	          this.isHalted = false;
	          this.IME = false;
	          this.interrupt.interruptFlag.input = false;
	          this.RST_n(0x60);
	          this.updateCycles(3, 12);
	        }
	      } else {
	        if (this.interrupt.interruptFlag.VBlank) {
	          this.isHalted = false;
	        } else if (this.interrupt.interruptFlag.LCDStatus) {
	          this.isHalted = false;
	        } else if (this.interrupt.interruptFlag.timer) {
	          this.isHalted = false;
	        } else if (this.interrupt.interruptFlag.serial) {
	          this.isHalted = false;
	        } else if (this.interrupt.interruptFlag.input) {
	          this.isHalted = false;
	        }
	      }
	    }
	  }, {
	    key: 'updateCycles',
	    value: function updateCycles(m, c) {
	      this.clock.updateCycles(c);
	    }
	  }, {
	    key: 'signed',
	    value: function signed(n) {
	      if (n & 0x80) {
	        n = -(~n + 1 & 0xff);
	      }

	      return n;
	    }
	    // 8-bits Loads

	  }, {
	    key: 'LD_nn_n',
	    value: function LD_nn_n(nn, n) {
	      nn(n & 0xff);
	    }
	  }, {
	    key: 'LD_r1_r2',
	    value: function LD_r1_r2(r1, r2) {
	      r1(r2());
	    }
	  }, {
	    key: 'LD_A_n',
	    value: function LD_A_n(n) {
	      this.registers.A(n());
	    }
	  }, {
	    key: 'LD_n_A',
	    value: function LD_n_A(n) {
	      n(this.registers.A());
	    }
	  }, {
	    key: 'LD_A_C',
	    value: function LD_A_C() {
	      this.registers.A(this.MMU.readByte(0xff00 + this.registers.C()));
	    }
	  }, {
	    key: 'LD_C_A',
	    value: function LD_C_A() {
	      this.MMU.writeByte(0xff00 + this.registers.C(), this.registers.A());
	    }
	  }, {
	    key: 'LDH_n_A',
	    value: function LDH_n_A(n) {
	      this.MMU.writeByte(0xff00 + n, this.registers.A());
	    }
	  }, {
	    key: 'LDH_A_n',
	    value: function LDH_A_n(n) {
	      this.registers.A(this.MMU.readByte(0xff00 + n));
	    }
	    // 16-bits Loads

	  }, {
	    key: 'LD_n_nn',
	    value: function LD_n_nn(n, nn) {
	      n(nn & 0xffff);
	    }
	  }, {
	    key: 'LD_SP_HL',
	    value: function LD_SP_HL() {
	      this.registers.SP(this.registers.HL());
	    }
	  }, {
	    key: 'LDHL_SP_n',
	    value: function LDHL_SP_n(n) {
	      this.setFlag(false, false, this.isHalfCarry(this.registers.SP(), this.signed(n)), this.isCarry(this.registers.SP(), this.signed(n)));
	      this.registers.HL(this.registers.SP() + this.signed(n));
	    }
	  }, {
	    key: 'LD_nn_SP',
	    value: function LD_nn_SP(nn) {
	      this.MMU.writeWord(nn & 0xffff, this.registers.SP());
	    }
	  }, {
	    key: 'PUSH_nn',
	    value: function PUSH_nn(nn) {
	      this.MMU.writeWord(this.registers.SP() - 2, nn() & 0xffff);
	      this.registers.SP(this.registers.SP() - 2);
	    }
	  }, {
	    key: 'POP_nn',
	    value: function POP_nn(nn) {
	      nn(this.MMU.readWord(this.registers.SP()));
	      this.registers.SP(this.registers.SP() + 2);
	    }
	    // Helper methods for ALU

	  }, {
	    key: 'setFlag',
	    value: function setFlag(Z, N, H, C) {
	      this.registers.F(0);
	      this.registers.F.Z(Z ? 1 : 0);
	      this.registers.F.N(N ? 1 : 0);
	      this.registers.F.H(H ? 1 : 0);
	      this.registers.F.C(C ? 1 : 0);
	    }
	  }, {
	    key: 'isHalfCarry',
	    value: function isHalfCarry(r1, r2, r3) {
	      if (r3 !== undefined) {
	        return (r1 & 0xf) + (r2 & 0xf) + (r3 & 0xf) > 0xf;
	      } else {
	        if (r2 >= 0) {
	          return (r1 & 0xf) + (r2 & 0xf) > 0xf;
	        } else {
	          return (r1 + r2 & 0xf) <= (r1 & 0xf);
	        }
	      }
	    }
	  }, {
	    key: 'isCarry',
	    value: function isCarry(r1, r2, r3) {
	      if (r3 !== undefined) {
	        return (r1 & 0xff) + (r2 & 0xff) + (r3 & 0xff) > 0xff;
	      } else {
	        if (r2 >= 0) {
	          return (r1 & 0xff) + (r2 & 0xff) > 0xff;
	        } else {
	          return (r1 + r2 & 0xff) <= (r1 & 0xff);
	        }
	      }
	    }
	  }, {
	    key: 'is16BitsHalfCarry',
	    value: function is16BitsHalfCarry() {
	      for (var _len = arguments.length, registers = Array(_len), _key = 0; _key < _len; _key++) {
	        registers[_key] = arguments[_key];
	      }

	      return registers.reduce(function (sum, register) {
	        return sum += register & 0xfff;
	      }, 0) > 0xfff;
	    }
	  }, {
	    key: 'is16BitsCarry',
	    value: function is16BitsCarry() {
	      for (var _len2 = arguments.length, registers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        registers[_key2] = arguments[_key2];
	      }

	      return registers.reduce(function (sum, register) {
	        return sum += register;
	      }, 0) > 0xffff;
	    }
	  }, {
	    key: 'isHalfBorrow',
	    value: function isHalfBorrow(r1, r2, r3) {
	      if (r3 !== undefined) {
	        return (r1 & 0xf) - (r2 & 0xf) - (r3 & 0xf) < 0;
	      } else {
	        return (r1 & 0xf) - (r2 & 0xf) < 0;
	      }
	    }
	  }, {
	    key: 'isBorrow',
	    value: function isBorrow(r1, r2, r3) {
	      if (r3 !== undefined) {
	        return r1 - r2 - r3 < 0;
	      } else {
	        return r1 - r2 < 0;
	      }
	    }
	    // 8-bits ALU

	  }, {
	    key: 'ADD_An',
	    value: function ADD_An(n) {
	      this.setFlag((this.registers.A() + n() & 0xff) === 0, false, this.isHalfCarry(this.registers.A(), n()), this.isCarry(this.registers.A(), n()));
	      this.registers.A(this.registers.A() + n());
	    }
	  }, {
	    key: 'ADC_An',
	    value: function ADC_An(n) {
	      var carryFlag = this.registers.F.C() ? 1 : 0;
	      this.setFlag((this.registers.A() + n() + carryFlag & 0xff) === 0, false, this.isHalfCarry(this.registers.A(), n(), carryFlag), this.isCarry(this.registers.A(), n(), carryFlag));
	      this.registers.A(this.registers.A() + n() + carryFlag);
	    }
	  }, {
	    key: 'SUB_n',
	    value: function SUB_n(n) {
	      this.setFlag((this.registers.A() - n() & 0xff) === 0, true, this.isHalfBorrow(this.registers.A(), n()), this.isBorrow(this.registers.A(), n()));
	      this.registers.A(this.registers.A() - n());
	    }
	  }, {
	    key: 'SBC_n',
	    value: function SBC_n(n) {
	      var carryFlag = this.registers.F.C() ? 1 : 0;
	      this.setFlag((this.registers.A() - n() - carryFlag & 0xff) === 0, true, this.isHalfBorrow(this.registers.A(), n(), carryFlag), this.isBorrow(this.registers.A(), n(), carryFlag));
	      this.registers.A(this.registers.A() - n() - carryFlag);
	    }
	  }, {
	    key: 'AND_n',
	    value: function AND_n(n) {
	      this.setFlag((this.registers.A() & n()) === 0, false, true, false);
	      this.registers.A(this.registers.A() & n());
	    }
	  }, {
	    key: 'OR_n',
	    value: function OR_n(n) {
	      this.setFlag((this.registers.A() | n()) === 0, false, false, false);
	      this.registers.A(this.registers.A() | n());
	    }
	  }, {
	    key: 'XOR_n',
	    value: function XOR_n(n) {
	      this.setFlag((this.registers.A() ^ n()) === 0, false, false, false);
	      this.registers.A(this.registers.A() ^ n());
	    }
	  }, {
	    key: 'CP_n',
	    value: function CP_n(n) {
	      this.setFlag(this.registers.A() === n(), true, this.isHalfBorrow(this.registers.A(), n()), this.isBorrow(this.registers.A(), n()));
	    }
	  }, {
	    key: 'INC_n',
	    value: function INC_n(s, d) {
	      this.setFlag((s + 1 & 0xff) === 0, false, this.isHalfCarry(s, 1), this.registers.F.C());
	      d(s + 1);
	    }
	  }, {
	    key: 'DEC_n',
	    value: function DEC_n(s, d) {
	      this.setFlag((s - 1 & 0xff) === 0, true, this.isHalfBorrow(s, 1), this.registers.F.C());
	      d(s - 1);
	    }
	    // 16-bits ALU

	  }, {
	    key: 'ADD_HLn',
	    value: function ADD_HLn(n) {
	      this.setFlag(this.registers.F.Z(), false, this.is16BitsHalfCarry(this.registers.HL(), n()), this.is16BitsCarry(this.registers.HL(), n()));
	      this.registers.HL(this.registers.HL() + n());
	    }
	  }, {
	    key: 'ADD_SPn',
	    value: function ADD_SPn(n) {
	      this.setFlag(false, false, this.isHalfCarry(this.registers.SP(), this.signed(n())), this.isCarry(this.registers.SP(), this.signed(n())));
	      this.registers.SP(this.registers.SP() + this.signed(n()));
	    }
	  }, {
	    key: 'INC_nn',
	    value: function INC_nn(nn) {
	      nn(nn() + 1);
	    }
	  }, {
	    key: 'DEC_nn',
	    value: function DEC_nn(nn) {
	      nn(nn() - 1);
	    }
	    // Miscellaneous

	  }, {
	    key: 'SWAP_n',
	    value: function SWAP_n(s, d) {
	      var upperNibbles = s >> 4 & 0xf,
	          lowerNibbles = s & 0xf;
	      this.setFlag((lowerNibbles << 4 | upperNibbles) === 0, false, false, false);
	      d(lowerNibbles << 4 | upperNibbles);
	    }
	  }, {
	    key: 'DAA',
	    value: function DAA() {
	      var a = this.registers.A();

	      if (this.registers.F.N()) {
	        if (this.registers.F.H()) {
	          a = a - 0x06 & 0xff;
	        }
	        if (this.registers.F.C()) {
	          a -= 0x60;
	        }
	      } else {
	        if (this.registers.F.H() || (a & 0x0f) > 0x09) {
	          a += 0x06;
	        }
	        if (this.registers.F.C() || a > 0x9F) {
	          a += 0x60;
	        }
	      }

	      this.registers.F.Z((a & 0xff) === 0);
	      this.registers.F.H(false);
	      if ((a & 0x100) === 0x100) {
	        this.registers.F.C(true);
	      }

	      this.registers.A(a);
	    }
	  }, {
	    key: 'CPL',
	    value: function CPL() {
	      this.setFlag(this.registers.F.Z(), true, true, this.registers.F.C());
	      this.registers.A(~this.registers.A());
	    }
	  }, {
	    key: 'CCF',
	    value: function CCF() {
	      this.setFlag(this.registers.F.Z(), false, false, this.registers.F.C() === 0);
	    }
	  }, {
	    key: 'SCF',
	    value: function SCF() {
	      this.setFlag(this.registers.F.Z(), false, false, true);
	    }
	  }, {
	    key: 'NOP',
	    value: function NOP() {}
	  }, {
	    key: 'HALT',
	    value: function HALT() {
	      this.isHalted = true;
	    }
	  }, {
	    key: 'STOP',
	    value: function STOP() {}
	  }, {
	    key: 'DI',
	    value: function DI() {
	      this.IME = false;
	    }
	  }, {
	    key: 'EI',
	    value: function EI() {
	      this.IME = true;
	    }
	    // Rotates & Shifts

	  }, {
	    key: 'RLCA',
	    value: function RLCA() {
	      var result = this.registers.A() << 1 | (this.registers.A() & 0x80) >> 7;
	      this.setFlag(false, false, false, this.registers.A() & 0x80);
	      this.registers.A(result);
	    }
	  }, {
	    key: 'RLA',
	    value: function RLA() {
	      var result = this.registers.A() << 1 | this.registers.F.C();
	      this.setFlag(false, false, false, this.registers.A() & 0x80);
	      this.registers.A(result);
	    }
	  }, {
	    key: 'RRCA',
	    value: function RRCA() {
	      var result = this.registers.A() >> 1 | (this.registers.A() & 0x01) << 7;
	      this.setFlag(false, false, false, this.registers.A() & 0x01);
	      this.registers.A(result);
	    }
	  }, {
	    key: 'RRA',
	    value: function RRA() {
	      var result = this.registers.A() >> 1 | this.registers.F.C() << 7;
	      this.setFlag(false, false, false, this.registers.A() & 0x01);
	      this.registers.A(result);
	    }
	  }, {
	    key: 'RLC_n',
	    value: function RLC_n(s, d) {
	      var result = s << 1 & 0xff | (s & 0x80) >> 7;
	      this.setFlag(result === 0, false, false, s & 0x80);
	      d(result);
	    }
	  }, {
	    key: 'RL_n',
	    value: function RL_n(s, d) {
	      var result = s << 1 & 0xff | this.registers.F.C();
	      this.setFlag(result === 0, false, false, s & 0x80);
	      d(result);
	    }
	  }, {
	    key: 'RRC_n',
	    value: function RRC_n(s, d) {
	      var result = s >> 1 | (s & 0x01) << 7;
	      this.setFlag(result === 0, false, false, s & 0x01);
	      d(result);
	    }
	  }, {
	    key: 'RR_n',
	    value: function RR_n(s, d) {
	      var result = s >> 1 | this.registers.F.C() << 7;
	      this.setFlag(result === 0, false, false, s & 0x01);
	      d(result);
	    }
	  }, {
	    key: 'SLA_n',
	    value: function SLA_n(s, d) {
	      var result = s << 1 & 0xff;
	      this.setFlag(result === 0, false, false, s & 0x80);
	      d(result);
	    }
	  }, {
	    key: 'SRA_n',
	    value: function SRA_n(s, d) {
	      var result = s >> 1 | s & 0x80;
	      this.setFlag(result === 0, false, false, s & 0x01);
	      d(result);
	    }
	  }, {
	    key: 'SRL_n',
	    value: function SRL_n(s, d) {
	      var result = s >> 1 & 0xff;
	      this.setFlag(result === 0, false, false, s & 0x01);
	      d(result);
	    }
	    // Bit Opcodes

	  }, {
	    key: 'BIT_b_r',
	    value: function BIT_b_r(b, r) {
	      this.setFlag((r() & 1 << b) === 0, false, true, this.registers.F.C());
	    }
	  }, {
	    key: 'SET_b_r',
	    value: function SET_b_r(b, r) {
	      r(true, b);
	    }
	  }, {
	    key: 'RES_b_r',
	    value: function RES_b_r(b, r) {
	      r(false, b);
	    }
	    // Jumps

	  }, {
	    key: 'JP_nn',
	    value: function JP_nn(nn) {
	      this.registers.PC(nn);
	    }
	  }, {
	    key: 'JP_cc_nn',
	    value: function JP_cc_nn(cc, nn) {
	      switch (cc) {
	        case 'NZ':
	          if (this.registers.F.Z()) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	        case 'Z':
	          if (this.registers.F.Z() === 0) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	        case 'NC':
	          if (this.registers.F.C()) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	        case 'C':
	          if (this.registers.F.C() === 0) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	      }

	      this.registers.PC(nn);

	      return true;
	    }
	  }, {
	    key: 'JP_HL',
	    value: function JP_HL() {
	      this.registers.PC(this.registers.HL());
	    }
	  }, {
	    key: 'JR_n',
	    value: function JR_n(n) {
	      this.registers.PC(this.registers.PC() + this.signed(n));
	    }
	  }, {
	    key: 'JR_cc_n',
	    value: function JR_cc_n(cc, n) {
	      switch (cc) {
	        case 'NZ':
	          if (this.registers.F.Z()) {
	            return false;
	          }
	          break;
	        case 'Z':
	          if (this.registers.F.Z() === 0) {
	            return false;
	          }
	          break;
	        case 'NC':
	          if (this.registers.F.C()) {
	            return false;
	          }
	          break;
	        case 'C':
	          if (this.registers.F.C() === 0) {
	            return false;
	          }
	          break;
	      }

	      this.registers.PC(this.registers.PC() + this.signed(n));

	      return true;
	    }
	    // Calls

	  }, {
	    key: 'CALL_nn',
	    value: function CALL_nn(nn) {
	      this.MMU.writeWord(this.registers.SP() - 2, this.registers.PC() + 2);
	      this.registers.SP(this.registers.SP() - 2);

	      this.registers.PC(nn);
	    }
	  }, {
	    key: 'CALL_cc_nn',
	    value: function CALL_cc_nn(cc, nn) {
	      switch (cc) {
	        case 'NZ':
	          if (this.registers.F.Z()) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	        case 'Z':
	          if (this.registers.F.Z() === 0) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	        case 'NC':
	          if (this.registers.F.C()) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	        case 'C':
	          if (this.registers.F.C() === 0) {
	            this.registers.PC(this.registers.PC() + 2);

	            return false;
	          }
	          break;
	      }

	      this.CALL_nn(nn);

	      return true;
	    }
	    // Restarts

	  }, {
	    key: 'RST_n',
	    value: function RST_n(n) {
	      this.MMU.writeWord(this.registers.SP() - 2, this.registers.PC());
	      this.registers.SP(this.registers.SP() - 2);

	      this.registers.PC(n & 0xff);
	    }
	  }, {
	    key: 'RET',
	    value: function RET() {
	      var lowByte = this.MMU.readByte(this.registers.SP());
	      var highByte = this.MMU.readByte(this.registers.SP() + 1);

	      this.registers.PC(highByte << 8 | lowByte & 0xff);
	      this.registers.SP(this.registers.SP() + 2);
	    }
	  }, {
	    key: 'RET_cc',
	    value: function RET_cc(cc) {
	      switch (cc) {
	        case 'NZ':
	          if (this.registers.F.Z()) {
	            return false;
	          }
	          break;
	        case 'Z':
	          if (this.registers.F.Z() === 0) {
	            return false;
	          }
	          break;
	        case 'NC':
	          if (this.registers.F.C()) {
	            return false;
	          }
	          break;
	        case 'C':
	          if (this.registers.F.C() === 0) {
	            return false;
	          }
	          break;
	      }

	      this.RET();

	      return true;
	    }
	  }, {
	    key: 'RETI',
	    value: function RETI() {
	      this.RET();
	      this.EI();
	    }
	    // Returns

	  }]);

	  return CPU;
	}();

	exports.default = CPU;

/***/ }
/******/ ]);