/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="motion-launch">
    <nav-top :no-back="true">
      <!--<div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px; font-size: 12px;" @click="registerEvent">注册</div>-->
    </nav-top>
    <nav-content>
      <div class="motion-div">
        <div class="motion-top">
          <p class="user-name">18285169694</p>
          <p class="text">请绘制手势密码</p>
        </div>
        <ul class="sudoku">
          <li class="sudoku-item">
            <span class="round"></span>
            <span class="round"></span>
            <span class="round"></span>
          </li>
          <li class="sudoku-item">
            <span class="round"></span>
            <span class="round"></span>
            <span class="round"></span>
          </li>
          <li class="sudoku-item">
            <span class="round"></span>
            <span class="round"></span>
            <span class="round"></span>
          </li>
        </ul>
        <div class="login-way">
          <span class="way-item">切换账号</span>
          <span class="way-item">登录验证码验证</span>
        </div>
      </div>
    </nav-content>
    <Mark></Mark>
  </div>
</template>

<script>
  import Mark from './mark'
  export default {
    name: "index",
    components: {
      Mark
    },
    data() {
      return {

      }
    },
    methods: {
      registerEvent: function () {

      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .motion-launch{
    width 100%
    height 100%
    overflow hidden
    .motion-div {
      margin 60px 65px;
      text-align:center;
      .motion-top{
        overflow:hidden;
        .user-name{
          font-size:$font-size-medium;
          color:#333;
          font-weight:600;
          line-height:20px;
        }
        .text{
          font-size:$font-size-small;
          font-weight:600;
          line-height:20px;
          color:#666;
        }
      }
    }
    .sudoku{
      margin-top:5px;
      .sudoku-item{
        padding:40px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .round{
          width:30px;
          height:30px;
          background:#dedede;
          border-radius:50%;
          -webkit-border-radius:50%;
          display:block;
        }
      }

    }
    .login-way{
      width:100%;
      overflow:hidden;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .way-item{
        display:block;
        font-size:$font-size-medium;
        color:#333;
        line-height:34px;
      }

    }
  }
</style>
