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
_$jscoverage_init(_$jscoverage, "lib/fastcgi.js",[1,2,10,12,13,14,15,16,17,35,36,39,40,41,42,44,47,50,70,71,73,74,76,83,88,91,92,93,94,95,96,97,99,104,105,106,107,108,110,111,112,113,114,117,118,119,120,126,127,129,130,131,132,133,134,135,137,138,139,144,145,146,147,148,149,150,151,153,157,159,160,163,164,165,167,169,171,172,173,175,177,179,180,182,184,186,187,188,189,190,191,192,195,201,203,204,205,206,207,210,212,215,216,217,218,222,226,229,230,233,234,235,238,243,249,250,253,254,255,257,258,273,274,275]);
_$jscoverage_init(_$jscoverage_cond, "lib/fastcgi.js",[35,42,91,126,126,138,145,172,172,190,203,215,215,217]);
_$jscoverage["lib/fastcgi.js"].source = ["module.exports = function fastcgi(newOptions) {","    var url     = require('url')","    , fs      = require('fs')","    , path    = require(\"path\")","    , http    = require(\"http\")","    , net     = require(\"net\")","    , sys     = require(\"sys\")","    , fastcgi = require(\"fastcgi-parser\");","","    var debug = 0 ? console : { log: function(){}, dir: function(){} };","","    var FCGI_RESPONDER = fastcgi.constants.role.FCGI_RESPONDER;","    var FCGI_BEGIN     = fastcgi.constants.record.FCGI_BEGIN;","    var FCGI_STDIN     = fastcgi.constants.record.FCGI_STDIN;","    var FCGI_STDOUT    = fastcgi.constants.record.FCGI_STDOUT;","    var FCGI_PARAMS    = fastcgi.constants.record.FCGI_PARAMS;","    var FCGI_END       = fastcgi.constants.record.FCGI_END;","","    /**","     * Make headers for FPM","     *","     * Some headers have to be modified to fit the FPM","     * handler and some others don't. For instance, the Content-Type","     * header, when received, has to be made upper-case and the ","     * hyphen has to be made into an underscore. However, the Accept","     * header has to be made uppercase, hyphens turned into underscores","     * and the string \"HTTP_\" has to be appended to the header.","     *","     * @param  array headers An array of existing user headers from Node.js","     * @param  array params  An array of pre-built headers set in serveFpm","     *","     * @return array         An array of complete headers.","     */","    function makeHeaders(headers, params) {","        if (headers.length <= 0) {","            return params;","        }","","        for (var prop in headers) {","            var head = headers[prop];","            prop = prop.replace(/-/, '_').toUpperCase();","            if (prop.indexOf('CONTENT_') < 0) {","                // Quick hack for PHP, might be more or less headers.","                prop = 'HTTP_' + prop;","            }","","            params[params.length] = [prop, head]","        }","","        return params;","    };","","    /**","     * Interact with FPM","     *","     * This function is used to interact with the FastCGI protocol","     * using net.Stream and the fastcgi module.","     *","     * We pass the request, the response, some params and some options","     * that we then use to serve the response to our client.","     *","     * @param object Request  The HTTP Request object.","     * @param object Response The HTTP Response object to use.","     * @param array  Params   A list of parameters to pass to FCGI","     * @param array  options  A list of options like the port of the fpm server.","     *","     * @return void","     */","    function server(request, response, params, options, next) {","        var connection = new net.Stream();","        connection.setNoDelay(true);","","        var writer = null;","        var parser = null;","","        var header = {","            \"version\": fastcgi.constants.version,","            \"type\": FCGI_BEGIN,","            \"recordId\": 0,","            \"contentLength\": 0,","            \"paddingLength\": 0","        };","        var begin = {","            \"role\": FCGI_RESPONDER,","            \"flags\": fastcgi.constants.keepalive.OFF","        };","        ","        var collectedStdin = [], noMoreData = false;","        ","        function endRequest() {","            if(writer) {","                header.type = FCGI_STDIN;","                header.contentLength = 0;","                header.paddingLength = 0;","                writer.writeHeader(header)","                connection.write(writer.tobuffer());","                connection.end();","            } else {","                noMoreData = true;","            }","        }    ","","        function sendRequest (connection) {","            header.type = FCGI_BEGIN;","            header.contentLength = 8;","            writer.writeHeader(header);","            writer.writeBegin(begin);","            connection.write(writer.tobuffer());","","            header.type = FCGI_PARAMS;","            header.contentLength = fastcgi.getParamLength(params);","            writer.writeHeader(header);","            writer.writeParams(params);","            connection.write(writer.tobuffer());","","","            header.type = FCGI_PARAMS;","            header.contentLength = 0;","            writer.writeHeader(header);","            connection.write(writer.tobuffer());","            ","            // header.type = FCGI_STDOUT;","            // writer.writeHeader(header);","            // connection.write(writer.tobuffer());","","            if((request.method != 'PUT' && request.method != 'POST')) {","                endRequest()        ","            } else {","                for(var j = 0; j < collectedStdin.length; ++j) {","                    header.type = FCGI_STDIN;","                    header.contentLength = collectedStdin[j].length;","                    header.paddingLength = 0;","                    writer.writeHeader(header);","                    writer.writeBody(collectedStdin[j].toString());        ","                    connection.write(writer.tobuffer());","                }","                collectedStdin = [];                    ","                if(noMoreData) {","                    endRequest();","                }","            }","        };","        ","        request.on('data', function(chunk) {","            if(writer) {            ","                header.type = FCGI_STDIN;","                header.contentLength = chunk.length;","                header.paddingLength = 0;","                writer.writeHeader(header);","                writer.writeBody(chunk);        ","                connection.write(writer.tobuffer())","            } else {","                collectedStdin.push(chunk);","            }","        });        ","        ","        request.on('end', endRequest);          ","","        connection.ondata = function (buffer, start, end) {","            parser.execute(buffer, start, end); ","        };","","        connection.addListener(\"connect\", function() {","            writer = new fastcgi.writer();","            parser = new fastcgi.parser();","            ","            writer.encoding = 'binary';","            ","            var body=\"\", hadheaders = false;","","            parser.onRecord = function(record) {","                if (record.header.type == FCGI_STDOUT && !hadheaders) {","                    body = record.body;","                    ","                    debug.log(body);","                    ","                    var parts = body.split(\"\\r\\n\\r\\n\");","","                    var headers = parts[0];","                    var headerParts = headers.split(\"\\r\\n\");","","                    body = parts[1];","","                    var responseStatus = 200;","","                    headers = [];","                    try {","                        for(var i in headerParts) {","                            header = headerParts[i].split(': ');","                            if (header[0].indexOf('Status') >= 0) {","                                responseStatus = header[1].substr(0, 3);","                                continue;","                            }","","                            headers.push([header[0], header[1]]);","                        }","                    } catch (err) {","                        //console.log(err);","                    }","                    ","                    debug.log('  --> Request Response Status Code: \"' + responseStatus + '\"');","                    ","                    if(responseStatus === \"404\") {","                        next();","                        parser.onRecord = function() {};","                        connection.end();","                        return;","                    }                    ","","                    response.writeHead(responseStatus, headers);","                    ","                    hadheaders = true;","","                    ","                } else if(record.header.type == FCGI_STDOUT && hadheaders) {                ","                    body += record.body;","                } else if(record.header.type == FCGI_END) {                ","                    response.end(body);","                }","            };","","            parser.onError = function(err) {","                //console.log(err);","            };","","            sendRequest(connection);         ","        });","","        connection.addListener(\"close\", function() {","            connection.end();","        });","","        connection.addListener(\"error\", function(err) {","            sys.puts(sys.inspect(err.stack));","            connection.end();","        });","","                    connection.connect(options.fastcgiHost);              ","","    }","","    // Let's mix those options.","    var options = {","        fastcgiPort: 9000,","        fastcgiHost: 'localhost',","        root: ''","    };","","    for (var k in newOptions) {","        options[k] = newOptions[k];","    }    ","    ","    return function(request, response, next) {","        var script_dir = options.root;","        var script_file = url.parse(request.url).pathname;","        ","        var qs = url.parse(request.url).query ? url.parse(request.url).query : '';","        var params = makeHeaders(request.headers, [","            [\"SCRIPT_FILENAME\",script_dir + script_file],","            [\"REMOTE_ADDR\",request.connection.remoteAddress],","            [\"QUERY_STRING\", qs],","            [\"REQUEST_METHOD\", request.method],","            [\"SCRIPT_NAME\", script_file],","            [\"PATH_INFO\", script_file],","            [\"DOCUMENT_URI\", script_file],","            [\"REQUEST_URI\", request.url],","            [\"DOCUMENT_ROOT\", script_dir],","            [\"PHP_SELF\", script_file],","            [\"GATEWAY_PROTOCOL\", \"CGI/1.1\"],","            [\"SERVER_SOFTWARE\", \"node/\" + process.version]","        ]);","        ","        debug.log('Incoming Request: ' + request.method + ' ' + request.url);","        debug.dir(params);","        server(request, response, params, options, next);","    };","}",""];
_$jscoverage_done("lib/fastcgi.js", 1);
module.exports = function fastcgi(newOptions) {
    _$jscoverage_done("lib/fastcgi.js", 2);
    var url = require("url"), fs = require("fs"), path = require("path"), http = require("http"), net = require("net"), sys = require("sys"), fastcgi = require("fastcgi-parser");
    _$jscoverage_done("lib/fastcgi.js", 10);
    var debug = 0 ? console : {
        log: function() {},
        dir: function() {}
    };
    _$jscoverage_done("lib/fastcgi.js", 12);
    var FCGI_RESPONDER = fastcgi.constants.role.FCGI_RESPONDER;
    _$jscoverage_done("lib/fastcgi.js", 13);
    var FCGI_BEGIN = fastcgi.constants.record.FCGI_BEGIN;
    _$jscoverage_done("lib/fastcgi.js", 14);
    var FCGI_STDIN = fastcgi.constants.record.FCGI_STDIN;
    _$jscoverage_done("lib/fastcgi.js", 15);
    var FCGI_STDOUT = fastcgi.constants.record.FCGI_STDOUT;
    _$jscoverage_done("lib/fastcgi.js", 16);
    var FCGI_PARAMS = fastcgi.constants.record.FCGI_PARAMS;
    _$jscoverage_done("lib/fastcgi.js", 17);
    var FCGI_END = fastcgi.constants.record.FCGI_END;
    function makeHeaders(headers, params) {
        _$jscoverage_done("lib/fastcgi.js", 35);
        if (_$jscoverage_done("lib/fastcgi.js", 35, headers.length <= 0)) {
            _$jscoverage_done("lib/fastcgi.js", 36);
            return params;
        }
        _$jscoverage_done("lib/fastcgi.js", 39);
        for (var prop in headers) {
            _$jscoverage_done("lib/fastcgi.js", 40);
            var head = headers[prop];
            _$jscoverage_done("lib/fastcgi.js", 41);
            prop = prop.replace(/-/, "_").toUpperCase();
            _$jscoverage_done("lib/fastcgi.js", 42);
            if (_$jscoverage_done("lib/fastcgi.js", 42, prop.indexOf("CONTENT_") < 0)) {
                _$jscoverage_done("lib/fastcgi.js", 44);
                prop = "HTTP_" + prop;
            }
            _$jscoverage_done("lib/fastcgi.js", 47);
            params[params.length] = [ prop, head ];
        }
        _$jscoverage_done("lib/fastcgi.js", 50);
        return params;
    }
    function server(request, response, params, options, next) {
        _$jscoverage_done("lib/fastcgi.js", 70);
        var connection = new net.Stream;
        _$jscoverage_done("lib/fastcgi.js", 71);
        connection.setNoDelay(true);
        _$jscoverage_done("lib/fastcgi.js", 73);
        var writer = null;
        _$jscoverage_done("lib/fastcgi.js", 74);
        var parser = null;
        _$jscoverage_done("lib/fastcgi.js", 76);
        var header = {
            version: fastcgi.constants.version,
            type: FCGI_BEGIN,
            recordId: 0,
            contentLength: 0,
            paddingLength: 0
        };
        _$jscoverage_done("lib/fastcgi.js", 83);
        var begin = {
            role: FCGI_RESPONDER,
            flags: fastcgi.constants.keepalive.OFF
        };
        _$jscoverage_done("lib/fastcgi.js", 88);
        var collectedStdin = [], noMoreData = false;
        function endRequest() {
            _$jscoverage_done("lib/fastcgi.js", 91);
            if (_$jscoverage_done("lib/fastcgi.js", 91, writer)) {
                _$jscoverage_done("lib/fastcgi.js", 92);
                header.type = FCGI_STDIN;
                _$jscoverage_done("lib/fastcgi.js", 93);
                header.contentLength = 0;
                _$jscoverage_done("lib/fastcgi.js", 94);
                header.paddingLength = 0;
                _$jscoverage_done("lib/fastcgi.js", 95);
                writer.writeHeader(header);
                _$jscoverage_done("lib/fastcgi.js", 96);
                connection.write(writer.tobuffer());
                _$jscoverage_done("lib/fastcgi.js", 97);
                connection.end();
            } else {
                _$jscoverage_done("lib/fastcgi.js", 99);
                noMoreData = true;
            }
        }
        function sendRequest(connection) {
            _$jscoverage_done("lib/fastcgi.js", 104);
            header.type = FCGI_BEGIN;
            _$jscoverage_done("lib/fastcgi.js", 105);
            header.contentLength = 8;
            _$jscoverage_done("lib/fastcgi.js", 106);
            writer.writeHeader(header);
            _$jscoverage_done("lib/fastcgi.js", 107);
            writer.writeBegin(begin);
            _$jscoverage_done("lib/fastcgi.js", 108);
            connection.write(writer.tobuffer());
            _$jscoverage_done("lib/fastcgi.js", 110);
            header.type = FCGI_PARAMS;
            _$jscoverage_done("lib/fastcgi.js", 111);
            header.contentLength = fastcgi.getParamLength(params);
            _$jscoverage_done("lib/fastcgi.js", 112);
            writer.writeHeader(header);
            _$jscoverage_done("lib/fastcgi.js", 113);
            writer.writeParams(params);
            _$jscoverage_done("lib/fastcgi.js", 114);
            connection.write(writer.tobuffer());
            _$jscoverage_done("lib/fastcgi.js", 117);
            header.type = FCGI_PARAMS;
            _$jscoverage_done("lib/fastcgi.js", 118);
            header.contentLength = 0;
            _$jscoverage_done("lib/fastcgi.js", 119);
            writer.writeHeader(header);
            _$jscoverage_done("lib/fastcgi.js", 120);
            connection.write(writer.tobuffer());
            _$jscoverage_done("lib/fastcgi.js", 126);
            if (_$jscoverage_done("lib/fastcgi.js", 126, request.method != "PUT") && _$jscoverage_done("lib/fastcgi.js", 126, request.method != "POST")) {
                _$jscoverage_done("lib/fastcgi.js", 127);
                endRequest();
            } else {
                _$jscoverage_done("lib/fastcgi.js", 129);
                for (var j = 0; j < collectedStdin.length; ++j) {
                    _$jscoverage_done("lib/fastcgi.js", 130);
                    header.type = FCGI_STDIN;
                    _$jscoverage_done("lib/fastcgi.js", 131);
                    header.contentLength = collectedStdin[j].length;
                    _$jscoverage_done("lib/fastcgi.js", 132);
                    header.paddingLength = 0;
                    _$jscoverage_done("lib/fastcgi.js", 133);
                    writer.writeHeader(header);
                    _$jscoverage_done("lib/fastcgi.js", 134);
                    writer.writeBody(collectedStdin[j].toString());
                    _$jscoverage_done("lib/fastcgi.js", 135);
                    connection.write(writer.tobuffer());
                }
                _$jscoverage_done("lib/fastcgi.js", 137);
                collectedStdin = [];
                _$jscoverage_done("lib/fastcgi.js", 138);
                if (_$jscoverage_done("lib/fastcgi.js", 138, noMoreData)) {
                    _$jscoverage_done("lib/fastcgi.js", 139);
                    endRequest();
                }
            }
        }
        _$jscoverage_done("lib/fastcgi.js", 144);
        request.on("data", function(chunk) {
            _$jscoverage_done("lib/fastcgi.js", 145);
            if (_$jscoverage_done("lib/fastcgi.js", 145, writer)) {
                _$jscoverage_done("lib/fastcgi.js", 146);
                header.type = FCGI_STDIN;
                _$jscoverage_done("lib/fastcgi.js", 147);
                header.contentLength = chunk.length;
                _$jscoverage_done("lib/fastcgi.js", 148);
                header.paddingLength = 0;
                _$jscoverage_done("lib/fastcgi.js", 149);
                writer.writeHeader(header);
                _$jscoverage_done("lib/fastcgi.js", 150);
                writer.writeBody(chunk);
                _$jscoverage_done("lib/fastcgi.js", 151);
                connection.write(writer.tobuffer());
            } else {
                _$jscoverage_done("lib/fastcgi.js", 153);
                collectedStdin.push(chunk);
            }
        });
        _$jscoverage_done("lib/fastcgi.js", 157);
        request.on("end", endRequest);
        _$jscoverage_done("lib/fastcgi.js", 159);
        connection.ondata = function(buffer, start, end) {
            _$jscoverage_done("lib/fastcgi.js", 160);
            parser.execute(buffer, start, end);
        };
        _$jscoverage_done("lib/fastcgi.js", 163);
        connection.addListener("connect", function() {
            _$jscoverage_done("lib/fastcgi.js", 164);
            writer = new fastcgi.writer;
            _$jscoverage_done("lib/fastcgi.js", 165);
            parser = new fastcgi.parser;
            _$jscoverage_done("lib/fastcgi.js", 167);
            writer.encoding = "binary";
            _$jscoverage_done("lib/fastcgi.js", 169);
            var body = "", hadheaders = false;
            _$jscoverage_done("lib/fastcgi.js", 171);
            parser.onRecord = function(record) {
                _$jscoverage_done("lib/fastcgi.js", 172);
                if (_$jscoverage_done("lib/fastcgi.js", 172, record.header.type == FCGI_STDOUT) && _$jscoverage_done("lib/fastcgi.js", 172, !hadheaders)) {
                    _$jscoverage_done("lib/fastcgi.js", 173);
                    body = record.body;
                    _$jscoverage_done("lib/fastcgi.js", 175);
                    debug.log(body);
                    _$jscoverage_done("lib/fastcgi.js", 177);
                    var parts = body.split("\r\n\r\n");
                    _$jscoverage_done("lib/fastcgi.js", 179);
                    var headers = parts[0];
                    _$jscoverage_done("lib/fastcgi.js", 180);
                    var headerParts = headers.split("\r\n");
                    _$jscoverage_done("lib/fastcgi.js", 182);
                    body = parts[1];
                    _$jscoverage_done("lib/fastcgi.js", 184);
                    var responseStatus = 200;
                    _$jscoverage_done("lib/fastcgi.js", 186);
                    headers = [];
                    _$jscoverage_done("lib/fastcgi.js", 187);
                    try {
                        _$jscoverage_done("lib/fastcgi.js", 188);
                        for (var i in headerParts) {
                            _$jscoverage_done("lib/fastcgi.js", 189);
                            header = headerParts[i].split(": ");
                            _$jscoverage_done("lib/fastcgi.js", 190);
                            if (_$jscoverage_done("lib/fastcgi.js", 190, header[0].indexOf("Status") >= 0)) {
                                _$jscoverage_done("lib/fastcgi.js", 191);
                                responseStatus = header[1].substr(0, 3);
                                _$jscoverage_done("lib/fastcgi.js", 192);
                                continue;
                            }
                            _$jscoverage_done("lib/fastcgi.js", 195);
                            headers.push([ header[0], header[1] ]);
                        }
                    } catch (err) {}
                    _$jscoverage_done("lib/fastcgi.js", 201);
                    debug.log('  --> Request Response Status Code: "' + responseStatus + '"');
                    _$jscoverage_done("lib/fastcgi.js", 203);
                    if (_$jscoverage_done("lib/fastcgi.js", 203, responseStatus === "404")) {
                        _$jscoverage_done("lib/fastcgi.js", 204);
                        next();
                        _$jscoverage_done("lib/fastcgi.js", 205);
                        parser.onRecord = function() {};
                        _$jscoverage_done("lib/fastcgi.js", 206);
                        connection.end();
                        _$jscoverage_done("lib/fastcgi.js", 207);
                        return;
                    }
                    _$jscoverage_done("lib/fastcgi.js", 210);
                    response.writeHead(responseStatus, headers);
                    _$jscoverage_done("lib/fastcgi.js", 212);
                    hadheaders = true;
                } else {
                    _$jscoverage_done("lib/fastcgi.js", 215);
                    if (_$jscoverage_done("lib/fastcgi.js", 215, record.header.type == FCGI_STDOUT) && _$jscoverage_done("lib/fastcgi.js", 215, hadheaders)) {
                        _$jscoverage_done("lib/fastcgi.js", 216);
                        body += record.body;
                    } else {
                        _$jscoverage_done("lib/fastcgi.js", 217);
                        if (_$jscoverage_done("lib/fastcgi.js", 217, record.header.type == FCGI_END)) {
                            _$jscoverage_done("lib/fastcgi.js", 218);
                            response.end(body);
                        }
                    }
                }
            };
            _$jscoverage_done("lib/fastcgi.js", 222);
            parser.onError = function(err) {};
            _$jscoverage_done("lib/fastcgi.js", 226);
            sendRequest(connection);
        });
        _$jscoverage_done("lib/fastcgi.js", 229);
        connection.addListener("close", function() {
            _$jscoverage_done("lib/fastcgi.js", 230);
            connection.end();
        });
        _$jscoverage_done("lib/fastcgi.js", 233);
        connection.addListener("error", function(err) {
            _$jscoverage_done("lib/fastcgi.js", 234);
            sys.puts(sys.inspect(err.stack));
            _$jscoverage_done("lib/fastcgi.js", 235);
            connection.end();
        });
        _$jscoverage_done("lib/fastcgi.js", 238);
        connection.connect(options.fastcgiHost);
    }
    _$jscoverage_done("lib/fastcgi.js", 243);
    var options = {
        fastcgiPort: 9e3,
        fastcgiHost: "localhost",
        root: ""
    };
    _$jscoverage_done("lib/fastcgi.js", 249);
    for (var k in newOptions) {
        _$jscoverage_done("lib/fastcgi.js", 250);
        options[k] = newOptions[k];
    }
    _$jscoverage_done("lib/fastcgi.js", 253);
    return function(request, response, next) {
        _$jscoverage_done("lib/fastcgi.js", 254);
        var script_dir = options.root;
        _$jscoverage_done("lib/fastcgi.js", 255);
        var script_file = url.parse(request.url).pathname;
        _$jscoverage_done("lib/fastcgi.js", 257);
        var qs = url.parse(request.url).query ? url.parse(request.url).query : "";
        _$jscoverage_done("lib/fastcgi.js", 258);
        var params = makeHeaders(request.headers, [ [ "SCRIPT_FILENAME", script_dir + script_file ], [ "REMOTE_ADDR", request.connection.remoteAddress ], [ "QUERY_STRING", qs ], [ "REQUEST_METHOD", request.method ], [ "SCRIPT_NAME", script_file ], [ "PATH_INFO", script_file ], [ "DOCUMENT_URI", script_file ], [ "REQUEST_URI", request.url ], [ "DOCUMENT_ROOT", script_dir ], [ "PHP_SELF", script_file ], [ "GATEWAY_PROTOCOL", "CGI/1.1" ], [ "SERVER_SOFTWARE", "node/" + process.version ] ]);
        _$jscoverage_done("lib/fastcgi.js", 273);
        debug.log("Incoming Request: " + request.method + " " + request.url);
        _$jscoverage_done("lib/fastcgi.js", 274);
        debug.dir(params);
        _$jscoverage_done("lib/fastcgi.js", 275);
        server(request, response, params, options, next);
    };
};