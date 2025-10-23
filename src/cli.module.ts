import { Module } from '@nestjs/common';
import { BrunoCommandModule } from './commands/bruno/bruno.module.ts';

@Module({
  imports: [BrunoCommandModule],
})
export class CliModule {}
