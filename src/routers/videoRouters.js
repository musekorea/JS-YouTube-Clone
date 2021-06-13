import express from 'express';
import {
  videoDetailController,
  videoGetEditController,
  videoPostEditController,
  videoGetUploadController,
  videoPostUploadController,
  videoDeleteController,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/:id([0-9a-f]{24})', videoDetailController);
videoRouter
  .route('/:id([0-9a-f]{24})/edit')
  .get(videoGetEditController)
  .post(videoPostEditController);
//videoRouter.get('/:id/edit', videoGetEditController);
//videoRouter.post('/:id/edit', videoPostEditController);
videoRouter.get('/upload', videoGetUploadController);
videoRouter.post('/upload', videoPostUploadController);

videoRouter.get('/:id([0-9a-f]{24})/delete', videoDeleteController);

export default videoRouter;
