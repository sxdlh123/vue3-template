const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}

const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");

module.exports = {
  // lintOnSave: fasle, // eslint-loader 是否在保存的时候检查
  // assetsDir: "static", //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  // 以多页模式构建应用程序。
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  pages: undefined,

  // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,

  // webpack配置
  //按需引入
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },

  //对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    //全局样式注入
    const oneOfsMap = config.module.rule("scss").oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          // 全局变量文件路径，只有一个时可将数组省去
          resources: ["./src/style/index.scss"],
        })
        .end();
    });
    //set第一个参数：设置的别名，第二个参数：设置的路径
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("@C", resolve("./src/components"))
      .set("@@", resolve("./public"));
  },

  css: {
    sourceMap: true,
  },

  // PWA 插件相关配置
  pwa: {},

  // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
  devServer: {
    // host: 'localhos
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
  },
};
