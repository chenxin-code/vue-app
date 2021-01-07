<template>
  <div class="material-index">
    <div class="box-shadow driving-upload">
      <div class="img-upload">
        <div class="upload-title">{{materialTxt}}</div>
        <div class="driving-img" @click="upPaperImgUrlHandle">
          <img v-if="paperImgUrl" :src="paperImgUrl" alt="">
          <img v-else class="upload-icon" src="../../../assets/images/upload-icon.png" alt="">
        </div>
        <span class="see-text" @click="seeHandle">查看示例</span>
      </div>
    </div>
    <van-popup v-model="showUploadStyle" position="bottom">
      <div class="upload-style">
        <div class="style" @click="onSelect(0)">拍照</div>
        <div class="style" @click="onSelect(1)">相册</div>
        <div class="style" @click="showUploadStyle = false">取消</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import {ImagePreview} from 'vant';

  export default {
    props: {
      subParams: Object,
      materialTxt: String
    },
    data() {
      return {
        showUploadStyle: false,
        paperImgUrl: '',
        materialFormData: {}
      }
    },
    mounted() {
    },
    methods: {
      seeHandle() {
        ImagePreview({
          images: ['http://tbdmgt.deepermobile.com/download?guid=fb1a67e3b55443e0ab65ead6b7af5304', 'http://tbdmgt.deepermobile.com/download?guid=29aadccb63f0453e85e77b0338d18a52']
        })
      },
      upPaperImgUrlHandle() {
        this.showUploadStyle = true
      },
      onSelect(op) {
        this.showUploadStyle = false
        if (op == 0) {
          this.getImg('2')
        } else if (op == 1) {
          this.getImg('1')
        }
      },
      getImg(op) {
        let that = this
        this.$bridgefunc.getPhoto(op, img => {
          that.updateImg(img)
          let imgBack = 'data:image/jpg;base64,' + img
          that.paperImgUrl = imgBack
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
            that.materialFormData.paperImgUrl = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          that.$Loading.close();
          this.$Toast('上传图片失败')
        })
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .material-index {
    .box-shadow {
      background: #FFFFFF;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding 10px 10px;
    }
    
    .img-upload {
      display flex;
      flex-direction column;
      align-items: center;
      height: 160px;
      justify-content: space-around;
      
      .driving-img {
        display flex
        height: 100px;
        align-items: center;
        justify-content: center;
        width: 100%;
        
        .upload-icon {
          width: 60px;
          height 60px;
        }
        
        img {
          height 100%;
        }
      }
      
      .see-text {
        color #F02C2D;
      }
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
  }
</style>