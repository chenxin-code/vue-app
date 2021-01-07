<template>
  <div class="oil-package" @click="cancelClickBtn" v-if="complete">
    <nav-top title="油滴套餐" @backEvent="$router.go(-1)">
      <div class="tips icon-tips" v-if="cut != 0">{{cut}}</div>
      <i class="iconfont mall-gengduo" @click.stop="dropmenuShow = !dropmenuShow"></i>
    </nav-top>
    <nav-content class="oil-package-container " v-if="!showOpen">
      <!--      右上角弹框-->
      <!--      <div class="dropmenu" v-show="dropmenuShow" @click.stop>-->
      <!--        <div class="dropmenu-item" v-for="(item, index) in tabList" :key="index" @click="linkTo(item)">-->
      <!--          {{item.text}}-->
      <!--          <div class="tips" v-if="cut != 0 && index == 1">{{cut}}</div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--        未开通-->
      <!--      开通油滴提示-->
      <div class="no-open">
        <div class="bg-img" v-if="bgImgList" v-html="bgImgList"></div>
        <div class="bg-img" v-else>
          <img src="./image/bg.png" alt="">
        </div>
        <div class="content">
          <div class="main-info">
            <div class="oil-open-tips" v-if="oilOpen" @click="openOil">开通套餐需要开通油滴账户，点击<span class="oil-text">开通油滴</span>前往开通
            </div>
            <div class="news" @click="openInfo" v-html="newsList"></div>
          </div>
          <div class="open-btn" @click="changeBtn">
            <div class="left"></div>
            <div class="center">申请开通</div>
            <div class="right"></div>
          </div>
        </div>
        <div class="tab">
          <div class="item" v-for="(item, index) in tabList" :key="index" v-if="index == 0">
            <div class="text" @click="linkTo(item)">{{item.text.substr(0, 2)}}<br/>{{item.text.substr(2,
              2)}}
            </div>
          </div>
        </div>
      </div>
    </nav-content>
    <nav-content class="oil-package-container open" v-else>
      <!--      右上角弹框-->
      <!--      <div class="dropmenu" v-show="dropmenuShow" @click.stop>-->
      <!--        <div class="dropmenu-item" v-for="(item, index) in tabList" :key="index" @click="linkTo(item)">-->
      <!--          {{item.text}}-->
      <!--          <div class="tips" v-if="cut != 0 && index == 1">{{cut}}</div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--        开通-->
      <div class="content">
        <!--        即将过期提醒-->
        <div class="title-tips" v-if="isOverdue">
          <div class="text">您的套餐即将过期</div>
          <div class="btn" @click="overdue">点此续签</div>
        </div>
        <div class="already" v-if="alreadyDue">
          <div class="top">
            <span class="over-due-tips">已续签</span>
            <span
              class="text">{{`${renewalInfo.orderModel.packageRefuelName}(${renewalInfo.orderModel.duration}天)`}}</span>
          </div>
          <div class="bottom">生效日期：{{`${renewalInfo.orderModel.startDate}`}}</div>
        </div>
        <div class="title-info">
          <div class="info">
            <div class="title-name">
              <div class="left">{{myHomeInfo.orderModel.packageRefuelName}}&nbsp;&nbsp;{{myHomeInfo.orderModel.duration}}天</div>
              <div class="right">{{state}}</div>
            </div>
            <div class="text">套餐开始时间：{{myHomeInfo.orderModel.startDate}}</div>
            <div class="text">套餐结束时间：{{myHomeInfo.orderModel.endDate}}</div>
            <div v-if="ruleDesc.rebateType == 1">
              <div class="special" v-if="rebate.length > 1">
                您当前再加{{dealNum(rebate[1].oilLiter, (this.myHomeInfo.orderModel.sumOilLiter || 0))}}升油即可升级返利档次。
              </div>
            </div>
            <div v-else>
              <div class="special" v-if="rebate.length && myHomeInfo.orderModel.packageType == 3">
                您当前加油单笔即时返利为{{rebate[0].rebate}}%<span v-if="rebate.length != 1">,再加{{dealNum(rebate[1].oilLiter, (this.myHomeInfo.orderModel.sumOilLiter || 0))}}升，即可升级实时返利比例至{{rebate[1].rebate}}%。</span>
              </div>
              <div class="special" v-if="rebate.length && myHomeInfo.orderModel.packageType != 3">
                您当前加油单笔即时返利为{{ruleDesc.baseRebate}}%,套餐到期后的补返比例为{{rebate[0].rebate}}%<span v-if="rebate.length != 1">,再加{{dealNum(rebate[1].oilLiter, (this.myHomeInfo.orderModel.sumOilLiter || 0))}}升，即可升级累计补返比例至{{rebate[1].rebate}}%。</span>
              </div>
            </div>
          </div>
        </div>
        <div class="statistical" v-if="myHomeInfo.orderModel.packageType == 2">
          <div class="title">套餐加油统计</div>
          <ul class="list">
            <li class="item">
              <div class="oil-info">
                <div class="name">加油升数</div>
                <div class="num">{{myHomeInfo.orderModel.sumOilLiter || '0'}}</div>
              </div>
              <div class="oil-info middle">
                <div class="name">实时返利金额</div>
                <div class="num">{{myHomeInfo.orderModel.rebate || '0'}}</div>
              </div>
              <div class="oil-info">
                <div class="name">加油金额</div>
                <div class="num">{{myHomeInfo.orderModel.sumAmount || '0.00'}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="statistical">
          <div class="title">个人加油统计</div>
          <ul class="list">
            <li class="item">
              <div class="oil-info">
                <div class="name">加油升数</div>
                <div class="num">{{dealDiffData(1)}}</div>
              </div>
              <div class="oil-info middle">
                <div class="name">实时返利金额</div>
                <div class="num">{{dealDiffData(2)}}</div>
              </div>
              <div class="oil-info">
                <div class="name">加油金额</div>
                <div class="num">{{dealDiffData(3)}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="title" v-if="myHomeInfo.orderModel.packageType == 2">个人加油明细</div>
        <div class="title" v-else-if="myHomeInfo.orderModel.packageType == 1">加油明细</div>
        <div class="title" v-else>返利明细</div>
      </div>
      <ul class="details-list">
        <li class="details-item" v-for="(item, index) in oilRecordList" :key="index" v-if="index < 5">
          <div class="info">
            <div class="name">订单号</div>
            <div class="details-text">{{item.orderNo}}</div>
          </div>
          <div class="info">
            <div class="name">加油时间</div>
            <div class="details-text">{{item.tradeTime}}</div>
          </div>
          <div class="info">
            <div class="name">加油升数</div>
            <div class="details-text">{{item.oilLiter || '0'}}</div>
          </div>
          <div class="info">
            <div class="name">加油金额</div>
            <div class="details-text">{{item.amount || '0.00'}}</div>
          </div>
          <!-- <div class="info" v-if="myHomeInfo.orderModel.packageType == 3">
            <div class="name">返利比例</div>
            <div class="details-text">{{(item.rebate/item.amount).toFixed(2) * 100}}%</div>
          </div> -->
          <div class="info">
            <div class="name">实时返利金额</div>
            <div class="details-text">{{item.rebate || '0'}}</div>
          </div>
        </li>
        <div class="no-data" v-if="oilRecordList.length == 0">
          <div class="img">
            <img src="./image/p1.png" alt="">
          </div>
          <div class="text">暂无数据</div>
        </div>
        <div class="more-btn">
          <div class="seeMore" v-if="oilRecordList.length > 5" @click="openRecord">查看更多加油记录</div>
          <div v-if="oilRecordList.length > 5 && (myHomeInfo.orderModel.packageType == 3 || myHomeInfo.orderModel.packageType == 1 || myHomeInfo.orderModel.packageType == 2)">&nbsp;|&nbsp;</div>
          <div class="icon-right" v-if="myHomeInfo.orderModel.packageType == 3 || myHomeInfo.orderModel.packageType == 1 || myHomeInfo.orderModel.packageType == 2" @click="exitPackage">退出套餐</div>
        </div>
      </ul>
      <!--      v-if="isnativetop == 1"-->
      <div class="tab">
        <div class="item" v-for="(item, index) in tabList" :key="index">
          <div class="text" @click="linkTo(item)">{{item.text.substr(0, 2)}}<br/>{{item.text.substr(2, 2)}}</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import utils from "@/utils/util"
  import Cookie from 'js-cookie'
  import { Dialog } from 'vant'

  export default {
    data() {
      return {
        tabList: [
          {text: '套餐说明', type: 1},
          {text: '我的邀约', type: 2},
          // {text: '历史签约', type: 3},
        ],
        active: true,
        dropmenuShow: false, // 右上角点点点
        oilRecordList: [], // 加油记录
        cut: '',
        myHomeInfo: '', // 开通套餐信息
        newsList: '', // 内容中心
        oilOpen: false, // 油滴账户是否开通
        complete: false,
        oilState: '', // 河北油滴开通状态 0未开通 1开通 2冻结 4锁定
        isOverdue: false, // 判断是否过期
        alreadyDue: false, // 判断是否有续约状态
        isUpgrade: true, // 是否可升级提示语
        oilId: '',
        state: '', // 状态
        showOpen: false, // 是否显示首页开通页面
        myInviteList: [],  // 我的邀请信息
        rebate: [], // 返利区间
        // isnativetop: '',
        ruleDesc: '', // 返利信息
        renewalInfo: '', // 续签信息
        bgImgList: '' // 背景图片
      }
    },
    mounted() {
      this.queryMyHomeInfo() // 首页信息
      this.showagreement() // 获取内容中心
      this.getNewsList() // 获取背景图片
      this.getAcctInfoList() // 获取河北油滴账户是否开通 --- 河北


      // if (this.$route.query.noCheckJoinContract) {
      //   // this.isnativetop = Cookie.get('isnativetop')
      //   this.queryMyHomeInfo() // 首页信息
      //   this.showagreement() // 获取内容中心
      //   this.getNewsList() // 获取背景图片
      //   this.getAcctInfoList() // 获取河北油滴账户是否开通 --- 河北
      // } else {
      //   // 检查用户是否已加入机构群组
      //   this.$Loading.open()
      //   this.$http.post('/app/json/app_package_refuel/canJoinContract', {}).then(res => {
      //     this.$Loading.close()
      //     let data = res.data
      //     if (data.status == 0) {
      //       if (data.data.joinUserCluster) {
      //         this.$router.replace({
      //           path: '/refueling-package'
      //         })
      //       } else {
      //         // this.isnativetop = Cookie.get('isnativetop')
      //         this.queryMyHomeInfo() // 首页信息
      //         this.showagreement() // 获取内容中心
      //         this.getNewsList() // 获取背景图片
      //         this.getAcctInfoList() // 获取河北油滴账户是否开通 --- 河北
      //       }
      //     } else {
      //       this.$Toast(data.info)
      //     }
      //   }).catch(err => {
      //     this.$Loading.close()
      //     this.$Toast(`canJoinContract err ${err}`)
      //   })
      // }
    },
    methods: {
      getNewsList() {
        // 获取内容中心
        this.$request.post('/app/json/news/getNewsList', {values: 47}).then(res => {
          if (res.status == 0) {
            this.bgImgList = res.data[0] ? res.data[0].content : ''
          } else {
            this.$Toast(res.info ? res.info : '获取获取内容中心失败')
          }
        })
      },
      cancelClickBtn() {
        this.dropmenuShow = false
        this.tabList.forEach(tab => {
          tab.showClick = false
        })
      },
      queryMyHomeInfo() {
        // 首页信息
        /**
         * 只会展示开通和未开通数据
         * 1.个人：已签约（已开始、签约中、已结束）已结算
         *        已开始、签约中 显示 首页开通页面
         *        已结束、已结算 显示 首页未开通页面
         *        orderDetailModelList和orderModel是一样的 并且orderDetailModelList有且只有一条数据
         *
         * 2.家庭：待签约、已签约（已开始、签约中、已结束）已结算
         *        签约人：待签约 直接到 邀约详情页面 其余同个人
         *        被邀请人：待定
         *        orderDetailModelList 是所有签约人的信息 本人的根据$store.state.userInfo.userId判断
         *        orderModel是套餐信息（总）
         */
        this.$request.post('/app/json/app_package_refuel/queryMyHomeInfo', {}).then(res => {
          if (res.status === 0) {
            this.myHomeInfo = res.data
            let id = ''
            if (this.myHomeInfo) {
              // 有已开通套餐
              /**
               * 数据处理
               */
              this.state = this.dealState(this.myHomeInfo.orderModel.state, this.myHomeInfo.orderModel.startDate, this.myHomeInfo.orderModel.endDate)
              if (this.myHomeInfo.orderModel.packageType == 1) { // 个人
                id = this.myHomeInfo.orderDetailModelList[0].packageRefuelOrderId
              } else { // 家庭
                console.log('userId')
                this.myHomeInfo.orderDetailModelList.forEach(item => { // 查找本人数据
                  if (item.joinType == 'INVITER') {
                    id = item.packageRefuelOrderId
                    console.log(id)
                  }
                })
              }
              // 获取返利信息
              this.ruleDesc = JSON.parse(this.myHomeInfo.orderModel.ruleDesc) || {}
              this.dealRebate(this.ruleDesc.sumRebate, this.myHomeInfo.orderModel.sumOilLiter || 0)
              console.log('ruleDesc')
              console.log(this.ruleDesc)
              // 加油记录
              this.queryPackageRefuelOrderRecord(id)
              // 判断是否过期
              this.isOverdue = this.overdueDeal()
              if (this.isOverdue) {
                // 已过期 查询是否有续签信息
                this.queryRenewalInfo()
              }
              /**
               * 页面显示
               */
              if (this.state == '签约中' || this.state == '未开始') {
                // 显示首页开通页面
                this.showOpen = true
                this.complete = true
              } else if ((this.state == '已结束' || this.state == '已结算' || this.state == '已取消') || (this.state == '待签约' && this.myHomeInfo.orderModel.packageType == 2)) {
                // 显示未开通页面: 1.已结束 已结算 已取消 2. 家庭套餐 待签约 超过三天
                this.showOpen = false
                this.complete = true
              }
            } else {
              // 未开通套餐 调我的邀约列表
              this.queryMyInviteList()
            }
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      queryMyInviteList() {
        // 查询我的邀请
        /**
         * 第一步：查询我的邀请列表是否有数据
         * 有：有待签约状态 有两种情况：
         *     1.超过三天 就是邀约失败 显示首页未开通页面
         *     2.没有超过三天 直接到 邀约详情页面
         * 无：显示首页未开通页面
         */
        this.$request.post('/app/json/app_package_refuel/queryMyInviteList', {}).then(res => {
          if (res.status === 0) {
            this.cut = res.data.length
            this.myInviteList = res.data
            if (this.myInviteList.length) {
              // 有数据 分两种情况
              let stateList = []
              let stateItem = ''
              let waitDetailList = [] // 开通订单记录id
              this.myInviteList.forEach(item => {
                stateItem = this.dealState(item.state, item.startDate, item.endDate)
                if (stateItem == '待签约') {
                  waitDetailList.push(item)
                }
                stateList.push(stateItem)
              })
              if (stateList.every(this.sourceState)) {
                // 有待签约状态
                for (let i = 0; i < waitDetailList.length; i++) {
                  console.log(this.timeJudge(waitDetailList[i].startDate.split(' ')[0]))
                  if (this.timeJudge(waitDetailList[i].startDate.split(' ')[0]) != -1) {
                    // 未超过三天 直接到 邀约详情
                    this.$router.push({
                      path: '/invitation-details',
                      query: {id: waitDetailList[i].packageRefuelOrderId, joinType: waitDetailList[i].joinType}
                    })
                  } else {
                    // 超过三天 显示首页未开通信息
                    this.showOpen = false
                    this.complete = true
                  }
                }
              } else {
                // 无待签约状态 显示未开通样式
                this.showOpen = false
                this.complete = true
              }
            } else {
              // 无数据 显示未开通样式
              this.showOpen = false
              this.complete = true
            }
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      queryRenewalInfo() {
        /**
         * 获取续签信息
         */
        this.$request.post('/app/json/app_package_refuel/queryRenewalInfo', {}).then(res => {
          if (res.status === 0) {
            this.renewalInfo = res.data
            if (this.renewalInfo && this.renewalInfo.orderModel.id != this.myHomeInfo.orderModel.id) {
              this.isOverdue = false // 清掉过期提示
              this.alreadyDue = true // 显示续约信息
            }
          } else {
            this.$Toast(res.info ? res.info : '获取续签信息失败')
          }
        })
      },
      timeJudge(time) {
        let date = utils.getMyDate(new Date()) // 当前时间
        let curDate = new Date(time);
        let nextTime = new Date(curDate.getTime() + 3 * 24 * 60 * 60 * 1000) // 套餐开始时间的三天以后的时间
        // 1和0:未超过三天  -1:超过三天
        return utils.dateCompare(date, utils.getPreTime(nextTime.getTime()).split(' ')[0])
      },
      sourceState(value) {
        if (value == '待签约') {
          return true;
        } else {
          return false;
        }
      },
      dealDiffData(type) {
        let sum = ''
        if (this.myHomeInfo.orderModel.packageType == 1 || this.myHomeInfo.orderModel.packageType == 3) { // 个人
          if (type == 1) { // 加油升数
            return this.myHomeInfo.orderDetailModelList[0].sumOilLiter || '0'
          } else if (type == 2) { // 实时返利金额
            return this.myHomeInfo.orderDetailModelList[0].sumRebate || '0'
          } else { // 加油金额
            return this.myHomeInfo.orderDetailModelList[0].sumAmount || '0.00'
          }
        } else { // 家庭
          this.myHomeInfo.orderDetailModelList.forEach(item => { // 查找本人数据
            console.log(this.$store.state.mall2.behalf.userId)
            if (item.userId == this.$store.state.mall2.behalf.userId) {
              if (type == 1) { // 加油升数
                sum = item.sumOilLiter ? item.sumOilLiter : '0'
              } else if (type == 2) { // 实时返利金额
                sum = item.sumRebate || '0'
              } else { // 加油金额
                sum = item.sumAmount || '0.00'
              }
            }
          })
          return sum
        }
      },
      getAcctInfoList() {
        /**
         *获取河北油滴账户是否开通 --- 河北
         * state 0未开通 1开通 2冻结 4锁定
         */
        this.$request.post('/app/json/app_youdi/getAcctInfoList', {}).then(res => {
          if (res.status === 0) {
            this.oilState = res.data || []
            console.log(this.oilState)
            if ((this.oilState.length && this.oilState.state === 0) || !this.oilState.length) {
              this.oilOpen = true
            }
          } else {
            this.$Toast(res.info ? res.info : '获取油滴账户信息失败')
          }
        })
      },
      queryPackageRefuelOrderRecord(id) {
        // 加油记录
        this.oilId = id
        this.$request.post('/app/json/app_package_refuel/queryPackageRefuelOrderRecord', {
          packageRefuelOrderId: id
        }).then(res => {
          if (res.status === 0) {
            this.oilRecordList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      dealState(state, start, end) {
        // 判断状态
        let date = utils.getMyDate(new Date()) // 当前时间
        if (state == 'WAIT_SIGN_UP') {
          // 家庭才会有
          return '待签约'
        } else if (state == 'SIGNED_UP') {
          let compareBegin = utils.dateCompare(date, start.split(' ')[0])
          let compareEnd = utils.dateCompare(date, end.split(' ')[0])
          if (compareBegin == 1) {
            /** 一、未开始
             * now 小于 begin
             */
            return '未开始'
          } else if (((compareBegin == 0 || compareBegin == -1) && (compareEnd == 1 || compareEnd == 0))) {
            /**
             * 二、签约中
             * 1.now 等于 begin 当天 （compareBegin == 0）
             * 2.now 大于 begin 小于 end （compareBegin == -1 && compareEnd == 1）
             * 3.now 大于 begin 等于 end （compareBegin == -1 && compareEnd == 0）
             */
            return '签约中'
          } else {
            /**
             * now 等于 begin  大于 end （compareBegin == -1 && compareEnd == -1）
             */
            return '已结束'
          }
        } else if (state == 'SETTLED') {
          return '已结算'
        } else if (state == 'CANCELED') {
          return '已取消'
        }
      },
      overdueDeal() {
        // 判断 当前已开通套餐是否过期 判断日期是否在区间内，在区间内返回true，否返回false
        let date = utils.getMyDate(new Date()) // 当前时间
        let end = this.myHomeInfo.orderModel.endDate.split(' ')[0] // 到期时间
        let afterWeek = utils.getAfterWeek(end).split(' ')[0] // 到期时间的前一周
        return utils.isDateBetween(date, afterWeek, end)
      },
      dealRebate(arr, num) {
        let arry1 = [].concat(arr).sort((a, b) => a.oilLiter - b.oilLiter)
        let result = []
        for (let i = 0; i < arry1.length - 1; i++) {
          const item = arry1[i]
          const item2 = arry1[i + 1]
          if (item.oilLiter <= num && num < item2.oilLiter) {
            result.push(item)
            result.push(item2)
            break
          } else if (i === (arry1.length - 2) && num >= item2.oilLiter) {
            result.push(item2)
            break
          }
        }
        this.rebate = result
      },
      overdue() {
        // 点击续签
        this.$router.push({path: '/package-change', query: {overdueDate: this.myHomeInfo.orderModel.endDate}})
      },
      showagreement() {
        // 获取内容中心
        this.$request.post('/app/json/news/getNewsList', {values: 35}).then(res => {
          if (res.status == 0) {
            this.newsList = res.data[0] ? res.data[0].content : ''
          } else {
            this.$Toast(res.info ? res.info : '获取获取内容中心失败')
          }
        })
      },
      openOil() {
        // 跳转到河北油滴页面
        // isThird 是否是第三方页面 1：是 0：否
        // thirdPageUrl第三方页面的url
        window.location.href = '/app-vue/oildrop'
      },
      dealTime(begin, end) {
        return begin.split(' ')[0] + '~' + end.split(' ')[0]
      },
      linkTo(item) {
        // 右上角菜单
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
      },
      openInfo() {
        // 图片跳到套餐说明
        this.$router.push({path: '/instructions'})
      },
      changeBtn() {
        // 去开通套餐 打开套餐选择
        if (this.oilState.length) {
          if (this.oilState.state == 0) {
            this.$Toast('您还未开通油滴套餐，请前往开通吧!')
          } else if (this.oilState.state == 2) {
            this.$Toast('您的油滴账号已被冻结，无法开通套餐!')
          } else if (this.oilState.state == 4) {
            this.$Toast('您的油滴账号已被锁定，无法开通套餐!')
          } else {
            this.$router.push({path: '/package-change'})
          }
        } else {
          this.$Toast('您还未开通油滴套餐，请前往开通吧!')
        }

        // this.$router.push({path: '/package-change'})
      },
      openRecord() {
        // 打开加油记录
        this.$router.push({
          path: '/oil-record',
          query: {id: this.oilId, packageType: this.myHomeInfo.orderModel.packageType}
        })
      },
      exitPackage() {
        // 退出套餐
        Dialog.confirm({
          title: '提示',
          message: '退出套餐后再次加入，返利比例将会按最低返利档次重新计算，是否确认退出？',
          confirmButtonText: '不了，我再想想',
          cancelButtonText: '确定我要退出',
        }).then(() => {
          console.log('不会退出套餐')
        }).catch(() => {
          this.$request.post('/app/json/app_package_refuel/quitPackageOrder', {id: this.myHomeInfo.orderModel.id}).then(res => {
            if (res.status == 0) {
              this.$Toast('退出套餐成功')
              this.queryMyHomeInfo() // 首页信息
            } else {
              this.$Toast(res.info ? res.info : '退出套餐失败')
            }
          })
        })
      },
      dealNum(a, b) {
        let num = ((a * 100) - (b * 100)) / 100
        return num.toFixed(2)
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .oil-package {
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

    .tips {
      border-radius 50%
      padding: 1px 5px; /*no*/
      background $color-theme-r
      color: #fff
      position absolute
      top: 3px
      right: 0
    }

    .icon-tips {
      font-size 12px
      padding: 5px; /*no*/
      height: 15px; /*no*/
      display: flex;
      justify-content: center;
      align-items: center;
      right: 5px
    }

    .oil-package-container {

      .no-open {
        .bg-img {

          /deep/ img {
            width 100%
            height 100%
            position absolute
            top: 0
            bottom: 0
            right 0
            left 0
          }
        }

        .content {
          overflow-y auto
          -webkit-overflow-scrolling touch
          position absolute
          top: 110px
          bottom: 15px
          right 15px
          left 15px
          display flex
          flex-direction column

          .main-info {
            flex: 1
            overflow-y auto
          }

          .oil-open-tips {
            padding: 11px 5px
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #ffe8ce
            border-radius 6px
            border: 2px solid #f5c89a
            color: #7a8ffa

            .oil-text {
              color: $color-theme-text-l
            }
          }

          .news {
            padding: 0 0 11px 0

            >>> img {
              width 100%
            }
          }

          .open-btn {
            flex-shrink 0
            text-align center
            padding-top: 15px
            display flex
            justify-content center
            align-items center

            .left {
              width: 20px
              height 50px
              background url("./image/button1@2x.png")
              background-size 100% 100%
            }

            .right {
              width: 20px
              height 50px
              background url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABiCAYAAAASsYBGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0Q5NDE3MkFGOUY4MTFFOUI2NUJGMzBEMjM2QkZFNEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0Q5NDE3MkJGOUY4MTFFOUI2NUJGMzBEMjM2QkZFNEIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRTMxRjMwOUY5RjcxMUU5QjY1QkYzMEQyMzZCRkU0QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFRTMxRjMwQUY5RjcxMUU5QjY1QkYzMEQyMzZCRkU0QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmuS5F0AAAmCSURBVHjazFxJyBxFFH7V0ypqBJcQwYMncTkYDQguQcWbXjyoxAQRMepBQT2oIPGgFxckCC6IuJ4E15uinoRoNIgQN0QTERERiTGJuCfT9Xzd09X9quq9qp4/888/BW96mZ7p99X3tqrqGYP7v0MA+I/kL5IDJH+0+z+TfBvI79A0hKhheL7dRwyOrfA+u8b7Hoy/d806kFrZbo9q5URIt10kHwOYD2j7Nt3gl+4dU9/PsJu2+6bdNu/Vpwt6sf219fscv0H2PSY41ptpGVlKq++wk7ZvkrxOsrt/R2BGZUdiLsGMwggB2b1UIGHbTvI8ySsk/y4bmDXnijcvYHZtPclLJD+Q3EN9dBx4dud2jX+uMTUjvGfa0+yc0W9eNL2QlayJ8nYyyaN0UwJk7u/9zgi4UmBABqMC6bSUBAKqEyDjywkAPtBGu5sn95J617ANBxMqb5K9pzPSaGOHg4Tws901q0meI/mQZJ1obp6VS8DyZqAzkjK1LDixXUjyCcnWNtQrJgYCE6GJiYxUMBErC1QCSBCAwQBwWOetu1pAZyWyguwvS2LEYyYElwAWKy+BWtuCuTZWvhAw5U2M+YgdbkacwdCPVLaitqrNOQ/KKkpObmbBCFcOZMai4AAxsDDiAWwheZnkSFVfkzet0u8w1DvGuwxlupuPW3a+GGrjm+jDx9P2GpK/ZSXwcH0EFB8QottgpsSgcAXJWyTHZIPAoDwSOecQx5bySFAzdaCS7bKmCEVmZgNbIfuExAIOAJVhCYIICCGw5vzltPPisDSYLRoz4FKgVJbC7wafqUa6i64jeejwGEkNPyS/Ec1oCrMDNffcSy8bhgOJOndI6TGEiaHnk4nzxUkFgEs0rSw44WKtE3KA0knz2CZpYlubLS38pjosBwiGMwSZwIK4tvcXnNbZMzY8GBBOB0i/7Z0kFywhaqWALTcg8btGJM+yWZ9ZjNlR70UVUGrea7Dzn01ymz4d9MunM5hFMcqhUcYZiarWJIu8/fRyGqxeu2+ZZlFQOZyGHVTY9SLgCSR3L/N0UMrchviOAii25Nvh1y9WL+e8VoKdIb6DueTo3qMBGd4xByDTmhom2FOj2a3w6+dHzwHINGC0CJaMQWRauHFOQBS/gVzPZxy+Z/GmOQKRJrETCVa6Vq+g1sOez06bM5AUUYP9Qnp/4woAwcQpHIg8AnbNCjGSAzN1kbEW9uw8ZYVMCweY2uDRar1ud8XK+YimZKR/boqqkUsgVRbPD4wZjFO58KIZVr+zaGaJLDbnTyhhYdrA/kSUjk9fICBTKd4Dn8zxnVEuvOKh8jasz5rtmeXiA+A9jwtsWtMC4Nf3k+KnlgsLQgPgPSnRfejEciGdWALhAGD4XvN6UrkwTORAYLAy4Dv7EeXCmxMHYVHzl1UL5uwKCLd24pwb+dNDk7Yg4Rf9xavInCA+9h+D+rNceQcPTCpcrrPB8ri4CgaHFjMhNg8kCCC66AXh5N6+cmHY8EwK4t4Xza37zt/KhWNDfTrJ+k7vjSjNj+XiseFMKoxatj8f1Vy4a7HCr+TQEri4c74p586GaxEbFYhPFzUgbOAj7ntdzC52rVBmR58B7uCdLyiO3rHmJZ5vyxVnQ3Xw8Gk+7MOy/73fwTlXHijnCiLFhkXZpCwDYVsWrAfmo/mWKFKkAhB6PwTAQFgxq29bPiCYmSXkCkLCFxowLYjKisUiGHhneYDkyvSUSVmXLxw7AYgYyOdw3oafZw9kyFjDY8bKZuXAdCCkZyqb9sbsy3gcsDTATcpzasW5qwBgeB9jXp0tEMSMgyuZ2jI2LFd63IOIyviubYfzN+2eHZAsCFDKDcWUnDnZil1n/UdsJ9PEL/DblcsPwvbTOKJDc8Xr/TELtfw6XtLAXkLzyuEDSfmDCELJ1k55F6E8ZiofuPueyfPyz8D66/85PCBJFsAH4c7Zyu9dG0rLwrhiIIKk2N+j/kXe4+Hty5mzIJXgIohKB9ExxQpEdL+Agyfg4s17pweSBQBpEKFPiCDGMUCxSDT7qWTfKqlSLiknZKc3g8kDy3zCc2zW+5blDT7+8PV5AC69cV8aCOIU5pWZFUyFVi86BSBsFSRLy5cav6L9pzXVyql6PzXNH03hBCGUm5PnD3wbPJXdlf2GLjC3EJixDiQ7owH+KpEIIMwTEgDbZ2yPiarP5t5nuxkScgt8knZ3pNZLS/HBSHl5K16j4AA6BdA3J8xEJgfQfdZGMyRfgDX35p4IKLsZ7uy6BQjT+1KEwiChSSzw6CSNN7p7/kUJcBM0v+7mv00UGbEJEMLiCgplh1e52ljBlClFo0Gvut1Mr1+z4xQjVewT4UIKSuWGNJpjIMaV7ydVYGbegEkY/Rl4hF5ecwcpED0jGK3JCSYlJDw+aeYAVKF/JFiwVnnQ39Q/HtvSgShaNswoAaSq5FAbrkHkxtX1/riS8wZW8YjPWmX6E94j3TdP6hHoH3Y2ZqBpoRZipejEsndllTIkjEg1CGUCrm/vk7JX0fZgb041Iy0bRTGEEeFJT9U3Kt++JQCcBRuMAGUQ75LiV0Pz8z3GwKiY/Fq0BpFkpKoS+YJXn+jPZqCQLyI/wLh2ChdsGssp6kHSDaTowQ6AcUyYHkSR9JFxnwGbP4lgzl9Z39nDuVmeN5BVrVLxJwGYtIdJ7iNFsQuxjbQsNCBG/b4K5NDBeFzBHT0aqqI/F2uV2cHIlKJK9k9SuP7B/qs9AGZGnUmVEyaKrI+MBbNiYGygBK9OLSsOrVVmzqU1P/MlvWxskh23/6LwmWhAtKAcGBXI+JAesbh/oJZDUF8GiBctbTtM3UKK/zthwPhs1EqPmClxNkYpRsYHff8Ii0PnG1ZZ2wMMJtAEANiOJwBuoZ0dng90+6MAROkDKkeTc0nTQm3srbEkhFBeIfjzswcIRP1vHDQoMmMfBNuKIEb9Nu/sQvgVHT8Ek+j9du2b5CkCQaZk9nU5IAThJAXCsZEEYsdxZtdyCldeB7CH5DECUA9L/+iTW+HnBCMAaI5Ldj4AkXR2K5Tx8lNq8tC3v7ReOXqO9K7D6T8RgBDMiDszU9QBK0sfYDZqWSuMQTLjdmDrE6b5A6S63N7t/XuG+xMKzoAD4Xq8S3SBL4QsdNuhAyt1RqU7/h4mf9SyralSAX6K/vrDYyAMraZXyoHwnLmNXCFDjRma+B86lMmHvwnAf62T7p0o6f4gzLg/CjsgjtbcDVIAopJjxBKdU7oM8kcY3XRG/hdgACh0mhwH046aAAAAAElFTkSuQmCC") no-repeat
              background-size 100% 100%
            }

            .center {
              flex: 1
              height 50px
              background url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAABiCAIAAAD1IJUpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0Q5NDE3MkVGOUY4MTFFOUI2NUJGMzBEMjM2QkZFNEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0Q5NDE3MkZGOUY4MTFFOUI2NUJGMzBEMjM2QkZFNEIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozRDk0MTcyQ0Y5RjgxMUU5QjY1QkYzMEQyMzZCRkU0QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRDk0MTcyREY5RjgxMUU5QjY1QkYzMEQyMzZCRkU0QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhVDiosAAABcSURBVHja7JFBCoAwDARX6f9f6B98QJqukKbQlerRk7kMk4ZsIRvPA8COqEQBGKDYaKb5bFyO8GnZW5D+5cd3yMOpFbS8UZOmL+CK2mEB61Zthr7ddkpepF8CDADQrERQAhkC0wAAAABJRU5ErkJggg==") repeat-y
              background-size 100% 100%
              color #e66326
              display flex
              justify-content center
              align-items center
              font-size 16px
              font-weight bold
            }
          }
        }
      }
    }

    .open {
      padding: 11px 0
      overflow-y auto

      .content {
        .already {
          padding: 8px 15px
          background #fbf8d9
          color #e38641
          line-height 20px
          font-size 14px

          .over-due-tips {
            color: $color-theme-r
          }
        }

        .title-tips {
          background #fbf8d9
          padding: 5px 15px
          text-align center
          margin-bottom: 10px
          display flex
          justify-content space-between
          align-items center

          .text {
            color #e38641
          }

          .btn {
            padding: 5px 10px
            border-radius 20px
            background $color-theme-btn-d
            color: #fff
          }
        }

        .title-info {
          .info {
            padding: 11px 15px
            background #fff
            line-height 24px

            .title-name {
              font-size 14px
              color: $color-text
              display flex
              justify-content space-between
              align-items center

              .right {
                color $color-theme-r
                font-size 12px
              }
            }

            .text {
              color: $color-text-d
            }

            .special {
              color: $color-text-l
            }
          }
        }

        .statistical {

          .list {
            background #fff
            padding: 15px 5px
            font-size 10px

            .item {
              display flex
              justify-content space-between
              align-items center

              .oil-info {
                flex: 1
                background #f3f2f2
                height 75px
                border-radius 6px
                display flex
                justify-content center
                align-items center
                flex-direction column
                line-height 24px

                & + .oil-info {
                  margin-left: 8px
                }

                .num {
                  font-size 16px
                  color: $color-theme-r
                  word-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                  text-align: center
                  line-height 22px
                }
              }

              .middle {
                box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
                background #fff

                .num {
                  font-size 24px
                }
              }
            }
          }
        }

        .title {
          padding: 10px 15px
        }
      }

      .details-list {
        overflow-y auto
        -webkit-overflow-scrolling touch
        max-height 350px

        .details-item {
          line-height 26px
          background #fff
          padding: 11px 15px
          margin-bottom: 10px

          .info {
            display flex
            justify-content space-between

            .name {
              width: 150px
              color: $color-text-d
            }

            .details-text {
              word-break: break-all;
              line-height 15px
            }
          }
        }
      }

      .more-btn {
        display flex
        justify-content center
        align-items center
        text-align center
        padding: 10px 0 11px 0
        color: $color-theme-r
        font-size 14px
      }

      .no-data {
        display flex
        justify-content center
        align-items center
        flex-direction column
        padding: 30px 0
        color: $color-text-d
        background #fff

        .img {
          padding-bottom: 20px

          img {
            width: 100px
          }
        }
      }
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
        right -5px
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
    }
  }

</style>
