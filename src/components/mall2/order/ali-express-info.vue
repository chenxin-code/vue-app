<template>
  <div class="expressinfo">
    <nav-top @backEvent="turnback"></nav-top>
    <nav-content v-if="false">
      <div class="scroll-order">
        <div>
          <van-steps direction="vertical" :active="0" active-color="red">
            <van-step v-for="(details, index) in expressDetails" :key="index">
              <!--<h3 :class="{black:index==indexPrev}">{{changeColour(details.context)}}</h3>-->
              <h3
                :class="{ black: index == indexPrev }"
                :inputVal="changeColour(details.context)"
              >
                <div>
                  <span>
                    {{
                      details.context.substr(
                        0,
                        details.context.indexOf(inputVal)
                      )
                    }}
                  </span>
                  <a style="color: #2a70fe" :href="'tel:' + inputVal">
                    {{ inputVal }}
                  </a>
                  <span>
                    {{
                      details.context.substr(
                        details.context.indexOf(inputVal) + inputVal.length
                      )
                    }}
                  </span>
                </div>
              </h3>
              <p :class="{ black: index == indexPrev }">
                {{ $util.getPayTimemin(details.time) }}
              </p>
              <!--<p :class="{black:index==indexPrev}">{{details.operator}}</p>-->
            </van-step>
          </van-steps>
        </div>
        <div class="no-data" v-if="expressDetails.length == 0">
          暂未查询到物流信息
        </div>
      </div>
    </nav-content>




    <nav-content class="expressinfoStep">
      <van-steps direction="vertical" :active="0">
        <van-step v-for="(item, index) in expressinfoList" :key="index">
          <h3>{{ item.infoSummary }}</h3>
          <p>{{ item.recordTime }}</p>
        </van-step>
      </van-steps>
      <div class="no-data" v-if="expressinfoList.length == 0">
        暂未查询到物流信息
      </div>
    </nav-content>
  </div>
</template>

<script>
import { Step, Steps } from "vant";
let inputVal = "";
export default {
  name: "expressinfo",
  components: {
    Step,
    Steps,
  },
  data() {
    return {
      orderType: "",
      orderId: "",
      expressDetails: [],
      indexPrev: "0",
      // inputVal: ''
      logisticsOrderNo:"",

      expressinfoList: [],
    };
  },
  methods: {
    changeColour(data) {
      let suzhi = data.replace(/[^0-9]/gi, "");
      let tel = /^1[3456789]\d{9}$/;
      if (tel.test(suzhi)) {
        console.log(suzhi);
        this.inputVal = suzhi;
      }
      if (!tel.test(suzhi)) {
        this.inputVal = "";
      }
      return data;
    },
    turnback: function () {
      //返回
      this.$router.go(-1);
    },
    // getExpressInfo: function () {
    //   this.$Loading.open();
    //   let url = "/app/json/app_shopping_order/queryAliDeliver";
    //   let paramsData = {
    //     orderType: this.orderType,
    //     orderId: this.orderId,
    //   };
    //   this.$http.post(url, paramsData).then(
    //     (res) => {
    //       this.$Loading.close();
    //       let data = res.data;
    //       if (data.status == 0) {
    //         console.log(data);
    //         this.expressDetails = data.data.showapi_res_body.data;
    //         console.log(this.expressDetails);
    //       } else {
    //         this.$Toast(data.info);
    //       }
    //     },
    //     (error) => {
    //       this.$Loading.close();
    //       this.$Toast("请求数据失败！");
    //     }
    //   );
    // },
    getExpressInfoList: function () {
      this.$Loading.open();
      let url = "/app/json/logistics_system/queryLogisticsInfo";
      let paramsData = {
        orderType: this.orderType,
        orderNo: this.orderId,
        logisticsOrderNo:this.logisticsOrderNo,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          if (res.data.status == 0) {
            this.expressinfoList = res.data.data.logisticsDetailList;
            console.log('-----------------------------------------',this.expressinfoList)
          } else {
            this.$Toast(res.data.data.info);
          }
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
  },
  created() {
    this.orderType = this.$route.query.orderType;
    this.orderId = this.$route.query.orderId;
    this.logisticsOrderNo = this.$route.query.logisticsOrderNo;
    this.getExpressInfoList();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.expressinfo {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .expressinfoStep {
    overflow-y: auto;
  }

  .scroll-order {
    position: absolute;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .order-information {
      padding: 15px 0 10px 20px;
      background-color: #ffffff;
      font-size: 14px;
      overflow: hidden;

      .freight-billNo {
        padding-bottom: 8px;
        overflow: hidden;
      }
    }

    .logistics-details {
      background-color: #f7f6f6;
      height: 70px;
      overflow: hidden;
    }
  }

  .black {
    color: black;
  }
}
</style>
