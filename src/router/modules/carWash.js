export default [
  {
    path: '/carWash/home',
    name: '智能洗车店',
    component: () => import('@/views/car-wash/index.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/details',
    name: '智能洗车店',
    component: () => import('@/views/car-wash/common/details.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/payment',
    name: '智能洗车店',
    component: () => import('@/views/car-wash/common/payment.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/paySuccess',
    name: '智能洗车店',
    component: () => import('@/views/car-wash/common/paySuccess.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/scanPaySuccess',
    name: '支付完成',
    component: () => import('@/views/car-wash/common/scanPaySuccess.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/replacePage',
    name: '智能洗车店',
    component: () => import('@/views/car-wash/common/replacePage.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/speedProgress',
    name: '智能洗车店',
    component: () => import('@/views/car-wash/common/speedProgress.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/carWashCoupon',
    name: '洗车券',
    component: () => import('@/views/car-wash/common/car-wash-coupon.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/washRecording',
    name: '洗车记录',
    component: () => import('@/views/car-wash/wash-recording.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/carWash/washRecordingDetail',
    name: '洗车记录',
    component: () => import('@/views/car-wash/wash-recording-detail.vue'),
    meta: {
      keepAlive: false
    }
  },
]
