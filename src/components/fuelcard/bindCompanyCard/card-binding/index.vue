<template>
  <div class="card-binding-index">
    <nav-top :title="pageTitle" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="card-binding-content">
      <div class="card-binding">
        
        <div class="card-information card-status" v-if="binddetail">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">审核状态：</div>
                <div class="right">
                  {{bindingData.approvalState == 2 ? '待审核' : bindingData.approvalState == 1 ? '成功' : '失败'}}
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">申请时间：</div>
                <div class="right">{{bindingData.createTime}}</div>
              </div>
            </div>
            <div class="table-view-cell" v-if="bindingData.approvalState == 0">
              <div class="table-view-cell-text">
                <div class="left">审核油站：</div>
                <div class="right">{{bindingData.stationName}}</div>
              </div>
            </div>
            <div class="table-view-cell" v-if="bindingData.approvalState == 0">
              <div class="table-view-cell-text">
                <div class="left">审核失败原因：</div>
                <div class="right">{{bindingData.approvalMessage}}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-information" v-if="!isSubmit">
          <div class="table-view">
            <!-- 主卡卡号 -->
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">{{cardName}}：</div>
                <div class="right">
                  <input type="text" disabled v-model="bindingData.cardNo" placeholder="请输入加油卡卡号"/>
                </div>
              </div>
            </div>
            <!-- 预留手机号 -->
            <div class="table-view-cell" v-if="this.cardData.ispricard == '1'">
              <div class="table-view-cell-text">
                <div class="left">预留手机号：</div>
                <div class="right">
                  <input type="text" :disabled="teldisabled" v-model="bindingData.phone"
                         placeholder="请输入预留手机号"/>
                </div>
              </div>
            </div>
            <!-- 身份证照片 -->
            <div class="table-view-cell">
              <div class="table-view-cell-text upload">
                <div class="title">身份证照片</div>
                <div class="ID-upload-img upload-img">
                  <div class="img-show ID-img-show" @click="takePictures(0)">
                    <div class="img">
                      <img :src="bindingData.idPicUrl" class="show-img" alt/>
                      <img v-show="showimageUrl0" src="../image/icon3@2x.png" class="btn-img"
                           alt/>
                    </div>
                    <div class="tips">身份证正面</div>
                  </div>
                  <div class="img-show ID-img-show" @click="takePictures(1)">
                    <div class="img">
                      <img :src="bindingData.idVPicUrl" class="show-img" alt/>
                      <img v-show="showimageUrl1" src="../image/icon3@2x.png" class="btn-img"
                           alt/>
                    </div>
                    <div class="tips">身份证反面</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 手持身份证 -->
<!--            <div class="table-view-cell" v-if="cardTypeData != 11">-->
<!--              <div class="table-view-cell-text upload">-->
<!--                <div class="title">手持身份证照片</div>-->
<!--                <div class="upload-img">-->
<!--                  <div class="img-show" @click="takePictures(2)">-->
<!--                    <div class="img">-->
<!--                      <img :src="bindingData.handIdPicUrl" class="show-img" alt/>-->
<!--                      <img v-show="showimageUrl2" src="../image/icon3@2x.png" class="btn-img"-->
<!--                           alt/>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
            <!--            加油卡照片-->
            <div class="table-view-cell" v-if="cardTypeData != 11">
              <div class="table-view-cell-text upload">
                <div class="title">加油卡照片</div>
                <div class="ID-upload-img upload-img">
                  <div class="img-show ID-img-show" @click="takePictures(2)">
                    <div class="img">
                      <img :src="bindingData.cardPicUrl" class="show-img" alt/>
                      <img v-show="showCardPicUrl" src="../image/icon3@2x.png" class="btn-img" alt/>
                    </div>
                    <div class="tips">加油卡正面</div>
                  </div>
                  <div class="img-show ID-img-show" @click="takePictures(3)">
                    <div class="img">
                      <img :src="bindingData.cardPicUrlV" class="show-img" alt/>
                      <img v-show="showCardPicUrlV" src="../image/icon3@2x.png" class="btn-img" alt/>
                    </div>
                    <div class="tips">加油卡反面</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 单位授权书 -->
            <div class="table-view-cell" v-if="this.cardData.ispricard == '1'">
              <div class="table-view-cell-text upload">
                <div class="title">单位授权书</div>
                <div class="upload-img">
                  <div class="img-show" @click="takePictures(3)">
                    <div class="img">
                      <img :src="bindingData.enterpriseAccreditPicUrl" class="show-img" alt/>
                      <img v-show="showimageUrl3" src="../image/icon3@2x.png" class="btn-img"
                           alt/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 单位授权书 -->
            <div class="table-view-cell" v-if="cardTypeData == 11">
              <div class="table-view-cell-text upload">
                <div class="title">手持加油卡图片</div>
                <div class="upload-img">
                  <div class="img-show">
                    <div class="img">
                      <img :src="bindingData.handCardPicUrl " class="show-img" alt/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="submit-success" v-else>
          <div class="submit-success-content">
            <div class="content-tips">
              <img src="../image/dsh.png" alt width="150"/>
              <p>申请提交成功,等待审核</p>
            </div>
            <div class="submit-content-btns">
              <button class="see-details" @click="seeDetail">查看详情</button>
              <button class="goback" @click="goback">返回</button>
            </div>
          </div>
        </div>
      </div>
      <div class="submitbtn" v-if="!isSubmit && !binddetail" @click="submitButn">提交审核</div>
      <!--弹框 选择拍照方式-->
      <van-popup v-model="showUploadStyle" position="bottom">
        <div class="upload-style">
          <div class="style" @click="onSelect(0)">拍照</div>
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
        pageTitle: '加油卡绑定',
        cardTypeData: '', // 加油卡类型
        binddetail: false,  //
        teldisabled: false, //
        showUploadStyle: false, // 弹框选择拍照方式
        imgType: '',  // 图片类型 0身份证正面 1身份证反面 2手持身份证 3单位授权书
        idPicUrl: '', // 身份证正面
        idVPicUrl: '', // 身份证反面
        handIdPicUrl: '', // 手持身份证
        handCardPicUrl: '', // 手持加油卡
        enterpriseAccreditPicUrl: '', // 单位授权书
        bindingData: {
          cardNo: '',
          phone: '',
          idPicUrl: '', // 身份证正面
          idVPicUrl: '', // 身份证反面
          handIdPicUrl: '', // 手持身份证
          handCardPicUrl: '', // 手持加油卡
          enterpriseAccreditPicUrl: '', // 单位授权书
          cardPicUrl: '', // 加油卡正面
          cardPicUrlV: '', // 加油卡反面
        },
        cardData: {},
        showimageUrl0: true,
        showimageUrl1: true,
        showimageUrl2: true,
        showimageUrl3: true,
        showCardPicUrl: true,
        showCardPicUrlV: true,
        isSubmit: false,
        cardName: '',
        cardId: ''
      }
    },
    mounted() {
      this.isSubmit = false
      this.bindingData.idPicUrl = require('../image/sfzzm.png')
      this.bindingData.idVPicUrl = require('../image/sfzfm.png')
      this.bindingData.handIdPicUrl = require('../image/scsfz.png')
      this.bindingData.enterpriseAccreditPicUrl = require('../image/dwsqs.png')
      if (this.$route.query.isAdd) {
        this.cardData = JSON.parse(this.$route.query.cardData)
        this.bindingData.cardNo = this.cardData.cardno
        this.cardName = this.cardData.ispricard == '1' ? '单位主卡卡号' : '单位副卡卡号'
        this.bindingData.bindCardType = this.cardData.ispricard
      } else {
        this.binddetail = true
        this.teldisabled = true
        this.cardTypeData = this.$route.query.cardType
        this.getbindDetail(this.$route.query.id)
      }
    },
    watch: {
      '$route'() {
        if (this.$route.query.itemData) {
          console.log(this.$route.query)
        }
      }
    },
    methods: {
      takePictures(type) {
        if (!this.binddetail) {
          // 拍照 1 行驶证首页
          this.showUploadStyle = true
          this.imgType = type
        }

      },
      onSelect(op) {
        // 拍照
        this.showUploadStyle = false
        if (op == 0) {  // 拍照
          this.getImg('2')
        } else if (op == 1) {  // 相册
          this.getImg('1')
        }
        this.getImg('3') // 身份证识别长方形框
      },
      getImg: function (op) {
        let that = this;
        this.$bridgefunc.getPhoto(op, function (img) {
          that.updateImg(img)

          let imgBack = 'data:image/jpg;base64,' + img
          if (that.imgType == 0) {
            that.idPicUrl = imgBack
            that.showimageUrl0 = false
          } else if (that.imgType == 1) {
            that.idVPicUrl = imgBack
            that.showimageUrl1 = false
          } else if (that.imgType == 2) {
            that.handIdPicUrl = imgBack
            that.showimageUrl2 = false
          } else if (that.imgType == 3) {
            that.enterpriseAccreditPicUrl = imgBack
            that.showimageUrl3 = false
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
              that.bindingData.idPicUrl = data.data
            } else if (that.imgType == 1) {
              that.bindingData.idVPicUrl = data.data
            } else if (that.imgType == 2) {
              that.bindingData.handIdPicUrl = data.data
            } else if (that.imgType == 3) {
              that.bindingData.enterpriseAccreditPicUrl = data.data
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          that.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
      submitButn() {
        if (this.bindingData.bindCardType == '1') {
          if (this.bindingData.phone == '') {
            this.$Toast('请填写手机号')
            return
          } else if (!this.$util.checkMobile(this.bindingData.phone)) {
            this.$Toast('请填写正确手机号')
            return
          } else if (this.showimageUrl3) {
            this.$Toast('请上传单位授权书')
            return
          }
        }
        if (this.showimageUrl0) {
          this.$Toast('请上传身份证正面照片')
          return
        } else if (this.showimageUrl1) {
          this.$Toast('请上传身份证反面照片')
          return
        } else if (this.showimageUrl2) {
          this.$Toast('请上传手持身份证照片')
          return
        }
        if (this.cardData.ispricard != '1') {
          this.bindingData.enterpriseAccreditPicUrl = ''
        }
        this.$request.post('/app/json/enterprise_card/submit', this.bindingData).then(res => {
          if (res.status == 0) {
            this.cardId = res.id
            this.isSubmit = true
          } else {
            this.$Toast(res.info)
          }
        })
      },
      seeDetail() {
        this.binddetail = true
        this.isSubmit = false
        this.teldisabled = true
        this.getbindDetail(this.cardId)
      },
      goback() {
        this.$router.go(-1)
        setTimeout(() => {
          this.isSubmit = false
        }, 500);
      },
      getbindDetail(id) {
        this.$request.post('/app/json/enterprise_card/queryApprovalInfo', {id: id}).then(res => {
          if (res.status == 0) {
            // this.cardData.ispricard = res.data.bindCardType
            // this.cardName = this.cardData.ispricard == '1' ? '单位主卡卡号' :  '单位副卡卡号'
            this.cardName = res.data.cardType == '11' ? '外省卡卡号' : '加油卡卡号'
            this.pageTitle = res.data.cardType == '11' ? '外省油卡绑定' : '加油卡绑定'
            this.bindingData = {
              ...res.data
            }
            this.showimageUrl0 = this.showimageUrl1 = this.showimageUrl2 = this.showimageUrl3 = this.showCardPicUrl = this.showCardPicUrlV = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  
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
      
      /deep/ .van-popup {
        background: none;
        padding: 11px 15px;
      }
      
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
      
      /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
        background: #F80F16;
        color: #fff;
      }
      
      .tips-dialog {
        text-align: center;
        padding: 50px 0;
      }
    }
  }
</style>
