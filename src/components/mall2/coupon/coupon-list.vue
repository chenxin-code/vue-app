<template>
  <div class="coupon-list">
    <nav-top title="优惠券" @backEvent="backEvent">
      <span class="activate-btn" v-if="$store.state.globalConfig.appCouponListActBtnDisabled != 1"
            @click="showActivateModel = true">激活</span>
    </nav-top>
    <nav-content class="coupon-center" v-if="menuList.length">
      <ul class="coupon-menu" v-if="$store.state.globalConfig.app_crm_coupon_enable == 1 && $store.state.webtype != 7">
        <li :class="couponMenuListIndex == index ? 'active' : ''" v-for="(item, index) in couponMenuList" :key="index"
            @click="couponHandle(item, index)">{{item.title}}<span v-if="item.type == 'app'">({{appcouponTotal}})</span>
        </li>
      </ul>
      <div class="coupon-content" v-if="couponMenuListIndex == 0">
        <ul class="menu-list">
          <!--选中active-->
          <li class="menu-item" v-for="(item, index) in menuList" :key="index" :class="{active: curType === item.url}"
              @click="chooseHandler(item.url)">
              <span class="text theme_standard_bdr_i"
                    :class="{theme_standard_font_i: curType === item.url}">{{item.name}}（{{item.num}}）</span>
          </li>
        </ul>
        <ul class="sub-menu-list" v-show="curType === unusedValue">
          <!--未使用时展示-->
          <horizontal-scroll :dataList='couponTypeList'>
            <!--选中active-->
            <li class="sub-menu-item" :class="{active: curCateAlias === item.cateAlias}"
                @click="subMenuHandler(item.cateAlias)" v-for="(item, index) in couponTypeList">
            <span class="text"
                  :class="{'theme_standard_bdr_i theme_standard_font_i theme_light_bg_i': curCateAlias === item.cateAlias}">{{item.cateName}}({{item.cateCnt}})</span>
            </li>
          </horizontal-scroll>
        </ul>
        <div class="coupon-list-wrapper" :class="{'no-padding': !hasBtmBtn}" v-show="hasGetData">
          <!--<div class="coupon-list"
               v-infinite-scroll="loadMore"
               infinite-scroll-disabled="loading"
               :infinite-scroll-immediate-check="true"
               infinite-scroll-distance="20"
               ref="couponList"
               v-if="couponList.length">-->
          <scroll ref="scroll" class="coupon-list-scroll" :listenScroll="true" :probe-type="3" @scroll="scroll"
                  :hasMore="hasMore"
                  :pullUpLoad="true"
                  @pullingUp="loadMore" :data="couponList" :pullDownRefresh="true" @pullingDown="reset">
            <template v-if="curType === 'getExpiredCoupons'">
              <template v-for="(item, index) in couponList">
                <van-swipe-cell :right-width="65">
                  <coupon :couponLayoutType="isGroupCoupon ? 2 : 1" :disabled="disabled"
                          :used="curType === 'getUsedCoupons'"
                          :item="item" :index="index"
                          class="coupon-item"></coupon>
                  <div class="delete theme_bg_red" @click="deleteCoupon(item)" slot="right">
                    <span class="text">删除</span>
                  </div>
                </van-swipe-cell>
              </template>
            </template>
            <template v-else>
              <coupon :couponLayoutType="isGroupCoupon ? 2 : 1" v-for="(item, index) in couponList" :disabled="disabled"
                      :used="curType === 'getUsedCoupons'"
                      :key="index" :item="item" :index="index"
                      class="coupon-item" @load="resetCoupon"></coupon>
            </template>
          </scroll>
          <div class="no-coupon-wrapper" v-if="!couponList.length">
            <img class="img" src="../../../../static/image/coupon/none-icon.png" alt="">
            <p class="title theme_font_tint">没有券？</p>
            <p class="sub-title theme_font_tint">去领券中心看看吧</p>
          </div>
          <div class="tip" v-if="disabled">以上是近期{{curType == 'getExpiredCoupons' ? '已过期' : '已使用'}}的优惠券</div>
        </div>
        <div class="footer-btn" v-if="hasBtmBtn">
          <router-link to="/get_coupon" class="btn" v-if="noGetCoupon == ''">领更多好券</router-link>
          <router-link to="/coupon_market" class="btn">积分换券</router-link>
        </div>
      </div>
      <div class="coupon-content" v-else>
        <!--        <iframe :src="crmUrl" frameborder="0" height="100%" width="100%"></iframe>-->
      </div>
    </nav-content>
    <van-popup v-model="showActivateModel">
      <div class="activate-model">
        <div class="title">激活码</div>
        <div class="content">
          <input v-model="dynamicCode" class="form-control" type="text" placeholder="请输入激活码">
          <span @click="scanCodeFunc" style="margin-left:10px">
            <img src="static/image/setting/icon-scan.png" class="see-icon"/>
          </span>
        </div>
        <div class="btn theme_standard_bg theme_standard_font" style="margin-left:0;margin-top:15px"
             @click="activateHandler">激活
        </div>
      </div>
    </van-popup>
    <div class="xuanfu" id="moveDiv" ref="moved" @mousedown="down" v-if="couponsView" @touchstart="down"
         @mousemove.prevent="move"
         @touchmove.prevent="move" @mouseup="end" @touchend="end">
      <img class="imgt1" src="../../../../static/image/coupon/t1.png" alt="" @click="tocoupons">
      <img class="imgt2" src="../../../../static/image/coupon/t2.png" @click="closeBtn" alt="">
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import Coupon from './base/coupon.vue'
  import Scroll from '@/components/base/scroll/scroll'
  import {mapGetters} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        appcouponTotal: 0,
        couponMenuListIndex: 0,
        couponMenuList: [{
          title: 'APP优惠券', // bug 27096 要求修改。
          type: 'app'
        }, {
          title: this.$store.state.globalConfig.crmcoupons_title || '便利店优惠券',
          type: 'crm'
        }],
        noGetCoupon: '',
        showActivateModel: false,
        dynamicCode: '',
        hasGetData: false, // 是否获取数据
        couponTypeList: [], // 券类型列表
        couponList: [], // 券列表
        menuList: [], // 导航
        page: 0,
        rows: 10,
        hasMore: true,
        loading: false,
        scrollY: 0,
        _scrollY: 0,
        isFirstEnter: true, // 是否首次进入
        curType: '', // 要查询的列表 未使用：getUnusedCouponsWithCols 已使用：getUsedCoupons 已过期：getExpiredCoupons
        curCateAlias: 'quanbu', // 二级导航当前选择项
        isGroupCoupon: false, // 是否是组合券形式展示，如果路由是coupon_list2则是组合券，因为路由已经正在使用中，所有目前是两个路由指向同一个页面，根据这个字段判断
        unusedValue: '',
        flags: false,
        position: {
          x: 0,
          y: 0
        },
        nx: '',
        ny: '',
        dx: '',
        dy: '',
        xPum: '',
        yPum: '',
        couponsView: false, //是否显示赚好劵入口
        crmUrl: '',
        hasBtmBtn: true,
      }
    },
    mounted() {
      this.loadIndex()
      this.getCouTypeCateCnt()
    },
    created() {
      this.noGetCoupon = this.$store.state.globalConfig.coupon_list_no_get_coupon || ''
      if (this.$store.state.globalConfig.hideCouponListBtmBtn == 1) {
        this.hasBtmBtn = false
      } else {
        this.hasBtmBtn = true
      }
    },
    activated() {
      if (!this.isFirstEnter) {
        this.backScroll()
      }
    },
    beforeRouteLeave(to, from, next) {
      this._scrollY = this.scrollY
      // if (
      //   to.path != '/questionlist' &&
      //   to.path != '/service/questionlist' &&
      //   to.path != '/equity_card/equityList' &&
      //   to.path != '/user_center/shareList' && 
      //   to.path != '/coupon_detail2'
      // ) {
      //   this.$keepaliveHelper.deleteCache(this)
      // }
      next()
    },
    computed: {
      disabled() {
        return this.curType === 'getUsedCoupons' || this.curType === 'getExpiredCoupons'
      },
      ...mapGetters(['vipUnitUser'])
    },
    methods: {
      // 导航栏切换
      couponHandle(item, index) {
        this.couponMenuListIndex = index
        if (item.type == 'crm') {
          this.$request.post('/app/json/home/getExoLoginUrl', {
            token: this.$store.state.login.token,
            sysTag: 'crm',
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId,
          }).then(res => {
            if (res.status === 0) {
              this.crmUrl = res.data || ''
              this.$bridgefunc.customPush({
                path: this.crmUrl,
                isnativetop: '1'
              });
              // this.biddingPriceList = res.data
            } else {
              this.$Toast(res.info)
            }
          })
        }
      },
      resetCoupon() {
        this.reset();
        this.getMyCouponCnt()
        this.getCouTypeCateCnt()
      },
      scanCodeFunc() {
        this.$bridgefunc.scanCode(res => {
          this.dynamicCode = res.code
          this.activateHandler()
        })
      },
      backEvent() {
        if (this.$route.query.type == 'subject') {
          this.$router.push({
            path: '/questionlist'
          })
        } else if (this.$route.query.type == 'serviceSubject') {
          this.$router.push({
            path: '/service/questionlist'
          })
        } else if (this.$route.query.type == 'equity_car') {
          this.$router.push({
            path: '/equity_card/equityList'
          })
        } else {
          this.$router.go(-1)
        }
      },
      tocoupons() {
        this.$router.push({
          path: '/user_center/shareList'
        })
      },
      closeBtn() {
        this.couponsView = false
      },
      // 实现移动端拖拽
      down() {
        this.flags = true;
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.dx = moveDiv.offsetLeft;
        this.dy = moveDiv.offsetTop;
      },
      move() {
        if (this.flags) {
          var touch;
          if (event.touches) {
            touch = event.touches[0];
          } else {
            touch = event;
          }
          this.nx = touch.clientX - this.position.x;
          this.ny = touch.clientY - this.position.y;
          this.xPum = this.dx + this.nx;
          this.yPum = this.dy + this.ny;

          var right = document.body.clientWidth - this.$refs.moved.offsetWidth;
          var bottom = document.body.clientHeight - this.$refs.moved.offsetHeight;
          if (this.xPum < 0) this.xPum = 0;
          if (this.yPum < 0) this.yPum = 0;
          if (this.xPum > right) {
            this.xPum = right;
          }
          if (this.yPum > bottom) this.yPum = bottom;
          moveDiv.style.left = this.xPum + "px";
          moveDiv.style.top = this.yPum + "px";
          //阻止页面的滑动默认事件
          document.addEventListener("touchmove", function (event) { // 1.2 如果碰到滑动问题，请注意是否获取到 touchmove
            event.stopPropagation(); // 如果没有引入jq 就用 stopPropagation()
          }, false);
        }
      },
      //鼠标释放时候的函数
      end() {
        this.flags = false;
      },
      loadIndex() {
        let that = this
        this.$http.post('/app/json/fission_activity/getShareUsedCoupons', {}).then(
          res => {
            if (res.data.result === 'success') {
              let list = res.data.data || []
              if (list.length > 0) {
                that.couponsView = true
              }
            }
          },
          error => {
            this.$Toast(res.data.info)
          }
        )
      },
      pageInit() {
        this.getMyCouponCnt().then(res => {
          this.getCouTypeCateCnt() // 二级导航
          this.loadMore()
          this.isFirstEnter = false
        }) // 一级导航
      },
      async backScroll() {
        const page = this.page // 缓存page值
        this.rows = page * this.rows // 一次性加载所有数据
        this.page = 0
        this.couponList = []
        await this.getMyCouponCnt()
        await this.loadMore(true)
        this.getCouTypeCateCnt()
        this.$nextTick(() => {
          this.$refs.scroll.scrollTo(0, this._scrollY)
        })
        this.rows = 10 // 还原分页规则
        this.page = page
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      chooseHandler(type) {
        if (type === this.curType) {
          return
        }
        if (this.$refs.scroll) {
          this.$refs.scroll.scrollTo(0, 0)
        }
        this.curType = type
        this.reset()
      },
      subMenuHandler(alias) {
        if (alias === this.curCateAlias) {
          return
        }
        if (this.$refs.scroll) {
          this.$refs.scroll.scrollTo(0, 0)
        }
        this.curCateAlias = alias
        this.reset()
      },
      reset() {
        this.$refs.scroll.closePullUp()
        this.hasMore = true
        this.hasGetData = false
        this.page = 0
        this.couponList = []
        this.loadMore(true)
      },
      loadMore(isReset) {

        if (this.loading) {
          return
        }
        this.$Loading.open();
        this.page++
        this.loading = true
        let paramsData = {
          page: this.page,
          rows: this.rows,
        }
        if (this.curType === this.unusedValue && this.curCateAlias && this.curCateAlias != 'quanbu') {
          paramsData.couTypeCategoryAlias = this.curCateAlias
        }
        return this.$http.post(`/app/json/coupon/${this.curType}`, paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            // 商品列表
            let couponList = data.data || []
            couponList.map(item => {
              item.dpedData = this.$mallCommon.priceFromItem(item)
              item.linePrice = this.$util.toDecimal2(item.dpedData.linePrice)
              return item
            })
            this.couponList = this.couponList.concat(couponList)
            let curMenu = null
            let num = 0
            if (this.curType === this.unusedValue && this.curCateAlias && this.curCateAlias != 'quanbu') { // 二级导航数量判断
              curMenu = this.couponTypeList.find(item => item.cateAlias === this.curCateAlias)
              num = curMenu.cateCnt
            } else {
              curMenu = this.menuList.find(item => item.url === this.curType)
              num = curMenu.num
            }
            if (this.couponList.length >= data.totalRecords) {
              this.hasMore = false
            }
          }
          this.loading = false
          this.hasGetData = true
          if (isReset) {
            this.$refs.scroll.openPullUp()
          }
          this.$Loading.close()
        })
      },
      getMyCouponCnt() {
        return new Promise((resolve, reject) => {
          this.$Loading.open();
          this.$http.post(`/app/json/coupon/getMyCouponCnt`, {}).then(res => {
            let data = res.data
            if (data.status == 0) {
              // 商品列表
              let menuObj = data.data || {}
              let menuList = []
              for (let key in menuObj) {
                let obj = {}
                switch (key) {
                  case 'unusednum':
                    obj = {
                      name: '未使用',
                      num: menuObj[key],
                      url: this.unusedValue,
                      sort: 0
                    }
                    menuList.push(obj)
                    break
                  case 'usednum':
                    obj = {
                      name: '已使用',
                      num: menuObj[key],
                      url: 'getUsedCoupons',
                      sort: 1
                    }
                    menuList.push(obj)
                    break
                  case 'expnum':
                    obj = {
                      name: '已过期',
                      num: menuObj[key],
                      url: 'getExpiredCoupons',
                      sort: 2
                    }
                    menuList.push(obj)
                    break
                }
              }
              menuList = menuList.sort((a, b) => a.sort - b.sort)
              console.log('menuList',menuList);
              this.menuList = menuList
              resolve()
            }
            this.$Loading.close()
          })
        })
      },
      getCouTypeCateCnt() {
        this.$Loading.open();
        let params = {
          state: 20 // 未使用：20， 已使用40；
        }
        this.$http.post(`/app/json/coupon/getCouTypeCateCnt`, params).then(res => {
          let data = res.data
          if (data.status == 0) {
            let list = data.data.cateCntModels || []
            let total = 0
            for (let i = 0; i < list.length; i++) {
              total += list[i].cateCnt || 0
            }
            list.unshift({cateName: '全部', cateCnt: total, cateAlias: 'quanbu'})
            this.couponTypeList = list
            this.appcouponTotal = total
          }

          this.$Loading.close()
        })
      },
      deleteCoupon(item) {
        this.$Loading.open();
        let params = {
          couNo: item.couNo
        }
        this.$http.post(`/app/json/coupon/delCoupons`, params).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$toast('删除成功！')
            this.getMyCouponCnt()
            this.reset()
          } else {
            this.$toast(data.info || '删除失败！')
          }
          this.$Loading.close()
        }).catch(err => {
          this.$toast(err || '删除异常！')
          this.$Loading.close()
        })
      },
      activateHandler() {
        if (!this.dynamicCode) {
          this.$toast('请输入激活码！')
          return
        }
        this.$http.post('/app/json/coupon/corpUserActivateCou', {dynamicCode: this.dynamicCode}).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$toast('激活成功！')
            this.getMyCouponCnt()
            this.reset()
          } else {
            this.$toast(data.info || '激活失败！')
          }

          this.dynamicCode = '';

          this.showActivateModel = false
        })
      }
    },
    watch: {
      '$route': {
        handler: function (to, from) {
          // 首次进入初始化
          if (this.isFirstEnter && (to.path === '/coupon_list2' || to.path === '/coupon_list')) {
            this.isGroupCoupon = to.path === '/coupon_list2'
            this.unusedValue = this.isGroupCoupon ? 'getUnusedCouponsGroup' : 'getUnusedCouponsWithCols' // 不同页面未使用的接口不一样
            this.curType = this.unusedValue // 初始化列表
            this.pageInit()
          }
        },
        immediate: true
      },
    },
    components: {Coupon, HorizontalScroll, Scroll}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .coupon-list {
    .coupon-menu {
      height 45px
      display flex
      flex-shrink 0

      li {
        width: 50%;
        line-height: 45px;
        text-align: center;
        background: #F07F84;
        color: #fff;
        font-size: 14px;
      }

      li.active {
        background: #E71324;
      }
    }

    .menu-list {
      overflow hidden
      padding: 0 15px;
      display flex
      flex-shrink: 0;

      .menu-item {
        flex 1
        text-align: center

        .text {
          padding: 11px 0 9px;
          display inline-block
        }

        & + .menu-item {
          padding-left: 15px;
        }

        &.active {
          .text {
            color: #F80F16
            position: relative
            border-bottom 2px solid #F80F16
            /*这么做，换主题比较麻烦*/
            /*&:after {
              content ''
              position: absolute
              bottom: 0
              left: 0;
              width 100%

            }*/
          }
        }
      }
    }

    .sub-menu-list {
      overflow hidden
      padding: 0 15px;
      margin-top: 15px;
      margin-bottom: 10px;
      flex-shrink: 0;

      .sub-menu-item {
        float: left
        text-align: center

        .text {
          padding: 4px 10px;
          border-radius 10px;
          display inline-block
          background: #efefef
          border 1px solid #efefef
          box-sizing border-box
          font-size: 12px;
        }

        & + .sub-menu-item {
          padding-left: 15px;
        }

        &.active {
          .text {
            color: #F80F16
            position: relative
            background: rgba(248, 15, 22, 0.1)
            border-color: #F80F16
          }
        }
      }
    }
  }

  .coupon-center {
    display flex
    flex-direction column

    .coupon-content {
      flex 1
      width 100%
      overflow hidden
      display flex
      flex-direction column
    }

    .coupon-list-wrapper {
      padding-bottom: 40px;
      display flex
      flex-direction column
      flex 1
      position: relative
      overflow: hidden;

      &.no-padding {
        padding-bottom 0;
      }

      .tip {
        padding 11px 15px;
        text-align: center
        color: #999999
        flex-shrink 0
      }

      .no-coupon-wrapper {
        position: absolute
        top: 10%;
        left: 50%;
        transform translate3d(-50%, 0, 0)
        text-align: center

        .img {
          width 90px;
        }

        .title {
          padding-top 24px;
          font-size: 18px;
          color: #5a5a5a
        }

        .sub-title {
          padding-top: 15px;
          font-size: 12px;
        }
      }
    }

    .coupon-list-scroll {
      padding 8px;
      height 100%
      /*overflow-x hidden*/
      /*-webkit-overflow-scrolling touch*/
      flex 1

      .coupon-item {
        margin-top: 8px;
      }

      .delete {
        width: 65px; /*no*/
        text-align: center;
        display: flex;
        align-items center
        color: #fff;
        height 100%
        justify-content center
      }
    }

    .footer-btn {
      background: #fff;
      position: absolute
      bottom: 0
      width 100%
      left 0
      height 40px;
      font-size: 0;
      display table
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      z-index 10

      .btn {
        display: table-cell
        vertical-align middle
        padding 4px 0
        text-align: center
        font-size: 14px;
        position: relative

        & + .btn {
          &:after {
            position: absolute
            content ''
            left: 0;
            top: 50%;
            transform translateY(-50%)
            height 80%;
            z-index 1
            border-left: 1px solid #d5d5d5
          }
        }
      }
    }

    .no-data {
      padding: 15px;
      text-align: center;
    }
  }

  .activate-btn {
    color: #1a1a1a;
    font-size: 14px;
    position: absolute;
    right: 15px;
    top: 0
  }

  .activate-model {
    background: #fff;
    padding 25px 15px;
    padding-top: 20px;

    .title {
      padding 10px;
      text-align: center
      font-size: 15px;
      font-weight: 600;
      padding-top: 0
      padding-bottom: 20px;
    }

    .content {
      display flex
      align-items center
    }

    .form-control {
      background: #efefef
      border-radius 3px;
      height: 40px;
      width 100%
      padding-left: 10px;
    }

    .btn {
      flex-shrink 0
      height: 40px;
      line-height: 40px;
      color: #fff;
      text-align: center
      border-radius 3px;
      padding: 0 8px;
      margin-left: 6px;
    }
  }

  /deep/ .van-popup {
    width 70%;
    border-radius 5px;
  }

  .xuanfu {
    height: 65px;
    width: 85px;
    /*1.3 如果碰到滑动问题，请检查 z-index。z-index需比web大一级*/
    z-index: 999;
    position: fixed;
    top: 7.2rem;
    right: 0;

    .imgt2 {
      position: absolute;
      top: -12px;
      left: 65px;
      width: 20px;
    }

    .imgt1 {
      width 60px;
    }
  }
</style>

