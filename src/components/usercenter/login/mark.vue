/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="mark">
    <div class="mark-center">
      <div class="img">
        <img src="static/image/login2/zhiwen.png"/>
      </div>
      <p class="text">请验证您的指纹</p>
      <div class="cancel">取消</div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "index",
    components: {},
    data() {
      return {

      }
    },
    methods: {
      registerEvent: function () {

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
    background:rgba(0,0,0,0.66);
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
      border-radius:4px;
      -webkit-border-radius:4px;
      text-align:center;
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
        font-weight:500;
        color:#333;
      }
      .cancel{
        width:100%;
        height:100px;
        font-size:$font-size-medium;
        position:absolute;
        left:0px;
        bottom:0px;
        line-height:50px;
        background:#f02c2d;
        color:#fff;
        border-radius:0px 0px 5px 5px;
        -webkit-border-radius:0px 0px 5px 5px;
      }
    }
  }
</style>
