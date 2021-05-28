import express from 'express';
import {
  videoWatchController,
  videoEditController,
  videoDeleteController,
  videoUploadController,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/upload', videoUploadController);
videoRouter.get('/:id(\\d+)', videoWatchController);
videoRouter.get('/:id/edit', videoEditController);
videoRouter.get('/:id/delete', videoDeleteController);

export default videoRouter;
