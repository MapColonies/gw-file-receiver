import { Logger } from '@map-colonies/js-logger';
import { BadRequestError } from '@map-colonies/error-types';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { FILENAME_SAPERATOR_CHARACTER, SERVICES } from '../../common/constants';
import { FileReceiverManager } from '../models/fileReceiverManager';
import { join as pathJoin } from 'path';

interface ReceiveFileQuery {
  filename?: string;
}
type ReceiveFileHandler = RequestHandler<undefined, undefined, unknown, ReceiveFileQuery>;

@injectable()
export class FileReceiverController {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, private readonly manager: FileReceiverManager) {}

  public receiveFile: ReceiveFileHandler = async (req, res, next) => {
    try {
      const filenameHeader = req.headers['filename'] as string | undefined;
      const filenameQuery = req.query.filename;

      let filePath = filenameHeader ?? filenameQuery;
      if (filePath === undefined) {
        throw new BadRequestError('"filename" is required in header or query');
      }

      filePath = this.gwFilenameToPath(filePath);
      await this.manager.saveFile(filePath, req);
      return res.sendStatus(httpStatus.OK);
    } catch (err) {
      next(err);
    }
  };
  
  private gwFilenameToPath(filename: string): string {
    return pathJoin(...filename.split(FILENAME_SAPERATOR_CHARACTER));
  }
}
