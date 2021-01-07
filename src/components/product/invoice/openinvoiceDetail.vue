<template>
  <div class="body">
    
    <div class="history" @click="goHistory" v-if="orderType == 'electronicCard'">
      开票历史
    </div>
    <nav-top @backEvent="$router.go(-1)" title="自助开票">
    </nav-top>
    <nav-content>
      <van-notice-bar :scrollable="false">提示：将为您开具增值税电子普通发票！</van-notice-bar>
      <div @click="close">
        <div class="divTitle">发票详情</div>
        <div class="publicInvoice">
<!--          <van-radio-group v-model="typeObj.titleType" class="radioBtn" :disabled="orderType != 'cardOrder' && (cardType != '03' && cardType != '04')">-->
          <van-radio-group v-model="typeObj.titleType" class="radioBtn" :disabled="prohibitDis">
            <span>抬头类型</span>
            <div class="radioBtnDiv">
              <van-radio :name="4" checked-color="#f44">个人/非企业单位</van-radio>
              <van-radio :name="5" checked-color="#f44">企业</van-radio>
            </div>
          </van-radio-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 4">
          <van-cell-group style="position: relative">
            <van-field :disabled="$route.query.type == 'cardOrder' && $store.state.globalConfig.isEditCardInvoiceTitle == 1 " @click.stop="clickField" class="paragraph" @input="monitor" v-model.trim="paramsPersonData.title" label="发票抬头" placeholder="请输入发票抬头"/>
            <div :class="{divPut:dropDown==true,nothing:dropDown==false}">
              <div class="divPut1"></div>
              <div class="divPut2">
                <ul>
                  <li @click="detailData(item)" v-if="dropDown" v-for="(item,index) in isText" :key="index">{{item.title}}</li>
                </ul>
              </div>
            </div>
            <router-link :to="{path: '/orderList',query: {ids: ids,type: orderType,source: $route.query.source}}" style="position: relative" v-if="!toCardView && $route.query.type !== 'electronicCard'">
              <div class="openBox">
                <div class="openBox1">
                  <span>发票内容</span>
                </div>
                <div>
                  <span class="span">查看明细</span>
                </div>
              </div>
            </router-link>
            <van-field v-model="paramsPersonData.totalMoney" label="发票金额" placeholder="请输入发票金额" disabled/>
          </van-cell-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 4">
          <van-cell-group>
            <!--          <van-field v-model="paramsData.userPhone" type="tel" label="电话号码" placeholder="请输入电话号码"/>-->
            <!--          <van-field v-model="paramsData.userEmail" label="电子  邮箱" placeholder="选填"/>-->
          </van-cell-group>
        </div>
        <div class="divTitle" v-if="typeObj.titleType == 4">邮寄信息</div>
        <div class="publicInvoice" v-if="typeObj.titleType == 4">
          <van-cell-group>
            <van-field v-model.trim="paramsPersonData.userPhone" v-if="phoneView" label="手机号" placeholder="请输入手机号"/>
            <van-field v-model.trim="paramsPersonData.userEmail" label="邮箱" placeholder="请输入邮箱"/>
            <van-field v-if="$route.query.type != 'cardOrder'" maxlength="100" v-model="paramsPersonData.customerRemark" rows="1" autosize label="备注" type="textarea" placeholder="请输入备注"/>
          </van-cell-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 5">
          <van-cell-group style="position: relative">
            <van-field class="paragraph" :disabled="$route.query.type == 'cardOrder' && $store.state.globalConfig.isEditCardInvoiceTitle == 1" @click.stop="clickField"  @input="monitor" :readonly="prohibitDis" v-model.trim="paramsData.title" label="发票抬头" placeholder="请输入发票抬头"/>
            <div :class="{divPut:dropDown==true,nothing:dropDown==false}">
              <div class="divPut1"></div>
              <div class="divPut2">
                <ul>
                  <li @click="detailData(item)" v-if="dropDown" v-for="(item,index) in isText">{{item.title}}</li>
                </ul>
              </div>
            </div>
            <van-field v-model.trim="paramsData.orgTaxNo" label="税号" placeholder="请输入税号"/>
            <router-link :to="{path: '/orderList',query: {ids: ids,type: orderType,source: $route.query.source}}" style="position: relative" v-if="!toCardView">
              <div class="openBox" @click="seeView">
                <div class="openBox1">
                  <span>发票内容</span>
                </div>
                <div>
                  <span class="span">查看明细</span>
                </div>
              </div>
            </router-link>
            <van-field v-model="paramsData.totalMoney" label="发票金额" placeholder="请输入发票金额" disabled/>
          </van-cell-group>
        </div>
        <div class="publicInvoice" v-if="typeObj.titleType == 5">
          <van-cell-group>
            <div class="openBox">
              <div class="openBox1">
                <span>更多信息</span>
                <span>开户行和账号等（非必填）</span>
              </div>
              <div @click="openView = !openView">
                <span class="span">{{openView?'展开': '收起'}}</span>
              </div>
            </div>
            <div v-if="!openView">
              <van-field v-model="paramsData.companyAddress" label="地址" placeholder="请输入地址"/>
              <van-field v-model.trim="paramsData.telephone" label="电话"/>
              <van-field v-model="paramsData.openingBank" label="开户行" placeholder="请输入开户行"/>
              <van-field v-model="paramsData.bankAccount" label="账户" placeholder="请输入账户"/>
            </div>
          </van-cell-group>
        </div>
        <div class="divTitle" v-if="typeObj.titleType == 5">邮寄信息</div>
        <div class="publicInvoice" v-if="typeObj.titleType == 5">
          <van-cell-group>
            <van-field  v-model.trim="paramsData.userPhone" v-if="phoneView" label="手机号" placeholder="请输入手机号"/>
            <van-field v-model.trim="paramsData.userEmail" label="邮箱" placeholder="请输入邮箱"/>
            <van-field v-if="$route.query.type != 'cardOrder'" maxlength="100" v-model="paramsData.customerRemark" rows="1" autosize label="备注" type="textarea" placeholder="请输入备注"/>
          </van-cell-group>
        </div>
        <div class="open-paper-tickets" @click="openPaperTickets" v-if="showPaperticketButton == 1">
          <span>我要开纸票</span>
        </div>
        <div class="answer theme_bg_red" @click="commit">提交</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from "./api";
  import utils from "@/utils/util"
  import {Toast} from 'vant'
  import areaList from "../../../config/area.min.js";
  export default {
    name: "openinvoiceDetail",
    mixins: [api],
    data() {
      return {
        userInvoiceHeadModels:[],
        radio: "",
        checked: false,
        companyAddress: "",
        userEmail: "",
        orgTaxNo: "",
        idDetail: '',
        title: '',
        openView: true,
        openingBank: '',
        userPhone: '',
        bankAccount: '',
        toCardView: false,
        people: '',
        opentext: '展开',
        typeObj: {
          titleType: 5
        },
        paramsPersonData: {
          titleType: 4
        },
        paramsData: {
          titleType: 5
        },
        open: '',
        dropDown: false,
        detailObj: {},
        isText: [],
        titleId: '',
        type: '',
        shoppingOrderModels: {},
        ids: '',
        orderType: '',
        cardNo:'',
        nodeNo: '',
        cardType: '',
        startTime: '',
        endTime: '',
        lastPath: '',
        prohibitDis: false,
        isPhone: '',
        phoneView: true,
        isShow: '', // 开支票 时间显示
        showPaperticketButton: -1 // 开支票按钮是否显示
      };
    },
    created() {
      console.log(this.$route.query);
      this.shoppingOrderModels = this.$route.query.orderList?JSON.parse(this.$route.query.orderList): []
      this.paramsData.totalMoney = this.$route.query.totalMoney
      this.paramsPersonData.totalMoney = this.$route.query.totalMoney
      this.ids = this.$route.query.idArray || ""
      this.cardNo = this.$route.query.cardNo
      this.nodeNo = this.$route.query.nodeNo
      this.cardType = this.$route.query.cardType
      this.orderType = this.$route.query.type
      this.startTime = this.$route.query.startTime
      this.endTime = this.$route.query.endTime
      this.lastPath = this.$route.query.lastPath
      this.isPhone = this.$store.state.globalConfig.isShowInvoicePhoneNumber //0不显示，1显示手机号
      console.log(this.orderType,'-------------')
      if (this.isPhone === '1') {
       this.phoneView = true
      } else if (this.isPhone === '0') {
        this.phoneView = false
      } else {
        this.phoneView = true
      }
      if (this.orderType == 'cardOrder') {
        this.toCardView = true
        if (this.cardType=='03' || this.cardType == '04') { //03个人卡，04是个人卡多用户，这两种类型禁止编辑
          this.prohibitDis = false
        } else {
          this.prohibitDis = true
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    mounted() {
      if (this.orderType == 'cardOrder') { //加油卡
        this.defaultcardTitle()
      } else if (this.orderType == 'mallOrder' || this.orderType == 'appOrder' || this.orderType == 'goldOrder' || this.orderType == 'storeOrder') { //商城订单和app加油订单
        this.defaultTitle()
      }

      if (this.$store.state.globalConfig.papertickets == 1) {
        this.isShow = this.dateCompare(new Date(), this.shoppingOrderModels[0].refuelTakeDate)
        this.showPaperticketsBtn()
      }
    },
    methods: {
      showPaperticketsBtn() {
        this.$request.post('/app/json/user_invoice_assistant/querShowPaperticketButton',{
          storeOuCode: this.shoppingOrderModels[0].storeOuCode
        }).then(res => {
          if (res.status == 0) {
            if (res.data == 1) {
              // 1 展示
              if (this.isShow == 1) {
                this.showPaperticketButton = 1

              } else {
                this.showPaperticketButton = -1
              }
            } else {
              // 0：不展示
              this.showPaperticketButton = -1
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      dateCompare(date, compareDate) {
        var curDate = new Date(compareDate);
        var preDate = new Date(curDate.getTime() + 30* 60 * 1000);
        if(date.valueOf() > preDate.valueOf()){
          console.log('已过期')
          return -1
        } else if (date.valueOf() < preDate.valueOf()) {
          console.log('未过期')
          return 1
        }
      },
      close() {
        this.dropDown = false
      },
      seeView() {

      },
      goHistory() {
        // 跳转开票历史页面
        this.$router.push("/open_invoice_history")
      },
      openPaperTickets() {
        // 我要开纸票
        console.log(this.shoppingOrderModels)
        this.$request.post('/app/json/user_invoice_assistant/unLockInvoiceMark', {
          storeBranchOrgOuCode: this.shoppingOrderModels[0].storeBranchOrgOuCode,
          shoppingOrderId: this.shoppingOrderModels[0].shoppingOrderId,
          storeStandCode: this.shoppingOrderModels[0].storeStandCode,
          refuelRecordId: this.shoppingOrderModels[0].refuelRecordId,
          userId: this.shoppingOrderModels[0].userId
        }).then(res => {
          if (res.status == 0) {
            this.$Toast(res.info ? res.info : '开票成功')
          } else {
            this.$Toast(res.info ? res.info : '获取我的拼团失败')
          }
        })
      },
      defaultTitle() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }

        that.morentitleData(params).then(res => {
          let data = res.data.data || {}
          that.typeObj.titleType =  data.titleType
          if (that.typeObj.titleType == 4){
            that.paramsPersonData = data
            that.paramsPersonData.totalMoney = that.$route.query.totalMoney
            that.paramsData.totalMoney = that.$route.query.totalMoney
          }else if(that.typeObj.titleType == 5){
            that.paramsData = data
            that.paramsData.totalMoney = that.$route.query.totalMoney
            that.paramsPersonData.totalMoney = that.$route.query.totalMoney
          }
        })
      },
      defaultcardTitle() {
        let that = this
        that.page = that.page + 1
        let params = {
          token: this.$store.state.login.token,
          startTime: that.startTime,
          endTime: that.endTime,
          cardNo: that.cardNo,
          needDetail: 1
        };

        that.cardData(params).then(res => {
          if (res.data.result) {
            that.typeObj.titleType = res.data.data.userInvoiceHeadModels[0].titleType
            that.userInvoiceHeadModels = res.data.data.userInvoiceHeadModels
            if (that.typeObj.titleType == 4){
              that.paramsPersonData = res.data.data.userInvoiceHeadModels[0]
              that.paramsData.totalMoney = that.$route.query.totalMoney
              that.paramsPersonData.totalMoney = that.$route.query.totalMoney
            }else if(that.typeObj.titleType == 5){
              that.paramsData = res.data.data.userInvoiceHeadModels[0]
              that.paramsPersonData.totalMoney = that.$route.query.totalMoney
              that.paramsData.totalMoney = that.$route.query.totalMoney
            }
          }
        });
      },
      clickField(){
        if (this.$route.query.type == 'cardOrder' && this.$store.state.globalConfig.isEditCardInvoiceTitle == 1){
          this.isText = this.userInvoiceHeadModels
          this.dropDown = true
        }
      },
      monitor(val) { //下拉搜索内容
        console.log(val);
        let that = this
        let params = {
          token: this.$store.state.login.token,
          title: val
        }

        that.souData(params).then(res => {
          if (res.data.data.length > 0) {
            that.isText = res.data.data
            that.dropDown = true
          } else {
            that.dropDown = false
          }
        })
      },
      detailData(index) { //查详情
        let that = this
        if (index.titleType == 4){
          that.typeObj.titleType = 4
          that.paramsData = {}
          that.paramsPersonData = index
          that.paramsData.totalMoney = that.$route.query.totalMoney
          that.paramsPersonData.totalMoney = that.$route.query.totalMoney
        }else if(index.titleType == 5){
          that.typeObj.titleType = 5
          that.paramsPersonData = {}
          that.paramsData = index
          that.paramsData.totalMoney = that.$route.query.totalMoney
          that.paramsPersonData.totalMoney = that.$route.query.totalMoney
        }
      },
      commit() {
        let that = this
        let params = {}
        if (that.typeObj.titleType == 4){
          that.paramsPersonData.titleType = 4
          Object.assign(params, that.paramsPersonData)
        }else if(that.typeObj.titleType == 5){
          that.paramsData.titleType = 5
          Object.assign(params, that.paramsData)
        }
        params.telephone = params.telephone ? params.telephone.toString().replace(/\s*/g,"") : ''
        console.log(333,params);
        if (!params.title) {
          Toast({
            message: '请输入发票抬头',
            duration: 2000,
          });
          return;
        }
        if (params.titleType == 5) {
          if (!params.orgTaxNo) {
            Toast({
              message: '请输入税号',
              duration: 2000,
            });
            return;
          }
        }
        if (that.phoneView == true) {
          if (!params.userEmail && !params.userPhone) {
            Toast({
              message: '请输入邮箱或者手机号',
              duration: 2000,
            });
            return;
          }
          if (params.userPhone && !(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(params.userPhone))) {
            Toast({
              message: '请输入正确的手机号',
              duration: 2000,
            });
            return;
          }
        } else {
          if (!params.userEmail) {
            Toast({
              message: '请输入邮箱',
              duration: 2000,
            });
            return;
          }
        }
        var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (params.userEmail && !re.test(params.userEmail)) {
          Toast({
            message: '请输入正确的邮箱',
            duration: 2000,
          });
          return;
        }
        if (params.titleType == 5) {
          console.log('电话号',params.telephone);
            if (params.telephone && !(/^0\d{2,3}-\d{7,8}$/.test(params.telephone) || /^1(3|6|4|5|7|8|9)\d{9}$/.test(params.telephone))) {
            Toast({
              message: '请输入正确的电话号',
              duration: 2000,
            });
            return;
          }
        }
        this.$Loading.open()
        if (that.orderType == 'cardOrder') {
          that.commitselfcardinvoiceData({
            token: this.$store.state.login.token,
            refuelingCardInfoModels: that.shoppingOrderModels,
            userInvoiceHeadModel: params,
            cardNo: that.cardNo,
            stnCode: that.nodeNo
          }).then(res => {
            this.$Loading.close()
            if (res.data.result === 'success') {
              Toast.success('开票成功');
              that.$router.go(-1)
            } else {
              Toast(res.data.info)
            }
          })
        } else if (that.orderType == 'goldOrder') { //加油金
          that.commitselfgoldinvoiceData({
            token: this.$store.state.login.token,
            shoppingOrderModels: that.shoppingOrderModels,
            userInvoiceHeadModel: params
          }).then(res => {
            this.$Loading.close()
            if (res.data.result === 'success') {
              Toast.success(res.data.data);
              that.$router.go(-1)
            } else {
              Toast(res.data.info)
            }
          })
        } else if(that.orderType == "electronicCard") { //电子加油卡-天津用
          let obj = {
            cardNo:params.totalMoney,
            titleType:params.titleType,
            orgTaxNo:params.orgTaxNo,
            phone:params.userPhone,
            titleEmail:params.userEmail,
            title:params.title,
            openingBank:params.openingBank,
            companyAddress:params.companyAddress,
            bankAccount:params.bankAccount,
            mobile:params.telephone
          }
          this.$http.post("/app/json/app_user_ele_card_invoice/eleCardInvoice",obj).then(res=>{
            this.$Loading.close()
            if (res.data.result === 'success') {
              let url = {
                path: '/electronic_refund_result',
                query:{
                  type:3
                }
              }
              that.$router.replace(url)
            } else {
              Toast(res.data.info)
            }
          })
        } else{
          that.commitselfinvoiceData({ //app加油
            token: this.$store.state.login.token,
            shoppingOrderModels: that.shoppingOrderModels,
            userInvoiceHeadModel: params
          }).then(res => {
            this.$Loading.close()
            if (res.data.result === 'success') {
              Toast.success(res.data.data);
              that.$router.go(-1)
            } else {
              Toast(res.data.info)
            }
          })
        }
      }
    }
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    .divTitle {
      height: 60px;
      line-height: 60px;
      padding: 0 0.4rem;
      font-size: 16px;
    }
    /deep/ .nav-content {
      overflow-y auto !important;
      margin-bottom 55px;
    }
    .publicInvoice {
      box-shadow: #f3f3f3 0px 0px 15px;
      width: 95%;
      margin: 0 auto 10px auto;

      /deep/ .van-cell:not(:last-child)::after {
        right: 0.4rem;
      }

      .openBox {
        display: flex;
        justify-content: space-between;
        margin: 0 0.4rem;
        padding: 0.266667rem 0;
        box-sizing: border-box;
        color: #323233;
        font-size: 0.373333rem;
        line-height: 0.64rem;
        border-bottom: 0.026667rem solid #ebedf0;
        .openBox1 {
          span:nth-child(2) {
            font-size: 12px;
            margin-left: 6px;
            color #323233
          }
        }
        .span {
          color #f80f16
          padding 0 14px;
        }
      }

      .taiBtn {
        line-height: 0.64rem;
        padding: 0.266667rem 0.4rem;
        display: flex;
        justify-content: space-between;
      }

      .radioBtn {
        .radioBtnDiv {
          width: 80%;
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
        }
      }

      .van-cell-group {
        /deep/ .van-field__control {
          text-align: right;
        }

        /deep/ .van-field__control:disabled {
          color: #323233;
        }
      }

      .van-radio-group {
        display: flex;
        justify-content: space-between;
        padding: 0.266667rem 0.4rem;
        line-height: 0.64rem;
        font-size: 0.373333rem;
      }

      .publicInvoiceDiv {
        display: flex;
        justify-content: space-between;

        .img {
          width: 10px;
          vertical-align: middle;
          line-height: 1.2rem;

          img {
            width: 100%;
          }
        }
      }
    }

    .answer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: white;
      font-size: 18px;
      a {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 18px;
      }
    }
    .divPut {
      width 100%;
      height 5.8rem;
      padding 0 0.4rem;
      display flex;
      justify-content space-between
      position: absolute;
      top: 1.2rem;
      z-index: 20;
      .divPut1 {
        height 100%;
        width: 2.4rem;
      }

      .divPut2 {
        flex 1
        height 100%;
        border-radius 5px;
        overflow-y: auto;
        box-shadow: #f3f3f3 0 0 0.4rem;
        background white
        ul {
          li {
            background: white;
            border-top: 0.026667rem solid #ebedf0;
            /*color: #f5f5f5;*/
            height: 1rem;
            padding: 0.3rem 0.4rem;
          }
        }
      }
    }

    .nothing {
      width 100%;
      height 5.8rem;
      padding 0 0.4rem;
      display flex;
      justify-content space-between
      position: absolute;
      top: 1.2rem;
      z-index: 0;
    }

  }
  .history{
    position: absolute;
    right: 15px;
    font-size: 14px;
    color: #333;
    top: 35px;
    z-index: 999;
  }
  .open-paper-tickets {
    text-align center
    span {
      font-size 14px
      color: #898989
      text-decoration underline
    }
  }
</style>
