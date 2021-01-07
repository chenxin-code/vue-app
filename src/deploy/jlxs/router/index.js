export default [
  {
    path: '/jlxsindex', // ？ ok
    name: '好客吉祥',
    component: () => import('@/deploy/jlxs/views/refuil-strong'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/hkpay', // ？ ok
    name: '券',
    component: () => import('@/deploy/jlxs/views/pay'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/hkcode',  // ？ ok
    name: '优惠码',
    component: () => import('@/deploy/jlxs/views/code'),
    meta: {
      title: '优惠码',
      keepAlive: false
    }
  },
  {
    path: '/hkpayDetail',  // ？ ok
    name: '使用详情',
    component: () => import('@/deploy/jlxs/views/pay-detail'),
    meta: {
      title: '使用详情',
      keepAlive: false
    }
  },
  {
    path: '/hkhistory',  // ？ ok
    name: '历史记录',
    component: () => import('@/deploy/jlxs/views/history'),
    meta: {
      title: '历史记录',
      keepAlive: false
    }
  }, {
    path: '/hkhistorydetail', // ？
    name: '记录详情',
    component: () => import('@/deploy/jlxs/views/history-detail'),
    meta: {
      title: '记录详情',
      keepAlive: false
    }
  },
  {
    path: '/hkexclusivediscount',
    name: '专属优惠',
    component: () => import('@/deploy/jlxs/views/discount/exclusive-discount'),
    meta: {
      title: '专属优惠',
      keepAlive: false
    }
  },
  {
    path: '/hkedinforegister',
    name: '专属优惠认证',
    component: () => import('@/deploy/jlxs/views/discount/ed-info-register'),
    meta: {
      title: '专属优惠认证',
      keepAlive: false
    }
  },
  {
    path: '/hkedstation',
    name: '选择油站',
    component: () => import('@/deploy/jlxs/views/discount/ed-station'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/hkeddetail',
    name: '优惠详情',
    component: () => import('@/deploy/jlxs/views/discount/ed-detail'),
    meta: {
      title: '优惠详情',
      keepAlive: false
    }
  },
  {
    path: '/hkfans',
    name: '我的粉丝',
    component: () => import('@/deploy/jlxs/views/fans'),
    meta: {
      title: '我的粉丝',
      keepAlive: false
    }
  },
  {
    path: '/groupIndex',
    name: '拼团',
    component: () => import('@/deploy/jlxs/views/group/index'),
    meta: {
      title: '拼团',
      keepAlive: false
    }
  },
  {
    path: '/groupInvite',
    name: '邀请好友',
    component: () => import('@/deploy/jlxs/views/group/invite'),
    meta: {
      title: '邀请好友',
      keepAlive: false
    }
  },
  {
    path: '/groupHelp',
    name: '好友助力',
    component: () => import('@/deploy/jlxs/views/group/friendHelp'),
    meta: {
      title: '好友助力',
      keepAlive: false
    }
  },
  {
    path: '/salesRank',
    name: '销售额排行榜',
    component: () => import('@/deploy/jlxs/views/salesRank'),
    meta: {
      title: '销售额排行榜',
      keepAlive: false
    }
  },
  {
    path: '/applyCard',
    name: '在线办卡',
    component: () => import('@/deploy/jlxs/views/applyCard/soldier-apply-card'),
    meta: {
      title: '在线办卡',
      keepAlive: false
    }
  },
  {
    path: '/applyCardInfo',
    name: '申请办卡',
    component: () => import('@/deploy/jlxs/views/applyCard/soldier-personal-card'),
    meta: {
      title: '申请办卡',
      keepAlive: false
    }
  },
  {
    path: '/jlxs_ticket_list',
    name: '券',
    component: () => import('@/deploy/jlxs/views/electronic-ticket/mine-ticket'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/jlxs_ticket_used',
    name: '券',
    component: () => import('@/deploy/jlxs/views/electronic-ticket/mine-ticket-used'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/jlxs_ticket_detail',
    name: '券',
    component: () => import('@/deploy/jlxs/views/electronic-ticket/mine-ticket-detail'),
    meta: {
      title: '券',
      keepAlive: false
    }
  },
  {
    path: '/businessCooperation',
    name: '商务合作',
    component: () => import('@/deploy/jlxs/views/business-cooperation'),
    meta: {
      title: '商务合作',
      keepAlive: false
    }
  }
]
