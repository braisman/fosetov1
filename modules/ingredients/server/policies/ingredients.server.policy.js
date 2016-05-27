'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Ingredients Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/ingredients',
      permissions: '*'
    }, {
      resources: '/api/ingredients/:ingredientId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/ingredients',
      permissions: ['get', 'post']
    }, {
      resources: '/api/ingredients/:ingredientId',
      permissions: ['get', 'post', 'put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/ingredients',
      permissions: ['get']
    }, {
      resources: '/api/ingredients/:ingredientId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Ingredients Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Ingredient is being processed and the current user created it then allow any manipulation
  if (req.ingredient && req.user && req.ingredient.user && req.ingredient.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
