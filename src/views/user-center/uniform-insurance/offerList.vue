<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="我的报价单"></nav-top>
    <nav-content>
      <div>
        <div class="listView" v-for="(item,index) in list" :key="index" v-if="list.length>0">
          <p>{{item.createTime}}</p>
          <div class="publicInvoice">
            <div class="div1">
              <span>车牌号：{{item.licenseNo}}</span>
              <span class="red">{{item.stateStr}}</span>
            </div>
            <div class="div1">
              <span>申请单号</span>
              <span>{{item.tradeNo}}</span>
            </div>
            <div class="div1">
              <span>申请人</span>
              <span>{{item.carOwnerSurname}}</span>
            </div>
            <div class="div1">
              <span>手机号</span>
              <span>{{item.carOwnerPhone}}</span>
            </div>
            <div class="div1">
              <span>车架号</span>
              <span>{{item.frameNo}}</span>
            </div>
            <div class="div1">
              <span>发动机号</span>
              <span>{{item.engineNo}}</span>
            </div>
          </div>
        </div>
        <div v-show="titleView">
          <div class="publicInvoice public" v-if="list.length==0">
            <div class="emptyDiv">
              <img src="static/image/microShop/baojia2.png" alt="">
              <span>您还没有报价单！</span>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  import {Toast} from "vant"

  export default {
    name: "offerList",
    mixins: [api],
    data() {
      return {
        titleView: false, // 避免接口没加载完，极限是空状态
        list: [],
      }
    },
    created() {
      this.detailData()
    },
    methods: {
      detailData() {
        let that = this
        let params = {
          token: that.$store.state.login.token
        }

        that.offerlistData(params).then(res => {
          if (res.data.result === 'success') {
            that.titleView = true
            that.list = res.data.data || []
          } else {
            Toast(res.data.info)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;

    .listView {
      p {
        margin: 10px auto;
        text-align: center;
        background: white;
        line-height: 20px;
        width: 35%;
        border-radius: 10px;
        color: #717171;
      }
    }

    .publicInvoice {
      width: 95%;
      margin: 10px auto;
      overflow: hidden;
      font-size 16px;
      padding 20px 0
      background white;

      .emptyDiv {
        text-align center;
        font-size 16px;
        padding: 40px 0;

        img {
          width 200px;
          display block
          margin 0 auto
        }

        span {
          width: 80%;
          display: block;
          margin: 0 auto;
          line-height: 24px;
        }
      }

      .div1 {
        width: 95%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 15px 0;

        .red {
          color #fe0018 !important
        }

        span:nth-child(1) {
          flex 1
        }

        span:nth-child(2) {
          color #717171
        }
      }
    }

    .public {
      background: transparent;
    }
  }

  /deep/ .nav-content {
    overflow-y auto !important
  }

</style>
