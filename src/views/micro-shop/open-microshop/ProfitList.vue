<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="月度收益排名"></nav-top>
    <nav-content>
      <van-tabs v-model="title" @click="changeData">
        <van-tab :title="'积分'" v-if="profitObj.integralWay == 3">
          <div class="enterBoxListTitle">
            <span>姓名</span>
            <span>部门</span>
            <span>收益</span>
          </div>
          <div v-if="rankingList.length==0" class="nullData">暂无收益</div>
          <ul v-if="rankingList.length>0">
            <li v-for="(item,index) in rankingList" :key="index">
              <div class="div1">
                <p>
                  <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt="">
                  <img class="img1" src="static/image/microShop/head@2x.png" v-else alt="">
                  <span>
                      <img v-if="index==0" class="img2" src="static/image/microShop/no.1@2x.png" alt="">
                      <img v-if="index==1" class="img2" src="static/image/microShop/no.2@2x.png" alt="">
                      <img v-if="index==2" class="img2" src="static/image/microShop/no.3@2x.png" alt="">
                      <img v-if="index>2" class="img2" src="static/image/microShop/no4@2x.png" alt="">
                    <span class="num">第{{index+1}}名</span>
                    </span>
                </p>
                <span>{{item.employeeName}}</span>
              </div>
              <div>{{item.departmentName}}</div>
              <div class="div3">{{item.rewardAccounted}}</div>
            </li>
          </ul>
        </van-tab>
        <van-tab :title="'油滴'" v-if="profitObj.oilWay == 8">
          <div class="enterBoxListTitle">
            <span>姓名</span>
            <span>部门</span>
            <span>收益</span>
          </div>
          <div v-if="rankingList.length==0" class="nullData">暂无收益</div>
          <ul v-if="rankingList.length>0">
            <li v-for="(item,index) in rankingList" :key="index">
              <div class="div1">
                <p>
                  <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt="">
                  <img class="img1" src="/static/image/microShop/head@2x.png" v-else alt="">
                  <span>
                      <img v-if="index==0" class="img2" src="/static/image/microShop/no.1@2x.png" alt="">
                      <img v-if="index==1" class="img2" src="/static/image/microShop/no.2@2x.png" alt="">
                      <img v-if="index==2" class="img2" src="/static/image/microShop/no.3@2x.png" alt="">
                      <img v-if="index>2" class="img2" src="/static/image/microShop/no4@2x.png" alt="">
                    <span class="num">第{{index+1}}名</span>
                    </span>
                </p>
                <span>{{item.employeeName}}</span>
              </div>
              <div>{{item.departmentName}}</div>
              <div class="div3">{{item.rewardAccounted}}</div>
            </li>
          </ul>
        </van-tab>
        <van-tab :title="'豌豆'" v-if="profitObj.peasWay == 9">
          <div class="enterBoxListTitle">
            <span>姓名</span>
            <span>部门</span>
            <span>收益</span>
          </div>
          <div v-if="rankingList.length == 0" class="nullData">暂无收益</div>
          <ul v-if="rankingList.length>0">
            <li v-for="(item,index) in rankingList" :key="index">
              <div class="div1">
                <p>
                  <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt="">
                  <img class="img1" src="/static/image/microShop/head@2x.png" v-else alt="">
                  <span>
                      <img v-if="index==0" class="img2" src="/static/image/microShop/no.1@2x.png" alt="">
                      <img v-if="index==1" class="img2" src="/static/image/microShop/no.2@2x.png" alt="">
                      <img v-if="index==2" class="img2" src="/static/image/microShop/no.3@2x.png" alt="">
                      <img v-if="index>2" class="img2" src="/static/image/microShop/no4@2x.png" alt="">
                    <span class="num">第{{index+1}}名</span>
                    </span>
                </p>
                <span>{{item.employeeName}}</span>
              </div>
              <div>{{item.departmentName}}</div>
              <div class="div3">{{item.rewardAccounted}}</div>
            </li>
          </ul>
        </van-tab>
        <van-tab :title="'收益金额'" v-if="profitObj.moneyWay == 12">
            <div class="enterBoxListTitle">
              <span>姓名</span>
              <span>部门</span>
              <span>收益</span>
            </div>
            <div v-if="rankingList.length==0" class="nullData">暂无收益</div>
            <ul v-if="rankingList.length>0">
              <li v-for="(item,index) in rankingList" v-if="index<5">
                <div class="div1">
                  <p>
                    <img class="img1" :src="item.pictureUrl" v-if="item.pictureUrl" alt="">
                    <img class="img1" src="static/image/microShop/head@2x.png" v-else alt="">
                    <span>
                      <img v-if="index==0" class="img2" src="static/image/microShop/no.1@2x.png" alt="">
                      <img v-if="index==1" class="img2" src="static/image/microShop/no.2@2x.png" alt="">
                      <img v-if="index==2" class="img2" src="static/image/microShop/no.3@2x.png" alt="">
                      <img v-if="index>2" class="img2" src="static/image/microShop/no4@2x.png" alt="">
                    <span class="num">第{{index+1}}名</span>
                    </span>
                  </p>
                  <span>{{item.employeeName}}</span>
                </div>
                <div>{{item.departmentName}}</div>
                <div class="div3">{{item.rewardAccounted}}</div>
              </li>
            </ul>
            <router-link to="/micro_sho/profitlist" v-if="rankingList.length>0">
              <div class="more">查看更多</div>
            </router-link>
          </van-tab>
      </van-tabs>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  export default {
    name: "ProfitList",
    mixins: [api],
    data() {
      return {
        active: 0,
        rewardType: '',
        rankingList: [],
        profitObj: {},
        id: '',
        title: '',
      }
    },
    mounted() {
      this.loadIndex()
    },
    methods: {
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }

        that.profitData(params).then(res => {
          if (res.data.result === 'success') {
            let data = res.data.data || {}
            that.profitObj = data
            that.rankingIndex()
          }
        })
      },
      rankingIndex() {
        let that = this
        console.log(that.profitObj.integralWay);
        if (that.profitObj.integralWay == 3) {
          that.rewardType = 3
        } else if (that.profitObj.oilWay == 8) {
          that.rewardType = 8
        } else if (that.profitObj.peasWay == 9) {
          that.rewardType = 9
        } else if (that.profitObj.moneyWay == 12) {
          that.rewardType = 12
        }
        let params = {
          token: this.$store.state.login.token,
          rewardType: that.rewardType
        }

        that.monthData(params).then(res => {
          if (res.data.result === 'success') {
            let data = res.data.data || []
            that.rankingList = data
          }
        })
      },
      changeData(index,title) {
        let that = this
        console.log(title);
        that.rankingList = []
        if (title == '积分') {
          that.rewardType = 3
        } else if (title == '油滴') {
          that.rewardType = 8
        } else if (title == '豌豆') {
          that.rewardType = 9
        } else if (title == '收益金额') {
          that.rewardType = 12
        }
        let params = {
          token: this.$store.state.login.token,
          rewardType: that.rewardType
        }

        that.monthData(params).then(res => {
          if (res.data.result === 'success') {
            let data = res.data.data || []
            that.rankingList = data
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;
  }

  /deep/ .van-tabs--line {
    margin-top 10px;
    background white;
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

    li {
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
        display: flex;
        justify-content: space-between;
        width 34%

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
            color: white;
            margin-top: -15px;
            display: block;
            font-size: 12px;
          }

          .img2 {
            width: 68px;
            margin-top: -10px;
            display: block;
            margin-left: -8px;
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
