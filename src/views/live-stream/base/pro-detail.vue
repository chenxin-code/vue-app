/**Created by liaoyingchao on 2020-04-07.*/

<template>
  <div class="pro-detail mall2">
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pro-row">
          <div class="img-div">
            <img :src="detailData.phMainUrl">
          </div>
          <div class="info-div">
            <div class="title theme_font_black" v-html="getSkuNameStr(detailData)"></div>
            <div class="price">
              <PriceOrder :listitem="detailData"></PriceOrder>
            </div>
          </div>
        </div>
        <div class="pop-scroll-div">
          <div class="items-div" v-for="(feature, fidx) in detailData.featureList" v-if="featureRefresh">
            <div class="title theme_font_common">{{feature.featureName}}</div>
            <div class="item theme_font_common theme_bg_white_ef"
                 :class="{'theme_light_bg_i theme_standard_font_i theme_standard_bdr_i': subFeature.selected, 'theme_font_tint_i': getCanSelectWith(fidx, subFeature)}"
                 v-for="subFeature in feature.featureValueList" @click="subFeatureEvent(subFeature, fidx)">
              {{subFeature.featureValue}}
            </div>
          </div>
          <div class="count-line">
            <div class="full theme_font_common">购买数量（库存 {{stockNum < 1000 ? stockNum : '充足'}}）</div>
            <van-stepper v-model="selectedNum" :min="minNum" :max="maxNum" :step="stepNum" integer/>
          </div>
          <div class="address">
            <!--@click="selectArea"-->
            <div class="flex-row"
                 v-if="detailData.deliveryType == '2'" @click="selectArea">
              <div class="label-middle">送至</div>
              <div class="text" v-if="$store.state.mall2.selectAddress.id == ''">
                <i class="iconfont mall-dingwei theme_font_common"></i>
                <span class="single-line">{{regionText}}</span>
              </div>
              <div class="text single-line" v-if="$store.state.mall2.selectAddress.id != ''">
                <i class="iconfont mall-dingwei theme_font_common"></i>
                <span class="single-line">{{$store.state.mall2.selectAddress.addressFull}}</span>
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
            <!--@click="selectPickUpAddress"-->
            <div class="flex-row" v-if="detailData.deliveryType == '1'" @click="selectPickUpAddress">
              <div class="label-middle theme_font_common">自提点</div>
              <div class="text single-line theme_font_common">
                <i class="iconfont mall-dingwei theme_font_common"></i>
                <span class="single-line">{{$store.state.mall2.zitiAddress.storeName}}</span>
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_common"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_y"
             v-if="stockNum == 0 && canSale == true && detailData.status != '0'">
          <p class="title">商品缺货</p>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_y"
             v-else-if="canSale == true && detailData.status == '0'">
          <p class="title">商品已下架</p>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_y" v-else-if="canSale == false">
          <p class="title">不在可售区域</p>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="_buyNow" v-else>立即购买</div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import PriceOrder from '@/components/commonui/price/price-order'
  import Address from '@/components/mall2/common/address'
  import PickupAddress from '../pickup-address/index'

  export default {
    name: "pro-detail",
    props: ['proItem', 'spCode', 'lbId', 'proSkuDistributionId', 'microStoreCode'],
    components: {
      PriceOrder
    },
    data() {
      return {
        showPop: false,
        skuId: '',
        storeOuCode: '',
        deliverType: '2',
        selectedNum: 1,
        minNum: 1,
        maxNum: 999,
        stockNum: 1,
        stepNum: 1,
        detailData: {},
        myFeatures: [],
        featureRefresh: true,
        canSale: true,
        selectedText: '',
        getStockTimes: 0
      }
    },
    methods: {
      selectArea: function () {
        Address.open({
          initData: {
            selectedId: this.$store.state.mall2.selectAddress.id,
            token: this.$store.state.login.token
          },
          addressEvent: (selected, saddress) => {
            this.matchAddress = saddress;
            this.$store.state.mall2.selectAddress = selected;
            this.$bridgefunc.vuexStorage()
            this._getCustomStock();
            Address.close()
          }
        })
      },
      selectPickUpAddress: function () {
        PickupAddress.open({
          initData: {
            selectedId: this.$store.state.mall2.zitiAddress.id,
            token: this.$store.state.login.token,
            posx: this.$store.state.currentLocation.posx,
            posy: this.$store.state.currentLocation.posy,
            skuIds: [this.detailData.skuId],
          },
          addressEvent: (selected) => {
            PickupAddress.close()
            if (selected) {
              this.$store.state.mall2.zitiAddress = selected;
              this.$bridgefunc.vuexStorage()
              // 切换自提点，刷新整个详情
              this._getProductDetail();
              // this._setDefaultPickupAddress(selected.id);
            }
          }
        })
      },
      // 立即购买
      _buyNow: function () {

        if (this.stockNum < this.selectedNum) {
          this.$Toast('当前商品库存不足！')
          return;
        }
        this.$Loading.open();
        let url = '/app/json/app_cart/SettleCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            number: this.selectedNum,
            selfActivityId: '',
            checked: '1',
            spCode: this.spCode,
            proSkuDistributionId: this.proSkuDistributionId || ''
          }],
          deliveryType: this.deliverType,
          userAddress: this.$store.state.mall2.selectAddress,
          pickupId: this.$store.state.mall2.zitiAddress.id,
          userAddressId: '',
          microStoreCode: this.microStoreCode || '',
          //orderCategory: this.orderCategory,
          //vipUnitUserCode:this.vipUnitUserCode,
          //limitWalletCardNo: this.$route.query.cardNo, // 易捷卡的卡号（充值卡）
        };
        if (this.deliverType == 2) {
          if (this.$store.state.mall2.selectAddress.id > 0) {
            paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
          }
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let params = {
                res: data.data,
                paramsData: paramsData,
                deliveryType: this.deliverType,
                easyCardId: this.easyCardId,
                cardType: this.cardType, // 区分充值卡 计次卡
                cardNo: this.$route.query.cardNo, // 卡号 (提交订单页面查询易捷卡支付信息使用)
                skuCode: this.$route.query.skuCode, // 商品编码
                storeOuCode: this.$route.query.storeOuCode, // 店铺编码
                cardName: this.$route.query.cardName, // 计次卡名称
                lbId: this.lbId,
                lsProductName: this.detailData.showTitle,
                microStoreCode: this.microStoreCode,
                proSkuDistributionId: this.proSkuDistributionId,
              };

              this.$router.push({
                name: '填写订单',
                params: params
              })
              setTimeout(() => {
                this.$emit('buyPush')
              }, 100)
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
      subFeatureEvent: function (subFeature, fidx) {
        if (this.getCanSelectWith(fidx, subFeature)) {
          this.$Toast('当前规格组合没有商品!')
          return
        }
        if (subFeature.selected) {
          subFeature.selected = false;
          this.featureRefresh = false
          this.$nextTick(() => {
            this.featureRefresh = true
          })
          return;
        }
        let feature = this.detailData.featureList[fidx]
        for (let i = 0; i < feature.featureValueList.length; i++) {
          let item = feature.featureValueList[i]
          item.selected = false;
        }
        subFeature.selected = true;
        this.generateSelectedText()
        if (this.myFeatures.length == this.detailData.featureList.length) {
          // 表示选完整了
          this._getProductDetail();
        }
      },
      generateSelectedText: function () {
        this.selectedText = ''
        this.myFeatures = [];
        for (let i = 0; i < this.detailData.featureList.length; i++) {
          let item = this.detailData.featureList[i]
          for (let j = 0; j < item.featureValueList.length; j++) {
            let subItem = item.featureValueList[j]
            if (subItem.selected) {
              this.selectedText += subItem.featureValue + '，'
              this.myFeatures.push(subItem.featureValueId)
              break;
            }
          }
        }
        this.selectedText += this.selectedNum + (this.detailData.metric ? this.detailData.metric : '件')
      },
      _getsitelist: function () {//自提站点
        this.$Loading.open();
        let url = '/app/json/user_address/searchSelfliftAddressList';
        if (this.productType == 6) {
          url = '/app/json/store/getStoreList';
        }
        let skuIds = []
        skuIds.push(this.detailData.skuId)
        let params1 = {
          posx: this.$store.state.currentLocation.posx,
          posy: this.$store.state.currentLocation.posy,
          page: {
            index: 1,
            pageSize: 50
          },
          skuIds: skuIds
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            let list = data.data
            for (let i = 0; i < list.length; i++) {
              let item = list[i]
              if (item.hasStock == 1) {
                this.$store.state.mall2.zitiAddress = item
                this._getCustomStock()
              }
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          // this.$Toast('获取自提站点失败')
        });
      },
      // 获取当前库存
      _getCustomStock: function () {
        if (this.deliveryType == 2 && (this.$store.state.mall2.selectAddress.id == '' || this.$store.state.mall2.selectAddress.id == undefined) && (this.$store.state.mall2.selectAddress.provinceId == '' || this.$store.state.mall2.selectAddress.provinceId == undefined)) {
          //配送下没有地址就不去  取库存了
          return;
        }
        if (this.deliveryType == 1 && (this.$store.state.mall2.zitiAddress.id == '' || this.$store.state.mall2.zitiAddress.id == undefined)) {
          // 自提并且没有自提点id
          return;
        }
        let url = '/app/json/app_stock/querySkuStockByApp';
        let paramsData = {
          token: this.$store.state.login.token,
          productList: [{skuId: this.detailData.skuId}],
          areaAddress: {
            province: this.$store.state.mall2.selectAddress.provinceId,
            city: this.$store.state.mall2.selectAddress.cityId,
            area: this.$store.state.mall2.selectAddress.countryId,
            town: this.$store.state.mall2.selectAddress.townId
          },
          deliverType: this.deliverType,
          selfPickStore: this.$store.state.mall2.zitiAddress.id,
          storeCode: this.detailData.storeOuCode
        }
        this.$Loading.open()
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.canSale = true
              let productList = data.data.productList
              if (productList.length > 0) {
                this.stockNum = productList[0].stockCurrentNumber
                if (this.stockNum == 0) {
                  this.getStockTimes ++
                  if (this.getStockTimes >= 2) {
                    return ;
                  }
                  this._getsitelist()
                }
                if (this.mktStockNum != -1) {
                  // 活动库存，小于当前库存，取活动库存当库存
                  this.stockNum = this.mktStockNum < this.stockNum ? this.mktStockNum : this.stockNum
                }
                this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
                if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
                  if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                    this.maxNum = this.detailData.discountGoodsCntPerOrder
                  }
                }
                this.maxNum = this.maxNum > this.stockNum ? this.stockNum : this.maxNum
              }
            } else {
              if (data.errorCode == 2201) {
                // 不在可售区域
                this.canSale = false
              } else {
                this.$Toast(data.info);
              }
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      _getProductDetail: function () {
        this.$Loading.open();
        let url = '/app/json/product/getAppProDetail';
        let paramsData = {
          skuId: this.skuId,
          featureValueIds: this.myFeatures,
          lng: this.$store.state.currentLocation.posx,
          lat: this.$store.state.currentLocation.posy,
          deliverType: this.deliverType
        };

        paramsData.storeOuCode = this.storeOuCode
        paramsData.pickupStoreOuCode = this.storeOuCode

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {

              this.detailData = data.data;

              if (this.selectedNum < this.detailData.saleNumBegin) {
                this.selectedNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              }
              this.stepNum = this.detailData.saleNumStep != '' ? this.detailData.saleNumStep : 1
              this.minNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
              if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
                if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                  this.maxNum = this.detailData.discountGoodsCntPerOrder
                }
              }
              this.mktStockNum = this.detailData.mktStockNum != '' ? this.detailData.mktStockNum : -1
              for (let i = 0; i < this.detailData.featureList.length; i++) {
                let item = this.detailData.featureList[i]
                for (let j = 0; j < item.featureValueList.length; j++) {
                  let subItem = item.featureValueList[j]
                  for (let k = 0; k < this.detailData.myFeatureValueList.length; k++) {
                    let selectedItem = this.detailData.myFeatureValueList[k]
                    if (subItem.featureValueId == selectedItem.featureValueId) {
                      subItem.selected = true;
                      break;
                    }
                  }
                }
              }

              // 全局价格处理
              let dpedData = this.$mallCommon.priceFromItem(this.detailData)
              this.detailData.dpedData = dpedData;

              if (this.skuId != this.detailData.skuId || this.detailComment == null) {
                this.skuId = this.detailData.skuId
              }

              this.getStockTimes = 0
              this._getCustomStock();

              this.showPop = true;
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
      getCanSelectWith: function (fidx, subFeature) {
        if (subFeature.selected) {
          return false
        }
        let kyList = this.detailData.kyList
        let featureList = this.detailData.featureList
        let descartes = []
        for (let i = 0; i < featureList.length; i++) {
          if (i == fidx) {
            descartes.push(subFeature.featureValueId)
            continue;
          }
          let item = featureList[i]
          let hasSelected = false
          for (let j = 0; j < item.featureValueList.length; j++) {
            let subItem = item.featureValueList[j]
            if (subItem.selected) {
              hasSelected = true
              descartes.push(subItem.featureValueId)
              break;
            }
          }
          if (!hasSelected) {
            descartes.push('*')
          }
        }
        return this.descartesInList(descartes, kyList)
      },
      descartesInList: function (descartes, kyList) {
        let ican = false
        for (let i = 0; i < kyList.length; i++) {
          let kyStr = kyList[i]
          let arr = kyStr.split(',')
          if (descartes.length == arr.length) {
            for (let j = 0; j < arr.length; j++) {
              let s1 = descartes[j]
              if (s1 == '*') {
                ican = true
                continue;
              }
              let s2 = arr[j]
              if (s1 == s2) {
                ican = true
              } else {
                ican = false
                break
              }
            }
            if (ican) {
              return false
            }
          }
        }
        return true
      },
      getSkuNameStr: function (item) {
        let skuName = item.showTitle
        if (this.deliverType == '1') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">自提</span>` + skuName
        } else if (this.deliverType == '2') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">配送</span>` + skuName
        }
        if (item.interfaceType == '2') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_1 || '京东'}</span>` + skuName
        } else if (item.interfaceType == '1') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_2 || '有路'}</span>` + skuName
        }
        return skuName
      },
      popClose: function () {
        this.showPop = false;
        this.$emit('popClose')
        // setTimeout(() => {
        //
        // }, 100)
      },
    },
    created() {

      this.skuId = this.proItem.skuId
      this.deliverType = this.proItem.deliverType
      if (this.deliverType == '12') {
        this.deliverType = this.$store.state.mall2.staticDeliverType
      } else if (this.deliverType == '1' || this.deliverType == '2') {
        this.$store.state.mall2.staticDeliverType = this.deliverType
      }
      this.storeOuCode = this.proItem.storeOuCode
      this._getProductDetail()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .pro-detail {
    overflow hidden
    .address {
      padding 5px 0px;
      .flex-row {
        padding 10px 8px;
        display flex;
        align-items center
        font-size 13px;
        .text {
          flex 1;
          padding 0 10px 0 20px;
          display flex;
          align-items center;
          justify-content flex-end
          span {
            direction: rtl;
          }
        }
      }
    }
  }
</style>
