/**Created by steven on 2019/7/2.*/

<template>
  <div class="price-content">
    <div class="price-content" v-if="priceData.status != 0 && isRMBEnd == '1'">
        <span class="theme_font_red" :class="[priceData.fontBigCls,priceData.whiteCls]" v-for="accitem in digitalAccountList"  v-if="priceData[accitem.listKey] && priceData[accitem.listKey] != ''">{{priceData[accitem.listKey]}}<span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" >{{getUnitStr(priceData,accitem)}}</span><span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" v-if="priceData[accitem.listKey] && priceData[accitem.listKey] != '' && $mallCommon.getShowPrice(priceData)">+</span></span><span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" v-show="$mallCommon.getShowPrice(priceData)">￥</span><span class="theme_font_red" :class="[priceData.fontMaxCls?priceData.fontMaxCls:priceData.fontBigCls,priceData.whiteCls]" v-show="$mallCommon.getShowPrice(priceData)">{{priceData.dpedData.integer}}</span><span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" v-show="$mallCommon.getShowPrice(priceData)">.{{priceData.dpedData.decimals}}</span>

    </div>
    <div class="price-content" v-else-if="priceData.status != 0">
      <span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" v-show="$mallCommon.getShowPrice(priceData)">￥</span><span class="theme_font_red" :class="[priceData.fontMaxCls?priceData.fontMaxCls:priceData.fontBigCls,priceData.whiteCls]" v-show="$mallCommon.getShowPrice(priceData)">{{priceData.dpedData.integer}}</span><span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" v-show="$mallCommon.getShowPrice(priceData)">.{{priceData.dpedData.decimals}}</span><span class="theme_font_red" :class="[priceData.fontBigCls,priceData.whiteCls]" v-for="accitem in digitalAccountList"  v-if="priceData[accitem.listKey] && priceData[accitem.listKey] != ''"><span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" v-if="priceData[accitem.listKey] && priceData[accitem.listKey] != '' && $mallCommon.getShowPrice(priceData)">+</span>{{priceData[accitem.listKey]}}<span class="theme_font_red" :class="[priceData.fontSmallCls,priceData.whiteCls]" >{{getUnitStr(priceData,accitem)}}</span></span>
    </div>
    <div class="price-content" v-else>
      <span class="theme_font_red" :class="[priceData.fontBigCls,priceData.whiteCls]" >暂无报价</span>
    </div>
  </div>

</template>

<script>

import store from "../../../vuex/store";

export default {
  name: "price-content",
  components: {

  },
  props:[
    'priceData',
    // rmbEnd == 1 rmb 在后面
    'isRMBEnd'
  ],
  data () {
    return {
      digitalAccountList: store.state.globalConfig.acctList
    }
  },
  methods: {
    //计算显示单位
    getUnitStr: function (item,accitem) {
      let points = item[accitem.listKey];
      let title = accitem.displayName;
      let price = item.tPrice;

      let isMoreAcct = false;
      let index = this.digitalAccountList.indexOf(accitem);
      if(index < this.digitalAccountList.length-1){
        for (let i = index+1; i < this.digitalAccountList.length; i++) {
          let tempItem = this.digitalAccountList[i];
          let tempPoints = item[tempItem.listKey];
          if(tempPoints && tempPoints != ''){
            isMoreAcct = true;
            break;
          }
        }
      }
      //两行样式单独处理
      if (item.type == 'listdouble') {
        if(isMoreAcct){
          return title ;
        }else {
          if (price == 0 || price == '') {
            return title
          } else {
            return title + '起';
          }
        }
      }

      return title
      // if ((price == 0 || price == '') && !isMoreAcct) {
      // }else {
      //   return title + '+'
      // }
    },

  },
  created () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  @import "./css/price.styl"
  .price-content {
    display inline
  }
</style>
