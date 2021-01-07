<template>
  <div class="open-package" @click="cancelClickBtn" v-if="complete">
    <nav-top title="邀约详情" @backEvent="$router.go(-1)">
      <i class="iconfont mall-gengduo" v-if="$route.query.shareId" @click.stop="dropmenuShow = !dropmenuShow"></i>
    </nav-top>
    <nav-content class="open-package-container">
      <!--      右上角弹框-->
<!--      <div class="dropmenu" v-show="dropmenuShow" @click.stop>-->
<!--        <div class="dropmenu-item" v-for="(item, index) in tabList" :key="index" @click="linkTo(item)">{{item.text}}</div>-->
<!--      </div>-->
      <div class="tab" @click.stop>
        <div class="item" v-for="(item, index) in tabList" :key="index" @click="showTab(item)">
          <div class="text" @click="linkTo(item)" :class="{active: item.showClick}" >{{item.text.substr(0, 2)}}<br />{{item.text.substr(2, 2)}}</div>
        </div>
      </div>
      <!--      分享页面看到的-->
      <div v-if="$route.query.shareId || joinType == 'INVITEE'">
        <!--      被邀请人打开页面-->
        <div class="title-tips" v-show="success && !openSelf && !openSuccess && !openOthers">{{details.phone}}邀请您一同开通家庭套餐</div>
        <!--      被邀请人打开页面-->
        <!--      已同意他人邀约-->
        <div class="title-tips aggress" v-show="openSuccess">申请成功！等待好友确认开通后即可享受套餐优惠</div>
        <!--      已同意他人邀约-->
        <!--      好友将您剔除-->
        <div class="title-tips aggress" v-show="openOthers">开通失败，好友已和他人成功开通家庭套餐</div>
        <!--      好友将您剔除-->
        <!--      开通成功-->
        <div class="title-tips aggress" v-show="openSelf" @click="goHome">开通成功！好友已和你成功开通家庭套餐点击<span class="look">查看</span>更多开通信息</div>
        <!--      开通成功-->
      </div>
      <!--              邀请列表看到的-->
      <div v-if="$route.query.id">
        <div class="title-tips aggress" v-if="details.state == 'SIGNED_UP'">邀约成功：已开通套餐</div>
        <div class="title-tips aggress"
             v-if="details.state == 'WAIT_SIGN_UP' && type != 1 && details.signUpNum > details.joinNum">邀约失败：受邀成员不足
        </div>
        <div class="title-tips aggress"
             v-if="details.state == 'WAIT_SIGN_UP' && type != 1 && details.signUpNum < details.joinNum">邀约失败：邀请人未确认开通套餐
        </div>
      </div>

      <div class="info">
        <div class="main">
          <div class="card special">
            <div class="left">套餐类型</div>
            <div class="right">{{details.packageRefuelName}}</div>
          </div>
          <div class="card change top">
            <div class="left">套餐选择</div>
            <ul class="type-list">
              <li class="type-item">{{details.duration}}天</li>
            </ul>
          </div>
          <div class="card people-num">
            <div class="left">套餐人数</div>
            <div class="right">{{details.signUpNum}}人</div>
          </div>
          <!--          邀请人看到的-->
          <div class="card change people" v-if="!$route.query.shareId && joinType != 'INVITEE'">
            <div class="left">
              家庭成员&nbsp;
              <span class="tips" v-if="details.signUpNum < orderDetailModelList.length">受邀成员过多，请踢除部分成员</span>
              <span class="tips" v-if="details.signUpNum > orderDetailModelList.length">成员不足，去邀请更多好友试试吧</span>
            </div>
            <ul class="invitation-list">
              <li class="invitation-item" v-for="(item, index) in orderDetailModelList" :key="index">
                <div class="oil-left">
                  <div class="name">油滴账号</div>
                  <div class="num">{{item.phone}}</div>
                </div>
                <div class="oil-right" v-if="item.joinType == 'INVITER'">邀请人</div>
                <div class="oil-right" v-else @click="deleteBtn(item)">
                  <img src="./image/icon-delete.png" alt="">
                </div>
              </li>
            </ul>
            <!--            成员不足 分享按钮-->
            <div class="share-btn" v-if="details.signUpNum > orderDetailModelList.length" @click="showShare = true">
              <div class="text">再次分享</div>
            </div>
          </div>
          <!--          邀请人看到的-->
          <div class="card change">
            <div class="left">套餐优惠规则</div>
            <div class="content" v-html="details.packageRefuelDesc"></div>
          </div>
        </div>
        <div class="btn"
             v-if="btnShow"
             :class="{active: !$route.query.shareId && details.signUpNum != orderDetailModelList.length}"
             @click="openBtn">{{!$route.query.shareId && joinType != 'INVITEE' ? '确认开通' : '申请加入'}}
        </div>
        <!--        家庭 分析邀约弹框-->
        <van-popup v-model="showShare" position="bottom">
          <div class="share-content">
            <div class="title">邀请好友一同开通家庭套餐</div>
            <div class="share-main" @click="shareBtn">
              <div class="img">
                <img src="./image/icon-weixin.png" alt="">
              </div>
              <div class="text">微信好友</div>
            </div>
            <div class="btn" @click="showShare = false">取消</div>
          </div>
        </van-popup>
      </div>
      <!--      分享页面 看到的-->
      <div v-if="$route.query.shareId">
        <!--      分享者已签约成功或该邀约状态变为失败-->
        <div class="no-cancel">
          <van-dialog
            v-model="show"
            confirmButtonText="取消"
            @confirm="show = false"
          >
            <div class="tips">邀请链接已失效</div>
          </van-dialog>
        </div>
        <!--      非油滴账户提醒-->
        <div class="have-cancel">
          <van-dialog
            v-model="showNoOil"
            confirmButtonText="前往开通"
            @cancel="showNoOil = false"
            show-cancel-button
            @confirm="openOil"
          >
            <div class="tips">您还不是油滴账户，无法开通套餐</div>
          </van-dialog>
        </div>
        <div class="no-cancel">
          <van-dialog
            v-model="showOilState"
            confirmButtonText="取消"
            @confirm="showOilState = false"
            >
            <div class="tips" v-show="oilStateOpen">您的油滴账号已被冻结,<br />无法开通套餐</div>
            <div class="tips" v-show="!oilStateOpen">您的油滴账号已被锁定,<br />无法开通套餐</div>
          </van-dialog>
        </div>
        <div class="no-cancel">
          <van-dialog
            v-model="showOpen"
            confirmButtonText="取消"
            @confirm="showOpen = false"
          >
            <div class="tips" v-show="open">您已开通加油套餐,<br />无法接受好友邀约</div>
            <div class="tips" v-show="!open">您已接受其他邀约,<br />申请失败</div>
          </van-dialog>
        </div>
        <!--      已开通套餐提醒-->
      </div>
      <!--      邀约详情 中 删除成员弹框-->
      <!--      邀约中（成员过多）删除成员弹窗-->
      <div class="have-cancel">
        <van-dialog
          v-model="showDeletePeople"
          confirmButtonText="确认剔除"
          @cancel="showDeletePeople = false"
          show-cancel-button
          @confirm="confirmDelete"
        >
          <div class="tips">确认剔除成员：{{deletePeople.phone}}？</div>
        </van-dialog>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import utils from "@/utils/util"
  import Cookie from 'js-cookie'
  import Config from '@/api/config'
  import yjConfig from './config'
  import wxfunc from '@/utils/wxfunc'
  export default {
    data() {
      return {
        tabList: [
          {text: '套餐说明', type: 1, showClick: false},
          {text: '我的邀约', type: 2, showClick: false},
          {text: '历史签约', type: 3, showClick: false},
        ],
        complete: false,
        showOilState: false, // 油滴账户开通状态
        show: false, // 邀请链接已失效
        oilStateOpen: true, // true 冻结 false锁定
        open: true, // true 就是您已开通加油套餐，无法接受好友邀约 false就是您已接受其他邀约，无法接受好友邀约
        showNoOil: false, // 非油滴账户提醒弹框
        showOpen: false, // 已开通加油套餐弹框
        dropmenuShow: false, // 右上角点点点
        showDeletePeople: false, // 邀约中（成员过多）删除成员弹窗
        date: '', // 日期
        showShare: false, // 家庭 分析邀约弹框
        peopleList: [1, 2, 3, 4], // 邀请人列表
        noOpen: false, // 确认开通按钮不可点击
        details: '',
        success: false, // 成功显示邀请提示
        btnShow: true, // 底部按钮是否显示
        openSelf: false, // 已和自己开通提示
        openOthers: false, // 已和他人开通提示
        openSuccess: false, // 申请成功 提示
        orderDetailModelList: [], // 被邀请人的信息
        deletePeople: '', // 删除成员
        joinType: '', // 角色
        oilState: '', // 河北油滴开通状态 0未开通 1开通 2冻结 4锁定
        // isnativetop: ''
      }
    },
    mounted() {
      // 分享出去，用户点击链接 会带有token
      const usertoken = this.$route.query.token
      if (usertoken && usertoken !== 'undefined' && usertoken !== 'null') {
        console.log('token1' + usertoken)
        this.$store.state.login.token = usertoken
        this.$bridgefunc.vuexStorage()
      }
      // this.isnativetop = Cookie.get('isnativetop')
      this.date = utils.getMyDate(new Date())
      if (this.$route.query.shareId) { // 分享打开的 才调用该接口
        this.acceptInvite() // 收到邀请开通套餐
      }
      if (this.$route.query.id) { // 首页
        // 首页获取邀请列表时 查到有待签约中的套餐 才调用该接口
        // 我的邀约列表 到详情页面
        this.joinType = this.$route.query.joinType || ''
        this.queryPackageOrderInfo()
      }
    },
    methods: {
      cancelClickBtn() {
        this.dropmenuShow = false
        this.tabList.forEach(tab => {
          tab.showClick = false
        })
      },
      goHome() {
        // 查看更多 -- 打开 一户一册首页
        this.$router.push({path: '/oil-package'})
      },
      queryPackageOrderInfo() {
        // 查询开通套餐详情 只是 家庭套餐 邀约详情
        this.$request.post('/app/json/app_package_refuel/queryPackageOrderInfo', {
          id: this.$route.query.id
        }).then(res => {
          if (res.status === 0) {
            this.orderDetailModelList = res.data.orderDetailModelList
            this.details = res.data.orderModel
            /**
             * 被邀请人 同意了套餐邀请 显示同意了的提示 被邀请人 orderDetailModelList只会返回自己的信息
             */
            if (this.joinType == 'INVITEE' && this.orderDetailModelList.length == 1 && this.orderDetailModelList[0].joinState == 'AGREED') {
              this.openSuccess = true // 显示提示
              this.btnShow = false // 隐藏按钮
              // let type = this.timeJudge(this.details.startDate.split(' ')[0])
              // if (type == -1) {
              //   // 失效 过了三天 展示 失效弹框
              //   this.show = true
              // }
            }
            this.dealState(this.details.state, this.details.startDate)
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '获取详情失败')
          }
        })
      },
      getAcctInfoList() {
        /**
         *获取河北油滴账户是否开通 --- 河北
         * state 0未开通 1开通 2冻结 4锁定
         * showNoOil 非油滴账户提醒弹框
         * showOilState 冻结锁定弹框 oilStateOpen true 冻结 false 锁定
         */
        this.$request.post('/app/json/app_youdi/getAcctInfoList', {}).then(res => {
          if (res.status === 0) {
            this.oilState = res.data || []
            if (this.oilState.length) {
              if (this.oilState.state == 0) {
                this.showNoOil = true
              } else if (this.oilState.state == 2) {
                this.showOilState = true
                this.oilStateOpen = true
              } else if (this.oilState.state == 4) {
                this.showOilState = true
                this.oilStateOpen = false
              } else {
                this.agreeInvite() // 申请加入
              }
            } else {
              this.showNoOil = true
            }
          } else {
            this.$Toast(res.info ? res.info : '获取油滴账户信息失败')
          }
        })
      },
      dealState(state, start, end) {
        if (state == 'WAIT_SIGN_UP') {
          this.type = this.timeJudge(start.split(' ')[0])
        }
      },
      timeJudge(time) {
        let date = utils.getMyDate(new Date()) // 当前时间
        let curDate = new Date(time);
        let nextTime = new Date(curDate.getTime() + 3 * 24 * 60 * 60 * 1000) // 套餐开始时间的三天以后的时间
        // 1和0:未超过三天  -1:超过三天
        return utils.dateCompare(date, utils.getPreTime(nextTime.getTime()).split(' ')[0])
      },
      acceptInvite() {
        // 收到邀请开通套餐
        console.log('邀请id' + this.$route.query.shareId)
        this.$request.post('/app/json/app_package_refuel/acceptInvite', {
          id: this.$route.query.shareId // 邀请开通记录id
        }).then(res => {
          if (res.status === 0) {
            this.details = res.data
            let type = this.timeJudge(this.details.startDate.split(' ')[0])
            if (type == -1) {
              // 失效 过了三天
              this.show = true // 失效弹框
              this.success = true //某某某邀请你开通
              this.btnShow = false // 隐藏按钮
              return
            } else if (this.details.state == 'SIGNED_UP') {
              /** 当前套餐---签约中 （隐藏按钮）
               * 第一步：判断signedOrderDetail（当前自己参与的套餐情况 本套餐或者其他套餐）
               */
              this.btnShow = false // 隐藏按钮
              if (this.details.signedOrderDetail) {
                /**
                 * 有值：并且packageRefuelOrderId 与套餐的id是否相同
                 *      相同 判断joinType
                 *              是INVITER邀请人 就是本人查看链接
                 *              不是INVITER就是参与了该套餐 显示'该好友和你开通了套餐'
                 *      不相同 参与了别的套餐 判断 state 参与别的套餐的情况
                 */
                if (this.details.signedOrderDetail.packageRefuelOrderId == this.details.id) {
                  // 该好友和你开通了套餐
                  if (this.details.signedOrderDetail.joinType != 'INVITER') {
                    this.openSelf = true
                  }

                } else {
                  // 参与了其他套餐 和别人开通套餐的弹出框
                  this.showOpen = true
                  if (this.details.signedOrderDetail.state == 'SIGNED_UP') {
                    // 签约中 open true 就是您已开通加油套餐 false就是您已接受其他邀约
                    this.open = true
                  } else {
                    this.open = false
                  }
                }
              } else {
                /**
                 * signedOrderDetail 没值 自己并未参与过任何套餐
                 * 显示 好友和别人开通了套餐
                 */
                this.openOthers = true
              }

            } else if (this.details.state == 'WAIT_SIGN_UP') {
              /**
               * 待签约
               * 第一步：判断signedOrderDetail（当前自己参与的套餐情况 本套餐或者其他套餐）
               */
              if (this.details.signedOrderDetail) {
                /**
                 * 有值：并且packageRefuelOrderId 与套餐的id是否相同
                 *      相同就是自己参与了该套餐 显示 ‘申请成功 等待好友开通’
                 *      不相同 参与了别的套餐 判断 state 参与别的套餐的情况
                 */
                this.btnShow = false // 隐藏按钮
                if (this.details.signedOrderDetail.packageRefuelOrderId == this.details.id) {
                  // 申请成功 等待好友开通
                  this.openSuccess = true
                } else {
                  // 参与了其他套餐 和别人开通套餐的弹出框
                  this.showOpen = true
                  if (this.details.signedOrderDetail.state == 'SIGNED_UP') {
                    // 签约中 open true 就是您已开通加油套餐 false就是您已接受其他邀约
                    this.open = true
                  } else {
                    this.open = false
                  }
                }
              } else {
                /**
                 * signedOrderDetail 没值 自己并未参与过任何套餐
                 * 显示 某某邀请你开通套餐
                 */
                this.success = true
              }
            }
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      shareBtn() {
        // 再次邀请
        // 判断是微信还是app
        console.log('我是webtype')
        console.log(this.$store.state.webtype)
        console.log(`${yjConfig.yjUrl}/wxweb/extend?actionUrl=${encodeURIComponent(`${Config.shareUrl}/invitation-details?shareId=${this.details.id}`)}`)
        if (this.$store.state.webtype == 2) {
          // 微信
          let shareData = {
            title: this.details.packageRefuelName,
            sharetext: '好友邀请您一起来开通加油家庭套餐啦，加油返利更省钱',
            imageurl: this.details.pic,
            detailurl: `${yjConfig.yjUrl}/wxweb/extend?actionUrl=${encodeURIComponent(`${Config.shareUrl}/invitation-details?shareId=${this.details.id}`)}`
          }
          wxfunc.getWechatSignature((isSignature) => {
            //签名成功
            if (isSignature) {
              wxfunc.wxSetShareData(shareData);
            } else {
              console.log('签名失败');
            }
          })
        } else {
          // app
          this.$bridgefunc._appShare(
            this.details.packageRefuelName,
            `${yjConfig.yjUrl}/wxweb/extend?actionUrl=${encodeURIComponent(`${Config.shareUrl}/invitation-details?shareId=${this.details.id}`)}`,
            this.details.pic,
            '好友邀请您一起来开通加油家庭套餐啦，加油返利更省钱'
          )
        }
        // if (this.isnativetop == 1) {
        //   this.$bridgefunc._appShare(
        //     this.details.packageRefuelName,
        //     `${yjConfig.yjUrl}/wxweb/extend?actionUrl=${encodeURIComponent(`${Config.shareUrl}/invitation-details?shareId=${this.details.id}`)}`,
        //     this.details.pic,
        //     '好友邀请您一起来开通加油家庭套餐啦，加油返利更省钱'
        //   )
        // } else {
        //   const shareData = {
        //     title: this.details.packageRefuelName,
        //     sharetext: '好友邀请您一起来开通加油家庭套餐啦，加油返利更省钱',
        //     imageurl: this.details.pic,
        //     detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/invitation-details?shareId=${this.details.id}`
        //   }
        //   this.$bridgefunc.wechatShare(shareData)
        // }
        // this.$router.push({path: '/invitation-details', query: {shareId: this.details.id, share: 1}})
      },
      linkTo(item) {
        // 右上角菜单
        if (item.showClick == true) {
          if (item.type == 1) {
            // 套餐说明
            this.$router.push({path: '/instructions'})
          } else if (item.type == 2) {
            // 我的邀约
            this.$router.push({path: '/my-invitation'})
          } else {
            // 历史签约
            this.$router.push({path: '/history-invitation'})
          }
        } else {
          if (item.type == 1) {
            // 套餐说明
            this.$router.push({path: '/instructions'})
          } else if (item.type == 2) {
            // 我的邀约
            this.$router.push({path: '/my-invitation'})
          } else {
            // 历史签约
            this.$router.push({path: '/history-invitation'})
          }
        }
      },
      openBtn() {
        // 确认开通 申请加入 按钮
        if (this.$route.query.shareId) {
          // 申请加入 分享出去的 首先判断是否是油滴账户 然后在走申请加入接口
          this.getAcctInfoList() // 获取河北油滴账户是否开通
        } else {
          if (this.details.signUpNum == this.orderDetailModelList.length) {
            // 确认开通 人数 刚好达到开通人数
            this.signPackageRefuel()
          }
        }

      },
      signPackageRefuel() {
        // 开通套餐
        let inviteelds = []
        this.orderDetailModelList.forEach(item => {
          inviteelds.push(item.id)
        })
        this.$request.post('/app/json/app_package_refuel/signPackageRefuel', {
          packageRefuelId: this.details.packageRefuelId, // 套餐id
          startDate: utils.getNextMinutes(), // 开通时间
          id: this.$route.query.id, // 邀请记录id -- 家庭
          inviteeIds: inviteelds.join(','), // 被邀请人id包含邀请人  -- 家庭
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('开通成功')
            this.$router.go(-1)
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      agreeInvite() {
        // 同意邀请开通套餐
        this.$request.post('/app/json/app_package_refuel/agreeInvite', {
          id: this.$route.query.shareId // 邀请开通记录id
        }).then(res => {
          if (res.status === 0) {
            // 申请成功以后
            this.btnShow = false // 底部按钮隐藏
            this.openSuccess = true // 显示成功提示
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      showTab(item) {
        item.showClick = true
        this.tabList.forEach(tab => {
          if (item != tab) {
            tab.showClick = false
          }
        })
      },
      linkTo(item) {
        // 右上角菜单
        if (item.showClick == true) {
          if (item.type == 1) {
            // 套餐说明
            this.$router.push({path: '/instructions'})
          } else if (item.type == 2) {
            // 我的邀约
            this.$router.push({path: '/my-invitation'})
          } else {
            // 历史签约
            this.$router.push({path: '/history-invitation'})
          }
        }
      },
      openOil() {
        // 前往开通油滴
        // 跳转到河北油滴页面
        window.location.href = '/app-vue/oildrop'
        // isThird 是否是第三方页面 1：是 0：否
        // thirdPageUrl第三方页面的url
        // let url = 'http://test.uhuitong.com/app-vue/oildrop'
        // this.$bridgefunc.newPage({
        //   weburl: url,
        //   isnativetop: 1
        // })
      },
      confirmDelete() {
        // 确认删除成员
        this.$request.post('/app/json/app_package_refuel/removeInvitee', {
          id: this.$route.query.id, // 邀请开通记录id
          inviteeIds: this.deletePeople.id // 被邀请人id
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('删除成功')
            this.queryPackageOrderInfo()
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      deleteBtn(item) {
        this.deletePeople = item
        this.showDeletePeople = true
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .open-package {
    background-color: #f8f8f8 !important

    .dropmenu {
      position: absolute;
      top: 0;
      right: 10px
      z-index: 10;
      background: rgba(0, 0, 0, 0.8);
      width: 100px;
      border-radius: 5px;
      text-align: center;
      font-size: 12px;
      line-height: 1.415;
      color: #fff
      padding: 0 5px

      .dropmenu-item {
        padding: 10px 0;
        position relative

        & + .dropmenu-item {
          border-top: 0.5px solid #cccccc
        }
      }
    }

    .iconfont {
      position: absolute;
      right: 10px
      top: 0;
      font-size 20px
    }

    .open-package-container {
      padding: 11px 0
      overflow-y auto

      .title-tips {
        background $color-theme-btn-d
        color: #fff
        padding: 11px 0
        text-align center
        margin-bottom: 10px
      }

      .aggress {
        background #fbf8d9
        color #e38641
        line-height 20px

        .look {
          color $color-theme-r
        }
      }

      .info {
        display flex
        flex-direction column

        .main {
          flex: 1
          overflow-y auto
          -webkit-overflow-scrolling touch
          padding-bottom: 30px

          .card {
            margin-bottom: 10px
            padding: 15px
            display flex
            justify-content space-between
            align-items center
            background #fff

            .left {
              color: $color-text-d

              .tips {
                color: $color-theme-r
                font-size 10px
              }
            }

            .invitation-list {
              overflow-y: auto;
              max-height: 200px
              -webkit-overflow-scrolling touch
              padding: 10px 15px

              .invitation-item {
                display flex
                justify-content space-between
                align-items center
                margin-bottom: 5px

                .oil-left {
                  flex: 1
                  display flex
                  justify-content space-between
                  align-items center
                  box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
                  background: #fff
                  border-radius 6px
                  padding: 15px
                }

                .oil-right {
                  text-align right
                  width: 50px
                  color: $color-theme-r

                  img {
                    width: 15px
                  }
                }
              }
            }

            .share-btn {
              text-align center
              margin-top: 5px

              .text {
                background $color-theme-r
                color: #fff
                border-radius 20px
                padding: 10px 30px
                text-align center
                display inline-block
              }
            }

            .right {
              display flex
              justify-content space-between
              align-items center

              .inp {
                background #f6f6f6
                text-align right
                line-height 28px
                padding: 0 10px
                border-radius 4px
              }
            }
          }

          .people {
            padding: 15px 0 10px 0

            .left {
              padding: 0 15px 5px 15px !important
            }
          }

          .special {
            padding: 11px 15px
          }

          .people-num {
            padding: 10px 15px
          }

          .code {
            padding: 8px 15px
          }

          .top {
            .left {
              color: $color-text-d !important
            }
          }

          .change {
            justify-content left
            flex-direction column
            align-items inherit

            .left {
              padding-bottom: 10px
              color: $color-text
            }

            .content {
              line-height 20px
              color: $color-text-d
              >>> img {
                width 100%
              }
            }

            .type-list {
              display flex
              justify-content space-between
              align-items center

              .type-item {
                border-radius 6px
                border: 1px solid #f6f6f6
                padding: 12px 0
                width: 100px
                text-align center
                font-size 14px
                background #f6f6f6
                color: $color-text-d

                & + .type-item {
                  margin-left: 10px
                }
              }
            }
          }

        }

        .btn {
          flex-shrink 0
          padding: 15px 0
          text-align center
          background $color-theme-r
          color: #fff
          font-size 14px
          position fixed
          bottom: 0
          left: 0
          right: 0
        }

        .active {
          background #f89191
        }
      }
    }
  }

  /deep/ .van-radio-group {
    display flex

    .van-radio {
      & + .van-radio {
        padding-left: 15px
      }
    }

    .van-radio__label {
      margin-left 5px
    }
  }

  .share-content {
    padding: 20px
    display flex
    justify-content center
    align-items center
    flex-direction column

    .share-main {
      display flex
      justify-content center
      align-items center
      flex-direction column
      padding-bottom: 50px
      width 100%
    }

    .title {
      font-weight bold
      font-size 14px
      color: $color-text
      padding-bottom: 30px
    }

    .img {
      padding-bottom: 10px

      img {
        width: 40px
      }
    }

    .text {
      color: $color-text
    }
  }

  .tips {
    text-align center
    padding: 50px 0
    line-height 20px
    font-size 16px
  }

  .no-cancel {
    /deep/ .van-dialog__confirm {
      color: $color-text
      background #fff
    }
  }

  .have-cancel {
    /deep/ .van-dialog__confirm {
      background $color-theme-r
      color: #fff
    }
  }
  .tab {
    position absolute
    right: 0
    top: 15px
    z-index: 99999
    .item {
      .text {
        width: 50px
        position: relative;
        right: -25px; /*no*/
        border-top-left-radius 20px
        border-bottom-left-radius 20px
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff
        margin-bottom: 10px
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center
      }
      .active {
        right 0
      }
    }
  }


</style>
