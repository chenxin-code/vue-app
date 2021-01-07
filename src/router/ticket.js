/**
 * Created by steven on 2018/8/22.
 */

module.exports = [

  //ElTicket路径begin
  {
    path: '/elticket',
    name: '我的电子券',
    component: () => import('@/components/product/elticket/mine-elticket'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/mineelticketfreelist',
    name: '我的电子券',
    component: () => import('@/components/product/elticket/mine-elticket-freelist'),
    meta: {
      keepAlive: false
    }
  },
  //ElTicket路径end
  {
    path: '/mineelticketused',
    name: '我的电子券',
    component: () => import('@/components/product/elticket/mine-elticket-used'),
    meta: {
      keepAlive: false
    },
  },


]
