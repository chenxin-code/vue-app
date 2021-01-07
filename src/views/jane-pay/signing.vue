<template>
  <!-- 在线签约 -->
  <div class="body">
    <nav-top title="在线签约" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <p class="box">签约信息</p>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_VIPNumber.png" alt/>
                <span>会员手机号</span>
              </div>
              <div class="center">
                <input type="text" v-model="signMessage.phone" disabled/>
              </div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/ren.png" alt/>
                <span>姓名</span>
              </div>
              <div class="center">
                <input placeholder="请输入姓名" type="text" v-model="signMessage.custName"/>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="$store.state.globalConfig.density_free_sign_type.length>1">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/renzheng.png" alt/>
                <span>签约方式</span>
              </div>
              <div class="center">
                <van-radio-group v-model="signMessage.radio" class="radioBtn" @change="selectRadio">
                  <div class="radioBtnDiv">
                    <van-radio name="2" checked-color="#ff884f" v-if="singWay3 == 3">车牌号</van-radio>
                    <van-radio name="1" checked-color="#ff884f" v-if="singWay1 == 1">标签号</van-radio>
                    <van-radio name="3" checked-color="#ff884f" v-if="singWay2 == 2">身份证号</van-radio>
                  </div>
                </van-radio-group>
              </div>
            </div>
          </div>
          <!-- 标签号-->
          <div v-if="signMessage.radio=='1'">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_OilCard.png" alt/>
                  <span>标签号</span>
                </div>
                <div class="center">
                  <mt-field label placeholder="扫码或手动输入标签号" @input="changeRfrCodeType" v-model="signMessage.generateKey">
                    <img src="static/image/fuelcard//btn_Sweep.png" width="25" height="25" @click="sweep"/>
                  </mt-field>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_recommended.png" alt/>
                  <span>车牌号</span>
                </div>
                <div class="center">
                  <input type="text" class="carint" v-model="signMessage.plateNo" @focus="focus" @touchstart.stop readonly placeholder="请输入车牌号"
                  />
                </div>
              </div>
            </div>
          </div>
          <!--身份证-->
          <div v-if="signMessage.radio=='3' && shenfenView==true">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_recommended.png" alt/>
                  <span>身份证号</span>
                </div>
                <div class="center">
                  <input type="text" v-model="shenfen.idCardNo" @focus="focus" @touchstart.stop readonly placeholder="请输入身份证号"/>
                </div>
              </div>
            </div>
          </div>
          <!--车牌颜色-->
          <div class="table-view-cell" @click="cheColor" v-if="signMessage.radio=='1' || signMessage.radio=='2'">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_colour.png" alt/>
                <span>车牌颜色</span>
              </div>
              <div class="center right1">
                <mt-field v-model="signMessage.plateColor" :disabled="disabled"></mt-field>
              </div>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <!--车牌号-->
          <div class="table-view-cell" v-if="signMessage.radio=='2'">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_recommended.png" alt/>
                <span>车牌号</span>
              </div>
              <div class="center">
                <input type="text" class="carint" v-model="signMessage.plateNo" @focus="focus" @touchstart.stop readonly placeholder="请输入车牌号"/>
              </div>
              <i @click="morePlate" class="icon iconfont mall-arrow-down" v-if="actions.length>0"></i>
              <van-action-sheet id="xialaView" v-model="showxiala" :actions="actions" @select="onSelect($event,item)"/>
            </div>
          </div>
          <div class="table-view-cell" @click="showContractPayers = true">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_Signing2.png" alt/>
                <span>签约支付方</span>
              </div>
              <div class="center right1">
                <mt-field v-model="signMessage.styleMoney1" :disabled="disabled"></mt-field>
                <mt-field v-model="signMessage.way" style="display: none" :disabled="disabled"></mt-field>
              </div>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <div v-if="signMessage.payModelSub == '340002'">
            <div class="table-view-cell" @click="cardpays('1')">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_lei.png" alt/>
                  <span>证件类型</span>
                </div>
                <div class="center right1">
                  <mt-field v-model="signMessage.custCertName" :disabled="disabled"></mt-field>
                </div>
                <i class="icon iconfont mall-arrow-down"></i>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_lei.png" alt/>
                  <span>证件号码</span>
                </div>
                <div class="center">
                  <input placeholder="请输入证件号码" type="text" v-model="signMessage.idCardNo"/>
                </div>
              </div>
            </div>
            <div class="table-view-cell" @click="cardpays('2')">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_ka.png" alt/>
                  <span>签约卡类型</span>
                </div>
                <div class="center right1">
                  <mt-field v-model="signMessage.cardStyle" :disabled="disabled"></mt-field>
                </div>
                <i class="icon iconfont mall-arrow-down"></i>
              </div>
            </div>
            <div class="table-view-cell" v-if="signMessage.cardStyle == '贷记卡'">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_ka.png" alt/>
                  <span>贷记卡CVV2</span>
                </div>
                <div class="center">
                  <input placeholder="请输入贷记卡CVV2" type="text" v-model="signMessage.cvn2"/>
                </div>
              </div>
            </div>
            <div class="table-view-cell" v-if="signMessage.cardStyle == '贷记卡'">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_ka.png" alt/>
                  <span>贷记卡到期日</span>
                </div>
                <div class="center">
                  <input placeholder="格式：0719,代表2019年7月" type="text" v-model="signMessage.expired"/>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_NO.png" alt/>
                  <span>银行卡号</span>
                </div>
                <div class="center">
                  <input type="text" v-model="signMessage.cardNo"/>
                </div>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if=" preAuthAmountView">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_OilCard.png" alt/>
                <span>预授权金额</span>
              </div>
              <div class="center">
                <mt-field label placeholder="请输入预授权金额" type="number" v-model="signMessage.preAuthAmount">
                  <van-icon name="question-o" @click="getTips"/>
                </mt-field>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="!getGlobalConfig.hideReferrer">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_OilCard.png" alt/>
                <span>推荐人</span>
              </div>
              <div class="center">
                <mt-field label placeholder="扫码或手动输入推荐人" @input="changeRfrCodeType" v-model="signMessage.referrer">
                  <img src="static/image/fuelcard//btn_Sweep.png" width="25" height="25" @click="sweepReferrer"/>
                </mt-field>
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
            <div class="div2" @click="passfreeQuery">下一步</div>
          </div>
        </div>
      </div>
    </nav-content>
    <van-overlay :show="toastView" @click="toastView = false" style="background-color: transparent !important;">
      <div class="toast" v-if="toastView">当车辆进站后，已签约用户发起预授权后冻结预授权金额，加油后再实际扣款(如所填预授权金额小于实际加油金额将禁止使用此支付方式)
      </div>
    </van-overlay>
    <virtual-keyboard v-bind:show.sync="show" @input="inputKey" @delete="deleteKey"></virtual-keyboard>
    <van-action-sheet v-model="showContractPayers" :actions="actionContractPayers" @select="onSelectContractPayers"/>
    <van-action-sheet v-model="show2" :actions="actions2" @select="onSelect2"/>
    <van-action-sheet v-model="showche" :actions="actionsche" @select="onSelectche"/>
    <van-action-sheet v-model="showCertificates" :actions="idCardList" @select="onCertificates"/>
    <van-overlay :show="showSigned">
      <div @click.stop class="wrapper">
        <div class="block">
          <div class="Signed">
            <img src="static/image/janePay/chenggong.png" alt="">
            <p>恭喜您签约成功</p>
          </div>
          <div class="sureBtn" @click="signed">确定</div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import VirtualKeyboard from "@/components/base/virtual-keyboard";
  import Config from "@/api/config";
  import payHelper from "@/utils/payHelper";
  import {Dialog} from "vant";
  import {Toast} from "vant";
  import api from "./api";
  export default {
    name: "signing",
    mixins: [api],
    data() {
      return {
        showSigned: false, //已经签约的提示弹框
        rfrCodeType: "", //1 填写  2 扫码
        passFlag: false,
        disabled: true,
        allRadio: true, //全选
        toastView: false, //预授权金额
        show: false, //高级键盘
        actions: [], //车牌号列表
        showxiala: false, //车牌号列表
        shenfenView: false, //判断身份证是否显示
        show2: false, //农行的卡类型
        actions2: [
          {name: "借记卡", id: "1"},
          {name: "贷记卡", id: "3"},
          {name: "合并卡", id: "A"}
        ], //农行的卡类型
        preAuthAmountView: false, // 是否显示预授权金额
        showContractPayers: false, // 是否显示签约支付方选择器
        actionContractPayers: [], // 签约支付方列表
        initContractPayers:false, // 初始化签约支付方
        showche: false, //车牌颜色弹框
        showCertificates: false, //农行的证件类型
        idCardList: [
          {name: "身份证", id: "I"}
        ],
        actionsche: [
          {name: "绿"},
          {name: "黄"},
          {name: "蓝"},
          {name: "白"},
          {name: "黑"}
        ],
        gonghangView: false, //工行特殊处理
        shenfen: {},
        chepai: {},
        list: [],
        isweChat: [], //初始化接口判断签约方
        backUUID: "",
        singWay1: '', //标签号签约
        singWay2: '', //身份证签约
        singWay3: '', //车牌签约
        hasToSign: false,
        signMessage: {
          phone: '', //手机号
          custName: '', //姓名
          radio: '2', //签约方式
          generateKey: '', //标签号
          plateNo: '', //车牌号
          plateColor: "蓝", //车牌颜色
          styleMoney1: "",//签约方名称
          way: '',
          payModelSub: "", //签约方编码
          custCertName: '', //证件类型
          idCardNo: '', //身份证号
          cardStyle: "", //签约卡类型名称
          cardNo: '', //银行卡号
          preAuthAmount: "", //预授权金额,   1工行 2建行 3微信 4农行
          referrer: '', //推荐人
          cvn2: '',
          cardType: '', //签约卡类型id
          expired: '', //贷记卡到期日
        }
      };
    },
    computed: {
      /**
       * getGlobalConfig.defaultPayWayModel：初始化签约支付方 默认为工行ETC
       * getGlobalConfig.hideReferrer：初始化是否开启隐藏推荐人 默认为开启
       */
      ...mapGetters(["userInfo","getGlobalConfig"])
    },
    mounted() {
      console.log('【devlopment-8960】');
      console.log(this.$store.state.globalConfig)
      // 查询用户上次输入信息
      const localSignMessage = this.getLocal('signMessage');
      if(localSignMessage){
        this.signMessage = localSignMessage;
        localStorage.removeItem('signMessage');
      }
      //
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
        this.initRadio(this.getGlobalConfig.density_free_sign_type)
      }
      this.backUUID = this.$util.randomString();
      this.listenAndriodBack();
      this.signMessage.phone = this.userInfo.phone;
      //
      this.isauthentication();
      this.chepaiList();
      this.$bridgefunc.enterForegroundCallBack(() => {
        if (this.hasToSign) {
          this.checkSignResult();
        }
      });
    },
    methods: {
      /**
       * @description 初始化签约方式
       * @author LiuYong <tel:15045009738>
       * @param type 配置项
       */
      initRadio(type){
        let name;
        switch (type.split(',')[0]) {
          // 车牌号
          case '3':
            name=2;
            break;
          // 标签号
          case '1':
            name=1;
            break;
          // 身份证号
          case '2':
            name=3;
            break;
        }
        this.selectRadio(name);
      },
      /**
       * @description 本地存储
       * @author LiuYong <tel:15045009738>
       * @param name String 名
       * @param value any 值
       */
      saveLocal(name,value){
        if(typeof value == 'object'){
          value=JSON.stringify(value);
        }
        localStorage.setItem(name,value);
      },
      /**
       * @description 获取本地存储数据
       * @author LiuYong <tel:15045009738>
       * @param name String 名
       * @param value any 值
       * @callback Any
       */
      getLocal(name){
        const value=localStorage.getItem(name);
        if(this.isJSON(value)){
          return JSON.parse(value);
        }else{
          return value;
        }
      },
      /**
       * @description 判断是否为JSON字符串
       * @author LiuYong <tel:15045009738>
       * @param str String
       * @callback Boolean
       */
      isJSON(str) {
        if (typeof str == 'string') {
          try {
            JSON.parse(str);
            return true;
          } catch(e) {
            return false;
          }
        }
        return false;
      },
      //
      checkSignResult: function () {
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
      getTips() {
        let that = this;
        that.toastView = true;
        setTimeout(function () {
          that.toastView = false;
        }, 10000);
      },
      signed() {
        this.showSigned = false
        this.$router.go(-1)
      },
      /**
       * 选择签约支付方
       * @annotation LiuYong <tel 15045009738>
       * @DataTime 2020/10/12 14:34
       * @param {*} item 选择的签约支付方数据
       */
      onSelectContractPayers(item) {
        this.showContractPayers = false;
        this.signMessage.styleMoney1 = item.name;
        this.signMessage.way = item.payWayName;
        this.signMessage.payModelSub = item.payWayModel;
        if (this.signMessage.payModelSub == "340002") { //340002,农行
          //   1工行 2建行 3微信 4农行 5ETC
          this.gonghangView = true;
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 4) {
            this.preAuthAmountView = true;
          } else {
            this.preAuthAmountView = false;
          }
        } else if (this.signMessage.payModelSub == "310001") { // 310001,平安银行
          this.gonghangView = true;
        } else if (this.signMessage.payModelSub == "305004") { //305004,工银
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 1) {
            this.preAuthAmountView = true;
          } else {
            this.preAuthAmountView = false;
          }
        } else if (this.signMessage.payModelSub == "210007") { // 210007,微信
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 3) {
            this.preAuthAmountView = true;
          } else {
            this.preAuthAmountView = false;
          }
        } else if (this.signMessage.payModelSub == "305006") { //305006,工行ETC
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 5) {
            this.preAuthAmountView = true;
          } else {
            this.preAuthAmountView = false;
          }
        } else if (this.signMessage.payModelSub == "320004") { //320004,建行
          //建行
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 2) {
            this.preAuthAmountView = true;
          } else {
            this.preAuthAmountView = false;
          }
        }
      },
      // 签约方式跟据name获取type值
      getType(name){
        switch (type.split(',')[0]) {
          // 车牌号
          case '2':
            name='3';
            break;
          // 标签号
          case '1':
            name='1';
            break;
          // 身份证号
          case '3':
            name='2';
            break;
        }
      },
      //
      passfreeQuery() {
        // if(this.passFlag) return;
        // this.passFlag = true;
        //(建行和工行etc)签约前调用查询车牌是否签约
        let that = this;
        console.log(that.signMessage.payModelSub);
        /**
         * 工行ETC：305006
         * 建行：320004
         */
        if (this.signMessage.payModelSub == "305006" || this.signMessage.payModelSub == "320004" || this.signMessage.payModelSub == "340002") {
          let params = {
            token: this.$store.state.login.token,
            payModelSub: that.signMessage.payModelSub,
            plateNo: that.signMessage.plateNo,
            // custName:this.signMessage.custName,
            // signPayWay:this.getType(this.signMessage.radio),
          };
          this.$Loading.open()
          that.jiansheData(params).then(res => {
            this.$Loading.close();
            if (res.data.result == "success") {
              let data = res.data.data || {};
              if (!data.contractCode) {
                //没值就是没签约
                this.nextIndex()
              } else {
                this.showSigned = true
                return;
              }
            } else {
              Toast(res.data.info);
            }
          });
        } else {
          this.nextIndex()
        }
      },
      cheColor() {
        this.showche = true;
      },
      cardpays(data) {
        if (data == 1) {
          this.showCertificates = true
        } else if (data == 2) {
          this.show2 = true;
        }
      },
      onSelect2(item) {
        this.show2 = false;
        this.signMessage.cardStyle = item.name;
        this.signMessage.cardType = item.id;
      },
      onSelectche(item) {
        this.signMessage.plateColor = item.name;
        this.showche = false;
      },
      selectRadio(params) {
        console.log('selectRadio',params);
        this.signMessage.radio = params;
        this.isauthentication();
      },
      morePlate() {
        this.showxiala = true;
      },
      onCertificates(item) {
        this.showCertificates = false
        this.signMessage.custCertName = item.name
        this.signMessage.custCertType = item.id;
      },
      onSelect(item) {
        this.showxiala = false;
        this.signMessage.plateNo = item.name;
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
            that.isweChat.forEach(function (item) {
              item.name = item.payWayName;
            });
            that.actionContractPayers = that.isweChat;
            that.actionContractPayers.forEach((value, index) => {
              // 工行ETC排序至第一位
              if (value.payWayModel == '305006') {
                that.actionContractPayers.splice(index, 1)
                that.actionContractPayers.unshift(value)
              }
              // 默认签约支付方
              if(!that.initContractPayers && value.payWayModel == that.getGlobalConfig.defaultPayWayModel){
                that.initContractPayers = true;
                 that.onSelectContractPayers(value)
              }
            })
            if (that.actionContractPayers[0].payWayModel == "340002") { //农行
              this.gonghangView = true;
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 4) {
                this.preAuthAmountView = true;
              }
            } else if (that.actionContractPayers[0].payWayModel == "310001") {
              //平安银行
              this.gonghangView = true;
            } else if (that.actionContractPayers[0].payWayModel == "305004") {
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 1) {
                this.preAuthAmountView = true;
              }
            } else if (that.actionContractPayers[0].payWayModel == "210007") {
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 3) {
                this.preAuthAmountView = true;
              }
            } else if (that.actionContractPayers[0].payWayModel == "305006") { //305006,工行ETC
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 5) {
                this.preAuthAmountView = true;
              }
            } else if (that.actionContractPayers[0].payWayModel == "320004") {
              //建行
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 2) {
                this.preAuthAmountView = true;
              }
            }
            if (that.signMessage.radio == "3") {
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
            } else if (that.signMessage.radio == "2") {
              if (res.data.data.isVehicle == 1) {
                //车牌(行驶证或车辆)
                that.signMessage.plateNo = res.data.data.vehicleModel.plateNum || "";
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
            array.forEach(function (item) {
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
        //限制8位
        if (this.signMessage.plateNo.length < 8) {
          this.signMessage.plateNo = this.signMessage.plateNo + val;
        }
      },
      deleteKey() {
        this.signMessage.plateNo = this.signMessage.plateNo.substr(0, this.signMessage.plateNo.length - 1);
      },
      changeRfrCodeType() {
        this.rfrCodeType = 1;
      },
      nextIndex() {
        let that = this;
        // this.passFlag = true;
        if (that.allRadio == false) {
          that.$Toast("请勾选同意协议");

          return;
        }
        if (that.signMessage.radio == "1" || that.signMessage.radio == "2") {
          //标签签约1、车牌签约2
          if (that.signMessage.plateColor == "绿") {
            if (that.signMessage.plateNo.length != 8) {
              that.$Toast("请输入8位车牌号");
              return;
            }
          } else if (that.signMessage.plateColor == "蓝") {
            if (that.signMessage.plateNo.length != 7 && that.signMessage.plateNo.length != 8) {
              that.$Toast("请输入7位或8位车牌号");
              return;
            }
          } else {
            if (that.signMessage.plateNo.length != 7) {
              that.$Toast("请输入7位车牌号");
              return;
            }
          }
        } else if (that.signMessage.radio == "1") {
          //标签号签约
          if (that.signMessage.generateKey.length != 16) {
            that.$Toast("请输入16位标签");
            return;
          }
        }
        if ( this.preAuthAmountView == true) {
          if (!that.signMessage.preAuthAmount) {
            that.$Toast("请输入预授权金额");
            return;
          }
        }
        let params = {
          token: this.$store.state.login.token,
          plateNo: that.signMessage.plateNo, //车牌号
          generateKey: that.signMessage.generateKey,
          payModelSub: that.signMessage.payModelSub, //支付方式
          signType: that.signMessage.radio, //1:标签签约（默认），2:车牌号签约，3身份证签约
          idCardNo: that.shenfen.idCardNo, //身份证号
          returnUrl: window.location.origin + "/app-vue/app/index.html#/jane/complete",
          phone: that.userInfo.phone,
          custName: that.signMessage.custName,
          plateColor: that.signMessage.plateColor, //车牌颜色
          cardType: that.signMessage.cardType, //签约卡类型
          preAuthAmount: that.signMessage.preAuthAmount, //预授权金额
          referrer: that.signMessage.referrer //推荐人
        };
        if (that.signMessage.payModelSub == "340002") { //农行
          let regCardNo = /^[1-9]\d{9,29}$/
          let regIdcardNum = /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/
          if (!regIdcardNum.test(that.signMessage.idCardNo)) {
            that.$Toast("请输入正确的证件号码");
            return
          }
          if (!regCardNo.test(that.signMessage.cardNo)) {
            that.$Toast("请输入正确的银行卡号");
            return
          }
          params.custCertName = that.signMessage.custCertName;
          params.idCardNo = that.signMessage.idCardNo;
          params.cvn2 = that.signMessage.cvn2;
          params.expired = that.signMessage.cvn2;
          params.cardNo = that.signMessage.cardNo
          params.cardType = that.signMessage.cardType
          params.custCertType = that.signMessage.custCertType;
        }
        // 存储本地信息
        this.saveLocal('signMessage',this.signMessage);
        if (that.signMessage.payModelSub == '310001') {
          params.title = '平安银行签约信息'
          params.types = 1
          that.$router.push({
            path: "/jane/agriculturalBank",
            query: {
              bankMessage: params
            }
          });
        } else if (that.signMessage.payModelSub == '210009') {  // 查询是否开通
          let getWechat = new Promise((resolve, reject) => {
            this.$request.post('/app/json/user/getWechatUserInfo').then(res => {
              if (res.status == 0) {
                resolve(res.data)
              } else {
                if (res.errorCode == 1037) {//去绑定或者快速注册
                  this.$Toast('请先进行微信绑定')
                  this.$router.push('/usercenter/bindwechat')
                } else {
                  this.$Toast(data.info);
                  reject()
                }
              }
            })
          })
          getWechat.then(res => {
            let params = {
              payModelSub: that.signMessage.payModelSub,
              plateNo: that.signMessage.plateNo,
              openid: res.thirdUserId || ''
            }
            this.$request.post('/app/json/user/queryWxOpenstate', params).then(res => {
              if (res.status == 0) {
                if (res.data.contractCode) {
                  that.$Toast('已签约成功')
                  this.$router.go(-1)
                } else {
                  this.openWxService(params.openid)
                }
              } else {
                this.$Toast(res.info)
              }
            })
          })
        } else {
          this.$Loading.open()
          that.nextData(params).then(res => {
            this.$Loading.close();
            if (res.data.result == "success") {
              if (that.signMessage.payModelSub == "305004") { //工银、工行
                this.$bridgefunc.customPush({
                  path: window.location.origin + "/app-vue/app/index.html#/jane/janeView",
                  isnativetop: "1",
                  superback: 1,
                  query: {
                    info: encodeURIComponent(JSON.stringify(params))
                  }
                });
              } else if (that.signMessage.payModelSub == "210007") {
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
              }
                // else if (that.signMessage.payModelSub == "320004") { //建行
                // let data = res.data.data.info;
                // var u = navigator.userAgent
                // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
                // if (isAndroid) {
                //   var license = this.getParam(data, "license");
                //   var goInfo = data.replace(license, encodeURIComponent(license));
                //   that.$bridgefunc.customPush({
                //     path: goInfo,
                //     isnativetop: "1",
                //     superback: 1
                //   });
                // } else {
                //   that.$bridgefunc.customPush({
                //     path: data,
                //     isnativetop: "1",
                //     superback: 1
                //   });
                // }
              // }
              else if (that.signMessage.payModelSub == "320004" || that.signMessage.payModelSub == "305006" || that.signMessage.payModelSub == "340002") { // 305006,工行ETC
                that.$bridgefunc.customPush({
                  path: res.data.data.info,
                  isnativetop: "1",
                  superback: 1
                }, false);
              }
            } else {
              that.$Toast(res.data.info);
            }
          });
        }
      },
      // 开通
      openWxService(openid) {
        let params = {
          payModelSub: this.signMessage.payModelSub,
          plateNo: this.signMessage.plateNo,
          openid: openid
        }
        this.$Loading.open()
        this.$request.post('/app/json/user/openWxService', params).then(res => {
          if (res.status == 0) {
            this.$Loading.close();
            let resInfo = res.data.info;
            // Jwx.wxSign(resInfo)
            let pathUrl = `/pages/route/index?extraData=${this.renderInfoTxt(resInfo)}`
            let path = encodeURIComponent(pathUrl)
            this.$bridgefunc.navigateToMiniProgram('gh_518c42c65952', path)

            // let mmqyInfo = {
            //   pre_entrustweb_id: resInfo
            // };
            // this.$bridgefunc.wxFreePay(JSON.stringify(mmqyInfo), res => {
            //   if (res == "1") {
            //     // that.$Toast('调用签约成功，还得轮询是否签约成功！')
            //     this.hasToSign = true;
            //   } else {
            //     this.$Toast("签约失败！");
            //   }
            // });
          } else {
            this.$Toast(res.info)
          }
        })
      },
      renderInfoTxt(val = '') {
        if (val) {
          let txtArr = val.split('&')
          let obj = {}
          txtArr.forEach(item => {
            obj[item.split('=')[0]] = item.split('=')[1]
          })
          return JSON.stringify(obj)
        } else {
          return ''
        }
      },
      getParam(str, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = str.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
      },
      sweep() {
        this.$bridgefunc.scanCode(res => {
          this.rfrCodeType = 2;
          this.signMessage.generateKey = res.code;
        });
      },
      sweepReferrer() { //获取推荐人
        this.$bridgefunc.scanCode(res => {
          this.rfrCodeType = 2;
          this.signMessage.referrer = res.code
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
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 80%;
    border-radius: 6px;
    background-color: #fff;

    .Signed {
      text-align: center;
      font-size: 15px;
      padding 10px 0 20px 0

      img {
        width 50px
        margin 10px 0
      }
    }

    .sureBtn {
      color #ff6801
      border-top 1px solid #ff6801
      text-align center
      font-size 17px
      padding 12px 0
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

  .toast {
    width: 70%;
    background: #000;
    color: white;
    top: 50%;
    position: absolute;
    left: 15%;
    font-size: 14px;
    line-height: 22px;
    text-indent: 0.5rem;
    padding: 6px 10px;
    opacity: 0.7;
  }

  /deep/ .mint-field-other {
    margin-left: 15px;
  }
</style>
