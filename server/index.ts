import express from 'express';
import ngrok from 'ngrok'
import path from 'path';
import router from './src/routes'

const app = express();
app.use(express.json());
app.use('/', router)

const PORT = 3000;

const CLIENT_DIST_PATH = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(CLIENT_DIST_PATH));

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  const url = await ngrok.connect({ addr: 3000 });
  console.log(`Ngrok tunnel available at: ${url}`);
});
