<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="我的权益卡"></nav-top>
    <nav-content>
      <div>
        <div class="top">
          <div>
            <img alt src="./image/card.png"/>
            <span>卡</span>
          </div>
          <div @click="overDue">
            过期卡
            <span class="img iconfont mall-gengduojiantou"></span>
          </div>
        </div>
        <div class="contain" v-if="equityList.length>0">
          <ul>
            <li :style="{backgroundPosition: '50% 50%',backgroundImage: 'url('+item.backgroundPic+')',backgroundSize: '100% 100%'}" @click="detail(item)" v-for="item in equityList">
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
        <div class="box" v-if="equityList.length==0">
          <img alt src="./image/null.png"/>
          <p>暂无权益卡</p>
        </div>
        <div @click="equityCenter" class="btn">权益卡中心</div>
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
          state: 1
        };
        this.$http
          .post("/app/json/equity_card/queryMyEquityCard", paramsData)
          .then(res => {
            let data = res.data;
            if (data.status == 0) {
              this.equityList = data.data || [];
            } else {
              this.$Toast(res.data.info);
            }
          });
      },
      detail(data) {
        this.$router.push({
          path: '/equity_card/detail',
          query: {
            id: data.id
          }
        })
      },
      overDue() {
        this.$router.push({
          path: "/equity_card/overdue"
        });
      },
      equityCenter() {
        this.$router.push({
          path: "/equity_card/equityCenter"
        });
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .body {
    .top {
      display: flex;
      justify-content: space-between;
      width: 96%;
      margin: 0 auto;

      div:nth-child(1) {
        margin: auto 0;
        display: flex;

        span {
          margin: auto 0;
        }
      }

      div:nth-child(2) {
        margin: auto 0;
        color: #9a9a9a;
      }
    }

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

    .btn {
      width: 200px;
      height: 40px;
      border: 1px solid #009cef;
      border-radius: 23px;
      text-align: center;
      line-height: 40px;
      color: #009cef;
      font-size: 16px;
      margin: 50px auto 0 auto;
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
