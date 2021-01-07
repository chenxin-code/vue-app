<template>
  <div class="card-binding-index">
    <nav-top title="外省单位油卡绑定" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="card-binding-content">
      <div class="card-binding">
        <div class="card-information">
          <div class="table-view">
            <!-- 身份证照片 -->
            <div class="table-view-cell">
              <div class="table-view-cell-text upload">
                <div class="title">身份证照片</div>
                <div class="ID-upload-img upload-img">
                  <div class="img-show ID-img-show" @click="takePictures(0)">
                    <div class="img">
                      <img :src="bindingData.idPicUrl" class="show-img" alt/>
                      <img v-show="showimageUrl0" src="../image/icon3@2x.png" class="btn-img" alt/>
                    </div>
                    <div class="tips">身份证正面</div>
                  </div>
                  <div class="img-show ID-img-show" @click="takePictures(1)">
                    <div class="img">
                      <img :src="bindingData.idVPicUrl" class="show-img" alt/>
                      <img v-show="showimageUrl1" src="../image/icon3@2x.png" class="btn-img" alt/>
                    </div>
                    <div class="tips">身份证反面</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 手持身份证 -->
            <div class="table-view-cell">
              <div class="table-view-cell-text upload">
                <div class="title">手持加油卡照片</div>
                <div class="upload-img">
                  <div class="img-show" @click="takePictures(2)">
                    <div class="img">
                      <img :src="bindingData.handCardPicUrl" class="show-img" alt/>
                      <img v-show="showimageUrl2" src="../image/icon3@2x.png" class="btn-img" alt/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-information">
          <div class="table-view">
            <div class="table-view-cell" v-if="$store.state.globalConfig.enable_ocr_other_provinces_card_bind == 1">
              <div class="table-view-cell-text">
                <div class="left">姓名：</div>
                <div class="right">
                  <input type="text" readonly v-model="idName" placeholder="姓名"/>
                </div>
              </div>
            </div>
            <div class="table-view-cell" v-if="$store.state.globalConfig.enable_ocr_other_provinces_card_bind == 1">
              <div class="table-view-cell-text">
                <div class="left">证件号：</div>
                <div class="right">
                  <input type="text" readonly v-model="idCard" placeholder="证件号"/>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">推荐人：</div>
                <div class="right refereeLflex">
                  <input type="text" v-model="referrer" placeholder="请输入推荐人（选填）"
                         @input="changeRfrCodeType"/>
                  <img src="static/image/fuelcard//btn_Sweep.png" width="25" height="25" @click="sweep"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="submitbtn" @click="submitButn">提交审核</div>
      <!--弹框 选择拍照方式-->
      <van-popup v-model="showUploadStyle" position="bottom">
        <div class="upload-style">
          <div class="style" @click="onSelect(0)">拍照</div>
          <div class="style" @click="onSelect(1)">相册</div>
          <div class="style" @click="showUploadStyle = false">取消</div>
        </div>
      </van-popup>
      <div class="no-cancel">
        <van-dialog v-model="showOilState" title="温馨提示" @confirm="$router.go(-2)">
          <!-- <div>您已成功提交绑卡审核，需要您去中石化任意发卡网点去进行副卡绑定审核!</div> -->
          <div>您已绑卡成功，请在加油卡下查看！</div>
        </van-dialog>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import {Dialog} from 'vant';

  export default {
    data() {
      return {
        idName: '', // ocr识别 姓名
        idCard: '', // ocr识别 证件号
        referrer: '',
        showOilState: false,
        showUploadStyle: false,
        phone: '', // 当前登录手机号
        cardNo: '',
        imgType: '', // 2手持身份证
        idPicUrl: '', // 身份证正面
        idVPicUrl: '', // 身份证反面
        handCardPicUrl: '', // 手持身份证
        bindingData: {
          handCardPicUrl: '', // 手持身份证
          idPicUrl: '',
          idVPicUrl: ''
        },
        showimageUrl0: true,
        showimageUrl1: true,
        showimageUrl2: true,
      }
    },
    created() {
      this.rfrCodeType = 1 // 推荐方式  1 填写  2 扫码
      // 填写默认推荐人(相对时间内)
      let referrerInvalidDate = this.$store.state.mall2.behalf.referrerInvalidDate
      if (referrerInvalidDate && referrerInvalidDate != undefined && referrerInvalidDate != '') {
        let referrerInvalidDateTime = (new Date(referrerInvalidDate)).getTime();
        let newTime = (new Date()).getTime();
        if (referrerInvalidDateTime >= newTime) {
          this.referrer = this.$store.state.mall2.behalf.referrer
        }
      } else {
        this.referrer = this.$store.state.mall2.behalf.referrer
      }
    },
    mounted() {
      this.phone = this.$store.state.login.phone
      this.cardNo = this.$route.query.cardNo
      this.bindingData.idPicUrl = require('../image/sfzzm.png')
      this.bindingData.idVPicUrl = require('../image/sfzfm.png')
      this.bindingData.handCardPicUrl = require('../image/scsfz.png')
    },
    methods: {
      takePictures(type) {
        this.showUploadStyle = true
        this.imgType = type
      },
      changeRfrCodeType() {
        this.rfrCodeType = 1
      },
      sweep() {
        this.$bridgefunc.scanCode(res => {
          this.rfrCodeType = 2
          let code = res.code
          if (code.indexOf('http') > -1) {
            code = this.$util.getUrlParam(code, 'qrCode')
          }
          this.theScanCode = code;
          this.referrer = code;
        })
      },
      onSelect(op) {
        this.showUploadStyle = false
        if (op == 0) {  // 拍照
          if (this.$store.state.globalConfig.enable_ocr_other_provinces_card_bind == 1 && this.imgType != 2) {
            this.getImg('3') // 身份证识别长方形框
          } else {
            this.getImg('2')
          }
        } else if (op == 1) {  // 相册
          this.getImg('1')
        }
      },
      getImg: function (op) {
        let that = this;
        this.$bridgefunc.getPhoto(op, function (img) {
          that.updateImg(img)

          let imgBack = 'data:image/jpg;base64,' + img
          if (that.imgType == 0) {
            that.idPicUrl = imgBack
            // that.showimageUrl0 = false
          } else if (that.imgType == 1) {
            that.idVPicUrl = imgBack
            that.showimageUrl1 = false
          } else if (that.imgType == 2) {
            that.handCardPicUrl = imgBack
            that.showimageUrl2 = false
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
            if (that.imgType == 0) {
              this.ocrCertificate(0, image, data.data)
            } else if (that.imgType == 1) {
              that.bindingData.idVPicUrl = data.data
              // this.ocrCertificate(1, image)
            } else if (that.imgType == 2) {
              that.bindingData.handCardPicUrl = data.data
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          that.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
      ocrCertificate(type, base64StrImg, data) {
        // ocr识别  type:0 身份证正面 1身份证反面 2 驾驶证 3 驾驶证副页 4 行驶证 5 行驶证副页
        if (this.$store.state.globalConfig.enable_ocr_other_provinces_card_bind != 1) {
          this.showimageUrl0 = false
          this.bindingData.idPicUrl = data
        }else{
          this.$request.post('/app/json/ocr/ocrCertificate', {
            ocrType: type,
            base64Str: base64StrImg,
          }).then(res => {
            if (res.status === 0) {
              this.idName = res.data.name // 姓名
              this.idCard = res.data.idno // 证号
              this.showimageUrl0 = false
              this.bindingData.idPicUrl = data
            } else {
              this.$toast(res.info || '识别失败！')
            }
          })
        }
      },
      submitButn() {
        if (this.$store.state.globalConfig.enable_ocr_other_provinces_card_bind == 1 && !this.idName && !this.idCard) {
          this.$Toast('请进行OCR信息识别')
          return
        }
        // 1 手动输入  2扫一扫
        if (this.referrer == this.theScanCode) {
          this.rfrCodeType = 2;
        } else {
          this.rfrCodeType = 1;
        }
        if (this.showimageUrl0) {
          this.$Toast('请上传身份证正面')
          return
        }
        if (this.showimageUrl1) {
          this.$Toast('请上传身份证反面')
          return
        }
        if (this.showimageUrl2) {
          this.$Toast('请上传手持身份证照片')
          return
        }
        let params = {
          idNumber: this.idCard || '',
          idCardName: this.idName || '',
          phone: this.phone,
          cardNo: this.cardNo,
          referrer: this.referrer,
          rfrCodeType: this.rfrCodeType,
          ...this.bindingData
        }
        console.log(params)
        this.$request.post('/app/json/enterprise_card/submitOtherProvincesCard', params).then(res => {
          if (res.status == 0) {
            this.showOilState = true
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  
  .card-information {
    margin-top: 10px;
    box-shadow: 0px 5px 6px #f0f0f0;
    
    .title {
      font-size: 14px;
    }
    
    .card-type-radio {
      display: flex;
      justify-content: space-around;
    }
    
    .left {
      width: 30%;
    }
    
    .upload {
      display: block;
      
      .upload-img {
        width: 50%;
        margin: 0 auto;
        padding-top: 10px;
        text-align: center;
        
        .img-show {
          .img {
            position: relative;
            width: 163px;
            height: 100px;
            
            .show-img {
              width: 100%;
              height: 100%;
            }
            
            .btn-img {
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 50px;
              height: 50px;
            }
          }
          
          .tips {
            color: $color-text-d;
            padding: 10px 0;
            font-size: 12px;
          }
          
          .two-tips {
            padding-bottom: 0px;
          }
        }
        
        .ID-img-show {
          .img {
            width: 133px;
            height: 70px;
          }
        }
      }
      
      .ID-upload-img {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    }
    
    .right {
      flex: 1;
      
      input {
        width: 100%;
        line-height: 28px;
        background-color: #fff;
      }
    }
    
    .refereeLflex {
      display: flex;
      align-items: center;
    }
  }
  
  .card-binding-index {
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    .card-binding-content {
      padding: 10px;
      bottom: 0;
      
      .card-binding {
        position: absolute;
        top: 0px;
        right: 0px;
        left: 0px;
        bottom: 50px;
        padding: 10px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .card-status {
        margin-bottom: 20px;
        
        .right {
          line-height: 28px;
        }
      }
      
      .card-information {
        margin-bottom 10px;
        box-shadow: 0px 5px 6px #f0f0f0;
        
        .card-type-radio {
          display: flex;
          justify-content: space-around;
        }
        
        .left {
          width: 30%;
        }
        
        .upload {
          display: block;
          
          .upload-img {
            width: 50%;
            margin: 0 auto;
            padding-top: 10px;
            text-align: center;
            
            .img-show {
              .img {
                position: relative;
                width: 163px;
                height: 100px;
                
                .show-img {
                  width: 100%;
                  height: 100%;
                }
                
                .btn-img {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 50px;
                  height: 50px;
                }
              }
              
              .tips {
                color: $color-text-d;
                padding: 10px 0;
                font-size: 12px;
              }
              
              .two-tips {
                padding-bottom: 0px;
              }
            }
            
            .ID-img-show {
              .img {
                width: 133px;
                height: 70px;
              }
            }
          }
          
          .ID-upload-img {
            width: 100%;
            display: flex;
            justify-content: space-around;
          }
        }
        
        .right {
          flex: 1;
          
          input {
            width: 100%;
            line-height: 28px;
            background-color: #fff;
          }
        }
      }
      
      .submit-success {
        .submit-success-content {
          font-size: 14px;
          text-align: center;
          
          .content-tips {
            padding: 50px 0 20px;
            
            img {
              margin-bottom: 15px;
            }
          }
          
          .submit-content-btns {
            button {
              border: 1px solid #FE0018;
              width: 90%;
              text-align: center;
              padding: 10px 0;
              margin-top: 15px;
              border-radius: 20px;
            }
            
            .see-details {
              background-color: #fff;
              color: #FE0018;
              border-color: #FE0018;
            }
            
            .goback {
              background-color: #FE0018;
              color: #fff;
            }
          }
        }
      }
      
      .submitbtn {
        position: absolute;
        bottom: 15px;
        left: 10px;
        right: 10px;
        border-radius: 20px;
        padding: 13px;
        background-color: red;
        color: #Fff;
        text-align: center;
        font-size: 14px;
      }
      
      // /deep/ .van-popup {
      // background: none;
      // padding: 11px 15px;
      // }
      
      .upload-style {
        text-align: center;
        
        .style {
          padding: 18px 0;
          background: #fff;
          margin-top: 10px;
          border-radius: 6px;
          
          & + .style {
            border-top: 1px solid $color-line-gray-l;
          }
        }
      }
      
      // /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
      // background: #F80F16;
      // color: #fff;
      // }
      
      .tips-dialog {
        text-align: center;
        padding: 50px 0;
      }
      
      .no-cancel {
        /deep/ .van-dialog__content {
          padding: 20px;
        }
        
        /deep/ .van-dialog__confirm {
          color: #fff;
          background: red;
        }
      }
    }
  }
</style>
