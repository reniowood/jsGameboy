export default class CPU {
  constructor() {
    this.reset();
    this.updateInstMap();
  }
  updateInstMap() {
    this.instMap = [
      () => { this.NOP(); }, // 1
      () => { // 3
        this.LD_n_nn(this.registers.BC, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        },
      () => { this.LD_n_A((value) => (this.MMU.writeByte(this.registers.BC(), value))); }, // 2
      () => { this.INC_nn(this.registers.BC); }, // 2
      () => { this.INC_n(this.registers.B(), this.registers.B); }, // 1
      () => { this.DEC_n(this.registers.B(), this.registers.B); }, // 1
      () => { // 2
        this.LD_nn_n(this.registers.B, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.RLCA(); }, // 1
      () => { // 5
        this.LD_nn_SP(this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        },
      () => { this.ADD_HLn(this.registers.BC); }, // 2
      () => { this.LD_A_n(() => (this.MMU.readByte(this.registers.BC()))); }, // 2
      () => { this.DEC_nn(this.registers.BC); },  // 2
      () => { this.INC_n(this.registers.C(), this.registers.C); }, // 1
      () => { this.DEC_n(this.registers.C(), this.registers.C); }, // 1
      () => { // 2
        this.LD_nn_n(this.registers.C, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.RRCA(); }, // 1
      () => { this.STOP(); }, // 0
      () => { // 3
        this.LD_n_nn(this.registers.DE, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        },
      () => { this.LD_n_A((value) => (this.MMU.writeByte(this.registers.DE(), value))); }, // 2
      () => { this.INC_nn(this.registers.DE); }, // 2
      () => { this.INC_n(this.registers.D(), this.registers.D); }, // 1
      () => { this.DEC_n(this.registers.D(), this.registers.D); }, // 1
      () => { // 2
        this.LD_nn_n(this.registers.D, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.RLA(); }, // 1
      () => { // 3
        this.JR_n(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.ADD_HLn(this.registers.DE); }, // 2
      () => { this.LD_A_n(() => (this.MMU.readByte(this.registers.DE()))); }, // 2
      () => { this.DEC_nn(this.registers.DE); }, // 2
      () => { this.INC_n(this.registers.E(), this.registers.E); }, // 1
      () => { this.DEC_n(this.registers.E(), this.registers.E); }, // 1
      () => { // 2
        this.LD_nn_n(this.registers.E, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.RRA(); }, // 1
      () => { // 3/2
        this.JR_cc_n('NZ');
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { // 3
        this.LD_n_nn(this.registers.HL, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        },
      () => { // 2 LD (HL+), A = LDI (HL), A = LD (HL), A - INC_nn HL
        this.LD_n_A((value) => (this.MMU.writeByte(this.registers.HL(), value)));
        this.registers.HL(this.registers.HL() + 1);
        },
      () => { this.INC_nn(this.registers.HL); }, // 2
      () => { this.INC_n(this.registers.H(), this.registers.H); }, // 1
      () => { this.DEC_n(this.registers.H(), this.registers.H); }, // 1
      () => { // 2
        this.LD_nn_n(this.registers.H, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.DAA(); }, // 1
      () => { // 3/2
        this.JR_cc_n('Z');
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.ADD_HLn(this.registers.HL); }, // 2
      () => { // 2 LD A, (HL+) = LDI A, (HL) = LD A, (HL) - INC_nn HL
        this.LD_A_n(() => (this.MMU.readByte(this.registers.HL())));
        this.registers.HL(this.registers.HL() + 1);
        },
      () => { this.DEC_nn(this.registers.HL); }, // 2
      () => { this.INC_n(this.registers.L(), this.registers.L); }, // 1
      () => { this.DEC_n(this.registers.L(), this.registers.L); }, // 1
      () => { // 2
        this.LD_nn_n(this.registers.L, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.CPL(); }, // 1
      () => { // 3/2
        this.JR_cc_n('NC');
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { // 3
        this.LD_n_nn(this.registers.SP, this.MMU.readWord(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 2);
        },
      () => { // 2 LD (HL-), A = LDD (HL), A = LD (HL), A - DEC_nn HL
        this.LD_n_A((value) => (this.MMU.writeByte(this.registers.HL(), value)));
        this.registers.HL(this.registers.HL() - 1);
        },
      () => { this.INC_nn(this.registers.SP); }, // 2
      () => { // 3
        const value = this.MMU.readByte(this.registers.HL());
        this.INC_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
        },
      () => { // 3
        const value = this.MMU.readByte(this.registers.HL());
        this.DEC_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
        },
      () => { // 3
        this.LD_nn_n((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.SCF(); }, // 1
      () => { // 3/2
        this.JR_cc_n('C');
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.ADD_HLn(this.registers.SP); }, // 2
      () => { // 2 LD A, (HL-) = LDD A, (HL) = LD A, (HL) - DEC_nn HL
        this.LD_A_n(() => (this.MMU.readByte(this.registers.HL())));
        this.registers.HL(this.registers.HL() - 1);
        },
      () => { this.DEC_nn(this.registers.SP); }, // 2
      () => { this.INC_n(this.registers.A(), this.registers.A); }, // 1
      () => { this.DEC_n(this.registers.A(), this.registers.A); }, // 1
      () => { // 2
        this.LD_nn_n(this.registers.A, this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
        },
      () => { this.CCF(); }, // 1
      () => { this.LD_r1_r2(this.registers.B, this.registers.B); }, // 1
      () => { this.LD_r1_r2(this.registers.B, this.registers.C); }, // 1
      () => { this.LD_r1_r2(this.registers.B, this.registers.D); }, // 1
      () => { this.LD_r1_r2(this.registers.B, this.registers.E); }, // 1
      () => { this.LD_r1_r2(this.registers.B, this.registers.H); }, // 1
      () => { this.LD_r1_r2(this.registers.B, this.registers.L); }, // 1
      () => { this.LD_r1_r2(this.registers.B, () => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.LD_n_A(this.registers.B); }, // 1
      () => { this.LD_r1_r2(this.registers.C, this.registers.B); }, // 1
      () => { this.LD_r1_r2(this.registers.C, this.registers.C); }, // 1
      () => { this.LD_r1_r2(this.registers.C, this.registers.D); }, // 1
      () => { this.LD_r1_r2(this.registers.C, this.registers.E); }, // 1
      () => { this.LD_r1_r2(this.registers.C, this.registers.H); }, // 1
      () => { this.LD_r1_r2(this.registers.C, this.registers.L); }, // 1
      () => { this.LD_r1_r2(this.registers.C, () => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.LD_n_A(this.registers.C); }, // 1
      () => { this.LD_r1_r2(this.registers.D, this.registers.B); }, // 1
      () => { this.LD_r1_r2(this.registers.D, this.registers.C); }, // 1
      () => { this.LD_r1_r2(this.registers.D, this.registers.D); }, // 1
      () => { this.LD_r1_r2(this.registers.D, this.registers.E); }, // 1
      () => { this.LD_r1_r2(this.registers.D, this.registers.H); }, // 1
      () => { this.LD_r1_r2(this.registers.D, this.registers.L); }, // 1
      () => { this.LD_r1_r2(this.registers.D, () => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.LD_n_A(this.registers.D); }, // 1
      () => { this.LD_r1_r2(this.registers.E, this.registers.B); }, // 1
      () => { this.LD_r1_r2(this.registers.E, this.registers.C); }, // 1
      () => { this.LD_r1_r2(this.registers.E, this.registers.D); }, // 1
      () => { this.LD_r1_r2(this.registers.E, this.registers.E); }, // 1
      () => { this.LD_r1_r2(this.registers.E, this.registers.H); }, // 1
      () => { this.LD_r1_r2(this.registers.E, this.registers.L); }, // 1
      () => { this.LD_r1_r2(this.registers.E, () => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.LD_n_A(this.registers.E); }, // 1
      () => { this.LD_r1_r2(this.registers.H, this.registers.B); }, // 1
      () => { this.LD_r1_r2(this.registers.H, this.registers.C); }, // 1
      () => { this.LD_r1_r2(this.registers.H, this.registers.D); }, // 1
      () => { this.LD_r1_r2(this.registers.H, this.registers.E); }, // 1
      () => { this.LD_r1_r2(this.registers.H, this.registers.H); }, // 1
      () => { this.LD_r1_r2(this.registers.H, this.registers.L); }, // 1
      () => { this.LD_r1_r2(this.registers.H, () => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.LD_n_A(this.registers.H); }, // 1
      () => { this.LD_r1_r2(this.registers.L, this.registers.B); }, // 1
      () => { this.LD_r1_r2(this.registers.L, this.registers.C); }, // 1
      () => { this.LD_r1_r2(this.registers.L, this.registers.D); }, // 1
      () => { this.LD_r1_r2(this.registers.L, this.registers.E); }, // 1
      () => { this.LD_r1_r2(this.registers.L, this.registers.H); }, // 1
      () => { this.LD_r1_r2(this.registers.L, this.registers.L); }, // 1
      () => { this.LD_r1_r2(this.registers.L, () => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.LD_n_A(this.registers.L); }, // 1
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.B); }, // 2
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.C); }, // 2
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.D); }, // 2
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.E); }, // 2
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.H); }, // 2
      () => { this.LD_r1_r2((value) => (this.MMU.writeByte(this.registers.HL(), value)), this.registers.L); }, // 2
      () => { this.HALT(); }, // 0
      () => { this.LD_n_A((value) => (this.MMU.writeByte(this.registers.HL(), value))); }, // 2
      () => { this.LD_A_n(this.registers.B); }, // 1
      () => { this.LD_A_n(this.registers.C); }, // 1
      () => { this.LD_A_n(this.registers.D); }, // 1
      () => { this.LD_A_n(this.registers.E); }, // 1
      () => { this.LD_A_n(this.registers.H); }, // 1
      () => { this.LD_A_n(this.registers.L); }, // 1
      () => { this.LD_A_n(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.LD_A_n(this.registers.A); }, // 1
      () => { this.ADD_An(this.registers.B); }, // 1
      () => { this.ADD_An(this.registers.C); }, // 1
      () => { this.ADD_An(this.registers.D); }, // 1
      () => { this.ADD_An(this.registers.E); }, // 1
      () => { this.ADD_An(this.registers.H); }, // 1
      () => { this.ADD_An(this.registers.L); }, // 1
      () => { this.ADD_An(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.ADD_An(this.registers.A); }, // 1
      () => { this.ADC_An(this.registers.B); }, // 1
      () => { this.ADC_An(this.registers.C); }, // 1
      () => { this.ADC_An(this.registers.D); }, // 1
      () => { this.ADC_An(this.registers.E); }, // 1
      () => { this.ADC_An(this.registers.H); }, // 1
      () => { this.ADC_An(this.registers.L); }, // 1
      () => { this.ADC_An(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.ADC_An(this.registers.A); }, // 1
      () => { this.SUB_n(this.registers.B); }, // 1
      () => { this.SUB_n(this.registers.C); }, // 1
      () => { this.SUB_n(this.registers.D); }, // 1
      () => { this.SUB_n(this.registers.E); }, // 1
      () => { this.SUB_n(this.registers.H); }, // 1
      () => { this.SUB_n(this.registers.L); }, // 1
      () => { this.SUB_n(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.SUB_n(this.registers.A); }, // 1
      () => { this.SBC_n(this.registers.B); }, // 1
      () => { this.SBC_n(this.registers.C); }, // 1
      () => { this.SBC_n(this.registers.D); }, // 1
      () => { this.SBC_n(this.registers.E); }, // 1
      () => { this.SBC_n(this.registers.H); }, // 1
      () => { this.SBC_n(this.registers.L); }, // 1
      () => { this.SBC_n(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.SBC_n(this.registers.A); }, // 1
      () => { this.AND_n(this.registers.B); }, // 1
      () => { this.AND_n(this.registers.C); }, // 1
      () => { this.AND_n(this.registers.D); }, // 1
      () => { this.AND_n(this.registers.E); }, // 1
      () => { this.AND_n(this.registers.H); }, // 1
      () => { this.AND_n(this.registers.L); }, // 1
      () => { this.AND_n(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.AND_n(this.registers.A); }, // 1
      () => { this.XOR_n(this.registers.B); }, // 1
      () => { this.XOR_n(this.registers.C); }, // 1
      () => { this.XOR_n(this.registers.D); }, // 1
      () => { this.XOR_n(this.registers.E); }, // 1
      () => { this.XOR_n(this.registers.H); }, // 1
      () => { this.XOR_n(this.registers.L); }, // 1
      () => { this.XOR_n(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.XOR_n(this.registers.A); }, // 1
      () => { this.OR_n(this.registers.B); }, // 1
      () => { this.OR_n(this.registers.C); }, // 1
      () => { this.OR_n(this.registers.D); }, // 1
      () => { this.OR_n(this.registers.E); }, // 1
      () => { this.OR_n(this.registers.H); }, // 1
      () => { this.OR_n(this.registers.L); }, // 1
      () => { this.OR_n(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.OR_n(this.registers.A); }, // 1
      () => { this.CP_n(this.registers.B); }, // 1
      () => { this.CP_n(this.registers.C); }, // 1
      () => { this.CP_n(this.registers.D); }, // 1
      () => { this.CP_n(this.registers.E); }, // 1
      () => { this.CP_n(this.registers.H); }, // 1
      () => { this.CP_n(this.registers.L); }, // 1
      () => { this.CP_n(() => (this.MMU.readByte(this.registers.HL()))); }, // 2
      () => { this.CP_n(this.registers.A); }, // 1
      () => { this.RET_cc('NZ'); }, // 5/2
      () => { this.POP_nn(this.registers.BC); }, // 3
      () => { this.JP_cc_nn('NZ'); }, // 4/3
      () => { this.JP_nn(this.MMU.readWord(this.registers.PC())); }, // 4
      () => { this.CALL_cc_nn('NZ'); }, // 6/3
      () => { this.PUSH_nn(this.registers.BC); }, // 4
      () => { // 2
        this.ADD_An(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x00); }, // 4
      () => { this.RET_cc('Z'); }, // 5/2
      () => { this.RET(); }, // 4
      () => { this.JP_cc_nn('Z'); }, // 4/3
      () => { // 0
        const opcode = this.MMU.readByte(this.registers.PC());
        this.cbInstMap[opcode]();
        this.registers.PC(this.registers.PC() + 1);
        this.registers.PC(this.registers.PC() & 0xffff);
        },
      () => { this.CALL_cc_nn('Z'); }, // 6/3
      () => { this.CALL_nn(this.MMU.readWord(this.registers.PC())); }, // 6
      () => { // 2
        this.ADC_An(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x08); }, // 4
      () => { this.RET_cc('NC'); }, // 5/2
      () => { this.POP_nn(this.registers.DE); }, // 3
      () => { this.JP_cc_nn('NC'); }, // 4/3
      this.NOP,
      () => { this.CALL_cc_nn('NC'); }, // 6/3
      () => { this.PUSH_nn(this.registers.DE); }, // 4
      () => { // 2
        this.SUB_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x10); }, // 4
      () => { this.RET_cc('C'); }, // 5/2
      () => { this.RETI(); },  // 4
      () => { this.JP_cc_nn('C'); }, // 4/3
      this.NOP,
      () => { this.CALL_cc_nn('C'); }, // 6/3
      this.NOP,
      () => { // 2
        this.SBC_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x18); },  // 4
      () => { // 3
        this.LDH_n_A(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.POP_nn(this.registers.HL); }, // 3
      () => { this.LD_C_A(); }, // 2
      this.NOP,
      this.NOP,
      () => { this.PUSH_nn(this.registers.HL); }, // 4
      () => { // 2
        this.AND_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x20); }, // 4
      () => { // 4
        this.ADD_SPn(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.JP_HL(); }, // 1
      () => { // 4
        this.LD_n_A((value) => (this.MMU.writeByte(this.MMU.readWord(this.registers.PC()), value)));
        this.registers.PC(this.registers.PC() + 2);
      },
      this.NOP,
      this.NOP,
      this.NOP,
      () => { // 2
        this.XOR_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x28); }, // 4
      () => { // 3
        this.LDH_A_n(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.POP_nn(this.registers.AF); }, // 3
      () => { this.LD_A_C(); }, // 2
      () => { this.DI(); }, // 1
      this.NOP,
      () => { this.PUSH_nn(this.registers.AF); }, // 4
      () => { // 2
        this.OR_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x30); }, // 4
      () => { // 3
        this.LDHL_SP_n(this.MMU.readByte(this.registers.PC()));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.LD_SP_HL(); }, // 2
      () => { // 4
        this.LD_A_n(() => {
          const addr = this.MMU.readWord(this.registers.PC());
          
          return this.MMU.readByte(addr);
        });

        this.registers.PC(this.registers.PC() + 2);
      },
      () => { this.EI(); }, // 1
      this.NOP,
      this.NOP,
      () => { // 2
        this.CP_n(() => (this.MMU.readByte(this.registers.PC())));
        this.registers.PC(this.registers.PC() + 1);
      },
      () => { this.RST_n(0x38); }, // 4
    ];

    this.cbInstMap = [
      () => { this.RLC_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.RLC_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.RLC_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.RLC_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.RLC_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.RLC_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.RLC_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.RLC_n(this.registers.A(), this.registers.A); }, // 2
      () => { this.RRC_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.RRC_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.RRC_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.RRC_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.RRC_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.RRC_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.RRC_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.RRC_n(this.registers.A(), this.registers.A); }, // 2
      () => { this.RL_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.RL_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.RL_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.RL_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.RL_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.RL_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.RL_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.RL_n(this.registers.A(), this.registers.A); }, // 2
      () => { this.RR_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.RR_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.RR_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.RR_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.RR_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.RR_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.RR_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.RR_n(this.registers.A(), this.registers.A); }, // 2
      () => { this.SLA_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.SLA_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.SLA_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.SLA_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.SLA_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.SLA_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.SLA_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.SLA_n(this.registers.A(), this.registers.A); }, // 2
      () => { this.SRA_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.SRA_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.SRA_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.SRA_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.SRA_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.SRA_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.SRA_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.SRA_n(this.registers.A(), this.registers.A); }, // 2
      () => { this.SWAP_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.SWAP_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.SWAP_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.SWAP_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.SWAP_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.SWAP_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.SWAP_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.SWAP_n(this.registers.A(), this.registers.A); }, // 2
      () => { this.SRL_n(this.registers.B(), this.registers.B); }, // 2
      () => { this.SRL_n(this.registers.C(), this.registers.C); }, // 2
      () => { this.SRL_n(this.registers.D(), this.registers.D); }, // 2
      () => { this.SRL_n(this.registers.E(), this.registers.E); }, // 2
      () => { this.SRL_n(this.registers.H(), this.registers.H); }, // 2
      () => { this.SRL_n(this.registers.L(), this.registers.L); }, // 2
      () => { // 4
        const value = this.MMU.readByte(this.registers.HL());
        this.SRL_n(value, (value) => (this.MMU.writeByte(this.registers.HL(), value)));
      },
      () => { this.SRL_n(this.registers.A(), this.registers.A); }, // 2
    ];

    [this.BIT_b_r].forEach((op) => {
      for (let i=0; i<8; i+=1) {
        this.cbInstMap = this.cbInstMap.concat([
          () => { op.call(this, i, this.registers.B); }, // 2
          () => { op.call(this, i, this.registers.C); }, // 2
          () => { op.call(this, i, this.registers.D); }, // 2
          () => { op.call(this, i, this.registers.E); }, // 2
          () => { op.call(this, i, this.registers.H); }, // 2
          () => { op.call(this, i, this.registers.L); }, // 2
          () => { // 3
            const byte = this.MMU.readByte(this.registers.HL());

            op.call(this, i, () => (byte));
          },
          () => { op.call(this, i, this.registers.A); }, // 2
        ]);
      }
    });
    [this.RES_b_r, this.SET_b_r].forEach((op) => {
      for (let i=0; i<8; i+=1) {
        this.cbInstMap = this.cbInstMap.concat([
          () => { op.call(this, i, this.registers.B); }, // 2
          () => { op.call(this, i, this.registers.C); }, // 2
          () => { op.call(this, i, this.registers.D); }, // 2
          () => { op.call(this, i, this.registers.E); }, // 2
          () => { op.call(this, i, this.registers.H); }, // 2
          () => { op.call(this, i, this.registers.L); }, // 2
          () => { // 4
            const byte = this.MMU.readByte(this.registers.HL());
            
            op.call(this, i, (value, index) => {
              if (value) {
                this.MMU.writeByte(this.registers.HL(), byte | (1 << index));
              } else {
                this.MMU.writeByte(this.registers.HL(), byte & ~(1 << index));
              }
            });
          },
          () => { op.call(this, i, this.registers.A); }, // 2
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
        this.registers.F(value & 0xf0);
      },
    };

    this.IME = false;
    this.justEIExecuted = false;
    this.isHalted = false;
    this.isStopped = false;
  }
  step() {
    this.interrupt.isOccured();
    this.justEIExecuted = false;

    const opcode = this.MMU.readByte(this.registers.PC());
    if (!this.isHalted) {
      if (this.logOn) {
        // console.log('IME: ' + this.IME + ', divider: ' + this.clock.divider + ', dividerCycles: ' + this.clock.dividerCycles);
        // console.log('IME: ' + this.IME + ', timer: ' + (this.interrupt.interruptEnabled.timer && this.interrupt.interruptFlag.timer) + ', runningTimer: ' + this.clock.control.runningTimer + ', counter: ' + this.clock.counter);
        // console.log('before: ' + this.clock.counterCycles);
      }

      if (this.logOn) {
        console.log('0x' + this.registers.PC().toString(16) + ', 0x' + opcode.toString(16));
        console.log(this.GPU.OAMDMAList);
      }
      // if (this.registers.PC() == 0xff80) {
      if (opcode == 0xe0) {
        // console.log(this.registers.PC().toString(16));
        // console.log(this.MMU.readByte(this.registers.PC() + 1).toString(16));
        // console.log(this.MMU.readByte(this.registers.PC() + 2).toString(16));
        // this.logOn = true;
      }

      this.registers.PC(this.registers.PC() + 1);
      this.registers.PC(this.registers.PC() & 0xffff);
    
      this.instMap[opcode]();

      if (this.logOn) {
        // console.log('IME: ' + this.IME + ', divider: ' + this.clock.divider + ', dividerCycles: ' + this.clock.dividerCycles);
        // console.log('IME: ' + this.IME + ', timer: ' + (this.interrupt.interruptEnabled.timer && this.interrupt.interruptFlag.timer) + ', runningTimer: ' + this.clock.control.runningTimer + ', counter: ' + this.clock.counter);
        // console.log('after: ' + this.clock.counterCycles);
      }
    }
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
    this.clock.step();
  }
  LDHL_SP_n(n) {
    this.setFlag(false, false, this.isHalfCarry(this.registers.SP(), this.signed(n)), this.isCarry(this.registers.SP(), this.signed(n)));
    this.registers.HL(this.registers.SP() + this.signed(n));
    this.clock.step();
  }
  LD_nn_SP(nn) {
    this.MMU.writeWord(nn & 0xffff, this.registers.SP());
  }
  PUSH_nn(nn) {
    this.clock.step();
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
  isHalfCarry(r1, r2, r3) {
    if (r3 !== undefined) {
      return (r1 & 0xf) + (r2 & 0xf) + (r3 & 0xf) > 0xf;
    } else {
      if (r2 >= 0) {
        return (r1 & 0xf) + (r2 & 0xf) > 0xf;
      } else {
        return ((r1 + r2) & 0xf) <= (r1 & 0xf);
      }
    }
  }
  isCarry(r1, r2, r3) {
    if (r3 !== undefined) {
      return (r1 & 0xff) + (r2 & 0xff) + (r3 & 0xff) > 0xff;
    } else {
      if (r2 >= 0) {
        return (r1 & 0xff) + (r2 & 0xff) > 0xff;
      } else {
        return ((r1 + r2) & 0xff) <= (r1 & 0xff);
      }
    }
  }
  is16BitsHalfCarry(...registers) {
    return registers.reduce((sum, register) => (sum += register & 0xfff), 0) > 0xfff;
  }
  is16BitsCarry(...registers) {
    return registers.reduce((sum, register) => (sum += register), 0) > 0xffff;
  }
  isHalfBorrow(r1, r2, r3) {
    if (r3 !== undefined) {
      return (r1 & 0xf) - (r2 & 0xf) - (r3 & 0xf) < 0;
    } else {
      return (r1 & 0xf) - (r2 & 0xf) < 0;
    }
  }
  isBorrow(r1, r2, r3) {
    if (r3 !== undefined) {
      return r1 - r2 - r3 < 0;
    } else {
      return r1 - r2 < 0;
    }
  }
  // 8-bits ALU
  ADD_An(n) {
    const byte = n();
    this.setFlag(((this.registers.A() + byte) & 0xff) === 0, false, this.isHalfCarry(this.registers.A(), byte), this.isCarry(this.registers.A(), byte));
    this.registers.A(this.registers.A() + byte);
  }
  ADC_An(n) {
    const byte = n();
    const carryFlag = this.registers.F.C() ? 1 : 0;
    this.setFlag(((this.registers.A() + byte + carryFlag) & 0xff) === 0, false, this.isHalfCarry(this.registers.A(), byte, carryFlag), this.isCarry(this.registers.A(), byte, carryFlag));
    this.registers.A(this.registers.A() + byte + carryFlag);
  }
  SUB_n(n) {
    const byte = n();
    this.setFlag(((this.registers.A() - byte) & 0xff) === 0, true, this.isHalfBorrow(this.registers.A(), byte), this.isBorrow(this.registers.A(), byte));
    this.registers.A(this.registers.A() - byte);
  }
  SBC_n(n) {
    const byte = n();
    const carryFlag = this.registers.F.C() ? 1 : 0;
    this.setFlag(((this.registers.A() - byte - carryFlag) & 0xff) === 0, true, this.isHalfBorrow(this.registers.A(), byte, carryFlag), this.isBorrow(this.registers.A(), byte, carryFlag));
    this.registers.A(this.registers.A() - byte - carryFlag);
  }
  AND_n(n) {
    const byte = n();
    this.setFlag((this.registers.A() & byte) === 0, false, true, false);
    this.registers.A(this.registers.A() & byte);
  }
  OR_n(n) {
    const byte = n();
    this.setFlag((this.registers.A() | byte) === 0, false, false, false);
    this.registers.A(this.registers.A() | byte);
  }
  XOR_n(n) {
    const byte = n();
    this.setFlag((this.registers.A() ^ byte) === 0, false, false, false);
    this.registers.A(this.registers.A() ^ byte);
  }
  CP_n(n) {
    const byte = n();
    this.setFlag(this.registers.A() === byte, true, this.isHalfBorrow(this.registers.A(), byte), this.isBorrow(this.registers.A(), byte));
  }
  INC_n(s, d) {
    this.setFlag(((s + 1) & 0xff) === 0, false, this.isHalfCarry(s, 1), this.registers.F.C());
    d(s + 1);
  }
  DEC_n(s, d) {
    this.setFlag(((s - 1) & 0xff) === 0, true, this.isHalfBorrow(s, 1), this.registers.F.C());
    d(s - 1);
  }
  // 16-bits ALU
  ADD_HLn(n) {
    const byte = n();
    this.setFlag(this.registers.F.Z(), false, this.is16BitsHalfCarry(this.registers.HL(), byte), this.is16BitsCarry(this.registers.HL(), byte));
    this.registers.HL(this.registers.HL() + byte);
    this.clock.step();
  }
  ADD_SPn(n) {
    const byte = n();
    this.setFlag(false, false, this.isHalfCarry(this.registers.SP(), this.signed(byte)), this.isCarry(this.registers.SP(), this.signed(byte)));
    this.registers.SP(this.registers.SP() + this.signed(byte));
    this.clock.step();
    this.clock.step();
  }
  INC_nn(nn) {
    nn(nn() + 1);
    this.clock.step();
  }
  DEC_nn(nn) {
    nn(nn() - 1);
    this.clock.step();
  }
  // Miscellaneous
  SWAP_n(s, d) {
    const upperNibbles = (s >> 4) & 0xf, lowerNibbles = s & 0xf;
    this.setFlag((lowerNibbles << 4 | upperNibbles) === 0, false, false, false);
    d(lowerNibbles << 4 | upperNibbles);
  }
  DAA() {
    let a = this.registers.A();

    if (this.registers.F.N()) {
      if (this.registers.F.H()) {
        a = (a - 0x06) & 0xff;
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
    this.isHalted = true;
  }
  STOP() {
  }
  DI() {
    this.IME = false;
  }
  EI() {
    this.IME = true;
    this.justEIExecuted = true;
  }
  // Rotates & Shifts
  RLCA() {
    const result = this.registers.A() << 1 | (this.registers.A() & 0x80) >> 7;
    this.setFlag(false, false, false, this.registers.A() & 0x80);
    this.registers.A(result);
  }
  RLA() {
    const result = this.registers.A() << 1 | this.registers.F.C();
    this.setFlag(false, false, false, this.registers.A() & 0x80);
    this.registers.A(result);
  }
  RRCA() {
    const result = this.registers.A() >> 1 | (this.registers.A() & 0x01) << 7;
    this.setFlag(false, false, false, this.registers.A() & 0x01);
    this.registers.A(result);
  }
  RRA() {
    const result = this.registers.A() >> 1 | this.registers.F.C() << 7;
    this.setFlag(false, false, false, this.registers.A() & 0x01);
    this.registers.A(result);
  }
  RLC_n(s, d) {
    const result = ((s << 1) & 0xff) | (s & 0x80) >> 7;
    this.setFlag(result === 0, false, false, s & 0x80);
    d(result);
  }
  RL_n(s, d) {
    const result = ((s << 1) & 0xff) | this.registers.F.C();
    this.setFlag(result === 0, false, false, s & 0x80);
    d(result);
  }
  RRC_n(s, d) {
    const result = s >> 1 | (s & 0x01) << 7;
    this.setFlag(result === 0, false, false, s & 0x01);
    d(result);
  }
  RR_n(s, d) {
    const result = s >> 1 | this.registers.F.C() << 7;
    this.setFlag(result === 0, false, false, s & 0x01);
    d(result);
  }
  SLA_n(s, d) {
    const result = (s << 1) & 0xff;
    this.setFlag(result === 0, false, false, s & 0x80);
    d(result);
  }
  SRA_n(s, d) {
    const result = s >> 1 | (s & 0x80);
    this.setFlag(result === 0, false, false, s & 0x01);
    d(result);
  }
  SRL_n(s, d) {
    const result = (s >> 1) & 0xff;
    this.setFlag(result === 0, false, false, s & 0x01);
    d(result);
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
    this.clock.step();
  }
  JP_cc_nn(cc) {
    switch (cc) {
      case 'NZ':
        if (this.registers.F.Z()) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
      case 'Z':
        if (this.registers.F.Z() === 0) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
      case 'NC':
        if (this.registers.F.C()) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
      case 'C':
        if (this.registers.F.C() === 0) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
    }

    this.registers.PC(this.MMU.readWord(this.registers.PC()));
    this.clock.step();

    return true;
  }
  JP_HL() {
    this.registers.PC(this.registers.HL());
  }
  JR_n(n) {
    this.registers.PC(this.registers.PC() + this.signed(n));
  
    this.clock.step();
  }
  JR_cc_n(cc) {
    switch (cc) {
      case 'NZ':
        if (this.registers.F.Z()) {
          this.clock.step();

          return false;
        }
        break;
      case 'Z':
        if (this.registers.F.Z() === 0) {
          this.clock.step();

          return false;
        }
        break;
      case 'NC':
        if (this.registers.F.C()) {
          this.clock.step();

          return false;
        }
        break;
      case 'C':
        if (this.registers.F.C() === 0) {
          this.clock.step();

          return false;
        }
        break;
    }

    this.registers.PC(this.registers.PC() + this.signed(this.MMU.readByte(this.registers.PC())));
    this.clock.step();

    return true;
  }
  // Calls
  CALL_nn(nn) {
    this.clock.step();

    this.MMU.writeWord(this.registers.SP() - 2, this.registers.PC() + 2);
    this.registers.SP(this.registers.SP() - 2);

    this.registers.PC(nn);
  }
  CALL_cc_nn(cc) {
    switch (cc) {
      case 'NZ':
        if (this.registers.F.Z()) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
      case 'Z':
        if (this.registers.F.Z() === 0) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
      case 'NC':
        if (this.registers.F.C()) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
      case 'C':
        if (this.registers.F.C() === 0) {
          this.registers.PC(this.registers.PC() + 2);
          this.clock.step();
          this.clock.step();

          return false;
        }
        break;
    }

    this.CALL_nn(this.MMU.readWord(this.registers.PC()));

    return true;
  }
  // Restarts
  RST_n(n) {
    this.clock.step();

    this.MMU.writeWord(this.registers.SP() - 2, this.registers.PC());
    this.registers.SP(this.registers.SP() - 2);

    this.registers.PC(n & 0xff);
  }
  RET() {
    const lowByte = this.MMU.readByte(this.registers.SP());
    const highByte = this.MMU.readByte(this.registers.SP() + 1);

    this.registers.PC(highByte << 8 | lowByte & 0xff);
    this.registers.SP(this.registers.SP() + 2);
    this.clock.step();
  }
  RET_cc(cc) {
    this.clock.step();

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
