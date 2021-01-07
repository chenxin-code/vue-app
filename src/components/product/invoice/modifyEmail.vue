<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="修改邮箱"></nav-top>
      <nav-content>
        <div class="publicInvoice">
          <van-cell-group>
            <van-field v-model.trim="email" label="邮箱地址" placeholder="请输入邮箱地址"/>
          </van-cell-group>
        </div>
        <p class="p">说明：在更改新邮箱后，点击提交，系统会将电子发票发送到更新后的邮箱。</p>
        <div class="answer theme_bg_red" @click="commit">提交</div>
      </nav-content>
    </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api"
  import {Toast} from 'vant'
    export default {
        name: "modifyEmail",
      mixins: [api],
      data() {
          return {
            email: '',
            id: ''
          }
      },
      created() {
          this.id = this.$route.query.id
      },
      methods: {
        commit() {
          let that = this
          if (!that.email) {
            Toast({
              message: '请输入邮箱',
              duration: 2000,
            });
            return;
          }
          var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          if (that.email && !re.test(that.email)) {
            Toast({
              message: '请输入正确的邮箱',
              duration: 2000,
            });
            return;
          }
          this.$Loading.open()
          let params = {
            token: this.$store.state.login.token,
            id: that.id,
            email: that.email
          }

          that.emailData(params).then(res => {
            this.$Loading.close()
            if (res.data.result) {
              that.$router.push({
                path: 'historyDetail',
                query: {
                  id: that.id
                }
              })
            }
          })
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto 10px auto;

    .van-cell-group {
      /deep/ .van-field__control {
        text-align: right;
      }

      /deep/ .van-field__control:disabled {
        color: #323233;
      }
    }
  }

  .p {
    color #878787
    margin-top 15px;
    padding: 0.266667rem 0.4rem;
    line-height 20px;
  }
  .answer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 18px;
  }
</style>
