export default [
  {
    path: '/member_distribution/profit',
    name: 'member_distribution/profit',
    component: () => import('@/views/member-distribution/profit'),
    meta: {
      title: '会员分销我的收益',
      keepAlive: false
    }
  },
  {
    path: '/member_distribution/profitDetail',
    name: 'member_distribution/profitDetail',
    component: () => import('@/views/member-distribution/profitDetail'),
    meta: {
      title: '会员分销我的收益明细',
      keepAlive: false
    }
  },
  {
    path: '/member_distribution/selectTime',
    name: 'member_distribution/selectTime',
    component: () => import('@/views/member-distribution/selectTime'),
    meta: {
      title: '选择时间',
      keepAlive: false
    }
  }
]
