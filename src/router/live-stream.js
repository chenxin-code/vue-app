/**
 * Created by steven on 2018/8/22.
 */
module.exports = [
  {
    path: '/live-stream/list',
    name: 'live_stream_list',
    component: () => import('@/views/live-stream/list.vue'),
    meta: {
      keepAlive: false,
      title: '直播'
    },
  },
  {
    path: '/live-stream/share',
    name: 'live_stream_share',
    component: () => import('@/views/live-stream/share.vue'),
    meta: {
      keepAlive: false,
      title: '直播'
    },
  },
  {
    path: '/live-stream/stream',
    name: 'live_stream_stream',
    component: () => import('@/views/live-stream/live-stream.vue'),
    meta: {
      keepAlive: false,
      title: '直播'
    },
  },
]

