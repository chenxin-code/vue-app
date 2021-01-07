<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="规则说明">

    </nav-top>
    <nav-content>
       <div class="content">
         <div>
           <p class="p1 theme_font_red">如何获取答题机会？</p>
           <p class="p2">1、每人都可免费获得一次游戏</p>
         </div>
         <div>
           <p class="p1 theme_font_red">答题都有啥奖励呢？</p>
           <p class="p2">1、积分、游戏机会</p>
         </div>
         <div>
           <p class="p1 theme_font_red">规则说明</p>
           <p class="p2">1、必须全部答完才可以获得奖励</p>
         </div>
       </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "rule"
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    .content {
      width 96%;
      margin 0 auto;
      div {
        margin-bottom 20px;
        .p1 {
          font-size 18px;
          margin-bottom 10px;
        }
        .p2 {
          font-size 16px;
        }
      }
    }
  }
</style>
