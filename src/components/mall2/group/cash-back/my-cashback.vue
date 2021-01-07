<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <ul class="cash-back-list">
        <li class="item" v-for="(item, index) in dataList" :key="index" @click="cashbackClick(item)">
          <div class="row">
            <p class="title">团购返现</p>
            <p class="commodity-name">{{ item.skuName }}</p>
          </div>
          <div class="row">
            <p class="amount">{{ getAmountStr(item) }}</p>
            <p class="date">{{ item.paidTime }}</p>
          </div>
        </li>
      </ul>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: []
    };
  },
  methods: {
    getAmountStr: function (item) {
      switch (item.returnType) {
        case 1:
          return '¥' + item.returnElec
        case 2:
          return '¥' + item.returnRedPacket
        case 3:
          return item.returnPoints + '积分'
        default:
          return '返现类型有误'
      }
    },
    cashbackClick(item) {
      this.$router.push({
        path: '/cash_back_detail',
        query: {
          orderItemId: item.orderItemId
        }
      });
    },
    getFxList: function () {
      this.$Loading.open();
      let url = '/app/json/app_group_buy_cashback/getMyCashBack';
      let paramsData = {
        page:{
          index: 1,
          pageSize:20
        }
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.dataList = data.data.joinList
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        }
      );
    }
  },
  created() {
    this.getFxList()
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.container {
  padding: 0 10px 10px;
  overflow-y: auto;
  .cash-back-list {
    .item {
      padding 15px 10px
      border-radius 5px;
      box-shadow 0 0 5px #ddd;
      font-size 14px;
      margin-top 10px;
      .row {
        display flex;
        align-items center;
        .commodity-name {
          flex 1;
          text-align right;
          padding-left 15px;
        }
        .amount {
          flex 1;
          color $color-theme-r
          font-weight 600;
          font-size 16px;
        }
        .date {
          font-size 12px;
          color #999;
        }
      }
      .row:nth-child(n+2) {
        padding-top 12px;
      }
    }
  }
}
</style>
