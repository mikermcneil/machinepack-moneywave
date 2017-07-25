module.exports = {


  friendlyName: 'Check bank account number',


  description: 'Validate the specified bank account number using what we know about the scheme used by its containing bank.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html?javascript#account-number-validation',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

    accountNumber: {
      description: 'The account number for this bank account.',
      example: '0690000005',
      required: true
    },

    bankCode: {
      description: 'The FLW bank code for the bank.',
      example: '323',
      required: true,
      whereToGet: { url: 'https://moneywave-doc.herokuapp.com/index.html?javascript#get-list-of-banks' },
    },


  },


  exits: {

    success: {
      description: 'This account number and bank code combo seem legit enough.',
      outputFriendlyName: 'Account info',
      outputDescription: 'Information about this bank account, such as the account holder\'s name.',
      outputExample: {}
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('../');

    var resInfo = await HTTP.post({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/resolve/account',
      data: {
        account_number: inputs.accountNumber,// eslint-disable-line camelcase
        bank_code: inputs.bankCode,// eslint-disable-line camelcase
      },
      headers: {
        Authorization: inputs.accessToken || await Moneywave.getAccessToken()
      }
    });

    // The Moneywave API doesn't necessarily use HTTP status codes,
    // so we have to do an additional check here to catch all errors.
    // See https://moneywave-doc.herokuapp.com/index.html#charge-response-codes for more info.
    if (resInfo.status !== 'success') {
      return exits.error(resInfo);
    }

    return exits.success(resInfo.data);

  },


};
