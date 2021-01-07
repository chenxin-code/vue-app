<template>
  <div id="addCard" v-show="isShowPage">
    <nav-top title="加油卡" @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="conter">
        <div class="box" v-if="cardlist.length">
          <div v-for="(item,index) in cardlist" :key="index" class="card-item">
            <div>
              <div class="item-bgcolor-red"></div>
              <div class="item-content">
                <div class="item-content-title">
                  <div class="table-view">
                    <div class="table-view-cell">
                      <van-collapse v-model="activeNames">
                        <van-collapse-item :name="index" :is-link="false">
                          <div slot="title" class="item-content-title-news">
                            <div style="display: flex;align-items: center;">
                              <img src="./bindCompanyCard/image/logo@2x.png" alt width="30"/>
                              <span>{{item.cardTypeName}}{{ item.cardtype != 11 ? `${item.ispricard == 1 ? '(主)' : '(副)'}` : ''}}</span>
                            </div>
                            <p>{{item.cardno|jiami}}</p>
                            <div @click="item.closeEye = !item.closeEye" style="text-align: right;">
                              <van-icon name="closed-eye" v-if="item.closeEye"/>
                              <van-icon name="eye-o" v-else/>
                            </div>
                          </div>

                          <div class="table-view content-show">
                            <div class="table-view-cell">
                              <div class="table-view-cell-text">
                                <div class="left">
                                  <img src="./bindCompanyCard/image/zje.png" alt width="30"/>
                                  总金额
                                </div>
                                <div class="right" v-if="item.closeEye">****</div>
                                <div class="right" v-else>{{item.totalbalance || 0}}元</div>
                              </div>
                            </div>
                            <div class="table-view-cell">
                              <div class="table-view-cell-text">
                                <div class="left">
                                  <img src="./bindCompanyCard/image/bfj.png" alt width="30"/>
                                  备付金(圈存)
                                </div>
                                <div class="right" v-if="item.closeEye">****</div>
                                <div class="right" v-else>{{item.prebalance || 0}}元</div>
                              </div>
                            </div>
                            <div class="table-view-cell">
                              <div class="table-view-cell-text">
                                <div class="left">
                                  <img src="./bindCompanyCard/image/kyye.png" alt width="30"/>
                                  可用余额
                                </div>
                                <div class="right" v-if="item.closeEye">****</div>
                                <div class="right" v-else>{{item.balance || 0}}元</div>
                              </div>
                            </div>
                          </div>
                        </van-collapse-item>
                      </van-collapse>
                    </div>
                  </div>
                </div>
                <div class="item-content-nav">
                  <div class="item-nav-left" v-if="item.cardtype != '11'">
                    <p @click="gotoadd('/recharge',item.cardno,index)"
                       v-if="item.ispricard == 1 && $store.state.webtype != '3' && $store.state.webtype != '4' && $store.state.webtype != '7' && isShowRecharge">
                      充值
                    </p>
                    <!-- <p @click="gotoadd('/recharge',item.cardno,index)" v-if="item.ispricard != 1">消费</p> -->
                    <p v-if="item.ispricard != 1">消费</p>
                    <p @click="gotoquery(1,item.cardno, item.cardTypeName)" v-if="item.ispricard == 1">充值查询
                    </p>
                    <p @click="gotoquery(2,item.cardno, item.cardTypeName)">消费查询</p>
                    <p v-if="companyOilCardintegral" @click="gotoadd('/oilMoney',item.cardno,index)">油卡积分</p>
                    <p v-if="companyoilCardICCard" @click="gotoadd('/ICcard',item.cardno,index)">对账单</p>
                  </div>
                  <div class="item-nav-right">
                    <p @click="modal(1,item)">解绑</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- 模态框 -->
          </div>
          <transition name="slide-fade">
            <div class="modal" v-show="ismodal">
              <div class="modal-box">
                <h2>温馨提示</h2>
                <p>是否解绑该加油卡？</p>
                <ul>
                  <li style="background:#fff;border-radius: 0 0 0 7px;" @click="modal(0)">取消</li>
                  <li style="color:#fff; border-radius: 0 0 7px 0;" @click="modal(2)">确定</li>
                </ul>
              </div>
            </div>
          </transition>
        </div>
        <div class="nocard-tip" v-else>
          <img src="./images/no-card.png" alt="">
          <p>暂未绑定加油卡，请添加加油卡</p>
        </div>
        <div class="tip" v-if="tip">温馨提示：{{tip}}</div>
        <div class="card-prompt" v-if="cardPrompt">
          <h3 class="title">温馨提示：</h3>
          <div class="content" v-html="cardPrompt"></div>
        </div>

        <div class="add-oilcard-btn" @click="showOilCardBtn = true">
          <p>绑定加油卡</p>
        </div>

        <van-popup v-model="showOilCardBtn" round position="bottom" :style="{ height: '30%' }">
          <div class="btn-list">
            <div class="title">卡类型选择：</div>
            <div class="btn-list-item" v-for="(item, index) in oilcardBtnList" :key="index" @click="bindCardTo(item)">
              <p class="btn-name">{{item.title}}</p>
              <van-icon name="add" size="22" color="red"/>
            </div>
          </div>
        </van-popup>

      </div>
    </nav-content>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui';
  import Cookie from 'js-cookie'

  export default {
    filters: { //监听加密卡号
      jiami(bankNumber) {
        return bankNumber.substr(0, 4) + "****" + bankNumber.substr(-4);
      }
    },
    data() {
      return {
        isshowimgtop: 'static/image/fuelcard/bnt_take-up.png',
        isshowimgbot: 'static/image/fuelcard/bnt_drop-down_red.png',
        isshow: 0,
        ismodal: false,
        cardlist: [],
        mycardno: '', // 解绑个人卡
        unbindUrl: '',
        showView: true,
        isShowPage: false, //页面优化
        // 单位卡
        activeNames: [],
        cardPrompt: '',
        unbindData: {},
        isShowRecharge: true,
        oilcardBtnList: [
          {
            dictKey: 'bind_oil_card',
            dictValue: '添加本人加油卡'
          }
        ],
        showOilCardBtn: false,
      }
    },
    computed: {
      // 解绑提示
      tip() {
        return this.$store.state.globalConfig.oilCardUnbindTip
      },
      // 是否开启个人卡新绑卡流程
      personalEnabled() {
        return this.$store.state.globalConfig.oilCardBindPersonalEnabled == 1
      },
      // 是否开启单位卡
      companyEnabled() {
        return this.$store.state.globalConfig.oilCardBindCompanyEnabled == 1
      },
      // 是否开启单位卡副卡
      companySubCardEnabled() {
        return this.$store.state.globalConfig.oilBindCompanySubCardEnabled == 1
      },
      // 是否开启绑定外省卡
      OtherProvincesCardEnabled() {
        return this.$store.state.globalConfig.oilBindOtherProvincesCardEnabled == 1
      },
      // 是否开启油卡积分
      companyOilCardintegral() {
        return this.$store.state.globalConfig.oilPayPointDisabled != 1
      },
      // 是否开启IC卡对账单
      companyoilCardICCard() {
        return this.$store.state.globalConfig.oilCardICCard == 1
      },
      // 是否开启卡车冀家绑卡
      procincialCard() {
        return this.$store.state.globalConfig.oilCardBindProvincialEnabled == 1
      },
      // 是否开启卡车冀家绑卡
      openFlodFace() {
        return this.$store.state.globalConfig.cardListOpenFlodFace == 1
      },
    },
    created() {
      this.render();
      // this.showagreement()

    },
    mounted() {
      console.log(this.$route)
      console.log(this.cardlist)
      let showRechargeBtn = Cookie.get('isShowRecharge')
      if (showRechargeBtn && showRechargeBtn == 0) {
        this.isShowRecharge = false
      }
      this.getbindOilCardBtn()
    },
    methods: {
      // 获取字典值
      getbindOilCardBtn() {
        let bindCardTypeList = [
          {
            title: '添加本人加油卡',
            key: 'bind_oil_card'
          }
          // , {
          //   title: '卡车冀家-外省卡',
          //   key: 'bind_provincial_card'
          // }
        ]
        if (this.procincialCard) {
          bindCardTypeList.push({
            title: '卡车冀家-外省卡',
            key: 'bind_provincial_card'
          })
        }
        if (this.companyEnabled) {
          bindCardTypeList.push({
            title: '添加单位加油卡',
            key: 'oil_card_bind_company_enabled'
          })
        }
        if (this.companySubCardEnabled) {
          bindCardTypeList.push({
            title: '添加加油卡(副卡)',
            key: 'oil_bind_company_subcard_enabled'
          })
        }
        if (this.OtherProvincesCardEnabled) {
          bindCardTypeList.push({
            title: '添加外省加油卡',
            key: 'oil_bind_other_provinces_card_enabled'
          })
        }
        this.$request.post('/app/json/app_dict/getDictByAlias', {alias: "oilcard_btn_name"}).then(res => {
          if (res.status == 0) {
            let dictAliasArr = []
            dictAliasArr = res.data || []
            bindCardTypeList.forEach(item => {
              dictAliasArr.forEach(itemson => {
                if (item.key == itemson.dictKey) {
                  item.title = itemson.dictValue
                }
              })
            })
            this.oilcardBtnList = [...bindCardTypeList]
          } else {
            this.$Toast(res.info);
          }
        });
      },
      bindCardTo(item) {
        console.log(item.key)
        switch (item.key) {
          case 'bind_oil_card' : // 添加本人加油卡
            this.gobindoilcard('/refuelingCard')
            break
          case 'bind_provincial_card' : // 卡车冀家-外省卡
            this.$router.push('/bind_provincial_card')
            // this.gobindoilcard('/bind_provincial_card')
            break
          case 'oil_card_bind_personal_enabled': // 添加本人加油卡新流程
            this.gobindoilcard('/bind-oil-card')
            break
          case 'oil_bind_company_subcard_enabled': // 添加加油卡-副卡
            this.gotoadd('/company-card', 1, 1, 'pricard1')
            break
          case 'oil_card_bind_company_enabled': // 添加单位加油卡
            this.gotoadd('/company-card', 1, 1)
            break
          case 'oil_bind_other_provinces_card_enabled': // 添加外省加油卡
            this.gotoadd('/company-card', 1, 1, 'otherProv')
            break
        }
      },
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', {values: 24}).then(res => {
          if (res.status == 0) {
            this.cardPrompt = res.data[0] ? res.data[0].content : ''
          }
        })
      },
      backEvent: function () {
        // this.$router.back()
        this.$router.go(-1)
      },
      // 去添加加油卡和油币查询
      gotoadd(url, usercard, indexs, status = '') {
        // 河北油惠包加油卡迁移-临时跳转至网厅-后期配置以后需要删除
        if (PROJECT == 'hbsy' && url == '/recharge') {
          let zhifudizhi = 'http://m.sinopecsales.com/webmobile/html/webhome.jsp'
          this.$bridgefunc.customPush({
            path: zhifudizhi,
            isnativetop: '1',
            superback: 1
          })
        } else {
          this.$router.push({
            path: url,
            query: {
              usercard: usercard,
              mindex: indexs,
              status: status
            }
          })
        }
      },
      // 跳转添加个人油卡
      gobindoilcard() {
        let url = '/refuelingCard'
        if (this.personalEnabled) {
          url = '/bind-oil-card'
        }
        this.$router.push({
          path: url,
          query: {
            isAddoilCard: true
          }
        })
      },
      //切换显示隐藏详情
      isswitch(index) {
        if (this.isshow === index) {
          this.isshow = ''
        } else {
          this.isshow = index
        }
      },
      // 充值，消费查询
      gotoquery(index, cardno, cardTypeName = '') {
        console.log(index, cardno)
        this.$router.push({
          path: '/chongquerys',
          query: {
            key: index,
            cardno: cardno,
            cardTypeName
          }
        })
      },
      // 模态框
      modal(index, item) {
        console.log(item)
        if (index === 1) {
          this.ismodal = true;
          this.mycardno = item.cardno;

          if (item.flag == 1) {
            this.unbindUrl = '/app/json/enterprise_card/unbindEnterpriseCard'
          } else {
            this.unbindUrl = '/app/json/card/unbindCard'
          }
          if (item.cardtype == 11) {
            this.unbindUrl = '/app/json/card/unBindOtherProvincesCard'
          }
          this.unbindData.cardno = this.mycardno
        }
        if (index === 0) {
          this.ismodal = false;
        }
        if (index === 2) {
          this.$Loading.open();
          let _this = this;
          this.$request.post(this.unbindUrl, this.unbindData).then(res => {
            _this.$Loading.close();
            if (res.status == 0) {
              Toast({
                message: '操作成功',
                iconClass: 'icon icon-success'
              });
              this.render();
            } else {
              this.$Toast(res.info)
            }
          })
          this.ismodal = false;
        }
      },
      render() {
        // this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/getCardInfoList';

        this.$http.post(url, {}).then(res => {
          // _this.$Loading.close();
          console.log(res);
          _this.isShowPage = true
          _this.cardlist = (res.data.data && res.data.data.cardAcctList) || [];

          // let arr = []
          // for (let i = 0; i < 10; i++) {
          //   arr.push({
          //     cardTypeName: '固定名称卡',
          //     cardtype: '01',
          //     ispricard: '1',
          //     cardno: '12345678987654321',
          //     totalbalance: 999,
          //     prebalance: 666,
          //     balance: 333
          //   })
          // }
          // _this.cardlist = [...arr]

          _this.cardlist.forEach((item, index) => {
            if (_this.openFlodFace) {
              this.$set(item, 'closeEye', false)
              _this.activeNames.push(index)
            } else {
              this.$set(item, 'closeEye', true)
            }

          })

        }).catch(error => {
          // _this.$toast(error)
        })
      },
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  #addCard {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .mint-header {
    margin-top: 26px;
  }

  /* 模态框 */
  .modal {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .modal-box {
    width: 270px;
    height: 150px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
    padding-top: 30px;
    text-align: center;
    color: #333;
    border-radius: 10px;
  }

  .modal-box h2 {
    font-weight: 600;
    font-size: 16px;
  }

  .modal-box p {
    line-height: 40px;
    margin-bottom: 10px;
  }

  .modal-box ul {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
  }

  .modal-box ul li {
    float: left;
    width: 50%;
    padding: 16px;
    background: #f02c2d;
    font-size: 16px;
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  /* 模态框 */
  .mint-header {
    background: #fff;
    color: #000;
    height: 50px;
    font-size: 20px;
  }

  .mintui-back {
    font-size: 28px;
  }

  /* .navcontent{
    line-height: 24px!important;
  } */
  .conter {
    padding: 0 10px;
  }

  .box {
    box-shadow: 0 2.5px 5px #eee;
    // padding: 0 6px;
  }

  .fl-right {
    float: right;
  }

  .info {
    border-bottom: 1px solid #ccc;
  }

  .mint-cell-wrapper {
    font-size: 12px;
  }

  .mint-cell-text {
    color: #333;
  }

  .Effect {
    display: flex;
    padding: 10px 0;
  }

  .Effect li {
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-right: 1px solid #e6e7e7;
    color: #333;
  }

  .Effect li:nth-last-of-type(1) {
    border-right: none;
  }

  .tip {
    color: red;
    padding: 10px;
  }

  .card-prompt {
    padding: 15px;

    .title {
      font-size: 14px;
      padding-bottom: 8px;
    }

    .content {
      font-size: 12px;
      line-height: 17px;
    }
  }
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';

  .nocard-tip {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    img {
      width: 300px;
    }

    p {
      font-size: 18px;
    }
  }

  .btn-list {
    padding: 15px;
    height: 100%;

    .title {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .btn-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ededed;

      &:last-child {
        border: none;
      }
    }

    p {
      line-height: 40px;
      font-size: 14px;
    }
  }

  .add-oilcard-btn {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: #fff;
    height: 60px;

    p {
      text-align: center;
      height: 40px;
      line-height: 40px;
      background: red;
      border-radius: 25px;
      position: absolute;
      left: 15px;
      right: 15px;
      font-size: 18px;
      color: #fff;
    }
  }

  .conter {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 60px;
    -webkit-overflow-scrolling: touch;
  }

  .box {
    margin-top: 10px;

    .card-item {
      // position: relative;
      margin-bottom: 15px;

      .item-bgcolor-red {
        background-color: #ff001a;
        height: 30px;
        border-radius: 10px;
        width: 100%;
        z-index: 1;
      }

      .item-content {
        box-shadow: 1px 3px 5px #f8f8f8;
        border-radius: 10px;
        z-index: 2;
        margin-top: -25px;

        .item-content-title {
          .table-view-cell {
            padding: 10px 0px;
          }

          .item-content-title-news {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .content-show {
            .left {
              display: flex;
              align-items: center;

              img {
                margin-right: 10px;
              }
            }

            .right {
              color: red;
            }
          }
        }

        .item-content-nav {
          // line-height: 50px;
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          overflow-x: scroll;
          overflow-y: hidden;
          white-space: nowrap;

          .item-nav-left {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex: 1;
          }

          .item-nav-right {
            text-align: center;
            width: 20%;
          }

          p {
            // width: 25%;
            position: relative;
            padding: 0 15px;
            text-align: center;
          }

          p:after {
            content: '';
            width: 0.026667rem;
            height: 0.533333rem;
            background: #ccc;
            display: inline-block;
            position: absolute;
            right: 0;
            top: 10px;
            margin-top: -13px;
          }

          p:last-child:after {
            width: 0;
          }
        }
      }
    }
  }

  /deep/ .van-cell__value {
    color red
  }
</style>


