'use strict';

/**
 * Module dependencies
 */
var subordersPolicy = require('../policies/suborders.server.policy'),
  suborders = require('../controllers/suborders.server.controller');

module.exports = function(app) {
  // Suborders Routes
  app.route('/api/suborders').all(subordersPolicy.isAllowed)
    .get(suborders.list)
    .post(suborders.create);

  app.route('/api/suborders/:suborderId').all(subordersPolicy.isAllowed)
    .get(suborders.read)
    .put(suborders.update)
    .delete(suborders.delete);

  // Finish by binding the Suborder middleware
  app.param('suborderId', suborders.suborderByID);
};
