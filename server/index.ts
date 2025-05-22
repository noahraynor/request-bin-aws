import express from 'express';
import router from './src/routes.js';

const app = express();
app.use(express.json());
app.use('/', router)

const PORT = 3000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);
});