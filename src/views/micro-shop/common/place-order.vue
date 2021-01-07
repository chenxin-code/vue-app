/**Created by liaoyingchao on 2019-04-26.*/

<template>
  <div class="place-order mall2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="block-div no-padding-bottom">
          <div v-if="$store.state.mall2.selectAddress.id > 0 && deliveryType == 2" @click="toSelectAddress">
            <div class="flex-row">
              <div class="name theme_font_black">{{$store.state.mall2.selectAddress.receiverName}}</div>
              <div class="name theme_font_black">{{$store.state.mall2.selectAddress.mobile}}</div>
              <div class="act-item-full theme_bg_red theme_font_white"
                   v-if="$store.state.mall2.selectAddress.isDefault == 1">默认
              </div>
            </div>
            <div class="flex-row">
              <div class="full theme_font_tint font-small">{{$store.state.mall2.selectAddress.addressFull}}</div>
              <div>
                <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
              </div>
            </div>
          </div>
          <div v-if="(!($store.state.mall2.selectAddress.id > 0)) && deliveryType == 2" @click="toSelectAddress">
            <div class="flex-row">
              请选择地址信息
            </div>
          </div>
          <div v-if="$store.state.mall2.zitiAddress.id > 0 && deliveryType == 1" @click="toSelectZitiAddress">
            <div class="pickup-shop">
              <div style="flex: 1;">
                <div class="flex-row">
                  <div class="name theme_font_black">自提店铺：{{$store.state.mall2.zitiAddress.storeName}}</div>
                </div>
                <div class="flex-row">
                  <div class="full theme_font_tint font-small" style="line-height: 1.4;">
                    {{$store.state.mall2.zitiAddress.addressFull}} {{$store.state.mall2.zitiAddress.phone &&
                    $store.state.mall2.zitiAddress.phone != '' ? '('+$store.state.mall2.zitiAddress.phone+')' : ''}}
                  </div>
                </div>
              </div>
              <div>
                <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
              </div>
            </div>
          </div>
          <div class="colorfulline">
            <img src="static/image/mall2/colorfulline.png"/>
          </div>
        </div>
        <div >
          <div class="block-div">
            <div class="flex-row" @click="payWayPopShow = true">
              <div class="label-middle theme_font_common">支付方式</div>
              <div class="full"></div>
              <div class="theme_font_common right-margin">{{selectedPayWay.text}}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>
          <div class="block-div">
            <div class="flex-row" @click="contratWayShow">
              <div class="label-middle theme_font_common" style="width:100px">预约单联系方式</div>
              <div class="full"></div>
              <div class="theme_font_common right-margin">{{contratWayText}}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
            <div class="" v-if="contratWayText!='选择联系方式'">
              <van-cell title="姓名：" :value="selectItem.realName"/>
              <van-cell title="联系电话：" :value="selectItem.userName"/>
            </div>
          </div>
          <!--          <div class="block-div theme_bg_white">-->
          <!--            <div class="flex-row">-->
          <!--              <div class="theme_font_gray full">预约单联系方式</div>-->
          <!--            </div>-->
          <!--            <div class="flex-row">-->
          <!--              <div class="label theme_font_common">姓名</div>-->
          <!--              <div class="full input-bg">-->
          <!--                <input v-model="name" placeholder="请输入您的姓名"/>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="flex-row">-->
          <!--              <div class="label theme_font_common">联系电话</div>-->
          <!--              <div class="full input-bg">-->
          <!--                <input type="tel" v-model="phone" placeholder="请输入手机号码" maxlength="11" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' pattern="[0-9]*" @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''">-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="block-div theme_bg_white">
            <div class="pro-row">
              <div class="img-div">
                <img :src="this.img">
              </div>
              <div class="info-div">
                <div class="title theme_font_black">{{showTitle}}</div>
                <div class="price theme_font_red">
                  <div class="price-item" v-for="(price, idx) in getPrices()">
                    <span class="xian" v-if="idx != 0"> ~ </span>
                    <span>¥</span>
                    <span class="big">{{price.iNum}}.</span>
                    <span>{{price.dNum}}</span>
                  </div>
                  <div class="theme_font_gray" style="text-align: right;flex: 1;">x {{number}}</div>
                </div>
              </div>
            </div>
            <div class="flex-row">
              <div class="label theme_font_common">备注</div>
              <div class="full input-bg">
                <input v-model="remark" placeholder="请留下您想说的话"/>
              </div>
            </div>
          </div>
          <div class="block-div theme_bg_white">
            <div class="flex-row">
              <div class="label theme_font_gray">订单金额</div>
              <div class="full"></div>
              <div class="theme_font_red total"><span class="font-small">¥</span> {{$util.toDecimal2(this.price *
                this.number)}}
              </div>
            </div>
          </div>
        </div>
<!--        <div>-->
<!--          <div class="block-div theme_bg_white">-->
<!--            <div class="flex-row">-->
<!--              <div class="theme_font_gray full">预约单联系方式</div>-->
<!--            </div>-->
<!--            <div class="flex-row">-->
<!--              <div class="label theme_font_common">姓名</div>-->
<!--              <div class="full input-bg">-->
<!--                <input v-model="name" placeholder="请输入您的姓名"/>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="flex-row">-->
<!--              <div class="label theme_font_common">联系电话</div>-->
<!--              <div class="full input-bg">-->
<!--                <input type="tel" v-model="phone" placeholder="请输入手机号码" maxlength="11"-->
<!--                       onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' pattern="[0-9]*"-->
<!--                       @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''">-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="block-div theme_bg_white">-->
<!--            <div class="pro-row">-->
<!--              <div class="img-div">-->
<!--                <img :src="this.img">-->
<!--              </div>-->
<!--              <div class="info-div">-->
<!--                <div class="title theme_font_black">{{showTitle}}</div>-->
<!--                <div class="price theme_font_red">-->
<!--                  <div class="price-item" v-for="(price, idx) in getPrices()">-->
<!--                    <span class="xian" v-if="idx != 0"> ~ </span>-->
<!--                    <span>¥</span>-->
<!--                    <span class="big">{{price.iNum}}.</span>-->
<!--                    <span>{{price.dNum}}</span>-->
<!--                  </div>-->
<!--                  <div class="theme_font_gray" style="text-align: right;flex: 1;">x {{number}}</div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="flex-row">-->
<!--              <div class="label theme_font_common">备注</div>-->
<!--              <div class="full input-bg">-->
<!--                <input v-model="remark" placeholder="请留下您想说的话"/>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="block-div theme_bg_white">-->
<!--            <div class="flex-row">-->
<!--              <div class="label theme_font_gray">订单金额</div>-->
<!--              <div class="full"></div>-->
<!--              <div class="theme_font_red total"><span class="font-small">¥</span> {{$util.toDecimal2(this.price *-->
<!--                this.number)}}-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="bottom-div">
        <div class="btn theme_bg_red" @click="submitOrder">提交订单</div>
        <div class="other">
          <div class="theme_font_red total"><span class="font-small">¥</span> {{$util.toDecimal2(this.price *
            this.number)}}
          </div>
        </div>
      </div>
      <pop-view v-if="payWayPopShow" @closeEvent="payWayPopShow = false">
        <div class="pop-body">
          <div class="pop-title theme_font_common">请选择支付方式</div>
          <div class="items-div pop-scroll-div">
            <div
              class="item theme_font_common theme_bg_white_ef"
              :class="{theme_light_bg: selectedPayWay.tag == payway.tag, theme_standard_font_i: selectedPayWay.tag == payway.tag, theme_standard_bdr_i: selectedPayWay.tag == payway.tag}"
              @click="payWayEvent(payway)"
              v-for="payway in payWays"
            >{{payway.text}}
            </div>
          </div>
          <div
            class="bottom-btn theme_font_white theme_standard_bg bottom-space"
            @click="payWayPopShow = false"
          >确定
          </div>
        </div>
      </pop-view>
      <pop-view v-if="contratWayPopShow" @closeEvent="popClose1">
        <div class="pop-body">
          <div class="pop-title theme_font_common">请选择认证信息</div>
          <div class="items-div pop-scroll-div">
            <van-radio-group v-model="radio1">
              <van-cell-group>
                <van-cell title="" clickable @click="changePer(item,index)" v-for="(item,index) in contratWayList"
                          :key="index">
                  <template #icon>
                    <div class="per-con">
                      <div class="title">{{item.type==1?'企业':'个人'}}</div>
                      <div class="detail" v-if="item.isAuth">
                        <div class="name">姓名：{{item.realName}}</div>
                        <div class="phone">手机号：{{item.userName}}</div>
                      </div>
                      <div class="detail" v-else>
                        <div class="name">暂未{{item.type==1?'企业团购':'实名'}}认证,点击 <span @click="auther(item.type)"
                                                                                    style="color:#8080FF">前往认证</span>
                        </div>
                      </div>
                    </div>

                  </template>
                  <template #right-icon>
                    <van-radio :name="index"/>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
          <!--        <div-->
          <!--          class="bottom-btn theme_font_white theme_standard_bg bottom-space"-->
          <!--          @click="popSureEvent1"-->
          <!--        >确定-->
          <!--        </div>-->
        </div>
      </pop-view>
    </nav-content>
  </div>
</template>

<script>
  import purchase from "../../../components/mall2/purchase/js/index";
  import {Dialog, Toast} from "vant";

  export default {
    name: "place-order",
    components: {},
    data() {
      return {
        contratWayPopShow: false,
        radio1: 0,
        number: 1,
        img: '',
        showTitle: '',
        contratWayList: [],
        price: 0,
        name: '',
        phone: '',
        proId: '',
        remark: '',
        deliveryType: '',
        pageType: '1',
        overFlag:false,
        carts: [],
        selectItem: {},
        contratWayText: '选择联系方式',
        microStoreCode: '',
        payWayPopShow: false,
        amount:null,
        payType:0,
        isApplyPriceFlag:false,
        selectedPayWay: {
          text: "提货付款",
          tag: "2"
        },
        payWays: [
          {
            text: "在线支付",
            tag: "1"
          },
          {
            text: "货到付款",
            tag: "0"
          },
          {
            text: "提货付款",
            tag: "2"
          }
        ],
      }
    },
    methods: {
      contratWayShow: function () {
        this.getAuthInfo()
      },
      auther(type) {
        // 企业认证
        if (type == 1) {
          this.$router.push({
            path: '/authentication/index',
            query: {}
          })
          //个人实名认证
        } else {
          this.$router.push({
            path: '/authentication/index',
            query: {}
          })
        }

      },
      popClose1: function () {
        this.contratWayPopShow = false;
      },
      changePer(item, index) {
        this.contratWayPopShow = false;
        this.selectItem = item;
        this.radio1 = index
        if (item.type == 1) {
          this.contratWayText = '企业'
        } else {
          this.contratWayText = '个人'
        }

      },
      getAuthInfo: function () {
        let params = {}
        this.$http.post('/app/json/app_purchase_order/getAuthInfo', params).then(res => {
          let data = res.data
          console.log(res)
          if (data.status == 0) {
            this.contratWayList = res.data.data
            this.contratWayPopShow = true;
          } else {
            this.$Toast(data.info)
          }
        }).catch((err) => {
          this.$Toast(err)
        })
      },
      payWayEvent: function (payway) {
        if (payway.tag == 0) {
          this.$Toast("暂不支持！");
          return;
        }
        this.selectedPayWay = payway
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      toSelectZitiAddress: function () {
        let skuIds = [this.proId]
        this.$router.push({
          path: '/mall2/mypickupaddress',
          query: {
            skuIds: JSON.stringify(skuIds)
          }
        })
      },
      toSelectAddress: function () {
        this.$router.push({
          path: '/mall2/addresslist'
        })
      },
      settleCart: function () {
        let url = '/app/json/app_purchase_order/settleCart'
        let paramsData = {
          deliveryType: this.deliveryType,
          carts: this.carts,
          microStoreCode: this.microStoreCode
        };
        if (this.deliveryType == 1) {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        } else {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        }
        console.log(paramsData,"paramsData")
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              // this.$router.replace({
              //   path: '/mall2/submitfinished',
              //   query: data.data
              // })
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
      // 判断是否超过最大支付金额
      checkHighest_recharge(carts){
        var that=this
        var amount=this.$util.toDecimal2(this.price * this.number)
        this.amount=this.$util.toDecimal2(this.price * this.number)
        if(amount>10000){
          Toast('订单金额已超过10000元，请选择提货支付支付方式');
        }else if(Number(amount)>this.$store.state.globalConfig.bulkpurchase_modifyprice){
          this.overFlag=true;
          Dialog.confirm({
            title: '标题',
            confirmButtonText:'申请改价',
            className:'price-con',
            getContainer:'.place-order',
            cancelButtonText:'算了吧~',
            message: `您的订单金额已到达改价金额${this.$store.state.globalConfig.bulkpurchase_modifyprice}元，可选择联系管理员进行改价后进行支付`,
          })
            .then(() => {
              this.isApplyPriceFlag=true
              that.submitOrder1();
              // /mall2/submitFinished
              // on confirm
            })
            .catch(() => {
              // on cancel
            });
        }else{
          that.submitOrder1();
        }
      },
      // 申请调价
      applyPrice(data){
        let params = {
                 id:data.orderId
                }
                this.$http.post('/app/json/app_purchase_order/applyPrice', params).then(res => {
                  let data = res.data
                  if (data.status == 0) {
                    this.$Toast("操作成功")
                    this.$router.replace({
                      path: '/mall2/submitfinished',
                      query: data
                    })
                  } else {
                    this.$Toast(data.info)
                  }
                }).catch((err) => {
                  this.$Toast(err)
                })
      },
      submitOrder: function () {
        // if (this.name == '' || this.phone == '') {
        //   this.$Toast('请完善预约单信息')
        //   return
        // }
        // if(this.pageType==2){
          if(!this.selectItem.realName){
            this.$Toast('请选择预约单联系方式！')
            return
          }
        // }
        if(this.selectedPayWay.text=="提货付款"){
          this.payType=0
          //如果提货付款方式
          this.overFlag=true
          this.submitOrder1()
        }else{
          this.payType=1
          this.checkHighest_recharge()
        }
        // let url = '/app/json/app_purchase_order/submitOrder'
        // let paramsData = {
        //   token: this.$store.state.login.token,
        //   skuId: this.proId,
        //   buyCount: this.number,
        //   deliverType: this.deliveryType,
        //   subscOrdReceiver: this.name,
        //   subscOrdMobile: this.phone,
        //   Remark: this.remark
        // };
        // if (this.deliveryType == 1) {
        //   paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        // } else {
        //   paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        // }
        // this.$http.post(url, paramsData).then(
        //   res => {
        //     this.$Loading.close();
        //     let data = res.data;
        //     if (data.status == 0) {
        //       this.$router.replace({
        //         path: '/mall2/submitfinished',
        //         query: data.data
        //       })
        //     } else {
        //       this.$Toast(data.info);
        //     }
        //   },
        //   error => {
        //     this.$Loading.close();
        //     this.$Toast('请求数据失败！')
        //   }
        // );
      },
      submitOrder1(){
        let url = '/app/json/app_purchase_order/submitOrder'
        let paramsData = {
          token: this.$store.state.login.token,
          skuId: this.proId,
          buyCount: this.number,
          deliverType: this.deliveryType,
          subscOrdReceiver: this.name,
          subscOrdMobile: this.phone,
          Remark: this.remark,
          // 微店标识固定传1
          groupFlag:1,
          // 是否调价标识
          isApplyPrice:this.isApplyPriceFlag?1:"",
          // 微店码
          microStoreCode:this.microStoreCode,
          // 总金额
          amount:this.amount,
          // 支付方式0线下1线上
          payType:this.payType,
          // 认证信息通过接口返回再传给后台
          userAuthModel:"",
          carts:this.carts,
        };
        if (this.deliveryType == 1) {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        } else {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        }
        console.log(paramsData,"paramsData")
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              if(this.overFlag){
                // 改价或者提货付款跳转
                if(this.isApplyPriceFlag){
                  this.applyPrice(data)
                }else{
                  this.$router.replace({
                    path: '/mall2/submitfinished',
                    query: data
                  })
                }

              }else{
                // 如果在线支付，金额不大，跳收银台
                this.$router.replace({
                  path: '/mall2/checkstand',
                  query: {
                    payInfo: JSON.stringify(data.data),
                    // occurOuCode: this.occurData.ouCode,
                    // orderCategory: this.paramsData.orderCategory,
                    // vipUnitUserCode: this.paramsData.vipUnitUserCode,
                    // buyType: this.buyType, // songli
                    // giftCards: JSON.stringify(carts),
                    // deliveryType: this.deliveryType
                  }
                })
              }

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
      getPrices: function () {
        let arr = [{
          price: this.price
        }]
        return purchase.getPriceShow(arr)
      },
    },
    created() {
      // 之前代码
      // this.phone = this.$store.state.login.phone ? this.$store.state.login.phone : ''
      // this.name = this.$store.state.userInfo.nickName ? this.$store.state.userInfo.nickName : ''
      // this.proId = this.$route.query.id
      // this.number = this.$route.query.number
      // this.img = this.$route.query.img
      // this.showTitle = this.$route.query.showTitle
      // this.price = this.$route.query.price
      // this.deliveryType = this.$store.state.mall2.staticDeliverType
      // this.pageType = this.$route.query.pageType || '1'
      // 之后代码
      // this.pageType = "2"
      // if(this.pageType==2){

        this.payWaySelected=2
        this.payWayText="提货付款"
        // 预约单联系人配置显示与否
        // this.contactFlag=this.$store.state.globalConfig.contacts
        // this.payWays=this.payWays1
      // }
      // if (this.pageType == '2') {
      //   this.carts = JSON.parse(this.$route.query.carts)
      //   this.microStoreCode = this.$route.query.microStoreCode || ''
      //   this.settleCart()
      // }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .place-order {
    width 100%
    height 100%
    overflow hidden

    .scroll-div {
      position absolute;
      left 0;
      right 0;
      top 0;
      bottom 48px;
      overflow-y auto;
      -webkit-overflow-scrolling touch;

      .pickup-shop {
        display flex;
        align-items center;
      }

      .colorfulline {
        margin 0 -8px;
        height 3px;

        img {
          width 100%;
          height 100%;
          display block;
        }
      }

      .input-bg {
        margin-right 5px;
        border-radius 20px;
        background-color #efefef;
        padding 0 15px;

        input {
          width 100%;
          height 34px;
          background none;
          border none;
        }
      }

      .total {
        font-size 18px;
      }

      .price {
        font-size 12px;
        display flex;
        align-items center
        font-weight 500;

        .price-item {
          display flex;
          align-items flex-end;
          line-height 1;

          .xian {
            font-size 16px;
            padding 0 2px;
          }

          .big {
            font-size 20px;
          }
        }
      }
    }

    .bottom-div {
      position absolute;
      left 0;
      right 0;
      bottom 0px;
      height 48px;
      z-index 1;
      box-shadow 0 -1px 8px #eee;
      line-height 48px;

      .btn {
        height 48px;
        float right;
        padding 0 30px;
        font-size 18px;
        font-weight 500;
        color white;
      }

      .other {
        overflow hidden;
        padding 0 15px;

        .total {
          font-size 18px;
        }
      }
    }
  }
  /deep/ .van-dialog__content .van-dialog__message{
    padding 20px 10px
  }
</style>
