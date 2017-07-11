# NewtonMath.js

[![npm](https://img.shields.io/npm/v/newtonmath.js.svg)](https://www.npmjs.com/package/newtonmath.js)
[![Travis build status](https://travis-ci.org/benpryke/NewtonMath.js.svg?branch=master)](https://travis-ci.org/benpryke/NewtonMath.js)

## Basics

NewtonMath.js is an ES2016 compliant JavaScript API wrapper providing full support for the [newton micro-service](https://newton.now.sh), which is [available on GitHub](https://github.com/aunyks/newton-api).

Newton does anything from numerical calculation to symbolic math parsing.

## Installation

Using npm:

```sh
npm install newtonmath.js --save
```

## Usage

NewtonMath.js is compatible with node 6.x and both CommonJS and AMD module specifications and can run in the browser. API calls are implemented asynchronously and the result is available as the most appropriate type via a callback.

See the [newton API GitHub repo](https://github.com/aunyks/newton-api) for the full list of endpoints.

### Node

```JavaScript
newton = require('newtonmath.js');

newton.derive('x^2', r => console.log(r)); // -> '2 x'
newton.cos('pi', r => console.log(r)); // -> -1
newton.zeroes('x^2+2x', r => console.log(r)); // -> [-2, 0]
```

### Browser

```html
<!-- In <head> -->
<script src="newtonmath-min.js"></script>

<!-- In <body> or script file -->
<script>
NewtonMath.derive('x^2', r => console.log(r)); // -> '2 x'
</script>
```

#### noConflict

In the same vein as [jQuery's noConflict method](https://api.jquery.com/jquery.noconflict/), you can reset the `NewtonMath` global to its value prior to loading the module.

```JavaScript
newton = NewtonMath.noConflict();
```


### Optional arguments
The following methods take optional extra arguments for convenience. As per the API, if these are not specified they must be included before a horizontal bar `'|'` in the expression for newton.

```JavaScript
newton.log('2|8', r => console.log(r)); // -> 3
newton.log(8, 2, r => console.log(r)); // -> 3

newton.tangent('2|x^3', r => console.log(r)); // -> '12 x + -16'
newton.tangent('x^3', 2, r => console.log(r)); // -> '12 x + -16'

newton.area('2:4|x^3', r => console.log(r)); // -> 60
newton.area('x^3', 2, 4, r => console.log(r)); // -> 60
```

## Building and testing

Build the minified file and source map with babili:

```sh
npm run-script build
```

Run tests with Jasmine:

```sh
npm test
```
