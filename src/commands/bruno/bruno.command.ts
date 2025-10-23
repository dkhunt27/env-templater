// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { CliUtilityService, Command, CommandRunner, InquirerService, Option, Question, QuestionSet } from 'nest-commander';
import { setLogger } from '../../utils.ts';
// biome-ignore lint/style/useImportType: Biome doesn't handle nestjs dependency injection well
import { BrunoService } from './bruno.service.ts';

// from: https://docs.nestjs.com/recipes/nest-commander#putting-it-all-together

export interface BrunoOptions {
  name: string;
  bool: boolean;
}

export const BRUNO_QUESTIONS = 'BRUNO_QUESTIONS';

@Command({ name: 'bruno', description: 'Templates environment files for bruno' })
export class BrunoCommand extends CommandRunner {
  private readonly logService = setLogger({ context: BrunoCommand.name });

  constructor(
    private readonly cliUtils: CliUtilityService,
    private readonly inquirer: InquirerService,
    private readonly brunoService: BrunoService,
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

    await this.brunoService.exec(options);
  }

  // since we are using inquirer to ask if not supplied, we can make options optional

  @Option({
    flags: '-n, --name <name>',
    description: 'Name to greet',
    required: false,
  })
  parseOptionName(val: string): string {
    return val;
  }

  // just for demonstration of using the cli utility service to parse options
  @Option({
    flags: '-b, --bool <bool>',
    description: 'Boolean option',
    required: false,
  })
  parseOptionBool(val: string): boolean {
    return this.cliUtils.parseBoolean(val);
  }
}

@QuestionSet({ name: BRUNO_QUESTIONS })
export class BrunoCommandQuestions {
  constructor(private readonly cliUtils: CliUtilityService) {}

  @Question({
    type: 'input',
    name: 'name',
    message: 'What is your name?',
    validate: (input: string) => {
      if (!input) {
        return 'Name cannot be empty';
      }
      return true;
    },
  })
  parseQuestionName(val: string) {
    return val;
  }

  @Question({
    type: 'input',
    name: 'bool',
    message: 'Please enter a boolean value:',
  })
  parseQuestionBool(val: string): boolean {
    return this.cliUtils.parseBoolean(val);
  }
}
