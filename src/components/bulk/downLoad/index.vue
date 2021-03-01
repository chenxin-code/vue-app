<template>
  <!-- 下载 -->
  <div class="downLoad">
    <img
      :src="require('./images/lADPBF8a8kyFv3nNBTbNAu4_750_1334.jpg')"
      alt=""
      class="down_load_img"
    />
    <div class="footer">
      <div class="text">
        <div>安装最新</div>
        <div class="app_name">邻里邦RRO</div>
        <div>客户端</div>
      </div>
      <div class="down_btn" @click="appDown">前往商店下载</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "downLoad",
  components: {},
  data() {
    return {};
  },
  created() {
    if (this.is_weixn()) {
      return;
    } else {
      this.appDown();
    }
  },
  methods: {
    is_weixn() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    //点击下载按钮判断
    appDown() {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      if (isiOS) {
        window.location.href = "https://www.pgyer.com/Times-App-C-Prod";
      } else if (isAndroid) {
        window.location.href = "https://www.pgyer.com/Times-App-C-Prod";
      }
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.downLoad {
  width: 100%;
  height: 100%;

  .down_load_img {
    width: 100%;
  }

  .footer {
    padding: 0 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 87px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 15px;
      color: #666666;

      .app_name {
        font-weight: 800;
        color: #000;
        margin: 0 5px;
      }
    }

    .down_btn {
      width: 120px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-radius: 40px;
      background-color: #ef2d30;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
