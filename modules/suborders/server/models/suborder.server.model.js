'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Suborder Schema
 */
var SuborderSchema = new Schema({
  toppings: [ {
    state: {
      type: String,
      default: 'espera',
      enum: ['espera','dispensando', 'dispensado']
    },
    ingredient: {
      type: Schema.ObjectId,
      ref: 'Ingredient'
    },
    quantity: {
      type: String,
      default: 'poco',
      enum: ['poco','mediano','mucho']
    }
  } ],
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  state: {
    type: String,
    default: 'en espera',
    enum: ['completada', 'en proceso', 'en espera']
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Suborder', SuborderSchema);
