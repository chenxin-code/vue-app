export default [
  {
    path: '/my_wish_list',
    name: '心愿单',
    component: () => import('@/components/mall2/wish-list/my-wish-list.vue'),
    meta: {
      title: '心愿单',
      keepAlive: false
    }
  },
  {
    path: '/wish_share_page',
    name: '心愿单',
    component: () => import('@/components/mall2/wish-list/share-page.vue'),
    meta: {
      title: '心愿单',
      keepAlive: false
    }
  },
]
