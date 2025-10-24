import { Injectable } from '@nestjs/common';

@Injectable()
export class InstructionUtilities {
  public exists(params: { instruction: string; instructionKey: string }): boolean {
    const { instruction, instructionKey } = params;

    if (typeof instruction === 'string') {
      return instruction.indexOf(instructionKey) > -1;
    } else {
      return false;
    }
  }
}
