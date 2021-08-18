/**Created by liaoyingchao on 2019/1/11.*/

<!--<template>-->
<!--<div class="product-list-hscroll">-->
<!--<div class="content">-->
<!--<div class="items-row">-->
<!--<div :style="getItemStyle(index)" class="item" v-for="(item, index) in moduleData.rows" @click="$market.enterNav(item)">-->
<!--<img :style="imgStyle" :src="item.imgUrl"/>-->
<!--</div>-->
<!--</div>-->
<!--</div>-->
<!--</div>-->
<!--</template>-->
<template>
  <div class="product-list-hscroll" :style="$market.getModuleBgStyle(moduleData)"
       v-if="$market.moduleIsShow(moduleData)">
    <div class="content">
      <div class="items-row">
        <HScroll :dataList="moduleData.rows" :click="false">
          <div class="item" v-for="(item, index) in moduleData.rows">
            <div class="content-div" :style="getItemStyle(index)" @click="enterNav(item)">
              <img :style="imgStyle" :src="item.phMainUrl"/>
              <div class="h-price">
                <PriceOrder :listitem_Double="item"></PriceOrder>
              </div>
            </div>
          </div>
        </HScroll>
      </div>
    </div>
  </div>
</template>

<script>
  import PriceOrder from '@/components/commonui/price/price-order'
  import HScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import {mapGetters} from 'vuex';

  export default {
    name: 'product-list-hscroll',
    components: {
      PriceOrder,
      HScroll
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    data() {
      return {
        imgStyle: ''
      };
    },
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    mounted() {
      console.log('this.moduleData', this.moduleData)
    },
    methods: {
      enterNav: function (product) {
        // this.moduleData.showTime && this.moduleData.type == '3' && this.moduleData.useApi == 3 && list.length > 0
        if (this.moduleData.showTime && this.moduleData.type == '3' && this.moduleData.useApi == 3) {
          this.$market.productEvent(product, this.$route, this.moduleData.onlyDeliveryType, '1')
        } else {
          this.$market.productEvent(product, this.$route, this.moduleData.onlyDeliveryType)
        }
        this.$sensors.track("goods_click", {
          which_page:this.$route.name,
          page_path:this.$route.path,
          goods_id: product.skuId,
          goods_name: product.skuName,
          org_price: product.activityPrice,
          price: product.salePrice,
          store_id: product.storeOuCode,
          store_name: product.storeName,
        })
      },
      getItemStyle: function (index) {
        let styleStr = ''
        let mNum = this.moduleData.startMargin;
        let space = this.moduleData.space
        let cW = this.clientWidth
        if (mNum > 0) {
          cW = this.clientWidth * (100 - mNum - mNum) / 100
        }
        let itemNumber = this.moduleData.itemNumber
        let allImgW = cW
        if (space > 0) {
          styleStr += 'margin-right: ' + space + 'px;'
          allImgW -= (itemNumber - 1) * space;
        }
        let imgW = allImgW / itemNumber
        let imgH = imgW * 1

        styleStr += 'width: ' + imgW + 'px;'
        // styleStr += 'height: ' + imgH + 'px;'
        this.imgStyle = 'width: ' + imgW + 'px;' + 'height: ' + imgH + 'px;'

        if (index == 0) {
          if (mNum > 0) {
            styleStr += 'margin-left: ' + mNum + 'vw;'
          }
        } else if (index == this.moduleData.rows.length - 1) {
          if (mNum > 0) {
            styleStr += 'margin-right: ' + mNum + 'vw;'
          }
        }

        return styleStr;
      }
    },
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  .product-list-hscroll {
    .content {
      .items-row {
        overflow-x auto;
        overflow-y hidden;
        font-size 0px;
        white-space nowrap;

        .item {
          display inline-block;
          overflow hidden;

          .content-div {
            overflow hidden;
            background-color white;
            border-radius 5px;

            img {
              overflow hidden;
              display block;
              width 100%;
              height 100%;
            }

            .h-price {
              text-align center;
            }
          }

          /*position relative;
          flex 1;
          text-align center;
          font-size 0px;
          img {
            width 23px;
            height 23px;
          }
          .text {
            margin-top 8px;
            font-size 13px;
            color #333;
          }
          .count {
            position absolute;
            right 20px;
            margin-right -10px;
            top -5px;
            z-index 1;
            padding 2px 5px;
            border-radius 10px;
            font-size 12px;
          }*/
        }
      }
    }
  }
</style>
