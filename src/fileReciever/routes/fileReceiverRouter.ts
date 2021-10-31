import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { FileReceiverController } from '../controllers/fileReceiverController';

const fileReceiverRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(FileReceiverController);

  router.post('/', controller.receiveFile);

  return router;
};

export const FILE_RECEIVER_ROUTER_SYMBOL = Symbol('fileReceiverRouterFactory');

export { fileReceiverRouterFactory };
