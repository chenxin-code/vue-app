<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-group">
      <div class="nav-bar">
        <div
          class="nav-bar-item"
          :class="{active: currentType === item.type}"
          v-for="(item, index) in menu"
          :key="index"
          @click="tabChange(item.type)"
        >
          <span class="text">{{item.text}}</span>
        </div>
      </div>
      <div class="my-group-list">
        <scroll
          @scroll="scrollHandler"
          :hasMore="isCanLoadMore"
          :pullUpLoad="true"
          :listenScroll="true"
          @pullingUp="queryGroupList"
          :data="groupList"
          :startY="scrollTopValue"
          :probeType="2"
          v-if="groupList.length"
        >
          <div v-for="(item,index) in groupList" :key="index">
            <group
              :groupCoupon="item"
              :showStatus="1"
              :isLeader="true"
              @success="openGroupDetails"
            />
          </div>
        </scroll>
        <div class="no-list" v-if="!groupList.length">
          <div class="img-div">
            <img src="../image/拼券.png" />
          </div>
          <div class="tip theme_font_gray">暂无活动，快去发起拼券活动吧~</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
import group from "../common/group.vue";
import Scroll from "@/components/base/scroll/scroll";
export default {
  name: "",
  data() {
    return {
      currentType: "",
      scrollTopValue: 0,
      isCanLoadMore: false,
      groupList: [], // 列表
      menu: [
        { text: "全部拼团", type: "" },
        { text: "进行中", type: "2" },
        { text: "已拼成", type: "10" },
        { text: "已结束", type: "9" }
      ]
    };
  },
  components: {
    group,
    Scroll
  },
  mounted() {
    this.queryGroupList();
  },
  methods: {
    getLessMember: function(item) {
      return item.groupBuyNumOfPerson - item.currentNumOfPerson;
    },
    getItemImg: function(item) {
      let leaderUserAward = item.leaderUserAward;
      if (leaderUserAward.length > 0) {
        let gameAwardPic = leaderUserAward[0].gameAwardPic;
        return gameAwardPic;
      }
      return "";
    },
    tabChange(type) {
      this.currentType = type;
      this.groupList = [];
      this.queryGroupList();
    },
    scrollHandler() {},
    queryGroupList() {
      this.$Loading.open();
      let params = {
        token: this.$store.state.login.token,
        state: this.currentType
      };
      this.$request.post("/app/json/app_fight_group_order/query", params).then(res => {
          if (res.status == 0) {
            this.groupList = res.data.orderList || [];
          } else {
            this.$Toast(res.info);
          }
          this.$Loading.close();
        });
    },
    openGroupDetails(item) {
      // 打开拼团详情
      this.$router.push({
        path: "/group_detail",
        query: {
          orderId: item.id,
          mktGroupBuyId: item.mktGroupBuyId,
          spuId: item.spuId
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.my-group {
  .nav-bar {
    height: 44px;
    line-height: 44px;
    display: flex;
    background: #fff;

    .nav-bar-item {
      text-align: center;
      flex: 1;

      .text {
      }

      &.active {
        .text {
          color: $color-theme-r;
          position: relative;

          &:after {
            content: '';
            position: absolute;
            bottom: -6px;
            width: 100%;
            left: 0;
            height: 2px;
            background: $color-theme-r;
          }
        }
      }
    }
  }
}

.my-group-list {
  background: url('../../../../static/image/microShop/list-bg.png') repeat center center / 100% 100%;
  padding: 7px;
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

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

.list-wrapper {
  background: none;
}
</style>

