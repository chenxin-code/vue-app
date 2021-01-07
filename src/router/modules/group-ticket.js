export default [
    {
      path: '/group_ticket/home',
      name: '开团抢神券',
      component: () => import('@/views/group-ticket'),
      meta: {
        title: '开团抢神券',
        keepAlive: false
      }
    },
    {
      path: '/group_ticket/rules',
      name: '活动规则',
      component: () => import('@/views/group-ticket/rules'),
      meta: {
        title: '活动规则',
        keepAlive: false
      }
    },
    {
      path: '/group_ticket/my_vouchers',
      name: '我的拼团',
      component: () => import('@/views/group-ticket/my-vouchers'),
      meta: {
        title: '我的拼团',
        keepAlive: false
      }
    },
    {
      path: '/group_ticket/group_detail/:id',
      name: '详情',
      component: () => import('@/views/group-ticket/group-detail'),
      meta: {
        title: '详情',
        keepAlive: false
      }
    },
    {
      path: '/group_ticket/recommend/list',
      name: '券商品列表',
      component: () => import('@/views/group-ticket/common/recommend/list'),
      meta: {
        title: '券商品列表',
        keepAlive: false
      }
    }
  ]
  