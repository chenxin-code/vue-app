<template>
  <div class="cart-list">
    <div class="cart-content" v-show="occurArr.length || invalidCart.length" ref="scrollwarp">
      <div>
        <div :ref="getCartRef(index)" v-for="(occuritem,index) in occurArr" class="occur-div theme_bg_white">

          <div class="occur-title theme_font_white theme_bg_ml_red" @click="setOccSel(occuritem)">
            <i class="iconfont   font-large-x"
               :class="cartJS.getOccClass(isEditing,occuritem.checked,occuritem.dchecked)"></i>
            <span class="theme_font_black"> <i class="iconfont mall-shoukuanfang"></i> {{occuritem.ouName}}</span>
          </div>
          <div class="store-div" v-for="(storeitem,index) in occuritem.store">
            <div class="store-title">
              <div class="leftcontent">
                <i class="iconfont font-large-x" :class="cartJS.getXZClass(isEditing,storeitem.checked,storeitem.dchecked)"
                   @click="setStoreSel(storeitem,undefined,occuritem)"></i>
                <span  @click="toShop(storeitem)"><i class="iconfont mall-dianpu font-large-x"></i> {{storeitem.storeName}}</span>
                <!-- <i class="iconfont mall-gengduojiantou theme_font_gray font-large marL"></i> -->
              </div>
              <div class="rightcontent" v-show="storeitem.userCanGetCoupon && storeitem.userCanGetCoupon.length"
                   @click="coupon(storeitem)">
                <span>优惠券</span>
                <i class="iconfont mall-gengduo theme_font_gray font-large marL"></i>
              </div>
            </div>

            <div class="store-content" v-for="(activityitem,index) in storeitem.activity">
              <div class="activity-title">
                <div class="leftcontent single-line">
                  <span class="ac-tag theme_font_white theme_bg_red">{{activityitem.mktActivityType}}</span>
                  <span class="ac-title theme_font_gray  marL single-line">{{activityitem.activityDiscountDesc}}</span>
                </div>
                <div class="rightcontent" v-if="cartJS.getActivityRightTitle(activityitem)"
                     @click="rightActivityClick(activityitem)">
                  <span class="theme_font_red">{{cartJS.getActivityRightTitle(activityitem)}}</span>
                  <i class="iconfont mall-gengduojiantou theme_font_red font-large marL"></i>
                </div>
              </div>
              <div class="activity-content">
                <CartItem v-for="(cartitem,index) in activityitem.cart" :isEditing="isEditing" :cartitem="cartitem"
                          :occuritem="occuritem" :storeitem="storeitem" @setCartSel="setCartSel" @numChange="numChange"
                          :key="index" @updateCart="updateCart" @deleteCart="deleteCart">
                </CartItem>
              </div>
            </div>
            <div class="store-content marT10">
              <div class="activity-content">
                <CartItem v-for="(cartitem,index) in storeitem.noActivityCart" :isEditing="isEditing" :cartitem="cartitem"
                          :occuritem="occuritem" :storeitem="storeitem" @setCartSel="setCartSel" @numChange="numChange"
                          :key="index" @updateCart="updateCart" @deleteCart="deleteCart">
                </CartItem>
              </div>
            </div>

          </div>
          <PayDiv :occuritem="occuritem" :isEditing="isEditing" @setOccSel="setOccSel" @toPay="toPay" @toDelete="toDelete" v-show="showFirstBt">
          </PayDiv>

        </div>
        <div  class="occur-div  theme_bg_white" v-show="invalidCart && invalidCart.length">
          <div class="occur-title title-between theme_font_white theme_bg_ml_red" >
            <span class="theme_font_black"> <i class="iconfont mall-shoukuanfang"></i> 失效的宝贝</span>
            <span class="theme_font_tint flotr" @click.stop="clearInvalid">清除所有</span>
          </div>
          <div class="invalid-content">
            <InvalidCartItem v-for="(cartitem,index) in invalidCart" :cartitem="cartitem" :key="index">
            </InvalidCartItem>
          </div>
        </div>
      </div>

      <!--固定在顶部的div-->
      <div  v-for="(occuritem,index) in occurArr" class="occur-title theme_font_white theme_bg_ml_red occur-top-fixed" @click="setOccSel(occuritem)" v-show="fixedIndex==index">
        <i class="iconfont  font-large-x"
           :class="cartJS.getOccClass(isEditing,occuritem.checked,occuritem.dchecked)"></i>
        <span class="theme_font_black"> <i class="iconfont mall-shoukuanfang"></i> {{occuritem.ouName}}</span>
      </div>
        <!--固定在底部的div-->
      <PayDiv v-for="(occuritem,index) in occurArr" :occuritem="occuritem" class="pay-div occur-bt-fixed theme_bg_white" :isEditing="isEditing" @setOccSel="setOccSel" @toPay="toPay" @toDelete="toDelete" v-show="fixedIndex==index" :key="index">
      </PayDiv>
    </div>
    <div class="nodata-content" v-if="!(occurArr.length || invalidCart.length) && isHasRequest">
      <div class="noCart">
        <div class="noCartTag">
          <i class="iconfont mall-gouwuche btn-icon theme_font_tint"></i>
          <p class="text theme_font_tint">您的购物车是空的,去逛逛吧！</p>
        </div>
        <!-- <p class="goShop theme_bg_red theme_font_white" @click="goShopList">去购物</p> -->
      </div>
    </div>
  </div>
</template>

<script>
  // import Counter from '@/components/commonui/counter/counter'
  // import GiftList from '../common/giftlist'
  import cartJS from './js/cart'
  import CartItem from './cart-item'
  import InvalidCartItem from './cart-item-invalid'
  // import Coupon from '../common/coupon'
  // import Recommend from '../list/recommend/index'
  import BScroll from 'better-scroll'
  import PayDiv from './pay-div'
  import { mapGetters } from "vuex";
  export default {
    name: "cart-list",
    components: {
      // Counter,
      CartItem,
      // Recommend,
      PayDiv,
      InvalidCartItem
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    props: [
      'deliverType',
      'isEditing',
    ],
    data() {
      return {
        occurArr: [
        ],
        invalidCart:[],
        cartJS: cartJS,
        isHasRequest: false,
        heightArr:[],
        fixedIndex:-1,
        showFirstBt:true
      }
    },
    methods: {
      clearInvalid:function(){
        let carts = cartJS.getInvalidArr(this.invalidCart);
        this.deleteCart(carts);
      },
      // 去店铺
      toShop:function(storeItem){
        // this.$router.push({
        //   path: '/mall2/shop',
        //   query: {
        //     storeOuCode: storeItem.storeOuCode,
        //     lastPath: this.$route.path,
        //   }
        // })
      },
      getCartRef:function(index){
        return 'mall2cart'+index;
      },
      goShopList: function () {
        let path = '/mall2/list/' + this.$util.getDataString();
        this.$router.push({
          path: path,
          query: {
            lastPath: this.$route.path,
            delivertype: this.deliverType
          }
        })
      },
      coupon: function (storeitem) {
        Coupon.open({
          initData: {
            listData: storeitem.userCanGetCoupon,
            storeOuCode: storeitem.storeOuCode,
            skuId: '',
            type: 'receive',
            categoryId: '',
            token: this.$store.state.login.token
          },
          selectedCoupon: (coupon) => {
            Coupon.close();
          },
          getedCoupon: (coupon) => {
            // for (let i = 0; i < this.detailData.couponModels.length; i++) {
            //   let item = this.detailData.couponModels[i]
            //   if (item.couTypeNo == coupon.couTypeNo) {
            //     this.detailData.couponModels.splice(i, 1, coupon)
            //     break;
            //   }
            // }
          },
          couponProducts: (coupon) => {
            let path = '/mall2/list/' + this.$util.getDataString()
            this.$router.push({
              path: path,
              query: {
                pageType: 'coupon',
                coupon: coupon.couTypeCode,
                fromCart: '1',
                delivertype: this.deliverType,
                lastPath: this.$route.path,
                couFaceValue: coupon.couFaceValue,
                couThresholdAmount: coupon.couThresholdAmount,
                endTime: this.$util.getDateFromString(coupon.validEndDate)
              }
            })
            // pageType: 'coupon',
            //   coupon: coupon.couTypeCode,
            //   couThresholdAmount: coupon.couThresholdAmount,
            //   couFaceValue: coupon.couFaceValue,
            //   skuId: this.detailData.skuId,
            //   lastPath: this.$route.path,
            //   storeOuCode: this.detailData.storeOuCode,
            //   endTime: this.$util.getDateFromString(coupon.validEndDate)
            Coupon.close();
          },
        })
      },
      rightActivityClick: function (activityitem) {
        // linkType  1去凑单  2再逛逛 3领赠品 4去换购  5赠品未满足  6换购未满足
        // if(activityitem.linkType != 3  && activityitem.linkType != 4){
        //调选商品的界面
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            pageType: 'activity',
            activity: activityitem.mktActivityId,
            fromCart: '1',
            delivertype: this.deliverType,
            skuId: activityitem.cart[0].skuId,
            storeOuCode: activityitem.cart[0].storeOuCode,
            lastPath: this.$route.path,
          }
        })
        // }else {
        //   let giftType = cartJS.getGiftType(activityitem);
        //   GiftList.open({
        //     listData: activityitem.gift,
        //     activityId:activityitem.mktActivityId,
        //     sureFunc: this.sureFunc,
        //     giftType:giftType
        //   })
        // }
      },
      sureFunc: function (carts) {
        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: carts,
          deliveryType: this.deliverType
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.cartNum = data.data;
              this.$Toast("添加购物车成功！")
              // this.getDataList();
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
      setCartSel: function (cartitem, storeitem, occuritem) {   // 勾选商品
        if (this.isEditing) {
          cartJS.setCartSel(cartitem, this.isEditing, storeitem, occuritem);
        } else {
        let arr = this.$store.state.microSho.carts
        arr.forEach((element,index) => {
          if(element.deliverType == this.deliverType && element.skuId == cartitem.skuId){
            this.$store.state.microSho.carts[index].checked = this.$store.state.microSho.carts[index].checked ? 0 : 1
            return
          }
        })
        this.getDataList();
        }
      },
      setStoreSel: function (storeitem, undefined, occuritem) {  //勾选 店铺
        if (this.isEditing) {
          cartJS.setStoreSel(storeitem, this.isEditing, undefined, occuritem);
        } else {
          let arr = this.$store.state.microSho.carts
          let stotArr = storeitem.noActivityCart || []
          stotArr.forEach((item,index) => {
            arr.forEach((element,index) => {
              if(element.deliverType == this.deliverType && element.skuId == item.skuId){
                this.$store.state.microSho.carts[index].checked = this.$store.state.microSho.carts[index].checked ? 0 : 1
                return
              }
            })
          })
          this.getDataList();
        }
      },
      setOccSel: function (occuritem) { // 顶级 勾选
        if (this.isEditing) {
          cartJS.setOccSel(occuritem, this.isEditing);
        } else {
          let arr = this.$store.state.microSho.carts
          arr.forEach((brx,index) => {
            if(brx.deliverType == this.deliverType) {
              this.$store.state.microSho.carts[index].checked = occuritem.checked ? 0 : 1
            }
          })
          this.getDataList();
        }
      },
      toPay (occuritem) {

        let carts = cartJS.getSelOccur(occuritem, this.isEditing, 'pay');
        console.log(carts)
        if(carts.length == 0){
          this.$Toast('请选择要结算的商品');
          return;
        }
        let url = '/app/json/app_cart/SettleCart';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: this.deliverType,
          carts: carts,
          microStoreCode: this.$store.state.microSho.storeCode,
        };
        console.log(paramsData)
        if (this.deliverType == 2) {
          if (this.$store.state.mall2.selectAddress.id == '' || this.$store.state.mall2.selectAddress.id == 'undefined') {
            this.$Toast('请先选择配送区域！')
            return;
          } else if (this.$store.state.mall2.selectAddress.id != '-1') {
            paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
          } else {
            paramsData.userAddress = {}
            paramsData.userAddress.provinceId = this.$store.state.mall2.selectAddress.provinceId
            paramsData.userAddress.provinceName = this.$store.state.mall2.selectAddress.provinceName
            paramsData.userAddress.cityId = this.$store.state.mall2.selectAddress.cityId
            paramsData.userAddress.cityName = this.$store.state.mall2.selectAddress.cityName
            paramsData.userAddress.countryId = this.$store.state.mall2.selectAddress.countryId
            paramsData.userAddress.countryName = this.$store.state.mall2.selectAddress.countryName
            paramsData.userAddress.townId = this.$store.state.mall2.selectAddress.townId
            paramsData.userAddress.townName = this.$store.state.mall2.selectAddress.townName
          }
        }

        this.setCommonPara(paramsData);
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.occurArr = cartJS.dealCartList(data.data.occur);

              if (this.isEditing) {
                cartJS.setAllUnSel(this.occurArr);
              }
              // this.$router.push({
              //   name: '填写订单',
              //   params: {
              //     res: data.data,
              //     paramsData: paramsData,
              //     deliveryType: this.deliverType
              //   }
              // })
              // this.$mallCommon.isExistCanNotAttendActivity(data.data.occur);
              if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
                this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
                  this.$router.push({
                    name: '填写订单',
                    params: {
                      res: data.data,
                      paramsData: paramsData,
                      deliveryType: this.deliverType
                    }
                  })
                }).catch(action => {
                });
              } else {
                this.$router.push({
                  name: '填写订单',
                  params: {
                    res: data.data,
                    paramsData: paramsData,
                    deliveryType: this.deliverType
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
          });
      },
      toDelete: function (occuritem) {
        let arr = JSON.parse(JSON.stringify(this.$store.state.microSho.carts))
        let occuritemArr = occuritem.store || []
        occuritemArr.forEach(res=>{
          res.noActivityCart.forEach(item=>{
            arr.forEach((brx,index) => {
              if(brx.deliverType == this.deliverType && item.skuId == brx.skuId){
                this.$store.state.microSho.carts.splice(index ,1)
              }
            })
          })
        })
        this.getDataList();
      },

      setCommonPara: function (paramsData) {
        if (this.deliverType == 2) {
          // if(!this.$store.state.mall2.selectAddress.id){
          //   this.$Toast('请选择配送地址')
          //   return false
          // }
          paramsData.provinceId = this.$store.state.mall2.selectAddress.provinceId
          paramsData.cityId = this.$store.state.mall2.selectAddress.cityId
          paramsData.countryId = this.$store.state.mall2.selectAddress.countryId

        } else if (this.deliverType == 1) {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        }
        return true;
      },
      _initScroll: function () {
        if(this.cityListScroll){
          this.cityListScroll.refresh();
          this.cityListScroll.off('scroll');
        }else {
          this.cityListScroll = new BScroll(this.$refs.scrollwarp, {
            click: true,
            probeType: 3,
            bounce:false
          });
        }

        let warpEl = this.$refs.scrollwarp;
        let warpHeight = warpEl.offsetHeight;
        //当只有一个且没有失效商品的时候
        if(this.occurArr.length == 1 && this.invalidCart == ''){
          this.fixedIndex = 0;
          let el = this.$refs[this.getCartRef(0)][0];
          let  height = el.offsetHeight;
          if(height < warpHeight){
            console.log(height, warpHeight)
            this.showFirstBt = false;
          }
          return;
        }else {
          this.showFirstBt = true;
        }

        for (let i = 0; i < this.occurArr.length;i++){
          let el = this.$refs[this.getCartRef(i)][0];
          let dic = {
            top:el.offsetTop,
            height:el.offsetHeight,
            //默认是不需要固定的
            isFixed:false
          };
          //只有超出了距离才需要固定
          if(el.offsetHeight > warpHeight){
            dic.isFixed = true;
          }
          this.heightArr.push(dic);
        }

        this.cityListScroll.on('scroll', (pos) => {
          if(pos.y > 5){
            this.fixedIndex = -1;
            return;
          }
          let posy = Math.abs(pos.y);
          this.calculateFixedIndex(posy,warpHeight);
        });
        this.calculateFixedIndex(0,warpHeight);
      },
      calculateFixedIndex:function(posy,warpHeight){
        let isHasSet = false;
        for(let i = 0; i < this.heightArr.length;i++){
          let dic = this.heightArr[i];
          let top = dic.top;
          let height = dic.height;
          let isFixed = dic.isFixed;
          if(posy >= top && posy <= top+height){
            //如果不需要固定直接返回即可 这里记录是为了节省计算
            if(isFixed){
              if(posy<= top+height-warpHeight ){
                isHasSet = true;
                this.fixedIndex = i;
              }
            }
            break;
          }
        }
        if(!isHasSet){
          this.fixedIndex = -1;
        }
      },

      // 获取购物车数量
      _getCartCount: function () {
        let url = '/app/json/app_cart/getCartCount';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: this.deliverType,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.cartNum = data.data
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

      numChange: function (itemInfo) { // 数量
        let arr = this.$store.state.microSho.carts
        arr.forEach((element,index) => {
          if(itemInfo.skuId == element.skuId){
            this.$store.state.microSho.carts[index].number = itemInfo.number
            return
          }
        })
        this.getDataList();
      },
      updateCart: function () {
        this.getDataList();
      },
      deleteCart: function (carts) {
        if (!carts.length) {
          this.$Toast('请选择要删除的商品')
          return;
        }
        let arr = this.$store.state.microSho.carts
        arr.forEach((element,index) => {
          if(carts[0].skuId == element.skuId){
            this.$store.state.microSho.carts.splice(index,1)
            return
          }
        })
        this.$Toast('删除成功');
        this.getDataList();
      },
      // 获取 列表
      getDataList () {
        let arr = this.$store.state.microSho.carts
        let newAll = [];
        arr.forEach(res=>{
          if(res.deliverType == this.deliverType){
            newAll.push(res)
          }
        })
        if(newAll.length){
          this.$Loading.open();
          let url = '/app/json/app_cart/getCart';
          let paramsData = {
            token: this.$store.state.login.token,
            microStoreCode: this.$store.state.microSho.storeCode,
            carts: newAll,
            deliveryType: this.deliverType
          };
          this.setCommonPara(paramsData);

          this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.isHasRequest = true;
              // this._getCartCount();
              this.occurArr = cartJS.dealCartList(data.data.occur);
              this.invalidCart = data.data.invalidCart ? data.data.invalidCart : [];
              if (this.isEditing) {
                cartJS.setAllUnSel(this.occurArr);
              }
              this.$nextTick(()=>{
                this._initScroll();
              })
            } else {
              this.$Toast(data.info);
            }
          },error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          });
        }else{
          this.isHasRequest = true;
          this.occurArr = cartJS.dealCartList([]);
          this.invalidCart = [];
        }
      }
    },
    watch: {
      'isEditing': function (val, oldVal) {
        if (val && this.occurArr) {
          this.occurArr = cartJS.setAllUnSel(this.occurArr);
        }
      }
    },
    mounted(){
    },
    created() {
      this.getDataList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  $mar-top = 10px
  .cart-list {
    width 100%
    height 100%
    overflow hidden
    .nodata-content{
      width 100%
      height 100%
      overflow auto;
      -webkit-overflow-scrolling touch
      position relative
    }
    .cart-content{
      width 100%
      height 100%
      overflow hidden;
      position relative
      .occur-title {
        padding 10px
        display flex
        align-items center

        span {
          font-size $font-size-medium
          margin-left 3px
          font-weight $font-weight-x
        }
      }
      .title-between{
        justify-content space-between
      }

      .occur-top-fixed{
        position absolute
        top 0
        width 100%
      }
      .occur-bt-fixed{
        position absolute
        bottom  0
        width 100%
      }



    }
    .occur-div {
      width 100%



      .store-div {
        margin 0px $mar-top $mar-top $mar-top
        .store-title {
          padding-top $mar-top
          width 100%
          display flex
          align-items center
          justify-content space-between
          .leftcontent {
            flex 1;
            display flex
            align-items center
            span {
              font-size $font-size-medium
              margin-left 6px
              font-weight $font-weight-x
            }
          }
          .rightcontent {
            text-align right;
            span {
              font-size $font-size-small
              display inline-block;
              vertical-align middle;
            }
            i {
              display inline-block;
              vertical-align middle;
            }
          }
        }
        .store-content {
          width 100%
          .activity-title {
            padding $mar-top  0px
            width 100%
            display flex
            align-items center
            justify-content space-between

            .leftcontent {
              display flex
              align-items center
              flex 1;
              .ac-tag {
                padding 2px 6px
                border-radius: 8px;
                font-size $font-size-small
              }
              .ac-title {
                padding 2px 2px

                font-size $font-size-medium
              }
            }
            .rightcontent {
              text-align right;
              span {
                font-size $font-size-medium-s
                display inline-block;
                vertical-align middle;
              }
              i {
                display inline-block;
                vertical-align middle;
              }
            }
          }
          .activity-content {
            margin-left 20px
            box-shadow 0px 2px 2px #efefef;
          }
        }
      }

    }

    .invalid-content{
      margin 10px
      box-shadow 0px 2px 2px #efefef;
    }
    .noCart {
      margin $mar-top
      box-shadow 0px 2px 2px #efefef;
      padding: 40px 20px

      .noCartTag {
        display flex
        justify-content center
        align-items center
        .btn-icon {
          font-size 40px;
        }
        .text {
          margin-left 10px
          font-size 15px
        }
      }
      .goShop {
        width 100%
        margin-top 20px
        font-size $font-size-medium-x
        padding 8px
        border-radius 16px
        text-align center
      }

    }
    .font-large {
      font-size $font-size-medium-x
    }
    .font-small {
      font-size $font-size-small
    }
    .font-large-x {
      font-size $font-size-large
    }
    .font-medium {
      font-size $font-size-medium
    }
    .marL {
      margin-left 3px
    }
    .marT10 {
      margin-top: 10px
    }
    .recommend-div {
      overflow hidden
    }

  }
</style>
