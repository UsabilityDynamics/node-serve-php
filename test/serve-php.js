/**
 * Basic Tests
 *
 *
 */
module.exports = {
  
  'serve-php': {
    
    'returns expected methods': function() {      
      var servePHP = require( '../' );      
      servePHP.should.have.property( 'prototype' );
      servePHP.should.have.property( 'createServer' );
      servePHP.should.have.property( 'debug' );      
    }
     
  }
  
}