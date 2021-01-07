<template>
  <div>
    <button @click="loadVerCode" :disabled="btnStatus" class="btn_vercode" size="small" type="primary">
      &nbsp;|&nbsp;{{buttonCode}}
    </button>
  </div>
</template>

<script>
  export default {
    name: 'vercodebtn',
    props: {
      phone: [String, Number]
    },
    data() {
      return {
        buttonCode: '获取验证码',
        sec: 60,
        btnStatus: false
      }
    },
    methods: {
      loadVerCode: function () { // 父级页面校验成功后执行sendMsg()
        if (this.phone !== 'no') {
          if (!this.validatePhone()) {
            return
          }
        }
        // this.countDown()
        this.$emit('loadVerCode')
      },
      countDown: function () {
        let that = this
        let sec = that.sec
        if (sec === 0) {
          that.reset()
        } else {
          sec--
          that.sec = sec
          that.btnStatus = true
          that.buttonCode = `${sec}s重新发送`
          clearTimeout(this.timer)
          this.timer = setTimeout(function () {
            that.countDown()
          }, 1000)
        }
      },
      // 验证手机号是否正确
      validatePhone: function () {
        let that = this
        if (that.phone === '' || !(/^1(3|4|5|7|8|9)\d{9}$/.test(that.phone))) {
          this.$Toast('手机号不正确')
          return false
        } else {
          return true
        }
      },
      reset() {
        clearTimeout(this.timer)
        this.buttonCode = '获取验证码'
        this.sec = 60
        this.btnStatus = false
      }

    },
    mounted() {

    },
    watch: {
      countDownFlag(val) {
        if (val) {
          this.countDown()
          this.btnStatus = true
        }
      },
      codeBtnStatus(val) {
        console.log(val)
        this.btnStatus = this.codeBtnStatus

      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .btn_vercode {
    color: $color-theme-r
    background: transparent
    -webkit-appearance none
    border: none
    outline none
    &[disabled] {
      color: $color-text-l
    }
  }
</style>
