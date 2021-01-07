/**Created by steven on 2018/10/14.*/

<template>
  <div class="choosePhoto" v-show="visible" @click.stop="bottomOp(2)">
    <input ref="PicInput" class="pic-input" type="file" accept="image/gif,image/jpeg,image/jpg,image/png" @change="fileChange" hidden>
    <div class="oparea">
      <p class="phitem bottom-line" @click.stop="bottomOp(0)" v-if="hasCamera()">拍照</p>
      <p class="phitem bottom-line" @click.stop="bottomOp(1)">从相册中选择</p>
      <p class="phitem" @click.stop="bottomOp(2)">取消</p>
    </div>
  </div>
</template>

<script>
import Config from '@/api/config.js'
import wxfunc from '@/utils/wxfunc'
import store from "../../../vuex/store";

export default {
  name: "choosePhoto",
  components: {

  },

  data () {
    return {
      //hasCamera: false,
      visible: false,
      linkFunc:null,
      token:'',
      type: ''
    }
  },
  methods: {
    hasCamera: function () {
      if (store.state.webtype == '1' || store.state.webtype == '2' || store.state.webtype == '3') {
        return true
      }
      return false
    },
    fileChange: function (event) {
      let files = event.target.files
      if (files.length > 0) {
        let reader = new FileReader();	// 实例化一个FileReader对象，用于读取文件

        //读取File对象的数据
        reader.onload = (evt) => {
          let showImgData = evt.target.result
          let uploadImgData = showImgData.split('base64,')[1]
          this.visible = false
          //let showImgData = 'data:image/jpg;base64,' + uploadImgData;
          this.uploadImg(uploadImgData,showImgData);
        }
        reader.readAsDataURL(files[0])
      }
    },
    bottomOp: function (op) {
      if (op == 0) {
        //拍照
        this.getImg(this.type || 2); // phototype 1 是相册 2 是拍照 3 自定义相机拍证件
      }
      else if (op == 1) {
        if (store.state.webtype == '1' || store.state.webtype == '2' || store.state.webtype == '3') {
          //从相册选择
          this.getImg('1');
        } else {
          this.$refs.PicInput.click();
        }

      } else if (op == 2) {
        this.visible = false
      }
    },
    getImg: function (op) {
      this.$bridgefunc.getPhoto(op,  (uploadImgData,type)=> {
        if(type && type == 'mediaid'){
          this.dealImgWithMediaId(uploadImgData);
        }else {
          this.dealImgData(uploadImgData);
        }
      })
    },

    dealImgData:function(uploadImgData){
      this.visible = false
      let showImgData = 'data:image/jpg;base64,' + uploadImgData;
      this.uploadImg(uploadImgData,showImgData);

      // imgDataFunc 直接把图片数据回调   此类不做上传操作
      // if(this.imgDataFunc){
      //   this.imgDataFunc(showImgData,uploadImgData);
      // }else {
      // }
    },
    dealImgWithMediaId:function(mediaId){
      this.visible = false;
      this.uploadWithMediaId(mediaId);
    },

    /**
     *
     * @param uploadImgData  需要上传的imgData
     * @param showImgData  本地显示的imgData  img标签直接使用 避免使用路径再次下载
     */
    uploadImg(uploadImgData,showImgData) {
      this.$Loading.open()
      let url = Config.baseURL+'/uploadFile';
      let params1 = {
        base64File: uploadImgData,
        fileName: 'header.jpg',
        fileType:'jpg',
        bucketName: 'app_img',
        token: this.token
      }
      this.$http.post(url, params1).then(res => {
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          if(this.linkFunc){
            this.linkFunc(data.data,showImgData);
          }
        } else {
          this.$Toast({
            message: data.info,
            position: 'bottom',
            duration: 2000
          });
        }
      }, error => {
        this.$Loading.close();
        this.$Toast({
          message: '上传图片失败',
          position: 'bottom',
          duration: 2000
        })
      });
    },

    uploadWithMediaId:function(mediaId) {
      this.$Loading.open()
      let url = Config.baseURL+'/app/json/we_chat/uploadWxFile';
      let params1 = {
        mediaId: mediaId,
        token:store.state.login.token
      }
      this.$http.post(url, params1).then(res => {
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          if(this.linkFunc){
            this.linkFunc(data.data.url,mediaId);
          }
        } else {
          this.$Toast({
            message: data.info,
            position: 'bottom',
            duration: 2000
          });
        }
      }, error => {
        this.$Loading.close();
        this.$Toast({
          message: '上传图片失败',
          position: 'bottom',
          duration: 2000
        })
      });
    },
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
.choosePhoto {
  position absolute
  left 0
  top 0
  width 100%
  height 100%
  z-index 1999
  background-color: rgba(0, 0, 0, 0.4);
  .pic-input {

  }
  .oparea {
    position absolute
    left 0
    right 0
    bottom 0
    background-color #ffffff
    .phitem {
      height 50px
      line-height 50px
      text-align center
      font-size $font-size-medium
    }
    .bottom-line {
      border-bottom: 1px solid $color-line-gray-l;
    }
  }
}

</style>
