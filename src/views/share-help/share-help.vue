<template>
  <div class="share-help">
    <nav-top title="分享助力" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="share-help-container">
      <div class="logo">
        <img src="./image/logo.png" alt="">
      </div>
      <div class="phone">手机号：{{getTel(posterInfo.userName)}}</div>
      <div class="text">我是<span class="special">{{getTel(posterInfo.userName)}}</span></div>
      <div class="text">第<span class="special">{{posterInfo.number}}</span>位为奋战在一线抗疫逆行英雄致敬</div>
      <div class="info">
        <p>我在云南倡议全省车主</p>
        <p>使用“云南石油”APP无接触支付</p>
        <p>拒绝给病毒可“乘”之机</p>
      </div>
      <div class="title-img">
        <img src="./image/title.png" alt="">
      </div>
      <div class="btn" @click="shareBtn">
        <p class="top">参与助力</p>
        <p class="bottom">参与助力，可得15元加油优惠券</p>
      </div>
      <div class="qrcode">
        <img src="./image/qr.png" alt="">
      </div>
      <van-popup v-model="showPopup" :style="{ height: '40%' }">
        <div class="close-icon" @click="showPopup = false">
          <img src="./image/close.png" alt="">
        </div>
        <div class="popup-main">
          <div class="title">参与助力</div>
          <div class="inp">
            <input type="tel" @blur="blur" @input="yzPhone" v-model="phone" maxlength="11" placeholder="输入手机号">
          </div>
          <div class="inp message" v-if="checkPhoneExist == 1">
            <div class="show-message">
              <input @blur="blur" type="text" v-model="code" placeholder="输入验证码">
              <count-button class="blue messgae-inp" @getSmsEvent="getMsgCode" :phone="phone"
                            ref="countBtn"></count-button>
            </div>
          </div>
          <div class="btn popup-btn" @click="queryShare">确定分享</div>
        </div>
      </van-popup>
      <van-popup class="tips-show" v-model="showTips" :style="{ height: '20%' }">
        <div class="close-icon tips-icon" @click="showPopup = false">
          <img src="./image/jt.png" alt="">
        </div>
        <div class="popup-main">
          <div class="tips-title">提示</div>
          <div class="tips-content">点击右上角进行分享</div>
          <div class="tips-btn" @click="showTips = false">取消</div>
        </div>
      </van-popup>
      <van-dialog @confirm="confirmDownload" @cancel="cancelDownload" v-model="showDownloadApp" confirmButtonText="去下载" title="提示" show-cancel-button>
        <div class="download-tips-content">您还未下载app，下载后助力即可领取优惠券</div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button';
  import MD5 from '@/utils/md5.js'
  import Config from '@/api/config'
  import wxfunc from '@/utils/wxfunc'


  /**
   * 1.前台页面点击“弹框”判断是否已经登陆，没登陆先弹出登陆；
   *   已登陆用户，带活动编码请求后台获取排名用于前台展示页面。
   * 2.点击“参与助力”，调接口更新参与人数，保存参与记录，送营销。张金伟、董梦佳 。
   * 3.打开分享地址，点击参与助力，输入手机号，调用后台接口，
   *   判断手机号是否已经注册，如果已注册，弹出滑动框获取验证码，验证码输入正确后直接拉去微信分享；
   *   如果未注册用户跳转到app下载页面；张金伟、董梦佳
   */

  export default {
    data() {
      return {
        showDownloadApp: false, // 提示下载APP
        showPopup: false, // 分享出去的页面 点击分享助力弹框
        phone: '', // 手机号
        code: '', // 验证码
        memberCode: '',
        showTips: false, // 分享提示
        posterInfo: {}, // 分享信息
        activityCode: '9999', // 活动编码
        checkPhoneExist: '', // 手机号是否注册 0：未注册 1：已注册
        downloadUrl: '' // 下载地址
      }
    },
    mounted() {
      this.memberCode = this.$route.query.memberCode || ''
      this.getPosterInfo()
      this.getData()
    },
    methods: {
      shareBtn() {
        /**
         * memberCode 是路由获取的（微信分享的链接会带该参数）所以用该参数判断是app还是微信
         *   有值：（微信）
         *       点击此按钮时弹框输入手机号 校验该手机号是否注册过APP
         *          1.未注册(提示下载APP)
         *          2.已注册 （获取验证码）
         *              点击确定分享
         *   没值：（app）
         *       判断当前用户是否参与了助力（每人只能参与一次助力）
         *         1.未参与：调参与助力接口-分享-赠送营销接口
         *         2.已参与：分享-赠送营销接口
         */
        if (this.memberCode) {
          this.showPopup = true
        } else {
          console.log(this.posterInfo.type)
          if (this.posterInfo.type == 0) { // 0：未参与 1：已参与
            this.$request.post('/app/json/app_share_poster/joinAssistance', { // 参与助力接口
              activityCode: this.activityCode, // 活动编码
              phone: this.phone,
              code: this.code // 验证码
            }).then(res => {
              if (res.status === 0) {
                this.getPosterInfo() // 参与成功以后重新获取信息
                this.share(res.data) // 分享-赠送营销
              } else {
                this.$Toast(res.info)
              }
            })
          } else {
            this.share(this.posterInfo.idCode) // 分享-赠送营销
          }
        }
      },
      blur() {
        // 解决微信里面 键盘顶起页面的问题
        window.scroll(0,0)
      },
      getData: function () {
        // 获取下载地址
        this.$Loading.open();
        let url = '/app/json/home/getVersion';
        let paramsData = {};
        paramsData.appSysType = this.$util.isIos() ? 1 : 2
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status === 0) {
              this.downloadUrl = data.data.downloadUrl || ''
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      queryShare() {
        // 确定分享按钮 -- 微信走
        this.$request.post('/app/json/app_share_poster/joinAssistance', {
          activityCode: this.activityCode, // 活动编码
          phone: this.phone,
          code: this.code // 验证码
        }).then(res => {
          if (res.status === 0) {
            this.memberCode = res.data
            this.getPosterInfo(1) // 参与成功以后重新获取信息
            this.pushMktActivity(res.data) // 赠送营销
          } else {
            this.$Toast(res.info)
          }
        })
      },
      confirmDownload() {
        // 确认下载
        if (this.downloadUrl) {
          window.location.href = this.downloadUrl
        } else {
          this.$Toast('下载地址错误！');
        }
      },
      cancelDownload() {
        // 取消下载
        this.showDownloadApp = false
        this.showPopup = false
        this.phone = ''
      },
      yzPhone() {
        if (this.phone.length == 11) {
          // 校验手机号
          this.$request.post('/app/json/app_share_poster/checkPhoneExist', {
            phone: this.phone
          }).then(res => {
            if (res.status === 0) {
              this.checkPhoneExist = res.data
              if (this.checkPhoneExist == 0) {
                // 0：未注册(提示下载APP) 1：已注册 （获取验证码）
                this.showDownloadApp = true
              } else {

              }
            } else {
              this.$Toast(res.info)
            }
          })
        }
      },
      getPosterInfo(type) {
        // 分享界面数据信息接口-获取当前分享人
        this.$request.post('/app/json/app_share_poster/posterInfo', {
          activityCode: this.activityCode, // 活动编码
          idCode: this.memberCode
        }).then(res => {
          if (res.status === 0) {
            this.posterInfo = res.data
            console.log(type)
            if (type && type == 1) {
              /**
               * 微信的确定分享之后获取信息 并执行分享方法 来更新用户点击微信右上角的分享信息
               */
              this.showTips = true
              let shareData = {
                title: '为奋斗在一线抗疫逆行英雄助力加油',
                desc: `我是${this.getTel(this.posterInfo.userName)}，第${this.posterInfo.number + 1}位为奋斗在一线抗疫逆行英雄致敬，现在分享海报立即获得加油优惠券一张，拒绝给病毒可 “乘” 之机，APP支付优惠多多！`,
                imgUrl: require('./image/share.png'),
                link: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/share-help?memberCode=${this.posterInfo.idCode}`
              };
              wxfunc.getWechatSignature((isSignature) => {
                //签名成功
                if (isSignature) {
                  wxfunc.wxSetShareData(shareData);
                } else {
                  console.log('签名失败');
                }
              })
              console.log('走了wxSetShareData方法')
              console.log(shareData)
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      share(id) {
        console.log(id)
        let shareData = {
          title: '为奋斗在一线抗疫逆行英雄助力加油',
          sharetext: `我是${this.getTel(this.posterInfo.userName)}，第${this.posterInfo.number + 1}位为奋斗在一线抗疫逆行英雄致敬，现在分享海报立即获得加油优惠券一张，拒绝给病毒可 “乘” 之机，APP支付优惠多多！`,
          imageurl: require('./image/share.png'),
          detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/share-help?memberCode=${id}`
        };
        console.log(shareData)
        this.$bridgefunc.share(shareData, (res1) => {
          console.log('分享', res1);
          if (res1 == '1') { // 分享成功 调营销接口
            this.pushMktActivity(id)
          } else {
            this.$toast('分享失败')
          }
        })
      },
      pushMktActivity(id) {
        // 赠送营销
        this.$request.post('/app/json/app_share_poster/pushMktActivity', {
          activityCode: this.activityCode, // 活动编码
          idCode: id
        }).then(res => {
          if (res.status === 0) {

          } else {
            this.$Toast(res.info)
          }
        })
      },
      //获取短信验证码
      getMsgCode: function (imgVerifyCode, uuid) {
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          phone: this.phone,
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              console.log(data)
              this.$Toast('获取验证码成功');
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      getTel(tel) {
        if (tel) {
          return tel.substring(0, 3) + "****" + tel.substr(tel.length - 4)
        }
      }
    },
    components: {
      CountButton
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .share-help {
    .share-help-container {
      position absolute
      top: 0
      left 0
      right: 0
      bottom: 0
      background url("./image/bg.png") no-repeat
      background-size 100% 100%
      padding: 20px 15px
      color: #fff
      font-size 16px
      overflow-y auto
      -webkit-overflow-scrolling touch

      .logo {
        img {
          width: 120px
        }
      }

      .phone {
        padding: 25px 0
        font-weight bold
      }

      .text {
        padding-bottom: 15px
        font-weight bold

        .special {
          color: #fff102
          font-size 28px
          padding: 0 3px
        }
      }

      .info {
        line-height 26px

        p {
          font-weight bold
        }
      }

      .title-img {
        padding: 15px 10px 30px 10px
        height 120px

        img {
          width 100%
          height 100%
        }
      }

      .btn {
        background url("./image/btnbg.png") no-repeat
        background-size 100% 100%
        color: #073f71
        padding: 20px 0
        width 90%
        margin: 0 auto
        text-align center
        line-height 20px

        .bottom {
          font-size 12px
        }

        .top {
          font-size 16px
          font-weight bold
        }
      }

      .popup-btn {
        background url('./image/btnbg2.png') no-repeat
        background-size 100% 100%
        margin-top 15px
        font-size 16px
        padding: 15px 0
        font-weight bold
      }

      .qrcode {
        text-align center
        padding-top: 30px

        img {
          width 250px
        }
      }

      /deep/ .van-popup--center {
        background url("./image/popup.png") no-repeat
        background-size 100% 100%
        width 80%
        overflow-y: visible

        .content {

        }

        .close-icon {
          text-align right
          margin-top: -20%

          img {
            width 40px

          }
        }

        .popup-main {
          width 100%
          margin-top: 15%
          text-align center

          .title {
            font-size 28px
            font-weight bold
            padding-bottom: 30px
          }

          .inp {
            width 90%
            margin: 0 auto
            padding-bottom: 15px
            color: $color-text

            input {
              width 100%
              padding: 10px 15px
              line-height 34px
              border-radius 4px
            }
          }

          .message {
            .show-message {
              border-radius 4px
              display flex
              justify-content space-between
              align-items center
              background #fff

              input {
                flex: 1
              }

              .messgae-inp {
                width 40%
              }

              .blue {
                color: #2266c0
              }
            }
          }
        }
      }
    }
  }

  .tips-show {
    background none !important
    background #fff !important
    border-radius 6px
    color: $color-text

    .tips-icon {
      margin-top: -50% !important

      img {
        width 120px !important
      }
    }
    .tips-title {
      font-size 16px !important
      font-weight bold
      padding-bottom: 25px
    }
    .tips-content {
      font-size 12px
    }
    .tips-btn {
      color: #2266c0
      position: absolute;
      bottom: 15px;
      left: 0;
      right: 0
    }
  }
  /deep/ .van-dialog {
    color: $color-text
    .download-tips-content {
      padding: 20px 25px
      line-height 24px
    }
  }
</style>
