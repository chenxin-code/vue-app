export default [
  {
    path: '/hkyyindex',
    name: '好客油油',
    component: () => import('@/deploy/hkyy/views/refuil-strong'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/hkpay',
    name: '券',
    component: () => import('@/deploy/hkyy/views/pay'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/hkcode',
    name: '优惠码',
    component: () => import('@/deploy/hkyy/views/code'),
    meta: {
      title: '优惠码',
      keepAlive: false
    }
  },
  {
    path: '/hkpayDetail',
    name: '使用详情',
    component: () => import('@/deploy/hkyy/views/pay-detail'),
    meta: {
      title: '使用详情',
      keepAlive: false
    }
  },
  {
    path: '/hkhistory',
    name: '历史记录',
    component: () => import('@/deploy/hkyy/views/history'),
    meta: {
      title: '历史记录',
      keepAlive: false
    }
  }, {
    path: '/hkhistorydetail',
    name: '记录详情',
    component: () => import('@/deploy/hkyy/views/history-detail'),
    meta: {
      title: '记录详情',
      keepAlive: false
    }
  },
  {
    path: '/hkexclusivediscount',
    name: '专属优惠',
    component: () => import('@/deploy/hkyy/views/discount/exclusive-discount'),
    meta: {
      title: '专属优惠',
      keepAlive: false
    }
  },
  {
    path: '/hkedinforegister',
    name: '专属优惠认证',
    component: () => import('@/deploy/hkyy/views/discount/ed-info-register'),
    meta: {
      title: '专属优惠认证',
      keepAlive: false
    }
  },
  {
    path: '/hkedstation',
    name: '选择油站',
    component: () => import('@/deploy/hkyy/views/discount/ed-station'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/hkeddetail',
    name: '优惠详情',
    component: () => import('@/deploy/hkyy/views/discount/ed-detail'),
    meta: {
      title: '优惠详情',
      keepAlive: false
    }
  },
  {
    path: '/hkfans',
    name: '我的粉丝',
    component: () => import('@/deploy/hkyy/views/fans'),
    meta: {
      title: '我的粉丝',
      keepAlive: false
    }
  },
  {
    path: '/groupIndex',
    name: '拼团',
    component: () => import('@/deploy/hkyy/views/group/index'),
    meta: {
      title: '拼团',
      keepAlive: false
    }
  },
  {
    path: '/groupInvite',
    name: '邀请好友',
    component: () => import('@/deploy/hkyy/views/group/invite'),
    meta: {
      title: '邀请好友',
      keepAlive: false
    }
  },
  {
    path: '/groupHelp',
    name: '好友助力',
    component: () => import('@/deploy/hkyy/views/group/friendHelp'),
    meta: {
      title: '好友助力',
      keepAlive: false
    }
  },
  {
    path: '/salesRank',
    name: '销售额排行榜',
    component: () => import('@/deploy/hkyy/views/salesRank'),
    meta: {
      title: '销售额排行榜',
      keepAlive: false
    }
  },
]
