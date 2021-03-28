const axios = require('axios').default;
const notifications = require('./notifications');

const makeBid = (buyNowPrice, tradeId, SID) => {
  const url = `https://utas.external.s2.fut.ea.com/ut/game/fifa21/trade/${tradeId}/bid`;
  axios
    .put(url, { bid: buyNowPrice }, { headers: { 'X-UT-SID': SID } })
    .then((res) => {
      console.log(res);
      notifications.sendPushNotification(`Autobid by ${buyNowPrice}!`, JSON.stringify(res.data));
    })
    .catch((e) => {
      console.log(e);
    });
};

const getPlayerDetails = (maskedDefId, maxb, rare = null, SID) => {
  const url = 'https://utas.external.s2.fut.ea.com/ut/game/fifa21/transfermarket';
  axios
    .get(url, {
      headers: {
        'X-UT-SID': SID,
      },
      params: {
        num: 21,
        start: 0,
        type: 'player',
        maskedDefId,
        maxb,
        ...(rare && { rare }),
      },
    })
    .then((res) => {
      console.log(res);
      if (res.data.auctionInfo?.length) {
        res.data.auctionInfo.map(auc => {
          makeBid(auc.buyNowPrice, auc.tradeId, SID);
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = {
  getPlayerDetails,
  makeBid,
};
