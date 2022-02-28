
function promise (fn: Function) {
    return new Promise(res => {
        fn(res);
    });
}

function delay (time = 50) {
    return promise((resolve: Function) => {
        setTimeout(resolve, time);
    });
}

function toString (value: any) {
    if (typeof value === 'undefined') return 'undefined';
    if (value instanceof RegExp || value instanceof Date) return value.toString();
    if (value instanceof HTMLElement) return value.outerHTML;
    return typeof value === 'object' ? JSON.stringify(value) : value.toString();
}

export default {
    delay, promise, toString
};