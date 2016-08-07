import CPU from './cpu';

const Z80 = new CPU();

document.getElementById('fileInput').onchange = (event) => {
  const file = event.target.files[0];

  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      Z80.MMU.loadROM(e.target.result);
      Z80.run();
    };
    fileReader.readAsBinaryString(file);
  }
};
