<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="deal-overview">
        <div class="left">
          <img src="../image/icon-personal.png" alt="" class="icon-personal">
          <span>{{ detailInfo.packageRefuelTypeName }}</span>
        </div>
        <div class="right">
          <van-icon
            @click="isShowFuncList = !isShowFuncList"
            name="weapp-nav"
            class="more-btn"/>
          <ul class="func-list" v-if="isShowFuncList">
            <li
              v-for="(item, index) in funcList"
              :key="index"
              class="item"
              @click="funcClick(item.value)">{{ item.text }}</li>
          </ul>
        </div>
      </div>
      <div class="other-content" @click="isShowFuncList = false">
        <div class="my-contract">
          <p class="title">我的合约</p>
          <div class="product-info" v-if="isSignUp">
            <p class="contract-name">{{ detailInfo.packageRefuelName }}</p>
            <div class="btm-prod-info">
              <div class="left-img">
                <img :src="detailInfo.packageRefuelPic" alt="">
              </div>
              <div class="right">
                <p class="name">{{ detailInfo.proDetail.skuName }}</p>
                <div class="price-container">
                  <p class="price">售价：{{ $util.toDecimal2(detailInfo.proDetail.salePrice) }}元</p>
                  <p class="back-price">到期时间：{{ detailInfo.endDate }}</p>
                </div>
              </div>
            </div>
            <div class="oil-drop-info">
              <div class="item">
                <p class="type-name">返利油滴数量</p>
                <span class="num">{{ $util.toDecimal2(detailInfo.proDetail.rebate) }}</span>
              </div>
              <div class="item">
                <p class="type-name">已激活油滴数</p>
                <span class="num">{{ $util.toDecimal2(detailInfo.activeAward) }}</span>
              </div>
              <div class="item">
                <p class="type-name">待激活数量</p>
                <span class="num">{{ $util.toDecimal2(Number(detailInfo.unactiveAward) - Number(detailInfo.activeAward)) }}</span>
              </div>
            </div>
          </div>
          <div class="not-sign-up" v-else>
            <img src="../image/icon-no-result.png" alt="" class="no-result">
            <p class="text">前往签约领取您的套餐权益吧~</p>
            <van-button
              type="primary"
              class="sign-up-btn"
              color="#F02C2D"
              round>前往签约</van-button>
          </div>
        </div>
        <div class="activation-record" v-if="isSignUp">
          <p class="title">激活记录</p>
          <div v-if="activationRecordList.length > 0">
            <ul class="record-list">
              <li
                class="item"
                v-for="(item, index) in activationRecordList"
                :key="index">
                <p class="line">
                  <span class="label">加油时间</span>
                  <span class="value">{{ item.tradeTime }}</span>
                </p>
                <p class="line">
                  <span class="label">加油金额</span>
                  <span class="value">{{ $util.toDecimal2(item.amount) }}元</span>
                </p>
                <p class="line">
                  <span class="label">激活油滴金额</span>
                  <span class="value">{{ $util.toDecimal2(item.activeAward) }}元</span>
                </p>
              </li>
            </ul>
            <div class="more-btn" @click="toMoreActivationRecord">更多记录&gt;</div>
          </div>
          <div class="no-result" v-else>
            <img src="../image/no-data.png" alt="">
            <p class="text">暂无数据~</p>
          </div>
        </div>
      </div>
    </nav-content>
    <!-- 退出套餐 -->
    <van-popup v-model="isShowExitConfirm" class="has-meal-popup">
      <p class="content">退出套餐将放弃当前未激活套餐权益，且下次开通合约套餐时将不再享有首次激活奖励</p>
      <div class="btn-container">
        <van-button
          color="#fff"
          class="cancel-btn"
          @click="exitPackage"
          type="primary">我确定退出</van-button>
        <van-button
          color="#F02C2D"
          class="confirm-btn"
          @click="isShowExitConfirm = false"
          type="primary">我再想想</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowFuncList: false,
      isSignUp: true,
      funcList: [
        {text: '套餐说明', value: 0},
        {text: '签约历史', value: 1},
        {text: '退出套餐', value: 2}
      ],
      packageId: -1,
      isShowExitConfirm: false,
      detailInfo: {
        proDetail: {}
      },
      activationRecordList: [],
    }
  },
  created() {
    if (this.$route.query.packageRefuelOrderId) {
      this.packageId = this.$route.query.packageRefuelOrderId
      this.initDetail()
      this.getActivationRecord()
    }
  },
  mounted() {},
  methods: {
    // 获取详情
    initDetail() {
      this.$Loading.open()
      this.$http.post('/app/json/app_package_refuel/queryPackageContract', {
        id: this.packageId
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data) {
            if (JSON.parse(data.data.proDetail) instanceof Array && JSON.parse(data.data.proDetail).length > 0) {
              data.data.proDetail = JSON.parse(data.data.proDetail)[0]
            } else {
              data.data.proDetail = JSON.parse(data.data.proDetail)
            }
          }
          this.detailInfo = data.data
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Loading.close()
        this.$Toast(`queryPackageContract err ${err}`)
      })
    },
    // 功能按钮点击
    funcClick(type) {
      if (type == 0) {
        // 套餐说明
        this.$router.push({
          path: '/package-description',
          query: {
            packageRefuelTypeName: this.detailInfo.packageRefuelTypeName,
            packageRefuelDesc: this.detailInfo.packageRefuelDesc
          }
        })
      } else if (type == 1) {
        // 签约历史
        this.$router.push({
          path: '/historical-signing'
        })
      } else if (type == 2) {
        // 退出套餐
        this.isShowExitConfirm = true
        this.isShowFuncList = false
      }
    },
    // 获取激活记录
    getActivationRecord() {
      this.$Loading.open()
      this.$http.post('/app/json/app_package_refuel/queryPackageRefuelOrderRecord', {
        page: 1,
        rows: 3,
        packageRefuelOrderId: this.packageId
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data instanceof Array && data.data.length > 0) {
            this.activationRecordList.push(...data.data)
          }
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Loading.close()
        this.$Toast(`queryPackageRefuelOrderRecord err ${err}`)
      })
    },
    // 退出套餐
    exitPackage() {
      this.$Loading.open()
      this.$http.post('/app/json/app_package_refuel/quitPackageContract', {
        id: this.packageId
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.isShowExitConfirm = false
          this.$Toast('退出成功！')
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Loading.close()
        this.$Toast(`quitPackageContract err ${err}`)
      })
    },
    // 更多激活记录
    toMoreActivationRecord() {
      this.$router.push({
        path: '/activation-record',
        query: {
          packageRefuelOrderId: this.packageId
        }
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .nav-content {
      background-color #F6F6F6;
      display flex;
      flex-direction column;
    }
    .other-content {
      overflow-y auto;
    }
    .deal-overview {
      width 100%;
      height 50px;
      background linear-gradient(180deg,rgba(255,193,118,1) 0%,rgba(255,141,65,1) 100%);
      padding 0 10px;
      display flex;
      justify-content space-between;
      align-items center;
      .left {
        display flex;
        align-items center;
        .icon-personal {
          display block;
          width 25px;
          height 25px;
        }
        span {
          font-size 16px;
          font-weight 500;
          color #fff;
          padding-left 5px;
        }
      }
      .right {
        position relative;
        .more-btn {
          color #fff;
          font-size 20px;
        }
        .func-list {
          position absolute;
          right 0;
          top 30px;
          width: 95px;
          padding 11px 15px;
          background-color #424242;
          border-radius 5px;
          transition all 2s;
          &::before {
            content '';
            display block;
            width 15px;
            height 15px;
            background-color #424242;
            position absolute
            right 3px;
            top -5px;
            border-radius 2px;
            transform rotate(45deg)
          }
          .item {
            font-size 15px;
            color #fff;
            margin-top 10px;
            text-align center;
            padding 3px 0;
            &:first-child {
              margin-top 0;
            }
          }
        }
      }
    }
    .my-contract {
      background-color #fff;
      margin-top 10px;
      padding 15px 10px;
      .title {
        font-size 15px;
        font-weight 500;
      }
      .product-info {
        padding 15px 10px;
        margin-top 10px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        .contract-name {
          font-size 15px;
        }
        .btm-prod-info {
          margin-top 10px;
          display flex;
          .left-img {
            width 75px;
            height 75px;
            overflow hidden;
            border-radius 4px;
            align-self center;
            img {
              display block;
              width 100%;
              height 100%;
            }
          }
          .right {
            flex 1;
            padding-left 5px;
            display flex;
            flex-direction column;
            justify-content space-between;
            color #333
            .name {
              font-size 14px;
              line-height 20px;
              ellipse-2();
            }
            .price,
            .back-price {
              font-size 12px;
            }
            .back-price {
              margin-top 8px;
            }
          }
        }
        .oil-drop-info {
          display flex;
          text-align center;
          justify-content space-around;
          margin-top 15px;
          bdr-t();
          .type-name {
            font-size 13px;
            color #333;
            padding-top 10px;
          }
          .num {
            display block;
            font-size 13px;
            font-weight 700;
            color #F02C2D;
            padding-top 5px;
          }
        }
      }
      .not-sign-up {
        .no-result {
          display block;
          width 180px;
          height 113px;
          margin 32px auto 0;
        }
        .text {
          font-size 13px;
          padding 10px 0;
          text-align center;
        }
        .sign-up-btn {
          display block;
          margin 25px auto 0;
          width 180px;
          .van-button__text {
            font-size 16px;
            font-weight 500;
          }
        }
      }
    }
    .activation-record {
      margin-top 10px;
      .title {
        font-size 15px;
        color #333;
        padding 10px;
        font-weight 700;
      }
      .record-list {
        .item {
          padding 10px;
          margin-top 10px;
          background-color #fff;
          &:first-child {
            margin-top 0;
          }
          .line {
            display flex;
            justify-content space-between;
            align-items center;
            padding-top 8px;
            &:first-child {
              padding-top 0;
            }
            .label {
              font-size 14px;
              color #666;
            }
            .value {
              font-size 15px;
              color #333;
            }
          }
        }
      }
      .more-btn {
        font-size 13px;
        color #F02C2D;
        padding 20px 0;
        text-align center;
        // extend-click();
      }
      .no-result {
        padding 30px 0;
        img {
          display block;
          width 200px;
          margin 0 auto;
        }
        .text {
          font-size 13px;
          text-align center;
          padding 10px 0;
          color #5f5e5e;
        }
      }
    }

    .has-meal-popup {
      width 280px;
      border-radius 6px;
      .content {
        font-size 13px;
        color #333;
        line-height 22px;
        padding 46px 49px 0;
        text-align center;
      }
      .btn-container {
        display flex;
        box-shadow 0 0 10px #ddd;
        margin-top 25px;
        .confirm-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #fff;
          }
        }
        .cancel-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #333;
          }
        }
      }
    }
  }
</style>