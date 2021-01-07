export default [
  {
    path: '/ykticketlist',
    name: '券',
    component: () => import('@/deploy/ykgj/views/mine-ticket'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/ykticketused',
    name: '券',
    component: () => import('@/deploy/ykgj/views/mine-ticket-used'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/ykgjticketdetail',
    name: '券',
    component: () => import('@/deploy/ykgj/views/mine-ticket-detail'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
]
