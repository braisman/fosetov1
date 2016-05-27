'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ingredient = mongoose.model('Ingredient'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ingredient;

/**
 * Ingredient routes tests
 */
describe('Ingredient CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Ingredient
    user.save(function () {
      ingredient = {
        name: 'Ingredient name'
      };

      done();
    });
  });

  it('should be able to save a Ingredient if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ingredient
        agent.post('/api/ingredients')
          .send(ingredient)
          .expect(200)
          .end(function (ingredientSaveErr, ingredientSaveRes) {
            // Handle Ingredient save error
            if (ingredientSaveErr) {
              return done(ingredientSaveErr);
            }

            // Get a list of Ingredients
            agent.get('/api/ingredients')
              .end(function (ingredientsGetErr, ingredientsGetRes) {
                // Handle Ingredient save error
                if (ingredientsGetErr) {
                  return done(ingredientsGetErr);
                }

                // Get Ingredients list
                var ingredients = ingredientsGetRes.body;

                // Set assertions
                (ingredients[0].user._id).should.equal(userId);
                (ingredients[0].name).should.match('Ingredient name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ingredient if not logged in', function (done) {
    agent.post('/api/ingredients')
      .send(ingredient)
      .expect(403)
      .end(function (ingredientSaveErr, ingredientSaveRes) {
        // Call the assertion callback
        done(ingredientSaveErr);
      });
  });

  it('should not be able to save an Ingredient if no name is provided', function (done) {
    // Invalidate name field
    ingredient.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ingredient
        agent.post('/api/ingredients')
          .send(ingredient)
          .expect(400)
          .end(function (ingredientSaveErr, ingredientSaveRes) {
            // Set message assertion
            (ingredientSaveRes.body.message).should.match('Please fill Ingredient name');

            // Handle Ingredient save error
            done(ingredientSaveErr);
          });
      });
  });

  it('should be able to update an Ingredient if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ingredient
        agent.post('/api/ingredients')
          .send(ingredient)
          .expect(200)
          .end(function (ingredientSaveErr, ingredientSaveRes) {
            // Handle Ingredient save error
            if (ingredientSaveErr) {
              return done(ingredientSaveErr);
            }

            // Update Ingredient name
            ingredient.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ingredient
            agent.put('/api/ingredients/' + ingredientSaveRes.body._id)
              .send(ingredient)
              .expect(200)
              .end(function (ingredientUpdateErr, ingredientUpdateRes) {
                // Handle Ingredient update error
                if (ingredientUpdateErr) {
                  return done(ingredientUpdateErr);
                }

                // Set assertions
                (ingredientUpdateRes.body._id).should.equal(ingredientSaveRes.body._id);
                (ingredientUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ingredients if not signed in', function (done) {
    // Create new Ingredient model instance
    var ingredientObj = new Ingredient(ingredient);

    // Save the ingredient
    ingredientObj.save(function () {
      // Request Ingredients
      request(app).get('/api/ingredients')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ingredient if not signed in', function (done) {
    // Create new Ingredient model instance
    var ingredientObj = new Ingredient(ingredient);

    // Save the Ingredient
    ingredientObj.save(function () {
      request(app).get('/api/ingredients/' + ingredientObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', ingredient.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ingredient with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ingredients/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ingredient is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ingredient which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ingredient
    request(app).get('/api/ingredients/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ingredient with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ingredient if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Ingredient
        agent.post('/api/ingredients')
          .send(ingredient)
          .expect(200)
          .end(function (ingredientSaveErr, ingredientSaveRes) {
            // Handle Ingredient save error
            if (ingredientSaveErr) {
              return done(ingredientSaveErr);
            }

            // Delete an existing Ingredient
            agent.delete('/api/ingredients/' + ingredientSaveRes.body._id)
              .send(ingredient)
              .expect(200)
              .end(function (ingredientDeleteErr, ingredientDeleteRes) {
                // Handle ingredient error error
                if (ingredientDeleteErr) {
                  return done(ingredientDeleteErr);
                }

                // Set assertions
                (ingredientDeleteRes.body._id).should.equal(ingredientSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ingredient if not signed in', function (done) {
    // Set Ingredient user
    ingredient.user = user;

    // Create new Ingredient model instance
    var ingredientObj = new Ingredient(ingredient);

    // Save the Ingredient
    ingredientObj.save(function () {
      // Try deleting Ingredient
      request(app).delete('/api/ingredients/' + ingredientObj._id)
        .expect(403)
        .end(function (ingredientDeleteErr, ingredientDeleteRes) {
          // Set message assertion
          (ingredientDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ingredient error error
          done(ingredientDeleteErr);
        });

    });
  });

  it('should be able to get a single Ingredient that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Ingredient
          agent.post('/api/ingredients')
            .send(ingredient)
            .expect(200)
            .end(function (ingredientSaveErr, ingredientSaveRes) {
              // Handle Ingredient save error
              if (ingredientSaveErr) {
                return done(ingredientSaveErr);
              }

              // Set assertions on new Ingredient
              (ingredientSaveRes.body.name).should.equal(ingredient.name);
              should.exist(ingredientSaveRes.body.user);
              should.equal(ingredientSaveRes.body.user._id, orphanId);

              // force the Ingredient to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Ingredient
                    agent.get('/api/ingredients/' + ingredientSaveRes.body._id)
                      .expect(200)
                      .end(function (ingredientInfoErr, ingredientInfoRes) {
                        // Handle Ingredient error
                        if (ingredientInfoErr) {
                          return done(ingredientInfoErr);
                        }

                        // Set assertions
                        (ingredientInfoRes.body._id).should.equal(ingredientSaveRes.body._id);
                        (ingredientInfoRes.body.name).should.equal(ingredient.name);
                        should.equal(ingredientInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Ingredient.remove().exec(done);
    });
  });
});
