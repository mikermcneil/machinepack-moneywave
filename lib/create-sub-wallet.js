module.exports = {


  friendlyName: 'Create sub-wallet',


  description: 'Create a sub-wallet within the current Moneywave developer account wallet.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#create-sub-wallet',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

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
      description: 'A unique identifier to attach to the sub-wallet being created.',
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
      description: 'The sub-wallet was created successfully.'
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('./');

    var tokenInfo = await HTTP.post({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/wallet',
      data: {
        name: inputs.subWalletName,
        lock_code: inputs.walletPassword,// eslint-disable-line camelcase
        user_ref: inputs.referenceCode,// eslint-disable-line camelcase
        currency: inputs.currency,
      },
      headers: {
        Authorization: inputs.accessToken || await Moneywave.getAccessToken()
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
