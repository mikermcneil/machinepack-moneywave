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

    var Machine = require('machine');
    var helpExperiment = Machine(require('./help-experiment'));

    try {
      var result = await helpExperiment({});
      return exits.success(result);
    } catch (e) {
      // console.error();
      // console.error('What is it??:');
      // console.error('-----------------------------------');
      // var _ = require('@sailshq/lodash');
      // console.error('typeof e', typeof e);
      // console.error('_.isError(e)', _.isError(e));
      // console.error('_.isObject(e)', _.isObject(e));
      // console.error('_.isFunction(e)', _.isFunction(e));
      // console.error('Object.keys(e)', Object.keys(e));
      // console.error('_.keys(e)', _.keys(e));
      // console.error('e.constructor.name', e.constructor.name);
      // console.error('e.name', e.name);
      // console.error('e.message', e.message);
      // console.error('e.stack', e.stack);
      // console.error();
      // console.error('e.raw', e.raw);
      // console.error();
      // console.error('_.isError(e.cause)', _.isError(e.cause));
      // console.error('e.cause', e.cause);
      // console.error();
      // console.error();
      // console.error();
      // console.error('console.error(e):');
      // console.error(e);
      // console.error();
      // console.error('-----------------------------------');
      // console.error();
      return exits.error(e);
    }



  },


};
