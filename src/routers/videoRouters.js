import express from 'express';
import {
  videoWatchController,
  videoEditController,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/watch', videoWatchController);
videoRouter.get('/edit', videoEditController);

export default videoRouter;
