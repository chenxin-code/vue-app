/**Created by steven on 2018/4/25.*/

<template>
  <transition name="st-indicator">
    <div class="ui-loading" v-show="visible" @touchmove.stop.prevent>
      <i>
        <div class='box'>
          <div class="box2"></div>
        </div>
        <img  class="loading-img" :src="$store.state.globalConfig.loadingUrl || 'static/config/loading.png'">

      </i>
      <div class="ui-loading-mask">
      </div>
    </div>
  </transition>
</template>


<script>

  export default {
    name: "stloading",
    components: {},
    data() {
      return {
        visible: false
      }
    },
    methods: {},
    created() {
    },
    mounted() {
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .st-indicator-enter,
  .st-indicator-leave-active {
    opacity: 0;
  }

  .ui-loading {
    transition: opacity .2s linear;
    position: absolute;
    left: 0;
    right 0;
    top: 0;
    bottom 0;
    z-index: 9999;       

    .ui-loading-mask {
      position: absolute;
      top: 0;
      left: 0;
      background-color: #000;
      opacity: .2;
      z-index: 1
    }

    i {
      position relative;
      height: 60px;
      width: 60px;
      display: block;

      left: 50%
      top 50%
      transform translate(-50%, -50%)
      img {
        position absolute;
        left 5px;
        top 5px;
        width 50px;
        height 50px;
        z-index: 3
      }
    }

    // @keyframes moveover {
    //   0%   {transform:rotate(0deg);}
    //   100% {transform:rotate(360deg);}
    // }
    .box{
      position:absolute;
      width:100%;
      height:100%;
      // animation:moveover 1s linear infinite;
    }
    // .box::before{
    //   content:"";
    //   position:absolute;
    //   width: 50%;
    //   height: 100%;
    //   border-radius:30px 0 0 30px;
    //   /* 起始最深颜色为 #999，过渡到中间颜色为 #d0cfcf */
    //   background: linear-gradient(#F37F0E, #EFC09F);
    //   z-index:2;
    // }
    // .box2{
    //   position:absolute;
    //   width: 50%;
    //   height: 100%;
    //   border-radius:0 30px 30px 0;
    //   left:50%;
    //   /* 过渡到中间颜色为 #d0cfcf 最终末尾颜色为 #eee */
    //   background: linear-gradient(rgb(255, 255, 255),#EFC09F);
    //   z-index:1;
    // }
    // .box::after{
    //   content:"";
    //   position:absolute;
    //   width:calc(100% - 8px);
    //   height:calc(100% - 8px);
    //   top:4px;
    //   left:4px;
    //   border-radius:50%;
    //   background-color: #fff;
    //   z-index:2;
    // }
  }

  .loading_text {
    position: absolute;
    top: 80px;
    font-style: normal;
    color: #FFFFFF;
    text-shadow: 0 0 1px #005AAC, 0 0 1px #005AAC, 0 0 1px #005AAC;
    text-align: center
  }

  .loading-img{
    border-radius 50%
  }





</style>
