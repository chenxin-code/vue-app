/**Created by steven on 2019/8/14.*/

<template>
  <div class="image-ad-move">
    <nav-top @backEvent="backEvent">
      <div class="right-btn theme_font_red" @click="saveCodeArr">保存</div>
    </nav-top>

    <nav-content>
      <div class="move-content ">
        <div class="gndh-page" v-if="isShow">
          <div class="gndh-item fill-bgp moving-animation"
               :class="{'width-5' : moduleData.columnNum == '5','transition' : touchIndex != index}"
               @touchstart="gndhTouchStart" @touchmove="gndhTouchMove" @touchend="gndhTouchEnd"
               v-for="(nav, index) in gndhPageArr"
               :style="{left:(index%moduleData.columnNum)*gndhCellWidth+'px',top:(parseInt(index/moduleData.columnNum))*gndhCellHeight+'px'}"
               :ref="getGndhRef(index)"  :index="index"
          >
             <div v-if="moduleData.style == 'imgStyle'" >
               <img ref="swiperImg" class="swiper-img" :src="nav.imgUrl" :style="swiperSlideStyle">
             </div>
             <div v-if="moduleData.style == 'imgTextStyle'" @click.prevent="enterNav(nav)">
               <img ref="swiperImg" class="swiper-img" :src="nav.imgUrl" :style="swiperSlideStyle">
               <p class="title" :style="{'background-color': moduleData.bgColor}"> {{nav.title}} </p>
             </div>
             <div v-if="moduleData.style == 'minImgTextStyle'" @click.prevent="enterNav(nav)">
               <div class="min-img-text-box">
                 <img :style="swiperSlideStyle" ref="swiperImg" class="swiper-img" :src="nav.imgUrl">
               </div>
               <p class="title" :style="{'background-color': moduleData.bgColor}"> {{nav.title}} </p>
             </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex';
  import CornerMark from './cornermark/cornerMark';
  import appLocalstorage from '@zkty-team/x-engine-module-localstorage'

  export default {
    name: "image-ad-move",

    data() {
      return {
        gndhPageArr: [],
        moduleData: {},
        moduleId:'',
        gndhCellWidth:0,
        gndhCellHeight:0,
        swiperSlideStyle:'',

        touchIndex:-1,
        currentTouchEl:undefined,
        touchStartX:0,
        touchStartY:0,
        touchElX:0,
        touchElY:0,
        movingIndex:-1,

        isShow:true
      }
    },

    components: {
      CornerMark
    },
    computed: {
      ...mapGetters(['clientWidth'])
    },
    methods: {
      getGndhRef:function(gndhIndex){
        return 'GndhRef'+gndhIndex;
      },

      backEvent: function () {
        this.$router.go(-1);
      },
      gndhTouchStart: function (ev) {
        ev.preventDefault();
        ev.stopPropagation()
        if(ev.touches.length == 1) {    //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
          this.currentTouchEl = ev.currentTarget;

          this.touchStartX = ev.touches[0].clientX;
          this.touchStartY = ev.touches[0].clientY;
          this.touchElX = this.currentTouchEl.offsetLeft;
          this.touchElY = this.currentTouchEl.offsetTop;

          this.touchIndex = parseInt(this.currentTouchEl.getAttribute('index'));
        }
      },
      gndhTouchMove: function (ev) {
        ev.preventDefault();
        ev.stopPropagation()

        if(ev.touches.length == 1) {    //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
            this.gndhMove(ev)
        }
      },
      gndhTouchEnd: function (ev) {
        let tempArr = JSON.parse(JSON.stringify(this.gndhPageArr));
        if(this.movingIndex != this.touchIndex){
          let temp = this.gndhPageArr[this.touchIndex];
          tempArr.splice(this.touchIndex,1);
          tempArr.splice(this.movingIndex,0,temp);
        }
        this.isShow = false;
        this.$nextTick(()=>{
          this.gndhPageArr = tempArr;
          this.isShow = true;
        })


        // let arr = JSON.parse(JSON.stringify(this.gndhPageArr));
        // arr.splice(movi,1,...arr.splice(toi, 1 , arr[movi]));
        // this.gndhPageArr = arr;
        this.movingIndex = -1;
        this.touchIndex = -1;
      },

      saveCodeArr:function(){
        let arr = [];
        for (let i = 0; i < this.gndhPageArr.length; i++) {
          let item = this.gndhPageArr[i];
          arr.push(item.idCode);
        }
        if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
          this.$bridgefunc.setItem(this.moduleId+'gndhPageArr', encodeURIComponent(JSON.stringify(arr)))
        } else {
          appLocalstorage.set({
            key: this.moduleId+'gndhPageArr',
            value: encodeURIComponent(JSON.stringify(arr)),
            isPublic: true,
          })
        }
        this.$router.go(-1);
      },

      gndhMove:function(ev){

        let moveX = ev.touches[0].clientX; // 记录移动位置
        let moveY = ev.touches[0].clientY; // 记录开始位置
        //
        // //判断移动到了哪个位置
        let currentElLeft = this.touchElX +moveX-this.touchStartX;
        let currentElTop = this.touchElY+moveY-this.touchStartY;
        //限定上下滑动位置
        if(currentElTop < 0 || currentElTop > ((this.gndhPageArr.length-1)/this.moduleData.columnNum + 1)*this.gndhCellHeight  ){
          return;
        }
        //
        // //限定左右滑动位置
        // // if(currentElLeft < -this.gndhCellWidth/3){
        // //   if(this.movingPageIndex == 0){
        // //     return;
        // //   }else {
        // //     this.$refs.mySwiper.swiper.slidePrev();
        // //   }
        // // }else if(currentElLeft > this.moduleData.columnNum*this.gndhCellWidth-this.gndhCellWidth/2){
        // //   if(this.movingPageIndex == this.getPageLength -1){
        // //     return;
        // //   }else {
        // //     this.$refs.mySwiper.swiper.slideNext();
        // //   }
        // // }
        //
        //
        this.currentTouchEl.style.top = currentElTop+'px';
        this.currentTouchEl.style.left = currentElLeft+'px';

        //判断当前位置处于第几个  判断依据是当前el中心点处于哪里
        let currentElCenterY = currentElTop + this.gndhCellHeight/2;
        let currentElCenterX = currentElLeft + this.gndhCellWidth/2;

        let topNum = parseInt(currentElCenterY/this.gndhCellHeight);

        let leftNum = parseInt(currentElCenterX/this.gndhCellWidth);

        let currentIndex = topNum * this.moduleData.columnNum + leftNum;

        if(currentIndex != this.movingIndex ){
          this.movingIndex = currentIndex;

          //是否是向前移动
          let isPre = currentIndex<this.touchIndex?true:false;
          let min =  isPre?currentIndex:(this.touchIndex+1);
          let max = isPre?this.touchIndex-1:currentIndex;

          for (let i = 0; i < this.gndhPageArr.length; i++) {
            let tempEl = this.$refs[this.getGndhRef(i)][0];
            if(tempEl) {
              let k = i;
              if(i >= min && i <= max){
                if(isPre){
                  k += 1;
                }else {
                  k -= 1;
                }
              }
              tempEl.style.left = (k%this.moduleData.columnNum)*this.gndhCellWidth+'px';
              tempEl.style.top = parseInt(k/this.moduleData.columnNum)*this.gndhCellHeight+'px';
            }
          }
        }

      },
      initData:function () {
        if (this.$route.query.info) {

          this.moduleData = JSON.parse(decodeURIComponent(this.$route.query.info));
          this.moduleId = this.$route.query.moduleId;
          this.gndhPageArr = this.moduleData.rows;

          let sidesMargin = this.moduleData.sidesMargin
          if (!sidesMargin || sidesMargin == undefined || sidesMargin == '') {
            sidesMargin = 0;
          }
          // this.swiperSlideStyle = "height: " + (this.clientWidth * (100 - sidesMargin - sidesMargin) / 100) * this.moduleData.ratio + 'px';
          this.gndhCellWidth =  (this.clientWidth * (100 - sidesMargin - sidesMargin) / 100) / this.moduleData.columnNum;
          this.gndhCellHeight =  this.gndhCellWidth * this.moduleData.ratio;
          this.swiperSlideStyle =  "height: " +this.gndhCellHeight + 'px';
        }
      }

    },
    created() {
      this.initData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .image-ad-move {
    width 100%
    height 100%
    overflow hidden

    .right-btn {
      right: 0px;
      height: 44px;
      top: 0px;
      padding-right: 12px;
      font-size: 16px;
    }
    .fill-bgp {
      background: no-repeat center center;
      background-size: 100% 100%;
    }
    .swiper-img {
      display: block;
      width: 100%;
    }
    .min-img-text-box {
      img {
        transform: scale(0.7, 0.7);
      }
    }
    .move-content {
      position absolute
      top 5px
      left 0px
      right 0px
      bottom 5px
      overflow auto
      .gndh-page {
        position relative
        width 100%
        .gndh-item {
          position absolute
          width 25%;
          &.width-5 {
            width 20%;
          }
          .title {
            text-align: center;
          }
        }
      }
    }
    .transition{
      transition: all 0.3s linear;
    }
    .moving-animation{
      z-index 999
      animation: zy 1s  linear infinite;
    }

    @keyframes zy {
      25% {
        transform: rotate(5deg);
      }
      50% {
        transform: rotate(0deg);
      }
      75% {
        transform: rotate(-5deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }

  }
</style>
