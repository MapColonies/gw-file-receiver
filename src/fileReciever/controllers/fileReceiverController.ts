import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { FileReceiverManager } from '../models/fileReceiverManager';

type ReceiveFileHandler = RequestHandler<undefined, undefined, unknown>;

@injectable()
export class FileReceiverController {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, private readonly manager: FileReceiverManager) {}

  public receiveFile: ReceiveFileHandler = async (req, res, next) => {
    try {
      const filePath = req.headers['filename'] as string;
      await this.manager.saveFile(filePath, req);
      return res.sendStatus(httpStatus.OK);
    } catch (err) {
      next(err);
    }
  };
}
