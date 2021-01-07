export default [
  // 撞单
  {
    path: '/buy-bill-list',
    name: 'buy-bill-list',
    component: () => import('@/views/oil-sale/buy-bill/buy-bill-list'),
    meta: {
      title: '撞单列表',
      keepAlive: false
    }
  },
  {
    path: '/buy-bill-details',
    name: 'buy-bill-details',
    component: () => import('@/views/oil-sale/buy-bill/buy-bill-details'),
    meta: {
      title: '撞单详情',
      keepAlive: false
    }
  },
  {
    path: '/buy-bill-results',
    name: 'buy-bill-results',
    component: () => import('@/views/oil-sale/buy-bill/buy-bill-results'),
    meta: {
      title: '撞单结果',
      keepAlive: false
    }
  },
  {
    path: '/buy-bill-record',
    name: 'buy-bill-record',
    component: () => import('@/views/oil-sale/buy-bill/buy-bill-record'),
    meta: {
      title: '撞单记录',
      keepAlive: false
    }
  },
  {
    path: '/buy-bill-success',
    name: 'buy-bill-success',
    component: () => import('@/views/oil-sale/buy-bill/buy-bill-success'),
    meta: {
      title: '撞单成功',
      keepAlive: false
    }
  },
  // 抢单
  {
    path: '/grab-bill-list',
    name: 'grab-bill-list',
    component: () => import('@/views/oil-sale/grab-bill/grab-bill-list'),
    meta: {
      title: '抢单列表',
      keepAlive: false
    }
  },
  {
    path: '/grab-bill-details',
    name: 'grab-bill-details',
    component: () => import('@/views/oil-sale/grab-bill/grab-bill-details'),
    meta: {
      title: '抢单详情',
      keepAlive: false
    }
  },
  {
    path: '/grab-bill-results',
    name: 'grab-bill-results',
    component: () => import('@/views/oil-sale/grab-bill/grab-bill-results'),
    meta: {
      title: '抢单结果',
      keepAlive: false
    }
  },
  {
    path: '/grab-bill-record',
    name: 'grab-bill-record',
    component: () => import('@/views/oil-sale/grab-bill/grab-bill-record'),
    meta: {
      title: '抢单记录',
      keepAlive: false
    }
  },
  {
    path: '/grab-bill-success',
    name: 'grab-bill-record',
    component: () => import('@/views/oil-sale/grab-bill/grab-bill-success'),
    meta: {
      title: '抢单成功失败',
      keepAlive: false
    }
  },
  // 约单
  {
    path: '/appointment-bill-list',
    name: 'buy-bill-list',
    component: () => import('@/views/oil-sale/appointment-bill/appointment-bill-list'),
    meta: {
      title: '约单列表',
      keepAlive: false
    }
  },
  {
    path: '/appointment-bill-details',
    name: 'buy-bill-list',
    component: () => import('@/views/oil-sale/appointment-bill/appointment-bill-details'),
    meta: {
      title: '约单详情',
      keepAlive: false
    }
  },
  {
    path: '/appointment-bill-results',
    name: 'buy-bill-list',
    component: () => import('@/views/oil-sale/appointment-bill/appointment-bill-results'),
    meta: {
      title: '约单详情',
      keepAlive: false
    }
  },
  {
    path: '/appointment-bill-record',
    name: 'buy-bill-list',
    component: () => import('@/views/oil-sale/appointment-bill/appointment-bill-record'),
    meta: {
      title: '约单记录',
      keepAlive: false
    }
  },
  {
    path: '/appointment-bill-success',
    name: 'buy-bill-list',
    component: () => import('@/views/oil-sale/appointment-bill/appointment-bill-success'),
    meta: {
      title: '待确定',
      keepAlive: false
    }
  },
  // 首页
  {
    path: '/buy-oil-index',
    name: 'buy-oil-index',
    component: () => import('@/views/oil-sale/buy-oil-index/buy-oil-index'),
    meta: {
      title: '首页',
      keepAlive: false
    }
  },
  {
    path: '/users-bind',
    name: 'users-bind',
    component: () => import('@/views/oil-sale/buy-oil-index/users-bind'),
    meta: {
      title: '单位用户绑定',
      keepAlive: false
    }
  },
  {
    path: '/batch-buy-oil',
    name: 'batch-buy-oil',
    component: () => import('@/views/oil-sale/buy-oil-index/index/batch-buy-oil'),
    meta: {
      title: '批量购油',
      keepAlive: false
    }
  },
  {
    path: '/buy-oil-results',
    name: 'buy-oil-results',
    component: () => import('@/views/oil-sale/buy-oil-index/index/buy-oil-results'),
    meta: {
      title: '订单提交',
      keepAlive: false
    }
  },
  // 我的
  {
    path: '/buy-oil-order-list',
    name: 'buy-oil-order-list',
    component: () => import('@/views/oil-sale/buy-oil-index/my/buy-oil-order-list'),
    meta: {
      title: '购油订单列表',
      keepAlive: false  // 表示该组件是需要缓存的
    }
  },
  {
    path: '/buy-oil-order-details',
    name: 'buy-oil-order-details',
    component: () => import('@/views/oil-sale/buy-oil-index/my/buy-oil-order-details'),
    meta: {
      title: '购油订单详情',
      keepAlive: false
    }
  },
  {
    path: '/bean-exchange-list',
    name: 'bean-exchange-list',
    component: () => import('@/views/oil-sale/buy-oil-index/my/bean-exchange-list'),
    meta: {
      title: '购油订单列表',
      keepAlive: false  // 表示该组件是需要缓存的
    }
  },
  {
    path: '/bean-exchange-details',
    name: 'bean-exchange-details',
    component: () => import('@/views/oil-sale/buy-oil-index/my/bean-exchange-details'),
    meta: {
      title: '购油订单详情',
      keepAlive: false
    }
  },
  // 优惠券
  {
    path: '/coupon-list',
    name: 'coupon-list',
    component: () => import('@/views/oil-sale/buy-oil-index/my/coupon/coupon-list'),
    meta: {
      title: '优惠券',
      keepAlive: false
    }
  },
  // 提油卡
  {
    path: '/appointment-oil',
    name: 'appointment-oil',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/appointment-oil'),
    meta: {
      title: '预约提油',
      keepAlive: false
    }
  },
  {
    path: '/appointment-oil-results',
    name: 'appointment-oil-results',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/appointment-oil-results'),
    meta: {
      title: '预约提油',
      keepAlive: false
    }
  },
  {
    path: '/not-mention',
    name: 'not-mention',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/not-mention'),
    meta: {
      title: '已售未提',
      keepAlive: false
    }
  },
  {
    path: '/have-mention',
    name: 'have-mention',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/have-mention'),
    meta: {
      title: '已售已提',
      keepAlive: false
    }
  },
  {
    path: '/buy-oil-record',
    name: 'buy-oil-record',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/buy-oil-record'),
    meta: {
      title: '购油记录',
      keepAlive: false
    }
  },
  {
    path: '/mention-oil-record',
    name: 'mention-oil-record',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/mention-oil-record'),
    meta: {
      title: '提油记录',
      keepAlive: false
    }
  },
  {
    path: '/buy-oil-login',
    name: 'buy-oil-login',
    component: () => import('@/views/oil-sale/buy-oil-index/buy-oil-login'),
    meta: {
      title: '单位选择',
      keepAlive: false
    }
  },
  {
    path: '/bill-information',
    name: 'bill-information',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/bill-information'),
    meta: {
      title: '账单信息',
      keepAlive: false
    }
  },
  {
    path: '/bill-details',
    name: 'bill-details',
    component: () => import('@/views/oil-sale/buy-oil-index/oil-card/bill-details'),
    meta: {
      title: '账单详情',
      keepAlive: false
    }
  },
  {
    path: '/set-pwd',
    name: 'set-pwd',
    component: () => import('@/views/oil-sale/buy-oil-index/set-pwd'),
    meta: {
      title: '密码设置',
      keepAlive: false
    }
  },
  {
    path: '/return-goods',
    name: 'return-goods',
    component: () => import('@/views/oil-sale/buy-oil-index/my/return-goods/index'),
    meta: {
      title: '退货',
      keepAlive: true
    }
  },
  {
    path: '/return-goods-details',
    name: 'return-goods-details',
    component: () => import('@/views/oil-sale/buy-oil-index/my/return-goods/details'),
    meta: {
      title: '详情',
      keepAlive: false
    }
  },
  {
    path: '/handle-card-index',
    name: 'handle-card',
    component: () => import('@/views/oil-sale/buy-oil-index/handle-card/index'),
    meta: {
      title: '提油卡',
      keepAlive: false
    }
  },
  {
    path: '/add-card',
    name: 'add-card',
    component: () => import('@/views/oil-sale/buy-oil-index/handle-card/add-card'),
    meta: {
      title: '新赠提油卡',
      keepAlive: false
    }
  },
  {
    path: '/handle-card',
    name: 'handle-card',
    component: () => import('@/views/oil-sale/buy-oil-index/handle-card/handle-card'),
    meta: {
      title: '提油卡办理',
      keepAlive: false
    }
  },
  {
    path: '/handle-oil-record',
    name: 'handle-oil-record',
    component: () => import('@/views/oil-sale/buy-oil-index/handle-card/handle-oil-record'),
    meta: {
      title: '办卡记录',
      keepAlive: true
    }
  },
  {
    path: '/handle-oil-qrcode',
    name: 'handle-oil-qrcode',
    component: () => import('@/views/oil-sale/buy-oil-index/handle-card/handle-oil-qrcode'),
    meta: {
      title: '提油卡办理',
      keepAlive: false
    }
  },
  // 限价竞价
  {
    path: '/bidding-price-list',
    name: '竞价列表',
    component: () => import('@/views/oil-sale/bidding-price/bidding-price-list'),
    meta: {
      title: '竞价列表',
      keepAlive: false
    }
  }, {
    path: '/my-bidding-price',
    name: '我的竞价',
    component: () => import('@/views/oil-sale/bidding-price/my-bidding-price'),
    meta: {
      title: '我的竞价',
      keepAlive: true
    }
  }, {
    path: '/bidding-details',
    name: '竞价详情',
    component: () => import('@/views/oil-sale/bidding-price/bidding-details'),
    meta: {
      title: '竞价详情',
      keepAlive: false
    }
  }, {
    path: '/bidding-order-details',
    name: '竞价详情',
    component: () => import('@/views/oil-sale/bidding-price/bidding-order-details'),
    meta: {
      title: '竞价详情',
      keepAlive: false
    }
  }, {
    path: '/bidding-confirmation-order',
    name: '确认订单',
    component: () => import('@/views/oil-sale/bidding-price/bidding-confirmation-order'),
    meta: {
      title: '确认订单',
      keepAlive: false
    }
  },
  
  // 限价抢单
  {
    path: '/limit-order-list',
    name: '限价抢单',
    component: () => import('@/views/oil-sale/bidding-price/limitOrder/limit-order-list'),
    meta: {
      title: '限价抢单',
      keepAlive: false
    }
  }, {
    path: '/limit-order-details',
    name: '限价抢单-待确定',
    component: () => import('@/views/oil-sale/bidding-price/limitOrder/limit-order-details'),
    meta: {
      title: '限价抢单-待确定',
      keepAlive: false
    }
  }, {
    path: '/limit-order-result',
    name: '抢单结果',
    component: () => import('@/views/oil-sale/bidding-price/limitOrder/limit-order-result'),
    meta: {
      title: '抢单结果',
      keepAlive: false
    }
  }
]
