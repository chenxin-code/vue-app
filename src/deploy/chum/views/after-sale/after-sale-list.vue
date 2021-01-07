<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <van-tabs
    		v-model="activeTab"
    		color="#C9A063"
    		title-active-color="#C9A063"
    		@click="changeTabs">
			  <van-tab title="售后申请"></van-tab>
			  <van-tab title="处理中"></van-tab>
			  <van-tab title="申请记录"></van-tab>
			</van-tabs>
      <div class="search-container">
        <input class="search-input" type="text" placeholder="搜索你想要的商品">
				<van-button class="exchange-btn" type="default">
          筛选
          <i class="iconfont mall-shaixuan"></i>
        </van-button>
      </div>
      <scroll
        ref="scroll"
        class="after-sale-list"
        :hasMore="hasMore"
        :pullUpLoad="true"
        @pullingUp="loadMore"
        :data="afterSaleList"
        v-if="afterSaleList.length !== 0">
        <ul class="after-sale-c">
          <li
            v-for="(item, index) in afterSaleList"
            :key="index"
            :class="{'not-pass': false, 'pass': true}"
            class="item">
            <p class="title-name" v-if="activeTab == 0">空港易行</p>
            <div class="title-name refund-title" v-else>
              <div class="order-no">服务单号：918789637</div>
              <div class="tips">
                <img src="../../assets/images/icon-refund.png" alt="" class="icon-refund">
                <span>退款</span>
              </div>
            </div>
            <div class="prod-info">
              <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3781401089,2197884903&fm=15&gp=0.jpg" alt="" class="prod-img">
              <div class="right-info">
                <p class="name">大兴机场休息室</p>
                <p class="count">数量：1</p>
                <div class="btn-container">
                  <span class="btn">申请退款</span>
                  <!-- <span class="btn gray">取消申请</span>
                  <span class="btn">审核中</span>
                  <span class="btn gray">再次申请</span>
                  <span class="btn">查看详情</span> -->
                </div>
              </div>
            </div>
          </li>
        </ul>
      </scroll>
    </nav-content>
  </div>
</template>
<script>
import scroll from "@/components/base/scroll/scroll";
export default {
  components: {
    scroll
  },
  data() {
    return {
      activeTab: 0,
      hasMore: true,
      afterSaleList: [{}, {},{},{},{},{},{},],
    }
  },
  methods: {
    changeTabs(name, title) {
    },
    loadMore() {
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl';
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.search-container {
  margin 20px 20px 0;
  display flex;
  .search-input {
    flex 1;
    border 1px solid #ddd;
		border-radius 5px;
		font-size 16px;
		padding-left 15px;
  }
  .exchange-btn {
    font-size 16px;
    border-radius 5px;
    border 1px solid #ddd;
    padding 0 10px;
    margin-left 10px;
    color #757575
  }
}
.after-sale-list {
  position absolute;
  left 0
  right 0
  bottom 0;
  top: 115px;
  padding 0 20px;
  height auto;
  /deep/ .scroll-content {
    padding-top: 5px;
  }
  .after-sale-c {
    .item {
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
      border-radius: 5px;
      padding 15px;
      margin-top 10px;
      position relative;
      overflow hidden;
      &.not-pass::after,
      &.pass::after {
        content: '未通过';
        display block;
        height 14px;
        width 41px;
        line-height 14px;
        color #fff;
        font-size 10px;
        text-align center;
        background-color $color-theme-r;
        position absolute;
        left -11px;
        top 4px;
        padding 0 4px;
        transform rotate(-45deg);
      }
      &.pass::after {
        content: '通过';
        background-color #4BB873;
      }
      &:first-child {
        margin-top 0;
      }
      .title-name {
        font-size 16px;
        font-weight 500;
        ellipse();
        &.refund-title {
          display flex;
          justify-content space-between;
          align-items center;
          .order-no {
            flex 1;
            ellipse();
          }
          .tips {
            display flex;
            font-size 14px;
            align-items center;
            .icon-refund {
              display block;
              width 15px;
              height 15px;
              margin-right 5px;
            }
          }
        }
      }
      .prod-info {
        margin-top 12px;
        display flex;
        .prod-img {
          display block;
          width 75px;
          height 75px;
          border-radius 4px;
        }
        .right-info {
          flex 1;
          padding-left 10px;
          position relative;
          display flex;
          flex-direction column;
          justify-content space-between;
          .name {
            font-size 15px;
            font-weight 500;
            margin-top 5px;
            ellipse-2();
            line-height 18px;
          }
          .count {
            font-size 13px;
            color #9FA0A0;
            margin-bottom 5px;
          }
          .btn-container {
            position absolute;
            bottom 0
            right 0;
            .btn {
              display inline-block;
              font-size 13px;
              height 28px;
              line-height 28px;
              padding 0 10px;
              border 1px solid $color-theme-r;
              color $color-theme-r;
              border-radius 14px;
              margin-left 8px;
              &.gray {
                border-color #9FA0A0
                color #9FA0A0;
              }
            }
          }
        }
      }
    }
  }
}
</style>