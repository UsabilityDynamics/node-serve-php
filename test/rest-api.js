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
      var php = this.phpInstance =  phpServer.createServer({
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

        var server = this;
        
        module._urls = [
          'http://' + this.address().address + ':' + this.address().port + '/index.php'
        ];

        
        
        // server.close();
        
        ready();
        
      });
            
    },
    
    'fully spawns php-fpm in under two seconds': function( done ) {
      this.timeout( 2000 );      
      this.phpInstance.once( 'ready', done );
    },

    // @todo Make some requests to spawned test service to make sure PHP is working and stuff.
    'serves sample PHP pages': function( done ) {      
      
      this.timeout( 5000 );
      
      done();
      
      
      // var request = require( 'request' );
      // console.log( module._urls );

    }
    
  },
  
  after: function() {
  
    //process.kill( this.phpInstance.get( 'fpmPID' ) );
    
  }
  
}