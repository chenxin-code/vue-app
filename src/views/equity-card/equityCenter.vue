<template>
  <div class="body">
    <nav-top title="我的权益卡" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="contain">
        <ul>
          <li v-for="(item,index) in equityList">
            <div
              :style="{backgroundPosition: '50% 50%',backgroundImage: 'url('+item.backgroundPic+')',backgroundSize: '100% 100%'}">
              <p>{{item.equityCardName}}</p>
              <p v-if="item.validityType == 1">永久有效</p>
              <p v-if="item.validityType == 2">{{item.validityDay}}内有效</p>
              <p v-if="item.validityType == 3">{{item.validityStartDate}}-{{item.validityEndDate}}有效</p>
              <!-- <p v-if="item.invalidTime">有效期至{{item.invalidTime}}</p> -->
            </div>
            <div>
              <span v-if="item.receiveType == 1">免费领取</span>
              <span v-if="item.receiveType == 3">满足条件，已领取</span>
              <span v-if="item.receiveType == 2">5.00元已购买</span>
              <span @click="detailData(item)">权益详情</span>
            </div>
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
      showList() {
        let paramsData = {
          token: this.$store.state.login.token,
          type: 1
        };
        this.$http
          .post("/app/json/equity_card/queryEquityCardCentre", paramsData)
          .then(res => {
            console.log(res);
            let data = res.data;
            if (data.status == 0) {
              this.equityList = data.data || [];
            } else {
              this.$Toast(res.data.info);
            }
          });
      },
      detailData(data) {
        this.$router.push({
          path: '/equity_card/detail',
          query: {
            equityCardId: data.equityCardId,
            id: data.id
          }
        })
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
          margin-bottom: 15px;
          position: relative;

          div:nth-child(1) {
            color: white;
            height: 85px;
            padding: 15px;
            margin: auto 0;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;

            p:nth-child(1) {
              font-size: 16px;
              margin: 8px 0;
            }
          }

          div:nth-child(2) {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            height: 50px;
            line-height: 50px;
            padding: 0 10px;
            font-size: 14px;
            box-shadow: -2px 0 3px -1px #f1f1f1, 0 2px 3px -1px #f1f1f1, 2px 0 3px -1px #f1f1f1, 0 -2px 3px -1px #f1f1f1;

            span:nth-child(2) {
              border: 1px solid #f1f1f1
              height: 30px
              line-height: 30px
              margin: auto 0
              padding: 0 10px
              border-radius: 10px
            }

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
