<template>
    <div>
        <div>
            <nav-top class="reset-nav-top" @backEvent="$router.go(-1)"></nav-top>
            <nav-content :class='{"rest-content": setmealList.length}'>
              <div class="tab" v-if="showTab">
                <van-tabs v-model="active" @click="changeTab">
                  <van-tab title="合约套餐"></van-tab>
                  <van-tab title="基础套餐"></van-tab>
                </van-tabs>
              </div>
              <div class="content" v-show="hasGetData">
                  <scroll ref="scroll" class="coupon-list-scroll" :listenScroll="true" :probe-type="3" :hasMore="hasMore" :pullUpLoad="true" @pullingUp="loadMore" :data="setmealList" :pullDownRefresh="true" @pullingDown="reset">
                    <template v-for="(item,index) in setmealList">
                      <div class="card" :key="index" @click="toDetail">
                        <p class="card-time">
                          {{item.joinTime}}
                        </p>
                        <div class="card-info">
                          <div class="left">
                            <p class="tit-name">{{item.packageRefuelName}}</p>
                            <p class="start-time">开通时间：{{item.startDate}}</p>
                            <p class="end-time">到期时间：{{item.endDate}}</p>
                          </div>
                          <div class="right">
                            {{dealState(item.state, item.startDate, item.endDate)}}
                          </div>
                        </div>
                      </div>
                    </template>
                  </scroll>
                  <div class="no-data" v-if="!setmealList.length">
                    <img class="img" src="../image/no-data.png" alt="">
                    <p class="title">暂无数据！</p>
                  </div>
              </div>
            </nav-content>
        </div>
    </div>
</template>

<script>
    import Scroll from '@/components/base/scroll/scroll'
    import utils from "@/utils/util"
    export default {
        components: {
          Scroll
        },
        data() {
          return {
            active: 0, // tab标签
            showTab:true, // 是否显示tab
            aysflag: false, // 防止请求累积flag
            hasGetData: false, // 加载完后显示页面
            hasMore: true, // 获取数据loading
            page: 0, 
            rows: 10,
            setmealList: [] // 数据集合
          }
        },
        mounted() {
          this.loadMore()
        },
        methods: {
          dealState(state, start, end) {
            let date = utils.getMyDate(new Date()) // 当前时间
            if (state == 'WAIT_SIGN_UP') {
              return '待签约'
            } else if (state == 'SIGNED_UP') {
              let compareBegin = utils.dateCompare(date, start.split(' ')[0])
              let compareEnd = utils.dateCompare(date, end.split(' ')[0])
              if (compareBegin == 1) {
                return '未开始'
              } else if ((compareBegin == 0 || compareBegin == -1) && (compareEnd == 1 || compareEnd == 0)) {
                return '签约中'
              } else {
                return '已结束'
              }
            } else if (state == 'SETTLED') {
              return '已结算'
            } else if (state == 'CANCELED') {
              return '已取消'
            }
          },
          toDetail() {
            this.$toast("开发中")
          },
          reset() {
            this.hasMore = true
            this.hasGetData = false
            this.page = 0
            this.setmealList = []
            this.loadMore()
          },
          changeTab(val) {
            this.reset()
          },
          loadMore() {
            if (this.aysflag) {
              return
            }
            //打卡loading状态
            this.$Loading.open();
            this.page++
            // 防止请求累积
            this.aysflag = true;
            let obj = {
              token: this.$store.state.login.token,
              page: {
                index: this.page,
                pageSize: this.rows
             }   
            }
            let url = this.active === 0 ? '/app/json/app_package_refuel/queryPackageContractHistory' : '/app/json/app_package_refuel/queryPackageOrderHistory'
            this.$http.post(url,obj).then(res=>{
              let data = res.data
              if(data.status == 0) {
                let setmealList = data.data || []
                this.setmealList = this.setmealList.concat(setmealList)
              }
              // 防止请求积累-打开开关
              this.aysflag = false;
              // 加载完成显示数据
				      this.hasGetData = true;
              // 关闭全局loading
              this.$Loading.close()
              this.hasMore = false
            })
          }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
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
  /deep/ .rest-content{
    background: #F6F6F6FF !important;
  }
  /deep/ .list-wrapper{
    background: transparent !important;
  }
  .content {
    padding-bottom: 40px;
    display: flex;
    font-size: 14px;
    flex-direction: column;
    flex: 1;
    position: relative;
    .card{
      text-align:center;
      color: #999999FF;
      padding: 10px 0;
      .card-time {
        margin-bottom: 10px;     
      }
      .card-info {
        padding: 10px;    
        background: #fff;
        display: flex;
        justify-content: space-between;
        .left {
          line-height: 25px;
          text-align: left;
          .tit-name{
            font-size: 15px;
            font-weight 400;
            color: #333333FF;
          }
        }
        .right {
          color:#F02C2DFF;
        }
      }
    }
  }
  .tab{
    padding-bottom:12px;
    background-color: #FFA35C;
    /deep/ [class*=van-hairline]::after{
      border: none !important;
    }
    /deep/ .van-tabs__nav{
      background: transparent !important;
    }
    /deep/ .van-tab__text{
      color:#fff !important;
      font-size: 16px !important;
    }
    /deep/ .van-tabs__line {
      background-color: #fff;
    }
  }
  .no-data {
    position: absolute;
    top: 200%;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    text-align: center;
    .img {
      width: 100%;
    }
    .title {
      padding-top: 24px;
      font-size: 14px;
      color: #5a5a5a;
    }

  }
</style>