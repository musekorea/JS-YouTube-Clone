import express from 'express';
import {
  videoWatchController,
  videoGetEditController,
  videoPostEditController,
  videoGetUploadController,
  videoPostUploadController,
  videoDeleteController,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/:id(\\d+)', videoWatchController);
videoRouter
  .route('/:id/edit')
  .get(videoGetEditController)
  .post(videoPostEditController);
//videoRouter.get('/:id/edit', videoGetEditController);
//videoRouter.post('/:id/edit', videoPostEditController);
videoRouter.get('/upload', videoGetUploadController);
videoRouter.post('/upload', videoPostUploadController);

videoRouter.get('/:id/delete', videoDeleteController);

export default videoRouter;
