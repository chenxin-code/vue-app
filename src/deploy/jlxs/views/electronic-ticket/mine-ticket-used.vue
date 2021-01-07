<template>
  <div class="sureorder">
    <nav-top title="使用详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="shadow-cell">
        <div class="today">
          <p class="p1">电子券号</p>
          <p class="p2 code">{{ item.coucode }}</p>
        </div>
        <div class="today">
          <p class="p1">面值金额</p>
          <p class="p2">{{ item.facevalue }}元</p>
        </div>
        <div class="today">
          <p class="p1">交易单号</p>
          <p class="p2">{{ item.facevalue }}</p>
        </div>
        <div class="today">
          <p class="p1">交易站点</p>
          <p class="p2">{{ item.stationName }}</p>
        </div>
        <div class="today">
          <p class="p1">EPS流水号</p>
          <p class="p2">{{ item.voucher }}</p>
        </div>
        <div class="today">
          <p class="p1">交易时间</p>
          <p class="p2">{{ item.usedtime }}</p>
        </div>
        <div class="bar">
          <p>{{ item.voucher }}</p>
          <canvas id="barcode"></canvas>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
import JsBarcode from "jsbarcode";
export default {
  name: "myself",
  data() {
    return {
      item: "",
      code: "",
      coucode: "", // 电子券编号
      facevalue: "", // 面值金额
      tradeno: "", // 交易单号
      tradeorg: "", // 交易站点
      epsno: "", // EPS流水号
      usedtime: "" // 交易时间
    };
  },
  methods: {
    // 获取详情
    getDetail() {
      let url = "/platform/json/coupon/getusedcoudetail";
      let data = {
        voucher: this.item,
        token: this.$store.state.login.token,
        isJsonData: true
      };
      this.$Loading.open();
      let _this = this;
      this.$http
        .post(url, data)
        .then(res => {
          _this.$Loading.close();
          if (res.data.status === 0) {
            let data = res.data.data;
            if (data) {
              _this.coucode = data.coucode;
              _this.facevalue = data.facevalue;
              _this.tradeno = data.tradeno;
              _this.tradeorg = data.tradeorg;
              _this.epsno = data.epsno;
              _this.usedtime = data.usedtime;
              _this.code = data.coucode;
              _this.$nextTick(() => {
                _this.createBar(data.coucode);
              });
            }
          } else {
            _this.$Toast({
              message: res.data.info,
              position: "bottom",
              duration: 2000
            });
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
    // 获取条形码
    createBar(code) {
      let barcode = document.getElementById("barcode");
      JsBarcode(barcode, "45454545445", {
        width: 2.5,
        height: 50,
        displayValue: false,
        fontSize: 16
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.createBar(this.item.voucher);
    });
    //test
    this.item = JSON.parse(decodeURIComponent(this.$route.query.item));
    this.getDetail();
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
    border-radius: 16px;
    // border 2px solid rgb(255, 153, 0)
    padding: 5px;
  }

  .bar {
    margin-top: 12px;
    text-align: center;

    p {
      font-size: 16px;
    }
  }

  .today {
    height: 50px;
    border-bottom: 1px solid #f0ebeb;
    display: flex;
    align-items: center;
    font-size: 14px;

    .code {
      font-weight: 550;
      font-size: 18px;
    }

    .p1 {
      width: 22%;
      text-align: left;
      color: #666;
    }

    .p2 {
      width: 68%;
      margin-left: 10%;
      text-align: right;
    }
  }
}
</style>
