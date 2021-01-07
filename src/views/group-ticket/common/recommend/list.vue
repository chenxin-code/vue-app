<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <scroll
      :hasMore="isCanLoadMore"
      :pullUpLoad="true"
      @pullingUp="listData"
      :listenScroll="true"
      :data="recommendArr"
      :probeType="2"
      v-if="recommendArr.length" >
    <div class="left-div">
      <div class="card" v-for="(item, index) in leftArray" :key="index">
        <div class="card-content theme_bg_white">
          <div class="img-div">
            <img v-lazy="item.phMainUrl">
          </div>
          <div class="title theme_font_black single-line" v-html="item.skuName"></div>
          <div class="info-row">
            <PriceOrder :listitem="item"></PriceOrder>
          </div>
        </div>
      </div>
    </div>
    <div class="right-div">
      <div class="card" v-for="(item, index) in leftArray" :key="index">
        <div class="card-content theme_bg_white">
          <div class="img-div">
            <img v-lazy="item.phMainUrl">
          </div>
          <div class="title theme_font_black single-line" v-html="item.skuName"></div>
          <div class="info-row">
            <PriceOrder :listitem="item"></PriceOrder>
          </div>
        </div>
      </div>
    </div>
    </scroll>
    <div class="no-list" v-if="!recommendArr.length">
      <div class="img-div">
        <img src="static/image/mall2/no-data-img.png" />
      </div>
      <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
    </div>
  </div>
</template>

<script>
import PriceOrder from "@/components/commonui/price/price-order";
import Scroll from "@/components/base/scroll/scroll";
export default {
  data() {
    return {
      page: 0,
      isCanLoadMore: true,
      couTypeCode: "",
      recommendArr: [],
      rightArray: [],
      leftArray: []
    };
  },
  components: {
    PriceOrder,
    Scroll
  },
  mounted() {
    this.couTypeCode = this.$route.query.couTypeCode || "";
    this.listData();
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    listData() {
      this.$Loading.open();
      this.page++;
      let params = {
        token: this.$store.state.login.token,
        page: this.page,
        rows: 20,
        couTypeCode: this.couTypeCode,
        deliverType: 2
      };
      this.$http.post("/app/json/product/getAppProSearchList", params).then(res => {
        let data = res.data;
        if (data.status == 0) {
          let arr = data.data.list;
          arr.map(item => {
            item.dpedData = this.$mallCommon.priceFromItem(item);
            item.linePrice = this.$util.toDecimal2(item.dpedData.linePrice);
            return item;
          });
          this.recommendArr = this.recommendArr.concat(arr);
          let rightArr = [];
          let leftArr = [];
          for (let i = 0; i < this.recommendArr.length; i++) {
            let item = this.recommendArr[i]
            if (i % 2) {
              rightArr.push(item);
            } else {
              leftArr.push(item)
            }
          }
          this.rightArray = rightArr;
          this.leftArray = leftArr;
          if (arr.length < 20) {  // TUDO 此处有BUG（之前逻辑如此--领券中心）接口咩有返回totalRecords 否则放开下面代码即可
            this.isCanLoadMore = false;
          } else {
            this.isCanLoadMore = true;
          }
          // if (this.recommendArr.length >= Number(res.data.totalRecords)) {
          //   this.isCanLoadMore = false;
          // }
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      })
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: relative;
  width: 100%;
  height 100%
  padding 0 3px
  overflow: hidden;
  background: url('../../../../../static/image/microShop/list-bg.png') repeat center center / 100% 100%;

    .left-div {
      float left;
      width 50%;
    }
    .right-div {
      overflow hidden
      width 50%;
    }
    .card {
      width 100%;
      padding 4px;
      .card-content {
        padding 0px 0 8px;
        overflow hidden;
        border-radius 6px;
        .img-div {
          position relative;
          width 100%;
          height 0px;
          padding-bottom 100%;
          img {
            position absolute;
            width 100%;
            height 100%;
          }
        }
        .title {
          padding 1px 8px;
          margin 5px 0;
          font-size $font-size-medium;
          line-height 16px;
          height 16px;
        }
        .info-row {
          font-size $font-size-medium;
          padding 4px 8px;

          .font-small {
            font-size 10px;
          }
        }
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
}
.list-wrapper{
  background: none
}
</style>
