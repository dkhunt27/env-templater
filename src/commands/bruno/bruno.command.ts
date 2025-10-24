// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { Command, CommandRunner, InquirerService, Option, Question, QuestionSet } from 'nest-commander';
import { setLogger } from '../../utils.ts';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { BrunoEnvTemplateService } from './bruno.service.ts';

// from: https://docs.nestjs.com/recipes/nest-commander#putting-it-all-together

export interface BrunoOptions {
  configFile: string;
}

export const BRUNO_QUESTIONS = 'BRUNO_QUESTIONS';

@Command({ name: 'bruno', description: 'Templates environment files for bruno' })
export class BrunoCommand extends CommandRunner {
  private readonly logService = setLogger({ context: BrunoCommand.name });

  constructor(
    private readonly inquirer: InquirerService,
    private readonly brunoService: BrunoEnvTemplateService,
  ) {
    super();
  }

  async run(_passedParam: string[], options: BrunoOptions): Promise<void> {
    this.logService.log(``);
    this.logService.log(`=================================================`);
    this.logService.log(``);
    this.logService.log(`Running command: ${BrunoCommand.name}`);
    this.logService.log(``);
    this.logService.log(`=================================================`);
    this.logService.log(``);
    options = await this.inquirer.ask(BRUNO_QUESTIONS, options);

    await this.brunoService.execute(options);
  }

  // since we are using inquirer to ask if not supplied, we can make options optional

  @Option({
    flags: '-c, --configFile <configFile>',
    description: 'Path to the config file',
    required: false,
  })
  parseOptionConfigFile(val: string): string {
    return val;
  }
}

@QuestionSet({ name: BRUNO_QUESTIONS })
export class BrunoCommandQuestions {
  @Question({
    type: 'input',
    name: 'configFile',
    message: 'What is the path to the config file?',
    validate: (input: string) => {
      if (!input) {
        return 'Config file path cannot be empty';
      }
      return true;
    },
  })
  parseQuestionConfigFile(val: string) {
    return val;
  }
}
