export default {
  data() {
    return {
      getResultTimes: 0,
      clearTimer: null,
      payTime: 0
    }
  },
  mounted() {
    //从后台进前台的协议
    // this.$bridgefunc.enterForegroundCallBack(() => {
    //   const now = (new Date()).getTime()
    //   const diff = now - this.payTime
    //   if (this.hasToPay &&  diff > 3000) {
    //     this.hasToPay = false;
    //     this.getResultTimes = 0
    //     this.checkPayResult();
    //   }
    // })
  },
  methods: {
    checkPayResult() {
      this.queryState().then(state => {
        if (state == 1) {
          this.resultHand(1);
        } else if (state == 2) {
          this.resultHand(0);
        } else if (state == 0) {
          this.getResultTimes++;
          if (this.getResultTimes > 20) {
            return;
          }
          this.clearTimer = setTimeout(() => {
            this.checkPayResult();
          }, 1000)
        }
      })
    },
    queryState() {
      return new Promise((resolve, reject) => {
        let url = '/app/json/refuel_center/queryPayState';
        if (this.isScan) {
          url = '/app/json/refuel_scan_code/queryPayState';
        }
        let paramsData = {
          token: this.$store.state.login.token,
          tradeNo: this.payData.tradeNo,
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            //  //0 待支付  1支付成功 2其他(支付失败、支付取消等)
            resolve(data.data.state)
          } else {
            reject()
          }
          if (data.data.msg) {
            // this.$toast(data.data.msg)
          }
        }).catch(() => {
          this.$Loading.close();
        })
      })
    }
  },
  destroyed() {
    clearTimeout(this.clearTimer)
  }
}
