<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)" :navTopStyle="{'background-color': '#6aabfe'}" :noBack="true" title="海油卡"></nav-top>
    <nav-content>
      <div class="info-container">
        <div class="container">
          <p class="title">
            <img src="../../assets/images/cnooc-card-icon.png" />海油卡
          </p>
          <ul class="info-list">
            <li class="item">
              <p>
                会员手机号：
                <span>{{ userInfo.phone }}</span>
              </p>
            </li>
            <li class="item">
              <p v-if="userInfo.userType == '1'">
                海油卡客户类型：
                <span>个人客户</span>
              </p>
              <p v-else-if="userInfo.userType == '2'">
                海油卡客户类型：
                <span>机构客户</span>
              </p>
              <p v-else>
                海油卡客户类型：
                <span>无</span>
              </p>
            </li>
            <li class="item">
              <p>
                绑定海油卡客户号：
                <span>{{ userInfo.customerNo || '无' }}</span>
              </p>
            </li>
            <li class="item" v-if="userInfo.cardNo">
              <p>
                绑定海油卡卡号：
                <span>{{ userInfo.cardNo || '无' }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <ul class="btn-container clearfix">
        <li class="btn-item" v-for="(item, index) in btnList" :key="index" @click="btnClick(item)">
          <img class="icon" :src="item.icon" alt />
          <p class="text">{{ item.text }}</p>
        </li>
      </ul>
      <van-popup v-model="isShowTip">
        <p class="tips-text">{{ tipsText }}</p>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
import cnoocUtil from '@/deploy/cnooc/utils'
import { Dialog, Popup, Icon, Toast } from 'vant'
export default {
  components: {
    VanPopup: Popup,
    VanIcon: Icon,
  },
  data() {
    return {
      phone: '',
      wmnpOpenId: '',
      toBackPage: '',
      showflag: false,
      isShowTip: false,
      userInfo: {},
      btnList: [],
      tipsText: '',
    }
  },
  methods: {
    // 获取用户信息
    getLoginInfo() {
      this.$http.post('/app/json/login_ext/loadUserInitInfo', {})
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            this.userInfo = data.data
            switch (data.data.pageStatus) {
              case '0':
                this.btnList = [
                  {
                    icon: require('../../assets/images/service-5.png'),
                    text: '开通虚拟海油卡',
                    tips:
                      '您可以在线开通虚拟卡账户，在虚拟卡账户下，最多办理三张虚拟海油储值卡。',
                    linkUrl: '/openaccountonly',
                  },
                  {
                    icon: require('../../assets/images/service-6.png'),
                    text: '绑定已有海油卡',
                    linkUrl: '/client-num-bind',
                  },
                ]
                break
              case '1':
                this.btnList = [
                  {
                    icon: require('../../assets/images/service-7.png'),
                    text: '办理虚拟卡',
                    linkUrl: '/doopencard',
                    tips: '一个海油卡客户号下最多可办理3张虚拟卡',
                  },
                  {
                    icon: require('../../assets/images/service-3.png'),
                    text: '查询服务',
                    jumpType: 2,
                  },
                  {
                    icon: require('../../assets/images/service-4.png'),
                    text: '充值服务',
                    jumpType: 3,
                  },
                  {
                    icon: require('../../assets/images/service-2.png'),
                    text: '我的卡片',
                    tips:
                      '前往“我的卡片”，可解除会员与当前卡客户号的绑定关系，解除后可绑定其他海油卡',
                    jumpType: 1,
                  },
                ]
                break
              case '2':
                this.btnList = [
                  {
                    icon: require('../../assets/images/service-3.png'),
                    text: '查询服务',
                    jumpType: 2,
                  },
                  {
                    icon: require('../../assets/images/service-4.png'),
                    text: '充值服务',
                    jumpType: 3,
                  },
                  {
                    icon: require('../../assets/images/service-2.png'),
                    text: '我的卡片',
                    tips:
                      '前往“我的卡片”，可解除会员与当前卡客户号的绑定关系，解除后可绑定其他海油卡',
                    jumpType: 1,
                  },
                ]
                break
              case '3':
                this.btnList = [
                  {
                    icon: require('../../assets/images/service-3.png'),
                    text: '查询服务',
                    jumpType: 2,
                  },
                  {
                    icon: require('../../assets/images/service-4.png'),
                    text: '充值服务',
                    jumpType: 3,
                  },
                  {
                    icon: require('../../assets/images/service-2.png'),
                    text: '我的卡片',
                    tips:
                      '前往“我的卡片”，可解除会员与当前卡客户号的绑定关系，解除后可绑定其他海油卡',
                    jumpType: 1,
                  },
                  {
                    icon: require('../../assets/images/service-9.png'),
                    text: '机构服务',
                    linkUrl: '/organizationmanage',
                  },
                ]
                break
            }
          } else {
            this.$Toast(data.info)
          }
        })
        .catch((err) => {
          this.$Toast(err)
        })
    },
    // 功能区按钮点击
    btnClick(item) {
      if (item.linkUrl) {
        // this.$router.push({
        //   path: item.linkUrl,
        // })
        this.$bridgefunc.customPush({
          path: window.location.origin + '/site/app/#' + item.linkUrl,
          isnativetop: '0',
        })
      } else if (item.jumpType) {
        cnoocUtil.jumpCardSysPage(item.jumpType)
      }
    },
  },
  mounted() {
    this.getLoginInfo()
  },
  computed: {},
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';

.info-container {
  background: linear-gradient(#6aabfe, #247ae7);
  overflow: hidden;

  .container {
    margin: 0 10px 20px;

    .title {
      display: flex;
      justify-content: left;
      align-items: center;
      font-size: 20px;
      color: #fff;
      font-weight: 700;

      img {
        display: block;
        width: 18px;
        margin: 0 10px;
      }
    }

    .info-list {
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      margin-top: 10px;
      font-size: 14px;
      color: $color-theme;

      .item {
        padding: 8px 0;
        position: relative;

        p {
          display: flex;
          justify-content: space-between;

          span {
            color: #000;
          }
        }

        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          pointer-events: none;
          box-sizing: border-box;
          border: 0 dashed #e5e5e5;
          border-bottom-width: 1px;
        }
      }
    }
  }
}

.btn-container {
  padding: 0 15px;
  margin-top: 20px;

  .btn-item {
    float: left;
    width: 25%;
    position: relative;
    margin-bottom: 10px;

    img {
      display: block;
      width: 50%;
      margin: 0 auto;
    }

    .text {
      font-size: 14px;
      text-align: center;
      line-height: 17px;
      padding: 0 3px;
    }

    .tips {
      font-size: 18px;
      color: #1867a1;
      font-style: normal;
      position: absolute;
      right: 4px;
      top: 0;
    }
  }
}

.tips-text {
  font-size: 16px;
  padding: 15px;
  line-height: 20px;
}
</style>
