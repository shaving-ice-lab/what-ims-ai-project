import type { UserConfigExport } from '@tarojs/cli';

const config: UserConfigExport = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    API_BASE_URL: '"http://localhost:8080/api"',
    UPLOAD_URL: '"http://localhost:8080/api/upload"',
    WS_URL: '"ws://localhost:8080/ws"',
    ENV: '"development"',
  },
  mini: {},
  h5: {
    devServer: {
      port: 10086,
      hot: true,
      host: 'localhost',
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/api',
          },
        },
      },
    },
  },
};

export default config;
