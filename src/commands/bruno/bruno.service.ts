import { Injectable } from '@nestjs/common';
import { setLogger } from '../../utils.ts';
import type { BrunoOptions } from './bruno.command.ts';

@Injectable()
export class BrunoService {
  private readonly logService = setLogger({ context: BrunoService.name });

  async exec(options: BrunoOptions): Promise<void> {
    this.logService.log(`Hello ${options.name}!`);
    this.logService.log(`Boolean was: ${options.bool}`);
  }
}
