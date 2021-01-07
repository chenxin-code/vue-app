
<template>
  <div class="box">
    <nav-top @backEvent="backEvent" :bgImg="require('./image/banner上@2x.png')"></nav-top>
    <nav-content>
      <background />
      <div class="all-content">
        <scroll
          @scroll="scrollHandler"
          :hasMore="isCanLoadMore"
          :pullUpLoad="true"
          :listenScroll="true"
          :data="groupList"
          :startY="scrollTopValue"
          :probeType="2"
          v-if="groupList.length"
        >
          <div v-for="(item,index) in groupList" :key="index">
            <group :groupCoupon="item" :showStatus="1" :isLeader="true" @success="queryGroupList" />
          </div>
        </scroll>
        <div class="no-list" v-if="!groupList.length">
          <div class="img-div">
            <img src="./image/拼券.png" />
          </div>
          <div class="tip theme_font_gray">暂无活动，快去发起拼券活动吧~</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import group from "./common/group.vue";
import background from "./common/background.vue";
import Scroll from "@/components/base/scroll/scroll";
export default {
  name: "group-ticket",
  components: {
    group,
    Scroll,
    background
  },
  computed: {},
  data() {
    return {
      scrollTopValue: 0,
      isCanLoadMore: false,
      groupList: [],
      params: {
        // page: 1,
        // rows: 10,
        state: 1,
        groupBuyType: 0
      }
    };
  },
  mounted() {
    this._loadProList();
  },
  methods: {
    backEvent() {
      //   this.$keepaliveHelper.deleteCache(this)
      this.$router.go(-1);
    },
    rules() {
      this.$router.push({
        path: "/group_ticket/rules"
      });
    },
    linkTo() {
      this.$router.push({
        path: "/group_ticket/my_vouchers"
      });
    },
    queryGroupList() {
      this._loadProList();
    },
    scrollHandler() {},
    _loadProList() {
      this.$Loading.open();
      this.$http
        .post("/app/json/app_fight_group_order/queryAll", this.params)
        .then(res => {
          if (res.data.status == 0) {
            this.groupList = res.data.data.orderList || [];
          } else {
            this.$Toast(res.data.info);
          }
          this.$Loading.close();
        });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .list-wrapper {
    background: none;
  }

  .all-content {
    height: 80%;
    width: 94%;
    margin: 0 auto;
    margin-top: -43px;
    padding-top: 10px;
    background-color: #fff;
    border-radius: 10px 10px 0 0;

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
}
</style>
