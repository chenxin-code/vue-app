export default [
  {
    path: '/carefree_trave/index',
    name: 'carefree_trave/index',
    component: () => import('@/views/carefree-trave/index'),
    meta: {
      title: '逍遥游',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/detail',
    name: 'carefree_trave/detail',
    component: () => import('@/views/carefree-trave/detail'),
    meta: {
      title: '产品详情',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/calendar',
    name: 'carefree_trave/calendar',
    component: () => import('@/views/carefree-trave/calendar'),
    meta: {
      title: '日期选择',
      keepAlive: true
    }
  },
  {
    path: '/carefree_trave/writingOrder',
    name: 'carefree_trave/writingOrder',
    component: () => import('@/views/carefree-trave/writingOrder'),
    meta: {
      title: '订单填写',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/editPeople',
    name: 'carefree_trave/editPeople',
    component: () => import('@/views/carefree-trave/editPeople'),
    meta: {
      title: '编辑出行人',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/myOrder',
    name: 'carefree_trave/myOrder',
    component: () => import('@/views/carefree-trave/myOrder'),
    meta: {
      title: '我的订单',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/sendgoodsDetail',
    name: 'carefree_trave/sendgoodsDetail',
    component: () => import('@/views/carefree-trave/sendgoodsDetail'),
    meta: {
      title: '已完成详情',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/refundRecord',
    name: 'carefree_trave/refundRecord',
    component: () => import('@/views/carefree-trave/refundRecord'),
    meta: {
      title: '退票记录',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/tobePaidDetail',
    name: 'carefree_trave/tobePaidDetail',
    component: () => import('@/views/carefree-trave/tobePaidDetail'),
    meta: {
      title: '待付款详情',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/travellingPeople',
    name: 'carefree_trave/travellingPeople',
    component: () => import('@/views/carefree-trave/travellingPeople'),
    meta: {
      title: '查看全部出行人',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/afterSale',
    name: 'carefree_trave/afterSale',
    component: () => import('@/views/carefree-trave/afterSale'),
    meta: {
      title: '售后',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/applyDetail',
    name: 'carefree_trave/applyDetail',
    component: () => import('@/views/carefree-trave/applyDetail'),
    meta: {
      title: '售后-待申请详情',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/handle',
    name: 'carefree_trave/handle',
    component: () => import('@/views/carefree-trave/handle'),
    meta: {
      title: '售后-处理中详情',
      keepAlive: false
    }
  },
  {
    path: '/carefree_trave/complate',
    name: 'carefree_trave/complate',
    component: () => import('@/views/carefree-trave/complate'),
    meta: {
      title: '售后-已完成详情',
      keepAlive: false
    }
  },
  {
    path: '/authentication/index',
    name: 'authentication/index',
    component: () => import('@/views/authentication/index'),
    meta: {
      title: '团购认证',
      keepAlive: false
    }
  }
]
