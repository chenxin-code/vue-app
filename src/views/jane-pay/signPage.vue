<template>
  <div class="body">
    <nav-top title="签约支付方选择" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <p class="box">签约信息</p>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_VIPNumber.png" alt />
                <span>会员手机号</span>
              </div>
              <div class="center">
                <input type="text" v-model="phone" disabled />
              </div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_Signing2.png" alt />
                <span>签约支付方</span>
              </div>
              <div class="center right1">
                <mt-field v-model="modelObj.payWayName" :disabled="disabled"></mt-field>
              </div>
            </div>
          </div>
          <div
            class="table-view-cell"
            v-if="$store.state.globalConfig.density_free_sign_type.length>1"
          >
            <div class="table-view-cell-text">
              <div class="left left1">
                <img class="img1" src="static/image/janePay/renzheng.png" alt />
                <span>签约方式</span>
              </div>
              <div class="center">
                <van-radio-group v-model="radio" class="radioBtn" @change="selectRadio">
                  <div class="radioBtnDiv">
                    <van-radio name="3" checked-color="#ff884f" v-if="singWay1 == 1">标签号</van-radio>
                    <van-radio name="1" checked-color="#ff884f" v-if="singWay2 == 2">身份证号</van-radio>
                    <van-radio name="2" checked-color="#ff884f" v-if="singWay3 == 3">车牌号</van-radio>
                  </div>
                </van-radio-group>
              </div>
            </div>
          </div>
          <div class="btns">
            <div class="div1">
              <van-checkbox checked-color="#ff884f" @click="allSelect" v-model="allRadio">
                我已阅读并同意
                <router-link to="/jane/agreement">《加油支付协议》</router-link>
              </van-checkbox>
            </div>
            <div class="div2" @click="nextIndex">下一步</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { Toast } from "vant";
import api from "./api";
import { mapGetters } from "vuex";

export default {
  name: "",
  mixins: [api],
  data() {
    return {
      list: [],
      phone: "",
      singWay1: "",
      singWay2: "",
      singWay3: "",
      radio: "",
      modelObj: {},
      disabled: true,
      allRadio: true
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    let text = "";
    text = this.$store.state.globalConfig.density_free_sign_type || ""; //1：标签，2：身份证，3：车牌号
    console.log(text);
    console.log(text.length);
    if (text == "") {
      this.singWay1 = 1;
      this.singWay2 = 2;
      this.singWay3 = 3;
    } else {
      if (text.indexOf("1") >= 0) {
        this.singWay1 = 1;
      }
      if (text.indexOf("2") >= 0) {
        this.singWay2 = 2;
      }
      if (text.indexOf("3") >= 0) {
        this.singWay3 = 3;
      }
    }
    this.phone = this.userInfo.phone;
    this.modelObj = this.$route.query.modelObj;
    this.isauthentication();
  },
  methods: {
    selectRadio(params) {
      this.radio = params;
      this.isauthentication();
    },
    isauthentication() {
      let that = this;
      let params = {
        token: this.$store.state.login.token
      };
      that.judgeData(params).then(res => {
        if (res.data.result == "success") {
          if (that.radio == "1") {
            if (res.data.data.isCertificate == 1) {
              //身份证
              that.shenfen = res.data.data.usercertificate || {};
              that.shenfenView = true;
            } else {
              that.shenfenView = false;
              this.$bridgefunc.andriodaddback(this.backUUID, () => {
                Dialog.alert({
                  title: "提示",
                  message: "请先完成实名认证"
                }).then(() => {
                  this.$bridgefunc.delandriodback(this.backUUID, () => {
                    this.authentication();
                  });
                });
              });
            }
          } else if (that.radio == "2") {
            if (res.data.data.isVehicle == 1) {
              //车牌(行驶证或车辆)
              that.plateNum = res.data.data.vehicleModel.plateNum || "";
              that.chepai = res.data.data.vehicleModel || {};
            }
          }
        } else {
          Toast(res.data.info);
        }
      });
    },
    authentication() {
      this.$router.push({
        path: "/real-name-authentication"
      });
    },
    nextIndex() {
      if (this.allRadio == false) {
        that.$Toast("请勾选同意协议");
        return;
      }
      if (!this.radio) {
        this.$Toast("请选择签约方式");
        return;
      }
      this.modelObj.radio = this.radio;
      this.$router.push({
        path: "/jane/signing",
        query: {
          modelObj: this.modelObj
        }
      });
    },
    allSelect() {
      let that = this;
      that.allRadio = !that.allRadio;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.body {
  font-size: 16px;

  .tipDiv {
    border-top: 1px solid #e5e5e5;

    .box {
      width: 94%;
      margin: 10px auto;
      padding: 10px 8px;
    }

    .carint {
      width: 140px;
    }

    /deep/ .table-view .table-view-cell .table-view-cell-text .left {
      width: 125px;

      .img1 {
        width: 30px;
        vertical-align: middle;
      }

      /deep/ .mint-field-core {
        font-size: 14px;
        color: #cdcbcc;
      }
    }

    /deep/ .table-view .table-view-cell .table-view-cell-text .left1 {
      width: 100px;
    }
  }

  /deep/ .mint-field-core {
    background: white;
  }

  .btns {
    margin-top: 50px;
    margin-bottom: 40px;

    /deep/ .van-radio {
      justify-content: center;
    }

    .div1 {
      font-size: 14px;
      margin-bottom: 20px;

      a {
        color: #ff884f;
      }
    }

    .div2 {
      width: 200px;
      height: 40px;
      border: 1px solid #e07122;
      border-radius: 23px;
      text-align: center;
      line-height: 40px;
      color: #f76a09;
      font-size: 16px;
      margin: 0 auto;
    }

    .nextdiv {
      background: #f4f3f3;
      border: 0;
      color: white;
    }
  }
}

/deep/ .van-checkbox {
  justify-content: center;
}

/deep/ .mint-cell-wrapper {
  padding: 0;
}

/deep/ .iconfont {
  margin-right: 20px !important;
}

/deep/ .mint-field-other {
  /* right 4px; */
}

input:disabled {
  background-color: white;
}

.radioBtn {
  .radioBtnDiv {
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }
}

#xialaView {
  top: auto;
  width: 100%;
}

/deep/ .nav-content {
  overflow-y: auto !important;
}

/deep/ .van-radio__label {
  font-size: 12px;
  margin-left: 3px;
}
</style>
