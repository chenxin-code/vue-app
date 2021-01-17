/**Created by steven on 2018/11/20.*/

<template>
  <div class="setting">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="center">
        <div class="headimg icon-more mine-box-shodow" @click="enterUserInfo">
          <div class="pic">
            <img :src="getHeadImg()"/>
          </div>
          <div class="user">
            <p class="user-name">{{userInfo.nickName}}</p>
            <p class="user-phone">{{userInfo.phone}}</p>
          </div>
        </div>
        <ul class="setting-list mine-box-shodow">
          <li class="setting-item public-bar icon-more border-bottom" v-for="(item,index) in settingList1"
              @click="jumpUrl(item)">
            <span class="left-text">{{item.name}}</span>
          </li>
        </ul>
        <ul class="setting-list mine-box-shodow">
          <li class="setting-item public-bar icon-more border-bottom" v-for="(item,index) in settingList2"
              @click="jumpUrl(item)">
            <span class="left-text">{{item.name}}</span>
          </li>
        </ul>
        <ul class="setting-list mine-box-shodow">
          <li class="setting-item public-bar icon-more border-bottom" v-for="(item,index) in settingList3"
              @click="jumpUrl(item)">
            <span class="left-text">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <!--小程序和公众号不显示退出登录-->
      <!-- <div v-if="$store.state.webtype != 2" class="button" @click="logout">
        <span v-if="$store.state.webtype == 3">解除绑定</span>
        <span v-else>退出登录</span>
      </div> -->
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "setting",
    components: {},
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    data() {
      return {
        settingList1: [
          {name: '我的收货地址', id: '1'},
          {name: '我的自提点', id: '2'},
        ],
        settingList2: [
          {name: '账户与安全', id: '4'},
          // {name: '偏好设置', id: '77'},
        ],
        settingList3: [
          {name: '我的推荐人', id: '10'},
          // {name:'推荐码',id:'6'},
          {name: '下载分享', id: '7'},
          {name: '意见反馈', id: '8'},
          {name: '关于我们', id: '9'},
          {name: '通用', id: '5'},
          // {name: '系统权限', id: '11'}
        ],
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      getHeadImg: function () {
        if (this.userInfo.headImg && this.userInfo.headImg.length) {
          return this.userInfo.headImg;
        } else {
          //女
          if (this.userInfo.gender == '2') {
            return 'static/image/setting/setting-img.png';
          } else {
            return 'static/image/setting/setting-img-man.png';
          }
        }
      },
      enterUserInfo: function () {
        this.$router.push({
          // path: '/usercenter/userinfoc'
          path: '/usercenter/userinfo'
        })
      },
      jumpUrl: function (item) {
        if (item.id == '0') {
          this.$router.push({
            path: ''
          })
        } else if (item.id == '1') {
          this.$router.push({
            path: '/mall2/addresslist',
            query: {
              pageType: 1
            }
          })
        } else if (item.id == '2') {
          this.$router.push({
            path: '/mall2/mypickupaddress',
            query: {
              pageType: 1
            }
          })
        } else if (item.id == '3') {
          this.$router.push({
            path: '/usercenter/bindwechat'
          })
        } else if (item.id == '4') {
          this.$router.push({
            path: '/usercenter/aqgl'
          })
        } else if (item.id == '5') {
          this.$router.push({
            path: 'tygl'
          })
        } else if (item.id == '6') {
          this.$router.push({
            path: '/usercenter/recommendcode'
          })
        } else if (item.id == '7') {
          this.$router.push({
            path: '/usercenter/downloadshare'
          })
        } else if (item.id == '8') {
          this.$router.push({
            path: '/usercenter/suggest'
          })
        } else if (item.id == '9') {
          this.$router.push({
            path: '/usercenter/aboutus'
          })
        } else if (item.id == '10') {
          this.$router.push({
            path: '/usercenter/referralcode'
          })
        } else if (item.id == '11') {
          this.$router.push({
            path: '/usercenter/systempermissions'
          })
        } else if (item.id == '77') {
          this.$router.push({
            path: '/mall2/hobby'
          })
        }
      },
      logout: function () {
        this.$MessageBox.confirm('是否确定退出', '提示').then(action => {
          this.logoutFunc();
        }).catch(action => {
        });

      },
      logoutFunc: function () {
        this.$Loading.open();
        let url = '/app/json/login/logout';
        let paramsData = {
          token: this.$store.state.login.token
        }

        // 微信小程序解绑
        if (this.$store.state.webtype == 3) {
          url = '/app/json/user/unBindThirdUser';
          paramsData.regChannel = 6
        }
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$userCenter.loginOut();
            } else {
              this.$Toast(data.info ? data.info : '登录失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      },
      arrRemoveId: function (list, id) {
        let arr = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].id != id) {
            arr.push(list[i])
          }
        }
        return arr
      },

      initData: function () {

        if (this.$store.state.globalConfig.delivertype_default == '1') {
          this.settingList1 = [
            {name: '我的自提点', id: '2'}
          ]
        } else if (this.$store.state.globalConfig.delivertype_default == '2') {
          this.settingList1 = [
            {name: '我的收货地址', id: '1'}
          ]
        }
        //去掉下载分享
        if (this.$store.state.webtype == 3) {
          this.settingList3 = this.arrRemoveId(this.settingList3, '7')
        }
        // 去掉意见反馈
        if (this.$store.state.globalConfig.appNoFeedback == '1') {
          this.settingList3 = this.arrRemoveId(this.settingList3, '8')
        }
        // 去掉账户安全
        if (this.$store.state.globalConfig.hideAccountSecurity == 'true') {
          this.settingList2 = this.arrRemoveId(this.settingList2, '4')
        }

        if (this.$store.state.globalConfig.isShowMyPrefer == 1) {
          this.settingList2.push({
            name: '偏好设置', id: '77'
          })
        } else {

        }
        if (this.$store.state.protocolVersion > 2.4) {
          this.settingList3.push({name: '系统权限', id: '11'})
        }
      }
    },
    created() {
      this.initData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .setting {
    width 100%
    height 100%
    overflow hidden;

    .center {
      position absolute
      top 0px
      width 100%
      bottom 50px
      overflow auto
      -webkit-overflow-scrolling touch;

      .headimg {
        display: flex;
        justify-content: end;
        align-items: center;
        padding: 10px;
        margin: 10px 10px;
        border-radius 5px

        // box-shadow: 0px 1px 0px #e8e8e8;

        .pic {
          width: 40px;
          height: 40px;

          img {
            display: block;
            width: 40px;
            height: 40px;
          }
        }

        .user {
          margin-left: 10px;

          .user-name {
            font-size: $font-size-small;
            color: #333;
            font-weight: 600;
          }

          .user-phone {
            font-size: 10px;
            color: #666;
            margin-top: 9px;
          }
        }
      }

      .setting-list {
        margin 10px
        border-radius 5px

        .setting-item {
        }
      }

      .setting-list:nth-child(2) {
        margin-top 15px;
      }
    }

    .button {
      width: 100%;
      height: 49px;
      background: #f02c2d;
      color: #fff;
      font-size: 17px;
      font-weight: 500;
      text-align: center;
      z-index 1;
      line-height: 49px;
      position: fixed;
      left: 0px;
      bottom: 0px;
      z-index: 1;

    }
  }
</style>
