import {
  GetParameterCommand,
  type GetParameterCommandInput,
  type GetParameterCommandOutput,
  GetParametersByPathCommand,
  type GetParametersByPathCommandInput,
  type GetParametersByPathCommandOutput,
  GetParametersCommand,
  type GetParametersCommandInput,
  type GetParametersCommandOutput,
  PutParameterCommand,
  type PutParameterCommandInput,
  type PutParameterCommandOutput,
  SSMClient,
  type SSMClientConfig,
} from '@aws-sdk/client-ssm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsSsmService {
  private awsSsm: SSMClient | null = null;

  async init(params?: SSMClientConfig): Promise<void> {
    if (!this.awsSsm) {
      const config = params || {};
      config.region = config.region || 'us-west-2';
      this.awsSsm = new SSMClient(config);
    }
  }

  ssm(): SSMClient {
    if (!this.awsSsm) {
      throw new Error(`${AwsSsmService.name} has not been initialized`);
    }
    return this.awsSsm;
  }

  async getParameter(params: { input: GetParameterCommandInput }): Promise<GetParameterCommandOutput> {
    const { input } = params;

    const command = new GetParameterCommand(input);

    return await this.ssm().send(command);
  }

  async getParameters(params: { input: GetParametersCommandInput }): Promise<GetParametersCommandOutput> {
    const { input } = params;

    const command = new GetParametersCommand(input);

    return await this.ssm().send(command);
  }

  async getParametersByPath(params: { input: GetParametersByPathCommandInput }): Promise<GetParametersByPathCommandOutput> {
    const { input } = params;

    const command = new GetParametersByPathCommand(input);

    return await this.ssm().send(command);
  }

  async putParameter(params: { input: PutParameterCommandInput }): Promise<PutParameterCommandOutput> {
    const { input } = params;

    const command = new PutParameterCommand(input);

    return await this.ssm().send(command);
  }
}
