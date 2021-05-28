import express from 'express';
import {
  videoWatchController,
  videoEditController,
  videoDeleteController,
  videoUploadController,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/:id', videoWatchController);
videoRouter.get('/:id/edit', videoEditController);
videoRouter.get('/:id/delete', videoDeleteController);
videoRouter.get('/upload', videoUploadController);

export default videoRouter;
