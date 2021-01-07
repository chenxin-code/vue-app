/**Created by liaoyingchao on 2018/11/6.*/

<template>
  <div class="index mall2">
    <nav-top @backEvent="goBack"></nav-top>
    <nav-content>
      <div
        class="scroll-div"
        ref="listDiv"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="80"
      >
        <div class="block-div" v-for="order in currentList">
          <div class="pro-row">
            <div class="img-div">
              <img :src="order.phPictureUrl" />
            </div>
            <div class="info-div">
              <div class="title theme_font_common">{{order.skuName}}</div>
              <div
                class="row-btn line_circle theme_standard_font theme_standard_bdr"
                @click="toComment(order)"
                v-if="order.itemCanEvaluate"
              >评价</div>
              <!--<div class="event-btn theme_font_red theme_border_red" v-if="tabSelected ==2" @click="addComment(order)">追加评价</div>-->
              <div
                class="event-btn theme_font_gray theme_border_gray"
                v-if="!order.itemCanEvaluate"
                @click="commentDetail(order)"
              >查看评价</div>
              <div class="font-small theme_font_gray top-margin">数量：{{order.number}}</div>
            </div>
          </div>
        </div>
        <div class="show-loading theme_font_tint" v-show="showLoading">loading...</div>
        <div class="show-loading theme_font_tint" v-if="noMore">我是有底线的</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      currentList: [],
      showLoading: false,
      noMore: false
    }
  },
  methods: {
    toComment(order) {
      console.log(order, 'order')
      this.$router.push({
        path: '/mall2/comment',
        query: {
          skuId: order.skuId,
          orderId: order.shoppingOrderItemId,
          phPictureUrl: order.phPictureUrl,
          skuName: order.skuName,
        }
      })
    },
    commentDetail: function(item) {
      // console.log(item, 'commentDetail2')
      this.$router.push({
        name: '评价详情',
        params: {
          data: item.proSkuEvaluateModel
        }
      })
      // this.$router.push({
      //   path: '/mall2/commentcenter',
      // })
    },
    loadMore: function() {},
    goBack() {
      this.$store.state.mall2.order.backIndex = 3;
      this.$router.go(-1);
    }
  },
  created() {
    // console.log(JSON.parse(this.$route.query.itemList), 'query')
    // this.currentList = [...JSON.parse(this.$route.query.itemList)]
    // console.log(this.orderListWritesInfo, 'orderListWritesInfo')
    let url = '/app/json/evaluate/getOrderCommentsList'
    this.$Loading.open()
    this.$http.post(url, { orderId: this.$route.query.orderId }).then(
      res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.currentList = data.data
        } else {
          this.$Toast(data.info)
        }
      },
      error => {
        this.$Loading.close()
        this.$Toast('请求数据失败！')
      }
    )
  },
  activated() {},
  beforeRouteLeave(to, from, next) {
    this.$keepaliveHelper.deleteCache(this)
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.index {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .scroll-div {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 30px;
    bottom: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .show-loading {
      text-align: center;
      font-size: 14px;
      padding: 10px;
    }

    .top-margin {
      margin-top: 8px;
    }

    .block-div:nth-child(1) {
      margin-top: 4px;
    }

    .event-btn {
      margin-top: 6px;
      margin-left: 8px;
      line-height: $font-size-medium;
      font-size: $font-size-medium;
      padding: 6px 10px;
      border-radius: 16px;
      border-width: 0.5px;
      border-style: solid;
      float: right;
    }

    .img-div {
      width: 70px;
      height: 70px;
    }
  }

  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }
}
</style>
