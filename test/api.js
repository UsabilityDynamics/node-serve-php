/**
 * Basic Tests
 *
 *
 */
module.exports = {
  
  'serve-php': {
    
    before: function( ready ) {
      var express = require('express')
      var phpServer = require( '../' );      
      var app = express();

      // Configuration
      var php = phpServer.createServer({
        path: require( 'path' ).resolve( '../static/fixtues/www' ),
        serveStatic: true
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

      app.listen( null, 'localhost', function() {
        // console.log("Express server listening on port %d in %s host", this.address().port, this.address().address);  
        
        module._urls = [
          'http://' + this.address().address + ':' + this.address().port + '/index.php'
        ];
        
        ready();
        
      });
            
    },

    // @todo Make some requests to spawned test service to make sure PHP is working and stuff.
    'serves sample PHP pages': function( done ) {      
  
      done();    
      
      // var request = require( 'request' );
      // console.log( module._urls );

    }
    
  }
  
}