/**
 * Created by Dongmengjia on 2019/6/27.
 */
export default [
  {
    path: '/open-package',
    name: '开通套餐',
    component: () => import('../views/open-package'),
    meta: {
      title: '开通套餐',
      keepAlive: false
    }
  },
  {
    path: '/invitation-details',
    name: '邀约详情',
    component: () => import('../views/invitation-details'),
    meta: {
      title: '邀约详情',
      keepAlive: false
    }
  },
  {
    path: '/redirect',
    component: () => import('../views/redirect'),
    meta: {
      title: '邀约详情',
      keepAlive: false
    }
  },
  {
    path: '/jane/signing',
    name: 'jane/signing',
    component: () => import('../views/signing'),
    meta: {
      title: '签约',
      keepAlive: false
    }
  },
  {
    path: '/electronic_billing',
    name: 'electronic_billing',
    component: () => import('../views/electronic-billing'),
    meta: {
      title: '中国石化河北2019年油滴账单',
      keepAlive: false
    }
  },
  {
    path: '/redirectEB',
    name: 'redirectEB',
    component: () => import('../views/electronic-billing/redirect.vue'),
    meta: {
      title: '中国石化河北2019年油滴账单',
      keepAlive: false
    }
  },
  {
    path: '/isFollow',
    name: 'isFollow',
    component: () => import('../views/electronic-billing/isFollow.vue'),
    meta: {
      title: '中国石化河北2019年油滴账单',
      keepAlive: false
    }
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: () => import('../views/electronic-billing/agreement.vue'),
    meta: {
      title: '中国石化河北2019年油滴账单',
      keepAlive: false
    }
  },
  {
    path: '/authentication/index',
    name: 'authentication/index',
    component: () => import('../views/authentication/index'),
    meta: {
      title: '团购认证',
      keepAlive: false
    }
  },
  {
    path: '/enterprise-group',
    name: 'enterprise-group',
    component: () => import('../views/enterprise-group/enterprise-group'),
    meta: {
      title: '企业群组',
      keepAlive: false
    }
  },
  {
    path: '/enterprise-group/result',
    name: 'enterprise-group/result',
    component: () => import('../views/enterprise-group/result'),
    meta: {
      title: '结果',
      keepAlive: false
    }
  },
  {
    path: '/refueling-package',
    name: 'refueling-package',
    component: () => import('../views/refueling-package/refueling-package.vue'),
    meta: {
      title: '加油套餐',
      keepAlive: false
    }
  },
  {
    path: '/contract-package',
    name: 'contract-package',
    component: () => import('../views/contract-package/contract-package.vue'),
    meta: {
      title: '合约套餐',
      keepAlive: false
    }
  },
  {
    path: '/contract-package-detail',
    name: 'contract-package-detail',
    component: () => import('../views/contract-package-detail/contract-package-detail.vue'),
    meta: {
      title: '合约套餐',
      keepAlive: false
    }
  },
  {
    path: '/contract-enterprise-group',
    name: 'contract-enterprise-group',
    component: () => import('../views/contract-enterprise-group/contract-enterprise-group.vue'),
    meta: {
      title: '机构群组',
      keepAlive: false,
    }
  },
  {
    path: '/fill-order',
    name: 'fill-order',
    component: () => import('../views/fill-order/fill-order.vue'),
    meta: {
      title: '填写订单',
      keepAlive: false,
    }
  },
  {
    path: '/set-meal',
    name: 'set-meal',
    component: () => import('../views/set-meal/set-meal.vue'),
    meta: {
      title: '我的套餐',
      keepAlive: false,
    }
  },
  {
    path: '/package-description',
    name: 'package-description',
    component: () => import('../views/package-description/package-description.vue'),
    meta: {
      title: '套餐说明',
      keepAlive: false,
    }
  },
  {
    path: '/historical-signing',
    name: 'historical-signing',
    component: () => import('../views/historical-signing/historical-signing.vue'),
    meta: {
      title: '历史签约',
      keepAlive: false,
    }
  },
  {
    path: '/activation-record',
    name: 'activation-record',
    component: () => import('../views/activation-record/activation-record.vue'),
    meta: {
      title: '激活记录',
      keepAlive: false,
    }
  },
  {
    path: '/contract-order-success',
    name: 'contract-order-success',
    component: () => import('../views/contract-order-success/contract-order-success.vue'),
    meta: {
      title: '支付成功',
      keepAlive: false,
    }
  },
  {
    path: '/member-benefits',
    name: 'member-benefits',
    component: () => import('../views/member-benefits/member-benefits.vue'),
    meta: {
      title: '油滴会员',
      keepAlive: false,
    }
  },
  {
    path: '/member-desc',
    name: 'member-desc',
    component: () => import('../views/member-desc/member-desc.vue'),
    meta: {
      title: '会员说明',
      keepAlive: false,
    }
  },
  {
    path: '/usercenter/aqgl',
    name: 'usercenter/aqgl',
    component: () => import('../views/safety-management/safety-management.vue'),
    meta: {
      title: '安全管理',
      keepAlive: false,
    }
  },
  {
    path: '/performance-desc',
    name: 'performance-desc',
    component: () => import('../views/performance-desc/performance-desc.vue'),
    meta: {
      title: '绩效说明',
      keepAlive: false,
    }
  },
  {
    path: '/performance-mine',
    name: 'performance-mine',
    component: () => import('../views/performance-mine/performance-mine.vue'),
    meta: {
      title: '我的绩效',
      keepAlive: true,
    }
  },
  {
    path: '/performance-contribution-ranking',
    name: 'performance-contribution-ranking',
    component: () => import('../views/performance-contribution-ranking/performance-contribution-ranking.vue'),
    meta: {
      title: '贡献排行',
      keepAlive: false,
    }
  },
  {
    path: '/performance-per-info',
    name: 'performance-per-info',
    component: () => import('../views/performance-per-info/performance-per-info.vue'),
    meta: {
      title: '贡献排行',
      keepAlive: false,
    }
  },
  {
    path: '/performance-rebate-details',
    name: 'performance-rebate-details',
    component: () => import('../views/performance-rebate-details/performance-rebate-details.vue'),
    meta: {
      title: '返利详情',
      keepAlive: false,
    }
  },
  {
    path: '/performance-member-list',
    name: 'performance-member-list',
    component: () => import('../views/performance-member-list/performance-member-list.vue'),
    meta: {
      title: '客户列表',
      keepAlive: true,
    }
  },
]
