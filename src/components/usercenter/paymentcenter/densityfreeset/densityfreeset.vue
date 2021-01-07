<template>
  <div class="density-free-set">
    <nav-top title="小额免密" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="density-free">
         <div class="img">
           <img src="./img/pay.png" alt="">
         </div>
        <div class="title theme_font_black" v-if="payInfo.isFreePayPwd == 0">使用平台虚拟支付时无需输入密码</div>
        <div class="title theme_font_black" v-else>您已开启小额免密</div>
        <ul class="pay-list" v-if="payInfo.isFreePayPwd == 1">
          <li class="pay-item" @click="openPwdSet">
            <mt-cell :title="`${payInfo.freePayAmount}元\/笔`" :label="`支付金额≤${payInfo.freePayAmount}/笔时无需输入密码`" is-link>
            </mt-cell>
          </li>
        </ul>
        <div class="check" v-if="payInfo.isFreePayPwd == 0">
          <van-checkbox v-model="checked">同意</van-checkbox>
          <span class="register theme_font_red_i" @click="openRegister">《小额免密相关协议》</span>
        </div>
        <div class="btn theme_bg_red_i" @click="openDensitySet" v-if="payInfo.isFreePayPwd == 0">立即开启</div>
        <div class="btn" :class="{active: isClose}" @click="closeDensitySet" v-else>关闭小额免密</div>
        <van-action-sheet v-model="showBook" title="小额免密相关协议">
          <div class="book-content">
            使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码使用平台虚拟支付时无需输入密码
          </div>
        </van-action-sheet>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Cell} from 'mint-ui'
  import {Dialog} from 'vant'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        checked: false,
        showBook: false, // 协议内容
        isClose: false // 关闭按钮置灰
      }
    },
    created() {
    },
    mounted() {
      if (this.payInfo.isFreePayPwd == 0) {
        this.isClose = true
      }
    },
    methods: {
      openRegister() {
        // 打开协议的内容
        this.showBook = true
      },
      openDensitySet() {
        // 打开立即开启页面
        if (this.checked == false) {
          this.$toast('请阅读并同意免密协议')
        } else {
          this.$router.push({path: '/usercenter/changefreenum'})
        }
      },
      closeDensitySet() {
        // 关闭免密金额
        if (!this.isClose) {
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
                this.setPayInfo(this.$assign({}, this.payInfo, {isFreePayPwd: 0}))
                this.$bridgefunc.vuexStorage()
              })
            } else {
              // 密码错误
            }
            this.$Loading.close()
          })
        }
      },
      openPwdSet() {
        // 修改免密金额
        this.$router.push({path: '/usercenter/changefreenum'})
      },
      ...mapMutations(['setPayInfo'])
    },
    computed: {
      ...mapGetters(['payInfo'])
    },
    components: {
      [Dialog.name]: Dialog
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .density-free-set {
    .density-free {
      width: 90%
      margin 0 auto
      text-align: center
      padding-top: 40px
      .img {
        img {
          width: 150px
        }
      }
      .pay-list {
        text-align left
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

      .title, .btn {
        padding: 20px 0
        font-size: 16px
        font-weight: bold
      }
      .tips {
        padding: 15px 0
      }
      .check {
        padding 8px 10px
        display: flex
        justify-content: center
        align-items: center
        .register {
          color: #1945ec
        }
      }
      .btn {
        padding: 14px 0
        border-radius 20px
        color: #fff
        font-size: 16px
        font-weight bold
        background: #f80f16
      }
      .active {
        background: #adabab
      }
    }
  }
  .book-content {
    padding: 11px 15px
  }
  /deep/ .mint-cell-allow-right::after {
    width: 10px
    height: 10px
  }
</style>
