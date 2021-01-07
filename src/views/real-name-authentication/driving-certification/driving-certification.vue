<template>
  <div class="real-name">
    <nav-top title="驾驶认证" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="real-name-container">
      <div class="container">
        <div class="real-name-info">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text upload">
                <div class="title">识别驾驶证</div>
                <div class="upload-img">
                  <div class="img-show" @click="takePictures(1)">
                    <div class="img">
                      <img :src="divSImg" class="show-img" alt="">
                      <img v-show="showDivSImg" src="../image/icon1@2x.png" class="btn-img" alt="">
                    </div>
                    <div class="tips">扫描驾驶证首页</div>
                  </div>
                  <div class="img-show" @click="takePictures(2)">
                    <div class="img">
                      <img :src="divFImg" class="show-img" alt="">
                      <img v-show="showDivFImg" src="../image/icon1@2x.png" class="btn-img" alt="">
                    </div>
                    <div class="tips two-tips">扫描驾驶证副页</div>
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
                <div class="left">证号</div>
                <div class="right">
                  <input type="text" placeholder="请输入证号" v-model="driveCode">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">档案编号</div>
                <div class="right">
                  <input type="text" placeholder="请输入档案编号" v-model="driveDocNo">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">驾驶证证芯编号</div>
                <div class="right">
                  <input type="text" placeholder="请输入驾驶证证芯编号" v-model="licenceCore">
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
          <div class="style" @click="onSelect">拍照</div>
          <div class="style" @click="showUploadStyle = false">取消</div>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        showUploadStyle: false, // 弹框选择拍照方式
        name: '', // 姓名
        driveDocNo: '', // 档案编号
        driveCode: '', // 驾照编码
        licenceCore: '', // 驾驶证证芯编号
        divSImg: '', // 驾驶证首页
        divFImg: '', // 驾驶证副页
        divSImgUrl: '', // 驾驶证首页url
        divFImgUrl: '', // 驾驶证副页url
        showDivSImg: true, // 驾驶证首页-拍照按钮
        showDivFImg: true, // 驾驶证副页-拍照按钮
        num: '', // 身份证号
        idName: '', // 实名认证中的姓名
        divInfo: '' // 识别出来的信息
      }
    },
    mounted() {
      this.divSImg = require('../image/jszsy@2x.png')
      this.divFImg = require('../image/jszfy@2x.png')
      if (this.$route.query.num) {
        this.num = this.$route.query.num
      }
      if (this.$route.query.name) {
        this.idName = this.$route.query.name
      }
    },
    methods: {
      queryBtn() {
        // 提交按钮
        let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (this.divSImgUrl == '') {
          this.$Toast('请上传驾驶证首页')
        } else if (this.divFImgUrl == '') {
          this.$Toast('请上传驾驶证副页')
        } else if (this.name == '') {
          this.$Toast('请输入姓名')
        } else if (this.idName && this.idName != this.name && this.identifyState.blackCheckDriving == 1) {
          this.$Toast('身份信息不一致!')
          this.name = ''
        } else if (this.driveCode == '') {
          this.$Toast('请输入证号')
        } else if (!regIdNo.test(this.driveCode)) {
          this.driveCode = ''
          this.$Toast('证号填写有误')
        } else if (this.num && this.driveCode != this.num && this.identifyState.blackCheckDriving == 1) {
          this.$Toast('身份信息不一致！')
          this.driveCode = ''
        } else if (this.driveDocNo == '') {
          this.$Toast('请输入档案编号')
        } else if (this.licenceCore == '') {
          this.$Toast('请输入驾驶证证芯编号')
        } else {
          this.$request.post('/app/json/user/driverInfoSubmmit', {
            name: this.name, // 姓名
            driveDocNo: this.driveDocNo, // 档案编号
            driveCode: this.driveCode, // 驾照编码
            imageUrl: this.divSImgUrl, // 驾驶证首页url
            imageUrl2: this.divFImgUrl, // 驾驶证副页url 
            licenceCore: this.licenceCore, // 驾驶证证芯编号 
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
        // 拍照 1 首页 2副页
        this.showUploadStyle = true
        this.faceOrBack = type
      },
      onSelect() {
        // 拍照
        this.showUploadStyle = false
        this.getImg('3') // 身份证识别长方形框
      },
      getImg: function (op) {
        let that = this;
        this.$bridgefunc.getPhoto(op, function (img) {
          that.updateImg(img)
          let imgBack = 'data:image/jpg;base64,' + img
          if (that.faceOrBack == 1) {
            that.divSImg = imgBack
            that.showDivSImg = false
          } else if (that.faceOrBack == 2) {
            that.divFImg = imgBack
            that.showDivFImg = false
          }
        })
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
              that.divSImgUrl = data.data
              this.ocrCertificate(2, image)
            } else if (that.faceOrBack == 2) {
              that.divFImgUrl = data.data
              this.ocrCertificate(3, image)
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
            this.divInfo = res.data
            if (type == 2) { // 正面
              this.name = this.divInfo.name // 姓名
              this.driveCode = this.divInfo.license // 证号
            } else {
              this.driveDocNo = this.divInfo.doc_no // 档案编号
              this.licenceCore = this.divInfo.name // 驾驶证证芯编号 
            }
          } else {
            this.$toast(res.info || '识别失败！')
          }
        })
      },
      ...mapMutations(['setIdentifyState'])
    },
    computed: {
      ...mapGetters(['identifyState'])
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
</style>
