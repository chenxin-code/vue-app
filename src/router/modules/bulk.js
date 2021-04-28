//create by hjc 团购模块

export default [{
    path: '/purchase',
    name: '团购首页',
    component: () =>
      import('@/components/bulk/purchase/index.vue'),
    meta: {
      title: '团购首页',
      keepAlive: false
    }
  }, {
    path: '/paySuccess',
    name: '支付成功',
    component: () =>
      import('@/components/bulk/paySuccess/index.vue'),
    meta: {
      title: '支付成功',
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
      keepAlive: false,
    }
  },

  {
    path: '/bulk_order_detail',
    name: '订单详情',
    component: () => import('@/components/bulk/orderList/orderDetail/index.vue'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },

  {
    path: '/bulk_after_sales_select_goods',
    name: '售后申请选择商品',
    component: () => import('@/components/bulk/afterSales/afterSalesSelectGoods/index.vue'),
    meta: {
      title: '售后申请选择商品',
      keepAlive: false
    }
  },
  {
    path: '/bulk_after_sales_edit',
    name: '售后申请编辑',
    component: () => import('@/components/bulk/afterSales/afterSalesEdit/index.vue'),
    meta: {
      title: '售后申请编辑',
      keepAlive: false
    }
  },
  {
    path: '/bulk_after_sales_detail',
    name: '售后申请详情',
    component: () => import('@/components/bulk/afterSales/afterSalesDetail/index.vue'),
    meta: {
      title: '售后申请详情',
      keepAlive: false
    }
  },
  {
    path: '/tips',
    name: '提示页面',
    component: () => import('@/components/bulk/tips/index.vue'),
    meta: {
      title: '提示页面',
      keepAlive: false
    }
  },
  {
    path: '/downLoad',
    name: '下载',
    component: () => import('@/components/bulk/downLoad/index.vue'),
    meta: {
      title: '下载',
      keepAlive: false
    }
  },
  {
    path: '/bulk_goods_deatil',
    name: '商品详情',
    component: () => import('@/components/bulk/goods_detail/index.vue'),
    meta: {
      title: '商品详情',
      keepAlive: false
    }
  },
  {
    path: '/confirmOrder',
    name: '确认订单',
    component: () => import('@/components/bulk/confirmOrder'),
    meta: {
      title: '确认订单',
      keepAlive: true
    }
  },
  {
    path: '/orderInfo',
    name: '',
    component: () => import('@/components/bulk/orderInfo'),
    meta: {
      title: '社区团购确认订单',
      keepAlive: false
    }
  },
  {
    path: '/selectAddress',
    name: '选择收货地址',
    component: () => import('@/components/bulk/selectAddress'),
    meta: {
      title: '选择收货地址',
      keepAlive: false
    }
  },
  {
    path: '/groupOrder',
    name: '本团订单',
    component: () => import('@/components/bulk/activity/groupOrder.vue'),
    meta: {
      title: '本团订单',
      keepAlive: false
    }
  },

  {
    path: '/bulk',
    name: '首页',
    component: () => import('@/components/bulk/index.vue'),
    meta: {
      title: '首页',
      keepAlive: false
    },
    redirect: "/bulk_index",
    children: [{
        path: '/bulk_index',
        name: '活动首页',
        component: () =>
          import('@/components/bulk/activity/index.vue'),
        meta: {
          title: '活动首页',
          keepAlive: true
        }

      }, {
        path: '/bulkDetails',
        name: '活动详情',
        component: () =>
          import('@/components/bulk/activity/details.vue'),
        meta: {
          title: '活动详情',
          keepAlive: false
        }
      }, {
        path: '/bulk_order_list',
        name: '订单列表',
        component: () => import('@/components/bulk/orderList/index.vue'),
        meta: {
          title: '订单列表',
          keepAlive: true
        }
      },
      {
        path: '/bulk_after_sales',
        name: '售后申请列表',
        component: () => import('@/components/bulk/afterSales/index.vue'),
        meta: {
          title: '售后申请列表',
          keepAlive: false
        }
      },
      {
        path: '/myprofit',
        name: '我的收益',
        component: () =>
          import('@/components/bulk/myprofit/index.vue'),
        meta: {
          title: '我的收益',
          keepAlive: false
        }
      },
    ]
  },

]
