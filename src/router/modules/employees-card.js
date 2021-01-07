/**
 * Created by Dongmengjia on 2019/6/27.
 */
export default [
  {
    path: '/employees-card',
    name: '我的员工卡',
    component: () => import('@/views/employees-card/employees-card'),
    meta: {
      title: '我的员工卡',
      keepAlive: false
    }
  },
  {
    path: '/bind-employees-card',
    name: '绑定员工卡',
    component: () => import('@/views/employees-card/bind-employees-card'),
    meta: {
      title: '绑定员工卡',
      keepAlive: false
    }
  },
  {
    path: '/employees-card-record',
    name: '历史记录',
    component: () => import('@/views/employees-card/employees-card-record'),
    meta: {
      title: '历史记录',
      keepAlive: false
    }
  },
  {
    path: '/employees-card-order-record',
    name: '订单记录',
    component: () => import('@/views/employees-card/employees-card-order-record'),
    meta: {
      title: '订单记录',
      keepAlive: false
    }
  },
  {
    path: '/employees-card-list',
    name: '员工卡列表',
    component: () => import('@/views/employees-card/employees-card-list'),
    meta: {
      title: '员工卡列表',
      keepAlive: false
    }
  }
]
