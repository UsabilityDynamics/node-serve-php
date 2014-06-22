#!/usr/bin/env node

module.main       = require( '../' );
module.package    = require( '../package.json' );
module.commander  = require( 'commander' );

module.commander
  .version( module.package.version )
  .option( '-s, --sessions', 'add session support' )
  .option( '-t, --template <engine>', 'specify template engine (jade|ejs) [jade]', 'jade' )
  .option( '-c, --css <engine>', 'specify stylesheet engine (stylus|sass|less) [css]', 'css' )
  .parse( process.argv );

// Start Module
module.commander
  .command( 'start [env]' ).description( 'start module' )
  .option( '-p, --port [port]', 'Which port use', '9000' )
  .action( function( env, options ){});

// Stop Module
module.commander
  .command( 'stop [env]' ).description( 'stop module' )
  .option( '-f, --force', 'Force stop.' )
  .action( function( env, options ){});
