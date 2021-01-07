<template>
    <div>
      <nav-top @backEvent="$router.go(-1)"></nav-top>
      <nav-content class="qrroot">
       <div class="img-con">
         <img src="../userimgs/logo.png" alt="">
       </div>
        <div class="tip">
          <div class="main-tip">
            授权登录后可享受您的会员权益，应用将获得以下权限：
          </div>
          <div class="content">
            获得您的会员姓名和手机号
          </div>
        </div>
        <div class="handle-con">
          <van-button round  type="default" class="btn cancel" @click="cancel">我再想想</van-button>
          <van-button round  type="info" native-type="submit" class="btn save" @click="confirm">
            确认授权
          </van-button>
        </div>
      </nav-content>
    </div>
</template>
<script>
    export default {
        name: "authorLogin",
        components: {},
        data() {
            return {}
        },
        methods: {
          cancel(){

          },
          confirm(){

          }
        }
    }
</script>

<style lang="stylus" scoped>
.img-con{
  padding 10px 0
  img{
    margin 0 auto
    display block
    width 124px
  }
}
  .tip{
    .main-tip{
      font-size:14px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(16,16,16,1);
      line-height:20px;
      margin 0 30px
      padding 12px 0
      border-top 1px solid #DCDDDD
    }
    .content{
      font-size:11px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(159,160,160,1);
      line-height:15px;
      margin 0 30px
    }
  }
.handle-con{
  display flex
  justify-content space-between
  align-items center
  margin 25px 20px
  /*margin-bottom 10px*/
  .btn{
    width 162px
    height 49px
  }
  .save{
    height:49px;
    background:linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%);
    border-radius:24px;
    color #C9A063
  }
  .cancel{
    height:49px;
    background:rgba(255,255,255,1);
    border-radius:24px;
    border:1px solid rgba(49,49,49,1);
    color #C9A063
  }
}
</style>
