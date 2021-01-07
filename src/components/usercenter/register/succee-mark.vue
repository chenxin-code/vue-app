/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="succee-mark">
    <div class="mark-center">
      <div class="img">
        <img src="../../../../static/image/login2/succee-icon.png"/>
        <i class="close-btn" @click="closeBtn()"></i>
      </div>
      <p class="text">{{succeeText}}</p>
    </div>

  </div>
</template>

<script>
  export default {
    name: "index",
    components: {},
    props:[
      'succeeText'
    ],
    data() {
      return {

      }
    },
    methods: {
      closeBtn: function () {
        this.$emit('closeBtn')
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .succee-mark{
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
      border-radius:5px;
      -webkit-border-radius:5px;
      text-align:center;
      .img{
        padding:34px 0px 25px 0px;
        text-align:center;
        position:relative;
        img{
          width:50px;
          height:50px;
          display:inline-block;
        }
        .close-btn{
          width:15px;
          height:15px;
          display:block;
          position:absolute;
          right:10px;
          top:10px;
          z-index 1;
          background:url("../../../../static/image/coupon/close-btn.png") 0px 0px no-repeat;
          background-size:15px 15px;
        }
      }
      .text{
        font-size:$font-size-medium;
        font-weight:600;
        color:#333;
      }
    }
  }
</style>
