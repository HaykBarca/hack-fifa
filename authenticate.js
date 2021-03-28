const axios = require('axios').default;

// get code with access token
const getCode = async (access_token) => {
  const url = `https://accounts.ea.com/connect/auth`
  
  return axios.get(url, { params: {
    client_id: 'FOS-SERVER',
    redirect_uri: 'nucleus:rest',
    response_type: 'code',
    access_token,
    release_type: 'prod',
    client_sequence: 'ut-auth'
  }});
}

// get SID
const getSID = async (access_token) => {
  const url = 'https://utas.external.s2.fut.ea.com/ut/auth';
  const body = {
    clientVersion: 1,
    ds: "e04a32296b5eab776c1ca51059e1f9e3914a4545cbf5767126361d11a22b0329/1c98",
    gameSku: "FFA21PCC",
    identification: {
      authCode: access_token,
      redirectUrl: "nucleus:rest"
    },
    isReadOnly: false,
    locale: "en-US",
    method: "authcode",
    nucleusPersonaId: 302899109,
    priorityLevel: 4,
    sku: "FUT21WEB",
  };

  return axios.post(url, body, { headers: { 'X-UT-PHISHING-TOKEN': 0 } });
}

module.exports = {
  getCode,
  getSID
}