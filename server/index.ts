import express, { Request, Response } from 'express';
import * as ngrok from 'ngrok';
import * as path from 'path';
import router from './src/routes';

const app = express();
app.use(express.json());
app.use('/', router)

const PORT = 3000;
const isDev = process.env.NODE_ENV === 'development';

const CLIENT_DIST_PATH = path.join(__dirname, '..', '..', 'client', 'dist');
const CLIENT_INDEX_PATH = path.join(CLIENT_DIST_PATH, 'index.html')
app.use(express.static(CLIENT_DIST_PATH));

app.get(/.*/, (req: Request, res: Response) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/receive/')) {
    res.sendFile(CLIENT_INDEX_PATH)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  if (isDev) {
    console.log(`Loading Ngrok tunnel . . .`);
    const url = await ngrok.connect({ addr: 3000 });
    console.log(`Ngrok tunnel available at: ${url}`);
  }
});
