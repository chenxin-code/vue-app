<template>
  <div class="detailservice">
    <nav-top @backEvent="turnback"></nav-top>
    <nav-content v-if="isShow">
      <div class="detail-service-content">
        <div class="scroll-info">
          <div class="top-step theme_bg_red">
            <div class="line-con theme_bg_white" :style="getStyleWith()"></div>
            <div class="steps">
              <div class="step-item theme_font_white" v-for="(step,index) in orderInfo.stateAll">
                <div class="step-icon">
                  <i v-if="step.code<=(orderInfo.state==10?1:orderInfo.state)"
                     class="iconfont mall-dui theme_font_red theme_bg_white"></i>
                  <div class="count-con theme_bg_white theme_font_red"
                       v-if="step.code>(orderInfo.state==10?1:orderInfo.state)">{{index+1}}
                  </div>
                </div>
                <p>{{step.value}}</p>
              </div>
            </div>
          </div>
          <div class="config-con" v-if="orderInfo.hasItem==1">
            <div class="padding-con shadow-cell" v-for="(item,key) in orderInfo.ordRepairItems">
              <goods-cell :goods-info="item" :goods-count="orderInfo.number" :type="1"></goods-cell>
            </div>
          </div>
          <div class="padding-con shadow-cell" v-else>
            <goods-cell :goods-info="goodsInfo" :goods-count="orderInfo.number" :type="1"></goods-cell>
          </div>
          <div class="padding-con shadow-cell" v-if="this.orderInfo.state!=10 && this.orderInfo.productType != 5">
            <div class="flow-cell">
              <i class="iconfont mall-xuanzhong theme_font_red"></i>
              <span class="bigtitle">{{getShowStateTitle()}}</span>
            </div>
            <div v-if="orderInfo.type!=2 && orderInfo.type != 3&& orderInfo.type != 5" class="detail-info">
              <p class="left-title  theme_font_common ">物流公司</p>
              <p class="right-value theme_font_gray">{{orderInfo.returnExpress}}</p>
            </div>
            <div v-if="orderInfo.type!=2 && orderInfo.type != 3 && orderInfo.type != 5" class="detail-info">
              <p class="left-title  theme_font_common ">物流单号</p>
              <p class="right-value theme_font_gray">{{orderInfo.returnOrderId}}</p>
            </div>
          </div>
          <div class="padding-con shadow-cell" v-if="this.orderInfo.state==10">
            <div class="bigtitle">未通过原因</div>
            <div class="text-input theme_bg_white_ef">
              <textarea class="input-textarea" v-model="this.orderInfo.closeReason" placeholder="未通过原因"
                        disabled="disabled"></textarea>
            </div>
          </div>
          <div class="padding-con shadow-cell">
            <div v-if="order.value" class="detail-info" v-for="order in orderinfos">
              <p class="left-title  theme_font_common ">{{order.title}}</p>
              <p class="right-value theme_font_gray">{{order.value}}</p>
            </div>
            <!--<div class="notice-info">-->
            <!--<p class="small-content theme_font_gray" v-for="tip in notices">{{tip}}</p>-->
            <!--</div>-->
          </div>
          <div class="padding-con shadow-cell" v-if="this.orderInfo.productType == 5">
            <div class="remarks">
              <p>注：</p>
              <p>1、钱款会退至您当时支付的账户；</p>
              <p>2、实际到账时间有可能延迟，请及时查收；</p>
              <p>3、若一直未收到退款，请及时联系客服。</p>
            </div>
          </div>
          <div class="qrcode-wrapper" v-if="liftsVoucher">
            <canvas  class="qrcode" id="qrcode"></canvas>
          </div>
        </div>

        <div v-if="isShowSureBtn && orderInfo.interfaceType != '2'" class="submit-btn theme_bg_red theme_font_white" @click="_sureClick">
          <p>{{btnTitle}}</p>
        </div>
        <div v-if="orderInfo.interfaceType == '2' && orderInfo.state < 8" class="submit-btn theme_bg_red theme_font_white" @click="_cancelapplyOrder(orderInfo)">
          <p>取消申请</p>
        </div>
      </div>
      <!--<div v-if="(orderInfo.type == 0 && orderInfo.state == 2) || (orderInfo.type == 1 && orderInfo.state == 2) || (orderInfo.type == 2 && orderInfo.state == 2 && orderInfo.repairType == 1)" class="submit-btn theme_bg_red theme_font_white" @click="rewriteExpress">-->
      <!--<p v-if="!toRewrite">重填快递单号</p>-->
      <!--</div>-->
      <div class="customerService" @click="handleCustomer">
        <img :src="customerService" alt="">
      </div>
    </nav-content>
  </div>
</template>

<script>
  import GoodsCell from '../common/goods-cell'
  import QRCode from 'qrcode'

  export default {
    name: 'detailservice',
    components: {
      GoodsCell
    },
    data() {
      return {
        customerService:require('../../../../static/images/service.png'),
        isShow: false,
        liftsVoucher: '', // 退货码
        goodsInfo: {
          skuName: '',
          salePrice: '',
          number: '',//购买数量
          phPictureUrl: '',//
        },
        orderinfos: [
          {
            title: '服务单号',
            value: '',
            tag: 0
          }, {
            title: '服务类型',
            value: '退货',
            tag: 1
          }, {
            title: '退款金额',
            value: '￥46.00',
            tag: 2
          }, {
            title: '申请时间',
            value: '',
            tag: 3
          }, {
            title: '审核时间',
            value: '',
            tag: 4
          }, {
            title: '商家确认时间',
            value: '',
            tag: 5
          }, {
            title: '退款单号',
            value: '',
            tag: 6
          }
        ],
        steps: [
          '提交申请',
          '商家审核',
          '客户发货',
          '客户发货',
          '发货',
        ],
        completeStep: 3,
        orderInfo: [],
        isShowSureBtn: false,
        btnTitle: '',
        toRewrite: false
      }
    },
    methods: {
      // 唤起客服
      handleCustomer: function() {
        ysf('config', {
          uid: this.$store.state.userInfo.userId,
          name: this.$store.state.userInfo.nickName,
          email:'',
          mobile: this.$store.state.userInfo.phone,
          data: this.$store.state.userLable,
          success: function(){     // 成功回调
            ysf('open');
          },
          error: function(){       // 错误回调
            // handle error
          }
        })
      },
      _cancelapplyOrder:function(order){//取消申请
        this.$Loading.open();
        let url = '/app/json/app_order_after_sale/updateAfterStatus';
        let params1 = {
          token: this.$store.state.login.token,
          id: order.id,
          state:'9'//取消
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('订单取消:', data);
          if (data.status == 0) {
            this.$router.go(-1);
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('订单取消失败')
        });
      },
      rewriteExpress: function () {
        this.$router.push({
          path: '/mall2/returninggoods',
          query: {
            id: this.$route.query.id,
          }
        });
      },
      _sureClick: function () {
        if (this.orderInfo.state == 10) {
          this.$router.replace({
            path: '/mall2/choosesertype',
            query: {
              id: this.orderInfo.id,
              reApply: '1'
            }
          });
          return;
        }
        console.log('sureClick')
        this.$Loading.open();
        let url = '/app/json/app_order_after_sale/updateAfterStatus';
        let params1 = {
          token: this.$store.state.login.token,
          id: this.orderInfo.id,
          state: 8 //完成
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('确认详情:', data);
          if (data.status == 0) {
            this.turnback();
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('确认失败')
        });
      },
      getStyleWith: function () {
        let al = this.steps.length
        if (al < 2) {
          return {width: '0px'};
        }
        let w = 100 - 100 / al
        return {width: w + '%'};
      },
      _getDetail: function (id) {//售后订单详情
        this.$Loading.open();
        let url = '/app/json/app_order_after_sale/queryAfterDetail';

        this.$http.post(url, {
          id
        }).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('售后详情:', data);
          if (data.status == 0) {
            this.orderInfo = data.data
            this.liftsVoucher = this.orderInfo.liftsVoucher
            this.isShow = true;
            if (this.liftsVoucher) {
              this.$nextTick(() => {
                QRCode.toCanvas(document.getElementById('qrcode'), this.liftsVoucher)
              })
            }
            this.dealData();

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
      getShowStateTitle: function () {
        let title = '';
        if (this.orderInfo.state == 0) {
          title = '申请成功，等待商家审核';
        } else if (this.orderInfo.state == 1) {
          title = '等待客户发货';
        } else if (this.orderInfo.state == 2) {
          title = '客户已发货，等待商家收货';
        } else if (this.orderInfo.state == 3) {
          title = '等待商家处理';
        } else if (this.orderInfo.state == 4) {
          title = '商家已发货，等待用户确认';
        } else if (this.orderInfo.state == 5) {
          if (this.orderInfo.deliverType == '1') {
            title = '请到油站扫码退款。';
          } else {
            title = '退款，等待客户确认';
          }
        } else if (this.orderInfo.state == 6) {
          title = '上门维修中';
        } else if (this.orderInfo.state == 7) {
          title = '客户已确认';
        } else if (this.orderInfo.state == 8) {
          title = '已完成';
        } else if (this.orderInfo.state == 9) {
          title = '已取消';
        } else if (this.orderInfo.state == 10) {
          title = '审核未通过';
        } else if (this.orderInfo.state == 11) {
          title = '已关闭';
        }
        return title
      },
      dealData: function () {//处理数据
        //目前只有补货退款
        for (let index in this.orderinfos) {
          let item = this.orderinfos[index];
          if (item.tag == 0) {
            this.orderinfos[index].value = this.orderInfo.id;
          } else if (item.tag == 1) {
            let str = '';
            if (this.orderInfo.type == 0) {
              str = '退货';
            } else if (this.orderInfo.type == 1) {
              str = '换货';
            } else if (this.orderInfo.type == 2) {
              str = '维修';
            } else if (this.orderInfo.type == 3) {
              str = '补货';
            }
            this.orderinfos[index].value = str;
          } else if (item.tag == 2) {
            //修复bug  补货类型不需要显示退款金额
            if(this.orderInfo.type == 3){
              this.orderinfos[index].value ='';
            }else{
              this.orderinfos[index].value = this.orderInfo.price * this.orderInfo.number;
            }
          } else if (item.tag == 3) {
            this.orderinfos[index].value = this.orderInfo.createTimeStr;
          } else if (item.tag == 4) {
            this.orderinfos[index].value = this.orderInfo.approveTimeStr;
          } else if (item.tag == 5) {
            this.orderinfos[index].value = this.orderInfo.receiveTimeStr;
          } else if (item.tag == 6) {
            this.orderinfos[index].value = this.orderInfo.tradeNo;
          }
        }
        this.goodsInfo.skuName = this.orderInfo.skuName;
        this.goodsInfo.salePrice = this.orderInfo.salePrice;
        this.goodsInfo.number = this.orderInfo.payNumber;//接口的payNumber 是购买数量 number是申请数量
        this.goodsInfo.phPictureUrl = this.orderInfo.phPictureUrl;
        this.goodsInfo.packageList = this.orderInfo.packageList
        // (this.orderInfo.type == 0 || this.orderInfo.type == 4)
        if ((this.orderInfo.type == 0 || this.orderInfo.type == 5) && this.orderInfo.state == 5) {
          // bug6903  孙哥哥让去掉的
          this.btnTitle = '确认已收款';
          // 增加逻辑自提的时候不显示，配上显示
          // if (this.orderInfo.deliverType == '1') {
          //   this.isShowSureBtn = false;
          // } else {
          //   this.isShowSureBtn = true;
          // }
          this.isShowSureBtn = true;
        } else if (this.orderInfo.type == 1 && this.orderInfo.state == 4) {//// repairType
          this.btnTitle = '确认收货';
          this.isShowSureBtn = true;
        } else if (this.orderInfo.type == 2) {//// repairType
          if (this.orderInfo.repairType == 1 && this.orderInfo.state == 4) {
            this.btnTitle = '确认收货';
            this.isShowSureBtn = true;
          } else if (this.orderInfo.repairType == 0 && this.orderInfo.state == 6) {
            this.btnTitle = '确认维修';
            this.isShowSureBtn = true;
          }
        } else if (this.orderInfo.type == 3 && this.orderInfo.state == 4) {
          this.btnTitle = '确认已收货';
          this.isShowSureBtn = true;
        } else if (this.orderInfo.state == 10) {//未通过的 再次申请
          this.btnTitle = '再次申请';
          this.isShowSureBtn = true;
        }
      },
      turnback: function () {//返回
        this.$router.go(-1);
      },
    },
    created() {
      let id = this.$route.query.id;
      this._getDetail(id);
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .customerService{
    position: fixed;
    width: 42px;
    height : 42px;
    right: 0;
    bottom: 112px;
    img{
      width 100%;
      height 100%;
    }
  }

  .detailservice {
    width 100%
    height 100%
    overflow: hidden

    .detail-service-content {
      width 100%
      height 100%
      display flex
      flex-direction column
    }

    .scroll-info {
      flex 1
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch

      .top-step {
        text-align center;
        width 100%
        font-size 0px;
        /*height 200px*/
        padding 10px 30px

        .steps {
          display flex;

          .step-item {
            flex 1;
            text-align center;

            .step-icon {
              i {
                width $font-size-large
                height $font-size-large
                border-radius: 10px;
                font-size $font-size-large
              }

              .count-con {
                text-align center
                display inline-block;
                border-radius: 10px;
                line-height $font-size-large
                width $font-size-large
                height $font-size-large
                font-size $font-size-small
              }
            }

            p {
              margin-top 8px;
              display inline-block;
              font-size 14px;
              width 28px;
            }
          }
        }
      }

      .flow-cell {
        i {
          font-size $font-size-medium
        }
      }

      .detail-info {
        display flex
        align-items center
        margin-top 20px

        .left-title {
          flex 1
          font-size $font-size-medium
        }

        .right-value {
          font-size $font-size-small
        }
      }

      .notice-info {
        margin-top 10px

        p {
          line-height 20px
        }
      }

      .text-input {
        height 100px;
        margin-top 10px
        border-radius 8px;
        padding 5px 0;

        .input-textarea {
          width 100%;
          height 100%;
          border none;
          resize: none
          background none
          padding 0 8px;
          font-size 12px;
          line-height 18px;
        }
      }
    }

    .submit-btn {
      flex-shrink 0
      height 50px;
      line-height 50px;

      P {
        width 100%
        text-align center
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }

    .padding-con {
      padding 12px
      .remarks {
        font-size 12px;
        color #9FA0A0;
        line-height 20px;
      }
    }

    .bigtitle {
      font-size $font-size-medium
      font-weight $font-weight-m
    }

    .small-content {
      font-size $font-size-smal
    }

    .line-con {
      display inline-block;
      margin-top 20px
      height 2px
      margin-bottom -10px
    }

    .qrcode-wrapper{
      text-align: center
      .qrcode{
        width 230px!important;
        height  230px!important
      }
    }
  }

</style>
