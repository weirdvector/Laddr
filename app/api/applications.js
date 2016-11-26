// applications.js

var mw = require('../middleware');

module.exports = function(app, models) {

  app.get('/api/applications', mw.verifyToken, function(req, res) {

    models.Application.findAll({
        where: {
          ProfileID: req.decoded.ProfileID
        },
        include: [{
          model: models.Posting,
          include: [{
            model: models.Profile,
            include: [
              models.Organization
            ]
          }]
        }]
      })
      .then(function(applications) {
        for (i = 0; i < applications.length; i++) {
          applications[i].LdrPosting.LdrProfile.Password = undefined;
        }

        res.json({
          success: true,
          applications: applications
        });
      })
      .catch(function(err) {
        res.status(500).json({
          success: false,
          message: err.message
        });
      });
  });

}