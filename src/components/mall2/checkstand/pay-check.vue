/**Created by liaoyingchao on 2020-06-17.*/

<template>
  <div class="pay-check">

  </div>
</template>

<script>
  export default {
    name: "pay-check",
    components: {},
    data() {
      return {
        tradeNo: '',
        orderType: '',
        orderId: '',
        isScan: '',
        getResultTimes: 0
      }
    },
    methods: {
      oilCheckPayResult: function () {
        this.$Loading.open();
        let url = '/app/json/refuel_center/queryPayState';
        if (this.isScan) {
          url = '/app/json/refuel_scan_code/queryPayState';
        }
        let paramsData = {
          tradeNo: this.tradeNo,
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              //  //0 待支付  1支付成功 2其他(支付失败、支付取消等)
              if (data.data.state == 1) {
                this.oilResultHand(1);
              } else if (data.data.state == 2) {
                this.oilResultHand(0);
              } else if (data.data.state == 0) {
                this.getResultTimes++;
                if (this.getResultTimes > 3) {
                  return;
                }
                setTimeout(() => {
                  this.oilCheckPayResult();
                }, 500)
              }
            }
          },
          error => {
            this.$Loading.close();
          }
        )
      },
      oilResultHand(result) {
        this.$Loading.close();
        if (result == "1") {
          this.$router.replace({
            path: this.isScan ? '/firmScanDetail' : '/firmDetail',
            query: {
              orderType: this.orderType,
              orderId: this.orderId,
              fromPage: 1
            }
          })
        } else {
          let cancelUrl = "/app/json/refuel_center/cancelOrder";
          if (this.isScan) {
            cancelUrl = '/app/json/refuel_scan_code/cancelOrder'
          }
          let paramsData2 = {
            orderType: this.orderType,
            orderId: this.orderId
          };
          this.$http.post(cancelUrl, paramsData2).then(res => {
            let data2 = res.data;
            if (data2.status == 0) {
              this.$Toast("支付已取消");
              this.$router.go(-1)
            } else {
              this.$Toast(data2.info);
            }
          });
        }
      },
      checkPayResult: function() {
        this.$Loading.open();
        let url = "/app/json/app_shopping_order/queryPayState";
        let paramsData = {
          tradeNo: this.tradeNo,
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              // 0 待支付  1支付成功  2其他(支付失败、支付取消等)
              if (data.data.state == 1) {
                this.enterSuccess()
              } else {
                // this.$Toast('暂未查询到您的支付信息！稍后请在订单中查看订单状态')
                // this.$router.go(-1)
                this.getResultTimes++;
                if (this.getResultTimes > 3) {
                  this.$Toast('暂未查询到您的支付信息！稍后请在订单中查看订单状态')
                  this.$router.go(-1)
                  return;
                }
                setTimeout(() => {
                  this.checkPayResult();
                }, 500)
              }
            }
          },
          error => {
            this.$Loading.close();
          }
        );
      },
      toOrder: function () {
        if (this.$store.state.mall2.staticDeliverType == 1) {
          this.$router.replace({
            path: '/mall2/orderlist',
            query: {
              selectedIndex: '2',
              orderCategory: this.$route.query.orderCategory,
              vipUnitUserCode: this.$route.query.vipUnitUserCode

            }
          });
        } else {
          this.$router.replace({
            path: '/mall2/orderlist',
            query: {
              selectedIndex: '1',
              orderCategory: this.$route.query.orderCategory,
              vipUnitUserCode: this.$route.query.vipUnitUserCode
            }
          });
        }
      },
      enterSuccess: function() {
        this.$router.replace({
          path: "/mall2/paysuccess",
          query: {
            selectedIndex: 1,
            name: this.$route.query.name
          }
        });
      },
    },
    mounted() {
      this.tradeNo = this.$route.query.tradeNo || ''
      this.orderType = this.$route.query.orderType || ''
      this.orderId = this.$route.query.orderId || ''
      this.isScan = this.$route.query.isScan || ''
      this.isZTApp = this.$route.query.isZTApp || ''
      if (this.$util.isZTAPP()) {
        this.$MessageBox.confirm('是否已经完成订单支付！', '提示', {confirmButtonText: '支付完成', cancelButtonText: '放弃支付'}).then(action => {
          this.getResultTimes = 0;
          if (this.orderType.indexOf('100') == 0) {
            // 100 开头为加油订单
            this.oilCheckPayResult();
          } else {
            this.checkPayResult();
          }
        }).catch(action => {
          window.history.go(-2)
        });
      } else if (this.isZTApp == 1) {
        // 自带浏览器在网页里面，跳转回掌厅
        window.location.href = 'sinopecsales://' + window.location.host
      } else if (this.$store.state.webtype == '1') {
        // 在自己家的app里面，直接返回上一级页面
        this.$bridgefunc.customGo(-1);
      } else {
        let referer = window.location.host
        window.location.href = referer + '://' + window.location.host
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .pay-check {
    width 100%
    height 100%
    overflow hidden
  }
</style>
