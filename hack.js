const express = require('express');

const futbinReqs = require('./futbin-requests');
const app = express();
const port = 3000;

var fs = require('fs');

const playersData = JSON.parse(fs.readFileSync('players.json', 'utf8'));

// Making interval for continious checking
setInterval(() => { futbinReqs.checkPrices(playersData); }, 3 * 60 * 1000);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
