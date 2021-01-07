/**Created by steven on 2019/8/7.*/

<template>
  <div class="pre-registration login2"  v-if="referrer && referrer.length">
    <nav-content>
      <div class="app-info">
        <div class="logo">
          <img :src="$store.state.globalConfig.logoUrl"/>
        </div>
        <div class="title">{{loginTitle}}</div>
      </div>
      <div class="login-div">
        <div class="text-input">
          <div class="left">手机号</div>
          <div class="cell-phone">
            <van-field
              v-model="phone"
              type="tel"
              placeholder="请输入手机号码"
              maxlength="11"
              autosize
              onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
              pattern="[0-9]*"
              @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
            />
            <!--<input placeholder="请输入手机号" @input="inputChange" v-model="phone"/>-->
          </div>
        </div>

        <div class="passwords-input">
          <div class="left-img">
            <img src="static/image/login2/registe5.png" alt="">
          </div>
          <div class="passwords">
            <input placeholder="请输入推荐码" disabled v-model="referrer"/>
          </div>

        </div>
        <div class="common-btn theme_standard_bg theme_font_white mt100" @click="getCheckOutFun()">立即注册</div>
      </div>
    </nav-content>
  </div>
</template>

<script>

export default {
  name: "pre-registration",
  components: {

  },
  data () {
    return {
      loginTitle: this.$store.state.globalConfig.projectName,
      phone:'',
      referrer:'',
    }
  },
  methods: {
    registeFun:function(){
      this.$Loading.open();
      let url = '/app/json/login/addPreRegInfo';
      let paramsData = {
        phone: this.phone,
      };

      if(this.referrer && this.referrer.length){
        paramsData['rfrCode'] = this.referrer;
        paramsData['rfrCodeType'] = 2;
      }
      this.$http.post(url,paramsData).then(res => {
          this.$Loading.close();
          console.log(res.data)
          let data = res.data;
          if(data.status == 0){
            let path = '/usercenter/downloadsharenew'
            if (this.$store.state.globalConfig.pro_switch_share_downloadPage == 1) {
              path = '/usercenter/downloadshare'
            }
            this.$router.push({ 
              path: path,
            })
          }else {
            this.$Toast(data.info?data.info:'注册失败')
          }
        },
        err => {
          this.$Loading.close();
          this.$Toast('系统运行过程中遇到问题，请稍候再试')
        }
      )
    },

    getCheckOutFun:function(){
      let mobileReg = /^1\d{10}$/;
      if(this.phone == ''){
        this.$Toast( '手机号不能为空!' )
        return
      }else if(!mobileReg.test(this.phone)){
        this.$Toast( '手机号格式不对!' )
        return
      }
      this.registeFun()
    },

  },
  created () {

    this.referrer = this.$route.query.qrCode;
    if(!this.referrer || this.referrer == ''){
      this.$Toast('推荐码不能为空');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .pre-registration {
    width 100%
    height 100%
    overflow hidden
    .app-info {
        text-align center;
        margin-top 15px;
        .logo {
          img {
            width 50px;
            height 50px;
          }
        }
        .title {
          margin-top 10px;
          font-size 18px;
          font-weight 500;
        }
      }
    .login-div {
      margin 20px 20px 30px 20px;
      .text-input{
        border-bottom:1px solid #dedede;
        padding:20px 0px 5px 0px;
        display: flex;
        align-items: center;
        .left{
          font-size:$font-size-medium;
        }
        .cell-phone{
          flex 1;
          padding-left:10px;
          .van-cell {
            padding 0 !important;
          }
        }
      }

      .left-img{
        width 23px
        height 23px
        margin-right 5px
        img{
          width 100%
          height 100%
        }
      }
      .passwords-input{
        border-bottom:1px solid #dedede;
        padding:20px 0px 5px 0px;
        display: flex;
        align-items center;
        justify-content: space-between;
        .passwords{
          flex 1
          input{
            height 30px;
            display:block;
            width:100%;
            font-size:$font-size-medium-s;
          }
        }
        .show-passwords{
          extend-click()
          img{
            display:block;
            // margin-top:4px;
          }
          .see-icon{
            width:15px;
            height:10px;
          }
          .scancode{
            width:15px;
            height:15px;
          }

        }
        .forget-btn {
          border-left:1px solid #dedede;
          padding-left 10px
          line-height:1;
        }
      }

      .mt100 {
        margin-top: 50px;
      }
    }
    input:
    :-webkit-input-placeholder { /* WebKit browsers */
      color: #999;
    }
  }
</style>
