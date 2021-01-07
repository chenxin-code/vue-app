<template>
  <div class="body">
    <nav-top title="签约详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <div class="publicInvoice">
          <p>基本信息1</p>
          <ul>
            <li>
              <span v-if="itemObj.generateKey">序列号</span>
              <span>{{ itemObj.generateKey }}</span>
            </li>
            <li>
              <span>签约号</span>
              <span>{{ itemObj.tradeNo }}</span>
            </li>
            <li>
              <span>用户名</span>
              <span>{{ itemObj.custName }}</span>
            </li>
            <li v-if="itemObj.signType == 3">
              <span>身份证号</span>
              <span>{{ itemObj.idCardNo | formatIdNo }}</span>
            </li>
            <li v-if="itemObj.signType == 2">
              <span>车牌号</span>
              <span>{{ itemObj.plateNo }}</span>
            </li>
            <li v-if="itemObj.operateState==0">
              <span>签约状态</span>
              <span>已解约</span>
            </li>
          </ul>
        </div>
        <div class="publicInvoice">
          <p>银行卡自动扣款</p>
          <ul>
            <!-- 已签约、签约中 -->
            <template v-if="itemObj.operateState!=0">
              <li v-if="itemObj.signPayWay">{{ itemObj.signPayWay }}</li>
              <li>
                <span>签约时间</span>
                <span class="span">{{ itemObj.createTime }}</span>
              </li>
            </template>
            <!-- 已解约 -->
            <template v-if="itemObj.operateState==0">
                <li v-if="itemObj.userId">
                  <span>微信号</span>
                  <span class="user">{{itemObj.userId}}</span>
                </li>
                <li style="color:#f00">
                  <span>解约时间</span>
                  <span class="user">{{itemObj.operateTime}}</span>
                </li>
            </template>
          </ul>
        </div>
        <!-- 已签约 -->
        <div class="btn" @click="relieve" v-if="itemObj.signState == 1">
          解除智慧加油支付
        </div>
        <!-- 签约中 -->
        <div class="btn" @click="cancelApplyEvent" v-if="itemObj.signState == 2">
          取消申请
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import { Toast } from "vant";
import { Dialog } from "vant";
import api from "./api";

export default {
  name: "labelDetail",
  mixins: [api],
  data() {
    return {
      datailObj: {},
      itemObj: {},
    };
  },
  created() {},
  mounted() {
    this.itemObj = this.$route.query.itemObj
      ? JSON.parse(this.$route.query.itemObj)
      : {};
    console.log("itemObj", this.itemObj);
  },
  filters: {
    formatIdNo(val) {
      if (val) {
        return val.substr(0, 6) + "****" + val.substr(-4);
      } else {
        return val;
      }
    },
  },
  methods: {
    async cancelApplyEvent(){
      console.log('cancelApply');
      this.$Loading.open();
      const res = await this.cancelApply({id:this.itemObj.id})
      this.$Loading.close();
      if (res.data.result == "success") {
        Toast.success("取消成功");
        this.$router.go(-1);
      } else {
        Toast(res.data.info);
        this.$router.go(-1);
      }
    },
    relieve() {
      let that = this;
      let params = {
        token: this.$store.state.login.token,
        signPayId: that.itemObj.signPayId,
        tradeNo: that.itemObj.tradeNo, //签约请求码
      };

      that.jieyueData(params).then((res) => {
        if (res.data.result == "success") {
          Toast.success("解除成功");
          that.$router.go(-1);
        } else {
          Toast(res.data.info);
        }
      });
    },
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tipDiv {
  border-top: 1px solid #e5e5e5;

  .publicInvoice {
    border: 1px solid #e9e9e9;
    border-radius: 8px;
    padding: 0 10px;
    /* box-shadow: #f3f3f3 0px 0px 15px; */
    width: 95%;
    margin: 20px auto 10px auto;
    overflow: hidden;

    .user {
      margin-left: 10px;
    }

    p {
      font-size: 18px;
      margin: 13px 0;
    }

    li {
      margin: 13px 0;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }

    div {
      margin: 13px 0;
    }

    .span {
      margin: 13px 0;
      display: block;
    }
  }

  .btn {
    width: 200px;
    height: 40px;
    border: 1px solid #e07122;
    border-radius: 23px;
    text-align: center;
    line-height: 40px;
    color: #f76a09;
    font-size: 16px;
    margin: 50px auto 0 auto;
  }
}
</style>
