<template>
  <div class="body">
    <nav-top :title="$route.query.bankMessage.title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <p class="box">银行信息</p>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_VIPNumber.png" alt/>
                <span>用户姓名</span>
              </div>
              <div class="center">
                <input type="text" v-model="custName"/>
              </div>
            </div>
          </div>
          <!-- <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_lei.png" alt="">
                <span>证件类型</span>
              </div>
              <div class="center"><input  placeholder="公民身份证" type="text"></div>
            </div>
          </div>-->
          <div class="table-view-cell" @click="cardpays('1')">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_lei.png" alt/>
                <span>证件类型</span>
              </div>
              <div class="center right1">
                <mt-field v-model="custCertName" :disabled="disabled"></mt-field>
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
                <input placeholder="请输入证件号码" type="text" v-model="idcardNum"/>
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
                <mt-field v-model="cardStyle" :disabled="disabled"></mt-field>
              </div>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <div class="table-view-cell" v-if="cardStyle == '贷记卡'">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_ka.png" alt/>
                <span>贷记卡CVV2</span>
              </div>
              <div class="center">
                <input placeholder="请输入贷记卡CVV2" type="text" v-model="cvn2"/>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="cardStyle == '贷记卡'">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_ka.png" alt/>
                <span>贷记卡到期日</span>
              </div>
              <div class="center">
                <input placeholder="格式：0719,代表2019年7月" type="text" v-model="expired"/>
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
                <input type="text" v-model="cardNo"/>
              </div>
            </div>
          </div>
          <div class="btns">
            <div class="div2" @click="nextIndex">下一步</div>
          </div>
        </div>
      </div>
    </nav-content>
    <van-action-sheet v-model="show2" :actions="actions2" @select="onSelect2"/>
    <van-action-sheet v-if="$route.query.bankMessage.types == 1" v-model="showCertificates" :actions="actions"
                      @select="onSelect"/>
    <van-action-sheet v-if="$route.query.bankMessage.types == 2" v-model="showCertificates" :actions="action"
                      @select="onSelect"/>
  </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import api from "./api";

    export default {
        name: "",
        mixins: [api],
        data() {
            return {
                disabled: true,
                cvn2: "",
                expired: "",
                waySub: "",
                idcardNum: "",
                cardStyle: "",
                cardType: "",
                custCertName: '',
                custCertType: "", //证件类型，1、身份证，3、港澳台居民通行证，19、外国护照，20、外国公民其他证件
                actions: [ //平安的卡类型
                    {name: "身份证", id: "1"},
                    {name: "港澳台居民通行证", id: "3"},
                    {name: "外国护照", id: "19"},
                    {name: "外国公民其他证件", id: "20"}
                ],
                action: [ //农行的卡类型
                    {name: "身份证", id: "I"}
                ],
                showCertificates: false,
                custName: "",
                cardNo: "",
                show2: false, //农行的卡类型
                actions2: [
                    {name: "借记卡", id: "1"},
                    {name: "贷记卡", id: "3"},
                    {name: "合并卡", id: "A"}
                ], //农行的卡类型
                id: "",
            };
        },
        computed: {
            ...mapGetters(["userInfo"])
        },
        mounted() {
            this.custName = this.$route.query.bankMessage.custName
        },
        methods: {
            cardpays(data) {
                if (data == '1') {
                    this.showCertificates = true;
                } else {
                    this.show2 = true;
                }
            },
            onSelect2(item) {
                this.show2 = false;
                this.cardStyle = item.name;
                this.cardType = item.id;
            },
            onSelect(item) {
                console.log(item)
                this.showCertificates = false;
                this.custCertName = item.name
                this.custCertType = item.id;
            },
            nextIndex() {
                let that = this;
                if (!that.custName) {
                    that.$Toast("请输入用户姓名");
                    return;
                }
                if (!that.idcardNum) {
                    that.$Toast("请输入证件号");
                    return;
                }
                if (!that.cardNo) {
                    that.$Toast("请输入银行卡");
                    return;
                }
                let params = that.$route.query.bankMessage;
                params.token = this.$store.state.login.token;
                if (that.cardStyle == "贷记卡") {
                    params.cvn2 = that.cvn2;
                    params.expired = that.expired;
                }
                params.idCardNo = that.idcardNum;
                params.custName = that.custName; //用户姓名
                params.cardNo = that.cardNo; //银行卡号
                params.cardType = that.cardType; //签约卡类型
                params.custCertType = that.custCertType; //证件类型
                params.phone = this.userInfo.phone
                this.$Loading.open();
                that.nextData(params).then(res => {
                    console.log(res);
                    this.$Loading.close();
                    if (res.data.result == "success") {
                      let data = res.data.data
                      if (data.hasOwnProperty('successUrl')) {
                        if (res.data.data.successUrl) {
                          //  加判断，返回的successUrl有值，直接跳转签约成功页面
                          that.$bridgefunc.customPush({
                            path: res.data.data.successUrl,
                            isnativetop: "1",
                            superback: 1
                          });
                        } else {
                          params.tradeNo = res.data.data.contractCode;
                          // params.payModelSub = that.modelObj.payModelSub;
                          params.signId = res.data.data.signId;
                          params.cardStyle = that.cardStyle;
                          params.idcardNum = that.idcardNum
                          params.custName = that.custName; //用户姓名
                          params.custCertType = that.custCertType; //证件类型
                          that.$router.push({
                            path: "/jane/nextMessage",
                            query: {
                              dataParams: params
                            }
                          });
                        }
                      } else {
                        params.tradeNo = res.data.data.contractCode;
                        // params.payModelSub = that.modelObj.payModelSub;
                        params.signId = res.data.data.signId;
                        params.cardStyle = that.cardStyle;
                        params.idcardNum = that.idcardNum
                        params.custName = that.custName; //用户姓名
                        params.custCertType = that.custCertType; //证件类型
                        that.$router.push({
                          path: "/jane/nextMessage",
                          query: {
                            dataParams: params
                          }
                        });
                      }
                    } else {
                        that.$Toast(res.data.info);
                    }
                });
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
