/**Created by steven on 2018/11/20.*/

<template>
  <div class="setgesture">
    <nav-top @backEvent="backEvent">
      <!--<div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px; font-size: 12px;" @click="registerEvent">注册</div>-->
    </nav-top>
    <nav-content>
      <div class="g-top">
        <div class="g-select">
          <div class="g-dot  "  v-for="n in 9"  :class="isExist(n)?'theme_bg_red':'theme_bg_white_ef'">
          </div>
        </div>
        <div class="g-tip" :class="isWrong?'theme_font_red':'theme_font_gray'">
          {{gTipStr}}
        </div>
      </div>

      <div class="canvas">
        <gcanvas ref="gcanvas" @getGesture="getGesture"></gcanvas>
      </div>
      <p class="bt-tip theme_font_gray">
        设置手势密码, 防止他人未经授权查看
      </p>
    </nav-content>
  </div>
</template>

<script>

  import gcanvas from './gcanvas'
  export default {
    name: "setgesture",
    components: {
      gcanvas
    },
    data() {
      return {
        gTipStr:'设置手势密码',
        isWrong:false,
        step:1,
        firstPoints:[],
        secondPoints:[],

      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      isExist:function(n){
        let t = this.firstPoints.indexOf(n);
        return t > -1;
      },
      getGesture:function (lastPoints) {


        if(this.step == 1){
          if(lastPoints.length < 4){
            this.gTipStr = '至少连接4个点，请重新绘制';
            this.isWrong = true;
            this.$refs.gcanvas.reset();
          }else {
            this.gTipStr = '请再次绘制';
            this.isWrong = false;
            this.firstPoints = this.getIndexArr(lastPoints);
            this.step = 2;
            this.$refs.gcanvas.reset();
          }
        }else {
          this.secondPoints = this.getIndexArr(lastPoints);
          if(this.isEqual()){
            //相同存储
            this.openSpecialPwd(2);
          }else {
            //不存储
            this.gTipStr = '两次绘制不同，请重新绘制';
            this.isWrong = true;
            this.firstPoints = [];
            this.step = 1;
            this.$refs.gcanvas.reset();
          }
        }
      },
      //userPwdMode 密码验证类型，1：普通登录密码；2：手势登录密码；3:刷脸登录密码；4：指纹登录密码；
      async openSpecialPwd(userPwdMode) {
        this.$Loading.open('请求中')

        let nArgs = await this.$bridgefunc.getArgsWithPromise();

        let url = '/app/json/user/openSpecialPwd';
        let token = this.$store.state.login.token;
        let timestamp = (new Date()).valueOf();

        let params1 = {
          token: token,
          userPwdMode: userPwdMode,
          pwdCode: timestamp,
          deviceId: nArgs.deviceId?nArgs.deviceId:'123',
          deviceName: nArgs.deviceName?nArgs.deviceName:'test',
          deviceModel: nArgs.model?nArgs.model:'phone',
          authType:'1'
        }

        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.login.gestureNumbers = this.secondPoints;
            this.$store.state.login.gesturePwd = data.data;
            this.$Toast({
              message: data.info ? data.info : '手势设置成功！',
              position: 'bottom',
              duration: 2000,
            });
            this.$bridgefunc.vuexStorage(()=>{
              this.$router.go(-1);
            });


          } else {
            this.$Toast({
              message: data.info ? data.info : '手势设置失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          this.$Loading.close();
          this.$Toast({
            message: '手势设置失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },

      isEqual:function(){
        let  p1 = '',
          p2 = '';
        for (var i = 0; i < this.firstPoints.length; i++) {
          p1 += this.firstPoints[i];
        }
        for (var i = 0; i < this.secondPoints.length; i++) {
          p2 += this.secondPoints[i];
        }
        return p1 === p2;
      },
      getIndexArr:function (lastPoints) {
        let arr = [];
        for(let i = 0; i < lastPoints.length; i++){
          let index = lastPoints[i].index;
          arr.push(index);
        }
        return arr;
      }
    },

    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .setgesture {
    width 100%
    height 100%
    overflow hidden
    .g-top {
      margin-top 10px
      display flex
      flex-direction column
      align-items center
      justify-content center
      .g-select {
        width 72px
        height 72px
        overflow hidden
        .g-dot {
          float left
          width 12px
          height 12px
          margin 6px
          border-radius 6px
        }

      }
      .g-tip {
        font-size $font-size-small-s
        text-align center
        width 100%
      }
    }
    .bt-tip {
      position absolute
      left 0
      right 0
      bottom 26px
      font-size $font-size-small
      text-align center
    }
    .canvas{
      width 375px
      height 375px

    }
  }
</style>
