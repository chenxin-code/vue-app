
<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <!--      <div class="content">-->
      <!--        <div class="steps">-->
      <!--          <van-steps :active="active" active-color="red">-->
      <!--            <van-step>-->
      <!--              <p>实名认证</p>-->
      <!--            </van-step>-->
      <!--            <van-step>-->
      <!--                <p>银行卡</p>-->
      <!--            </van-step>-->
      <!--            <van-step>-->
      <!--                <p>开通完成</p>-->
      <!--            </van-step>-->
      <!--          </van-steps>-->
      <!--        </div>-->
      <!--        v-show="active == 0"-->
      <div class="certificatesBox">
        <div v-show="active == 0">
          <div class="certificates">
            <div class="certificatesItem">
              <div class="imgBox" v-if="certificateObj.examineState == 2">
                <img class="backgroundImg" :src="certificateObj.imgFront || 'static/image/vocational-certification/rx@2x.png'" alt="">
              </div>
              <div class="imgBox" @click="takePictures(3,'imgFront')" v-else>
                <img class="backgroundImg" :src="certificateObj.imgFront || 'static/image/vocational-certification/rx@2x.png'" alt="">
                <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
              </div>
              <div class="text">
                <div class='textBox'>
                  <span>身份证正面</span>
                </div>
              </div>
            </div>
          </div>
          <div class="certificates">
            <div class="certificatesItem">
              <div class="imgBox" v-if="certificateObj.examineState == 2">
                <img class="backgroundImg" :src="certificateObj.imgBehind || 'static/image/vocational-certification/gh@2x.png'" alt="">
              </div>
              <div class="imgBox" @click="takePictures(3,'imgBehind')" v-else>
                <img class="backgroundImg" :src="certificateObj.imgBehind || 'static/image/vocational-certification/gh@2x.png'" alt="">
                <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
              </div>
              <div class="text">
                <div class='textBox'>
                  <span>身份证背面</span>
                </div>
              </div>
            </div>
          </div>
          <van-cell-group>
            <van-field :disabled="certificateCheck" v-model="certificateObj.name" label="姓名" placeholder="请输入姓名" required input-align="right"/>
            <van-field :disabled="certificateCheck" v-model="certificateObj.idcardNum" label="证件号" placeholder="请输入18位身份证号" required input-align="right"/>
            <van-field :disabled="certificateCheck" v-model="certificateObj.valid" label="有效期" placeholder="例：2000.01.01-2020.01.01" required input-align="right"/>
          </van-cell-group>
          <div class="bottom-btns btn">
            <span v-if="certificateObj.examineState == 2">审核中</span>
            <span @click="openingBtn" v-else>提交审核</span>
          </div>
        </div>

        <!--        </div>-->
        <!--        <div class="certificatesBox" v-show="active == 1">-->
        <!--          <div v-show='!cardObj.bankName'>-->
        <!--            <div class="bankCard">-->
        <!--              <van-cell-group>-->
        <!--                <van-field :error-message="licenseNoError" @input="checklicenseNo" v-model="cardObj.card" clearable placeholder="请输入银行卡卡号" />-->
        <!--              </van-cell-group>-->
        <!--            </div>-->
        <!--            <div class="bankCardbBtn btn" :style="{opacity: (cardObj.card && !licenseNoError) ? 1 : 0.5}">-->
        <!--              <span @click="verificationCardBtn">验证银行卡</span>-->
        <!--            </div>-->
        <!--            <div class="text">-->
        <!--              &lt;!&ndash; <span>每日最多可使用验证3次</span> &ndash;&gt;-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div v-show='cardObj.bankName'>-->
        <!--            <van-cell-group>-->
        <!--              <van-field label="验证通过："/>-->
        <!--              <van-field label="银行卡类型" v-model="cardObj.bankName" input-align="right" :readonly='true'/>-->
        <!--              <van-field label="银行卡卡号" v-model="cardObj.card" input-align="right" :readonly='true'/>-->
        <!--            </van-cell-group>-->
        <!--            <div class="bottom-btns btn">-->
        <!--              <span @click="saveBankInfoBtn">保存并下一步</span>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
                <div class="certificatesBox" v-show="active == 2">
                  <div class="iconBox">
                    <div class="icon-b">
                      <van-icon class='icon' name="passed" />
                      <span class="text">恭喜您完成微店开通</span>
                    </div>
                  </div>
                  <div class="bankCardbBtn btn">
                    <span @click="toLink">进入微店</span>
                  </div>
                  <div class="text"> </div>
                </div>
        <photograph :uploadData='uploadData' @picturesData='picturesData' @onCancel='onCancel' />
      </div>
    </nav-content>
    <div v-show="popupCard" class="card">
      <van-popup v-model="popupCard" class="popupCard" :close-on-click-overlay="false">
        <div class="popupCardText">
          <span>{{cardObj.info.split(',')[0]}}</span>
          <span>{{cardObj.info.split(',')[1]}}</span>
        </div>
        <div class="popupCardBtn">
          <span @click="popupCardBtn">{{(cardObj.info).includes('次数') ? '关闭' : '重新输入'}}</span>
        </div>
      </van-popup>
    </div>
    <!-- <div>
      <van-overlay :show="isJumpOver" @click="isJumpOver = false">
        <div class="wrapper" @click.stop>
          <div class="block" />
        </div>
      </van-overlay>
    </div> -->
  </div>
</template>
<script>
  import { mapState } from "vuex";
  import verifyBankCard from "./verifyBankCard.js";

  export default {
    name: "authentication",
    data() {
      return {
        value: '',
        // isJumpOver: false,
        licenseNoError: '',
        active: 0,
        parameterUrl: '',
        certificateCheck: false,
        isVerification: false,
        popupCard: false,
        uploadData: {
          isShowUpload: false,
        },
        certificateObj:{
          imgFront: '',   // 证件正面照片
          imgBehind: '',  // 证件背面照片
          name: '',       // 姓名
          idcardNum: '',  // 身份证号
          valid: '',      // 有效期
          sex: ''         // 性别
        },
        cardObj: {
          card: '',
          bank: '',
          bankName: '',
          cardName: '',
          cardType: '',
          info: ''
        },
        certification: {
          certificationFlag: '2', //实名认证是否通过 2 审核中 1 是 0 否
          verifyCardFlag: '', //是否保存银行卡 1 是 0 否
          openFlag: '1' //是否已开通微店 1 是 0 否
        }
      }
    },
    computed: {
      ...mapState(["globalConfig"])
    },
    mounted() {
      this.certificateCheck = this.globalConfig.certificate_check_type == 2 // 0：不审核，1：后台人工审核，2：调用接口审核）
      // this.isJumpOver = true
      this.isCheckIdentifyAllDetail()
    },
    beforeDestroy(){},
    methods: {
      isCheckIdentifyAllDetail() {
        this.$request.post('/app/json/user/checkIdentifyAllDetail').then(res => {
          if (res.status === 0) {
            let data = res.data
            if (data.isCertificate) {
              // this.active = 1
              this.active = 2
              this.saveBankInfoBtn() //绑卡
            } else {
              this.active = 0
              if (Object.keys(data.usercertificate).length) {
                let usercertificate = data.usercertificate
                this.certificateObj = {
                  imgFront: usercertificate.imgFront,   // 证件正面照片
                  imgBehind: usercertificate.imgBehind,  // 证件背面照片
                  name: usercertificate.name,       // 姓名
                  idcardNum: usercertificate.idcardNum,  // 身份证号
                  valid: usercertificate.valid,      // 有效期
                  sex: usercertificate.sex         // 性别
                }
                this.$set(this.certificateObj,'examineState',usercertificate.examineState)
              }
            }
          } else {
            this.$Toast(res.info ? res.info : '获取身份信息失败')
          }
        })
      },
      checklicenseNo(data) {
        let isNumbers = /^[0-9]*$/
        if (isNumbers.test(data)) {
          this.licenseNoError =  ''
        } else {
          this.licenseNoError =  '请输入正确的卡号'
        }
      },
      backEvent() {
        this.$router.go(-1);
      },
      openingBtn() {
        if (this.active == 0) {
          this.identifySubmmit()
        } else if (this.active == 1) {

        }
      },
      takePictures(type, url) {
        this.parameterUrl = url
        this.uploadData.type = type
        this.uploadData.isShowUpload = true
      },
      picturesData(data,base64StrImg){
        if (this.certificateCheck) {
          let type = 0
          if (this.parameterUrl == 'imgFront') {
            type = 0
          } else if (this.parameterUrl == 'imgBehind') {
            type = 1
          }
          this.ocrCertificate(type, base64StrImg,data)
        } else {
          this.certificateObj[this.parameterUrl] = data;
        }
      },
      ocrCertificate(type, base64StrImg,dataUrl) {
        // ocr识别  type: 0 身份证正面 imgFront   1 身份证反面 imgBehind
        this.$request.post('/app/json/ocr/ocrCertificate', {
          ocrType: type,
          base64Str: base64StrImg,
        }).then(res => {
          let data = res.data
          if (res.status === 0) {
            this.certificateObj[this.parameterUrl] = dataUrl
            if (type == 0) {
              this.certificateObj.idcardNum = data.idno
              this.certificateObj.name = data.name
              this.certificateObj.valid = data.valid
            } else {
              this.certificateObj.valid = data.valid
            }
          } else {
            this.$toast(res.info || '识别失败！')
          }
        })
      },
      onCancel(){
        this.uploadData.isShowUpload = false
      },
      identifySubmmit() {
        if (this.certificateObj.imgFront == '') {
          this.$Toast('请上传身份证正面')
        } else if (this.certificateObj.imgBehind == '') {
          this.$Toast('请上传身份证反面')
        } else if (this.certificateObj.name == '') {
          this.$Toast('请输入姓名')
        } else if (this.certificateObj.idcardNum == '' || !this.regIdNo(this.certificateObj.idcardNum)) {
          this.$Toast('请输入身份证号或输入正确的身份证号')
        } else if (this.certificateObj.valid == '') {
          this.$Toast('请输入身份证号有效期')
        } else {
          this.certificateObj['sex'] = this.gender(this.certificateObj['idcardNum'])
          this.$request.post('/app/json/user/identifySubmmit',this.certificateObj).then(res => {
            if (res.status === 0) {
              this.$Toast('提交身份信息成功')
              // this.active = 1
              this.active = 2
            } else {
              this.$Toast(res.info ? res.info : '提交身份信息失败')
            }
          })
        }
      },
      verificationCardBtn() {
        if (this.cardObj.card && !this.licenseNoError) {
          if (verifyBankCard(this.cardObj.card) == 'error') {
            this.licenseNoError =  '请输入正确的卡号'
          } else {
            this.$request.post('/app/json/micro_store_front_end/verifyBankNo', {card: this.cardObj.card}).then(res => {
              if (res.status === 0) {
                let obj = res.data
                // this.isVerification = Object.keys(obj).length
                this.popupCard = !Object.keys(obj).length
                console.log(obj,Object.keys(obj).length)
                if (Object.keys(obj).length) {
                  console.log(obj.bankCard)
                  this.cardObj = {
                    card: obj.card,
                    bank: obj.bank,
                    bankName: obj.bankCard,
                    cardName: obj.cardName,
                    cardType: obj.cardType,
                    info: ''
                  }
                  console.log(1,this.cardObj)
                }
              } else {
                this.popupCard = true
                this.cardObj.info = res.info
              }
            })
          }
        } else {
          // this.$toast('请输入正确的银行卡卡号')
        }
      },
      popupCardBtn() {
        this.cardObj.card = ''
        this.popupCard = false
      },
      saveBankInfoBtn() {
        this.$request.post('/app/json/micro_store_front_end/saveBankInfo', {card: this.cardObj.card,bankName: this.cardObj.bankName}).then(res => {
          if (res.status === 0) {
            this.active = 2
          } else {
            this.$toast(res.info)
          }
        })
      },
      toLink() {
        this.$router.push({
          path: '/micro_sho/myshopIndex',
          query: { lastPath: 'authentication'}
        })
      },
      regIdNo(driveCode){ // 验证身份证
        let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        return regIdNo.test(driveCode)
      },
      gender(idcardNum) { // 性别
        return parseInt(idcardNum.substr(16, 1)) % 2 == 1 ? '男' : '女'
      }
    },
    components: {
      photograph: () => import("./photograph.vue")
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  /deep/ .nav-content{
    background-color #f6f6f6
  }
  .box {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .content {
      max-height: calc(100% - 46px);
      overflow-y: auto;
    }
    .steps {
      margin 6px 0
      /deep/ .van-steps__items {
        margin-left 16px
        margin-right 16px
      }
    }
    .certificatesBox{
      padding 20px 5px 5px
      background-color #fff
      overflow-y: auto
      .certificates{
        width 100%
        height 140px
        display flex
        justify-content center
        align-items center
        .certificatesItem{
          width 50%
          height 140px
          padding 5px
          display flex
          flex-direction column
          .imgBox{
            position relative
            width 100%
            height 100px
            .backgroundImg{
              width 100%
              height 100%
            }
            .tipsImg{
              width 50px
              height 50px
              position absolute
              top 0
              left 0
              right 0
              bottom 0
              margin auto
            }
          }
          .text{
            width 100%
            height 26px
            color #636363
            display flex
            flex-direction column-reverse
            align-items center
            .textBox{
              display flex
              justify-content center
              align-items center
              .question-o{
                font-size 14px
              }
            }
          }
        }
      }
      .iconBox {
        width 100%
        height 80px
        color #46ba38
        font-size 40px
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-b {
          display: flex;
          align-items: center;
          flex-direction:column
        }
        .icon {

        }
        .text {
          font-size 14px
        }
      }
    }
    .bankCard {
      padding 0 14px
      /deep/ .van-cell{
        border 1px solid #ccc
        border-radius 6px
        padding 8px
      }
    }
    .btn {
      width: 100%;
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 16px;
        display: inline-block;
        background-color: #f02e2c;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .bottom-btns {
      height: 46px;
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
    }
    .bankCardbBtn {
      height: 46px;
      padding 0 14px
      margin-top 40px
      span {
        border-radius: 30px;
      }
    }
    .text {
      height 40px
      color #8e8888
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .card {
      /deep/ .van-popup {
        width: 76%;
        font-size: 14px;
        color: #8c8c8c;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .popupCard {
        height: 160px;
        flex-direction: column;
        line-height: 26px;

        .popupCardText {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .popupCardBtn {
          width: 100%;
          color: #000;
          height: 50px;
          display: flex;
          justify-content: center;
          font-size 16px

          span {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          >:last-child {
            color #fff;
            background-color #f02e2c
          }
        }
      }
    }
  }
</style>
