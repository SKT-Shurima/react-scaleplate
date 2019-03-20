module.exports = (env) => {
  if (env && env.NODE_ENV === 'production') {
    return require('./webpack.config/prod.config.js');
  } else {
    return require('./webpack.config/dev.config.js');
  }
}