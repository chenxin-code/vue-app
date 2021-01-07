module.exports = [
  {
    path: '/selfMall/shopList',
    name: '店铺列表',
    component: () => import('@/components/selfMall/shop-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/selfMall/shopDetail',
    name: '店铺详情',
    component: () => import('@/components/selfMall/shop-detail'),
    meta: {
      keepAlive: false
    }
  },
  // {
  //   path: '/mall2/shop',
  //   name: '店铺',
  //   component: () => import('@/components/mall2/list/shop'),
  //   meta: {
  //     keepAlive: true
  //   }
  // }, 
]

