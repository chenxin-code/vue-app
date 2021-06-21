/*
 * @Description: 这是***页面
 * @Date: 2021-06-08 13:57:01
 * @Author: shuimei
 * @LastEditTime: 2021-06-17 11:16:37
 */
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
            // target: 'https://mall-prod-app-linli.timesgroup.cn',
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
            // target: 'https://mall-prod-app-linli.timesgroup.cn',
            target: 'http://mall-uat-app-linli.timesgroup.cn/',
            changeOrigin: true,
        },
        '/times': {
            target: 'http://m-center-uat.linli.timesgroup.cn', //中台系统
            changeOrigin: true,
        },
        '/pcs': {
            target: 'http://times-pcs.linli580.com.cn:8888', //收费系统
            changeOrigin: true,
        },
    }
}
