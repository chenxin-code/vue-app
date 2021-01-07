/**
 * Created by Dongmengjia on 2019/12/16.
 */
export default [
  {
    path: '/assessment-center',
    name: '测评中心',
    component: () => import('@/deploy/ynsy/views/index'),
    meta: {
      title: '测评中心',
      keepAlive: false
    }
  },
  {
    path: '/department',
    name: '部门负责人评价',
    component: () => import('@/deploy/ynsy/views/department'),
    meta: {
      title: '部门负责人评价',
      keepAlive: false
    }
  },
  {
    path: '/evaluation',
    name: '部门负责人评价',
    component: () => import('@/deploy/ynsy/views/evaluation'),
    meta: {
      title: '部门负责人评价',
      keepAlive: false
    }
  }
]
