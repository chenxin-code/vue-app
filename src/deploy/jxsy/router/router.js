export default [
    {
        path: '/double_v_membership/home',
        name: '双V会员',
        component: () => import('@/deploy/jxsy/views/double-v-membership'),
        meta: {
            title: '双V会员',
            keepAlive: true
        }
    },
    {
        path: '/double_v_membership/opening',
        name: '双V会员',
        component: () => import('@/deploy/jxsy/views/double-v-membership/opening'),
        meta: {
            title: '双V会员(未开通)',
            keepAlive: true
        }
    },
    {
        path: '/double_v_membership/opened',
        name: '双V会员',
        component: () => import('@/deploy/jxsy/views/double-v-membership/opened'),
        meta: {
            title: '双V会员(已开通)',
            keepAlive: true
        }
    }
]
