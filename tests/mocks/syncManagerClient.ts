import { SyncManagerClient } from "../../src/clients/syncManagerClient";

const notifyReceivedMock = jest.fn();

const syncManagerClientMock = {
  notifyReceived: notifyReceivedMock
} as unknown as SyncManagerClient;

export {syncManagerClientMock, notifyReceivedMock }
