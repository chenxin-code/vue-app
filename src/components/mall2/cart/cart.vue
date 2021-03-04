/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="cart">
    <nav-top :noTitle="true" :noBack="!hasBack" @backEvent="backEvent">
      <div class="cart-top">
        <div class="cart-title" @click="chooseAddress(deliverType)">
          <span class="title theme_font_black">购物车({{ goodsCount }})</span>
          <!-- <span class="address theme_font_gray">{{getAddressName()}}</span> -->
          <!-- <i class="iconfont mall-dingwei theme_font_black"></i> -->
        </div>
        <p class="cart-edit theme_font_gray" @click="setEdit">
          {{ isEditing ? "完成" : "编辑" }}
        </p>
      </div>
    </nav-top>
    <nav-content>
      <!--      <div class="row"-->
      <!--           v-if="$store.state.globalConfig.delivertype_default != '1' && $store.state.globalConfig.delivertype_default != '2'">-->
      <!--        <div class="type-btn" v-for="(item,index) in topArr"-->
      <!--             :class="{theme_light_bg: deliverType == item.type, theme_standard_bdr_i: deliverType == item.type}"-->
      <!--             @click="deliverTypeEvent(item)">-->
      <!--          <i class="iconfont  theme_font_common icon-size"-->
      <!--             :class="[item.class,{theme_standard_font_i: deliverType == item.type}]"></i>-->
      <!--          <span class="theme_font_common"-->
      <!--                :class="{theme_standard_font_i: deliverType == item.type}">{{item.name}}</span>-->
      <!--          <span class="theme_font_common" :class="{theme_standard_font_i: deliverType == item.type}"-->
      <!--                v-if="peisongNum > 0 && item.type == 2">({{peisongNum}})</span>-->
      <!--          <span class="theme_font_common" :class="{theme_standard_font_i: deliverType == item.type}"-->
      <!--                v-if="zitiNum > 0 && item.type == 1">({{zitiNum}})</span>-->
      <!--        </div>-->
      <!--      </div>-->
      <div
        class="list-content"
        :class="{
          notop:
            $store.state.globalConfig.delivertype_default == '1' ||
            $store.state.globalConfig.delivertype_default == '2',
        }"
      >
        <!--        <div class="presale-cart-div" v-if="$store.state.globalConfig.presaleType == 2 && deliverType == 1">-->
        <!--          <div class="content" @click="toPresaleCart">-->
        <!--            <div class="icon">-->
        <!--              <i class="iconfont mall-gouwuche theme_font_red"></i>-->
        <!--              <p class="cart-num theme_bg_red theme_font_white" v-if="cartNum > 0">{{cartNum}}</p>-->
        <!--            </div>-->
        <!--            <div class="text">-->
        <!--              预售购物车-->
        <!--            </div>-->
        <!--            <div class="jt">-->
        <!--              <i class="iconfont mall-gengduojiantou theme_font_gray"></i>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <CartList
          v-for="(item, index) in topArr"
          :ref="getCartRef(item.type)"
          v-if="item.hasShow"
          v-show="deliverType == item.type"
          @changeGoodsCount="changeGoodsCount"
          :deliverType="item.type"
          :key="index"
          :isEditing="isEditing"
          :orderCategory="orderCategory"
          :vipUnitUserCode="vipUnitUserCode"
          @updateEdit="setEdit"
        >
        </CartList>
      </div>
    </nav-content>
    <AdPage :pageAdKeywords="'AD_Key_Cart'"></AdPage>
  </div>
</template>

<script>
import cartJS from "./js/cart";
import CartList from "./cart-list";
import InitialLoadPickupAny from "@/utils/initialLoadPickupAny.js";
import AdPage from "@/components/product/index/subpage/adpage";
import cartEvent from "../../../utils/presale/cart";

export default {
  name: "cart",
  components: {
    CartList,
    AdPage,
  },
  props: {
    hasBack: {
      type: Boolean,
      default: true,
    },
    //当有底部导航的时候 是否是当前显示的
    commonShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      topArr: [],
      deliverType: null,
      listZitiId: null,
      cartAddress: null,
      isEditing: false,
      peisongNum: 0,
      zitiNum: 0,
      dataIsLoad: false,
      firstZiti: true,
      orderCategory: "",
      vipUnitUserCode: undefined,
      lastPath: "",
      cartNum: 0,
      goodsCount: 0,
    };
  },
  methods: {
    changeGoodsCount(count) {
      this.goodsCount = count;
    },

    toPresaleCart: function () {
      this.$router.push({
        path: "/mall2/presalecart",
      });
    },
    backEvent: function () {
      this.$router.go(-1);
      this.$keepaliveHelper.deleteCache(this);
    },
    setEdit: function () {
      this.isEditing = !this.isEditing;
    },
    getAddressName: function () {
      let name = null;

      if (this.deliverType == 2) {
        name = "";
        // name = this.$store.state.mall2.selectAddress.addressFull;
        // if (!name || name == '') {
        //   name = '更改配送地址'
        // }
      } else if (this.deliverType == 1) {
        // name = this.$store.state.mall2.zitiAddress.storeName;
        // if (!name || name == '') {
        //   name = '更改自提地址'
        // }
        name = "";
      }

      return name;
    },
    chooseAddress: function (type) {
      if (type == 2) {
        this.$router.push({
          path: "/mall2/addresslist",
        });
      } else {
        if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
          return;
        }
        this.$router.push({
          path: "/mall2/mypickupaddress",
        });
      }
    },
    deliverTypeEvent: function (item) {
      if (item.type == 2) {
        this.saveItemSel(item);
        this.getData();
      } else if (item.type == 1) {
        if (
          this.firstZiti == true &&
          (this.$store.state.mall2.zitiAddress.id == undefined ||
            this.$store.state.mall2.zitiAddress.id == "")
        ) {
          this.chooseAddress(item.type);
        } else {
          this.saveItemSel(item);
          this.getData();
        }
        this.firstZiti = false;
      }
    },
    saveItemSel: function (item) {
      item.hasShow = true;
      this.deliverType = item.type;
      this.$store.state.mall2.staticDeliverType = this.deliverType;
      this.$bridgefunc.vuexStorage();
    },

    pageShow: function () {
      this.deliverType = this.$store.state.mall2.staticDeliverType;
      this.getData();
    },
    getData: function () {
      if (this.deliverType == 1) {
        InitialLoadPickupAny.checkIsInitialLoad((address) => {
          if (address) {
            this.getData();
          } else {
            let comref = this.getCartRef(this.deliverType);
            this.$nextTick(() => {
              if (this.$refs[comref]) {
                let arr = this.$refs[comref];
                console.log(
                  "this.$store.state.mall2.zitiAddress",
                  this.$store.state.mall2.zitiAddress
                );
                console.log(
                  "this.$route.query.pickupAddress",
                  this.$route.query.pickupAddress
                );
                arr[0].getDataList();
                sessionStorage.removeItem("RHY_Pickup_Address");
              }
            });
          }
        });
      } else {
        let comref = this.getCartRef(this.deliverType);
        this.$nextTick(() => {
          if (this.$refs[comref]) {
            let arr = this.$refs[comref];
            arr[0].getDataList();
            sessionStorage.removeItem("RHY_Pickup_Address");
          }
        });
      }
    },
    getCartRef: function (index) {
      return "cart" + index;
    },
    getItemByType: function (type) {
      for (let i = 0; i < this.topArr.length; i++) {
        let item = this.topArr[i];
        if (item.type == type) {
          return item;
        }
      }
      return null;
    },
    _getCartCount: function (deliverType) {
      let url = "/app/json/app_cart/getCartCount";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: deliverType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          let data = res.data;
          if (data.status == 0) {
            // this.$store.state.mall2.cartNum = data.data
            if (deliverType == 1) {
              this.zitiNum = data.data;
            } else {
              this.peisongNum = data.data;
            }
          } else {
            // this.$Toast(data.info);
          }
        },
        (error) => {
          // this.$Loading.close();
          // this.$Toast('请求数据失败！')
        }
      );
    },
  },
  activated() {
    if (this.$store.state.globalConfig.presaleType == 2) {
      this.cartNum = cartEvent.getCartNum();
    }
    // 首页的时候，且不是当前显示tab
    if (this.$route.path == "/common" && !this.commonShow) {
      return;
    }

    if (this.dataIsLoad == true) {
      this.deliverType = this.$store.state.mall2.staticDeliverType;
      let item = this.getItemByType(this.deliverType);
      this.deliverTypeEvent(item);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.path == this.lastPath ||
      this.lastPath == "/" ||
      this.lastPath == ""
    ) {
      this.$keepaliveHelper.deleteCache(this);
    }
    next();
  },
  mounted() {
    this.deliverType = this.$store.state.mall2.staticDeliverType;
    let item = this.getItemByType(this.deliverType);
    this.deliverTypeEvent(item);
    setTimeout(() => {
      this.dataIsLoad = true;
    }, 500);
    if (this.deliverType == 1) {
      this.zitiNum = this.$store.state.mall2.cartNum;
      if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
        if (this.$store.state.mall2.zitiAddress.mchOuCode != "") {
          this._getCartCount(2);
        }
      } else {
        this._getCartCount(2);
      }
    } else {
      this.peisongNum = this.$store.state.mall2.cartNum;
      if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
        if (this.$store.state.mall2.zitiAddress.id != "") {
          this._getCartCount(2);
        }
      } else {
        this._getCartCount(1);
      }
    }
  },
  created() {
    this.lastPath = this.$route.query.lastPath
      ? this.$route.query.lastPath
      : "";
    this.topArr = cartJS.getTopArr();
    if (this.$route.query.pickupId) {
      this.$mallCommon.getSysStoreById(
        this.$route.query.pickupId,
        (pickupAddress) => {
          this.$store.state.mall2.zitiAddress = pickupAddress;
          sessionStorage.setItem(
            "RHY_Pickup_Address",
            this.$route.query.pickupId
          );
          this.$userCenter._setDefaultPickupAddress(pickupAddress.id);
        }
      );
    } else if (this.$route.query.pickupAddress) {
      let pickupAddress = JSON.parse(this.$route.query.pickupAddress);
      this.$store.state.mall2.zitiAddress = pickupAddress;
      sessionStorage.setItem(
        "RHY_Pickup_Address",
        this.$route.query.pickupAddress
      );
      this.$userCenter._setDefaultPickupAddress(pickupAddress.id);
    }
    this.listZitiId = this.$route.query.pickupId;
    this.cartAddress = this.$store.state.mall2.selectAddress;
    this.orderCategory = this.$route.query.orderCategory;
    this.vipUnitUserCode = this.$route.query.vipUnitUserCode;
  },
  watch: {
    "$store.state.mall2.cartNum": function (val, oldVal) {
      if (val == 0) {
        this.isEditing = false;
      }
      if (this.deliverType == 1) {
        this.zitiNum = val;
      } else {
        this.peisongNum = val;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.cart {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .cart-top {
    margin-left: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .cart-title {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .title {
        font-size: $font-size-large;
      }

      .address {
        font-size: $font-size-small;
        margin-left: 6px;
      }

      i {
        font-size: $font-size-large;
        margin-left: 6px;
      }
    }

    .cart-edit {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: $font-size-medium;
      padding: 0px 14px;
    }
  }

  .row {
    padding: 5px 15px;
    display: flex;
    justify-content: space-around;

    .type-btn {
      min-width: 94px;
      text-align: center;
      font-size: $font-size-medium;
      padding: 4px 10px;
      border-radius: 15px;
      border: 0.6px solid transparent;

      .icon-size {
        font-size: $font-size-medium;
      }
    }
  }

  .list-content {
    position: absolute;
    left: 0px;
    right: 0px;
    // top 40px;
    top: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;

    .presale-cart-div {
      overflow: hidden;

      .content {
        margin: 8px;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;

        .icon {
          position: relative;

          i {
            font-size: 20px;
          }

          .cart-num {
            position: absolute;
            right: -10px;
            top: -8px;
            border-radius: 12px;
            padding: 2px 4px;
            font-size: 12px;
            z-index: 5;
          }
        }

        .text {
          flex: 1;
          padding: 0 10px;
          font-size: 14px;
        }

        .jt {
          i {
            font-size: 12px;
          }
        }
      }
    }

    &.notop {
      top: 0;
    }
  }
}
</style>
