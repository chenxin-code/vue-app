/**Created by steven on 2018/11/20.*/

<template>
  <div class="aqgl">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <ul class="aqgl-list mine-box-shodow">
        <li class="public-bar border-bottom" :class="(item.type== 1? 'icon-more':'')" v-for="(item,index) in aqglList"
            @click="jumpUrl(item)" v-show="getCellIsShow(item)">
            <template v-if="!item.isHide">
              <span class="left-text">{{item.name}}</span>
              <span class="right-text" v-if="item.type == 0"><mt-switch v-model="item.value" @change="changeSwitch(item,index)"></mt-switch></span>
            </template>
        </li>
      </ul>
      <div class="gesturelogin" v-if="showGesture">
        <div class="gesturediv">
          <gcanvas ref="gcanvas" @getGesture="getGesture"></gcanvas>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Switch} from 'mint-ui';
  import gcanvas from '../gesture/gcanvas'

  export default {
    name: "aqgl",
    components: {
      gcanvas
    },
    data() {
      return {
        showGesture: false,
        gestureType: 0,
        aqglList: [
          {name: '微信绑定', id: '5', type: 1,isHide:this.$store.state.globalConfig.isShowWXLoginBtn != '1'},
          {name: '支付宝绑定', id: '8', type: 1,isHide:this.$store.state.globalConfig.isShowAliLoginBtn != '1'},
          {name: '指纹密码', id: '2', type: 0, value: this.$store.state.login.touchID, isHide:this.$store.state.globalConfig.isHideFingerprintBtn == '1'},
          {name: '人脸识别', id: '3', type: 0, value:this.$store.state.login.faceID,isHide:true},
          // {name:'修改手机号',id:'0',type:1},
          {name: '设置登录密码', id: '1', type: 1},
          {name: '手势密码', id: '6', type: 0, value: this.$store.state.login.gestureID,isHide:this.$store.state.globalConfig.isHideGestureBtn == '1'},
          {name: '手势设置', id: '4', type: 1, },
          {name: '自动加入自提点', id: '7', type: 0, value:this.$store.state.addPickupAddressType == 1 ? true : false},
          // {name: '注销账户', id: '9', type: 1},
          // {name:'设备管理',id:'4',type:1}
        ],
      }
    },
    methods: {
      getIndexArr: function (lastPoints) {
        let arr = [];
        for (let i = 0; i < lastPoints.length; i++) {
          let index = lastPoints[i].index;
          arr.push(index);
        }
        return arr;
      },
      isEqual: function (lastPoints) {
        let p1 = '',
          p2 = '';
        for (var i = 0; i < this.$store.state.login.gestureNumbers.length; i++) {
          p1 += this.$store.state.login.gestureNumbers[i];
        }
        for (var i = 0; i < lastPoints.length; i++) {
          p2 += lastPoints[i];
        }
        return p1 === p2;
      },
      getGesture: function (lastPoints) {
        if (this.isEqual(this.getIndexArr(lastPoints))) {
          this.$refs.gcanvas.reset();
          if (this.gestureType == 6) {
            this.$store.state.login.gestureID = false;
            this.$store.state.login.gestureNumbers = undefined;
            this.$store.state.login.gesturePwd = '';
            this.$bridgefunc.vuexStorage()
            this.$Toast('手势关闭成功');
            this.showGesture = false
            return ;
          } else if (this.gestureType == 4) {
            this.showGesture = false
            this.$router.push({
              path: '/usercenter/setgesture'
            })
            return ;
          }
        } else {
          this.$Toast('手势错误');
          this.$refs.gcanvas.reset();
        }
      },
      getCellIsShow:function(item){
        if(item.id == 4){
          return this.$store.state.login.gestureID;
        }else {
          return true;
        }
      },
      getSupportTypes: function () {

        this.$bridgefunc.getSupportType((result) => {
          if (result.touchID == '1') {
            this.setShowWithID(2);
            console.log(123)
          }
          if (result.faceID == '1') {
            this.setShowWithID(3);
          }
        });
      },
      setShowWithID:function(idStr){
        for (let i = 0; i < this.aqglList.length; i++) {
          let item = this.aqglList[i];
          if(item.id == idStr){
            item.isHide = false;
          }
        }
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      changeSwitch: function (item,index) {
        //指纹
        if (item.id == 2) {
          this.$bridgefunc.fingerPrintRe((result) => {
            if (result == '1') {
              if(this.$store.state.login.touchID){
                this.$store.state.login.touchID = false;
                this.$bridgefunc.vuexStorage();
                this.$Toast('指纹登录关闭成功');

              }else {
                this.openSpecialPwd(4)
              }
            } else {
              let tempItem = this.aqglList[index];
              tempItem.value = !tempItem.value;
              this.$Toast('指纹识别失败')
            }
          });
        }
        //人脸
        else if (item.id == 3) {
          this.$bridgefunc.faceIDRe((result) => {
            if (result == '1') {
              if(this.$store.state.login.faceID){
                this.$store.state.login.faceID = false;
                this.$bridgefunc.vuexStorage();
                this.$Toast('面部登录关闭成功');
              }else {
                this.openSpecialPwd(3)
              }
            } else {
              let tempItem = this.aqglList[index];
              tempItem.value = !tempItem.value;
              this.$Toast('识别失败')
            }
          });
        }
        //手势
        else if (item.id == 6) {
          if(this.$store.state.login.gestureID){
            this.gestureType = 6
            this.showGesture = true
          }else {
            this.$store.state.login.gestureID = true;
            this.$Toast('手势打开成功');
          }
          this.$bridgefunc.vuexStorage();
        }//手势
        else if (item.id == 7) {
          this.$store.state.addPickupAddressType == 1 ? this.$store.state.addPickupAddressType = 2 : this.$store.state.addPickupAddressType = 1
          this.$bridgefunc.vuexStorage();
        }
      },
      //userPwdMode 密码验证类型，1：普通登录密码；2：手势登录密码；3:刷脸登录密码；4：指纹登录密码；
      async openSpecialPwd(userPwdMode) {

        let nArgs = await this.$bridgefunc.getArgsWithPromise();
        this.$Loading.open('请求中')
        let url = '/app/json/user/openSpecialPwd';
        let token = this.$store.state.login.token;
        let timestamp = (new Date()).valueOf();

        let params1 = {
          token: token,
          userPwdMode: userPwdMode,
          pwdCode: timestamp,
          deviceId: nArgs.deviceId,
          deviceName: nArgs.deviceName,
          deviceModel: nArgs.model,
          authType:'1'
        }


        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            //3:刷脸登录密码；4：指纹登录密码；
            if(userPwdMode == 3){
              this.$store.state.login.faceID = true;
              this.$store.state.login.facePwd = data.data;
            }
            else if(userPwdMode == 4){
              this.$store.state.login.touchID = true;
              this.$store.state.login.touchPwd = data.data;
            }
            this.$bridgefunc.vuexStorage();
            this.$Toast({
              message: data.info ? data.info : '打开成功！',
              position: 'bottom',
              duration: 2000,
            });


          } else {
            this.$Toast({
              message: data.info ? data.info : '打开失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          this.$Loading.close();
          this.$Toast({
            message: '打开失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },

      jumpUrl: function (item) {
        if (item.id == '0') {
          this.$MessageBox.confirm('修改手机号会将系统中绑定的加油卡</br>和微信自动解绑，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
            this.$router.push({
              path: '/usercenter/choseway'
            })
          }).catch(action => {
          });
        } else if (item.id == '1') {
          this.$router.push({
            path: '/usercenter/setpassword'
          })
        }  else if (item.id == '4') {
          if (!this.$store.state.login.gestureNumbers || this.$store.state.login.gestureNumbers.length == 0) {
            this.$router.push({
              path: '/usercenter/setgesture'
            })
            return ;
          }
          this.gestureType = 4
          this.showGesture = true
        } else if (item.id == '5') {
          this.$router.push({
            path: '/usercenter/bindwechat'
          })
        } else if (item.id == '8') {
          this.$router.push({
            path: '/usercenter/bindalipay'
          })
        } else if (item.id == '9') {
          this.$router.push({
            path: '/usercenter/canceluser'
          })
        }
      },
    },
    created() {
      if (this.$store.state.globalConfig.has_cancel_user == '1') {
        this.aqglList.push({
          name: '注销账户',
          id: '9',
          type: 1
        })
      }
      this.getSupportTypes();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .aqgl {
    width 100%
    height 100%
    overflow hidden;
    position relative;
    .aqgl-list {
      margin 10px
      border-radius: 5px;
      .public-bar {
        padding 10px !important;
      }

      .left-text {
        height 32px;
        line-height 32px;
      }
      .right-text {
        height 32px
      }

    }
    .gesturelogin {
      position absolute;
      left 0px;
      right 0px;
      top 0px;
      bottom 0px;
      z-index 99;
      background-color white;
      overflow hidden
      display flex
      flex-direction column
      justify-content center
      .gesturediv {
        margin-top -30px
        width 375px;
        height 375px;
      }
      .accountlogin {
        width 100%
        text-align center
        font-size 16px;
        margin-top 30px
        color $color-text-d
      }
    }
  }
</style>
