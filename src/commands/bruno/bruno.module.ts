import { Module } from '@nestjs/common';
import { InstructionModule } from '../shared/instruction.module.ts';
import { BrunoCommand, BrunoCommandQuestions } from './bruno.command.ts';
import { BrunoEnvTemplateService } from './bruno.service.ts';
import { BrunoUtilities } from './bruno.utilities.ts';

@Module({
  imports: [InstructionModule],
  providers: [BrunoCommandQuestions, BrunoCommand, BrunoEnvTemplateService, BrunoUtilities],
  exports: [BrunoEnvTemplateService],
})
export class BrunoCommandModule {}
