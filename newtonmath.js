(function () {
    'use strict';
    
    // Newton API endpoints
    const ENDPOINTS = ['simplify', 'factor', 'derive', 'integrate', 'zeroes',
                       'tangent', 'area', 'cos', 'sin', 'tan', 'arccos',
                       'arcsin', 'arctan', 'abs', 'log'];
    
    let root = this,
        prevNewtonMath = root.NewtonMath,
        core = {},
        NewtonMath = {};
    
    // Dependencies
    if (typeof root.XMLHttpRequest === 'undefined') {
        core.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    } else {
        core.XMLHttpRequest = root.XMLHttpRequest;
    }
    
    // Core functions
    function createPromise (operation, expression) {
        return new Promise(function (resolve, reject) {
            let base = 'https://newton.now.sh/',
                url = base + operation + '/' + encodeURIComponent(expression),
                xhr = new core.XMLHttpRequest();
            
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({status: this.status, msg: xhr.statusText});
                }
            };
            
            xhr.onerror = function () {
                reject({status: this.status, msg: xhr.statusText});
            };
            
            xhr.open("GET", url);
            xhr.send();
        });
    }
    
    function sendRequest (operation, expression, callback) {
        createPromise(operation, expression)
        .then(response => callback(handleResponse(JSON.parse(response))))
        .catch(error => printError('HTTP status', error.status, error));
    }
    
    function handleResponse (response) {
        // Was the expression valid?
        if (response.hasOwnProperty('error')) {
            printError(response['error']);
        } else {
            let result = response['result'];
            
            // Some of the strings returned can be parsed to integers or floats
            try {
                return JSON.parse(result);
            } catch (e) {
                // If the result is NaN, return NaN instead of a string
                if (result.constructor == String && result.toLowerCase() == 'nan') {
                    return NaN;
                } else {
                    return result;
                }
            }
        }
    }
    
    function printError () {
        console.error('NewtonMath error:', ...arguments);
    }
    
    // Expose the module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = NewtonMath;
        }
        
        exports.NewtonMath = NewtonMath;
    } else {
        root.NewtonMath = NewtonMath;
    }
    
    // Allow module global to be renamed to remove conflicts with other vars
    // of the same name (same concept as jQuery method of the same name)
    NewtonMath.noConflict = function () {
        root.NewtonMath = prevNewtonMath;
        return NewtonMath;
    };
    
    // Instantiate basic endpoint functionality
    ENDPOINTS.forEach(endpoint => {
        core[endpoint] = (expression, callback) => sendRequest(endpoint, expression, callback);
        NewtonMath[endpoint] = core[endpoint];
    });
    
    // Extend parameterised endpoint functionality
    NewtonMath.log = (exp, a2, a3) =>
        core.log(a3 ? a2 + '|' + exp : exp, a3 ? a3 : a2);
    
    NewtonMath.tangent = (exp, a2, a3) =>
        core.tangent(a3 ? a2 + '|' + exp : exp, a3 ? a3 : a2);
    
    NewtonMath.area = (exp, a2, a3, a4) =>
        core.area(a4 ? a2 + ':' + a3 + '|' + exp : exp, a4 ? a4 : a2);
    
    // Expose NewtonMath object
    return NewtonMath;
}).call(this);
