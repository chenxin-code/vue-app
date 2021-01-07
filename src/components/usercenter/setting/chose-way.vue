/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="chose-way login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="tip"><span class="tip-icon">请选择以下任一种方式进行校验</span></div>
      <div class="login-div">
        <div class="box-shadow">
          <div class="text-input">
            <div class="left">登录密码验证</div>
            <div class="cell-phone">
              <span class="right-now" @click="passwordLogin()">立即验证</span>
            </div>
          </div>
          <div class="text-input">
            <div class="left">短信验证</div>
            <div class="cell-phone">
              <span class="right-now" @click="codeLogin()">立即验证</span>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "index",
    components: {

    },
    data() {
      return {
      }
    },
    methods: {
      backEvent:function(){
        this.$router.go(-1);
      },
      passwordLogin:function () {
        this.$router.push({
          path: '/usercenter/passwordlogin'
        })
      },
      codeLogin:function () {
        this.$router.push({
          path: '/usercenter/codelogin'
        })
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .chose-way{
    width 100%
    height 100%
    overflow hidden
    .tip{
      height:30px;
      width:100%;
      background:#fbf8d9;
      line-height:30px;
      padding:0px 10px;
      .tip-icon{
        font-size:$font-size-small;
        line-height:30px;
        color:#e0782f;
        display:block;
        background:url("../../../../static/image/login2/tip-icon.png") 0px center no-repeat;
        background-size:10px 12px;
        padding-left:15px;
      }
    }
    .login-div {
      padding: 0px 10px 30px 10px;
      .box-shadow{
        border-bottom:1px  solid #e8e8e8;
        box-shadow: 0px 1px 8px #e8e8e8;
        border-radius:10px 0px 0px 5px;
        .text-input{
          padding:10px 0px 10px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom:1px  solid #f2f2f2;
          .left{
            font-size:$font-size-small;
          }
          .cell-phone{
            padding:6px 10px;
            .right-now{
              display:block;
              font-size:$font-size-small;
              font-weight:600;
              border:1px  solid #ef2d2e;
              color:#ef2d2e;
              border-radius:5px;
              padding:6px 10px;
            }
          }

        }
        .text-input:last-child{
          border-bottom:none;
        }
      }

    }
  }
</style>
