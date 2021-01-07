<template>
  <div class="buy-oil-login" v-if="pageShow">
    <nav-top title="单位选择" @backEvent="backEvent"></nav-top>
    <nav-content class="buy-oil-login-container">
      <div class="img">
        <img src="../assets/image/login-tx.png" alt="">
      </div>
      <div class="no-set-pwd" v-if="setPwd">
        <div class="pwd-inp">
          <div class="passwords">
            <input placeholder="请输入登录密码" :type="isShowPwd?'text':'password'" v-model="passwords"/>
          </div>
          <div class="show-passwords">
            <img :src="isShowPwd?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"
                 @click="showPassword()"/>
          </div>
        </div>
        <div class="tips" @click="confirmPwd">忘记密码?</div>
        <div class="bill-btn next-btn" @click="loginBtnPwd">
          <div class="btn-show">下一步</div>
        </div>
      </div>
      <van-dialog
        v-model="show"
        title="密码设置提醒"
        show-cancel-button
        @cancel="backEvent"
        @confirm="confirmPwd"
        confirmButtonText="立即设置"
        cancelButtonText="暂不设置"
      >
        <div class="content">当前尚未设置登录密码,为了安全起见,需要先进行密码的设置,才能进入。</div>
      </van-dialog>
      <div class="set-pwd" v-if="!setPwd">
        <ul class="company-list">
          <li class="company-item" @click="newAddCompany">
            <img src="../assets/image/add-icon.png" alt="">
            新增单位
          </li>
          <li
            class="company-item"
            v-for="(item, index) in vipUnitUserCodeInfo"
            :key="index"
            :class="{change: changeItem == index}"
            @click="changeCompany(item, index)"
          >
            {{item.departName}}
            <span class="state-tips" v-if="item.state == 2">（已锁定）</span>
            <span class="state-tips" v-else-if="item.state == 3">（待审核）</span>
            <span class="state-tips" v-else-if="item.state == 4">（审核拒绝）</span>
          </li>
        </ul>
        <div class="bill-btn">
          <div class="btn-show" :class="{isClick: changeItem == -1}" @click="loginBtn">{{btnText}}</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'
  import eventBus from '@/utils/eventBus.js'

  export default {
    data() {
      return {
        changeItem: -1,
        vipUnitUserCodeInfo: '', // 单位用户信息
        changeCode: '', // 所选单位code
        companyItem: '', // 各个单位信息
        btnText: '进入', // 按钮显示字样
        passwords: '',
        isShowPwd: false,
        show: false,
        setPwd: true, // 是否设置密码
        state: '',
        vipCheck: '', // 是否校验手机号与密码配置 1 校验 其他不校验（2）
        pageShow: false
      }
    },
    created() {
      if (!this.$store.state.login.token) {
        this.$util.toLogin()
      } else {
        this.getVipVipUnitListByUserId()
        eventBus.$on('getVipVipUnitListByUserId', () => {
          this.getVipVipUnitListByUserId()
        })
        this.vipCheck = this.$store.state.globalConfig.vip_unit_check_phone
        console.log(this.vipCheck)
      }
    },
    methods: {
      backEvent: function () {
        this.$keepaliveHelper.deleteCache(this)
        this.$router.go(-1)
      },
      /**
       * 检查是否是会员
       * 1034 该账号暂未绑定单位用户
       * 2054 第三方用户正在审核中
       * 2055 第三方用户被锁定
       * 2057 第三方审核失败
       * 2056 重复绑定
       * state
       * 0 未绑定
       * 1 已绑定
       * 2 已锁定
       * 3 待审核
       * 4 审核拒绝
       */
      getVipVipUnitListByUserId() {
        // （一个人可绑定多个单位）直分销首页需要添加单位选择，以及单位新增。根据不同的单位，展示不同的信息
        this.$request.post('/app/json/user/getVipVipUnitListByUserId', {
          state: ''
        }).then(res => {
          this.pageShow = true
          if (res.status === 0) {
            /**
             * 获取是否设置过密码
             */
            this.vipUnitUserCodeInfo = res.data.reverse()
            let vipUserPassword = ''
            this.vipUnitUserCodeInfo.forEach(item => {
              if (item.state == 1) {
                this.state = 1
              }
              if (item.vipUserPassword) {
                vipUserPassword = item.vipUserPassword
              }
            })

            if (this.vipUnitUserCodeInfo.length) {
              if (this.vipCheck == 1) {
                console.log('有配置')
                /**
                 * 单位列表有数据 并且 配置了校验手机号和设置密码流程
                 * 走该流程
                 */
                if (!vipUserPassword && this.state == 1) {
                  // 没有设置过密码 且有已审核的单位 弹出设置密码的弹框
                  // (不会存在已设置密码 没有已审核单位的情况 设置密码都是在有已审核单位的前提下设置的)
                  this.show = true
                } else if (!vipUserPassword && this.state != 1) {
                  // 没有设置密码 也没有审核通过的单位 正常显示绑定单位页面
                  this.show = false
                  this.setPwd = false
                } else if (vipUserPassword) {
                  // 设置了密码 （说明有已审核的单位）弹出输入密码的界面
                  this.show = false
                }
              } else {
                console.log('无配置')
                /**
                 * 单位列表有数据 并且 没有配置
                 * 正常显示绑定单位页面
                 */
                this.show = false
                this.setPwd = false
              }
            } else {
              console.log('无数据')
              // 单位列表没有数据
              this.setPwd = false
            }
          } else {
            this.$Toast(res.info ? res.info : '获取绑定单位信息失败')
          }
        })
      },
      loginBtnPwd() {
        // 输入密码登录按钮
        if (!this.passwords) {
          this.$toast('请输入登录密码')
        } else {
          this.$request.post('/app/json/user/vipUnitUserLogin', {
            vipUserPassword: this.passwords // 登录密码
          }).then(res => {
            if (res.status === 0) {
              this.$Toast('登录成功')
              this.setPwd = false
            } else {
              this.$Toast(res.info ? res.info : '登录失败')
            }
          })
        }
      },
      changeCompany(item, index) {
        // 选择单位
        this.changeItem = index
        this.changeCode = item.vipUnitUserCode
        this.companyItem = item
        console.log(item)
        this.setVipUnitUser(this.$assign({}, this.vipUnitUser, {vipUnitUserCode: item.vipUnitUserCode, vipUnitUserId: item.vipUnitUserId}))
        this.$bridgefunc.vuexStorage()

        if (this.companyItem.state == 1) {
          this.btnText = '进入'
        } else {
          this.btnText = '查看详情'
        }
      },
      loginBtn() {
        // 登录查看详情按钮按钮
        if (this.changeCode != '') {
          if (this.companyItem.state == 1) {
            this.$router.push({path: '/buy-oil-index',query: {vipUnitUserCode:this.companyItem.vipUnitUserCode}})
          } else {
            this.$router.push({path: '/users-bind', query: {state: this.companyItem.state, id: this.companyItem.id, length: this.vipUnitUserCodeInfo.length}})
          }
        }
      },
      newAddCompany() {
        // 新增单位
        this.$router.push({path: '/users-bind', query: {state: this.state, length: this.vipUnitUserCodeInfo.length}})
      },
      showPassword() {
        if (this.isShowPwd) {
          this.isShowPwd = false
        } else {
          this.isShowPwd = true
        }
      },
      confirmPwd() {
        // 去设置密码
        this.$router.push({path: '/set-pwd', query: {vipUnitUserCodeInfo: this.vipUnitUserCodeInfo.length ? JSON.stringify(this.vipUnitUserCodeInfo[0]) : ''}})
      },
      ...mapMutations(['setVipUnitUser'])
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $color = #3c9df3
  .buy-oil-login {
    background-color: #f8f8f8 !important

    .buy-oil-login-container {
      display flex
      flex-direction column
      padding: 0 15px

      .img {
        text-align center
        padding: 20px 0
        flex-shrink 0

        img {
          width: 65px
        }
      }
      .set-pwd {
        flex 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        .company-list {
          padding-bottom: 70px
          .company-item {
            background #fff
            padding: 15px 0
            margin-bottom: 10px
            border-radius 4px
            display flex
            justify-content center
            align-items center
            position relative
            overflow hidden
            .state-tips {
              color: $color-theme-r
            }

            img {
              width: 15px
              margin-right: 5px
            }

            &.change::before {
              content ''
              position absolute
              right -17px
              bottom -17px
              border 15px solid transparent
              border-left-color $color
              transform rotate(45deg)
            }
          }
        }

      }
      .no-set-pwd {
        margin-top: 20px
        .pwd-inp {
          background #fff
          padding: 8px 15px
          border-radius 25px
          display: flex;
          justify-content: space-between;
          align-items center;
          margin-bottom: 10px
          .passwords {
            width: 85%;
            input {
              color #323233;
              line-height 28px
              display: block;
              width: 100%;
              font-size: $font-size-medium;
            }
          }
          .show-passwords {
            width: 25px;
            height: 14px;
            padding-right: 10px;
            padding-top: 4px;
            extend-click()
            img {
              display: block;
              width: 100%;
            }
          }
        }
        .tips {
          text-align right
          padding: 10px 0
          color: $color-text-d
        }
      }
      .content {
        padding: 30px 15px
        line-height 22px
        color: $color-text-d
      }
      /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
        background $color
        color: #fff
      }
      .bill-btn {
        padding: 10px 10px 20px 10px
        text-align center
        font-size 14px
        flex-shrink 0
        position: fixed;
        bottom: 0;
        left: 10px;
        right: 10px
        background-color: #f8f8f8

        .btn-show {
          border-radius 20px
          background: $color
          padding: 13px 0
          color: #fff
          font-weight bold

          & + .btn-show {
            margin-top: 10px
          }
        }

        .isClick {
          opacity 0.5
        }
      }
      .next-btn {
        padding: 10px 0 20px 0
        position relative
        left: 0;
        right: 0
      }
    }
  }
</style>
