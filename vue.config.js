const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'https://n8n-acfyvstb.ap-northeast-1.clawcloudrun.com', // 目标服务器
        changeOrigin: true, // 修改请求头中的 origin 以匹配目标服务器
        secure: true, // 支持 HTTPS
        pathRewrite: {
          '^/api': '' // 移除请求中的 /api 前缀
        },
        logLevel: 'debug' // 开启代理日志，便于调试
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    }
  }
});