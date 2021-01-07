<template>
  <div class="ad-page">
    <nav-top title="优惠码" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="code">
        <div class="top">
          <span>{{detailInfo.title}}  {{detailInfo.oilNo}}</span>
        </div>
        <div class="top">
          <span>优惠码：</span>
          <span>{{ code }}</span>
        </div>
        <canvas id="barcode"></canvas>
        <div class="number">{{ number }}</div>
        <canvas id="qrcode"></canvas>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import JsBarcode from "jsbarcode";
  import QRCode from "qrcode";
  import {Popup, Dialog, Toast} from "vant";

  export default {
    name: "ad-page",
    components: {},
    data() {
      return {
        code: "",
        item: "",
        number: "",
        flag: true,
        timeer: "",
        timeer2: "",
        timeVouc: "",
        detailInfo: {}
      };
    },
    methods: {
      // 1获取状态
      getStatus() {
        let url = "/platform/json/coupon/getHjyusedcoustate";
        let data = {
          // token: this.$store.getters.token
        };
        let _this = this;
        this.$http.post(url, data).then(res => {
          if (res.data.status == 0) {
            if (res.data.data == "0") {
              this.getDetail();
              this.timeer2 = setInterval(() => {
                this.getDetail();
              }, 60000);
            } else {
              // 关闭定时器
              clearInterval(this.timeer2);
              //              clearInterval(this.timeer)
              //               this.$Bridgefunc.customPush({
              //                 path: '/wechat_pay'
              //               })
              _this.$Bridgefunc.customGo(-2);

              //               Dialog.alert({
              //                 title: '',
              //                 message: `一个用户一天只能使用一次券`
              //               }).then(() => {
              //                 _this.$Bridgefunc.customGo(-2)
              //               });
            }
          }
          // 判断是否用过
          //          this.getCode = res.data.data
        });
      },
      // 2获取详情
      getDetail() {
        let url = "/platform/json/coupon/getHjyCoupons";
        this.$Loading.open();
        let _this = this;
        this.$http
          .post(url, this.item)
          .then(res => {
            this.$Loading.close();
            if (res.data.status === 0) {
              let data = res.data.data;
              if (data) {
                this.code = data.couNo;
                this.getCode(data.voucher);
              }
            } else {
              if (res.data.errorCode == 1001) {
                Dialog.alert({
                  title: "",
                  message: res.data.info
                }).then(() => {
                  _this.$Bridgefunc.customGo(-1);
                });
              } else {
                _this.$Toast({
                  message: res.data.info,
                  position: "bottom",
                  duration: 1000
                });
              }
            }
          })
          .catch(err => {
            this.$Loading.close();
            this.$Toast({
              message: "请求失败",
              position: "bottom",
              duration: 2000
            });
          });
      },
      getCode(voucher) {
        let url = "/platform/json/coupon/getHjycheckcode";
        let data = {
          // token: this.$store.getters.token,
          "hjyCouponReqModel.voucher": voucher,
          isJsonData: true
        };
        // 先注释，这个是3秒一查询券是否被使用
        this.checkVouchers(voucher);
        this.timeVouc = setInterval(() => {
          this.checkVouchers(voucher);
        }, 1000);
        this.$http.post(url, data).then(res => {
          if (res.data.status === 0) {
            this.$nextTick(() => {
              this.createBar(res.data.data);
            });
          }
        });
      },
      createBar(code) {
        this.number = code;
        let barcode = document.getElementById("barcode");
        //
        JsBarcode(barcode, code, {
          //          width: 2.5,
          //          height: 60,
          displayValue: false,
          fontSize: 16
        });
        let qrcode = document.getElementById("qrcode");

        QRCode.toCanvas(qrcode, code, function (error) {
          if (error) console.error(error);
        });
      },
      // 查看券是否呗使用过
      checkVouchers(voucher) {
        let url = "/platform/json/coupon/gethjyCouponState";
        let data = {
          // token: this.$store.getters.token,
          token: this.$store.state.login.token || "",
          voucher: voucher,
          isJsonData: true
        };
        this.$http
          .post(url, data)
          .then(res => {
            let data = res.data;
            if (data.status === 0) {
              if (Number(data.data) === 0) {
                // 没使用
              } else {
                //1是核销成功 并营销活动执行成功
                //2是 核销成功  但营销活动执行失败 跳转pay-detail后不去获取营销活动
                // 记录券被使用后的日期
                this.detailInfo.currentTime = data.currentTime;
                // 使用了
                clearInterval(this.timeer2);
                clearInterval(this.timeVouc);
                this.$bridgefunc.customPush({
                  path: "/hkpayDetail",
                  query: {
                    getGame: Number(data.data) === 1,
                    voucher: encodeURIComponent(JSON.stringify(voucher)),
                    detailInfo: encodeURIComponent(
                      JSON.stringify(this.detailInfo)
                    )
                  }
                });
              }
              //
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
      this.getStatus();
      //      this.timeer = setInterval(() => {
      //        this.flag = false
      //        this.getStatus()
      //      }, 30000)
      this.item = JSON.parse(decodeURIComponent(this.$route.query.item));
      this.detailInfo = JSON.parse(
        decodeURIComponent(this.$route.query.detailInfo)
      );
      console.log("detailInfo", this.detailInfo);
    },
    destroyed() {
      clearInterval(this.timeer2);
      clearInterval(this.timeVouc);
      //      clearInterval(this.timeer)
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .ad-page {
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 2%;
    position: relative;

    .top {
      font-size: 16px;
      margin: 16px auto;
    }

    .code {
      width: 100%;
      height: 100%;
      text-align: center;

      #barcode {
        width: 80%;
        height: 110px;
      }

      #qrcode {
        width: 250px !important;
        height: 250px !important;
      }

      .number {
        font-size: 20px;
      }
    }
  }
</style>
