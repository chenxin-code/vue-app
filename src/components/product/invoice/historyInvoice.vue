<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="历史发票">
      <div @click="sideFiltrateModalShow = true" class="shareBox">
        <span class="iconfont mall-shaixuan"></span>
      </div>
    </nav-top>
    <nav-content>
      <div>
        <div :key="index" class="publicInvoice" v-for="(item,index) in listData" v-if="listData.length>0">
          <div @click="toDetail(item)">
            <div class="div1">
              <span>申请时间：{{item.createTime}}</span>
              <span>{{item.makeOutStatusName}}</span>
            </div>
            <div class="div1">
              <span v-if="$store.state.webtype != 2">{{item.orderTypeName}}</span>
              <span>可开票金额：{{item.amount}}元</span>
            </div>
          </div>
          <span @click="reorder(item)" class="reInvoice"
                v-if="item.makeOutStatus == 0 || item.makeOutStatus == 2">重新开票</span>
          <span @click="refundInvoice(item)" class="reInvoice"
                v-if="item.isShowFlushRed == 1 && item.makeOutStatus == '1' && isDuringDate(item.createTime)">退票</span>
          <span @click="Printing(item)" class="reInvoice"
                v-if="item.makeOutStatus == 1 && $store.state.globalConfig.isShowInvoiceQrCode == 1">打印发票二维码</span>
        </div>
        <div v-show="titleView">
          <p class="nullData" v-show="listData.length==0">暂无可查询数据</p>
        </div>
      </div>
    </nav-content>
    <van-overlay :show="showCode" @click="showCode = false">
      <div @click.stop class="wrapper">
        <div class="block">
          <canvas id="qrcode"></canvas>
          <van-icon @click="showCode = false" name="close"/>
        </div>
      </div>
    </van-overlay>
    <transition name="filtrate-mask">
      <div @click="sideFiltrateModalShow = false" class="filtrate-modal-mask" v-show="sideFiltrateModalShow"></div>
    </transition>
    <transition name="filtrate">
      <div class="filtrate-modal-wrapper" ref="sideFiltrateModal" v-if="sideFiltrateModalShow">
        <div class="box">
          <div class="screen1">
            <span class="span">发票状态</span>
            <div>
              <span :class="{red:item.redData==true}" :key="index" @click="statusData(item)"
                    v-for="(item,index) in statusList">{{item.state}}</span>
            </div>
          </div>
          <div class="screen1">
            <span class="span">发票类型</span>
            <div>
              <span :class="{red:item.redData == true}" :key="index" @click="typeData(item)"
                    v-for="(item,index) in typeList">{{item.ordertype}}</span>
            </div>
          </div>
          <div class="screen1 screen2">
            <span class="span">发票金额</span>
            <div>
              <input placeholder="最低金额（元）" type="number" v-model="minAmount">
              <span>~</span>
              <input placeholder="最高金额（元）" type="number" v-model="maxAmount">
            </div>
          </div>
        </div>
        <div class="filtrate-btn">
          <div @click="reset">重置</div>
          <div @click="sure" class="theme_bg_red">确定</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {Toast} from 'vant'
  import api from "./api"
  import QRCode from "qrcode";
  import moment from 'moment'

  export default {
    name: "historyInvoice",
    components: {
      QRCode
    },
    // deactivated() {
    //   console.log('aaaaaaaaaaaa')
    // },
    // activated() {
    //   let that = this
    //   console.log(that.userInvoiceHeadId)
    //   if (this.userInvoiceHeadId.userInvoiceHeadId){
    //     let params = {
    //       token: this.$store.state.login.token,
    //       id:this.userInvoiceHeadId.userInvoiceHeadId
    //     }
    //     console.log(that.userInvoiceHeadId)
    //     that.soudetailData(params).then(res => {
    //       if (res.data.result) {
    //         let taitouData = res.data.data|| {}
    //         let query = {
    //           title:taitouData.title,
    //           orgTaxNo:taitouData.orgTaxNo,
    //           companyAddress:taitouData.companyAddress,
    //           openingBank:taitouData.openingBank,
    //           bankAccount:taitouData.bankAccount,
    //           phone:taitouData.phone,
    //           titleEmail:taitouData.titleEmail,
    //           mobile:taitouData.mobile,
    //           titleType:taitouData.titleType,
    //           token: this.$store.state.login.token
    //         }
    //         console.log(that.userInvoiceHeadId)
    //         query = Object.assign (query,that.userInvoiceHeadId)
    //         console.log(query)
    //         this.$Loading.open()
    //         that.refundData(query).then(res => {
    //           this.$Loading.close()
    //           if (res.data.result === 'success') {
    //             that.userInvoiceHeadId = {}
    //             Toast.success('退票成功');
    //             that.loadData()
    //           } else {
    //             Toast(res.data.info)
    //           }
    //         });
    //       }
    //     });
    //   }else {
    //     this.loadData()
    //   }
    // },
    mixins: [api],
    data() {
      return {
        // userInvoiceHeadId: {},
        listData: [],
        sideFiltrateModalShow: false,
        id: '',
        heightMoney: '',
        lowMoney: '',
        titleView: false, // 避免接口没加载完，极限是空状态
        statusList: [
          {state: '待处理', redData: false, stateNum: 3},
          {state: '已开票', redData: false, stateNum: 1},
          {state: '开票失败', redData: false, stateNum: 2}
        ],
        typeList: [
          {ordertype: '加油订单开票', redData: false, orderNum: 100},
          {ordertype: '商品订单开票', redData: false, orderNum: 200}
        ],
        invoiceStatus: '',
        orderType: '',
        minAmount: '',
        maxAmount: '',
        showCode: false, //展示二维码
        index: null
      }
    },
    created() {
      this.loadData()
    },
    mounted() {
      console.log('退票', this.$store.state.globalConfig.isShowFlushRed, '打印发票二维码', this.$store.state.globalConfig.isShowInvoiceQrCode);
    },
    methods: {
      loadData() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          invoiceStatus: that.invoiceStatus,
          orderType: that.orderType,
          minAmount: that.minAmount,
          maxAmount: that.maxAmount
        };

        that.histroyData(params).then(res => {
          console.log(res);
          if (res.data.result) {
            that.titleView = true
            let arr = res.data.data || []
            arr.forEach(item => {
              item.isShowFlushRed = this.$store.state.globalConfig.isShowFlushRed
            })
            that.listData = arr
            console.log(this.listData);
          }
        });
      },
      reset() {
        this.typeList.forEach(function (item) {
          item.redData = false
        })
        this.statusList.forEach(function (item) {
          item.redData = false
        })
        this.invoiceStatus = ''
        this.orderType = ''
        this.minAmount = ''
        this.maxAmount = ''
      },
      sure() {
        this.loadData()
        this.sideFiltrateModalShow = false
        this.invoiceStatus = ''
        this.orderType = ''
        this.minAmount = ''
        this.maxAmount = ''
        this.statusList.forEach(function (item) {
          item.redData = false
        })
        this.typeList.forEach(function (item) {
          item.redData = false
        })
      },
      statusData(index) {
        this.statusList.forEach(function (item) {
          item.redData = false
        })
        index.redData = true
        this.invoiceStatus = index.stateNum
      },
      typeData(index) {
        this.typeList.forEach(function (item) {
          item.redData = false
        })
        index.redData = true
        this.orderType = index.orderNum
      },
      toDetail(index) {
        this.$router.push({
          path: '/historyDetail',
          query: {
            id: index.id,
            orderTypeName: index.orderTypeName
          }
        })
      },
      Printing(option) { //打印发票二维码
        if (option.invoicePdfAddr) {
          this.showCode = true
          this.$nextTick(() => {
            QRCode.toCanvas(document.getElementById('qrcode'), option.invoicePdfAddr)
          });
        } else {
          this.$Toast('二维码为空')
        }
      },
      reorder(data) {
        this.$http.post('/app/json/user_invoice_assistant/againInvoice', {id: data.id}).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$Toast('重新开票成功')
            this.loadData()
          } else {
            this.$Toast(data.info)
          }
        })
      },
      //判断某一时间是否在时间段内
      isDuringDate(startTime) {
        if (this.$store.state.globalConfig.invoiceRushRedLimitDays) {
          let day = parseInt(this.$store.state.globalConfig.invoiceRushRedLimitDays)
          let endDate = moment(new Date(startTime)).add(day, 'days').format('YYYY-MM-DD hh:mm:ss')
          let endTime = new Date(endDate).getTime()
          let nowTime = new Date().getTime()
          let subTime = endTime - nowTime
          console.log(startTime, endDate)
          if (subTime > 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }

      },
      refundInvoice(data) {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          orderId: data.orderId,
          transactionRecord: data.transactionRecord
        };
        console.log(this.$store.state.globalConfig.isEditInvoiceTitle)
        if (this.$store.state.globalConfig.isEditInvoiceTitle == 1) {
          let that = this;
          that.$router.push({
            name: 'taitou',
            params: {
              userInvoiceHeadId: data.userInvoiceHeadId || '',
              orderId: data.orderId || '',
              transactionRecord: data.transactionRecord,
              id: data.id || '',
              type: 1,
              fromPage: 'history'
            }
          });
          // this.userInvoiceHeadId = {
          //   userInvoiceHeadId:data.userInvoiceHeadId || '',
          //   orderId : data.orderId || '',
          //   transactionRecord : data.transactionRecord,
          //   id : data.id || ''
          // }
        } else {
          this.$Loading.open()
          that.refundData(params).then(res => {
            this.$Loading.close()
            if (res.data.result === 'success') {
              Toast.success('退票成功');
            } else {
              Toast(res.data.info)
            }
          });
        }
        // console.log(this.$store.state.globalConfig.invoiceRushRedLimitDays)
        // if (this.$store.state.globalConfig.invoiceRushRedLimitDays){
        //   let limitDay = this.$store.state.globalConfig.invoiceRushRedLimitDays
        //   let bool = this.isDuringDate(data.createTime,limitDay)
        //   console.log(bool)
        //   if (data.makeOutStatus == 1 && bool){
        //   }else {
        //     let str = `距开票时间${limitDay}天内的已开票状态发票，允许红冲`
        //     Toast(str)
        //     return
        //   }
        // }

      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .shareBox {
    float right;
    display: flex;
    margin-right 10px;
    justify-content: space-around;
    position relative;
    z-index 10

    span {
      font-size 22px;
    }
  }

  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }

  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    font-size 16px;
    padding 20px 0

    .div1 {
      width: 95%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 15px 0;

      span:nth-child(1) {
        flex 1
      }
    }
  }

  .box {
    margin-top 30px;

    .screen1 {
      display: flex;
      justify-content: start;
      padding: 0px 10px;
      height 40px;
      line-height 40px;

      .span {
        font-size 16px;
        margin-right 15px;
      }

      div {
        span {
          font-size 14px;
          margin 0 5px
          border: 1px solid #F80F16;
          border-radius: 12px;
          padding: 2px 5px;
          color: #f80f16
        }
      }
    }

    .screen2 {
      display block;

      div {
        input {
          font-size 14px;
          margin 0 5px
          border-radius: 14px;
          padding: 2px 5px;
          color #6a6a6a;
          border: 1px solid #6a6a6a;
          width: 110px;
          height: 30px;
          text-align: center;
          line-height: 30px;
        }

        span:nth-child(2) {
          border 0
          color #6a6a6a;
        }
      }
    }
  }

  .filtrate-modal-mask {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index 899
  }

  .filtrate-modal-wrapper {
    position: absolute;
    top: 0;
    left: 15%;
    width: 85%;
    bottom: 0;
    z-index: 900;
    transition: all 0.3s
    background: #fff

    .filtrate-container {
      width: 100%;
      height: 100%;
      padding 20px 15px;
    }

    .filtrate-btn {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 44px;
      display: flex;
      justify-content space-around
      font-size 16px;

      div {
        width 50%;
        text-align center
        height: 44px;
        line-height 44px
      }

      div:nth-child(2) {
        color white;
      }

      .btn {
        flex-shrink 0
        text-align: center;
        width 40%
        border-radius 30px;

        &.plain {
          color: #333;
        }

        &:after {
          border-radius 60px;
          border-color: #e5e5e5
        }
      }
    }
  }

  .filtrate-enter-active, .filtrate-leave-active {
    transition: all .3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0)
  }

  .filtrate-mask-enter-active, .filtrate-mask-leave-active {
    transition: all .3s;
  }

  .filtrate-mask-enter, .filtrate-mask-leave-to {
    opacity 0
  }

  .box .screen1 div .red {
    background #f80f16;
    color white;
  }

  /deep/ .nav-content {
    overflow-y auto !important
  }

  .reInvoice {
    float: right;
    padding: 6px 0.32rem;
    border-radius: 0.373333rem;
    font-size: 0.346667rem;
    background: #f00;
    margin: 0 5px;
    color: #fff;
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 220px;
    text-align center

    #qrcode {
      width: 200px !important;
      height: 200px !important
      margin-bottom 10px;
    }

    .van-icon {
      color white
      font-size 32px
    }
  }
</style>
