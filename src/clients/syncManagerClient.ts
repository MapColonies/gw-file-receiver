import { IConfig } from 'config';
import { HttpClient } from '@map-colonies/mc-utils';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../common/constants';

@injectable()
export class SyncManagerClient extends HttpClient {
  public constructor(@inject(SERVICES.CONFIG) config: IConfig, @inject(SERVICES.LOGGER) logger: Logger) {
    super(logger, config.get('syncManagerUrl'), 'SyncManager', config.get('httpRetry'));
  }

  public async notifyReceived(resourceId: string, version: string, fileName: string, fileContentString?: string): Promise<void> {
    const fileContent = fileContentString !== undefined ? (JSON.parse(fileContentString) as unknown) : undefined;
    const body = {
      resourceId,
      version,
      fileName,
      fileContent,
    };
    await this.post('/synchronize/fileRecived', body);
  }
}
