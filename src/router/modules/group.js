export default [
  {
    path: '/my_group',
    name: '我的拼团',
    component: () => import('@/components/mall2/group/my-group'),
    meta: {
      title: '我的拼团',
      keepAlive: false
    }
  },
  {
    path: '/group_detail',
    name: '拼团详情',
    component: () => import('@/components/mall2/group/group-detail'),
    meta: {
      title: '拼团详情',
      keepAlive: false
    }
  },
  {
    path: '/grouplist',
    // name: '拼团',
    component: () => import('@/components/mall2/group/list'),
    meta: {
      // title: '拼团',
      keepAlive: false
    }
  },
  {
    path: '/groupproduct',
    name: ' 商品详情 ',
    component: () => import('@/components/mall2/group/detail'),
    meta: {
      title: '商品详情',
      keepAlive: false
    }
  },
  {
    path: '/groupplaceorder',
    name: '团购下订单',
    component: () => import('@/components/mall2/group/placeorder'),
    meta: {
      title: '团购下订单',
      keepAlive: true
    }
  },
  {
    path: '/my_cashback',
    name: '我的返现',
    component: () => import('@/components/mall2/group/cash-back/my-cashback.vue'),
    meta: {
      title: '我的返现',
      keepAlive: true
    }
  },
  {
    path: '/cash_back_detail',
    name: '返现详情',
    component: () => import('@/components/mall2/group/cash-back/cash-back-detail.vue'),
    meta: {
      title: '返现详情',
      keepAlive: true
    }
  },
]
