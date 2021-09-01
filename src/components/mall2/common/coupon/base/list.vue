/**Created by liaoyingchao on 2018/11/15.*/

<template>
  <div class="list">
    <div
      class="eccell"
      v-for="(item, index) in coupons"
      @click.stop="itemEvent(item, index)"
      :class="{ disable: item.disable == true }"
    >
      <div class="ecinfo shadow-cell">
        <div
          class="left-info theme_font_white"
          :class="
            listType == 4 ||
            listType == 5 ||
            (selectedCouponType != '' &&
              selectedCouponType != item.couTypeCode &&
              listType == 2)
              ? 'theme_bg_dark_d'
              : 'theme_bg_light_blue'
          "
        >
          <div class="left-con" v-if="item.couCategory == 40">
            <P v-if="item.couDiscountValue" class="faceamt "
              ><span class="span-xx"
                >{{ (item.couDiscountValue * 1000) / 100 }}折</span
              ></P
            >
            <P v-else class="faceamt "><span class="span-x">折扣券</span></P>
            <p class="limmony" v-show="item.couThresholdAmount > 0">
              满{{ item.couThresholdAmount }}元可用
            </p>
          </div>
          <div class="left-con" v-else>
            <P v-if="item.couFaceValue" class="faceamt "
              ><span class="span-x">￥</span
              ><span class="span-xx">{{ item.couFaceValue }}</span></P
            >
            <P v-if="item.couFaceValue == ''" class="faceamt "
              ><span class="span-x">￥</span
              ><span class="span-xx-s">{{
                item.couMinFaceValue + "~" + item.couMaxFaceValue
              }}</span></P
            >
            <p class="limmony" v-show="item.couThresholdAmount > 0">
              满{{ item.couThresholdAmount }}元可用
            </p>
          </div>
        </div>
        <div class="right-info">
          <div class="right-con">
            <div class="top-type">
              <div class="top-con">
                <p
                  class="ectype-con theme_bg_light_blue theme_font_white"
                  v-if="item.couOriginCode == '100'"
                >
                  平台券
                </p>
                <p class="title-con">{{ item.couTypeTitle }}</p>
              </div>
            </div>
            <div class="coupon-tip">
              <div
                class="single-line font-small theme_font_tint"
                v-if="item.couCategory == 40"
              >
                <!--{{item.couDiscountMaxValue ? `注：最大抵扣金额${item.couDiscountMaxValue}元` : ''}}-->
              </div>
              <div
                class="single-line font-small theme_font_tint"
                v-else-if="item.couFaceValue == ''"
              >
                注：领取金额{{ item.couMinFaceValue }}元至{{
                  item.couMaxFaceValue
                }}元随机
              </div>
            </div>
            <div class="date-con">
              <div style="flex: 1;">
                {{ item.validStartDate }} 至 {{ item.validEndDate }}
              </div>
              <div
                class="btn get-coupon theme_bg_light_blue theme_font_white"
                v-if="item.isReceived == 0 && listType == 0"
                @click.stop="getCouponEvent(item)"
              >
                点击领取
              </div>
              <div
                class="btn to-product theme_font_light_blue"
                v-if="item.isReceived == 1 && listType == 0"
                @click.stop="couponProducts(item)"
              >
                可用商品
              </div>
              <div
                class="btn get-coupon theme_bg_light_blue theme_font_white"
                v-if="listType == 3"
                @click.stop="getCouponEvent(item)"
              >
                立即使用
              </div>
            </div>
          </div>
        </div>
        <img src="/static/image/mall2/used.png" v-if="listType == 4" />
        <div class="select-div" v-if="listType == 2">
          <i
            class="iconfont mall-weixuanzhong theme_font_tint canNotSelect"
            v-if="isSelected(item.couNo)"
          ></i>
          <i
            class="iconfont mall-weixuanzhong theme_font_tint"
            v-else-if="!item.selected"
          ></i>
          <i
            class="iconfont mall-xuanzhong theme_font_red"
            v-else-if="item.selected"
          ></i>
          <!-- <van-checkbox
            :name="index"
            v-model="item.selected"
            @click="checkShop()"
            checked-color="#E5165A"
          ></van-checkbox> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../../Vendor/toast";

export default {
  name: "list",
  props: ["coupons", "listType", "payAmount", "fiveEnter",'isSelectedList','storeIndex'],
  components: {},
  data() {
    return {
      selectedIndex: -1,
      selectedCouponType: "",
      selectedCouponThresholdAmount: "",
      canUseCouponNumber: "",
      selectedCouNo: ""
    };
  },
  created(){

  },
  computed:{
    isSelected(){
      return function (couNo) {
        console.log('this.isSelectedList',this.isSelectedList)
        console.log('this.storeIndex',this.storeIndex)
        if(this.isSelectedList){
          let filter = this.isSelectedList.filter(e=>{
            return e.couNo == couNo && e.storeIndex != this.storeIndex;
          })
          if(filter.length > 0){
            return true
          }else{
            return false
          }
        }else{
          return false
        }
      }
    },
  },
  methods: {
    // isSelected(couNo){
    //   if(this.isSelectedList && this.storeIndex){
    //     let filter = this.isSelectedList.filter(e=>{
    //       return e.couNo == couNo && e.storeIndex != this.storeIndex;
    //     })
    //     if(filter.length > 0){
    //       return true
    //     }else{
    //       false
    //     }
    //   }else{
    //     return false
    //   }
    // },
    // checkShop(data) {
    //   console.log(`datadatadtaa`, data);
    // },
    getCouponEvent: function(item) {
      this.$emit("getCouponEvent", item);
    },
    couponProducts: function(item) {
      this.$emit("couponProducts", item);
    },
    itemEvent: function(item, index) {
      // 5进活动调整
      console.log(item, index, "item", this);
      if(this.isSelected(item.couNo)){
        Toast("不能与已选优惠券叠加使用！");
        return
      }
      if (this.fiveEnter) {
        this.coupons.forEach((value, index1) => {
          this.coupons[index1].selected = false;
        });
        // this.coupons[index].selected=true
      }
      if (this.listType == 2) {
        if (item.disable == true) {
          Toast("不能与已选优惠券叠加使用！");
          return;
        }

        if (
          this.selectedCouponType != "" &&
          this.selectedCouponType != item.couTypeCode
        ) {
          Toast("不能与已选优惠券叠加使用！");
          return;
        }

        this.coupons.forEach((value, index1) => {
          //解决需要将当前选中取消勾选，才能选择其它优惠券的问题
          if (item.couNo != value.couNo) {
            this.coupons[index1].selected = false;
          }
        });

        item.selected = !item.selected;
        this.coupons.splice(index, 1, item);

        let arr = [];
        for (let i = 0; i < this.coupons.length; i++) {
          let item1 = this.coupons[i];
          if (item1.selected == true) {
            arr.push(item1);
          }
        }
        this.$emit("selectedItems", arr);
      }
    }
  },
  mounted() {
    console.log(this.coupons, "coupons");
    console.log(this.listType, this.payAmount, this.fiveEnter, "coupons");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
  .canNotSelect{
    background: #999;
    border-radius: 50%;
    overflow: hidden; 
  }
.list {
  overflow hidden
  .eccell {
    /*background-color #9fa0a0*/
    background-color white
    .ecinfo {
      height 90px
      display flex
      align-items center;
      .left-info {
        height 100%;
        /*background-color magenta*/
        padding 0px 1px
        display flex
        align-items center
        width 28%
        //background: linear-gradient(145deg, #5c9de1, #687add);
        .left-con {
          width 100%
          .faceamt {
            text-align center
            overflow hidden
            .span-x{
              font-size $font-size-large
              font-weight $font-weight-x
            }
            .span-xx{
              font-size $font-size-large-xxx
              font-weight $font-weight-xx
            }
            .span-xx-s {
              font-size 28px;
              font-weight $font-weight-xx
            }
          }
          .limmony {
            margin-top 10px
            font-size $font-size-medium-s
            font-weight 500
            text-align center
          }

        }
      }
      .right-info {
        flex 1
        height 100%
        display flex
        align-items center
        .right-con {
          width 100%;
          margin-left 10px
          margin-right 8px
          .top-type {
            height 40px;
            font-size $font-size-small
            .top-con {
              display flex
              align-items center;
              .ectype-con {
                margin-right 8px;
                padding 2px 9px
                border-radius: 10px;
                -webkit-border-radius: 10px;
              }
              .title-con {
                flex 1
                font-size $font-size-medium
              }
            }
          }
          .date-con {
            width 100%;
            margin-top 5px
            font-size $font-size-small
            display flex;
            align-items center;
            .btn {
              padding 4px 6px;
              border-width 0.5px;
              border-style solid;
              font-size $font-size-small
              margin 0 0 0 6px
              border-radius 15px;
            }
          }

        }
      }
      .select-div {
        margin 5px;
        i {
          font-size 20px;
        }
      }
      img{
        margin-right 15px
        width 50px
        height 38px
      }
    }
    .tip-con {
      margin-left 10px
      margin-right 10px
      margin-top 10px
      font-size $font-size-small
    }
    .coupon-tip {
      height 14px;
    }
  }
  .disable {
    position relative;
    &:after {
      content: ''
      position: absolute
      top: 0px
      left: 0px
      right: 0px
      bottom: 0px
      z-index 1;
      background-color rgba(255, 255, 255, 0.5)
    }
  }
}
</style>
