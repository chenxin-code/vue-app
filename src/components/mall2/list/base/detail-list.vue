/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="detail-list">
    <div class="row theme_bg_white" v-for="(item, idx) in listData" @click="productEvent(item)">
      {{dataProcessing(item)}}
      <div class="edit-btn" v-if="showEdit == true" @click.stop="itemSelect(item, idx)">
        <i class="iconfont mall-xuanzhong theme_font_red" v-if="item.selected == true"></i>
        <i class="iconfont mall-weixuanzhong theme_font_gray" v-if="item.selected != true"></i>
      </div>
      <div class="img-div">
        <img v-lazy="item.phMainUrl">
        <div class="presale" v-if="item.supportPreSale == 1">预售</div>
      </div>
      <div class="info-div">
        <div class="title theme_font_black double-line" v-html="getSkuNameStr(item)"></div>
        <div class="info-row activity">
          <div class="act-item theme_font_red theme_border_red theme_bg_ml_red" v-for="(activity, aidx) in item.showActivities" v-if="aidx < 4">{{activity}}</div>
          <div class="act-item theme_font_red theme_border_red theme_bg_ml_red" v-if="item.hasCou == 1">券</div>
        </div>
        <div class="info-row price">
          <PriceOrder :listitem="item"></PriceOrder>

        </div>
        <div class="info-row num-info">
          <span class="font-small theme_font_tint" v-if="showSales">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
          <span class="font-small theme_font_tint" v-if="showComments">评价：{{item.commentsNum != '' ? item.commentsNum : '0'}}</span>
          <div class="car-c" v-if="item.productType != 2">
            <i
              class="iconfont mall-gouwuche theme_font_red car-size"
              :class="{'theme_font_gray_i': item.stockNum == '' || item.stockNum == '0' || item.stockNum == null}"
              @click.stop="addToCart(item)"
              v-if="$route.query.entryType !== 'wish'"
              v-show="!hiddenCar"></i>
            <div v-else>
              <div v-if="item.productType == 1 && item.deliverType == 2" :class="{'is-add-wish': item.isAddWishOrder}" class="wish-icon-c" @click.stop="addToWishList(item, $event)">
                <img src="../../wish-list/images/wish-icon-no.png" alt="" class="wish-icon">
                <img src="../../wish-list/images/wish-icon.png" alt="" class="wish-icon">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueLazyLoad from 'vue-lazyload'
  import PriceOrder from  '@/components/commonui/price/price-order'

  export default {
    name: "detail-list",
    props: {
      listData: Array,
      hiddenCar:Boolean,
      showEdit: Boolean
    },
    components: {
      PriceOrder
    },
    data() {
      return {
      }
    },
    computed: {
      showSales() {
        return this.$store.state.globalConfig.app_prolist_sales_hide != 1
      },
      showComments() {
        return this.$store.state.globalConfig.app_prolist_comments_hide != 1
      }
    },
    methods: {
      getSkuNameStr: function (item) {
        let skuName = item.skuName
        if (item.interfaceType == '2') {
          let name = this.$store.state.globalConfig.interface_type_name_1 || '京东'
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${name}</span>` + skuName
        } else if (item.interfaceType == '1') {
          let name = this.$store.state.globalConfig.interface_type_name_2 || '有路'
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${name}</span>` + skuName
        }
        return skuName
      },
      itemSelect: function (item, idx) {
        item.selected = !item.selected;
        this.listData.splice(idx, 1, item)
        this.$emit('selectedItemEvent', item)
      },
      getShowPrice:function(item){

        if(item.activityPrice == 0 || item.activityPrice == ''){
          return false;
        }else {
          return true;
        }
      },
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
        // 展示活动
        let showActivities = [];
        if (item.activityTypes) {
          for (let i = 0; i < item.activityTypes.length; i++) {
            let text = item.activityTypes[i]
            let activityTag = item.activityTags.length > i? item.activityTags[i]:'';
            if (!~showActivities.indexOf(text) && activityTag.indexOf('不显示') == -1) {
              showActivities.push(text)
            }
          }
        }
        item.showActivities = showActivities;
      },
      productEvent: function (item) {
        this.$emit('productEvent', item)
      },
      addToCart: function (item) {
        if (item.stockNum != '' && item.stockNum <= 0 ) {
          this.$Toast('商品缺货！');
          return
        }
        this.$emit('addToCart', item)
      },
      addToWishList(item, event) {
        this.$Loading.open();
        this.$http.post('/app/json/wish_order/addWishOrder', {
          skuId: item.skuId,
          storeOuCode: item.storeOuCode
        }).then(res => {
          let data = res.data;
          if (data.status == 0) {
            event.target.classList.toggle('is-add-wish')
            if (data.data == 1) {
              this.$Toast('已将宝贝添加至心愿单啦~');
            } else {
              this.$Toast('已将宝贝移除心愿单~');
            }
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
        }).catch(err => {
          this.$Toast(err);
          this.$Loading.close();
        })
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .detail-list {
    padding 0 8px;
    overflow hidden

    .row {
      margin-top 8px;
      padding 8px;
      overflow hidden;
      border-radius 6px;

      .edit-btn {
        float left;
        height 120px;
        margin-left -10px;
        padding 50px 10px;
        i {
          font-size 18px;
        }
      }
      .img-div {
        float left;
        position relative;
        width 120px;
        height 120px;
        img {
          display block;
          width 100%;
          height 100%;
        }
        .presale {
          position absolute;
          left 0;
          bottom 0;
          border-radius 0 15px 0 0;
          background: linear-gradient(90deg, #F8089F, #F80E26);
          font-size 14px;
          font-weight 500;
          color white;
          padding 5px 12px;
          z-index 2;
        }
      }
      .info-div {
        padding 0 10px;
        overflow hidden;

        .title {
          padding 1px 0;
          margin 5px 0;
          font-size $font-size-medium;
          line-height 18px;
          height 36px;
        }
        .info-row {
          padding 9px 0 5px;
        }
        .activity {
          display flex;
          align-items center;
          height 22px;
          padding 5px 0 0px;
          .act-item {
            padding 2px 8px;
            font-size 10px;
            border-radius 10px;
            border-width 0.5px
            border-style solid
            margin-right 4px;
          }
        }
        .num-info {
          padding-top 8px;
          padding-bottom 0;
          .car-c {
            float right;
            margin-top -3px;
            margin-right -8px;
          }
          .car-size {
            padding 7px 11px;
            font-size 18px;
          }
          span:nth-child(2) {
            margin-left 10px;
          }
          .wish-icon-c {
            extend-click();
            .wish-icon {
              width 20px;
              height 20px;
              border-radius 50%
              &:last-child {
                display none;
              }
            }
            &.is-add-wish {
              .wish-icon {
                display none;
              }
              .wish-icon:last-child {
                display inline-block
              }
            }
          }
        }
      }
    }
  }
</style>
