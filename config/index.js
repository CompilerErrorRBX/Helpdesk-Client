// config/index.js
module.exports = {
  dev: {
    proxyTable: {
      '/api': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}