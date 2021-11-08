import { promises, createWriteStream, constants as fsConstants } from 'fs';
import { Readable } from 'stream';
import { dirname, join } from 'path';
import { inject } from 'tsyringe';
import { IStorageProvider } from '../storageProvider';
import { SERVICES } from '../../common/constants';
import { IConfig } from '../../common/interfaces';
import { IFsConfig } from './iFsConfig';

export class FsStorageProvider implements IStorageProvider {
  private readonly basePath: string;

  public constructor(@inject(SERVICES.CONFIG) config: IConfig) {
    const fsConfig = config.get<IFsConfig>('FS');
    this.basePath = join(fsConfig.mountPath, fsConfig.basePath);
  }

  public async saveFile(path: string, contentStream: Readable): Promise<void> {
    path = join(this.basePath, path);
    const dir = dirname(path);
    await promises.mkdir(dir, { recursive: true });
    const fileStream = createWriteStream(path);
    contentStream.pipe(fileStream);
    return new Promise((accept, reject) => {
      contentStream.on('end', accept);
      contentStream.on('error', reject);
    });
  }

  public async exists(path: string): Promise<boolean> {
    return promises
      .access(path, fsConstants.F_OK)
      .then(() => true)
      .catch(() => false);
  }
}
