<template>
  <div class="recharge-bill-index">
    <nav-top title="视频充值账单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="recharge-bill-content">
      <div class="bill-list">
        <div class="bill-list-item">
          <p class="bill-month">二月</p>
          <div class="bill-item" @click="billDetailsFun">
            <img src="./assets/image/icon5@2x.png" alt>
            <div class="bill-item-content">
              <div class="bill-content">
                <p class="bill-item-title">腾讯视频 月卡</p>
                <p class="bill-item-price">￥ 10.00</p>
              </div>
              <div class="bill-state">
                <p class="bill-item-time">2019年6月20日16:31:54</p>
                <p class="bill-item-state">充值成功</p>
              </div>
            </div>
          </div>
          <div class="bill-item">
            <img src="./assets/image/icon5@2x.png" alt>
            <div class="bill-item-content">
              <div class="bill-content">
                <p class="bill-item-title">腾讯视频 月卡</p>
                <p class="bill-item-price">￥ 10.00</p>
              </div>
              <div class="bill-state">
                <p class="bill-item-time">2019年6月20日16:31:54</p>
                <p class="bill-item-state">充值成功</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    billDetailsFun() {
      this.$router.push({
        path: '/user_center/bill_details',
        query: {}
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.recharge-bill-index {
  background-color: #F2F2F4 !important;

  .recharge-bill-content {
    .bill-list {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      .bill-list-item {
        .bill-month {
          padding: 10px 0px 10px 20px;
          background-color: #F8F8F8;
          font-weight: bold;
        }

        .bill-item {
          padding: 10px;
          background-color: #fff;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          img {
            padding: 10px;
          }

          .bill-item-content {
            width: 100%;
            border-bottom: 1px solid #E4E4E4;

            .bill-content, .bill-state {
              font-size: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              line-height: 30px;
            }

            .bill-state {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
