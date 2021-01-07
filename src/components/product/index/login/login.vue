<template>
  <div class="login login-about" :style="{'background-color': moduleData.bgColor}">
    <div class="header">
      <div class="logo">
        <img class="full-img" :src="moduleData.logoPath">
      </div>
      <div class="app-name">中油好客e站</div>
    </div>
    <div class="radius-form">
      <form class="form">
        <div class="cells">
          <div class="cell">
            <div class="cell__hd">
              <div class="icon">
                <img class="full-img" src="static/images/login/login-icon1.png">
              </div>
            </div>
            <div class="cell__bd">
              <input type="text" placeholder="请输入用户名或手机号">
            </div>
          </div>
          <div class="cell cell-line">
            <div class="cell__hd">
              <div class="icon">
                <img class="full-img" src="static/images/login/login-icon2.png">
              </div>
            </div>
            <div class="cell__bd">
              <input type="password" placeholder="请输入用户密码">
            </div>
            <div class="cell__ft">
              <div class="btn-pass">
                记住密码
              </div>
            </div>
          </div>
          <div class="cell cell-line cell_access">
            <div class="cell__hd">
              <div class="icon">
                <img class="full-img" src="static/images/login/login-icon3.png">
              </div>
            </div>
            <div class="cell__bd font-medium">

            </div>
            <div class="cell__ft"></div>
          </div>
        </div>
      </form>
    </div>

    <div class="btn-box">
      <div class="btn">
        登录
      </div>
    </div>

    <div class="col">
      <div class="col-cell">
        <div class="col-item">账号注册</div>
        <div class="col-item fast">
          <span class="text">
            忘记密码?
          </span>
        </div>
      </div>
      <div class="col-cell">
        <div class="col-item"></div>
        <div class="col-item fast">
          <span class="text">
            快捷登录
          </span>
          <img src="static/images/login/right.png" width="15px" height="15px">
        </div>
      </div>
    </div>

    <div class="login-third">
      <span class="text font-medium-l">
        第三方账号登录
      </span>
    </div>
    <div class="zhifubao-logo">
      <div class="img-cell">
        <img class="full-img" src="static/images/login/zhifubao.png">
      </div>
    </div>
    <LoginEdit v-if="!usePorpData && pageData.moduleList[myIndex].editing"></LoginEdit>
  </div>
</template>

<script>
import LoginEdit from "./login-edit";
import { mapGetters } from "vuex";

export default {
  components: {
    LoginEdit
  },
	props: ['myIndex', 'usePorpData', 'propData'],
  computed: {
    ...mapGetters(["clientWidth"]),
    pageData: function() {
      if (this.usePorpData == true) {
        return this.propData;
      }
      return this.$store.state.pageData;
    },
    moduleData: function() {
      return this.pageData.moduleList[this.myIndex].data;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

propor-padding(val) {
  position: relative;
  &:after {
    content: '';
    display: block;
    width: 100%;
    padding-top:  (val)%;
  }
}
.full-img {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}
.login-about {
  overflow: hidden;
  background-color: $color-background-lll;
  box-sizing: border-box;
  .header {
    display: flex;
    flex-direction: column;
    padding-top: 120px;
    .logo {
      display: flex;
      justify-content: center;
      align-self: center;
      width: 18%;
      propor-padding: 95;
    }
    .app-name {
      display: flex;
      justify-content: center;
      padding: 20px 0 40px;
      text-align: center;
      color: $color-text;
      font-size: 18px;
      font-weight: bold;
      margin-left: 5px;
      letter-spacing: 10px;
    }
  }
  .radius-form {
    padding: 0 20px;
    .cells {
      background-color: #fff;
      border-radius: 5px;
      border: 1px solid $color-line-gray-l;
    }
    .cell {
      height: 44px;
      padding: 10px 10px;
      overflow: hidden;
    }
    .cell__hd {
      padding-right: 10px;
      border-right: 1px solid $color-line-gray-l;
      .icon {
        width: 25px;
        propor-padding: 100;
      }
    }
    .cell__bd {
      display: flex;
      align-items: center;
      height: 25px;
      padding-left: 10px;
      input {
        width: 100%;
        height: 100%;
        font-size: $font-size-medium;
      }
    }
    .cell__ft {
      display: flex;
      align-items: center;
      .btn-pass {
        box-sizing: border-box;
        height: 25px;
        line-height: 25px;
        padding: 0 6px;
        border: 1px solid $color-theme-btn-l;
        border-radius: 4px;
        color: $color-theme-btn-l;
        font-size: $font-size-medium;
      }
    }
  }
  .full-form {
    margin-top: 10px;
    font-size: $font-size-medium;
    .cells {
      background-color: #fff;
    }
    .cell {
      height: 45px;
      padding: 0 10px;
    }
    .cell__hd {
      box-sizing: border-box;
      width: 85px;
      padding-right: 10px;
      text-align: right;
    }
    .cell__bd {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 10px;
      input {
        width: 100%;
        height: 100%;
        font-size: $font-size-medium;
      }
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    padding: 0 30px;
    .btn {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      height: 40px;
      background-color: $color-theme-btn-l;
      border-radius: 5px;
      color: #fff;
      font-size: $font-size-medium;
    }
  }
  .col {
    position: relative;
    padding: 0 22px;
    font-size: $font-size-medium;
    .col-cell {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
    .col-item {
      color: $color-text;
    }
    .fast {
      display: flex;
      align-items: center;
      img {
        width: 15px;
        height: 15px;
        vertical-align: middle;
        align-items: center;
      }
      .text {
        padding-left: 5px;
      }
    }
  }
  .login-third {
    display: flex;
    position: relative;
    justify-content: center;
    margin-top: 20px;
    &:before {
      content: ' ';
      box-sizing: border-box;
      position: absolute;
      left: 20px;
      top: 50%;
      right: 70%;
      height: 1px;
      border-top: 1px solid $color-line-gray-l;
      color: $color-line-gray-l;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 5;
    }
    &:after {
      content: ' ';
      box-sizing: border-box;
      position: absolute;
      left: 70%;
      top: 50%;
      right: 20px;
      height: 1px;
      border-top: 1px solid $color-line-gray-l;
      color: $color-line-gray-l;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 5;
    }
  }
  .zhifubao-logo {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .img-cell {
      width: 10%;
      propor-padding: 149;
    }
  }
  input:disabled {
    background-color: rgba(0, 0, 0, 0);
  }
}
.login-about.full-view {
  background-color: $page-bgc;
  .col {
    padding: 0 25px;
  }
  .cell__ft {
    .img-code {
      position: relative;
      width: 90px;
      height: 45px;
    }
  }
}
</style>

