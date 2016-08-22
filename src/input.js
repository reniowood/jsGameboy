export default class Input {
  constructor() {
    this.byte = 0x3f;
  }
  keydown(key) {
    switch (key) {
      case 'A':
        this.byte &= ~((1 << 0) | (1 << 4));
        break;
      case 'B':
        this.byte &= ~((1 << 1) | (1 << 4));
        break;
      case 'SELECT':
        this.byte &= ~((1 << 2) | (1 << 4));
        break;
      case 'START':
        this.byte &= ~((1 << 3) | (1 << 4));
        break;
      case 'RIGHT':
        this.byte &= ~((1 << 0) | (1 << 5));
        break;
      case 'LEFT':
        this.byte &= ~((1 << 1) | (1 << 5));
        break;
      case 'UP':
        this.byte &= ~((1 << 2) | (1 << 5));
        break;
      case 'DOWN':
        this.byte &= ~((1 << 3) | (1 << 5));
        break;
    }
  }
  keyup(key) {
    switch (key) {
      case 'A':
        this.byte |= (1 << 0) | (1 << 4);
        break;
      case 'B':
        this.byte |= (1 << 1) | (1 << 4);
        break;
      case 'SELECT':
        this.byte |= (1 << 2) | (1 << 4);
        break;
      case 'START':
        this.byte |= (1 << 3) | (1 << 4);
        break;
      case 'RIGHT':
        this.byte |= (1 << 0) | (1 << 5);
        break;
      case 'LEFT':
        this.byte |= (1 << 1) | (1 << 5);
        break;
      case 'UP':
        this.byte |= (1 << 2) | (1 << 5);
        break;
      case 'DOWN':
        this.byte |= (1 << 3) | (1 << 5);
        break;
    }
  }
  readByte() {
    return this.byte;
  }
}
