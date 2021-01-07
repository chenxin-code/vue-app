<template>
  <div class="sbx-progress">
    <div class="sbx-progress__portion" :style="{backgroundColor:color,width:`${percentage}%`}"></div>
    <div class="sbx-progress__pivot" :style="{color}">{{percentage}}%</div>
  </div>
</template>

<script>
  export default {
    props:{
      percentage:{
        type:Number,
        default:0,
      },
      color:{
        type:String,
        default:'#333',
      }
    },
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .sbx-progress{
    position: relative;
    height: 5px;
    background: #ebedf0;
    border-radius: 3px;
    .sbx-progress__portion{
      position:absolute;
      top:0;
      left:0;
      bottom:0;
      border-radius: 3px;
    }
    .sbx-progress__pivot{
      position:absolute;
      right:0;
      top:100%;
      transform:translateY(6px);
    }
  }
</style>