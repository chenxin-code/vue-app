
<template>
  <div class="body">
    <p class="titer">热卖推荐</p>
    <div class="person-wrap" ref="personWrap">
      <ul class="person-list" ref="personTab" style="width: 20rem">
        <li class="card"
            v-for="(item, index) in array"
            @click="productEvent(item)"
            :key="`card${index}`">
          <div class="card-content theme_bg_white">
            <div class="img-div">
              <img v-lazy="item.mainMobilePicUrl">
            </div>
            <div class="title theme_font_black single-line">{{item.skuName}}</div>
            <div class="row-dianpu" v-if="!item.groupFlag">
              <div class="info-row">
                <div class="price-content">
                    <span class="font-small theme_font_tint left-m-2 line-through" >
                    ￥{{item.activityPrice}}
                  </span>
                </div>
              </div>

              <div class="info-row activity">
                <div class="activity-left">
                  <span class="profitstyle">
                    <span class="price-x theme_font_red">￥</span> <span class="price-z theme_font_red">{{getInteger(item.activityPrice)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.activityPrice)}}</span>
                 </span>
                </div>
                <div class="activity-right theme_standard_font_i" @click.stop="addShopping(item)">
                  <i class="iconfont mall-gouwuche theme_font_red car-size"></i>
                </div>
              </div>
            </div>
            <div class="row-dianpu" v-if="item.groupFlag">
              <div class="info-row">
                <div class="price-content">
                  <span>
                    <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMin)}}</span><span class="price-x theme_font_red" >.{{getDecimals(item.salePriceMin)}}</span>
                    <span class="price-x theme_font_red">~</span>&nbsp;
                    <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMax)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePriceMax)}}</span>
                  </span>
                </div>
              </div>
              <div class="info-row activity">
                <div class="activity-left">
                  <div class="font-small theme_font_tint">
                    起购数量：{{item.minPurNumber || 0}}
                  </div>
                </div>
                <div class="activity-right theme_standard_font_i" @click.stop="addShopping(item)">
                  <i class="iconfont mall-gouwuche theme_font_red car-size"></i>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li class="liText">
          <span class="text">{{recommendNums>6?'加载更多数据~':'没有更多数据了~'}}</span>
        </li>
      </ul>
      <!-- <div>
        <span class="text">加载中...</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "best-sellers",
  props: {
    params: {
      type: Object,
      required: false,
      default: function() {
        return {
          groupFlag: 0,
          storeCode: '',
          arr: [],
          recommendNums: ''
        };
      }
    },
    startX: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      scroll: null,
      array: [],
      recommendNums: ''
    };
  },
  watch: {
    params: {
      handler: function(val) {
        if (val) {
          this.array = val.arr;
          this.$nextTick(() => {
            this.personScroll();
          });
          this.recommendNums = val.recommendNums
        }
      },
      immediate: true,
      deep: true
    }
  },
  destroyed() {
    this.destroy()
  },
  methods: {
    getInteger: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[0]
    },
    getDecimals: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[1]
    },
    personScroll(x=0) {
      // let width = this.array.length * 140;
      // this.$refs.personTab.style.width = width/12 + "rem";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.personWrap, {
            startX: x,
            scrollX: true,
            scrollY: false,
            pullUpLoad: true,
            eventPassthrough: "vertical"
          });
          this.scroll.on('scrollEnd', (pos) => {
            if(pos.x<=-354){
              setTimeout(res=>{
                this.$router.push({
                  path: "/micro_sho/best_sellers_list",
                  query: {storeCode: this.params.storeCode,groupFlag: this.params.groupFlag}
                });
              },100)
            }
          })
        } else {
          this.scroll = new BScroll(this.$refs.personWrap, {
            startX: x,
            scrollX: true,
            scrollY: false,
            pullUpLoad: true,
            eventPassthrough: "vertical"
          });
          this.scroll.refresh();
        }
      })
    },
    destroy() {
      this.scroll.destroy()
    },
    productEvent(item) {
      this.$emit("productEvent", item);
    },
    addShopping(item) {
      let obj = item
      obj.picMainUrl = obj.mainMobilePicUrl
      this.$emit('addShopping', obj)
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import "~@/common/stylus/mixin.styl"
@import "./css/price.styl"

.body {
  height: 100%;
  width: 100%;
  padding 4px 0
  overflow hidden
  .titer {
    padding: 0 22px 4px;
    color: #000;
  }
  .person-wrap{
    height: 100%;
    width: 100%;
    white-space: nowrap;
    overflow hidden
    .person-list{
      height: 100%;
      li{
        display inline-block
      }
      .liText{
        margin-left 10px
        color #656060
        .text{
          writing-mode:tb-rl
          letter-spacing:6px
        }
      }
      .card {
        width: 120px;
        height 92%
        margin 0 3px
        .card-content {
          padding: 8px 6px;
          border-radius: 6px;
          width: 100%;
          height: 100%;
          .img-div {
            width: 92%;
            height: 100px;
            margin 0 auto
            img {
              width: 100%;
              height: 100%;
              border-radius: 6px;
            }
          }
          .title {
            margin: 5px 0;
            font-size: $font-size-medium;
            line-height: 16px;
            height: 16px;
          }
          .row-dianpu {
            .price {
              font-size: 16px;
              font-style: normal;
            }

            .activity {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top 4px

              .activity-left {
                width: 140px;
                display: flex;
                flex-wrap: wrap;

                .act-item {
                  margin: 2px;
                  padding: 2px 6px;
                  font-size: 10px;
                  border-radius: 10px;
                  border-width: 0.8px;
                  border-style: solid;
                  margin-right: 4px;
                }
              }

              .activity-right {
                width: 16px;
                height: 16px;

                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

