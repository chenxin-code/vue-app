/**1,2,4拥有*/
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
        </div>
      </div>
      <div class="box">
        <div class="div1">
          <p class="div_p" v-if="eType=='1'">累计增加积分：{{detail.cumulativeNum}}</p>
          <p class="div_p" v-if="eType=='2'">累计增加积分：{{detail.cumulativeNum}}</p>
          <p class="div_p" v-if="eType=='4'">已累计节省：{{detail.cumulativeNum}}元</p>
          <ul v-if="eType=='1'">
            <li v-for="item in detail.recordModelList"><div class="divMall"><div>{{item.source}}<p><span>（{{item.initNum}}*</span><span class="div2">{{item.magnification}}</span>）</p></div><p class="p1">{{item.createTime}}</p></div><div class="divSH">+ {{item.source-item.initNum}}</div></li>
          </ul>
          <ul v-if="eType=='2'">
            <li v-for="item in detail.recordModelList"><div class="divMall"><p class="p1">{{item.createTime}}</p></div><div class="divSH">+ {{item.totalNum}}</div></li>
          </ul>
          <ul v-if="eType=='4'">
            <li v-for="item in detail.recordModelList"><div class="divMall"><div>{{item.source}}<p><span>（{{item.initNum}}*</span><span class="div2">{{item.magnification*10}}%</span>）</p></div><p class="p1">{{item.createTime}}</p></div><div class="divSH">- {{item.initNum-item.source}} 元</div></li>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "have-equity",
    data() {
      return {
        detail:{},
        eType: '0'
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
      img {
        width 100%
      }
    }
  }
  .box {
    margin: 70px 0 20px 0
    .div1 {
      width 90%
      margin 0 auto
      box-shadow: 0 0 0.24rem 0 rgba(194, 192, 192, 0.3);
      padding: 15px 0px;
      .div_p {
        text-align center
        border-bottom 1px solid #d3d3d3
        padding 20px 13px
        font-size 16px;
        span {
          color #cb020d
        }
      }
      ul {
        li {
          border-bottom: 1px solid #d3d3d3;
          padding: 10px 13px;
          display: flex;
          justify-content: space-between;
          font-size 16px
          .divMall {
            margin auto 0
            div {
              width 230px;
              display flex
              justify-content flex-start
              .div2 {
                color #cb020d
              }
            }
          }
          .p1 {
            font-size 14px;
            color #bcb4b4
            margin-top 10px;
          }
          .divSH {
            margin auto 0
          }

        }
      }
    }
  }
</style>
