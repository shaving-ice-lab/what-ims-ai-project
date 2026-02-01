import type { UserConfigExport } from '@tarojs/cli';

const config: UserConfigExport = {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {
    API_BASE_URL: '"https://api.example.com/api"',
    UPLOAD_URL: '"https://api.example.com/api/upload"',
    WS_URL: '"wss://api.example.com/ws"',
    ENV: '"production"',
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
  },
  h5: {
    publicPath: '/',
    enableExtract: true,
    miniCssExtractPluginOption: {
      ignoreOrder: true,
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].css',
    },
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js',
    },
  },
};

export default config;
