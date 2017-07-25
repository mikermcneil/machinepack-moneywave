module.exports = {


  friendlyName: 'Set global credentials',


  description: 'Save the specified developer credentials in a process-wide global variable for future, automatic (and easier) use of other methods.',


  extendedDescription: `If you only need to interact with one developer account (one api key/secret),
  we recommend using this method to simplify your userland code.  It allows you to avoid the headache
  of managing cached tokens yourself.  One notable (yet rare) exception is if you need to manually
  manage token expiry -- e.g. because you're doing a mass deployment and hitting API rate limits for
  requesting too many new tokens.  (This is statistically unlikely to affect your app -- and if it
  does, you'll know about it.)`,


  sync: true,


  inputs: {

    apiKey: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Your Moneywave developer API key.',
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    },

    secret: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Your Moneywave developer secret.',
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    }

  },


  exits: {

    success: {
      description: 'Credentials have been cached for future use in other method calls.'
    },

  },


  fn: async function(inputs, exits) {

    var cache = require('./private/cache');

    cache.apiKey = inputs.apiKey;
    cache.secret = inputs.secret;

    return exits.success();

  }

};
