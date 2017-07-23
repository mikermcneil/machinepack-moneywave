module.exports = {


  friendlyName: 'Create sub-wallet',


  description: 'Create a ',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#create-sub-wallet',


  inputs: {

    accessToken: {
      description: 'A valid (temporary) merchant access token.',
      example: 'sedxsawegtyrerw3srsdfzxzzvbhgehh213fdsz',
      required: true,
      protect: true,
      whereToGet: { description: 'Call .getAccessToken().' }
    },

    subWalletName: {
      type: 'string',
      required: true,
      description: 'A name for the sub-wallet to be created.',
      example: 'My new wallet'
    },

    walletPassword: {
      type: 'string',
      required: true,
      protected: true,
      description: 'The password of the parent wallet.'
    },

    referenceCode: {
      type: 'string',
      required: true,
      description: 'A unique identifier for the sub-wallet being created.',
      example: 'gb4h72'
    },

    currency: {
      type: 'string',
      description: 'The ISO 4217 code for this sub-wallet\'s currency type.',
      example: 'NGN',
      defaultsTo: 'NGN'
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
      url: 'https://moneywave.herokuapp.com/v1/wallet',
      data: {
        name: inputs.subWalletName,
        lock_code: inputs.walletPassword,// eslint-disable-line camelcase
        user_ref: inputs.referenceCode,// eslint-disable-line camelcase
        currency: inputs.currency,
      },
      headers: {
        Authorization: inputs.accessToken
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
