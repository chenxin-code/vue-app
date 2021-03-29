module.exports = {
    proxy: {
        '/api/mapapi': {
            target: 'http://api.map.baidu.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api/mapapi': ''
            }
        },
        '/api/vueapp': {
            // target: 'http://47.97.215.145:10006',
            changeOrigin: true,
            pathRewrite: {
                '^/api/vueapp': '/vueapp'
            }
        },
        '/api': {
            // target: 'http://139.129.195.140:18807',
            // target: 'http://192.168.31.118:18807',
            // target: 'http://39.105.84.126:28807',
            target: 'http://mall-uat-app-linli.timesgroup.cn/',
            // target: 'http://tbdapp.deepermobile.com', // 原来的测试地址
            // target:'http://henansydemo.deepermobile.com',
            // target: 'http://jlapp.95504.net:81',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        },
        '/app': {
            // target: 'http://tbdapp.deepermobile.com',
            // target: 'http://39.105.84.126:28807',
            // target: 'http://192.168.31.118:18807',
            target: 'http://mall-uat-app-linli.timesgroup.cn/',
            changeOrigin: true,
        },
    }
}