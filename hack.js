const express = require('express');
const axios = require('axios').default;
const querystring = require('querystring');
const https = require('https');
const app = express();
const port = 3000;

var fs = require('fs');

const playersData = JSON.parse(fs.readFileSync('players.json', 'utf8'));

const sendPushNotification = (pushTitle, pushMessage) => {
  var apiKey = 'SQXMWBN1ZE2G604XPDK59GDK7';
  var postdata = querystring.stringify({
    ApiKey: apiKey,
    PushTitle: pushTitle,
    PushText: pushMessage,
  });
  var options = {
    hostname: 'www.notifymydevice.com',
    port: 443,
    path: '/push?',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postdata.length,
    },
  };
  callback = function (response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log('Response: ' + str);
    });
  };
  var req = https.request(options, callback);
  req.write(postdata);
  req.end();
  req.on('error', function (e) {
    console.log(e);
    Log(e);
  });
};

const interval = () => {
  playersData.map((playerData) => {
    axios
      .get(
        `https://www.futbin.com/21/playerPrices?player=${playerData.id}&rids=221174,50552822,84107254&_=1616884302859`
      )
      .then((res) => {
        const dirtyPrice = res.data[playerData.id].prices.pc.LCPrice;
        const clearPrice = Number(dirtyPrice.replace(',', ''));

        if (clearPrice <= playerData.minPrice) {
          // Notify to buy
          sendPushNotification(`${playerData.name} - BUY!`, 'The price now is: ' + dirtyPrice);
        } else if (clearPrice >= playerData.maxPrice) {
          // Notify to sell
          sendPushNotification(`${playerData.name} - SELL!`, 'The price now is: ' + dirtyPrice);
        }

        console.log(clearPrice);
      });
  });
};

setInterval(interval, 5 * 60 * 1000);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
