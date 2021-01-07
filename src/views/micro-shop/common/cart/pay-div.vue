<template>
  <div class="pay-div">
    <div class="pay-left">
      <div class="selectAll" @click="setOccSel(occuritem)">
        <i class="iconfont   font-large-x"
           :class="cartJS.getXZClass(isEditing,occuritem.checked,occuritem.dchecked)"></i>
        <span class="font-medium marL theme_font_black">全选</span>
      </div>
      <div class="paymoney" v-show="!isEditing">
        <div>
          <span class="theme_font_black font-large-x">合计:</span>
          <!--<span class="font-large-x theme_font_red" v-show="occuritem.fixedPoints != ''">{{occuritem.fixedPoints}}</span>-->
          <!--<span class="font-small theme_font_red">{{getUnitStr()}}</span>-->
          <div class="digital-div" v-for="digital in occuritem.digitalList" v-if="getTotalUsePoints(digital)>0">
            <span class="font-large-x theme_font_red">{{getTotalUsePoints(digital)}}</span>
            <span class="font-small theme_font_red">{{getTotalUnitStr(digital.acctType)}}</span>
          </div>
          <span class="font-large-x theme_font_red" v-show="getShowPrice()">{{cartJS.getItemAmount(occuritem.payAmount,0)}}.</span>
          <span class="font-small theme_font_red"  v-show="getShowPrice()">{{cartJS.getItemAmount(occuritem.payAmount,1)}}</span>
        </div>
        <p class="point theme_font_black font-small">总额: ￥{{$util.toDecimal2(getTotalStr())}}&nbsp&nbsp&nbsp 优惠:
          ￥{{$util.toDecimal2(occuritem.discountAmount)}}</p>
      </div>
    </div>

    <div class="pay-right theme_font_white theme_standard_bg font-large-x" v-if="!isEditing" @click="toPay(occuritem)">
      结算 <span class="font-small">({{cartJS.getPayNum(occuritem,isEditing)}})</span>
    </div>
    <div class="pay-right theme_font_white theme_standard_bg font-large-x" v-if="isEditing"
         @click="toDelete(occuritem)">
      删除
    </div>
  </div>
</template>

<script>
  import cartJS from './js/cart'

  export default {
    name: "pay-div",
    props: [
      'occuritem',
      'isEditing',
    ],
    components: {
    },
    data() {
      return {
        cartJS: cartJS,
      }
    },
    methods: {
      getTotalUnitStr: function (acctType) {
        let arr = this.$store.state.globalConfig.acctList;
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (item.acctType == acctType) {
            return item.displayName + '+'
          }
        }
        return '积分' + '+'
      },
      getTotalUsePoints: function (digital) {
        let points = 0;
        //固定的积分商品  或 使用积分抵扣
        if (digital.fixedDigital > 0 || digital.payDigital > 0) {
          points = parseInt(digital.fixedDigital) + parseInt(digital.payDigital);
        }
        return points;
      },
      setOccSel: function (occuritem) {
        this.$emit('setOccSel',occuritem);
      },
      toPay:function (occuritem) {
        this.$emit('toPay',occuritem);
      },
      toDelete:function (occuritem) {
        this.$emit('toDelete',occuritem);
      },
      getUnitStr:function () {
        let points = this.occuritem.fixedPoints;
        let price = this.occuritem.amount;;

        if(points && points != ''){
          if(price == 0 || price == ''){
            return '积分';
          }else {
            return '积分+￥'
          }
        }else {
          return '￥'
        }
      },
      getShowPrice:function(item,type){

        let points = this.occuritem.fixedPoints;
        let price = this.occuritem.amount;;
        //有积分价格 且 活动价为0 的情况下  隐藏价格
        if((price == 0 || price == '') && points && points != '' ){
          return false;
        }else {
          return true;
        }
      },
      getTotalStr:function () {
        let str = '';
        if(this.occuritem.fixedPoints && this.occuritem.fixedPoints != ''){
          str += this.occuritem.fixedPoints;
        }
        str += this.getUnitStr();
        if(this.getShowPrice()){
          str += this.occuritem.amount;
        }
        return str;
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
