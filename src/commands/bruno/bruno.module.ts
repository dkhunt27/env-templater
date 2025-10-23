import { Module } from '@nestjs/common';
import { BrunoCommand, BrunoCommandQuestions } from './bruno.command.ts';
import { BrunoService } from './bruno.service.ts';

@Module({
  imports: [],
  providers: [BrunoCommandQuestions, BrunoCommand, BrunoService],
  exports: [],
})
export class BrunoCommandModule {}
