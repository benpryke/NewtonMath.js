NewtonMath = (function () {
    'use strict';
    
    const ENDPOINTS = ['simplify', 'factor', 'derive', 'integrate', 'zeroes',
                       'tangent', 'area', 'cos', 'sin', 'tan', 'arccos',
                       'arcsin', 'arctan', 'abs', 'log'];
    
    function create_promise (operation, expression) {
        return new Promise(function (resolve, reject) {
            let base = 'https://newton.now.sh/',
                url = base + operation + '/' + encodeURIComponent(expression),
                xhr = new XMLHttpRequest();
            
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
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
    
    function send_request (operation, expression, callback) {
        create_promise(operation, expression)
        .then(response => callback(handle_response(JSON.parse(response))))
        .catch(error => print_error('HTTP status', error.status, error.msg));
    }
    
    function handle_response (response) {
        // Was the expression valid?
        if (response.hasOwnProperty('error')) {
            print_error(response['error']);
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
    
    function print_error () {
        console.error('NewtonMath error:', ...arguments);
    }
    
    // Define interface to export
    let core = {},
        NewtonMath = {};
    
    // Instantiate basic endpoint functionality
    ENDPOINTS.forEach(endpoint => {
        core[endpoint] = (expression, callback) => send_request(endpoint, expression, callback);
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
})();
