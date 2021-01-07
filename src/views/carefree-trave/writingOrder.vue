<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="订单填写"></nav-top>
    <nav-content>
      <div class="div div1">
        <p>{{obj.title}}</p>
        <p>有效期范围：{{obj.startTime}}~{{obj.expireTime}}</p>
        <p>购票数：{{nums}}张</p>
        <p @click="show = true"><i class="icon iconfont mall-info"></i>支持有条件退款</p>
      </div>
      <div class="box">
        <div class="boxDiv">
          <p class="chu">出行人</p>
          <ul>
            <li v-for="(item,index) in peopleList" :key="index">
             <div class="chudiv" v-if="item.idNumber" @click="editChu(item)">
               <div>
                 <p>{{item.name}}</p>
                 <span>身份证号：{{item.idNumber}}</span>
                 <span>手机号：{{item.mobile}}</span>
               </div>
               <i class="icon iconfont mall-gengduojiantou"></i>
             </div>
              <div class="chudiv boxDiv1" v-else @click="editChu(item)">
                <div>点击新增出行人</div>
                <i class="icon iconfont mall-gengduojiantou"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="div div2">
        <p><span>联系人姓名</span><input type="text" v-model="contactName" placeholder="请输入联系人姓名"></p>
        <p><span>联系人手机号</span><input type="text" v-model="contactMobile" placeholder="请输入联系人手机号"></p>
<!--        <p><span>联系人身份证号</span><input type="text" v-model="contactIdNumber" placeholder="请输入联系人身份证号"></p>-->
      </div>
      <div class="div div3">
        <p>备注信息</p>
        <textarea name="" id="" cols="20" v-model="remark" rows="5" placeholder="请输入订单备注"></textarea>
      </div>
      <div class="div div4">
        <p>总额：<span class="span1">￥{{allMoney}}</span></p>
        <span class="span2" @click="commit">提交订单</span>
      </div>
    </nav-content>
    <van-action-sheet v-model="show" title="退票规则">
      <div class="cai">
        <p>说明</p>
        <p>按票数(张数)计算，手续费固定值*张数+票价*手续费比例*张数</p>
          <p>按订单数，手续费固定值*1+票价*手续费比例*1</p>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
  import api from './api'
  import store from "../../vuex/store";
  import {Toast} from 'vant'
  import { mapGetters } from "vuex";
  export default {
    name: "detail",
    mixins: [api],
    data() {
      return {
        show: false,
        obj: {},
        payment: '',
        timeFrame: '',
        contactName: '',
        contactMobile: '',
        contactIdNumber: '',
        remark: '',
        sku_market_price: '',
        allMoney: '',
        nums: '',
        lastPath: '',
        page: 0
      }
    },
    computed: {
      peopleList() {
        return store.state.peopleList
      }
    },
    mounted() {
      console.log(this.peopleList);
      this.nums = this.$route.query.nums
      this.allMoney = this.$route.query.allMoney
      this.sku_market_price = this.$route.query.sku_market_price
      this.loadData()
      if (this.peopleList.length<=0) {
        var arr = []
        for (var i = 0; i < Number(this.nums);i++) {
          arr.push({name: '', mobile: '', idNumber: '', index: i})
        }
        store.commit('putpeople', arr)
      }
      console.log(this.peopleList);
    },
    methods: {
      loadData() {
        let that = this
        that.page = that.page + 1
        let params = {
          token: this.$store.state.login.token,
          itemId: that.$route.query.itemId,
          pageThis: that.page,
          pageSize: 10,
          keyWord: ''
        };
        this.$Loading.open();

        that.ticketListData(params).then(res => {
          this.$Loading.close();
          if (res.data.result) {
            that.obj = res.data.data[0] || {}
          }
        });
      },
     editChu(item) {
       this.$router.push({
         path: '/carefree_trave/editPeople',
         query: {
           peopleData: item
         }
       })
     },
      commit() {
        let that = this
        that.timeFrame = (that.obj.start_time)+'~'+(that.obj.expire_time)
        let params = {
          token: that.$store.state.login.token,
          players: that.peopleList,
          name: that.obj.title,
          payment: that.allMoney,
          timeFrame: that.timeFrame,
          buyTicketsNumber: that.nums,
          contactName: that.contactName,
          contactMobile: that.contactMobile,
          remark: that.remark,
          refundTicketsNumber: '0', //退票数量
          unitPrice: that.$route.query.price ? that.$route.query.price : '', //单价
          id: that.$route.query.itemId,
          refundChanrgeType: that.obj.refund_chanrge_type,
          refundChanrge: that.obj.refund_chanrge,
          selfRefundScale: that.obj.self_refund_scale,
          selfRefundFixed: that.obj.self_refund_fixed,
          refundType: that.obj.refund_type,
          suppliers: that.obj.supplier_list,
          picUrl: that.obj.image,
          distributionPrice: that.$route.query.priceA ? that.$route.query.priceA:'', //分销价
          returnCash: that.$route.query.priceB ? that.$route.query.priceB: '', //返现
          marketValue: that.$route.query.price ? that.$route.query.price : '', //市场价
          guidancePrice: that.$route.query.priceC ? that.$route.query.priceC : '', //指导价
          smsContent: that.obj.sms_content
        }
        console.log(params);
        let throttle = true
        that.peopleList.forEach(function(item) {
          if (item.name == '') {
            throttle = false
          }
        })
        if (!throttle) {
          Toast({
            message: '请完善出行人信息',
            duration: 2000,
          });
          return;
        }
        if (!that.contactName) {
          Toast({
            message: '请输入出行人姓名',
            duration: 2000,
          });
          return;
        }
        // if (!(/(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(that.contactIdNumber))) {
        //   Toast({
        //     message: '请输入正确的身份证号',
        //     duration: 2000,
        //   });
        //   return;
        // }
        if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(that.contactMobile))) {
          Toast({
            message: '请输入正确的手机号',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open()

        that.placeorderData(params).then(res => {
          this.$Loading.close()
          if (res.data.result === 'success') {
            // that.$router.push({
            //   name: '收银台',
            //   params: {
            //     payInfo: {
            //       orderId: res.data.data.orderId,
            //       tradeNo: res.data.data.tradeNo,
            //       style: 'travel',
            //       payAmount: that.allMoney,
            //       orderType: '200104'
            //     },
            //     occurOuCode: res.data.data.occurOuCode
            //   }
            // })
            that.$router.push({
              path: '/mall2/checkstand',
              query: {
                payInfo: JSON.stringify({
                  orderId: res.data.data.orderId,
                  tradeNo: res.data.data.tradeNo,
                  style: 'travel',
                  payAmount: that.allMoney,
                  orderType: '200104'
                }),
                occurOuCode: res.data.data.occurOuCode
              }
            })
          } else {
            this.$toast(res.data.info)
          }
        })
      },
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;

    .div {
      background white;
      padding 16px 20px;
      margin-top 15px;
    }

    .box {
      padding 20px;
      background white;
      margin: 15px 0;
      font-size 14px;

      .div1 {
        display flex;
        justify-content space-between

        span {
          font-size 14px;
          margin auto 0
        }

        .state {
          width 75px;
          text-align: right;
        }

        div {
          display flex;
          justify-content space-between

          img {
            width 24px;
            height 24px;
            margin auto
            margin-right 5px;
          }

          span {
            font-size 16px;
            margin auto
            line-height 22px;
          }
        }
      }

      .div2 {
        display flex;
        justify-content start

        img {
          width: 110px;
          height: 110px;
          border-radius: 6px;
          margin-right: 15px;
        }

        div {
          display flex;
          flex-direction column
          font-size 14px;

          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 10px;
          }
        }
      }

      .boxDiv {
        display: flex;
        justify-content: start;
        .chu {
          width 70px;
        }
        p {
          width 70px;
          font-size 16px;
          margin auto 0
        }

        ul {
          flex 1
          display: flex;
          flex-direction: column;
          li {
            margin: auto 0;
            padding: 12px 0;
            .chudiv {
              display flex
              justify-content space-between
              div {
                display: flex;
                flex-direction: column;
                p {
                  margin-bottom 8px
                  font-size 14px;
                }

                span:nth-child(2) {
                  margin-bottom 8px;
                }

                span {
                  color #656464
                }
              }
            }
            .boxDiv1 {
              ul {
                li {
                  margin-bottom: 0px;
                  div {
                    width: 100%;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
      }

      .allDiv {
        text-align: right;
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
      }
    }

    .div1 {
      p {
        margin-bottom 8px;
        color: #7c7c7c;

        .iconfont {
          vertical-align middle
          margin-right 4px;
        }
      }

      p:nth-child(1) {
        font-size: 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: black;
      }
    }

    .div2 {
      span {
        width: 130px;
        display: inline-block;
        font-size 16px;
      }
      p {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
      }
      p:nth-child(1) {
        margin-bottom: 20px
      }
      input {
        font-size 15px;
      }
    }

    .div3 {
      p {
        font-size 16px;
        margin-bottom 8px;
      }

      textarea {
        display: block;
        width: 100%;
        background: #efefef;
        border: 0;
        border-radius: 8px;
        line-height: 18px;
        padding 10px
      }
    }

    .div4 {
      position: fixed;
      display: flex;
      justify-content: space-between;
      margin-bottom 0
      bottom: 0;
      width: 100%;
      left: 0;
      p {
        font-size 16px
        margin auto 0

        .span1 {
          font-size 18px;
          font-weight 600
        }
      }

      .span2 {
        background: #deb98c;
        color: #fff;
        padding: 0 40px;
        height: 45px;
        line-height: 45px;
        font-size: 18px;
        border-radius: 6px;
      }
    }
  }
  .cai {
    padding: 15px 20px;
    background: #efefef;
    margin: 0px;
    border-radius: 6px;
    font-size 14px;
    p:nth-child(1) {
      font-size 18px
    }
    p:nth-child(2) {
      font-size: 14px;
      margin-top: 10px;
      line-height 20px;
      margin-bottom 10px;
    }
    p :nth-child(3) {
      font-size: 14px;
    }
  }
  /deep/ .iconfont {
    margin auto 0 !important
  }
  /deep/ .nav-content {
    overflow-y auto !important
    margin-bottom 70px;
  }
</style>
