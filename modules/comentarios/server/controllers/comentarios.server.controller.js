'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Comentario = mongoose.model('Comentario'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Comentario
 */
exports.create = function(req, res) {
  var comentario = new Comentario(req.body);
  comentario.user = req.user;

  comentario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comentario);
    }
  });
};

/**
 * Show the current Comentario
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var comentario = req.comentario ? req.comentario.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  comentario.isCurrentUserOwner = req.user && comentario.user && comentario.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(comentario);
};

/**
 * Update a Comentario
 */
exports.update = function(req, res) {
  var comentario = req.comentario ;

  comentario = _.extend(comentario , req.body);

  comentario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comentario);
    }
  });
};

/**
 * Delete an Comentario
 */
exports.delete = function(req, res) {
  var comentario = req.comentario ;

  comentario.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comentario);
    }
  });
};

/**
 * List of Comentarios
 */
exports.list = function(req, res) { 
  Comentario.find().sort('-created').populate('user', 'displayName').exec(function(err, comentarios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comentarios);
    }
  });
};

/**
 * Comentario middleware
 */
exports.comentarioByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Comentario is invalid'
    });
  }

  Comentario.findById(id).populate('user', 'displayName').exec(function (err, comentario) {
    if (err) {
      return next(err);
    } else if (!comentario) {
      return res.status(404).send({
        message: 'No Comentario with that identifier has been found'
      });
    }
    req.comentario = comentario;
    next();
  });
};
