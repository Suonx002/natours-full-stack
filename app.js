const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('hello from server side');
});

app.listen(PORT, () => {
  console.log(`Server is currently running on port ${PORT}...`);
});
