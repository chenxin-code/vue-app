<template>
  <div class="body">
    <nav-top title="在线签约" @backEvent="$router.go(-1)"></nav-top>
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
          <!-- 标签号-->
          <div v-if="radio=='3'">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_OilCard.png" alt />
                  <span>标签号</span>
                </div>
                <div class="center">
                  <mt-field
                    label
                    placeholder="扫码或手动输入卡编号"
                    @input="changeRfrCodeType"
                    v-model="tidSign"
                  >
                    <img
                      src="static/image/fuelcard//btn_Sweep.png"
                      width="25"
                      height="25"
                      @click="sweep"
                    />
                  </mt-field>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_recommended.png" alt />
                  <span>车牌号</span>
                </div>
                <div class="center">
                  <input
                    type="text"
                    class="carint"
                    v-model="plateNum"
                    @focus="focus"
                    @touchstart.stop
                    readonly
                    placeholder="请输入车牌号"
                  />
                </div>
              </div>
            </div>
          </div>
          <!--身份证-->
          <div v-if="radio=='1' && shenfenView==true">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/ren.png" alt />
                  <span>姓名</span>
                </div>
                <div class="center">
                  <input placeholder="请输入姓名" type="text" v-model="shenfen.name" />
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_recommended.png" alt />
                  <span>身份证号</span>
                </div>
                <div class="center">
                  <input
                    type="text"
                    v-model="shenfen.idcardNum"
                    @focus="focus"
                    @touchstart.stop
                    readonly
                    placeholder="请输入身份证号"
                  />
                </div>
              </div>
            </div>
          </div>
          <!--车牌号-->
          <div v-if="radio=='2'">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/ren.png" alt />
                  <span>姓名</span>
                </div>
                <div class="center">
                  <input placeholder="请输入姓名" type="text" v-model="chepai.ownerName" />
                </div>
              </div>
            </div>
            <div class="table-view-cell" @click="cheColor">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_colour.png" alt />
                  <span>车牌颜色</span>
                </div>
                <div class="center right1">
                  <mt-field v-model="colorstyle" :disabled="disabled"></mt-field>
                </div>
                <i class="icon iconfont mall-arrow-down"></i>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_recommended.png" alt />
                  <span>车牌号</span>
                </div>
                <div class="center">
                  <input
                    type="text"
                    class="carint"
                    v-model="plateNum"
                    @focus="focus"
                    @touchstart.stop
                    readonly
                    placeholder="请输入车牌号"
                  />
                </div>
                <i @click="morePlate" class="icon iconfont mall-arrow-down" v-if="actions.length>0"></i>
                <van-action-sheet
                  id="xialaView"
                  v-model="showxiala"
                  :actions="actions"
                  @select="onSelect($event,item)"
                />
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
    <virtual-keyboard :show="show" @input="inputKey" @delete="deleteKey" @blur="show = false"></virtual-keyboard>
    <van-action-sheet v-model="show1" :actions="actions1" @select="onSelect1" />
    <van-action-sheet v-model="show2" :actions="actions2" @select="onSelect2" />
    <van-action-sheet v-model="showche" :actions="actionsche" @select="onSelectche" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VirtualKeyboard from "@/components/base/virtual-keyboard";
import Config from "@/api/config";
import payHelper from "@/utils/payHelper";
import { Dialog } from "vant";
import { Toast } from "vant";
import api from "./api";

export default {
  name: "signing",
  mixins: [api],
  data() {
    return {
      referee: "",
      referee1: "",
      plateNum: "",
      radio: "",
      rfrCodeType: "", //1 填写  2 扫码
      disabled: true,
      allRadio: true,
      colorstyle: "蓝",
      cvn2: "",
      expired: "",
      way: "",
      waySub: "",
      show: false, //高级键盘
      actions: [], //车牌号列表
      showxiala: false, //车牌号列表
      shenfenView: false, //判断身份证是否显示
      styleMoney1: "",
      styleMoney: "",
      cardStyle: "",
      cardType: "",
      custName: "",
      cardNo: "",
      show2: false, //农行的卡类型
      actions2: [
        { name: "借记卡", id: "1" },
        { name: "贷记卡", id: "3" },
        { name: "合并卡", id: "A" }
      ], //农行的卡类型
      tidSign: "",
      show1: false, //选择支付方式
      actions1: [], //选择支付方式
      showche: false,
      actionsche: [
        { name: "绿" },
        { name: "黄" },
        { name: "蓝" },
        { name: "白" },
        { name: "黑" }
      ],
      signingstyle: "",
      gonghangView: false,
      id: "",
      htmlView: "",
      umsVerifyCode: "", //验证码
      obj: {},
      phone: "",
      shenfen: {},
      chepai: {},
      list: [],
      signType: "", //签约方式
      isweChat: [], //初始化接口判断签约方
      backUUID: "",
      singWay1: "",
      singWay2: "",
      singWay3: "",
      hasToSign: false,
      modelObj: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    let text = "";
    text = this.$store.state.globalConfig.density_free_sign_type || ""; //1：标签，2：身份证，3：车牌号
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
    this.modelObj = this.$route.query.modelObj;
    this.radio = this.modelObj.radio;
    this.backUUID = this.$util.randomString();
    this.listenAndriodBack();
    this.phone = this.userInfo.phone;
    this.isauthentication();
    this.chepaiList();
    this.$bridgefunc.enterForegroundCallBack(() => {
      if (this.hasToSign) {
        this.checkSignResult();
      }
    });
  },
  methods: {
    checkSignResult: function() {
      // do check
      this.hasToSign = false;
    },
    listenAndriodBack() {
      this.$bridgefunc.registeBridge("phonebridge", res => {
        let obj = JSON.parse(res);
        if (obj.type == this.backUUID) {
          Dialog.close();
        }
      });
    },
    onSelect1(item) {
      this.show1 = false;
      this.styleMoney1 = item.name;
      this.way = item.payWayName;
      this.waySub = item.payWayModel;
      if (this.way == "农行") {
        //农行
        this.gonghangView = true;
      } else if (this.way == "工银" || this.way == "微信" || this.way == "ET") {
        //工行
        this.gonghangView = false;
      } else if (this.way == "建行") {
        //建行
      }
    },

    pays() {
      let that = this;
      if (that.radio == "2") {
        //车牌签约
        if (that.colorstyle == "绿") {
          if (that.plateNum.length != 8) {
            that.$Toast("请输入8位车牌号");
            return;
          }
        } else {
          if (that.plateNum.length != 7) {
            that.$Toast("请输入7位车牌号");
            return;
          }
        }
      } else if (that.radio == "3") {
        //标签号签约
        if (that.plateNum.length != 7) {
          that.$Toast("请输入7位车牌号");
          return;
        }
      }
      this.show1 = true;
    },
    cheColor() {
      this.showche = true;
    },
    cardpays() {
      this.show2 = true;
    },
    onSelect2(item) {
      this.show2 = false;
      this.cardStyle = item.name;
      this.cardType = item.id;
    },
    onSelectche(item) {
      this.colorstyle = item.name;
      this.showche = false;
    },
    selectRadio(params) {
      this.radio = params;
      this.isauthentication();
    },
    morePlate() {
      this.showxiala = true;
    },
    onSelect(item) {
      this.showxiala = false;
      this.plateNum = item.name;
    },
    isauthentication() {
      let that = this;
      this.gonghangView = false;
      let params = {
        token: this.$store.state.login.token
      };
      that.judgeData(params).then(res => {
        if (res.data.result == "success") {
          that.isweChat = JSON.parse(res.data.data.payWayModel) || [];
          that.isweChat.forEach(function(item) {
            item.name = item.payWayName;
          });
          that.actions1 = that.isweChat;
          that.styleMoney1 = that.actions1[0].payWayName;
          that.waySub = that.actions1[0].payWayModel;
          that.way = that.actions1[0].payWayName;
          if (that.actions1[0].payWayName == "农行") {
            this.gonghangView = true;
          }
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

    chepaiList() {
      let that = this;
      let params = {
        token: this.$store.state.login.token
      };
      that.chepaiData(params).then(res => {
        if (res.data.result == "success") {
          let array = res.data.data || [];
          array.forEach(function(item) {
            item.name = item.plateNum;
          });
          that.actions = array;
        }
      });
    },
    focus() {
      this.show = true;
      document.activeElement.blur();
    },
    inputKey(val) {
      //限制7位
      console.log(val);
      if (this.plateNum.length < 8) {
        this.plateNum = this.plateNum + val;
      }
    },
    deleteKey() {
      this.plateNum = this.plateNum.substr(0, this.plateNum.length - 1);
    },
    changeRfrCodeType() {
      this.rfrCodeType = 1;
    },
    nextIndex() {
      let that = this;
      if (that.allRadio == false) {
        that.$Toast("请勾选同意协议");
        return;
      }

      if (that.radio == "1") {
        //身份证签约
        that.signType = 3;
        that.colorstyle = "";
      } else if (that.radio == "2") {
        //车牌签约
        if (that.colorstyle == "绿") {
          if (that.plateNum.length != 8) {
            that.$Toast("请输入8位车牌号");
            return;
          }
        } else {
          if (that.plateNum.length != 7) {
            that.$Toast("请输入7位车牌号");
            return;
          }
        }
        that.signType = 2;
        that.colorstyle = that.colorstyle;
      } else if (that.radio == "3") {
        //标签号签约
        if (that.tidSign.length != 16) {
          that.$Toast("请输入16位标签");
          return;
        }
        if (that.plateNum.length != 7) {
          that.$Toast("请输入7位车牌号");
          return;
        }
        that.signType = 1;
        that.colorstyle = "";
      }
      let params = {
        token: this.$store.state.login.token,
        plateNo: that.plateNum ? that.plateNum : "", //车牌号
        generateKey: that.tidSign ? that.tidSign : "",
        payModelSub: that.waySub, //支付方式
        signType: that.signType, //1:标签签约（默认），2:车牌号签约，3身份证签约
        idCardNo: that.shenfen.idcardNum ? that.shenfen.idcardNum : "", //身份证号
        returnUrl:
          window.location.origin + "/app-vue/app/index.html#/jane/complete",
        plateColor: that.colorstyle //车牌颜色
        // cardType: that.cardType //签约卡类型
      };
      that.nextData(params).then(res => {
        console.log(res);
        if (res.data.result == "success") {
          if (that.way == "工银") {
            //工行
            console.log(encodeURIComponent(JSON.stringify(params)));
            this.$bridgefunc.customPush({
              path:
                window.location.origin +
                "/app-vue/app/index.html#/jane/janeView",
              isnativetop: "1",
              superback: 1,
              query: {
                info: encodeURIComponent(JSON.stringify(params))
              }
            });
          } else if (that.way == "微信") {
            //微信
            let resInfo = res.data.data.info;
            let mmqyInfo = {
              pre_entrustweb_id: resInfo
            };
            that.$bridgefunc.wxFreePay(JSON.stringify(mmqyInfo), res => {
              if (res == "1") {
                // that.$Toast('调用签约成功，还得轮询是否签约成功！')
                that.hasToSign = true;
              } else {
                that.$Toast("签约失败！");
              }
            });
          } else if (that.way == "建行") {
            that.$bridgefunc.customPush({
              path: res.data.data.info,
              isnativetop: "1",
              superback: 1
            });
          } else if (that.way == "ET") {
            that.$bridgefunc.customPush({
              path: res.data.data.info,
              isnativetop: "1",
              superback: 1
            });
          }
        } else {
          that.$Toast(res.data.info);
        }
      });
    },
    sweep() {
      this.$bridgefunc.scanCode(res => {
        this.rfrCodeType = 2;
        this.tidSign = res.code;
      });
    },
    allSelect() {
      let that = this;
      that.allRadio = !that.allRadio;
    }
  },
  components: {
    VirtualKeyboard
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
      width: 135px;

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
