export default [
  {
    path: '/insurance/subscribe',
    name: '预约报价',
    component: () => import('@/views/bihu-insurance/subscribe/subscribe'),
    meta: {
      title: '预约报价',
      keepAlive: false
    }
  },
  {
    path: '/insurance/success',
    name: '预约报价',
    component: () => import('@/views/bihu-insurance/subscribe/success'),
    meta: {
      title: '预约报价',
      keepAlive: false
    }
  }
]
