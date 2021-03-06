// config/passport.js

var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('./config');
var models = require('../app/models');
var bcrypt = require('bcrypt');

module.exports = function(passport) {

  // serialization methods
  passport.serializeUser(function(profile, done) {
    done(null, profile.ProfileID);
  });

  passport.deserializeUser(function(id, done) {
    models.Profile.find({
      where: {ProfileID: id}
    }).then(function(profile) {
      done(null, profile.toJSON());
    })
    .catch(function(err) {
      done(err, null);
    });
  });

  // local login strategy
  passport.use('local-login', new LocalStrategy({
    usernameField: 'Email',
    passwordField: 'Password',
    passReqToCallback: true
  },
  function(req, email, password, done) {

    // find the requested profile
    models.Profile.find({
      where: {
        Email: email,
        Archived: false
      }}).then(function(profile) {

        // no profile found
        if (!profile) {
          console.log('passport.js - No such profile.');
          return done(null, false, {
            success: false,
            message: 'Invalid login.'
          });
        }

        // incorrect password
        if (!bcrypt.compareSync(password, profile.dataValues.Password)) {
          console.log('passport.js - Bad password.');
          return done(null, false, {
            success: false,
            message: 'Incorrect password.'
          });
        }

        delete profile.dataValues.Password;
        
        return done(null, profile.dataValues, {
          success: true,
          message: 'Profile sent.'
        });

      })
      .catch(function(err) {
        return done(err);
      });
  }));

  // twitter login in
  passport.use(new TwitterStrategy({
    consumerKey: config.twitterAuth.consumerKey,
    consumerSecret: config.twitterAuth.consumerSecret,
    callbackURL: config.twitterAuth.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {

      // console.log('passport.js - profile: ');
      // console.log(profile);
      // console.log('passport.js - token: ');
      // console.log(token);
      // console.log('passport.js - token secret: ');
      // console.log(tokenSecret);

      models.Profile.find({
        where: {
          TwitterID: profile.id
        }
      })
      .then(function(twitterProfile) {

        //user was found, log them in
        if (twitterProfile) {
          return done(null, twitterProfile);
        } else {

          var profileID = uuid.v1();

          //create new user
          models.Profile.build({
              ProfileID: profileID,
              Email: undefined,
              PictureURL: profile.profile_image_url_https,
              Password: undefined,
              Timestamp: new Date(),
              AccountType: 0,
              TwitterID: profile.id,
              TwitterToken: profile.token,
              Archived: false
            })
            .save()
            .then(function(twitterUser) {

              var names = (profile.name).split(' ');
              var firstname = names.shift() || profile.name;
              var lastname = names.join(' ') || undefined;

              models.User.build({
                ProfileID: profileID,
                FirstName: firstname,
                LastName: lastname,
                Description: profile.description,
                Resume: undefined,
                AcademicStatus: 0 
              })
              .save()
              .then(function(user) {
                return done(null, user);
              })
              .catch(function(err) {
                return done(err);
              });
            })
            .catch(function(err) {
              return done(err);
            });
        }
      })
      .catch(function(err) {
        return done(err);
      })
    });
  }));

}