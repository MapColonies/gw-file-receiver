import { DependencyContainer } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { SERVICES } from '../common/constants';
import { IConfig } from '../common/interfaces';
import { FsStorageProvider } from './fs/fsStorageProvider';
import { S3StorageProvider } from './s3/s3StorageProvider';
import { IStorageProvider } from './storageProvider';

export const GetProvider = (container: DependencyContainer): IStorageProvider => {
  const config = container.resolve<IConfig>(SERVICES.CONFIG);
  const providerType = config.get<string>('storageProvider').toUpperCase();
  const logger = container.resolve<Logger>(SERVICES.LOGGER);
  logger.info(`loading ${providerType} storage provider`);
  switch (providerType) {
    case 'FS':
      return new FsStorageProvider(config);
    case 'S3':
      return new S3StorageProvider(config);
    default:
      throw new Error(`invalid provider type: ${providerType}`);
  }
};
