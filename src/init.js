import './db.js';
import './models/Video.js';
import app from './server';

const PORT = 8080;
const handleListening = () => {
  console.log(`Server is listening on Port ${PORT}👵`);
};

app.listen(PORT, handleListening);
