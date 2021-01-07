<template>
  <div class="aqgl">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="refueling-preference">
        <p class="label">加油偏好</p>
        <ul class="oil-variety">
          <li
            @click="changeOilVariety(index)"
            class="item"
            :class="{active: activeIndex == index}"
            v-for="(item, index) in oilVarietyList"
            :key="index">{{ item.text }}</li>
        </ul>
      </div>
      <ul class="aqgl-list mine-box-shodow">
        <template
          v-for="(item,index) in aqglList"
          >
          <li
            v-if="item.hideKey ? $store.state.globalConfig[item.hideKey] != '1' : !item.isHide"
            class="public-bar border-bottom"
            :class="(item.type== 1? 'icon-more':'')"
            @click="jumpUrl(item)"
            v-show="getCellIsShow(item)"
            >
              <span class="left-text">{{ item.name }}</span>
              <span class="right-text" v-if="item.type == 0">
                <mt-switch
                  v-model="item.value"
                  @change="changeSwitch(item,index)"></mt-switch>
              </span>
          </li>
        </template>
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
import { Switch } from 'mint-ui';
import { Dialog } from 'vant';
import Cookie from 'js-cookie'
import gcanvas from '@/components/usercenter/gesture/gcanvas.vue'

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
        { name: '我的资料', id: '14', type: 1 },
        { name: '我的积分', id: '10', type: 1 },
        { name: '加油卡绑定', id: '11', type: 1 },
        { name: '微信绑定', id: '5', type: 1, isHide: this.$store.state.globalConfig.isShowWXLoginBtn != '1' },
        { name: '支付宝绑定', id: '15', type: 1},
        // 指纹密码
        {name: '指纹密码', id: '2', type: 0, value: this.$store.state.login.touchID, isHide:this.$store.state.globalConfig.isHideFingerprintBtn == '1',hideKey:'isHideFingerprintBtn'},
        { name: '人脸识别', id: '3', type: 0, value: this.$store.state.login.faceID, isHide: true },
        { name: '设置登录密码', id: '1', type: 1 },
        { name: '油滴支付密码', id: '13', type: 1 },
        // 手势密码
        {name: '手势密码', id: '6', type: 0, value: this.$store.state.login.gestureID,isHide:this.$store.state.globalConfig.isHideGestureBtn == '1',hideKey:'isHideGestureBtn'},
        { name: '手势设置', id: '4', type: 1, },
        { name: '自动加入自提点', id: '7', type: 0, value: this.$store.state.addPickupAddressType == 1 ? true : false },
      ],
      oilVarietyList: [
        { text: '汽油' },
        { text: '柴油' },
      ],
      activeIndex: 0,
      actionInfo: {},
      appwxurl: ''
    }
  },
  methods: {
    // 获取用户是否设置油品类型
    getOilChoice() {
      this.$Loading.open()
      this.$http.post('/app/json/user/userOilChoice', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data.type == 1) {
            this.activeIndex = 0
          } else {
            this.activeIndex = 1
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`userOilChoice err ${err}`)
      })
    },
    changeOilVariety(index) {
      this.$Loading.open()
      this.$http.post('/app/json/user/updateUserOilChoice', {
        type: index === 0 ? 1 : 2
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.$Toast('选择成功！')
          this.activeIndex = index
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`userOilChoice err ${err}`)
      })
    },
    getIndexArr: function(lastPoints) {
      let arr = [];
      for (let i = 0; i < lastPoints.length; i++) {
        let index = lastPoints[i].index;
        arr.push(index);
      }
      return arr;
    },
    isEqual: function(lastPoints) {
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
    getGesture: function(lastPoints) {
      if (this.isEqual(this.getIndexArr(lastPoints))) {
        this.$refs.gcanvas.reset();
        if (this.gestureType == 6) {
          this.$store.state.login.gestureID = false;
          this.$store.state.login.gestureNumbers = undefined;
          this.$store.state.login.gesturePwd = '';
          this.$bridgefunc.vuexStorage()
          this.$Toast('手势关闭成功');
          this.showGesture = false
          return;
        } else if (this.gestureType == 4) {
          this.showGesture = false
          this.$router.push({
            path: '/usercenter/setgesture'
          })
          return;
        }
      } else {
        this.$Toast('手势错误');
        this.$refs.gcanvas.reset();
      }
    },
    getCellIsShow: function(item) {
      if (item.id == 4) {
        return this.$store.state.login.gestureID;
      } else {
        return true;
      }
    },
    getSupportTypes: function() {
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
    setShowWithID: function(idStr) {
      for (let i = 0; i < this.aqglList.length; i++) {
        let item = this.aqglList[i];
        if (item.id == idStr) {
          item.isHide = false;
        }
      }
    },
    backEvent: function() {
      this.$router.go(-1);
    },
    changeSwitch: function(item, index) {
      //指纹
      if (item.id == 2) {
        this.$bridgefunc.fingerPrintRe((result) => {
          if (result == '1') {
            if (this.$store.state.login.touchID) {
              this.$store.state.login.touchID = false;
              this.$bridgefunc.vuexStorage();
              this.$Toast('指纹登录关闭成功');

            } else {
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
            if (this.$store.state.login.faceID) {
              this.$store.state.login.faceID = false;
              this.$bridgefunc.vuexStorage();
              this.$Toast('面部登录关闭成功');
            } else {
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
        if (this.$store.state.login.gestureID) {
          this.gestureType = 6
          this.showGesture = true
        } else {
          this.$store.state.login.gestureID = true;
          this.$Toast('手势打开成功');
        }
        this.$bridgefunc.vuexStorage();
      } //手势
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
        authType: '1'
      }


      this.$http.post(url, params1).then(res => {
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          //3:刷脸登录密码；4：指纹登录密码；
          if (userPwdMode == 3) {
            this.$store.state.login.faceID = true;
            this.$store.state.login.facePwd = data.data;
          } else if (userPwdMode == 4) {
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

    jumpUrl: function(item) {
      if (item.id == '0') {
        this.$MessageBox.confirm('修改手机号会将系统中绑定的加油卡</br>和微信自动解绑，是否继续？', '提示', { confirmButtonText: '确定' }).then(action => {
          this.$router.push({
            path: '/usercenter/choseway'
          })
        }).catch(action => {});
      } else if (item.id == '1') {
        this.$router.push({
          path: '/usercenter/setpassword'
        })
      } else if (item.id == '4') {
        if (!this.$store.state.login.gestureNumbers || this.$store.state.login.gestureNumbers.length == 0) {
          this.$router.push({
            path: '/usercenter/setgesture'
          })
          return;
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
      } else if (item.id == '14') {
        let entryUrl = `${window.location.origin}/app-vue/oildrop/openinginstructions`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      } else if (item.id == '10') {
        // 打开积分页面
        if (this.actionInfo.state == 2) {
          Dialog.alert({
            title: '提示',
            message: '您的账户已冻结，请联系客服进行处理！'
          })
        } else if (this.$store.state.webtype == 2) {
          let entryUrl = `${this.appwxurl.wxPoint.turnUrl}?wxOpenID=${Cookie.get('wxopenid')}${this.appwxurl.appPoint.turnParam}`
          this.$market.enterNav({
            link: {
              type: '3',
              url: entryUrl,
              useOldProtocal: true
            }
          })
        } else {
          let entryUrl = `${this.appwxurl.appPoint.turnUrl}`
          this.$market.enterNav({
            link: {
              type: '3',
              url: entryUrl,
              useOldProtocal: true
            }
          })
        }
      } else if (item.id == '11') {
        if (this.actionInfo.state == 4) {
          Dialog.alert({
            title: '提示',
            message: '您的账户已锁定！'
          })
        } else if (this.actionInfo.state == 2) {
          Dialog.alert({
            title: '提示',
            message: '您的账户已冻结，请联系客服进行处理！'
          })
        } else {
          this.$router.push('/addCard')
        }
      } else if (item.id == '13') {
        let entryUrl = `${window.location.origin}/app-vue/oildrop/paymanagement`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      } else if (item.id == '15') {
        let entryUrl = `${window.location.origin}/app-vue/oildrop/zfb-bind`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      }
    },
    getYoudiTurnConfFunc() {
      this.$Loading.open()
      this.$http.post('/app/json/app_youdi/getYoudiTurnConf', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.appwxurl = JSON.parse(data.data)
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getYoudiTurnConf err ${err}`)
      })
    }
  },
  created() {
    if (this.$route.query.actionInfo) {
      this.actionInfo = this.$route.query.actionInfo
      this.getYoudiTurnConfFunc()
    }
    if (this.$store.state.globalConfig.has_cancel_user == '1') {
      this.aqglList.push({
        name: '注销账户',
        id: '9',
        type: 1
      })
    }
    this.getSupportTypes();
    // 获取用户是否设置油品类型
    this.getOilChoice()
  }
}

</script>
<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"
.refueling-preference {
  display flex;
  justify-content space-between;
  align-items center;
  margin 5px 10px 0;
  padding 10px;
  border-radius 5px;
  box-shadow: 0 0 8px 0 rgba(197, 197, 197, 0.3);
  .label {
    font-size: 13px;
    color: #333;
  }
  .oil-variety {
    display flex;
    border-radius 4px;
    background-color #f8f8f9;
    overflow hidden;
    .item {
      font-size 12px;
      padding 5px 10px;
      border-radius 4px;
      &.active {
        background-color #E81B1A;
        color #fff;
      }
    }
  }
}

//一栏或者两栏
.public-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  .left-text {
    font-size: 13px;
    color: #333;
  }
}

//  右角标更多
.icon-more {
  background: url('../../../../../static/image/setting/icon-more.png') calc(100% - 10px) center no-repeat;
  background-size: 9px 15px;
}

//  一栏或者两栏底线
.border-bottom {
  border-bottom: 0.5px solid #efefef;
}
.border-bottom:nth-last-child(1){
  border-bottom: none;
}

.bind-box-shodow{
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  border-radius 8px
}
//
.mine-box-shodow{
  box-shadow: 0 0 8px 0 rgba(197, 197, 197, 0.3);
  border-radius 8px
}


.aqgl {
  width 100%;
  height 100%;
  position relative;
  .nav-content {
    overflow-y auto;
  }

  .aqgl-list {
    margin 10px;
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
    overflow hidden;
    display flex;
    flex-direction column;
    justify-content center;
    .gesturediv {
      margin-top -30px;
      width 375px;
      height 375px;
    }
    .accountlogin {
      width 100%;
      text-align center;
      font-size 16px;
      margin-top 30px;
      color $color-text-d;
    }
  }
}

</style>
