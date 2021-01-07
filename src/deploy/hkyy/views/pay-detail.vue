<template>
  <div class="sureorder">
    <div class="shadow-cell">
      <div class="today">
        <p class="p1">油站名称</p>
        <p class="p2">{{ stationName }}</p>
      </div>
      <div class="today">
        <p class="p1">优惠金额</p>
        <p class="p2">￥{{ faceValue }}</p>
      </div>
      <div class="today">
        <p class="p1">使用时间</p>
        <p class="p2">{{ currentTime }}</p>
      </div>
      <!-- <div class="btn" v-if="show">
        <img src="static/imgs/change.png" alt="" />
      </div> -->
      <div class="img-back">
        <img
          :src="configData.gameImgUrl"
          v-if="configData"
          @click="goToGame"
          class="bottomImg"
        />
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "myself",
    data() {
      return {
        voucher: "",
        faceValue: "", // 面值金额
        stationName: "",
        currentTime: "",
        // show: false,
        configData: null,
        // configData: {
        //   gameUrl:
        //     "https://cnpchb.deepermobile.com.cn/app-vue/game/index.html#/?gameTypeCode=DZP000039",
        //   gameImgUrl: "http://syjsweb.uroadlife.com/download?uploadFile.id=19478",
        //   code: "0",
        //   msg: "查询成功"
        // }
      };
    },
    methods: {
      goToGame() {
        this.$bridgefunc.customPush({
          path: this.configData.gameUrl,
          isnativetop: "1",
          superback: 1
        });
      },
      // 是否给用户非油券
      // setVoucher() {
      //   let url = "/platform/json/coupon/getCouScanUrl";
      //   let data = {
      //     token: this.$store.getters.token,
      //     voucher: this.voucher
      //   };
      //   this.$http
      //     .post(url, data)
      //     .then(res => {
      //       let data = res.data;
      //       console.log(data);
      //       if (data.status === 0) {
      //         if (Number(data.data) === 1) {
      //           // 成功，有非油券
      //           this.show = true;
      //         } else {
      //           // 失败，没有非油券
      //           this.show = false;
      //         }
      //       } else {
      //         this.$Toast(res.data.info);
      //       }
      //     })
      //     .catch(err => {
      //       this.$Toast("请求失败");
      //     });
      // },
      getYhui() {
        let url = "/platform/json/hzf/getGameInfo?gameTypeStr=DZP";
        let data = {
          // token: this.$store.getters.token,
          voucher: this.voucher
        };
        let _this = this;
        this.$http
          .post(url, data)
          .then(res => {
            let data = res.data;
            console.log(data);
            if (data.status === 0) {
              // gameUrl: "https://cnpchb.deepermobile.com.cn/app-vue/game/index.html#/?gameTypeCode=DZP000039"
              // gameImgUrl: "http://syjsweb.uroadlife.com/download?uploadFile.id=19478"
              // code: "0"
              // msg: "查询成功"
              _this.configData = data.data;
            } else {
              this.$Toast(res.data.info);
            }
          })
          .catch(err => {
            this.$Toast("请求失败");
          });
      }
    },
    created() {
      let detailInfo = JSON.parse(
        decodeURIComponent(this.$route.query.detailInfo)
      );
      this.stationName = detailInfo.stationName;
      this.faceValue = detailInfo.faceValue;
      this.currentTime = detailInfo.currentTime;
      //test
      this.voucher = JSON.parse(decodeURIComponent(this.$route.query.voucher));
      // this.setVoucher();
      let getGame = this.$route.query.getGame;
      if (getGame)
        this.getYhui();
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .sureorder {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .shadow-cell {
      height: 100%;
      display flex
      flex-direction column
    }

    .today {
      height: 50px;
      border-bottom: 1px solid #f0ebeb;
      display: flex;
      align-items: center;
      font-size: 14px;

      .p1 {
        width: 22%;
        margin-left: 14px;
        color: #666;
      }

      .p2 {
        width: 68%;
        margin-left: 10%;
        text-align: right;
        margin-right: 14px;
        color: #666;
      }
    }

    .btn {
      width: 98%;
      border-radius: 4px;
      position: absolute;
      bottom: 20px;
    }

    .img-back {
      flex 1
      align-items center
      // justify-content center
      display flex
      .bottomImg {
        width: 100%;
        border-radius: 4px;
        border-radius: 5px;
      }
    }
  }
</style>
