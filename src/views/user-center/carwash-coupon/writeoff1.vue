<template>
  <div v-if="pageView">
    <nav-top title="洗车劵使用" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="box" v-if="list.length>0">
        <div class="div1"><img src="static/image/microShop/che.png" alt=""><span>{{messageObj.storeOuName}}</span></div>
        <p class="p">优惠券选择</p>
        <div class="couponDiv">
          <ul>
            <li v-for="(item, index) in list" :key="index">
              <div class="coupon-left" :style="{backgroundImage:'url('+item.couPic+')'}">
                <!--                <div class="price-info"><span class="unit">￥</span> <span class="price">{{item.couThresholdAmount}}</span></div>-->
              </div>
              <div class="coupon-right">
                <div class="double-line"><span class="text">{{item.couTypeTitle}}</span></div>
                <div class="time-wrapper"><span class="time">{{item.startDate}}-{{item.endDate}}</span></div>
                <div class="status"></div>
                <div class="used">
                  <van-radio-group v-model="radioList" @change="selectData">
                    <van-radio :name="item" checked-color="#1989fa"></van-radio>
                  </van-radio-group>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="nodata" v-if="list.length==0">暂无数据</div>
    </nav-content>
    <div class="bottomTab" v-if="list.length>0">
      <div class="left1">
        <p>已选劵1（张）</p>
        <p>优惠券金额<span class="span">{{totalMoney}}</span>元</p>
      </div>
      <div class="left theme_bg_red right" @click="commit">
        <div>
          <span>确定使用</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from './api'
  import {Toast} from "vant"

  export default {
    name: "writeoff1",
    mixins: [api],
    data() {
      return {
        radioList: {},
        list: [],
        messageObj: {},
        totalMoney: 0,
        dynamicCode: '',
        obj: {},
        pageView: true,
      }
    },
    created() {
      this.messageObj = JSON.parse(this.$route.query.codeObj)
    },
    mounted() {
      if (this.messageObj.nodeType == 5) {
        this.pageView = true
        this.loadData()
      } else {
        this.pageView = false
        Toast('格式错误')
      }
    },
    methods: {
      selectData() {
        let that = this
        that.totalMoney = 0
        console.log(that.radioList);
        that.dynamicCode = that.radioList.dynamicCode
        that.totalMoney = that.radioList.couFaceValue
      },
      loadData() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          storeOuCode: that.messageObj.storeOuCode
        }
        console.log('入参',params);

        that.writelistData(params).then(res => {
          if (res.data.result === 'success') {
            that.list = res.data.data || []
          } else {
            Toast(res.data.info)
          }
        })
      },
      commit() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          storeOuCode: that.messageObj.storeOuCode,
          // storeOuCode: '1098002001003001001',
          dynamicCode: that.dynamicCode
        }

        that.writeData(params).then(res => {
          if (res.data.result === 'success') {
            that.obj = res.data.data || {}
            that.$router.push({
              path: '/user_center/writeoff2',
              query: {
                obj: JSON.stringify(that.obj)
              }
            })
          } else {
            Toast(res.data.info)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .box {
    .div1 {
      display flex;
      justify-content center
      height 40px;
      line-height 40px;
      margin 15px 0

      img {
        width: 40px;
        height 40px;
        vertical-align: middle;
      }

      span {
        font-size 18px;
        margin-left 6px;
      }
    }

    .p {
      font-size 16px
      padding: 0.213333rem;
    }

    .couponDiv {
      padding: 0.213333rem;
      box-shadow: 0 0 0.24rem 0 rgba(197, 197, 197, 0.3);
      border-radius: 0.106667rem;
      overflow: hidden;
      display: flex;

      ul {
        width 100%

        li {
          display: flex;
          justify-content space-between
          height: 2.666667rem;
          margin-bottom 8px;

          .coupon-left {
            width: 3.2rem;
            text-align: center;
            padding: 0.373333rem 0.266667rem;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background-size: 100% 100% !important;
            background-repeat: no-repeat !important;
            background: radial-gradient(circle, #ffb507, #ff8a09);

            .price-info {
              flex-shrink: 0;

              .unit {
                font-size: 0.64rem;
              }

              .price {
                font-size: 1.2rem;
                font-weight: 600;
                margin-left: -0.213333rem;
              }
            }

          }

          .coupon-right {
            padding: 0.213333rem;
            padding-right: 0.48rem;
            flex: 1;
            font-size: 0.373333rem;
            position: relative;
            overflow: hidden;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .double-line {
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              display: flex;
              line-clamp: 2;
              box-orient: vertical;

              .text {
                vertical-align: middle;
                line-height: 0.533333rem;
              }
            }

            .time-wrapper {
              padding-top: 0.16rem;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .time[data-v-fd3c4848] {
                font-size: 0.32rem;
                color: #999;
              }
            }

            .status {
              font-size: 0.266667rem;
              color: #999;
              padding-top: 0.213333rem;
              display: flex;
              justify-content: space-between;
            }

            .used {
              position: absolute;
              right: 0.266667rem;
              top: 50%;
              transform: translateY(-50%);
            }

          }
        }
      }
    }
  }

  .bottomTab {
    border-top: 1px solid #ebedf0;
    position: fixed;
    height: 65px;
    bottom: 0;
    width: 100%;
    background: white;
    left: 0;
    display: flex;
    justify-content: space-between;

    .left {
      margin: auto 10px;
      font-size 16px;
      color black
      display flex;
      justify-content center
      width: 90px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
    }

    .left1 {
      text-align center
      display flex;
      flex-direction column
      margin auto;
      margin-left 20px;
      font-size 15px;

      span {
        color #f02c2e;
      }

      p {
        margin-top 6px;
      }
    }

    .right {
      color white
    }
  }

  .nodata {
    font-size: 20px;
    margin: 80px auto;
    text-align: center;
  }

  /deep/ .nav-content {
    overflow-y auto !important;
    margin-bottom 95px;
  }
  /deep/ .van-radio__icon .van-icon {
    border: 1px solid #1989fa !important;
  }
</style>
