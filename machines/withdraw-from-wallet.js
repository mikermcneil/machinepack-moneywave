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
      // TODO: please clarify about precision of the decimal point, and if it's not clear, ask Mike.
    },

    senderName: {
      // TODO
    },

    accountNumber: {
      // TODO
    },

    bankCode: {
      // TODO
    },

    walletPassword: {
      // TODO
    },

    transactionReferenceCode: {
      // TODO
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
      url: 'https://moneywave.herokuapp.com/v1/merchant/verify',
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
