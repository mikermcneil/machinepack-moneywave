module.exports = {


  friendlyName: 'Check debit card',


  description: 'Validate and enquire about the specified debit card number.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#card-enquiry',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

    cardNumber: {
      description: 'The debit card number to check.',
      example: '532375238932235',
      required: true
    }

  },


  exits: {
    success: {
      outputDescription: 'Debit card info',
      outputExample: {
        cardClass: 'DEBIT',
        countryOfIssue: 'NIGERIA',
        countryOfIssueISO: 'NG',
        issuer: 'ACCESS BANK PLC',
        cardType: 'CLASSIC',
        foreign: false,
        cardBrand: 'VISA'
      }
    }
  },


  fn: async function (inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('../');

    var resInfo = await HTTP.post({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/user/card/check',
      data: {
        cardNumber: inputs.cardNumber
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

  }

};

