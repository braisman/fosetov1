'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Suborder = mongoose.model('Suborder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Suborder
 */
exports.create = function(req, res) {
  var suborder = new Suborder(req.body);
  suborder.user = req.user;

  suborder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(suborder);
    }
  });
};

/**
 * Show the current Suborder
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var suborder = req.suborder ? req.suborder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  suborder.isCurrentUserOwner = req.user && suborder.user && suborder.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(suborder);
};

/**
 * Update a Suborder
 */
exports.update = function(req, res) {
  var suborder = req.suborder ;

  suborder = _.extend(suborder , req.body);

  suborder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(suborder);
    }
  });
};

/**
 * Delete an Suborder
 */
exports.delete = function(req, res) {
  var suborder = req.suborder ;

  suborder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(suborder);
    }
  });
};

/**
 * List of Suborders
 */
exports.list = function(req, res) {
  Suborder.find().sort('-created').populate('user', 'displayName').populate('toppings.ingredient').exec(function(err, suborders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(suborders);
    }
  });
};

/**
 * Suborder middleware
 */
exports.suborderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Suborder is invalid'
    });
  }

  Suborder.findById(id).populate('user').populate('toppings.ingredient').exec(function (err, suborder) {
    if (err) {
      return next(err);
    } else if (!suborder) {
      return res.status(404).send({
        message: 'No Suborder with that identifier has been found'
      });
    }
    req.suborder = suborder;
    next();
  });
};
