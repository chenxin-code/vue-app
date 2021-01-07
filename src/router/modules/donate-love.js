
export default [
  {
    path: '/donate-home',
    name: 'donate-home',
    component: () => import('@/views/donate-with-love/donate-home'),
    meta: {
      title: '爱心捐赠',
      keepAlive: false
    }
  },
  {
    path: '/donate-order',
    name: 'donate-order',
    component: () => import('@/views/donate-with-love/donate-order'),
    meta: {
      title: '爱心捐赠',
      keepAlive: false
    }
  },
  {
    path: '/donate-detail',
    name: 'donate-detail',
    component: () => import('@/views/donate-with-love/donate-detail'),
    meta: {
      title: '爱心捐赠',
      keepAlive: true
    }
  },
  {
    path: '/donate-history',
    name: 'donate-history',
    component: () => import('@/views/donate-with-love/donate-history'),
    meta: {
      title: '捐赠记录',
      keepAlive: false
    }
  },
  {
    path: '/donate-result',
    name: 'donate-result',
    component: () => import('@/views/donate-with-love/donate-result'),
    meta: {
      title: '爱心捐赠',
      keepAlive: false
    }
  },
]
