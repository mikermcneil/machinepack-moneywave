module.exports = {


  friendlyName: 'Withdraw from wallet',


  description: 'Transfer money (naira) from a funded Moneywave wallet to a Nigerian bank account.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#wallet-to-account-single',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

    amount: {
      description: 'The amount of money (naira) to withdraw from the wallet.',
      example: 25000,
      required: true
    },

    senderName: {
      description: 'The full name of the sender.',
      example: 'Jon Snow',
      required: true
    },

    accountNumber: {
      description: 'The identifier for the recipient account.',
      type: 'string'
    },

    bankCode: {
      description: 'The SWIFT/BIC code or routing number for the recipient account\'s bank.',
      example: 'CITINGLA',
      required: true
    },

    walletPassword: {
      type: 'string',
      required: true,
      protected: true,
    },

    transactionReferenceCode: {
      description: 'A unique identifier for the transaction.',
      example: 'aq7182jsha0213jkuf9033',
      required: true
    },

  },


  exits: {

    success: {
      description: 'The withdrawal was successful.'
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('./');

    var resInfo = await HTTP.sendHttpRequest({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/disburse',
      body: {
        amount: inputs.amount,
        senderName: inputs.senderName,
        bankcode: inputs.bankCode,
        accountNumber: inputs.accountNumber,
        ref: inputs.transactionReferenceCode,
        lock: inputs.walletPassword,
      },
      headers: {
        Authorization: inputs.accessToken || await Moneywave.getAccessToken()
      }
    });

    // The Moneywave API doesn't necessarily use HTTP status codes,
    // so we have to do an additional check here to catch all errors.
    // See https://moneywave-doc.herokuapp.com/index.html#charge-response-codes for more info.
    if (resInfo.body.status !== 'success') {
      return exits.error(resInfo);
    }

    return exits.success();

  },



};
