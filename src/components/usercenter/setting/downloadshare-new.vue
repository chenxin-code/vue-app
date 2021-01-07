/**Created by steven on 2019/8/1.*/

<template>
  <div class="downloadshare-new  ">
    <div class="bg-content">
      <img class="main" :src="$store.state.globalConfig.register_gifts_url" alt="" @click.stop="downloadHandler">
      <img class="close" :style="{top: this.$store.state.barHeight+ 'px'}" src="static/image/mall/close.png" alt="" @click.stop="backEvent">
    </div>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角在'浏览器'中打开</p>
    </van-popup>
  </div>
</template>

<script>

  export default {
    name: "downloadshare-new",
    components: {},
    computed: {
      isWx() {
        return this.$store.state.webtype == 2
      }
    },
    data() {
      return {
        downloadUrl: '',
        shareView: false
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
      },
      downloadHandler:function () {
        if (this.downloadUrl) {
          if(this.$util.isIos()){
            window.location.href = this.downloadUrl
          }else {
            if(this.$store.state.webtype == 2){
              this.shareView = true
            }else {
              window.location.href = this.downloadUrl
            }
          }
        } else {
          this.$Toast('下载地址错误！');
        }
      },
      getData: function () {
        this.$Loading.open();
        let url = '/app/json/home/getVersion';
        let paramsData = {};
        paramsData.appSysType = this.$util.isIos() ? 1 : 2
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status === 0) {
              this.downloadUrl = data.data.downloadUrl || ''
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },

    },
    created() {
      this.getData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .downloadshare-new {
    width 100%
    height 100%
    overflow auto;
    -webkit-overflow-scrolling: touch;
    .bg-content{
      position relative;
      .main{
        width 100%
      }
      .close{
        position absolute
        right 30px
        width 40px
        height 40px
      }
    }
  }

  >>> .stateBox {
    z-index: 2001;
    /*height: 180px;*/
    /*line-height: 180px;*/
    width: 80%;
    text-align: center;
    font-size: 16px;
    color white;
    top 200px;

    img {
      width 80px;
      margin 0 0 15px 160px;
    }
  }
  >>> .van-popup {
    background transparent;
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
</style>
