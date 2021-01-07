/**
 * Created by Dongmengjia on 2019/6/27.
 */
export default [
  {
    path: '/my-ebay',
    name: '我的易贝',
    component: () => import('@/views/ebay/my-ebay'),
    meta: {
      title: '我的易贝',
      keepAlive: false
    }
  },
  {
    path: '/my-oil-bay',
    name: '我的油贝',
    component: () => import('@/views/ebay/my-oil-bay'),
    meta: {
      title: '我的油贝',
      keepAlive: false
    }
  },
  {
    path: '/help-instructions',
    name: '帮助说明',
    component: () => import('@/views/ebay/help-instructions'),
    meta: {
      title: '帮助说明',
      keepAlive: false
    }
  },
  {
    path: '/oil-point-history',
    name: '油点',
    component: () => import('@/views/ebay/oil-point-history'),
    meta: {
      title: '油点',
      keepAlive: false
    }
  },
  {
    path: '/diesel-rebate',
    name: '加油返利红包',
    component: () => import('@/views/ebay/oil-point-history'),
    meta: {
      title: '柴油豆',
      keepAlive: false
    }
  }
]
