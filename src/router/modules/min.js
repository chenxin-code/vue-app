//create by yuRongzhao

export default [
  // min 新
  {
    path: '/min',
    name: '新我的',
    component: () => import('@/components/min/index'),
    meta: {
      keepAlive: false
    },
  },
  {
    path: '/gradeDescription',
    name: '会员卡攻略',
    component: () => import('@/components/min/pages/gradeDescription/gradeDescription.vue'),
    meta: {
      keepAlive: false
    },
  },
]
