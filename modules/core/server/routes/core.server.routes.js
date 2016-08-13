'use strict';

module.exports = function (app) {
    // Root routing
    var core = require('../controllers/core.server.controller');

    // Define error pages
    app.route('/server-error').get(core.renderServerError);

    // Return a 404 for all undefined api, module, lib or data routes
    app.route('/:url(api|modules|lib|data)/*').get(core.renderNotFound);

    // Define application route
    app.route('/*').get(core.renderIndex);
};