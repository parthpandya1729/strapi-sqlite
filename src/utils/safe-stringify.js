const safeStringify = (obj) => {
    let cache = new Set();
    
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                // Remove circular reference
                return '[Circular]';
            }
            cache.add(value);
        }
        return value;
    }, 2);
};

module.exports = safeStringify;