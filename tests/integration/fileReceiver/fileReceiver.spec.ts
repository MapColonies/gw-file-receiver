import { Readable } from 'stream';
import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import httpStatusCodes from 'http-status-codes';

import { getApp } from '../../../src/app';
import { SyncManagerClient } from '../../../src/clients/syncManagerClient';
import { SERVICES } from '../../../src/common/constants';
import { providerMock, saveFileMock, fileExistsMock } from '../../mocks/storageProvider';
import { configMock, initConfig, clearConfig } from '../../mocks/config';

import { FileReceiverRequestSender } from './helpers/requestSender';

describe('fileReceiver', function () {
  let requestSender: FileReceiverRequestSender;
  let notifyReceivedMock: jest.SpyInstance;

  beforeEach(function () {
    initConfig();
    const app = getApp({
      override: [
        { token: SERVICES.CONFIG, provider: { useValue: configMock } },
        { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
        { token: SERVICES.STORAGE_PROVIDER, provider: { useValue: providerMock } },
      ],
      useChild: true,
    });

    notifyReceivedMock = jest.spyOn(SyncManagerClient.prototype, 'notifyReceived');
    requestSender = new FileReceiverRequestSender(app);
  });

  afterEach(() => {
    clearConfig();
    jest.resetAllMocks();
  });

  describe('Happy Path', function () {
    it('should return 200 status code when binary png is received and file dont exist', async function () {
      notifyReceivedMock.mockResolvedValue(undefined);
      fileExistsMock.mockResolvedValue(false);

      const response = await requestSender.sendFile('name/ver/orto/8/64/544.png', Buffer.from('tests'));

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(fileExistsMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledWith('name/ver/orto/8/64/544.png', expect.any(Readable));
      expect(notifyReceivedMock).toHaveBeenCalledTimes(1);
      expect(notifyReceivedMock).toHaveBeenCalledWith('name', 'ver', 'name/ver/orto/8/64/544.png');
    });

    it('should return 200 status code without saving when binary png is received and file exist', async function () {
      notifyReceivedMock.mockResolvedValue(undefined);
      fileExistsMock.mockResolvedValue(true);

      const response = await requestSender.sendFile('name/ver/orto/8/64/544.png', Buffer.from('tests'));

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(fileExistsMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledTimes(0);
      expect(notifyReceivedMock).toHaveBeenCalledTimes(0);
    });

    it('should return 200 status code when binary json is received', async function () {
      notifyReceivedMock.mockResolvedValue(undefined);

      const response = await requestSender.sendFile('name/ver/orto/8/64/544.json', Buffer.from('tests json'));

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(fileExistsMock).toHaveBeenCalledTimes(0);
      expect(saveFileMock).toHaveBeenCalledTimes(0);
      expect(notifyReceivedMock).toHaveBeenCalledTimes(1);
      expect(notifyReceivedMock).toHaveBeenCalledWith('name', 'ver', 'name/ver/orto/8/64/544.json', 'tests json');
    });

    it('should return 200 status code when binary png is received with query filename  and file dont exist', async function () {
      notifyReceivedMock.mockResolvedValue(undefined);
      fileExistsMock.mockResolvedValue(false);

      const response = await requestSender.sendFile('name/ver/orto/8/64/544.png', Buffer.from('tests'), true);

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(fileExistsMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledWith('name/ver/orto/8/64/544.png', expect.any(Readable));
      expect(notifyReceivedMock).toHaveBeenCalledTimes(1);
      expect(notifyReceivedMock).toHaveBeenCalledWith('name', 'ver', 'name/ver/orto/8/64/544.png');
    });

    it('should return 200 status code  without saving when binary png is received with query filename  and file exist', async function () {
      notifyReceivedMock.mockResolvedValue(undefined);
      fileExistsMock.mockResolvedValue(false);

      const response = await requestSender.sendFile('name/ver/orto/8/64/544.png', Buffer.from('tests'), true);

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(fileExistsMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledTimes(1);
      expect(saveFileMock).toHaveBeenCalledWith('name/ver/orto/8/64/544.png', expect.any(Readable));
      expect(notifyReceivedMock).toHaveBeenCalledTimes(1);
      expect(notifyReceivedMock).toHaveBeenCalledWith('name', 'ver', 'name/ver/orto/8/64/544.png');
    });

    it('should return 200 status code when binary json is received with query filename', async function () {
      notifyReceivedMock.mockResolvedValue(undefined);

      const response = await requestSender.sendFile('name/ver/orto/8/64/544.json', Buffer.from('tests json'), true);
      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();
      expect(fileExistsMock).toHaveBeenCalledTimes(0);
      expect(saveFileMock).toHaveBeenCalledTimes(0);
      expect(notifyReceivedMock).toHaveBeenCalledTimes(1);
      expect(notifyReceivedMock).toHaveBeenCalledWith('name', 'ver', 'name/ver/orto/8/64/544.json', 'tests json');
    });
  });

  describe('Bad Path', function () {
    it('should return 400 status code without file name', async function () {
      notifyReceivedMock.mockResolvedValue(undefined);

      const response = await requestSender.sendFile(undefined, Buffer.from('tests json'));

      expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
    });
  });

  describe('Sad Path', function () {
    // All requests with status code 4XX-5XX
  });
});
