/**Created by steven on 2019/1/1.*/

<template>
  <div class="pay-div">
     <!-- 主内容 -->
    <div class="pay-left">
      <!-- 全选 -->
      <div class="selectAll" @click="$emit('setOccSel')">
        <i class="iconfont font-large-x"
           :class="cartJS.getCheckedClass(occurArr,isEditing)"></i>
        <span class="font-medium marL theme_font_black">全选</span>
      </div>
       <!-- 结算显示内容 -->
      <div class="paymoney" v-show="!isEditing">
        <div>
          <span class="theme_font_black font-large-x">合计:</span>
          <span class="font-large-x theme_font_red">{{cartJS.getItemAmount(getTotalPrice('payAmount'),0)}}.</span>
          <span class="font-small theme_font_red">{{cartJS.getItemAmount(getTotalPrice('payAmount'),1)}}</span>
          <!-- 积分相关 -->
          <!-- <div class="digital-div" v-for="(digital,index) in occuritem.digitalList" :key="index" >
              <div v-if="$mallCommon.getTotalUsePoints(digital)>0">
                 <span class="font-small theme_font_red" v-if="index != $mallCommon.getFirstVartualIndex(occuritem) || $mallCommon.getOccurShowPrice(occuritem)">+</span>
                <span class="font-large-x theme_font_red">{{$mallCommon.getTotalUsePoints(digital)}}</span>
                 <span class="font-small theme_font_red">{{$mallCommon.getTotalUnitStr(digital.acctType)}}</span>
              </div>
          </div> -->
        </div>
        <p class="point theme_font_black font-small">总额: ￥{{$util.toDecimal2(getTotalPrice('amount'))}}&nbsp;&nbsp;&nbsp; 优惠:
          ￥{{$util.toDecimal2(getTotalPrice('discountAmount'))}}</p>
      </div>
    </div>
    <!-- 右侧 删除/结算-->
    <div class="pay-right theme_font_white theme_standard_bg font-large-x" >
      <div v-if="!isEditing" @click="toPay()">结算 <span class="font-small">({{cartJS.getPayNum(occurArr,isEditing)}})</span></div>
      <div v-else  @click="toDelete()">删除</div>
    </div>
  </div>
</template>

<script>
  import cartJS from './js/cart'

  export default {
    name: "pay-div",
    props: [
      'occurArr',
      'isEditing'
    ],
    components: {
    },
    data() {
      return {
        cartJS: cartJS,
      }
    },
    methods: {
      // digitalList  积分相关业务 全部注释
      // getTotalUnitStr: function (acctType) {
      //   let arr = this.$store.state.globalConfig.acctList;
      //   for (let i = 0; i < arr.length; i++) {
      //     let item = arr[i]
      //     if (item.acctType == acctType) {

      //         return item.displayName;
      //     }
      //   }
        // if(this.getShowPrice(this.occuritem)){
        //   return '积分' + '+'
        // }else{
          // return '积分';
        // }
      // },
      // getTotalUsePoints: function (digital) {
      //   let points = 0;
      //   //固定的积分商品  或 使用积分抵扣
      //   if (digital.fixedDigital > 0 || digital.payDigital > 0) {
      //     points = parseInt(digital.fixedDigital) + parseInt(digital.payDigital);
      //   }
      //   return points;
      // },
      // getShowPrice:function(occuritem){
        // if(occuritem.payAmount > 0){
        //   return true;
        // }
        // let isPoints = false;
        // for (let i = 0; i < occuritem.digitalList.length; i++) {
        //   let digital = occuritem.digitalList[i];
        //   let value = this.getTotalUsePoints(digital);
        //   if(value){
        //     isPoints = true;
        //     break;
        //   }
        // }
        //金额为0 并且有三方支付额的时候  才不显示价格 其它一律显示价格
        // return !isPoints;
      // },
      /*提交订单*/ 
      toPay:function () {
        let addParams='';
        localStorage.setItem('fromShoppingCar', true)
        if (this.$route.query.productType == '501') {
          addParams='phone' //话费充值
        }
        this.$emit('toPay',addParams);
      },
      toDelete:function () {
        this.$emit('toDelete');
      },
      /**
       * @description: 获取**参数总金额
       * @param {*} key ： amount金额| discountAmount优惠金额 | payAmount合计金额
       * @return {*}  金额
       */
      getTotalPrice:function (key) {
        return this.occurArr.reduce(( acc, cur ) => {
          return acc + cur[key]*1
        }, 0);
        // let str = 0;
        // let isShowPrice = this.getShowPrice(this.occuritem);
        
        // if(isShowPrice){
        //   str +=  this.occuritem.amount;
        // }
        // let isPoints = false;
        // for (let i = 0; i < this.occuritem.digitalList.length; i++) {
        //   let digital = this.occuritem.digitalList[i];
        //   let value = this.getTotalUsePoints(digital);
        //   if(value){
        //     value = value + this.$mallCommon.getTotalUnitStr(digital.acctType);
        //     if(str.length){
        //       str = str + '+' +value;
        //     }else {
        //       str = str +value;
        //     }
        //   }
        // }
        // return str;
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .pay-div {
    height 70px;
    position relative;
    z-index 10;
    padding 10px
    display flex
    align-items center
    justify-content space-between
    box-shadow 0px -1px 0px #efefef
    .pay-left {
      display flex
      align-items center
      .selectAll {
        display flex
        align-items center
      }
      .paymoney {
        margin-left 15px
        font-size 0
        .point {
          margin-top 4px
        }

      }
    }
    .pay-right {
      padding 6px 14px
      border-radius 13px
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
  .digital-div {
    display inline-block;
    .price-big {
      font-size 20px;
    }
  }
</style>
