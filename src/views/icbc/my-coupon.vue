/**Created by LiuYong on 2020-11-13.*/

<template>
  <div class="oil-coupon-detail">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="content">
        <div>
          <!-- <div class="tab-top">
            <div v-for="(item,idx) in couponCat" :key="item.id" class="tab-bar" :class="{active:tabTopIndex == idx}" @click="changeTabTop(idx)">{{item.name}}</div>
          </div> -->
          <div class="tabs">
            <div class="tab" :class="{selected: tabIndex == 1}" @click="changeIdx(1)">未使用</div>
            <div class="tab" :class="{selected: tabIndex == 2}" @click="changeIdx(2)">已使用</div>
            <div class="tab" :class="{selected: tabIndex == 3}" @click="changeIdx(3)">已过期</div>
          </div>
        </div>
        <div class="list" v-if="couponList.length > 0">
          <div class="coupon" v-for="item in couponList" @click="defaultNavigate(item)">
            <div class="mianer">
              <p class="big"></p>
            </div>
            <div class="cou-info">
              <div class="cou-title double-line">{{item.couTypeTitle}}</div>
              <div class="cou-time" v-if="item.validType!=3">有效期:{{setHour(item.validStartDate)}}-{{setHour(item.validEndDate)}}</div>
              <div class="cou-time" v-else>有效期:领取后{{item.validDays}}天有效</div>
            </div>
            <div class="right" v-if="tabIndex == 2">
              <img src="./imgs/ysy.png">
            </div>
            <div class="right" v-else-if="tabIndex == 3">
              <img src="./imgs/ygq.png">
            </div>
            <div class="right" v-else>
              <div class="btn">查看详情</div>
            </div>
          </div>
        </div>
        <div class="no-data" v-else-if="loaded">没有相关数据</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "oil-coupon-detail",
    components: {},
    data() {
      return {
        couponCat:[
          {name:'加油券',id:1},
          {name:'易捷券',id:2},
        ],
        loaded: false,
        tabTopIndex:0,
        tabIndex: 1,
        couponList: [],
      }
    },
    methods: {
      changeIdx(idx){
        this.tabIndex = idx;
        this.getJYCouponDetail();
      },
      defaultNavigate(coupon){
        let query = {
          couNo: coupon.couNo,
          couTypeCategoryAlias: coupon.couTypeCategoryAlias,
          refuelGsOuCode:JSON.stringify(coupon.couTypeUseConditionModel.refuelGsOuCode),
          refuelGsOuCodeOp: coupon.couTypeUseConditionModel.refuelGsOuCodeOp
        }
        this.$router.push({
          path: '/icbc/mycoupon_detail',
          query,
        })
      },
      setHour(d) {
        return d ? this.$util.formatDate(new Date(d.toString().replace(/-/g, '/')), 'yyyy.MM.dd') : ''
      },
      changeTabTop(idx){
        this.tabTopIndex = idx
      },
      getJYCouponDetail: function () {
        let url='';
        switch(this.tabIndex){
          case 1: url = "/app/json/coupon/getUnusedCouponsWithCols"  // 未使用
            break;
          case 2: url = "/app/json/coupon/getUsedCoupons"  // 已使用
            break;
          case 3: url = "/app/json/coupon/getExpiredCoupons"  // 已过期
            break;
        }
        let paramsData = {
          couTypeCategoryAlias:"YJBLD"
        }
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            console.log('data',data);
            if (data.status === 0) {
              let couponList = data.data || []
              this.loaded = true
              this.couponList = couponList
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      backEvent: function () {
        this.$router.go(-1)
      }
    },
    created() {
      this.getJYCouponDetail()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .oil-coupon-detail {
    width 100%
    height 100%
    overflow hidden
    .content {
      width 100%
      height 100%
      background-color #efefef;
      overflow hidden
      position relative;
      .tab-top{
        display flex;
        padding:10px 12.5px;
        margin-bottom:3px;
        .tab-bar{
          width 90px
          height 40px
          border:1px solid #ff3c55;
          background-color:#fff;
          border-radius:5px;
          color:#ff3c55;
          font-size:15px;
          display:flex;
          justify-content:center;
          align-items:center;
          +.tab-bar{
            margin-left:10px;
          }
          &.active{
            background-color #ff3c55
            color:#fff;
          }
        }
      }
      .tabs {
        display flex;
        align-items flex-start;
        justify-content space-around;
        .tab {
          font-size 16px;
          font-weight 500;
          padding 10px;
        }
        .selected {
          position relative;
          color #CE0112;
          &.selected:before {
            content: " ";
            position absolute;
            left 50%;
            bottom 0;
            margin-left -10px;
            width 20px;
            height 3px;
            border-radius 2px;
            background-color #CE0112;
          }
        }
      }
      .list {
        position absolute;
        left 0;
        right 0;
        bottom 0;
        top 50px;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
        .coupon {
          position relative;
          z-index 2;
          background url("./imgs/yjyhq-bg.png") repeat center center / 100% 100%;
          display flex;
          align-items center;
          margin 0 5px;
          height:80px;
          margin:0 12.5px;
          padding-right 10px
          &.oil-coupon{
            background-image:url("./imgs/oil-bg.png");
          }
          .mianer {
            height:100%;
            width 90px;
            .big {
              font-size 18px;
            }
          }
          .cou-info {
            flex 1;
            padding-left:10px;
            .cou-title {
              font-size 12px;
            }
            .cou-time {
              margin-top 26px;
              color #999;
              font-size 12px;
            }
          }
          .right {
            text-align center;
            color #ff3c55;
            .btn {
              display:flex;
              align-items:center;
              justify-content:center;
              width 70px
              height 24px
              font-size 12px;
              color white;
              border-radius 15px;
              background-color #ff3c55;
            }
            img {
              width 60px;
              height 60px;
            }
          }
          +.coupon{
            margin-top:10px;
          }
        }
      }
      .no-data {
        padding 20px;
        font-size 14px;
        color #999;
        text-align center;
      }
    }
  }
</style>
