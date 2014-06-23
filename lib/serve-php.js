/*
 * serve-php
 *
 * http://github.com/UsabilityDynamics/node-serve-php
 *
 * @constructor
 * @version 0.1.0
 */
function Module() {

  // Force new instance.
  if( !( this instanceof Module ) ) {
    return new Module( arguments[0], arguments[1] );
  }

  var serveStatic = require('serve-static');
  var finalhandler = require('finalhandler');
  var connect = require( 'connect' );
  var express = require( 'express' );
  var poweredBy = require('connect-powered-by');
  var temp = require( 'temp' );
  var fs = require( 'fs' );
  var path = require( 'path' );
  var async = require( 'async' );
  var isRunning = require( 'is-running' );
  var fs = require('fs');
  var spawn = require('child_process').spawn;
  var which = require( 'which' )
  var self = this;

  // Automatically track and cleanup files at exit
  temp.track();

  // Mixin Event Emitter and Settings.
  require( 'object-emitter' ).mixin( self );    
  require( 'object-settings' ).mixin( self );    

  // Use config.php from Package to set default settings.
  if( require( '../package.json' ).config && require( '../package.json' ).config.php ) {
    self.set( require( '../package.json' ).config.php );      
  }

  // Define initial settings.
  self.set({
    cwd: process.cwd(),
    pid: process.pid,
    binPath: '/usr/sbin/php-fpm', // @todo Should use which() to identify.
    webRoot: path.resolve( "./static/fixtures/www" ),
    configPath: path.resolve( './static/etc/php-fpm.conf' ),
    iniPath: path.resolve( './static/etc/php.ini' )
  })
  
  // Set from passed arguments.
  self.set( 'object' === typeof arguments[0] ? arguments[0] : {} );  
  self.once( 'ready', 'function' === typeof arguments[1] ? arguments[1] : Module.utility.noop );

  async.auto({
    
    /**
     * Waits for parent Express service to use() serve-php.
     *
     */
    getMounted: function getMounted( done, report ) {
      Module.debug( 'getMounted' );
      
      self.once( 'mount', function mounted() {
        Module.debug( 'mounted' );          
        self.set( 'parent', this.parent );                   
        done( null, this.parent );            
      });      
      
    },
    
    /**
     * Create Working Directory, setup php-fpm config files, etc.
     *
     */
    prepareEnvironment: function prepareEnvironment( done, report ) {
      Module.debug( 'prepareEnvironment' );
      
      temp.mkdir( 'serve-php', function haveWorkingDirectory( error, workingDirectory ) {
        Module.debug( 'haveWorkingDirectory', 'Created temporary directory.', workingDirectory );    
  
        // Generate / Write Settings files. Use static/etc/ as defaults.
        // fs.writeFile( path.join(workingDirectory, 'php-fpm.conf') , '', function(err) {});
        // fs.writeFile( path.join(workingDirectory, 'php.ini') , '', function(err) {});    

        // Update Settings.  
        self.set({
          workingDirectory: workingDirectory,
          //socketPath: path.join(workingDirectory, 'php5-fpm.sock' )        
          //configPath: path.join(workingDirectory, 'php-fpm.conf'),
          //iniPath: path.join(workingDirectory, 'php.ini'),
        });
        
        // Put our x-powered-by header in place.
        self.get( 'parent' ).use( poweredBy( 'Node.js/ServePHP/' + Module.version ) );    

        done( error, workingDirectory );
        
      });
                    
    },
    
    /**
     * Don't spawn php-fpm until environment is valid and parent Express service has accepted us as middleware.
     *
     */
    spawnPHP: [ 'getMounted', 'prepareEnvironment', function spawnPHP( done, report ) {
      Module.debug( 'spawnPHP' );
      
      self._php = spawn( self.get( 'binPath' ), [ '--fpm-config', self.get( 'configPath' ), '--nodaemonize' ], {
        env: process.env,
        cwd: process.cwd(),
        detached: false,
        stdio: 'inherit',
        encoding: 'utf8'
      });
  
      Module.debug( 'Spawned php-fpm', self._php.pid, 'with socket at', self.get( 'socketPath' ) )

      var php = require( "./fastcgi" )({ 
        fastcgiHost: self.get( 'socketPath' ), 
        root: self.get( 'webRoot' ) 
      });

      // Mount Face CGI Middleware.
      self.get( 'parent' ).use( function( req, res, next ) {      
        next();
      })

      self.get( 'parent' ).use( php );          
      
      self._php.once( 'exit', self.teardown.bind( self ) );         
      
      self._php.once( 'close', function() {
        Module.debug( 'php-fom instance closed' );

        if( fs.existsSync( self.get( 'socketPath' ) ) ) {
          fs.unlinkSync( self.get( 'socketPath' ) );      
          Module.debug( 'socketPath deleted.' );                    
        }

      })
      
    }]
    
  })
  //

  process.on( 'uncaughtException', self.teardown.bind( self ) );

  return this;
  

}

/**
 * Instance Properties
 *
 */
Object.defineProperties( Module.prototype, {
  teardown: {
    /**
     *
     */
    value: function teardown(code) {
      
      var isRunning = require( 'is-running' );

      if( this._php && this._php.pid ) {
        
        isRunning( this._php.pid, function( error, live ) {
          
          if( live ) {                     
            Module.debug( 'exiting, kiling', this._php.pid );
            process.kill( this._php.pid );
          }
          
        })
      } else {
        Module.debug( 'teardown() triggered, but context unknown', this, arguments );
      }
      
      
    },
    enumerable: true
  },
  handle: {
    /**
     *
     */
    value: function handle( req, res, next ) {
      Module.debug( 'handling', req.originalUrl );
      
      next();
      
    },
    enumerable: true
  },  
  serveStatic: {
    /**
     *
     */
    value: function serveStatic() {
      
        
      //return next();
      
      var serve = serveStatic( 'public/ftp', {
        index: [ 'index.html', 'index.htm' ],
        hidden: false,
        maxAge: 0,
        redirect: true
      });
      
            
    },
    enumerable: true
  },
  router: {
    /**
     * Route Stuff
     *
     * @for node-php-fpm
     */
    get: function router( ) {
      Module.debug( 'router' );             
      return this;       
    },
    enumerable: true,
    configurable: true
  },

});

/**
 * Constructor Properties
 *
 */
Object.defineProperties( module.exports = Module, {
  utility: {
    value: require( './utility' ),
    enumerable: false,
    writable: false
  },
  debug: {
    value: require( 'debug' )( 'serve-php' ),
    enumerable: false    
  },
  version: {
    value: require( '../package.json' ).version,
    enumerable: true
  },
  createServer: {
    /**
     * Create Instance
     *
     * @for node-php-fpm
     */
    value: function createServer( options, callback ) {
      return new Module( options, callback );
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});