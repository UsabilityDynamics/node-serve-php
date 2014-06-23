Node.js middleware for PHP

## Getting Started
Install the module with: `npm install serve-php`

```javascript
var servePHP = require( 'serve-php' ).createServer();
var express = require( 'express' );
app.use( servePHP.router );
```

Node.js is used to manage the overall processa and internally forwards requests to php-fpm service, which it also spawns and destroys on an instance-by-instance basis.

![Basic](http://content.screencast.com/users/TwinCitiesTech.com/folders/Jing/media/9207de5d-c91e-48be-97ee-e7b783aee0e8/00000650.png)

## Examples

For demonstration purposes only, we kill any existing php-fpm processes.
    node examples/middleware.js
    
If you notice that php-fpm instances are being spawned but not destroyed, you may (for now) kill them like so:
    killall -9 php-fpm
    
## License

(The MIT License)

Copyright (c) 2014 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OT