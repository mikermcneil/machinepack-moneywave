module.exports = {


  friendlyName: 'Check transaction status',


  description: 'Check the status of the 3D Secure charge transaction with the specified "ref".',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#transaction-status-check-api-card-to-account',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

    ref: {
      description: 'The reference string ("ref") of the transaction to check.',
      example: 'FLWT00632171',
      required: true
    },

  },


  exits: {

    success: {
      description: 'This account number and bank code combo seem legit enough.',
      outputFriendlyName: 'Transaction info',
      outputDescription: 'Information about this 3D Secure charge transaction, including its status and amount.',
      outputExample: {}
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('../');

    var resInfo = await HTTP.post({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/transfer/charge/status',
      data: {
        ref: inputs.ref,
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
