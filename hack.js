const express = require('express');

// const futbinReqs = require('./futbin-requests');
const fifaReqs = require('./fifa-requests');
const auth = require('./authenticate');
const app = express();
const port = 3000;

let SID = null;

var fs = require('fs');

const playersData = JSON.parse(fs.readFileSync('players.json', 'utf8'));
const tokenFile = JSON.parse(fs.readFileSync('access-token.json', 'utf8'));

// Making interval for continious checking
// setInterval(() => { futbinReqs.checkPrices(playersData); }, 3 * 60 * 1000);

const checkPrcicesViaEa = async () => {
  try {
    // Authenticate to fifa webapp
    // getting code...
    const answer = await auth.getCode(tokenFile.access_token);
    console.log('Code: ' + answer.data.code);

    // getting SID...
    const sidAnswer = await auth.getSID(answer.data.code);
    console.log('SID: ' + sidAnswer.data.sid);
    SID = sidAnswer.data.sid;
  } catch (e) {
    console.log(e);
  }

  playersData.map((playerData, index) => {

    setTimeout(() => {
      // Check and make bid
      fifaReqs.getPlayerDetails(playerData.maskedDefId, playerData.minPrice, playerData.rare, SID);
    }, index * 3000);
  });
}

setInterval(checkPrcicesViaEa, 3 * 60 * 1000);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
