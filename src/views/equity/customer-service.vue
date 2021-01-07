/**1,2,4拥有*/
<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="权益详情" :bgImg="bg"></nav-top>
    <nav-content>
      <div class="containerTop">
        <div class="card">
          <img src="./imgs/card.png" alt />
          <div class="wenjuan">
            <img :src="detail.equityPic" alt />
            <div>
              <p>{{detail.equityName}}</p>
              <!-- <p>{{detail.equityValue}}</p> -->
            </div>
          </div>
          <div class="youxiao">
            <span>{{detail.Effective}}</span>
            <span>{{detail.levelEquity}}</span>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="custom">
          <div>
            <span class="span1">约车客服</span>
            <span class="span2">{{detail.servicePhone}}</span>
          </div>
          <a href="tel:17600646963">
            <img src="./imgs/phone.png" class="phone" alt="">
          </a>
        </div>
        <div class="divs">
          <p class="myCar">我的约车</p>
          <div class="carList" @click="toDetail(item)" v-for="(item,index) in carList">
            <p class="p">
              <span class="span" v-if="item.useState == 1">预约成功</span>
              <span class="span gray" v-if="item.useState == 2">已取消</span>
              <span class="time">{{item.useTime}}</span>
            </p>
            <div class="boxs">
              <p>线路起点：<span>{{item.useStartPlace}}</span></p>
              <p>线路终点：<span>{{item.useEndPlace}}</span></p>
              <p>用车类型：<span>{{item.serviceType}}</span></p>
              <p>用车时间：<span>{{item.useTime}}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="null" v-if="carList.length==0">暂无数据</div>
    </nav-content>
  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "have-equity",
  data() {
    return {
      detail: {},
      eType: "0",
      carList: []
    };
  },
  computed: {
    bg() {
      return require("./imgs/bg1.png");
    }
  },
  mounted() {
      // {useStartPlace: '北京雍和宫',useState: 1, useEndPlace: '北京游乐园', serviceType: '约车',useTime: '2020-09-10',id:4},
      // {useStartPlace: '北京雍和宫',useState: 2, useEndPlace: '北京游乐园', serviceType: '约车',useTime: '2020-09-10',id:6},
      // {useStartPlace: '北京雍和宫',useState: 1, useEndPlace: '北京游乐园', serviceType: '约车',useTime: '2020-09-10'},
      // {useStartPlace: '北京雍和宫',useState: 2, useEndPlace: '北京游乐园', serviceType: '约车',useTime: '2020-09-10'}
    this.detail = JSON.parse(this.$route.query.detail);
    this.eType = String(this.detail.equityType).substr(0, 1);
    var detail = this.detail;
    if (detail.validityType == 1) {
      detail.Effective = "永久有效";
    } else if (detail.validityType == 2) {
      detail.Effective = detail.days + "天内有效";
    } else if (detail.validityType == 3) {
      detail.Effective = detail.endTime + "前有效";
    }
    this.loadData()
  },
  methods: {
    loadData(){
      let params = new FormData()
      let paramsData = {
        token: this.$store.state.login.token,
        equityType: this.detail.equityType,
        equityId: this.detail.equityId,
        id: this.detail.id
      }
      params.append('jsonData', JSON.stringify(paramsData))
      this.$http.post('/app/json/equity_member/queryMyEquityRecord', params).then(res => {
        let data = res.data
        if (data.status == 0) {
          this.carList = data.cancelThirdModels || []
        } else {
          this.$Toast(res.data.info)
        }
      })
    },
    toDetail(data) {
        this.$router.push({
        path: '/equity/car_customer_service_detail',
        query: {
          id: data.id
        }
      })
    }
  },
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
/deep/ .nav-content {
  overflow-y: auto !important;
}

.containerTop {
  width: 100%;
  height: 100px;
  background-position: 50% 50%;
  background: url('./imgs/bg2.png') no-repeat center;
  overflow: hidden;
  background-size: 100% 100%;

  .card {
    width: 90%;
    position: absolute;
    left: 5%;

    .youxiao {
      position: absolute;
      bottom: 22px;
      width: 80%;
      left: 50%;
      margin-left: -40%;
      color: #896123;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
    }

    .wenjuan {
      position: absolute;
      top: 20%;
      left: 8%;

      img {
        width: 40px !important;
        float: left;
      }

      div {
        float: left;
        display: flex;
        flex-direction: column;
        height: 40px;
        margin-left: 6px;

        p {
          margin: auto 0;
        }

        p:nth-child(1) {
          font-size: 14px;
        }

        p:nth-child(2) {
          font-size: 14px;
          color: #626763;
        }
      }
    }

    img {
      width: 100%;
    }
  }
}

.box {
  margin: 70px 0 20px 0;
  .custom {
    display: flex;
    justify-content space-between
    width 95%
    margin 10px auto
    padding 10px 10px
    .a {
      margin auto 0
    }
    .phone {
      width: 30px;
      margin: auto 0;
      height: 30px;
    }
    div {
      display flex
      flex-direction column;
      .span1 {
        font-size 16px
        padding 15px 0
      }
      .span2 {
        font-size 22px
        font-weight 600
      }
    }
  }

  .div1 {
    width: 95%;
    margin: 0 auto;
    box-shadow: 0 0 0.24rem 0 rgba(194, 192, 192, 0.3);
    padding 10px 10px

    .div_p {
      border-bottom: 1px solid #d3d3d3;
      padding: 20px 13px;
      font-size: 16px;

      span {
        color: #cb020d;
      }
    }

    ul {
      li {
        border-bottom: 1px solid #d3d3d3;
        padding: 10px 13px;
        display: flex;
        justify-content: space-between;
        font-size: 16px;

        .divMall {
          margin: auto 0;

          div {
            width: 230px;
            display: flex;
            justify-content: flex-start;

            .div2 {
              color: #cb020d;
            }
          }
        }

        .p1 {
          font-size: 14px;
          color: #bcb4b4;
          margin-top: 10px;
        }

        .divSH {
          margin: auto 0;
        }
      }
    }
  }
}

.divs {
  width 95%
  margin 10px auto
  font-size: 14px;
  box-shadow: 0 0 0.24rem 0 rgba(194, 192, 192, 0.3);
  padding 10px 10px
  .myCar {
    font-size 16px
    margin-bottom 10px
  }
  .carList {
    padding 10px 0
    margin 10px 0
    background #f5f5f5
    border-radius 6px
    .p {
      margin: 5px 0;
      padding: 0 10px;
      display flex
      justify-content space-between
      span {
        margin auto 0
      }
      .span {
        background: #cb020d;
        color: #fff;
        padding: 4px 7px;
        border-radius: 12px;
        margin-right: 10px;
      }
      .gray {
        color black
        background: linear-gradient(to left, #a0a0a0, #c1c1c1);
      }
      .time {
        color #999999
      }
    }

    .boxs {
      padding: 5px 10px;
      p {
        margin-top: 12px;
        color #9b9b9b
        span {
          color black
        }
      }
    }
  }
}
.null {
  text-align: center;
  font-size: 16px;
  margin-top: 100px;
}
</style>
