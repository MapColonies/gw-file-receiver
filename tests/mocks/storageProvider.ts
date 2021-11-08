import { IStorageProvider } from '../../src/providers/storageProvider';

const saveFileMock = jest.fn();
const fileExistsMock = jest.fn();

const providerMock = {
  saveFile: saveFileMock,
  exists: fileExistsMock,
} as IStorageProvider;

export { providerMock, saveFileMock, fileExistsMock };
