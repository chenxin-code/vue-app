<template>
  <div class="min-top">
    <div class="user">
      <div class="ph">
        <img :src="userImage">
        <p>{{userName}}</p>
      </div>
      <!-- <div class="cu" @click="toCustomerService">
        <img src="./img/customer-service.png">
      </div> -->
    </div>
    <div class="nav">
      <ul>
        <li @click="toCollection">
          <img src="./img/collect.png">
          <p>我的收藏</p>
        </li>
        <li @click="toBrowsinglist">
          <img src="./img/record.png">
          <p>我的足迹</p>
        </li>
        <li @click="toStore">
          <img src="./img/shop.png">
          <p>订阅店铺</p>
        </li>
      </ul>
    </div>
    <div class="user-detail" :class="`rank${rankNum}`">
      <div class="grade">
        <div class="us-gr">
          <img class="img1" :src="require(`./img/ico0${rankNum}.png`)">
          <!-- <img class="img2" src="./img/dou.png"> -->
        </div>
        <!-- <div class="tip tip2"><p>100邦豆待领取</p></div> -->
      </div>
      <div class="growth-value">
        <div class="gr">
          成长值：{{rangeBegin}}/{{rangeEnd}}
        </div>
        <div class="ra">
          <div class="ra-con" :style="{width: barWidth}"></div>
        </div>
      </div>
      <div class="detail-nav">
        <ul>
          <li @click="exchange">
            <img :src="require(`./img/bangdou0${rankNum}.png`)">
            <p>邦豆兑换</p>
          </li>
          <li @click="task">
            <img :src="require(`./img/task0${rankNum}.png`)">
            <p>成长任务</p>
          </li>
          <li @click="strategy">
            <img :src="require(`./img/strategy0${rankNum}.png`)">
            <p>会员攻略</p>
          </li>
        </ul>
        <div class="tip"><p>每日签到</p></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'memberInfo',
    'userInfo'
  ],
  data() {
    return {
    }
  },
  computed: {
    userImage () {
      if (this.userInfo.userImage) {
        return this.userInfo.userImage
      } else {
        return require('./img/header-default.png')
      }
    },
    userName () {
      if (this.userInfo.userName) {
        return this.userInfo.userName
      }
    },
    barWidth(){ 
      return (this.rangeBegin / this.rangeEnd) * 100 + '%'
    },
    rangeBegin() {
      if (this.memberInfo.memberCardRelats) {
        return this.memberInfo.memberCardRelats[0].rangeBegin
      }
    },
    rangeEnd() {
      if (this.memberInfo.memberCardRelats) {
        return this.memberInfo.memberCardRelats[0].rangeEnd
      }
    },
    rankNum() {
      let rankNum = '1';
      if (this.memberInfo.memberCardRelats) {
        switch(this.memberInfo.memberCardRelats[0].levelId){
          case 1:
            rankNum = '1'
          break
          case 2:
            rankNum = '2'
          break;
          case 3:
            rankNum = '3'
          break;
          case 4:
            rankNum = '4'
          break;
          case 5:
            rankNum = '5'
          break;
        }
      }
      return rankNum;
    }
  },
  methods: {
    toCollection() {
      this.$router.push({
        path: '/mall2/collection',
        query: {
          active: 0
        }
      })
    },
    toStore() {
      this.$router.push({
        path: '/mall2/collection',
        query: {
          active: 1
        }
      })
    },
    toBrowsinglist() {
      this.$router.push({
        path: '/mall2/browsinglist'
      })
    },
    toCustomerService() {
      window.open('https://times.shidaijia.com/crmguest/public/index.html#/outer/cust-service?cust_id='+ this.$store.state.login.phone +'&client_id=linli')
    },
    exchange() {
      this.$toast('敬请期待…')
    },
    task() {
      this.$toast('敬请期待…')
    },
    strategy() {
      this.$toast('敬请期待…')
    }
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
.min-top {
  .tip {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 17px;
    font-size:10px;
    font-weight: 300;
    text-align: center;
    position: absolute;
    top: -4px; 
    left: 170px;
    background: url('./img/tips-little01.png') no-repeat;
    background-size: 100% 100%;
    p {
      color: #FFFFED;
    }
    &.tip2 {
      width: 85px;
      height: 17px;
      background-image: url('./img/tips-big01.png')
      left: 120px;
      top: -12px;
    }
  }
  padding:10px 20px 0;
  overflow:hidden;
  background: url('./img/top-bg.png') no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  border-radius: 0 0 26px 26px;
  .user {
    display: flex;
    justify-content: space-between
    align-items: center;
    margin-bottom: 10px;
    .ph {
      heigh: 50px;
      display: flex;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      p {
        font-size: 16px;
        color: #fff;
        text-indent: 10px;
        fong-weight: 400;
      }
    }
    .cu {
      img {
        width:26px;
      }
    }
  }
  .nav {
    margin-bottom: 16px;
    ul {
      display: flex;
      justify-content: space-around;
      li {
        img {
          height: 27px;
          display: block;
          margin: 0 auto 10px;
        }
        p {
          font-size: 12px;
          font-weight: 300;
          color: #fff;
        }
      }
    }
  }
  .user-detail {
    width:343px;
    height: 172px;
    background: url('./img/bg01.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 20px 20px 0 0; 
    box-sizing: border-box;
    margin: 0 auto;
    padding: 16px;
    .grade {
      display: flex;
      justify-content: space-between
      align-items: center;
      margin-bottom: 10px;
      position: relative;
      .us-gr {
        heigh: 30px;
        display: flex;
        align-items: center;
        .img1 {
          width: 86px;
        }
        .img2 {
          margin-left: 6px;
          width: 27px;
        }
      }
    }
    .growth-value {
      margin-bottom: 13px;
      .gr {
        font-size:13px;
        color: #7F86AA;
        font-weight: 300;
        margin-bottom: 20px;
      }
      .ra {
        width: 100%;
        height: 5px;
        background: url('./img/bar01.png') no-repeat;
        background-size: 100% 100%;
        border-radius: 6px;
        .ra-con {
          width: 0%;
          height: 5px;
          border-radius: 6px;
          background: url('./img/bar-con01.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .detail-nav {
      position: relative;
      ul {
        display: flex;
        justify-content: space-around
        li {
          img {
            width: 30px;
            display: block;
            margin: 0 auto 10px;
          }
          p {
            font-size: 12px;
            font-weight: 300;
            color: #70779F;
          }
        }
      }
    }
    &.rank2 {
      .tip {
        background-image: url('./img/tips-little02.png');
        &.tip2 {
          background-image: url('./img/tips-big02.png')
        }
      }
      background-image: url('./img/bg02.png')

      .gr {    
        color: #B5561A;
      }
      .ra {
        background-image: url('./img/bar02.png');

        .ra-con {
          background-image: url('./img/bar-con02.png');
        }
      }
      .detail-nav {
        li {
          p {
            color: #fff;
          }
        }
      }
    }
    &.rank3 {
      .tip {
        background-image: url('./img/tips-little03.png');
        &.tip2 {
          background-image: url('./img/tips-big03.png')
        }
      }
      background-image: url('./img/bg03.png')

      .gr {    
        color: #434342;
      }
      .ra {
        background-image: url('./img/bar03.png');

        .ra-con {
          background-image: url('./img/bar-con03.png');
        }
      }
      .detail-nav {
        li {
          p {
            color: #434342;
          }
        }
      }
    }
    &.rank4 {
      .tip {
        background-image: url('./img/tips-little04.png');
        &.tip2 {
          background-image: url('./img/tips-big04.png')
        }
      }
      background-image: url('./img/bg04.png')

      .gr {    
        color: #FFFFED;
      }
      .ra {
        background-image: url('./img/bar04.png');

        .ra-con {
          background-image: url('./img/bar-con04.png');
        }
      }
      .detail-nav {
        li {
          p {
            color: #FFFFED;
          }
        }
      }
    }
    &.rank5 {
      .tip {
        background-image: url('./img/tips-little05.png');
        &.tip2 {
          background-image: url('./img/tips-big05.png')
        }
      }
      background-image: url('./img/bg05.png')

      .gr {    
        color: #F1D8B0;
      }
      .ra {
        background-image: url('./img/bar05.png');

        .ra-con {
          background-image: url('./img/bar-con05.png');
        }
      }
      .detail-nav {
        li {
          p {
            color: #F1D8B0;
          }
        }
      }
    }
  }
}
</style>