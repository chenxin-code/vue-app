<template>
  <div class="body">
    <nav-top title="无感加油" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <div class="tip">
          <p class="p">开通流程</p>
          <ul>
            <li><span>1</span>在线签约&nbsp;&nbsp;</li>
            <li><span>2</span>关联银行卡（开通免密..）</li>
            <li><span>3</span>签约成功</li>
          </ul>
        </div>
      </div>
      <div class="enterBox">
        <div class="table-view">
          <div class="table-view-cell" @click="sign">
            <div class="table-view-cell-text">
              <img src="static/image/janePay/icon_signing.png" alt="">
              <span>在线签约</span>
            </div>
          </div>
          <div class="table-view-cell" @click="manage">
            <div class="table-view-cell-text">
              <img src="static/image/janePay/icon_manage.png" alt="">
              <span>签约管理</span>
            </div>
          </div>
          <div class="table-view-cell" @click="record">
            <div class="table-view-cell-text">
              <img src="static/image/janePay/icon_record.png" alt="">
              <span>记录查询</span>
            </div>
          </div>
          <div class="table-view-cell" @click="getCode" v-if="$store.state.globalConfig.station_verificationode == 1">
            <div class="table-view-cell-text">
              <img src="static/image/janePay/icon-you.png" alt="">
              <span>建行验证码获取</span>
            </div>
          </div>
          <div class="table-view-cell"></div>
        </div>
      </div>
      <router-link to="/jane/payList" v-if='listObj.length>0'>
        <div class="payDiv">
          <div>无感加油交易记录（最近3笔）</div>
          <div>更多 》</div>
        </div>
      </router-link>
      <div class="publicInvoice" v-for="(item,index) in listObj" :key="index" v-if='listObj.length>0 && index<3'>
        <div class="div1">
          <div>
            <span>{{item.ouName}}</span>
            <span>{{item.completeTime}}</span>
          </div>
          <p>支付金额</p>
          <p>￥{{item.payAmount}}</p>
        </div>
        <div class="div2">
          <div class="action-content" @click="pingzheng(item)">
            <div class="image"><img src="static/image/janePay/iconn1.png" alt=""></div>
            <p>查看凭证</p>
          </div>
          <div class="action-content" @click="invoice(item)">
            <template v-if="item.invoiceUse == 0">
              <div class="image"><img src="static/image/janePay/icon2.png" alt=""></div>
              <p>开具发票</p>
            </template>
            <p v-else>已开票</p>
          </div>
        </div>
      </div>
      <div v-show="titleView">
        <p class="nullData" v-show="listObj.length==0">暂无交易记录</p>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from "./api"
  export default {
    name: "index",
    mixins: [api],
    data() {
      return {
        haveInvoice: true,
        listObj: [],
        titleView: false,
      }
    },
    mounted() {
      if (this.$route.query.code && this.$route.query.state) {
        this.ABCThirdAutoLogin()
      } else {
        this.singList()
      }
    },
    methods: { 
      ABCThirdAutoLogin() {
        this.$http.post('/app/json/login/ABCThirdAutoLogin', { 
          code: this.$route.query.code,
          state: this.$route.query.state
        }).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$userCenter.saveLoginData(data.data)
            this.singList()
          } else {
            this.$Toast(data.info) 
          }
        }).catch(err => {
          this.$Toast(`ABCThirdAutoLogin err ${err}`)
        })
      },
      backEvent() {
        this.$router.push({
          path: '/common'
        })
      },
      singList() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }
        that.orderData(params).then(res => {
          if (res.data.result == 'success') {
            that.titleView = true
            that.listObj = res.data.data.orderList || []
          }
        })
      },
      sign() {
        this.$router.push({
          path: '/jane/signing'
        })
      },
      manage() {
        this.$router.push({
          path: '/jane/label_management'
        })
      },
      record() {
        this.$router.push({
          path: '/jane/record_query'
        })
      },
      getCode() { //建行获取验证码
        this.$router.push({
          path: '/jane/verificationCode'
        })
      },
      pingzheng(params) {
        this.$router.push({
          path: '/jane/vouchersDetail',
          query: {
            listObj: JSON.stringify(params)
          }
        })
      },
      invoice(item) {
        if (item.invoiceUse == 0) { //未开票情况下
          this.$router.push({
            path: '/openinvoiceDetail',
            query: {
              idArray: [item.id], //所选的id 集合
              orderList: [item],
              totalMoney: item.payAmount,
              type: 'appOrder',
              source: 'janeIndex'
            }
          })
        }
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/lines.styl"

  .tipDiv {
    border-top 1px solid #e5e5e5;

    .tip {
      width 94%;
      margin 10px auto;
      padding 10px 8px;
      background #fff1ce;
      color #df7222
      border-radius 6px

      .p {
        color: #be933d
        margin-bottom 8px;
      }

      ul {

        display flex;

        li {
          height 20px;
          line-height 20px;

          span {
            background #fc6900;
            color white;
            border-radius 50%;
            display inline-block
            width 16px;
            height 16px;
            text-align center;
            line-height 16px;
          }
        }
      }
    }

  }

  .enterBox {
    width 94%;
    margin 10px auto;
    font-size 14px;

    /deep/ .table-view .table-view-cell .table-view-cell-text {
      justify-content start

      img {
        width 30px;
        margin-right 16px;
      }
    }

    a {
      color black;
    }
  }

  .payDiv {
    width 94%;
    margin 24px auto;
    display flex;
    font-size 14px;
    justify-content space-between;

    div:nth-child(2) {
      font-size 12px;
      color: #4c4847;
    }
  }

  .publicInvoice {
    border 1px solid #e9e9e9;
    border-radius 8px;
    /*box-shadow: #f3f3f3 0px 0px 15px;*/
    width: 95%;
    margin: 0 auto 10px auto;
    overflow: hidden;
    display flex;
    justify-content space-between;

    .div1 {
      width 80%;
      font-size 14px;
      display flex;
      flex-direction column;
      border-right 1px solid #e5e5e5;
      margin 10px 0
      flex-shrink:0;

      div {
        width 92%
        margin auto
        color #898989
        display flex;
        justify-content space-between;
      }

      p {
        color #4d4948;
        text-align center
        margin auto
      }

      p:nth-child(2) {
        margin 12px auto;
      }

      p:nth-child(3) {
        font-size 18px;
        font-weight 600
      }
    }

    .div2 {
      flex:1;
      display:flex;
      flex-direction:column;
      align-items:center;
      .action-content{
        padding:6px 0;
        text-align center
        font-size:0;
        .image{
          margin-bottom:5px;
          img{
            width 20px
          }
        }
        p{
          font-size:12px;
        }
        +.action-content{
          line_top()
        }
      }
    }
  }
  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>
