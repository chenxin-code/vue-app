export default [
  {
    path: '/device_management/home',
    name: '网点列表',
    component: () => import('@/views/device-management/index.vue'),
    meta: {
      title: '网点列表',
      keepAlive: true
    }
  },
  {
    path: '/device_management/detail',
    name: '设备详情',
    component: () => import('@/views/device-management/common/detail.vue'),
    meta: {
      title: '设备详情',
      keepAlive: false
    }
  },
  {
    path: '/device_management/payment',
    name: '设备详情',
    component: () => import('@/views/device-management/common/payment.vue'),
    meta: {
      title: '设备详情',
      keepAlive: true
    }
  },
  {
    path: '/device_management/myOrder',
    name: '设备订单',
    component: () => import('@/views/device-management/myOrder/index.vue'),
    meta: {
      title: '设备订单',
      keepAlive: false
    }
  },
  {
    path: '/device_management/orderdetail',
    name: '订单详情',
    component: () => import('@/views/device-management/myOrder/orderdetail.vue'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/device_management/applyRefund',
    name: '申请退款',
    component: () => import('@/views/device-management/common/applyRefund.vue'),
    meta: {
      title: '申请退款',
      keepAlive: false
    }
  },
  {
    path: '/device_management/rules',
    name: '活动说明',
    component: () => import('@/views/device-management/common/rules.vue'),
    meta: {
      title: '活动说明',
      keepAlive: false
    }
  },
  {
    path: '/device_management/paySuccess',
    name: '支付成功',
    component: () => import('@/views/device-management/common/paySuccess.vue'),
    meta: {
      title: '支付成功',
      keepAlive: false
    }
  }
]
