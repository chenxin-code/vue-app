/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="referral-code login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div  v-if="isHasCommend == 2">
        <div class="tip"><span class="tip-icon">推荐码输入后将不能修改，请谨慎输入！</span></div>
        <div class="register">
          <div class="passwords-input">
            <div class="passwords">
              <input placeholder="请输入推荐码" v-model="referrer"/>
            </div>
            <div class="show-passwords" @click="scanCodeFunc">
              <img src="static/image/setting/icon-scan.png" class="see-icon"/>
            </div>
          </div>
          <div class="passwords-input imgCode">
            <div class="passwords">
              <input placeholder="请输入右侧校验码" v-model="imgCode"/>
            </div>
            <div class="show-passwords">
              <img :src="codeImg" class="jiaoyanma"/>
            </div>
            <div class="show-passwords">
              <img src="static/image/login2/shuaxin.png" class="shuaxian" @click="getImgCode()"/>
            </div>
          </div>
          <div class="common-btn theme_bg_red theme_font_white mt100" @click="checkOutFun()">保存</div>
        </div>
      </div>
      <div class="commend mine-box-shodow"  v-if="isHasCommend == 1">
        <div class="public-bar flexs">
          <p class="commend-left">推荐人电话</p>
          <p class="commend-num">{{referrerData.phone}}</p>
        </div>
        <div class="public-bar flexs">
          <p class="commend-left">推荐人编号</p>
          <p class="commend-num">{{referrerData.userId}}</p>
        </div>
        <div class="public-bar flexs">
          <p class="commend-left">注册日期</p>
          <p class="commend-num">{{referrerData.regDate}}</p>
        </div>
      </div>

    </nav-content>

  </div>

</template>

<script>
  export default {
    name: "",
    components: {
    },
    data() {
      return {
        referrer:'',
        referrerData:'',
        scanCode:'',
        imgCode:'',
        codeImg:'',
        isHasCommend:1,  //-1未知  1有推荐人  2没有推荐人
        UUID: '',
      }
    },
    created() {
      this.getMyReferer();
      this.referrer = this.$store.state.rfrCode
    },
    methods: {
      scanCodeFunc:function(){
        // this.$bridgefunc.scanCode((dic)=>{
        //   this.scanCode = dic.code;
        //   this.referrer = dic.code;
        // });
        this.$bridgefunc.scanCode((res)=>{
          console.log(res)
          let code = res.code
          if (code.indexOf('http') > -1) {
            code = this.$util.getUrlParam(code, 'qrCode')
          }
          this.scanCode = code;
          this.referrer = code;
        });
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      getMyReferer:function () {
        this.$Loading.open();
        let url = '/app/json/user/getMyReferer';

        let paramsData = {
          token: this.$store.state.login.token,
        };

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){

              if(!data.data || data.data == ''){
                this.resetUI();
              }else {
                this.isHasCommend = 1;
                this.referrerData = data.data;
              }
            }else {
              if(data.errorCode == 2043){
                this.resetUI();
              }else {
                this.$Toast(data.info);
              }
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast('系统运行过程中遇到问题，请稍候再试');
          }
        )
      },
      resetUI:function(){
        this.isHasCommend = 2;
        this.getImgCode();
      },
      // 验证图片验证码
      _verifyImg: function () {
        this.$Loading.open();
        let url = '/app/json/login/verifyImg';

        this.$http.post(url, {
          uuid: this.UUID,
          imgVerifyCode: this.imgCode,
        }).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0 && data.data === true) {
              // 图片验证码填写正确，获取短信验证码
              this.submit();
            } else {
              this.$Toast('图片验证码错误，请重新输入');
              this.getImgCode();
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('网络错误');
          }
        );
      },
      submit:function(){

        this.$Loading.open();
        let url = '/app/json/user/setRefererInfo';
        let paramsData = {
          token:this.$store.state.login.token
        };

        if(this.referrer && this.referrer.length){
          paramsData['rfrCode'] = this.referrer;
        }
        // 1 手动输入  2扫一扫
        if(this.referrer == this.scanCode){
          paramsData['rfrCodeType'] = 2;
        }else {
          paramsData['rfrCodeType'] = 1;
        }

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$Toast('绑定成功')
              if (this.$route.query.isFromWechat == 1) {
                // 来自微信小程序 -- 半秒钟后返回首页
                setTimeout(() => {
                  this.backIndex()
                }, 500)
              } else {
                this.getMyReferer();
              }
            }
            else {
              this.$Toast( data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast( "系统运行过程中遇到问题，请稍候再试");
          }
        )
      },

      checkOutFun:function(){
        if(this.referrer == ''){
          this.$Toast('推荐码不能为空');
          return;
        }
        if(this.imgCode == ''){
          this.$Toast('校验码不能为空');
          return;
        }
        this._verifyImg();
      },
      //获取图像校验码
      getImgCode:function(){
        this.UUID = this.$util.randomString();
        this.$Loading.open();
        let url = '/app/json/login/getVerifyImg';
        let paramsData = {
          uuid: this.UUID,
        };

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.codeImg = data.data;
            }else {
              this.$Toast(data.info?data.info:'获取图像校验码失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast('系统运行过程中遇到问题，请稍候再试');
          }
        )
      },
      // 返回首页函数（从App.vue复制）
      backIndex: function() {
        // 返回首页时清除 微店code（河北）
        this.$util.removeStoreCode()
        if (this.$store.state.webtype == 3) {
          wx.miniProgram.reLaunch({ url: `/pages/index/main` });
          return;
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .referral-code {
    width 100%
    height 100%
    overflow hidden
    .commend{
      margin 10px
      .flexs{
        justify-content flex-start
      }
      .commend-left{
        font-size: $font-size-medium;
        color: #333;
        width 25%
      }
      .commend-num{
        margin-left 10px
        font-size  $font-size-medium-x
      }
    }
    .tip{
      height:30px;
      width:100%;
      background:#fbf8d9;
      line-height:30px;
      padding:0px 30px;
      .tip-icon{
        font-size:$font-size-small;
        line-height:30px;
        color:#e0782f;
        display:block;
        background:url("../../../../static/image/login2/tip-icon.png") 0px center no-repeat;
        background-size:10px 12px;
        padding-left:15px;
      }
    }
    .register {
      margin 10px 20px 0px 20px;
      .text-input{
        border-bottom:1px solid #dedede;
        padding:20px 0px 10px 0px;
        .cell-phone{
          width:100%;
          input{
            display:block;
            font-size:$font-size-medium-s;
            width:100%;
          }
        }

      }

      .passwords-input{
        border-bottom:1px solid #dedede;
        padding:25px 0px 10px 0px;
        display: flex;
        justify-content: space-between;
        .passwords{
          width:70%;
          input{
            display:block;
            width:100%;
            font-size:$font-size-medium-s;
          }
        }
        .show-passwords{
          img{
            display:block;
            // margin-top:4px;
          }
          .see-icon{
            extend-click()
            width:15px;
            height:15px;
          }
          .jiaoyanma{
            height:36px;
          }
          .shuaxian{
            width:15px;
            height:15px;
          }
        }
        .forget-btn {
          border-left:1px solid #dedede;
          padding:2px 0px 2px 10px;
          text-align right;
          line-height:1;
          color:#ee2d2e;
          font-weight:600;
        }
      }
      .imgCode{
        padding:5px 0px 10px 0px;
        display: flex;
        justify-content: space-between;
        align-items:flex-end;
      }
      .mt100{
        margin-top:50px;
      }

    }


  }

</style>
