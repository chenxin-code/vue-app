<template>
  <div class="user-info">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list">
          <div class="row line_bottom" @click="changeAvtUrl">
            <div class="label">头像</div>
            <div class="pic">
              <img :src="getHeadImg()" />
            </div>
            <img
              class="zm-jiantou-12"
              v-if="!userInfo.passportNum"
              src="static/image/setting/jt.png"
            />
          </div>
          <div class="row line_bottom">
            <div class="label">真实姓名</div>
            <div class="value">{{userInfo.realName?userInfo.realName:''}}</div>
          </div>
          <div class="row line_bottom">
            <div class="label">性别</div>
            <div v-if="userInfo.sex == '2'" class="value">女</div>
            <div v-if="userInfo.sex == '1'" class="value">男</div>
            <div v-else class="value"></div>
          </div>

          <div class="row line_bottom">
            <div class="label">出生日期</div>
            <div class="value">{{userInfo.birthday?userInfo.birthday:''}}</div>
          </div>
          <div class="row line_bottom">
            <div class="label">手机号</div>
            <div class="value">{{$util.dealPhone(userInfo.phone)}}</div>
            <!-- <img class="zm-jiantou-12" src="static/image/setting/jt.png" /> -->
          </div>
          <div class="row line_bottom" @click="enterPassport(0)">
            <div class="label">身份证号</div>
            <div class="value single-line">{{userInfo.idCardNumEncode?userInfo.idCardNumEncode:''}}</div>
            <img
              class="zm-jiantou-12"
              v-if="!userInfo.idCardNumEncode"
              src="static/image/setting/jt.png"
            />
          </div>
          <div class="row icon-more" @click="enterPassport(1)">
            <div class="label">护照号</div>
            <div
              class="value single-line"
            >{{userInfo.passportNumEncode?userInfo.passportNumEncode:''}}</div>
            <img class="zm-jiantou-12" src="static/image/setting/jt.png" />
          </div>
        </div>
        <div class="chum-public-btn unbind-btn">
          <van-button
            round
            block
            type="info"
            color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
            @click="unbindHandler"
          >解除微信绑定</van-button>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Photo from '@/components/commonui/choosephoto'
import { Dialog } from 'vant'

export default {
  name: 'user-info',
  components: {},
  computed: {
    ...mapGetters(['userInfo']),
  },
  data() {
    return {}
  },
  methods: {
    modifyPhone() {
      this.$router.push({
        path: '/usercenter/modifyphone',
        query: {},
      })
    },
    getUserInfo: function () {
      let url = '/app/json/user/getUserInfo'
      let params = {}
      this.$http.post(url, params).then(
        (res) => {
          let data = res.data
          if (data.status == 0) {
            this.$store.state.userInfo = data.data
          }
        },
        (error) => {
          // debugger
        }
      )
    },
    changeAvtUrl: function () {
      Photo.open({
        linkFunc: (picUrl) => {
          this.submitRevise(picUrl)
        },
        token: '',
      })
    },
    updateImg(image) {
      this.$Loading.open()
      let url = '/uploadFile'
      let params = {
        base64File: image,
        fileType: 'jpg',
        fileName: 'header_' + this.userInfo.phone,
      }
      this.$http.post(url, params).then(
        (res) => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.submitRevise(data.data)
          } else {
            this.$Toast(data.info)
          }
        },
        (error) => {
          this.$Loading.close()
          this.$Toast('上传图片失败')
        }
      )
    },
    submitRevise(headUrl) {
      this.$Loading.open('保存中')
      let url = '/app/json/user/modifyHeadImg'
      let params = {
        headImg: headUrl,
      }
      this.$http.post(url, params).then(
        (res) => {
          this.$Loading.close()
          let data = res.data
          console.log('修改头像', data)
          // debugger
          if (data.status == 0) {
            this.$Toast({
              message: data.info ? data.info : '修改头像成功',
              position: 'bottom',
              duration: 2000,
            })
            this.$store.state.userInfo.avtUrl = headUrl
            this.$bridgefunc.vuexStorage()
          } else {
            this.$Toast({
              message: data.info ? data.info : '修改头像失败',
              position: 'bottom',
              duration: 2000,
            })
          }
        },
        (error) => {
          // debugger
          this.$Loading.close()
          this.$Toast({
            message: '保存失败',
            position: 'bottom',
            duration: 2000,
          })
        }
      )
    },
    getHeadImg: function () {
      if (this.userInfo.avtUrl && this.userInfo.avtUrl.length) {
        return this.userInfo.avtUrl
      } else {
        if (this.userInfo.gender == '2') {
          return 'static/image/setting/setting-img.png'
        } else {
          return 'static/image/setting/setting-img-man.png'
        }
      }
    },
    enterPassport(type) {
      if (type == 0) {
        if (this.userInfo.idCardNumEncode) {
          return
        }
        this.$router.push({
          path: '/usercenter/idcardInfoedit',
          query: {
            type: type,
          },
        })
      } else {
        // debugger
        if (
          !this.userInfo.passportNumEncode ||
          this.userInfo.passportNumEncode == ''
        ) {
          this.$router.push({
            path: '/usercenter/passportedit',
            query: {
              type: type,
              idData: '',
            },
          })
        } else {
          this.$router.push({
            path: '/usercenter/iddetail',
            query: {
              type: type,
              idData: '',
            },
          })
        }
      }
    },
    // 解除微信绑定
    unbindHandler() {
      Dialog.confirm({
        title: '提示',
        message: '解除绑定后会登出小程序是否继续？',
        confirmButtonColor: '#E0C28A',
      }).then(() => {
        this.$Loading.open()
        let url = '/app/json/user/unBindThirdUser'
        let paramsData = {
          token: this.$store.state.login.token
        }
        paramsData.regChannel = 6
        this.$http.post(url, paramsData).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.$userCenter.loginOut()
          } else {
            this.$Toast(data.info ? data.info : '登录失败')
          }
        },
        err => {
          this.$Loading.close()
          this.$Toast("系统运行过程中遇到问题，请稍候再试")
        })
      }).catch(() => {
        // on cancel
      })
    },
  },
  created() {
    this.getUserInfo()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/deploy/chum/assets/stylus/chum-public.styl';

.user-info {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    background-color: #f6f6f6;

    .list {
      overflow-y: auto;
      padding: 0px 10px;
      margin: 20px;
      background-color: white;
      border-radius: 5px;

      .row {
        display: flex;
        align-items: center;
        padding: 17px 1px;

        .pic {
          padding: 0 5px;

          img {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            overflow: hidden;
          }
        }

        .label {
          font-size: 16px;
          flex: 1;
          // font-weight 600;
        }

        .value {
          font-size: 16px;
          padding: 1px 5px;
          max-width: 200px;
        }

        .zm-jiantou-12 {
          width: 8px;
          height: 14.5px;
        }

        .icon-more {
          font-size: 14px;
          color: #101010;
        }
      }
    }
  }

  .unbind-btn {
    position: fixed;
    left: 15px;
    right: 15px;
    bottom: 10px;
  }
}
</style>
