<template>
  <div class="employees-card">
    <nav-top title="绑定员工卡" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="employees-card-container">
      <div class="main">
        <div class="inp">
          <div class="left">
            <input
              type="tel"
              readonly
              clickable
              placeholder="输入员工卡卡号"
              onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
              v-model="employeesCard"
              @click="showKeyboard = true">
            <van-icon size="18px" name="close" v-if="employeesCard" @click="deleteBtn" />
          </div>
          <div class="right" v-if="checkCard">
            <van-icon size="20px" v-if="check" name="checked" color="#1ac502" />
            <van-icon size="20px" name="clear" v-else color="#F80F16" />
          </div>
        </div>
        <div class="tips" v-if="checkCard">
          <div class="info" v-show="check">这是一张可以绑定的员工卡！</div>
          <div class="info" v-show="!check">这张卡不能绑定！</div>
        </div>
      </div>
      <div class="btn" @click="bindEmployeeCard" :class="{active: check == true}">绑定员工卡</div>
      <!--      数字键盘-->
      <van-number-keyboard
        :show="showKeyboard"
        close-button-text="完成"
        @blur="showKeyboard = false"
        @input="onInput"
        @delete="onDelete"
      />
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        showKeyboard: false, // 数字键盘
        employeesCard: '', // 员工卡号
        checkCard: false, // 校验卡号
        check: false // 对与错
      }
    },
    mounted() {
    },
    watch: {
      // 通过watch来设置空格
      employeesCard(newValue, oldValue) {
        if (newValue.length > oldValue.length) { // 文本框中输入
          if (newValue.length == 4 || newValue.length == 9 || newValue.length == 14 || newValue.length == 19) {
            this.employeesCard += ' '
          }
        } else { // 文本框中删除
          if (newValue.length === 20 || newValue.length === 15 || newValue.length === 10 || newValue.length === 5) {
            this.employeesCard = this.employeesCard.trim()
          }
        }
      }
    },
    methods: {
      deleteBtn() {
        // 删除按钮
        this.employeesCard = ''
        this.checkCard = false
      },
      onInput(value) {
        if (this.employeesCard.length < 23) {
          this.employeesCard = this.employeesCard + value
        }
        if (this.employeesCard.length == 23) {
          this.verifyCardNo(this.employeesCard)
        } else {
          this.checkCard = false
        }
      },
      onDelete() {
        this.employeesCard = this.employeesCard.slice(0, this.employeesCard.length - 1)
        this.checkCard = false
      },
      bindEmployeeCard() {
        // 绑卡
        if (this.employeesCard.length != 23) {
          this.$Toast('请输入正确的员工卡号')
        } else if (this.check == true) {
          this.$request.post('/app/json/app_employee_card/bindEmployeeCard', {
            cardNo: this.employeesCard.replace(/\s*/g, "") // 去掉卡号的空格
          }).then(res => {
            if (res.status === 0) {
              this.$router.go(-1)
              this.$Toast('绑定成功')
            } else {
              this.$Toast(res.info ? res.info : '绑定失败')
            }
          })
        }
      },
      verifyCardNo(cardNo) {
        // 校验员工卡
        this.$request.post('/app/json/app_employee_card/verifyCardNo', {
          cardNo: cardNo.replace(/\s*/g, "") // 去掉卡号的空格
        }).then(res => {
          this.checkCard = true
          if (res.result === 'success') {
            this.check = true
          } else {
            this.check = false
          }
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .employees-card {
    background-color: #f8f8f8 !important
    .employees-card-container {
      padding: 11px 14px
      .main {
        height 200px
        .inp {
          display flex
          justify-content space-between
          align-items center
          .left {
            flex: 1
            display flex
            justify-content space-between
            align-items center
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            border-radius 6px
            padding: 5px 15px
            background #fff
            input {
              flex: 1
              line-height 34px
            }
            /deep/ .van-icon {
              width: 20px
            }
          }
          .right {
            padding-left: 10px
          }
        }
        .tips {
          color: $color-text-d
          padding: 15px 0
        }
      }
      .btn {
        padding: 15px
        text-align center
        color: #fff
        background $color-theme-r
        border-radius 20px
        opacity 0.5
      }
      .active {
        opacity 1
      }
    }
  }
</style>
