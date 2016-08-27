export default class CPU {
  constructor(clock, interrupt, MMU) {
    this.clock = clock;
    this.interrupt = interrupt;
    this.MMU = MMU;

    this.reset();
    this.updateInstMap();
  }
  updateInstMap() {
    this.instMap = [
      () => { this.NOP(); this.updateCycles(1, 4); },
      () => {
        this.LD_n_nn(this.registers.BC, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        this.updateCycles(3, 12);
      },
      () => { this.LD_n_A((value) => (this.MMU.writeByte(this.registers.BC(), value))); this.updateCycles(1, 8); },
      () => { this.INC_nn(this.registers.BC); this.updateCycles(1, 8); },
      () => { this.INC_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.DEC_n(this.registers.B); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_n(this.registers.B, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RLCA(); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_SP(this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        this.updateCycles(3, 20);
      },
      () => { this.ADD_HLn(this.registers.BC); this.updateCycles(1, 8); },
      () => { this.LD_A_n(() => (this.MMU.readByte(this.registers.BC()))); this.updateCycles(1, 8); },
      () => { this.DEC_nn(this.registers.BC); this.updateCycles(1, 8); },
      () => { this.INC_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.DEC_n(this.registers.C); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_n(this.registers.C, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RRCA(); this.updateCycles(1, 4); },
      () => { this.STOP(); this.updateCycles(2, 4); },
      () => {
        this.LD_n_nn(this.registers.DE, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        this.updateCycles(3, 12);
      },
      () => { this.LD_n_A((value) => (this.MMU.writeByte(this.registers.DE(), value))); this.updateCycles(1, 8); },
      () => { this.INC_nn(this.registers.DE); this.updateCycles(1, 8); },
      () => { this.INC_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.DEC_n(this.registers.D); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_n(this.registers.D, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RLA(); this.updateCycles(1, 4); },
      () => {
        this.JR_n(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 12);
      },
      () => { this.ADD_HLn(this.registers.DE); this.updateCycles(1, 8); },
      () => { this.LD_A_n(() => (this.MMU.readByte(this.registers.DE()))); this.updateCycles(1, 8); },
      () => { this.DEC_nn(this.registers.DE); this.updateCycles(1, 8); },
      () => { this.INC_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.DEC_n(this.registers.E); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_n(this.registers.E, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RRA(); this.updateCycles(1, 4); },
      () => {
        const isActionTaken = this.JR_cc_n('NZ', this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, isActionTaken ? 12 : 8);
      },
      () => {
        this.LD_n_nn(this.registers.HL, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        this.updateCycles(3, 12);
      },
      () => { // LD (HL+), A = LDI (HL), A = LD (HL), A - INC_nn HL
        this.LD_n_A((value) => (this.MMU.writeByte(this.registers.HL(), value)));
        this.INC_nn(this.registers.HL);
        this.updateCycles(1, 8);
      },
      () => { this.INC_nn(this.registers.HL); this.updateCycles(1, 8); },
      () => { this.INC_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.DEC_n(this.registers.H); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_n(this.registers.H, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.DAA(); this.updateCycles(1, 4); },
      () => {
        const isActionTaken = this.JR_cc_n('Z', this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(1, isActionTaken ? 12 : 8);
      },
      () => { this.ADD_HLn(this.registers.HL); this.updateCycles(1, 8); },
      () => { // LD A, (HL+) = LDI A, (HL) = LD A, (HL) - INC_nn HL
        this.LD_A_n(() => (this.MMU.readByte(this.registers.HL())));
        this.INC_nn(this.registers.HL);
        this.updateCycles(1, 8);
      },
      () => { this.DEC_nn(this.registers.HL); this.updateCycles(1, 8); },
      () => { this.INC_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.DEC_n(this.registers.L); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_n(this.registers.L, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.CPL(); this.updateCycles(1, 4); },
      () => {
        const isActionTaken = this.JR_cc_n('NC', this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(1, isActionTaken ? 12 : 8);
      },
      () => {
        this.LD_n_nn(this.registers.SP, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        this.updateCycles(3, 12);
      },
      () => { // LD (HL-), A = LDD (HL), A = LD (HL), A - DEC_nn HL
        this.LD_n_A((value) => (this.MMU.writeByte(this.registers.HL(), value)));
        this.DEC_nn(this.registers.HL);
        this.updateCycles(1, 8);
      },
      () => { this.INC_nn(this.registers.SP); this.updateCycles(1, 4); },
      () => { this.INC_n((value) => {
        if (value !== undefined) {
          this.MMU.writeByte(this.registers.HL(), value);
        }

        return this.MMU.readByte(this.registers.HL());
      }); this.updateCycles(1, 12); },
      () => { this.DEC_n((value) => {
        if (value !== undefined) {
          this.MMU.writeByte(this.registers.HL(), value);
        }

        return this.MMU.readByte(this.registers.HL());
      }); this.updateCycles(1, 12); },
      () => {
        this.LD_nn_n((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 12);
      },
      () => { this.SCF(); this.updateCycles(1, 4); },
      () => {
        const isActionTaken = this.JR_cc_n('C', this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(1, isActionTaken ? 12 : 8);
      },
      () => { this.ADD_HLn(this.registers.SP); this.updateCycles(1, 8); },
      () => { // LD A, (HL-) = LDD A, (HL) = LD A, (HL) - DEC_nn HL
        this.LD_A_n(() => (this.MMU.readByte(this.registers.HL())));
        this.DEC_nn(this.registers.HL);
        this.updateCycles(1, 8);
      },
      () => { this.DEC_nn(this.registers.SP); this.updateCycles(1, 8); },
      () => { this.INC_n(this.registers.A); this.updateCycles(1, 4); },
      () => { this.DEC_n(this.registers.A); this.updateCycles(1, 4); },
      () => {
        this.LD_nn_n(this.registers.A, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.CCF(); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.B, this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.B, this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.B, this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.B, this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.B, this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.B, this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.B, () => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.LD_n_A(this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.C, this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.C, this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.C, this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.C, this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.C, this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.C, this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.C, () => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.LD_n_A(this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.D, this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.D, this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.D, this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.D, this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.D, this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.D, this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.D, () => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.LD_n_A(this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.E, this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.E, this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.E, this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.E, this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.E, this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.E, this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.E, () => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.LD_n_A(this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.H, this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.H, this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.H, this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.H, this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.H, this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.H, this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.H, () => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.LD_n_A(this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.L, this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.L, this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.L, this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.L, this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.L, this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.L, this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2(this.registers.L, () => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.LD_n_A(this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.B); this.updateCycles(1, 8); },
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.C); this.updateCycles(1, 8); },
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.D); this.updateCycles(1, 8); },
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.E); this.updateCycles(1, 8); },
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.H); this.updateCycles(1, 8); },
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.L); this.updateCycles(1, 8); },
      () => { this.HALT(); this.updateCycles(1, 4); },
      () => { this.LD_n_A((value) => (this.MMU.writeByte(this.registers.HL(), value))); this.updateCycles(1, 4); },
      () => { this.LD_A_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.LD_A_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.LD_A_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.LD_A_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.LD_A_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.LD_A_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.LD_A_n(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.LD_A_n(this.registers.A); this.updateCycles(1, 4); },
      () => { this.ADD_An(this.registers.B); this.updateCycles(1, 4); },
      () => { this.ADD_An(this.registers.C); this.updateCycles(1, 4); },
      () => { this.ADD_An(this.registers.D); this.updateCycles(1, 4); },
      () => { this.ADD_An(this.registers.E); this.updateCycles(1, 4); },
      () => { this.ADD_An(this.registers.H); this.updateCycles(1, 4); },
      () => { this.ADD_An(this.registers.L); this.updateCycles(1, 4); },
      () => { this.ADD_An(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.ADD_An(this.registers.A); this.updateCycles(1, 4); },
      () => { this.ADC_An(this.registers.B); this.updateCycles(1, 4); },
      () => { this.ADC_An(this.registers.C); this.updateCycles(1, 4); },
      () => { this.ADC_An(this.registers.D); this.updateCycles(1, 4); },
      () => { this.ADC_An(this.registers.E); this.updateCycles(1, 4); },
      () => { this.ADC_An(this.registers.H); this.updateCycles(1, 4); },
      () => { this.ADC_An(this.registers.L); this.updateCycles(1, 4); },
      () => { this.ADC_An(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.ADC_An(this.registers.A); this.updateCycles(1, 4); },
      () => { this.SUB_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.SUB_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.SUB_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.SUB_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.SUB_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.SUB_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.SUB_n(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.SUB_n(this.registers.A); this.updateCycles(1, 4); },
      () => { this.SBC_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.SBC_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.SBC_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.SBC_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.SBC_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.SBC_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.SBC_n(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.SBC_n(this.registers.A); this.updateCycles(1, 4); },
      () => { this.AND_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.AND_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.AND_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.AND_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.AND_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.AND_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.AND_n(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.AND_n(this.registers.A); this.updateCycles(1, 4); },
      () => { this.XOR_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.XOR_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.XOR_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.XOR_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.XOR_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.XOR_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.XOR_n(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.XOR_n(this.registers.A); this.updateCycles(1, 4); },
      () => { this.OR_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.OR_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.OR_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.OR_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.OR_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.OR_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.OR_n(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.OR_n(this.registers.A); this.updateCycles(1, 4); },
      () => { this.CP_n(this.registers.B); this.updateCycles(1, 4); },
      () => { this.CP_n(this.registers.C); this.updateCycles(1, 4); },
      () => { this.CP_n(this.registers.D); this.updateCycles(1, 4); },
      () => { this.CP_n(this.registers.E); this.updateCycles(1, 4); },
      () => { this.CP_n(this.registers.H); this.updateCycles(1, 4); },
      () => { this.CP_n(this.registers.L); this.updateCycles(1, 4); },
      () => { this.CP_n(() => (this.MMU.readByte(this.registers.HL()))); this.updateCycles(1, 8); },
      () => { this.CP_n(this.registers.A); this.updateCycles(1, 4); },
      () => { 
        const isActionTaken = this.RET_cc('NZ');
        this.updateCycles(1, isActionTaken ? 20 : 8);
      },
      () => { this.POP_nn(this.registers.BC); this.updateCycles(1, 12); },
      () => {
        const isActionTaken = this.JP_cc_nn('NZ', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 16 : 12);
      },
      () => {
        this.JP_nn(this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, 12);
      },
      () => {
        const isActionTaken = this.CALL_cc_nn('NZ', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 24 : 12);
      },
      () => { this.PUSH_nn(this.registers.BC); this.updateCycles(1, 16); },
      () => {
        this.ADD_An(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RST_n(0x00); this.updateCycles(1, 16); },
      () => { 
        const isActionTaken = this.RET_cc('Z');
        this.updateCycles(1, isActionTaken ? 20 : 8);
      },
      () => { this.RET(); this.updateCycles(1, 16); },
      () => {
        const isActionTaken = this.JP_cc_nn('Z', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 16 : 12);
      },
      () => {
        const opcode = this.MMU.readByte(this.registers.PC());
        this.registers.PC(this.registers.PC() + 1);
        this.cbInstMap[opcode]();
        this.registers.PC(this.registers.PC() & 0xffff);
        this.updateCycles(1, 4);
      },
      () => {
        const isActionTaken = this.CALL_cc_nn('Z', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 24 : 12);
      },
      () => {
        this.CALL_nn(this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, 24);
      },
      () => {
        this.ADC_An(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => {
        this.RST_n(0x08);
        this.updateCycles(1, 16);
      },
      () => {
        const isActionTaken = this.RET_cc('NC');
        this.updateCycles(1, isActionTaken ? 20 : 8);
      },
      () => { this.POP_nn(this.registers.DE); this.updateCycles(1, 12); },
      () => {
        const isActionTaken = this.JP_cc_nn('NC', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 16 : 12);
      },
      this.NOP,
      () => {
        const isActionTaken = this.CALL_cc_nn('NC', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 24 : 12);
      },
      () => { this.PUSH_nn(this.registers.DE); this.updateCycles(1, 16); },
      () => {
        this.SUB_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RST_n(0x10); this.updateCycles(1, 16); },
      () => { 
        const isActionTaken = this.RET_cc('C');
        this.updateCycles(1, isActionTaken ? 20 : 8);
      },
      () => { this.RETI(); this.updateCycles(1, 16); },
      () => {
        const isActionTaken = this.JP_cc_nn('C', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 16 : 12);
      },
      this.NOP,
      () => {
        const isActionTaken = this.CALL_cc_nn('C', this.MMU.readWord(this.registers.PC()));
        this.updateCycles(3, isActionTaken ? 24 : 12);
      },
      this.NOP,
      () => {
        this.SBC_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => {
        this.RST_n(0x18);
        this.updateCycles(1, 16);
      },
      () => {
        this.LDH_n_A(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 12);
      },
      () => {
        this.POP_nn(this.registers.HL);
        this.updateCycles(1, 12);
      },
      () => { this.LD_C_A(); this.updateCycles(2, 8); },
      this.NOP,
      this.NOP,
      () => { this.PUSH_nn(this.registers.HL); this.updateCycles(1, 16); },
      () => {
        this.AND_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => {
        this.RST_n(0x20);
        this.updateCycles(2, 16);
      },
      () => {
        this.ADD_SPn(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 16);
      },
      () => {
        this.JP_HL();
        this.updateCycles(1, 4);
      },
      () => {
        this.LD_n_A((value) => (this.MMU.writeByte(this.MMU.readWord(this.registers.PC()), value)));
        this.registers.PC(this.registers.PC() + 2);
        this.updateCycles(3, 16);
      },
      this.NOP,
      this.NOP,
      this.NOP,
      () => {
        this.XOR_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => {
        this.RST_n(0x28);
        this.updateCycles(1, 16);
      },
      () => {
        this.LDH_A_n(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 12);
      },
      () => {
        this.POP_nn(this.registers.AF);
        this.updateCycles(1, 12);
      },
      () => { this.LD_A_C(); this.updateCycles(2, 8); },
      () => { this.DI(); this.updateCycles(1, 4); },
      this.NOP,
      () => { this.PUSH_nn(this.registers.AF); this.updateCycles(1, 16); },
      () => {
        this.OR_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RST_n(0x30); this.updateCycles(1, 16); },
      () => {
        this.LDHL_SP_n(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 12);
      },
      () => { this.LD_SP_HL(); this.updateCycles(1, 8); },
      () => {
        this.LD_A_n(() => (this.MMU.readByte(this.MMU.readWord(this.registers.PC()))));
        this.registers.PC(this.registers.PC() + 2);
        this.updateCycles(3, 16);
      },
      () => { this.EI(); this.updateCycles(1, 4); },
      this.NOP,
      this.NOP,
      () => {
        this.CP_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
        this.updateCycles(2, 8);
      },
      () => { this.RST_n(0x38); this.updateCycles(1, 16); },
    ];

    this.cbInstMap = [
      () => { this.RLC_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.RLC_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.RLC_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.RLC_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.RLC_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.RLC_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.RLC_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.RLCA(); this.updateCycles(2, 8); },
      () => { this.RRC_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.RRC_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.RRC_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.RRC_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.RRC_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.RRC_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.RRC_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.RRCA(); this.updateCycles(1, 4); },
      () => { this.RL_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.RL_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.RL_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.RL_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.RL_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.RL_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.RL_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.RLA; this.updateCycles(2, 8); },
      () => { this.RR_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.RR_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.RR_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.RR_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.RR_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.RR_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.RR_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.RRA; this.updateCycles(2, 8); },
      () => { this.SLA_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.SLA_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.SLA_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.SLA_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.SLA_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.SLA_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.SLA_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.SLA_n(this.registers.A); this.updateCycles(2, 8); },
      () => { this.SRA_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.SRA_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.SRA_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.SRA_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.SRA_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.SRA_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.SRA_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.SRA_n(this.registers.A); this.updateCycles(2, 8); },
      () => { this.SWAP_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.SWAP_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.SWAP_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.SWAP_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.SWAP_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.SWAP_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.SWAP_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.SWAP_n(this.registers.A); this.updateCycles(2, 8); },
      () => { this.SRL_n(this.registers.B); this.updateCycles(2, 8); },
      () => { this.SRL_n(this.registers.C); this.updateCycles(2, 8); },
      () => { this.SRL_n(this.registers.D); this.updateCycles(2, 8); },
      () => { this.SRL_n(this.registers.E); this.updateCycles(2, 8); },
      () => { this.SRL_n(this.registers.H); this.updateCycles(2, 8); },
      () => { this.SRL_n(this.registers.L); this.updateCycles(2, 8); },
      () => { this.SRL_n(this.MMU.readByte(this.registers.HL())); this.updateCycles(2, 16); },
      () => { this.SRL_n(this.registers.A); this.updateCycles(2, 8); },
    ];

    [this.BIT_b_r, this.RES_b_r, this.SET_b_r].forEach((op) => {
      for (let i=0; i<8; i+=1) {
        this.cbInstMap = this.cbInstMap.concat([
          () => { op.call(this, i, this.registers.B); this.updateCycles(2, 8); },
          () => { op.call(this, i, this.registers.C); this.updateCycles(2, 8); },
          () => { op.call(this, i, this.registers.D); this.updateCycles(2, 8); },
          () => { op.call(this, i, this.registers.E); this.updateCycles(2, 8); },
          () => { op.call(this, i, this.registers.H); this.updateCycles(2, 8); },
          () => { op.call(this, i, this.registers.L); this.updateCycles(2, 8); },
          () => { op.call(this, i, (value, index) => {
            const byte = this.MMU.readByte(this.registers.HL());

            if (value === undefined) {
              return byte;
            }

            if (value) {
              this.MMU.writeByte(this.registers.HL(), byte | (1 << index));
            } else {
              this.MMU.writeByte(this.registers.HL(), byte & ~(1 << index));
            }
          }); this.updateCycles(2, 16); },
          () => { op.call(this, i, this.registers.A); this.updateCycles(2, 8); },
        ]);
      }
    });
  }
  reset() {
    function registerGenerator(is16Bits) {
      let register = 0;

      return (value, index) => {
        if (value === undefined) {
          if (index !== undefined) {
            return (register >> index) & 0x01;
          } else {
            return register;
          }
        }
        
        if (index === undefined) {
          register = value;
        } else if (value) {
          register |= (1 << index);
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
      F: (() => {
        let register = registerGenerator();

        register.Z = (set) => ( register(set, 7) );
        register.N = (set) => ( register(set, 6) );
        register.H = (set) => ( register(set, 5) );
        register.C = (set) => ( register(set, 4) );

        return register;
      })(),
      B: registerGenerator(),
      C: registerGenerator(),
      D: registerGenerator(),
      E: registerGenerator(),
      H: registerGenerator(),
      L: registerGenerator(),
      SP: registerGenerator(true),
      PC: registerGenerator(true),
      HL: (value) => {
        if (value === undefined) {
          return this.registers.H() << 8 | this.registers.L();
        }

        this.registers.H((value >> 8) & 0xff);
        this.registers.L(value & 0xff);
      },
      BC: (value) => {
        if (value === undefined) {
          return this.registers.B() << 8 | this.registers.C();
        }

        this.registers.B((value >> 8) & 0xff);
        this.registers.C(value & 0xff);
      },
      DE: (value) => {
        if (value === undefined) {
          return this.registers.D() << 8 | this.registers.E();
        }

        this.registers.D((value >> 8) & 0xff);
        this.registers.E(value & 0xff);
      },
      AF: (value) => {
        if (value === undefined) {
          return this.registers.A() << 8 | this.registers.F();
        }

        this.registers.A((value >> 8) & 0xff);
        this.registers.F(value & 0xff);
      },
    };

    this.IME = false;
  }
  step() {
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

    const opcode = this.MMU.readByte(this.registers.PC());
    this.registers.PC(this.registers.PC() + 1);
    this.instMap[opcode]();
    this.registers.PC(this.registers.PC() & 0xffff);

    if (this.IME) {
      if (this.interrupt.interruptEnabled.VBlank && this.interrupt.interruptFlag.VBlank) {
        this.IME = false;
        this.interrupt.interruptFlag.VBlank = false;
        this.RST_n(0x40);
        this.updateCycles(3, 12);
      } else if (this.interrupt.interruptEnabled.LCDStatus && this.interrupt.interruptFlag.LCDStatus) {
        this.IME = false;
        this.interrupt.interruptFlag.LCDStatus = false;
        this.RST_n(0x48);
        this.updateCycles(3, 12);
      } else if (this.interrupt.interruptEnabled.timer && this.interrupt.interruptFlag.timer) {
        this.IME = false;
        this.interrupt.interruptFlag.timer = false;
        this.RST_n(0x50);
        this.updateCycles(3, 12);
      } else if (this.interrupt.interruptEnabled.serial && this.interrupt.interruptFlag.serial) {
        this.IME = false;
        this.interrupt.interruptFlag.serial = false;
        this.RST_n(0x58);
        this.updateCycles(3, 12);
      } else if (this.interrupt.interruptEnabled.input && this.interrupt.interruptFlag.input) {
        this.IME = false;
        this.interrupt.interruptFlag.input = false;
        this.RST_n(0x60);
        this.updateCycles(3, 12);
      }
    }
  }
  updateCycles(m, c) {
    this.clock.updateCycles(c);
  }
  signed(n) {
    if (n & 0x80) {
      n = -((~n + 1) & 0xff);
    }

    return n;
  }
  // 8-bits Loads
  LD_nn_n(nn, n) {
    nn(n & 0xff);
  }
  LD_r1_r2(r1, r2) {
    r1(r2());
  }
  LD_A_n(n) {
    this.registers.A(n());
  }
  LD_n_A(n) {
    n(this.registers.A());
  }
  LD_A_C() {
    this.registers.A(this.MMU.readByte(0xff00 + this.registers.C()));
  }
  LD_C_A() {
    this.MMU.writeByte(0xff00 + this.registers.C(), this.registers.A());
  }
  LDH_n_A(n) {
    this.MMU.writeByte(0xff00 + n, this.registers.A());
  }
  LDH_A_n(n) {
    this.registers.A(this.MMU.readByte(0xff00 + n));
  }
  // 16-bits Loads
  LD_n_nn(n, nn) {
    n(nn & 0xffff);
  }
  LD_SP_HL() {
    this.registers.SP(this.registers.HL());
  }
  LDHL_SP_n(n) {
    this.setFlag(false, false, this.isCarry(this.registers.SP(), n), this.is16BitsCarry(this.registers.SP(), n));
    this.registers.HL(this.registers.SP() + this.signed(n));
  }
  LD_nn_SP(nn) {
    this.MMU.writeWord(nn & 0xffff, this.registers.SP());
  }
  PUSH_nn(nn) {
    this.MMU.writeWord(this.registers.SP() - 2, nn() & 0xffff);
    this.registers.SP(this.registers.SP() - 2);
  }
  POP_nn(nn) {
    nn(this.MMU.readWord(this.registers.SP()));
    this.registers.SP(this.registers.SP() + 2);
  }
  // Helper methods for ALU
  setFlag(Z, N, H, C) {
    this.registers.F(0);
    this.registers.F.Z(Z ? 1 : 0);
    this.registers.F.N(N ? 1 : 0);
    this.registers.F.H(H ? 1 : 0);
    this.registers.F.C(C ? 1 : 0);
  }
  isHalfCarry(...registers) {
    return registers.reduce((sum, register) => (sum += register & 0xf), 0) > 0xf;
  }
  isCarry(...registers) {
    return registers.reduce((sum, register) => (sum += register), 0) > 0xff;
  }
  is16BitsHalfCarry(...registers) {
    return registers.reduce((sum, register) => (sum += register & 0xfff), 0) > 0xfff;
  }
  is16BitsCarry(...registers) {
    return registers.reduce((sum, register) => (sum += register), 0) > 0xffff;
  }
  isHalfBorrow(r1, r2) {
    return (r1 & 0xf) - (r2 & 0xf) < 0;
  }
  isBorrow(r1, r2) {
    return r1 - r2 < 0;
  }
  // 8-bits ALU
  ADD_An(n) {
    this.setFlag(((this.registers.A() + n()) & 0xff) === 0, false, this.isHalfCarry(this.registers.A(), n()), this.isCarry(this.registers.A(), n()));
    this.registers.A(this.registers.A() + n());
  }
  ADC_An(n) {
    const carryFlag = this.registers.F.Z() ? 1 : 0;
    this.setFlag(((this.registers.A() + n() + carryFlag) & 0xff) === 0, false, this.isHalfCarry(this.registers.A(), n(), carryFlag), this.isCarry(this.registers.A(), n(), carryFlag));
    this.registers.A(this.registers.A() + n() + carryFlag);
  }
  SUB_n(n) {
    this.setFlag(((this.registers.A() - n()) & 0xff) === 0, true, this.isHalfBorrow(this.registers.A(), n()), this.isBorrow(this.registers.A(), n()));
    this.registers.A(this.registers.A() - n());
  }
  SBC_n(n) {
    const carryFlag = this.registers.F.C() ? 1 : 0;
    this.setFlag(((this.registers.A() - n() - carryFlag) & 0xff) === 0, true, this.isHalfBorrow(this.registers.A(), n() + carryFlag), this.isBorrow(this.registers.A(), n() + carryFlag));
    this.registers.A(this.registers.A() - n() - carryFlag);
  }
  AND_n(n) {
    this.setFlag((this.registers.A() & n()) === 0, false, true, false);
    this.registers.A(this.registers.A() & n());
  }
  OR_n(n) {
    this.setFlag((this.registers.A() | n()) === 0, false, false, false);
    this.registers.A(this.registers.A() | n());
  }
  XOR_n(n) {
    this.setFlag((this.registers.A() ^ n()) === 0, false, false, false);
    this.registers.A(this.registers.A() ^ n());
  }
  CP_n(n) {
    this.setFlag(this.registers.A() === n(), true, this.isHalfBorrow(this.registers.A(), n()), this.isBorrow(this.registers.A(), n()));
  }
  INC_n(n) {
    this.setFlag(n() + 1 === 0, false, this.isHalfCarry(n(), 1), this.registers.F.C());
    n(n() + 1);
  }
  DEC_n(n) {
    this.setFlag(n() - 1 === 0, true, this.isHalfBorrow(n(), 1), this.registers.F.C());
    n(n() - 1);
  }
  // 16-bits ALU
  ADD_HLn(n) {
    this.setFlag(this.registers.F.Z(), false, this.is16BitsHalfCarry(this.registers.HL(), n()), this.is16BitsCarry(this.registers.HL(), n()));
    this.registers.HL(this.registers.HL() + n());
  }
  ADD_SPn(n) {
    this.setFlag(this.registers.F.Z(), false, this.is16BitsHalfCarry(this.registers.SP(), this.signed(n())), this.is16BitsCarry(this.registers.SP(), this.signed(n())));
    this.registers.SP(this.registers.SP() + this.signed(n()));
  }
  INC_nn(nn) {
    nn(nn() + 1);
  }
  DEC_nn(nn) {
    nn(nn() - 1);
  }
  // Miscellaneous
  SWAP_n(n) {
    const upperNibbles = (n() >> 4) & 0xf, lowerNibbles = n() & 0xf;
    this.setFlag(lowerNibbles << 4 | upperNibbles === 0, false, false, false);
    n(lowerNibbles << 4 | upperNibbles);
  }
  DAA() {
    if (this.registers.F.N()) {
      if (this.registers.F.C()) {
        this.registers.A(this.registers.A() - 0x60);
      } else {
        this.registers.A(this.registers.A() - 0x06);
      }
    } else {
      if (this.registers.F.C() || (this.registers.A() & 0xff) > 0x99) {
        this.registers.A(this.registers.A() + 0x60);
        this.registers.F.C(true);
      }
      if (this.registers.F.H() ||  (this.registers.A() & 0x0f) > 0x09) {
        this.registers.A(this.registers.A() + 0x06);
      }
    }

    this.registers.F.Z(this.registers.A() === 0);
    this.registers.F.H(false);
  }
  CPL() {
    this.setFlag(this.registers.F.Z(), true, true, this.registers.F.C());
    this.registers.A(~this.registers.A());
  }
  CCF() {
    this.setFlag(this.registers.F.Z(), false, false, this.registers.F.C() === 0);
  }
  SCF() {
    this.setFlag(this.registers.F.Z(), false, false, true);
  }
  NOP() {
  }
  HALT() {
    // TODO
  }
  STOP() {
    // TODO
  }
  DI() {
    this.IME = false;
  }
  EI() {
    this.IME = true;
  }
  // Rotates & Shifts
  RLCA() {
    const result = this.registers.A() << 1 | (this.registers.A() & 0x80) >> 7;
    this.setFlag(result === 0, false, false, this.registers.A() & 0x80);
    this.registers.A(result);
  }
  RLA() {
    const result = this.registers.A() << 1 | this.registers.F.C();
    this.setFlag(result === 0, false, false, this.registers.A() & 0x80);
    this.registers.A(result);
  }
  RRCA() {
    const result = this.registers.A() >> 1 | (this.registers.A() & 0x01) << 7;
    this.setFlag(result === 0, false, false, this.registers.A() & 0x01);
    this.registers.A(result);
  }
  RRA() {
    const result = this.registers.A() >> 1 | this.registers.F.C() << 7;
    this.setFlag(result === 0, false, false, this.registers.A() & 0x01);
    this.registers.A(result);
  }
  RLC_n(n) {
    const result = n() << 1 | (n() & 0x80) >> 7;
    this.setFlag(result === 0, false, false, n() & 0x80);
    n(result);
  }
  RL_n(n) {
    const result = n() << 1 | this.registers.F.C();
    this.setFlag(result === 0, false, false, n() & 0x80);
    n(result);
  }
  RRC_n(n) {
    const result = n() >> 1 | (n() & 0x01) << 7;
    this.setFlag(result === 0, false, false, n() & 0x01);
    n(result);
  }
  RR_n(n) {
    const result = n() >> 1 | this.registers.F.C() << 7;
    this.setFlag(result === 0, false, false, n() & 0x01);
    n(result);
  }
  SLA_n(n) {
    const result = (n() << 1) & 0xff;
    this.setFlag(result === 0, false, false, n() & 0x80);
    n(result);
  }
  SRA_n(n) {
    const result = n() >> 1 | (n() & 0x80) << 7;
    this.setFlag(result === 0, false, false, n() & 0x01);
    n(result);
  }
  SRL_n(n) {
    const result = (n() >> 1) & 0xff;
    this.setFlag(result === 0, false, false, n() & 0x01);
    n(result);
  }
  // Bit Opcodes
  BIT_b_r(b, r) {
    this.setFlag((r() & (1 << b)) === 0, false, true, this.registers.F.C());
  }
  SET_b_r(b, r) {
    r(true, b);
  }
  RES_b_r(b, r) {
    r(false, b);
  }
  // Jumps
  JP_nn(nn) {
    this.registers.PC(nn);
  }
  JP_cc_nn(cc, nn) {
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
  JP_HL() {
    this.registers.PC(this.registers.HL());
  }
  JR_n(n) {
    this.registers.PC(this.registers.PC() + this.signed(n));
  }
  JR_cc_n(cc, n) {
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
  CALL_nn(nn) {
    this.MMU.writeWord(this.registers.SP() - 2, this.registers.PC() + 2);
    this.registers.SP(this.registers.SP() - 2);

    this.registers.PC(nn);
  }
  CALL_cc_nn(cc, nn) {
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
  RST_n(n) {
    this.MMU.writeWord(this.registers.SP() - 2, this.registers.PC());
    this.registers.SP(this.registers.SP() - 2);

    this.registers.PC(n & 0xff);
  }
  RET() {
    const lowByte = this.MMU.readByte(this.registers.SP());
    const highByte = this.MMU.readByte(this.registers.SP() + 1);

    this.registers.PC(highByte << 8 | lowByte & 0xff);
    this.registers.SP(this.registers.SP() + 2);
  }
  RET_cc(cc) {
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
  RETI() {
    this.RET();
    this.EI();
  }
  // Returns
}
