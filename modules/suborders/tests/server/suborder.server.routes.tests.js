'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Suborder = mongoose.model('Suborder'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, suborder;

/**
 * Suborder routes tests
 */
describe('Suborder CRUD tests', function () {

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

    // Save a user to the test db and create new Suborder
    user.save(function () {
      suborder = {
        name: 'Suborder name'
      };

      done();
    });
  });

  it('should be able to save a Suborder if logged in', function (done) {
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

        // Save a new Suborder
        agent.post('/api/suborders')
          .send(suborder)
          .expect(200)
          .end(function (suborderSaveErr, suborderSaveRes) {
            // Handle Suborder save error
            if (suborderSaveErr) {
              return done(suborderSaveErr);
            }

            // Get a list of Suborders
            agent.get('/api/suborders')
              .end(function (subordersGetErr, subordersGetRes) {
                // Handle Suborder save error
                if (subordersGetErr) {
                  return done(subordersGetErr);
                }

                // Get Suborders list
                var suborders = subordersGetRes.body;

                // Set assertions
                (suborders[0].user._id).should.equal(userId);
                (suborders[0].name).should.match('Suborder name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Suborder if not logged in', function (done) {
    agent.post('/api/suborders')
      .send(suborder)
      .expect(403)
      .end(function (suborderSaveErr, suborderSaveRes) {
        // Call the assertion callback
        done(suborderSaveErr);
      });
  });

  it('should not be able to save an Suborder if no name is provided', function (done) {
    // Invalidate name field
    suborder.name = '';

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

        // Save a new Suborder
        agent.post('/api/suborders')
          .send(suborder)
          .expect(400)
          .end(function (suborderSaveErr, suborderSaveRes) {
            // Set message assertion
            (suborderSaveRes.body.message).should.match('Please fill Suborder name');

            // Handle Suborder save error
            done(suborderSaveErr);
          });
      });
  });

  it('should be able to update an Suborder if signed in', function (done) {
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

        // Save a new Suborder
        agent.post('/api/suborders')
          .send(suborder)
          .expect(200)
          .end(function (suborderSaveErr, suborderSaveRes) {
            // Handle Suborder save error
            if (suborderSaveErr) {
              return done(suborderSaveErr);
            }

            // Update Suborder name
            suborder.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Suborder
            agent.put('/api/suborders/' + suborderSaveRes.body._id)
              .send(suborder)
              .expect(200)
              .end(function (suborderUpdateErr, suborderUpdateRes) {
                // Handle Suborder update error
                if (suborderUpdateErr) {
                  return done(suborderUpdateErr);
                }

                // Set assertions
                (suborderUpdateRes.body._id).should.equal(suborderSaveRes.body._id);
                (suborderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Suborders if not signed in', function (done) {
    // Create new Suborder model instance
    var suborderObj = new Suborder(suborder);

    // Save the suborder
    suborderObj.save(function () {
      // Request Suborders
      request(app).get('/api/suborders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Suborder if not signed in', function (done) {
    // Create new Suborder model instance
    var suborderObj = new Suborder(suborder);

    // Save the Suborder
    suborderObj.save(function () {
      request(app).get('/api/suborders/' + suborderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', suborder.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Suborder with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/suborders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Suborder is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Suborder which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Suborder
    request(app).get('/api/suborders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Suborder with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Suborder if signed in', function (done) {
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

        // Save a new Suborder
        agent.post('/api/suborders')
          .send(suborder)
          .expect(200)
          .end(function (suborderSaveErr, suborderSaveRes) {
            // Handle Suborder save error
            if (suborderSaveErr) {
              return done(suborderSaveErr);
            }

            // Delete an existing Suborder
            agent.delete('/api/suborders/' + suborderSaveRes.body._id)
              .send(suborder)
              .expect(200)
              .end(function (suborderDeleteErr, suborderDeleteRes) {
                // Handle suborder error error
                if (suborderDeleteErr) {
                  return done(suborderDeleteErr);
                }

                // Set assertions
                (suborderDeleteRes.body._id).should.equal(suborderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Suborder if not signed in', function (done) {
    // Set Suborder user
    suborder.user = user;

    // Create new Suborder model instance
    var suborderObj = new Suborder(suborder);

    // Save the Suborder
    suborderObj.save(function () {
      // Try deleting Suborder
      request(app).delete('/api/suborders/' + suborderObj._id)
        .expect(403)
        .end(function (suborderDeleteErr, suborderDeleteRes) {
          // Set message assertion
          (suborderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Suborder error error
          done(suborderDeleteErr);
        });

    });
  });

  it('should be able to get a single Suborder that has an orphaned user reference', function (done) {
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

          // Save a new Suborder
          agent.post('/api/suborders')
            .send(suborder)
            .expect(200)
            .end(function (suborderSaveErr, suborderSaveRes) {
              // Handle Suborder save error
              if (suborderSaveErr) {
                return done(suborderSaveErr);
              }

              // Set assertions on new Suborder
              (suborderSaveRes.body.name).should.equal(suborder.name);
              should.exist(suborderSaveRes.body.user);
              should.equal(suborderSaveRes.body.user._id, orphanId);

              // force the Suborder to have an orphaned user reference
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

                    // Get the Suborder
                    agent.get('/api/suborders/' + suborderSaveRes.body._id)
                      .expect(200)
                      .end(function (suborderInfoErr, suborderInfoRes) {
                        // Handle Suborder error
                        if (suborderInfoErr) {
                          return done(suborderInfoErr);
                        }

                        // Set assertions
                        (suborderInfoRes.body._id).should.equal(suborderSaveRes.body._id);
                        (suborderInfoRes.body.name).should.equal(suborder.name);
                        should.equal(suborderInfoRes.body.user, undefined);

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
      Suborder.remove().exec(done);
    });
  });
});
