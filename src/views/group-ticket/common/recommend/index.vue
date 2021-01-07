<template>
  <div class="box">
    <!--商品-->
    <div class="pro-list-wrapper">
      <div class="title">
        <span>更多可用券商品</span>
        <span class="more" @click="lookAll" style="color: #f80f16">查看全部</span>
      </div>
    </div>
    <div class="recommend-div">
      <div class="pro-div" v-for="(item,index) in recommendArr" :key="index">
        <div class="img-div">
          <img :src="item.phMainUrl" />
        </div>
        <div class="title single-line theme_font_black">{{item.skuName}}</div>
        <div class="price single-line">
          <PriceOrder :listitem="item"></PriceOrder>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PriceOrder from '@/components/commonui/price/price-order'
export default {
  props:['couTypeCode'],
  data() {
    return {
      recommendArr: []
    };
  },
  components: {
    PriceOrder
  },
  mounted() {
    let params = {
      token: this.$store.state.login.token,
      page: 1,
      rows: 3,
      couTypeCode: this.couTypeCode,
      deliverType: 2
    };
    this.$http.post("/app/json/product/getAppProSearchList", params).then(res => {
      let data = res.data;
      if (data.status == 0) {
        let arr = data.data.list
        arr.map(item => {
          item.dpedData = this.$mallCommon.priceFromItem(item)
          item.linePrice = this.$util.toDecimal2(item.dpedData.linePrice)
          return item
        })
        this.recommendArr = arr
      } else {
        this.$Toast(data.info);
      }
    })
  },
  methods: {
    lookAll(){
      this.$router.push({
        path:'/group_ticket/recommend/list',
        query:{ couTypeCode: this.couTypeCode }
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
  overflow: hidden;

  .pro-list-wrapper {
    padding: 10px;

    .title {
      padding-top: 5px;
      display: flex;
      justify-content: space-between;

      .more {
        font-size: 12px;
      }
    }
  }

  .recommend-div {
    padding: 2px;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    display: flex;
    justify-content: center;

    .pro-div {
      flex: 1;
      display: inline-block;
      padding: 6px;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 8px #efefef;

      &:nth-child(2) {
        margin: 0 10px;
      }

      .img-div {
        position: relative;
        width: 100%;
        height: 0px;
        padding-bottom: 100%;

        img {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }

      .title {
        margin-top: 8px;
        font-size: $font-size-medium-s;
      }

      .price {
        margin-top: 4px;
      }
    }
  }
}
</style>
