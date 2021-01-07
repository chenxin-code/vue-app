<template>
  <div class="container">
    <nav-top class="reset-nav-top" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="top-info">
        <div
          class="set-meal-info"
          @click="viewPackageDetail"
          v-if="isShowPackageInfo">
          <div class="tmeal-info">
            <div class="left">
              <p class="set-meal-name">{{ indexPackageList.orderDetailModel.packageRefuelName }}</p>
              <p class="state">签约中</p>
            </div>
            <div class="right">
              查看详情
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="bmeal-tip">温馨提示：单人同一时间只可开通一个套餐噢~</div>
        </div>
        <van-tabs
          v-if="indexPackageList.isJoinCluster"
          class="reset-tabs"
          :border="false"
          :line-width="56"
          color="#fff"
          title-inactive-color="#fff"
          title-active-color="#fff"
          v-model="activeTab"
          @change="changeTabs">
          <van-tab title="合约套餐" :name="0"></van-tab>
          <van-tab title="基础套餐" :name="1"></van-tab>
        </van-tabs>
      </div>
      <van-list
        class="set-meal-container"
        v-model="isLoading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="200"
        @load="loadMore">
        <ul class="set-meal-list">
          <li
            v-for="(item, index) in setMealList"
            :key="index"
            class="item"
            @click.stop="setMealClick(item)">
            <div class="table-view-cell" v-if="activeTab == 1">
              <div class="table-view-cell-text">
                <div class="left">
                  <div class="top">
                    <div class="img">
                      <img :src="item.pic" alt="">
                    </div>
                    <div class="title">{{item.name}}</div>
                  </div>
                  <div class="bottom">
                    <div class="name">套餐类别</div>
                    <ul class="type-list">
                      <li class="type-item" v-for="(item2, index) in item.packageRefuelList" :key="index">{{item2.duration}}天</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="table-view-cell-arrow">前往开通<van-icon name="arrow" /></div>
            </div>
            <img :src="item.pic" alt="" class="set-meal" v-else>
          </li>
        </ul>
      </van-list>
    </nav-content>
    <div class="invite-btn" :class="{ active: isShowInviteBtn }" @click.stop="inviteClick">我的邀约</div>
    <div class="invite-btn2" :class="{ active: isShowInviteBtn }" @click.stop="toMealDesc">套餐说明</div>
    <!-- 已经开通套餐弹窗 -->
    <van-popup v-model="isShowMealPopup" class="has-meal-popup">
      <p class="content">抱歉，您已开通{{ indexPackageList.orderDetailModel.packageRefuelName }}套餐需退出当前套餐方可开通本套餐</p>
      <div class="btn-container">
        <van-button
          color="#fff"
          class="cancel-btn"
          @click="isShowMealPopup = false"
          type="primary">取消</van-button>
        <van-button
          color="#F02C2D"
          class="confirm-btn"
          @click="viewPackageDetail"
          type="primary">查看已开通套餐</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeTab: 0,
      isLoading: false,
      finished: false,
      isShowInviteBtn: false,
      isShowPackageInfo: false,
      isShowMealPopup: false,
      setMealList: [],
      indexPackageList: {
        // 是否加入机构群组
        isJoinCluster: false,
        // 合约套餐列表
        contractList: [],
        // 加油套餐列表
        refuelList: [],
        // 已开通合约信息
        orderDetailModel: {},
      }
    }
  },
  mounted() {
    this.$Loading.open()
    this.$http.post('/app/json/app_package_refuel/queryIndexPackageList', {}).then(res => {
      this.$Loading.close()
      let data = res.data
      if (data.status == 0) {
        this.indexPackageList = data.data || {}
        
        // 是否存在已开通的套餐
        if (this.indexPackageList.orderDetailModel) {
          this.isShowPackageInfo = true
        } else {
          this.isShowPackageInfo = false
        }

        // 是否已加入机构群组
        if (this.indexPackageList.isJoinCluster) {
          this.setMealList = data.data.contractList || []
          this.activeTab = 0
          this.isShowInviteBtn = false
        } else {
          this.setMealList = data.data.refuelList || []
          this.activeTab = 1
          this.isShowInviteBtn = true
        }


        this.isLoading = false
        this.finished = true
      } else {
        this.$Toast(data.info)
      }
    }).catch(err => {
      this.$Loading.close()
      this.$Toast(`queryIndexPackageList err ${err}`)
    })
  },
  methods: {
    loadMore() {
      // console.log('执行了')
    },
    changeTabs(name) {
      if (name == 1) {
        this.isShowInviteBtn = true
        this.setMealList = this.indexPackageList.refuelList || []
      } else {
        this.isShowInviteBtn = false
        this.setMealList = this.indexPackageList.contractList || []
      }
    },
    setMealClick(item) {
      if (this.isShowPackageInfo) {
        // 已存在签约套餐
        this.isShowMealPopup = true
      } else {
        if (this.activeTab == 0) {
          // 合约套餐
          this.$router.push({
            name: 'contract-package',
            params: {
              packageInfo: JSON.stringify(item)
            }
          })
        } else {
          // 加油套餐
          this.$router.push({
            path: '/open-package',
            query: {
              type: item.packageType,
              id: item.id
            }
          })
        }
      }
    },
    // 我的邀约
    inviteClick() {
      this.$router.push({
        path: '/my-invitation'
      })
    },
    // 套餐说明
    toMealDesc() {
      this.$router.push({
        path: '/instructions'
      })
    },
    // 查看套餐详情
    viewPackageDetail() {
      // 100：合约套餐  小于100：加油套餐
      if (this.indexPackageList.orderDetailModel.packageType < 100) {
        this.$router.push({
          path: '/oil-package',
          query: {
            noCheckJoinContract: 1
          }
        })
      } else {
        this.$router.push({
          path: '/contract-package-detail',
          query: {
            packageRefuelOrderId: this.indexPackageList.orderDetailModel.packageRefuelOrderId
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .invite-btn,
    .invite-btn2 {
      font-size 13px;
      color #fff;
      background-color #F02C2D;
      height 30px;
      line-height 30px;
      border-radius 15px 0 0 15px;
      position fixed;
      top 55%;
      padding 0 10px 0 15px;
      z-index 200;
      transition all .4s linear;
      right -100%;
      &.active {
        right 0;
      }
    }
    .invite-btn2 {
      top 50%;
    }

    .nav-content {
      background-color #F6F6F6;
      display flex;
      flex-direction column;
    }
    /deep/ .reset-nav-top {
      &.nav-top {
        background-image linear-gradient(#FFC283, #FFA35C) !important;
        .title-div {
          color #fff;
        }
        .mall-fanhui {
          color #fff;
        }
      }
    }
    .top-info {
      background-color #FFA35C;
      .set-meal-info {
        margin 10px 10px 5px;
        padding 10px;
        background-color rgba(255, 255, 255, .6);
        border-radius 5px;
        .tmeal-info {
          display flex;
          justify-content space-between;
          .left {
            display flex;
            align-items flex-end;
            font-size 16px;
            color #333;
            .set-meal-name {
              font-weight 500;
            }
            .state {
              font-size 13px;
              font-weight 500;
              padding-left 5px;
            }
          }
          .right {
            display flex;
            align-items center;
            font-size 13px;
            color #666;
          }
        }
        .bmeal-tip {
          font-size 13px;
          color #F02C2D;
          line-height 15px;
          margin-top 10px;
        }
      }
      /deep/ .reset-tabs {
        padding-bottom 10px;
        padding-top 5px;
        .van-tabs__nav {
          background-color #FFA35C;
        }
        .van-tabs__wrap {
          height 32px;
        }
        .van-tab__text {
          font-size 15px;
          font-weight 500;
        }
      }
    }

    .set-meal-container {
      flex 1;
      overflow-y auto;
      .set-meal-list {
        .item {
          margin-top 10px;
          .set-meal {
            display block;
            width 100%;
            height 85px;
            background-color #fff;
          }

          .table-view-cell {
            padding: 0.293333rem 0.4rem;
            background: #fff;
            position: relative;
            overflow: hidden;
            border-radius: 0.133333rem;
          }
          .table-view-cell-text {
            display flex;
            align-items center;
            justify-content space-between;
          }
          .left {
            .top, .bottom {
              display flex
              justify-content left
              align-items center
            }
            .top {
              padding-bottom: 10px
              .img {
                width: 30px
                height: 30px
                border-radius 50%
                overflow hidden
                margin-right: 5px
                img {
                  width 100%
                  height 100%
                }
              }
              .text {
                font-size 14px
                color: $color-text
              }
            }
            .bottom {
              .name {
                color: $color-text-d
                font-size 12px
                padding-right: 5px
              }
              .type-list {
                display flex
                justify-content left
                align-items center
                font-size 10px
                .type-item {
                  margin-right: 10px
                  border-radius 20px
                  border: 1px solid #f89191
                  padding: 4px 7px
                  background #fde9ea
                  color: #f89191
                }
                .type-item:nth-child(3n-2) {
                  background #fff2e9
                  border-color  #ffc390
                  color: #f58f3a
                }
                .type-item:nth-child(3n-1) {
                  background #e9f2fd
                  border-color #93c1f7
                  color: #2f83e6
                }
                .type-item:nth-child(3n) {
                  background #fde9ea
                  border-color #f89191
                  color: #e66464
                }
              }
            }
          }
          .table-view-cell-arrow {
            color: $color-text-d
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0.373333rem;
            display flex;
            align-items center;
          }
        }
      }
    }

    .has-meal-popup {
      width 280px;
      border-radius 6px;
      .content {
        font-size 13px;
        color #333;
        line-height 22px;
        padding 46px 49px 0;
        text-align center;
      }
      .btn-container {
        display flex;
        box-shadow 0 0 10px #ddd;
        margin-top 25px;
        .confirm-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #fff;
          }
        }
        .cancel-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #333;
          }
        }
      }
    }
  }
</style>