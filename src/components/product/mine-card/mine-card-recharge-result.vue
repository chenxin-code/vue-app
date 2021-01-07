<template>
  <div class="bottom">
    <div class="top_item">
      <img class="full-img" src="static/image/refuel/receipt-top.png">
      <div class="top_title">恭喜您，充值成功</div>
    </div>
    <div class="list_con">
      <div class="list">
        <div class="item_con" v-for="item in items">
          <div class="left_con font-medium">{{item.title}}</div>
          <div class="right_con font-medium-l">{{item.value}} </div>
        </div>
      </div>
    </div>
    <div class="bottom_item">
      <img class="full-img" src="static/image/refuel/receipt-bottom.png">
      <div class="bottom_title">
        <div class="left_bot font-medium">支付金额</div>
        <div class="right_bot font-medium-l">{{payAmount}}元 </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {DatetimePicker, Toast} from 'mint-ui'

  export default {
    name: '',
    components: {
      DatetimePicker,
      Toast
    },
    data() {
      return {
        items:[
          {
            title:'充值卡号',
            value:'',
          },{
            title:'支付方式',
            value:'',
          },{
            title:'支付时间',
            value:'',
          }
        ],
        payTime:'',
        payAmount:'',
        rechargeMode:'',
        orderNo:'',

      }
    },
    methods: {
      getDatas: function () {
        this.items = [
          {
            title:'充值卡号',
            value:this.orderNo,

          },{
            title:'支付方式',
            value:this.rechargeMode,
          },{
            title:'支付时间',
            value:this.payTime,
          }
        ]
        console.log('订单:',this.items);
      }
    },
    created() {
      this.orderNo = this.$route.query.orderNo;
      this.rechargeMode = this.$route.query.rechargeMode;
      this.payTime = this.$route.query.payTime;
      this.payAmount = this.$route.query.payAmount;
      this.getDatas();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'

.bottom{
  /*position absolute*/
  position relative
  width  100%
  height 100%
  overflow hidden
  background-color $color-background-lll
  .top_item{

      width: 96%;
      height: 10%;
      position relative
      margin-left :2%;
      margin-top 10px
      display flex

    .top_title{
      position relative
      width: 100%;
      text-align center;
      color #ff9100
      margin auto

    }

  }
  .list_con{
    position relative
    background-color white;
    width 96%;
    height 40%
    margin-left 2%
    display flex
    .list{
      width 100%
      margin auto
      .item_con{
        width 96%
        margin-left 2%
        height 30px

        .left_con{
          width 50%
          float left
          text-align left
        }
        .right_con{
          float: right
          text-align right
        }
      }
    }
  }
  .bottom_item{
    position relative
    /*background-color white;*/
    width 96%;
    height 10%
    margin-left 2%
    display flex
    .bottom_title{
      position relative
      width: 96%;
      text-align center;
      margin auto
      margin-left 2%
      .left_bot{
        width 50%
        float left
        text-align left
        color white
      }
      .right_bot{
        float: right
        text-align right
        color white
      }

    }

  }

}

</style>
