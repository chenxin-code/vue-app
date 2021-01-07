/**Created by liaoyingchao on 2020-07-16.*/

<template>
  <div class="order-item">
    <div class="title-row">
      <div class="title">
        <img src="../img/qu.png">
        <span class="single-line">{{myData.storeOuName}}</span>
      </div>
      <div class="btn">
        <img src="../img/xtzp.png" v-if="type == 2">
      </div>
    </div>
    <div class="address-div" @click="toMap">
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
    <div class="pro-row" @click="toDetail" v-if="type != 3">
      <div class="pro" v-for="(pro, idx) in myData.proList" v-if="idx < 3">
        <img :src="pro.phPictureUrl">
      </div>
      <div class="space"></div>
      <div class="more" v-if="myData.proList.length > 1">
        <span>共{{myData.proList.length}}件</span>
        <i class="iconfont mall-gengduo"></i>
      </div>
    </div>
    <div>
      <slot></slot>
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
        myData: []
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
    .title-row {
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
        margin-right -10px;
        img {
          display block;
          height 26px;
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
  }
</style>
