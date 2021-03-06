import { Readable } from 'stream';

export interface IStorageProvider {
  saveFile: (path: string, contentStream: Readable) => Promise<unknown>;
  exists: (path: string) => Promise<boolean>;
}
