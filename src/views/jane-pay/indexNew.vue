<template>
  <div class="body">
    <nav-top title="加油支付" @backEvent="$router.go(-1)">
      <div class="delete-img">帮助</div>
    </nav-top>
    <nav-content>
      <div class="tipDiv">
        <div class="tip">
          <p class="p">开通流程</p>
          <ul>
            <li>
              <span>1</span>在线签约&nbsp;&nbsp;
            </li>
            <li>
              <span>2</span>关联银行卡（开通免密..）
            </li>
            <li>
              <span>3</span>签约成功
            </li>
          </ul>
        </div>
      </div>
      <div class="enterBox">
        <div class="table-view">
          <div class="table-view-cell" @click="sign">
            <div class="table-view-cell-text">
              <img src="static/image/janePay/icon_signing.png" alt />
              <span>在线签约</span>
            </div>
          </div>
          <div class="table-view-cell" @click="manage">
            <div class="table-view-cell-text">
              <img src="static/image/janePay/icon_manage.png" alt />
              <span>签约管理</span>
            </div>
          </div>
          <div class="table-view-cell" @click="record">
            <div class="table-view-cell-text">
              <img src="static/image/janePay/icon_record.png" alt />
              <span>记录查询</span>
            </div>
          </div>
          <div class="table-view-cell"></div>
        </div>
      </div>
      <router-link to="/jane/payList" v-if="listObj.length>0">
        <div class="payDiv">
          <div>极简支付加油交易记录（最近3笔）</div>
          <div>更多 》</div>
        </div>
      </router-link>
      <div
        class="publicInvoice"
        v-for="(item,index) in listObj"
        :key="index"
        v-if="listObj.length>0 && index<3"
      >
        <div class="div1">
          <div>
            <span>{{item.ouName}}</span>
            <span>{{item.completeTime}}</span>
          </div>
          <p>支付金额</p>
          <p>￥{{item.payAmount}}</p>
        </div>
        <div class="div2">
          <div class="table-view">
            <div class="table-view-cell" @click="pingzheng(item)">
              <div class="table-view-cell-text">
                <img src="static/image/janePay/iconn1.png" alt />
                <p>查看凭证</p>
              </div>
            </div>
            <!--            <div class="table-view-cell" @click="invoice">-->
            <!--              <div class="table-view-cell-text">-->
            <!--                <img v-if='!haveInvoice' src="static/image/janePay/icon2.png" alt="">-->
            <!--                <p v-if='!haveInvoice'>开具发票</p>-->
            <!--                <p v-if='haveInvoice' style="padding: 4px 0">已开票</p>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
      <div v-show="titleView">
        <p class="nullData" v-show="listObj.length==0">暂无交易记录</p>
      </div>
    </nav-content>
  </div>
</template>

<script>
import api from "./api";
export default {
  name: "index",
  mixins: [api],
  data() {
    return {
      haveInvoice: true,
      listObj: [],
      titleView: false
    };
  },
  mounted() {
    this.singList();
  },
  methods: {
    singList() {
      let that = this;
      let params = {
        token: this.$store.state.login.token
      };
      that.orderData(params).then(res => {
        console.log(res);
        if (res.data.result == "success") {
          that.titleView = true;
          that.listObj = res.data.data.orderList || [];
        }
      });
    },
    sign() {
      let that = this;
      let params = {
        token: this.$store.state.login.token
      };
      that.judgeData(params).then(res => {
        if (res.data.result == "success") {
          let data = JSON.parse(res.data.data.payWayModel) || [];
          if (data.length > 0) {
            this.$router.push({
              path: "/jane/paySelect"
            });
          } else {
            data.forEach(item => {
              if (
                item.payWayModel == "210007" ||
                item.payWayModel == "305004" ||
                item.payWayModel == "340002"
              ) {
                this.$router.push({
                  path: "/jane/signPage"
                });
              } else if (item.payWayModel == "320004" || item.payWayModel == "305006") { //ET
                let params1 = {
                  token: this.$store.state.login.token
                };
                that.nextData(params1).then(res => {
                  if (res.data.result == "success") {
                    that.$bridgefunc.customPush({
                      path: res.data.data.info,
                      isnativetop: "1",
                      superback: 1
                    })
                  }
                });
              }
            });
          }
        }
      });
    },
    manage() {
      this.$router.push({
        path: "/jane/label_management"
      });
    },
    record() {
      this.$router.push({
        path: "/jane/record_query"
      });
    },
    pingzheng(params) {
      this.$router.push({
        path: "/jane/vouchersDetail",
        query: {
          listObj: JSON.stringify(params)
        }
      });
    },
    invoice() {
      this.$router.push({
        path: "/assistantindex"
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.delete-img {
  font-size: 16px;
  text-align: right;
  margin-right: 15px;
}

.tipDiv {
  border-top: 1px solid #e5e5e5;

  .tip {
    width: 94%;
    margin: 10px auto;
    padding: 10px 8px;
    background: #fff1ce;
    color: #df7222;
    border-radius: 6px;

    .p {
      color: #be933d;
      margin-bottom: 8px;
    }

    ul {
      display: flex;

      li {
        height: 20px;
        line-height: 20px;

        span {
          background: #fc6900;
          color: white;
          border-radius: 50%;
          display: inline-block;
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 16px;
        }
      }
    }
  }
}

.enterBox {
  width: 94%;
  margin: 10px auto;
  font-size: 14px;

  /deep/ .table-view .table-view-cell .table-view-cell-text {
    justify-content: start;

    img {
      width: 30px;
      margin-right: 16px;
    }
  }

  a {
    color: black;
  }
}

.payDiv {
  width: 94%;
  margin: 24px auto;
  display: flex;
  font-size: 14px;
  justify-content: space-between;

  div:nth-child(2) {
    font-size: 12px;
    color: #4c4847;
  }
}

.publicInvoice {
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  /* box-shadow: #f3f3f3 0px 0px 15px; */
  width: 95%;
  margin: 0 auto 10px auto;
  overflow: hidden;
  display: flex;
  justify-content: space-between;

  .div1 {
    width: 80%;
    font-size: 14px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    border-right: 1px solid #e5e5e5;
    margin: 10px 0;

    div {
      width: 92%;
      margin: auto;
      color: #898989;
      display: flex;
      justify-content: space-between;
    }

    p {
      color: #4d4948;
      text-align: center;
      margin: auto;
    }

    p:nth-child(2) {
      margin: 12px auto;
    }

    p:nth-child(3) {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .div2 {
    width: 20%;
    display: flex;

    /deep/ .table-view {
      margin: auto;
    }

    /deep/ .table-view-cell {
      padding: 6px 0;

      /deep/ .table-view-cell-text {
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        -webkit-flex-direction: column;

        img {
          width: 20px;
          margin-bottom: 5px;
          display: block;
        }
      }
    }

    a {
      color: black;
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
