import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join as pathJoin } from 'node:path';
import type { SSMClientConfig } from '@aws-sdk/client-ssm';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { Injectable, Logger } from '@nestjs/common';
import { setLogger } from '../../utils.ts';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { InstructionService } from '../shared/instruction.service.ts';
import type { BrunoConfigType, BrunoEnvVarType } from './types.ts';

@Injectable()
export class BrunoUtilities {
  constructor(
    private readonly logService: Logger,
    private readonly instructionsService: InstructionService,
  ) {
    this.logService = setLogger({ context: BrunoUtilities.name });
  }

  init(params?: SSMClientConfig): Promise<void> {
    return this.instructionsService.init(params);
  }

  parseConfig(params: { configFile: string }): BrunoConfigType {
    const { configFile } = params;
    this.logService.log(`Parsing configFile: ${configFile}`);

    const configFullPath = pathJoin(process.cwd(), configFile);

    this.logService.log(`Config full path: ${configFullPath}`);

    if (!existsSync(configFullPath)) {
      this.logService.error(`ERROR: No such file or directory '${configFullPath}'`);
      throw new Error(`No such file or directory '${configFullPath}'`);
    } else {
      const configContents = readFileSync(configFullPath).toString();
      const config = JSON.parse(configContents);
      return config;
    }
  }

  backupEnvFile(params: { filePath: string }): string | undefined {
    const { filePath } = params;

    let backupFileName: string | undefined;

    if (existsSync(filePath)) {
      backupFileName = `${filePath}-backup-${Date.now()}`;
      this.logService.log(`Backing up existing .env to ${backupFileName}`);

      if (existsSync(backupFileName)) {
        throw new Error(`Backup env file already exists: ${backupFileName}`);
      }
      renameSync(filePath, backupFileName);
    } else {
      this.logService.log(`No existing .env to backup`);
    }

    return backupFileName;
  }

  createNewEnvFile(params: { envFilePath: string; envVars: BrunoEnvVarType[] }): string {
    const { envFilePath, envVars } = params;

    if (existsSync(envFilePath)) {
      throw new Error(`Env file already exists: ${envFilePath}`);
    }

    const fileContents = envVars.map((ev) => `${ev.key}=${ev.value}`).join('\n');

    writeFileSync(envFilePath, fileContents);

    return envFilePath;
  }

  async processEnvVarValue(params: { value: string }): Promise<string> {
    this.logService.log(`Processing env var instruction ${params.value}`);
    const processedValue = await this.instructionsService.processInstruction({ instruction: params.value });

    return processedValue;
  }

  buildEnvFilePath(params: { brunoFolder: string; collectionName: string }): string {
    const { brunoFolder, collectionName } = params;

    const envFilePath = pathJoin(process.cwd(), brunoFolder, collectionName, '.env');

    this.logService.log(`Determined envFilePath as ${envFilePath}`);

    return envFilePath;
  }
}
