const axios = require('axios').default;
const notifications = require('./notifications');
const fifaReqs = require('./fifa-requests');

const checkPrices = (playersData, SID) => {
  playersData.map((playerData) => {
    axios
      .get(
        `https://www.futbin.com/21/playerPrices?player=${playerData.id}`
      )
      .then((res) => {
        const dirtyPrice = res.data[playerData.id].prices.pc.LCPrice;
        const clearPrice = Number(dirtyPrice.replace(',', ''));

        if (clearPrice <= playerData.minPrice) {
          // Notify to buy
          notifications.sendPushNotification(`${playerData.name} - BUY!`, 'The price now is: ' + dirtyPrice);

          // Check and make bid
          fifaReqs.getPlayerDetails(playerData.maskedDefId, playerData.clearPrice, playerData.rare, SID);
        } else if (clearPrice >= playerData.maxPrice) {
          // Notify to sell
          notifications.sendPushNotification(`${playerData.name} - SELL!`, 'The price now is: ' + dirtyPrice);
        }

        console.log(`${playerData.name}: ${dirtyPrice}`);
      });
  });
}

module.exports = { checkPrices };