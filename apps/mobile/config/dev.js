module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    API_URL: '"http://localhost:8080/api"'
  },
  mini: {},
  h5: {
    devServer: {
      port: 10086,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      }
    }
  }
}
