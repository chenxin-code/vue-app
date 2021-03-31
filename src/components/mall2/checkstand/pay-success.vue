<template>
  <div class="paysuccess">
    <nav-top :no-back="true" :title="payResult == 'icbcFailed' ? '支付失败' : '支付成功'" @backEvent="backEvent">
      <div class="right-btn theme_font_gray" v-if="$store.state.webtype != 3" style="right: 0px; height: 44px; top: 0px; padding-right: 12px;font-size: 16px;" @click="turnback">完成</div>
      <!--<div class="right-btn">完成</div>-->backEvent
    </nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="padding-con shadow-cell">
          <div class="top-image">
            <div class="title-con">
              <img src="static/image/mall2/fail.png" v-if="payResult == 'icbcFailed'" />
              <img src="static/image/mall2/succ.png" v-else />
              <!-- <img src="static/image/mall2/finish.png"/> -->
              <p class="theme_font_red" v-if="payResult == 'icbcFailed'">支付失败！</p>
              <p class="theme_font_red" v-else>支付成功！</p>
            </div>
          </div>
          <div class="pay-success-tip" v-if="$store.state.globalConfig.pay_success_tip">
            <div class="tip-text">{{$store.state.globalConfig.pay_success_tip}}</div>
          </div>
          <div class="btn-con theme_bg_white theme_border_light"><p class="theme_font_gray" @click="eventClick(1)">我的订单</p></div>
          <div class="btn-con theme_bg_red theme_border_red_i"><p class="theme_font_white" @click="eventClick(2)">继续购物</p></div>
        </div>
        <SubPage :divKeywords="'PaySuccessDiv'"></SubPage>
        <div class="recommend-div">
          <Recommend></Recommend>
        </div>
      </div>
    </nav-content>
<!--    <van-popup v-model="successView" class="successBox">-->
<!--     <div @click="sharePage">-->
<!--       <div class="pic">-->
<!--         <img src="static/image/microShop/icon3@2x.png">-->
<!--       </div>-->
<!--       <div class="tips">-->
<!--         <p>分享好友，好友助力一起得200元现金券</p>-->
<!--         <p>分享所得奖励可在商城充当现金直接消费</p>-->
<!--       </div>-->
<!--     </div>-->
<!--    </van-popup>-->
  </div>
</template>

<script>
  import Recommend from '../list/recommend/index'
  import wxfunc from '@/utils/wxfunc'
  import Config from '@/api/config'
  import SubPage from '@/components/product/index/subpage/subpage'
  import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
  import appNav from '@zkty-team/x-engine-module-nav'
  export default {
    name: 'paysuccess',
    components: {
      Recommend,
      SubPage
    },
    data() {
      return {
        successView: true,
        shareData: {
          title: '',
          sharetext: '',
          imageurl: '',
          // detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/share-gift/share-list?awardActivity=${this.$route.query.awardActivity}`
        },
        payResult: '',
      }
    },
    methods: {
      backEvent(){
        if(this.$store.state.webtype != 2 || this.$store.state.webtype != 3 ){
          if(this.$route.query.isBill){
            this.$router.push({
              path:"/order/2",
            })
          }else{
            this.$router.push('/common')
          }
        }else{
          this.$router.push('/common')
        }
      },
      eventClick: function (type) {
        if (type == 1){//我的订单
          if (this.payResult == 'icbcFailed') { //支付失败
              let currentOrderDetails = JSON.parse(localStorage.getItem('currentOrderDetails'))
              let awardActivity =
              currentOrderDetails.awardActivityList && currentOrderDetails.awardActivityList.length
              ? currentOrderDetails.awardActivityList[0]
              : {}
              this.$router.push({
              path: '/mall2/orderdetail',
              query: {
                orderId: currentOrderDetails.orderId,
                orderType: currentOrderDetails.orderType,
                tradeNo: currentOrderDetails.tradeNo,
                tag: currentOrderDetails.tag,
                awardActivity: JSON.stringify(awardActivity)
              }
            })
            return
          }
          // if (this.$route.query.name == 'phone') { //话费充值
          //   this.$router.push({
          //     path: '/recharge-bill',
          //     query: {
          //       name: this.$route.query.name
          //     }
          //   })
          //   return
          // }
          if (this.$store.state.mall2.staticDeliverType == 1) {
            if(this.$route.query.type=='app_purchase_order'){
              this.$router.replace({
                path: '/mall2/purchaseorderlist',
              });
            }else{
                if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
                  this.$router.replace({
                    path: '/mall2/orderlist',
                    query: {
                      selectedIndex: '2',
                      orderCategory: this.$route.query.orderCategory,
                      vipUnitUserCode: this.$route.ququeryObjery.vipUnitUserCode
                    }
                  })
                } else {
                  this.$router.replace({
                    path: '/order/1',
                  });
                }
            }

          } else {
            if(this.$route.query.type=='app_purchase_order'){
              this.$router.replace({
                path: '/mall2/purchaseorderlist',
              });
            } else{
              if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
                this.$router.replace({
                  path: '/mall2/orderlist?selectedIndex=1',
                  query: {
                    orderCategory: this.$route.query.orderCategory,
                    vipUnitUserCode: this.$route.query.vipUnitUserCode
                  }
                });
              } else {
                this.$router.replace({
                  path: '/order/1',
                });
              }
            }

          }
        }else if (type == 2){//继续购物
          // if (this.$store.state.webtype == 3) {
          //   wx.miniProgram.reLaunch({url: `/pages/weView/weView`})
          //   // this.$util.wxmpBackHome()
          // } else {
          //   this.turnback()
          // }
          if(this.$store.state.webtype == 2 || this.$store.state.webtype == 3){
            this.$router.replace({
              path: '/common'
            })
          }else{
            appLocalstorage
            .get({
              key: "LLBIsHomeView",
              isPublic: true,
            })
            .then((res) => {
              let _result = res.result
              if (!_result || _result == '' || _result == 'null' || _result == undefined) {
                return;
              }
              if (_result == '1') {
                this.$router.replace({
                  path: '/common'
                })
              } else {
                appNav.changeBottomToIndex({selectIndex: 0,}).then(res=>{
                  console.log('跳转',res)
                });
              }
            });
          }
        }
      },
      turnback: function () {//返回
        appLocalstorage
        .get({
          key: "LLBIsHomeView",
          isPublic: true,
        })
        .then((res) => {
          let _result = res.result
          if (!_result || _result == '' || _result == 'null' || _result == undefined) {
            return;
          }
          if (_result == '1') {
            this.$router.replace({
              path: '/common'
            })
          } else {
            // appNav.navigatorBack({ url: '0' }).then( res => {
            //   console.log(res)
            // })
            if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
              this.$router.replace({
                path: '/mall2/orderlist?selectedIndex=1',
                query: {
                  orderCategory: this.$route.query.orderCategory,
                  vipUnitUserCode: this.$route.query.vipUnitUserCode
                }
              })
            } else {
              this.$router.replace({
                path: '/order/2'
              })
            }
          }
        });
        
        // if (this.$util.isICBCApp()) {
        //   // 工银e生活，需要跳到首页
        //   this.$router.replace({
        //     path: '/common'
        //   })
        // } else {
        //   this.$router.go(-1);
        // }
      },
      activated () {
        this.$userCenter._getMyOrder();
      },
      beforeRouteLeave (to, from, next) {
        this.$keepaliveHelper.deleteCache(this)
        next()
      },
      sharePage() {
        this.$bridgefunc.wechatShare(this.shareData)
      },
    },
    created() {
      const ret = JSON.parse(decodeURI(this.$route.query.ret));
      if (ret) {
        if (!ret.isCancel) {
          if (ret.billRetStatus == 1) {
            this.payResult = 'success'
          } else {
            this.payResult = 'icbcFailed'
          }
        } else {
          this.payResult = 'icbcFailed'
        }
      } else {
        this.payResult = this.$route.query.payResult || ''
      }

      let carts = this.$store.state.microSho.carts
      let cartsNew = []
      carts.forEach((element,index) => {
        if (!element.checked) {
          cartsNew.push(element)
        }
      })
      this.$store.state.microSho.carts = cartsNew
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .paysuccess {
    width 100%
    height 100%
    overflow: hidden

    .scroll-div {
      position absolute;
      top 0px;
      bottom 0px;
      left 0px;
      right 0px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
    }
    .top-image {
      display flex
      padding-bottom 15px
      .title-con{
        margin auto
        display flex
        align-items center
        img {
          width 45px
          height 45px
        }
        p{
          margin-left 5px
          font-size $font-size-medium
        }
      }
    }
    .pay-success-tip {
      padding 10px 20px;
      display flex;
      justify-content center;
      .tip-text {
        max-width 290px;
        font-size 12px;
        line-height 16px
      }
    }
    .btn-con{
      margin 10px 25px 0px 25px
      display flex
      padding 10px 0px
      border-radius 20px
      border 1px solid
      P {
        width 100%
        text-align center
        font-size $font-size-small
      }
    }
    .padding-con {
      padding 12px
    }
    .bigtitle {
      font-size $font-size-medium
      font-weight $font-weight-m
      text-align center
    }
    .recommend-div {
      overflow hidden;
    }
  }

  .successBox {
    height: 350px;
    /* line-height: 180px; */
    width: 80%;
    text-align: center;
    font-size: 16px;
    background-position: 50% 50%;
    background: url("../../../../static/image/microShop/bg1@2x.png") no-repeat center;
    background-size: 100% 100%;
   .pic {
     border-radius: 50%;
     background: #fff;
     width: 100px;
     height: 100px;
     display: -webkit-box;
     display: -ms-flexbox;
     display: flex;
     position: absolute;
     top: 148px;
     left: 50%;
     margin-left: -50px;
     flex-direction: column;
     border: 2px solid #ffe9eb;
     img {
       width 50px;
       margin auto
     }
   }
    .tips {
      position: absolute;
      width: 96%;
      left: 2%;
      font-size: 14px;
      top: 270px;
      p {
        margin-bottom 10px;
      }
    }
  }

</style>
