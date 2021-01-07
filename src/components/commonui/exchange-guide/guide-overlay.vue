// create by LiuYong on 2020/10/27 11:01 遮罩层组件
<template>
  <div class="overlay" :class="{development}" ref="overlay" v-if="hasData">
    <div class="overlay-mask"></div>
    <div class="overlay-warp"
      @dragstart="wrapStart"
      @dragenter="wrapEnter"
      @dragover="warpOver"
      >
      <GuideItem
        v-for="(itemData,idx) in actStep.data"
        :key="idx"
        :class="{
          'active-list':active.type == 'item' && idx == active.itemIdx,
        }"
        :fullHeight="fullHeight"
        :itemData="itemData"
        @on-click="changeActItem(idx,'item')"
      />
      <GuideItem
        :class="{
          'active-list':active.type == 'button',
        }"
        :fullHeight="fullHeight"
        :itemData="actStep.btnData"
        :type="'button'"
        @on-click="nextPage();"
      />
    </div>
  </div>
</template>

<script>
  import GuideItem from './guide-item';

  export default {
    components: {
      GuideItem,
    },
    props: ['guideData','active','callback'],
    data(){
      return {
        showPage:false,
        fullHeight:9999,
        drag:{
          beforeX:0,
          beforeY:0,
        }
      }
    },
    computed:{
      guideStepList(){
        return this.guideData.guideStepList || [];
      },
      actStep(){
        return this.guideStepList[this.active.stepIdx];
      },
      actItem(){
        if(this.active.type == 'item'){
          return this.actStep.data[this.active.itemIdx];
        }else{
          return this.actStep.btnData;
        }
      },
      production(){
        return this.active.production
      },
      development(){
        return !this.production;
      },
      hasData(){
        return this.guideStepList.length > 0;
      }
    },
    mounted(){
      if(!this.testApp() && this.hasData){
        this.fullHeight = this.$refs.overlay.offsetHeight
      }
    },
    methods: {
      nextPage(){
        if(this.development) {
          this.changeActItem(-1,'button');
        }else{
          let currentIdx = this.active.stepIdx;
          let nextIdx = currentIdx+1;
          if(nextIdx == this.guideStepList.length){
            // 最后一步
            this.active.showGuide = false;
            localStorage.setItem(this.guideData._uid,this.guideData._v);
            this.callback && this.callback();
          }else{
            // 下一步
            this.active.stepIdx = nextIdx;
          }
        }
      },
      changeActItem(itemIdx,type){
        this.active.type = type;
        if(itemIdx >= 0){
          // 点击指导项
          this.active.itemIdx = itemIdx
        }
      },
      wrapEnter(e){
        if(this.production) return ;
        e.preventDefault();
      },
      wrapStart(e){
        if(this.production) return ;
        e.target._type !== this.active.type ? 
          this.active.type = e.target._type : null;
        if(this.active.type=='item' && e.target!=this.actItem._el){
          this.actStep.data.find((item,idx)=>{
            if(item._el == e.target){
              this.active.itemIdx = idx;
              return true
            }
          })
        }
        this.drag.beforeX = e.clientX;
        this.drag.beforeY = e.clientY;
      },
      warpOver(e){
        if(this.production) return ;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        // handle X
        let x = this.actItem.x;
        let moveX = e.clientX - this.drag.beforeX;
        let toX = x + moveX;
        this.drag.beforeX = e.clientX;
        this.actItem.x = toX < 0 ? 0 : toX;
        // handle Y
        let y = this.actItem.y;
        let moveY = e.clientY - this.drag.beforeY;
        let toY = y + moveY;
        this.drag.beforeY = e.clientY;
        this.actItem.y = toY < 0 ? 0 : toY;
      },
      testApp () {
        if (
          /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ||
          /(Android)/i.test(navigator.userAgent)
        ) { 
          return true;
        } else { 
          return false;
        }
      },
    },
  };
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;

    .overlay-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(55, 55, 55, 0.6);
    }

    .overlay-warp {
      position: absolute;
      width: 100%;
      height: 100%;
      color: #fff;
      overflow:hidden;
      /deep/ .guide-item{
        position:absolute;
        border:1px dashed transparent;
        max-width:100%;
        img{
          max-width:100%;
        }
        &.t-btn{
          img{
            cursor:pointer;
          }
        }
      }
    }

    &.development{
      /deep/ .overlay-warp{
        .guide-item{
          img{
            cursor:move;
          }
          &.active-list{
            border-color #57a3f3;
          }
        }
      }
    }
  }
</style>