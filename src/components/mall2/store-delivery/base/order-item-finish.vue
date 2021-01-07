/**Created by liaoyingchao on 2020-07-21.*/

<template>
  <div class="order-item">
    <div class="top-row line_bottom">
      <div class="title">
        <span class="single-line">#{{myData.id}}</span>
      </div>
      <div class="state">
        {{myData.stateStr}}
      </div>
    </div>
    <div class="title-row">
      <div class="title">
        <img src="../img/qu.png">
        <span class="single-line">{{myData.storeOuName}}</span>
      </div>
      <div class="btn" :class="{up: detailHidden == false}" @click="detailHidden = !detailHidden">
        <i class="iconfont mall-arrow-down"></i>
      </div>
    </div>
    <div class="address-div" @click="toMap" v-if="detailHidden == false">
      <div class="info">
        <div class="addr-row">
          <div class="img-div"></div>
          <span>{{myData.storeAddress}}</span>
        </div>
        <div class="addr-row addr-row-2">
          <div class="img-div">
            <img src="../img/song.png">
          </div>
          <span>{{myData.address}}</span>
        </div>
      </div>
      <div class="more-btn">
        <i class="iconfont mall-gengduojiantou"></i>
      </div>
    </div>
    <div class="pro-row" @click="toDetail" v-if="detailHidden == false">
      <div class="pro" v-for="(pro, idx) in myData.proList">
        <img :src="pro.phPictureUrl">
      </div>
      <div class="space"></div>
      <div class="more" v-if="myData.proList.length > 1">
        <span>共{{myData.proList.length}}件</span>
        <i class="iconfont mall-gengduo"></i>
      </div>
    </div>
    <div class="time-div" v-if="myData.state == '3'">
      <div class="row">接单时间：{{myData.receiveOrderTime}}</div>
      <div class="row">完成时间：{{myData.completeTime}}</div>
    </div>
    <div class="time-div" v-if="myData.state == '9'">
      <div class="row">派单时间：{{myData.appointTime}}</div>
      <div class="row">取消时间：{{myData.cancelTime}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "order-item",
    components: {},
    props: ['itemData', 'type'],
    data() {
      return {
        myData: [],
        detailHidden: true
      }
    },
    created() {
      this.myData = this.itemData
      if (this.myData.itemAbstractJson) {
        this.myData.proList = JSON.parse(this.myData.itemAbstractJson)
      } else {
        this.myData.proList = []
      }
    },
    methods: {
      toMap: function () {
        this.$emit('toMap')
      },
      toDetail: function () {
        this.$emit('toDetail')
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .order-item {
    padding 10px;
    overflow hidden;
    .top-row {
      padding-top 5px;
      padding-bottom 10px;
      display flex;
      align-items center;
      justify-content space-between;
      .title {
        flex 1;
        display flex;
        align-items center;
        overflow hidden;
        span {
          flex 1;
          font-size 16px;
          font-weight 500;
        }
      }
      .state {
        font-size 14px;
        color #F80F16;
      }
    }
    .title-row {
      margin-top 10px;
      height 26px;
      display flex;
      align-items center;
      .title {
        flex 1;
        display flex;
        align-items center;
        overflow hidden;
        img {
          display block
          width 20px;
          height 20px;
          margin-right 5px;
        }
        span {
          flex 1;
          font-size 16px;
          font-weight 500;
        }
      }
      .btn {
        height 26px;
        padding 0 14px;
        line-height 26px;
        i {
          font-size 16px;
        }
        &.up  {
          transform: rotateX(180deg);
        }
      }
    }
    .address-div {
      display flex;
      align-items center;
      .info {
        flex 1;
        overflow hidden;
        .addr-row {
          display flex;
          align-items center;
          .img-div {
            width 25px;
            img {
              display block
              width 20px;
              height 20px;
            }
          }
        }
        .addr-row-2 {
          margin-top 12px;
        }
      }
      .more-btn {
        padding 10px;
        i {
          font-size 14px;
          color #666;
        }
      }
    }
    .pro-row {
      margin-top 10px;
      display flex;
      align-items center;
      .pro {
        img {
          display block;
          width 80px;
          height 80px;
        }
      }
      .space {
        flex 1;
      }
      .more {
        color #333;
        font-size 14px;
        i {
          margin-left 5px;
          color #333;
        }
      }
    }
    .time-div {
      .row {
        margin-top 10px;
        font-size 14px;
      }
    }
  }
</style>
