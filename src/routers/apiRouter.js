import express from 'express';
import { videoViewsController } from '../controllers/videoController';
const apiRouter = express.Router();

apiRouter.post('/videos/views', videoViewsController);
export default apiRouter;
