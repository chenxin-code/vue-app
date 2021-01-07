<template>
  <div class="body">
    <nav-top title="记录查询" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <router-link
          :to="{
            path: '/jane/contractDetail',
            query: { iden: iden, detail: item },
          }"
          :key="index"
          v-for="(item, index) in list"
        >
          <div class="publicInvoice">
            <div class="tag">解约记录</div>
            <!--            <div class="tag tag1">签约记录</div>-->
            <div class="box">
              <div>
                <ul>
                  <li class="li2" v-if="item.plateNo">
                    {{ item.tradeNo }} | {{ item.plateNo }}
                  </li>
                  <li class="li2" v-if="item.idCardNo">
                    {{ item.tradeNo }} | {{ item.idCardNo }}
                  </li>
                  <li class="li1">{{ item.operateTime }}</li>
                </ul>
                <!--                <ul>-->
                <!--                  <li class="li2" v-if="item.signType == 2">{{item.tradeNo}} | {{item.plateNo}}</li>-->
                <!--                  <li class="li2" v-if="item.signType == 3">{{item.tradeNo}} | {{item.idCardNo}}</li>-->
                <!--                  <li class="li1">{{item.operateTime}}</li>-->
                <!--                </ul>-->
              </div>
              <div>
                <span>详情</span>
                <i class="icon iconfont mall-gengduojiantou"></i>
              </div>
            </div>
          </div>
        </router-link>
        <div v-show="titleView">
          <p class="nullData" v-show="list.length == 0">暂无数据</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import api from "./api";
export default {
  name: "",
  mixins: [api],
  data() {
    return {
      iden: 0, //1签约，0解约
      list: [],
      titleView: false,
    };
  },
  mounted() {
    this.jiluIndex();
  },
  methods: {
    jiluIndex() {
      let that = this;
      let params = {
        token: this.$store.state.login.token,
        operateState: 0,
      };

      that.jiluData(params).then((res) => {
        if (res.data.result == "success") {
          that.titleView = true;
          console.log('data',res.data.data);
          that.list = res.data.data || [];
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tipDiv {
  border-top: 1px solid #e5e5e5;

  a {
    color: black;

    .publicInvoice {
      border: 1px solid #e9e9e9;
      border-radius: 8px;
      /* box-shadow: #f3f3f3 0px 0px 15px; */
      width: 95%;
      margin: 20px auto 10px auto;
      overflow: hidden;

      .tag {
        width: 70px;
        height: 24px;
        background: #ffeee6;
        color: #ef7823;
        line-height: 24px;
        text-align: center;
        margin: 10px 0;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
      }

      .tag1 {
        background: #e1f5fe;
        color: #4fbbf0;
      }

      .box {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        margin: 10px 0;

        div:nth-child(1) {
          ul {
            li {
              margin-bottom: 8px;
              font-size: 12px;
            }

            .li2 {
              font-size: 16px;
            }

            .li1 {
              color: #7e8c8d;
            }
          }
        }

        div:nth-child(2) {
          display: flex;

          span {
            margin: auto;
          }

          .iconfont {
            margin: auto;
          }
        }
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
