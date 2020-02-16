const request = require("request");

const getOptions = (username, password) => ({
    method: 'POST',
    url: 'https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/pl/gcb',
    headers:
    {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
    },
    form: { grant_type: 'client_credentials', scope: 'ewit' }
});

const getGetAuthCode = () => ( { method: 'GET',
url: 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize',
qs: 
 { response_type: 'code',
   client_id: '',
   scope: 'accounts_details_transactions',
   countryCode: 'PL',
   businessCode: 'GCB',
   locale: 'pl',
   state: 'my_state',
   redirect_uri: '/my/redirect' },
headers: { accept: 'application/json' } });

exports.callBankApi = (username, password) => request(getGetAuthCode(username, password), (error, response, body) => {
    if (error) return `Failed: ${error.message}`;

    return `Success: ${body}`;
});