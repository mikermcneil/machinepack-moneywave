module.exports = {


  friendlyName: 'Help experiment',


  description: '',


  inputs: {},


  exits: {},


  fn: async function(inputs, exits) {

    // throw 'whoop';
    throw { cause: 'whoop' };
    // return exits.success('k');

  },


};
