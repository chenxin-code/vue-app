<template>
  <div>
    <!-- header -->
    <nav-top title="选择账单" @backEvent="backEvent"></nav-top>
    <nav-content class="chooseBill" v-show="pageInitShow">
      <van-pull-refresh v-model="isLoading" :disabled="disabled" :success-duration="1000" @refresh="mocData(true)" class="bill-list-content">
        <div class="billtop">
          <div class="oil-name">
            <p class="text">{{oilName}}<img src="./images/icon_GasStation.png" alt=""></p>
          </div>
          <div class="oil-name">
            <p class="text">{{gunNo}}号油枪<img src="./images/icon_OilGun.png" alt=""></p>
          </div>
          <div class="oil-name" v-if="tankOilName">
            <p class="text">{{tankOilName}}<img src="./images/icon_oil.png" alt=""></p>
          </div>
        </div>
        <div class="bill-list-wrapper" @scroll="listScroll" v-if="billList.length">
          <div class="bill-list">
            <div class="bill-item" v-for="(item, index) in billList" :key="index" v-show="showAll || index < 1">
              <div class="item">
                <span class="label">加油金额</span>
                <span class="con price">￥{{item.amount}}</span>
              </div>
              <div class="item">
                <span class="label">加油时间</span>
                <span class="con">{{item.getTime}}</span>
              </div>
              <div class="item">
                <span class="label">加油升数</span>
                <span class="con">{{item.liter}}L</span>
              </div>
              <div class="item">
                <span class="label">TTC</span>
                <span class="con">{{item.posTtc}}</span>
              </div>
              <div class="item">
                <span class="label">员工卡号后六位</span>
                <span class="con">{{refuelCardNo(item)}}</span>
              </div>
              <div class="item pay-btn">
                <!--<span class="label">查看详情并确认支付</span>-->
                <div class="con check-detail" @click="goFirmDet(item)">查看详情并确认支付</div>
              </div>
            </div>
          </div>
          <div class="more-bill" @click="showAll = !showAll">
            <i class="iconfont mall-xialasanjiao" :class="{active: showAll}"></i>
            <span class="text">{{showAll ? '点击收起' : '查看更多订单'}}</span>
          </div>
        </div>
        <div class="no-data" v-else>暂无订单记录~</div>
      </van-pull-refresh>
      <div v-if="instructionTip" class="help-mask">
        <van-icon class="icon" @click="closeTip" name="cross"/>
      </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        oilName: '',
        gunNo: '',
        detailList: [],
        billList: [], // 账单列表
        showAll: false,
        pageInitShow: false,
        tankOilName: '',
        instructionTip: false,
        isLoading: false,
        disabled: false
      };
    },
    computed: {
      word: function () {
        if (this.showAll == false) { //对文字进行处理
          return '更多'
        } else {
          return '点击收起'
        }
      }
    },
    mounted() {
      this.oilName = this.$route.query.oilName // 油站名称
      this.gunNo = this.$route.query.gunNo // 油枪编码
      this.tankOilName = this.$route.query.tankOilName
      this.ouCode = this.$route.query.ouCode // 油站编码
      // const data = {
      //   "status": 0,
      //   "result": "success",
      //   "info": "",
      //   "data": [
      //     {
      //       "id": 17744,
      //       "jzDate": "",
      //       "workNo": "",
      //       "macNo": 1,
      //       "machineOilNo": "1032",
      //       "normalOilNo": "60000305",
      //       "takeDate": 1546915550000,
      //       "ctc": 25157,
      //       "gunNo": 1,
      //       "tankNo": 2,
      //       "tankOilNo": "60518722",
      //       "liter": 15.6,
      //       "price": 6.41,
      //       "amount": 100,
      //       "pumpNo": 3290980.51,
      //       "getTime": 1546915597000,
      //       "ouCode": "1000612001002008",
      //       "uniCode": "33000450",
      //       "comDlTime": "",
      //       "comUpTime": "",
      //       "tankOilName": "92号车用汽油（VIA）",
      //       "oilName": ""
      //     }
      //   ],
      //   "errorCode": "",
      //   "page": "",
      //   "totalPages": "",
      //   "totalRecords": "",
      //   "stackInfo": "",
      //   "currentTime": "2018-12-30 14:56:55"
      // }
      // this.billList = data.data
      // this.pageInitShow = true
      this.init()
    },
    methods: {
      init() {
        if (this.$store.state.oilPayBillInstructionTip != 1) {
          this.instructionTip = true
        }
        this.mocData();
      },
      listScroll(e) {
        this.disabled = e.target.scrollTop !== 0
      },
      closeTip() {
        this.$store.state.oilPayBillInstructionTip = 1
        this.$bridgefunc.vuexStorage()
        this.instructionTip = false
      },
      // 关于nav-top部分
      backEvent: function () {
        this.$router.go(-1)
      },
      refuelCardNo(item) {
        let num = item.cardNo || ''
        return num.slice(-6) || "";
      },
      // 关于账单数据部分
      mocData(isRefresh) {
        this.$Loading.open();
        let url = '/app/json/refuel_center/getRefuelRecord';
        let submitData = {
          ouCode: this.ouCode,
          gunNo: this.gunNo,
          token: this.$store.state.login.token
        }
        if (this.$route.query.account) {
          submitData.tradingAmt = this.$route.query.account
        }
        this.$http.post(url, {refuelCheckoutRecordModel: submitData}).then(
          res => {
            this.pageInitShow = true
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.billList = data.data || []
              if (isRefresh) {
                this.$Toast('刷新成功！')
              }
            } else {
              this.$Toast(data.info);
            }
            this.isLoading = false
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },

      // 转化时间戳
      changeTime(value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      },

      // 跳转到订单页
      goFirmDet(item) {
        this.$router.push({
          path: '/payOrder',
          query: {
            uniCode: item.uniCode, // 油站编码
            ouCode: item.ouCode,
            tankOilName: item.tankOilName,
            oilName: this.$route.query.oilName,
            recordId: item.id, // 加油记录id
            posTtc: item.posTtc,
            gunNo: this.gunNo,

            kshopOrgid: this.$route.query.kshopOrgid || '',
            kshopGasoilno: this.$route.query.kshopGasoilno || '',
            rfrCode: this.$route.query.rfrCode || ''
          }
        })
      }
    }
  };
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/mixin'
  .chooseBill {

  }

  .bill-list-content {
    width: 100%;
    padding-bottom: 5px;
    height 100%

    /deep/ .van-pull-refresh__track {
      height 100%;
      flex-direction column
      display: flex
    }
  }

  .chooseBill .billtop {
    border-radius 4px;
    overflow: hidden
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    margin: 0 10px;
    margin-top: 8px;
    padding 11px 15px;
    position: relative
    flex-shrink 0
    z-index: 99;
    background: white;

    .oil-name {
      font-size: 14px;

      & + .oil-name {
        padding-top: 10px;
      }

      img {
        width: 22px;
        vertical-align: middle;
        position: absolute
        left: 0;
        top: 0;
      }

      .text {
        vertical-align middle
        line-height: 21px;
        padding-left: 30px;
        position: relative
      }
    }

  }

  .bill-list-wrapper {
    overflow: hidden
    flex 1
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;

    .more-bill {
      height 40px
      line-height: 40px;
      text-align: center
      color: #999;

      .iconfont {
        font-size: 22px;
        display inline-block
        vertical-align: middle
        transition all 0.5s

        &.active {
          transform-origin center center
          transform rotateZ(180deg)
        }
      }

      .text {
        padding-left: 2px;
        font-size: 14px;
        vertical-align: middle
      }
    }

    .check-detail {
      font-size: 14px;
      text-align: center;
      /*border: 1px solid #f02c2d*/
      background-color: #f02c2d;
      padding: 0.186rem 0.26rem;
      border-radius: 0.4rem;
      color: #fff
    }
  }

  .bill-list {
    padding 8px 10px;
    /*overflow-y auto
    -webkit-overflow-scrolling touch
    height calc(100% - 40px)*/

    .bill-item {
      border-radius 4px;
      overflow: hidden
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      padding 0 15px;
      position: relative

      & + .bill-item {
        margin-top: 8px;
      }

      .item {
        padding: 15px 0;
        overflow: hidden

        .label {
          float: left
        }

        .con {
          float: right
        }

        .price {
          color: #f02c2d
        }
      }

      .pay-btn {
        bdr-t()
        color: #f02c2d
        padding 12px 0
      }
    }
  }

  .help-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index 999;
    background: rgba(0, 0, 0, 0.4) url('./images/mask-bg.png') no-repeat
    background-size: 90% auto;
    background-position center 30px

    .icon {
      position: absolute;
      top: 20px;
      right 20px;
      color #fff;
      font-size: 28px;
    }
  }
</style>
