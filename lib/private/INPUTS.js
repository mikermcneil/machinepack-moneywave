/**
 * Common input definitions that are shared by multiple machines
 *
 * @type {Dictionary}
 * @constant
 */

module.exports = {

  accessToken: {
    description: 'A valid (temporary) merchant access token.',
    extendedDescription: 'This should be omitted if you\'ve used .setGlobalCredentials() -- the recommended approach for most applications.',
    example: 'sedxsawegtyrerw3srsdfzxzzvbhgehh213fdsz',
    protect: true,
    whereToGet: {
      description: 'Call .getAccessToken().'
    }
  },

};
