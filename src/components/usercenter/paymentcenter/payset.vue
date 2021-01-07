<template>
  <div class="pay-settings">
    <nav-top title="支付设置" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="pay-setting">
      <div class="pay-box" v-if="pageInitShow">
<!--        支付方式-->
        <div class="table-view list">
          <div class="table-view-cell item" v-for="(item, index) in paylist" :key="index" @click="openPWD(item.type)" v-if="!item.isHide">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img :src="item.imgUrl" alt="">
                </div>
                <div class="text">{{item.name}}</div>
              </div>
            </div>
            <div class="table-view-cell-arrow"></div>
          </div>
        </div>
<!--        小额免密-->
        <div class="table-view list">
          <div class="table-view-cell item" @click="openDensityFreeSet">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img src="./image/icon5@2x.png" alt="">
                </div>
                <div class="text">小额免密</div>
              </div>
            </div>
            <div class="table-view-cell-arrow">
              <span v-if="pwdState.isFreePayPwd == 0">未开启</span>
              <span v-else>已开启</span>
            </div>
          </div>
        </div>
        <!--弹框 选择设置密码-->
        <div class="content-box" :class="{'mask': active}" v-show="showChangePwd">
          <div class="change-pwd-info">
            <div class="change-info-btn theme_font_black_i">
              <div class="pwd" @click="openmMdifyPwd">修改6位数字支付密码</div>
              <div class="pwd forget-pwd" @click="openForgetPwd">忘记6位数字支付密码</div>
            </div>
            <div class="cancel-btn theme_font_red_i" @click="cancelBtn">取消</div>
          </div>
        </div>
<!--        弹框 未设置数字支付密码提示-->
        <van-dialog
          v-model="show"
          title="提示"
          @confirm="confirm"
          confirmButtonText="立即设置"
        >
          <div class="content">请先设置6位数字支付密码</div>
        </van-dialog>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Cell} from 'mint-ui'
  import {Dialog} from 'vant'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        paylist: [
          {
            name: '数字密码',
            imgUrl: require("./image/icon1@2x.png"),
            type: '1',
            // isHide: true
          },
          {
            name: '手势密码',
            imgUrl: require("./image/icon2@2x.png"),
            type: '2',
            // isHide: true
          },
          {
            name: '指纹密码',
            imgUrl: require("./image/icon3@2x.png"),
            type: '3',
            isHide: true
          },
          {
            name: '刷脸支付',
            imgUrl: require("./image/icon4@2x.png"),
            type: '4',
            isHide: true
          }
        ],
        show: false, // 弹框 未设置数字支付密码提示
        pageInitShow: false, // 接口返回后渲染页面
        active: false, // 遮罩的背景
        showChangePwd: false, // 弹框选择设置密码
        pwdState: ''
      }
    },
    created() {
      this.getSupportTypes();
    },
    mounted() {
      this.paPayPwdSate()
    },
    methods: {
      getSupportTypes() {
        // 本机是否支持 刷脸以及指纹
        this.$bridgefunc.getSupportType((result) => {
          if (result.touchID == '1') {
            this.setShowWithID(3);
          }
          if (result.faceID == '1') {
            this.setShowWithID(4);
          }
        });
      },
      setShowWithID(type){
        for (let i = 0; i < this.paylist.length; i++) {
          let item = this.paylist[i];
          if(item.type == type){
            item.isHide = false;
          }
        }
      },
      async paPayPwdSate() {
        // 查看支付密码状态
        /**
         * 支付密码类型： 11：普通支付密码；12：手势支付密码；13:刷脸支付密码；14：指纹支付密码；
         * 只有数字密码存在服务器 剩下的都存在本地 根据本地是否有这些密码来判断 用户是需要走设置密码 还是开启关闭密码
         * payPwdState;            数字密码 0未设置支付密码 1支付密码已锁定 2已设置支付密码
           gesturePayPwdState;     手势密码  0未设置支付密码 1支付密码已锁定 2已设置支付密码
           fingerprintPayPwdState; 指纹密码 0未设置支付密码 1支付密码已锁定 2已设置支付密码
           facePayPwdState;        脸部识别密码 0未设置支付密码 1支付密码已锁定 2已设置支付密码
           isFreePayPwd;           1 已开启小额免密 0  未开启
           freePayAmount;          免密支付金额
           lockDate;               数字密码 锁定时间
           gesturePayPwdLockDate;  手势密码 锁定时间
           fingerprintPayPwdLockDate;指纹密码 锁定时间
           facePayPwdLockDate;     脸部识别密码 锁定时间
           defaultPayPwdMode;      默认开启的支付密码方式 11：普通支付密码；12：手势支付密码；13:刷脸支付密码；14：指纹支付密码；
         */
        let nArgs = await this.$bridgefunc.getArgsWithPromise();
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          deviceId: nArgs.deviceId
        }
        this.$http.post('/app/json/user/paPayPwdSate', paramsData).then(res => {
          this.pageInitShow = true
          let data = res.data
          if (data.status == 0) {
            // 商品列表
            this.pwdState = data.data
            this.setPayInfo(this.$assign({}, this.payInfo, {freePayAmount: this.pwdState.freePayAmount, isFreePayPwd: this.pwdState.isFreePayPwd}))
            this.$bridgefunc.vuexStorage()
          } else {
            this.$toast(data.info)
          }
          this.$Loading.close()
        })
      },
      openPWD(type) {
        if (this.pwdState.payPwdState == 0) {
          // 0未设置支付密码
          this.$router.push({path: '/usercenter/nosetpwd', query: {isSet: 0}})
        } else if (this.pwdState.payPwdState == 1) {
          // 1支付密码已锁定
          this.$Toast(`数字密码已被锁定，请您在${this.pwdState.lockDate}后重试`)
        } else if (this.pwdState.payPwdState == 2) {
          // 2已设置支付密码
          if (type == 1) {
            // 数字密码
            this.showChangePwd = true
            this.active = true // 遮罩的背景
          } else if (type == 2) {
            // 手势密码
            if (this.pwdState.gesturePayPwdState == 0) { // 0未设置支付密码 1支付密码已锁定 2已设置支付密码
              this.$router.push({path: '/usercenter/setgesture-set', query: {type: '1'}}) // 1设置 2修改
            } else if (this.pwdState.gesturePayPwdState == 1) {
              this.$Toast(`手势密码已被锁定，请您在${this.pwdState.gesturePayPwdLockDate}后重试`)
            } else {
              this.$router.push({path: '/usercenter/gestures-pwd-set', query: {defaultPayPwdMode: this.pwdState.defaultPayPwdMode}})
            }
          } else if (type == 3) {
            // 指纹密码
            if (this.pwdState.fingerprintPayPwdState == 1) { // 0未设置支付密码 1支付密码已锁定 2已设置支付密码
              this.$Toast(`指纹密码已被锁定，请您在${this.pwdState.fingerprintPayPwdLockDate}后重试`)
            } else {
              this.$router.push({path: '/usercenter/fingerprint-pwd-set', query: {defaultPayPwdMode: this.pwdState.defaultPayPwdMode, fingerprintPayPwdState: this.pwdState.fingerprintPayPwdState}})
            }
          } else if (type == 4) {
            // 刷脸支付
            if (this.pwdState.facePayPwdState == 1) { // 0未设置支付密码 1支付密码已锁定 2已设置支付密码
              this.$Toast(`刷脸支付功能已被锁定，请您在${this.pwdState.facePayPwdLockDate}后重试`)
            } else {
              this.$router.push({path: '/usercenter/face-pwd-set', query: {defaultPayPwdMode: this.pwdState.defaultPayPwdMode, facePayPwdState: this.pwdState.facePayPwdState}})
            }
          }
        }
      },
      cancelBtn() {
        // 弹框取消按钮
        this.showChangePwd = false // 已设置支付密码
        this.active = false // 遮罩的背景
      },
      openmMdifyPwd() {
        // 打开修改密码页面
        this.$router.push({path: '/usercenter/nosetpwd', query: {isSet: 1}}) // 修改支付密码
      },
      openForgetPwd() {
        // 打开忘记支付密码页面
        this.$router.push({path: '/usercenter/forgetPwd'})
      },
      confirm() {
        // 立即设置按钮
        this.$router.push({path: '/usercenter/nosetpwd', query: {isSet: 0}})
      },
      openDensityFreeSet() {
        // 打开免密设置页面
        if (this.pwdState.payPwdState == 0) {
          // 0未设置支付密码
          this.show = true
        } else if (this.pwdState.payPwdState == 1) {
          // 1支付密码已锁定
          this.$Toast(`数字密码已被锁定，请您在${this.pwdState.lockDate}后重新设置支付密码`)
        } else {
          this.$router.push({path: '/usercenter/densityfreeset'})
        }
      },
      ...mapMutations(['setPayInfo'])
    },
    computed: {
      ...mapGetters(['payInfo'])
    },
    components: {
      Cell,
      [Dialog.name]: Dialog
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .pay-settings {
    .pay-setting {
      background-color: #f8f8f8 !important
      .mask {
        background rgba(0, 0, 0, 0.4)
      }
      .pay-box {
        padding: 11px 8px
        .content-box {
          position absolute
          top 0
          left 0
          right: 0
          bottom 0
          padding: 0 10px
          .change-pwd-info {
            position fixed
            bottom 0
            left: 10px
            right: 10px
            padding-top: 10px
            text-align center
            font-size: 14px
            .change-info-btn, .cancel-btn {
              background: #fff
              margin-bottom: 10px
              border-radius 4px
              .pwd {
                padding: 18px 0
              }
              .forget-pwd {
                border-top: 1px solid #ddd
              }
            }
            .cancel-btn {
              padding: 18px 0
              font-weight bold
            }
          }
        }
      }
    }
  }

  /deep/ .mint-cell-allow-right::after {
    width: 10px
    height: 10px
  }
  .list {
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
    border-radius 4px
    margin-bottom: 10px
    background #fff
    padding: 1px
    .item {
      padding: 20px 15px
      .left {
        display flex
        justify-content left
        align-items center
        .img {
          padding-right: 10px
          img {
            width 15px
          }
        }
        .text {
          font-size 14px
        }
      }
    }
    .table-view-cell-arrow {
      font-size: 14px
    }
  }
  .content {
    padding: 30px
    text-align center
  }
  /deep/ .van-button--default {
    background $color-theme-r
    color: #fff
  }
</style>
