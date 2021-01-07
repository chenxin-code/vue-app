/**
 * @description 联量薪酬查询
 * @datetime 2020/10/27 12:00
 * @author LiuYong <tel:15045009738>
 */

module.exports = [
  {
    path: '/emolument/query',
    name: '联量薪酬查询',
    component: () => import('@/components/product/emolument/emolument-query.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/emolument/detail',
    name: '联量薪酬明细',
    component: () => import('@/components/product/emolument/emolument-detail.vue'),
    meta: {
      keepAlive: false
    }
  },
]