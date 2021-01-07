<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" title="我的权益卡"></nav-top>
    <nav-content>
      <div :style="{backgroundPosition: '50% 50%',backgroundImage: 'url('+backgroundPic+')',backgroundSize: '100% 100%'}" class="div">
        <div>
          <p>{{equityCardName}}</p>
          <p>{{Effective}}</p>
        </div>
      </div>
      <div class="beishu">
        <ul>
          <li v-for="item in equityItemModels">
            <span>{{item.equityName}}</span>
            <span v-if="!item.prizeModels.id">{{item.equityValue}}{{getUnit(item.equityTypeCode)}}</span>
            <span v-if="item.prizeModels.id" @click="goDetail(item.prizeModels.prizeType)">
              {{item.prizeModels.prizeName}}-{{item.prizeModels.prizeNum}}张/{{validityName}}
              <span class="img iconfont mall-gengduojiantou"></span>
            </span>
          </li>
          <li>
            <span>使用说明</span>
          </li>
        </ul>
        <div class="explain">{{instructions}}</div>
      </div>
      <div @click="getRease(1)" class="btn" v-if="receiveType==1">立即领取</div>
      <div @click="toBuy" class="btn" v-if="receiveType==2">￥5.00 购买</div>
      <div @click="getRease(3)" class="btn" v-if="receiveType==3">尚未满足条件</div>
    </nav-content>
  </div>
</template>
<script>
import { Dialog } from 'vant';

export default {
  data() {
    return {
      detail: [],
      equityItemModels: [],
      equityCardName: "",
      Effective: "",
      instructions: "",
      backgroundPic: "",
      invalidTime: "",
      receiveType: "",
      validityName: '',
    };
  },
  mounted() {
    this.detailData();
  },
  methods: {
    detailData() {
      let paramsData = {
        token: this.$store.state.login.token,
        equityCardId: this.$route.query.id
      };
      this.$http
        .post("/app/json/equity_card/queryEquityCardDetail", paramsData)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (data.status == 0) {
            this.equityCardName = data.data.equityCardName;
            this.day = data.data.validityType;
            this.receiveType = data.data.receiveType;
            if (this.day == 0) { //周期性 (0:每周1:每月2:每季3:每年）
              this.validityName = '周'
            } else if (this.day == 1) {
              this.validityName = '月'
            } else if (this.day == 2) {
              this.validityName = '季'
            } else if (this.day == 3) {
              this.validityName = '年'
            }
            if (data.data.validityType == 1) {
              this.Effective = "永久有效";
            } else if (data.data.validityType == 2) {
              this.Effective = data.data.days + "天内有效";
            } else if (data.data.validityType == 3) {
              this.Effective = data.data.invalidTime + "前有效";
              this.invalidTime = data.data.invalidTime;
            }
            this.instructions = data.data.instructions;
            this.equityItemModels = data.data.equityItemModels || [];
            this.backgroundPic = data.data.backgroundPic;
          } else {
            this.$Toast(res.data.info);
          }
        });
    },
    toBuy() {
      this.$router.push({
        path: '/mall2/checkstand',
        query: {
          payInfo: JSON.stringify({
            orderId: res.data.data.orderId,
            tradeNo: res.data.data.tradeNo,
            style: 'equityCar',
            payAmount: this.allMoney,
            orderType: '200104'
          }),
          occurOuCode: res.data.data.occurOuCode
        }
      })
    },
    getRease(type) {
      //立即领取
      let paramsData = {
        token: this.$store.state.login.token,
        equityCardId: this.$route.query.id,
        equityCardName: this.equityCardName,
        receiveType: type,
        validityType: this.day,
        backgroundPic: this.backgroundPic,
        invalidTime: this.day == 3 ? this.invalidTime : "",
        equityItemModels: this.equityItemModels
      };
      this.$http
        .post("/app/json/equity_card/addEquityCardMember", paramsData)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (data.status == 0) {
            if (type == '1') { //立即领取
              this.$Toast("领取成功");
              this.$router.go(-1);
            } else if (type == '3') {
              //  Dialog.alert({
              //   title: "未满足条件",
              //   message: "累计消费金额：500<100<br />累计订单比数：53<100",

              // }).then(() => {
              // });
            }
          } else {
            this.$Toast(res.data.info);
          }
        });
    },
    getUnit(code) {
      var fCode = String(code).substr(0, 1);
      if (fCode == '1' || fCode == '2') {
        return '倍'
      } else if (fCode == '4' || fCode == '5') {
        return '折'
      }
    },
    goDetail(type) {
      if (type == '32') { // 游戏
        this.$router.push({
          path: '/mall2/win_record',
          query: {
            type: 'equity_car'
          }
        })
      } else if (type == '33') { // 优惠券
        this.$router.push({
          path: '/coupon_list',
          query: {
            type: 'equity_car'
          }
        })
      }
    }
  }
};

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.div {
  height: 120px;
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;

  div {
    p:nth-child(1) {
      font-size: 16px;
      margin: 8px 0;
    }
  }
}

.beishu {
  margin-top: -55px;
  background: white;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;

  li {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    border-bottom: 1px solid #f1f1f1;
  }
}

.explain {
  padding: 15px;
  line-height: 20px;
}

/deep/ .nav-content {
  overflow-y: auto !important;
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

</style>
