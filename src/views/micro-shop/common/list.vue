
<template>
  <div class="skulist" :style="{height: `${styleObj.isHeight}%`}">
    <div class="row-botton" v-if="screenArr.length && styleObj.url !='/app/json/app_distribution_order/getMicroStorePros'">
      <fitrateRow :screenArr="screenArr" @setData="setData"/>
    </div>
    <scroll @scroll="scrollHandler"
            :hasMore="isCanLoadMore"
            :pullUpLoad="true"
            :listenScroll="true"
            @pullingUp="_loadProList"
            :data="array"
            :startY='scrollTopValue'
            :probeType="2"
            v-if="array.length && styleObj.url !='/app/json/app_distribution_order/getMicroStorePros'">
    <CardList @productEvent="productEvent"
              @addToCart="addToCart"
              :listData="array"
              v-if="styleObj.listStyle" />
    <DetailList @productEvent="productEvent"
                @addToCart="addToCart"
                @upperShelf='upperShelf'
                @addShopping='addShopping'
                @deleteShare='deleteShare'
                @addshare='addshare'
                :listData="array"
                :styleObj='styleObj'
                :params='paramsNew'
                v-if="!styleObj.listStyle" />
    </scroll>
    <div v-if="styleObj.url =='/app/json/app_distribution_order/getMicroStorePros'">
      <div class="list" :style="{height: `${styleObj.isHeight}%`}">
        <DetailList @productEvent="productEvent"
                    @addToCart="addToCart"
                    @upperShelf='upperShelf'
                    @addShopping='addShopping'
                    @deleteShare='deleteShare'
                    @addshare='addshare'
                    :listData="array"
                    :styleObj='styleObj'
                    :params='paramsNew'
                    v-if="!styleObj.listStyle" />
      </div>
      <div v-if="array.length" style="text-align: center;color: #999;margin: 10px;">没有更多数据了～</div>
    </div>
    <!-- <div class="no-data theme_font_tint" v-if="array.length && !hasMore">没有更多数据了~</div> -->
    <div class="no-list" v-if="!array.length">
      <div class="img-div">
        <img src="static/image/mall2/no-data-img.png">
      </div>
      <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fitrateRow from "./fitrateRow.vue";
import eventBus from '@/utils/eventBus.js'
import Scroll from '@/components/base/scroll/scroll'
import CardList from './base/card-list'
import DetailList from './base/detail-list'

export default {
  name: "list",
  props: {
    params: Object,
    styleObj: {
      type: Object,
      required: false,
      default: function() {
        return {
          listStyle: true,
          rowStyle: true,
          isScreen: true,
          isHeight: "100"
        };
      }
    },
    screenArr: {
      type: Array,
      required: false,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters(["getPutaggregate","getGlobalConfig"])
  },
  data() {
    return {
      paramsNew: {},
      loading: false,
      hasMore: true,
      array: [],
      hiddenSkuId: '',
      scrollTopValue: 0,
      isCanLoadMore: true,// 是否可以上拉加载更多
      listStyle: 2
    };
  },
  // getPutaggregate.empFlag == 0 && getGlobalConfig.microshop_open == 1
  watch: {
    params: {
      handler: function(newVal) {
          console.log(newVal)
        if (newVal) {
          (this.paramsNew = Object.assign( {}, {storeCode: newVal.storeCode || this.getPutaggregate.storeCode, userId: newVal.userId || this.getPutaggregate.userId},newVal)),(this.paramsNew.page = 0);
          this.array = [];
          this.isCanLoadMore = true;
          if (this.styleObj.url == '/app/json/micro_store_front_end/getProSkuListToAddMicroStore'){
            if (newVal.ouCode != '') {
              this._loadProList();
            }
          } else {
            this._loadProList();
          }
        }
      },
      deep: true,
      immediate: true
    },
    "params.queryType": {
      handler: function(val) {
        this.paramsNew.page = 1;
        this.array = [];
      },
      immediate: true
    }
  },
  activated(){
    this.array.forEach((item,index)=>{
      if(item.id == this.hiddenSkuId){
        this.$set(item, 'hidden', '1')
      }
    })
  },
  mounted() {
    eventBus.$on('setlistData', (res) => {
     this.hiddenSkuId = res
    })
  },
  methods: {
    productEvent(item) {
      this.$emit("productEvent", item);
    },
    setScrollTopValue (value) {
      this.scrollEl.scrollTop = value;
    },
    getScrollTopValue(){
      this.scrollEl = this.$refs.list;
      this.scrollEl.addEventListener('scroll', e=>{
        this.scrollTopValue = e.target.scrollTop
      });
    },
    scrollHandler(y){
      this.scrollTopValue = y.y
    },
    addToCart(item) {
      if(Object.keys(item).length != 0){
        this.$emit("addToCart", item);
      }
    },
    addShopping(item) {
      this.$emit("addShopping", item);
    },
    addshare(item) {
      this.$emit("addshare", item);
    },
    upperShelf(item) {
      this.$emit("upperShelf", item);
    },
    deleteShare(item) {
      this.$emit("deleteShare", item);
    },
    setData(item) {
      this.$emit("setDatalist");
      this.paramsNew.page = 0;
      Object.assign(this.paramsNew, item);
      this.array = [];
      this.isCanLoadMore = true;
      this._loadProList();
    },
    _loadProList(status) {
      if (status) {
        this.paramsNew.page = 0;
        this.array = [];
      }
      if(this.styleObj.url =='/app/json/app_distribution_order/getMicroStorePros' && this.$store.state.mall2.staticDeliverType ==1){
        let zitiad = this.$store.state.mall2.zitiAddress;
        this.paramsNew.pickUpId = zitiad.id
      }
      // 获取商品列表
      this.$Loading.open();
      this.paramsNew.page++;
      this.$http.post(this.styleObj.url, this.paramsNew).then(res => {
        this.$Loading.close();
        if (res.data.status == 0) {
          if (this.styleObj.isObject == 1) {
            let data = res.data.data || {};
            data.dpedData = {}
            data.dpedData = this.$mallCommon.priceFromItem(data)
            this.array = this.array.concat(data.retDatas || []);
          } else if(this.styleObj.isObject == 2) {
            let data = res.data.data[0].retDatas || [];
            this.array = this.array.concat(data || []);
          } else {
            let data = res.data.data || [];
            this.array = this.array.concat(data || []);
          }
          this.array.forEach(res => {
            if (this.styleObj.url == '/app/json/app_distribution_order/getMicroStorePros' || this.styleObj.url == '/app/json/app_distribution_order/getHotSaleList') {
              res.salePrice = res.activityPrice
            }
            res.picMainUrl = res.mainMobilePicUrl || res.picMainUrl;
          })
          this.$emit("listData", res.data);
          let totalRecords = 0
          console.log(res.data.totalRecords,this.array.length)
          totalRecords = Number(res.data.totalRecords == '' ? 0 : res.data.totalRecords)
          if (this.array.length >= totalRecords) {
            this.isCanLoadMore = false;
            this.hasMore = false
          }else{
            this.$emit("listStatus");
          }
        } else {
          this.$Toast(res.data.info);
        }
        this.$emit("refresh");
      });
    },
    getListImgStr: function(item) {
      let level = this.$market.getMemberLevelIndex(item.userLevel);
      return "static/image/mall2/level/" + level + ".png";
    },
    deliverTypeArr(type) {
      let arr = [];
      if (type == 1) {
        arr.push({ name: "自提" });
      } else if (type == 2) {
        arr.push({ name: "配送" });
      } else if (type == 12) {
        arr.push({ name: "自提" }, { name: "配送" });
      }
      return arr;
    },
    setItem(item) {
      this.array.forEach((res, index) => {
        if (item.id == res.id) {
          this.$set(res, "hidden", '1');
        }
      });
    }
  },
  components: {
    fitrateRow,
    Scroll,
    CardList,
    DetailList
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.skulist {
  .row-botton {
    padding: 5px 15px;
    .type-btn {
      font-size: $font-size-medium;
      padding: 4px 10px;
      border-radius: 15px;
      border: 0.6px solid transparent;

      .icon-size {
        font-size: $font-size-medium;
      }
    }

    .space {
      flex: 1;
    }

    .local-div {
      max-width: 180px;
      display: flex;
      align-items: center;
      font-size: $font-size-medium-s;

      .icon-size {
        font-size: $font-size-medium;
      }

      span {
        padding: 2px;
      }
    }

    &.row-filter {
      justify-content: space-around;
    }
  }
}

.list {
  .list-wrapper {
    background none;
  }
  .list-content {
    display: flex;
    flex-wrap: wrap;

    .card {
      width: 50%;
      display: flex;
      padding: 4px;
      height: 100%;
      .card-content {
        width: 100%;
        height: 100%;
        padding: 8px;
        border-radius: 6px;
        width: 100%;
        height: 100%;

        .img-div {
          width: 160px;
          height: 160px;

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

        .info-row {
          color: #999;

          .jia-copy {
            height: 30px;
          }

          .price-content {
            padding: 4px 0;
          }

          .price-x {
            i {
              font-size: 14px;
              font-style: normal;
            }
          }

          .typeText {
            color: #d8a21b;
            padding: 2px 10px;
            font-size: 12px;
            border-radius: 10px;
            border-width: 0.8px;
            border-style: solid;
            margin-right: 4px;
          }

          .car-size {
            // font-size: 20px;
            float: right;
          }
        }

        .activity {
          display: flex;
          align-items: center;
          height: 32px;

          .act-item {
            padding: 2px 6px;
            font-size: 10px;
            border-radius: 10px;
            border-width: 0.8px;
            border-style: solid;
            margin-right: 4px;
          }
        }
      }
    }

    .row {
      // margin-top: 8px;
      margin: 4px 4px 4px;
      padding: 2px 10px;
      overflow: hidden;
      border-radius: 6px;
      background-color: #fff;
      width: 100%;
      position: relative;
      .activityListNulll{
        color: #999;
        height 60px
        width 100%
        display flex
        flex-direction column
        justify-content center
        .activityListNulllItem{
          margin-top 6px
          .price-x{
            i {
              font-size: 14px;
              font-style: normal;
            }
          }
          .car-size {
            float: right;
          }
        }
      }
      .edit-btn {
        float: left;
        height: 120px;
        margin-left: -10px;
        padding: 50px 10px;

        i {
          font-size: 18px;
        }
      }

      .img-div {
        float: left;
        position: relative;
        width: 120px;
        height: 120px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }

      .info-div {
        padding-left: 10px;
        overflow: hidden;
        .title {
          padding: 1px 0;
          margin: 14px 0;
          font-size: $font-size-medium;
          line-height: 16px;
          height: 32px;
        }

        .info-row {
          color: #999;
          padding: 9px 0 5px;

          .price-x {
            i {
              font-size: 14px;
              font-style: normal;
            }
          }

          .typeText {
            color: #d8a21b;
            padding: 2px 10px;
            font-size: 12px;
            border-radius: 10px;
            border-width: 0.8px;
            border-style: solid;
            margin-right: 4px;
          }

          .car-size {
            // font-size: 20px;
            float: right;
            margin-right: 10px;
          }
        }

        .activity {
          display: flex;
          align-items: center;
          height: 32px;
          padding: 5px 0 0px;

          .act-item {
            padding: 2px 8px;
            font-size: 10px;
            border-radius: 10px;
            border-width: 0.8px;
            border-style: solid;
            margin-right: 4px;
          }
        }
      }
    }

    .list-pull-to {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 10px;
    }
  }

  .no-data {
    padding: 15px;
    text-align: center;
  }
}

.row-dianpu {
  margin-top: 16px;

  .price {
    font-size: 16px;
    font-style: normal;
  }

  .shop-activity {
    position: relative;

    .shop {
      width: 16px;
      height: 16px;
      position: absolute;
      right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.commodity {
  margin-top: 10px;

  .price {
    font-size: 14px;
  }

  .commodity-price {
    font-size: 18px;
  }

  .commodity-stock {
    color: #999;
  }

  .commodity-recommend {
    margin-left: 4px;
  }
}

.used {
  position: absolute;
  right: -14px;
  top: 16%;
  transform: translateY(-50%);

  .used-img {
    width: 60px;
  }
}

.title {
  width: 72%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mallDui{
  color: #d8a21b
}
.search-div {
  position absolute;
  display flex;
  align-items center;

  .icon-font {
    font-size $font-size-medium;
  }
}
  .no-list {
    .img-div {
      margin-top: 20px;
      text-align: center;

      img {
        width: 160px;
      }
    }

    .tip {
      margin-top: 10px;
      padding: 10px;
      font-size: 12px;
      text-align: center;
    }
  }
</style>
