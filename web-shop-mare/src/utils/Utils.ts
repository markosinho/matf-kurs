const getProperty = function <T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
}

const Utils = {
    getProperty: getProperty
};

export default Utils;