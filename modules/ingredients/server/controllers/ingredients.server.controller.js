'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ingredient = mongoose.model('Ingredient'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ingredient
 */
exports.create = function(req, res) {
  var ingredient = new Ingredient(req.body);
  ingredient.user = req.user;

  ingredient.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ingredient);
    }
  });
};

/**
 * Show the current Ingredient
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ingredient = req.ingredient ? req.ingredient.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ingredient.isCurrentUserOwner = req.user && ingredient.user && ingredient.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(ingredient);
};

/**
 * Update a Ingredient
 */
exports.update = function(req, res) {
  var ingredient = req.ingredient ;

  ingredient = _.extend(ingredient , req.body);

  ingredient.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ingredient);
    }
  });
};

/**
 * Delete an Ingredient
 */
exports.delete = function(req, res) {
  var ingredient = req.ingredient ;

  ingredient.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ingredient);
    }
  });
};

/**
 * List of Ingredients
 */
exports.list = function(req, res) { 
  Ingredient.find().sort('-created').populate('user', 'displayName').exec(function(err, ingredients) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ingredients);
    }
  });
};

/**
 * Ingredient middleware
 */
exports.ingredientByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ingredient is invalid'
    });
  }

  Ingredient.findById(id).populate('user', 'displayName').exec(function (err, ingredient) {
    if (err) {
      return next(err);
    } else if (!ingredient) {
      return res.status(404).send({
        message: 'No Ingredient with that identifier has been found'
      });
    }
    req.ingredient = ingredient;
    next();
  });
};
