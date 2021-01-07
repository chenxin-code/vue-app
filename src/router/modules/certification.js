export default [
  // 首页
  {
    path: '/certification',
    name: 'certification',
    component: () => import('@/views/real-name-authentication/certification'),
    meta: {
      title: '认证',
      keepAlive: false
    }
  },
  {
    path: '/audit-results',
    name: 'audit-results',
    component: () => import('@/views/real-name-authentication/audit-results'),
    meta: {
      title: '审核结果',
      keepAlive: false
    }
  },
  {
    path: '/real-name-authentication',
    name: 'real-name-authentication',
    component: () => import('@/views/real-name-authentication/real-name-authentication/real-name-authentication'),
    meta: {
      title: '实名认证',
      keepAlive: false
    }
  },
  {
    path: '/driving-certification',
    name: 'driving-certification',
    component: () => import('@/views/real-name-authentication/driving-certification/driving-certification'),
    meta: {
      title: '驾驶认证',
      keepAlive: false
    }
  },
  {
    path: '/vehicle-certification',
    name: 'vehicle-certification',
    component: () => import('@/views/real-name-authentication/vehicle-certification/vehicle-certification'),
    meta: {
      title: '车辆认证',
      keepAlive: false
    }
  },
  {
    path: '/bind-car',
    name: 'bind-car',
    component: () => import('@/views/real-name-authentication/vehicle-certification/bind-car'),
    meta: {
      title: '添加车辆',
      keepAlive: false
    }
  },
  {
    path: '/vehicle-authentication',
    name: 'vehicle-authentication',
    component: () => import('@/views/real-name-authentication/vehicle-certification/vehicle-authentication'),
    meta: {
      title: '行驶认证',
      keepAlive: false
    }
  },
  {
    path: '/etc/apply-etc',
    component: () => import('@/views/etc/apply-etc'),
    meta: {
      title: 'ETC申请',
      keepAlive: false
    }
  },
]
