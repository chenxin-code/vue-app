/**
 * Created by LiRui on 2019/6/4.
 */
export default [
  {
    path: '/share-gift/share',
    name: '分享有礼',
    component: () => import('@/views/share-gift/share'),
    meta: {
      title: '分享有礼',
      keepAlive: false
    }
  },
  {
    path: '/share-gift/share-list',
    name: '分享有礼',
    component: () => import('@/views/share-gift/share-list'),
    meta: {
      title: '分享有礼',
      keepAlive: false
    }
  },
  {
    path: '/share-help',
    name: '分享助力',
    component: () => import('@/views/share-help/share-help'),
    meta: {
      title: '分享助力',
      keepAlive: false
    }
  }
]
