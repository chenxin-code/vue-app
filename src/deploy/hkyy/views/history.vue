<template>
  <div>
    <nav-top title="历史记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="history-index">
      <div class="top">
        <p class="save">截止目前总计为您节省</p>
        <p>
          <span>{{ allNumber }}</span
          >元
        </p>
      </div>
      <div class="listAll">
        <div class="list" v-for="item in list" @click="details(item)">
          <div class="content">
            <p class="place">{{ item.stationName }}</p>
            <p class="time">
              <span>使用时间</span>
              <span>{{ item.usedtime }}</span>
            </p>
          </div>
          <div class="number">{{ item.facevalue }}</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  name: "ad-page",
  components: {},
  data() {
    return {
      allNumber: 0,
      list: []
    };
  },
  methods: {
    details(item) {
      this.$bridgefunc.customPush({
        path: "/hkhistorydetail",
        query: {
          item: encodeURIComponent(JSON.stringify(item))
        }
      });
    }
  },
  created() {
    this.$Loading.open();
    let url = "/platform/json/hzf/getHzfCouUsedRecord";
    let data = {
      // token: this.$store.state.login.token || '',
      isJsonData: true
    };
    this.$http.post(url, data).then(res => {
      let data = res.data;
      if (Number(data.status) === 0) {
        this.allNumber = data.data.totalAmount ? data.data.totalAmount : 0; // 总钱
        this.list = data.data.info ? data.data.info : []; // 列表
      } else {
        // 失败
        this.$Toast(res.data.info);
      }
      //        let data = res.data.data
      //        this.allNumber = data.totalAmount ? data.totalAmount : 0
      //        this.list = data.info ? data.info : []
      this.$Loading.close();
    });
  },
  destroyed() {
    this.$Loading.close();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
.history-index {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 2%;
  display: flex;
  flex-direction: column;

  .top {
    width: 100%;
    text-align: center;
    font-size: 16px;
    padding: 6px 0;
    border-radius: 6px;
    box-shadow: 0px 0px 1px #e7dbdb;

    .save {
      margin-bottom: 12px;
    }

    span {
      color: rgb(240, 44, 45);
      font-size: 22px;
    }
  }

  .listAll {
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;

    .list {
      width: 100%;
      padding: 12px 8px;
      border-radius: 6px;
      box-shadow: 0px 0px 1px #e7dbdb;
      margin-top: 8px;
      display: flex;

      .content {
        flex: 1;

        .place {
          margin-bottom: 8px;
          font-size: 16px;
        }

        .time {
          color: #6d6565;
          font-size: 14px;
        }
      }

      .number {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        color: rgb(240, 44, 45);
        border-left: 1px solid #eee6e6;
      }
    }
  }
}
</style>
