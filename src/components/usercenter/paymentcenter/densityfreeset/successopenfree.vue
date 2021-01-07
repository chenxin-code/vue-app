<template>
  <div class="density-free-set">
    <nav-top title="小额免密" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="density-free">
        <div class="img">
          <img src="./img/pay.png" alt="">
        </div>
        <div class="tips">您已开启小额免密</div>
        <ul class="pay-list">
          <li class="pay-item" @click="openPwdSet">
            <mt-cell :title="`${freePayAmount}元\/笔`" :label="`支付金额≤${freePayAmount}/笔时无需输入密码`" is-link>
            </mt-cell>
          </li>
        </ul>
        <div class="btn theme_bg_red_i" @click="openDensitySet">关闭小额免密</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Cell} from 'mint-ui'
  import {Dialog} from 'vant'

  export default {
    name: '',
    data() {
      return {
        freePayAmount: '', // 免密金额
        showBook: false // 协议内容
      }
    },
    created() {
    },
    mounted() {
      this.freePayAmount = this.$route.query.freePayAmount
      console.log(this.freePayAmount)
    },
    methods: {
      openBook() {
        // 打开协议的内容
        this.showBook = true
      },
      openPwdSet() {
        // 修改免密金额
        this.$router.push({path: '/usercenter/changefreenum', query: {freePayAmount: this.freePayAmount}})
      },
      openDensitySet() {
        // 关闭免密金额
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token
        }
        this.$http.post('/app/json/user/closeFreePay', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            Dialog.alert({
              title: '提示',
              message: '已关闭免密',
            }).then(() => {
              if (this.$route.query.payset == 1) {
                // this.$router.go(-1)
              } else {
                // this.$router.go(-2)
              }
            })
          } else {
            // 密码错误
          }
          this.$Loading.close()
        })
      }
    },
    computed: {},
    components: {
      Cell,
      [Dialog.name]: Dialog
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .density-free-set {
    .density-free {
      width: 95%
      margin 0 auto
      padding-top: 40px
      .img {
        text-align center
        img {
          width: 150px
        }
      }
      .tips {
        font-size: 14px
        text-align center
        font-weight bold
        padding: 15px 0
      }
      .pay-list {
        margin: 20px 0
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        border-radius 4px
        .pay-item {
          padding: 5px 0
          border-bottom 1px solid rgba(197, 197, 197, 0.3)
        }
        .pay-item:last-child {
          border: none
        }
      }
      .btn {
        margin-top: 10px
        padding: 14px 0
        border-radius 20px
        color: #fff
        font-size: 16px
        text-align center
        font-weight bold
      }
    }
  }
  /deep/ .mint-cell-allow-right::after {
    width: 10px
    height: 10px
  }
</style>
