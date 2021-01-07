/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="index login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="register">
        <div class="text-input">
          <div class="left-img">
            <img src="static/image/login2/registe1.png" alt="">
          </div>
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
              @blur="phoneBlur"
            />
            <!--<input placeholder="请输入手机号" type="number" @input="inputChange" v-model="phone"/>-->
          </div>
        </div>
        <div class="passwords-input">
          <div class="left-img">
            <img src="static/image/login2/registe2.png" alt="">
          </div>
          <div class="passwords" >
            <input :placeholder="$util.pwdPlaceholder()" :type="isShowPwd?'text':'password'" v-model="passwords"
                   @blur="$util.checkPassWord(passwords,true,true)"/>
          </div>
          <div class="show-passwords" @click="isShowPwd = !isShowPwd">
            <img :src="isShowPwd?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"  class="see-icon"/>
          </div>
        </div>

        <div class="passwords-input" >
          <div class="left-img">
            <img src="static/image/login2/registe3.png" alt="">
          </div>
          <div class="passwords">
            <input placeholder="请输入验证码"  v-model="msgCode"/>
          </div>
          <div class="forget-btn" >
            <count-button class="theme_standard_font"  @getSmsEvent="getMsgCode" :phone="phone"  ref="countBtn"></count-button>
          </div>
        </div>
        <div class="text-input" @click="showAreaSelector">
          <div class="left-img">
            <img src="static/image/login2/registe4.png" alt="">
          </div>
          <div class="cell-phone">
            <input placeholder="请选择城市" type="text" disabled="true" v-model="region"/>
          </div>
        </div>
        <div class="passwords-input" v-if="$store.state.globalConfig.user_register_referrer_input != '0'">
          <div class="left-img">
            <img src="static/image/login2/registe5.png" alt="">
          </div>
          <div class="passwords">
            <input placeholder="请输入推荐码" v-model="referrer"/>
          </div>
          <div class="show-passwords" @click="scanCodeFunc">
            <img src="static/image/setting/icon-scan.png" class="scancode"/>
          </div>

        </div>
        <!--<div class="register-city">-->
          <!--<div class="city-left">注册城市</div>-->
          <!--<div class="city-right">-->
            <!--<div class="location">-->
              <!--<img src="../../../../static/image/login2/location.png" class="location-icon"/>-->
              <!--<p class="location-detail">石家庄</p>-->
            <!--</div>-->
            <!--<div class="update">修改</div>-->
          <!--</div>-->
        <!--</div>-->
        <div class="agree">
          <!--选中class为is-selected ！ 未选中为unselect-->
          <div class="ifselect" :class="(isChecked ? 'is-selected': 'unselect')" @click="isArgee()">
            <i class="selected-icon"></i>
          </div>
          <p class="text" @click="clickAgreement">我已看过并同意<span >《用户使用协议》</span></p>
        </div>
        <div class="common-btn theme_standard_bg theme_font_white" @click="checkOutFun()">立即注册</div>
      </div>
    </nav-content>
    <Succee v-if="showSuccee" :succeeText = "succeeText" @closeBtn="closeBtn"></Succee>
    <!--注销账号弹窗-->
    <div class="register-mark" v-if="showOne">
      <div class="mark-center">
        <p class="mark-title">提示</p>
        <p class="text">该账号为系统注销账号，请确认是否为同一人操作？</p>
        <div class="btn">
          <span class="btn-c" @click="closeMark()">否</span>
          <span class="btn-s" @click="closeMark()">是</span>
        </div>
      </div>
    </div>
    <!--登录密码弹窗-->
    <div class="register-mark" v-if="showOne">
      <div class="mark-center">
        <p class="mark-title">登录密码验证</p>
        <div class="input-text">
          <input placeholder="请输入账号旧登录密码"/>
        </div>
        <!--错误提示-->
        <p class="err-tip">旧密码验证失败，请重新输入！</p>
        <div class="btn">
          <span class="btn-c" @click="closeMark()">否</span>
          <span class="btn-s" @click="closeMark()">是</span>
        </div>
      </div>
    </div>

    <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent"
                  @closeEvent="regionCloseEvent"></RegionSelect>
  </div>

</template>

<script>
  import Succee from './succee-mark'
  import  MD5 from '@/utils/md5.js'
  import CountButton from '@/components/commonui/count-button';
  import RegionSelect from '../../base/region-select'
  import PopupTip from '../login/popupTip/index'

  export default {
    name: "index",
    components: {
      Succee,
      CountButton,
      RegionSelect
    },
    data() {
      return {
        showOne:false,
        showSuccee:false,
        phone:'',
        passwords:'',
        msgCode:'',
        isChecked:false,
        isShowPwd:false,
        succeeText:'恭喜，注册成功！',
        referrer:'',
        scanCode:'',
        region:'',
        province:'',   //省份
        provinceCode:'',    //省份编码
        city:'',    //城市
        cityCode:'',   //城市编码
        showSelect:false,
        initData: {
          title: '请选择地区'
        },
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      phoneBlur:function(){

        if(!this.$util.checkMobile(this.phone) || this.$store.state.globalConfig.user_register_referrer_input == '0'){
          return;
        }
        this.$Loading.open()
        let url = '/app/json/login/getPreRegReferrerByPhone';
        let params1 = {
          phone: this.phone
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          // console.log(data);
          if (data.status == 0) {
            this.referrer = data.data.referrer;
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
        });

      },
      showAreaSelector: function () {
        this.showSelect = true;
        this._getRegionData(0);
      },
      clickAgreement:function(){
        this.$router.push({
          path: '/usercenter/agreement'
        })
      },
      // 仅输入数字
      inputChange:function(e){
        let value = e.target.value ;
        this.phone = this.$util.onlyNumber(value);
      },
      scanCodeFunc:function(){

        this.$bridgefunc.scanCode((dic)=>{

          let code = dic.code
          if (dic.code && (dic.code.indexOf('http') > -1)) { // 兼容微信扫码我的二维码跳转到下载地址
            code = this.$util.getUrlParam(dic.code, 'qrCode')
          }
          this.scanCode = code;
          this.referrer = code;
        });
      },
      regionCloseEvent:function(){
        this.showSelect = false;
      },
      selectedItemsEvent: function (selectedValue) {
        let item = selectedValue.item;
        let selectedItems = selectedValue.selecteds;
        if (selectedItems.length == 2) {
          this.showSelect = false;
          this.getRegionText(selectedItems);
          return;
        }
        this._getRegionData(item.id)
      },
      getRegionText: function (selectedItems) {

        for (let i = 0; i < selectedItems.length; i++) {
          let item = selectedItems[i];
          if(i == 0){
            this.provinceCode = item.id;
            this.province = item.name;
          }else  if(i == 1){
            this.cityCode = item.id;
            this.city = item.name;
          }
        }
        this.region = this.province+','+this.city;
        this.$refs.regionselect.reset(null);
      },
      _getRegionData: function (parentId) {
        this.$Loading.open()
        // console.log(parentId)
        let url = '/app/json/area/loadAreaList';
        let params1 = {
          token: this.$store.state.login.token,
          parentId: parentId
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          // console.log(data);
          if (data.status == 0) {
            let arr = data.data;
            console.log(arr)
            if (arr.length > 0) {
              this.$nextTick(function () {
                console.log(this.$refs.regionselect)
                this.$refs.regionselect.pushCustomOptions(arr);
              })
            } else {
              this.showSelect = false;
              this.region = this.selectedItems;
              this.getRegionText();
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('获取失败', error);
          this.$Toast('获取数据失败')
        });
      },
      backEvent: function () {
        this.$router.go(-1);
      },

      //同意协议
      isArgee:function(){
        if(!this.isChecked){
          this.isChecked = true;
        }else {
          this.isChecked =false;
        }
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


        if(this.msgCode == ''){
          this.$Toast( '验证码不能为空')
          return;
        }
        else if(!this.isChecked){
          this.$Toast('请阅读用户协议');
          return
        }
        else if(this.region == ''){
          this.$Toast('请选择城市');
          return
        }
        this.registerFun();
      },

      //注册
      registerFun:function(){
        this.$Loading.open();
        let url = '/app/json/login/register';

        let paramsData = {
          phone: this.phone,
          userPwd:MD5(this.passwords),
          smsVerifyCode:this.msgCode,
          regChannel:'0',
          province:this.province,
          provinceCode:this.provinceCode,
          city:this.city,
          cityCode:this.cityCode
        };
        if (this.$util.isIos()) {
          paramsData.appSysType = '1'
        } else {
          paramsData.appSysType = '2'
        }
        if (this.$store.state.globalConfig.user_loginPwd_type == '1') {
          // 明文密码
          paramsData.userPwd = this.passwords
        }
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
              this.$Toast('注册成功')

              if (this.$store.state.globalConfig.yhtRigisterToOilDrop == '1') {
                let url = window.location.origin + '/app-vue/oildrop/user-identity-information-query'
                this.$store.state.pushData.pushData = {
                  path: url,
                  isnativetop: "0",
                  superback: 1,
                  isVuePage: '0'
                }
                this.$store.state.pushData.pushType = 1
                this.$store.state.indexData.selectedIndex = ''
              }

              this.$userCenter.retsetToIndex(data.data,2);
              this.$actionStatistics.loginAction('110050', JSON.stringify(paramsData), this.$store.state.indexData.city)
              window.localStorage.setItem('hobby',1)
            }else if(data.errorCode == 2002){
              this.$Toast( data.info?data.info:'手机号已存在用户已注册')
            }
            else {
              if (data.info.indexOf('注销') > -1) {
                PopupTip.open({
                  cancellationText: data.info
                })
              } else {
                this.$refs.countBtn.resetClock();
                this.$Toast( data.info?data.info:'注册失败')
              }
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast( "系统运行过程中遇到问题，请稍候再试");
          }
        )
      },

      //获取短信验证码
      getMsgCode:function(imgVerifyCode,uuid){
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
      registerEvent: function () {
        this.showOne = true;
      },
      closeMark:function () {
        this.showOne = false;
      },

      closeBtn:function () {
        this.showSuccee = false;
      },
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == '/usercenter/agreement') {

      } else {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    created() {
      this.provinceCode = this.$store.state.mall2.selectAddress.provinceId
      this.province = this.$store.state.mall2.selectAddress.provinceName
      this.cityCode = this.$store.state.mall2.selectAddress.cityId
      this.city = this.$store.state.mall2.selectAddress.cityName
      if (this.province != undefined && this.city != undefined) {
        this.region = this.province+','+this.city;
      } else {
        this.region = '请选择地区';
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .index {
    width 100%
    height 100%
    overflow hidden
    .register {
      margin 10px 20px 0px 20px;
      .text-input{
        border-bottom:1px solid #dedede;
        padding:20px 0px 5px 0px;
        display: flex;
        align-items: center;
        .cell-phone{
          width:100%;
          .van-cell {
            padding 3px 0 !important;
          }
          input{
            height 30px;
            display:block;
            font-size:$font-size-medium-s;
            width:100%;
          }
          input[disabled]{
            background white;
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
          extend-click()
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
    .register-mark{
      width:100%;
      height:100%;
      position:absolute;
      top:0px;
      left:0px;
      background:rgba(0,0,0,0.66);
      z-index:99
      .mark-center{
        width:280px;
        height:150px;
        position:absolute;
        left:50%;
        top:50%;
        margin-left:-140px;
        margin-top:-100px;
        background:#fff;
        border-radius:5px;
        -webkit-border-radius:5px;
        text-align:center;
        .mark-title{
          padding:15px 0px;
          font-size:$font-size-medium;
          color:#333;
          font-weight:600;
        }
        .img{
          padding:20px 0px 10px 0px;
          text-align:center;
          img{
            width:40px;
            height:40px;
            display:inline-block;
          }
        }
        .text{
          font-size:$font-size-medium;
          line-height:18px;
          font-weight:500;
          color:#333;
          padding:0px 45px;
        }
        .input-text{
          padding:0px 30px;
          input{
            width:100%;
            padding:0px 10px;
            height:28px;
            background #f2f2f2;
            border-radius:14px;
            font-size:$font-size-medium-s
          }
        }
        .err-tip{
          color:#f02c2d;
          line-height:30px;
          font-size:$font-size-medium-s
        }
        .btn{
          width:100%;
          height:50px;
          font-size:$font-size-medium;
          position:absolute;
          left:0px;
          bottom:0px;
          line-height:50px;
          color:#fff;
          border-radius:0px 0px 5px 5px;
          -webkit-border-radius:0px 0px 5px 5px;
          display: flex;
          justify-content: space-around;
          overflow:hidden;
          span{
            display:block;
            width:100%;
          }
          .btn-c{
            color:#333333;
            background:#fff;
          }
          .btn-s{
            color:#fff;
            background:#f02c2d;
          }
        }
      }
    }
  }

</style>
