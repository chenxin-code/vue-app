/**Created by steven on 2019/1/18.*/

<template>
  <div class="Advertisement"  v-if="visible">
    <img class='img-content' :src="advertisementInfo.imageUrl" alt="">
    <p class="time" v-show="time>0" @click="skipFun">{{advertisementInfo.isSkip == 1 ? '跳过': '' }}{{time}}</p>
  </div>
</template>

<script>
import store from  '@/vuex/store'
export default {
  name: "Advertisement",
  components: {

  },
  data () {
    return {
      advertisementInfo:{},
      visible:false,
      time:0,
      myTimer:null,

    }
  },
  methods: {
    getImgUrl:function () {
      this.$Loading.open()
      let url = '/app/json/home/getOpenAd';
      let params1 = {
        cityName:store.state.indexData.city,
        provinceName:store.state.indexData.province,
      }
      this.$http.post(url, params1).then(res => {
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          let arr = data.data;
          if(!arr.length){
            return;
          }

          let advertisementIndex = store.state.advertisementIndex > (arr.length-1)?0:store.state.advertisementIndex;
          this.advertisementInfo = arr[advertisementIndex];
          this.countDown();
          store.state.advertisementIndex = advertisementIndex+1;
          this.$bridgefunc.vuexStorage();
        } else {
          this.hideFunc();
        }
      }, error => {
        this.$Loading.close();
        this.hideFunc();
      });
    },
    countDown:function () {
      this.time = this.advertisementInfo.showTime;
      this.myTimer = window.setInterval(() => {
        this.time -= 1;
        if(this.time == 0){
          this.hideFunc();
        }
      }, 1000)
    },
    skipFun:function(){
      if(this.advertisementInfo.isSkip == 1){
       this.hideFunc();
      }
    },
    hideFunc:function () {
      if(this.myTimer){
        clearInterval(this.myTimer);
      }
      this.visible = false;
    }
  },
  mounted(){
    this.getImgUrl();
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
.Advertisement {
  width 100%
  height 100%
  position fixed
  overflow hidden
  background-color white
  z-index 10001
  top 0px
  .img-content{
    width 100%
    height 100%
    display block
  }
  .time{
    position absolute
    top 40px
    right 20px
    background-color rgba(0,0,0,0.6)
    border-radius 3px
    padding 5px 10px
    color white
    font-size $font-size-medium
  }

}
</style>
