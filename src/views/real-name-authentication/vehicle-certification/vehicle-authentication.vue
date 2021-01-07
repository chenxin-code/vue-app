<template>
  <div class="real-name">
    <nav-top title="行驶认证" @backEvent="backEvent"></nav-top>
    <nav-content class="real-name-container">
      <div class="container">
        <div class="car-title">
          <div class="left">车牌号</div>
          <div class="right">{{plateNum}}</div>
        </div>
        <div class="real-name-info">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text upload">
                <div class="title">行驶证信息</div>
                <div class="upload-img">
                  <div class="img-show" @click="takePictures(1)">
                    <div class="img">
                      <img :src="vehicleImage" class="show-img" alt="">
                      <img v-show="showimageUrl" src="../image/icon1@2x.png" class="btn-img" alt="">
                    </div>
                    <div class="tips">扫描行驶证首页</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">所有人姓名</div>
                <div class="right">
                  <input type="text" placeholder="请输入姓名" v-model="ownerName">
                </div>
              </div>
            </div>
            <!--            <div class="table-view-cell">-->
            <!--              <div class="table-view-cell-text">-->
            <!--                <div class="left">车牌号</div>-->
            <!--                <div class="right">-->
            <!--                  <input type="text" maxlength="6" placeholder="请输入车牌号">-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">车辆识别代号</div>
                <div class="right">
                  <input type="text" placeholder="请输入车辆识别代号" v-model="vin">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">发动机号</div>
                <div class="right">
                  <input type="text" placeholder="请输入发动机号" v-model="engineNum">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">车辆类型</div>
                <div class="right">
                  <input type="text" placeholder="请输入车辆类型" v-model="vehType">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="audit-btn" @click="queryBtn">
          <div class="btn">保存</div>
        </div>
      </div>
      <!--弹框 选择拍照方式-->
      <van-popup v-model="showUploadStyle" position="bottom">
        <div class="upload-style">
          <div class="style" @click="onSelect">拍照</div>
          <div class="style" @click="showUploadStyle = false">取消</div>
        </div>
      </van-popup>
      <van-dialog
        v-model="showDialog"
        show-cancel-button
        @confirm="confirm"
        @cancel="cancel"
        confirmButtonText="保存"
        cancelButtonText="不保存"
      >
        <div class="tips-dialog">当前页面数据是否保存？</div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'
  import {Dialog} from 'vant'

  export default {
    data() {
      return {
        showUploadStyle: false, // 弹框选择拍照方式
        vehicleImage: '', // 行驶证首页
        imageUrl: '', // 行驶证首页url
        showimageUrl: true, // 行驶证首页-拍照按钮
        vehicleItem: '', // 详情
        plateNum: '', // 车牌号
        ownerName: '', // 所有人姓名
        vin: '', // 车辆识别代号
        engineNum: '', // 发动机号
        vehType: '', // 车辆类型
        showDialog: false, // 弹框提示
        vehInfo: '' // 行驶证
      }
    },
    mounted() {
      this.vehicleImage = require('../image/xszcard@2x.png')
      if (this.$route.query.plateNum) {
        this.plateNum = this.$route.query.plateNum
      }
      if (this.identifyState.imageUrl) {
        this.vehicleImage = this.identifyState.imageUrl
        this.imageUrl = this.identifyState.imageUrl
        this.ownerName = this.identifyState.ownerName
        this.vin = this.identifyState.vin
        this.engineNum = this.identifyState.engineNum
        this.vehType = this.identifyState.vehType
        this.showimageUrl = false
      }
    },
    methods: {
      backEvent() {
        // 返回
        Dialog.confirm({
          message: '是否返回？'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {
        })
      },
      queryBtn() {
        // 保存到本地
        if (this.showimageUrl == true) {
          this.$Toast('请上传行驶证首页')
        } else if (this.ownerName == '') {
          this.$Toast('请输入所有人姓名')
        } else if (this.vin == '') {
          this.$Toast('请输入车辆识别代号')
        } else if (this.engineNum == '') {
          this.$Toast('请输入发动机号')
        } else if (this.vehType == '') {
          this.$Toast('请输入车辆类型')
        } else {
          this.showDialog = true
        }
      },
      confirm() {
        // 保存按钮
        this.setIdentifyState(this.$assign({}, this.identifyState, {
          plateNum: this.plateNum, // 车牌号
          imageUrl: this.imageUrl, // 行驶证首页url
          ownerName: this.ownerName, // 所有人姓名
          vin: this.vin, // 车辆识别代号
          engineNum: this.engineNum, // 发动机号
          vehType: this.vehType // 车辆类型
        }))
        this.$bridgefunc.vuexStorage()
        this.$router.go(-1)
      },
      cancel() {
        // 不保存按钮
      },
      takePictures(type) {
        // 拍照 1 行驶证首页
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
            that.vehicleImage = imgBack
            that.showimageUrl = false
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
              that.imageUrl = data.data
              this.ocrCertificate(4, image)
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
            this.vehInfo = res.data
            this.ownerName = this.vehInfo.owner, // 所有人姓名
            this.vin = this.vehInfo.vin, // 车辆识别代号
            this.engineNum = this.vehInfo.engine_no, // 发动机号
            this.vehType = this.vehInfo.vehicle_type // 车辆类型
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
    components: {
      [Dialog.name]: Dialog
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .real-name {
    background-color: #f8f8f8 !important
    font-size: 14px

    .real-name-container {
      font-size: 14px
      overflow auto
      -webkit-overflow-scrolling touch

      .container {
        padding: 10px 0
        position relative

        .car-title {
          margin-bottom: 10px
          padding: 20px 20px
          background #fff
          display flex
          justify-content space-between
          align-items center

          .left {
            color: $color-text
          }
        }

        .real-name-info {
          padding: 0 5px
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

  /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
    background: #F80F16
    color: #fff
  }

  .tips-dialog {
    text-align center
    padding: 50px 0
  }
</style>
