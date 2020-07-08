const express = require('express');
const server = express();
server.use(express.json());

const postRouter = require('./post-router');
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send('Welcome to project 2');
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
