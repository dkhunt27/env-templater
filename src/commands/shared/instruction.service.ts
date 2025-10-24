import type { SSMClientConfig } from '@aws-sdk/client-ssm';
import { Injectable } from '@nestjs/common';
import { get as _get, set as _set } from 'lodash';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { InstructionSsmParameterService } from './instruction-ssm-parameter.service.ts';

@Injectable()
export class InstructionService {
  constructor(private readonly ssmParamInstructionService: InstructionSsmParameterService) {}

  public init(params?: SSMClientConfig): Promise<void> {
    return this.ssmParamInstructionService.init(params);
  }

  public extractInstructionKeys(params: {
    exists: (_params: { instruction: string }) => boolean;
    config: Record<string, unknown>;
    keys?: string[];
    keyPath?: string;
  }): string[] {
    const { exists, config, keyPath, keys = [] } = params;

    for (const key in config) {
      const fullKeyPath = `${keyPath ? `${keyPath}.` : ''}${key}`;

      if (typeof config[key] === 'string') {
        const doesExist = exists({ instruction: config[key] as string });
        if (doesExist) {
          keys.push(fullKeyPath);
        }
      } else {
        this.extractInstructionKeys({
          exists,
          config: config[key] as Record<string, unknown>,
          keys,
          keyPath: fullKeyPath,
        });
      }
    }
    return keys;
  }

  public async processInstructions(params: { config: Record<string, unknown> }): Promise<Record<string, unknown>> {
    const { config } = params;

    // find all ssmParamInstructions and process them
    const ssmParamInstructionKeys = this.extractInstructionKeys({
      exists: this.ssmParamInstructionService.exists.bind(this.ssmParamInstructionService),
      config,
    });

    for (const key of ssmParamInstructionKeys) {
      const instruction = _get(config, key) as string;

      const newValue = await this.ssmParamInstructionService.execute({
        instruction,
        awsRegion: config.awsRegion as string | undefined,
      });

      _set(config, key, newValue);
    }

    return config;
  }

  public async processInstruction(params: { instruction: string }): Promise<string> {
    const { instruction } = params;

    const isSsmInstruction = await this.ssmParamInstructionService.exists({ instruction });

    if (isSsmInstruction) {
      const newValue = await this.ssmParamInstructionService.execute({ instruction });

      return newValue;
    }

    return instruction;
  }
}
