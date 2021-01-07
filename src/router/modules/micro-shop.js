export default [
  {
    path: '/micro_sho/add_merchandise',
    name: '选货市场',
    component: () => import('@/views/micro-shop/add-merchandise'),
    meta: {
      title: '选货市场',
      keepAlive: true
    }
  },
  // {
  //   path: '/micro_sho/merchant',
  //   name: '分销市场',
  //   component: () => import('@/views/micro-shop/add-merchandise/common/merchant.vue'),
  //   meta: {
  //     title: '分销市场',
  //     keepAlive: false
  //   }
  // },
  {
    path: '/micro_sho/detail/:id',
    name: '商品详情',
    component: () => import('@/views/micro-shop/add-merchandise/common/detail.vue'),
    meta: {
      title: '商品详情',
      keepAlive: true
    }
  },
  {
    path: '/micro_sho/purchasedetail/:id', // 团购
    name: '商品详情',
    component: () => import('@/views/micro-shop/add-merchandise/common/purchasedetail.vue'),
    meta: {
      title: '商品详情',
      keepAlive: true
    }
  },

  {
    path: '/micro_sho/ticket_detail', // 日期型
    name: '商品详情',
    component: () => import('@/views/micro-shop/add-merchandise/common/ticket-detail.vue'),
    meta: {
      title: '商品详情',
      keepAlive: true
    }
  },
  {
    path: '/micro_sho/shareDetail/:id',
    name: '分享商品详情',
    component: () => import('@/views/micro-shop/common/shareDetail.vue'),
    meta: {
      title: '分享商品详情',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/shareTicketDetail', // 日期型
    name: '分享商品详情',
    component: () => import('@/views/micro-shop/common/shareTicketDetail.vue'),
    meta: {
      title: '分享商品详情',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/commodity_management',
    name: '商品管理',
    component: () => import('@/views/micro-shop/commodity-management'),
    meta: {
      title: '商品管理',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/order_management',
    name: '订单管理',
    component: () => import('@/views/micro-shop/order-management'),
    meta: {
      title: '订单管理',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/openIndex',
    name: 'micro_sho/openIndex',
    component: () => import('@/views/micro-shop/open-microshop/openIndex'),
    meta: {
      title: '开通微店',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/microshop_register',
    name: '微店',
    component: () => import('@/views/micro-shop/open-microshop/microshop-register'),
    meta: {
      title: '微店',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/myshopIndex',
    name: 'micro_sho/myshopIndex',
    component: () => import('@/views/micro-shop/open-microshop/myshopIndex'),
    meta: {
      title: '我的微店首页',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/profit',
    name: 'micro_sho/profit',
    component: () => import('@/views/micro-shop/open-microshop/Profit'),
    meta: {
      title: '微店收益',
      keepAlive: false
    }
    },
    {
      path: '/micro_sho/profitlist',
    name: 'micro_sho/profitlist',
    component: () => import('@/views/micro-shop/open-microshop/ProfitList'),
    meta: {
      title: '年度收益排名',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/microshopqrcode',
    name: 'micro_sho/microshopqrcode',
    component: () => import('@/views/micro-shop/open-microshop/microshopQrcode'),
    meta: {
      title: '我的微店',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/cash_shop',
    name: 'micro_sho/cash_shop',
    component: () => import('@/views/micro-shop/open-microshop/cash-shop'),
    meta: {
      title: '现金收益',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/agreement',
    name: 'micro_sho/agreement',
    component: () => import('@/views/micro-shop/open-microshop/agreement'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/renovation',
    name: 'micro_sho/renovation',
    component: () => import('@/views/micro-shop/open-microshop/renovation'),
    meta: {
      title: '店铺装修',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/modifyintroduction',
    name: 'micro_sho/modifyintroduction',
    component: () => import('@/views/micro-shop/open-microshop/modifyIntroduction'),
    meta: {
      title: '修改店铺简介',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/modifyname',
    name: 'micro_sho/modifyname',
    component: () => import('@/views/micro-shop/open-microshop/modifyName'),
    meta: {
      title: '修改店铺名称',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/bank',
    name: 'micro_sho/bank',
    component: () => import('@/views/micro-shop/open-microshop/bank'),
    meta: {
      title: '银行卡号',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/preview',
    name: 'micro_sho/preview',
    component: () => import('@/views/micro-shop/open-microshop/shop-preview'),
    meta: {
      title: '店铺预览',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/groupbuying', // 团购
    name: '逛微店',
    component: () => import('@/views/micro-shop/shop-around/groupbuying.vue'),
    meta: {
      title: '团购商品',
      keepAlive: true
    }
  },
  {
    path: '/micro_sho/sharebuyingDetail/:id', // 团购分享商品详情
    name: '分享商品详情',
    component: () => import('@/views/micro-shop/common/sharebuyingDetail.vue'),
    meta: {
      title: '分享商品详情',
      keepAlive: true
    }
  },
  // {
  //   path: '/micro_sho/purchaseplace', // 下订单
  //   name: 'micro_sho_purchaseplace',
  //   component: () => import('@/views/micro-shop/common/place-order.vue'),
  //   meta: {
  //     title: '企业团购下订单',
  //     keepAlive: true
  //   }
  // },
  {
    path: '/micro_sho/purchaseplace', // 下订单
    name: '企业团购下订单',
    component: () => import('@/views/micro-shop/common/newPlace-order.vue'),
    meta: {
      title: '企业团购下订单',
      keepAlive: true
    }
  },
  {
    path: '/micro_sho/uploadproof', // 上传支付凭证
    name: '上传支付凭证',
    component: () => import('@/components/mall2/purchase/base/uploadProof.vue'),
    meta: {
      title: '上传支付凭证',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/shop_around',
    name: '逛微店',
    component: () => import('@/views/micro-shop/shop-around'),
    meta: {
      title: '逛微店',
      keepAlive: true
    }
  },
  {
    path: '/micro_sho/shop_around1',
    name: '逛微店',
    component: () => import('@/views/micro-shop/shop-around/index1.vue'),
    meta: {
      title: '逛微店',
      keepAlive: true
    }
  },
  {
    path: '/micro_sho/best_sellers_list',
    name: '热推商品',
    component: () => import('@/views/micro-shop/shop-around/common/list.vue'),
    meta: {
      title: '热推商品',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/cart',
    name: '购物车',
    component: () => import('@/views/micro-shop/common/cart/cart.vue'),
    meta: {
      title: '购物车',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/buyingCart', // 企业
    name: '购物车',
    component: () => import('@/views/micro-shop/common/buyingCart/cart.vue'),
    meta: {
      title: '购物车',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/microshop_list',
    name: '微店列表',
    component: () => import('@/views/micro-shop/microShop-list/index.vue'),
    meta: {
      title: '微店列表',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/authentication',
    name: '微店信息绑定',
    component: () => import('@/views/micro-shop/authentication/index.vue'),
    meta: {
      title: '微店信息绑定',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/commodity_query',
    name: '微店商品查询',
    component: () => import('@/views/micro-shop/commodity-query/index.vue'),
    meta: {
      title: '微店商品查询',
      keepAlive: false
    }
  },
  {
    path: '/micro_sho/search_store_name',
    name: '查询店铺',
    component: () => import('@/views/micro-shop/microShop-list/searchStoreName.vue'),
    meta: {
      title: '查询店铺',
      keepAlive: false
    }
  }
]
