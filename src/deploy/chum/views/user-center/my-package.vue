<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="package">
      <van-dropdown-menu>
        <van-dropdown-item v-model="value1" :options="option1" @change="select"/>
      </van-dropdown-menu>
      <van-tabs @click="changeTabs" color="#C9A063">
        <van-tab title="未受理"></van-tab>
        <van-tab title="受理中"></van-tab>
        <van-tab title="已受理"></van-tab>
        <van-tab title="已取消"></van-tab>
      </van-tabs>
      <van-list
        v-model="isLoading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="200"
        @load="loadMore">
        <ul class="card-c" v-if="cardList.length !== 0">
          <li
            v-for="(item, index) in cardList"
            :key="index"
            class="item">
            <div class="btn-con">
              <van-button round type="info" class="type" :class="variClass(value1)">{{variStatus(item.showType, item)}}</van-button>
              <van-button square type="primary" class="status" :class="variStatus2(useState)">{{variStatus1(useState)}}</van-button>
            </div>
            <div class="content" v-if="item.showType == 1">
              <div class="time">
                <label class="label-name">预约时间：</label><span class="real-name">{{item.useBeginTime}}</span>
              </div>
              <div class="from">
                <label class="label-name">from：</label><span class="real-name"> {{item.useStartPlace}}</span>
              </div>
              <div class="to">
                <label class="label-name">to：</label><span class="real-name">{{item.useEndPlace}}</span>
              </div>
              <div class="bordNo">
                <label class="label-name">航班号：</label><span class="real-name"> {{item.flightNo}}</span>
              </div>
            </div>
            <div class="content" v-if="item.showType == 2">
              <div class="time">
                <label class="label-name">计划出行日期：</label><span class="real-name">{{item.useBeginTime.split(" ")[0]}}</span>
              </div>
              <div class="from">
                <label class="label-name">签证国家：</label><span class="real-name"> {{item.targetPlace}}</span>
              </div>
            </div>
            <div class="content" v-if="item.showType == 0">
              <div class="time">
                <label class="label-name">计划出行日期：</label><span class="real-name">{{item.useBeginTime.split(" ")[0]}}</span>
              </div>
              <div class="from">
                <label class="label-name">出发城市：</label><span class="real-name"> {{item.useStartPlace}}</span>
              </div>
              <div class="to">
                <label class="label-name">目的地：</label><span class="real-name">{{item.useEndPlace}}</span>
              </div>
            </div>
            <div class="handle" v-if="useState[0]==0">
              <van-button round type="primary" class="btn" @click="cancel(item)">取消预约</van-button>
            </div>
          </li>
        </ul>
      </van-list>
    </nav-content>
  </div>
</template>
<script>
  import {DropdownMenu, DropdownItem} from 'vant';

  export default {
    name: "myPackage",
    components: {
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem,
    },
    data() {
      return {
        isLoading: true,
        finished: false,
        cardList: [],
        show: false,
        type: "定制游",
        useState:[0],
        value1: -1,
        option1: [
          {text: '全部', value: -1},
          {text: '定制游', value: 0},
          {text: '礼宾车', value: 1},
          {text: '签证', value: 2},
        ],
        pageInfo: {
          page: 0,
          rows: 10
        },
        tempUseState: 0
      }
    },
    methods: {
      loadMore() {
        let url = ""
        let params = {
          // id: 10,
          useStateList: this.useState,
          ...this.pageInfo
        }
        switch (this.value1) {
          case -1:
            url = '/app/json/equity_use_travel/equityUseOrder'
            delete params.useStateList
            params.useState = this.tempUseState
            break
          case 0:
            url = "/app/json/equity_use_travel/getTravelList"
            break;
          case 1:
            url = "/app/json/equity_use_car/getCarList"
            break;
          case 2:
            url = "/app/json/equity_use_visa/getVisaList"
            break;
        }
        this.isLoading = true;
        this.pageInfo.page++;
        this.$Loading.open();
        this.$http.post(url, params).then(res => {
          this.isLoading = false;
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              data.data.forEach(item => {
                if (this.value1 == -1) {
                  if (item.equityTypeCode == 51005) {
                    item.showType = 0
                  } else if (item.equityTypeCode == 51001) {
                    item.showType = 1
                  } else if (item.equityTypeCode == 51006) {
                    item.showType = 2
                  }
                } else {
                  item.showType = this.value1
                }
              })
              this.cardList.push(...data.data)
              if (this.cardList.length >= data.totalRecords) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
            this.$Toast(data.info);
          }
          this.$Loading.close();
        }).catch(err => {
          this.finished = true;
          this.$Toast(err);
          this.$Loading.close();
        })
      },
      changeTabs(name) {
        this.tempUseState = name
        if (this.useState[0]!= name) {
          this.pageInfo = {
            page: 0,
            rows: 10
          }
          this.cardList = [];
          this.isLoading = true
          this.finished = false
          this.useState=[];
         if(name==3){
           this.useState.push(3);
           this.useState.push(4);
         }else{
           this.useState.push(name)
         }
          this.loadMore();
        }
      },
      select(item) {
        this.pageInfo = {
          page: 0,
          rows: 10
        }
        this.cardList = [];
        this.isLoading = true
        this.finished = false
        // this.useState = name;
        this.loadMore();
      },
      variClass(item) {
        let result = ''
        switch (item) {
          case 1:
            result = "pickUp"
            break;
          // case "送机":
          //   result = "send"
          //   break;
          case 2:
            result = "passport"
            break;
          case 0:
            result = "cust-travel"
            break;
          default:
            result = ""
        }
        return result
      },
      variStatus(item,data){
        let result = ''
        switch (item) {
          case 1:
            result = data.serviceType==1?"接机":"送机"
            break;
          // case "送机":
          //   result = "send"
          //   break;
          case 2:
            result = "签证"
            break;
          case 0:
            result = "定制游"
            break;
          default:
            result = ""
        }
        return result
      },
      variStatus1(item){
        let result = ''
        switch (item[0]) {
          case 0:
            result = "未受理"
            break;
          // case "送机":
          //   result = "send"
          //   break;
          case 1:
            result = "受理中"
            break;
          case 2:
            result = "已受理"
            break;
          case 3:
            result = "已取消"
            break;
          default:
            result = ""
        }
        return result
      },
      variStatus2(item){
        let result = ''
        // item[0]=1
        switch (item[0]) {
          case 0:
            result = "noget"
            break;
          case 1:
            result = "getting"
            break;
          case 2:
            result = "geted"
            break;
          case 3:
            result = "canceled"
            break;
          default:
            result = ""
        }
        return result
      },
      onSelect(item) {
        this.type = item.name
        this.show = false
        this.loadMore()
      },
      cancel(item) {
        console.log(666,item)
        let url = ""
        switch (this.value1) {
          case 0:
            url = "/app/json/equity_use_travel/appUpdateTravelStatus"
            break;
          case 1:
            url = "/app/json/equity_use_car/appUpdateCarStatus"
            break;
          case 2:
            url = "/app/json/equity_use_visa/appUpdateVisaStatus"
            break;
          case -1:
            // 签证
            if(item.equityTypeCode=='51006'){
              url = "/app/json/equity_use_visa/appUpdateVisaStatus"
              // 定制游
            }else if(item.equityTypeCode=='51005'){
              url = "/app/json/equity_use_travel/appUpdateTravelStatus"
            // 礼宾车
            }else if(item.equityTypeCode=='51001'){
              url = "/app/json/equity_use_car/appUpdateCarStatus"
            }
            break;
        }
        let params = {
          useState:4,
          id:item.id
        }
        this.$http.post(url, params).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$Toast("取消成功");
            this.cardList = [];
            this.loadMore()
          } else {
            this.$Toast(data.info)
          }
        }).catch((err) => {
          this.$Toast(err)
        })
      }
    },
    beforeRouteLeave(to, from, next) {
			if (to.path != '/coupon_service_detail') {
				this.$keepaliveHelper.deleteCache(this)
			}
			next()
		},
    created() {
      this.loadMore()
    }
  }
</script>

<style lang="stylus" scoped>
  /deep/ .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    border none
  }
  .package{
    overflow scroll
  }
  /deep/ .item {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin 10px 20px
    padding-top 0.1px
    padding-bottom 12px
    /*padding 18px 15px*/
    /*overflow-x hidden*/

    .btn-con {
      display flex
      justify-content space-between
      margin-right 15px
      margin-top 18px

      .type {
        width: 65px;
        height: 25px;
        padding 0px 0px
        border-radius: 0 12.5px 12.5px 0;
        line-height: 20px;
        border none
        background: rgba(198, 221, 255, 1);

        .van-button__text {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
          color #2E5BFF
        }
      }

      /deep/ .passport {
        background: rgba(255, 219, 219, 1);

        .van-button__text {
          color: #CF1111
        }

      }

      /deep/ .cust-travel {
        background: rgba(255, 219, 198, 1);

        .van-button__text {
          color: #FF732E
        }

      }

      .status {
        width: 60px;
        height: 25px;
        padding 3px 9px
        background: rgba(159, 160, 160, 1);
        border-radius: 5px;
        line-height: 20px;
        border none

        .van-button__text {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
        }
      }
    }

    .content {
      .from, .to, .bordNo, .time {
        margin 5px 10px 3px
        display flex
        justify-content flex-start

        label {
          width 100px
          display block
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(16, 16, 16, 1);
          line-height: 20px;
        }

        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(16, 16, 16, 1);
          line-height: 20px;
        }
      }

    }

  }

  .handle {
    display: flex;
    justify-content: flex-end;
    margin: 10px 20px 0px;
    padding 10px 0px 0px
    border-top 1px solid #DCDDDD

    .btn {
      height: 32px;
      line-height: 32px;
      background:rgba(255,255,255,1);
      border-radius:24px;
      border:1px solid rgba(240,44,45,1);
      .van-button__text{
        font-size:14px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(240,44,45,1);
        line-height:20px;
      }
    }
  }
  .noget{
    color white
    background #9FA0A0!important
  }
  getting{
    color white
    /*background #F02C2D!important*/
    background #9FA0A0!important
  }
  .canceled{
    color white
    background #9FA0A0!important
  }
  .geted{
      background #49B972!important
    color white
  }
  /deep/.van-tab--active .van-tab__text{
    color:#C9A063
  }

</style>
