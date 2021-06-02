import express from 'express';
import {
  videoWatchController,
  videoGetEditController,
  videoPostEditController,
  videoDeleteController,
  videoUploadController,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/upload', videoUploadController);
videoRouter.get('/:id(\\d+)', videoWatchController);
videoRouter
  .route('/:id/edit')
  .get(videoGetEditController)
  .post(videoPostEditController);
//videoRouter.get('/:id/edit', videoGetEditController);
//videoRouter.post('/:id/edit', videoPostEditController);
videoRouter.get('/:id/delete', videoDeleteController);

export default videoRouter;
