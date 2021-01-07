<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="开具发票">
    </nav-top>
    <nav-content>
      <div v-if="showPage">
        <div @click="close">
          <div class="publicInvoice publicInvoice1">
            <van-cell-group>
              <van-field v-model="orderId" type="tel" label="订单号" disabled/>
              <van-field v-model="amount" label="金额" disabled/>
              <div class="publicInvoiceDiv">
                <van-field class="nei" v-model="detail" label="发票内容" disabled/>
                <div class="mingxi" @click="goDetail">
                  <span>明细</span>
                  <span class="img iconfont mall-gengduojiantou"></span>
                </div>
              </div>
            </van-cell-group>
          </div>
          <div class="publicInvoice">
            <van-cell-group style="position: relative" v-if="typeObj.titleType == 4">
              <van-field class="paragraph" @input="monitor" v-model="detailObj1.title" label="发票抬头"
                         placeholder="请输入发票抬头"/>
              <div :class="{divPut:dropDown==true,nothing:dropDown==false}">
                <div class="divPut1"></div>
                <div class="divPut2">
                  <ul>
                    <li @click="detailData(item)" v-if="dropDown" v-for="(item,index) in isText">{{item.title}}</li>
                  </ul>
                </div>
              </div>
            </van-cell-group>
            <van-cell-group style="position: relative" v-if="typeObj.titleType == 5">
              <van-field class="paragraph" @input="monitor" v-model="detailObj2.title" label="发票抬头"
                         placeholder="请输入发票抬头"/>
              <div :class="{divPut:dropDown==true,nothing:dropDown==false}">
                <div class="divPut1"></div>
                <div class="divPut2">
                  <ul>
                    <li @click="detailData(item)" v-if="dropDown" v-for="(item,index) in isText">{{item.title}}</li>
                  </ul>
                </div>
              </div>
            </van-cell-group>
            <van-radio-group v-model="typeObj.titleType">
              <div>抬头类型</div>
              <van-radio :name="4" checked-color="#f44">个人/非企业单位</van-radio>
              <van-radio :name="5" checked-color="#f44">企业</van-radio>
            </van-radio-group>
            <div>
              <div v-if="typeObj.titleType == 4">
                <van-cell-group>
                  <van-field v-model="detailObj1.userPhone" type="tel" label="电话号码" placeholder="输入手机号"/>
                  <van-field v-model="detailObj1.userEmail" label="电子邮箱" placeholder="输入电子邮箱"/>
                </van-cell-group>
              </div>
              <div v-if="typeObj.titleType == 5">
                <van-cell-group>
                  <van-field v-model="detailObj2.orgTaxNo" label="税号" placeholder="请输入税号"/>
                  <van-field v-model="detailObj2.userPhone" label="电话号码" placeholder="输入手机号"/>
                  <van-field v-model="detailObj2.userEmail" label="电子邮箱" placeholder="输入电子邮箱"/>
                  <van-field v-model="detailObj2.companyAddress" label="单位地址" placeholder="选填"/>
                  <van-field v-model="detailObj2.openingBank" label="开户银行" placeholder="选填"/>
                  <van-field v-model="detailObj2.bankAccount" label="银行账号" placeholder="选填"/>
                </van-cell-group>
              </div>
            </div>
          </div>
          <div class="open-paper-tickets" @click="openPaperTickets" v-if="showPaperticketButton == 1">
            <span>我要开纸票</span>
          </div>
          <div class="answer theme_bg_red" :class="{'active': isOpenTicket}" @click="commit">申请开票</div>
        </div>
      </div>
      <!--明细弹框-->
      <van-popup class="detail-modal" v-model="detailData1">
        <div class="detail-modal-content">
          <div class="div1">
            <span>订单号</span>
            <span>{{orderId}}</span>
          </div>
          <div class="div1">
            <span>油站</span>
            <span>{{storeOuName}}</span>
          </div>
          <div class="div1">
            <span>开票金额</span>
            <span>{{invoiceDetail.nrecAmount}}</span>
          </div>
          <div class="div1">
            <span>商品明细</span>
            <span>{{invoiceDetail.skuName}}</span>
          </div>
          <div class="div1">
            <span>商品单价</span>
            <span>{{invoiceDetail.price}}</span>
          </div>
          <div class="div1">
            <span>订单金额</span>
            <span>{{invoiceDetail.payAmount}}</span>
          </div>
          <div class="div1">
            <span>支付明细</span>
            <span>{{invoiceDetail.payModeName}}</span>
          </div>
          <div class="closeBtn" @click="closeDetail">
            <i class="iconfont mall-guanbi"></i>
          </div>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api";
  import {Toast} from 'vant'
  import areaList from "../../../config/area.min.js";

  export default {
    name: "invoicing",
    mixins: [api],
    data() {
      return {
        radio: '5',
        checked: true,
        amount: '',
        orderId: '',
        detail: '',
        companyAddress: "",
        userEmail: "",
        orgTaxNo: "",
        title: '',
        openingBank: '',
        userPhone: '',
        bankAccount: '',
        showPage: true,
        typeObj: {
          titleType: 5
        },
        detailData1: false,
        people: false,
        paramsData: {},
        open: '',
        ouCode: '',
        orderType: '',
        dropDown: false,
        isText: [],
        idDetail: '',
        detailObj1: {
          titleType: 4
        },
        detailObj2: {
          titleType: 5
        },
        vals: '',
        qrCode: '',
        stationOuCode: '',
        storeOuName: '',
        invoiceDetail: {},
        list: {},
        isShow: '', // 开支票 时间显示
        showPaperticketButton: -1, // 开支票按钮是否显示
        isOpenTicket: false
      };
    },
    created() {
      let that = this
      that.qrCode = that.$route.query.StationInvoice
      // this.$bridgefunc.getInvoiceCode('yD5XxaZfsB')

    },
    mounted() {
      // let that = this
      // if (that.radio == 4) {
      //   that.people = true
      //   that.radio = '4'
      // } else if (that.radio == 5) {
      //   that.people = false
      //   that.radio = '5'
      // }
      this.sweepDetail()
      this.defaultTitle()
    },
    methods: {
      openPaperTickets() {
        // 我要开纸票
        console.log(this.list)
        this.$request.post('/app/json/user_invoice_assistant/unLockInvoiceMark', {
          storeBranchOrgOuCode: this.list.stationOuCode,
          shoppingOrderId: this.list.orderId,
          storeStandCode: this.list.ouCode,
          refuelRecordId: this.list.orderId
        }).then(res => {
          if (res.status == 0) {
            this.$Toast(res.info ? res.info : '开票成功')
          } else {
            this.$Toast(res.info ? res.info : '获取我的拼团失败')
          }
        })
      },
      showPaperticketsBtn(data) {
        this.$request.post('/app/json/user_invoice_assistant/querShowPaperticketButton',{
          storeOuCode: data.order.storeOuCode
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
            console.log('showPaperticketButton',this.showPaperticketButton)
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
      closeDetail() {
        this.detailData1 = false
      },
      goDetail() {
        this.detailData1 = true
      },
      detailData(index) { //查详情
        let that = this
        if (index.titleType == 4) {
          that.detailObj1 = index
        } else if (index.titleType == 5) {
          that.detailObj2 = index
        }
      },
      monitor(val) { //下拉搜索内容
        let that = this
        if (!val) {
          return
        }
        this.throttle(function () {
          let params = {
            token: that.$store.state.login.token,
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
        }, 500)()

      },
      throttle(func, delay) {
        let that = this
        return function (...args) {
          if (that.timer) {
            clearTimeout(that.timer)
          }
          that.timer = setTimeout(() => {
            func.apply(that, args)
          }, delay)
        }
      },
      commit() {
        console.log(this.isOpenTicket)
        if (this.isOpenTicket == false) {
          let that = this
          let userInvoiceHeadModel = {}
          if (that.typeObj.titleType == 4) {
            that.detailObj1.titleType = 4
            Object.assign(userInvoiceHeadModel, that.detailObj1)
          } else if (that.typeObj.titleType == 5) {
            that.detailObj2.titleType = 5
            Object.assign(userInvoiceHeadModel, that.detailObj2)
          }
          console.log(that.detailObj1);
          console.log(that.detailObj2);
          console.log(userInvoiceHeadModel);
          if (!userInvoiceHeadModel.title) {
            Toast({
              message: '请输入发票抬头',
              duration: 2000,
            });
            return;
          }
          if (!userInvoiceHeadModel.userEmail && !userInvoiceHeadModel.userPhone) {
            Toast({
              message: '请输入邮箱或者手机号',
              duration: 2000,
            });
            return;
          }

          if (userInvoiceHeadModel.userPhone && !(/^1(3|4|5|7|8|9)\d{9}$/.test(userInvoiceHeadModel.userPhone))) {
            Toast({
              message: '请输入正确的手机号',
              duration: 2000,
            });
            return;
          }
          // if (userInvoiceHeadModel.userEmail && !that.$util.checkMail(userInvoiceHeadModel.userEmail)) {
          //   Toast({
          //     message: '请输入正确的邮箱',
          //     duration: 2000,
          //   });
          //   return;
          // }
          var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          if (userInvoiceHeadModel.userEmail && !re.test(userInvoiceHeadModel.userEmail)) {
            Toast({
              message: '请输入正确的邮箱',
              duration: 2000,
            });
            return;
          }
          if (userInvoiceHeadModel.titleType == 5) {
            if (!userInvoiceHeadModel.orgTaxNo) {
              Toast({
                message: '请输入税号',
                duration: 2000,
              });
              return;
            }
          }
          this.$Loading.open()
          that.tijiaoData({
            token: this.$store.state.login.token,
            userInvoiceHeadModel: userInvoiceHeadModel,
            stationInvoiceQrcodeModel: that.list
          }).then(res => {
            this.$Loading.close()
            if (res.data.result === 'success') {
              this.isOpenTicket = true
              Toast.success('开票成功');
            } else {
              Toast(res.data.info)
            }
          })
        } else {
          Toast.success('已开票');
        }
      },
      sweepDetail() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          qrcode: that.qrCode
          // qrcode: 'rTux9z7heJVXvLgJLmzE'
        }

        that.saoData(params).then(res => {
          let data = res.data.data || {}
          that.state = data.state
          if (data.state === 0) {
            that.list = data
            that.orderId = data.stationOrder.orderId
            that.amount = data.stationOrder.nrecAmount
            that.storeOuCode = data.stationOrder.storeOuCode
            that.orderType = data.orderType
            that.ouCode = data.ouCode
            that.stationOuCode = data.stationOuCode
            that.storeOuName = data.stationOrder.storeOuName
            console.log(this.$store.state.globalConfig.papertickets)
            if (this.$store.state.globalConfig.papertickets == 1) {
              // 显示我要开纸票
              let transactionTime = data.order.cashRefuelingRecordModelList[0].transactionTime
              console.log(transactionTime)
              let time = transactionTime.slice(0,4)+'-'+ transactionTime.slice(4,6)+'-'+transactionTime.slice(6,8)+' '+transactionTime.slice(8,10)+':'+transactionTime.slice(10,12)+':'+transactionTime.slice(12,14)
              console.log(time)
              // time = '2020-12-18 13:50:00'
              this.isShow = this.dateCompare(new Date(), time)
              this.showPaperticketsBtn(data)
            }
            if (data.stationOrder) {
              this.invoiceDetail = this.$assign({}, data.stationOrder.itemList[0], data.stationOrder.payList[0])
            }
          } else if (data.state === 1) {
            that.$router.push({name: 'invalid', params: {state: that.state}})
          } else if (data.state === 2) {
            that.$router.push({name: 'invalid', params: {state: that.state}})
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
          if (data.titleType) {
            that.typeObj.titleType = res.data.data.titleType
          } else {
            that.typeObj.titleType = 5
          }
          if (that.typeObj.titleType == 4) {
            that.detailObj1 = data
          } else if (that.typeObj.titleType == 5) {
            that.detailObj2 = data
          }
        })
      }
    }
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    .shareBox {
      float right;
      display: flex;
      margin-right 10px;
      justify-content: space-around;
      position relative;
      z-index 10

      .name {
        margin-right 10px;
        font-size 14px;
      }
    }

    .publicInvoice {
      box-shadow: #f3f3f3 0px 0px 15px;
      width: 95%;
      margin: 0 auto 10px auto;

      /deep/ .van-cell:not(:last-child)::after {
        right: 0.4rem;
      }

      .img {
        width: 10px;
        vertical-align: middle;
        line-height: 1.2rem;

        img {
          width: 100%;
        }
      }

      .paragraph {
        align-items center
      }

      /deep/ .paragraph .van-field__control {
        background #efefef
        border-radius 5px;
        padding 0.2rem
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

        .nei {
          /deep/ .van-field__control {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .mingxi {
          width 120px;
          display flex
          justify-content space-around
          align-items center

          span {
            font-size 0.37rem
          }

          .img {
            color: #999;
          }
        }
      }
    }

    .publicInvoice1 {
      .van-cell-group {
        .van-cell:nth-child(1) {
          >>> .van-field__label {
            width auto !important
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
      &.active{
        opacity 0.6
      }
    }

    .detail-modal {
      width 80%
      border-radius 5px;

      .detail-modal-content {
        padding 11px;
        position: relative
        padding-top: 40px;
      }

      .div1 {
        display flex;
        justify-content space-between
        height 1.2rem;
        line-height 1.2rem
        border-top 1px solid #ebedf0

        input {
          background transparent;
        }
      }

      .closeBtn {
        position: absolute;
        top: 10px;
        right: 10px;

        .iconfont {
          font-size: 16px;
          color: #999;
        }
      }
    }

    /deep/ .van-radio .van-icon-checked {
      color: #f44
    }
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
