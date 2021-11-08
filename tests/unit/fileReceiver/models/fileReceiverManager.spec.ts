import { Readable } from 'stream';
import jsLogger from '@map-colonies/js-logger';
import { FileReceiverManager } from '../../../../src/fileReciever/models/fileReceiverManager';
import { providerMock, saveFileMock, fileExistsMock } from '../../../mocks/storageProvider';
import { syncManagerClientMock, notifyReceivedMock } from '../../../mocks/syncManagerClient';

let fileReceiverManager: FileReceiverManager;

describe('FileReceiverManager', () => {
  beforeEach(function () {
    fileReceiverManager = new FileReceiverManager(jsLogger({ enabled: false }), providerMock, syncManagerClientMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#saveFile', () => {
    it('persists png file to provider and notify manager service when file dont exist', async function () {
      const path = 'name/ver/ortho/1/2/3.png';
      const dataString = 'testData';
      const dataStream = Readable.from(dataString);
      fileExistsMock.mockResolvedValue(false);
      // action
      await fileReceiverManager.saveFile(path, dataStream);

      // expectation
      expect(fileExistsMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledWith(path, dataStream);
      expect(notifyReceivedMock).toHaveBeenCalledTimes(1);
      expect(notifyReceivedMock).toHaveBeenCalledWith('name', 'ver', path);
    });

    it('dont persists png file to provider and notify manager service when file already exist', async function () {
      const path = 'name/ver/ortho/1/2/3.png';
      const dataString = 'testData';
      const dataStream = Readable.from(dataString);
      fileExistsMock.mockResolvedValue(true);
      // action
      await fileReceiverManager.saveFile(path, dataStream);

      // expectation
      expect(fileExistsMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledTimes(0);
      expect(notifyReceivedMock).toHaveBeenCalledTimes(0);
    });

    it('dont persists json file to provider and send it to manager service', async function () {
      const path = 'name/ver/ortho/toc.json';
      const dataString = 'testData';
      const dataStream = Readable.from(dataString);
      // action
      await fileReceiverManager.saveFile(path, dataStream);

      // expectation
      expect(fileExistsMock).toHaveBeenCalledTimes(0);
      expect(saveFileMock).toHaveBeenCalledTimes(0);
      expect(notifyReceivedMock).toHaveBeenCalledTimes(1);
      expect(notifyReceivedMock).toHaveBeenCalledWith('name', 'ver', path, dataString);
    });
  });
});
