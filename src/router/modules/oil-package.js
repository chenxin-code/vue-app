/**
 * Created by Dongmengjia on 2019/6/27.
 */
export default [
  {
    path: '/oil-package',
    name: '油滴套餐',
    component: () => import('@/views/oil-package/index'),
    meta: {
      title: '油滴套餐',
      keepAlive: false
    }
  },
  {
    path: '/package-change',
    name: '套餐选择',
    component: () => import('@/views/oil-package/package-change'),
    meta: {
      title: '套餐选择',
      keepAlive: false
    }
  },
  {
    path: '/open-package',
    name: '开通套餐',
    component: () => import('@/views/oil-package/open-package'),
    meta: {
      title: '开通套餐',
      keepAlive: false
    }
  },
  {
    path: '/my-invitation',
    name: '我的邀约',
    component: () => import('@/views/oil-package/my-invitation'),
    meta: {
      title: '我的邀约',
      keepAlive: false
    }
  },
  {
    path: '/invitation-details',
    name: '邀约详情',
    component: () => import('@/views/oil-package/invitation-details'),
    meta: {
      title: '邀约详情',
      keepAlive: false
    }
  },
  {
    path: '/instructions',
    name: '套餐说明',
    component: () => import('@/views/oil-package/instructions'),
    meta: {
      title: '套餐说明',
      keepAlive: false
    }
  },
  {
    path: '/history-invitation',
    name: '历史签约',
    component: () => import('@/views/oil-package/history-invitation'),
    meta: {
      title: '历史签约',
      keepAlive: false
    }
  },
  {
    path: '/history-details',
    name: '签约详情',
    component: () => import('@/views/oil-package/history-details'),
    meta: {
      title: '签约详情',
      keepAlive: false
    }
  },
  {
    path: '/oil-record',
    name: '加油记录',
    component: () => import('@/views/oil-package/oil-record'),
    meta: {
      title: '加油记录',
      keepAlive: false
    }
  },
  {
    path: '/success',
    name: '开通成功',
    component: () => import('@/views/oil-package/success'),
    meta: {
      title: '开通成功',
      keepAlive: false
    }
  }
]
