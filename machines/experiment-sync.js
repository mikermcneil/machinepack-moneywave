module.exports = {


  friendlyName: 'Experiment (sync)',


  description: '',


  sync: true,


  args: ['a', 'b'],


  inputs: {
    a: { type: 'number', required: true },
    b: { type: 'number', required: true },
  },


  exits: {},


  fn: function(inputs, exits) {

    return exits.success(inputs.a+inputs.b);

  },


};
