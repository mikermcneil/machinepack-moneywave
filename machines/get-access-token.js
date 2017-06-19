module.exports = {


  friendlyName: 'Get access (merchant) token',


  description: 'Obtain a temporary merchant access token (good for 2 hours) using the given credentials.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#get-access-token',


  inputs: {

    apiKey: {
      type: 'string',
      required: true,
      protect: true,
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    },

    secret: {
      type: 'string',
      required: true,
      protect: true,
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Access token',
      outputDescription: 'A valid merchant access token, good for 2 hours.',
      outputExample: 'sedxsawegtyrerw3srsdfzxzzvbhgehh213fdsz'
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');

    var tokenInfo = await HTTP.post({
      url: 'https://moneywave.herokuapp.com/v1/merchant/verify',
      data: {
        apiKey: inputs.apiKey,
        secret: inputs.secret
      }
    });

    // The Moneywave API doesn't necessarily use HTTP status codes,
    // so we have to do an additional check here to catch all errors.
    // See https://moneywave-doc.herokuapp.com/index.html#charge-response-codes for more info.
    if (tokenInfo.status !== 'success') {
      return exits.error(tokenInfo);
    }

    return exits.success(tokenInfo.token);

  },



};
