'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var descriptionLength = function (description) {
  return description.length < 50;
};

/**
 * Ingredient Schema
 */
var IngredientSchema = new Schema({
  dispNum: {
    type: Number,
    default: -1,
    required: 'Decidir numero de ingrediente'
  },
  name: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Ingredient name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true,
    validate: [descriptionLength, 'La longitud debe ser menor a 50 caracteres']
  },
  cost: {
    type: Number,
    required: 'Agregar un costo'
  },
  statistic: {
    type: Number,
    min: 0
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Ingredient', IngredientSchema);
