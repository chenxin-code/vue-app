import sensors from "sa-sdk-javascript";
import store from '../vuex/store'
import Vue from 'vue'

let initSensors = function () {
  const tokenStr = "Bearer " + store.state.ythToken;
  console.log('sensorssensorssensors', store.state.ythToken);
  let url = '';
  if (process.env.NODE_ENV == 'production') {
    url = 'https://datasink-ss-prod-linli.timesgroup.cn:9106/sa?project=production'
  } else {
    url = 'https://datasink-ss-prod-linli.timesgroup.cn:9106/sa?project=llb_uat';
  }
  sensors.init({
    server_url: `${url}&token=${tokenStr}`, // 接收地址
    // project_name: "com.time.mall.H5.SAAF", // 项目名
    is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
    use_client_time: true, // 埋点所取事件，true为用户端，false为服务端
    send_type: "beacon",
    heatmap: {
      // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
      clickmap: "not_collect",
      // 是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
      scroll_notice_map: "not_collect",
      get_vtrack_config: false,
    },
    app_js_bridge: true,
    // ...options
  });
  // sensors.quick("autoTrack");
  // 另外，如果想加额外的属性，可以如下方式（添加 platform 属性为 h5）
  // sensors.quick("autoTrack", {
  //   platform: "h5"
  // });
  sensors.login(store.state.ythUserInfo.id);

  Vue.prototype.$sensors = sensors
}


export default initSensors;
