/**Created by liaoyingchao on 2019-12-17.*/

<template>
  <div class="cancel-user login2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="img-div">
          <img src="static/image/setting/canceluser.png">
        </div>
        <div class="tip">
          <p>注销后所有的用户权益都将删除，</p>
          <p>再次使用需要重新注册！</p>
        </div>
        <div class="common-btn theme_bg_red theme_font_white mt100" @click="cancelUser">立即注销</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "cancel-user",
    components: {},
    data() {
      return {}
    },
    methods: {
      cancelUser: function () {
        this.$MessageBox.confirm('账户注销后您所有的会员权益全部会随之注销，并将无法找回，例如电子券、积分等将收回，商城订单将无法申请售后，确认注销吗？', '提示', {confirmButtonText: '注销账户'}).then(action => {
          this.$router.push({
            path: '/usercenter/authentication'
          })
        }).catch(action => {
        });
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .cancel-user {
    width 100%
    height 100%
    overflow hidden
    .content {
      padding-top 20px;
      .img-div {
        display flex;
        justify-content center;
        align-items center;
        img {
          width 200px;
        }
      }
      .tip {
        margin-top 15px;
        text-align center;
        font-size 14px;
        p {
          padding 2px;
        }
      }
      .mt100 {
        margin: 20px;
      }
    }
  }
</style>
