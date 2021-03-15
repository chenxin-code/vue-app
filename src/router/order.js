module.exports = [
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
