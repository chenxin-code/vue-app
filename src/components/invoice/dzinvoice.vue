/**Created by 黄金辉 on 2018/10/12.*/

<template>
  <div class="dzinvoice">
    <ul class="addressInfo">
      <div class="block-divs">
        <div class="row row-s">
          <span class="title">开票日期</span>
          <span class="label">{{invoiceInfo.kprq}}</span>
        </div>
        <div class="row row-s">
          <span class="title">纳税人识别号</span>
          <span class="label">{{invoiceInfo.xsfnsrsbh}}</span>
        </div>
        <div class="row row-s">
          <span class="title">销售方</span>
          <span class="label">{{invoiceInfo.xsfmc}}</span>
        </div>
        <div class="row row-s">
          <span class="title">销售方地址</span>
          <span class="label">{{invoiceInfo.xsfdz}}</span>
        </div>
        <div class="row row-s">
          <span class="title">购买方</span>
          <span class="label">{{invoiceInfo.gmfmc}}</span>
        </div>
        <div class="row row-s">
          <span class="title">购买方识别号</span>
          <span class="label">{{invoiceInfo.gmfnsrsbh}}</span>
        </div>
        <div class="row row-s">
          <span class="title">购买方性质</span>
          <span class="label">{{invoiceInfo.gmfxz}}</span>
        </div>
        <div class="row row-s">
          <span class="title">发票代码</span>
          <span class="label">{{invoiceInfo.fpdm}}</span>
        </div>
        <div class="row row-s">
          <span class="title">发票号码</span>
          <span class="label">{{invoiceInfo.fphm}}</span>
        </div>
        <div class="row row-s">
          <span class="title">交易日期</span>
          <span class="label">{{invoiceInfo.jyrq}}</span>
        </div>
        <div class="row row-s">
          <span class="title">合计金额</span>
          <span class="label">{{invoiceInfo.hjje}}</span>
        </div>
        <div class="row row-s">
          <span class="title">合计税额</span>
          <span class="label">{{invoiceInfo.hjse}}</span>
        </div>
      </div>
    </ul>
    <div class="btns">
      <span class="btn" @click="previewClick">预览</span>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';

  export default {
    name: "dzinvoice",
    components: {
      Toast,
    },
    data() {
      return {
        invoiceInfo: {},
//        infoArr: [{
//          title: '开票日期',
//          label: '2017-08-25'
//        }, {
//          title: '纳税人识别号',
//          label: '110192562134916'
//        }, {
//          title: '销售方',
//          label: '三只松鼠公司'
//        }, {
//          title: '销售方地址',
//          label: '北京市昌平区'
//        }, {
//          title: '购买方',
//          label: '北京爱信诺信息技术有限公司'
//        }, {
//          title: '购买方识别号',
//          label: '2010192562134916'
//        }, {
//          title: '购买方性质',
//          label: '企业'
//        }, {
//          title: '发票代码',
//          label: '1111001371071'
//        }, {
//          title: '发票号码',
//          label: '31971527'
//        }, {
//          title: '交易日期',
//          label: '2017-08-05'
//        }, {
//          title: '合计金额',
//          label: '112.00'
//        }, {
//          title: '合计税额',
//          label: '2.00'
//        },
//        ],
      }
    },
    methods: {
      previewClick: function () {
        this.$bridgefunc.customPush({
          path: '/preview',
          isnativetop: '1',
          query: {
            invoiceInfo: encodeURIComponent(JSON.stringify(this.invoiceInfo)),
          }
        })
      },
      backEvent: function () {
        this.$bridgefunc.customGo(-1)
      },
      getInvoiceDetail: function (invoiceInfo) {
        this.$Loading.open('请求中')
        let url = 'app/json/invoice/getInvoiceDetail';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
          id: invoiceInfo.id,
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.invoiceInfo = data.data;
//            let canvas = document.getElementById('canvas');
//            QRCode.toCanvas(canvas, _this.invoiceInfo.qrCode, function (error) {
//              if (error) console.error(error);
//              console.log('success!');
//            })
          } else {
            Toast({
              message: data.info ? data.info : '获取电子发票详情失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('获取电子发票详情失败', error)
          Toast({
            message: '获取电子发票详情失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      }
    },
    created() {
      let invoiceInfo = JSON.parse(decodeURIComponent(this.$route.query.invoiceInfo));
      this.getInvoiceDetail(invoiceInfo);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .dzinvoice {
    width 100%
    overflow hidden
    background-color: #fff;
    .addressInfo {
      left 0px;
      right 0px;
      overflow-y scroll
      -webkit-overflow-scrolling touch;

    }
    .btns {
      background: #fe6902;
      height: 40px;
      line-height: 40px;
      border: 1px solid #fe6902;
      font-size: $font-size-medium-x;
      text-align: center;
      border-radius 20px
      margin 0px 10px
      .btn {
        height: 40px;
        line-height: 40px;
        border-color: #fe6902;
        color: #fff;
        font-weight: 600;
      }
    }
    .block-divs {
      border-top 3px solid #d3d3d4
    }
    .block-divs {
      margin 10px 10px 10px;
      border-radius 3px;
      box-shadow: 0px 0px 3px #ccc;
      padding 5px 0px;
      .row-s:first-child {
        border-bottom 1px solid #f3ecec
        padding 10px 10px
      }
      .row-s {
        padding 4px 10px;
        .title {
          flex: 1;
          font-size 14px;
          color #9fa0a0;

        }
        .label {
          font-size 14px
          color #4c4948
          float right
        }
      }
    }
  }
</style>
