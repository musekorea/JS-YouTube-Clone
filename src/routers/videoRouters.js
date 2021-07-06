import express from 'express';
import {
  videoDetailController,
  videoGetEditController,
  videoPostEditController,
  videoGetUploadController,
  videoPostUploadController,
  videoDeleteController,
} from '../controllers/videoController';
import { protectMiddleware } from '../middlewares';

const videoRouter = express.Router();

videoRouter.get('/:id([0-9a-f]{24})', videoDetailController);
videoRouter
  .route('/:id([0-9a-f]{24})/edit')
  .all(protectMiddleware)
  .get(videoGetEditController)
  .post(videoPostEditController);
videoRouter.get(
  '/:id([0-9a-f]{24})/edit',
  protectMiddleware,
  videoGetEditController
);
videoRouter.post(
  '/:id([0-9a-f]{24})/edit',
  protectMiddleware,
  videoPostEditController
);
videoRouter.get('/upload', protectMiddleware, videoGetUploadController);
videoRouter.post('/upload', protectMiddleware, videoPostUploadController);
videoRouter.get(
  '/:id([0-9a-f]{24})/delete',
  protectMiddleware,
  videoDeleteController
);

export default videoRouter;
