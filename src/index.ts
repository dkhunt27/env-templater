import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli.module.ts';

async function bootstrap() {
  await CommandFactory.run(CliModule, {
    /*
      assuming each command will override the logger setLogLevels
      so this will only apply to the nestjs startup logs
    */

    // (quietest) only print Nest's startup fatal, error, and warn logs;
    // assumes each command is properly injected
    logger: ['fatal', 'error', 'warn'],

    // prints Nest's startup fatal through info/log logs
    // good for debugging startup issues (command injection issues)
    // logger: ['fatal', 'error', 'warn', 'log'],

    // (noisiest) print all startup logs
    //logger: ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'],
  });
}

bootstrap();
