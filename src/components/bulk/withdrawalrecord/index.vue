<!--  -->
<template>
  <div>
    <van-sticky>
      <van-nav-bar
        :left-arrow="false"
        safe-area-inset-top
        @click-left="$router.go(-1)"
        :border="false"
      >
        <template #left>
          <van-icon name="arrow-left" color="#000" size="18" />
        </template>
        <template #title>
          <div class="navTitle">提现记录</div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="content">
      <div v-if="list.length > 0 || loading">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="到底啦~"
            @load="onLoad"
            error-text="请求失败，点击重新加载"
          >
            <!-- :error.sync="error" -->
            <div class="settlement" v-for="item in list" :key="item">
              <div class="row list">
                <img :src="recordIcon" class="recordIcon" alt="" />
                <div class="row flex spacebetween list-record">
                  <div class="flex column start list-record-detail">
                    <div class="account">{{ utils.toDecimal2(99) }}</div>
                    <div class="time">2020-06-12</div>
                  </div>
                  <div class="row center list-record-status">提现中</div>
                </div>
              </div>
            </div>
            <div class="settlement">
              <div class="row list">
                <img :src="recordIcon" class="recordIcon" alt="" />
                <div class="row flex spacebetween list-record">
                  <div class="flex column start list-record-detail">
                    <div class="account">99</div>
                    <div class="time">2020-06-12</div>
                  </div>
                  <div class="row center list-record-status success">
                    提现成功
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <div v-else class="empty">
        <van-empty :image="empty" description="没有任何记录" />
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import utils from "@/utils/util";
export default {
  data() {
    return {
      recordIcon: require("../../../../static/image/bulk/withdrawalrecord/recordIcon.png"),
      empty: require("../../../../static/image/bulk/withdrawalrecord/empty.png"),
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      utils: utils,
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.onLoad();
  },

  methods: {
    onLoad() {
      this.loading = true;
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }
        for (let i = 0; i < 5; i++) {
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
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
#app .router_class {
  background: #f2f2f2;
}

.navTitle {
  font-size: 18px;
  color: #000;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

.start {
  justify-content: start;
}

.center {
  justify-content: center;
}

.spacebetween {
  justify-content: space-between;
}

.flex {
  flex: 1;
}

.content {
  padding: 15px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  height: calc(100vh - 46px);
  overflow-y: auto;

  &-nomore {
    color: #B3B3B3;
    font-size: 12px;
    margin-top: 30px;
  }

  .settlement {
    border-radius: 8px;
    background: #fff;
    margin-bottom: 15px;
    padding: 21px 15px;
    background: #fff;

    .list {
      height: 30px;

      .recordIcon {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        margin-right: 15px;
      }

      &-record-detail {
        .account {
          font-size: 18px;
          color: #333;
        }

        .time {
          font-size: 12px;
          color: #999;
          margin-top: 10px;
        }
      }

      &-record-status {
        color: #FF393E;
      }

      &-record-status.success {
        color: #999;
      }
    }
  }

  .empty {
    margin-top: 100px;
  }
}
</style>