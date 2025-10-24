// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { Injectable, Logger } from '@nestjs/common';
import { setLogger } from '../../utils.ts';
import type { BrunoOptions } from './bruno.command.ts';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { BrunoUtilities } from './bruno.utilities.ts';
import type { BrunoEnvVarType, BrunoResultsType } from './types.ts';

@Injectable()
export class BrunoEnvTemplateService {
  constructor(
    private readonly logService: Logger,
    private readonly utilities: BrunoUtilities,
  ) {
    this.logService = setLogger({ context: BrunoEnvTemplateService.name });
  }

  async execute(options: BrunoOptions): Promise<BrunoResultsType[]> {
    this.logService.log(`${BrunoEnvTemplateService.name} executing`);

    const results: BrunoResultsType[] = [];

    // parse config
    const config = this.utilities.parseConfig({ configFile: options.configFile });

    // initialize utilities
    this.utilities.init({ region: config.awsRegion });

    // loop through them and template
    for (const collection of config.collections) {
      this.logService.log(`Processing collection: ${collection.name}`);

      // first determine env file path
      const envFilePath = this.utilities.buildEnvFilePath({
        brunoFolder: config.brunoFolder,
        collectionName: collection.name,
      });

      // backup env file if exists
      const envBackupFilePath = this.utilities.backupEnvFile({ filePath: envFilePath });

      // loop over env vars
      const processedEnvVars: BrunoEnvVarType[] = [];

      for (const envVar of collection.envVars) {
        this.logService.log(`Processing env var: ${envVar.key}`);

        // process template
        const processed = await this.utilities.processEnvVarValue({
          value: envVar.value,
        });

        processedEnvVars.push({ key: envVar.key, value: processed });
      }

      this.utilities.createNewEnvFile({ envFilePath, envVars: processedEnvVars });

      results.push({
        collectionName: collection.name,
        envFilePath,
        envBackupFilePath,
        processedEnvVars,
        finished: true,
      });
    }

    return results;
  }
}
