import 'dotenv/config';
import app from './app.js';
import connectToDatabase from './database/index.js';

const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error starting server: MongoDB Connection', error);
    process.exit(1);
  });
