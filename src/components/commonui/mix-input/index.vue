/**Created by liaoyingchao on 2018/11/6.*/

<template>
  <div class="index">
    <div class="text-input theme_bg_white_f5">
      <textarea class="input-textarea" v-model="inputText"
                :placeholder="placeholder != undefined ? placeholder : '请输入'"  @input="textInputChange" ></textarea>
    </div>
    <div class="img-input" v-if="images">
      <div class="s-imgs" v-for="img,index in images">
        <img :src="img" @click="uploadpic(index)"/>
      </div>
      <div class="s-imgs" v-if="images.length!=9"  @click="uploadpic(images.length)">
        <div class="add-img">
          <i class="iconfont mall-jiahao"></i>
        </div>
      </div>
    </div>
    <!--<div class="choosephoto" v-show="showChoosePhoto" @click.stop="bottomOp(2)">-->
      <!--<div class="oparea" @click.stop=''>-->
        <!--<p class="phitem bottom-line" @click.stop="bottomOp(0)">拍照</p>-->
        <!--<p class="phitem bottom-line" @click.stop="bottomOp(1)">从手机相册选择</p>-->
        <!--<p class="phitem" @click.stop="bottomOp(2)">取消</p>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import Photo from '@/components/commonui/choosephoto'

  export default {
    name: "index",
    components: {},
    props: {
      placeholder: String,
      text: String,
      imageUrls: Array,
      maxNumber: String
    },
    data() {
      return {
        inputText: '',
        showChoosePhoto: false,
        selectedIndex :0,
        images: []
      }
    },
    methods: {
      textInputChange: function (e) {

        let value = e.target.value;
        if(value.length>500){
          value=value.slice(0,500)
          this.$Toast('最大输入500个字');
        }
        this.inputText = value;
      },
      linkFunc: function (picUrl, img1) {
        console.log(picUrl);
        this.images.push(picUrl)
      },
      uploadpic: function (index) {//上传图片
        this.selectedIndex = index;
        // this.showChoosePhoto = !this.showChoosePhoto
        Photo.open({
          linkFunc: this.linkFunc,
          token: this.$store.state.login.token,
        });
      },
      bottomOp: function (op) {
        if (op == 0) {
          //拍照
          this.getImg('2');
        }
        else if (op == 1) {
          //从相册选择
          this.getImg('1');

        } else if (op == 2) {
          this.showChoosePhoto = false
        }
      },
      getImg: function (op) {
        let _this = this;
        this.$bridgefunc.getPhoto(op, function (img) {
          _this.showChoosePhoto = false
          _this.updateImg(img,_this.selectedIndex);
          _this.imageUrls[_this.selectedIndex] = 'data:image/jpeg;base64,' + img;
        })
      },
      updateImg(image,index) {
        this.$Loading.open('保存中')
        let url = '/uploadFile';
        let token = this.$store.state.login.token
        let params1 = {
          base64File: image,
          fileType: 'jpg',
          fileName: '评论'+"1.jpg",
          bucketName: 'app_img',
          token: token
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            // _this.submitRevise(data.data);
            _this.imageUrls[index] = data.data;
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000
            });
          }
        }, error => {
          _this.$Loading.close();
          Toast({
            message: '上传图片失败',
            position: 'bottom',
            duration: 2000
          })
        });
      },
    },
    watch: {
      inputText(curVal, oldVal) {
        if (this.maxNumber != undefined && this.maxNumber != null && this.maxNumber > 0) {
          if (curVal.length > this.maxNumber) {
            this.inputText = curVal.substr(0, this.maxNumber)
            this.$Toast('最多不能超过'+this.maxNumber+'字')
          }
        }
        this.$emit(`update:text`, curVal)
      },
      images(curVal, oldVal) {
        this.$emit(`update:imageUrls`, curVal)
      },
    },
    created() {
      this.inputText = this.text;
      this.images = this.imageUrls;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    overflow hidden
    .text-input {
      height 100px;
      border-radius 8px;
      padding 5px 0;
      .input-textarea {
        width 100%;
        height 100%;
        border none;
        resize: none
        background none
        padding 0 8px;
        font-size 12px;
        line-height 18px;
      }
    }
    .img-input {
      overflow hidden;
      .s-imgs {
        float left;
        margin 8px 10px 0 0;
        width 60px;
        height 60px;
        border-radius 8px;
        img{
          width 100%
          height 100%
        }
        .add-img {
          width 100%;
          height 100%;
          border-radius 8px;
          border 1px solid #ddd;
          display flex
          align-items center
          justify-content center
          i {
            font-size 25px;
            font-weight 500;
            color #ddd;
          }
        }
      }
      .s-imgs:nth-child(5n) {
        margin-right 0px;
      }
    }
    .choosephoto {
      position fixed
      left 0
      top 0
      bottom 0
      width 100%
      height 100%
      z-index 999
      background-color: rgba(0, 0, 0, 0.5);
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

  }
</style>
