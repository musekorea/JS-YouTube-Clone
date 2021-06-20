import express from 'express';
import morgan from 'morgan';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouters';
import videoRouter from './routers/videoRouters';

const app = express();

app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));

app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app;
