<template>
  <div class="minelist">
    <nav-top title="电子券详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="scroll-div" style="overflow: auto" v-if="data">
      <div class="item_div shadow-cell">
        <div class="div_flex ">
          <img :src="data.imgurl" />
          <div class="ticket_div">
            <div class="title_div">{{ data.typetitle }}</div>
            <div class="type_div">{{ data.typename }}</div>
            <div class="date_div">
              有效期：{{ data.coustartdate }}-{{ data.couenddate }}
            </div>
          </div>
        </div>
        <div class="dashed_div"></div>
        <div class="div_title">
          <span>赠券编码:</span>
          <span>{{data.coucode}}</span>
        </div>
        <div style="text-align: center">
          <canvas id="barcode"></canvas>
          <canvas id="qrcode"></canvas>
        </div>
        <div class="dashed_div"></div>
        <div class="div_title">使用须知</div>
        <div class="div_text_gray" v-html="data.usedeclare">
          {{ data.usedeclare }}
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

export default {
  name: "mineorder",
  data() {
    return {
      msg: "msg",
      item: null,
      data: null,
      interval: null
    };
  },
  methods: {
    getQuanDetail() {
      let _this = this;
      let url = "/platform/json/coupon/getcoudetail";
      let parmas = {
        voucher: this.item.voucher,
        token: this.$store.state.login.token,
        isJsonData: true
      };
      _this.$Loading.open();
      this.$http.post(url, parmas).then(
        res => {
          _this.$Loading.close();
          if (res.data.status == "0") {
            // biztype: "5"
            // biztypecode: "油品券：每人每天限使用1张"
            // coucode: "000008588465"
            // couenddate: "2019-01-16"
            // coustartdate: "2018-12-17"
            // imgurl: "http://jiangsu.95504.net/upload/dzjtp/5K000027.png"
            // isdon: 0
            // limit: 1
            // typename: "test-122"
            // typetitle: "wuzh_test-122"
            // voucher: "507020609068588465"
            _this.data = res.data.data;
            //由于利用v-if，所以下次刷新的时候才会正常的获取到ref
            _this.$nextTick(() => {
              _this.data && _this.createBar(res.data.data.checkcode);
            });
            // debugger
          } else {
            _this.$Toast({
              message: res.data.info,
              position: "bottom",
              duration: 2000
            });
          }
          // _this.orderItems = items
        },
        error => {
          _this.$Loading.close();
          _this.$Toast({
            message: "请求失败",
            position: "bottom",
            duration: 2000
          });
        }
      );
    },
    createBar(code) {
      let barcode = document.getElementById("barcode");
      console.log("111", code);
      //
      JsBarcode(barcode, code, {
        width: 2.5,
        height: 60,
        displayValue: true,
        fontSize: 16
      });
      let qrcode = document.getElementById("qrcode");

      QRCode.toCanvas(qrcode, code, function(error) {
        if (error) console.error(error);
      });
    }
  },
  mounted() {
    this.getQuanDetail();
    let _this = this
    this.interval = setInterval(() => {
      _this.getQuanDetail()
    }, 60 * 1000);
  },
  destroyed () {
    if(this.interval) {
      clearInterval(this.interval)
    }
  },
  created() {
    this.item = JSON.parse(decodeURIComponent(this.$route.query.item));
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl'
.minelist {
  width 100%
  height 100%
  overflow hidden
  .div_flex {
    display flex
    align-items center
    justify-items center
    .div_tab {
      flex 1
      text-align center
      .text {
        font-size $font-size-medium
        margin-left 10px
      }
      .text_red {
        color red
      }
      .line_div {
        margin 5px 20%
        height 1px
        background white
      }
      .line_div_red {
        background red
      }
    }
  }
  .item_div {
    border-radius 10px
    padding 10px
    .ticket_div {
      flex 1
      .title_div {
        padding 5px
        font-size $font-size-medium
        font-weight 700
      }
      .type_div {
        padding 5px
        font-size $font-size-medium-s
      }
      .date_div {
        padding 5px
        font-size $font-size-medium-s
        color $color-theme-text-h
      }
    }
    img {
      width 70px
      height 70px
      margin-right 10px
    }
    .dashed_div {
      height 1px
      margin-top 10px
      border-bottom dashed 1px $color-theme-line
    }
  }
  .div_title {
    font-size $font-size-medium
    margin 10px
  }
  .div_text_gray {
    color $color-theme-text-h
    line-height 20px
    font-size $font-size-medium-s
  }
  .scroll-div {
    overflow-y scroll
    -webkit-overflow-scrolling touch
  }
}
#qrcode {
  width 250px !important
  height 250px !important
}
</style>
