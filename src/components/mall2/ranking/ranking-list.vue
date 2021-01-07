<template>
  <div>
    <nav-top title="排行榜" @backEvent="back"></nav-top>
    <nav-content>
      <!-- 顶部标题背景 -->
      <div class="top-tip">
        <img
        src="./images/Leaderboard-bg.png"
        alt=""
        class="leaderboard-bg">
        <div class="title-text">
          <img
            class="use-avatar"
            :src="rankingData.avtUrl"
            alt="">
          <div class="use-info">
            <div class="name">{{ rankingData.realName }}</div>
            <div class="info">员工编号：{{ rankingData.empNo }}</div>
            <div class="info-row">部门名称：{{ rankingData.depName }}</div>
          </div>
        </div>
        <img
          src="./images/tip-medal.png"
          alt=""
          class="tip-medal">
      </div>
      <!-- tab切换 -->
      <div class="tab-container">
        <div
          v-for="(item, index) in tabData"
          :key="index"
          class="tab-btn card"
          :class="{ active: index == tabIndex }"
          @click="changeTabHandler(item, index)"><span>{{ item.tabText }}</span></div>
      </div>
      <!-- 时间选择 -->
      <div class="time-box">
        <div
          class="chose-time card clearfix"
          @click="choseTime">
          <span
            v-if="fullTime"
            class="title">{{ fullTime }}</span>
          <span
            v-else
            class="title">请选择时间段</span>
          <img
            class="time-icon fr"
            src="./images/calendar.png"
            alt="">
        </div>
        <div>
          <mt-button size="small" @click="resetTsime">重置</mt-button>
        </div>
      </div>
      <!-- 内容列表 -->
      <div v-if="rankingData.referrerNum != 0">
        <div class="info-card card">
          <div class="inc-l" @click="recommendedNumber">
            <img
              class="info-icon"
              src="./images/info-l.png"
              alt="">
            <div class="in-num">{{ rankingData.referrerNum }}</div>
            <span class="in-title">推荐人数</span>
          </div>
          <div class="inc-r">
            <img
              class="info-icon"
              src="./images/info-r.png"
              alt="">
            <div class="in-num">{{ rankingData.rewardPoints }}</div>
            <span class="in-title">获得积分</span>
          </div>
        </div>
        <!-- 地区排名 -->
        <div class="area-ranking card clearfix" @click="seeTop(rankingData.countyTop)">
          <div class="fl">
            <img
              class="area-icon"
              src="./images/ranking-country.png"
              alt="">
            <span class="area-name">县公司排名</span>
          </div>
          <div class="fr">NO.<span class="big-num">{{ rankingData.countyRank }}</span></div>
        </div>
        <div class="area-ranking card clearfix" @click="seeTop(rankingData.cityTop)">
          <div class="fl">
            <img
              class="area-icon"
              src="./images/ranking-city.png"
              alt="">
            <span class="area-name">市公司排名</span>
          </div>
          <div class="fr">NO.<span class="big-num">{{ rankingData.cityRank }}</span></div>
        </div>
        <div class="area-ranking card clearfix" @click="seeTop(rankingData.provinceTop)">
          <div class="fl">
            <img
              class="area-icon"
              src="./images/ranking-pro.png"
              alt="">
            <span class="area-name">省公司排名</span>
          </div>
          <div class="fr">NO.<span class="big-num">{{ rankingData.provinceRank }}</span></div>
        </div>
      </div>
      <!-- 暂无排名 -->
      <div class="no-coupon-wrapper" v-else>
        <img class="img" src="../../../../static/image/coupon/none-icon.png" alt="">
        <p class="title theme_font_tint">暂无排名</p>
      </div>
    </nav-content>
    <!-- 开始时间 -->
    <mt-datetime-picker
      ref="startPicker"
      type="date"
      v-model="startTime"
      @confirm="confirmStartDate">
    </mt-datetime-picker>
    <!-- :startDate="new Date()" -->
    <!-- 结束时间 -->
    <mt-datetime-picker
      ref="endPicker"
      type="date"
      :startDate="startTime"
      v-model="endTime"
      @confirm="confirmEndDate">
    </mt-datetime-picker>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        tabKey: true,
        tabData: [
          {
            key: 1,
            tabText: '推荐注册人数'
          },
          {
            key: 2,
            tabText: '推荐绑卡人数'
          }
        ],
        tabIndex: 0,
        formData: {
          referrerType: 1,
          startDate: '',
          endDate: ''
        },
        startTime: new Date(),
        endTime: '',
        tabKey: '',
        fullTime: '',
        rankingData: {
          referrerNum: 0
        }
      }
    },
    mounted() {
      // 下单推荐人根据配置项来展示 0默认展示 1不展示
      if (!this.$store.state.globalConfig.recommendDisabled || !Number(this.$store.state.globalConfig.recommendDisabled)) {
        this.tabData.push({
          key: 3,
          tabText: '下单推荐人'
        })
      }
      this.initRanking(this.formData)
    },
    methods: {
      back(){
        this.$keepaliveHelper.deleteCache(this)
        this.$router.go(-1)
      },
      seeTop(arr) {
        this.$router.push({
          path: '/mall2/recommen_list',
          query: { arr: arr ,status: this.tabKey}
        })
      },
      recommendedNumber(){
        this.$router.push({path: '/mall2/recommen_details',query: {refererType: this.formData.referrerType}})
      },
      // 选择时间
      choseTime() {
        this.$refs.startPicker.open()
      },
      // 开始时间确定
      confirmStartDate(time) {
        this.startTime = time
        this.$refs.endPicker.open()
      },
      // 结束时间确定
      confirmEndDate(time) {
        this.endTime = time
        this.fullTime = this.startTime.toLocaleDateString().replace(/\//g, '-') + ' 至 ' + this.endTime.toLocaleDateString().replace(/\//g, '-')
        this.formData = {
          referrerType: this.formData.referrerType,
          startDate: this.startTime.toLocaleDateString().replace(/\//g, '-') + ' 00:00:00',
          endDate: this.endTime.toLocaleDateString().replace(/\//g, '-') + ' 23:59:59'
        }
        this.initRanking(this.formData)
      },
      resetTsime(){
        this.endTime = ''
        this.fullTime = ''
        this.formData = {
          referrerType: this.formData.referrerType,
          startDate: '',
          endDate: ''
        }
        this.initRanking(this.formData)
      },
      // 初始化
      initRanking(formData) {
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          referrerType: formData.referrerType,
          startDate: formData.startDate,
          endDate: formData.endDate
        }
        this.$http.post('/app/json/user/getReferrerRank', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.rankingData = data.data
            this.$Loading.close()
          } else {
            this.$Loading.close()
            this.$Toast(data.info)
          }
        })
      },
      // tab切换
      changeTabHandler(item, index) {
        this.tabKey = item.key,
        this.tabIndex = index
        this.fullTime = ''
        this.formData = {
          referrerType: item.key,
          startDate: '',
          endDate: ''
        }
        this.initRanking(this.formData)
      }
    },
    components: {}
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  // 工具类
  gray-color = #A0A1A1
  .fl {
    float left
  }
  .fr {
    float right
  }
  .dis-block {
    display block
  }
  .clearfix:after {
    content ''
    display block
    clear both
    visibility hidden
    height 0
    font-size 0
  }
  .card {
    box-shadow 0 0 5px #ccc
    border-radius 6px
  }

  // 顶部标题背景
  .top-tip {
    .leaderboard-bg {
      width 100%
    }
    .title-text {
      position absolute
      left 0
      top 0
      padding-top 30px
      padding-left 20px
      display flex
      flex-wrap nowrap
      .use-avatar {
        width 60px
        height 60px
        border-radius 50%
      }
      .use-info {
        padding-left 12px
        color #fff
        .name {
          font-size 18px
          line-height 30px
        }
        .info {
          font-size 13px
          line-height 30px
          color #F7DE9E
        }
        .info-row{
          font-size 13px
          color #F7DE9E
        }
      }
    }
    .tip-medal {
      position absolute
      right 40px
      top 0
      width 90px
    }
  }
  // tab切换
  .tab-container {
    display flex
    flex-wrap nowrap
    justify-content space-around
    align-items flex-end
    position relative
    z-index 10
    margin-top -32px
    height 65px
    .tab-btn {
      width 31%
      height 60px
      background linear-gradient(to top left, #fed3a2, #c6b382)
      text-align center
      line-height 60px
      color #885F22
      font-size 15px
      position relative
      transition height .2s
      span {
        display block
        width 100%
        height 60
        line-height 60px
        position absolute
        left 0
        bottom 0
      }
      &.active {
        height 65px
        background #fff
        color #000
      }
    }
  }
  // 时间选择
  .time-box{
    display flex
    justify-content space-around
    align-items center
    margin 15px auto 0
    /deep/ .mint-button--small{
      height 36px
      margin-left -6px
    }
    .chose-time {
      padding 10px
      width 82%
      .title {
        font-size 14px
        line-height 20px
      }
      .time-icon {
        display block
        width 20px
        height 20px
      }
    }
  }
  // 内容列表
  .info-card {
    width 97%
    margin 15px auto 0
    padding 16px
    display flex
    flex-wrap nowrap
    .inc-l,
    .inc-r {
      text-align center
      width 50%
      height 100%
    }
    .inc-l {
      border-right .5px solid #ccc
    }
    .info-icon {
      width 26px
      height 26px
    }
    .in-num {
      font-size 18px
      color #B42433
      font-weight 700
      margin 8px 0
    }
    .in-title {
      font-size 12px
    }
  }
  // 地区排名
  .area-ranking {
    width 97%
    margin 15px auto 0
    padding 13px
    .fr {
      line-height 20px
      font-size 10px
      .big-num {
        font-size 14px
        font-weight 700
      }
    }
    .area-icon {
      width 20px
      height 20px
    }
    .area-name {
      vertical-align top
      display inline-block
      line-height 20px
      padding-left 8px
      font-size 14px
    }
  }
  .no-coupon-wrapper {
    position: absolute
    top: 50%;
    left: 50%;
    transform translate3d(-50%, 0, 0)
    text-align: center
    .img {
      width 90px;
    }
    .title {
      padding-top 24px;
      font-size: 16px;
      color: #5a5a5a
    }
  }
</style>
