/**Created by liaoyingchao on 2020-04-26.*/

<template>
  <div class="points-detail">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="bg-div">
        <div class="top-div">
          <div class="img-bg">
            <img src="static/image/microShop/bg1x.png">
          </div>
          <div class="top-info">
            <div class="order" @click="toOrder">订单查看</div>
            <div class="number">{{accountInfo.balanceUnit}}</div>
            <div class="type">爱心积分</div>
          </div>
        </div>
        <div class="btns-div">
          <div class="btn" :class="{'selected': payType == '100,300'}" @click="typeEvent('100,300')">
            <div class="number">+{{accountInfo.totalAddUnit}}</div>
            <div>获赠</div>
          </div>
          <div class="btn" :class="{'selected': payType == '200'}" @click="typeEvent('200')">
            <div class="number">-{{accountInfo.totalConsumeUnit}}</div>
            <div>花</div>
          </div>
        </div>
        <div class="list">
          <div class="cell" v-for="item in list">
            <div class="info">
              <div class="title single-line">{{item.orderTypeName}}</div>
              <div class="time single-line">{{item.paidTime}}</div>
            </div>
            <div class="number" v-if="item.amountUnit > 0">+{{item.amountUnit}}</div>
            <div class="number" v-else>{{item.amountUnit}}</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "points-detail",
    components: {},
    data() {
      return {
        accountInfo: {
          balanceUnit: 0
        },
        payType: 100,
        userId: '',
        vipUnitUserCode: '',
        list: []
      }
    },
    methods: {
      toOrder: function () {
        this.$router.push({
          path: '/mall2/orderlist',
          query: {
            orderCategory: 2,
            vipUnitUserCode: this.vipUnitUserCode
          }
        })
      },
      typeEvent: function (payType) {
        this.payType = payType
        this.getAccountPaymentList()
      },
      getAccountBaseInfo: function () {
        this.$Loading.open();
        let url = '/app/json/app_love_donation/getAccountBaseInfo';
        let paramsData = {
          userId: this.userId,
          acctType: '11'
        };
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.accountInfo = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getAccountPaymentList: function () {
        this.$Loading.open();
        let url = '/app/json/app_love_donation/getAccountPaymentList';
        let paramsData = {
          userId: this.userId,
          acctType: '11',
          payTypeCodes: this.payType
        };
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.list = data.data
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
    },
    created() {
      this.userId = this.$route.query.userId
      this.vipUnitUserCode = this.$route.query.vipUnitUserCode
      this.getAccountBaseInfo()
      this.getAccountPaymentList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .points-detail {
    width 100%
    height 100%
    overflow hidden
    .bg-div {
      width 100%
      height 100%
      background-color #efefef;
    }
    .top-div {
      height 140px;
      overflow hidden;
      position relative;
      .img-bg {
        width: 200%;
        height: 140px;
        position: absolute;
        left: -50%;
        top: 0;
        z-index 1
        content: '';
        overflow hidden;
        border-radius: 0 0 50% 50%;
        img {
          position absolute;
          left 25%;
          top 0px;
          width 50%
          height 100%;
        }
      }
      .top-info {
        position absolute;
        left 0;
        right 0;
        top 0;
        bottom 0;
        z-index 1;
        .order {
          position absolute;
          right 10px;
          top 10px;
          padding 6px 12px;
          background-color white;
          border-radius 12px;
          color #A43337;
        }
        .number {
          text-align center;
          margin-top 40px;
          font-size 28px;
          font-weight 600;
          color white;
        }
        .type {
          margin-top 8px;
          font-size 16px;
          text-align center;
          color white;
        }
      }
    }
    .btns-div {
      position relative;
      margin-top -28px;
      z-index 2;
      display flex;
      align-items center;
      justify-content space-between;
      padding 0 10px;
      .btn {
        width 173px;
        text-align center;
        background-color white;
        border-radius 5px;
        padding 10px;
        //margin 0 10px;
        font-size 13px;
        .number {
          font-size 16px;
          padding-bottom 6px;
        }
        &.selected {
          background-color #E8D6A0;
          color #6D4E1D;
        }
      }
    }
    .list {
      position absolute;
      top 178px;
      bottom 0;
      left 0;
      right 0;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      padding 0 10px;
      .cell {
        background-color white;
        border-radius 5px;
        display flex;
        align-items center;
        margin-bottom 10px;
        padding 10px;
        .info {
          flex 1;
          padding-right 10px;
          .title {
            font-size 14px;
            padding-bottom 6px;
          }
          .time {
            font-size 12px;
            color #999;
          }
        }
        .number {
          color #A43337;
          font-size 14px;
          font-size 600;
        }
      }
    }
  }
</style>
