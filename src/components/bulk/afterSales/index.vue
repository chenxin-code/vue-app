<template>
  <!-- // created by hjc 售后单列表 -->
  <div class="afterSales">
    <van-sticky>
      <van-search v-model="value" shape="round" background="#fff" />
      <div class="tab">
        <div
          class="tab_item"
          v-for="(item, index) in tabTitle"
          :key="index"
          @click="currentTab = index"
          :class="currentTab == index ? 'current_tab' : ''"
        >
          {{ item.name }}
        </div>
      </div>
    </van-sticky>
    <div class="goods_list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="goods_item"
            v-for="item in 10"
            :key="item"
            @click="$router.push('/bulk_after_sales_detail')"
          >
            <div class="goods_id">
              <div>#01</div>
              <div>待审核</div>
            </div>
            <div class="goods_user">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202011%2F11%2F20201111212304_5706f.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615221459&t=c602d8447792fa22cbcb25a38b16031b"
                alt=""
              />
              <div class="user_name">张三</div>
              <div class="user_phone">13510101010</div>
            </div>
            <div class="goods_img">
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202011%2F11%2F20201111212304_5706f.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615221459&t=c602d8447792fa22cbcb25a38b16031b"
                alt=""
                v-for="item in 10"
                :key="item"
              />
            </div>
            <div class="goods_detail">
              <div>共计5件商品，合计支付</div>
              <div>1000.00</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: "afterSales",
  props: {},
  data() {
    return {
      tabTitle: [
        { name: "全部" },
        { name: "待审核" },
        { name: "已完成" },
        { name: "已关闭" },
      ],
      currentTab: 0,
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
    };
  },
  created() {},
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;

        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F6F6F6;
}

.afterSales {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-family: PingFangSC-Semibold, PingFang SC;
  letter-spacing: 1px;
  background-color: #F6F6F6;

  .tab {
    width: 100%;
    height: 36.5px;
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

    .tab_item {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      padding-bottom: 6.5px;
    }

    .current_tab {
      color: #C61606;
      border-bottom: 1px solid #C61606;
    }
  }

  .goods_list {
    padding: 10px 10px 0;
    background: #F6F6F6;

    .goods_item {
      background: #FFFFFF;
      box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 10px;
      margin-bottom: 10px;

      .goods_id {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 22.5px;

        div:last-child {
          font-size: 14px;
          font-weight: 600;
          color: #C82010;
          line-height: 20px;
        }
      }

      .goods_user {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: #333330;
        line-height: 16.5px;
        margin: 4px 0 11px;

        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
        }

        div:last-child {
          margin-left: 18.5px;
        }
      }

      .goods_img {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow-x: auto;
        margin-bottom: 10px;

        img {
          width: 45px;
          height: 45px;
          margin-right: 10px;
        }
      }

      .goods_detail {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: #333330;
        line-height: 16.5px;

        div:last-child {
          font-weight: 600;
        }
      }
    }
  }
}
</style>

