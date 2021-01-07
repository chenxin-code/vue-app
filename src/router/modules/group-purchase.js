export default [
  // 送礼
  {
    path: '/config-giftBox',
    name: '配置礼盒',
    component: () => import('@/views/group-purchase/gift-box/config-giftBox'),
    meta: {
      title: '配置礼盒',
      keepAlive: false
    }
  },
  {
    path: '/gift-box-list',
    name: '我的礼盒',
    component: () => import('@/views/group-purchase/gift-box/gift-box-list'),
    meta: {
      title: '我的礼盒',
      keepAlive: true
    }
  },
  {
    path: '/gift-order-details',
    name: '礼单详情',
    component: () => import('@/views/group-purchase/gift-box/gift-order-details'),
    meta: {
      title: '礼单详情',
      keepAlive: false
    }
  },
  {
    path: '/receive-gift',
    name: '领取礼物',
    component: () => import('@/views/group-purchase/gift-box/receive-gift'),
    meta: {
      title: '领取礼物',
      keepAlive: false
    }
  },
  {
    path: '/gift-address',
    name: '填写订单',
    component: () => import('@/views/group-purchase/gift-box/gift-address'),
    meta: {
      title: '填写订单',
      keepAlive: false
    }
  },
  {
    path: '/substitute_pay',
    name: '代付',
    component: () => import('@/views/group-purchase/substitute-pay/substitute-pay'),
    meta: {
      title: '代付',
      keepAlive: false
    }
  },
]
