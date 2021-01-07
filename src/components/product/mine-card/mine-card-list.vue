<template>
  <div class="bottom">
    <div class="card-con" v-for="item in items" @click="chooseCard(item)">
      <div class="user-card">
        <div class="user-img">
          <img src="static/image/mine/cardlogo.png"/>
        </div>
        <div class="user-info">
          <span class="card-type">{{item.cardType}}</span>
          <span class="city">{{item.cityName}}</span>
          <p class="card-num single-line">{{item.cardNo}}</p>
        </div>
      </div>
      <ul class="record">
        <li class="item">
          <p class="total-money total">总余额: <i>{{item.totalBalance}}</i></p>
        </li>
        <li class="item">
          <p class="total-money point">总积分: <i>{{item.pointBalance}}</i></p>
        </li>
        <li class="item">
          <p class="total-money reMoney">备用金: <i>{{item.reserveBalance}}</i></p>
        </li>
        <li class="item">
          <p class="total-money money">卡余额: <i>{{item.cardBalance}}</i></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import mineCardInfo from './mine-card-info'
  export default {
    name: 'mineCardList',
    components: {
      mineCardInfo,
    },
    props: [

    ],
    data () {
      return {
        items:[
          // {
          //   cardType:'个人卡',
          //   cityName:'北京市',
          //   cardNo:'09876543',
          //   totalBalance:'0.34',
          //   pointBalance:'0.89',
          //   reserveBalance:'0.37',
          //   cardBalance:'0.00',
          // },
          // {
          //   cardType:'个人卡',
          //   cityName:'邯郸市',
          //   cardNo:'2345678',
          //   totalBalance:'20',
          //   pointBalance:'100',
          //   reserveBalance:'40',
          //   cardBalance:'100',
          // },

        ]

      }
    },
    methods: {
      chooseCard :function(item){//点击选择加油卡
        console.log('加油卡：',item);
        this.$store.state.card = item;
        let _this = this;
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customGo(-1);
        })

      },
      getCardList: function () {
        this.$Loading.open();
        let url = '/app/json/card/getUserCardList';
        let token = this.$store.state.login.token
        console.log('tokentokentokentokentoken', token)
        let params1 = {
          token: token,
        }
        let _this = this;
        this.$http.post(url, params1).then(
          res => {
          _this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          _this.items = data.data;
          console.log('加油卡列表：',data.data);
        } else {
          Toast({
            message: data.info ? data.info :'获取加油卡列表失败',
            position: 'bottom',
            duration: 2000,
          });
        }
      },
        error => {
          _this.$Loading.close();
          Toast({
            message: '获取加油卡列表失败',
            position: 'bottom',
            duration: 2000,
          });
        }
        );

      }
    },
    created () {
       this.getCardList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    background-color: $color-background-lll;
    width: 100%;
    height: auto;
    overflow: hidden;
    .card-con{
      margin-bottom: 10px;

    }

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
