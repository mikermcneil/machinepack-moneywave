module.exports = {


  friendlyName: 'Get access (merchant) token',


  description: 'Look up your temporary merchant access token, or use your credentials to obtain a new one (good for 2 hours).',


  extendedDescription: `Unless the "insistOnFreshToken" flag is enabled, this method will
  always try to use a cached token.  If the cached token has gone stale, a new token will
  be fetched and cached.`,


  moreInfoUrl: 'https://moneywave-doc.herokuapp.com/index.html#get-access-token',


  inputs: {

    apiKey: {
      type: 'string',
      protect: true,
      description: 'Your Moneywave developer API key.',
      extendedDescription: 'This should be omitted if you\'ve used .setGlobalCredentials() -- the recommended approach for most applications.',
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    },

    secret: {
      type: 'string',
      protect: true,
      description: 'Your Moneywave developer secret.',
      extendedDescription: 'This should be omitted if you\'ve used .setGlobalCredentials() -- the recommended approach for most applications.',
      whereToGet: { url: 'https://moneywave.flutterwave.com/account/preferences' }
    },

    insistOnFreshToken: {
      description: 'When enabled, a fresh token will _always_ be generated.',
      extendedDescription: `By default, a cached, previously-generated token will always
      be returned if it's still fresh enough.  But when this flag is enabled, a fresh token
      will _always_ be generated instead.`,
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

    if (!inputs.insistOnFreshToken) {
      // Moneywave access tokens expire in 2 hours (120 minutes)
      // Here, we leave 10 minutes of leeway, just to be safe.
      var minutesSinceLastCached = (Date.now() - cache.accessTokenCachedAt) / 1000 / 60;
      if (cache.accessToken && minutesSinceLastCached > 110) {
        return exits.success(cache.accessToken);
      }//•
    }//ﬁ

    // If "apiKey" or "secret" are not specified, then they MUST already have been set
    // using .setGlobalCredentials().  If not, then we bail now w/ an error msg.
    if (inputs.apiKey === undefined || inputs.secret === undefined) {
      if (!cache.apiKey) { throw new Error('Cannot fetch access token!  No "apiKey" was explicitly provided, and no implicit "apiKey" was previously set using .setGlobalCredentials().'); }
      if (!cache.secret) { throw new Error('Cannot fetch access token!  No "secret" was explicitly provided, and no implicit "secret" was previously set using .setGlobalCredentials().'); }
    }//ﬁ

    var tokenInfo = await HTTP.post({
      baseUrl: process.env.NODE_ENV==='production' ? 'https://live.moneywaveapi.co' : 'https://moneywave.herokuapp.com',
      url: '/v1/merchant/verify',
      data: {
        apiKey: inputs.apiKey || cache.apiKey,
        secret: inputs.secret || cache.secret
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

  }

};
