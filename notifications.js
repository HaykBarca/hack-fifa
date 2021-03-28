const querystring = require('querystring');
const https = require('https');

const sendPushNotification = (pushTitle, pushMessage) => {
  const apiKey = 'SQXMWBN1ZE2G604XPDK59GDK7';
  const postdata = querystring.stringify({
    ApiKey: apiKey,
    PushTitle: pushTitle,
    PushText: pushMessage,
  });
  const options = {
    hostname: 'www.notifymydevice.com',
    port: 443,
    path: '/push?',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postdata.length,
    },
  };
  const callback = (response) => {
    let str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log('Response: ' + str);
    });
  };
  const req = https.request(options, callback);
  req.write(postdata);
  req.end();
  req.on('error', function (e) {
    console.log(e);
  });
};

module.exports = { sendPushNotification };