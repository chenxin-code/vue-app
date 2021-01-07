<template>
  <div class="mine-card-demand">
    <div class="card-num">
      <span class="item-left">加油卡卡号</span>
      <span class="item-right">{{cardInfo.cardNo}}</span>
    </div>
    <div class="data card-num">
      <span class="item-left" v-if="tag==2">充值日期</span>
      <span class="item-left" v-else-if="tag==1">消费日期</span>
    </div>
    <div class="time-picker">
      <div class="begin-time" @click="openStartDate()">
        <input type="text" :value="startDate" class="beginTimeInput" onfocus="this.blur();"/>
        <i class="icon-down"></i>
      </div>
      <span class="from">至</span>
      <div class="end-time" @click="openEndDate()">
        <input type="text" :value="endDate" class="endTimeInput" onfocus="this.blur();"/>
        <i class="icon-down"></i>
      </div>
    </div>
    <div class="submit">
      <button class="btn" @click="deMandFunc()">查询</button>
    </div>
    <mt-datetime-picker ref="picker1" type="date" :value="startDateM()" @confirm="handleChange1"></mt-datetime-picker>
    <mt-datetime-picker ref="picker2" type="date" :value="endDateM()" @confirm="handleChange2"></mt-datetime-picker>
  </div>
</template>

<script>
  import {DatetimePicker, Toast} from 'mint-ui'

  export default {
    name: 'mineCardDemand',
    components: {
      DatetimePicker,
      Toast
    },
    props: [
      'card',
    ],
    data() {
      return {
        cardInfo: {
          "cardBalance": "",
          "cardNo": "",
          "cardType": "",
          "cityName": "",
          "pointBalance": "",
          "reserveBalance": "",
          "totalBalance": ""
        },
        tag: 0,//1为消费查询，2为充值查询
        startDate: '',
        endDate: '',
      }
    },
    methods: {
      openStartDate: function () {
        this.$refs['picker1'].open();
      },
      openEndDate: function () {
        this.$refs['picker2'].open();
      },
      handleChange1(value) {
        this.startDate = this.$util.getMyDate(value)
      },
      handleChange2(value) {
        this.endDate = this.$util.getMyDate(value)
      },
      startDateM: function () {
        if (this.startDate != '') {
          let fullDate = this.startDate.split("-");
          return new Date(fullDate[0], fullDate[1] - 1, fullDate[2]);
        } else {
          return new Date();
        }
      },
      endDateM: function () {
        if (this.endDate != '') {
          let fullDate = this.endDate.split("-");
          return new Date(fullDate[0], fullDate[1] - 1, fullDate[2]);
        } else {
          return new Date();
        }
      },
      deMandFunc: function () {
        console.log(this.tag);
        if (this.tag == 1) {
          this.queryConsumeOrder();
        } else if (this.tag == 2) {
          this.queryRechargeOrder();
        }
      },
      getCookie: function () {
        return "4.3M";
      },
      queryConsumeOrder: function () {
        this.$Loading.open();
        let url = '/app/json/card/queryConsumeRecords';

        let _this = this;
        this.$http.post(url, {
          cardNo: this.cardInfo.cardNo,
          startDate: this.startDate,
          endDate: this.endDate,
          token: this.$store.state.login.token,
          cardType: this.cardInfo.cardType
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$bridgefunc.customPush({
                path: '/minecarddemandresult',
                isnativetop: 1,
                query: {
                  listJson: encodeURIComponent(JSON.stringify(data.data)),
                  cardNo: _this.cardInfo.cardNo,
                  startDate: _this.startDate,
                  endDate: _this.endDate,
                  tag: _this.tag
                }
              });

            } else {
              Toast({
                message: data.info ? data.info :'消费记录查询失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '消费记录查询失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      queryRechargeOrder: function () {
        this.$Loading.open();
        let url = '/app/json/card/queryRechargeRecords';

        let _this = this
        this.$http.post(url, {
          cardNo: this.cardInfo.cardNo,
          startDate: this.startDate,
          endDate: this.endDate,
          token: this.$store.state.login.token,
          cardType: this.cardInfo.cardType
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$bridgefunc.customPush({
                path: '/minecarddemandresult',
                isnativetop: 1,
                query: {
                  listJson: encodeURIComponent(JSON.stringify(data.data)),
                  cardNo: _this.cardInfo.cardNo,
                  startDate: _this.startDate,
                  endDate: _this.endDate,
                  tag: _this.tag
                }
              });

            } else {
              Toast({
                message: data.info ? data.info :'充值记录查询失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '充值记录查询失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      setOriginalDate:function () {
        var oDate = new Date(),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate();

        this.startDate = oYear + '-' + this.$util.getzf(oMonth-1) + '-' + this.$util.getzf(oDay);//最后拼接时间
        this.endDate = oYear + '-' + this.$util.getzf(oMonth) + '-' + this.$util.getzf(oDay);//最后拼接时间
      }

    },
    created() {
      this.tag = this.$route.query.tag ? this.$route.query.tag : 1
      if (this.tag == 1) {
        this.cardInfo = this.card;
        document.title = "消费记录查询"
      } else {
        document.title = "充值记录查询"
        this.cardInfo.cardNo = this.$route.query.cardNo
      }
      this.setOriginalDate();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  // @import '~@/common/stylus/my-mint.styl'
  .mine-card-demand {
    background-color: $color-background-lll;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .card-num {
      overflow: hidden;
      padding: 0px 3%;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      background: #fff;
      .item-left {
        float: left;
        color: $color-text;
        font-size $font-size-medium-x
      }
      .item-right {
        float: right;
        color: $color-text-l;
      }
    }
    .data {
      position: relative;
      margin-top: 10px;
      &:after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        content: '';
        background: #ddd;
        transform: scaleY(0.5);
        -webkit-transform: scaleY(0.5);
        z-index: 10;
      }
    }

    .time-picker {
      overflow: hidden;
      padding: 10px 3%;
      background: #fff;
      .begin-time {
        position: relative;
        float: left;
        width: 40%;
        padding-right: 8%
        .beginTimeInput {
          width: 100%;
          text-align: right;
          background: none;
          outline: none;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
        .icon-down {
          width: 16px;
          height: 16px;
          position: absolute;
          right: 0px;
          top: 5px;
          background: url("../../../assets/icon-down.png") 0px 0px no-repeat;
          background-size: 16px 16px;
        }
      }
      .from {
        float: left;
        width: 20%;
        text-align: center;
        font-size: $font-size-medium;
      }
      .end-time {
        position: relative;
        float: left;
        width: 32%;
        .endTimeInput {
          width: 100%;
          text-align: left;
          background: none;
          outline: none;
          color: #999;
          font-size: $font-size-medium;
        }
        .icon-down {
          width: 16px;
          height: 16px;
          position: absolute;
          right: 0px;
          top: 5px;
          background: url("../../../assets/icon-down.png") 0px 0px no-repeat;
          background-size: 16px 16px;
        }
      }
    }
    .submit {
      padding: 12px 3vh;
      .btn {
        width: 100%;
        background: $color-theme-btn-l;
        color: #fff;
        font-size: $font-size-medium-x;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        border: none;
        padding: 9px 0px;
      }
    }
  }

</style>
