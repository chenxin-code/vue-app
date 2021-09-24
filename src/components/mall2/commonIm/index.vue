<template>
  <div class="commonIm">
    <img src="./image/top_bg.png" alt="" class="top-bg" />

    <div class="item-card" @click="pushWUYE">
      <div class="left">
        <img src="./image/wuye.png" alt="" />
        <div class="desc">
          <div>物业在线客服</div>
          <div>工作日08:30-06:00</div>
        </div>
      </div>
      <div class="right">
        <img src="./image/arrow.png" alt="" />
      </div>
    </div>

    <div class="item-card two" @click="pushMALL">
      <div class="left">
        <img src="./image/xingxuan.png" alt="" />
        <div class="desc">
          <div>商城在线客服</div>
          <div>工作日08:30-06:00</div>
        </div>
      </div>
      <div class="right">
        <img src="./image/arrow.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    document.title = "在线客服"
  },
  methods: {
    pushWUYE() {
      location.href = `https://times.shidaijia.com/crmguest/public/index.html#/outer/cust-service?cust_id=${this.$store.state.ythUserInfo.phone}&client_id=linli`;
    },
    pushMALL() {
      ysf("config", {
        uid: this.$store.state.userInfo.userId,
        name: this.$store.state.userInfo.nickName,
        email: "",
        mobile: this.$store.state.userInfo.phone,
        data: this.$store.state.userLable,
        success: function() {
          ysf("open");
        },
        error: function() {
          // 错误回调
          // handle error
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.commonIm {
  background: #f8f8f8 !important;
}
.top-bg {
  width: 100%;
}
.two {
  margin-top: 10px;
}
.item-card {
  width: 332px;
  height: 101px;
  background: #ffffff;
  border-radius: 8px;
  margin: 17px 22px;
  display: flex;
  justify-content: space-between;
  .left {
    margin-left: 16px;
    display: flex;
    align-items: center;
    img {
      width: 52px;
      height: 52px;
    }
    .desc {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      div:nth-child(1) {
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
      }
      div:nth-child(2) {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
        margin-top: 13px;
      }
    }
  }
  .right {
    margin-right: 17px;
    display: flex;
    align-items: center;
    img {
      width: 7px;
      height: 11px;
    }
  }
}
</style>
