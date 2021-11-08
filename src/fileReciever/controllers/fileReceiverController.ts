import { Logger } from '@map-colonies/js-logger';
import { BadRequestError } from '@map-colonies/error-types';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { FileReceiverManager } from '../models/fileReceiverManager';

interface ReceiveFileQuery {
  filename?: string;
}
type ReceiveFileHandler = RequestHandler<undefined, undefined, unknown, ReceiveFileQuery>;

@injectable()
export class FileReceiverController {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, private readonly manager: FileReceiverManager) {}

  public receiveFile: ReceiveFileHandler = async (req, res, next) => {
    try {
      let filenameHeader = req.headers['filename'] as string | undefined;
      if (filenameHeader != undefined) {
        filenameHeader = decodeURIComponent(filenameHeader);
      }
      const filePath = filenameHeader ?? req.query.filename;
      if (filePath === undefined) {
        throw new BadRequestError('"filename" is required in header or query');
      }
      await this.manager.saveFile(filePath, req);
      return res.sendStatus(httpStatus.OK);
    } catch (err) {
      next(err);
    }
  };
}
