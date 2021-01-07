<template>
  <div class="returninggoods">
    <nav-top @backEvent="turnback" :title="pageTitle"></nav-top>
    <nav-content v-if="isShow">
      <div class="scroll-info" ref="returnservicescrl">
        <div class="padding-con shadow-cell">
          <goods-cell :goods-info="orderInfo"></goods-cell>
        </div>
        <div class="padding-con shadow-cell">
          <p class="bigtitle">收件人信息</p>
          <div class="detail-info" v-for="info in recipient">
            <p class="left-title commontitle theme_font_common">{{info.title}}</p>
            <p class="right-value theme_font_gray">{{info.value}}</p>
          </div>
        </div>
        <div class="padding-con shadow-cell">
          <p class="bigtitle">物流信息</p>
          <div class="input-cell">
            <p class="left-info commontitle theme_font_common">物流公司</p>
            <input class="input-info theme_bg_white_ef" placeholder="请输入物流公司" type="text" v-model="returnExpress"/>
          </div>
          <div class="input-cell">
            <p class="left-info commontitle theme_font_common">物流单号</p>
            <input class="input-info theme_bg_white_ef" placeholder="请输入物流单号" type="text" v-model="returnOrderId"/>
          </div>
        </div>
        <div class="padding-con shadow-cell">
          <p class="bigtitle">{{tipTitle}}</p>
          <div class="policy-con">
            <p class="commontitle theme_font_common" v-for="tip in returnpolicy">{{tip}}</p>
          </div>
        </div>
        <div class="padding-con shadow-cell">
          <div class="detail-info" v-for="order in orderinfos" v-if="order.value.length">
            <p class="left-title commontitle theme_font_common">{{order.title}}</p>
            <p class="right-value theme_font_gray">{{order.value}}</p>
          </div>
        </div>
      </div>
      <div class="submit-btn theme_bg_red theme_font_white" @click="submitClick"><p>提交</p></div>
    </nav-content>
  </div>
</template>

<script>
  import GoodsCell from '../common/goods-cell'

  export default {
    name: 'returninggoods',
    components: {
      GoodsCell
    },
    data() {
      return {
        returnExpress: '',
        returnOrderId: '',
        orderInfo: {},
        returnpolicy: [
          [
            '亲爱的客户您好：',
            '1、退换货的来回运费需要您自行承担;',
            '2、请保持商品外包装完好；',
            '3、请务必以快递形式寄回商品，仓库不接受任何平邮包裹以及到付',
          ],
          [
            '亲爱的客户您好：',
            '1、换货的来回运费需要您自行承担。',
            '2、请保持商品外包装完好',
            '3、请务必以快递形式寄回商品，仓库不接受任何平邮包裹以及到付',
          ],
          [
            '亲爱的客户您好：',
            '1、维修的来回运费需要您自行承担。',
            '2、请保持商品外包装完好',
            '3、请务必以快递形式寄回商品，仓库不接受任何平邮包裹以及到付',
          ],
        ],
        recipient: [
          {
            title: '收件人',
            value: '',
          },
          {
            title: '收件人电话',
            value: '',
          }, {
            title: '退货地址',
            value: '',
          }
        ],
        orderinfos:
          [
            {
              title: '服务单号',
              value: '',
            }, {
            title: '服务类型',
            value: '退货',
          }, {
            title: '退款金额',
            value: '',
          }, {
            title: '申请时间',
            value: '',
          }, {
            title: '审核时间',
            value: '',
          }, {
            title: '商家确认时间',
            value: '',
          }, {
            title: '退款单号',
            value: '',
          }
          ],
        scrollValue:
          0,
        isShow:
          false,
        pageTitle: '',
        tipTitle:'',
      }
    },
    methods: {
      submitClick: function () {//提交
        this.$Loading.open();
        let url = '/app/json/app_order_after_sale/updateAfterStatus';
        let params1 = {//参数
          token: this.$store.state.login.token,
          id: this.orderInfo.id,
          returnExpress:this.returnExpress,
          returnOrderId:this.returnOrderId
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('售后详情:', data);
          if (data.status == 0) {
            this.$Toast('提交成功')
            this.turnback();
          } else {

          }
        }, error => {
          this.$Loading.close()
          this.isShow = false;
          this.$Toast('提交失败')
        });
      },
      turnback: function () {//返回
        this.$router.go(-1);
        this.$keepaliveHelper.deleteCache(this)
      },
      _getDetail: function (id) {//售后订单详情
        this.$Loading.open();
        let url = '/app/json/app_order_after_sale/queryAfterDetail';
        let params1 = {
          token: this.$store.state.login.token,
          id: id,
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('售后详情:', data);
          if (data.status == 0) {
            this.orderInfo = data.data
            this.returnExpress = this.orderInfo.returnExpress
            this.returnOrderId = this.orderInfo.returnOrderId
            this.dealData();
            this.isShow = true;
          } else {
            this.isShow = false;
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.isShow = false;
          console.log('售后查看详情', error);
          this.$Toast('查看详情失败')
        });
      },
      dealData: function () {//处理数据
        for (let i = 0; i < this.orderinfos.length; i++) {//let index in this.orderinfo
          let item = this.orderinfos[i];
          if (i == 0) {
            this.orderinfos[i].value = this.orderInfo.id;
          } else if (i == 1) {
            let str = '';
            let introductions = [];
            let tiptitle = ''
            if (this.orderInfo.type == 0) {
              str = '退货';
              introductions = this.returnpolicy[0];
              tiptitle = '退货说明'
            } else if (this.orderInfo.type == 1) {
              str = '换货';
              introductions = this.returnpolicy[1];
              tiptitle = '换货说明'
            } else if (this.orderInfo.type == 2) {
              str = '维修';
              introductions = this.returnpolicy[2];
              tiptitle = '维修说明'
            } else if (this.orderInfo.type == 3) {
              str = '补货';
            }
            this.tipTitle = tiptitle;
            this.pageTitle = str
            this.orderinfos[i].value = str;
            this.returnpolicy = introductions;
          } else if (i == 2) {
            this.orderinfos[i].value = this.orderInfo.refundAmount;
          } else if (i == 3) {
            this.orderinfos[i].value = this.orderInfo.createTimeStr;
          } else if (i == 4) {
            this.orderinfos[i].value = this.orderInfo.approveTimeStr;
          } else if (i == 5) {
            this.orderinfos[i].value = this.orderInfo.receiveTimeStr;
          } else if (i == 6) {
            this.orderinfos[i].value = this.orderInfo.tradeNo;
          }
        }

        for (let i = 0; i < this.recipient.length; i++) {
          let item = this.recipient[i];
          if (i == 0) {
            this.recipient[i].value = this.orderInfo.storeReceiverName
          } else if (i == 1) {
            this.recipient[i].value = this.orderInfo.storePhone
          } else if (i == 2) {
            if (this.orderInfo.type == 0) {
              this.recipient[i].title = '退货地址';
            } else if (this.orderInfo.type == 1) {
              this.recipient[i].title = '换货地址';
            } else if (this.orderInfo.type == 2) {
              this.recipient[i].title = '维修地址';
            }
            this.recipient[i].value = this.orderInfo.storeAddress
          }
        }
        console.log('recipient', this.recipient)
      },
    },
    created() {
      let id = this.$route.query.id;
      // id = 3
      this._getDetail(id);
    },
    activated() {
      if (this.isShow) {
        this.$refs.returnservicescrl.scrollTop = this.scrollValue
      }
    },
    beforeRouteLeave(to, from, next) {
      this.scrollValue = this.$refs.returnservicescrl.scrollTop
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .returninggoods {
    width 100%
    height 100%
    overflow hidden
    .scroll-info {
      position absolute
      top 0px;
      right 0px;
      left 0px;
      bottom 50px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch
      .policy-con {
        margin-top 10px
        p {
          line-height 18px
        }
      }
      .detail-info {
        display flex
        align-items center
        margin-top 10px
        .left-title {
          flex 1
        }
        .right-value {

        }
      }

      .input-cell {
        display flex
        align-items center
        height 45px
        padding 10px 0px
        /*background-color magenta*/
        .left-info {
          width 60px
        }
        .input-info {
          height 100%
          width 190px
          padding 0 10px
          border-radius: 15px;
          -webkit-border-radius: 15px;
          font-size font-size $font-size-medium-s
        }
      }

    }
    .submit-btn {
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      display flex
      align-items center
      P {
        width 100%
        text-align center
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }

    .padding-con {
      padding 10px 10px
    }
    .bigtitle {
      font-size $font-size-medium
      font-weight $font-weight-m
    }
    .commontitle {
      font-size $font-size-medium-s
    }
    .small-content {
      font-size $font-size-smal
    }
  }

</style>
