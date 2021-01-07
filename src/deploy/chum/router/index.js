export default [
  {
    path: '/usercenter/loginbinding',
    name: 'login',
    component: () => import('../views/login/index'),
    meta: {
      title: '登录',
      keepAlive: true
    }
  },
  {
    path: '/terms_service',
    name: 'terms_service',
    component: () => import('../views/login/terms-service.vue'),
    meta: {
      title: '服务条款',
      keepAlive: false
    }
  },
  {
    path: '/purchase_service',
    name: 'purchase_service',
    component: () => import('../views/purchase-service/purchase-service.vue'),
    meta: {
      title: '服务券购买',
      keepAlive: true
    }
  },
  {
    path: '/service_detail',
    name: 'service_detail',
    component: () => import('../views/service-detail/service-detail.vue'),
    meta: {
      title: '服务详情',
      keepAlive: false
    }
  },
  {
    path: '/applicable_stores',
    name: 'applicable_stores',
    component: () => import('../views/applicable-stores/applicable-stores.vue'),
    meta: {
      title: '适用门店',
      keepAlive: false
    }
  },
  {
    path: '/confirm_order',
    name: 'confirm_order',
    component: () => import('../views/confirm-order/confirm-order.vue'),
    meta: {
      title: '确认订单',
      keepAlive: false
    }
  },
  {
    path: '/mall2/paysuccess',
    name: 'mall2/paysuccess',
    component: () => import('../views/payment-result/payment-result.vue'),
    meta: {
      title: '订单支付成功',
      keepAlive: false
    }
  },
  {
    path: '/transaction_record',
    name: 'transaction_record',
    component: () => import('../views/transaction-record/transaction-record.vue'),
    meta: {
      title: '交易记录',
      keepAlive: true
    }
  },
  {
    path: '/transaction_detail',
    name: 'transaction_detail',
    component: () => import('../views/transaction-record/transaction-detail.vue'),
    meta: {
      title: '交易详情',
      keepAlive: false
    }
  },
  {
    path: '/write_off_record',
    name: 'write_off_record',
    component: () => import('../views/write-off-record/write-off-record.vue'),
    meta: {
      title: '核销记录',
      keepAlive: false
    }
  },
  {
    path: '/coupon_service',
    name: 'coupon_service',
    component: () => import('../views/coupon-service/coupon-service.vue'),
    meta: {
      title: '服务券',
      keepAlive: true
    }
  },
  {
    path: '/coupon_service_detail',
    name: 'coupon_service_detail',
    component: () => import('../views/coupon-service/coupon-service-detail.vue'),
    meta: {
      title: '服务券详情',
      keepAlive: false
    }
  },
  {
    path: '/after_sale_list',
    name: 'after_sale_list',
    component: () => import('../views/after-sale/after-sale-list.vue'),
    meta: {
      title: '售后退款',
      keepAlive: false
    }
  },
  {
    path: '/usercenter/userinfo',
    name: 'userinfo',
    component: () => import('../views/user-center/user-info.vue'),
    meta: {
      title: '个人信息',
      keepAlive: false
    }
  },
  {
    path: '/usercenter/modifyphone',
    name: 'modifyphone',
    component: () => import('../views/user-center/modify-phone.vue'),
    meta: {
      title: '修改手机号',
      keepAlive: false
    }
  },
  {
    path: '/usercenter/inviteqr',
    name: 'inviteqr',
    component: () => import('../views/user-center/invite-friend.vue'),
    meta: {
      title: '邀请好友',
      keepAlive: true
    }
  },
  {
    path: '/usercenter/idcardInfoedit',
    name: 'idcardInfoedit',
    component: () => import('../views/user-center/ids/idcardInfo-input.vue'),
    meta: {
      title: '身份证信息',
      keepAlive: false
    }
  },
  {
    path: '/usercenter/passportedit',
    name: 'passportedit',
    component: () => import('../views/user-center/ids/passport-input.vue'),
    meta: {
      title: '护照信息',
      keepAlive: false
    }
  },
  {
    path: '/usercenter/ids',
    name: 'ids',
    component: () => import('../views/user-center/ids/index.vue'),
    meta: {
      title: '我的证件',
      keepAlive: false
    }
  },
  {
    path: '/usercenter/iddetail',
    name: 'iddetail',
    component: () => import('../views/user-center/ids/id-detail.vue'),
    meta: {
      title: '证件详情',
      keepAlive: false
    }
  },
  {
    path: '/member_card_chum',
    name: 'member_card_chum',
    component: () => import('../views/member-card-chum/card-list.vue'),
    meta: {
      title: 'CHUM会员卡',
      keepAlive: true
    }
  },
  {
    path: '/card_detail',
    name: 'card_detail',
    component: () => import('../views/member-card-chum/card-detail.vue'),
    meta: {
      title: '会员卡详情',
      keepAlive: false
    }
  },
  {
    path: '/my_card_case',
    name: 'my_card_case',
    component: () => import('../views/my-card-case/my-card-list.vue'),
    meta: {
      title: '我的卡包',
      keepAlive: true
    }
  },
  {
    path: '/verify_sms',
    name: 'verify_sms',
    component: () => import('../views/my-card-case/verify-sms.vue'),
    meta: {
      title: '验证短信',
      keepAlive: false
    }
  },
  {
    path: '/presentation_card',
    name: 'presentation_card',
    component: () => import('../views/my-card-case/presentation.vue'),
    meta: {
      title: '赠送会员卡',
      keepAlive: false
    }
  },
  {
    path: '/perfect_information',
    name: 'perfect_information',
    component: () => import('../views/my-card-case/perfect-information.vue'),
    meta: {
      title: '完善身份信息',
      keepAlive: false
    }
  },
  {
    path: '/my_interests',
    name: 'my_interests',
    component: () => import('../views/user-center/member-benefits/my-interests.vue'),
    meta: {
      title: '我的权益',
      keepAlive: true
    }
  },
  {
    path: '/benefits/customTraval',
    name: 'customTraval',
    component: () => import('../views/user-center/member-benefits/custom-travel.vue'),
    meta: {
      title: '定制游',
      keepAlive: false
    }
  },
  {
    path: '/benefits/benefitsInfo',
    name: 'benefitsInfo',
    component: () => import('../views/user-center/member-benefits/benefits-info.vue'),
    meta: {
      title: '权益说明',
      keepAlive: false
    }
  },
  {
    path: '/benefits/benefitsCode',
    name: 'benefitsCode',
    component: () => import('../views/user-center/member-benefits/benefits-code.vue'),
    meta: {
      title: 'CHUM 权益码',
      keepAlive: false
    }
  },
  {
    path: '/benefits/authorLogin',
    name: 'authorLogin',
    component: () => import('../views/user-center/member-benefits/author-login.vue'),
    meta: {
      title: '授权登陆',
      keepAlive: false
    }
  },
  {
    path: '/benefits/vipCar',
    name: 'vipCar',
    component: () => import('../views/user-center/member-benefits/vip-car.vue'),
    meta: {
      title: '礼宾车',
      keepAlive: false
    }
  },
  {
    path: '/benefits/visaApplication',
    name: 'visaApplication',
    component: () => import('../views/user-center/member-benefits/visa-application.vue'),
    meta: {
      title: '办签证',
      keepAlive: false
    }
  },
  {
    path: '/benefits/myInsurance',
    name: 'myInsurance',
    component: () => import('../views/user-center/member-benefits/my-insurance.vue'),
    meta: {
      title: '我的保单',
      keepAlive: false
    }
  },
  {
    path: '/benefits/insuranceDetail',
    name: 'insuranceDetail',
    component: () => import('../views/user-center/member-benefits/insurance-detail.vue'),
    meta: {
      title: '保单详情',
      keepAlive: false
    }
  },
  {
    path: '/benefits/selectStore',
    name: 'selectStore',
    component: () => import('../views/user-center/member-benefits/select-store.vue'),
    meta: {
      title: '选择门店',
      keepAlive: false
    }
  },
  {
    path: '/benefits/storeDetail',
    name: 'storeDetail',
    component: () => import('../views/user-center/member-benefits/store-detail.vue'),
    meta: {
      title: '门店详情',
      keepAlive: false
    }
  },
  {
    path: '/benefits/myPackage',
    name: 'myPackage',
    component: () => import('../views/user-center/my-package.vue'),
    meta: {
      title: '预约订单',
      keepAlive: true
    }
  },
  {

    path: '/recommended_details',
    name: 'recommended_details',
    component: () => import('../views/user-center/recommended-details/index.vue'),
    meta: {
      title: '推荐明细',
      keepAlive: false,
    }
  },
  {
    path: '/benefits/success',
    name: 'success',
    component: () => import('../views/user-center/member-benefits/success.vue'),
    meta: {
      title: '提交结果',
      keepAlive: false
    }
  },
  {
    path: '/offline_activities/index',
    name: 'offline_activities/index',
    component: () => import('../views/offline-activities/index.vue'),
    meta: {
      title: '线下活动',
      keepAlive: false
    }
  },
  {
    path: '/offline_activities/sign_up',
    name: 'offline_activities/sign_up',
    component: () => import('../views/offline-activities/sign-up.vue'),
    meta: {
      title: '线下活动报名',
      keepAlive: false
    }
  },
  {
    path: '/full_process_service',
    name: 'full_process_service',
    component: () => import('../views/my-card-case/full-process-service.vue'),
    meta: {
      title: '全流程服务',
      keepAlive: false
    }
  },
  {
    path: '/product_list_coupon',
    name: 'product_list_coupon',
    component: () => import('../views/product-list-coupon/product-list-coupon.vue'),
    meta: {
      title: '券可用商品列表',
      keepAlive: false,
    }
  },
  {
    path: '/full_process_card_list',
    name: 'full_process_card_list',
    component: () => import('../views/full-process-card-list/full-process-card-list.vue'),
    meta: {
      title: '全流程卡列表',
      keepAlive: true,
    }
  },
  {
    path: '/interest_card_list',
    name: 'interest_card_list',
    component: () => import('../views/interest-card-list/interest-card-list.vue'),
    meta: {
      title: '全流程卡权益列表',
      keepAlive: true,
    }
  },
]
