<template>
  <div class="body">
    <nav-top title="过期权益卡" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="contain">
        <ul>
          <li
            v-for="item in equityList"
            :style="{backgroundPosition: '50% 50%',backgroundImage: 'url('+item.backgroundPic+')',backgroundSize: '100% 100%'}">
            <div>
              <p>{{item.equityCardName}}</p>
              <p v-if="item.validityType == 1">永久有效</p>
              <p v-if="item.validityType == 2">{{item.validityDay}}内有效</p>
              <p v-if="item.validityType == 3">{{item.invalidTime}}前有效</p>
            </div>
            <div v-if="item.receiveType == 1">免费领取</div>
            <div v-if="item.receiveType == 3">满足条件，已领取</div>
            <div v-if="item.receiveType == 2">5.00元已购买</div>
          </li>
        </ul>
      </div>
      <div v-if="equityList.length==0" class="box">
        <img src="./image/null.png" alt/>
        <p>暂无过期权益卡</p>
      </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        equityList: []
      };
    },
    mounted() {
      this.showList();
    },
    methods: {
      showList(item) {
         let paramsData = {
          token: this.$store.state.login.token,
          state: 2
        };
         this.$http
          .post("/app/json/equity_card/queryMyEquityCard", paramsData)
          .then(res => {
            let data = res.data;
            if (data.status == 0) {
              this.equityList = data.data;
            } else {
              this.$Toast(res.data.info);
            }
          });
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    .contain {
      width: 96%;
      margin: 20px auto;

      ul {
        li {
          height: 85px;
          color: white;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          padding: 15px;
          margin-bottom: 15px;
          position: relative;

          img {
            position: absolute;
            width: 100%;
            top: 0;
            height: 100%;
            left: 0;
          }

          div:nth-child(1) {
            margin: auto 0;

            p:nth-child(1) {
              font-size: 16px;
              margin: 8px 0;
            }
          }

          div:nth-child(2) {
            margin: auto 0;
          }
        }
      }
    }
  }

  .box {
    text-align: center;
    margin-top: 20%;

    p {
      padding: 20px 0;
      font-size: 16px;
    }
  }
</style>
