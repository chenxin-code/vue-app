"use strict";
const utils = require("./utils");
const config = require("../config");
const isProduction = process.env.NODE_ENV === "production";
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap;

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ["src", "poster"],
    source: "src",
    img: "src",
    image: "xlink:href"
  },
  // transpileDependencies: [/@zkty-team/]
  transpileDependencies: [
    'zkty-team/x-engine-module-localstorage',
    'zkty-team/x-engine-module-nav',
    'zkty-team/x-engine-module-router',
    'zkty-team/x-engine-module-share',
    'zkty-team/x-engine-module-ui',
    'zkty-team/x-engine-module-yjzdbill'
  ]
}

console.log('/[/\\]node_modules[/\\](.+?)?zkty-team(.*)/')