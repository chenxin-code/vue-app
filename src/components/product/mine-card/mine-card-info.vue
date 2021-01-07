<template>
  <div class="bottom">
    <div class="user-card">
      <div class="user-img">
        <img src="static/image/mine/cardlogo.png"/>
      </div>
      <div class="user-info" v-if="item">
        <span class="card-type">{{item.cardType}}</span>
        <span class="city">{{item.cityName}}</span>
        <p class="card-num single-line">{{item.cardNo}}</p>
      </div>
      <span class="update" v-if="isShowBtn" @click="repickCard()">更换</span>
    </div>
    <ul class="record">
      <li class="item">
        <p class="total-money total">总余额:<i v-if="item">{{item.totalBalance}}</i>元</p>
      </li>
      <li class="item">
        <p class="total-money point">积分:<i v-if="item">{{item.pointBalance}}</i>分</p>
      </li>
      <li class="item">
        <p class="total-money reMoney">备用金:<i v-if="item">{{item.reserveBalance}}</i>元</p>
      </li>
      <li class="item">
        <p class="total-money money">卡余额:<i v-if="item">{{item.cardBalance}}</i>元</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'mineCardInfo',
    components: {},
    props: [
      'item',
      'isShowBtn',
    ],
    data () {
      return {
        data: {

        },
      }
    },
    methods: {
      repickCard: function () {

        this.$bridgefunc.customPush({
          path: '/minecardlist',
          isnativetop:'1'
        });
      },

    },
    created () {
      console.log(this.item)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    background-color: $color-background-lll;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .user-card{
      padding:10px 3% 8px 3%;
      overflow:hidden;
      background-color white
      // border-bottom:1px solid #dcdddd;
      position:relative;
      .user-img{
        float:left;
        width:50px;
        height:50px;
        img{
          display:block;
          width:50px;
        }
      }
      .user-info{
        overflow hidden
        padding-left:2%;
        padding-top:5px;
        .card-type{
          display:inline-block;
          font-size: $font-size-small;
          padding:3px 10px;
          background:#c9caca;
          color:#fff;
          border-radius:3px;
          -webkit-border-radius:3px;
        }
        .city{
          display:inline-block;
          font-size:$font-size-small;
          padding:3px 10px;
          background:#c9caca;
          color:#fff;
          border-radius:3px;
          -webkit-border-radius:3px;
        }
        .card-num{
          font-size:$font-size-medium;
          width:100%;
          color: $color-text-l;
          padding-top:5px;
          overflow hidden
        }
      }
      .update{
        display:block;
        padding:0px 10px;
        font-size:$font-size-medium;
        color:$color-theme-text-l;
        font-weight:$font-weight-m;
        position:absolute;
        right:3%;
        top:50%;
        margin-top:-10px;
      }
    }
    .record{
      background-color white
      overflow:hidden;
      width:100%;
      .item{
        width:50%;
        padding:8px 0px 8px 3%;
        float:left;
        box-sizing:border-box;
        border-right:1px solid $color-line-gray-l;
        border-top:1px solid $color-line-gray-l;
        .total-money{
          background-repeat:no-repeat;
          background-position:left center;
          background-size:20px 20px;
          padding-left:24px;
          color:#898989;
          font-size:$font-size-medium;
          line-height:20px;
          i{
            color:#ff8819;
            font-style:normal;
          }
        }
        .total{
          background-image:url("../../../../static/image/mine/cardIcon3.png")
        }
        .point{
          background-image:url("../../../../static/image/mine/cardIcon4.png")
        }
        .reMoney{
          background-image:url("../../../../static/image/mine/cardIcon5.png")
        }
        .money{
          background-image:url("../../../../static/image/mine/cardIcon6.png")
        }
      }
      .item:nth-child(2n){
        border-right:none;
      }

    }

  }

</style>
