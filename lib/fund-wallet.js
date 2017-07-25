module.exports = {


  friendlyName: 'Fund wallet',


  description: 'Transfer money (naira) from a Nigerian bank account to a Moneywave wallet.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html?javascript#pay-with-internet-banking',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

    apiKey: {
      description: 'Your Moneywave API key.',
      type: 'string',
      required: true,
      protect: true,
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    },

    amount: {
      description: 'The amount of money (naira) to transfer to the wallet.',
      example: 25000,
      required: true
    },

    senderFirstName: {
      description: 'The first name of the sender.',
      example: 'Jon',
      required: true
    },

    senderLastName: {
      description: 'The last name of the sender.',
      example: 'Snow',
      required: true
    },

    senderPhoneNumber: {
      description: 'The phone number of the sender (must be in international format, and start with a "+").',
      example: '+1 555 555 5555',
      required: true
    },

    senderEmailAddress: {
      description: 'The email address of the sender.',
      example: 'foo@foobar.com',
      required: true
    },

    senderAccountNumber: {
      description: 'The bank account number of the sender.',
      example: '0690000022',
      required: true
    },

    senderBankCode: {
      description: 'The SWIFT/BIC code or routing number of the sender.',
      example: '044',
      required: true
    }

  },


  exits: {

    success: {
      description: 'The wallet funding was successfully initiated (pending OTP validation before transaction can be completed).'
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('./');

    var resInfo = await HTTP.sendHttpRequest({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/transfer',
      body:
      {
        firstname: inputs.senderFirstName,
        lastname: inputs.senderLastName,
        email: inputs.senderEmailAddress,
        phonenumber: inputs.senderPhoneNumber,
        charge_with: 'account',// eslint-disable-line camelcase
        recipient: 'wallet',
        sender_account_number: inputs.senderAccountNumber,// eslint-disable-line camelcase
        sender_bank: inputs.senderBankCode,// eslint-disable-line camelcase
        apiKey: inputs.apiKey,
        amount: inputs.amount,
        // fee: 45, // TODO: check on what using this would mean
        medium: 'web',// TODO: figure this out
        redirecturl: 'https://google.com'// TODO: figure this out
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
