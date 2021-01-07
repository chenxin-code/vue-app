/**Created by 黄金辉 on 2018/10/12.*/

<template>
  <div class="order-doing">
    <div class="block-div" v-for="item in infoArr">
      <div class="row" @click="invoiceClick(item)">
        <div class="icon-div">
          <img class="icon" v-if="item.islogo==1" src="static/image/invoice/qiye.png">
          <img class="icon" v-if="item.islogo==2" src="static/image/invoice/geren.png">
        </div>
        <div class="title">{{item.invoicetitle}}</div>
        <img class="arrows" src="static/image/invoice/arrows.png">
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';

  export default {
    name: "order-doing",
    components: {},
    data() {
      return {
        infoArr: [],
//        infoArr1: [{
//          icon: 'static/image/invoice/wodeuk.png',
//          title: '中国石油天然气股份有限公司',
//          path: '',
//        }]
      }
    },
    methods: {
      invoiceClick: function (item) {
        this.$bridgefunc.customPush({
          path: '/invoicettxq',
          isnativetop: '1',
          query: {
            invoiceInfo: encodeURIComponent(JSON.stringify(item)),
          },
        })
      },
      getInvoicetaitouList: function () {
        this.$Loading.open('请求中')
        let url = 'app/json/invoice/getInvoiceTitleList';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
          phone: this.$store.state.login.phone,
          nowIndex: 1
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.infoArr = data.data;

          } else {
            Toast({
              message: data.info ? data.info : '获取电子发票抬头列表失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('获取电子发票抬头列表失败', error)
          Toast({
            message: '获取电子发票抬头列表失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
    },
    created() {
      this.getInvoicetaitouList();
    },
    mounted() {
      let _this = this;
      this.$bridgefunc.registePageShow(function () {
        _this.getInvoicetaitouList();
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .order-doing {
    width 100%
    height 100%
    overflow hidden
    .block-div {
      margin 10px 10px 10px;
      border-radius 3px;
      box-shadow: 0px 0px 3px #ccc;
      padding 5px 0px;
      .row {
        padding 12px 10px;
        display flex;
        justify-content flex-start;
        align-items: center;
      }
      .icon-div {
        height 18px;
        width 18px;
        margin-right 5px;
        font-size 0px;
        display flex;
        justify-content center;
        align-items: center;

        .icon {
          max-width 18px;
          max-height 18px;
        }
      }

      .title {
        flex: 1;
        font-size $font-size-medium;
        color $color-text;
      }
      .arrows {
        margin-left 5px;
        width 6px;
        height 10px;
      }
    }
  }
</style>
