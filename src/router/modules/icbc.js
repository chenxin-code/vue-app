export default [
  // 工行
  {
    path: '/icbc',
    component: () => import('@/views/icbc/icbc.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/icbc/preferentialfuel',
    name: 'icbc_preferentialfuel',
    component: () => import('@/views/icbc/preferential-fuel'),
    meta: {
      title: '优惠加油',
      keepAlive: false
    }
  },
  {
    path: '/icbc/coupondetail',
    name: 'icbc_coupondetail',
    component: () => import('@/views/icbc/coupon-detail'),
    meta: {
      title: '优惠券详情',
      keepAlive: false
    }
  },
  {
    path: '/icbc/nearstation',
    name: 'icbc_nearstation',
    component: () => import('@/views/icbc/near-station'),
    meta: {
      title: '附近加油站',
      keepAlive: false
    }
  },
  {
    path: '/icbc/supportstation',
    name: 'icbc_supportstation',
    component: () => import('@/views/icbc/support-station'),
    meta: {
      title: '可用加油站',
      keepAlive: false
    }
  },
  {
    path: '/icbc/oilcoupon',
    name: 'icbc_oilcoupon',
    component: () => import('@/views/icbc/oil-coupon'),
    meta: {
      title: '电子加油券',
      keepAlive: false
    }
  },
  {
    path: '/icbc/oilcoupondetail',
    name: 'icbc_oilcoupondetail',
    component: () => import('@/views/icbc/oil-coupon-detail'),
    meta: {
      title: '明细',
      keepAlive: false
    }
  },
  {
    path: '/icbc/province',
    name: 'icbc_province',
    component: () => import('@/views/icbc/province'),
    meta: {
      title: '省份',
      keepAlive: false
    }
  },
  {
    path: '/icbc/pointstocoupon',
    name: 'icbc_pointstocoupon',
    component: () => import('@/views/icbc/points-to-coupon'),
    meta: {
      title: '积分换券',
      keepAlive: false
    }
  },
  {
    path: '/icbc/success',
    name: 'icbc_success',
    component: () => import('@/views/icbc/success'),
    meta: {
      title: '支付成功',
      keepAlive: false
    }
  },
  {
    path: '/icbc/stationdetail',
    name: 'icbc_stationdetail',
    component: () => import('@/views/icbc/station-detail'),
    meta: {
      title: '油站详情',
      keepAlive: false
    }
  },
  {
    path: '/icbc/orderlist',
    name: 'icbc_orderlist',
    component: () => import('@/views/icbc/order-list'),
    meta: {
      title: '购券记录',
      keepAlive: false
    }
  },
  {
    path: '/icbc/orderdetail',
    name: 'icbc_orderdetail',
    component: () => import('@/views/icbc/order-detail'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/icbc/orderdetail',
    name: 'icbc_orderdetail',
    component: () => import('@/views/icbc/order-detail'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/icbc/jzg',
    name: 'icbc_jzg',
    component: () => import('@/views/icbc/jzg'),
    meta: {
      title: '精真估',
      keepAlive: false
    }
  },
  {
    path: '/icbc/ryhysuccess',
    name: 'icbc_ryhysuccess',
    component: () => import('@/views/icbc/ryhy-success'),
    meta: {
      title: '荣耀会员支付完成',
      keepAlive: false
    }
  },
  {
    path: '/icbc/ryhy',
    name: 'icbc_ryhy',
    component: () => import('@/views/icbc/ryhy'),
    meta: {
      title: '荣耀会员',
      keepAlive: false
    }
  },
  {
    path: '/icbc/yjcoupon',
    name: 'icbc_yjcoupon',
    component: () => import('@/views/icbc/yj-coupon'),
    meta: {
      title: '易捷优惠券',
      keepAlive: false
    }
  },
  {
    path: '/icbc/mycoupon',
    name: 'icbc_mycoupon',
    component: () => import('@/views/icbc/my-coupon'),
    meta: {
      title: '易捷优惠券',
      keepAlive: false
    }
  },
  {
    path: '/icbc/mycoupon_detail',
    name: 'icbc_mycoupon_detail',
    component: () => import('@/views/icbc/mycoupon-detail'),
    meta: {
      title: '易捷优惠券',
      keepAlive: false
    }
  },
]
