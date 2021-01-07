<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <!-- 顶部用户类型切换 -->
      <div class="user-type-info">
        <div class="left">切换至<span class="red" @click="changeAccountType">{{ accountType == 1 ? '单位用户' : '个人用户' }}</span></div>
        <van-icon name="setting-o" class="setting" @click="toSetting"/>
      </div>
      <!-- 个人账户 -->
      <div class="personal-account" v-if="accountType == 1">
        <!-- 会员等级信息卡 -->
        <div class="card-info" :class="[{'ordinary-member': memberLevel == 1}, {'gold-member': memberLevel == 2}]">
          <div class="user-info">
            <div class="avatar">
              <img :src="membershipLevel.avtUrl" alt="" v-if="membershipLevel.avtUrl">
              <img src="../image/youdi.png" alt="" v-else>
            </div>
            <div class="right-info">
              <p class="name">{{ membershipLevel.userName }}</p>
              <p class="sub-title" v-if="!membershipLevel.levelNo" @click="openOilUniversal">
                <img src="../image/icon-tips-1.png" class="sub-icon" v-if="memberLevel == 1"/>
                <img src="../image/icon-tips-2.png" class="sub-icon" v-else-if="memberLevel == 2"/>
                点击立即开通
              </p>
              <p class="sub-title" v-else>{{ membershipLevel.levelNoName }}</p>
            </div>
          </div>
          <div class="tip-c" v-if="memberLevel == 0" @click="openOilUniversal">
            <p class="nonactivated-tip">开通油滴会员，享受超值权益。</p>
          </div>
          <div class="tip-c" v-else-if="memberLevel == 1">
            <p class="nonactivated-tip">加入金油滴会员，享受超值权益。</p>
          </div>
          <div class="downgrade-reminder" v-if="membershipLevel.isUnRefuel == 1 && memberLevel == 2">
            <div class="progress">
              <span class="scale"></span>
              <span class="scale"></span>
              <div class="progress-portion" :style="{width: `${progressNum}%`}"></div>
            </div>
            <ul class="progress-desc">
              <li class="item">第3个月</li>
              <li class="item">第2个月</li>
              <li class="item">第1个月</li>
            </ul>
            <p class="level-tips">会员有效期仅剩{{ membershipLevel.surplusCount }}个月了！请尽快加油，保障会员权益。</p>
          </div>
          <div class="rule-description" @click="toMemberDesc" v-if="memberLevel == 1">金油滴会员晋级规则<van-icon name="arrow" /></div>
          <div class="rule-description gold" v-else-if="memberLevel == 2">
            <div class="left">
              <span v-if="membershipLevel.isUnRefuel == 1">有效期至{{ membershipLevel.invalidTime }}</span>
            </div>
            <div class="right" @click="toMemberDesc">金油滴会员晋级规则<van-icon name="arrow" /></div>
          </div>
        </div>
        <!-- 油滴信息 -->
        <div class="oil-drop-info">
          <div class="left" @click="openOilUniversal">
            <p class="name">油滴通用</p>
            <div class="content not-yet-opened" v-if="actionInfo.state != 1">暂未开通</div>
            <div class="content universal-num" v-else>{{ actionInfo.balance || 0 }}</div>
          </div>
          <div class="center" @click="openOilDedicated">
            <p class="name">油滴专用</p>
            <div class="content oil-num">{{ numberOfCoupon }}</div>
          </div>
          <div class="right" @click="consumerCodeClick">
            <p class="name">油滴消费码</p>
            <div class="content">
              <img src="../image/qr-code.png" alt="" class="content consumer-code" v-if="actionInfo.state != 1">
              <img src="../image/qr-code-act.png" alt="" class="content consumer-code" v-else>
            </div>
          </div>
        </div>
        <!-- 常用功能 -->
        <div class="common-functions">
          <p class="title">常用功能</p>
          <ul class="functions-container">
            <li class="item" @click="btmAccountClick(1)">
              <div class="top-c">
                <img src="../image/icon-func-1.png" alt="">
              </div>
              <p class="name">我的账单</p>
            </li>
            <li class="item" @click="btmAccountClick(2)">
              <div class="top-c">
                <img src="../image/icon-func-2.png" alt="">
              </div>
              <p class="name">我的套餐</p>
            </li>
            <li class="item" @click="btmAccountClick(3)">
              <div class="top-c">
                <img src="../image/icon-func-3.png" alt="">
              </div>
              <p class="name">油滴大使</p>
            </li>
            <li class="item" @click="btmAccountClick(4)">
              <div class="top-c">
                <img src="../image/icon-func-4.png" alt="">
              </div>
              <p class="name">卡车冀家</p>
            </li>
          </ul>
        </div>
        <!-- 会员权益 -->
        <div class="list-benefits">
          <p class="title">会员权益</p>
          <ul class="benefits-container">
            <li class="item">
              <div class="top-c">
                <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1236597855,1164991965&fm=11&gp=0.jpg" alt="">
              </div>
              <p class="name">神秘礼物</p>
            </li>
            <li class="item">
              <div class="top-c">
                <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1236597855,1164991965&fm=11&gp=0.jpg" alt="">
              </div>
              <p class="name">超值兑换</p>
            </li>
            <li class="item">
              <div class="top-c">
                <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1236597855,1164991965&fm=11&gp=0.jpg" alt="">
              </div>
              <p class="name">VIP服务</p>
            </li>
            <li class="item">
              <div class="top-c">
                <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1236597855,1164991965&fm=11&gp=0.jpg" alt="">
              </div>
              <p class="name">会员回馈</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 单位账户 -->
      <div class="unit-account" v-else>
        <div class="already-open" v-if="actionInfo.state == 1">
          <ul class="index-info table-view">
            <li class="reward-consumption">
              <div class="reward bdr-r" @click="openOilDropIndex">
                <p class="text">油滴</p>
                <div v-if="actionInfo.state == 1">
                  <p class="no-open" v-show="!noSee">{{ actionInfo.balance || 0 }}</p>
                </div>
                <p class="no-open" v-else-if="actionInfo.state == 4">已锁定</p>
                <p class="no-open" v-else-if="actionInfo.state == 2">已冻结</p>
                <p class="no-open" v-else>未开通</p>
              </div>
            </li>
          </ul>
          <ul class="table-view userInfo">
            <li class="table-view-cell tie-on-card">
              <div class="my-account">
                <p class="text">
                  <img class="my-count-img" src="../image/my-count.png" alt="">
                  <span>我的账户</span>
                </p>
              </div>
            </li>
            <li class="table-view-cell oil-point-open">
              <div class="oil-list">
                <div class="table-view-cell-text" @click="subCard">
                  <span class="text">副卡明细</span>
                  <div class="msg-img">
                  </div>
                </div>
                <div class="table-view-cell-arrow icon"></div>
              </div>
            </li>
            <li class="table-view-cell oil-point-open">
              <div class="oil-list">
                <div class="table-view-cell-text" @click="carBingInfo">
                  <span class="text">车牌绑定明细</span>
                  <div class="msg-img">
                  </div>
                </div>
                <div class="table-view-cell-arrow icon"></div>
              </div>
            </li>
            <li class="table-view-cell oil-point-open">
              <div class="oil-list">
                <div class="table-view-cell-text" @click="openPayManagement">
                  <span class="text">油滴支付管理</span>
                  <div class="msg-img">
                  </div>
                </div>
                <div class="table-view-cell-arrow icon"></div>
              </div>
            </li>
            <li class="table-view-cell oil-point-open" v-for="(item, index) in gameList" :key="index">
              <div class="oil-list">
                <div class="table-view-cell-text" @click="goToGame(item.dictKey)">
                  <span class="text">{{ item.dictValue }}</span>
                  <div class="msg-img">
                  </div>
                </div>
                <div class="table-view-cell-arrow icon"></div>
              </div>
            </li>
          </ul>
        </div>
        <ul class="open-instruction table-view" v-else>
          <li class="table-view-cell">
            <p class="text">开通说明</p>
          </li>
          <li class="table-view-cell info">
            <p class="one">1.营业执照复印件(单位盖章)</p>
            <p class="one">2.单位介绍信</p>
            <p class="one">3.持卡人身份证</p>
            <p class="one">注: 带上以上信息到加油站进行资质初审</p>
          </li>
        </ul>
      </div>
    </nav-content>
    <van-popup v-model="isShowOilSelection" class="reset-oil-selection">
      <p class="title">请选择常用油品</p>
      <p class="sub-title">以便为你提供更好的服务</p>
      <ul class="switch-container">
        <li
          class="item"
          :class="{active: activeIndex == index}"
          v-for="(item, index) in switchList"
          :key="index"
          @click="changeOilSelect(item, index)">{{ item.text }}</li>
      </ul>
      <p class="tip">选择完成，享受丰富权益</p>
      <div class="btn" @click="confirmOilSelect">确定</div>
    </van-popup>
  </div>
</template>
<script>
import Cookie from 'js-cookie'
import { Dialog, Popup } from 'vant';

export default {
  data() {
    return {
      // 会员等级 0 未开通油滴 1 普级 2 金级
      memberLevel: 2,
      // 账户类型 1 个人 2 单位
      accountType: 1,
      noSee: false,
      // 账户信息
      actionInfo: {
        pwdCode: 0, // 密码是否设置
        isSecretFree: 0, // 是否设置免密
        secretFreeAmount: 0, // 免密额度
        state: 0, // 开通状态 0未开通 1开通 2冻结 4锁定
        balance: 0, // 通用油滴余额
      },
      gameList: [],
      membershipLevel: {
        count: 0,
        invalidTime: '',
        isUnRefuel: 0,
        remark: '',
      },
      progressNum: 0,
      remainingTime: 0,
      isShowOilSelection: false,
      switchList: [
        {
          text: '汽油'
        },
        {
          text: '柴油'
        },
      ],
      activeIndex: 0,
      numberOfCoupon: 0,
    }
  },
  created() {
    if (Cookie.get('appUserType') == 2) {
      this.accountType = Cookie.get('appUserType')
    } else {
      this.accountType = 1
    }
    // 获取用户信息
    this.getInfoActions()

    this.getGameList()

    // 获取会员等级
    this.getUserLevel()
    // 获取用户是否设置油品类型
    this.getOilChoice()

    // 获取券信息
    this.initUserWallet()
  },
  mounted() {

  },
  methods: {
    // 获取券信息
    initUserWallet() {
      this.$Loading.open()
      this.$http.post('/app/json/user/getUserWallet', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data && data.data.couponNum) {
            this.numberOfCoupon = data.data.couponNum
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getUserWallet err ${err}`)
      })
    },
    // 获取会员等级
    getUserLevel() {
      this.$Loading.open()
      this.$http.post('/app/json/user/userLevelInfo', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.membershipLevel = data.data || {}
          if (data.data.levelNo == '1') {
            this.memberLevel = 1
          } else if (data.data.levelNo == '2') {
            this.memberLevel = 2
          } else {
            this.memberLevel = 0
          }

          this.remainingTime = 3 - Number(data.data.count)
          if (data.data.count == 1 || data.data.count == 0) {
            this.progressNum = 66.66
          } else if (data.data.count == 2) {
            this.progressNum = 33.33
          } else {
            this.progressNum = 0
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`userLevelInfo err ${err}`)
      })
    },
    // 获取用户是否设置油品类型
    getOilChoice() {
      this.$Loading.open()
      this.$http.post('/app/json/user/userOilChoice', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (!data.data) {
            setTimeout(() => {
              this.isShowOilSelection = true
            }, 500)
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`userOilChoice err ${err}`)
      })
    },
    confirmOilSelect() {
      this.$Loading.open()
      this.$http.post('/app/json/user/updateUserOilChoice', {
        type: this.activeIndex === 0 ? 1 : 2
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.$Toast('选择成功！')
          this.isShowOilSelection = false
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`userOilChoice err ${err}`)
      })
    },
    changeOilSelect(item, index) {
      this.activeIndex = index
    },
    // 去会员规则
    toMemberDesc() {
      this.$router.push('/member-desc')
    },
    // 获取游戏列表
    getGameList() {
      this.$Loading.open()
      this.$http.post('/app/json/app_dict/getDictByAlias', {alias: 'gameTypeList'}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.gameList = data.data || []
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getDictByAlias err ${err}`)
      })
    },
    // 获取账户信息
    getInfoActions() {
      this.$Loading.open()
      this.$http.post('/app/json/app_youdi/getAcctInfoList', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data && data.data[0]) {
            this.actionInfo = data.data[0]
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getAcctInfoList err ${err}`)
      })
    },
    // 更改账户类型
    changeAccountType() {
      if (this.accountType == 1) {
        this.accountType = 2
        Cookie.set('appUserType', 2)
      } else {
        this.accountType = 1
        Cookie.set('appUserType', 1)
      }
    },
    // 去设置页面
    toSetting() {
      this.$router.push({
        path: '/usercenter/aqgl',
        query: {
          actionInfo: this.actionInfo
        }
      })
    },
    // 打开油滴首页
    openOilDropIndex() {
      if (this.actionInfo.state == 2) {
        Dialog.alert({
          title: '提示',
          message: '您的账户已冻结，请联系客服进行处理！'
        })
      } else {
        let entryUrl = `${window.location.origin}/app-vue/oildrop/oildropindex`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      }
    },
    // 打开副卡查询页面
    subCard() {
      let entryUrl = `${window.location.origin}/app-vue/oildrop/subcard`
      this.$market.enterNav({
        link: {
          type: '3',
          url: entryUrl,
          useOldProtocal: true
        }
      })
    },
    // 打开车辆绑定明细页面
    carBingInfo() {
      let entryUrl = `${window.location.origin}/app-vue/oildrop/carbindinfo`
      this.$market.enterNav({
        link: {
          type: '3',
          url: entryUrl,
          useOldProtocal: true
        }
      })
    },
    // 打开支付管理页面
    openPayManagement() {
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
        let entryUrl = `${window.location.origin}/app-vue/oildrop/paymanagement`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      }
    },
    // 游戏点击
    goToGame(code) {
      let entryUrl = `${window.location.origin}/app-vue/game/?gameTypeCode=${code}&token=${this.$store.state.login.token}&appUserType=2`
      this.$market.enterNav({
        link: {
          type: '3',
          url: entryUrl,
          useOldProtocal: true
        }
      })
    },
    // 常用功能点击
    btmAccountClick(type) {
      if (type == 1) {
        this.$router.push('/agreement')
      } else if (type == 2) {
        this.$router.push('/oil-package')
      } else if (type == 3) {
        this.openOilPartner()
      } else if (type == 4) {
        if (this.actionInfo.state == 2) {
          Dialog.alert({
            title: '提示',
            message: '您的账户已冻结，请联系客服进行处理！'
          })
        } else if (this.actionInfo.state == 4) {
          Dialog.alert({
            title: '提示',
            message: '您的账户已锁定！'
          })
        } else if (this.actionInfo.state == 0) {
          Dialog.alert({
            title: '提示',
            message: '请先开通油滴会员！'
          })
        } else {
          let entryUrl = `${window.location.origin}/app-vue/app/index.html#/common?pgCode=${window.location.origin.indexOf('test') > -1 ? '1598861443177397113' : '1598861624824184325'}`
          this.$market.enterNav({
            link: {
              type: '3',
              renderNav: false,
              url: entryUrl,
              useOldProtocal: true
            }
          })
        }
      }
    },
    // 打开油滴合伙人 state 0未开通， 1开通， 2冻结， 4锁定
    openOilPartner() {
      if (this.actionInfo.state == 2) {
        Dialog.alert({
          title: '提示',
          message: '您的账户已冻结，请联系客服进行处理！'
        })
      } else if (this.actionInfo.state == 4) {
        Dialog.alert({
          title: '提示',
          message: '您的账户已锁定！'
        })
      } else { // 0未开通， 1开通(页面里面去判断)
        let entryUrl = `${window.location.origin}/app-vue/oildrop/no-join-oil-partner`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      }
    },
    // 通用油滴点击
    openOilUniversal() {
      if (this.actionInfo.state == 2) {
        Dialog.alert({
          title: '提示',
          message: '您的账户已冻结，请联系客服进行处理！'
        })
      } else if (this.actionInfo.state == 0) {
        Dialog.confirm({
          title: '提示',
          message: '您是否要完成账户实名认证？'
        }).then(() => {
          Cookie.set('indexSource', 1) // 如果是从首页直接到开通页面 微信是返回1 如果是从设置set页面进去 微信是返回2
          let entryUrl = `${window.location.origin}/app-vue/oildrop/openinginstructions`
          this.$market.enterNav({
            link: {
              type: '3',
              url: entryUrl,
              useOldProtocal: true
            }
          })
        }).catch((error) => {
        })
      } else {
        let entryUrl = `${window.location.origin}/app-vue/oildrop/oildropindex`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      }
    },
    // 专用油滴点击
    openOilDedicated() {
      let entryUrl = `${window.location.origin}/app-vue/oildrop/oil-special`
      this.$market.enterNav({
        link: {
          type: '3',
          url: entryUrl,
          useOldProtocal: true
        }
      })
    },
    // 油滴消费码点击
    consumerCodeClick() {
      if (this.actionInfo.state == 2) {
        Dialog.alert({
          title: '提示',
          message: '您的账户已冻结，请联系客服进行处理！'
        })
      } else if (this.actionInfo.state == 4) {
        Dialog.alert({
          title: '提示',
          message: '您的账户已锁定！'
        })
      } else { // 0未开通， 1开通(页面里面去判断)
        let entryUrl = `${window.location.origin}/app-vue/oildrop/qrpayment`
        this.$market.enterNav({
          link: {
            type: '3',
            url: entryUrl,
            useOldProtocal: true
          }
        })
      }
    },
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.reset-oil-selection {
  width: 250px;
  height 306px;
  border-radius 10px;
  text-align center;
  background url('../image/chose-oil-type-bg.png') no-repeat left top;
  background-size 100% auto;
  background-color #fff;
  .title {
    font-size 18px;
    font-weight 500;
    color #3871D3;
    padding-top 118px;
  }
  .sub-title {
    font-size 14px;
    color #333;
    padding-top 6px;
  }
  .switch-container {
    display flex;
    border-radius 6px;
    background-color #F2F2F2;
    width: 175px;
    height: 32px;
    margin 15px auto 0;
    line-height 32px;
    .item {
      flex 1;
      font-size 13px;
      font-weight 500;
      padding 0 14px;
      background-repeat no-repeat;
      background-size 0;
      &:first-child {
        text-align left;
        background-image url('../image/btn-left.png');
      }
      &:last-child {
        text-align right;
        background-image url('../image/btn-right.png');
      }
      &.active {
        background-size 100% 100%;
        color #fff;
      }
    }
  }
  .tip {
    font-size 12px;
    color #333;
    padding 12px 0;
  }
  .btn {
    width: 162px;
    height: 38px;
    background: #0091FF;
    border-radius: 4px;
    margin 0 auto;
    line-height 38px;
    text-align center;
    font-size 15px;
    color #fff;
    margin-top 10px;
  }
}
.container {
  .nav-content {
    background-color #F7F7F7;
    padding 0 10px;
    overflow-y auto;
  }
}
.user-type-info {
  font-size 14px;
  color #333;
  line-height 21px;
  padding 10px 0;
  display flex;
  justify-content space-between;
  align-items center;
  .red {
    color #E8191E;
  }
  .setting {
    font-size 20px;
  }
}
.card-info {
  width 100%;
  height 170px;
  border-radius 5px;
  color #333;
  padding 15px;
  background-image url('../image/user-level-1.png')
  background-repeat no-repeat;
  background-position center;
  background-size 100% 100%;
  position relative;
  overflow hidden;
  &.ordinary-member {
    background-image url('../image/user-level-2.png')
  }
  &.gold-member {
    background-image url('../image/user-level-3.png')
  }
  .user-info {
    display flex;
    .avatar {
      width 50px;
      height 50px;
      border-radius 50%;
      overflow hidden;
      background-color #fff;
      img {
        display block;
        width 100%;
        height 100%;
      }
    }
    .right-info {
      padding 5px 0 5px 10px;
      display flex;
      flex-direction column;
      justify-content space-between;
      .name {
        font-size 17px;
        font-weight 500;
      }
      .sub-title {
        font-size 14px;
        .sub-icon {
          display inline-block;
          width 18px;
          vertical-align middle;
          margin-right 5px;
        }
      }
    }
  }
  .tip-c {
    text-align center;
    .nonactivated-tip {
      font-size 14px;
      line-height 1;
      border .5px solid #fff;
      padding 5px 10px;
      border-radius 13px;
      display inline-block;
      margin 20px auto 0;
    }
  }
  .downgrade-reminder {
    margin-top 10px;
    .progress {
      width 100%;
      height 3px;
      border-radius 2px;
      background: rgba(255, 255, 255, 0.3);
      position relative;
      .scale {
        width 2px;
        height 100%;
        display block;
        position absolute;
        top 0;
        left 66.66%;
        background-color rgba(255, 255, 255, 0.6);
        &:first-child {
          left 33.33%;
        }
      }
      .progress-portion {
        height 100%;
        background-color #BF8F31;
      }
    }
    .progress-desc {
      display flex;
      text-align center;
      color #fff;
      margin-top 4px;
      font-size 9px;
      line-height 14px;
      .item {
        flex 1
      }
    }
    .level-tips {
      width 100%;
      height 22px;
      margin-top 6px;
      border .5px solid rgba(255, 255, 255, 0.3);
      border-radius 12px;
      background: rgba(255, 255, 255, 0.25);
      font-size 10px;
      line-height 22px;
      color #4C3100;
      padding 0 11px;
    }
  }
  .rule-description {
    width 100%;
    height 35px;
    line-height 35px;
    background-color #CC3A30;
    color #fff;
    text-align right;
    padding 0 20px;
    position absolute;
    left 0;
    right 0;
    bottom 0;
    font-size 14px;
    .van-icon {
      font-size 16px;
      vertical-align middle;
    }
    &.gold {
      background rgba(0, 0, 0, 0.1);
      display flex;
      justify-content space-between;
    }
    .left {
      text-align left;
    }
  }
}
.oil-drop-info {
  display flex;
  margin-top 15px;
  border-radius 8px;
  box-shadow 0 0 4px #D8D8D8;
  text-align center;
  color #333;
  padding 15px 0;
  .left,
  .center,
  .right {
    padding 5px 0;
    flex 1;
    display flex;
    flex-direction column;
    justify-content space-between;
    align-items center;
    .name {
      font-size 12px;
      line-height 18px;
    }
    .content {
      margin-top 5px
      height 20px;
      display flex;
      flex-direction column;
      justify-content center;
    }
    .not-yet-opened {
      font-size 14px;
      color #666;
    }
    .universal-num {
      font-size 22px;
      color #E81B1A;
      font-weight 700;
      font-family: DINAlternate-Bold, DINAlternate;
    }
    .oil-num {
      font-size 22px;
      font-weight 700;
      font-family: DINAlternate-Bold, DINAlternate;
    }
    .consumer-code {
      width 18px;
      height 18px;
    }
  }
  .left,
  .center {
    border-right .5px solid #D8D8D8
  }
}
.common-functions {
  margin-top 5px;
  .title {
    font-size 15px;
    font-weight 500;
    padding 10px 0;
  }
  .functions-container {
    border-radius 8px;
    box-shadow 0 0 4px #D8D8D8;
    padding 15px 10px;
    text-align center;
    color #333;
    display flex;
    .item {
      flex 1;
      & {
        border-right .5px solid #D8D8D8;
      }
      .top-c {
        display flex;
        flex-direction column;
        justify-content center;
        align-items center;
        height 30px;
        img {
          display inline-block;
          width 25px;
        }
      }
      .name {
        font-size 13px;
        line-height 20px;
        margin-top 5px;
      }
      &:last-child {
        border none;
        img {
          width 29px;
        }
      }
    }
  }
}
.list-benefits {
  margin-top 5px;
  .title {
    font-size 15px;
    font-weight 500;
    padding 10px 0;
  }
  .benefits-container {
    border-radius 8px;
    box-shadow 0 0 4px #D8D8D8;
    padding 15px 10px;
    text-align center;
    color #333;
    display flex;
    .item {
      flex 1;
      .top-c {
        display flex;
        flex-direction column;
        justify-content center;
        align-items center;
        height 50px;
        width 50px;
        border-radius 50%;
        overflow hidden;
        margin 0 auto;
        img {
          display inline-block;
          width 100%;
        }
      }
      .name {
        font-size 13px;
        line-height 20px;
        margin-top 7px;
      }
    }
  }
}

.unit-account {
  .index-info {
    text-align: center
    background: #fff
    padding: 20px 0
    .balance {
      padding: 25px
      .balance-text {
        font-size: 14px;
        color: #666
        border: none
        img {
          width: 15px
        }
      }
      .balance-price {
        font-size: 26px
        color: #888
        font-weight: bold
        margin: 10px 0
        letter-spacing: 2px
      }
    }
    .reward-consumption {
      display: flex
      .reward, .consume {
        flex: 1
        padding: 10px 0
        .price {
          margin-top: 10px
          color: #bbb
          font-size: 10px;
          .money {
            color: #222222
            font-weight: bold
          }
        }
        .text {
          color: #666
          .expect {
            position: absolute
            top: 50%
            transform translateY(-50%)
            z-index 1
            border-radius 3px;
            color: #fff;
            background: #f62e2e
            font-size: 10px;
            width: 50px;
            padding: 2px 0;
            left 105%
          }
        }
        .inner-text {
          position: relative
        }
        .no-open {
          font-size: 18px
          font-weight: bold
          padding-top: 10px
          color: #333
        }
      }
    }
    .list-two {
      padding: 0
    }
  }
  .userInfo {
    color: #888
    margin-top: 10px
    .tie-on-card {
      .my-account {
        .text {
          font-weight: bold
          color: #333
        }
        .my-count-img {
          width: 17px
        }
      }
    }
    .oil-point-open {
      .msg-img {
        display: inline-block
        .msg {
          width: 50px
        }
      }
    }
    .oil-point {
      .eggs1, .eggs2 {
        display: inline-block
        float: left
        width: 47%
        box-shadow: 0px 0px 10px 3px #FFF7F3
        margin-top: 5px
        padding: 5px
        img {
          width: 42%
          display: inline-block
          float: right
        }
        .text {
          padding-top: 18px
          display: inline-block
          .big {
            font-size: 16px
            display: inline-block
            margin-bottom: 10px
          }
          .small {
            color: #333
            font-weight: bold
          }
        }
      }
      .eggs2 {
        float: right
      }
    }
  }
  .open-instruction {
    .info {
      .one {
        color: #888;
        margin-top: 10px;
      }
    }
  }
  .active {
    color: #ff6800;
    font-size: 16px;
  }
}
</style>
