/**Created by 黄金辉 on 2018/10/12.*/

<template>
  <div class="qiye">
    <li class="infoItem">
      <span class="itemLeft">抬头名称</span>
      <div class="item-right">
        <input type="text" class="editText" placeholder="请输入抬头名称" v-model="invoiceTitle.invoicetitle">
      </div>
    </li>
    <li class="infoItem">
      <span class="itemLeft">税号</span>
      <div class="item-right">
        <input type="text" class="editText" placeholder="请输入纳税人识别号" v-model="invoiceTitle.taxcode">
      </div>
    </li>
    <li class="infoItem">
      <span class="itemLeft">地址</span>
      <div class="item-right">
        <input type="text" class="editText" placeholder="请输入地址" v-model="invoiceTitle.addressTax">
      </div>
    </li>
    <li class="infoItem">
      <span class="itemLeft">电话</span>
      <div class="item-right">
        <input type="text" class="editText" placeholder="请输入电话号码" v-model="invoiceTitle.telephone">
      </div>
    </li>
    <li class="infoItem">
      <span class="itemLeft">开户银行</span>
      <div class="item-right">
        <input type="text" class="editText" placeholder="请输入开户银行" v-model="invoiceTitle.openingbank">
      </div>
    </li>
    <li class="infoItem">
      <span class="itemLeft">银行账号</span>
      <div class="item-right">
        <input type="text" class="editText" placeholder="请输入银行账号" v-model="invoiceTitle.bankaccount">
      </div>
    </li>
  </div>
</template>

<script>

  export default {
    props: ['invoiceTitle'],
    name: "qiye",
    components: {},
    data() {
      return {}
    },
    methods: {},
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .qiye {
    width 100%
    height 100%
    overflow hidden
    .infoItem {
      padding 0px 3%;
      border-bottom: 1px solid $color-line-gray-l;
      overflow: hidden;
      height: 50px;
      .itemLeft {
        float: left;
        min-width 70px;
        height: 50px;
        line-height: 50px;
        font-size: $font-size-medium;
      }
      .item-right {
        overflow hidden;
        height 100%;
      }
      .editText {
        float: left;
        margin-left: 3%;
        height: 50px;
        line-height: 50px;
        padding: 5px 3%;
        font-size: $font-size-medium;
        width: 100%;
      }
    }
  }
</style>
