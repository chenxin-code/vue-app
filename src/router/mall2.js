module.exports = [
  {
    path: '/mall2test',
    name: '商城测试',
    component: () => import('@/components/mall2/mall2-test'),
    meta: {
      keepAlive: true
    },
  },
  {
    path: '/test',
    name: '商城测试',
    component: () => import('@/components/test')
  },
  {
    path: '/mall2/categories',
    name: '商品分类',
    component: () => import('@/components/mall2/categories/index'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/list/:id',
    name: '商品列表',
    component: () => import('@/components/mall2/list/list'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/collection',
    name: '我的收藏',
    component: () => import('@/components/mall2/list/collection/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/detail/:id',
    name: '商品详情',
    component: () => import('@/components/mall2/detail/new-detail-static'),
    // component: () => import('@/components/mall2/detail/detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/shareTextLink',
    name: '链接分享',
    component: () => import('@/components/mall2/shareTextLink'),
    // component: () => import('@/components/mall2/detail/detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/savePicture',
    name: '商品分享',
    component: () => import('@/components/mall2/savePicture'),
    // component: () => import('@/components/mall2/detail/detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/newdetail/:id',
    name: '商品详情',
    component: () => import('@/components/mall2/detail/new-detail'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/addresslist',
    name: '收货地址',
    component: () => import('@/components/mall2/address/address-list'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/addaddress',
    name: '新建收货人',
    component: () => import('@/components/mall2/address/add-address'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/modifyorderaddress',
    name: '编辑收货地址',
    component: () => import('@/components/mall2/address/modify-order-address'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/mypickupaddress',
    name: '我的自提点',
    component: () => import('@/components/mall2/address/my-pickup-address'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/selfliftingsite',
    name: '自提站点',
    component: () => import('@/components/mall2/address/self-lifting-site'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/ticketlist',
    name: '门票',
    component: () => import('@/components/mall2/ticket/ticket-list'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/couponlist',
    name: '优惠券',
    component: () => import('@/components/mall2/ticket/coupon-list'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/ticketdetail',
    name: '详情',
    component: () => import('@/components/mall2/ticket/ticket-detail'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/placeorder',
    name: '填写订单',
    component: () => import('@/components/mall2/placeorder/placeorder'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/fillorder',
    name: '立即下单',
    component: () => import('@/components/mall2/ticket/fill-order'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/orderlist',
    name: '订单列表',
    component: () => import('@/components/mall2/order/orderlist'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/newlyperson',
    name: '新增出行人',
    component: () => import('@/components/mall2/ticket/newly-person'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/orderdetail',
    name: '订单详情',
    component: () => import('@/components/mall2/order/orderdetail'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/expressinfo',
    name: 'expressinfo',
    component: () => import('@/components/mall2/order/expressinfo'),
    meta: {
      keepAlive: false,
      title: '物流详情'
    }
  }, {
    path: '/mall2/aliexpressinfo',
    name: '物流详情',
    component: () => import('@/components/mall2/order/ali-express-info'),
    meta: {
      keepAlive: false,
      title: '物流详情'
    }
  },
  {
    path: '/mall2/100expressinfo',
    name: 'aliexpressinfo',
    component: () => import('@/components/mall2/order/express-info-100'),
    meta: {
      keepAlive: false,
      title: '物流详情'
    }
  },
  {
    path: '/mall2/orderlogistics',
    name: '订单物流',
    component: () => import('@/components/mall2/order/orderlogistics'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/choosesertype',
    name: '选择售后类型',
    component: () => import('@/components/mall2/saleservice/choose-servicetype'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/returninggoods',
    name: '退货',
    component: () => import('@/components/mall2/saleservice/returning-goods'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/services',
    name: '售后服务',
    component: () => import('@/components/mall2/saleservice/services'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/submitsuccess',
    name: '提交成功',
    component: () => import('@/components/mall2/saleservice/submit-success'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/cart',
    name: '购物车',
    component: () => import('@/components/mall2/cart/cart'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/presalecart',
    name: '购物车',
    component: () => import('@/components/mall2/cart/presale-cart'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/detailservice',
    name: '查看详情',
    component: () => import('@/components/mall2/saleservice/detail-service'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/serviceindex',
    name: '我的售后',
    component: () => import('@/components/mall2/saleservice/index'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/virtualgoods',
    name: '申请退款',
    component: () => import('@/components/mall2/saleservice/virtual-goods'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/comment',
    name: '评价晒单',
    component: () => import('@/components/mall2/comment/write'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/comment2',
    name: '评价晒单',
    component: () => import('@/components/mall2/comment/write2'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/commentcenter',
    name: '评价中心',
    component: () => import('@/components/mall2/comment/index'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/commentdetail',
    name: '评价详情',
    component: () => import('@/components/mall2/comment/detail'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/checkstand',
    name: '收银台',
    component: () => import('@/components/mall2/checkstand/index'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/ylpay',
    name: '银联支付',
    component: () => import('@/components/mall2/checkstand/yl-pay'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/ylpayredirect',
    name: '银联支付跳转',
    component: () => import('@/components/mall2/checkstand/yl-pay-redirect'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/paysuccess',
    name: '订单支付结果',
    component: () => import('@/components/mall2/checkstand/pay-success'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/paycheck',
    name: '订单支付查询',
    component: () => import('@/components/mall2/checkstand/pay-check'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/checkout',
    name: ' 收银台 ',
    component: () => import('@/components/mall2/checkstand/check-out'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/mycoupon',
    name: '优惠券',
    component: () => import('@/components/mall2/coupon/my-coupon'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/seckilllist',
    // name: '秒杀商城',
    component: () => import('@/components/mall2/list/seckill-list/seckill-list'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/shop',
    name: '店铺',
    component: () => import('@/components/mall2/list/shop'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/integralinfo',
    name: '积分',
    component: () => import('@/components/mall2/integralinfo-details/integralinfo/integralinfo'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/integralinfo-pay',
    name: '积分支付',
    component: () => import('@/components/mall2/integralinfo-details/integralinfo/integralinfo-pay'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/win_record',
    name: '中奖纪录',
    component: () => import('@/components/mall2/game/win-record/win-record'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/headlines',
    name: '小石头条',
    component: () => import('@/components/mall2/news/headlines/headlines'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/headlinesdetails',
    name: '详情',
    component: () => import('@/components/mall2/news/headlinesdetails/headlinesdetails'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/membershipinterests',
    name: '会员权益',
    component: () => import('@/components/mall2/membershipinterests/membershipinterests'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/browsinglist',
    name: '浏览记录',
    component: () => import('@/components/mall2/list/browsing-list/browsing-list'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/ranking_list',
    name: '排行榜',
    component: () => import('@/components/mall2/ranking/ranking-list'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/recommen_list',
    name: '员工推荐排名',
    component: () => import('@/components/mall2/ranking/list'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/recommen_details',
    name: '我推荐的人',
    component: () => import('@/components/mall2/ranking/recommen-details'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/integralstrategy',
    name: '积分攻略',
    component: () => import('@/components/mall2/integralinfo-details/integralstrategy/integralstrategy'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/integralhistory',
    name: '积分历程',
    component: () => import('@/components/mall2/integralinfo-details/integralhistory/integralhistory'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/purchase',
    name: '采购列表',
    component: () => import('@/components/mall2/purchase/list'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/purchasedetail',
    name: ' 商品详情 ',
    component: () => import('@/components/mall2/purchase/detail'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/purchaseplace',
    name: ' 填写订单 ',
    component: () => import('@/components/mall2/purchase/place-order'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/submitFinished',
    name: ' 提交完成 ',
    component: () => import('@/components/mall2/purchase/submit-finished'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/purchaseorderlist',
    name: '大宗采购订单',
    component: () => import('@/components/mall2/purchase/order-list'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/purchaseorderdetail',
    name: ' 订单详情 ',
    component: () => import('@/components/mall2/purchase/order-detail'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/scanbuyindex',
    name: '扫码购物',
    component: () => import('@/components/mall2/scan-buy/index'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/scanbuyproduct',
    name: '扫码购物商品',
    component: () => import('@/components/mall2/scan-buy/product'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/scanbuyplaceorder',
    name: '购物袋',
    component: () => import('@/components/mall2/scan-buy/place-order'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/scanbuypaysuccess',
    name: '支付成功',
    component: () => import('@/components/mall2/scan-buy/pay-success'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/scanbuywxlist',
    name: '购物袋',
    component: () => import('@/components/mall2/scan-buy/wx-prolist'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/electronic-wallet',
    name: '电子钱包',
    component: () => import('@/views/electronic-wallet/electronic-wallet'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/bill',
    name: '账单',
    component: () => import('@/views/electronic-wallet/bill/bill'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/bill-details',
    name: '账单明细',
    component: () => import('@/views/electronic-wallet/bill/bill-details'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/wallet-recharge',
    name: '充值',
    component: () => import('@/views/electronic-wallet/wallet-recharge/wallet-recharge'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/pay-success',
    name: '支付成功',
    component: () => import('@/views/electronic-wallet/pay-success'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/refund-application',
    name: '退款申请',
    component: () => import('@/views/electronic-wallet/refund-application/refund-application'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/application-history',
    name: '申请历史',
    component: () => import('@/views/electronic-wallet/refund-application/application-history'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/application-result',
    name: '退款申请',
    component: () => import('@/views/electronic-wallet/refund-application/application-result'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/problems',
    name: '退款申请',
    component: () => import('@/views/electronic-wallet/problems'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/externalorderlist',
    name: '订单列表',
    component: () => import('@/components/mall2/order-external/orderlist'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/hobby',
    name: '修改偏好',
    component: () => import('@/components/mall2/hobby/hobby'),
    meta: {
      keepAlive: true
    }
  },{
    path: '/mall2/externalorderdetail',
    name: '订单详情',
    component: () => import('@/components/mall2/order-external/orderdetail'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/expire-integralinfo',
    name: '过期积分',
    component: () => import('@/components/mall2/integralinfo-details/expire-integralinfo/expire-integralinfo'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/scan-get-coupon',
    name: '扫码领券',
    component: () => import('@/components/mall2/coupon/scan-get-coupon/index'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/scan-get-coupon-history',
    name: '历史活动',
    component: () => import('@/components/mall2/coupon/scan-get-coupon/history'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/scan-get-coupon-details',
    name: '活动详情',
    component: () => import('@/components/mall2/coupon/scan-get-coupon/details'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/store-delivery/address-list',
    name: '收货地址',
    component: () => import('@/components/mall2/store-delivery/address-list'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/store-delivery/address-edit',
    name: '编辑地址',
    component: () => import('@/components/mall2/store-delivery/address-edit'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/store-delivery/address-map',
    name: '定位',
    component: () => import('@/components/mall2/store-delivery/address-map'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/store-delivery/list',
    name: '门店配送',
    component: () => import('@/components/mall2/store-delivery/list'),
    meta: {
      keepAlive: true
    }
  }, {
    path: '/mall2/store-delivery/detail',
    name: '门店商品详情',
    component: () => import('@/components/mall2/store-delivery/detail'),
    meta: {
      keepAlive: false
    }
  }, {
    path: '/mall2/store-delivery/placeorder',
    name: 'storedeliveryplaceorder',
    component: () => import('@/components/mall2/store-delivery/placeorder'),
    meta: {
      keepAlive: true,
      title: '填写订单'
    }
  },
  {
    path: '/mall2/store-delivery/ordergrabbinglist',
    name: 'storedeliveryordergrabbinglist',
    component: () => import('@/components/mall2/store-delivery/order-grabbing-list'),
    meta: {
      keepAlive: true,
      title: '门店配送订单'
    }
  },
  {
    path: '/mall2/store-delivery/ordergrabbingdetail',
    name: 'storedeliveryordergrabbingdetail',
    component: () => import('@/components/mall2/store-delivery/order-grabbing-detail'),
    meta: {
      keepAlive: false,
      title: '订单取货码'
    }
  },
  {
    path: '/mall2/store-delivery/routemap',
    name: 'storedeliveryroutemap',
    component: () => import('@/components/mall2/store-delivery/route-map'),
    meta: {
      keepAlive: false,
      title: '线路'
    }
  },
  {
    path: '/mall2/city-delivery/list',
    name: '同城配送',
    component: () => import('@/components/mall2/city-delivery/list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/city-delivery/shoplist',
    name: '同城配送店铺',
    component: () => import('@/components/mall2/city-delivery/shoplist'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/city-delivery/detail',
    name: '同城配送商品详情',
    component: () => import('@/components/mall2/city-delivery/detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/city-delivery/placeorder',
    name: 'citydeliveryplaceorder',
    component: () => import('@/components/mall2/city-delivery/placeorder'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/mall2/axjflist',
    name: 'axjflist',
    component: () => import('@/components/mall2/axjf/list'),
    meta: {
      keepAlive: false,
      title: '爱心商城'
    }
  }, {
    path: '/mall2/axjf/pointsdetail',
    name: 'axjfpointsdetail',
    component: () => import('@/components/mall2/axjf/points-detail'),
    meta: {
      keepAlive: false,
      title: '爱心积分'
    }
  },
  {
    path: '/mall2/five_enter',
    name: '五进活动首页',
    component: () => import('@/views/five-enter/index'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mall2/five_order',
    name: '五进活动提交订单',
    component: () => import('@/views/five-enter/five-order'),
    meta: {
      keepAlive: true
    }
  },
  // 5进活动订单详情
  {
    path: '/mall2/fiveenterdetail',
    name: '订单详情',
    component: () => import('@/views/five-enter/five-enter-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mall2/couponexchange',
    name: 'couponexchange',
    component: () => import('@/components/mall2/coupon/exchange'),
    meta: {
      title: '优惠券',
      keepAlive: false
    }
  },
  {
    path: '/mall2/couponexchangedetail',
    name: 'couponexchangedetail',
    component: () => import('@/components/mall2/coupon/exchange-detail'),
    meta: {
      title: '兑换详情',
      keepAlive: false
    }
  },
  {
    path: '/mall2/couponexchangelist',
    name: 'couponexchangelist',
    component: () => import('@/components/mall2/coupon/exchange-list'),
    meta: {
      title: '兑换记录',
      keepAlive: false
    }
  }
]

