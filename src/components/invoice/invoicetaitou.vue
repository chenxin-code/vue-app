<template>
  <div class="invoicetaitou">
    <!--<nav-top @backEvent="backEvent">-->
    <!--</nav-top>-->
    <ul class="addressInfo" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <ul class="tabs-list">
        <li class="tabs-item " v-for="(item,index) in tabs" :class="{selected:selected == index}"
            @click="selectedFun(index)">
          <span class="name">{{item.name}}</span>
          <i></i>
        </li>
      </ul>
      <div class="content">
        <OrderDoing ref="invoice" v-if="selected == 0"></OrderDoing>
        <OrderComplete ref="invoice" v-else="selected == 1"></OrderComplete>
      </div>
    </ul>
    <div class="btns">
      <span class="btn" @click="addInvoiceTitle">新增发票抬头</span>
    </div>
  </div>
</template>

<script>
  import OrderDoing from './order-doing'
  import OrderComplete from './order-complete'

  export default {
    name: "invoicetaitou",
    components: {
      OrderDoing,
      OrderComplete
    },
    data() {
      return {
        tabs: [
          {name: '发票抬头', id: 0},
          {name: '我的发票', id: 1}
        ],
        selected: 0,

      }
    },
    methods: {
      addInvoiceTitle: function () {
        this.$bridgefunc.customPush({
          path:'/xzinvoicetaitou',
          isnativetop:'1',
          query:{
          }
        })
      },
      selectedFun: function (index) {
        this.selected = index
      },
      backEvent: function () {
        this.$bridgefunc.customGo(-1)
      },
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .invoicetaitou {
    position relative width 100%;
    height 100%;
    background-color: #fff;

    .addressInfo {
      position absolute left 0px;
      right 0px;
      bottom 60px;
      overflow-y scroll -webkit-overflow-scrolling touch;

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

          .but {
            width: 100px;
            height: 40px;
            margin-top: 5px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px
          }

          .but:hover {
            color orange;
            border 1px solid orange
          }

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

        .chose {
          float: right;
          width: 50px;
          height: 25px;
          background-size: 50px 25px;
          background-position: left center;
          background-repeat: no-repeat;
          margin-top: 12px;
        }

      }
    }
    .btns {
      position: relative;
      background: #fe6902;
      height: 40px;
      line-height: 40px;
      margin 5px 10px
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
    .tabs-list {
      padding: 0px 50px;
      overflow: hidden;

      .tabs-item {
        width: 50%;
        float: left;
        text-align: center;
        position: relative;
        padding: 10px 0px;

        .name {
          color: $color-text;
          /*color:#23ac3a;*/
          display: block;
          font-size: $font-size-medium;
        }

        i {
          width: 30px;
          height: 4px;
          background: #fe6902;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          position: absolute;
          bottom: 0px;
          left: 50%;
          margin-left: -15px;
          display: none;
        }

      }
      .selected {

        .name {
          color: #fe6902;
        }

        i {
          display: block;
        }

      }
    }

  }
</style>
