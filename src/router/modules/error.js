export default [{
    path: '/error',
    name: '请求失败',
    component: () =>
      import('@/components/error/error.vue'),
    meta: {
      title: '请求失败',
      keepAlive: false
    }
  }
]
