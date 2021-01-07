/**Created by LiuYong on 2020-11-03*/

<template>
  <div class="popup-evaluation" v-if="show && !hide">
    <div class="popup-evaluation-overlay"></div>
    <div class="popup-evaluation-center">
      <img :src="popupEvaluationImage" alt="">
      <div class="btn-box">
        <img src="./imgs/2.png" @click="submit">
        <div class="btn-text" @click="hidePage(true)">残忍拒绝</div>
      </div>
      <div class="close-icon" @click="hidePage(false)"><van-icon name="cross" /></div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Bus from "../bus";

  export default {
    name: "popup-evaluation",
    props: ['myIndex', 'usePorpData', 'propData'],
    data(){
      return {
        hide:true,  // 是否隐藏
      }
    },
    computed: {
      popupEvaluationId(){
        return this.$store.state.globalConfig.popup_evaluation_id
      },
      popupEvaluationImage(){
        return this.$store.state.globalConfig.popup_evaluation_image || require('./imgs/1.png');
      },
      show(){ // 配置是否显示
        return this.popupEvaluationId ? true : false;
      },
    },
    created(){
      this.testHide();
    },
    methods: {
      testHide(){
        // 点过残忍拒绝
        let deepHide = localStorage.getItem('popup-evaluation-deepHide');
        if(deepHide == '1') return ;
        this.hide = false;
      },
      submit(){
        this.$router.push({
          path: '/commonEvaluate',
          query:{id:this.popupEvaluationId}
        })
      },
      hidePage(deep=false){
        this.hide = true;
        if(deep) localStorage.setItem('popup-evaluation-deepHide','1');
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .popup-evaluation{
    position:fixed;
    top 0
    right 0
    bottom 0
    left 0
    z-index 1001
    .popup-evaluation-overlay{
      position:absolute;
      top 0
      right 0
      bottom 0
      left 0
      background-color: rgba(0, 0, 0, 0.7);
    }
    .popup-evaluation-center{
      position:absolute;
      top: 50%;
      left: 50%;
      transform:translate(-50%,-50%);
      max-width: 100%;
      img{
        display:block;
        max-width: 100%;
      }
      .btn-box{
        position:absolute;
        left: 50%;
        bottom:15px;
        transform:translateX(-50%);
        max-width: 100%;
        img{
          display:block;
          max-width: 100%;
        }
        .btn-text{
          position: absolute;
          right: 4px;
          bottom: 0;
          transform: translateX(100%) scale(0.8);
          color: #FFA41C;
        }
      }
      .close-icon{
        position: absolute;
        left: 50%;
        bottom: -5px;
        transform: translate(-50%, 100%);
        color: #fff;
        border: 1px solid #fff;
        border-radius: 50%;
        padding: 3px;
        font-size: 0;
        .van-icon{
          font-size: 12px;
        }
      }
    }
  }
</style>
