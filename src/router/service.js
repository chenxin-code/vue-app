module.exports = [
  {
    path: '/service_list',
    name: '我的服务',
    component: () => import('@/components/mall2/service/service-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/rights_introduce',
    name: '权益使用',
    component: () => import('@/components/mall2/service/rights-introduce'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/rights_use',
    name: '权益使用',
    component: () => import('@/components/mall2/service/rights-use'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/service_detail',
    name: '权益使用',
    component: () => import('@/components/mall2/service/service-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/service_success',
    name: '权益使用',
    component: () => import('@/components/mall2/service/service-success'),
    meta: {
      keepAlive: false
    }
  }
]
