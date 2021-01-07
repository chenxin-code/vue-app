<template>
  <div class="no-apply-card">
    <nav-top title="办卡申请" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="no-apply-card-details">
      <div class="no-apply-card-content">
        <div class="card-info">
          <span class="tips" @click="openGuide">办卡指南</span>
          <van-swipe :autoplay="3000" indicator-color="white">
            <van-swipe-item>
              <div class="card-show">
                <img src="./image/banner@2x.png" alt="">
              </div>
            </van-swipe-item>
            <van-swipe-item>
              <div class="card-show">
                <img src="./image/banner1@2x.png" alt="">
                <!--<span class="tips">办卡指南</span>-->
              </div>
            </van-swipe-item>
            <van-swipe-item>
              <div class="card-show">
                <img src="./image/banner2@2x.png" alt="">
                <!--<span class="tips">办卡指南</span>-->
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="form-group">
          <div class="form-cell">
            <label for="userPhone" class="form-label">姓名</label>
            <input class="form-control" placeholder="请输入姓名" type="text" v-model="user.name" id="userName"/>
          </div>
          <div class="form-cell">
            <label for="userPhone" class="form-label">手机号</label>
            <input
              class="form-control"
              maxlength="11"
              type="tel"
              onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
              placeholder="请输入本人使用的11位手机号"
              id="userPhone"
              autosize
              pattern="[0-9]*"
              @input="onInput"
              v-model="user.phone">
            <!--<input class="form-control" placeholder="请输入本人使用的11位手机号" type="number" v-model="user.phone" id="userPhone"/>-->
          </div>
          <div class="form-cell">
            <label for="verifiCode" class="form-label">验证码</label>
            <input class="form-control" placeholder="请输入验证码" type="number" v-model="user.verifyCode" id="verifiCode"/>
            <span class="division">&nbsp;|&nbsp;</span>
            <div class="form-suffix">
              <count-button class="theme_font_red_i" @getSmsEvent="getMsgCode" :phone="user.phone"
                            ref="countBtn"></count-button>
            </div>
          </div>
          <div class="form-cell">
            <label for="verifiCode" class="form-label">身份证号</label>
            <input class="form-control" placeholder="请输入身份证号" v-model="user.identityCard"
                   id="identityCard"/>
            <div class="form-suffix">
            </div>
          </div>
          <div class="form-cell">
            <label for="verifiCode" class="form-label">推荐人</label>
            <input class="form-control" placeholder="选填" type="number" v-model="user.rfrCode" id="rfrCode"/>&nbsp;&nbsp;
            <div class="form-suffix" @click="scanCodeFunc">
              <img class="scan-icon" src="./image/icon2@2x.png" alt="">
            </div>
          </div>
        </div>
        <div class="upload-card">
          <div class="title">上传申请人本人身份证照片</div>
          <div class="upload-img">
            <div class="img" @click="openChangeImgPopup(1)">
              <div class="card">
                <img class="identity-img" :src="showFaceImgUrl" alt="">
                <img class="photograph" v-show="!showFaceImgBtn" src="./image/icon1@2x.png" alt="">
              </div>
              <div class="tips">人像面照</div>
            </div>
            <div class="img" @click="openChangeImgPopup(2)">
              <div class="card">
                <img class="identity-img" :src="showBackImgUrl" alt="">
                <img class="photograph" v-show="!showBackImgBtn" src="./image/icon1@2x.png" alt="">
              </div>
              <div class="tips">国徽面照</div>
            </div>
          </div>
        </div>
        <div class="table-view trade-style">
          <div class="table-view-cell" @click="changeTradeStyle">
            <div class="table-view-cell-arrow"></div>
            <div class="table-view-cell-text">
              <div class="left">配送方式</div>
              <div class="right">{{tradeStyle}}</div>
            </div>
          </div>
          <div class="table-view-cell" v-if="tradeStyle != '请选择'" @click="openChangeAddress">
            <div class="table-view-cell-arrow"></div>
            <div class="table-view-cell-text">
              <div class="left">
                <div class="self-mention" v-if="tradeStyle == '自提'">
                  <div class="title">
                    自提店铺：
                    <span class="text">{{$store.state.mall2.zitiAddress.storeName}}</span>
                  </div>
                  <div class="content">
                    地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;：
                    <span class="text">{{$store.state.mall2.zitiAddress.address}}</span>
                  </div>
                </div>
                <div class="self-mention" v-else-if="tradeStyle == '配送'">
                  <div class="title">
                    <span class="name">{{$store.state.mall2.selectAddress.receiverName}}&nbsp;&nbsp;</span>
                    <span class="text">{{$store.state.mall2.selectAddress.mobile}}</span>
                    <span class="tips" v-if="$store.state.mall2.selectAddress.isDefault == 1">默认</span>
                  </div>
                  <div class="content">
                    地址：
                    <span class="text">{{$store.state.mall2.selectAddress.addressFull}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="userApplyCardAuth && tradeStyle == '配送'" @click="showUseStoreList = true">
            <div class="table-view-cell-arrow"></div>
            <div class="table-view-cell-text">
              <div class="left">办卡网点</div>
              <div class="right">{{useStore ? useStore.ouName : '请选择'}}</div>
            </div>
          </div>

        </div>
        <div class="submit-btn" @click="applyCard">提交</div>
        <van-action-sheet v-model="showTradeStyle" title="请选择配送方式">
          <div class="style-popup">
            <div class="table-view">
              <div class="table-view-cell" v-for="(item, index) in styleList" :key="index" @click="changeStyle(item)">
                <div class="table-view-cell-text">{{item}}</div>
              </div>
            </div>
          </div>
        </van-action-sheet>
        <van-popup v-model="showUseStoreList" position="bottom">
          <van-picker show-toolbar title="选择办卡网点" :columns="useStoreList" value-key="ouName"
                      @cancel="showUseStoreList = false" @confirm="onConfirm"/>
        </van-popup>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import CountButton from '@/components/commonui/count-button'
  import Photo from '@/components/commonui/choosephoto'

  export default {
    name: '',
    data() {
      return {
        user: {
          name: '', // 姓名
          phone: '', // 手机号
          verifyCode: '', // 短信验证码
          identityCard: '', // 身份证号
          rfrCode: '', // 推荐人
        },
        codeBtnStatus: false,
        countDownFlag: false,
        showTradeStyle: false, // 配送方式弹框
        showFaceImgUrl: '', // 身份证正面
        showBackImgUrl: '', // 身份证背面
        styleList: ['配送', '自提'], // 配送方式
        tradeStyle: '请选择', // 配送方式回显
        showFaceBackImg: false, // 选择相机还是拍照弹框
        faceOrBack: '', // 选择是正面还是背面
        showFaceImgBtn: false, // 拍照正图标
        showBackImgBtn: false, // 拍照背图标
        distriMode: '', // 配送方式
        distriDetailAddr: '', // 配送地址
        pickupId: '', // 自提点id
        userAddressId: '', // 用户地址id
        frontOfId: '', // 身份证正面url
        backOfId: '', // 身份证反面url
        useStoreList: [], // 选择配送后需要再次选择
        showUseStoreList: false,
        useStore: null // 配送方式下用户选择的办卡网点
      }
    },
    watch: {
      'user.verifyCode': function (val, oldVal) {
        this.user.verifyCode = this.$util.checkVerifyCodeLenght(this.user.verifyCode);
      },
      '$store.state.mall2.selectAddress': {
        handler: function (val) {
          if (val && this.userApplyCardAuth) {
            this.getUseStoreList(val)
            console.log(val)
          }
        },
        deep: true
      }
    },
    created() {
    },
    mounted() {
      this.showFaceImgUrl = require('./image/rx@2x.png')
      this.showBackImgUrl = require('./image/gh@2x.png')
    },
    activated() {
      this.showTradeStyle = false
    },
    methods: {
      onConfirm(val) {
        this.showUseStoreList = false
        this.useStore = val
      },
      getUseStoreList(val) {
        this.$request.post('/app/json/user_apply_card/getUseStoreList', {cityId: val.cityId}).then(res => {
          if (res.status === 0) {
            this.useStoreList = res.data || []
          }
        })
      },
      scanCodeFunc() {
        this.$bridgefunc.scanCode((dic) => {
          this.user.rfrCode = dic.code
        });
      },
      applyCard() {
        console.log(this.$store.state.mall2.zitiAddress)
        // 用户申请办卡接口
        if (this.user.name == '') {
          this.$Toast('请输入姓名')
        } else if (this.user.phone == '') {
          this.$Toast('请输入手机号')
        } else if (this.user.verifyCode == '') {
          this.$Toast('请输入验证码')
        } else if (this.user.identityCard == '') {
          this.$Toast('请输入身份证号')
        } else if (this.showFaceImgUrl == '') {
          this.$Toast('请上传身份证人像面照片')
        } else if (this.user.showBackImgUrl == '') {
          this.$Toast('请上传身份证国徽面照片')
        } else if (this.tradeStyle == '请选择') {
          this.$Toast('请选择配送方式')
        } else {
          let paramsData = {
            token: this.$store.state.login.token,
            applyName: this.user.name, // 申请人姓名
            applyPhone: this.user.phone, // 申请人电话
            verifyCode: this.user.verifyCode, // 验证码
            applyIdNo: this.user.identityCard, // 申请人身份证号
            frontOfId: this.frontOfId, // 身份证正面url
            backOfId: this.backOfId, // 身份证反面url
            referee: this.user.rfrCode // 推加入id
          }
          if (this.tradeStyle == '配送') {
            if (this.userApplyCardAuth) {
              if (this.useStore) {
                paramsData.storeOuCode = this.useStore.ouCode
                paramsData.storeOuName = this.useStore.ouName
              } else {
                this.$Toast('请选择办卡网点')
              }
            }
            this.distriMode = 1
            this.distriDetailAddr = this.$store.state.mall2.selectAddress.addressFull // 配送地址
            this.userAddressId = this.$store.state.mall2.selectAddress.id // 用户地址id
          } else {
            this.distriMode = 2
            this.pickupId = this.$store.state.mall2.zitiAddress.id // 自提点id
            paramsData.storeOuCode = $store.state.mall2.zitiAddress.storeCode
            paramsData.storeOuName = $store.state.mall2.zitiAddress.storeName
          }
          this.$Loading.open()
          paramsData.distriMode = this.distriMode // 配送方式 1：配送 2：自提
          paramsData.distriDetailAddr = this.distriDetailAddr // 配送地址
          paramsData.pickupId = this.pickupId // 自提点id
          paramsData.userAddressId = this.userAddressId // 用户地址id

          this.$http.post('/app/json/user_apply_card/applyCard', paramsData).then(res => {
            let data = res.data
            if (data.status == 0) {
              this.$Toast('申请成功！')
              this.$router.go(-1)
            } else {
              this.$Toast(data.info)
            }
            this.$Loading.close()
          })
        }
      },
      linkFunc: function (picUrl, img1) {
        if (this.faceOrBack == 1) {
          this.showFaceImgUrl = img1
          this.showFaceImgBtn = true
          this.frontOfId = picUrl
        } else {
          this.showBackImgUrl = img1
          this.showBackImgBtn = true
          this.backOfId = picUrl
        }
      },
      openChangeImgPopup: function (type) {
        if (type == 1) {
          // 正面
          this.faceOrBack = 1
        } else {
          // 背面
          this.faceOrBack = 2
        }
        Photo.open({
          linkFunc: this.linkFunc,
          token: this.$store.state.login.token,
        });
      },
      //获取短信验证码
      getMsgCode: function (imgVerifyCode, uuid) {
        if (this.user.phone == '') {
          this.$Toast('手机号不能为空!')
          return;
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          phone: this.user.phone,
          smsType: '1110',
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取短信验证码成功')
            } else {
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
              this.$refs.countBtn.resetClock();
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
            this.$refs.countBtn.resetClock();
          }
        )
      },
      changeTradeStyle() {
        // 选择配送方式弹框
        this.showTradeStyle = true
      },
      changeStyle(item) {
        // 选择配送方式
        this.tradeStyle = item
        this.showTradeStyle = false
        this.useStore = null  // 选择重置
        // console.log(item)
        if (this.$store.state.login.token == '') {
          this.$util.toLogin();
        } else {
          this.$router.push({
            path: item == '配送' ? '/mall2/addresslist' : '/mall2/mypickupaddress?isOpenCard=1'
          })
        }
      },
      openChangeAddress() {
        // 打开地址页
        this.$router.push({
          path: this.tradeStyle == '配送' ? '/mall2/addresslist' : '/mall2/mypickupaddress?isOpenCard=1'
        })
      },
      onInput() {
        // 手机号校验
        this.user.phone = /^\d+/.exec(this.user.phone) ? /^\d+/.exec(this.user.phone)[0] : ''
        if (this.user.phone.length == 11) {
          let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
          if (!myreg.test(this.user.phone)) {
            this.user.phone = ''
            this.$Toast('请输入有效手机号！')
          }
        }
      },
      openGuide() {
        // 打开办卡指南
        this.$router.push('/apply-card-guide')
      }
    },
    computed: {
      userApplyCardAuth() {
        return this.$store.state.globalConfig.userApplyCardAuth == 1
      }
    },
    components: {
      CountButton
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .no-apply-card {
    .no-apply-card-details {
      overflow auto

      .no-apply-card-content {
        padding: 11px 15px
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow-y auto
        -webkit-overflow-scrolling touch

        .card-info {
          padding: 10px 0

          .card-show {
            position relative
            z-index: 1

            img {
              width: 100%
            }
          }

          .tips {
            position absolute
            top: 35px
            right: 15px
            z-index: 999
            background #d7151b
            border-top-left-radius 10px
            border-bottom-left-radius 10px
            padding: 2px 5px
            color: #fff
          }
        }

        .form-group {
          background: #fff
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 6px
          padding: 0 15px

          .form-cell {
            display flex
            align-items center
            padding 4px 0

            & + .form-cell {
              border-top: 0.5px solid #efecec
            }

            .form-label {
              flex-shrink 0
              width 90px;
              color: $color-text-l
            }

            .form-control {
              text-align right
              flex 1
              background: transparent
              height 34px;
              line-height: 34px;
              width 100%
              color: #222;
              font-size: 12px;
            }

            .division {
              color: $color-theme-r
            }

            .form-suffix {
              flex-shrink 0

              .scan-icon {
                width 20px;
              }
            }
          }
        }

        .upload-card {
          .title {
            padding: 15px 0
          }

          .upload-img {
            display flex
            justify-content space-between
            align-content center

            .img {
              width: 50%
              text-align center

              .card {
                position relative

                .identity-img {
                  width: 95%
                  height: 95px
                }

                .photograph {
                  position absolute
                  top: 50%
                  left: 50%
                  transform translate(-50%, -50%)
                  width: 50px
                }
              }

              .tips {
                padding: 5px 0
                color: $color-text-l
              }
            }
          }
        }

        .trade-style {
          background: #fff
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 6px
          padding: 5px 0
          margin: 10px 0

          .right {
            color: $color-text-l
          }

          .left {
            .self-mention {
              color: $color-text-d

              .title {
                padding: 8px 0

                .name {
                  font-size: 14px
                }

                .tips {
                  background #ff0019
                  color: #fffdef
                  padding: 1px 6px
                  border-radius 25px
                  font-size: 10px
                  margin: 0 10px
                }
              }
            }
          }
        }

        .submit-btn {
          background-color: #f02c2d;
          color: #fff;
          text-align: center;
          padding: 0.32rem 0;
          border-radius: 50px;
          width: 90%;
          margin: 0 auto
          box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

          &[disabled] {
            opacity 0.5
          }
        }

        .style-popup {
          padding: 10px 11px 40px 11px
        }
      }
    }
  }

  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius 10px
    border-top-right-radius 10px
  }

  /deep/ .van-swipe {
    border-radius 15px
  }
</style>
