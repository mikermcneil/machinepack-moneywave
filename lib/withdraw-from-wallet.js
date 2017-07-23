module.exports = {


  friendlyName: 'Withdraw from wallet',


  description: 'Transfer money from a funded wallet to an account.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#wallet-to-account-single',


  inputs: {

    accessToken: {
      description: 'A valid (temporary) merchant access token.',
      example: 'sedxsawegtyrerw3srsdfzxzzvbhgehh213fdsz',
      required: true,
      protect: true,
      whereToGet: { description: 'Call .getAccessToken().' }
    },

    amount: {
      description: 'The amount of money to withdraw from the wallet.',
      example: 25000
      // TODO: please clarify about precision of the decimal point, and if it's not clear, ask Mike.
    },

    senderName: {
      description: 'The full name of the sender.',
      example: 'Jon Snow'
    },

    accountNumber: {
      description: 'The identifier for the recipient account.'
    },

    bankCode: {
      description: 'The SWIFT/BIC code or routing number for the recipient account\'s bank.',
      example: 'CITINGLA'
    },

    walletPassword: {
      type: 'string',
      required: true,
      protected: true,
      // TODO
    },

    transactionReferenceCode: {
      description: 'A unique identifier for the transaction.',
      example: 'aq7182jsha0213jkuf9033'
    },

  },


  exits: {

    success: {
      description: 'The withdrawal was successful.'
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');

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
        Authorization: inputs.accessToken
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
