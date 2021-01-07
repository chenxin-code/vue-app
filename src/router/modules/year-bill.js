export default [
  {
    path: '/year-bill',
    name: '年度账单',
    component: () => import('@/views/year-bill/index'),
    meta: {
      title: '年度账单',
      keepAlive: false
    }
  },
]
