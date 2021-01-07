<template>
  <div>
    <nav-top title="我的粉丝" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="fans">
      <div class="top-div">
        <div class="item-div-class">
          <span>累计粉丝人数</span>
          <span>{{fansInfo.count}}人</span>
        </div>
        <div class="item-div-class">
          <span>已消费人数</span>
          <span>{{fansInfo.usedCount}}人</span>
        </div>
        <div class="item-div-class">
          <span>选择月份</span>
          <div class="select-date-class">
            <span @click="pickerShow=!pickerShow">{{currentDate|yearMonthFilters}}</span>
            <img src="./image/icon_more_whrite.png"/>
          </div>

        </div>
        <div class="item-div-class">
          <span>本月新增</span>
          <span>本月消费</span>
        </div>
        <div class="item-div-class" style="padding: 0 10px">
          <span>{{monthFansInfo.count}}人</span>
          <span>{{monthFansInfo.usedCount}}人</span>
        </div>
      </div>
      <div class="fans-bottom">
        <div style="background: #cccccc">
          <div class="data-list-item-class">
            <span>头像</span>
            <span>昵称</span>
            <span>注册时间</span>
            <span>首次消费时间</span>
          </div>
        </div>
        <div class="list-pull-to">
          <scroll ref="scroll" @scroll="scrollHandler" :hasMore="isCanLoadMore" :pullUpLoad="true" :listenScroll="true"
                  @pullingUp="getMyFans" :pullDownRefresh="true" @pullingDown="reset" :data="fanList"
                  :probeType="2" :startY='scrollTopValue'>
            <div v-for="(item,index) in fanList" :key="index" class="data-list-item-class">
              <span><img :src="item.avtUrl?item.avtUrl:defaultImg" alt=""></span>
              <span>{{item.nickName}}</span>
              <span>{{item.referrerTime}}</span>
              <span>{{item.consumeTime?item.consumeTime:'暂未消费'}}</span>
            </div>
          </scroll>
        </div>
      </div>
      <van-popup v-model="pickerShow" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          title="选择月份"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @cancel="pickerShow = false"
          @confirm="confirmPicker"
        />
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import Scroll from '@/components/base/scroll/scroll.vue'

  export default {
    name: "fans",
    components: {Scroll},
    data() {
      return {
        pickerShow: false,
        minDate: new Date(2019, 5, 1),
        maxDate: new Date(2025, 11, 1),
        currentDate: new Date(),
        fanList: [],
        fansInfo: {},//累计粉丝
        monthFansInfo: {},//当月粉丝
        currentPage: 0,
        currentSize: 20,
        defaultImg: require('./image/default_avater_img.png'),
        //scroll
        isCanLoadMore: true,// 是否可以上拉加载更多
        scrollTopValue: 0,
      };
    },
    watch: {
      fanList() {
        for (let i = 0; i < this.fanList.length; i++) {
          this.fanList.indexOf()
        }
      }
    },
    filters: {
      yearMonthFilters(val) {
        if (!val) return '';
        let year = val.getFullYear();
        let month = val.getMonth() + 1;
        if (month >= 1 && month <= 9) {
          month = `0${month}`
        }
        return `${year}-${month}`
      }
    },
    methods: {
      formatter(type, val) {
        if (type === 'year') {
          return `${val}年`;
        } else if (type === 'month') {
          return `${val}月`
        }
        return val;
      },
      confirmPicker() {
        this.pickerShow = false;
        this.currentPage = 0;
        this.fanList = [];
        this.monthFansInfo = {};
        this.isCanLoadMore = true;
        this.getMonthFansCount();
        this.getMyFans();
      },
      reset() {
        this.$refs.scroll.openPullUp();
        this.currentPage = 0;
        this.fanList = [];
        this.isCanLoadMore = true;
        this.scrollTopValue = 0;
        this.getMyFans();
      },
      scrollHandler(y) {
        this.scrollTopValue = y.y
      },

      //获取累计的
      getALLFansCount() {
        let url = '/platform/json/fans_statistics/getALLFansCount';
        let params = {
          token: this.$store.state.login.token || ''
        }
        this.$Loading.open()
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status === 0) {
            this.fansInfo = data.data
          } else {
            this.$Toast(data.info)
          }
        }).catch(error => {
          this.$Loading.close()
        })
      },
      //获取当月的统计
      getMonthFansCount() {
        let url = '/platform/json/fans_statistics/getMonthFansCount';
        let params = {
          token: this.$store.state.login.token || '',
          tradeTime: this.$options.filters.yearMonthFilters(this.currentDate)
        }
        this.$Loading.open()
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status === 0) {
            this.monthFansInfo = data.data
          } else {
            this.$Toast(data.info)
          }
        }).catch(error => {
          this.$Loading.close()
        })
      },
      //获取粉丝明细的
      getMyFans() {
        // let url = 'http://cnpchbtest.deepermobile.com.cn/platform/json/fans_statistics/getMyFans';
        let url = '/platform/json/fans_statistics/getMyFans';
        this.currentPage++
        let params = {
          token: this.$store.state.login.token || 'c:app:DD9F3DB625674A699E7FC6C4A4E6C8A1',
          tradeTime: this.$options.filters.yearMonthFilters(this.currentDate),
          currentPage: this.currentPage,
          currentSize: this.currentSize
        }
        this.$Loading.open()
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status === 0 && data.data) {
            this.fanList = this.fanList.concat(data.data || [])
            if (data.data.length < this.currentSize || this.fanList.length >= data.totalRecords || this.currentPage === data.totalPages) {
              //如果当前页返回的数据小于pageSize  就认为无更多数据了或者当前总条数大于等于了返回的总条数或者当前page等于了总的页数
              this.isCanLoadMore = false;
            }
          } else {
            if (data.info)
              this.$Toast(data.info)
          }
        }).catch(error => {
          this.$Toast('获取列表失败，请重试')
          this.$Loading.close()
        })
      },
    },
    created() {
      this.getALLFansCount();
      this.getMonthFansCount();
      this.getMyFans();
    },
    mounted() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '../stylus/variable.styl';
  @import '../stylus/layout.styl';
  $fan-item-height = 45px
  .fans {
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;
    .top-div {
      width 100%
      background: url('./image/fan_top_bg.png') no-repeat;
      display: flex;
      flex-direction column
      align-items: flex-start;
      justify-content flex-start
      padding: 0 10px;
      .item-div-class {
        display flex
        width 100%
        height 25px
        line-height 25px
        flex-direction row
        justify-content space-between
        span {
          font-size $font-size-medium
          color white
          font-weight bold
        }
        .select-date-class {
          display flex
          flex-direction row
          align-items center
          img {
            width: 15px;
            height: 18px
          }
        }
      }
    }

    .fans-bottom {
      flex: 1;
      overflow: hidden;
      display: flex;
      width 100%
      flex-direction: column;
      .data-list-item-class {
        display flex
        flex-direction row
        font-size $font-size-medium
        justify-content space-around
        align-items center
        height $fan-item-height
        border-bottom 0.6px solid #cccccc
        img {
          width: 30px;
          height: 30px;
          border-radius: 5px
        }
        span {
          width 25%
          text-align center
        }
        span:first-child {
          width 15%
        }
      }
      .list-pull-to {
        position: absolute;
        top: 165px;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
</style>

<style type="text/stylus" lang="stylus">
  .fans {
    .van-picker__cancel, .van-picker__confirm {
      color: #ce293a !important;
    }
  }

</style>
