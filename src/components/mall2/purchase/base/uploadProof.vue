/**Created by liaoyingchao on 2019-04-30.*/

<template>
  <div class="order-list mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="my-content">
        <div class="img-con">
          <img :src="bindingData.cardPicUrl" class="show-img" alt />
          <img v-show="showimageUrl2" src="../images/photo.png" class="btn-img" alt />
        </div>

        <van-popup v-model="showUploadStyle" position="bottom">
          <div class="upload-style">
            <div class="style" @click="onSelect(0)">拍照</div>
            <div class="style" @click="onSelect(1)">相册</div>
            <div class="style" @click="showUploadStyle = false">取消</div>
          </div>
        </van-popup>
        <button class="order-pay" @click="submitHandle">{{text}}</button>
        <div class="tips">
          温馨提示：支付凭证用于店铺管理人员审核订单款项，请尽量保持图片清晰
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  // import OrderPro from './base/order-pro'
  export default {
    name: "upload-proof",
    components: {
      // OrderPro
    },
    data() {
      return {
        bindingData:{},
        showimageUrl2:true,
        showUploadStyle: false,
        text:'上传支付凭证'

      }
    },
    computed: {

    },
    methods: {
      submitHandle(){
        this.showUploadStyle = true
      },
      onSelect(op) {
        // 拍照
        this.showUploadStyle = false
        if (op == 0) {  // 拍照
            this.getImg('2')
        } else if (op == 1) {  // 相册
          this.getImg('1')
        }

      },
      getImg: function (op) {
        let that = this;
        console.log(op)
        this.$bridgefunc.getPhoto(op, function (img) {
          console.log(img)
          that.updateImg(img)

          let imgBack = 'data:image/jpg;base64,' + img
            that.idPicUrl = imgBack
            that.showimageUrl2 = false
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
              that.bindingData.cardPicUrl = data.data
            that.save(data.data)
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          that.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
      save(data){
        let token = this.$store.state.login.token
        let params = {
              id:this.$route.query.id,
              proofUrl:data,
              token:token
                }
                this.$http.post('/app/json/app_purchase_order/uploadProof', params).then(res => {
                  let data = res.data
                  if (data.status == 0) {
                    this.text='修改支付凭证'
                    this.$Toast('上传成功')
                  } else {
                    this.$Toast(data.info)
                  }
                }).catch((err) => {
                  this.$Toast(err)
                })
      }
    },
    created() {
      console.log(555)
      if(this.$route.query.proofUrl){
        this.bindingData.cardPicUrl = this.$route.query.proofUrl
        this.showimageUrl2=false
        this.text='修改支付凭证'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .order-pay {
    border: none;
    width: 90%;
    position: absolute;
    margin: 0 auto;
    height: 45px;
    left: 10px;
    right: 10px;
    bottom: 30px;
    background: #fe0018;
    color: #fff;
    text-align: center;
    line-height: 45px;
    font-size: 0.426667rem;
    border-radius: 30px;
  }

  .img-con{
    margin 0 10px
    border 1px solid #3C3C3C
    display flex
    justify-content center
    align-items center
    height 300px
  }
    .show-img{
      max-width 100%
      max-height 100%
    }
  .tips{

    margin 10px 10px
    line-height 20px
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
