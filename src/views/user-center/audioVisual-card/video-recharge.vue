<template>
  <div class="video-recharge-index">
    <nav-top title="视频充值" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="video-recharge-content">
      <div class="recharge-news">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="title">处罚决定书编号：</div>
                <div class="inp">
                  <input type="text" placeholder="请输入处罚决定书编号" v-model="violaData.number">
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="title">处罚决定书编号：</div>
                <div class="inp">
                  <input type="text" placeholder="请输入处罚决定书编号" v-model="violaData.number">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="recharge-content">
        <div class="recharge-classify">
          <h2>充值类型:</h2>
          <div class="classifyList">
            <p class="classify-item">腾讯视频VIP</p>
            <p class="classify-item">超级影视VIP</p>
          </div>
        </div>
        <div class="recharge-price">
          <h2>充值面额:</h2>
          <div class="priceList">
            <p class="price-item">
              1个月/25元
              <br>现价: 3.00元
            </p>
            <p class="price-item">
              1个月/25元
              <br>现价: 3.00元
            </p>
            <p class="price-item">
              1个月/25元
              <br>现价: 3.00元
            </p>
          </div>
        </div>
      </div>
      <button class="rechargeBtn" @click="rechargeBtn">立即充值</button>
    </nav-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      violaData: {}
    }
  },
  methods: {
    rechargeBtn() {

    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.video-recharge-index {
  background-color: #F2F2F4 !important;

  .video-recharge-content {
    .recharge-news {
      margin: 10px 0;
      background-color: #fff;
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);

      .left {
        width: 100%;
        display: flex;
        justify-content: left;
        align-items: center;

        .title {
          width: 35%;
          font-size: 14px;
        }

        .inp {
          flex: 1;
          width: 100%;

          input {
            width: 100%;
            line-height: 25px;
            background-color: #fff;
          }
        }
      }
    }

    .recharge-content {
      background: #fff;
      padding: 10px;
      height: 100%;

      h2 {
        font-size: 14px;
        padding: 10px 0;
      }

      .classify-item, .price-item {
        display: inline-block;
        border: 1px solid #79B3F1;
        padding: 10px;
        color: #79B3F1;
        margin-right: 5px;
        border-radius: 5px;
      }

      .recharge-classify {
        margin-bottom: 30px;

        .classifyList {
        }
      }
    }

    .rechargeBtn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 50px;
      color: #fff;
      background-color: #F02C2D;
      border: none;
    }
  }
}
</style>
