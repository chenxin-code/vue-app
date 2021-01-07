<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="发票明细"></nav-top>
    <nav-content>
      <van-notice-bar :scrollable="true" v-if="paramsData.makeOutStatus == 1 && !paramsData.invoicePdfAddr">您在线下加油站完成的开票，线上无法下载查看。</van-notice-bar>
      <div class="publicInvoice">
        <van-cell-group>
          <div class="publicInvoiceDiv">
            <van-field label="开票状态" disabled/>
            <div class="mingxi" v-if="paramsData.makeOutStatus == 1 && loadPepdView ==true && paramsData.invoicePdfAddr" @click="lookPdf(paramsData.invoicePdfAddr)">
<!--            <div class="mingxi" v-if="paramsData.makeOutStatus == 1" @click="lookPdf('http://dzfp.sinopec.com/dzfp/fef7d373130127d2578d0cc41b2e8afab64871673e688471')">-->
              <span>{{paramsData.makeOutStatusName}}</span>
              <span class="img iconfont mall-gengduojiantou"></span>
            </div>
            <div class="mingxi" v-if="paramsData.makeOutStatus == 1 && loadPepdView ==false">
              <div class="copy-btn" ref="copybtn" :data-clipboard-text="paramsData.invoicePdfAddr" @click="copyCouNo">复制发票地址</div>
            </div>
          </div>
        </van-cell-group>
      </div>
      <div class="publicInvoice">
        <van-cell-group>
          <van-field v-model="paramsData.createTime" label="申请时间" disabled/>
          <van-field v-model="paramsData.email" label="电子邮箱" disabled/>
        </van-cell-group>
      </div>
      <div class="publicInvoice publicInvoice1">
        <van-cell-group>
          <van-field v-model="paramsData.amount+'元'" label="发票金额" disabled/>
          <router-link :to="{path:'/historyorderList',query:{id:id,orderTypeName: orderTypeName}}" v-if="$store.state.webtype != 2">
            <van-field v-model="neirong" label="发票内容" disabled/>
          </router-link>
          <van-field v-model="paramsData.title" label="发票抬头" disabled/>
          <van-field v-model="paramsData.orgTaxNo" label="发票税号" disabled/>
        </van-cell-group>
      </div>
      <div class="publicInvoice" v-if="paramsData.makeOutStatus">
        <van-cell-group>
          <van-field v-model="paramsData.invoiceCode" label="发票代码" disabled/>
          <van-field v-model="paramsData.invoiceNumber" label="发票号码" disabled/>
        </van-cell-group>
      </div>
      <div class="answer theme_bg_red" v-if="paramsData.makeOutStatus != 1" @click="emailData">申请修改接收邮箱</div>
      <div class="answer theme_bg_red" v-if="paramsData.makeOutStatus == 1 && paramsData.invoicePdfAddr" @click="emailData">重新发送到邮箱</div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  import ClipboardJS from 'clipboard';
  import Jsonp from 'jsonp'
  export default {
    name: "historyDetail",
    mixins: [api],
    data() {
      return {
        paramsData: {},
        neirong: '查看明细',
        id: '',
        orderTypeName: '',
        lastPath: '',
        src: '',
        loadPepdView: true
      }
    },
    created() {
      this.id = this.$route.query.id
      this.orderTypeName = this.$route.query.orderTypeName
      this.lastPath = this.$route.query.lastPath
      if (this.$store.state.webtype == 2) {
        this.loadPepdView = false
      } else {
        this.loadPepdView = true
      }
      this.loadData()
    },
    mounted() {

    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    components: {
    },
    methods: {
      lookPdf(params) {
        let that = this
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
        if (this.$store.state.webtype == 2) {
          if (isAndroid) {
            window.location.href = params
          } else {
            that.loadPepdView = false
          }
        } else {
          // if(isAndroid){
          //   console.log(1);
          //   that.$bridgefunc.readFileUseOs(params,'pdf')
          // } else {
          //   console.log(2);
          //   // window.location.href = params
          //   that.$bridgefunc.customPush({
          //     path: params,
          //     isnativetop: 1,
          //     superback: 1
          //   })
          // }
          that.$bridgefunc.openMobileBrowsers(params)
        }
      },
      copyCouNo() {
        this.copyBtn.on('success', (e) => {
          // this.$Toast('复制成功，请在浏览器中粘贴发票地址下载发票');
          this.$MessageBox.alert('复制成功，请在浏览器中粘贴发票地址下载发票!','提示')
        });
        this.copyBtn.on('error', function(e) {
          console.log(e);
        });
      },
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          id: that.id
        };
        that.histroydetailData(params).then(res => {
          if (res.data.result) {
            that.paramsData = res.data.data
            that.$nextTick(() => {
              if(that.$refs.copybtn){
                that.copyBtn = new ClipboardJS(that.$refs.copybtn);
              }
            })
          }
        });
      },
      emailData() {
        let that = this
        that.$router.push({
          path: '/modifyEmail',
          query: {
            id: that.id,
            email: that.paramsData.email,
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto 10px auto;

    .van-cell-group {
      /deep/ .van-field__control {
        text-align: right;
      }

      /deep/ .van-field__control:disabled {
        color: #323233;
      }
    }
  }

  .publicInvoiceDiv {
    display: flex;
    justify-content: space-between;

    .nei {
      /deep/ .van-field__control {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .mingxi {
      width 120px;
      display flex
      justify-content space-around
      align-items center

      span {
        font-size 0.37rem
      }

      .img {
        color: #999;
      }
    }
  }

  .publicInvoice1 {
    /deep/ .van-cell:nth-child(2) {
      input {
        color #F80F16 !important
      }
    }
  }

  .answer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 18px;
  }

  .pdfLink {
    color: #323233;
    margin auto
  }
</style>
