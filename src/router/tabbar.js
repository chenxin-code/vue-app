/**
 * Created by steven on 2018/8/22.
 */
module.exports = [
  // {
  //   path: '/index',
  //   name: 'Tabbar',
  //   component: () => import('@/components/product/mainpage/tabbar'),
  //   meta: {
  //     keepAlive: false
  //   }
  // },
  // {
  //   path: '/home',
  //   name: '首页',
  //   component: () => import('@/components/product/mainpage/home'),
  //   meta: {
  //     keepAlive: false
  //   }
  // },
  {
    path: '/mine',
    name: '我的',
    component: () => import('@/components/product/mainpage/mine'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/refuelselectoilgun',
    name: '输入加油枪号',
    component: () => import('@/components/product/mainpage/refuel-select-oilgun'),
    meta: {
      keepAlive: false
    }
  },
]
