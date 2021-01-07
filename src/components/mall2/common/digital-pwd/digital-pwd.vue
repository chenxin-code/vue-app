<template>
  <div class="mall2 digital-pwd" v-if="visible">
    <pop-view @closeEvent="visible = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">{{initData.title || title}}</div>
        <div class="digital-tip theme_font_gray" v-if="initData.payPwdState != '0'">{{initData.tips || tips}}</div>
        <van-password-input
          :value="value"
          info=""
          @focus="showKeyboard = true"
          v-if="initData.payPwdState != '0'"
        />
        <div class="digital-tip theme_font_gray" v-if="initData.payPwdState == '0'">
          <span>尚未设置支付密码，前往</span>
          <span class="set-btn theme_font_red" @click.stop="setPassword">设置</span>
        </div>
      </div>
      <van-number-keyboard
        v-if="initData.payPwdState != '0'"
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"/>
    </pop-view>
  </div>
</template>

<script>

  export default {
    name: 'digital-pwd',
    components: {},
    data() {
      return {
        initData: {
          payPwdState: '0' // 支付密码状态 0 未设置支付密码 1 支付密码已锁定 2 已设置支付密码
        },
        visible: false,
        value: '',
        showKeyboard: true,
        toSettingPwd: function () {
          console.log('toSettingPwd')
        },
        inputFinished: null,
        title: '虚拟支付密码',
        tips: '请输入虚拟支付的密码'
      }
    },
    methods: {
      setPassword: function () {
        this.toSettingPwd()
      },
      onInput: function (key) {
        this.value = (this.value + key).slice(0, 6);
        if (this.value.length == 6) {
          this.inputFinished(this.value)
        }
      },
      onDelete: function () {
        this.value = this.value.slice(0, this.value.length - 1)
      }
    },
    mounted() {
      this.value = ''
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .digital-pwd {
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 199;
    overflow hidden

    .digital-tip {
      padding 15px;
      text-align center;
      font-size 13px;

      .set-btn {
        margin -15px;
        padding 15px;
      }
    }
  }

</style>
