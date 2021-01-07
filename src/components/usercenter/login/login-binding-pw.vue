/**Created by steven on 2018/9/10.*/

<template>
  <div class="login-binding-pw login2">

    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="register">
        <div class="text-input">
          <div class="cell-phone">
            <input placeholder="请输入手机号" type="number" v-model="phone"/>
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input :placeholder="$util.pwdPlaceholder()" :type="isShowPwd?'text':'password'" v-model="passwords"/>
          </div>
          <div class="show-passwords" @click="isShowPwd = !isShowPwd">
            <img :src="isShowPwd?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"  class="see-icon"/>
          </div>
        </div>

        <div class="passwords-input"  >
          <div class="passwords">
            <input placeholder="请输入验证码"  v-model="msgCode"/>
          </div>
          <div class="forget-btn" >
            <count-button class="theme_standard_font"  @getSmsEvent="getMsgCode" :phone="phone" ref="countBtn"></count-button>
          </div>
        </div>

        <div class="passwords-input" v-if="$store.state.globalConfig.user_register_referrer_input != '0'">
          <div class="passwords">
            <input placeholder="请输入推荐码" v-model="referrer"/>
          </div>
          <div class="show-passwords" @click="scanCodeFunc">
            <img src="static/image/setting/icon-scan.png" class="see-icon"/>
          </div>
        </div>

        <div class="agree">
          <!--选中class为is-selected ！ 未选中为unselect-->
          <div class="ifselect" :class="(isChecked ? 'is-selected': 'unselect')" @click="isChecked = !isChecked">
            <i class="selected-icon"></i>
          </div>
          <p class="text" @click="clickAgreement">我已看过并同意<span>《用户使用协议》</span></p>
        </div>

        <div class="common-btn theme_standard_bg theme_font_white bind-btn" @click="checkOutFun()">绑定</div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  import wxfunc from '@/utils/wxfunc'
  import  MD5 from '@/utils/md5.js'
  import CountButton from '@/components/commonui/count-button';
  export default {
    name: "login-binding-pw",
    components: {
      CountButton,
    },
    data () {
      return {

        phone:'',
        passwords:'',
        msgCode:'',
        city:'北京',
        isShowPwd:false,
        isChecked:false,
        regChannel:'',
        authcode:'',
        //第一级进入
        firstLevel:false,
        referrer:'',
        scanCode:'',
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      clickAgreement:function(){
        this.$router.push({
          path: '/usercenter/agreement'
        })
      },
      scanCodeFunc:function(){
        this.$bridgefunc.scanCode((dic)=>{
          this.scanCode = dic.code;
          this.referrer = dic.code;
        });
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      //获取短信验证码
      getMsgCode:function(imgVerifyCode,uuid){
        if(this.phone == ''){
          this.$Toast('手机号不能为空!')
          return;
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          phone: this.phone,
          smsType:'1000',
          imgVerifyCode:imgVerifyCode,
          uuid:uuid
        };

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$Toast('获取短信验证码成功')
            }else {
              this.$Toast(data.info?data.info:'获取短信验证码失败')
              this.$refs.countBtn.resetClock();
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
            this.$refs.countBtn.resetClock();
          }
        )
      },

      //注册校验
      checkOutFun:function(){
        let mobileReg = /^1\d{10}$/;
        if(this.phone == ''){
          this.$Toast( '手机号不能为空!')
          return;
        }else if(!mobileReg.test(this.phone)){
          this.$Toast( '手机号格式不对!' )
          return;
        }
        else if(this.passwords == ''){
          this.$Toast('密码不能为空')
          return;
        }
        else if(!this.$util.checkPassWord(this.passwords)){
          return;
        }
        else if(this.msgCode == ''){
          this.$Toast( '验证码不能为空')
          return;
        }
        else if(!this.isChecked){
          this.$Toast('请阅读用户协议');
          return
        }
        this.registerFun()
      },

      //注册
      registerFun:function(){

        let paramsData = {
          phone: this.phone,
          thirdUserId:this.thirdUserId,
          userPwd:MD5(this.passwords),
          regChannel:this.regChannel,
          smsVerifyCode:this.msgCode,
          bindType:2
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

        if (this.$store.state.webtype == 2) {
          // 微信端使用
          wxfunc.getWechatSignature((isSignature) => {
            //签名成功
            if (isSignature) {
              wxfunc.wxGetLocation((location) => {
                this.$store.state.currentLocation.posx = location?location.longitude:'';
                this.$store.state.currentLocation.posy = location?location.latitude:'';
                this.$mallCommon.addressAnalysis((res) => {
                  paramsData.province = this.$store.state.mall2.selectAddress.provinceName
                  paramsData.provinceCode = this.$store.state.mall2.selectAddress.provinceId
                  paramsData.city = this.$store.state.mall2.selectAddress.cityName
                  paramsData.cityCode = this.$store.state.mall2.selectAddress.cityId
                  paramsData.longitude = this.$store.state.currentLocation.posx
                  paramsData.latitude = this.$store.state.currentLocation.posy;
                  this.apiEvent(paramsData)
                }, location);
              });
            } else {
              this.apiEvent(paramsData)
            }
          });
        } else {
          // 其他端使用
          paramsData.province = this.$store.state.mall2.selectAddress.provinceName
          paramsData.provinceCode = this.$store.state.mall2.selectAddress.provinceId
          paramsData.city = this.$store.state.mall2.selectAddress.cityName
          paramsData.cityCode = this.$store.state.mall2.selectAddress.cityId
          paramsData.longitude = this.$store.state.currentLocation.posx
          paramsData.latitude = this.$store.state.currentLocation.posy;
          this.apiEvent(paramsData)
        }
      },
      apiEvent: function (paramsData) {
        this.$Loading.open();
        let url = '/app/json/login/bindThirdUser';

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$Toast('注册成功')
              if(this.firstLevel){
                this.$userCenter.retsetToIndex(data.data,1);
              }else {
                this.$userCenter.retsetToIndex(data.data,2);
              }

            }else if(data.errorCode == 2002){
              this.$Toast( data.info?data.info:'手机号已存在用户已注册')
            }
            else {
              this.$Toast( data.info?data.info:'注册失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast( "系统运行过程中遇到问题，请稍候再试");
          }
        )
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == '/usercenter/agreement') {

      } else {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },

    created () {
      this.regChannel = this.$route.query.regChannel;
      this.thirdUserId = this.$route.query.thirdUserId;
      this.authcode = this.$route.query.code;
      this.firstLevel = this.$route.query.firstLevel;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .login-binding-pw {
    width 100%
    height 100%
    overflow hidden
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
            //extend
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
            width:15px;
            height:10px;
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
          padding-left 10px
          line-height:1;
        }
      }

      .register-city{
        border-bottom:1px solid #dedede;
        padding:25px 0px 10px 0px;
        overflow:hidden;
        .city-left{
          color:#333;
          font-weight:600;
          float:left;
          width:60px;
          font-size:$font-size-medium;
          padding-top:2px;
        }
        .city-right{
          float:right;
          overflow:hidden;
          width:calc(100% - 60px)
          padding-left:10px;
          .location{
            float:left;
            width:calc(100% - 30px)
            overflow:hidden;
            .location-icon{
              float:left;
              width:10px;
              height:15px;
            }
            .location-detail{
              width:calc(100% - 10px)
              float:left;
              font-size:$font-size-small;
              line-height:12px;
              padding-top:3px;
              color:#999;
              padding-left:6px;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
            }
          }
          .update{
            width:30px;
            float:right;
            font-size:$font-size-small;
            line-height:12px;
            padding-top:3px;
            color:#666;
            text-align:right;
          }
        }
      }
      .agree{
        padding:25px 0px 15px 0px;
        display: flex;
        justify-content: center;
        align-items center
        .ifselect{
          width:15px;
          height:15px;
        }
        .unselect{
          .selected-icon{
            width:15px;
            height:15px;
            display:block;
            background:url("../../../../static/image/login2/unselect.png")0px 0px no-repeat;
            background-size:15px 15px;
          }
        }
        .is-selected{
          .selected-icon{
            width:15px;
            height:15px;
            display:block;
            background:url("../../../../static/image/login2/selected.png")0px 0px no-repeat;
            background-size:15px 15px;
          }
        }
        .text{
          padding-left:6px;
          color:#999;
          font-size:$font-size-medium-s;
          span{
            color:#ee2c2d;
          }
        }
      }
    }
  }
</style>
