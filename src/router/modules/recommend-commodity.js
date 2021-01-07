export default [
  {
    path: '/recommend-commodity/home',
    name: '推荐管理',
    component: () => import('@/views/recommend-commodity/index.vue'),
    meta: {
      title: '推荐管理',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/commodityType',
    name: '商品类型',
    component: () => import('@/views/recommend-commodity/common/commodityType.vue'),
    meta: {
      title: '商品类型',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/categories',
    name: '商品分类',
    component: () => import('@/views/recommend-commodity/common/categories.vue'),
    meta: {
      title: '商品分类',
      keepAlive: true
    }
  },
  {
    path: '/recommend-commodity/skuList',
    name: '商品列表',
    component: () => import('@/views/recommend-commodity/common/skuList.vue'),
    meta: {
      title: '商品列表',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/newRecommendation',
    name: '新建推荐',
    component: () => import('@/views/recommend-commodity/common/newRecommendation.vue'),
    meta: {
      title: '新建推荐',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/recommendationDetails',
    name: '推荐详情',
    component: () => import('@/views/recommend-commodity/common/recommendationDetails.vue'),
    meta: {
      title: '推荐详情',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/qrcode',
    name: '推荐码',
    component: () => import('@/views/recommend-commodity/common/qrcode.vue'),
    meta: {
      title: '推荐码',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/detail',
    name: '商品详情',
    component: () => import('@/views/recommend-commodity/common/detail.vue'),
    meta: {
      title: '商品详情',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/recomendlist',
    name: 'recomendlist',
    component: () => import('@/views/recommend-commodity/common/recommend-list.vue'),
    meta: {
      title: '员工推荐',
      keepAlive: true
    }
  },
  {
    path: '/recommend-commodity/recommended-order',
    name: '推荐订单',
    component: () => import('@/views/recommend-commodity/recommended-order.vue'),
    meta: {
      title: '推荐订单',
      keepAlive: true
    }
  },
  {
    path: '/recommend-commodity/recommended-order-detail',
    name: '订单详情',
    component: () => import('@/views/recommend-commodity/recommended-order-detail.vue'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/sort_list',
    name: '推荐排序调整',
    component: () => import('@/views/recommend-commodity/common/sort-list.vue'),
    meta: {
      title: '推荐排序调整',
      keepAlive: false
    }
  },
  {
    path: '/recommend-commodity/recommended-detail',
    name: '推荐明细',
    component: () => import('@/views/recommend-commodity/recommended-detail.vue'),
    meta: {
      title: '推荐明细',
      keepAlive: false
    }
  }
]
