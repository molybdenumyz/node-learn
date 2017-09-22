// 与之前一样
var fibonacci = function (n) {
    // typeof NaN === 'number' 是成立的，所以要判断 NaN
    if (typeof n !== 'number' || isNaN(n)) {
        throw new Error('n should be a Number');
    }
    if (n < 0) {
        throw new Error('n should >= 0')
    }
    if (n > 10) {
        throw new Error('n should <= 10');
    }
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
};
// END 与之前一样


exports.fibonacci = fibonacci