<template>
  <div class="record">
    <div class="back_box" @click="backEvent">
      <img :src="iconBack" alt="" />
    </div>
    <div class="title">邦豆记录</div>
    <div class="value">{{ totalRecord }}</div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="'没有更多了'"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
      >
        <ul class="record_list">
          <li
            class="record_item"
            v-for="(item, index) in recordList"
            :key="index"
          >
            <div class="item_info">
              <div class="item_title">{{ item.describe }}</div>
              <div class="item_date">{{ item.invalidTime }}</div>
            </div>
            <div class="item_value">
              {{ item.changeType == 1 ? "+" : "-" }}{{ item.integralChange }}
            </div>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconBack: require("../../images/icon_back.png"),
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      currentPage: 0,
      recordList: [],
      totalRecord: 0,
    };
  },
  components: {},
  created() {
    this.onLoad();
    if (this.$route.query.totalRecord) {
      this.totalRecord = this.$route.query.totalRecord;
    }
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.loading = true;
      this.refreshing = false;
      this.currentPage += 1;
      let params = {
        pageIndex: this.currentPage,
        pageSize: 10,
      };

      this.$http
        .post("/app/json/app_member_center/findIntegralRecordList", params)
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          if (
            this.currentPage < res.data.data.pages ||
            this.currentPage == res.data.data.pages
          ) {
            if (res.data.status == 0) {
              this.recordList = this.recordList.concat(res.data.data.records);
              this.loading = false;
            } else {
              this.loading = false; //将加载状态关掉
              this.error = true; //大家错误状态
            }
          } else {
            this.finished = true; //如果超过总页数就显示没有更多内容了
          }
        })
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },
    // 下拉刷新时触发
    onRefresh() {
      this.finished = false; //将没有更多的状态改成false
      this.loading = true; //将下拉刷新状态改为true开始刷新
      this.currentPage = 1;
      let params = {
        pageIndex: this.currentPage,
        pageSize: 10,
      };
      this.$http
        .post("/app/json/app_member_center/findIntegralRecordList", params)
        .then((res) => {
          if (res.data.status == 0) {
            this.recordList = res.data.data.records;
            // this.totalPage = res.data.totalPages; //将总页数赋值上去
            this.$toast("刷新成功");
            this.loading = false;
            this.refreshing = false; //刷新成功后将状态关掉
          } else {
            // this.finished = true
            this.loading = false;
            this.error = true;
            this.refreshing = false;
          }
        })
        .catch((res) => {
          this.$toast("网络繁忙,请稍后再试~");
        });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.record {
  width: 100%;
  height: 100%;
  background-image: url('../../images/historyBg.png');
  background-repeat: no-repeat;
  background-size: 100% 262px;

  .back_box {
    width: 100%;
    padding: 38px 24px 0;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .title {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
  }

  .value {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 48px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 48px;
    margin-top: 16px;
  }

  .record_list {
    margin-top: 113px;
    width: 100%;
    height: 61.6191904047976%;
    overflow-y: auto;
    padding-bottom: 10px;

    .record_item {
      width: 343px;
      height: 70px;
      background: #FFFFFF;
      box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
      border-radius: 12px;
      margin: 16px auto 0;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item_info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .item_title {
          font-size: 16px;
          font-weight: 400;
          color: #121212;
          line-height: 15px;
        }

        .item_date {
          font-size: 12px;
          font-weight: 400;
          color: #8D8D8D;
          line-height: 12px;
          margin-top: 10px;
        }
      }

      .item_value {
        font-size: 20px;
        font-weight: 500;
        color: #E8374A;
        line-height: 20px;
      }
    }
  }
}
</style>