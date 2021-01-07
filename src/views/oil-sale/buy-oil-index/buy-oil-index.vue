<template>
  <div class="buy-oil-index">
    <nav-top title="单位中心" class="theme_bg_blue_i theme_font_white_i" :bgImg="1" @backEvent="backEvent"
             v-if="componentName == 'My'"></nav-top>
    <!--    <nav-top title="我的企业" @backEvent="backEvent" v-else-if="componentName == 'OilExtractionCard'"></nav-top>-->
    <nav-top title="金豆商城" @backEvent="backEvent" v-else-if="componentName == 'BeanShop'"></nav-top>
    <nav-top title="批量购油" @backEvent="backEvent" v-else></nav-top>
    <nav-content class="buy-oil-index-container" :style="getContentTopStyle()">
      <div class="buy-oil-index-content" v-show="item === componentName" v-for="item in contentList">
        <component :is="item" :userInfo="userInfo" :componentName="componentName" :orderCategory="1"
                   :vipUnitUserCode="vipUnitUserCode"></component>
      </div>
      <div class="buy-oil-tab-bar">
        <div class="tab-bar" v-for="(item, index) in tabBarMenu" :key="index" @click="chooseMenu(item, index)">
          <div class="img">
            <img class="img" :src="componentName === item.id ? item.selectedIconPath : item.imgUrl" alt="">
          </div>
          <div class="text">{{item.text}}</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Index from './components/index'
  import My from './components/my'
  import BeanShop from '@/components/mall2/list/list'
  import eventBus from '@/utils/eventBus.js'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        tabBarMenu: [
          {
            text: '首页',
            id: 'Index',
            imgUrl: require('../assets/image/tab1-2.png'),
            selectedIconPath: require('../assets/image/tab1-1.png')
          },
          {
            text: '金豆商城',
            id: 'BeanShop',
            imgUrl: require('../assets/image/tab3-2.png'),
            selectedIconPath: require('../assets/image/tab3-1.png')
          },
          {
            text: '我的',
            id: 'My',
            imgUrl: require('../assets/image/tab4-2.png'),
            selectedIconPath: require('../assets/image/tab4-1.png')
          }
        ],
        componentName: 'Index',
        contentList: ['Index'],
        title: '批量购油', // 标题
        userInfo: {},
        vipUnitUserCode: undefined
      }
    },
    created() {
      this.vipUnitUserCode = this.$route.query.vipUnitUserCode;
    },
    mounted() {
      this.getVipUnitUserInfo()
    },
    methods: {
      backEvent: function () {
        this.$keepaliveHelper.deleteCache(this)
        this.$router.go(-1)
      },
      getContentTopStyle: function () {
        if (this.componentName == 'BeanShop') {
          return 'top: 0px;'
        }
        return ''
      },
      /**
       * 检查是否是会员
       * 1034 该账号暂未绑定单位用户
       * 2054 第三方用户正在审核中
       * 2055 第三方用户被锁定
       * 2057 第三方审核失败
       * 2056 重复绑定
       * state
       * 0 未绑定
       * 1 已绑定
       * 2 已锁定
       * 3 待审核
       * 4 审核拒绝
       */
      getVipUnitUserInfo() {
        this.$request.post('/app/json/user/getVipUnitUserInfo', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserCode
        }).then(res => {
          if (res.status === 0) {
            this.userInfo = res.data || {}
            eventBus.$emit('oilSaleHomeData')
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      chooseMenu(item) {
        if (this.componentName === item.id) {
          return
        }
        if (!this.contentList.includes(item.id)) {
          this.contentList.push(item.id)
        }
        this.componentName = item.id
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {
      Index,
      My,
      BeanShop
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .buy-oil-index {
    background-color: #f8f8f8 !important

    .buy-oil-index-container {
      display flex
      flex-direction column

      .buy-oil-index-content {
        flex: 1
        -webkit-overflow-scrolling touch
        overflow-y auto
      }

      .buy-oil-tab-bar {
        background #fff
        flex-shrink 0
        display flex
        justify-content space-between
        align-items center
        padding: 5px 30px
        text-align center

        .img {
          padding-bottom: 2px

          img {
            width: 20px
            display inline-block
          }
        }
      }
    }
  }
</style>
