import express from 'express';
import {
  videoViewsController,
  commentController,
  deleteCommentController,
} from '../controllers/videoController';

const apiRouter = express.Router();

apiRouter.post('/videos/views', videoViewsController);
apiRouter.post(`/videos/:id([0-9a-f]{24})/comment`, commentController);
apiRouter.delete(`/videos/:id([0-9a-f]{24})/delete`, deleteCommentController);

export default apiRouter;
