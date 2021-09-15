<template>
  <div class="userInfo">
    <van-sticky :offset-top="offsetTop" v-if="!wxenvironment()">
      <nav-top title="个人资料" @backEvent="backEvent"></nav-top>
    </van-sticky>
    <div class="info info_height">
      <div class="title">个人资料</div>
      <img
        :src="userInfo.userImage != '' ? userInfo.userImage : userAvatar"
        alt=""
        class="avatar"
      />
    </div>
    <div class="info">
      <div class="title">昵称</div>
      <div class="value">
        {{ userInfo.userName != "" ? userInfo.userName : "未知" }}
      </div>
    </div>
    <div class="info">
      <div class="title">性别</div>
      <div class="value">
        {{ userInfo.sex == 1 ? "男" : userInfo.sex == 2 ? "女" : "未知" }}
      </div>
    </div>
    <div class="info">
      <div class="title">生日</div>
      <div class="value">
        {{ userInfo.newBirthday != "" ? userInfo.newBirthday : "未知" }}
      </div>
    </div>
  </div>
</template>

<script>
import navTop from "@/components/min/components/nav-top/nav-top";

export default {
  data() {
    return {
      offsetTop: "0rem",
      userInfo: {},
      userAvatar: require("../../images/userAvatar.png"),
    };
  },
  components: {
    navTop,
  },
  created() {
    let padding = "";
    padding = document.getElementsByTagName("body")[0].style.paddingTop;
    if (padding !== "") {
      this.offsetTop = padding;
    }
    this.getUserInfo();
    if(this.wxenvironment()) {
      document.title = "个人资料"
    }
  },
  methods: {
    wxenvironment() {
      let ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    backEvent() {
      this.$router.go(-1);
    },
    getUserInfo() {
      this.$http
        .post("/app/json/login/getYthUser", {
          token: localStorage.getItem("ythToken"),
        })
        .then((res) => {
          if (res.data.status == 0) {
            this.userInfo = res.data.data;
          }
        });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.userInfo {
  .info {
    width: 343px;
    height: 60px;
    background: #FFFFFF;
    box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
    border-radius: 16px;
    margin: 20px auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;

    .title {
      font-size: 16px;
      font-weight: 400;
      color: #121212;
      line-height: 16px;
    }

    .value {
      font-size: 16px;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 16px;
    }

    .avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  .info_height {
    height: 90px;
  }
}
</style>