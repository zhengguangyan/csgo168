module.exports = {
  publicPath: './',
  devServer: {
    host: 'localhost',
    port: '8081',
    proxy: {
      '/api': {
        target: 'https://csgo.lfjt168.com/api',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  },
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // 全局变量文件路径，只有一个时可将数组省去
          resources: ['./src/styles/mixin.scss']
        })
        .end()
    })
  }
}