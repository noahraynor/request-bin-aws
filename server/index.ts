import express from 'express';
const app = express();
app.use(express.json());


const PORT = 3000;


app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

// Get all tubs
app.get('/api/tubs', (req, res) => {
  console.log('getting tubs')
  res.send('Get all tubs')
});

// Creates a new tub
app.post('/api/tubs', (req, res) => {
  console.log('creating a new tub')
});

// Get all requests in a specific tub
app.get('/api/tubs/:id', (req, res) => {
  let publicId = req.params.id 
  console.log(`getting all request for tub ${publicId}`)
  res.send(`All requests from tub ${publicId}`)
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
