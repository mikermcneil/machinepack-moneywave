module.exports = {


  friendlyName: 'Get access (merchant) token',


  description: 'Obtain a temporary merchant access token (good for 2 hours) using the given credentials.',


  extendedDescription: `If the "useCachedTokenIfPossible" flag is enabled, then a cached token
  will be used unless it has gone stale.`,


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#get-access-token',


  inputs: {

    apiKey: {
      type: 'string',
      required: true,
      protect: true,
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    },

    secret: {
      type: 'string',
      required: true,
      protect: true,
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    },

    useCachedTokenIfPossible: {
      description: 'When enabled, a previously-generated token will be returned if it\'s still fresh enough.',
      extendedDescription: 'When this is disabled (which it is by default) a fresh token will _always_ be generated.',
      type: 'boolean',
      defaultsTo: false
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

    var HTTP = require('machinepack-http');
    var cache = require('./private/cache');

    if (inputs.useCachedTokenIfPossible) {

      // Moneywave access tokens expire in 2 hours (120 minutes)
      // Here, we leave 10 minutes of leeway, just to be safe.
      var minutesSinceLastCached = (Date.now() - cache.accessTokenCachedAt) / 1000 / 60;
      if (cache.accessToken && minutesSinceLastCached > 110) {
        return exits.success(cache.accessToken);
      }//•

    }//ﬁ

    var tokenInfo = await HTTP.post({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/merchant/verify',
      data: {
        apiKey: inputs.apiKey,
        secret: inputs.secret
      }
    });

    // The Moneywave API doesn't necessarily use HTTP status codes,
    // so we have to do an additional check here to catch all errors.
    // See https://moneywave-doc.herokuapp.com/index.html#charge-response-codes for more info.
    if (tokenInfo.status !== 'success') {
      return exits.error(tokenInfo);
    }

    // Always cache for next time, in case a subsequent call ends up wanting to use the cache.
    cache.accessToken = tokenInfo.token;
    cache.accessTokenCachedAt = Date.now();

    return exits.success(tokenInfo.token);

  },



};
