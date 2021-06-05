import './db.js';
import './models/Video.js';
import app from './server';

const handleListening = () => {
  console.log(`Server is listening on Port ${PORT}👵`);
};

app.listen(PORT, handleListening);
export default app;
