/**
 * Created by steven on 2018/8/22.
 */
module.exports = [
  //login商城路径begin
  // {
  //   path: '/xzinvoicetaitou',
  //   name: '新增发票抬头',
  //   component: () => import('@/components/invoice/xzinvoicetaitou'),
  //   meta: {
  //     keepAlive: false
  //   },
  // }, {
  //   path: '/invoicetaitou',
  //   name: '发票抬头',
  //   component: () => import('@/components/invoice/invoicetaitou'),
  //   meta: {
  //     keepAlive: false
  //   },
  // }, {
  //   path: '/preview',
  //   name: '预览',
  //   component: () => import('@/components/invoice/preview'),
  //   meta: {
  //     keepAlive: false
  //   },
  // }, {
  //   path: '/dzinvoice',
  //   name: '电子发票明细',
  //   component: () => import('@/components/invoice/dzinvoice'),
  //   meta: {
  //     keepAlive: false
  //   },
  // }, {
  //   path: '/invoicettxq',
  //   name: '发票抬头详情',
  //   component: () => import('@/components/invoice/invoicettxq'),
  //   meta: {
  //     keepAlive: false
  //   },
  // },
  {
    path: '/assistantindex',
    name: '发票助手',
    component: () => import('@/components/product/invoice/assistantIndex'),
    meta: {
      title: '发票助手',
      keepAlive: false
    }
  },
  {
    path: '/assistantindex_detail',
    name: '详情',
    component: () => import('@/components/product/invoice/assistantindexDetail'),
    meta: {
      title: '发票助手详情',
      keepAlive: false
    }
  },
  {
    path: '/stay',
    name: 'stay',
    component: () => import('@/components/product/invoice/stay'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/stayDetail',
    name: 'stayDetail',
    component: () => import('@/components/product/invoice/stayDetail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/Invoiced',
    name: 'Invoiced',
    component: () => import('@/components/product/invoice/Invoiced'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/taitou',
    name: 'taitou',
    component: () => import('@/components/product/invoice/taitou'),
    meta: {
      title: '编辑抬头',
      keepAlive: false
    }
  },
  {
    path: '/taitouList',
    name: '抬头列表',
    component: () => import('@/components/product/invoice/taitouList'),
    meta: {
      title: '查看抬头列表',
      keepAlive: false
    }
  },
  {
    path: '/historyInvoice',
    name: '历史发票',
    component: () => import('@/components/product/invoice/historyInvoice'),
    meta: {
      title: '历史发票',
      keepAlive: false
    }
  },
  {
    path: '/historyDetail',
    name: '历史发票',
    component: () => import('@/components/product/invoice/historyDetail'),
    meta: {
      title: '历史发票详情',
      keepAlive: true
    }
  },
  {
    path: '/modifyEmail',
    name: '修改邮箱',
    component: () => import('@/components/product/invoice/modifyEmail'),
    meta: {
      title: '修改接收邮箱',
      keepAlive: false
    }
  },
  {
    path: '/historyorderList',
    name: '历史订单列表',
    component: () => import('@/components/product/invoice/historyorderList'),
    meta: {
      title: '历史订单列表',
      keepAlive: true
    }
  },
  {
    path: '/historyorderListDetail',
    name: '历史订单列表详情',
    component: () => import('@/components/product/invoice/historyorderListDetail'),
    meta: {
      title: '历史订单列表详情',
      keepAlive: false
    }
  },
  {
    path: '/orderList',
    name: '订单列表',
    component: () => import('@/components/product/invoice/orderList'),
    meta: {
      title: '订单列表',
      keepAlive: true
    }
  },
  {
    path: '/orderListDetail',
    name: '订单列表详情',
    component: () => import('@/components/product/invoice/orderListDetail'),
    meta: {
      title: '订单列表详情',
      keepAlive: false
    }
  },
  {
    path: '/invoiceSelfIndex',
    name: '自助开票',
    component: () => import('@/components/product/invoice/invoiceSelfIndex'),
    meta: {
      title: '自助开票',
      keepAlive: false
    }
  },
  {
    path: '/appOrder',
    name: 'APP加油订单',
    component: () => import('@/components/product/invoice/appOrder'),
    meta: {
      title: 'APP加油订单',
      keepAlive: false
    }
  },
  {
    path: '/iframeView',
    name: '下载发票',
    component: () => import('@/components/product/invoice/iframeView'),
    meta: {
      title: '下载发票',
      keepAlive: false
    }
  },
  {
    path: '/goldOrder',
    name: '加油金订单',
    component: () => import('@/components/product/invoice/goldOrder'),
    meta: {
      title: 'APP加油订单',
      keepAlive: false
    }
  },
  {
    path: '/walletOrder',
    name: '石化钱包加油订单',
    component: () => import('@/components/product/invoice/walletOrder'),
    meta: {
      title: '石化钱包加油订单',
      keepAlive: false
    }
  },
  {
    path: '/mallOrder',
    name: '商品订单',
    component: () => import('@/components/product/invoice/mallOrder'),
    meta: {
      title: '商品订单',
      keepAlive: false
    }
  },
  {
    path: '/storeOrder',
    name: '便利店订单',
    component: () => import('@/components/product/invoice/storeOrder'),
    meta: {
      title: '便利店订单',
      keepAlive: false
    }
  },
  {
    path: '/cardOrder',
    name: '加油卡订单',
    component: () => import('@/components/product/invoice/cardOrder'),
    meta: {
      title: '加油卡订单',
      keepAlive: false
    }
  },
  {
    path: '/openinvoiceDetail',
    name: '自助开票',
    component: () => import('@/components/product/invoice/openinvoiceDetail'),
    meta: {
      title: '下一步订单自助开票',
      keepAlive: true
    }
  },
  {
    path: '/openInvoice',
    name: '已开发票列表',
    component: () => import('@/components/product/invoice/openInvoice'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/invoicing',
    name: 'invoicing',
    component: () => import('@/components/product/invoice/invoicing'),
    meta: {
      title: '扫码开票',
      keepAlive: false
    }
  },
  {
    path: '/invalid',
    name: 'invalid',
    component: () => import('@/components/product/invoice/invalid'),
    meta: {
      title: '扫码状态',
      keepAlive: false
    }
  },
  {
    path: '/open-invoice',
    name: 'open-invoice',
    component: () => import('@/components/product/invoice/open-invoice'),
    meta: {
      keepAlive: false
    }
  },
  {
    path:"/open_invoice_history", //开票历史-天津用
    component: () => import('@/components/product/invoice/open-invoice-history'),
    meta: {
      keepAlive: false
    }
  }
]

