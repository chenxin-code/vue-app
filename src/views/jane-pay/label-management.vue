<template>
  <div class="body">
    <nav-top title="签约管理" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <ul class="tab-nav">
        <li @click="changeTab(0)" :class="{active:tabIndex==0}">全部</li>
        <li @click="changeTab(1)" :class="{active:tabIndex==1}">已签约</li>
        <li @click="changeTab(2)" :class="{active:tabIndex==2}">签约中</li>
        <li @click="changeTab(3)" :class="{active:tabIndex==3}">已解约</li>
      </ul>
      <div class="tipDiv">
        <div
          class="publicInvoice"
          @click="labelDetail(item)"
          v-for="(item, index) in filterListObj"
          :key="index"
        >
          <div class="div1">
            <!--              <img v-if="item.signType == 2" src="static/image/janePay/chepai.png" alt="">-->
            <img src="static/image/janePay/logo.png" alt="" />
            <span v-if="item.signState == 1">已签约</span>
            <span v-if="item.signState == 2" class="span2">签约中</span>
            <span v-if="tabIndex == 3" class="span3">已解约</span>
          </div>
          <div class="div2">
            <!--tidSign标签号-->
            <!--              <ul v-if="item.signPayWay == '工银'">-->
            <!--&lt;!&ndash;                <li class="li1">SN：{{item.snCode}}</li>&ndash;&gt;-->
            <!--&lt;!&ndash;                <li class="li2">{{item.generateKey}}</li>&ndash;&gt;-->
            <!--                <li class="li2">签约号：{{item.tradeNo}}</li>-->
            <!--                <li class="li1" v-if="item.signType == 3">身份证号：{{item.idCardNo}}</li>-->
            <!--                <li class="li1" v-if="item.signType == 2">车牌号：{{item.plateNo}}</li>-->
            <!--                <li class="li3">工行</li>-->
            <!--                <li class="li3">自动扣款功能开启</li>-->
            <!--              </ul>-->
            <ul>
              <li class="li2">签约号：{{ item.tradeNo }}</li>
              <li class="li2" v-if="item.generateKey">
                {{ item.generateKey }}
              </li>
              <li class="li1" v-if="item.signType == 3">
                身份证号：{{ item.idCardNo }}
              </li>
              <li class="li1" v-if="item.signType == 2">
                车牌号：{{ item.plateNo }}
              </li>
              <li class="li3" v-if="item.signPayWay">{{ item.signPayWay }}</li>
              <!--                <li class="li3" v-if="item.userId">微信号：{{item.userId}}</li>-->
              <li class="li3" v-if="item.signState == 1 && tabIndex!=3">自动扣款功能开启</li>
              <li class="li3" v-if="tabIndex == 3">自动扣款功能关闭</li>
            </ul>
          </div>
          <div class="div3">
            <div class="arrow">
              <span>详情</span>
              <i class="icon iconfont mall-gengduojiantou"></i>
            </div>
            <div
              class="result"
              v-if="item.payModelSub == '320004'"
              @click.stop="resultData(item)"
            >
              查询签约结果
            </div>
          </div>
        </div>
        <div v-show="titleView">
          <p class="nullData" v-show="filterListObj.length == 0">暂无数据</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import api from "./api";
import {mapGetters} from "vuex";

export default {
  name: "label-management",
  mixins: [api],
  data() {
    return {
      tabIndex:0,
      listObj: [],
      cancelListObj: [],  // 已解约的数据列表
      fetchCancel:false,  // 是否已请求过已解约的数据
      titleView: false, // 避免接口没加载完，极限是空状态
    };
  },
  computed: {
    /**
     * getGlobalConfig.hideInSign：是否隐藏签约中数据项
     */
    ...mapGetters(["getGlobalConfig"]),
    filterListObj(){
      return this.tabIndex==0 ? this.listObj.filter(arr => arr.signState!=3) : // 全部
        this.tabIndex == 1 ? this.listObj.filter(arr => arr.signState==1) : // 已签约
        this.tabIndex == 2 ? this.listObj.filter(arr => arr.signState==2) : // 签约中
        this.cancelListObj; // 已解约 3
    }
  },
  mounted() {
    this.singList();
  },
  methods: {
    // 获取已解约的数据
    async fetchCancelList(){
      this.$Loading.open();
      const res = await this.jiluData({operateState:0});
      this.$Loading.close();
      if (res.data.result == "success") {
        this.cancelListObj = res.data.data || [];
        console.log(this.listObj)
        console.log(this.cancelListObj)
        this.fetchCancel = true;
      }
    },
    // 更改选项卡
    async changeTab(tabIndex){
      if(tabIndex == 3 && !this.fetchCancel) await this.fetchCancelList();
      this.tabIndex=tabIndex;
    },
    singList() {
      let that = this;
      let params = {
        token: this.$store.state.login.token,
      };
      that.signlistData(params).then((res) => {
        if (res.data.result == "success") {
          that.listObj = res.data.data || [];
          that.titleView = true;
        }
      });
    },
    labelDetail(item) {
      this.$router.push({
        path: "/jane/labelDetail",
        query: {
          itemObj: JSON.stringify(item),
        },
      });
    },
    resultData(data) {
      //建行签约前调用查询车牌是否签约
      let that = this;
      let params = {
        token: this.$store.state.login.token,
        payModelSub: data.payModelSub,
        plateNo: data.plateNo,
      };

      that.jiansheData(params).then((res) => {
        console.log(res);
        if (res.data.result == "success") {
          let data = res.data.data || {};
          if (!data.contractCode) {
            //没值就是没签约
            this.singList();
          } else {
            that.$Toast(res.data.info);
            this.singList();
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tab-nav{
  font-size 16px
  display:flex;
  padding:15px 8px;
  li{
    width 80px
    line-height:30px;
    border:1px solid #ccc;
    border-radius:15px;
    text-align:center;
    &+li{
      margin-left:10px;
    }
    &.active{
      border-color:#ff0404;
      color:#ff0404;
    }
  }
}
.tipDiv {
  border-top: 1px solid #e5e5e5;

  .publicInvoice {
    border: 1px solid #e9e9e9;
    border-radius: 8px;
    padding: 10px;
    /* box-shadow: #f3f3f3 0px 0px 15px; */
    width: 95%;
    margin: 20px auto 10px auto;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    .div1 {
      margin: auto 0;
      width: 20%;

      img {
        width: 100%;
      }

      span {
        background: #ff6700;
        width: 90%;
        color: #fff6da;
        display: block;
        border-radius: 15px;
        padding: 6px 0;
        text-align: center;
        margin: 5px auto 0 auto;
      }

      .span2 {
        color: #8a8a8a;
        background: #e5e5e5;
      }
      .span3 {
        padding: 5px 0;
        border:1px solid #333;
        color: #ff0101;
        background: #fff;
      }
    }

    .div2 {
      flex: 1;
      margin: auto 0;
      padding: 0 8px;

      ul {
        li {
          margin-bottom: 5px;
          font-size: 12px;
        }

        .li2 {
          font-size: 15px;
          font-weight: 600;
        }

        .li3 {
          color: #888888;
        }
      }
    }

    .div3 {
      display: flex;
      flex-direction: column;

      div {
        display: flex;
      }

      span {
        margin: auto;
      }

      .iconfont {
        margin: auto;
      }

      .arrow {
        margin: auto;
      }

      .result {
        background: #ff6700;
        color: #fff6da;
        display: block;
        border-radius: 15px;
        padding: 6px 4px;
        text-align: center;
        margin: auto;
      }
    }
  }
}

.nullData {
  font-size: 20px;
  margin-top: 100px;
  text-align: center;
}

/deep/ .nav-content {
  overflow-y: auto !important;
}
</style>
