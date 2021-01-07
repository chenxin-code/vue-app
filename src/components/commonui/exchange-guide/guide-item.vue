<template>
  <div 
    class="guide-item" 
    :class="{
      't-btn':type == 'button'
    }"
    :style="getStyle('container')" 
    @click="$listeners['on-click']"
    ref="itemList"
    >
    <img draggable=true ref="img" :src="itemData.url" :style="getStyle('img')"/>
  </div>
</template>

<script>
  export default {
    props:{
      itemData:{
        type:Object,
        default(){
          return {}
        },
      },
      fullHeight:{
        type:Number,
        default:9999,
      },
      type:{
        type:String,
        default:'item',
      },
    },
    mounted(){
      this.$refs.img._type = this.type;
      Object.defineProperty(this.itemData,'_el',{
        value:this.$refs.img,
        writable:true,
        configurable:true,
        enumerable:false,
      })
    },
    destroyed(){
      delete this.itemData._el;
    },
    methods:{
      unAttr(val){
        return val == 0 || val == '';
      },
      resetPx(val){
        // px系数
        const c = this.$store.state.clientWidth / 375.0;
        return c*val
      },
      getStyle(type){
        let resetPx = this.resetPx;
        const style = {};
        const data = this.itemData;
        if(type == 'container'){
          style.left= resetPx(data.x) + 'px';
          let maxHeight;
          if(this.$parent.testApp()){
            maxHeight = this.fullHeight;
          }else{
            maxHeight = this.$refs.itemList 
              ? this.fullHeight - this.$refs.itemList.offsetHeight 
              : this.fullHeight;
          }
          let top = resetPx(data.y);
          top = top > maxHeight ? top=maxHeight : top;
          style.top = top + 'px';
        }else if(type == 'img'){
          style.width = this.unAttr(data.width) ? 'auto' : resetPx(data.width) + 'px';
          style.height = this.unAttr(data.height) ? 'auto' : resetPx(data.height) + 'px';
        }
        return style
      },
    },
  }
</script>