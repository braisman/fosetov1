'use strict';

/**
 * Module dependencies
 */
var comentariosPolicy = require('../policies/comentarios.server.policy'),
  comentarios = require('../controllers/comentarios.server.controller');

module.exports = function(app) {
  // Comentarios Routes
  app.route('/api/comentarios').all(comentariosPolicy.isAllowed)
    .get(comentarios.list)
    .post(comentarios.create);

  app.route('/api/comentarios/:comentarioId').all(comentariosPolicy.isAllowed)
    .get(comentarios.read)
    .put(comentarios.update)
    .delete(comentarios.delete);

  // Finish by binding the Comentario middleware
  app.param('comentarioId', comentarios.comentarioByID);
};
