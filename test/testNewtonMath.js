function testNewtonMath () {
    let tests = {
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
    
    function evaluate (op, exp, result, response) {
        let msg = op + '(' + exp + ') expected ' + result + ' but got ' + response,
            passed = null;
        
        if (result instanceof Array) {
            passed = result.length == response.length && result.every((v, i) => v === response[i]);
        } else {
            passed = response === result;
        }
        
        console.log('testing', op, '(', exp, ') ...', passed ? 'success' : 'failed');
        console.assert(passed, msg);
    }
    
    // Test basic functionality
    for (op in tests) {
        ((op, exp, result) => NewtonMath[op](exp, response => {
            evaluate(op, exp, result, response);
        }))(op, tests[op][0], tests[op][1]);
    }
    
    // Test extended funcationality
    let create_test_callback = function (op) {
        return response => evaluate(op, tests[op][0], tests[op][1], response);
    };
    
    NewtonMath.tangent('x^3', 2, create_test_callback('tangent'));
    NewtonMath.area('x^3', 2, 4, create_test_callback('area'));
    NewtonMath.log(8, 2, create_test_callback('log'));
}

testNewtonMath();
