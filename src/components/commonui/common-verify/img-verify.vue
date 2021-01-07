/**Created by steven on 2019/10/16.*/

<template>
  <div class="img-verify">
    <div class="mark-center">
      <p class="mark-title">图像验证码</p>
      <div class="passwords-input imgCode">
        <div class="passwords">
          <input @blur="blur" placeholder="请输入右侧校验码" v-model="imgCode" @input="imgCode = imgCode.replace(/\s+/g, '').toLowerCase()"/>
        </div>
        <div class="show-passwords" @click="getImgCode()">
          <img :src="verifyData && verifyData.backgroundImage" class="jiaoyanma"/>
        </div>
        <div class="show-passwords" @click="getImgCode()">
          <img src="static/image/login2/shuaxin.png" class="shuaxian" />
        </div>
      </div>
      <!--错误提示-->
      <!--<p class="err-tip">旧密码验证失败，请重新输入！</p>-->
      <div class="btn">
        <span class="btn-c" @click="closeMark">取消</span>
        <span class="btn-s theme_standard_bg_i" @click="submit">确定</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "img-verify",
  props: ['verifyData'],
  components: {

  },
  data () {
    return {
      imgCode:'',
    }
  },
  methods: {
    blur() {
      window.scroll(0,0)
    },
    getImgCode:function(){
      this.imgCode = ''
      this.$emit('getVertifyDatas');
    },
    closeMark:function(){
      this.$emit('cancelEvent')
    },
    submit:function(){
      if(this.imgCode == ''){
        this.$Toast('图像验证码不能为空');
        return;
      }
      this.$emit('submitCode',this.imgCode);
    },

  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .img-verify {
    /*width 100%
    height 100%
    overflow hidden
    position:absolute;
    top:0px;
    left:0px;
    z-index:99*/
    .mark-center{
      width:280px;
      height:150px;
      position relative;
      /*position:absolute;
      left:50%;
      top:50%;
      margin-left:-140px;
      margin-top:-100px;*/
      background:#fff;
      border-radius:5px;
      -webkit-border-radius:5px;
      text-align:center;
      .mark-title{
        padding:15px 0px;
        font-size:$font-size-medium;
        color:#333;
        font-weight:600;
      }

      .btn{
        width:100%;
        height:50px;
        font-size:$font-size-medium;
        position:absolute;
        left:0px;
        bottom:0px;
        line-height:50px;
        color:#fff;
        border-radius:0px 0px 50px 50px;
        -webkit-border-radius:0px 0px 5px 5px;
        display: flex;
        justify-content: space-around;
        overflow:hidden;
        span{
          display:block;
          width:100%;
        }
        .btn-c{
          color:#333333;
          background:#fff;
        }
        .btn-s{
          color:#fff;
        }
      }
    }

    .passwords-input{
      padding:0px 10px 0px 10px;
      display: flex;
      align-items center;
      justify-content: space-between;
      .passwords{
        flex 1
        border-radius 5px
        input{
          height 30px;
          display:block;
          width:100%;
          font-size:$font-size-medium-s;
          background #f2f2f2;
          padding 0px 5px
        }
      }
      .show-passwords{
        extend-click()
        img{
          display:block;
          // margin-top:4px;
        }
        .jiaoyanma{
          flex-shrink 0
          flex-grow  0
          height:36px;
        }
        .shuaxian{
          flex-shrink 0
          flex-grow  0
          width:15px;
          height:15px;
        }
      }
    }
  }
</style>
