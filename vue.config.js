const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        querystring: require.resolve('querystring-es3')
      },
    },
  },
  devServer: {
    proxy: {
      '/otn': {
        target: 'https://kyfw.12306.cn',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
