import { IStorageProvider } from '../../src/providers/storageProvider';

const saveFileMock = jest.fn();

const providerMock = {
  saveFile: saveFileMock,
} as IStorageProvider;

export { providerMock, saveFileMock };
