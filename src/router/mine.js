/**
 * Created by steven on 2018/8/22.
 */
module.exports = [

  //mine路径begin
  {
    path: '/mine_lists',
    name: '我的页面',
    component: () => import('@/components/product/mine-modules/mine-lists'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mineaboutus',
    name: '关于我们',
    component: () => import('@/components/product/mine-modules/mine-aboutUs'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/userinfo',
    name: '会员资料',
    component: () => import('@/components/product/mine-modules/mine-userInfo'),
    meta: {
      keepAlive: false
    }
  },

  {
    path: '/mineuserInfoupdatemailbox',
    name: '邮箱',
    component: () => import('@/components/product/mine-modules/mine-userInfo-update-mailbox'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mineuserInfoupdatesex',
    name: '性别',
    component: () => import('@/components/product/mine-modules/mine-userInfo-update-sex'),
    meta: {
      keepAlive: false
    },
  },

  {
    path: '/mineuserinfoupdateaddress',
    name: '详细地址',
    component: () => import('@/components/product/mine-modules/mine-userInfo-update-address'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mineuserinfoupdatename',
    name: '姓名',
    component: () => import('@/components/product/mine-modules/mine-userInfo-update-name'),
    meta: {
      keepAlive: false
    },
  },
  //mine路径end
  {
    path: '/mineuserinfoupdatedocuments',
    name: '证件',
    component: () => import('@/components/product/mine-modules/mine-userInfo-update-documents'),
    meta: {
      keepAlive: false
    },
  },
]
