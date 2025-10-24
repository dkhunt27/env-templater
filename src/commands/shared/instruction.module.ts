import { Module } from '@nestjs/common';
import { AwsSsmService } from './aws-ssm.service.ts';
import { InstructionService } from './instruction.service.ts';
import { InstructionUtilities } from './instruction.utilities.ts';
import { InstructionSsmParameterService } from './instruction-ssm-parameter.service.ts';

@Module({
  imports: [],
  providers: [AwsSsmService, InstructionSsmParameterService, InstructionService, InstructionUtilities],
  exports: [InstructionService],
})
export class InstructionModule {}
