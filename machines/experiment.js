module.exports = {


  friendlyName: 'Experiment',


  description: '',


  inputs: {

    accessToken: {
      description: 'A valid (temporary) merchant access token.',
      example: 'sedxsawegtyrerw3srsdfzxzzvbhgehh213fdsz',
      required: true,
      protect: true,
      whereToGet: { description: 'Call .getAccessToken().' }
    },

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

    walletReferenceCode: {
      type: 'string',
      required: true,
      description: 'A unique identifier for the wallet being created.',
      example: 'gb4h72'
    },

    currency: {
      type: 'string',
      required: true,
      description: 'The ISO 4217 code for this wallet\'s currency type.',
      example: 'NGN'
    }


  },


  exits: {

    success: {
      outputFriendlyName: 'Access token',
      outputDescription: 'A valid merchant access token, good for 2 hours.',
      outputExample: 'sedxsawegtyrerw3srsdfzxzzvbhgehh213fdsz'
    },

  },


  fn: async function(inputs, exits) {

    var Moneywave = require('./');

    var result = await Moneywave.helpExperiment({});
    return exits.success(result);

  },


};
