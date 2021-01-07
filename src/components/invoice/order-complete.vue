/**Created by 黄金辉 on 2018/10/12.*/

<template>
  <div class="order-complete">
    <div class="block-div" v-for="item in infoArr">
      <div class="row" @click="invoiceClick(item)">
        <div class="icon-div">
          <img class="icon" src="static/image/invoice/icon_invoice.png">
        </div>
        <div class="text">
          <p class="label">增值税普通电子发票</p>
          <p class="title">{{item.gmfmc}}</p>
        </div>
        <img class="arrows" src="static/image/invoice/arrows.png">
      </div>
    </div>
    <!--<div class="block-div">-->
    <!--<div class="row" v-for="item in infoArr1">-->
    <!--<div class="icon-div">-->
    <!--<img class="icon" :src="item.icon">-->
    <!--</div>-->
    <!--<div class="text">-->
    <!--<p class="label">{{item.label}}</p>-->
    <!--<p class="title">{{item.title}}</p>-->
    <!--</div>-->
    <!--<img class="arrows" src="static/image/invoice/arrow.png">-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {  Toast } from 'mint-ui';

  export default {
    name: "order-complete",
    components: {},
    data() {
      return {
        infoArr: [
//          {
//          icon: 'static/image/invoice/wodeuk.png',
//          label:'增值税普通电子发票',
//          title: '北京爱信诺信息技术有限公司',
//          path: '',
//        }
        ],
//        infoArr1: [{
//          icon: 'static/image/invoice/wodeuk.png',
//          label: '增值税普通电子发票',
//          title: '北京尚博信科技有限公司',
//          path: '',
//        }]
      }
    },
    methods: {
      invoiceClick: function (item) {
        this.$bridgefunc.customPush({
          path: '/dzinvoice',
          isnativetop:'1',
          query: {
           invoiceInfo:encodeURIComponent(JSON.stringify(item)),
          },
        })
      },
      getInvoiceList: function () {
        this.$Loading.open('请求中')
        let url = 'app/json/invoice/getInvoiceList';
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
              message: data.info ? data.info : '获取电子发票列表失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('获取电子发票列表失败', error)
          Toast({
            message: '获取电子发票列表失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
    },
    created() {
      this.getInvoiceList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .order-complete {
    width 100%
    height 100%
    overflow hidden
    .block-div {
      margin 10px 10px 10px;
      border-radius 3px;
      box-shadow: 0px 0px 3px #ccc;
      padding 5px 0px;
      .row {
        padding 7px 10px;
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
      .text {
        flex: 1;
        .label {
          font-size 12px
          color: #9fa0a0

        }
        .title {
          font-size 14px;
          color #4c4948
          padding 5px 0

        }
      }
      .arrows {
        margin-left 5px;
        width 6px;
        height 10px;
      }
    }
  }
</style>
