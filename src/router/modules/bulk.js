
//create by hjc 团购模块

export default [{
    path: '/bulk',
    name: '活动首页',
    component: () => import('@/components/bulk/activity/index.vue'),
    meta: {
      title: '活动首页',
      keepAlive: false
    }
  },
  {
    path: '/bulk_share',
    name: '微信团购分享',
    component: () => import('@/components/bulk/share/index.vue'),
    meta: {
      title: '微信团购分享',
      keepAlive: false
    }
  },
  {
    path: '/bulk_share_confirm_order',
    name: '分享确认订单',
    component: () => import('@/components/bulk/share/confirmOrder/index.vue'),
    meta: {
      title: '分享确认订单',
      keepAlive: false
    }
  },
  {
    path: '/bulk_order_list',
    name: '订单列表',
    component: () => import('@/components/bulk/orderList/index.vue'),
    meta: {
      title: '订单列表',
      keepAlive: false
    }
  },
  {
    path: '/bulk_order_detail',
    name: '订单详情',
    component: () => import('@/components/bulk/orderDetail/index.vue'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/bulk_after_application',
    name: '售后申请',
    component: () => import('@/components/bulk/afterApplication/index.vue'),
    meta: {
      title: '售后申请',
      keepAlive: false
    }
  },
]
