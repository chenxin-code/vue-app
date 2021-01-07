<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="deal-overview">
        <div class="left">
          <img src="../image/icon-personal.png" alt="" class="icon-personal">
          <span>{{ $route.query.packageRefuelTypeName }}</span>
        </div>
      </div>
      <div class="content">
        <div class="info">
          <p class="title">套餐合约信息</p>
          <div class="text" v-html="$route.query.packageRefuelDesc"></div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  created() {

  },
  methods:{

  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .deal-overview {
      width 100%;
      height 50px;
      background linear-gradient(180deg,rgba(255,193,118,1) 0%,rgba(255,141,65,1) 100%);
      padding 0 10px;
      display flex;
      justify-content space-between;
      align-items center;
      .left {
        display flex;
        align-items center;
        .icon-personal {
          display block;
          width 25px;
          height 25px;
        }
        span {
          font-size 16px;
          font-weight 500;
          color #fff;
          padding-left 5px;
        }
      }
      .right {
        position relative;
        .more-btn {
          color #fff;
          font-size 20px;
        }
        .func-list {
          position absolute;
          right 0;
          top 30px;
          width: 95px;
          padding 11px 15px;
          background-color #424242;
          border-radius 5px;
          transition all 2s;
          &::before {
            content '';
            display block;
            width 15px;
            height 15px;
            background-color #424242;
            position absolute
            right 3px;
            top -5px;
            border-radius 2px;
            transform rotate(45deg)
          }
          .item {
            font-size 15px;
            color #fff;
            margin-top 10px;
            text-align center;
            padding 3px 0;
            &:first-child {
              margin-top 0;
            }
          }
        }
      }
    }
    .top-desc {
      margin-top 10px;
      .desc-img {
        display block;
        width 100%;
      }
    }
    .content {
      flex 1;
      margin 10px 0;
      overflow-y auto;
      .info {
        width 100%;
        background-color #fff;
        padding 15px 10px;
        .title {
          font-size 15px;
          line-height 21px;
        }
        .text {
          margin-top 10px;
          overflow hidden;
          /deep/ img {
            display block;
            width 100%;
          }
        }
      }
    }
  }
</style>