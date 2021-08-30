/**Created by steven on 2018/11/7.*/

<template>
  <div class="cart-list">
    <!-- 主内容：店铺商品列表 -->
    <div
      class="cart-content"
      v-show="occurArr.length || invalidCart.length"
      ref="scrollwarp"
    >
      <div class="scroll-content-div">
        <div
          :ref="getCartRef(index)"
          v-for="(occuritem, index) in occurArr"
          :key="index"
          class="occur-div theme_bg_white"
        >
          <!-- 店铺名称 -->
          <div
            class="occur-title theme_font_white theme_bg_ml_red"
            @click="setOccSel(occuritem)"
          >
            <i
              class="iconfont font-large-x"
              :class="
                cartJS.getOccClass(
                  isEditing,
                  occuritem.checked,
                  occuritem.dchecked
                )
              "
            ></i>
            <span class="theme_font_black">
              <i class="iconfont mall-shoukuanfang"></i>
              {{ occuritem.store[0].storeName }}</span
            >
          </div>
          <!-- 店铺商品列表 -->
          <div
            class="store-div"
            v-for="(storeitem, index) in occuritem.store"
            :key="index"
          >
            <!-- 商品优惠券 -->
            <div class="store-title" v-if="storeitem.userCanGetCoupon && storeitem.userCanGetCoupon.length">
              <div class="leftcontent">
                <!--                <i class="iconfont font-large-x"-->
                <!--                   :class="cartJS.getXZClass(isEditing,storeitem.checked,storeitem.dchecked)"-->
                <!--                   @click="setStoreSel(storeitem,undefined,occuritem)"></i>-->
                <!--                <span @click="toShop(storeitem)"><i class="iconfont mall-dianpu font-large-x"></i> {{storeitem.storeName}}</span>-->
                <!--                <i class="iconfont mall-gengduojiantou theme_font_gray font-large marL"></i>-->
              </div>
              <div
                class="rightcontent"
                @click="coupon(storeitem)"
              >
                <span>优惠券</span>
                <i
                  class="iconfont mall-gengduo theme_font_gray font-large marL"
                ></i>
              </div>
            </div>
            <!-- 店铺活动商品-->
            <div
              class="store-content"
              v-for="(activityitem, index) in storeitem.activity"
              :key="index"
            >
              <div class="activity-title">
                <div class="leftcontent single-line">
                  <span class="ac-tag theme_font_white theme_bg_red">{{
                    activityitem.mktActivityType
                  }}</span>
                  <span class="ac-title theme_font_gray marL single-line">{{
                    activityitem.activityDiscountDesc
                  }}</span>
                </div>
                <div
                  class="rightcontent"
                  v-if="cartJS.getActivityRightTitle(activityitem)"
                  @click="rightActivityClick(activityitem)"
                >
                  <span class="theme_font_red">{{
                    cartJS.getActivityRightTitle(activityitem)
                  }}</span>
                  <i
                    class="iconfont mall-gengduojiantou theme_font_red font-large marL"
                  ></i>
                </div>
              </div>
              <div class="activity-content">
                <CartItem
                  v-for="cartitem in activityitem.cart"
                  :isEditing="isEditing"
                  :cartitem="cartitem"
                  :occuritem="occuritem"
                  :storeitem="storeitem"
                  @setCartSel="setCartSel"
                  @numChange="numChange"
                  :key="cartitem.skuId"
                  :orderCategory="orderCategory"
                  :vipUnitUserCode="vipUnitUserCode"
                  @updateCart="updateCart"
                  @deleteCart="deleteCart"
                  @plusNum="plusNum"
                  @minusNum="minusNum"
                >
                </CartItem>
              </div>
            </div>
            <!-- 商品信息详情 -->
            <div class="store-content marT10">
              <div class="activity-content">
                <CartItem
                  v-for="cartitem in storeitem.noActivityCart"
                  :isEditing="isEditing"
                  :cartitem="cartitem"
                  :occuritem="occuritem"
                  :storeitem="storeitem"
                  @setCartSel="setCartSel"
                  @numChange="numChange"
                  :key="cartitem.skuId"
                  :orderCategory="orderCategory"
                  :vipUnitUserCode="vipUnitUserCode"
                  @updateCart="updateCart"
                  @deleteCart="deleteCart"
                  @plusNum="plusNum"
                  @minusNum="minusNum"
                >
                </CartItem>
              </div>
            </div>
          </div>
          <!-- <div class="pay-div-height">
            <PayDiv
              :occuritem="occuritem"
              :isEditing="isEditing"
              @setOccSel="setOccSel"
              @toPay="toPay"
              @toDelete="toDelete"
              v-show="showFirstBt"
            >
            </PayDiv>
          </div> -->
        </div>
        <!-- 失效宝贝 -->
        <div
          class="occur-div theme_bg_white"
          v-show="invalidCart && invalidCart.length"
        >
          <div
            class="occur-title title-between theme_font_white theme_bg_ml_red">
            <span class="theme_font_black">
              <i class="iconfont mall-shoukuanfang"></i> 失效的宝贝</span>
            <span class="theme_font_tint flotr" @click.stop="clearInvalid">清除所有</span>
          </div>
          <div class="invalid-content">
            <InvalidCartItem
              v-for="(cartitem, index) in invalidCart"
              :cartitem="cartitem"
              :key="index"
            >
            </InvalidCartItem>
          </div>
        </div>
        <div style="height:76px"></div>
      </div>

      <!--固定在顶部的div-->
      <!-- <div
        v-for="(occuritem, index) in occurArr"
        class="occur-title theme_font_white theme_bg_ml_red occur-top-fixed"
        @click="setOccSel(occuritem)"
        v-show="fixedIndex == index"
      >
        <i
          class="iconfont font-large-x"
          :class="
            cartJS.getOccClass(isEditing, occuritem.checked, occuritem.dchecked)
          "
        ></i>
        <span class="theme_font_black">
          <i class="iconfont mall-shoukuanfang"></i>
          {{ occuritem.store[0].storeName }}</span
        >
      </div> -->
      <!--底部固定 ：全选及购物车结算-->
      <div class="occur-bt-fixed" v-if="occurArr.length">
        <PayDiv
          :occurArr="occurArr"
          :occuritem="occurArr[0]"
          class="pay-div theme_bg_white"
          :isEditing="isEditing"
          @setOccSel="checkedAllSel"
          @toPay="submitOrder"
          @toDelete="toDelete"
        >
        </PayDiv>
        <div class="adapter-iphoneX" v-if="this.$util.getIsIphoneX_X()"></div>
      </div>
    </div>
    <!-- 购物车为空时 -->
    <div
      class="nodata-content"
      v-if="!(occurArr.length || invalidCart.length) && isHasRequest"
    >
      <div class="noCart">
        <div class="noCartTag">
          <i class="iconfont mall-gouwuche btn-icon theme_font_tint"></i>
          <p class="text theme_font_tint">您的购物车是空的,去逛逛吧！</p>
        </div>
        <p class="goShop theme_bg_red theme_font_white" @click="goShopList">
          去购物
        </p>
      </div>
      <div
        class="recommend-div"
        v-if="
          $store.state.globalConfig.app_home_special_flag != 'cnooc' &&
            this.isPresale != true
        "
      >
        <Recommend
          :deliverType="this.deliverType"
          @addCartFinish="getDataList"
        ></Recommend>
      </div>
    </div>
    <!-- 商品删除弹框 -->
    <van-popup
      v-model="showDelectPopup"
      round
      closeable
      :style="{ height: '196px' }"
    >
      <div class="delectPopup">
        <div class="tipsText">确认将这{{ deleteCartNum }}个商品删除？</div>
        <div class="btns">
          <div class="cancel" @click="showDelectPopup = false">取消</div>
          <div class="delect" @click="deleteCartItem">删除</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// import Counter from '@/components/commonui/counter/counter'
import GiftList from "../common/giftlist";
import cartJS from "./js/cart";
import CartItem from "./cart-item";
import InvalidCartItem from "./cart-item-invalid";
import Coupon from "../common/coupon";
import Recommend from "../list/recommend/index";
import BScroll from "better-scroll";
import PayDiv from "./pay-div";
import cartEvent from "../../../utils/presale/cart";

export default {
  name: "cart-list",
  components: {
    // Counter,
    CartItem,
    Recommend,
    PayDiv,
    InvalidCartItem
  },
  props: [
    "deliverType",
    "isEditing",
    "orderCategory",
    "vipUnitUserCode",
    "isPresale"
  ],
  data() {
    return {
      occurArr: [],
      invalidCart: [],
      cartJS: cartJS,
      isHasRequest: false,
      heightArr: [],
      fixedIndex: -1,
      showFirstBt: true,
      showDelectPopup: false,
      deleteItem: [],
      deleteCartNum: 0,
      detItem: [],
      checkedDelectItem: [],
      deleteType: "checked"
    };
  },
  methods: {
    clearInvalid: function() {
      let carts = cartJS.getInvalidArr(this.invalidCart);
      this.deleteCart(carts);
    },
    // 去店铺
    toShop: function(storeItem) {
      this.$router.push({
        path: "/mall2/shop",
        query: {
          storeOuCode: storeItem.storeOuCode,
          lastPath: this.$route.path
        }
      });
    },
    getCartRef: function(index) {
      return "mall2cart" + index;
    },
    goShopList: function() {
      // let path = "/mall2/list/" + this.$util.getDataString();
      // this.$router.push({
      //   path: path,
      //   query: {
      //     lastPath: this.$route.path,
      //     delivertype: this.deliverType,
      //   },
      // });
      // this.$router.replace({
      //   path: '/common',
      // })
      if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
        if (this.$route.path == "/common") {
          location.reload();
        } else {
          this.$router.replace({
            path: "/common"
          });
        }
      } else {
        this.$router.replace({
          path: "/common"
        });
      }
    },
    coupon: function(storeitem) {
      Coupon.open({
        initData: {
          listData: storeitem.userCanGetCoupon,
          storeOuCode: storeitem.storeOuCode,
          skuId: "",
          type: "receive",
          categoryId: "",
          token: this.$store.state.login.token
        },
        selectedCoupon: coupon => {
          Coupon.close();
        },
        getedCoupon: coupon => {
          // for (let i = 0; i < this.detailData.couponModels.length; i++) {
          //   let item = this.detailData.couponModels[i]
          //   if (item.couTypeNo == coupon.couTypeNo) {
          //     this.detailData.couponModels.splice(i, 1, coupon)
          //     break;
          //   }
          // }
        },
        couponProducts: coupon => {
          let path = "/mall2/list/" + this.$util.getDataString();
          this.$router.push({
            path: path,
            query: {
              pageType: "coupon",
              coupon: coupon.couTypeCode,
              fromCart: "1",
              delivertype: this.deliverType,
              lastPath: this.$route.path,
              couFaceValue: coupon.couFaceValue,
              couThresholdAmount: coupon.couThresholdAmount,
              endTime: this.$util.getDateFromString(coupon.validEndDate)
            }
          });
          // pageType: 'coupon',
          //   coupon: coupon.couTypeCode,
          //   couThresholdAmount: coupon.couThresholdAmount,
          //   couFaceValue: coupon.couFaceValue,
          //   skuId: this.detailData.skuId,
          //   lastPath: this.$route.path,
          //   storeOuCode: this.detailData.storeOuCode,
          //   endTime: this.$util.getDateFromString(coupon.validEndDate)
          Coupon.close();
        }
      });
    },
    rightActivityClick: function(activityitem) {
      // linkType  1去凑单  2再逛逛 3领赠品 4去换购  5赠品未满足  6换购未满足
      if (activityitem.linkType != 3 && activityitem.linkType != 4) {
        //调选商品的界面
        let path = "/mall2/list/" + this.$util.getDataString();
        this.$router.push({
          path: path,
          query: {
            pageType: "activity",
            activity: activityitem.mktActivityId,
            fromCart: "1",
            delivertype: this.deliverType,
            skuId: activityitem.cart[0].skuId,
            storeOuCode: activityitem.cart[0].storeOuCode,
            lastPath: this.$route.path
          }
        });
      } else {
        let giftType = cartJS.getGiftType(activityitem);
        GiftList.open({
          listData: activityitem.gift,
          activityId: activityitem.mktActivityId,
          sureFunc: this.sureFunc,
          giftType: giftType
        });
      }
    },
    sureFunc: function(carts) {
      this.$Loading.open();
      let url = "/app/json/app_cart/addCart";
      let paramsData = {
        token: this.$store.state.login.token,
        carts: carts,
        deliveryType: this.deliverType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.cartNum = data.data;
            this.$Toast("添加购物车成功！");
            this.getDataList();
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    setCartSel: function(cartitem, storeitem, occuritem) {
      if (this.isEditing) {
        cartJS.setCartSel(cartitem, this.isEditing, storeitem, occuritem);
      } else {
        let carts = [
          {
            skuId: cartitem.skuId,
            storeOuCode: cartitem.storeOuCode,
            checked: cartitem.checked ? 0 : 1,
            activityId: cartitem.activityId
          }
        ];
        this.updateCart(carts);
      }
    },
    setStoreSel: function(storeitem, undefined, occuritem) {
      if (this.isEditing) {
        cartJS.setStoreSel(storeitem, this.isEditing, undefined, occuritem);
      } else {
        let carts = cartJS.getSelStore(storeitem, this.isEditing, "update");
        this.updateCart(carts);
      }
    },
    /*底部---切换选中全部*/
    checkedAllSel() {
      let isChecked = cartJS.isCheckedAll(this.occurArr, this.isEditing);
      if (this.isEditing) {
        this.occurArr.map(occuritem => {
          cartJS.setOccSel(occuritem, this.isEditing, !isChecked ? 1 : 0);
        });
      } else {
        let carts = cartJS.getStoreSelOccur(
          this.occurArr,
          this.isEditing,
          "update",
          !isChecked ? 1 : 0
        );
        this.updateCart(carts);
      }
    },
    setOccSel: function(occuritem) {
      if (this.isEditing) {
        cartJS.setOccSel(occuritem, this.isEditing);
      } else {
        let carts = cartJS.getSelOccur(occuritem, this.isEditing, "update");
        this.updateCart(carts);
      }
    },
     /*底部----提交订单*/
    submitOrder(name) {
      let occurArr=[];
      this.occurArr.map(occuritem => {
        let carts=cartJS.getSelOccur(occuritem, this.isEditing, "pay");
        if(carts.length){
          occurArr.push(occuritem)
        }
      });
      if(occurArr.length >10){
        this.$Toast("只能结算最多10个店铺的商品！");
        return;
      }else if (occurArr.length == 0) {
        this.$Toast("请选择要结算的商品")
        return;
      }
      let apiList = this.toPay(occurArr);
      this.$Loading.open();
      let this_=this;
      Promise.all(apiList).then(response => {
        console.log(response,'Promise.all');
        let isErrorData = response.find(item => item.status !=0);
        if(isErrorData){
           this.$Toast(isErrorData.info);
        }else{
          let occurArr=[],firstResolveData={},occurList=[],cartsList=[],paramsDataList=[],needAlert=false;
          response.map((data,k)=>{
             if(!k){
               firstResolveData={...data}
             }
             paramsDataList.push({...data.paramsData});
             occurList=occurList.concat(data.data.occur);
             cartsList=cartsList.concat(data.paramsData.carts);
             occurArr=occurArr.concat( cartJS.dealCartList(data.data.occur) );
             needAlert=this_.$mallCommon.isExistCanNotAttendActivity( data.data.occur);
          })
          this.occurArr=occurArr;
          this.isEditing && cartJS.setAllUnSel(this.occurArr);
          this.$Loading.close();
          firstResolveData.paramsData.carts=cartsList;
          firstResolveData.data.occur=occurList;
          //console.log(firstResolveData,paramsDataList,'firstResolveData');
          let linkTo=()=>{
            this.$router.push({
              name: "填写订单",
              params: {
                res: { ...firstResolveData.data},
                paramsData: { ...firstResolveData.paramsData},
                deliveryType: this.deliverType,
                paramsDataList:paramsDataList,
                name: name
              }
            });
          }
          if(needAlert){
            this.$MessageBox.confirm(
              "部分商品不能参加活动</br>将按原价购买，是否继续？","提示",
              { confirmButtonText: "确定" }
            ).then(action => {
              linkTo()
            })
          }else{
            linkTo()
          }
        }
      }).catch(err=>{
        this.$Toast("请求数据失败！");
        this.$Loading.close();
      })
    },
    toPay(occurArr) {
      return occurArr.map(occuritem => {
        return new Promise((resolve, reject) => {
          let carts=  cartJS.getSelOccur(occuritem, this.isEditing, "pay");
          let url = "/app/json/app_cart/SettleCart";
          let paramsData = {
            token: this.$store.state.login.token,
            deliveryType: this.deliverType,
            carts: carts,
            orderCategory: this.orderCategory,
            vipUnitUserCode: this.vipUnitUserCode,
            couNo:['-1']
          };
          if (this.isPresale == true) {
            paramsData.cartType = "1";
          }

          if (this.deliverType == 2) {
            if (this.$store.state.mall2.selectAddress.id != "-1") {
              paramsData.userAddressId = this.$store.state.mall2.selectAddress.id;
            } else {
              paramsData.userAddress = {};
              paramsData.userAddress.provinceId = this.$store.state.mall2.selectAddress.provinceId;
              paramsData.userAddress.provinceName = this.$store.state.mall2.selectAddress.provinceName;
              paramsData.userAddress.cityId = this.$store.state.mall2.selectAddress.cityId;
              paramsData.userAddress.cityName = this.$store.state.mall2.selectAddress.cityName;
              paramsData.userAddress.countryId = this.$store.state.mall2.selectAddress.countryId;
              paramsData.userAddress.countryName = this.$store.state.mall2.selectAddress.countryName;
              paramsData.userAddress.townId = this.$store.state.mall2.selectAddress.townId;
              paramsData.userAddress.townName = this.$store.state.mall2.selectAddress.townName;
            }
          }
          this.setCommonPara(paramsData);
          this.$http.post(url, paramsData).then(
            res => {
              this.$Loading.close();
              let data = res.data;
              if(data.status==0){
                data.paramsData=paramsData
              }
              resolve(data);
            },
            error => {
              reject(error)
            }
          );
        });
      });
    },
    /*底部----删除功能*/
    toDelete: function() {
      let detItem = [],
        cars = [];
      this.occurArr.map(occuritem => {
        cars = cars.concat(
          cartJS.getSelOccur(occuritem, this.isEditing, "delete")
        );
        detItem = detItem.concat(cartJS.getSelOccur(occuritem, true, "buried"));
      });
      this.deleteCart(cars);
      this.detItem = detItem;
    },
    setCommonPara: function(paramsData) {
      if (this.deliverType == 2) {
        // if(!this.$store.state.mall2.selectAddress.id){
        //   this.$Toast('请选择配送地址')
        //   return false
        // }
        paramsData.provinceId = this.$store.state.mall2.selectAddress.provinceId;
        paramsData.cityId = this.$store.state.mall2.selectAddress.cityId;
        paramsData.countryId = this.$store.state.mall2.selectAddress.countryId;
      } else if (this.deliverType == 1) {
        paramsData.pickupId = this.$store.state.mall2.zitiAddress.id;
      }
      return true;
    },
    getDataList: function() {
      this.$Loading.open();
      let url = "/app/json/app_cart/getCart";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: this.deliverType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      this.setCommonPara(paramsData);

      if (this.isPresale == true) {
        paramsData.carts = cartEvent.getPros();
        paramsData.cartType = "1";
      }
      // if(!isNext){
      //   return;
      // }
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.isHasRequest = true;
            this._getCartCount();
            this.occurArr = cartJS.dealCartList(data.data.occur);
            this.invalidCart = data.data.invalidCart
              ? data.data.invalidCart
              : [];
            if (this.isEditing) {
              cartJS.setAllUnSel(this.occurArr);
            }
            this.$nextTick(() => {
              this._initScroll();
            });

            //新增商品种类数量

            // let num = 0;
            // let occur = 0;
            // data.data.occur.forEach((o)=>{
            //   o.store.forEach((s)=>{
            //     s.activity.forEach((a)=>{
            //       occur += a.cart.length
            //     })
            //   })
            // })
            // if(data.data.invalidCart !== ''){
            //   num = data.data.invalidCart.length + occur;
            // }else{
            //   num = occur
            // }
            // console.log('occur',num)
            // this.$store.state.mall2.cartNum = num;
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    _initScroll: function() {
      if (this.cityListScroll) {
        this.cityListScroll.refresh();
        this.cityListScroll.off("scroll");
      } else {
        this.cityListScroll = new BScroll(this.$refs.scrollwarp, {
          click: true,
          probeType: 3,
          bounce: false
        });
      }

      let warpEl = this.$refs.scrollwarp;
      let warpHeight = warpEl.offsetHeight;
      //当只有一个且没有失效商品的时候
      if (this.occurArr.length == 1 && this.invalidCart == "") {
        this.fixedIndex = 0;
        let el = this.$refs[this.getCartRef(0)][0];
        let height = el.offsetHeight;
        if (height < warpHeight) {
          console.log(height, warpHeight);
          this.showFirstBt = false;
        }
        return;
      } else {
        this.showFirstBt = true;
      }

      for (let i = 0; i < this.occurArr.length; i++) {
        let el = this.$refs[this.getCartRef(i)][0];
        let dic = {
          top: el.offsetTop,
          height: el.offsetHeight,
          //默认是不需要固定的
          isFixed: false
        };
        //只有超出了距离才需要固定
        if (el.offsetHeight > warpHeight) {
          dic.isFixed = true;
        }
        this.heightArr.push(dic);
      }

      this.cityListScroll.on("scroll", pos => {
        if (pos.y > 5) {
          this.fixedIndex = -1;
          return;
        }
        let posy = Math.abs(pos.y);
        this.calculateFixedIndex(posy, warpHeight);
      });
      this.calculateFixedIndex(0, warpHeight);
    },
    calculateFixedIndex: function(posy, warpHeight) {
      let isHasSet = false;
      for (let i = 0; i < this.heightArr.length; i++) {
        let dic = this.heightArr[i];
        let top = dic.top;
        let height = dic.height;
        let isFixed = dic.isFixed;
        if (posy >= top && posy <= top + height) {
          //如果不需要固定直接返回即可 这里记录是为了节省计算
          if (isFixed) {
            if (posy <= top + height - warpHeight) {
              isHasSet = true;
              this.fixedIndex = i;
            }
          }
          break;
        }
      }
      if (!isHasSet) {
        this.fixedIndex = -1;
      }
    },
    // 获取购物车数量
    _getCartCount: function() {
      let url = "/app/json/app_cart/getCartCount";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: this.deliverType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;

          if (data.status == 0) {
            this.$store.state.mall2.cartNum = data.data;
            console.log(
              "this.$store.state.mall2.cartNum",
              "cart-list",
              this.$store.state.mall2.cartNum
            );
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    numChange: function(itemInfo) {
      let carts = [
        {
          skuId: itemInfo.skuId,
          storeOuCode: itemInfo.storeOuCode,
          number: itemInfo.number,
          isGift: itemInfo.isGift,
          activityId: itemInfo.activityId
        }
      ];
      this.updateCart(carts);
    },
    plusNum(itemInfo) {
      this.sensorsEdit("增加", itemInfo);
    },
    minusNum(itemInfo) {
      this.sensorsEdit("减少", itemInfo);
    },
    sensorsEdit(behavior, itemInfo) {
      console.log("itemInfo", itemInfo);
      let categoryList = itemInfo.categoryName.split("_");
      this.$sensors.track("shoppingcart_edit", {
        goods_id: itemInfo.skuId,
        goods_name: itemInfo.productName,
        // tag:this.tagList,
        goods_cls1: categoryList[0],
        goods_cls2: categoryList[1],
        goods_cls3: categoryList[2],
        goods_cl3_id: itemInfo.categoryId,
        // org_price:this.detailData.activityPrice,
        price: itemInfo.price,
        goods_quantity: 1,
        store_id: itemInfo.storeOuCode,
        store_name: itemInfo.storeName,
        // merchant_id:this.occuritem.ouCode,
        // merchant_name:this.occuritem.ouName,
        behavior: behavior
      });
    },
    /*防抖后更新cart*/
    updateCart: function(carts, callBack) {
      this.updateCartData(carts, callBack);
    },
    updateCartData(carts, callBack) {
      if (this.isPresale == true) {
        cartEvent.updateCart(carts);
        this.getDataList();
        return;
      }
      // this.$Loading.open();
      let url = "/app/json/app_cart/updateCart";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: this.deliverType,
        carts: carts,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.getDataList();
            if (callBack) {
              callBack(true);
            }
          } else {
            this.$Toast(data.info);
            if (callBack) {
              callBack(false);
            }
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
          if (callBack) {
            callBack(false);
          }
        }
      );
    },
    sensorsDelete() {
      let item = [];
      if (this.deleteType == "checked") {
        this.detItem.forEach(e => {
          this.checkedDelectItem.forEach(i => {
            if (e.goods_id == i.skuId) {
              item.push(e);
            }
          });
        });
      } else {
        item = this.detItem;
      }
      item.forEach(e => {
        let categoryList = e.categoryName.split("_");
        this.$sensors.track("shoppingcart_edit", {
          goods_id: e.goods_id,
          goods_name: e.goods_name,
          // tag:this.tagList,
          goods_cls1: categoryList[0],
          goods_cls2: categoryList[1],
          goods_cls3: categoryList[2],
          goods_cl3_id: e.categoryId,
          // org_price:this.detailData.activityPrice,
          price: e.price,
          goods_quantity: e.goods_quantity,
          store_id: e.store_id,
          store_name: e.store_name,
          // merchant_id:this.occuritem.ouCode,
          // merchant_name:this.occuritem.ouName,
          behavior: "删除"
        });
      });
    },
    deleteCart: function(carts, type) {
      if (this.isPresale == true) {
        cartEvent.deleteCart(carts);
        this.getDataList();
        return;
      }
      if (!carts.length) {
        this.$Toast("请选择要删除的商品");
        return;
      }
      this.deleteCartNum = carts.length;
      this.showDelectPopup = true;
      this.deleteItem = carts;
      if (type == "spreads") {
        let item = [];
        let obj = {
          goods_id: carts[0].skuId,
          goods_name: carts[0].productName,
          categoryName: carts[0].categoryName,
          price: carts[0].salePrice,
          goods_quantity: 1,
          store_id: carts[0].storeOuCode,
          store_name: carts[0].storeName
        };
        item.push(obj);
        this.detItem = item;
        this.deleteType = "spreads";
      } else {
        this.checkedDelectItem = carts;
        this.deleteType = "checked";
      }
    },
    deleteCartItem() {
      this.$Loading.open();
      let url = "/app/json/app_cart/deleteCart";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: this.deliverType,
        carts: this.deleteItem,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.showDelectPopup = false;
            this.$Toast("删除成功");
            this.getDataList();
            this._getCartCount();
            console.log("this.detItem", this.detItem);
            this.sensorsDelete();
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    }
  },
  watch: {
    isEditing: function(val, oldVal) {
      if (val && this.occurArr) {
        this.occurArr = cartJS.setAllUnSel(this.occurArr);
      }
    }
  },
  created() {
    console.log("$store.state.isX", this.$store.state.isX);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

$mar-top = 10px;

.delectPopup{
  width: 271px;
  height: 196px;
  background: #FFFFFF;
  border-radius: 16px;
  .tipsText{
    font-size: 15px;
    font-weight: bold;
    color: #333333;
    margin: 70px auto 46px;
    text-align: center;
  }
  .btns{
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 27px;
    .cancel{
      width: 104px;
      height: 39px;
      border: 1px solid #999999;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      color: #666666;
      text-align: center;
      line-height: 39px;
    }
    .delect{
      width: 104px;
      height: 39px;
      background: linear-gradient(90deg, #EF2D30 0%, #F96B7B 100%);
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      color: #F4F4F4;
      text-align: center;
      line-height: 39px;
    }
  }
}

.cart-list {
  flex: 1;
  width: 100%;
  overflow: hidden;

  .pay-div-height {
    min-height: 54px;
  }

  .nodata-content {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }

  .cart-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .scroll-content-div {
      overflow: hidden;
    }

    .occur-title {
      padding: 10px;
      display: flex;
      align-items: center;

      span {
        font-size: $font-size-medium;
        margin-left: 3px;
        font-weight: $font-weight-x;
      }
    }

    .title-between {
      justify-content: space-between;
    }

    .occur-top-fixed {
      position: absolute;
      top: 0;
      width: 100%;
    }

    .occur-bt-fixed {
      position: absolute;
      bottom: 0;
      width: 100%;

      .adapter-iphoneX{
        width: 100%;
        height: 34px;
        background-color: #fff;
      }
    }
  }

  .occur-div {
    width: 100%;

    .store-div {
      margin: 0px $mar-top $mar-top $mar-top;

      .store-title {
        padding-top: $mar-top;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .leftcontent {
          flex: 1;
          display: flex;
          align-items: center;

          span {
            font-size: $font-size-medium;
            margin-left: 6px;
            font-weight: $font-weight-x;
          }
        }

        .rightcontent {
          text-align: right;

          span {
            font-size: $font-size-small;
            display: inline-block;
            vertical-align: middle;
          }

          i {
            display: inline-block;
            vertical-align: middle;
          }
        }
      }

      .store-content {
        width: 100%;

        .activity-title {
          padding: $mar-top 0px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .leftcontent {
            display: flex;
            align-items: center;
            flex: 1;

            .ac-tag {
              padding: 2px 6px;
              border-radius: 8px;
              font-size: $font-size-small;
            }

            .ac-title {
              padding: 2px 2px;
              font-size: $font-size-medium;
            }
          }

          .rightcontent {
            text-align: right;

            span {
              font-size: $font-size-medium-s;
              display: inline-block;
              vertical-align: middle;
            }

            i {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }

        .activity-content {
          margin-left: 20px;
        }
      }
    }
  }

  .invalid-content {
    margin: 10px;
    box-shadow: 0px 2px 2px #efefef;
  }

  .noCart {
    margin: $mar-top;
    box-shadow: 0px 2px 2px #efefef;
    padding: 40px 20px;

    .noCartTag {
      display: flex;
      justify-content: center;
      align-items: center;

      .btn-icon {
        font-size: 40px;
      }

      .text {
        margin-left: 10px;
        font-size: 15px;
      }
    }

    .goShop {
      width: 100%;
      margin-top: 20px;
      font-size: $font-size-medium-x;
      padding: 8px;
      border-radius: 16px;
      text-align: center;
    }
  }

  .font-large {
    font-size: $font-size-medium-x;
  }

  .font-small {
    font-size: $font-size-small;
  }

  .font-large-x {
    font-size: $font-size-large;
  }

  .font-medium {
    font-size: $font-size-medium;
  }

  .marL {
    margin-left: 3px;
  }

  .marT10 {
    margin-top: 10px;
  }

  .recommend-div {
    overflow: hidden;
  }
}
</style>
