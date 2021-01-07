<template>
  <div class="coupon-list">
    <nav-top title="优惠券" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="coupon-center" v-if="menuList.length">
      <ul class="menu-list">
        <!--选中active-->
        <li class="menu-item" v-for="(item, index) in menuList" :key="index" :class="{active: curType === item.url}"
            @click="chooseHandler(item.url)">
          <span class="text">{{item.name}}（{{item.num}}）</span>
        </li>
      </ul>
      <ul class="sub-menu-list" v-show="curType === 'getUnusedCouponsWithCols'">
        <!--未使用时展示-->
        <horizontal-scroll :dataList='couponTypeList'>
          <!--选中active-->
          <li class="sub-menu-item" :class="{active: curCateAlias === item.cateAlias}"
              @click="subMenuHandler(item.cateAlias)" v-for="(item, index) in couponTypeList">
            <span class="text">{{item.cateName}}({{item.cateCnt}})</span>
          </li>
        </horizontal-scroll>
      </ul>
      <div class="coupon-list-wrapper" v-show="hasGetData">
        <!--<div class="coupon-list"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             :infinite-scroll-immediate-check="true"
             infinite-scroll-distance="20"
             ref="couponList"
             v-if="couponList.length">-->
        <scroll ref="scroll" class="coupon-list" :hasMore="hasMore" :pullUpLoad="true"
                @pullingUp="loadMore" :data="couponList">
          <coupon v-for="(item, index) in couponList" :disabled="disabled" :used="curType === 'getUsedCoupons'"
                  :key="index" :item="item" :index="index"
                  class="coupon-item"></coupon>
        </scroll>
        <div class="no-coupon-wrapper" v-if="!couponList.length">
          <img class="img" src="../../../../../../static/image/coupon/none-icon.png" alt="">
          <p class="title theme_font_tint">没有券？</p>
          <p class="sub-title theme_font_tint">去领券中心看看吧</p>
        </div>
        <div class="tip" v-if="disabled">以上是近期已使用的优惠券</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import Coupon from './base/coupon.vue'
  import Scroll from '@/components/base/scroll/scroll'

  export default {
    name: '',
    data() {
      return {
        hasGetData: false, // 是否获取数据
        couponTypeList: [], // 券类型列表
        couponList: [], // 券列表
        menuList: [], // 导航
        page: 0,
        rows: 10,
        hasMore: true,
        loading: false,
        curType: 'getUnusedCouponsWithCols', // 要查询的列表 未使用：getUnusedCouponsWithCols 已使用：getUsedCoupons 已过期：getExpiredCoupons
        curCateAlias: 'quanbu' // 二级导航当前选择项
      }
    },
    mounted() {
      this.getMyCouponCnt() // 一级导航
      this.getCouTypeCateCnt() // 二级导航
    },
    methods: {
      chooseHandler(type) {
        if (type === this.curType) {
          return
        }
        if (this.$refs.couponList) {
          this.$refs.couponList.scrollTop = 0
        }
        this.hasMore = true
        this.hasGetData = false
        this.page = 0
        this.couponList = []
        this.curType = type
        this.$refs.scroll.openPullUp()
        this.loadMore()
      },
      subMenuHandler(alias) {
        if (alias === this.curCateAlias) {
          return
        }
        if (this.$refs.couponList) {
          this.$refs.couponList.scrollTop = 0
        }
        this.hasMore = true
        this.hasGetData = false
        this.page = 0
        this.couponList = []
        this.curCateAlias = alias
        this.$refs.scroll.openPullUp()
        this.loadMore()
      },
      loadMore() {
        this.$Loading.open();
        this.page++
        this.loading = true
        let paramsData = {
          page: this.page,
          rows: this.rows,
          token: this.$store.state.login.token
        }
        if (this.curType === 'getUnusedCouponsWithCols' && this.curCateAlias && this.curCateAlias != 'quanbu') {
          paramsData.couTypeCategoryAlias = this.curCateAlias
        }
        this.$http.post(`/app/json/coupon/${this.curType}`, paramsData).then(res => {
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
            if (this.curType === 'getUnusedCouponsWithCols' && this.curCateAlias && this.curCateAlias != 'quanbu') { // 二级导航数量判断
              curMenu = this.couponTypeList.find(item => item.cateAlias === this.curCateAlias)
              num = curMenu.cateCnt
            } else {
              curMenu = this.menuList.find(item => item.url === this.curType)
              num = curMenu.num
            }
            if (this.couponList.length < num) {
              this.loading = false
            } else {
              this.hasMore = false
            }
          }
          this.hasGetData = true
          this.$Loading.close()
        })
      },
      getMyCouponCnt() {
        this.$Loading.open();
        let paramsData = {
          token: this.$store.state.login.token
        }
        this.$http.post(`/app/json/coupon/getMyCouponCnt`, paramsData).then(res => {
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
                    url: 'getUnusedCouponsWithCols',
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
            this.menuList = menuList
            this.loadMore()
          }
          this.$Loading.close()
        })
      },
      getCouTypeCateCnt() {
        this.$Loading.open();
        let paramsData = {
          token: this.$store.state.login.token,
          state: 20 // 未使用：20， 已使用40；
        }
        this.$http.post(`/app/json/coupon/getCouTypeCateCnt`, paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            let list = data.data.cateCntModels || []
            let total = 0
            for (let i = 0; i < list.length; i++) {
              total += list[i].cateCnt || 0
            }
            list.unshift({cateName: '全部', cateCnt: total, cateAlias: 'quanbu'})
            this.couponTypeList = list
          }
          this.$Loading.close()
        })
      }
    },
    computed: {
      disabled() {
        return this.curType === 'getUsedCoupons' || this.curType === 'getExpiredCoupons'
      }
    },
    components: {Coupon, HorizontalScroll, Scroll}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .coupon-list {
    .menu-list {
      overflow hidden
      padding: 0 15px;
      display flex
      flex-shrink: 0;

      .menu-item {
        flex 1
        text-align: center

        .text {
          padding: 11px 0;
          display inline-block
        }

        & + .menu-item {
          padding-left: 15px;
        }

        &.active {
          .text {
            color: #F80F16
            position: relative

            &:after {
              content ''
              position: absolute
              bottom: 0
              left: 0;
              width 100%
              border-bottom 2px solid #F80F16
            }
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

    .coupon-list-wrapper {
      padding-bottom: 40px;
      display flex
      flex-direction column
      flex 1
      position: relative

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

    .coupon-list {
      padding 8px;
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
      flex 1

      .coupon-item {
        & + .coupon-item {
          margin-top: 8px;
        }
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
</style>
