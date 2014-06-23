/*
 * Basic Example
 *
 */
var express = require('express')
var phpServer = require( '../../' );
var app = module.exports = express();

app.set('title', 'My Site');

// Configuration
var php = phpServer.createServer({
  path: 'public/www',
  serveStatic: true,
  rewrites: {},
  config: {}
});

// Routes
app.get('/_status', function( req, res, next ) {
    res.send( 200, 'server up' );
});

// PHP Routes  
app.use( php.router );

// 404
app.get( '/', function( req, res ) {
  res.send( 404, 'nothing found.' );
});

app.listen(process.env.PORT || 8080, process.env.IP || 'localhost', function() {  
  console.log("Express server listening on port %d in %s host", this.address().port, this.address().address);  
});
