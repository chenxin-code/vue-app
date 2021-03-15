//create by hjc 团购模块

export default [
  // order 新
  {
    path: '/order',
    name: '我的订单',
    component: () => import('@/components/order/index'),
    meta: {
      keepAlive: false
    }
  }
]

