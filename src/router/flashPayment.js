module.exports = [
  //加油闪付
  {
    path: '/flashPayment',
    name: '加油闪付',
    component: () => import('@/components/product/flashPayment/flashPayment'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/chooseBill',
    name: '选择账单',
    component: () => import('@/components/product/flashPayment/chooseBill'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmOrder',
    name: '加油支付凭证',
    component: () => import('@/components/product/flashPayment/firmOrder'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmScanOrder',
    name: '加油支付凭证',
    component: () => import('@/components/product/flashPayment/firmOrder'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmScanOfflineOrder', // 云南离线支付
    name: '加油支付凭证',
    component: () => import('@/components/product/flashPayment/firmOrder'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmDetail',
    name: '加油支付凭证详情',
    component: () => import('@/components/product/flashPayment/firmDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmScanDetail',
    name: '加油支付凭证详情',
    component: () => import('@/components/product/flashPayment/firmScanDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmOfflineScanDetail', // 云南离线支付详情
    name: '加油支付凭证详情',
    component: () => import('@/components/product/flashPayment/firmHistoryDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmHistoryDetail',
    name: '加油支付凭证详情',
    component: () => import('@/components/product/flashPayment/firmHistoryDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/firmHistoryScanDetail',
    name: '加油支付凭证详情',
    component: () => import('@/components/product/flashPayment/firmHistoryDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/payOrder',
    name: '确认账单',
    component: () => import('@/components/product/flashPayment/payOrder'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/oil-pay/order-list',
    name: '订单',
    component: () => import('@/components/product/flashPayment/order-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/refueling-record-query',
    name: '加油凭证',
    component: () => import('@/components/product/flashPayment/refueling-record-query'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/refueling-record-query-details',
    name: '加油订单详情',
    component: () => import('@/components/product/flashPayment/refueling-record-query-details'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/scan_refuel',
    name: '加油扫码支付',
    component: () => import('@/components/product/flashPayment/scan-refuel'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/order-recommend/list',
    name: '加油订单',
    component: () => import('@/components/product/flashPayment/order-recommend/list'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/order-recommend/detail',
    name: '/order-recommend/detail',
    component: () => import('@/components/product/flashPayment/order-recommend/detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/binding_QRcode',
    name: '员工信息',
    component: () => import('@/components/product/flashPayment/binding-QRcode/index.vue'),
    meta: {
      keepAlive: false
    }
  },
]
