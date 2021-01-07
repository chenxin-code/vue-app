/**
 * Created by LiRui on 2019/6/20.
 * annotation by LiuYong on 2020/9/27
 * 筛选路由
 * @return Array 开发路由
 */
// 基础路由
import baseRouters from './router'
// 开发路由依赖->配置项
import project from '../../build/env'
// 开发路由
let deployRouters = []  
/**
 * 获取所有开发路由
 * @regExp  @/deploy/.../router/regExp.js
 */
const routerGetter = require.context(`@/deploy/`, true, /router\/\w*\.js$/)
// 拼接开发路由
routerGetter.keys().forEach(item => {
  if (item.includes(project)) {
    deployRouters = deployRouters.concat(routerGetter(item).default)
  }
})
// 拼接开发路由、过滤基础路由中与开发路由的重复项
let unionRouters = deployRouters.concat(baseRouters.filter(item => {
  // let key = null
  let flag = true
  deployRouters.forEach(item2 => {
    if (item2.path == item.path) {
      flag = false
    }
  })
  if (flag) {
    return item
  }
}))
// 返回开发路由
export default unionRouters
