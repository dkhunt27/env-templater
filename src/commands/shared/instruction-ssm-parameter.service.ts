import type { GetParameterCommandInput, GetParameterCommandOutput, SSMClientConfig } from '@aws-sdk/client-ssm';
import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { AwsSsmService } from './aws-ssm.service';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { InstructionUtilities } from './instruction.utilities';

const INSTRUCTION_KEY = '::ssm::';

@Injectable()
export class InstructionSsmParameterService {
  constructor(
    private readonly awsSsmService: AwsSsmService,
    private readonly utilities: InstructionUtilities,
  ) {}

  public init(params?: SSMClientConfig): Promise<void> {
    return this.awsSsmService.init(params);
  }

  public exists(params: { instruction: string }): boolean {
    return this.utilities.exists({
      instruction: params.instruction,
      instructionKey: INSTRUCTION_KEY,
    });
  }

  public async execute(params: { instruction: string; awsRegion?: string }): Promise<string> {
    const { instruction, awsRegion } = params;

    if (instruction.indexOf(INSTRUCTION_KEY) > -1) {
      const parts = instruction.split('::');
      if (parts.length !== 4) {
        throw new Error(
          `${InstructionSsmParameterService.name} ssm param instruction not in expected format: ${instruction}`,
        );
      }

      const ssmKey = parts[2];

      const input: GetParameterCommandInput = {
        Name: ssmKey,
        WithDecryption: true,
      };

      const awsRegionToUse = awsRegion ?? process.env.AWS_REGION ?? 'us-west-2';

      let ssmVal: GetParameterCommandOutput;
      try {
        ssmVal = await this.awsSsmService.getParameter({ input });
      } catch (err) {
        const errName = (err as Error).name;
        const errMsg = (err as Error).message;
        const displayErr = errName ? `${errName}: ${errMsg}` : errMsg ? errMsg : err;

        throw new Error(
          `${InstructionSsmParameterService.name} Could not retrieve SSM Param Key (${ssmKey}) in region (${awsRegionToUse}) error: ${displayErr}`,
        );
      }

      if (!ssmVal || !ssmVal.Parameter || !ssmVal.Parameter.Value) {
        throw new Error(
          `${InstructionSsmParameterService.name} Could not retrieve SSM Param Key (${ssmKey}) in region (${awsRegionToUse}) or empty`,
        );
      }

      return `${parts[0]}${ssmVal.Parameter.Value}${parts[3]}`;
    } else {
      return instruction;
    }
  }
}
