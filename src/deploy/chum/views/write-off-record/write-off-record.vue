<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="record-date" @click="openTimeModal">{{ currentTime }}<i class="iconfont mall-arrow-down"></i></div>
      <scroll
        ref="scroll"
        class="write-off-list"
        :hasMore="hasMore"
        :pullUpLoad="true"
        @pullingUp="loadMore"
        :data="writeOffRecordList"
        v-if="writeOffRecordList.length !== 0">
        <ul class="write-off-c">
          <li
            v-for="(item, index) in writeOffRecordList"
            :key="index"
            class="item">
            <p class="item-text item-title">订单编号：{{ item.id }}</p>
            <p class="item-text">核销门店：{{ item.storeName }}</p>
            <p class="item-text">核销方式：{{ item.serveCategory == 'cou' ? '服务券' : '会员卡' }} {{ item.serveNo }}</p>
            <p class="item-text">核销时间：{{ item.tradeTime }}</p>
          </li>
        </ul>
      </scroll>
      <p class="no-result-message">暂无数据~</p>
    </nav-content>
    <van-popup v-model="isShowTimeModal" position="bottom">
      <van-datetime-picker
        v-model="selectDate"
        :max-date="maxDate"
        @cancel="isShowTimeModal = false"
        @confirm="confirmSelectTime"
        type="year-month"/>
    </van-popup>
  </div>
</template>
<script>
import scroll from "@/components/base/scroll/scroll";
import Moment from 'moment';
export default {
  components: {
    scroll,
  },
  data() {
    return {
      hasMore: true,
      writeOffRecordList: [],
      isShowTimeModal: false,
      selectDate: new Date(),
      maxDate: new Date(),
      currentTime: Moment().format('YYYY年MM月'),
      pageInfo: {
        page: 1,
        rows: 10
      }
    }
  },
  mounted() {
    this.initWriteOffList();
  },
  methods: {
    initWriteOffList() {
      this.$STLoading.open();
      this.$http.post('/app/jqGrid/app_serve_cou/getCheckOrderList', {
        queryTimeStr: Moment(this.selectDate).format('YYYY-MM'),
        ...this.pageInfo
      }).then(res => {
        let data = res.data;
        this.$STLoading.close();
        if (data.status == 0) {
          if (data.data instanceof Array) {
            this.writeOffRecordList.push(...data.data);
            this.pageInfo.page = data.page;
            if (this.pageInfo.page >= data.total) {
              this.hasMore = false;  
            }
          }
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(`getCheckOrderList err ${err}`);
        this.$STLoading.close();
      })
    },
    loadMore() {
      ++this.pageInfo.page;
      this.initWriteOffList();
    },
    confirmSelectTime() {
      this.currentTime = Moment(this.selectDate).format('YYYY年MM月');
      this.isShowTimeModal = false;
      this.pageInfo = {
        page: 1,
        rows: 10
      }
      this.writeOffRecordList = [];
      this.initWriteOffList();
      this.hasMore = true;
    },
    openTimeModal() {
      let tempDate = this.currentTime.replace('年', '-').replace('月', '-');
      this.selectDate = Moment(tempDate).toDate();
      this.isShowTimeModal = true;
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl';
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
  .record-date {
    text-align center;
    font-size 13px;
    line-height 15px;
    color #9FA0A0;
    .iconfont {
      font-size 12px;
    }
  }
  .write-off-list {
    position absolute;
    left 0
    right 0
    top 20px;
    bottom 0;
    padding 0 20px;
    height auto;
    /deep/ .scroll-content {
      padding-top: 5px;
    }
    .write-off-c {
      .item {
        margin-top 10px;
        padding 10px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        border-radius: 5px;
        &:first-child {
          margin-top 0;
        }
        .item-text {
          font-size 14px;
          color #9FA0A0;
          margin-top 10px;
          &.item-title {
            font-size 16px;
            font-weight 500;
            color #000
          }
        }
      }
    }
  }
}
</style>