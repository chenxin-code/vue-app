/*
 * @Description: 这是***页面
 * @Date: 2021-06-08 13:57:03
 * @Author: shuimei
 * @LastEditTime: 2021-06-12 23:37:23
 */
//create by hjc 团购模块

export default [
  // order 新
  {
    path: '/order/:id',
    name: '我的订单',
    component: () => import('@/components/order/index'),
    meta: {
      keepAlive: true
    },
  },
  {
    path: '/bill/detail',
    name: '账单明细',
    component: () => import('@/components/order/bill-detail'),
    meta: {
      keepAlive: true
    },
  },
  {
    path: '/billCenter/detail',
    name: '账单详情',
    component: () => import('@/components/order/bill-center-detail'),
    meta: {
      keepAlive: false
    },
  }
]
