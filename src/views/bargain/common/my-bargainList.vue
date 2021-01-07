<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-group">
      <div class="nav-bar">
        <div class="nav-bar-item" :class="{active: currentType === item.type}" v-for="(item, index) in menu" :key="index" @click="tabChange(item.type)" >
          <span class="text">{{item.text}}</span>
        </div>
      </div>
      <div class="my-group-list">
        <scroll @scroll="scrollHandler" :hasMore="false" :pullUpLoad="true" :listenScroll="true" @pullingUp="getMyBargainList" :data="myBargainList" :startY="0" :probeType="2" v-if="myBargainList.length" >
          <div v-for="(item,index) in myBargainList" :key="index">
            <group :groupCoupon="item" :mybargainList="true" @success='getMyBargainList' @successBtn='successBtn' @inventFrend="invent" :type="type"/>
          </div>
        </scroll>
        <div class="no-list" v-if="!myBargainList.length">
          <div class="img-div">
            <img src="../image/拼券.png" />
          </div>
          <div class="tip theme_font_gray">暂无活动，快去发起砍价活动吧~</div>
        </div>
      </div>
    </nav-content>
    <div class="mall2">
      <pop-view v-if="showPop" @closeEvent="popClose">
        <div class="pop-body">
          <div class="pro-row">
            <div class="img-div">
              <img :src="detailData.phMainUrl">
            </div>
            <div class="info-div">
              <div class="title theme_font_black" v-html="getSkuNameStr(detailData)"></div>
            </div>
          </div>
          <div class="pop-scroll-div">
            <!-- <div class="items-div" v-for="(feature, fidx) in detailData.featureList" v-if="featureRefresh">
              <div class="title theme_font_common">{{feature.featureName}}</div>
              <div class="item theme_font_common theme_bg_white_ef"
                  :class="{'theme_light_bg_i theme_standard_font_i theme_standard_bdr_i': subFeature.selected, 'theme_font_tint_i': getCanSelectWith(fidx, subFeature)}"
                  v-for="subFeature in feature.featureValueList" @click="subFeatureEvent(subFeature, fidx)">
                {{subFeature.featureValue}}
              </div>
            </div> -->
            <div class="count-line">
              <div class="full theme_font_common">购买数量（库存 {{stockNum < 1000 ? stockNum : '充足'}}）</div>
              <van-stepper v-model="selectedNum" :min="minNum" :max="maxNum" :step="stepNum" @change="numChange" integer/>
            </div>
          </div>
          <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent">立即购买
          </div>
        </div>
      </pop-view>
     </div>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import group from "./group.vue";
import Scroll from "@/components/base/scroll/scroll";
export default {
  name: "",
  data() {
    return {
      type:{
        cutActivityType:0
      },
      shareView:false,
      skuItem: {},
      showPop: false,
      deliveryType: '',
      selectedNum: 1,
      stepNum: 1,
      maxNum: 1,
      minNum: 1,
      stockNum: 1,
      detailData: {},
      bargainOrderId: '',
      currentType: "",
      myBargainList: [], // 列表
      menu: [
        { text: "全  部", type: "" },
        { text: "进行中", type: "1" },
        { text: "砍价成功", type: "2" },
        { text: "砍价失败", type: "3" }
      ]
    }
  },
  mounted() {
//     /app/json/user_bargain/getMyBargainList
// 参数state:1：帮砍中，2：帮砍成功，3：帮砍失败，不传参数是全部
    this.getMyBargainList();
  },
  methods: {
    invent(flag){
      this.shareView=true
    },

    getLessMember: function(item) {
      return item.groupBuyNumOfPerson - item.currentNumOfPerson;
    },
    getItemImg: function(item) {
      let leaderUserAward = item.leaderUserAward;
      if (leaderUserAward.length > 0) {
        let gameAwardPic = leaderUserAward[0].gameAwardPic;
        return gameAwardPic;
      }
      return "";
    },

    scrollHandler() {},
    openGroupDetails(item) {
      // 打开拼团详情
      this.$router.push({
        path: "/group_detail",
        query: {
          orderId: item.id,
          mktGroupBuyId: item.mktGroupBuyId,
          spuId: item.spuId
        }
      });
    },
    tabChange(type) {
      this.currentType = type;
      this.myBargainList = [];
      this.getMyBargainList();
    },
    getMyBargainList() {
      this.$request.post("/app/json/user_bargain/getMyBargainList",{ state: this.currentType }).then(res => {
        if (res.status == 0) {
          this.myBargainList = res.data || []
          this.myBargainList.forEach(item => {
            item.timEnew = this.$util.getDateFromString(item.createTime) + item.lengthTime * 60
          })
        } else {
          this.$Toast(res.info);
        }
      })
    },
    successBtn(item) {
      console.log(555)
      this.skuItem = item
      // this.showPop = true;
      this._getProductDetail(item)
    },
    // 立即购买
    popSureEvent: function () {
      console.log(666)
      // if (this.stockNum < this.selectedNum) {
      //   this.$Toast('当前商品库存不足！')
      //   return;
      // }
      this.$Loading.open();
      let url = '/app/json/app_cart/SettleCart';
      let paramsData = {
        token: this.$store.state.login.token,
        carts: [{
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode,
          number: 1,
          checked: '1',
        }],
        deliveryType: this.detailData.deliveryType,
        //充值卡配送
        // deliveryType: 2,
        userAddress: this.$store.state.mall2.selectAddress,
        pickupId: this.$store.state.mall2.zitiAddress.id,
        bargainOrderId: this.skuItem.id
      };
      if (this.deliveryType == 2) {
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
              cutPrice:1,
              res: data.data,
              paramsData: paramsData,
              deliveryType: this.detailData.deliveryType,
              productType: this.detailData.productType,// 充值卡类商品514没有地址和自提点
              // deliveryType: 2,
              skuCode: this.$route.query.skuCode, // 商品编码
              storeOuCode: this.$route.query.storeOuCode, // 店铺编码
            };
            let recommendPhone = this.$route.query.recommendPhone
            if (recommendPhone && recommendPhone != undefined && recommendPhone != '') {
              params.recommendPhone = recommendPhone
            }
            if (!(this.$store.state.mall2.selectAddress.id > 0) && this.detailData.deliveryType == 2) {
              if (this.matchAddress) {
                this.$store.state.mall2.selectAddress = this.matchAddress;
                this.$bridgefunc.vuexStorage(() => {
                })
              } else {
                params.noMatch = true;
              }
            }
            if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
              this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
                this.$router.push({
                  name: '填写订单',
                  params: params
                })
              }).catch(action => {
              });
            } else {
              this.$router.push({
                name: '填写订单',
                params: params
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
    // 请求详情信息
    _getProductDetail: function (item) {
      this.$Loading.open();
      let url = '/app/json/product/getAppProDetail';
      let paramsData = {
        token: this.$store.state.login.token,
        // productType: this.productType,
        skuId: item.skuId,
        featureValueIds: this.myFeatures,
        lng: this.$store.state.currentLocation.posx,
        lat: this.$store.state.currentLocation.posy,
        deliverType: this.$store.state.mall2.staticDeliverType
        // deliverType: 2
      };
      if (paramsData.deliverType == 1 || paramsData.deliverType == '') {
        paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
        paramsData.pickupStoreOuCode = this.$store.state.mall2.zitiAddress.storeCode ? this.$store.state.mall2.zitiAddress.storeCode : this.$route.query.storeOuCode ? this.$route.query.storeOuCode : '';
      }
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.detailData = data.data;
            if (this.detailData.remainNum === 0) {
              this.$Toast('活动商品库存已售空，需原价购买！')
            }
            if (this.selectedNum < this.detailData.saleNumBegin) {
              this.selectedNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
            }
            this.deliveryType = this.detailData.deliveryType
            this.stockNum = this.detailData.stockNum || 0
            this.stepNum = this.detailData.saleNumStep != '' ? this.detailData.saleNumStep : 1
            this.minNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
            this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
            if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
              if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                this.maxNum = this.detailData.discountGoodsCntPerOrder
              }
            }
            // 全局价格处理
            let dpedData = this.$mallCommon.priceFromItem(this.detailData)
            this.detailData.dpedData = dpedData;
            // this._getCustomStock()
            this.popSureEvent()
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
          town: this.$store.state.mall2.selectAddress.townId,
        },

        deliverType: this.deliveryType,
        selfPickStore: this.$store.state.mall2.zitiAddress.id,
        storeCode: this.detailData.storeOuCode
      };
      this.$Loading.open()
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            let productList = data.data.productList
            if (productList.length > 0) {
              this.stockNum = productList[0].stockCurrentNumber
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
            } else {
              this.$Toast(data.info);
            }
          }
          this.popSureEvent()
        },
        error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        }
      );
    },
    popClose: function () {
      this.showPop = false;
    },
    numChange: function () {
      this.generateSelectedText()
    },
    generateSelectedText: function () {
      // this.selectedText = ''
      // this.myFeatures = [];
      // for (let i = 0; i < this.detailData.featureList.length; i++) {
      //   let item = this.detailData.featureList[i]
      //   for (let j = 0; j < item.featureValueList.length; j++) {
      //     let subItem = item.featureValueList[j]
      //     if (subItem.selected) {
      //       this.selectedText += subItem.featureValue + '，'
      //       this.myFeatures.push(subItem.featureValueId)
      //       break;
      //     }
      //   }
      // }
      // this.selectedText += this.selectedNum + (this.detailData.metric ? this.detailData.metric : '件')
    },
    getSkuNameStr: function (item) {
      let skuName = item.showTitle
      if (item.interfaceType == '2') {
        skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_1 || '京东'}</span>` + skuName
      } else if (item.interfaceType == '1') {
        skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_2 || '有路'}</span>` + skuName
      }
      return skuName
    },
  },
  components: {
    group,
    Scroll
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.my-group {
  .nav-bar {
    height: 44px;
    line-height: 44px;
    display: flex;
    background: #fff;

    .nav-bar-item {
      text-align: center;
      flex: 1;

      .text {
      }

      &.active {
        .text {
          color: $color-theme-r;
          position: relative;

          &:after {
            content: '';
            position: absolute;
            bottom: -6px;
            width: 100%;
            left: 0;
            height: 2px;
            background: $color-theme-r;
          }
        }
      }
    }
  }
}

.my-group-list {
//   background: url('../../../../static/image/microShop/list-bg.png') repeat center center / 100% 100%;
  padding: 7px;
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .no-list {
    .img-div {
      margin-top: 20px;
      text-align: center;

      img {
        width: 160px;
      }
    }

    .tip {
      margin-top: 10px;
      padding: 10px;
      font-size: 12px;
      text-align: center;
    }
  }
}

.list-wrapper {
  background: none;
}
>>> .stateBox {
  z-index: 2001;
  width: 80%;
  text-align: center;
  font-size: 16px;
  color white;
  top 200px;

  img {
    width 80px;
    margin 0 0 15px 160px;
  }
}
>>> .van-popup {
  background transparent;
}

>>> .van-overlay {
  background-color rgba(0, 0, 0, 0.6)
}
</style>

