<template>
  <div class="min-top">
    <div class="user">
      <div class="ph">
        <img src="./img/user.png">
        <p>13662257881</p>
      </div>
      <div class="cu">
        <img src="./img/user.png">
      </div>
    </div>
    <div class="nav">
      <ul>
        <li>
          <img src="./img/user.png">
          <p>我的收藏</p>
        </li>
        <li>
          <img src="./img/user.png">
          <p>我的足迹</p>
        </li>
        <li>
          <img src="./img/user.png">
          <p>订阅店铺</p>
        </li>
      </ul>
    </div>
    <div class="user-detail">
      <div class="grade">
        <div class="us-gr">
          <img src="./img/user.png">
          <p>13662257881</p>
        </div>
        <div class="img-gr">
          <img src="./img/user.png">
        </div>
      </div>
      <div class="growth-value">
        <div class="gr">
          成长值：500/1000
        </div>
        <div class="ra">
          <div class="ra-con"></div>
        </div>
      </div>
      <div class="detail-nav">
        <ul>
          <li>
            <img src="./img/user.png">
            <p>邦豆兑换</p>
          </li>
          <li>
            <img src="./img/user.png">
            <p>成长任务</p>
          </li>
          <li>
            <img src="./img/user.png">
            <p>会员攻略</p>
          </li>
        </ul>
        <div class="sign-in"><p>每日签到</p></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
.min-top {
  padding:10px 20px 0;
  background: red;
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
        font-size: 16px;
      }
    }
    .cu {
      img {
        width:30px;
      }
    }
  }
  .nav {
    margin-bottom: 10px;
    ul {
      display: flex;
      justify-content: space-around;
      li {
        img {
          width: 30px;
          display: block;
          margin: 0 auto 10px;
        }
      }
    }
  }
  .user-detail {
    width:100%;
    height: 200px;
    background #ccc;
    border-radius: 20px 20px 0 0; 
    box-sizing: border-box;
    padding: 10px;
    .grade {
      display: flex;
      justify-content: space-between
      align-items: center;
      margin-bottom: 10px;
      .us-gr {
        heigh: 30px;
        display: flex;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          font-size: 16px;
        }
      }
      .img-gr {
        img {
          height:30px;
        }
      }
    }
    .growth-value {
      margin-bottom: 20px;
      .gr {
        font-size:14px;
        padding-bottom: 6px;
      }
      .ra {
        width: 100%;
        height: 6px;
        border-radius: 6px;
        background : red;
        .ra-con {
          width: 70%;
          height: 6px;
          border-radius: 6px;
          background: blue;
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
        }
      }
      .sign-in {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 25px;
        font-size:12px;
        text-align: center;
        position: absolute;
        top: -6px; 
        left: 180px;
        background: red;
        color: #fff;
      }
    }
  }
}
</style>