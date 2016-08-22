export default class Input {
  constructor() {
    this.column = 0;
    this.p14 = 0x0f; // RIGHT, LEFT, UP, DOWN
    this.p15 = 0x0f; // A, B, SELECT, START
  }
  keydown(key) {
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
  keyup(key) {
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
  readByte() {
    if (this.column === 0x01) {
      return this.p15;
    } else {
      return this.p14;
    }
  }
  writeByte(value) {
    this.column = (value >> 4);
  }
}
