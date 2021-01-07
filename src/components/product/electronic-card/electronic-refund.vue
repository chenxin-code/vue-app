<template>
  <div>
    <nav-top title="申请退款" @backEvent="goback"></nav-top>
    <nav-content style='padding: 5px 10px;'>
      <div class="step" >
          <div class="left">
            <span class="icon" :class="{icongray: step == 2}">
              
            </span>
            <p class='text'>填写收款人信息</p>
          </div>
          <div class="line">
            
          </div>
          <div class="right">
            <span class="icon" :class="{iconred: step == 2}">
              
            </span>
            <p class='text'>上传身份证照片</p>
          </div>
      </div>
      <div class="publicInvoice" v-if='step==1'>
        <van-cell-group>
          <van-field v-model.trim="params.realName"  label="姓名" placeholder="请输入姓名"/>
          <van-field v-model.trim="params.reservedPhone" label="手机号" placeholder="请输入预留手机号" @blur="checkPhoneNumber"/>
          <van-field v-model.trim="params.idNo" label="身份证号" placeholder="请输入身份证号" @blur="checkIdNumber"/>
          <van-field v-model.trim="params.debitCardNo" label="借记卡卡号" placeholder="请输入借记卡卡号" @blur="checkCardNum"/>
          <van-field v-model.trim="params.openingBank" label="开户行" placeholder="例：北京建设银行中关村分行"/>
          <van-field v-model.trim="params.openingBankNo" label="银行代码" placeholder="请输入开户行银行代码"/>
          <van-field v-model.trim="refundAmount" disabled label="退款金额" />
        </van-cell-group>
      </div>
      <div class="upload"  v-if='step==2'>
          <div class="title">请上传您的的身份证照片</div>
          <div class="img-show" @click="takePictures(0)">
              <div class="img">
                  <img v-if="params.idPicUrl" :src="params.idPicUrl" class="show-img" alt />
                  <img v-else :src="idPicUrl" class="show-img" alt />
                  <img v-show="showimageUrl0" src="./images/icon3@2x.png" class="btn-img" alt />
              </div>
              <div class="tips">身份证国徽面</div>
          </div>
          <div class="img-show" @click="takePictures(1)">
              <div class="img">
                  <img v-if="params.idVPicUrl" :src="params.idVPicUrl" class="show-img" alt />
                  <img v-else :src="idVPicUrl" class="show-img" alt />
                  <img v-show="showimageUrl1" src="./images/icon3@2x.png" class="btn-img" alt />
              </div>
              <div class="tips">身份证头像面</div>
          </div>
      </div>
      <!--弹框 选择拍照方式-->
      <van-popup v-model="showUploadStyle" position="bottom">
        <div class="upload-style">
          <div class="style" @click="onSelect(0)">拍照</div>
          <div class="style" @click="onSelect(1)">相册</div>
          <div class="style" @click="showUploadStyle = false">取消</div>
        </div>
      </van-popup>
      <div class="footer">
        <van-button type="primary" color='#F02C2D' block @click="submit(step)">{{stepName}}</van-button>
      </div>
    </nav-content>
  </div>
</template>

<script>
  const params = {
    realName: null, // 姓名
    reservedPhone: null,  //手机号
    idNo: null, //身份证号
    debitCardNo: null, //借记卡号
    openingBank: null, //开户行
    openingBankNo: null, //开户行代码
    refundAmount: null,// 退款金额
    idPicUrl: null, //身份证正面
    idVPicUrl: null //身份证反面
  }
  export default {
    data() {
      return {
        params: this.$util.deepClone(params),
        showimageUrl0: true,
        showimageUrl1: true,
        showUploadStyle: false,
        refundAmount: 0,
        step: 1,
        idPicUrl: null,
        idVPicUrl: null,
        imgType: null,
        valiedList:[
          {key:"realName",value:"请输入姓名"},
          {key:"reservedPhone",value:"请输入手机号码"},
          {key:"idNo",value:"请输入身份证号码"},
          {key:"openingBank",value:"请输入开户行"},
          {key:"debitCardNo",value:"请输入借记卡卡号"},
          {key:"openingBankNo",value:"请输入开户行代码"},
          {key:"refundAmount",value:"请输入退款金额"},
        ]
      }
    },
    methods:{
      checkPhoneNumber(event) {
        if(!this.$util.checkMobile(event.target.value)) {
          this.$toast("请输入正确的手机号码")
        }
      },
      checkIdNumber(event) {
        if(!this.$util.IDCardCheck(event.target.value)) {
          this.$toast("请输入正确的身份证号码")
        }
      },
      checkCardNum(event) {
        if(!(/^[1-9]\d{9,29}$/.test(event.target.value))) {
          this.$toast("请输入正确的借记卡号码")
        }
      },
      goback() {
        if(this.step == 1) {
          this.$router.go(-1)
        } else {
          this.step = 1;
        }
      },
      onSelect(op) {
        this.showUploadStyle = false
        if (op == 0) {  // 拍照
          if (this.imgType != 2) {
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
            that.params.idPicUrl = imgBack
            that.showimageUrl0 = false
          } else if (that.imgType == 1) {
            that.params.idVPicUrl = imgBack
            that.showimageUrl1 = false
          } else if (that.imgType == 2) {
            that.params.handCardPicUrl = imgBack
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
              // this.ocrCertificate(0, image, data.data)
              that.params.idPicUrl = data.data
            } else if (that.imgType == 1) {
              that.params.idVPicUrl = data.data
              // this.ocrCertificate(1, image)
            } else if (that.imgType == 2) {
              that.params.handCardPicUrl = data.data
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          that.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
      takePictures(num) {
        this.showUploadStyle = true;
        this.imgType = num;
      },
      submit(n) {
        if(n == 1) {
          for(let i = 0; i < this.valiedList.length; i++) {
            if(!this.params[this.valiedList[i].key]){
              this.$toast(this.valiedList[i].value)
              return;
            }
            if(!this.$util.checkMobile(this.params.reservedPhone)) {
              this.$toast("请输入正确的手机号")
              return;
            }
            if(!this.$util.IDCardCheck(this.params.idNo)) {
              this.$toast("请输入正确的身份证号码")
              return;
            }
            if(!(/^[1-9]\d{9,29}$/.test(this.params.debitCardNo))) {
              this.$toast("请输入正确的借记卡号码")
              return;
            }
          }
          this.step = 2;
        } else if(n == 2) {
          if(!this.params.idPicUrl) {
            this.$toast("请上传身份证正面照片")
            return;
          } 
          if(!this.params.idVPicUrl) {
            this.$toast("请上传身份证反面照片")
            return;
          }
          this.submitParams()
        }
      },
      submitParams() {
        this.$http.post("/app/json/app_user_ele_card_refund/refundApply",this.params).then(res=>{
          let data = res.data;
          if(data.status == 0) {

            let url = {
              path: "/electronic_refund_result",
              query:{
                type: 1
              }
            }
            this.$router.push(url)
          } else {
            this.$toast(data.info)
          }
        })
      }
    },
    mounted() {
      if(!this.$route.query.refundAmount) {
        this.$toast("没有获取到可退款的金额")
        this.$router.replace("/electronic_card")
        return;
      }
      this.refundAmount = "￥"+this.$route.query.refundAmount;
      this.params.refundAmount = this.$route.query.refundAmount;
      this.idPicUrl = require('./images/sfzzm.png')
      this.idVPicUrl = require('./images/sfzfm.png')
    },
    computed:{
      stepName() {
        return this.step == 1 ? "下一步" : "提交";
      }
    }
  }
</script>

<style lang="stylus" scoped>
.step{
  height: 100px;
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  border-radius: 6px;
  display: flex;
  padding: 20px 80px;
  .left{
    width: 24px;
    position: relative;
  }
  .line{
    height: 1px;
    position: relative;
    top: 10px;
    background: #DCDDDD;
  }
  .icon{
    height: 24px;
    display: block;
    background: url(./images/collection-red.png) no-repeat;
    background-size: 100% 100%;
  }
  .icongray{
      background-image: url(./images/collection-gray.png);
  }
  .line{
    flex: 1;
  }
  .text{
    white-space: nowrap;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    top: 35px;
    color: #333;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .right{
    width: 24px;
    position: relative;
    .icon{
      background-image: url(./images/upload-gray.png);
    }
    .iconred{
      background-image: url(./images/upload-red.png);
    }
  }
}
.publicInvoice{
  margin-top: 15px;
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  border-radius: 6px;
  overflow: hidden;
  /deep/ .van-cell:not(:last-child)::after {
    right: 0.5rem;
  }
  /deep/ .van-field__label{
    color: #333333 !important;
  }
}
.upload {
  display: block;
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  padding: 15px;
  margin-top: 15px;
  border-radius: 6px;
  font-family: PingFangSC-Regular, PingFang SC;
  .title{
    font-size: 15px;
    color: #333333;

  }
  .img-show {
    text-align: center;
    margin: 20px 0;
    .img {
        position: relative;
        width: 163px;
        height: 100px;
        margin: 0 auto;
        .show-img {
            width: 100%;
            height: 100%;
        }

        .btn-img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          width: 30%;
        }
    }
    .tips{
      color: #666;
      line-height: 28px;
    }
}
}
.footer{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
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
</style>