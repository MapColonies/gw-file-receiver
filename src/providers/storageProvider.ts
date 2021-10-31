import { Readable } from 'stream';

export interface IStorageProvider {
  //createWriteStream: (path: string) => Promise<Writable>;
  saveFile: (path: string, contentStream: Readable) => Promise<unknown>;
}
