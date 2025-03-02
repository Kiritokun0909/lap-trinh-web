const camelCase = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1).replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const convertKeysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[camelCase(key)] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

module.exports =  convertKeysToCamelCase ;
