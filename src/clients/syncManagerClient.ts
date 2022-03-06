import { IConfig } from 'config';
import { HttpClient } from '@map-colonies/mc-utils';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../common/constants';

@injectable()
export class SyncManagerClient extends HttpClient {
  private readonly appKey: string;
  public constructor(@inject(SERVICES.CONFIG) config: IConfig, @inject(SERVICES.LOGGER) logger: Logger) {
    super(logger, config.get('syncManagerUrl'), 'SyncManager', config.get('httpRetry'));
    this.appKey = config.get('syncManagerAppKey');
    if (this.appKey != '') {
      this.axiosOptions.headers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'App-Key': this.appKey,
      };
    }
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
