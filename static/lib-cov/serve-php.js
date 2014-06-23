// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "lib/serve-php.js",[12,13,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32,35,36,39,40,44,54,55,57,64,66,67,68,69,79,81,82,89,97,99,110,112,120,122,128,129,132,134,136,137,139,140,141,151,153,162,169,171,173,175,176,177,182,194,196,210,228,229,241,262]);
_$jscoverage_init(_$jscoverage_cond, "lib/serve-php.js",[12,39,39,139,171,171,175]);
_$jscoverage["lib/serve-php.js"].source = ["/*"," * serve-php"," *"," * http://github.com/UsabilityDynamics/node-serve-php"," *"," * @constructor"," * @version 0.1.0"," */","function Module() {","","  // Force new instance.","  if( !( this instanceof Module ) ) {","    return new Module( arguments[0], arguments[1] );","  }","","  var serveStatic = require('serve-static');","  var finalhandler = require('finalhandler');","  var connect = require( 'connect' );","  var express = require( 'express' );","  var poweredBy = require('connect-powered-by');","  var temp = require( 'temp' );","  var fs = require( 'fs' );","  var path = require( 'path' );","  var async = require( 'async' );","  var isRunning = require( 'is-running' );","  var fs = require('fs');","  var spawn = require('child_process').spawn;","  var which = require( 'which' )","  var self = this;","","  // Automatically track and cleanup files at exit","  temp.track();","","  // Mixin Event Emitter and Settings.","  require( 'object-emitter' ).mixin( self );    ","  require( 'object-settings' ).mixin( self );    ","","  // Use config.php from Package to set default settings.","  if( require( '../package.json' ).config && require( '../package.json' ).config.php ) {","    self.set( require( '../package.json' ).config.php );      ","  }","","  // Define initial settings.","  self.set({","    cwd: process.cwd(),","    pid: process.pid,","    binPath: '/usr/sbin/php-fpm', // @todo Should use which() to identify.","    webRoot: path.resolve( \"./static/fixtures/www\" ),","    configPath: path.resolve( './static/etc/php-fpm.conf' ),","    iniPath: path.resolve( './static/etc/php.ini' )","  })","  ","  // Set from passed arguments.","  self.set( 'object' === typeof arguments[0] ? arguments[0] : {} );  ","  self.once( 'ready', 'function' === typeof arguments[1] ? arguments[1] : Module.utility.noop );","","  async.auto({","    ","    /**","     * Waits for parent Express service to use() serve-php.","     *","     */","    getMounted: function getMounted( done, report ) {","      Module.debug( 'getMounted' );","      ","      self.once( 'mount', function mounted() {","        Module.debug( 'mounted' );          ","        self.set( 'parent', this.parent );                   ","        done( null, this.parent );            ","      });      ","      ","    },","    ","    /**","     * Create Working Directory, setup php-fpm config files, etc.","     *","     */","    prepareEnvironment: function prepareEnvironment( done, report ) {","      Module.debug( 'prepareEnvironment' );","      ","      temp.mkdir( 'serve-php', function haveWorkingDirectory( error, workingDirectory ) {","        Module.debug( 'haveWorkingDirectory', 'Created temporary directory.', workingDirectory );    ","  ","        // Generate / Write Settings files. Use static/etc/ as defaults.","        // fs.writeFile( path.join(workingDirectory, 'php-fpm.conf') , '', function(err) {});","        // fs.writeFile( path.join(workingDirectory, 'php.ini') , '', function(err) {});    ","","        // Update Settings.  ","        self.set({","          workingDirectory: workingDirectory,","          //socketPath: path.join(workingDirectory, 'php5-fpm.sock' )        ","          //configPath: path.join(workingDirectory, 'php-fpm.conf'),","          //iniPath: path.join(workingDirectory, 'php.ini'),","        });","        ","        // Put our x-powered-by header in place.","        self.get( 'parent' ).use( poweredBy( 'Node.js/ServePHP/' + Module.version ) );    ","","        done( error, workingDirectory );","        ","      });","                    ","    },","    ","    /**","     * Don't spawn php-fpm until environment is valid and parent Express service has accepted us as middleware.","     *","     */","    spawnPHP: [ 'getMounted', 'prepareEnvironment', function spawnPHP( done, report ) {","      Module.debug( 'spawnPHP' );","      ","      self._php = spawn( self.get( 'binPath' ), [ '--fpm-config', self.get( 'configPath' ), '--nodaemonize' ], {","        env: process.env,","        cwd: process.cwd(),","        detached: false,","        stdio: 'inherit',","        encoding: 'utf8'","      });","  ","      Module.debug( 'Spawned php-fpm', self._php.pid, 'with socket at', self.get( 'socketPath' ) )","","      var php = require( \"./fastcgi\" )({ ","        fastcgiHost: self.get( 'socketPath' ), ","        root: self.get( 'webRoot' ) ","      });","","      // Mount Face CGI Middleware.","      self.get( 'parent' ).use( function( req, res, next ) {      ","        next();","      })","","      self.get( 'parent' ).use( php );          ","      ","      self._php.once( 'exit', self.teardown.bind( self ) );         ","      ","      self._php.once( 'close', function() {","        Module.debug( 'php-fom instance closed' );","","        if( fs.existsSync( self.get( 'socketPath' ) ) ) {","          fs.unlinkSync( self.get( 'socketPath' ) );      ","          Module.debug( 'socketPath deleted.' );                    ","        }","","      })","      ","    }]","    ","  })","  //","","  process.on( 'uncaughtException', self.teardown.bind( self ) );","","  return this;","  ","","}","","/**"," * Instance Properties"," *"," */","Object.defineProperties( Module.prototype, {","  teardown: {","    /**","     *","     */","    value: function teardown(code) {","      ","      var isRunning = require( 'is-running' );","","      if( this._php && this._php.pid ) {","        ","        isRunning( this._php.pid, function( error, live ) {","          ","          if( live ) {                     ","            Module.debug( 'exiting, kiling', this._php.pid );","            process.kill( this._php.pid );","          }","          ","        })","      } else {","        Module.debug( 'teardown() triggered, but context unknown', this, arguments );","      }","      ","      ","    },","    enumerable: true","  },","  handle: {","    /**","     *","     */","    value: function handle( req, res, next ) {","      Module.debug( 'handling', req.originalUrl );","      ","      next();","      ","    },","    enumerable: true","  },  ","  serveStatic: {","    /**","     *","     */","    value: function serveStatic() {","      ","        ","      //return next();","      ","      var serve = serveStatic( 'public/ftp', {","        index: [ 'index.html', 'index.htm' ],","        hidden: false,","        maxAge: 0,","        redirect: true","      });","      ","            ","    },","    enumerable: true","  },","  router: {","    /**","     * Route Stuff","     *","     * @for node-php-fpm","     */","    get: function router( ) {","      Module.debug( 'router' );             ","      return this;       ","    },","    enumerable: true,","    configurable: true","  },","","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = Module, {","  utility: {","    value: require( './utility' ),","    enumerable: false,","    writable: false","  },","  debug: {","    value: require( 'debug' )( 'serve-php' ),","    enumerable: false    ","  },","  version: {","    value: require( '../package.json' ).version,","    enumerable: true","  },","  createServer: {","    /**","     * Create Instance","     *","     * @for node-php-fpm","     */","    value: function createServer( options, callback ) {","      return new Module( options, callback );","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Module() {
    _$jscoverage_done("lib/serve-php.js", 12);
    if (_$jscoverage_done("lib/serve-php.js", 12, !(this instanceof Module))) {
        _$jscoverage_done("lib/serve-php.js", 13);
        return new Module(arguments[0], arguments[1]);
    }
    _$jscoverage_done("lib/serve-php.js", 16);
    var serveStatic = require("serve-static");
    _$jscoverage_done("lib/serve-php.js", 17);
    var finalhandler = require("finalhandler");
    _$jscoverage_done("lib/serve-php.js", 18);
    var connect = require("connect");
    _$jscoverage_done("lib/serve-php.js", 19);
    var express = require("express");
    _$jscoverage_done("lib/serve-php.js", 20);
    var poweredBy = require("connect-powered-by");
    _$jscoverage_done("lib/serve-php.js", 21);
    var temp = require("temp");
    _$jscoverage_done("lib/serve-php.js", 22);
    var fs = require("fs");
    _$jscoverage_done("lib/serve-php.js", 23);
    var path = require("path");
    _$jscoverage_done("lib/serve-php.js", 24);
    var async = require("async");
    _$jscoverage_done("lib/serve-php.js", 25);
    var isRunning = require("is-running");
    _$jscoverage_done("lib/serve-php.js", 26);
    var fs = require("fs");
    _$jscoverage_done("lib/serve-php.js", 27);
    var spawn = require("child_process").spawn;
    _$jscoverage_done("lib/serve-php.js", 28);
    var which = require("which");
    _$jscoverage_done("lib/serve-php.js", 29);
    var self = this;
    _$jscoverage_done("lib/serve-php.js", 32);
    temp.track();
    _$jscoverage_done("lib/serve-php.js", 35);
    require("object-emitter").mixin(self);
    _$jscoverage_done("lib/serve-php.js", 36);
    require("object-settings").mixin(self);
    _$jscoverage_done("lib/serve-php.js", 39);
    if (_$jscoverage_done("lib/serve-php.js", 39, require("../package.json").config) && _$jscoverage_done("lib/serve-php.js", 39, require("../package.json").config.php)) {
        _$jscoverage_done("lib/serve-php.js", 40);
        self.set(require("../package.json").config.php);
    }
    _$jscoverage_done("lib/serve-php.js", 44);
    self.set({
        cwd: process.cwd(),
        pid: process.pid,
        binPath: "/usr/sbin/php-fpm",
        webRoot: path.resolve("./static/fixtures/www"),
        configPath: path.resolve("./static/etc/php-fpm.conf"),
        iniPath: path.resolve("./static/etc/php.ini")
    });
    _$jscoverage_done("lib/serve-php.js", 54);
    self.set("object" === typeof arguments[0] ? arguments[0] : {});
    _$jscoverage_done("lib/serve-php.js", 55);
    self.once("ready", "function" === typeof arguments[1] ? arguments[1] : Module.utility.noop);
    _$jscoverage_done("lib/serve-php.js", 57);
    async.auto({
        getMounted: function getMounted(done, report) {
            _$jscoverage_done("lib/serve-php.js", 64);
            Module.debug("getMounted");
            _$jscoverage_done("lib/serve-php.js", 66);
            self.once("mount", function mounted() {
                _$jscoverage_done("lib/serve-php.js", 67);
                Module.debug("mounted");
                _$jscoverage_done("lib/serve-php.js", 68);
                self.set("parent", this.parent);
                _$jscoverage_done("lib/serve-php.js", 69);
                done(null, this.parent);
            });
        },
        prepareEnvironment: function prepareEnvironment(done, report) {
            _$jscoverage_done("lib/serve-php.js", 79);
            Module.debug("prepareEnvironment");
            _$jscoverage_done("lib/serve-php.js", 81);
            temp.mkdir("serve-php", function haveWorkingDirectory(error, workingDirectory) {
                _$jscoverage_done("lib/serve-php.js", 82);
                Module.debug("haveWorkingDirectory", "Created temporary directory.", workingDirectory);
                _$jscoverage_done("lib/serve-php.js", 89);
                self.set({
                    workingDirectory: workingDirectory
                });
                _$jscoverage_done("lib/serve-php.js", 97);
                self.get("parent").use(poweredBy("Node.js/ServePHP/" + Module.version));
                _$jscoverage_done("lib/serve-php.js", 99);
                done(error, workingDirectory);
            });
        },
        spawnPHP: [ "getMounted", "prepareEnvironment", function spawnPHP(done, report) {
            _$jscoverage_done("lib/serve-php.js", 110);
            Module.debug("spawnPHP");
            _$jscoverage_done("lib/serve-php.js", 112);
            self._php = spawn(self.get("binPath"), [ "--fpm-config", self.get("configPath"), "--nodaemonize" ], {
                env: process.env,
                cwd: process.cwd(),
                detached: false,
                stdio: "inherit",
                encoding: "utf8"
            });
            _$jscoverage_done("lib/serve-php.js", 120);
            Module.debug("Spawned php-fpm", self._php.pid, "with socket at", self.get("socketPath"));
            _$jscoverage_done("lib/serve-php.js", 122);
            var php = require("./fastcgi")({
                fastcgiHost: self.get("socketPath"),
                root: self.get("webRoot")
            });
            _$jscoverage_done("lib/serve-php.js", 128);
            self.get("parent").use(function(req, res, next) {
                _$jscoverage_done("lib/serve-php.js", 129);
                next();
            });
            _$jscoverage_done("lib/serve-php.js", 132);
            self.get("parent").use(php);
            _$jscoverage_done("lib/serve-php.js", 134);
            self._php.once("exit", self.teardown.bind(self));
            _$jscoverage_done("lib/serve-php.js", 136);
            self._php.once("close", function() {
                _$jscoverage_done("lib/serve-php.js", 137);
                Module.debug("php-fom instance closed");
                _$jscoverage_done("lib/serve-php.js", 139);
                if (_$jscoverage_done("lib/serve-php.js", 139, fs.existsSync(self.get("socketPath")))) {
                    _$jscoverage_done("lib/serve-php.js", 140);
                    fs.unlinkSync(self.get("socketPath"));
                    _$jscoverage_done("lib/serve-php.js", 141);
                    Module.debug("socketPath deleted.");
                }
            });
        } ]
    });
    _$jscoverage_done("lib/serve-php.js", 151);
    process.on("uncaughtException", self.teardown.bind(self));
    _$jscoverage_done("lib/serve-php.js", 153);
    return this;
}

_$jscoverage_done("lib/serve-php.js", 162);
Object.defineProperties(Module.prototype, {
    teardown: {
        value: function teardown(code) {
            _$jscoverage_done("lib/serve-php.js", 169);
            var isRunning = require("is-running");
            _$jscoverage_done("lib/serve-php.js", 171);
            if (_$jscoverage_done("lib/serve-php.js", 171, this._php) && _$jscoverage_done("lib/serve-php.js", 171, this._php.pid)) {
                _$jscoverage_done("lib/serve-php.js", 173);
                isRunning(this._php.pid, function(error, live) {
                    _$jscoverage_done("lib/serve-php.js", 175);
                    if (_$jscoverage_done("lib/serve-php.js", 175, live)) {
                        _$jscoverage_done("lib/serve-php.js", 176);
                        Module.debug("exiting, kiling", this._php.pid);
                        _$jscoverage_done("lib/serve-php.js", 177);
                        process.kill(this._php.pid);
                    }
                });
            } else {
                _$jscoverage_done("lib/serve-php.js", 182);
                Module.debug("teardown() triggered, but context unknown", this, arguments);
            }
        },
        enumerable: true
    },
    handle: {
        value: function handle(req, res, next) {
            _$jscoverage_done("lib/serve-php.js", 194);
            Module.debug("handling", req.originalUrl);
            _$jscoverage_done("lib/serve-php.js", 196);
            next();
        },
        enumerable: true
    },
    serveStatic: {
        value: function serveStatic() {
            _$jscoverage_done("lib/serve-php.js", 210);
            var serve = serveStatic("public/ftp", {
                index: [ "index.html", "index.htm" ],
                hidden: false,
                maxAge: 0,
                redirect: true
            });
        },
        enumerable: true
    },
    router: {
        get: function router() {
            _$jscoverage_done("lib/serve-php.js", 228);
            Module.debug("router");
            _$jscoverage_done("lib/serve-php.js", 229);
            return this;
        },
        enumerable: true,
        configurable: true
    }
});

_$jscoverage_done("lib/serve-php.js", 241);
Object.defineProperties(module.exports = Module, {
    utility: {
        value: require("./utility"),
        enumerable: false,
        writable: false
    },
    debug: {
        value: require("debug")("serve-php"),
        enumerable: false
    },
    version: {
        value: require("../package.json").version,
        enumerable: true
    },
    createServer: {
        value: function createServer(options, callback) {
            _$jscoverage_done("lib/serve-php.js", 262);
            return new Module(options, callback);
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});