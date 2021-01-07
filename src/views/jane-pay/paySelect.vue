<template>
  <div class="body">
    <nav-top title="签约支付方选择" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="div1" v-for="(item,index) in list" :key="index" @click="toSign(item)">
        <span>{{item.payWayName}}</span>
        <i class="icon iconfont mall-gengduojiantou"></i>
      </div>
    </nav-content>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { Toast } from "vant";
import api from "./api";

export default {
  name: "",
  mixins: [api],
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.zhfufangList();
  },
  methods: {
    zhfufangList() {
      let that = this;
      let params = {
        token: this.$store.state.login.token
      };
      that.judgeData(params).then(res => {
        if (res.data.result == "success") {
          let arr = JSON.parse(res.data.data.payWayModel) || [];
          arr.forEach(function(item) {
            item.payModelSub = item.payWayModel;
          });
          that.list = arr;
        }
        console.log(that.list);
      });
    },
    toSign(data) {
      // if (data.payWayName == "建行") {
      //   this.jiansheDetail();
      // } else {
      //   if (
      //     data.payWayName == "微信" ||
      //     data.payWayName == "工银" ||
      //     data.payWayName == "农行"
      //   ) {
      //     this.$router.push({
      //       path: "/jane/signPage",
      //       query: {
      //         modelObj: data
      //       }
      //     });
      //   } else if (data.payWayName == "ET") { // ET
      //     this.qianyue()
      //   }
      // }

      if (data.payWayModel == "320004") {
        this.jiansheDetail();
      } else {
        if (
          data.payWayModel == "210007" ||
          data.payWayModel == "305004" ||
          data.payWayModel == "340002"
        ) {
          this.$router.push({
            path: "/jane/signPage",
            query: {
              modelObj: data
            }
          });
        } else if (data.payWayModel == "305006") { // ET
          this.qianyue();
        }
      }
    },
    qianyue() {
      let params1 = {
        token: this.$store.state.login.token
      };
      this.nextData(params1).then(res => {
        if (res.data.result == "success") {
          this.$bridgefunc.customPush({
            path: res.data.data.info,
            isnativetop: "1",
            superback: 1
          });
        }
      });
    },
    jiansheDetail() {
      //建行签约前调用查询车牌是否签约
      let that = this;
      let params = {
        token: this.$store.state.login.token
        // payModelSub: that.waySub,
        // plateNo: that.plateNum
      };
      that.jiansheData(params).then(res => {
        console.log(res);
        if (res.data.result == "success") {
          let data = res.data.data || {};
          if (!data.contractCode) {
            //没值就是没签约
            that.qianyue();
          } else {
            that.$Toast("您已经签约过了");
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.div1 {
  display: flex;
  justify-content: space-between;
  width: 92%;
  margin: 10px auto;
  border-bottom: 1px solid #e5e5e5;
  padding: 10px;
  border-radius: 6px;
  color: #797979;
  font-size: 14px;
}
</style>
