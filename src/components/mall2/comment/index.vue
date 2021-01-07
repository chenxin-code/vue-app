/**Created by liaoyingchao on 2018/11/26.*/

<template>
  <div class="index mall2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="tabs tabs-padding-space">
        <div class="tab-item" v-for="item in tabs" @click="tabEvent(item.tag)">
          <div class="text theme_font_black" :class="{'selected-btn': tabSelected == item.tag}">{{item.text}}</div>
        </div>
      </div>
      <div class="scroll-div" ref="listDiv" v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="80">
        <div class="block-div" v-for="order in currentList">
          <div style="line-hegiht:30px;margin:10px 0">{{order.storeName}}</div>
          <div class="pro-row">
            <div class="img-div">
              <img :src="order.phPictureUrl" v-if="tabSelected == 1">
              <img :src="order.skuImage" v-if="tabSelected == 2">
            </div>
            <div class="info-div">
              <div class="title theme_font_common">{{order.skuName}}</div>
              <div class="row-btn line_circle theme_standard_font theme_standard_bdr" v-if="tabSelected ==1" @click="toComment(order)">评价</div>
              <!--<div class="event-btn theme_font_red theme_border_red" v-if="tabSelected ==2" @click="addComment(order)">追加评价</div>-->
              <div class="event-btn theme_font_gray theme_border_gray" v-if="tabSelected ==2" @click="commentDetail(order)">查看评价</div>
              <div class="font-small theme_font_gray top-margin">数量：{{order.number}}</div>
            </div>
          </div>
        </div>
        <div class="show-loading theme_font_tint" v-show="showLoading">loading...</div>
        <div class="show-loading theme_font_tint" v-if="noMore">我是有底线的</div>
      </div>
      <div class="no-data-div" v-if="currentList.length == 0 && pageShow">
        <div class="no-data-img">
          <img src="static/image/mall2/no-order.png"/>
        </div>
        <div class="recommend-div">
          <Recommend></Recommend>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Recommend from '../list/recommend/index'

  export default {
    name: "index",
    components: {
      Recommend
    },
    data() {
      return {
        tabs: [{
          text: '待评价',
          tag: '1'
        }, {
          text: '已评价',
          tag: '2'
        }],
        tabSelected: '1',
        scrollValue: 0,
        loading: true,
        showLoading: false,
        noMore: false,
        currentList: [],
        pageShow: false
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
        this.$keepaliveHelper.deleteCache(this)
      },
      commentDetail: function (item) {
        this.$router.push({
          name: '评价详情',
          params: {
            data: item
          }
        })
      },
      addComment: function (item) {
        this.$Toast('暂不支持！')
      },
      toComment: function (item) {
        this.$router.push({
          name: '评价晒单',
          params: {
            data: item
          }
        })
      },
      loadMore: function () {

      },
      tabEvent: function (tag) {
        this.tabSelected = tag;
        this._getComments()
      },
      _getComments: function () {

        let url = ''
        this.currentList = []
        this.pageShow = false
        // let page = 1
        if (this.tabSelected == 1) {
          url = '/app/json/evaluate/getNotCommentsList'
        } else {
          url = '/app/json/evaluate/getCommentsList'
        }
        let params1 = {
          token: this.$store.state.login.token,
          // page: {
          //   index: page,
          //   pageSize: 10
          // }
        }
        this.$Loading.open()
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.currentList = data.data
            this.pageShow = true
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        });
      }
    },
    created() {
    },
    activated () {
      this.tabEvent(this.tabSelected)
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    width 100%
    height 100%
    overflow hidden
    .tabs-padding-space {
      padding 0 30px;
    }
    .scroll-div {
      position absolute;
      left 0px;
      right 0px;
      top 30px;
      bottom 0px;
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
      .show-loading {
        text-align center;
        font-size 14px;
        padding 10px;
      }
      .top-margin {
        margin-top 8px;
      }
      .block-div:nth-child(1) {
        margin-top 4px;
      }
      .event-btn {
        margin-top 6px;
        margin-left 8px;
        line-height $font-size-medium;
        font-size $font-size-medium;
        padding 6px 10px;
        border-radius 16px;
        border-width 0.5px
        border-style solid
        float right;
      }
      .img-div {
        width 70px;
        height 70px;
      }
    }
    .no-data-div {
      position absolute;
      left 0px;
      right 0px;
      top 30px;
      bottom 0px;
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
      background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
      .no-data-img {
        margin-top 20px;
        margin-bottom 10px;
        text-align center;
        img {
          width 100px;
        }
      }
      .recommend-div {
        overflow hidden;
      }
    }
  }
</style>
