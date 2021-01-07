<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="自助开票"></nav-top>
    <nav-content>
      <router-link to="/cardOrder">
        <div class="publicInvoice" v-if="card === 0">
          <div class="operation">
            <div class="operationImg">
              <div class="titleContent">
                <span class="titleMessage" v-if="$store.state.globalConfig.cardInvoiceName">{{$store.state.globalConfig.cardInvoiceName}}</span>
                <span class="titleMessage" v-else>加油卡开票</span>
              </div>
            </div>
            <div class="mall-jiantou">
              <span class="iconfont mall-gengduojiantou"></span>
            </div>
          </div>
        </div>
      </router-link>
      <router-link to="/appOrder">
        <div class="publicInvoice" v-if="app === 1">
          <div class="operation">
            <div class="operationImg">
              <div class="titleContent">
                <span class="titleMessage" v-if="$store.state.globalConfig.appInvoiceName">{{$store.state.globalConfig.appInvoiceName}}</span>
                <span class="titleMessage" v-else>APP自助加油开票</span>
              </div>
            </div>
            <div class="mall-jiantou">
              <span class="iconfont mall-gengduojiantou"></span>
            </div>
          </div>
        </div>
      </router-link>
      <!-- <router-link> -->
      <div class="publicInvoice" v-if="mall === 2" @click="toMall">
        <div class="operation">
          <div class="operationImg">
            <div class="titleContent">
              <span class="titleMessage mall" v-if="$store.state.globalConfig.shopInvoiceName">{{$store.state.globalConfig.shopInvoiceName}}</span>
              <span class="titleMessage mall" v-else>商城购物开票</span>
            </div>
          </div>
          <div class="mall-jiantou mall">
            <span class="iconfont mall-gengduojiantou"></span>
          </div>
        </div>
      </div>
      <!-- </router-link> -->
      <router-link to="/goldOrder">
        <div class="publicInvoice" v-if="gold === 3">
          <div class="operation">
            <div class="operationImg">
              <div class="titleContent">
                <span class="titleMessage" v-if="$store.state.globalConfig.cashRefuelInvoiceName">{{$store.state.globalConfig.cashRefuelInvoiceName}}</span>
                <span class="titleMessage" v-else>现金加油开票</span>
              </div>
            </div>
            <div class="mall-jiantou">
              <span class="iconfont mall-gengduojiantou"></span>
            </div>
          </div>
        </div>
      </router-link>
      <router-link to="/storeOrder">
        <div class="publicInvoice" v-if="store === 4">
          <div class="operation">
            <div class="operationImg">
              <div class="titleContent">
                <span class="titleMessage" v-if="$store.state.globalConfig.convenienceStoreInvoiceName">{{$store.state.globalConfig.convenienceStoreInvoiceName}}</span>
                <span class="titleMessage" v-else>便利店开票</span>
              </div>
            </div>
            <div class="mall-jiantou">
              <span class="iconfont mall-gengduojiantou"></span>
            </div>
          </div>
        </div>
      </router-link>
      <router-link to="/walletOrder">
        <div class="publicInvoice" v-if="wallet === 6">
          <div class="operation">
            <div class="operationImg">
              <div class="titleContent">
                <!--                <span class="titleMessage" v-if="$store.state.globalConfig.convenienceStoreInvoiceName">{{$store.state.globalConfig.convenienceStoreInvoiceName
                }}</span>-->
                <!--                <span class="titleMessage" v-else>石化钱包加油开票</span>-->
                <span class="titleMessage">石化钱包加油开票</span>
              </div>
            </div>
            <div class="mall-jiantou">
              <span class="iconfont mall-gengduojiantou"></span>
            </div>
          </div>
        </div>
      </router-link>
      <div class="p-Box" v-if="tipView">
        <p class="p" v-if="$store.state.globalConfig.invoiceExplain != 52">1、您所申请的发票类型为增值税普通发票，单张发票金额最高为9999元。</p>
        <p class="p" v-if="$store.state.globalConfig.invoiceExplain != 52">2、开具的发票金额为实际加油产生费用金额，加油卡充值未消费金额、加油券金额、加油卡充值赠送金额不可开具发票。</p>
        <p class="p" v-if="$store.state.globalConfig.invoiceExplain != 52">3、当选择多个加油订单时，且涉及多个加油站时，系统将根据加油站开具发票。</p>
        <p class="p" v-if="$store.state.globalConfig.invoiceExplain != 52">4、增值税电子普通发票与税务机关监制的增值税普通发票纸制版相同。如需纸质报销，可将电子文档打印即可。</p>
        <p class="p" v-if="$store.state.globalConfig.invoiceExplain != 52">5、石化钱包加油请进入APP首页底端【一键加油】内开具电子发票，石化钱包订单只保留三个月，请在有效期内开具发票。</p>
        <p class="p" v-if="walletContent" v-html="walletContent"></p>
      </div>
      <div class="p-Box" v-if="!tipView">
        <p class="p" v-html="content"></p>
        <p class="p" v-if="walletContent" v-html="walletContent"></p>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from "./api";

  export default {
    name: "invoiceSelfIndex",
    mixins: [api],
    data() {
      return {
        card: "",
        app: "",
        mall: "",
        gold: "",
        tipView: true,
        content: "",
        store: "",
        //石化钱包
        wallet: "",
        //石化钱包操作指引图
        walletContent: ""
      };
    },
    created() {
      let text = "";
      text = this.$store.state.globalConfig.invoiceEntryMenu;
      if (text.indexOf("0") >= 0) {
        this.card = 0;
      }
      if (text.indexOf("1") >= 0) {
        this.app = 1;
      }
      if (text.indexOf("2") >= 0) {
        this.mall = 2;
      }
      if (text.indexOf("3") >= 0) {
        this.gold = 3;
      }
      if (text.indexOf("4") >= 0) {
        this.store = 4;
      }
      if (text.indexOf("6") >= 0) {
        this.wallet = 6
      }
      this.$request.post('/app/json/news/getNewsList', {values: 74}).then(res => {
          if (res.status === 0) {
            // console.log(res.data.content)
            this.walletContent = res.data[0].content
            console.log(res.data[0].content,this.walletContent)
            console.log(res.data)
          }
        }
      )
    },
    mounted() {
      this.indexData();
      // this.$bridgefunc.getInvoiceCode('PUT8dfXvTG')
    },
    methods: {
      indexData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          values: 23
        };
        that.invoicetipData(params).then(res => {
          if (res.data.result) {
            let tip = res.data.data || [];
            if (tip.length > 0) {
              that.content = tip[0].content;
              that.tipView = false;
            }
          }
        });
      },
      toMall() {
        let that = this
        // if (this.$store.state.globalConfig.shoppingOrderInvoiceType == 1) { //定制化
        //   that.$bridgefunc.customPush({
        //     path: window.location.origin + '/api/order/finishlistPage',
        //     isnativetop: "1",
        //     superback: 1
        //   });
        // } else {
        this.$router.push({
          path: '/mallOrder'
        })
        // }
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 10px auto;
    overflow: hidden;

    .operation {
      width: 95%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 15px 0px 15px 0;

      /* border-bottom: 1px solid #ebedf0; */

      .operationImg {
        line-height: 30px;
        display: flex;
        font-size: 14px;
        justify-content: space-between;

        .titleMessage {
          font-size: 16px;
        }

        .titleContent {
          display: flex;
          flex-direction: column;
        }
      }

      .mall-jiantou {
        padding-left: 30px;

        span {
          margin-top: 7px;
          display: inline-block;
        }
      }

      .operationSpan {
        padding: 0 15px;
        border-radius: 12px;
        color: #fff;
        line-height: 25px;
        height: 25px;
        font-size: 14px;
        display: inline-block;
      }

      .teDiv {
        line-height: 30px;
      }

      .operationDiv {
        line-height: 30px;
        /* height: 25px; */
        font-size: 14px;

        span {
          margin: 0 6px;
          font-size: 16px;
          color: #787878;
        }
      }
    }

    .te {
      border-bottom: none;
    }

    .maDiv {
      padding-bottom: 10px;

      p {
        text-align: center;
        color: #787878;
        font-size: 14px;
        margin-top: 0.3rem;
      }

      .ma {
        width: 150px;
        height: 150px;
        margin: 10px auto 10px auto;

        /deep/ .qrcode {
          width: 150px !important;
          height: 150px !important;
        }
      }
    }

    /deep/ .van-cell:not(:last-child)::after {
      right: 0.4rem;
    }

    .borDiv:not(:last-child)::after {
      border-bottom: 0;
    }

    .fa {
      /deep/ .van-field__control {
        text-align: right;
      }
    }

    .nei {
      /deep/ .van-field__control {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .p-Box {
    margin-top: 15px;

    .p {
      color: #878787;
      padding: 10px 0.4rem;
      line-height: 20px;

      /deep/ p {
        padding: 10px 0;
        line-height: 20px;
      }
    }
  }

  /deep/ .nav-content {
    overflow-y: auto !important;
  }

  .mall {
    color: #7e8c8d
  }
</style>
