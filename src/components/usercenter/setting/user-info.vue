/**Created by steven on 2018/11/20.*/

<template>
  <div class="user-info">
    <nav-top @backEvent="backEvent">
      <div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px; font-size: 12px;" @click="saveInfo" v-show="showRightBtn">保存</div>
    </nav-top>
    <nav-content>
      <div class="center">
        <ul class="setting-list mine-box-shodow">
          <li class="setting-item public-bar border-bottom info-cellpad" :class="{'icon-more': !item.disabled}" v-for="(item,index) in settingList"
              @click="jumpUrl(item,index)">
            <span class="left-text">{{item.name}}</span>
            <div class="right-text">
              <img :src="getItemLb(item)" v-if="item.type == 0"/>
              <div class="right-title" v-if="item.type == 1">
                {{getItemLb(item)}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav-content>
    <UpdateMark ref="updateMark" @submitData="infoChanged"></UpdateMark>
    <mt-datetime-picker
      @confirm="changetime"
      type="date"
      ref="picker"
      :startDate="new Date(1930, 0, 1)"
      :endDate="new Date()"
      v-model="currentDate"
      year-format="{value}"
      month-format="{value}"
      date-format="{value}">
    </mt-datetime-picker>

    <van-popup
      v-model="sexShow"
      position="bottom"
    >
      <van-picker
        show-toolbar
        title="请选择性别"
        :columns="columns"
        @cancel="sexShow = false"
        @confirm="onConfirm"
      />
    </van-popup>

  </div>


</template>

<script>
  import UpdateMark from './update-mark'
  import Photo from '@/components/commonui/choosephoto'
  import {DatetimePicker} from 'mint-ui';
  import {mapGetters} from 'vuex'
  import { Popup,Picker} from 'vant';

  export default {
    name: "setting",
    components: {
      UpdateMark,
      DatetimePicker,
      Popup,
      Picker
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    data() {
      // 禁止修改手机号
      let phoneDisabled = this.$store.state.globalConfig.appUserInfoPhoneDisabled == 1
      return {
        settingList: [
          {name: '头像', id: '0', key: 'headImg', type: 0},
          {name: '姓名', id: '1', key: 'nickName', type: 1},
          // {name:'会员号',id:'2',key:'headImg',type:1},
          {name: '邮箱', id: '3', key: 'email', type: 1},
          {name: '生日', id: '4', key: 'birthday', type: 1},
          // {name:'微信绑定',id:'5',type:1},
          // {name:'常驻地',id:'6',type:1},
          // {name:'注销账号',id:'7',type:1}
          {name: '性别', id: '9', key: 'gender', type: 1},

          {name: '手机号', id: '8', key: 'phone', type: 1, disabled: phoneDisabled},
          // updatephone
        ],
        userInfoCP: {},
        currentDate: new Date(),
        selectIndex: -1,
        showRightBtn: false,
        columns:[
          { text: '男', value: 1 },
          { text: '女', value: 2 }
          ],
        sexShow: false,
      }
    },
    methods: {
      onConfirm:function(value, index){
        this.sexShow = false;
        this.userInfoCP['gender'] = value['value'];
        if (this.checkModify()) {
          this.showRightBtn = true
        }
      },
      checkModify: function () {
        if (this.userInfoCP.headImg != this.userInfo.headImg || this.userInfoCP.nickName != this.userInfo.nickName || this.userInfoCP.email != this.userInfo.email || this.userInfoCP.birthday != this.userInfo.birthday || this.userInfoCP.gender != this.userInfo.gender) {
          return true
        }
        return false
      },
      infoChanged: function (item, value) {
        this.userInfoCP[item.key] = value;
        this.$refs.updateMark.closeMark();
        if (this.checkModify()) {
          this.showRightBtn = true
        }
      },
      saveInfo: function () {
        this.submitData(false)
      },
      backEvent: function () {
        if (this.checkModify()) {
          this.$MessageBox.confirm('您还有已修改的信息未保存，是否保存信息!', '提示', {
            cancelButtonText: '直接返回',
            confirmButtonText: '保存并返回'
          }).then(action => {
            // this.$router.go(-1);
            this.submitData(true)
          }).catch(action => {
            this.$router.go(-1);
          });
          // this.$MessageBox.alert('您还有已修改的信息未保存，是否放弃!','提示').then(action => {
          //   this.$store.state.login.password =  MD5(this.newPassword);
          //   this.$bridgefunc.vuexStorage(()=>{
          //     this.backEvent();
          //   });
          // });
          return ;
        }
        this.$router.go(-1);
      },
      getItemLb: function (item) {
        let key = item.key;
        if (item.type == 0) {
          if (this.userInfoCP[key]) {
            return this.userInfoCP.headImg;
          } else {
            //女
            if (this.userInfoCP.gender == '2') {
              return 'static/image/setting/setting-img.png';
            }else  {
              return 'static/image/setting/setting-img-man.png';
            }
          }
        }
        else if (item.key == 'gender') {
          if (this.userInfoCP[key] == '1') {
            return '男'
          }else if(this.userInfoCP[key] == '2') {
            return '女'
          }
        }
        else {
          return this.userInfoCP[key];
        }
        return '';
      },

      jumpUrl: function (item, index) {
        if (item.disabled) {
          return;
        }
        this.selectIndex = index;
        if (item.id == '0') { // 头像
          Photo.open({
            linkFunc: this.linkFunc,
            token: this.$store.state.login.token,
          });
        } else if (item.id == '1') {
          this.$refs.updateMark.showMarkFun(item, '修改姓名', '请输入姓名');
        } else if (item.id == '2') {

        } else if (item.id == '3') {
          this.$refs.updateMark.showMarkFun(item, '修改邮箱', '请输入邮箱');
        } else if (item.id == '4') {
          if (this.userInfoCP.birthday != '' && this.$store.state.globalConfig.can_not_modify_birthday == '1') {
            this.$Toast('不支持生日修改！')
            return ;
          }
          this.$refs.picker.open();
        } else if (item.id == '5') {
          this.$router.push({
            path: '/aqgl'
          })
        } else if (item.id == '6') {

        } else if (item.id == '7') {

        } else if (item.id == '8') {
          // this.$MessageBox.confirm('修改手机号会将系统中绑定的加油卡</br>和微信自动解绑，是否继续？', '提示',{confirmButtonText:'确定'}).then(action => {
          //   this.$router.push({
          //     path: '/usercenter/choseway'
          //   })
          // }).catch(action => {
          // });
          this.$router.push({
            path: '/usercenter/choseway'
          })
        }
        //性别
        else if (item.id == '9') {
          this.sexShow = true;
        }
      },

      changetime: function (bData) {
        let bYear = bData.getFullYear();
        let bMonth = bData.getMonth() + 1;
        let bDay = bData.getDate();
        let birthday = `${bYear}-${this.bl(bMonth)}-${this.bl(bDay)}`;//模板字符串取值 拼接赋值
        this.userInfoCP['birthday'] = birthday;
        this.$refs.updateMark.closeMark();
        if (this.checkModify()) {
          this.showRightBtn = true
        }
      },
      bl: function (data) {
        data < 10 ? data = `0` + data : data //判断月份<10自动前面补0
        return data
      },
      submitData: function (endBack) {
        this.$Loading.open();
        let url = '/app/json/user/modifyUserInfo';
        let paramsData = {
          token: this.$store.state.login.token,
        }
        // this.userInfoCP.headImg != this.userInfo.headImg || this.userInfoCP.nickName != this.userInfo.nickName || this.userInfoCP.email != this.userInfo.email || this.userInfoCP.birthday != this.userInfo.birthday
        paramsData.avtUrl = this.userInfoCP.headImg;
        paramsData.nickName = this.userInfoCP.nickName;
        paramsData.email = this.userInfoCP.email;
        paramsData.birthday = this.userInfoCP.birthday;
        paramsData.gender = this.userInfoCP.gender;
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.userInfo = this.userInfoCP;
              this.$bridgefunc.vuexStorage();
              this.$Toast('修改成功');
              if (endBack) {
                this.$router.go(-1);
              }
            } else {
              this.$Toast(data.info ? data.info : '修改失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      },
      linkFunc: function (picUrl, img1) {
        this.$set(this.userInfoCP,'headImg',picUrl)
        if (this.checkModify()) {
          this.showRightBtn = true
        }
        // this.userInfoCP.headImg = picUrl;
        // this.modifyHeadImg(picUrl);
      },

      modifyHeadImg: function (picUrl) {
        this.$Loading.open();
        let url = '/app/json/user/modifyHeadImg';
        let paramsData = {
          token: this.$store.state.login.token,
          headImg: picUrl
        }

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let item = this.settingList[this.selectIndex];
              this.$store.state.userInfo[item.key] = picUrl;
              this.$bridgefunc.vuexStorage();
              this.$Toast('修改头像成功');
            } else {
              this.$Toast(data.info ? data.info : '修改失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      },

      getMyInfo: function () {
        this.$Loading.open();
        let url = '/app/json/user/getUserInfo';
        this.$http.post(url, {}).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.userInfo = data.data;
              this.currentDate = new Date(data.data.birthday);
              this.$bridgefunc.vuexStorage();
            } else {
              this.$Toast(data.info ? data.info : '获取个人信息失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      }
    },
    created() {
      console.log('this.userInfo',this.userInfo);
      this.userInfoCP = JSON.parse(JSON.stringify(this.userInfo));
      this.getMyInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .user-info {
    width 100%
    height 100%
    overflow hidden;

    .center {
      .setting-list {
        margin: 10px;

        .setting-item {
          .right-text {
            flex 1
            display flex
            justify-content flex-end
            align-items center
            height: 30px;
            margin-right: 29px;

            .right-title {
              font-size $font-size-small
            }

            img {
              display: block;
              width: 30px;
              height: 30px;
              border-radius 15px
            }
          }
        }
      }
    }
  }

  .info-cellpad {
    padding 10px
  }
</style>
<style lang="stylus" type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"
  .van-picker__cancel, .van-picker__confirm{
    color #f02c2d !important
  }
</style>

