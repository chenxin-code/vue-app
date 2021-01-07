<template>
  <div class="body">
    <nav-top title="签约完成" @backEvent="$router.go(-1)">
      <i class="icon iconfont mall-guanbi" @click="closeView"></i>
    </nav-top>
    <nav-content>
      <div class="tipDiv">
        <div class="success">
          <img src="static/image/janePay/chenggong.png" alt />
          <p>恭喜您！{{detailObj.signPayWay}}签约申请完成</p>
        </div>
        <div class="publicInvoice">
          <ul>
            <li>
              <span>S/N码</span>
              <span>{{detailObj.snCode}}</span>
            </li>
<!--            <li>-->
<!--              <span>16位Key</span>-->
<!--              <span>{{detailObj.generateKey}}</span>-->
<!--            </li>-->
            <li>
              <span>车牌号</span>
              <span>{{detailObj.plateNo}}</span>
            </li>
            <li>
              <span>签约支付方式</span>
              <span>{{detailObj.signPayWay}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="theme_bg_red add" @click="closeView">
        <span>返回</span>
      </div>
    </nav-content>
  </div>
</template>

<script>
import api from "./api";
import payHelper from "@/utils/payHelper";
export default {
  name: "complete",
  mixins: [api],
  data() {
    return {
      detailObj: {
        signPayWay: '',
        snCode: '',
        plateNo: ''
      },
      id: ""
    };
  },
  created() {
    if (this.$util.isWeiXin()) {
    document.title = '签约'
  } else {
    document.title = '签约'
  }
  },
  mounted() {
    if (this.$route.query.type == "nextType") {
      this.id = this.$route.query.id;
    } else {
       let data = this.$route.query
      if (data.id == null) {
        this.id = JSON.parse(data.result).backup
      } else {
        this.id = data.id
      }
       console.log(this.id)
    }
    this.detail();
  },
  methods: {
    detail() {
      let that = this;
      let params = {
        token: this.$store.state.login.token,
        id: that.id ? that.id : ""
      };
      that.successData(params).then(res => {
        console.log(res);
        if (res.data.result == "success") {
          that.detailObj = res.data.data || {};
          if (that.detailObj.payModelSub == "320004") { //建行
            that.jiansheDetail();
            } else if (that.detailObj.payModelSub == "305006") { //工行ETC
          // } else if (that.detailObj.payModelSub == "ETC" || that.detailObj.payModelSub == "ET") { //工行etc,接口可能返回ET或者ETC
            let params1 = {
              token: that.$store.state.login.token,
              result: JSON.parse(that.$route.query.result),
              id: that.id ? that.id : ""
            };
            that.gongcompleteData(params1).then(res1 => {
              if (res1.data.result == "success") {
              }
            });
          }
        }
      });
    },
    jiansheDetail() {
      //建行签约前调用查询车牌是否签约
      let that = this;
      let params = {
        token: this.$store.state.login.token,
        id: that.id ? that.id : "",
        payModelSub: that.detailObj.payModelSub,
        plateNo: that.detailObj.plateNo
      };
      that.jiansheData(params).then(res => {
        console.log(res);
        if (res.data.result == "success") {
        }
      });
    },
    closeView() {
      this.$router.back("/jane/index")
    },
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tipDiv {
  border-top: 1px solid #e5e5e5;

  .success {
    padding: 30px 0;

    img {
      width: 80px;
      margin: 15px auto;
      display: block;
    }

    p {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .publicInvoice {
    border: 1px solid #e9e9e9;
    border-radius: 8px;
    padding: 0 10px;
    /* box-shadow: #f3f3f3 0px 0px 15px; */
    width: 95%;
    margin: 20px auto 10px auto;
    overflow: hidden;

    li {
      margin: 13px 0;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
  }
}

.mall-guanbi {
  float: right;
  margin-right: 10px;
  font-size: 20px;
}

.add {
  width: 80%;
  margin: 20px auto;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  color: white;
  text-align: center;
  font-size: 16px;
  background: #ff6800;

  a {
    color: white;
    width: 100%;
    display: inline-block;
  }
}
</style>
