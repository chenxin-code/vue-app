/**Created by liaoyingchao on 2020-01-08.*/

<template>
  <div class="my-card" :style="getBgStyle()">
    <div class="card-div" :style="getFloatUp()">
      <div class="member-div-bg">
        <!--<img :src="moduleData.cardBgImg">-->
        <img :src="getMyCardBgImg()">
      </div>
      <div class="card-info">
        <div class="card-num" :class="{'color-black':$market.getMemberLevelIndex($store.state.mall2.myAssets.levelNo) == 2}">{{$store.state.mall2.myAssets.userCardNo || ''}}</div>
        <div class="qrcode" @click="toMyQrcode">
          <img src="static/images/mycenter/qrcode1.png" v-if="$market.getMemberLevelIndex($store.state.mall2.myAssets.levelNo) == 2"/>
          <img src="static/images/mycenter/qrcode2.png" v-else/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "my-card",
    props: ['myIndex', 'usePorpData', 'propData', 'barHeight'],
    computed: {
      ...mapState(['deployType']),
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      }
    },
    data() {
      return {
      }
    },
    methods: {
      toMyQrcode: function () {
        this.$router.push({
          path: '/myqrcode'
        })
      },
      getMyCardBgImg: function () {
        let idx = this.$market.getMemberLevelIndex(this.$store.state.mall2.myAssets.levelNo)
        if (idx > 0) {
          idx = idx - 1
        }
        let imgUrl = this.moduleData['cardImg_'+idx]
        if (imgUrl && imgUrl != null && imgUrl != '') {
          return imgUrl
        }
        return 'static/images/mycenter/my-card-bg.png'
      },
      getBgStyle: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color + ";"
        }

        return styleStr;
      },
      getFloatUp: function () {
        let styleStr = '';
        let floatUp = this.moduleData.floatUp
        if (floatUp > 0) {
          styleStr += 'margin-top: -' + floatUp + '%;'
        }
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'margin-top: ' + upMargin + '%;'
        }
        if (downMargin > 0) {
          styleStr += 'margin-bottom: ' + downMargin + '%;'
        }
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        return styleStr
      },
      getMyAssets: function() {
        let url = this.$market.apiBaseURL() + '/app/json/user/getUserWallet';
        let params = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, params).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.myAssets = data.data
              //this.$store.state.userInfo.levelNo = data.data.levelNo
              // this.myAssetsInit()
            }
          },
          error => {
          }
        );
      },
      modeleReshow: function () {
        this.getMyAssets();
      },
    },
    created() {
      if (this.$store.state.login.token != '') {
        this.getMyAssets()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .my-card {
    width 100%
    height 100%
    position relative;
    z-index 10;
    .card-div {
      position relative;
      min-height 50px;
      .member-div-bg {
        img {
          width 100%;
          display block;
        }
      }
      .card-info {
        position absolute;
        top 25px;
        left 23px;
        right 21px;
        bottom 69px;
        .qrcode {
          position absolute;
          top 0px;
          right 0px;
          img {
            width 30px;
            height 30px;
            display block;
          }
        }
        .card-num {
          position absolute;
          bottom 0px;
          left 0px;
          font-size 18px;
          color white;
          &.color-black {
            color #838383;
          }
        }
      }
    }
  }
</style>
