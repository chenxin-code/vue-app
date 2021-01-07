module.exports = [
  {
    path: '/get_coupon',
    name: '领券中心',
    component: () => import('@/components/mall2/coupon/get-coupon-center'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/get_coupon_detail',
    name: '领券中心',
    component: () => import('@/components/mall2/coupon/coupon-center-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/get_coupon_detail', // 领券中心领取券的详情
    name: '我的电子券',
    component: () => import('@/components/mall2/coupon/get-coupon-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/coupon_list',
    name: '优惠券',
    component: () => import('@/components/mall2/coupon/coupon-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carwash_coupon',
    name: '优惠券',
    component: () => import('@/components/mall2/coupon/carwash-coupon'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carwash_list',
    name: '洗车站点',
    component: () => import('@/components/mall2/coupon/car-wash-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/canusestore_list',
    name: '可用店铺',
    component: () => import('@/components/mall2/coupon/can-use-store-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/coupon_detail', // 优惠券列表查看券的详情
    name: '优惠券详情',
    component: () => import('@/components/mall2/coupon/coupon-detail'),
    meta: {
      keepAlive: false,
      title: '我的优惠券'
    }
  },
  // 分组模式
  {
    path: '/coupon_list2',
    name: '优惠券',
    component: () => import('@/components/mall2/coupon/coupon-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/coupon_detail2', // 优惠券列表查看券的详情
    name: '优惠券详情',
    component: () => import('@/components/mall2/coupon/coupon-detail'),
    meta: {
      keepAlive: false,
      title: '我的优惠券'
    }
  },
  {
    path: '/coupon_market',
    name: '券集市',
    component: () => import('@/components/mall2/coupon/coupon-market'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/scan_coupon',
    name: '扫码领券',
    component: () => import('@/components/mall2/coupon/scan-coupon'),
    meta: {
      keepAlive: false
    }
  }
]
