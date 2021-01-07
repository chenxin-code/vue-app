module.exports = [
  {
    path: '/refueling_order',
    name: '加油订单',
    component: () => import('@/components/product/refueling-order/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/refueling_detail',
    component: () => import('@/components/product/refueling-detail/index.vue'),
    meta: {
      title: '预付款分配明细'
    },
    meta: {
      keepAlive: false
    }
  }
]