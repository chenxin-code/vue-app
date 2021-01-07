export default [
  {
    path: '/industryCertification/home',
    name: '职业认证',
    component: () => import('@/views/industryCertification'),
    meta: {
      title: '职业认证',
      keepAlive: true
    }
  },
  {
    path: '/industryCertification/classList',
    name: '职业认证',
    component: () => import('@/views/industryCertification/classList.vue'),
    meta: {
      title: '职业认证',
      keepAlive: true
    }
  },
  {
    path: '/industryCertification/certificationStatus',
    name: '职业认证',
    component: () => import('@/views/industryCertification/common/certificationStatus.vue'),
    meta: {
      title: '职业认证',
      keepAlive: false
    }
  },
  {
    path: '/industryCertification/authentication',
    name: '职业认证',
    component: () => import('@/views/industryCertification/common/authentication.vue'),
    meta: {
      title: '职业认证',
      keepAlive: false
    }
  },
  {
    path: '/industryCertification/replacePage',
    name: '职业认证',
    component: () => import('@/views/industryCertification/common/replacePage.vue'),
    meta: {
      title: '职业认证',
      keepAlive: false
    }
  }
]
