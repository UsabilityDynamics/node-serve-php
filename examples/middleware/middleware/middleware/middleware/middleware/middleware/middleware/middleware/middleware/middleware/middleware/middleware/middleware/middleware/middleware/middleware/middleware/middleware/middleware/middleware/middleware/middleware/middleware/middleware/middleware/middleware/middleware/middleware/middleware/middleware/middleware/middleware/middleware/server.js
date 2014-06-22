/*
 * Basic Example
 *
 */
var express = require('express')
var phpServer = require( '../../' );

var app = module.exports = express.createServer();

// Configuration
var php = phpServer.createServer({
  path: 'public/www',
  serveStatic: true,
  rewrites: {},
  config: {}
}) 
  
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use( php.router );
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler());
});

// Routes
app.get('/_info', function( req, res, next ) {
    res.send( 'server up' );
});

app.listen(process.env.PORT, process.env.IP);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
