/**
 * Created by LiRui on 2019/6/20.
 */
export default [
  {
    path: '/get_coupon',
    name: '领券中心',
    component: () => import('../views/get-coupon-center'),
    meta: {
      keepAlive: false
    }
  }
]
