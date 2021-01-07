/**Created by liaoyingchao on 2018/11/16.*/

<template>
  <div class="invoice mall2" v-if="visible">
    <pop-view pageType="fullpage" v-if="visible" @closeEvent="visible = false">
      <div class="pop-body">
        <div class="pop-title">
          <span>发票</span>
          <span class="font-small theme_font_tint"
                style="position: absolute; padding: 10px 0; margin-top: -10px; right: 40px;"
                @click.stop="clickAgreement">发票须知</span>
        </div>
        <div class="pop-scroll-div">
          <div class="padding-con">
            <div class="subtitle ">发票类型</div>
            <div class="type-name theme_bg_white_ef subtitle theme_font_gray theme_border_light"
                 v-for="(type,idx) in receipttype"
                 :class="{'border-con  theme_font_red theme_bg_light_red theme_border_red_i':selectedreceip==idx}"
                 @click="chooseReceiptType(idx)">{{type.title}}
            </div>
            <div class="theme_font_gray subtitle margin-con ">
              {{selectedreceip==0?'发票内容将显示详细商品名称与价格':'我司依法开具发票，请您按照税法规定使用发票'}}
            </div>
          </div>
          <div class="padding-con" v-if="selectedreceip==0">
            <div class="subtitle ">发票抬头</div>
            <div class="type-name theme_bg_white_ef subtitle theme_font_gray theme_border_light"
                 v-for="(head,index) in headtype" style="width: 100px"
                 :class="{'border-con  theme_font_red theme_bg_light_red theme_border_red_i':selectedhead==index}"
                 @click="chooseHeadType(index)">{{head.title}}
            </div>
            <div class="input-con" v-if="selectedhead==1">
              <div class="input-cell">
                <input class="input-info theme_bg_white_ef subtitle" placeholder="请填写单位名称" v-model="company"
                       @input="changeEvent"/>
                <div class="title-list" v-if="invoiceListShow">
                  <div class="item" v-for="item in invoiceList" v-if="item.titleType == '5'" @click="selectHisInvoice(item)">
                    <p>{{item.title}}</p>
                    <p class="theme_font_gray font-small">{{item.orgTaxNo}}</p>
                  </div>
                </div>
              </div>
              <div class="input-cell">
                <input class="input-info theme_bg_white_ef subtitle" placeholder="请在此填写纳税人识别号"
                       v-model="identifyNumber"/>
              </div>
            </div>
          </div>
          <div class="padding-con">
            <div class="subtitle">收票人信息</div>
            <div class="checktaker" v-if="selectedhead==1">
              <p class="left-info content-font theme_font_common">收票人姓名:</p>
              <input type="text" placeholder="请填写收票人姓名(必填)" v-model="name"/>
            </div>
            <div class="checktaker">
              <p class="left-info content-font theme_font_common">收票人手机:</p>
              <!--<van-field-->
              <!--v-model="phone"-->
              <!--type="tel"-->
              <!--placeholder="请输入手机号码"-->
              <!--maxlength="11"-->
              <!--autosize-->
              <!--onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'-->
              <!--pattern="[0-9]*"-->
              <!--@input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"-->
              <!--/>-->
              <input type="text" placeholder="请填写收票人手机号码(必填)" v-model="phone"/>
            </div>
            <div class="checktaker" v-if="selectedreceip==1" @click="selectRegion">
              <p class="left-info content-font theme_font_common">所在地区:</p>
              <input disabled="disabled" type="text" placeholder="请选择地区" v-model="region"/>
              <i class="iconfont mall-gengduo theme_font_common"></i>
            </div>
            <div class="checktaker" v-if="selectedreceip==1">
              <p class="left-info content-font theme_font_common">详细地址:</p>
              <input type="text" placeholder="请填写详细地址" v-model="address"/>
            </div>
            <div class="checktaker" v-if="selectedreceip==0">
              <p class="left-info content-font theme_font_common">收票人邮箱:</p>
              <input type="text" placeholder="用来接收电子发票邮箱，可选填" v-model="email"/>
            </div>
            <div class="checktaker" v-if="selectedreceip==0">
              <p class="left-info content-font theme_font_common">发票内容:</p>
              <span class="tip-con theme_font_gray">发票内容选填已根据税法调整，具体以展示为准</span>
            </div>
          </div>
          <div class="padding-con no-top" v-if="selectedreceip==0">
            <div class="type-name theme_bg_white_ef subtitle theme_font_gray theme_border_light"
                 v-for="(goods,ind) in goodsType"
                 :class="{'border-con  theme_font_red theme_bg_light_red theme_border_red_i':selectedGoodsType==ind}"
                 @click="choosegoodsType(ind)">{{goods.title}}
            </div>
            <div class="theme_font_gray subtitle margin-con ">发票内容将显示详细商品名称与价格</div>
          </div>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent">确定</div>
        <div class="agreement" v-if="agreementShow" @click.stop="agreementShow = false">
          <div class="cont" @click.stop="">
            <div class="arg-title">{{agreementTitle}}</div>
            <div class="html" v-html="agreementContent"></div>
            <div class="arg-btn theme_font_red" @click.stop="agreementShow = false">知道了</div>
          </div>
        </div>
      </div>
      <!--<div class="title">-->
      <!--<div class="bigtitle">发票</div>-->
      <!--<div class="tiptitle theme_font_gray">发票须知</div>-->
      <!--</div>-->
      <!--<div class="scorll-content" >-->

      <!--</div>-->
    </pop-view>
  </div>
</template>

<script>
  import http from "../../../../utils/http"
  // import market from "../../../utils/market"
  import store from '../../../../vuex/store'

  export default {
    name: "invoice",
    components: {},
    data() {
      return {
        initData: {
          company: {},
          current: "personal",
          personal: {},
          phone: '',
          email: '',
        },
        visible: false,
        selectedInvoice: null,
        invoiceInformation: null,
        selectedreceip: 0,
        receipttype: [{
          title: '电子普通发票',
        }, {
          title: '增值税专用发票',
        }],

        headtype: [{
          title: '个人',
        },
          {
            title: '单位',
          }],
        selectedhead: 0,
        goodsType: [{
          title: '商品明细',
        },
          {
            title: '商品类别',
          }],
        selectedGoodsType: 0,
        company: '',
        identifyNumber: '',
        name: '',
        phone: '',
        email: '',
        region: '',
        address: '',
        agreementContent: '',
        agreementShow: false,
        agreementTitle: '',
        invoiceList: [],
        invoiceListShow: false
      }
    },
    methods: {
      selectHisInvoice: function (item) {
        this.invoiceListShow = false
        this.phone = item.userPhone
        this.email = item.userEmail
        this.identifyNumber = item.orgTaxNo
        this.company = item.title
        this.name = item.userName
      },
      changeEvent: function () {
        this.invoiceListShow = true
        let url = '/app/json/user_invoice_assistant/searchInvoiceList';
        let paramsData = {
          token: store.state.login.token,
          title: this.company
        };
        http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == '0') {
              this.invoiceList = data.data
            }
          },
          error => {

          }
        );
      },
      getAgreement: function () {
        let url = '/app/json/news/getList';
        let paramsData = {
          token: store.state.login.token,
          value: 9
        };
        http.post(url, paramsData).then(
          res => {
            let data = res.data;
            let arr = data.data;
            if (arr && arr != '') {
              let item = arr[0];
              this.agreementTitle = item.title;
              this.agreementContent = item.content;
              this.agreementShow = true
            } else {
              this.$Toast('暂时没有配置发票须知内容！')
            }
          },
          error => {
            this.$Toast('请求数据失败，请稍后尝试！')
          }
        );
      },
      clickAgreement: function () {
        this.getAgreement()
        // if (this.invoiceInformation) {
        //   this.invoiceInformation();
        // }
        // Router.push({
        //   path: '/usercenter/agreement',
        //   query:{
        //     value:9
        //   }
        // })
      },
      popSureEvent: function () {
        let invoiceData = {
          company: this.company,
          identifyNumber: this.identifyNumber,
          name: this.name,
          phone: this.phone,
          email: this.email,
          type: this.selectedhead,
          selectedGoodsType: this.selectedGoodsType
        }
        this.selectedInvoice(invoiceData);
      },
      chooseReceiptType: function (idx) {
        if (idx != 0) {
          this.$Toast("暂未支持！")
          return;
        }
        this.selectedreceip = idx
      },
      chooseHeadType: function (idx) {
        this.selectedhead = idx
        this.reSetData()
      },
      choosegoodsType: function (idx) {
        this.selectedGoodsType = idx
      },
      selectRegion: function () {//选择地区

      },
      reSetData: function () {
        if (this.selectedhead == 0) {
          // this.name = this.initData.personal.userName
          this.phone = this.initData.personal.userPhone
          this.email = this.initData.personal.userEmail
        } else {
          this.phone = this.initData.company.userPhone
          this.email = this.initData.company.userEmail
          this.identifyNumber = this.initData.company.orgTaxNo
          this.company = this.initData.company.title
          this.name = this.initData.personal.userName
        }
        if (this.phone == '') {
          this.phone = this.initData.phone
        }
        if (this.email == '') {
          this.email = this.initData.email
        }
        if (this.name == '') {
          this.name = this.initData.name
        }
      }
    },
    mounted() {
      // company: {},
      // current: "personal",
      //   personal: {}
      if (this.initData.current == 'personal') {
        this.selectedhead = 0
      } else {
        this.selectedhead = 1
      }
      this.reSetData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .invoice {
    width 100%
    height 100%
    overflow hidden

    .title {
      display flex
      padding 15px 34px 15px 10px

      .bigtitle {
        flex 1
        font-size $font-size-medium-x
      }

      .tiptitle {
        font-size $font-size-small-s
      }
    }

    .scorll-content {
      /*position absolute
      top 100px;
      right 0px;
      left 0px;
      bottom 100px;
      padding 0px 20px 20px 20px
      overflow-y scroll
      -webkit-overflow-scrolling touch*/

    }

    .type-name {
      text-align center
      display inline-block
      padding 8px 10px
      margin-top 8px
      margin-right 10px
      /*margin-bottom 20px*/
      border-radius: 15px;
      font-size $font-size-medium
      border-width 1px
      border-style solid
    }

    .input-con {
      margin-top 5px;

      .input-cell {
        display flex
        align-items center
        height 40px
        width 100%
        padding 5px 0px
        position relative;
        /*background-color magenta*/

        .input-info {
          height 100%
          width 100%
          padding 0 10px
          border-radius: 15px;
          -webkit-border-radius: 15px;
          font-size font-size $font-size-medium-s
        }

        .title-list {
          position absolute;
          top 40px;
          left 0px;
          right 0px;
          max-height 200px;
          overflow-x hidden
          overflow-y auto;
          background-color white;
          z-index 10;
          box-shadow 0 1px 8px #efefef;

          .item {
            padding 10px 8px;
            font-size 14px;

            p {
              padding 2px 0;
            }
          }

          .item:nth-child(n+2) {
            border-top 0.6px solid #ddd;
          }
        }
      }

    }

    .checktaker {
      display flex
      align-items center
      margin-top 8px

      .left-info {
        width 75px;
        font-size $font-size-medium-s
      }

      input {
        padding 5px;
        flex 1
        font-size 14px;
        /*margin-left 15px*/
      }

      .right-con {
        flex 1
        margin-left 15px
      }

      i {
        font-size $font-size-medium
      }

    }

    .tip-con {
      padding 5px;
      font-size $font-size-small
    }

    /*.bottom-btn {
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      height 100px;
      display flex
      align-items center
      text-align: center;
      p {
        width 100%
        color: white;
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }*/

    .padding-con {
      padding 8px;

      &.no-top {
        padding-top 0px;
      }
    }

    .subtitle {
      font-size $font-size-medium-s
    }

    .margin-con {
      margin-top 10px
    }

    .agreement {
      position absolute;
      left 0;
      right 0;
      top 0;
      bottom 0;
      background-color rgba(0, 0, 0, 0.5)

      .cont {
        position absolute;
        top 50%;
        left 50%;
        margin-top -200px;
        margin-left -160px;
        background-color white;
        height 400px;
        width 320px;
        border-radius 15px;

        .arg-title {
          margin-top 5px;
          padding 0px 20px;
          line-height 40px;
          font-size 18px;
          font-weight 500;
          text-align center;
        }

        .html {
          margin 0 20px;
          overflow-y auto;
          -webkit-overflow-scrolling touch;
          height 310px;
        }

        .arg-btn {
          border-top 0.5px solid #ddd;
          font-size 16px;
          text-align center;
          padding 15px;
        }
      }
    }
  }
</style>
