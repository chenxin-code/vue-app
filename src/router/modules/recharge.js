/**
 * Created by DongMj on 2019/3/27.
 */
module.exports = [

  // 充值
  {
    path: '/qq-recharge',
    name: 'QQ充值',
    component: () => import('@/components/product/recharge/qq-recharge/qq-recharge'),
    meta: {
      title: 'QQ充值',
      keepAlive: false
    }
  },
  {
    path: '/phone-bill-recharge',
    name: '话费充值',
    component: () => import('@/components/product/recharge/phone-bill-recharge/phone-bill-recharge'),
    meta: {
      title: '话费充值',
      keepAlive: false
    }
  },
  {
    path: '/recharge-bill',
    name: '充值账单',
    component: () => import('@/components/product/recharge/recharge-bill/recharge-bill'),
    meta: {
      title: '充值账单',
      keepAlive: false
    }
  },
  {
    path: '/institutional-choice',
    name: '机构选择',
    component: () => import('@/components/product/recharge/institutional-choice/institutional-choice'),
    meta: {
      title: '机构选择',
      keepAlive: false
    }
  },
  {
    path: '/flow-recharge',
    name: '流量充值',
    component: () => import('@/components/product/recharge/flow-recharge/flow-recharge'),
    meta: {
      title: '流量充值',
      keepAlive: false
    }
  },
  {
    path: '/video-recharge',
    name: '视频充值',
    component: () => import('@/components/product/recharge/video-recharge/video-recharge'),
    meta: {
      title: '视频充值',
      keepAlive: false
    }
  },
  {
    path: '/video-index',
    name: '视频充值',
    component: () => import('@/components/product/recharge/video-recharge/video-index'),
    meta: {
      title: '视频充值搜索',
      keepAlive: false
    }
  },
  {
    path: '/play-recharge',
    name: '游戏充值',
    component: () => import('@/components/product/recharge/play-recharge/play-recharge'),
    meta: {
      title: '游戏充值',
      keepAlive: false
    }
  },
  {
    path: '/life-pay',
    name: '生活缴费',
    component: () => import('@/components/product/recharge/life-payment/life-pay'),
    meta: {
      title: '生活缴费',
      keepAlive: false
    }
  },
  {
    path: '/life-violation-pay',
    name: 'life-violation-pay',
    component: () => import('@/components/product/recharge/life-payment/common-payment/pay'),
    meta: {
      title: '收银台',
      keepAlive: false
    }
  },
  {
    path: '/life-pay-success',
    name: 'life-pay-success',
    component: () => import('@/components/product/recharge/life-payment/common-payment/pay-success'),
    meta: {
      title: '支付成功',
      keepAlive: false
    }
  },
  {
    path: '/new-recharge-account',
    name: '新增缴费账户',
    component: () => import('@/components/product/recharge/life-payment/new-recharge-account/new-recharge-account'),
    meta: {
      title: '新增缴费账户',
      keepAlive: false
    }
  },
  {
    path: '/edit-account',
    name: '常用缴费',
    component: () => import('@/components/product/recharge/life-payment/edit-account/edit-account'),
    meta: {
      title: '常用缴费编辑页面',
      keepAlive: false
    }
  },
  {
    path: '/nothing-paybill',
    name: '无缴费账单',
    component: () => import('@/components/product/recharge/life-payment/edit-account/nothing-paybill'),
    meta: {
      title: '无缴费账单',
      keepAlive: false
    }
  },
  {
    path: '/pay-first',
    name: '生活缴费先付费',
    component: () => import('@/components/product/recharge/life-payment/edit-account/pay-first'),
    meta: {
      title: '生活缴费先付费',
      keepAlive: false
    }
  },
  {
    path: '/address',
    name: '地址选择',
    component: () => import('@/components/product/recharge/address/address'),
    meta: {
      title: '地址选择',
      keepAlive: false
    }
  },
  {
    path: '/recharge-bill-details',
    name: '账单详情',
    component: () => import('@/components/product/recharge/recharge-bill-details/recharge-bill-details'),
    meta: {
      title: '账单详情',
      keepAlive: false
    }
  },
  // 加油卡申请
  {
    path: '/no-apply-card',
    name: '默认未申请卡',
    component: () => import('@/components/product/apply-card/no-apply-card'),
    meta: {
      keepAlive: true,
      title: '默认未申请卡'
    }
  },
  {
    path: '/applyed-card',
    name: '办卡进度',
    component: () => import('@/components/product/apply-card/applyed-card'),
    meta: {
      keepAlive: false,
      title: '办卡进度'
    }
  },
  {
    path: '/apply-card',
    name: '办卡申请',
    component: () => import('@/components/product/apply-card/apply-card'),
    meta: {
      keepAlive: false,
      title: '办卡申请'
    }
  },
  {
    path: '/apply-card-guide',
    name: '办卡指南',
    component: () => import('@/components/product/apply-card/apply-card-guide'),
    meta: {
      keepAlive: false,
      title: '办卡指南'
    }
  },
  {
    path: '/traffic-ticket-index',
    name: '违章缴费',
    component: () => import('@/components/product/recharge/traffic-ticket/traffic-ticket-index'),
    meta: {
      title: '违章缴费',
      keepAlive: false
    }
  },
  {
    path: '/add-car-index',
    name: '添加车辆',
    component: () => import('@/components/product/recharge/traffic-ticket/add-car-index'),
    meta: {
      title: '添加车辆',
      keepAlive: false
    }
  },
  {
    path: '/violation-query',
    name: '违章查询',
    component: () => import('@/components/product/recharge/traffic-ticket/violation-query'),
    meta: {
      title: '违章查询',
      keepAlive: false
    }
  },
  {
    path: '/violation-details',
    name: '违章处理',
    component: () => import('@/components/product/recharge/traffic-ticket/violation-details'),
    meta: {
      title: '违章处理',
      keepAlive: false
    }
  },
  {
    path: '/violation-ticket',
    name: 'violation-ticket',
    component: () => import('@/components/product/recharge/traffic-ticket/violation-ticket'),
    meta: {
      title: '罚单代缴',
      keepAlive: false
    }
  },
  {
    path: '/violation-pay',
    name: 'violation-pay',
    component: () => import('@/components/product/recharge/traffic-ticket/pay/pay'),
    meta: {
      title: '收银台',
      keepAlive: false
    }
  },
  {
    path: '/pay-success',
    name: '支付成功',
    component: () => import('@/components/product/recharge/traffic-ticket/pay/pay-success'),
    meta: {
      title: '支付成功',
      keepAlive: false
    }
  },
  {
    path: '/taiping-insurance',
    name: '车辆保险',
    component: () => import('@/components/product/recharge/vehicle-insurance/taiping-insurance'),
    meta: {
      title: '车辆保险',
      keepAlive: false
    }
  },
  {
    path: '/vehicle-insurance',
    name: '车辆保险',
    component: () => import('@/components/product/recharge/vehicle-insurance/vehicle-insurance'),
    meta: {
      title: '车辆保险',
      keepAlive: false
    }
  },
  {
    path: '/my-insurance-policy',
    name: '我的保单',
    component: () => import('@/components/product/recharge/vehicle-insurance/my-insurance-policy'),
    meta: {
      title: '我的保单',
      keepAlive: false
    }
  },
  {
    path: '/insurance-policy-details',
    name: '详情',
    component: () => import('@/components/product/recharge/vehicle-insurance/insurance-policy-details'),
    meta: {
      title: '详情',
      keepAlive: false
    }
  },
  // 演出票务
  {
    path: '/ticket',
    name: '演出票务',
    component: () => import('@/components/product/recharge/ticket/ticket'),
    meta: {
      title: '演出票务',
      keepAlive: false
    }
  },
  {
    path: '/ticket-details',
    name: '演出票务详情',
    component: () => import('@/components/product/recharge/ticket/ticket-details'),
    meta: {
      title: '演出票务详情',
      keepAlive: false
    }
  },
  {
    path: '/ticketFile-selection',
    name: '票档选择',
    component: () => import('@/components/product/recharge/ticket/ticketFile-selection'),
    meta: {
      title: '票档选择',
      keepAlive: false
    }
  },
  {
    path: '/ticket-order',
    name: '票档选择',
    component: () => import('@/components/product/recharge/ticket/ticket-order'),
    meta: {
      title: '票档选择',
      keepAlive: false
    }
  },
  {
    path: '/ticket-addressList',
    name: 'ticket-addressList',
    component: () => import('@/components/product/recharge/ticket/ticket-addressList'),
    meta: {
      title: '票务地址',
      keepAlive: false
    }
  },
  // 电影票卡券
  {
    path: '/movie-ticket',
    name: '卡券商城',
    component: () => import('@/components/product/recharge/movie-ticket/cardTicketShop'),
    meta: {
      title: '卡券商城',
      keepAlive: false
    }
  },
  {
    path: '/cardTicket-shop',
    name: '电影票卡券',
    component: () => import('@/components/product/recharge/movie-ticket/movieTicket'),
    meta: {
      title: '电影票卡券',
      keepAlive: false
    }
  },
  {
    path: '/movie-ticket-order',
    name: '电影票卡券',
    component: () => import('@/components/product/recharge/movie-ticket/movieTicketOrder'),
    meta: {
      title: '电影票卡券',
      keepAlive: false
    }
  }
]
