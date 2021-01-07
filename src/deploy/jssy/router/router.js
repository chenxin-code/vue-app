/**
 * Created by LiRui on 2019/6/20.
 */
export default [
  {
    path: '/coupon_list',
    name: '优惠券',
    component: () => import('../views/coupon-list'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/coupon_detail',
    name: '我的电子券',
    component: () => import('../views/coupon-detail'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/my_coupon',
    name: '我的电子券',
    component: () => import('../views/my-coupon'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/get_coupon',
    name: '领券中心',
    component: () => import('../views/get-coupon'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/coupon_package_detail',
    component: () => import('../views/coupon-package-detail'),
    meta: {
      title: '券包详情'
    },
    meta: {
      keepAlive: false
    }
  }
]
