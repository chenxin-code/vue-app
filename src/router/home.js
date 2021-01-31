/**
 * Created by steven on 2018/8/22.
 */
module.exports = [

  //msg路径begin
  {
    path: '/minemsgcenter',
    name: '消息',
    component: () => import('@/components/product/home-modules/mine-msg-center'),
    meta: {
      keepAlive: false
    }
  },
  //msg路径end
  {
    path: '/minemsgcenterdetails',
    name: '消息详情',
    component: () => import('@/components/product/home-modules/mine-msg-center-details'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/freejobprotocal',
    component: () => import('@/views/funcpage/free-job-protocal.vue'),
    meta: {
      keepAlive: false,
      title:'时代邻里邦'
    }
  },
]
