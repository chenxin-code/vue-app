<template>
  <div class="body">
    <nav-top title="加油记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
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
            <div class="table-view">
              <div class="table-view-cell" @click="pingzheng(item)">
                <div class="table-view-cell-text">
                  <img src="static/image/janePay/iconn1.png" alt="">
                  <p>查看凭证</p>
                </div>
              </div>
<!--              <div class="table-view-cell" @click="invoice">-->
<!--                <div class="table-view-cell-text">-->
<!--                  <img v-if='!haveInvoice' src="static/image/janePay/icon2.png" alt="">-->
<!--                  <p v-if='!haveInvoice'>开具发票</p>-->
<!--                  <p v-if='haveInvoice' style="padding: 4px 0">已开票</p>-->
<!--                </div>-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  export default {
    name: "payList",
    mixins: [api],
    data() {
      return {
        haveInvoice: true,
        listObj: []
      }
    },
    mounted() {
      this.singList()
    },
    methods: {
      singList() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }
        that.orderData(params).then(res => {
          console.log(res);
          if (res.data.result == 'success') {
            that.listObj = res.data.data.orderList || []
          }
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
      invoice() {
        this.$router.push({
          path: '/assistantindex'
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .tipDiv {
    border-top 1px solid #e5e5e5;
  }

  .publicInvoice {
    border 1px solid #e9e9e9;
    border-radius 8px;
    /*box-shadow: #f3f3f3 0px 0px 15px;*/
    width: 95%;
    margin: 20px auto 10px auto;
    overflow: hidden;
    display flex;
    justify-content space-between;

    .div1 {
      width 80%;
      font-size 14px;
      display flex;
      display: -webkit-flex;
      flex-direction column;
      -webkit-flex-direction: column;
      border-right 1px solid #e5e5e5;
      margin 10px 0

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
      width 20%;
      display flex;
      /deep/ .table-view {
        margin auto
      }

      /deep/ .table-view-cell {
        padding 6px 0

        /deep/ .table-view-cell-text {
          display flex;
          display: -webkit-flex;
          flex-direction column;
          -webkit-flex-direction: column;

          img {
            width 20px;
            margin-bottom 5px;
          }
        }
      }

      a {
        color black
      }

    }
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>
