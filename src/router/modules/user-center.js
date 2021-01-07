export default [
  {
    path: '/user_center/money_saving_details',
    name: 'user_center/money_saving_details',
    component: () => import('@/views/user-center/money-saving-details/money-saving-detail.vue'),
    meta: {
      title: '省钱明细',
      keepAlive: false
    }
  },
  {
    path: '/user_center/activitiesList',
    name: 'user_center/activitiesList',
    component: () => import('@/views/user-center/marketing-activities/activitiesList'),
    meta: {
      title: '营销活动列表',
      keepAlive: false
    }
  },
  {
    path: '/user_center/activities_history',
    name: 'user_center/activities_history',
    component: () => import('@/views/user-center/marketing-activities/activities-history'),
    meta: {
      title: '营销历史活动列表',
      keepAlive: false
    }
  },
  {
    path: '/user_center/activities_detail',
    name: 'user_center/activities_detail',
    component: () => import('@/views/user-center/marketing-activities/activities-detail'),
    meta: {
      title: '营销活动详情',
      keepAlive: true
    }
  },
  {
    path: '/user_center/activities_record',
    name: 'user_center/activities_record',
    component: () => import('@/views/user-center/marketing-activities/activities-record'),
    meta: {
      title: '营销参与记录',
      keepAlive: false
    }
  },
  {
    path: '/wxmp/mnp-qrcode',
    name: '我的会员码',
    component: () => import('@/views/user-center/wxmp/mnp-qrcode'),
    meta: {
      title: '我的会员码',
      keepAlive: false
    }
  },
  {
    path: '/wxmp/emp-qrcode',
    name: '推荐码',
    component: () => import('@/views/user-center/wxmp/emp-qrcode'),
    meta: {
      title: '推荐码',
      keepAlive: false
    }
  },
  {
    path: '/user_center/salary',
    name: '员工薪酬',
    component: () => import('@/views/user-center/salary/salary'),
    meta: {
      title: '员工薪酬',
      keepAlive: false
    }
  },
  {
    path: '/user_center/offer_index',
    name: '预约报价首页',
    component: () => import('@/views/user-center/uniform-insurance/offerIndex'),
    meta: {
      title: '预约报价首页',
      keepAlive: false
    }
  },
  {
    path: '/user_center/offer_success',
    name: '预约成功',
    component: () => import('@/views/user-center/uniform-insurance/offerSuccess'),
    meta: {
      title: '预约成功',
      keepAlive: false
    }
  },
  {
    path: '/user_center/offerlist',
    name: '我的报价单',
    component: () => import('@/views/user-center/uniform-insurance/offerList'),
    meta: {
      title: '我的报价单',
      keepAlive: false
    }
  },
  {
    path: '/user_center/writeoff1',
    name: '洗车劵核销',
    component: () => import('@/views/user-center/carwash-coupon/writeoff1'),
    meta: {
      title: '洗车劵核销',
      keepAlive: false
    }
  },
  {
    path: '/user_center/writeoff2',
    name: '核销完成',
    component: () => import('@/views/user-center/carwash-coupon/writeoff2'),
    meta: {
      title: '核销完成',
      keepAlive: false
    }
  },
  {
    path: '/user_center/shareList',
    name: '分享优惠券',
    component: () => import('@/views/user-center/fission-sharing/shareList'),
    meta: {
      title: '分享优惠券',
      keepAlive: false
    }
  },
  {
    path: '/user_center/sharePage',
    name: '分享优惠券',
    component: () => import('@/views/user-center/fission-sharing/sharePage'),
    meta: {
      title: '分享优惠券',
      keepAlive: false
    }
  },
  {
    path: '/user_center/question_list',
    name: '问题列表',
    component: () => import('@/views/user-center/question/list'),
    meta: {
      title: '问题列表',
      keepAlive: true
    }
  },
  {
    path: '/user_center/question_category',
    name: '问题分类',
    component: () => import('@/views/user-center/question/category'),
    meta: {
      title: '问题分类',
      keepAlive: true
    }
  },
  {
    path: '/user_center/question_detail',
    name: '问题详情',
    component: () => import('@/views/user-center/question/detail'),
    meta: {
      title: '问题详情',
      keepAlive: false
    }
  },
  {
    path: '/equity/magnification',
    name: '权益详情',  //（未拥有）
    component: () => import('@/views/equity/magnification'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/have_equity',
    name: '权益详情', //倍率,商城,账户明细（已拥有）
    component: () => import('@/views/equity/have-equity'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/couponList',
    name: '优惠券-权益详情',
    component: () => import('@/views/equity/couponList'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/question',
    name: '问卷权益详情',
    component: () => import('@/views/equity/question'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/game_equity',
    name: '游戏权益明细',
    component: () => import('@/views/equity/game-equity'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/equityRecord',
    name: '权益明细',
    component: () => import('@/views/equity/equityRecord'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/couponDetail',
    name: '权益明细',  //优惠券权益的明细
    component: () => import('@/views/equity/couponDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/third_services',
    name: '第三方服务',
    component: () => import('@/views/equity/third-services'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/car_customer_service',
    name: '约车权益',
    component: () => import('@/views/equity/customer-service'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity/car_customer_service_detail',
    name: '约车权益详情',
    component: () => import('@/views/equity/customer-service-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity_card/equityList',
    name: '我的权益卡列表',
    component: () => import('@/views/equity-card/equityList'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity_card/equityCenter',
    name: '权益卡中心',
    component: () => import('@/views/equity-card/equityCenter'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity_card/overdue',
    name: '过期权益卡',
    component: () => import('@/views/equity-card/overdue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/equity_card/detail',
    name: '权益卡详情',
    component: () => import('@/views/equity-card/detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/smart-car-wash',
    name: '智能洗车店',
    component: () => import('@/views/smart-car-wash/smart-car-wash.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/wash-store',
    name: '智能洗车店',
    component: () => import('@/views/smart-car-wash/wash-store.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/car-washing',
    name: '智能洗车店',
    component: () => import('@/views/smart-car-wash/car-washing.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/wash-recording',
    name: '洗车记录',
    component: () => import('@/views/smart-car-wash/wash-recording.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/promotion_income/index',
    name: '推广权益',
    component: () => import('@/views/user-center/promotion-income/index.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/promotion_income/static',
    name: '收益统计',
    component: () => import('@/views/user-center/promotion-income/static.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/promotion_income/detail',
    name: '订单详情',
    component: () => import('@/views/user-center/promotion-income/detail.vue'),
    meta: {
      keepAlive: false
    }
  },
  // /* 视听卡 */merchandise-discount
  // {
  //   path: '/user_center/card_classifyList',
  //   name: '视听卡列表',
  //   component: () => import('@/views/user-center/audioVisual-card/card-classifyList'),
  //   meta: {
  //     title: '视听卡列表',
  //     keepAlive: true
  //   }
  // },
  // {
  //   path: '/user_center/video_recharge',
  //   name: '视频充值',
  //   component: () => import('@/views/user-center/audioVisual-card/video-recharge'),
  //   meta: {
  //     title: '视频充值',
  //     keepAlive: true
  //   }
  // },
  // {
  //   path: '/user_center/recharge_bill',
  //   name: '视频充值账单',
  //   component: () => import('@/views/user-center/audioVisual-card/recharge-bill'),
  //   meta: {
  //     title: '视频充值账单',
  //     keepAlive: true
  //   }
  // },
  // {
  //   path: '/user_center/bill_details',
  //   name: '账单详情',
  //   component: () => import('@/views/user-center/audioVisual-card/bill-details'),
  //   meta: {
  //     title: '账单详情',
  //     keepAlive: true
  //   }
  // }

]
