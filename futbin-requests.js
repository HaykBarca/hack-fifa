const axios = require('axios').default;
const notifications = require('./notifications');
const fifaReqs = require('./fifa-requests');
const auth = require('./authenticate');

var fs = require('fs');

const tokenFile = JSON.parse(fs.readFileSync('access-token.json', 'utf8'));


const checkPrices = (playersData) => {
  playersData.map((playerData) => {
    axios
      .get(
        `https://www.futbin.com/21/playerPrices?player=${playerData.id}`
      )
      .then(async(res) => {
        const dirtyPrice = res.data[playerData.id].prices.pc.LCPrice;
        const clearPrice = Number(dirtyPrice.replace(',', ''));

        if (clearPrice <= playerData.minPrice) {
          // Notify to buy
          notifications.sendPushNotification(`${playerData.name} - BUY!`, 'The price now is: ' + dirtyPrice);

          // Authenticate to fifa webapp
          // getting code...
          const answer = await auth.getCode(tokenFile.access_token);
          console.log('Code: ' + answer.data.code);

          // getting SID...
          const sidAnswer = await auth.getSID(answer.data.code);
          console.log('SID: ' + sidAnswer.data.sid);

          // Check and make bid
          fifaReqs.getPlayerDetails(playerData.maskedDefId, clearPrice, playerData.rare, sidAnswer.data.sid);
        } else if (clearPrice >= playerData.maxPrice) {
          // Notify to sell
          notifications.sendPushNotification(`${playerData.name} - SELL!`, 'The price now is: ' + dirtyPrice);
        }

        console.log(`${playerData.name}: ${dirtyPrice}`);
      });
  });
}

module.exports = { checkPrices };