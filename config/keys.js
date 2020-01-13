const keysDev = require('./keys_dev');
const keysProd = require('./keys_prod');

if (process.env.NODE_ENV === 'production') {
  module.exports = keysProd;
} else {
  module.exports = keysDev;
}
