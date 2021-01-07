module.exports = [
  {
    path: '/dmp/index',
    name: 'dmptext',
    component: () => import('@/views/dmp/index.vue'),
    meta: {
      keepAlive: false,
      title:'数据统计'
    }
  }
]
