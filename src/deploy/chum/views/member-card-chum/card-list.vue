<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" v-if="hasNavTop"></nav-top>
    <nav-content class="container" :style="{top: computedTop() + 'px'}">
      <van-tabs
        color="#C9A063"
        title-active-color="#C9A063"
        @click="changeTabs">
        <van-tab title="个人卡"></van-tab>
        <van-tab title="企业卡"></van-tab>
      </van-tabs>
      <scroll
        ref="scroll"
        class="card-list"
        :hasMore="hasMore"
        :pullUpLoad="true"
        :pullDownRefresh="true"
        @pullingDown="pullingDown"
        @pullingUp="loadMore"
        :data="cardList">
        <ul class="card-c" v-if="cardList.length !== 0">
          <li class="item" v-for="(item, index) in cardList" :key="index" @click="buyHandler(item)">
            <img :src="item.backgroundPic" alt="" class="card-img">
            <p class="card-name">{{ item.equityCardName }}</p>
            <p class="card-adv">{{ item.advertisingLanguage }}</p>
            <div class="bottom-content">
              <p class="price">￥<span>{{ dealWithPrice(item.salesPrice)[0] }}</span>.{{
                dealWithPrice(item.salesPrice)[1] }}</p>
              <van-button
                class="func-btn"
                round
                block
                type="info"
                color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)">
                {{ activeTab == 0 ? '购买' : '查看详情' }}
              </van-button>
            </div>
          </li>
        </ul>
        <p v-else class="no-result-message">暂无数据~</p>
      </scroll>
    </nav-content>
  </div>
</template>

<script>
  import cookie from 'js-cookie'
  import scroll from "@/components/base/scroll/scroll";
  import utils from '../../assets/utils/tools'

  export default {
    mixins: [utils],
    data() {
      return {
        hasNavTop: false,
        activeTab: 0,
        hasMore: true,
        cardList: [],
        pageInfo: {
          page: 1,
          rows: 10,
        }
      }
    },
    components: {
      scroll
    },
    mounted() {
      if (this.$route.query.hasNavTop == 1) {
        this.hasNavTop = true;
      }
      this.getCardList();
    },
    computed: {
      isNativeTop() {
        return cookie.get('isnativetop') != 1
      },
      top() {
        return this.isNativeTop ? this.$store.state.barHeight + this.$market.getNavHeight() : 0
      }
    },
    methods: {
      computedTop() {
        if (this.hasNavTop) {
          return this.top;
        } else {
          return 0
        }
      },
      changeTabs(name) {
        if (name != this.activeTab) {
          this.cardList = [];
          this.pageInfo = {
            page: 1,
            rows: 10
          }
          this.activeTab = name
          this.getCardList();
          this.hasMore = true;
        }
      },
      loadMore() {
        ++this.pageInfo.page;
        this.getCardList();
      },
      pullingDown() {
        this.$refs.scroll.closePullUp()
        this.pageInfo = {
          page: 1,
          rows: 10
        }
        this.cardList = [];
        this.getCardList();
        this.hasMore = true
      },
      buyHandler(item) {
        this.$router.push({
          path: '/card_detail',
          query: {
            equityCardId: item.id,
            cardType: this.activeTab == 0 ? 1 : 2
          }
        })
      },
      getCardList() {
        this.$Loading.open();
        this.$http.post('/app/jqGrid/equity_card/equityCardBuyList', {
          cardType: this.activeTab == 0 ? 1 : 2,
          ...this.pageInfo,
        }).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.cardList.push(...data.data);
              if (this.pageInfo.page >= data.totalPages) {
                this.hasMore = false;
              }
            }
          } else {
            this.$Toast(data.info);
          }
        }).catch(err => {
          this.$Loading.close();
          this.$Toast(`equityCardList err ${err}`);
        })
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path != '/card_detail') {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    display flex;
    flex-direction column;
  }
  .card-list {
    flex 1
    padding 0 20px;
    margin-top 5px;
    /deep/ .scroll-content {
      padding-top: 5px;
    }

    .card-c {
      .item {
        padding 10px;
        border-radius 5px;
        box-shadow 0 0 5px #ddd;
        margin-top 10px;

        &:first-child {
          margin-top 0;
        }

        .card-img {
          display block;
          margin 0 auto;
          width 60%;
          border-radius 8px;
          margin-top 5px;
          min-height 80px;
        }

        .card-name {
          font-size 14px;
          font-weight 500;
          margin-top 12px;
          line-height 18px;
        }

        .card-adv {
          font-size 12px;
          margin-top 5px;
          color $color-text-l
          line-height 15px;
          padding-bottom 8px;
        }

        .bottom-content {
          display flex;
          justify-content space-between;
          align-items center;
          padding-top 8px;
          bdr-t();

          .price {
            color $color-theme-r
            font-weight 700;
            font-size 15px;

            span {
              font-weight 700;
              font-size 20px;
            }
          }

          .func-btn {
            height 32px;
            line-height 32px;
            width 90px;

            .van-button__text {
              font-size 15px;
              font-weight 700;
              color #E0C28A
            }
          }
        }
      }
    }
  }
</style>
