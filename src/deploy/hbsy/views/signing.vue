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
                <img class="img1" src="static/image/janePay/icon_VIPNumber.png" alt="">
                <span>会员手机号</span>
              </div>
              <div class="center"><input type="text" v-model="phone" disabled></div>
            </div>
          </div>
          <div class="table-view-cell" v-if="$store.state.globalConfig.density_free_sign_type.length>1">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/renzheng.png" alt="">
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
                  <img class="img1" src="static/image/janePay/icon_OilCard.png" alt="">
                  <span>标签号</span>
                </div>
                <div class="center">
                  <mt-field label="" placeholder="扫码或手动输入卡编号" @input="changeRfrCodeType" v-model="tidSign">
                    <img src="static/image/fuelcard//btn_Sweep.png" width="25" height="25" @click="sweep">
                  </mt-field>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_recommended.png" alt="">
                  <span>车牌号</span>
                </div>
                <div class="center">
                  <input type="text" class="carint" v-model="plateNum" @focus="focus" @touchstart.stop readonly
                         placeholder="请输入车牌号">
                </div>
              </div>
            </div>
          </div>
          <!--身份证-->
          <div v-if="radio=='1' && shenfenView==true">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/ren.png" alt="">
                  <span>姓名</span>
                </div>
                <div class="center"><input placeholder="请输入姓名" type="text" v-model="shenfen.name">
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">
                  <img class="img1" src="static/image/janePay/icon_recommended.png" alt="">
                  <span>身份证号</span>
                </div>
                <div class="center">
                  <input type="text" v-model="shenfen.idcardNum" @focus="focus" @touchstart.stop readonly
                         placeholder="请输入身份证号">
                </div>
              </div>
            </div>
          </div>
          <!--车牌号-->
          <div class="table-view-cell" v-if="radio=='2'">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/ren.png" alt="">
                <span>姓名</span>
              </div>
              <div class="center"><input placeholder="请输入姓名" type="text"
                                         v-model="chepai.ownerName"></div>
            </div>
          </div>
          <div class="table-view-cell" @click="cheColor" v-if="radio=='2'">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_colour.png" alt="">
                <span>车牌颜色</span>
              </div>
              <div class="center right1">
                <mt-field v-model="colorstyle" :disabled="disabled">
                </mt-field>
              </div>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <div class="table-view-cell" v-if="radio=='2'">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_recommended.png" alt="">
                <span>车牌号</span>
              </div>
              <div class="center">
                <input type="text" class="carint" v-model="plateNum" @focus="focus" @touchstart.stop readonly
                       placeholder="请输入车牌号">
              </div>
              <i @click="morePlate" class="icon iconfont mall-arrow-down" v-if="actions.length>0"></i>
              <van-action-sheet id="xialaView" v-model="showxiala" :actions="actions"
                                @select="onSelect($event,item)"/>

            </div>
          </div>
          <div class="table-view-cell" @click="pays">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_Signing2.png" alt="">
                <span>签约支付方</span>
              </div>
              <div class="center right1">
                <mt-field v-model="styleMoney1" :disabled="disabled">
                </mt-field>
                <mt-field v-model="way" style="display: none" :disabled="disabled">
                </mt-field>
              </div>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <div class="table-view-cell" v-if="$store.state.globalConfig.preAuthAmountViewPermission && preAuthAmountView">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_OilCard.png" alt="">
                <span>预授权金额</span>
              </div>
              <div class="center">
                <mt-field label="" placeholder="请输入预授权金额" v-model="preAuthAmount">
                  <van-icon name="question-o" @click="getTips"/>
                </mt-field>
              </div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_OilCard.png" alt/>
                <span>推荐人</span>
              </div>
              <div class="center">
                <mt-field
                  label
                  placeholder="扫码或手动输入推荐人"
                  @input="changeRfrCodeType"
                  v-model="referrer"
                >
                  <img
                    src="static/image/fuelcard//btn_Sweep.png"
                    width="25"
                    height="25"
                    @click="sweepReferrer"
                  />
                </mt-field>
              </div>
            </div>
          </div>
          <div class="btns">
            <div class="div1">
              <van-checkbox checked-color="#ff884f" @click="allSelect" v-model="allRadio">我已阅读并同意
                <router-link to="/jane/agreement">《加油支付协议》</router-link>
              </van-checkbox>
            </div>
            <div class="div2" @click="passfreeQuery">下一步</div>
          </div>
        </div>
      </div>
    </nav-content>
    <virtual-keyboard :show="show" @input="inputKey" @delete="deleteKey" @blur="show = false"></virtual-keyboard>
    <van-overlay :show="toastView" @click="toastView = false">
      <div class="toast" v-if="toastView">当车辆进站后，已签约用户发起预授权后冻结预授权金额，加油后再实际扣款(如所填预授权金额小于实际加油金额将禁止使用此支付方式)</div>
    </van-overlay>
    <van-action-sheet
      v-model="show1"
      :actions="actions1"
      @select="onSelect1"
    />
    <van-action-sheet
      v-model="show2"
      :actions="actions2"
      @select="onSelect2"
    />
    <van-action-sheet
      v-model="showche"
      :actions="actionsche"
      @select="onSelectche"
    />
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
  import Jwx from "../utils/jwx"
  import {mapGetters} from 'vuex'
  import VirtualKeyboard from '@/components/base/virtual-keyboard'
  import Config from "@/api/config";
  import payHelper from "@/utils/payHelper";
  import {Dialog} from 'vant';
  import {Toast} from 'vant'
  import api from '@/views/jane-pay/api'

  export default {
    name: "signing",
    mixins: [api],
    data() {
      return {
        showSigned: false, //已经签约的提示弹框
        plateNum: '',
        radio: '',
        referrer: '', //推荐人
        rfrCodeType: '', //1 填写  2 扫码
        disabled: true,
        allRadio: true, //全选
        colorstyle: '蓝', //车牌颜色
        toastView: false, //预授权金额
        way: '',
        waySub: '', //签约方编码
        show: false, //高级键盘
        actions: [], //车牌号列表
        showxiala: false, //车牌号列表
        shenfenView: false, //判断身份证是否显示
        styleMoney1: '', //签约方名称
        styleMoney: '',
        cardStyle: '',
        cardType: '',
        preAuthAmountView: false,//预授权金额
        preAuthAmount:null,
        show2: false, //农行的卡类型
        actions2: [{name: '借记卡', id: '1'}, {name: '贷记卡', id: '3'}, {name: '合并卡', id: 'A'}], //农行的卡类型
        tidSign: '', //标签号
        show1: false, //选择支付方式
        actions1: [], //选择支付方式
        showche: false, //车牌颜色弹框
        actionsche: [{name: '绿'}, {name: '黄'}, {name: '蓝'}, {name: '白'}, {name: '黑'}],
        signingstyle: '',
        gonghangView: false, //工行特殊处理
        id: '',
        phone: '',
        shenfen: {},
        chepai: {},
        list: [],
        signType: '', //签约方式
        isweChat: [], //初始化接口判断签约方
        backUUID: '',
        singWay1: '', //标签号签约
        singWay2: '', //身份证签约
        singWay3: '', //车牌签约
        hasToSign: false,
        isSign: false, //判断建行车牌号是否签约
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    mounted() {
      console.log('这是签约页面11')
      console.log('预授权金额', this.$store.state.globalConfig.pass_free_preAuth_type)
      this.getPhone()
      let text = ''
      text = this.$store.state.globalConfig.density_free_sign_type || '' //1：标签，2：身份证，3：车牌号
      if (text == '') {
        this.singWay1 = 1
        this.singWay2 = 2
        this.singWay3 = 3
      } else {
        if (text.indexOf('1') >= 0) {
          this.singWay1 = 1
        }
        if (text.indexOf('2') >= 0) {
          this.singWay2 = 2
        }
        if (text.indexOf('3') >= 0) {
          this.singWay3 = 3
        }
        if (text.substring(0, 1) == '1') {
          this.radio = '3'
        } else if (text.substring(0, 1) == '2') {
          this.radio = '1'
        } else if (text.substring(0, 1) == '3') {
          this.radio = '2'
        }
      }
      this.backUUID = this.$util.randomString();
      this.listenAndriodBack();
      this.isauthentication()
      this.chepaiList()
      this.$bridgefunc.enterForegroundCallBack(() => {
        if (this.hasToSign) {
          this.checkSignResult()
        }
      })
    },
    methods: {
      checkSignResult: function () {
        // do check
        this.hasToSign = false
      },
      listenAndriodBack() {
        this.$bridgefunc.registeBridge('phonebridge', (res) => {
          let obj = JSON.parse(res);
          if (obj.type == this.backUUID) {
            Dialog.close()
          }
        })
      },
      signed() {
        this.showSigned = false
        this.$router.go(-1)
      },
      onSelect1(item) {
        this.show1 = false;
        this.styleMoney1 = item.name
        this.way = item.payWayName
        this.waySub = item.payWayModel
        this.isSign = false
        if (this.waySub == "340002") { //340002,农行   1工行 2建行 3微信 4农行 5ETC
          this.gonghangView = true
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 4) {
            this.preAuthAmountView = true
          } else {
            this.preAuthAmountView = false
          }
        } else if (this.waySub == "310001") { // 310001,平安银行
          this.gonghangView = true;
        } else if (this.waySub == "305004") { //305004,工银
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 1) {
            this.preAuthAmountView = true
          } else {
            this.preAuthAmountView = false
          }
        } else if (this.waySub == "210007") { // 210007,微信
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 3) {
            this.preAuthAmountView = true
          } else {
            this.preAuthAmountView = false
          }
        } else if (this.waySub == "305006") { //305006,工行ETC
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 5) {
            this.preAuthAmountView = true
          } else {
            this.preAuthAmountView = false
          }
        } else if (this.waySub == "320004") { //320004,建行
          if (this.$store.state.globalConfig.pass_free_preAuth_type == 2) {
            this.preAuthAmountView = true
          } else {
            this.preAuthAmountView = false
          }
        }
      },
      getTips() {
        let that = this
        that.toastView = true
        setTimeout(function () {
          that.toastView = false
        }, 10000)
      },
      passfreeQuery() {
        //建行签约前调用查询车牌是否签约
        let that = this;
        if (this.waySub == "305006" || this.waySub == "320004") {
          let params = {
            //thirdUserId: this.$store.state.login.wxOpenid,
            token: this.$store.state.login.token,
            payModelSub: that.waySub,
            plateNo: that.plateNum
          };
          that.jiansheData(params).then(res => {
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
      // 开通
      openWxService(){
        let params = {
          payModelSub: this.waySub,
          plateNo: this.plateNum,
          openid: this.$store.state.login.wxOpenid
        }
        this.$request.post('/app/json/user/openWxService', params).then(res => {
          if (res.status == 0) {
            this.$Loading.close();
            let resInfo = res.data.info;
            console.log('油惠通签约', resInfo);
            // Jwx.wxSign(resInfo)
            this.$bridgefunc.wxFreePay(resInfo)
          } else {
            this.$Toast(res.info)
          }
        })
      },
      sweepReferrer() { //获取推荐人
        this.$bridgefunc.scanCode(res => {
          this.rfrCodeType = 2;
          this.referrer = res.code
        });
      },
      pays() {
        let that = this
        if (that.radio == '2') { //车牌签约
          if (that.colorstyle == '绿') {
            if (that.plateNum.length != 8) {
              that.$Toast('请输入8位车牌号')
              return
            }
          } else {
            if (that.plateNum.length != 7) {
              that.$Toast('请输入7位车牌号')
              return
            }
          }
        } else if (that.radio == '3') { //标签号签约
          if (that.plateNum.length != 7) {
            that.$Toast('请输入7位车牌号')
            return
          }
        }
        this.show1 = true
      },
      cheColor() {
        this.showche = true
      },
      cardpays() {
        this.show2 = true
      },
      onSelect2(item) {
        this.show2 = false;
        this.cardStyle = item.name
        this.cardType = item.id
      },
      onSelectche(item) {
        this.colorstyle = item.name
        this.showche = false
      },
      selectRadio(params) {
        this.radio = params
        this.isauthentication()
      },
      morePlate() {
        this.showxiala = true
      },
      onSelect(item) {
        this.showxiala = false;
        this.plateNum = item.name
      },
      getPhone() {
        this.$request.post('/app/json/user_auth/findUserPhone', {}).then(res => {
          if (res.status === 0) {
            console.log('手机号', res)
            this.phone = res.data
            console.log(this.phone)
          } else {
            this.$Toast(res.info)
          }
        })
      },
      isauthentication() {
        let that = this
        this.gonghangView = false
        let params = {
          token: this.$store.state.login.token
        }

        that.judgeData(params).then(res => {
          if (res.data.result == 'success') {
            console.log('实名认证', res);
            that.isweChat = JSON.parse(res.data.data.payWayModel) || []
            that.isweChat.forEach(function (item) {
              if (item.payWayName == 'ETC') {
                item.name = '工行ETC'
              } else {
                item.name = item.payWayName
              }
            })
            that.actions1 = that.isweChat
            that.actions1.forEach((value,index)=>{
              if(value.payWayModel=='305006'){
                that.actions1.splice(index,1)
                that.actions1.unshift(value)
              }
            })
            console.log(this.actions1,'this.actions')
            that.styleMoney1 = that.actions1[0].payWayName
            that.waySub = that.actions1[0].payWayModel
            that.way = that.actions1[0].payWayName
            if (that.actions1[0].payWayModel == "340002") { //农行
              this.gonghangView = true
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 4) {
                this.preAuthAmountView = true
              }
            } else if (that.actions1[0].payWayModel == "310001") { //平安银行
              this.gonghangView = true;
            } else if (that.actions1[0].payWayModel == "305004") { //工银
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 1) {
                this.preAuthAmountView = true
              }
            } else if (that.actions1[0].payWayModel == "210007") { //微信
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 3) {
                this.preAuthAmountView = true
              }
            } else if (that.actions1[0].payWayModel == "305006") { //ETC
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 5) {
                this.preAuthAmountView = true
              }
            } else if (that.actions1[0].payWayModel == "320004") { //建行
              if (this.$store.state.globalConfig.pass_free_preAuth_type == 2) {
                this.preAuthAmountView = true
              }
            }
            if (that.radio == '1') {
              if (res.data.data.isCertificate == 1) { //身份证
                that.shenfen = res.data.data.usercertificate || {}
                that.shenfenView = true
              } else {
                that.shenfenView = false
                this.$bridgefunc.andriodaddback(this.backUUID, () => {
                  Dialog.alert({
                    title: '提示',
                    message: '请先完成实名认证'
                  }).then(() => {
                    this.$bridgefunc.delandriodback(this.backUUID, () => {
                      this.authentication();
                    })
                  });
                })

              }
            } else if (that.radio == '2') {
              if (res.data.data.isVehicle == 1) { //车牌(行驶证或车辆)
                that.plateNum = res.data.data.vehicleModel.plateNum || ''
                that.chepai = res.data.data.vehicleModel || {}
              }
            }
          } else {
            Toast(res.data.info)
          }
        })
      },
      authentication() {
        this.$router.push({
          path: '/real-name-authentication'
        })
      },

      chepaiList() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }

        that.chepaiData(params).then(res => {
          if (res.data.result == 'success') {
            let array = res.data.data || []
            array.forEach(function (item) {
              item.name = item.plateNum
            })
            that.actions = array
          }
        })
      },
      focus() {
        this.show = true
        document.activeElement.blur()
      },
      inputKey(val) { //限制7位
        if (this.plateNum.length < 8) {
          this.plateNum = this.plateNum + val
        }
      },
      deleteKey() {
        this.plateNum = this.plateNum.substr(0, this.plateNum.length - 1)
      },
      changeRfrCodeType() {
        this.rfrCodeType = 1
      },
      nextIndex() {
        let that = this
        if (that.allRadio == false) {
          that.$Toast('请勾选同意协议')
          return
        }
        if (that.isSign == true) {
          that.$Toast('您已经签约过了')
          return
        } else {
          if (that.radio == '1') { //身份证签约
            that.signType = 3
            that.colorstyle = ''
          } else if (that.radio == '2') { //车牌签约
            if (that.colorstyle == '绿') {
              if (that.plateNum.length != 8) {
                that.$Toast('请输入8位车牌号')
                return
              }
            } else {
              if (that.plateNum.length != 7) {
                that.$Toast('请输入7位车牌号')
                return
              }
            }
            that.signType = 2
            that.colorstyle = that.colorstyle
          } else if (that.radio == '3') { //标签号签约
            if (that.tidSign.length != 16) {
              that.$Toast('请输入16位标签')
              return
            }
            if (that.plateNum.length != 7) {
              that.$Toast('请输入7位车牌号')
              return
            }
            that.signType = 1
            that.colorstyle = that.colorstyle
          }
          if (this.preAuthAmountView == true) {
            if (!that.preAuthAmount) {
              that.$Toast('请输入预授权金额')
              return
            }
          }
          let url = '/app/json/user/applySign'
          let params = {
            token: this.$store.state.login.token,
            plateNo: that.plateNum ? that.plateNum : '', //车牌号
            generateKey: that.tidSign ? that.tidSign : '',
            payModelSub: that.waySub, //支付方式
            signType: that.signType, //1:标签签约（默认），2:车牌号签约，3身份证签约
            idCardNo: that.shenfen.idcardNum ? that.shenfen.idcardNum : '', //身份证号
            returnUrl: window.location.origin + '/app-vue/app/index.html#/jane/complete',
            plateColor: that.colorstyle, //车牌颜色
            // cardType: that.cardType //签约卡类型
            preAuthAmount: that.preAuthAmount, //预授权金额
            referrer: that.referrer ? this.referrer : '' //推荐人
          }
          this.$Loading.open()

          console.log(that.waySub)
          if (that.waySub == "340002" || that.waySub == '310001') { // 农行
            this.$Loading.close();
            params.cardType = that.cardType
            params.phone = that.phone
            if (that.waySub == '310001') {
              params.title = '平安银行签约信息'
              params.types = 1
            } else {
              params.title = '农行签约信息'
              params.types = 2
            }
            that.$router.push({
              path: '/jane/agriculturalBank',
              query: {
                bankMessage: params
              }
            })
          } else if (that.waySub == '210009') {  // 查询是否开通
            console.log(that.$store.state.login.wxOpenid)
            if (!that.$store.state.login.wxOpenid) {
              this.$Toast('请先进行微信绑定')
              this.$router.push('/usercenter/bindwechat')
              return
            } else {
              let params = {
                payModelSub: that.waySub,
                plateNo: that.plateNum,
                openid: that.$store.state.login.wxOpenid
              }
              console.log(params)
              this.$request.post('/app/json/user/queryWxOpenstate', params).then(res => {
                this.$Loading.close();
                if (res.status == 0) {
                  if(res.data.contractCode){
                    that.$Toast('已签约成功')
                    this.$router.go(-1)
                  }else{
                    this.openWxService()
                  }
                } else {
                  this.$Toast(res.info)
                }
              })
            }
          } else {
            that.$http.post(url, params).then(res => {
              this.$Loading.close();
              console.log('签约', res);
              if (res.data.result == 'success') {
                if (that.waySub == "305004") { //工行
                  console.log(encodeURIComponent(JSON.stringify(params)))
                  this.$bridgefunc.customPush({
                    path: window.location.origin + '/app-vue/app/index.html#/jane/janeView',
                    isnativetop: '1',
                    superback: 1,
                    query: {
                      info: encodeURIComponent(JSON.stringify(params))
                    }
                  })
                }
                // else if (that.waySub == "210007") { //微信
                //   this.$Loading.close();
                //   let resInfo = res.data.data.info;
                //   console.log('油惠通签约', resInfo);
                //   Jwx.wxSign(resInfo)
                // }
                else if (that.waySub == "320004") { //建行
                  this.$Loading.close();
                  that.$bridgefunc.customPush({
                    path: res.data.data.info,
                    isnativetop: '1',
                    superback: 1
                  })
                } else if (that.waySub == "305006") { // 305006,工行ETC
                  this.$Loading.close();
                  that.$bridgefunc.customPush({
                    path: res.data.data.info,
                    isnativetop: '1',
                    superback: 1
                  })
                  // console.log('ETC', res.data.data.info)
                  // let str = res.data.data.info
                  // var u = navigator.userAgent
                  // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
                  // if (isAndroid) {
                  //   Jwx.openNewPage(str)
                  // } else {
                  //   // let sign = str.match(/sign_medid=(\S*?)&/)[1]
                  //   let sign = this.getvar(str, 'redirect_url')
                  //   console.log(1, sign)
                  //   console.log(2, decodeURIComponent(sign))
                  //   str.replace(sign, decodeURIComponent(sign))
                  //   console.log(3, str.replace(sign, decodeURIComponent(sign)))
                  //   let newStr = str.replace(sign, decodeURIComponent(sign))
                  //   Jwx.openNewPage(newStr)
                  // }
                }
              } else {
                that.$Toast(res.data.info)
              }
            })
          }
        }
      },
      getvar(url, par) {
        var urlsearch = url.split('?');
        var pstr = urlsearch[1].split('&');
        for (var i = pstr.length - 1; i >= 0; i--) {
          var tep = pstr[i].split("=");
          if (tep[0] == par) {
            return tep[1];
          }
        }
        return (false);
      },
      // sweep() { //扫一扫
      //   Jwx.scanCode().then(res => {
      //     this.tidSign = res
      //   })
      // },
      sweep() {
        this.$bridgefunc.scanCode(res => {
          this.rfrCodeType = 2;
          this.tidSign = res.code;
        });
      },
      allSelect() {
        let that = this
        that.allRadio = !that.allRadio
      }
    },
    components: {
      VirtualKeyboard
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    font-size 16px;

    .tipDiv {
      border-top 1px solid #e5e5e5;

      .box {
        width 94%;
        margin 10px auto;
        padding 10px 8px;
      }

      .carint {
        width 140px;
      }

      /deep/ .table-view .table-view-cell .table-view-cell-text .left {
        width 135px;

        .img1 {
          width 30px;
          vertical-align middle
        }

        /deep/ .mint-field-core {
          font-size: 14px;
          color: #cdcbcc;
        }
      }
    }

    /deep/ .mint-field-core {
      background white
    }

    .btns {
      margin-top 50px;
      margin-bottom 40px;

      /deep/ .van-radio {
        justify-content center
      }

      .div1 {
        font-size: 14px;
        margin-bottom: 20px;

        a {
          color #ff884f
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

  /deep/ .van-checkbox {
    justify-content center
  }

  /deep/ .mint-cell-wrapper {
    padding 0
  }

  /deep/ .iconfont {
    margin-right 20px !important;
  }

  /deep/ .mint-field-other {
    /*right 4px;*/
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
    top auto;
    width 100%
  }

  /deep/ .nav-content {
    overflow-y auto !important
  }

  /deep/ .van-radio__label {
    font-size 12px;
    margin-left 3px;
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

  /deep/ .van-overlay {
    background-color: transparent !important
  }
</style>
