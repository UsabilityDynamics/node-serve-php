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
_$jscoverage_init(_$jscoverage, "lib/utility.js",[8,11]);
_$jscoverage_init(_$jscoverage_cond, "lib/utility.js",[]);
_$jscoverage["lib/utility.js"].source = ["/**"," * Utility Methods"," *"," * @class Utility"," * @constructor"," */","function Utility() {","  return Object.keys( arguments ) ? require( 'lodash' ).pick.apply( null, [ Utility, Array.prototype.slice.call( arguments ) ] ) : Utility;","}","","Object.defineProperties( module.exports = Utility, {","  noop: {","    /**","     * Placeholder Method","     *","     * @for Utility","     * @method noop","     */","    value: function noop() {},","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Utility() {
    _$jscoverage_done("lib/utility.js", 8);
    return Object.keys(arguments) ? require("lodash").pick.apply(null, [ Utility, Array.prototype.slice.call(arguments) ]) : Utility;
}

_$jscoverage_done("lib/utility.js", 11);
Object.defineProperties(module.exports = Utility, {
    noop: {
        value: function noop() {},
        enumerable: true,
        configurable: true,
        writable: true
    }
});