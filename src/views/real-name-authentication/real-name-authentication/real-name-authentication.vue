<template>
  <div class="real-name">
    <nav-top title="实名认证" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="real-name-container">
      <div class="container">
        <div class="real-name-info">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text upload">
                <div class="title">识别身份证</div>
                <div class="upload-img">
                  <div class="img-show" @click="takePictures(1)">
                    <div class="img">
                      <img :src="ghImg" class="show-img" alt="">
                      <img v-show="showGhImg" src="../image/icon1@2x.png" class="btn-img" alt="">
                    </div>
                    <div class="tips">扫描身份证正面</div>
                  </div>
                  <div class="img-show" @click="takePictures(2)">
                    <div class="img">
                      <img :src="rxImg" alt="" class="show-img">
                      <img v-show="showRxImg" src="../image/icon1@2x.png" alt="" class="btn-img">
                    </div>
                    <div class="tips two-tips">扫描身份证反面</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">姓名</div>
                <div class="right">
                  <input type="text" placeholder="请输入姓名" v-model="name">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">身份证号</div>
                <div class="right">
                  <input type="text" placeholder="请输入本人身份证号" v-model="idcardNum">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">有效期</div>
                <div class="right">
                  <input type="text" placeholder="例：2000.01.01-2020.01.01" v-model="valid">
                </div>
              </div>
            </div>
            <div class="table-view-cell" v-if="$store.state.globalConfig.certificate_check_type == 1">
              <div class="table-view-cell-text upload">
                <div class="title">自拍照</div>
                <div class="upload-img">
                  <div class="img-show" @click="takePictures(3)">
                    <div class="img">
                      <img :src="zpImg" alt="" class="show-img">
                      <img v-show="showZpImg" src="../image/icon1@2x.png" alt="" class="btn-img">
                    </div>
                    <div class="tips two-tips">来一张帅气的自拍照吧！</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="audit-btn" @click="queryBtn">
          <div class="btn">提交审核</div>
        </div>
      </div>
      <!--弹框 选择拍照方式-->
      <van-popup v-model="showUploadStyle" position="bottom">
        <div class="upload-style">
          <div class="style" @click="onSelect(2)">拍照</div>
          <div class="style" @click="onSelect(1)">相册</div>
          <div class="style" @click="showUploadStyle = false">取消</div>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        showUploadStyle: false, // 弹框选择拍照方式
        name: '', // 姓名
        sex: '', // 姓别
        idcardNum: '', // 身份证号
        valid: '', // 有效期
        faceOrBack: '', // 选择的正反面或者自拍照
        ghImg: '', // 身份证正面
        rxImg: '', // 身份证反面
        zpImg: '', // 自拍照
        ghImgUrl: '', // 身份证正面url
        rxImgUrl: '', // 身份证反面url
        zpImgUrl: '', // 自拍照url
        showGhImg: true, // 身份证正面-拍照按钮
        showRxImg: true, // 身份证反面-拍照按钮
        showZpImg: true, // 自拍照-拍照按钮
        num: '', // 驾驶证中的身份证
        driveName: '', // 驾驶证中的姓名
        id: '', // 审核未通过-修改
        ocrInfo: '', // 识别信息
        states: [
          {'gh': 0},
          {'rx': 0}
        ] // 识别失败状态
      }
    },
    mounted() {
      console.log(this.$store.state.globalConfig.certificate_check_type) // 0：不审核，1：后台人工审核，2：调用接口审核）
      this.ghImg = require('../image/rx@2x.png')
      this.rxImg = require('../image/gh@2x.png')
      this.zpImg = require('../image/zp@2x.png')
      if (this.$route.query.num) {
        this.num = this.$route.query.num
      }
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.$route.query.name) {
        this.driveName = this.$route.query.name
      }
    },
    methods: {
      queryBtn() {
        // 提交按钮
        console.log(this.$store.state.globalConfig.certificate_check_type)
        console.log(this.states[1].rx)
        let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (this.ghImgUrl == '') {
          this.$Toast('请上传身份证正面')
        } else if (this.rxImgUrl == '') {
          this.$Toast('请上传身份证反面')
        } else if (this.$store.state.globalConfig.certificate_check_type == 2 && this.states[1].rx == '0') {  // 下面加了 是否走 ocr 识别 但是states逻辑上 没处理 不走的情况
          this.$Toast('请上传正确的身份证正面')
        } else if (this.$store.state.globalConfig.certificate_check_type == 2 && this.states[0].gh == '0') {
          this.$Toast('请上传正确的身份证反面')
        } else if (this.name == '') {
          this.$Toast('请输入姓名')
        } else if (this.driveName && this.driveName != this.name) {
          this.$Toast('身份信息不一致')
          this.name = ''
        } else if (this.idcardNum == '') {
          this.$Toast('请输入身份证号')
        } else if (!regIdNo.test(this.idcardNum)) {
          this.idcardNum = ''
          this.$Toast('身份证号填写有误')
        } else if (this.num && this.idcardNum != this.num) {
          this.$Toast('身份信息不一致')
          this.idcardNum = ''
        } else if (this.valid == '') {
          this.$Toast('请输入有效期')
        } else if (this.zpImgUrl == '' && this.$store.state.globalConfig.certificate_check_type == 1) {
          this.$Toast('请上传自拍照')
        } else {
          if (parseInt(this.idcardNum.substr(16, 1)) % 2 == 1) {
            this.sex = '男'
          } else {
            this.sex = '女'
          }
          let termDate = this.valid
          this.$request.post('/app/json/user/identifySubmmit', {
            name: this.name, // 姓名
            sex: this.sex, // 性别
            id: this.id,
            effectDate: termDate.slice(0, termDate.indexOf('-')), // 开始日期
            expiryDate: termDate.slice(termDate.indexOf('-') + 1), // 失效日期
            idcardNum: this.idcardNum, // 身份证号
            selfImageUrl: this.zpImgUrl, // 用户上传的自拍照片
            imgFront: this.ghImgUrl, // 证件正面照片URL
            imgBehind: this.rxImgUrl // 证件背面照片URL
          }).then(res => {
            if (res.status === 0) {
              if (this.$route.query.source == 1) { // 1 代表是从审核结果页面过去的
                this.$router.go(-2)
              } else {
                this.$router.go(-1)
              }
            } else {
              this.$Toast(res.info ? res.info : '提交失败')
            }
          })
        }
      },
      takePictures(type) {
        // 拍照 1 正面 2 反面 3 自拍照
        this.showUploadStyle = true
        this.faceOrBack = type
      },
      onSelect(type) {
        // 拍照
        /**
         * 拍照
         * @param phototype 1 是相册 2 是拍照 3 自定义相机拍证件
         */
        this.showUploadStyle = false
        if (this.faceOrBack != 3) {
          if (type == 1) {
            this.getImg('1')
          } else {
            this.getImg('3') // 身份证识别长方形框
          }
        } else {
          // 自拍
          this.getImg('2')
        }
      },
      getImg: function (op) {
        let that = this;
        this.$bridgefunc.getPhoto(op, function (img) {
          that.updateImg(img)
          let imgBack = 'data:image/jpg;base64,' + img
          if (that.faceOrBack == 1) {
            that.ghImg = imgBack
            that.showGhImg = false
          } else if (that.faceOrBack == 2) {
            that.rxImg = imgBack
            that.showRxImg = false
          } else if (that.faceOrBack == 3) {
            that.zpImg = imgBack
            that.showZpImg = false
          }
        },op == 3? '1':'0')
      },
      updateImg(image) {
        this.$Loading.open('保存中')
        let url = '/uploadFile'
        let token = this.$store.state.login.token
        let params1 = {
          base64File: image,
          fileType: 'jpg',
          fileName: 'id-card-img',
          bucketName: 'app_img',
          token: token
        }
        let that = this
        this.$http.post(url, params1).then(res => {
          that.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (that.faceOrBack == 1) {
              that.ghImgUrl = data.data
              this.ocrCertificate(0, image)
            } else if (that.faceOrBack == 2) {
              that.rxImgUrl = data.data
              this.ocrCertificate(1, image)
            } else if (that.faceOrBack == 3) {
              that.zpImgUrl = data.data
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          that.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
      ocrCertificate(type, base64StrImg) {
        // ocr识别  type:0 身份证正面 1身份证反面 2 驾驶证 3 驾驶证副页 4 行驶证 5 行驶证副页
        if (this.$store.state.globalConfig.certificate_check_type != 2) {
          return
        }
        this.$request.post('/app/json/ocr/ocrCertificate', {
          ocrType: type,
          base64Str: base64StrImg,
        }).then(res => {
          console.log(res)
          if (res.status === 0) {
            this.ocrInfo = res.data
            if (type == 0) {
              this.idcardNum = this.ocrInfo.idno
              this.name = this.ocrInfo.name
              this.states[1].rx = 1
            } else {
              this.valid = this.ocrInfo.valid
              this.states[0].gh = 1
            }
          } else {
            this.$toast(res.info || '识别失败！')
          }
        })
      }
    },
    created() {
      if ((/Android/gi).test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
          if (document.activeElement.tagName == 'INPUT' ||
            document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
              document.activeElement.scrollIntoViewIfNeeded()
            }, 0)
          }
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .real-name {
    background-color: #f8f8f8 !important

    .real-name-container {
      font-size: 14px
      overflow auto
      -webkit-overflow-scrolling touch

      .container {
        padding: 10px 0
        position relative

        .real-name-info {
          padding: 0 10px
          background #fff
          margin-bottom: 50px

          .left {
            color: $color-text
          }

          .title {
            color: $color-text
          }

          .upload {
            display block

            .upload-img {
              width: 50%
              margin 0 auto
              padding-top: 10px
              text-align center

              .img-show {
                .img {
                  position relative
                  width: 163px
                  height: 100px

                  .show-img {
                    width: 100%
                    height: 100%
                  }

                  .btn-img {
                    display flex
                    justify-content center
                    align-items center
                    position absolute
                    top: 50%
                    left: 50%
                    transform translate(-50%, -50%)
                    width: 50px
                    height: 50px
                  }
                }

                .tips {
                  color: $color-text-d
                  padding: 10px 0
                  font-size: 12px
                }

                .two-tips {
                  padding-bottom: 0px
                }
              }
            }
          }

          .right {
            flex: 1

            input {
              width: 100%
              text-align right
              line-height 28px
            }
          }

          .sex {
            width: 50% !important
          }
        }

        .audit-btn {
          position fixed
          bottom: 0
          left: 0
          right: 0

          .btn {
            background $color-theme-r
            color: #fff
            padding: 13px 15px
            text-align center
            font-size: 16px
          }
        }
      }

      /deep/ .van-popup {
        background none
        padding: 11px 15px
      }

      .upload-style {
        text-align center

        .style {
          padding: 18px 0
          background #fff
          margin-top: 10px
          border-radius 6px

          & + .style {
            border-top: 1px solid $color-line-gray-l

          }
        }
      }
    }
  }

  /deep/ .van-radio-group {
    display flex
    justify-content space-between
    align-items center
  }
</style>
