import express from 'express';
import morgan from 'morgan';
import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouters';
import videoRouter from './routers/videoRouters';

const PORT = 8080;
const app = express();

app.use(morgan('dev'));
app.use('/', globalRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

const handleListening = () => {
  console.log(`Server is listening on Port ${PORT}👵`);
};

app.listen(PORT, handleListening);
