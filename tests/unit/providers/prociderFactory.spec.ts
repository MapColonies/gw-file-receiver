import jsLogger from '@map-colonies/js-logger';
import { container } from 'tsyringe';
import { SERVICES } from '../../../src/common/constants';
import { FsStorageProvider } from '../../../src/providers/fs/fsStorageProvider';
import { GetProvider } from '../../../src/providers/providerFactory';
import { S3StorageProvider } from '../../../src/providers/s3/s3StorageProvider';
import { configMock, initConfig, clearConfig, setConfigValue } from '../../mocks/config';

describe('ProviderFactory', () => {
  beforeEach(function () {
    initConfig();
    container.register(SERVICES.CONFIG, { useValue:configMock});
    container.register(SERVICES.LOGGER, { useValue: jsLogger({ enabled: false }) })
  });

  afterEach(()=>{
    clearConfig();
    jest.resetAllMocks();
    container.clearInstances();
  })

  describe('#GetProvider', () => {
    it('returns Fs provider on fs config',function () {
      setConfigValue('storageProvider','Fs');
      // action
      const provider = GetProvider(container);

      // expectation
     expect(provider).toBeInstanceOf(FsStorageProvider);
    });

    it('returns S3 provider on s3 config',function () {
      setConfigValue('storageProvider','s3');
      // action
      const provider = GetProvider(container);

      // expectation
     expect(provider).toBeInstanceOf(S3StorageProvider);
    });

  
  });
});
