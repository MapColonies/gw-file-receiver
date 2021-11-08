import { Readable } from 'stream';
import { inject, injectable } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { SERVICES } from '../../common/constants';
import { IStorageProvider } from '../../providers/storageProvider';
import { streamToString } from '../../common/utills';
import { SyncManagerClient } from '../../clients/syncManagerClient';

@injectable()
export class FileReceiverManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.STORAGE_PROVIDER) private readonly provider: IStorageProvider,
    private readonly syncManagerClient: SyncManagerClient
  ) {}

  public async saveFile(filePath: string, contentStream: Readable): Promise<void> {
    const nameParts = filePath.split('/');
    if (!filePath.endsWith('json')) {
      if (!(await this.provider.exists(filePath))) {
        await this.provider.saveFile(filePath, contentStream);
        await this.syncManagerClient.notifyReceived(nameParts[0], nameParts[1], filePath);
      } else {
        this.logger.warn(`ignoring received duplicate file: "${filePath}"`);
      }
    } else {
      const content = await streamToString(contentStream);
      await this.syncManagerClient.notifyReceived(nameParts[0], nameParts[1], filePath, content);
    }
  }
}
