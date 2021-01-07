<template>
  <div class="open-allPackage" @click="cancelClickBtn">
    <nav-top title="开通套餐" @backEvent="$router.go(-1)">
      <i class="iconfont mall-gengduo" @click.stop="dropmenuShow = !dropmenuShow"></i>
    </nav-top>
    <nav-content class="open-allPackage-container">
      <!--      右上角弹框-->
      <div class="dropmenu" v-show="dropmenuShow" @click.stop>
        <div class="dropmenu-item" v-for="(item, index) in tabList" :key="index" @click="linkTo(item)">{{item.text}}</div>
      </div>
      <div class="info">
        <div class="main">
          <div class="card special">
            <div class="left">套餐类型</div>
            <div class="right" @click="show = true">{{name}}&nbsp;<van-icon size="18px" name="ellipsis"/>
            </div>
          </div>
          <div class="card change date">
            <div class="left">套餐选择</div>
            <ul class="type-list">
              <li class="type-item" @click="changeType(item, index)" :class="{active: ind == index}"
                  v-for="(item, index) in details" :key="index">
                <div class="text">{{item.duration}}天</div>
              </li>
            </ul>
          </div>
          <!--          个人-->
          <div class="card" v-if="type == 1 || type == 3">
            <div class="left">开通日期</div>
            <div class="right">{{showDate}}</div>
          </div>
          <!--          家庭-->
          <div class="table-view people" v-else @click="showPeople = true">
            <div class="table-view-cell">
              <div class="table-view-cell-text">选择套餐人数</div>
              <div class="table-view-cell-arrow">{{peopleNum}}</div>
            </div>
          </div>
          <div class="card special code">
            <div class="left">邀请码</div>
            <div class="right">
              <input class="inp" type="text" placeholder="非必填" v-model="rfrCode">
            </div>
          </div>
          <div class="card change">
            <div class="left">套餐优惠规则</div>
            <div class="content" v-html="desc"></div>
          </div>
        </div>
        <div class="btn" @click="openBtn">{{type == 1 || type == 3 ? '一键开通': '邀请开通'}}</div>
        <div class="wx-show">
          <van-popup v-model="showWxTips">
            <div class="jt">
              <img src="./image/img3.png" alt="">
            </div>
            <div class="wx-tips-show">
              <div class="wx-tips-content">
                <div class="text1">1.点击右上角</div>
                <div class="text2">
                  2.点击
                  <span class="img"><img src="./image/img1.png" alt=""></span>
                  发送给朋友
                </div>
              </div>
            </div>
          </van-popup>
        </div>
        <!--        套餐类型选择弹框-->
        <van-popup v-model="show" position="bottom">
          <van-picker show-toolbar
                      title="套餐类型选择"
                      :columns="columns"
                      @cancel="show = false"
                      @confirm="onConfirm"
          />
        </van-popup>
        <!--        套餐人数选择弹框-->
        <van-popup v-model="showPeople" position="bottom">
          <van-picker show-toolbar
                      title="开通人数选择"
                      :columns="columnsPeople"
                      @cancel="showPeople = false"
                      @confirm="onConfirmPeople"
          />
        </van-popup>
        <!--        家庭 分析邀约弹框-->
        <van-popup v-model="showShare" position="bottom">
          <div class="share-content">
            <div class="title">邀请好友一同开通家庭套餐</div>
            <div class="share-main" @click="shareBtn">
              <div class="img">
                <img src="../../../views/oil-package/image/icon-weixin.png" alt="">
              </div>
              <div class="text">微信好友</div>
            </div>
            <div class="btn" @click="showShare = false">取消</div>
          </div>
        </van-popup>
      </div>
      <div class="tab">
        <div class="item" v-for="(item, index) in tabList" :key="index">
          <div class="text" @click="linkTo(item)">{{item.text.substr(0, 2)}}<br />{{item.text.substr(2, 2)}}</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Jwx from "../utils/jwx"
  import utils from "@/utils/util"
  import Config from '@/api/config'



  export default {
    data() {
      return {
        tabList: [
          {text: '套餐说明', type: 1},
          {text: '我的邀约', type: 2},
          {text: '历史签约', type: 3},
        ],
        dropmenuShow: false, // 右上角点点点
        ind: 0,
        date: '', // 日期
        showDate: '', // 显示日期
        columns: [], // 套餐类型
        columnsPeople: ['2人', '3人'], // 套餐人数
        show: false, // 套餐类型选择弹框
        showPeople: false, // 套餐人数选择弹框
        showWxTips: false, // 微信分享提示
        radio: 1,
        showShare: false, // 家庭 分析邀约弹框
        type: 1, // 1个人 2家庭 3阶梯
        allPackage: {}, // 所有套餐的内容
        desc: '', // 说明
        shareDetails: {}, // 分享的内容 套餐类型主分类
        details: [], // 每个套餐类型下的套餐时长列表
        packageRefuel: '', // 选择的具体时长套餐
        peopleNum: '', // 套餐人数
        name: '', // 套餐名字
        // isnativetop: '',
        rfrCode: '', // 邀请码
        shareId: ''
      }
    },
    mounted() {
      // this.isnativetop = Cookie.get('isnativetop')
      // this.date = utils.getNextMinutes()
      this.showDate = utils.getMyDate(new Date())
      console.log(utils.getMyDate(new Date()))
      this.type = this.$route.query.type
      this.id = this.$route.query.id
      this.queryPackageRefuelTypeList()
    },
    methods: {
      share() {
        console.log(this.shareDetails)
        console.log(`${location.origin}${Config.shareUrl}/redirect?shareId=${this.shareId}`)
        Jwx.share(
          this.shareDetails.name,
          `${location.origin}${Config.shareUrl}/redirect?shareId=${this.shareId}`,
          this.shareDetails.pic,
          '好友邀请您一起来开通加油家庭套餐啦，加油返利更省钱'
        )
      },
      queryPackageRefuelTypeList() {
        // 查询套餐列表
        this.$request.post('/app/json/app_package_refuel/queryPackageRefuelTypeList', {
        }).then(res => {
          if (res.status === 0) {
            this.allPackage = res.data
            this.dealData()
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      cancelClickBtn() {
        this.dropmenuShow = false
        this.tabList.forEach(tab => {
          tab.showClick = false
        })
      },
      signPackageRefuel() {
        let overdueDate = this.$route.query.overdueDate
        if (overdueDate) {
          this.date = utils.getNextMinutesValOne(overdueDate)
        } else {
          this.date = utils.getNextMinutes()
        }
        console.log(this.date)
        // 开通套餐
        this.$request.post('/app/json/app_package_refuel/signPackageRefuel', {
          packageRefuelId: this.packageRefuel.id, // 套餐id
          startDate: this.date, // 开通时间
          rfrCode: this.rfrCode, // 邀请码
          rfrCodeType: '1', // 邀请码类型 1手动 2扫一扫
          id: '', // 邀请记录id -- 家庭
          inviteeIds: '' // 被邀请人id包含邀请人  -- 家庭
        }).then(res => {
          if (res.status === 0) {
            this.$router.push({path: '/success', query: {overdueDate: overdueDate}})
          } else {
            this.$Toast(res.info ? res.info : '开通失败')
          }
        })
      },
      inviteSignPackageRefuel() {
        let overdueDate = this.$route.query.overdueDate
        if (overdueDate) {
          this.date = utils.getNextMinutesValOne(overdueDate)
        } else {
          this.date = utils.getNextMinutes()
        }
        console.log(this.date)
        // 邀请开通套餐
        this.$request.post('/app/json/app_package_refuel/inviteSignPackageRefuel', {
          packageRefuelId: this.packageRefuel.id, // 套餐id
          startDate: this.date, // 开通时间
          rfrCode: this.rfrCode, // 邀请码
          rfrCodeType: '1', // 邀请码类型 1手动 2扫一扫
          signUpNum: this.peopleNum // 开通人数
        }).then(res => {
          if (res.status === 0) {
            // 判断是微信还是app
            this.shareId = res.data.id
            console.log(this.shareId)
            if (this.$store.state.webtype == 2) {
              // 微信
              this.showWxTips = true
            }
            this.share() // 分享方法
          } else {
            this.$Toast(res.info ? res.info : '邀请失败')
          }
        })
      },
      shareBtn() {
        // 去分享
        this.inviteSignPackageRefuel()
      },
      dealData() {
        console.log(this.allPackage)
        this.allPackage.forEach(item => {
          this.columns.push({
            text: item.name,
            id: item.id
          })
          console.log(this.$route.query.id)
          if (this.id == item.id) {
            console.log('我是item')
            console.log(item)
            this.shareDetails = item // 套餐
            this.columnsPeople = this.shareDetails.canSignUpNum.split(',')
            this.details = this.shareDetails.packageRefuelList
            this.packageRefuel = this.details[0] // 具体套餐时长
            this.name = this.shareDetails.name
            this.desc = this.packageRefuel.desc
            this.peopleNum = this.columnsPeople[0]
            console.log(this.packageRefuel)
          }
        })
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
      changeType(item, index) {
        // 切换套餐时长
        console.log(item)
        this.desc = item.desc
        this.ind = index
        this.packageRefuel = item
      },
      onConfirm(value) {
        // 确定选择套餐类型
        this.show = false
        this.type = value.type
        this.id = value.id
        this.columns = []
        this.ind = 0
        this.dealData()
      },
      onConfirmPeople(value) {
        // 确定选择套餐人数
        this.peopleNum = value
        this.showPeople = false
      },
      openBtn() {
        // 一键开通 前往邀约按钮
        if (this.type == 2) {
          this.showShare = true
        } else {
          this.signPackageRefuel()
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .open-allPackage {
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

    .open-allPackage-container {
      padding: 11px 0
      overflow-y auto

      .info {
        display flex
        flex-direction column

        .main {
          flex: 1
          overflow-y auto
          -webkit-overflow-scrolling touch
          padding-bottom: 30px

          .date {
            padding: 15px 15px 15px 5px !important
            .left {
              padding-left 10px !important
              color: $color-text-d !important
            }
          }

          .people {
            padding: 5px 0
            background #fff
            margin-bottom: 10px
            color: $color-text-d
          }

          .card {
            margin-bottom: 10px
            padding: 15px
            display flex
            justify-content space-between
            align-items center
            background #fff

            .left {
              color: $color-text-d
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

          .special {
            padding: 11px 15px
          }

          .people-num {
            padding: 10px 15px
          }

          .code {
            padding: 8px 15px
          }

          .change {
            justify-content left
            flex-direction column
            align-items inherit

            .left {
              padding-bottom: 10px
            }

            .left {
              color: $color-text
            }

            .content {
              line-height 20px
              color: $color-text-d
              >>> img {
                width: 100%
              }
            }

            .type-list {
              width 100%

              .type-item {
                padding: 0 0 10px 10px
                text-align center
                float: left;
                width: 33.33%

                .text {
                  border-radius 6px
                  border: 1px solid #f6f6f6
                  font-size 14px
                  padding: 12px 0
                  background #f6f6f6
                  color: $color-text-d
                }
              }

              .active {
                .text {
                  background #fde9ea
                  color: #f75757
                  border-color: #f89191
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
  .tab {
    position absolute
    right: 0
    top: 15px
    z-index: 1000
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

  .wx-show {
    /deep/ .van-popup--center {
      top: 20%
    }
    /deep/ .van-popup {
      background none
      width 80%
    }
    .jt {
      text-align right
      padding-bottom: 15px
      img {
        width 60px
      }
    }
    .wx-tips-show {
      .wx-tips-content {
        background #fff
        padding: 20px 15px
        border-radius 4px
        .text2 {
          padding-top: 15px
          display flex
          justify-content left
          align-items center
          img {
            width: 20px
          }
        }
      }
    }
  }

</style>
