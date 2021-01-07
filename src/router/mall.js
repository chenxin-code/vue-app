/**
 * Created by steven on 2018/8/22.
 */

module.exports = [

  //Mall商城路径begin
  {
    path: '/mallcategories',
    name: '商品分类',
    component: () => import('@/components/Mall/Mall-Categories'),
    meta: {
      keepAlive: true
    },
  },
  {
    path: '/mallgooddetail',
    name: '商品详情',
    component: () => import('@/components/Mall/Mall-GoodDetail'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mallgoodlist',
    name: '商品列表',
    component: () => import('@/components/Mall/Mall-GoodList.vue'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mallorderform',
    name: '填写订单',
    component: () => import('@/components/Mall/Mall-OrderForm.vue'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mallorderlist',
    name: '订单列表',
    component: () => import('@/components/Mall/Mall-OrderList.vue'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mallpayresult',
    name: '支付结果',
    component: () => import('@/components/Mall/Mall-PayResult.vue'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mallshoppingcart',
    name: '购物车',
    component: () => import('@/components/Mall/Mall-ShoppingCart.vue'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/malladdress',
    name: '收货地址',
    component: () => import('@/components/Mall/Mall-Address.vue'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/malladdaddress',
    name: '添加收货地址',
    component: () => import('@/components/Mall/Mall-AddAddress'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/mallpayorder',
    name: '支付订单',
    component: () => import('@/components/Mall/Mall-PayOrder'),
    meta: {
      keepAlive: false
    },
  },
  //Mall商城路径end
  {
    path: '/malltest',
    name: '商城Test',
    component: () => import('@/components/Mall/Mall-Test'),
    meta: {
      keepAlive: false
    },
  }
]
