<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
        <div class="enterBoxListTitle">
            <span>排名</span>
            <span style="margin-left: -38px">员工名</span>
            <span>推荐人数</span>
        </div>
        <ul v-if="rankingList.length">
            <li v-for="(item,index) in rankingList" :key="index">
                <div class="div1">
                    <p>
                        <img v-if="index==0" class="img2" src="./images/medal-1.png" alt="">
                        <img v-if="index==1" class="img2" src="./images/medal-2.png" alt="">
                        <img v-if="index==2" class="img2" src="./images/medal-3.png" alt="">
                    </p>
                    <span class="num" v-if="index>2">{{index+1}}</span>
                </div>
                <div :class="{'textColor' :index <=2}">{{item.realName}}</div>
                <div class="div3">{{item.referrerNum}}</div>
            </li>
        </ul>
        <div v-else class="nullData">暂无排名</div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "recommen_list",
    data() {
      return {
        tabKey: 1,
        rankingList: [],
      }
    },
    mounted() {
        this.rankingList = this.$route.query.arr || []
        this.tabKey = this.$route.query.status
    },
    methods: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .textColor{
        color red
    }
  .enterBoxListTitle {
    background #f2f2f4
    height 50px;
    line-height 50px;
    display: flex;
    justify-content: space-between;
    text-align center;

    span {
      width 30%
      font-size 15px;
    }

    span:nth-child(1) {
      width 34%
    }

    span:nth-child(3) {
      width 26%
    }
  }

  ul {
      height: calc(100% - 50px);
      overflow-y: auto;

    li {
      height 60px
      display: flex;
      justify-content: space-between;
      text-align center;
      font-size 15px;
      padding: 15px 0;
      border-bottom: 1px solid #f2f2f4;

      div {
        width 30%
        margin auto;
      }

      .div3 {
        width 26%
      }

      .div1 {
        display flex
        justify-content center
        align-items center
        width 22%

        span {
          margin auto
        }

        p {
          padding-left 10px;

          .img1 {
            width: 40px;
            border-radius 50%;
          }

          .num {
            font-size: 12px;
          }

          .img2 {
            width: 34px;
            display flex
            justify-content center
            align-items center
          }
        }
      }

      .div3 {
        font-weight 600
      }
    }
  }

  /deep/ [class*=van-hairline]::after {
    border 0 !important
  }

  /deep/ .van-tab--active {
    color #f44
  }
  .nullData {
    text-align: center;
    line-height: 80px;
    font-size: 16px;
  }
</style>
