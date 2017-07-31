module.exports = {


  friendlyName: 'Fund wallet',


  description: 'Generate a temporary 3D Secure url (lasts for ~3 minutes) that can be used to transfer money (naira) from a Nigerian debit card to a Moneywave sub-wallet.',


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#card-to-wallet',


  inputs: {

    accessToken: require('./private/INPUTS').accessToken,

    // apiKey: {
    //   // TODO: figure out why/if this is necessary
    //   // (it doesn't really make a whole lot of sense b/c there's also an access token)
    //   description: 'Your Moneywave API key.',
    //   type: 'string',
    //   protect: true,
    //   whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    // },

    webhookUrl: {
      description: 'The "webhook" (aka "callback") URL that Moneywave should redirect to after the user completes the 3D Secure authorization flow.',
      example: 'https://example.com/webhooks/moneywave/3dsecure',
      required: true
    },

    amount: {
      description: 'The amount of money (naira) to transfer to the sub-wallet.',
      example: 25000,
      required: true
    },

    fee: {
      description: 'The amount of money (naira) to collect as a fee, retaining it in the parent wallet for your developer account.',
      example: 250,
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
      // required: true // TODO: is this actually required?
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
    },

    subWalletUref: {
      description: 'The "uref" of the recipient sub-wallet that will receive funds.',
      example: '823',
      required: true
    }

  },


  exits: {

    success: {
      description: 'The wallet funding was successfully initiated by creating a 3D Secure URL.',
      outputFriendlyName: 'URL',
      outputDescription: 'The 3D Secure URL where the user should be redirected (this is valid for 3 minutes).',
      outputExample: 'http://staging1flutterwave.co:8080/pwc/PxJEOevEj9Dgq6i.html'
    },

  },


  fn: async function(inputs, exits) {

    var HTTP = require('machinepack-http');
    var Moneywave = require('../');

    var resInfo = await HTTP.sendHttpRequest({
      method: 'POST',
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/transfer',
      body:
      {
        firstname: inputs.senderFirstName,
        lastname: inputs.senderLastName,
        email: inputs.senderEmailAddress,
        phonenumber: inputs.senderPhoneNumber,
        charge_with: 'tokenized_card',// eslint-disable-line camelcase
        card_token: inputs.cardToken,// eslint-disable-line camelcase
        recipient: 'wallet',
        recipient_id: inputs.subWalletURef,// eslint-disable-line camelcase
        amount: inputs.amount,
        fee: inputs.fee,
        medium: 'web',
        redirecturl: inputs.webhookUrl,
        // apiKey: inputs.apiKey || cache,// TODO: check if this is actually necessary.  If it is, then we should require the cache and use the cached api key if one wasn't passed in explicitly.
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

    return exits.success(resInfo.data.authurl);

  },



};
