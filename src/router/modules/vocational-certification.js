export default [
  {
    path: '/vocational_certification/home',
    name: '职业认证',
    // component: () => import('@/views/vocational-certification'),
    component: () => import('@/views/industryCertification'), // 替换新版（以后修改均在新版）
    meta: {
      title: '职业认证',
      keepAlive: true
    }
  },
  {
    path: '/vocational_certification/authentication',
    name: '职业认证',
    component: () => import('@/views/vocational-certification/common/authentication.vue'),
    meta: {
      title: '职业认证',
      keepAlive: false
    }
  },
  {
    path: '/vocational_certification/feedback',
    name: '认证反馈',
    component: () => import('@/views/vocational-certification/common/feedback.vue'),
    meta: {
      title: '认证反馈',
      keepAlive: false
    }
  },
  {
    path: '/vocational_certification/group',
    name: '职业认证',
    component: () => import('@/views/vocational-certification/common/group.vue'),
    meta: {
      title: '职业认证',
      keepAlive: false
    }
  },
  {
    path: '/vocational_certification/details',
    name: '信息详情',
    component: () => import('@/views/vocational-certification/common/details.vue'),
    meta: {
      title: '信息详情',
      keepAlive: false
    }
  }
]
