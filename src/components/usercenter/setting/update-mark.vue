/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="mark" v-if="showMark" @click.stop="closeMark">
    <div class="mark-center" >
      <p class="mark-title">{{title}}</p>
      <div class="input-text">
        <input :placeholder="placeholder" @click.stop="stopP" v-model="text" @input="textInputChange" />
      </div>
      <!--错误提示-->
      <!--<p class="err-tip">旧密码验证失败，请重新输入！</p>-->
      <div class="btn">
        <span class="btn-c" @click="closeMark">取消</span>
        <span class="btn-s" @click="submit">提交</span>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "",
    components: {
    },
    props:[
    ],
    data() {
      return {
        text:'',
        placeholder:'',
        title:'',
        item:{},
        showMark:false
      }
    },
    methods: {

      textInputChange: function (e) {

        if(this.item.key == 'nickName'){
          let value = e.target.value;
          if(value.length>10){
            value=value.slice(0,10)
            this.$Toast('最大输入10个字');
          }
          this.text = value;
        }
      },
      showMarkFun:function(item,title,placeholder){
        this.item = item;
        this.title = title;
        this.placeholder = placeholder;
        this.showMark = true;
      },
      closeMark:function(){
        this.showMark = false;
        this.text = ''
      },
      submit:function () {
        if(this.text == ''){
          this.$Toast(this.placeholder);
          return;
        }
        if(this.item.key == 'email'){
          if(!this.$util.checkMail(this.text)){
            this.$Toast('请输入正确的邮箱');
            return;
          }
        }

        this.$emit('submitData',this.item,this.text);
      },
      //阻止click传递
      stopP:function (event) {
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .mark{
    width:100%;
    height:100%;
    position:absolute;
    top:0px;
    left:0px;
    background:rgba(0,0,0,0.5);
    z-index:99
    .mark-center{
      width:280px;
      height:150px;
      position:absolute;
      left:50%;
      top:50%;
      margin-left:-140px;
      margin-top:-100px;
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
      .img{
        padding:20px 0px 10px 0px;
        text-align:center;
        img{
          width:40px;
          height:40px;
          display:inline-block;
        }
      }
      .text{
        font-size:$font-size-medium;
        line-height:18px;
        font-weight:500;
        color:#333;
        padding:0px 45px;
      }
      .input-text{
        padding:0px 30px;
        input{
          width:100%;
          padding:0px 10px;
          height:28px;
          background #f2f2f2;
          border-radius:14px;
          font-size:$font-size-medium-s
        }
      }
      .err-tip{
        color:#f02c2d;
        line-height:30px;
        font-size:$font-size-medium-s
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
          background:#f02c2d;
        }
      }
    }
  }
</style>
