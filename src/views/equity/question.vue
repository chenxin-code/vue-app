/**问卷权益*/
<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="权益详情" :bgImg="bg"></nav-top>
    <nav-content>
      <div class="containerTop">
        <div class="card">
          <img src="./imgs/card.png" alt="">
          <div class="wenjuan"><img :src="detail.equityPic" alt="">
            <div>
              <p>{{detail.equityName}}</p>
              <p>{{detail.equityValue}}</p>
            </div>
          </div>
          <div class="youxiao"><span>{{detail.Effective}}</span><span>{{detail.levelEquity}}</span></div>
          <span class="describe" @click="equityData">权益描述</span>
        </div>
      </div>
      <div class="box">
        <div class="div1">
          <div class="div_p"><p>可用<span class="span1">{{detail.cumulativeNum}}张</span>问卷</p><span @click="toDetail">权益明细<span class="img iconfont mall-gengduojiantou"></span></span></div>
        </div>
        <div class="divBox" v-for="item in detail.questionnaireModelList">
          <div>
            <div>
              <img src="./imgs/bi.png" alt="">
              <span class="span">{{item.name}}</span>
            </div>
            <span class="seeDiv" @click="prize(item.prizes)">查看奖品</span>
          </div>
          <p class="p">{{item.describe}}</p>
          <span class="fill">填写问卷</span>
        </div>
      </div>
    </nav-content>
    <van-popup v-model="commitModel" :close-on-click-overlay='false'>
      <div class="modal">
        <p class="title-p"><span>问卷奖品</span></p>
        <ul>
          <li v-for="prizeItem in prizes">
            <img src="./imgs/huangguan.png" alt>
            <span>{{prizeItem}}</span>
          </li>
        </ul>
      </div>
      <div class="btns">
        <span @click="commitModel=false" class="theme_bg_red">确定</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {
        commitModel: false,
        detail:{},
        prizes:[]
      }
    },
    computed: {
      bg() {
        return require('./imgs/bg1.png')
      }
    },
    mounted() {
       this.detail = JSON.parse(this.$route.query.detail);
       this.eType = String(this.detail.equityType).substr(0,1);
       var detail = this.detail;
       if(detail.validityType==1){
         detail.Effective = '永久有效';
       }else if(detail.validityType==2){
         detail.Effective = detail.days+'天内有效';
       }else if(detail.validityType==3){
         detail.Effective = detail.endTime+'前有效';
       }
       
    },
    methods: {
      equityData() {
        this.$router.push({
          path: '/equity/magnification',
          query: {

          }
        })
      },
      toDetail() {
        this.$router.push({
          path: '/equity/equityRecord',
          query: {
            equityType:this.detail.equityType
          }
        })
      },
      prize(prizes) {
       this.commitModel= true;
       this.prizes = prizes;
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  /deep/ .nav-content {
    overflow-y auto !important
  }
  .containerTop {
    width: 100%
    height 100px;
    background-position: 50% 50%
    background: url("./imgs/bg2.png") no-repeat center
    overflow: hidden
    background-size: 100% 100%
    .card {
      width 90%;
      position absolute;
      left 5%
      img {
        width 100%
      }
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
          width 40px !important
          float left
        }
        div {
          float left
          display flex
          flex-direction column
          height 40px;
          margin-left 6px
          p {
            margin auto 0
          }
          p:nth-child(1) {
            font-size 14px
          }
          p:nth-child(2) {
            font-size: 14px;
            color: #626763;
          }
        }
      }
    }
    .describe {
      width 60px;
      height 22px
      line-height 22px;
      text-align center
      z-index 999
      border-bottom-left-radius 5px;
      border-top-left-radius 5px;
      background #835419
      color: #dbc68f
      position absolute
      top 50%
      margin-top -11px;
      right: 4%;
    }
  }
  .box {
    margin: 70px 0 20px 0
    .div1 {
      padding: 0.213333rem;
      margin 0 auto
      box-shadow: 0 0 0.24rem 0 rgba(194, 192, 192, 0.3);
      .div_p {
        border-bottom 1px solid #ededed
        padding 20px 13px
        font-size 16px;
        display: flex;
        justify-content: space-between;
        .span1 {
          color #cb020d
        }
      }
    }
    .divBox {
      width 90%;
      margin 20px auto
      background #f5f5f5
      border-radius 6px
      padding 20px 10px
      div {
        display: flex;
        justify-content: space-between;
        span,img {
          margin auto 0
        }
        .span {
          margin-left 10px;
          font-size 18px
          font-weight bold
        }
      }
      .seeDiv {
        color: #b52a3a;
        font-size: 14px;
        padding-bottom: 5px;
        border-bottom: 1px solid;
      }
      .p {
        margin-top: 10px;
        text-indent: 1rem;
        font-size: 14px;
        line-height: 20px;
        color: #908a8a;
      }
      .fill {
        color: #7f5723;
        border: 1px solid;
        border-radius: 13px;
        margin: 0 auto;
        margin-top 20px
        display: block;
        height: 20px;
        width: 85px;
        line-height: 20px;
        text-align: center;
      }
    }
  }


  .van-popup {
    width: 80%;
    margin: 0 auto;
    top: 40%;
    overflow-y: hidden;
    border-radius: 6px;

    .btns {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top 20px;

      span {
        display: inline-block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        color white
      }

      span:nth-child(2) {
        color: white;

        a {
          color: white;
          display: block;
          width: 100%;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          text-align: center;
        }
      }
    }

    .modal {
      width: 90%;
      margin: 0 auto;

      .title-p {
        width: 60%;
        margin: 30px auto 20px auto;
        text-align: center;
        font-size: 16px;
        line-height: 26px;

        span {
          display block
        }
      }

      ul {
        li {
          padding 15px 0;
          line-height 22px;
          border-top: 1px solid #ecf1f1;
          display: flex;
          justify-content: space-around;
          font-size: 14px;

          img {
            width: 40px;
            height: 40px;
            margin-right: 24px;
            vertical-align: middle;
            margin auto
          }

          span:nth-child(2) {
            width 140px;
          }

          span:nth-child(3) {
            background: #fc9;
            padding: 4px 13px;
            border-radius: 9px;
          }

          span {
            margin auto
          }
        }

        li:last-child {
          border-bottom: 1px solid #ecf1f1;
        }
      }
    }
  }
  /deep/ .van-tabs__line {
    background-color: radial-gradient(to right, #ce000e, #ff994f) !important
  }
</style>
