<template>
    <div class="container">
       <nav-top @backEvent="$router.go(-1)"></nav-top>
       <nav-content>
           <div class="flex-div">
               <div class="top">
                   <img src="../image/set-meal.png" alt="">
                   <div class="top-text">
                       您当前未开通套餐，前往套餐页面开通套餐领取优惠吧~
                   </div>
               </div>
                <div class="btn">
                    前往开通套餐
                </div>
                <div class="btn" @click="moveToHis">
                    历史签约
                </div>
           </div>
       </nav-content>
    </div>
</template>

<script>
    export default {
        methods: {
            moveToHis() {
                this.$router.push('/historical-signing')
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
      
      .nav-content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .flex-div{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .top{
                text-align: center;
                margin-bottom: 20px;
                .top-text{
                    font-size: 13px;
                    line-height: 30px;
                    font-weight: 500;
                }
                img{
                    width: 40%;
                }
            }
            .btn{
                width: 55%;
                padding: 14px 0;
                background-color:#F02C2D;
                color: #fff;
                font-weight: 400;
                font-size: 14px;
                border-radius: 20px;
                margin: 5px 0;
                text-align: center;
            }
        }
      }
  }
</style>