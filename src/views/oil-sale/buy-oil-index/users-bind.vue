<template>
  <div class="user-bind">
    <nav-top title="单位用户绑定" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="user-bind-container">
      <div class="user-bind-content result-show" v-if="state == 3">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img class="img" src="../assets/image/wait.png" alt="">
                </div>
                <div class="inp">申请审核中,请耐心等待！</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="user-bind-content result-show" v-if="state == 4">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img class="img" src="../assets/image/no.png" alt="">
                </div>
                <div class="inp">
                  <div class="result">审核失败</div>
                  <div class="tips-info">失败原因：{{userInfo.auditOpinion}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="query-success" v-show="bindSuccess">
        <div class="title">绑定申请提交成功</div>
        <img class="img" src="../assets/image/ok.png" alt="">
        <div class="tips">您的单位用户绑定信息已提交。<br/>请耐心等待后台审核，通过之后即可访问！</div>
      </div>
      <div class="user-bind-content result-show" v-show="!bindSuccess">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left special">
                <div class="img">
                  <img class="img" src="../assets/image/icon1@2x.png" alt="">
                </div>
                <div class="inp">
                  <input @blur="blur" type="text" :disabled="disabled" placeholder="请输入单位名称" v-model="companyName">
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left special">
                <div class="img">
                  <img class="img" src="../assets/image/icon2@2x.png" alt="">
                </div>
                <div class="inp">
                  <input @blur="blur" type="text" :disabled="disabled" placeholder="请输入单位税务编号" v-model="companyNum">
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text upload">
              <div class="upload-img" @click="uploadBtn(1)">
                <div class="no-img" v-show="showImgLicense">
                  <div class="img">
                    <img class="img" src="../assets/image/icon3@2x.png" alt="">
                  </div>
                  <div class="text">上传营业执照</div>
                </div>
                <div class="show-img" v-show="!showImgLicense">
                  <img :src="showLicenseUrl" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text upload">
              <div class="upload-img" @click="uploadBtn(2)">
                <div class="no-img" v-show="showImgProve">
                  <div class="img">
                    <img class="img" src="../assets/image/icon3@2x.png" alt="">
                  </div>
                  <div class="text">上传委托证明</div>
                </div>
                <div class="show-img" v-show="!showImgProve">
                  <img :src="showProveUrl" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="state != 3 && state != 4 && length == 0 && vipCheck == 1">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img class="img" src="../assets/image/ID@2x.png" alt="">
                </div>
                <div class="inp">
                  <input
                    @blur="blur"
                    type="text"
                    class="form-control"
                    onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                    autosize
                    placeholder="请输入身份证号"
                    v-model="idCard">
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="state != 3 && state != 4 && length == 0 && vipCheck == 1">
            <div class="table-view-cell-text">
              <div class="left special-tips">
                <div class="top">
                  <div class="img">
                    <img class="img" src="../assets/image/number@2x.png" alt="">
                  </div>
                  <div class="inp">
                    <input
                      @blur="blur"
                      class="form-control"
                      maxlength="11"
                      type="tel"
                      onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                      autosize
                      pattern="[0-9]*"
                      placeholder="设置校验手机号"
                      v-model="reservedPhone">
                  </div>
                </div>
                <div class="phone-tips">"校验手机号"不能是当前登陆手机号，主要用于初次设置密码及找回密码时接受验证码</div>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="state != 3 && state != 4 && length == 0 && vipCheck == 1">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img class="img" src="../assets/image/icon6@2x.png" alt="">
                </div>
                <div class="inp">
                  <input @blur="blur" type="text" maxlength="6" placeholder="短信验证码" v-model="reservedVerifyCode">
                </div>
              </div>
              <div class="right">
                |&nbsp;<count-button class="theme_font_blue_i" @getSmsEvent="getMsgCodeReserved" :phone="reservedPhone"
                                     ref="countBtnReserved"></count-button>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="state != 3 && state != 4">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img class="img" src="../assets/image/icon5@2x.png" alt="">
                </div>
                <div class="inp">
                  <input
                    @blur="blur"
                    disabled
                    class="form-control"
                    maxlength="11"
                    type="tel"
                    onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                    autosize
                    pattern="[0-9]*"
                    v-model="phone">
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="state != 3 && state != 4">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img class="img" src="../assets/image/icon6@2x.png" alt="">
                </div>
                <div class="inp">
                  <input @blur="blur" type="text" maxlength="6" placeholder="短信验证码" v-model="verifyCode">
                </div>
              </div>
              <div class="right">
                |&nbsp;<count-button class="theme_font_blue_i" @getSmsEvent="getMsgCode" :phone="phone"
                                     ref="countBtn"></count-button>
              </div>
            </div>
          </div>
          <div class="table-view-cell" @click="clickField">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="img">
                  <img class="img" src="../assets/image/icon5@2x.png" alt="">
                </div>
                <div class="company">所属公司</div>
              </div>
            </div>
            <div class="table-view-cell-arrow">{{ouName ? ouName : '公司选择'}}</div>
          </div>
        </div>
        <org-tree ref="address" @setAddressEvent="setAddressEvent"></org-tree>
      </div>
      <div class="bill-btn" v-if="state == 4">
        <div class="btn-show" @click="againBind">重新绑定</div>
        <div class="btn-show" @click="goBack">返回</div>
      </div>
      <div class="bill-btn" v-else-if="state == 3">
        <div class="btn-show" @click="goBack">返回</div>
      </div>
      <div class="bill-btn" v-else>
        <div class="btn-show" @click="bindBtn" v-show="!bindSuccess">立即绑定</div>
        <div class="btn-show" @click="goBack" v-show="bindSuccess">返回</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button'
  import eventBus from '@/utils/eventBus.js'
  import Photo from '@/components/commonui/choosephoto'


  export default {
    data() {
      return {
        bindSuccess: false, // 绑定成功后的提示内容
        showImgLicense: true, // 上传营业执照
        showImgProve: true, // 上传委托证明
        disabled: false, // 是否可输入
        actions: [
          {
            name: '相册',
          },
          {
            name: '拍照'
          },
        ],
        faceOrBack: '', // 选择是营业执照还是委托证明
        companyName: '', // 单位名称
        companyNum: '', // 单位税务编号
        phone: '', // 手机号
        reservedPhone: '', // 预留手机号
        idCard: '', // 身份证号
        reservedVerifyCode: '', // 校验手机号的验证码
        verifyCode: '', // 验证码
        showLicenseUrl: '', // 营业执照
        showProveUrl: '', // 委托证明
        licenseUrl: '', // 营业执照url
        proveUr: '', // 委托证明url
        userInfo: '', // 审核信息
        state: '', // 审核状态
        id: '',
        length: '', // 用来判断是否是第一次绑定单位
        vipCheck: '', // 是否校验手机号与密码配置 1 校验 其他不校验（2）
        ouCode: '', // 组织机构编码
        ouName: '' // 组织机构名称
      }
    },
    watch: {
      verifyCode(val) {
        this.verifyCode = this.$util.checkVerifyCodeLenght(this.verifyCode);
      },
      reservedVerifyCode(val) {
        this.reservedVerifyCode = this.$util.checkVerifyCodeLenght(this.reservedVerifyCode);
      }
    },
    mounted() {
      /**
       * 检查是否是会员(只有errorCode为1034时提示使用info其余情况均返回在data里，根据state判断)
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
      this.length = this.$route.query.length
      this.phone = this.$store.state.login.phone
      this.state = this.$route.query.state || ''
      console.log(this.state)
      this.id = this.$route.query.id
      if (this.state == 3 || this.state == 4) {
        this.disabled = true
      }
      if (this.state && this.id) {
        this.getBindVipUnitUserInfoById()
      }
      this.vipCheck = this.$store.state.globalConfig.vip_unit_check_phone
      console.log(this.vipCheck)
    },
    methods: {
      blur() {
        window.scroll(0,0)
      },
      setAddressEvent (data) {
        console.log(data.ouName)
        console.log(data.ouCode)
        this.ouName = data.ouName
        this.ouCode = data.ouCode
      },
      clickField() {
        if (this.state != 3 && this.state != 4) {
          this.$refs.address.initAddress()
        }
      },
      goBack() {
        eventBus.$emit('getVipVipUnitListByUserId')
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
      bindBtn() {
        // 立即绑定按钮
        if (this.companyName == '') {
          this.$Toast('请输入单位名称')
        } else if (this.companyNum == '') {
          this.$Toast('请输入单位税务编号')
        } else if (this.showLicenseUrl == '') {
          this.$Toast('请上传营业执照')
        } else if (this.showProveUrl == '') {
          this.$Toast('请上传委托证明')
        } else if (this.phone == '') {
          this.$Toast('请输入手机号')
        } else if (this.verifyCode == '') {
          this.$Toast('请输入验证码')
        } else if (this.vipCheck == 1) { // 有配置
          if (this.idCard == '' && this.length == 0) {
            this.$Toast('请输入身份证号')
          } else if (this.reservedPhone == '' && this.length == 0) {
            this.$Toast('请输入预留手机号')
          } else if (this.reservedVerifyCode == '') {
            this.$Toast('请输入预留手机号验证码')
          }
        } else {
          this.bindVipUnitUser()
        }
      },
      getBindVipUnitUserInfoById() {
        this.$request.post('/app/json/user/getBindVipUnitUserInfoById', {
          id: this.id
        }).then(res => {
          if (res.status === 0) {
            this.userInfo = res.data
            this.companyName = this.userInfo.departName
            this.companyNum = this.userInfo.taxCode
            this.showLicenseUrl = this.userInfo.businessLicenseUrl
            this.licenseUrl = this.showLicenseUrl
            this.showProveUrl = this.userInfo.businessEntrustUrl
            this.proveUr = this.showProveUrl
            this.showImgLicense = false
            this.showImgProve = false
            this.ouName = this.userInfo.ouName
          } else {
            this.$Toast(res.info)
          }
        })
      },
      bindVipUnitUser() {
        this.$request.post('/app/json/user/bindVipUnitUser', {
          taxCode: this.companyNum, // 单位税务编号
          departName: this.companyName, // 单位名称
          smsVerifyCode: this.verifyCode, // 短信验证码
          businessLicenseUrl: this.licenseUrl, // 营业执照url
          businessEntrustUrl: this.proveUr, // 委托书照片url
          vipUserIdCard: this.idCard, // 大客户用户身份证号
          vipUserPhone: this.reservedPhone, // 大客户用户绑定填写的手机号
          ouCode: this.ouCode, // 组织机构编码
          ouName: this.ouName // 组织机构名称
      }).then(res => {
          if (res.status === 0) {
            this.bindSuccess = true
          } else if (res.errorCode == 2056) {
            this.$Toast('该单位已被绑定')
          } else {
            this.$Toast(res.info)
          }
          this.$refs.countBtn.resetClock()
          this.$refs.countBtnReserved.resetClock()
        })
      },
      uploadBtn(type) {
        // 选择相机拍照弹框
        if (this.state != 3 && this.state != 4) {
          if (type == 1) {
            // 营业执照
            this.faceOrBack = 1
          } else {
            // 委托证明
            this.faceOrBack = 2
          }
          Photo.open({
            linkFunc: this.linkFunc,
            token: this.$store.state.login.token,
          });
        }
      },
      linkFunc: function (picUrl, img1) {
        if (this.faceOrBack == 1) {
          this.showLicenseUrl = picUrl
          this.showImgLicense = false
          this.licenseUrl = picUrl
        } else {
          this.showProveUrl = picUrl
          this.showImgProve = false
          this.proveUr = picUrl
        }
      },
      //获取短信验证码 校验手机号
      getMsgCodeReserved(imgVerifyCode, uuid) { // reservedPhone
        this.$refs.countBtnReserved.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          phone: this.reservedPhone,
          smsType: '1020',
          imgVerifyCode: imgVerifyCode,
          uuid: uuid,
          category: 'oilsale'
        };
        this.sendSms(paramsData, url)
      },
      //获取短信验证码 本机
      getMsgCode: function (imgVerifyCode, uuid) {
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          phone: this.phone,
          smsType: '1020',
          imgVerifyCode: imgVerifyCode,
          uuid: uuid,
          category: 'oilsale'
        };
        this.sendSms(paramsData, url)
      },
      sendSms(paramsData, url) {
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取短信验证码成功')
            } else {
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
              this.$refs.countBtn.resetClock();
              this.$refs.countBtnReserved.resetClock();
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
            this.$refs.countBtn.resetClock();
            this.$refs.countBtnReserved.resetClock();
          }
        )
      },
      againBind() {
        // 重新绑定按钮
        this.state = ''
        this.disabled = false
        // this.$assign(this.$data, this.$options.data())
      }
    },
    components: {
      CountButton,
      orgTree: () => import("@/components/base/org-tree")
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"
  @import "~@/common/stylus/variable.styl"

  .user-bind {
    background-color: #f8f8f8 !important

    .user-bind-container {
      padding: 11px 15px
      -webkit-overflow-scrolling touch
      overflow-y auto

      .result-show {
        margin-bottom: 10px !important

        .inp {
          line-height 20px

          .tips-info {
            color: $color-text-d
          }
        }
      }

      .user-bind-content {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        background: #fff
        border-radius 4px
        margin-bottom: 20px

        .left {
          display flex
          justify-content left
          align-items center

          .img {
            vertical-align top
            padding-right: 5px

            img {
              width: 30px
            }
          }

          .inp {
            input {
              line-height 34px
            }
          }
        }
        .special-tips {
          display inline-block
          width: 100%
          .top {
            display flex
            justify-content left
            align-items center
          }
          .phone-tips {
            font-size 10px
            color: $color-text-d
            line-height 20px
          }
        }

        .special {
          flex: 1

          .inp {
            width: 100%

            input {
              width: 100%
            }
          }
        }

        .right {
          color: $color-line-gray-l
          display flex

          .text {
            color: #009df8
          }
        }

        .upload {
          padding: 13px 0

          .upload-img {
            width: 100%
            color: $color-text-l
            line-height 20px

            .no-img {
              display flex
              justify-content center
              align-items center
              flex-direction column

              .img {
                width: 50px
              }
            }

            .show-img {
              text-align center
              width: 100%
              height: 100%

              img {
                width: 250px
                height: 74px
              }
            }
          }


        }
      }

      .bill-btn {
        text-align center
        font-size 14px
        display flex
        margin-top:10px

        .btn-show {
          flex: 1
          border-radius 20px
          background: #009df8
          padding: 13px 0
          color: #fff
          font-weight bold

          & + .btn-show {
            margin-left: 10px
          }
        }
      }
    }

    .tips-content {
      padding: 15px 20px

      .title {
        text-align center
        padding: 10px 0
        font-size: 14px
        color: #009df8
        font-weight bold
      }

      .content {
        color: $color-text-d
        line-height 18px
        text-align center
        padding-bottom: 10px
      }

      .btn-group {
        display flex
        justify-content center
        align-items center
        padding: 15px 10px 5px 10px

        .btn {
          border-radius 20px
          background: #009df8
          padding: 8px 0
          width: 70px
          text-align center
          color: #fff
          font-weight bold
        }
      }
    }
  }

  .change-style {
    /deep/ .van-popup {
      width: 100%
      border-radius 0
    }
  }

  input:disabled {
    background-color: #fff
    color: $color-text-d
  }

  .query-success {
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
    background: #fff
    border-radius 4px
    padding: 30px
    text-align center
    line-height 24px

    .title {
      font-size: 14px
    }

    .tips {
      color: $color-text-d
    }

    img {
      margin-top: 10px
      width: 40px
    }
  }
  .company {
    color: $color-text-d
  }
</style>
