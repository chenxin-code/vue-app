import baseUrl from './url/base-url';
const dev = process.env.NODE_ENV !== 'production'

/**
 * 接口记录参考./url/URLCollection.js文件
 * 个人开发接口操作如下
 * * 1.在./url目录下新建文件myUrl.js
 * * 2.在myUrl.js中复制代码：export default 'http://tbdapp.deepermobile.com'
 * ! 注意不要在其它分支提交myUrl.js文件，否则会导致myUrl.js文件丢失的情况
 * ! 在其它分支中可以在.gitignore文件中加上 myUrl.js 代码以做文件屏蔽
 */

const config = {
  baseURL: baseUrl,
  mapak: 'oWbRPSoypx6ojPTEYQXNZ1qEWQAxinbX',
  //微信分享的文件夹路径  47是app-vue  139是system-vue
  // shareUrl:'/app-vue/app/index.html#',
  shareUrl: '/app-vue/app/index.html#',
  gameUrl: '/app-vue/game/index.html#',
  testToken: dev ? '' : '',
}
export default config

