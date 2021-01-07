
export default [
  // {
  //   path: '/common',
  //   name: '首页',
  //   component: () => import('../views/common'),
  //   meta: {
  //     keepAlive: false
  //   }
  // },
  {
    path: '/cnooc-iframe',
    name: 'iframe',
    component: () => import('../views/iframe/iframe.vue'),
    meta: {
      keepAlive: false,
    }
  },
  {
    path: '/nearstation',
    name: '选择油站',
    component: () => import('../views/near-station/near-station.vue'),
    meta: {
      keepAlive: false,
      title: '选择油站'
    }
  },
  {
    path: '/stationto',
    name: '附近油站',
    component: () => import('../views/stationto/map-stationto.vue'),
    meta: {
      keepAlive: false,
      title: '附近油站'
    }
  },
  {
    path: '/cnooc-shop-list',
    name: '店铺列表',
    component: () => import('../views/shop-list/shop-list.vue'),
    meta: {
      keepAlive: false,
      title: '店铺列表'
    }
  },
  {
    path: '/cnooc-pay-personal',
    name: '去支付',
    component: () => import('../views/pay-personal/pay-personal.vue'),
    meta: {
      keepAlive: false,
      title: '去支付'
    }
  },
  {
    path: '/cnooc-my-coupon',
    name: '我的电子券',
    component: () => import('../views/my-coupon/my-coupon.vue'),
    meta: {
      keepAlive: false,
      title: '我的电子券'
    }
  },
  {
    path: '/cnooc-my-couponused',
    name: '已使用电子券',
    component: () => import('../views/my-couponused/my-couponused.vue'),
    meta: {
      keepAlive: false,
      title: '已使用电子券'
    }
  },
  {
    path: '/cnooc-my-coupon-detail',
    name: '电子券详情',
    component: () => import('../views/my-coupon-detail/my-coupon-detail.vue'),
    meta: {
      keepAlive: false,
      title: '电子券详情'
    }
  },
  {
    path: '/cnooc-card',
    name: '海油卡',
    component: () => import('../views/cnooc-card/cnooc-card.vue'),
    meta: {
      keepAlive: false,
      title: '海油卡'
    }
  },
  {
    path: '/cnooc-contact-us',
    name: '联系我们',
    component: () => import('../views/contact-us/contact-us.vue'),
    meta: {
      keepAlive: false,
      title: '联系我们'
    }
  },
  {
    path: '/cnooc-login-out',
    name: '退出登录',
    component: () => import('../views/login-out/login-out.vue'),
    meta: {
      keepAlive: false,
      title: '退出登录'
    }
  },
  {
    path: '/cnooc-activity-page',
    name: '营销活动',
    component: () => import('../views/activity-page/index.vue'),
    meta: {
      keepAlive: false,
      title: '营销活动'
    }
  },
  {
    path: '/cnooc-quick-payment',
    name: '一键加油',
    component: () => import('../views/quick-payment/quick-payment.vue'),
    meta: {
      keepAlive: false,
      title: '一键加油'
    }
  }
]
