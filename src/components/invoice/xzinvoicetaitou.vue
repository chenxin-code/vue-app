<template>
  <div class="xzinvoicetaitou">
    <div class="hint-style">抬头类型</div>
    <div class="title-type" v-show="invoiceTitle.islogo==1">
      <img class="type-style" src="../../../static/image/invoice/qiye_checked.png" @click="qiyeClick(false)"/>
      <img class="type-style" src="../../../static/image/invoice/geren_normal.png" @click="gerenClick(true)"/>
    </div>
    <div class="title-type" v-show="invoiceTitle.islogo==2">
      <img class="type-style" src="../../../static/image/invoice/qiye_normal.png" @click="qiyeClick(true)"/>
      <img class="type-style" src="../../../static/image/invoice/geren_checked.png" @click="gerenClick(false)"/>
    </div>
    <div class="hint-style">
      <span class="hint1">*</span>
      <span>抬头名称</span>
    </div>
    <input placeholder="请输入抬头名称" v-model="invoiceTitle.invoicetitle"/>
    <div v-show="invoiceTitle.islogo==1">
      <div class="hint-style">
        <span class="hint1">*</span>
        <span>税号</span>
      </div>
      <input placeholder="请输入纳税人识别号" v-model="invoiceTitle.taxcode"/>

      <div class="hint-style">
        <span>地址</span>
      </div>
      <input placeholder="请输入地址" v-model="invoiceTitle.addressTax"/>
    </div>

    <div class="hint-style">
      <span>电话</span>
    </div>
    <input placeholder="请输入电话号码" v-model="invoiceTitle.telephone"/>

    <div v-show="invoiceTitle.islogo==1">
      <div class="hint-style">
        <span>开户银行</span>
      </div>
      <input placeholder="请输入开户银行" v-model="invoiceTitle.openingbank"/>

      <div class="hint-style">
        <span>银行账号</span>
      </div>
      <input placeholder="请输入银行账号" v-model="invoiceTitle.businesscard"/>
    </div>
    <div class="save-btn" @click="saveInvoice">保存</div>
  </div>
</template>

<script>
  import Qiye from './qiye'
  import Geren from './geren'
  import {Toast} from 'mint-ui'

  export default {
    name: "xzinvoicetaitou",
    components: {
      Qiye,
      Geren,
      Toast
    },
    data() {
      return {
        invoiceTitle: {
          addressTax: "",
          address_tax: "",
          bankaccount: "",
          businesscard: "",
          id: "",
          invoicetitle: "",
          islogo: 1,
          openingbank: "",
          qrCode: "",
          taxcode: "",
          telephone: "",
          userid: "",
        },
        tabs: [
          {name: '企业', id: 1},
          {name: '个人', id: 2}
        ],
      }
    },
    methods: {
      qiyeClick: function (check) {
        if (check) {
          this.invoiceTitle.islogo = 1;
        }
      },
      gerenClick: function (check) {
        if (check) {
          this.invoiceTitle.islogo = 2;
        }
      },
      saveInvoice: function () {
        if (!this.invoiceTitle.invoicetitle) {
          Toast({
            message: '请输入抬头名称！',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.invoiceTitle.islogo == 1) {
          if (!this.invoiceTitle.taxcode) {
            Toast({
              message: '请输入纳税人识别号！',
              position: 'bottom',
              duration: 2000,
            });
            return;
          }
        }
        this.$Loading.open('请求中')
        let url = 'app/json/invoice/saveInvoiceTitle';
        let token = this.$store.state.login.token;
        let params1 = {
          token: token,
          userid: this.$store.state.login.userid,
          invoicetitle: this.invoiceTitle.invoicetitle,
          taxcode: this.invoiceTitle.taxcode,
          addressTax: this.invoiceTitle.addressTax,
          telephone: this.invoiceTitle.telephone,
          openingbank: this.invoiceTitle.openingbank,
          bankaccount: this.invoiceTitle.bankaccount,
          islogo: this.invoiceTitle.islogo,
          businesscard: this.invoiceTitle.businesscard,
          id: this.invoiceTitle.id,
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            Toast({
              message: data.info ? data.info : '保存成功！',
              position: 'bottom',
              duration: 2000,
            });
            if (_this.invoiceTitle.id == null) {
              this.$bridgefunc.customGo(-1);
            } else {
              this.$bridgefunc.customGo(-2);
            }

          } else {
            Toast({
              message: data.info ? data.info : '保存失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('保存失败', error)
          Toast({
            message: '保存失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
      selectedFun: function (index) {
        this.invoiceTitle.islogo = index + 1;
      },
      backEvent: function () {
        this.$bridgefunc.customGo(-1)
      },
    },
    created() {
      console.log(this.$route.query.invoiceTitle);
      if (this.$route.query.invoiceTitle != null) {
        this.invoiceTitle = JSON.parse(decodeURIComponent(this.$route.query.invoiceTitle));
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .xzinvoicetaitou {
    min-height 100%
    position relative
    background-color: $color-background-lll;
    padding 10px
    .hint-style {
      margin-top 5px
      .hint1 {
        color: $color-theme-r
      }
    }
    .title-type {
      overflow hidden
      display flex

      .type-style {
        height 45px
        margin-right 15px
      }
    }

    input {
      border-radius 5px
      border 1px solid $color-line-gray-l
      padding 15px 10px
      width 100%
      font-size $font-size-medium
    }
    .save-btn {
      position: relative;
      background: #fe6902;
      height: 40px;
      line-height: 40px;
      margin 10px 0px
      border-radius 20px
      border: 1px solid #fe6902;
      font-size: $font-size-medium-x;
      text-align: center;

      .btn {
        height: 40px;
        line-height: 40px;
        border-color: #fe6902;
        color: #fff;
        font-weight: 600;
      }
    }
  }
</style>
