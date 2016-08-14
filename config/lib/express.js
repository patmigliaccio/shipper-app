'use strict';

var config  = require('../config'),
    express = require('express'),
    consolidate = require('consolidate'),
    path    = require('path');

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
    // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set('view engine', 'server.view.html');
    app.set('views', './');
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
    config.files.server.configs.forEach(function (configPath) {
        require(path.resolve(configPath))(app, db);
    });
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
    // Setting the app router and static folders
    app.use('/', express.static(path.resolve('./public')));

    // Temporary for migration to Node TODO full migrate and remove
    config.folders.client = config.folders.client.concat(['/app/', '/data/']);

    // Globbing static routing
    config.folders.client.forEach(function (staticPath) {
        app.use(staticPath, express.static(path.resolve('./' + staticPath)));
    });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
    // Globbing routing files
    config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // Showing stack errors
    app.set('showStackError', true);

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // Log it
        console.error(err.stack);

        // Redirect to error page
        res.redirect('/server-error');
    });
};

module.exports.init = function (db) {
    // Initialize express app
    var app = express();

/*    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Initialize Express session
    this.initSession(app, db);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);

    // Initialize modules server authorization policies
    this.initModulesServerPolicies(app);

    // Configure Socket.io
    app = this.configureSocketIO(app, db);*/

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);

    // Initialize modules static client routes, before session!
    this.initModulesClientRoutes(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    return app;
};