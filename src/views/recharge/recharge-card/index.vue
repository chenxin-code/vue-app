<template>
  <div class="reset-bg">
    <nav-top @backEvent="backEvent">
      <div class="my-cards" @click.stop="openMyCard">我的卡包</div>
    </nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container" v-if="selectSpuInfo">
        <div class="my-cards" @click.stop="openMyCard">我的卡包</div>
        <swiper class="card-swiper" :options="swiperOption" ref="cardSwiper" @slideChange="slideCard">
          <swiper-slide v-for="(item, index) in spuList" :key="index" class="card-item">
            <div class="card-content">
              <img :src="item.phMainUrl" alt="" class="bg">
            </div>
          </swiper-slide>
        </swiper>
        <div class="top-title">
          <p class="card-name">{{selectSpuInfo.spuName}}</p>
          <!-- <p class="ad-content" v-if="productType == 552">-->
          <p class="ad-content" v-if="spuSubType == 550002">
            ￥<span class="num">{{selectSpuInfo.price}}</span>
          </p>
          <p class="card-name tips">{{selectSpuInfo.spuShortName}}</p>
        </div>
        <!-- <template v-if="productType == 551">-->
        <template v-if="spuSubType == 550001">
          <div class="charge-section public-section" >
            <template v-if="selectSkuList.length">
              <p class="title">选择充值金额</p>
              <recharge-grid :col="3" :list="selectSkuList" @change="chooseChargeCard" ref="mychild"></recharge-grid>
            </template>
            <van-cell-group class="enter-price" v-if="otherSkuInfo && otherSkuInfo.activityPrice == 1">
              <van-field
                type="number"
                label="其他充值金额："
                v-model="otherChargePrice"
                @input="inputOtherChargePrice"
                @blur="otherChargePriceInput"
                :placeholder="placeholder">
                <div slot="right-icon" class="tip" v-if="salePrice">售价{{ salePrice }}元</div>
              </van-field>
            </van-cell-group>
          </div>
          <!-- 查看可用商品 -->
          <div
            @click="viewProduct"
            class="more-commodity public-section">
            <p class="title">
              查看可用商品
              <img class="more-icon" src="../assets/image/more-icon.png" alt="">
            </p>
          </div>
        </template>
        <!-- <template v-if="productType == 552">-->
        <template v-if="spuSubType == 550002">
          <!-- 服务内容 -->
          <div class="service-range public-section">
            <p class="title">服务范围</p>
            <ul class="service-list">
              <li class="ser-item" v-for="(item, index) in selectSpuInfo.serviceItems" :key="index">
                {{item.skuName}}<span class="num">x{{item.useTimes}}</span>
              </li>
            </ul>
          </div>
          <!-- 适用店铺 -->
          <div class="applicable-shop public-section" v-for="(item, index) in selectSpuInfo.consumeStores" :key="index">
            <p class="title">
              <img class="shop-icon" src="../assets/image/shop-icon.png" alt="">
              {{item.storeName}}
            </p>
          </div>
        </template>
        <!-- 邀请码 -->
        <van-cell-group class="invitation-code">
          <van-field type="number" label="邀请码：" v-model="rfrCode" placeholder="填写邀请人手机号，没有可以不填写"/>
        </van-cell-group>
        <!-- 发票 -->
        <div class="invoice">
          <div class="public-section">
            <p class="title">
              发票
              <van-switch active-color="#F80F16" size="20px" v-model="invoiceEnabled"/>
            </p>
          </div>
          <div class="public-section" v-if="invoiceEnabled == true">
            <p class="title has-bd-t" @click="chooseInvoice">
              发票信息
              <span class="invoice-type">
                <span v-if="userInvoice">{{userInvoice.title}}</span>
                <img class="more-icon" src="../assets/image/more-icon.png" alt="">
              </span>
            </p>
          </div>
        </div>
        <!-- 详情描述 -->
        <!-- <div class="description public-section">-->
        <!--   <p class="title">详情描述</p>-->
        <!--   <div class="des-content" v-html="selectSpuInfo.mobileDetail"></div>-->
        <!-- </div>-->
        <!-- 详情描述 -->
        <div class="table-view instructions">
          <div class="table-view-cell" v-if="$route.query.isFromPackage != 1">
            <div class="table-view-cell-text">
              <div class="left">失效日期</div>
              <div class="right" v-if="selectSpuInfo.termOfType == 1">永久有效</div>
              <div class="right" v-else>{{selectSpuInfo.expireDate}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="content">
                <div class="title">详情描述</div>
                <div class="des-content" v-html="selectSpuInfo.mobileDetail"></div>
              </div>
            </div>
          </div>
        </div>
        <public-submit :haveEasyCard="selectSpuInfo.haveEasyCard" @click="subCard(selectSpuInfo.haveEasyCard)">立即开卡</public-submit>
        <!-- 立即支付弹框 -->
        <van-popup
          class="pay-modal"
          position="bottom"
          v-model="payModal">
          <template v-if="selectSkuInfo">
            <div v-if="$route.query.isFromPackage">
              <div class="spend-price"><span>￥</span>{{ packageSalePrice }}</div>
            </div>
            <div v-else>
              <div class="spend-price" v-if="spuSubType == 550002"><span>￥</span>{{selectSpuInfo.price}}</div>
              <!-- <div class="spend-price" v-if="productType == 552"><span>￥</span>{{selectSpuInfo.price}}</div>-->
              <!-- <div class="spend-price" v-else="productType == 551"><span>￥</span>{{salePrice > 0 ? salePrice : selectSkuInfo.featureName}}</div>-->
              <div class="spend-price" v-else-if="spuSubType == 550001"><span>￥</span>{{salePrice > 0 ? salePrice : selectSkuInfo.featureName}}</div>
            </div>
            <van-cell-group>
              <!--   <van-field label="商品名称" input-align="right" :readonly="true" v-model="productType == 551 ? selectSkuInfo.showTitle : selectSkuList[0] && selectSkuList[0].showTitle"/>-->
              <van-field label="商品名称" input-align="right" :readonly="true" v-model="spuSubType == 550001 ? selectSkuInfo.showTitle : selectSkuList[0] && selectSkuList[0].showTitle"/>
              <van-field label="支付方式" v-if="payStyle.text" input-align="right" :readonly="true" v-model="payStyle.text"/>
              <van-radio-group v-model="radio">
                <van-cell-group>
                  <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable
                            @click="changeStyle(item, index)">
                    <div slot="title" class="pay-label">
                      <img class="pay-icon" v-if="item.payMode == '210'" src="../../../../static/image/mall2/weixin.png"
                           alt="">
                      <img class="pay-icon" v-else src="../../../../static/image/mall2/zhifubao.png" alt="">
                      {{item.text}}
                    </div>
                    <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
            </van-cell-group>
          </template>

          <div class="pay-confirm" @click="payment">立即支付</div>
          <img @click="payModal = false" class="close-btn" src="../../../../static/image/coupon/close-btn.png" alt="">
        </van-popup>
      </div>
      <div class="no-list" v-else>
        <div class="img">
          <img src="../assets/image/p1@2x.png" alt="">
        </div>
        <div class="text">暂无可开易捷卡，敬请期待~</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Toast} from 'vant'
  import RechargeGrid from '../components/recharge-grid'
  import PublicSubmit from '../components/public-submit.vue'
  import payHelper from '@/utils/payHelper'
  import {mapGetters} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        swiperOption: {
          effect: 'coverflow',
          coverflowEffect: {
            depth: 60,
            rotate: 40,
            slideShadows: false
          },
          slidesPerView: 'auto',
          centeredSlides: true
        },
        getResultTimes: 0,
        hasToPay: false,
        isInvoice: true, // 是否开票
        payModal: false,
        spuList: [], // spu列表
        selectSpuInfo: null, // 当前选中的spu信息
        skuList: [], // sku列表
        selectSkuList: [], // 选中的sku列表
        selectedSkuItem: {}, // 选中的sku信息
        otherSkuInfo: null, // 其它价格sku信息
        otherChargePrice: '', // 其它充值金额
        invoiceEnabled: false, // 选择是否填写发票
        rfrCode: '', // 推荐码
        selectedPayWay: [], // 支付方式
        payStyle: {}, // 支付方式
        radio: '',
        submitInfo: '', // 下单成功的信息 为支付使用
        productType: '', // 551充值卡 552 计次卡
        spuSubType:'',//550001(充值卡), 550002(计次卡)
        beforeSelectSkuList: '',

        packageProDetail: {}, // 合约套餐卡信息
        packageSalePrice: 0,
      }
    },
    activated() {
      //从后台进前台的协议
      this.$bridgefunc.enterForegroundCallBack(() => {
        if (this.hasToPay) {
          this.hasToPay = false;
          this.selectSkuInfo = false;
          this.getResultTimes = 0;
          this.checkPayResult();
        }
      });
    },
    mounted() {
      if (this.$route.query.isFromPackage) {
        // 从合约套餐进入
        this.packageProDetail = JSON.parse(window.localStorage.getItem('packageProDetail'))
        window.localStorage.removeItem('packageProDetail')
        // console.log(JSON.parse(JSON.stringify(this.packageProDetail)))

        let tempPackageProDetail = {}
        this.spuSubType = 550001
        tempPackageProDetail.spuName = this.packageProDetail.name
        tempPackageProDetail.phMainUrl = this.packageProDetail.frontPicUrl
        tempPackageProDetail.spuShortName = this.packageProDetail.ad
        tempPackageProDetail.easyCardId = this.packageProDetail.easyCardId
        tempPackageProDetail.mobileDetail = this.packageProDetail.introduction

        this.otherSkuInfo = {
          activityPrice: 1,
          saleNumBegin: this.packageProDetail.minRechargeAmount,
          saleNumMax: this.packageProDetail.maxRechargeAmount
        }
        this.selectSpuInfo = tempPackageProDetail
        this.spuList.push(tempPackageProDetail)
      } else {
        // 其他途径进入
        this.getRechargeProList()
      }
    },
    computed: {
      placeholder() {
        let str = `请输入充值金额`
        if (this.otherSkuInfo.saleNumBegin && this.otherSkuInfo.saleNumMax) {
          str = `单次只能充值${this.otherSkuInfo.saleNumBegin}-${this.otherSkuInfo.saleNumMax}元`
        }
        if (this.otherSkuInfo.saleNumBegin) {
          str = `单次最小充值${this.otherSkuInfo.saleNumBegin}`
        } else if (this.otherSkuInfo.saleNumMax) {
          str = `单次最小充值${this.otherSkuInfo.saleNumMax}`
        }
        return str
      },
      salePrice() {
        if (this.otherSkuInfo) {
          return Math.round((+this.otherChargePrice * this.otherSkuInfo.salePrice) * 100) / 100
        } else {
          return 0
        }
      },
      selectSkuInfo() {
        if (this.salePrice) {
          this.otherSkuInfo.featureValue = this.salePrice
          this.otherSkuInfo.number = this.otherChargePrice
          this.selectedSkuItem = this.$util.deepClone(this.otherSkuInfo)
        }
        return this.$util.deepClone(Object.assign({}, this.selectedSkuItem, this.salePrice ? {} : this.selectedSkuItem.skuFeatures ? this.selectedSkuItem.skuFeatures[0] : {}))
      },
      ...mapGetters(['userInvoice'])
    },
    methods: {
      checkPayResult() {
        this.$Loading.open();
        let url = "/app/json/app_shopping_order/queryPayState";
        let paramsData = {
          token: this.$store.state.login.token,
          tradeNo: this.submitInfo.tradeNo,
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              // 0 待支付  1支付成功  2其他(支付失败、支付取消等)
              if (data.data.state == 1) {
                this.enterSuccess()
              } else {
                this.getResultTimes++;
                if (this.getResultTimes > 6) {
                  return;
                }
                setTimeout(() => {
                  this.checkPayResult();
                }, 500)
              }
            }
          },
          error => {
            this.$Loading.close();
          }
        );
      },
      // 轮播图切换
      slideCard() {
        this.otherSkuInfo = []
        this.selectSpuInfo = this.spuList[this.$refs.cardSwiper.swiper.activeIndex]
        // this.productType = this.selectSpuInfo.productType
        this.spuSubType = this.selectSpuInfo.spuSubType
        this.selectSkuList = this.formatCardInfo(this.selectSpuInfo.spuId)
        if (this.selectedSkuItem == '') { // 只有充值卡需要清除
          this.$refs.mychild.changeItemActive() // 将选中sku样式去掉
          this.selectedSkuItem = {} // 置空所选sku信息
          this.otherChargePrice = '' // 置空其他充值金额
        }
      },
      // 金额输入
      inputOtherChargePrice() {
        // 输入其他金额
        this.otherChargePrice = /^[1-9]\d*$/.exec(this.otherChargePrice) ? /^[1-9]\d*$/.exec(this.otherChargePrice)[0] : ''
        if (this.$refs.mychild) {
          this.$refs.mychild.changeItemActive() // 将选中sku样式去掉
        }
      },
      // 选中充值面额
      chooseChargeCard(item) {
        this.selectedSkuItem = this.$util.deepClone(item)
        this.otherChargePrice = ''
      },
      // 选择发票
      chooseInvoice() {
        this.$router.push(`/taitouList?fromPage=recharge`)
      },
      // 选择支付方式
      changeStyle(item, index) {
        this.radio = index
        this.payStyle = item
      },
      // 设置支付方式
      setPayWays() {
        this.selectedPayWay = []
        // payHelper.getPayWays('200001', this.productType == 551 ? this.selectSkuInfo.receivablesOuCode : this.selectSkuList[0].receivablesOuCode).then(res => {
        payHelper.getPayWays('200001', this.spuSubType == 550001 ? this.selectSkuInfo.receivablesOuCode : this.selectSkuList[0].receivablesOuCode).then(res => {
          this.selectedPayWay = res || []
          if (this.selectedPayWay.length > 0) {
            this.radio = 0
            this.payStyle = this.selectedPayWay[0]
          }
          this.payModal = true
        })
      },
      // 获取充值卡列表
      getRechargeProList() {
        let paramsData = {
          token: this.$store.state.login.token,
          productType: '550',
          productTypeSub: '550001',
          phone: this.$store.state.login.phone
        }
        this.$request.post('/app/json/product_recharge/getRechargeProList', paramsData).then(res => {
          if (res.status == 0) {
            if (res.data.list.length == 0) {
              this.$Toast('暂无卡信息')
            }
            if (res.data.list instanceof Array) {
              this.skuList = res.data.list
              // 如果需要不可用在最前，则对数据进行排序
            }
            if (res.data.spuModels instanceof Array) {
              this.spuList = res.data.spuModels
              this.selectSpuInfo = this.spuList[0]
              this.productType = this.selectSpuInfo.productType
              this.spuSubType = this.selectSpuInfo.spuSubType
              this.selectSkuList = this.formatCardInfo(this.selectSpuInfo.spuId)
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 立即开卡
      subCard(type) {
        if (this.$route.query.isFromPackage) {
          // 合约套餐
          if (!this.otherChargePrice) {
            this.$Toast('请输入充值金额')
          } else {
            this.$Loading.open()
            this.$http.post('/app/json/app_contract_shopping_order/settle', {
              carts: [{
                skuId: this.packageProDetail.skuId,
                storeOuCode: this.packageProDetail.storeOuCode,
                number: this.otherChargePrice,
                checked: 1,
              }],
              deliveryType: 2,
              packageRefuelId: this.$route.query.packageRefuelId
            }).then(res => {
              this.$Loading.close()
              let data = res.data
              if (data.status == 0) {
                this.packageSalePrice = data.data.occur[0].payAmount
                this.selectSkuInfo.receivablesOuCode = data.data.occur[0].ouCode
                this.selectSkuInfo.showTitle = this.packageProDetail.name
                this.selectSkuInfo.skuId = this.packageProDetail.skuId,
                this.selectSkuInfo.storeOuCode = this.packageProDetail.storeOuCode,
                this.selectSkuInfo.number = this.otherChargePrice
                this.setPayWays()
              } else {
                this.$Toast(data.info)
              }
            }).catch(err => {
              this.$Loading.close()
              this.$Toast(`settle err ${err}`)
            })
          }
        } else {
          // 其他
          if (type == true) {
            this.$Toast('此卡已开过')
          } else {
            // if (!this.selectSkuInfo.featureValue && this.productType == 551) { // 515充值卡  552 计次卡
            if (!this.selectSkuInfo.featureValue && this.spuSubType == 550001) { // 515充值卡  552 计次卡
              this.$Toast('请选择充值金额')
            } else if (this.invoiceEnabled && !this.userInvoice) {
              this.$Toast('请选择发票')
            } else {
              this.setPayWays() // 获取支付方式
            }
          }
        }
      },
      // 提交订单
      payment() {
        if (this.radio !== '') {
          this.$Loading.open()
          let queryUrl = '/app/json/app_shopping_order/submit'
          let paramsData = {
            token: this.$store.state.login.token,
            deliveryType: '2',
            carts: [{
              // skuId: this.productType == 551 ? this.selectSkuInfo.skuId : this.selectSkuList[0].skuId,
              skuId: this.spuSubType == 550001 ? this.selectSkuInfo.skuId : this.selectSkuList[0].skuId,
              // storeOuCode: this.productType == 551 ? this.selectSkuInfo.storeOuCode : this.selectSkuList[0].storeOuCode,
              storeOuCode: this.spuSubType == 550001 ? this.selectSkuInfo.storeOuCode : this.selectSkuList[0].storeOuCode,
              number: this.selectSkuInfo.number ? this.selectSkuInfo.number : 1
            }]
          }
          if (this.rfrCode) {
            paramsData.rfrCode = this.rfrCode
          }
          if (this.invoiceEnabled && this.userInvoice) {
            paramsData.userInvoice = {
              invoiceUse: 1,
              invoiceType: this.userInvoice.type,
              invoiceTitleType: this.userInvoice.titleType,
              invoiceTitle: this.userInvoice.title,
              invoiceUserName: this.userInvoice.userName,
              invoiceUserEmail: this.userInvoice.userEmail,
              invoiceUserMobile: this.userInvoice.userPhone,
              invoiceUserOrgTaxNo: this.userInvoice.orgTaxNo,
              invoiceDetailType: 0
            }
          }
          if (this.$route.query.isFromPackage) {
            queryUrl = '/app/json/app_contract_shopping_order/submit'
            paramsData.packageRefuelId = this.$route.query.packageRefuelId
          }
          this.$http.post(queryUrl, paramsData).then(res => {
            let data = res.data
            if (data.status == 0) {
              this.submitInfo = data.data
              this.pay()
            } else {
              this.$Toast(data.info)
            }
            this.$Loading.close()
          })
        } else {
          this.$Toast('请选择支付方式')
        }
      },
      // 支付订单
      pay() {
        if (this.payStyle == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        this.payModal = false
        this.hasToPay = true;
        payHelper.payEvent(this.payStyle, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
          this.enterSuccess();
        }).catch(() => {
          this.hasToPay = false;
        })
        // this.$Loading.open()
        // let paramsData = {
        //   token: this.$store.state.login.token,
        //   orderType: this.submitInfo.orderType, // 订单类型
        //   orderId: this.submitInfo.orderId, // 商城订单ID
        //   payMode: this.payStyle.payMode, // 支付方式
        //   payModeSub: this.payStyle.payModeSub // 支付具体方式
        // }
        // this.$http.post('/app/json/app_shopping_order/pay', params).then(res => {
        //   let data = res.data
        //   if (data.status == 0) {
        //     payHelper.doPay(this.payStyle, data.data.payInfo).then(() => {
        //       this.enterSuccess()
        //     }).catch(() => {
        //       this.$Toast('支付失败')
        //     })
        //   } else {
        //     this.$Toast(data.info)
        //   }
        //   this.$Loading.close()
        // })
      },
      enterSuccess() {
        if (this.$route.query.isFromPackage) {
          this.hasToPay = false
          this.$router.replace({
            path: '/contract-order-success',
            query: {
              packageRefuelId: this.$route.query.packageRefuelId,
              bundleName: this.$route.query.bundleName,
              rebateNum: this.$route.query.rebateNum
            }
          })
        } else {
          this.$router.replace({
            path: '/recharge/recharge-result',
            query: {
              orderType: this.submitInfo.orderType,
              shoppingOrderId: this.submitInfo.shoppingOrderId,
              bundleName: this.$route.query.bundleName,
              rebateNum: this.packageProDetail.rebate
            }
          })
        }
      },
      otherChargePriceInput() {
        if (this.otherSkuInfo.saleNumBegin && this.otherChargePrice < this.otherSkuInfo.saleNumBegin) {
          this.otherChargePrice = this.otherSkuInfo.saleNumBegin
          this.$Toast(`最小充值金额${this.otherSkuInfo.saleNumBegin}`)
        } else if (this.otherSkuInfo.saleNumMax && this.otherChargePrice > this.otherSkuInfo.saleNumMax) {
          this.otherChargePrice = this.otherSkuInfo.saleNumMax
          this.$Toast(`最大充值金额${this.otherSkuInfo.saleNumMax}`)
        } else if (this.otherSkuInfo.saleNumStep) {
          let modulo = (this.otherChargePrice - this.otherSkuInfo.saleNumBegin) % this.otherSkuInfo.saleNumStep
          let remainder = Math.round((this.otherChargePrice - this.otherSkuInfo.saleNumBegin) / this.otherSkuInfo.saleNumStep)
          if (modulo != 0) {
            this.otherChargePrice = this.otherSkuInfo.saleNumBegin + this.otherSkuInfo.saleNumStep * remainder
            if (this.otherChargePrice < this.otherSkuInfo.saleNumBegin) {
              this.otherChargePrice = this.otherSkuInfo.saleNumBegin
            } else if (this.otherSkuInfo.saleNumMax && this.otherChargePrice > this.otherSkuInfo.saleNumMax) {
              this.otherChargePrice = this.otherSkuInfo.saleNumMax
            }
          }
        }
      },
      // 查看可用商品
      viewProduct() {
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            lastPath: this.$route.path,
            easyCardId: this.selectSpuInfo.easyCardId
          }
        })
      },
      formatCardInfo(spuId) {
        let arr = []
        this.skuList.forEach(item => {
          if (item.spuId === spuId) {
            // if (this.productType == 551) { // 充值卡
            if (this.spuSubType == 550001) { // 充值卡
              if (item.activityPrice === 1) {
                this.otherSkuInfo = item
              } else {
                arr.push(item)
              }
            // } else if (this.productType == 552) { // 计次卡
            } else if (this.spuSubType == 550002) { // 计次卡
              arr.push(item)
            }
          } else {
            arr.push()
          }
        })
        return arr
      },
      backEvent() {
        this.$router.go(-1)
        this.$keepaliveHelper.deleteCache(this)
      },
      openMyCard() {
        // 打开我的卡包
        this.$router.push({path: '/recharge/my-card'})
      }
    },
    components: {
      Toast,
      PublicSubmit,
      RechargeGrid
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  $color-theme-b = #1C8FF1
  .reset-bg {
    background-color #F6F6F6 !important
  }

  .my-cards {
    position absolute
    right 10px
    top 0
    font-size 13px
  }

  .container {
    height 100%
    overflow-y auto
    padding-bottom 80px
    padding-top: 10px;
    position relative
  }
    .my-cards{
      position absolute
      top 50px
      right -5px
      z-index 500
      padding: 4px 6px 3px 8px
      background: #83591a
      color: #fffdf9
      border-bottom-left-radius 10px
      border-top-left-radius 10px

    }

  .card-swiper {
    overflow hidden

    .card-item {
      width 75%

      .card-content {
        width 100%
        height 160px
        overflow hidden
        border-radius 10px
        position relative

        .bg {
          width 100%
          height 100%
        }

        .content {
          box-sizing border-box
          position absolute
          left 0
          top 0
          bottom 0
          right 0
          padding 20px 15px
          color #fff
          display flex
          justify-content space-between
          align-items left
          flex-direction column

          .card-name {
            font-size 18px
            display flex
            justify-content space-between
            align-items flex-end

            .text {
              max-width 200px
              ellipse()
            }

            .card-type {
              font-size 14px
            }
          }

          .card-price {
            font-size 30px
            margin-top 35px

            .identifier {
              font-size 20px
            }
          }

          .card-number {
            margin-top 25px
            font-size 14px
          }
        }
      }
    }
  }

  .top-title {
    position relative
    z-index 2
    background-color #fff
    padding 15px
    margin-top 10px
    line-height 26px
    // bdr-t()

    .card-name {
      font-size 16px
    }
    .tips {
      color: $color-text-d
      font-size 12px
    }

    .ad-content {
      color $color-theme-r
      line-height 16px
      .num {
        font-size 22px
      }
    }
  }

  .public-section {
    background-color #fff
    margin-top 10px
    padding 0 15px

    .title {
      font-size 17px
      padding 15px 0
      display flex
      justify-content space-between
      align-items center

      &.has-bd-t {
        bdr-t()
      }

      .more-icon {
        width 20px
        height 5px
      }
    }
  }

  .charge-section {
    .chose-list {
      display flex
      flex-wrap wrap
      justify-content space-between
      text-align center

      .item {
        width 110px
        padding 15px 0
        border 1px solid $color-theme-b
        border-radius 5px
        color $color-theme-b
        position relative
        overflow hidden
        margin-bottom 15px

        .price {
          font-size 17px
        }

        .sell-price {
          font-size 13px
          margin-top 5px
        }

        &.disable {
          color #ccc
          border-color #ccc
        }

        &.active::before {
          content ''
          position absolute
          right -17px
          bottom -17px
          border 15px solid transparent
          border-left-color $color-theme-b
          transform rotate(45deg)
        }
      }
    }

    .enter-price {
      padding 10px 0

      /deep/ &::after {
        display none
      }

      .van-cell {
        padding 0
        align-items center

        /deep/ .van-field__label {
          max-width 100px !important
          width: 100px
        }

        /deep/ .van-field__control {
          background-color #F6F6F6
          font-size 12px
          padding 5px 10px
          border-radius 20px
        }

        .tip {
          color $color-theme-r
        }
      }
    }
  }

  .invitation-code {
    margin-top 10px

    /deep/ &::after {
      display none
    }

    /deep/ .van-field__label {
      font-size 17px
    }
  }

  .invoice {
    margin-top 10px

    .public-section {
      margin-top 0
    }

    .invoice-type {
      display flex
      align-items center
      font-size 13px

      .more-icon {
        margin-left 10px
      }
    }
  }

  .description {
    padding-bottom 15px !important

    .des-content {
      font-size 14px
      line-height 19px
      color #666
      >>> img {
        width: 100%
        vertical-align top
      }
    }
  }

  .pay-modal {
    border-radius 15px 15px 0 0

    .spend-price {
      font-size 30px
      text-align center
      margin-top 30px
      font-weight 700

      span {
        font-size 20px
        font-weight 500
      }
    }

    .van-cell {
      align-items center
    }

    .pay-label {
      display flex
      align-items center

      .pay-icon {
        width 25px
        margin-right 10px
      }
    }

    .van-hairline--top-bottom::after {
      display none
    }

    .pay-confirm {
      height 55px
      width 100%
      line-height 55px
      background-color $color-theme-r
      text-align center
      font-size 20px
      color #fff
      margin-top 15px
    }

    .close-btn {
      width 15px
      position absolute
      right 20px
      top 15px
    }
  }
    /deep/ .van-radio {
      display inline-block
    }
  .public-section {
    background-color #fff
    margin-top 10px
    padding 0 15px
    .title {
      font-size 17px
      padding 15px 0
      display flex
      justify-content space-between
      align-items center
      &.has-bd-t {
        bdr-t()
      }
      .more-icon {
        width 20px
        height 5px
      }
    }
  }
  .service-range {
    .service-list {
      .ser-item {
        display flex
        justify-content space-between
        height 45px
        line-height 45px
        font-size 15px
        bdr-b()
      }
    }
  }
  .applicable-shop {
    .title {
      justify-content left
      .shop-icon {
        width 22px
        height 20px
        display flex
        margin-right 10px
      }
    }
  }
  .instructions {
    padding: 11px 5px
    background #fff
    margin-top: 10px

    .left {
      font-size: 14px
    }

    .right {
      color: $color-text-d
    }
    .content {
      .title {
        padding-bottom: 10px
      }
      .des-content {
        line-height 20px
        color: $color-text-d
      }
    }
  }
  .no-list {
    text-align center
    padding-top: 50px
    .img {
      padding-bottom: 10px
      img {
        width: 200px
      }
    }
    .text {
      color $color-text-d
    }
  }
  .active {
    background $color-background-ll
  }
</style>
