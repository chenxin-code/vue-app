export default [
  {
    path: '/hk/myhkd',
    name: 'hk_myhkd',
    component: () => import('@/views/hk/my-hkd'),
    meta: {
      title: '我的优客点',
      keepAlive: false
    }
  },
  {
    path: '/hk/exchange',
    name: 'hk_exchange',
    component: () => import('@/views/hk/exchange'),
    meta: {
      title: '兑换优客点',
      keepAlive: false
    }
  },
  {
    path: '/hk/exchangecouponlist',
    name: 'hk_exchangecouponlist',
    component: () => import('@/views/hk/exchange-coupon-list'),
    meta: {
      title: '加油金专区',
      keepAlive: false
    }
  },
  {
    path: '/hk/province',
    name: 'hk_province',
    component: () => import('@/views/hk/province'),
    meta: {
      title: '选择省份',
      keepAlive: false
    }
  },
]
