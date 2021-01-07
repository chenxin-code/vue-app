/**
 * Created by Dongmengjia on 2019/6/27.
 */
export default [
  {
    path: '/oil-group',
    name: '油点拼团',
    component: () => import('@/views/oil-group/index'),
    meta: {
      title: '油点拼团',
      keepAlive: false
    }
  },
  {
    path: '/my-oil-group',
    name: '我的拼团',
    component: () => import('@/views/oil-group/my-oil-group'),
    meta: {
      title: '我的拼团',
      keepAlive: false
    }
  },
  {
    path: '/oil-group-details',
    name: '油点拼团',
    component: () => import('@/views/oil-group/oil-group-details'),
    meta: {
      title: '油点拼团',
      keepAlive: false
    }
  },
  {
    path: '/oil-group-record',
    name: '加油记录',
    component: () => import('@/views/oil-group/oil-group-record'),
    meta: {
      title: '加油记录',
      keepAlive: false
    }
  },
  {
    path: '/oil-group-share',
    name: '油点拼团',
    component: () => import('@/views/oil-group/oil-group-share'),
    meta: {
      title: '油点拼团',
      keepAlive: false
    }
  }
]
