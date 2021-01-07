export default [
  {
    path: '/jane/index',
    name: 'jane/index',
    component: () => import('@/views/jane-pay/index'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/indexNew',
    name: 'jane/indexNew',
    component: () => import('@/views/jane-pay/indexNew'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/paySelect',
    name: 'jane/paySelect',
    component: () => import('@/views/jane-pay/paySelect'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/signPage',
    name: 'jane/signPage',
    component: () => import('@/views/jane-pay/signPage'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/signing',
    name: 'jane/signing',
    component: () => import('@/views/jane-pay/signing'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/signingNew',
    name: 'jane/signingNew',
    component: () => import('@/views/jane-pay/signingNew'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/agreement',
    name: 'jane/agreement',
    component: () => import('@/views/jane-pay/agreement'),
    meta: {
       title: '加油支付协议',
      keepAlive: false
    }
  },
  {
    path: '/jane/label_management',
    name: 'jane/label_management',
    component: () => import('@/views/jane-pay/label-management'),
    meta: {
      title: '标签管理',
      keepAlive: false
    }
  },
  {
    path: '/jane/labelDetail',
    name: 'jane/labelDetail',
    component: () => import('@/views/jane-pay/labelDetail'),
    meta: {
      title: '标签管理详情',
      keepAlive: false
    }
  },
  {
    path: '/jane/record_query',
    name: 'jane/record_query',
    component: () => import('@/views/jane-pay/record-query'),
    meta: {
      title: '记录查询',
      keepAlive: false
    }
  },
  {
    path: '/jane/contractDetail',
    name: 'jane/contractDetail',
    component: () => import('@/views/jane-pay/contractDetail'),
    meta: {
      title: '记录查询',
      keepAlive: false
    }
  },
  {
    path: '/jane/vouchersDetail',
    name: 'jane/vouchersDetail',
    component: () => import('@/views/jane-pay/vouchersDetail'),
    meta: {
      title: '加油支付凭证详情',
      keepAlive: false
    }
  },
  {
    path: '/jane/payList',
    name: 'jane/payList',
    component: () => import('@/views/jane-pay/payList'),
    meta: {
      title: '更多加油记录',
      keepAlive: false
    }
  },
  {
    path: '/jane/complete',
    name: 'jane/complete',
    component: () => import('@/views/jane-pay/complete'),
    meta: {
      title: '成功',
      keepAlive: false
    }
  },
  {
    path: '/jane/janeView',
    name: '无感加油',
    component: () => import('@/views/jane-pay/janeView'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/nextMessage',
    name: 'jane/nextMessage',
    component: () => import('@/views/jane-pay/next-message'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/agriculturalBank',
    name: 'jane/agriculturalBank',
    component: () => import('@/views/jane-pay/agricultural-bank'),
    meta: {
      title: '无感加油',
      keepAlive: false
    }
  },
  {
    path: '/jane/verificationCode',
    name: 'jane/verificationCode',
    component: () => import('@/views/jane-pay/verificationCode'),
    meta: {
      title: '加油机验证码获取',
      keepAlive: false
    }
  },
]
