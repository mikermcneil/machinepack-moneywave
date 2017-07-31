module.exports = {


  friendlyName: 'Tokenize card',


  description: 'Tokenize the specified card credentials for future use (so you don\'t have to store them).',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#card-tokenization',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

    cardNumber: {
      description: 'The debit card number to check.',
      example: '532375238932235',
      required: true
    },

    cardCvv: {
      example: '655',
      required: true
    },

    cardExpiry: {
      example: '07/2022',
      required: true
    }

  },


  exits: {
    success: {
      outputDescription: 'Card token',
      outputExample: 'be711fe2be4edb35cc554fc6428b1f64'
    }
  },


  fn: async function (inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('../');

    var resInfo = await HTTP.post({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/transfer/charge/tokenize/card',
      data: {
        card_no: inputs.cardNumber,// eslint-disable-line camelcase
        cvv: inputs.cardCvv,
        expiry_month: inputs.cardExpiry.split(/\//)[0],// eslint-disable-line camelcase
        expiry_year: inputs.cardExpiry.split(/\//)[1],// eslint-disable-line camelcase
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

    return exits.success(resInfo.data.cardToken);

  }

};

