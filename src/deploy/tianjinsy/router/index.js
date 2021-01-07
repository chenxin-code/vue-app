export default [
  {
    path: '/industry_certification',
    name: 'industry_certification',
    component: () => import('../views/industry-certification/industry-certification'),
    meta: {
      title: '行业认证',
      keepAlive: false
    }
  }, {
    path: '/approval_state',
    name: 'approval_state',
    component: () => import('../views/industry-certification/approval-state'),
    meta: {
      title: '审批状态',
      keepAlive: false
    }
  }, {
    path: '/terms_of_service',
    name: 'terms_of_service',
    component: () => import('../views/industry-certification/terms-of-service'),
    meta: {
      title: '服务条款',
      keepAlive: false
    }
  }
]