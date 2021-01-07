export default [
  {
    path: '/brand_list',
    name: 'brand_list',
    component: () => import('@/views/brand-manage/brand-list.vue'),
    meta: {
      title: '品牌馆',
      keepAlive: false
    }
  },
  {
    path: '/brand_prod_list',
    name: 'brand_prod_list',
    component: () => import('@/views/brand-manage/brand-prod-list.vue'),
    meta: {
      title: '品牌馆-商品列表',
      keepAlive: true
    }
  },
  {
    path: '/brand_hot_list',
    name: 'brand_hot_list',
    component: () => import('@/views/brand-manage/brand-hot-list.vue'),
    meta: {
      title: '热门品牌列表',
      keepAlive: false
    }
  },
]