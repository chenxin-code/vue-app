/**Created by steven on 2018/12/26.*/

<template>
  <div class="mine-has-recommed">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <ul class="tab">
        <li class="item" v-for="(item,index) in tab" :class="{isActive:selectIndex == index}"
            @click="selectedFunc(index)"><span>{{item.name}}</span></li>
      </ul>
      <div class="content" v-for="(item,index) in tab" v-show="selectIndex == index">
        <div class="recommended-gift" v-if="complete && $store.state.globalConfig.showRecommendedGift == 1">
          <div class="title">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">推荐注册有礼</div>
                <div class="table-view-cell-arrow" @click="openDetails">活动攻略</div>
              </div>
            </div>
          </div>
          <div class="progress">
            <div class="show-progress">
              <RecommendedGift :datails="datails"></RecommendedGift>
            </div>
          </div>
        </div>
        <div>
          <div class="top-all theme_font_gray" v-if="item.numData && item.id == 1">
            累计推荐注册人数({{item.numData.totalNum || 0}}) | 当月推荐注册数({{item.numData.totalNumCurrentMonth || 0}})
          </div>
          <div class="top-all theme_font_gray" v-if="item.numData && item.id == 2">
            累计推荐绑卡人数({{item.numData.totalNum || 0}}) | 当月推荐绑卡数({{item.numData.totalNumCurrentMonth || 0}})
          </div>
          <div class="msg-list">
            <div class="msg-item" v-for="(msgitem,index) in item.listData">
              <p>会员编号: {{msgitem.userId}}</p>
              <p>手机号码: {{formatPhone(msgitem.phone)}}</p>
              <p>注册时间: {{msgitem.regDate}}</p>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Vue from 'vue'
  import RecommendedGift from './recommended-gift'


  export default {
    name: "mine-has-recommed",
    data() {
      return {
        selectIndex: -1,
        tab: [
          {"name": "推荐注册人数", "id": "1", pageOn: 1,},
          {"name": "推荐绑卡人数", "id": "2", pageOn: 1,},
        ],
        datails: {},
        complete: false,
        showAllPrice: true
      }
    },
    components: {
      RecommendedGift
    },
    mounted() {
      this.selectedFunc(0);
    },
    methods: {
      openDetails() {
        // 打开详情
        this.$router.push({path: '/usercenter/activity-strategy', query: {selectIndex: this.selectIndex}})
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      getMyReferUserNum: function () {
        this.$Loading.open()
        let url = '/app/json/user/getMyReferUserNum';
        let item = this.tab[this.selectIndex];
        let params1 = {
          token: this.$store.state.login.token,
          refererType: item.id
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            Vue.set(item, 'numData', data.data);
          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
          console.log('获取消息列表', error)
        })
      },
      getListData: function (loaded) {
        this.$Loading.open()
        let url = '/app/json/user/getMyReferUserList';
        let item = this.tab[this.selectIndex];

        let params1 = {
          token: this.$store.state.login.token,
          refererType: item.id,
          page: item.pageOn,
          rows: 10
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            Vue.set(item, 'listData', data.data.regUserInfoList);
          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
          console.log('获取消息列表', error)
        })
      },
      selectedFunc: function (index) {
        this.selectIndex = index;
        this.getAllData();
        if (index == 0) {
          this.queryRecommendRegisterAwardList()
        } else {
          this.queryRecommendBindCardAwardList()
        }
      },
      queryRecommendRegisterAwardList() {
        // 推荐注册奖励
        console.log('推荐注册奖励')
        this.$request.post('/app/json/app_market/queryRecommendRegisterAwardList', {}).then(res => {
          if (res.status === 0) {
            this.complete= false
            this.datails = res.data
            console.log(res.data)
            if (this.datails.awardMap) {
              this.$nextTick(()=>{
                this.complete = true
              })
            }
            this.$set(this.datails, 'index', this.selectIndex)

          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      queryRecommendBindCardAwardList() {
        // 推荐绑卡奖励
        console.log('推荐绑卡奖励')
        this.$request.post('/app/json/app_market/queryRecommendBindCardAwardList', {}).then(res => {
          if (res.status === 0) {
            this.complete= false
            this.datails = res.data
            console.log(res.data.awardMap.length)
            if (this.datails.awardMap.length) {
              this.$nextTick(()=>{
                this.complete = true
              })
            }
            this.$set(this.datails, 'index', this.selectIndex)
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      getAllData: function () {
        this.getMyReferUserNum();
        this.getListData();
      },
      formatPhone: function (num) {
        return num.substr(0, 3) + '****' + num.substr(-4)
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .mine-has-recommed {
    width 100%
    height 100%
    overflow hidden

    .tab {
      width: 100%;
      overflow: hidden;
      background: #fff;
      height 40px

      .item {
        width: 50%;
        float: left;
        text-align: center;
        height: 35px;

        span {
          display: inline-block;
          height: 35px;
          line-height: 35px;
          font-size: $font-size-medium-x;
          letter-spacing: 1px;
          border-bottom: 1px solid transparent;
          // font-weight:500;
        }
        & + .item {
          border-left: 1px solid #ececec
        }
      }

      .isActive {
        span {
          border-bottom: 2px solid $color-theme-r;
          color: $color-theme-r;
        }
      }
    }

    .content {
      position absolute
      top 40px
      bottom 0px
      width 100%
      overflow auto
      -webkit-overflow-scrolling: touch;

      .top-all {
        margin-top 10px
        padding 15px 0px
        border-radius 8px
        font-size $font-size-medium-s
        text-align center
        box-shadow 0px -1px 1px #efefef;

      }

      .msg-list {
        padding 0 10px;

        .msg-item {
          padding 11px 15px;
          border-radius 4px;
          overflow: hidden
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
          background: #fff;

          p {
            padding: 3px 0
            line-height: 1.428;
          }

          & + .msg-item {
            margin-top: 8px;
          }
        }
      }
    }

    .recommended-gift {
      padding: 11px 15px

      .title {
        font-size 14px
        color: $color-text
        .table-view-cell {
          padding: 11px 0
          .table-view-cell-arrow {
            color: $color-text-d
          }
        }
      }

      .progress {
        border-radius 6px
        background #fbf8d7
        padding 15px
        text-align center
      }
    }
  }
</style>
