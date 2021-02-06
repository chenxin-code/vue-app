<template>
  <!-- // created by hjc 订单列表 -->
  <div class="orderList">
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
          <div class="goods_item" v-for="item in 10" :key="item">
            <div class="goods_title">
              <div class="goods_ID">#01</div>
              <div class="goods_type">待发货</div>
            </div>
            <div class="good_user">
              <div class="user">
                <img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202011%2F11%2F20201111212304_5706f.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615221459&t=c602d8447792fa22cbcb25a38b16031b"
                  alt=""
                />
                <div class="user_name">张三</div>
                <div class="user_phone">13510101010</div>
              </div>
              <div
                :class="type == 1 ? 'pick_up' : 'delivery'"
                class="user_type"
              >
                {{ type == 1 ? "自提" : "配送上门" }}
              </div>
            </div>
            <div class="goods_img">
              <img
                :src="require('../share/images/share.png')"
                alt=""
                v-for="item in 10"
                :key="item"
              />
            </div>
            <div class="goods_detail">
              <div class="detail">
                <span>共计5件商品，合计支付 </span>
                <span>1000.00</span>
              </div>
              <div class="confirm" @click="confirm">确认送达</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-popup v-model="showPopup">
      <div class="popup">
        <div class="popup_title">确认订单商品</div>
        <div class="popup_detail">抵达</div>
        <div class="popup_btn">
          <div class="confirm_btn">确认</div>
          <div class="cancel_btn">取消</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "orderList",
  props: {},
  data() {
    return {
      tabTitle: [
        { name: "全部" },
        { name: "待发货" },
        { name: "代配送" },
        { name: "待提货" },
        { name: "已完成" },
        { name: "已关闭" },
      ],
      currentTab: 0,
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
      type: 2,
      showPopup: false,
    };
  },
  created() {},
  methods: {
    confirm() {
      this.showPopup = true;
    },
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

.orderList {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #F6F6F6;
  font-family: PingFangSC-Semibold, PingFang SC;
  letter-spacing: 1px;
  background: #F6F6F6;

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
      width: 100%;
      height: 192px;
      background: #FFFFFF;
      box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 9.5px 10px 23px 12px;
      margin-bottom: 10px;

      .goods_title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods_ID {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 22.5px;
        }

        .goods_type {
          font-size: 14px;
          font-weight: 600;
          color: #C82010;
          line-height: 20px;
        }
      }

      .good_user {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 4px;

        .user {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #333330;
          line-height: 16.5px;

          img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            border-radius: 50%;
            overflow: hidden;
          }

          div:last-child {
            margin-left: 18.5px;
          }
        }

        .user_type {
          border-radius: 2px;
          border: 1px solid #FF9E4F;
          padding: 0 4px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 400;
          line-height: 16.5px;
        }

        .pick_up {
          border: 1px solid #FF9E4F;
          color: #FF9E4F;
        }

        .delivery {
          border: 1px solid #4F87FF;
          color: #4F87FF;
        }
      }

      .goods_img {
        width: 100%;
        display: flex;
        overflow-x: auto;
        margin-top: 11px;

        img {
          width: 45px;
          height: 45px;
          margin-right: 10px;
        }
      }

      .goods_detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;

        .detail {
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            font-size: 12px;
            font-weight: 400;
            color: #333330;
            line-height: 16.5px;
          }

          span:last-child {
            font-size: 14px;
          }
        }

        .confirm {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 28px;
          background: #C61606;
          border-radius: 15px;
          text-align: center;
          line-height: 28px;
          width: 114px;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 18.5px;
        }
      }
    }
  }

  .van-popup--center {
    border-radius: 15px;
  }

  .popup {
    width: 260px;
    height: 147px;
    background: #FFFFFF;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 0 15px;

    .popup_title {
      font-size: 16px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      color: #000000;
      line-height: 30px;
    }

    .popup_detail {
      font-size: 16px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      color: #000000;
      line-height: 30px;
    }

    .popup_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;

      .confirm_btn {
        width: 80px;
        height: 28px;
        background: #C61606;
        border-radius: 15px;
        text-align: center;
        line-height: 28px;
        font-size: 13px;
        font-weight: 400;
        color: #FFFFFF;
        margin-right: 10px;
      }

      .cancel_btn {
        width: 80px;
        height: 28px;
        border-radius: 15px;
        border: 1px solid #999999;
        font-size: 13pxpx;
        font-weight: 400;
        color: #333333;
        line-height: 28px;
        text-align: center;
      }
    }
  }
}
</style>

