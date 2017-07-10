'use strict';

let NewtonMath = require('..');

describe('NewtonMath', function () {
    const tests = {
        'simplify': ['x^2 + 2x', 'x^2 + 2 x'],
        'factor': ['x^2 + 2x', 'x (x + 2)'],
        'derive': ['x^2+2x', '2 x + 2'],
        'integrate': ['x^2+2x', '1/3 x^3 + x^2'], // + C missing
        'zeroes': ['x^2+2x', [-2, 0]],
        'tangent': ['2|x^3', '12 x + -16'],
        'area': ['2:4|x^3', 60],
        'cos': ['pi', -1],
        'sin': ['0', 0],
        'tan': ['0', 0],
        'arccos': ['1', 0],
        'arcsin': ['0', 0],
        'arctan': ['0', 0],
        'abs': ['-1', 1],
        'log': ['2|8', 3],
    };
    
    it('endpoint methods must be exposed', function () {
        for (let op in tests) {
            expect(typeof NewtonMath[op]).toBe('function');
        }
    });
    
    // Ideally, the library core functionality would be split into a separate
    // module and restructured so that it could be unit tested to check just
    // the outgoing url; however, this is quicker for now
    function evaluateResult (op, exp, result, response, done) {
        let equalityFn = (result instanceof Array) ? 'toEqual' : 'toBe';
        expect(response)[equalityFn](result);
        done();
    }
    
    function createIt (op, exp, result) {
        it(op + ' endpoint must respond correctly', done => {
            NewtonMath[op](exp, response => {
                evaluateResult(op, exp, result, response, done);
            });
        });
    }
    
    function createOperationCallback (op, done) {
        return response => evaluateResult(op, tests[op][0], tests[op][1], response, done);
    }
    
    // Test with string expressions
    for (let op in tests) {
        createIt(op, tests[op][0], tests[op][1]);
    }
    
    // Test optional arguments
    it('tangent optional arguments must work', done => {
        NewtonMath.tangent('x^3', 2, createOperationCallback('tangent', done));
    });
    
    it('area optional arguments must work', done => {
        NewtonMath.area('x^3', 2, 4, createOperationCallback('area', done));
    });
    
    it('log optional arguments must work', done => {
        NewtonMath.log(8, 2, createOperationCallback('log', done));
    });
});
