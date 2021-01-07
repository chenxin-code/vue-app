<template>
  <div class="minecardbot">
    <div class="cells">
      <ul class="top-tab">
        <li class="item" @click="cardBind">
          <img src="static/image/mine/cardIcon1.png"/>
          <p>添加个人卡</p>
        </li>
        <li class="item" @click="newCardGuide">
          <img src="static/image/mine/cardIcon2.png"/>
          <p>办卡指南</p>
        </li>
      </ul>
      <div class="scrollarea" v-if="cardList">
        <div class="component" v-for="item in cardList" v-if="cardList.length">
          <mineCardInfo :item="item" @repickCard="repickCard" ></mineCardInfo>
          <ul class="function">
            <li class="item" @click="recharge(item)"><span>充值</span></li>
            <li class="item" @click="rechargeQuery(item)"><span>充值查询</span></li>
            <li class="item" @click="consumeQuery(item)"><span>消费查询</span></li>
            <li class="item" @click="openConfirm(item)"><span>解除绑定</span></li>
          </ul>
        </div>
        <p class="nodata" v-if="!cardList.length">无加油卡数据</p>

      </div>

    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import mineCardInfo from './mine-card-info'
  import { MessageBox } from 'mint-ui';
  import defaultImg from "@/assets/dot.png";
  export default {
    name: 'mineCard',
    components: {
      mineCardInfo,
      MessageBox
    },
    data () {
      return {
        cardList: null,
      }
    },
    methods: {
      repickCard: function () {
        //console.log('testFunc')
        let url = '/minecardinfo'
        this.$bridgefunc.newPage({
          weburl: url,
          isnativetop:1
        })
      },

      openConfirm(card) {
        MessageBox.confirm('确定执行此操作?', '提示').then(action => {
          this.unbindCard(card);
        }).catch(action => {
          console.log(action);
        });
      },
      unbindCard:function (card) {
        this.$Loading.open();
        let url = '/app/json/card/unbindCard';

        let _this = this;
        this.$http.post(url, {
          token: this.$store.state.login.token,
          cardNo: card.cardNo,
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              console.log("解绑成功");
              this.getUserCardList();
            } else {
              Toast({
                message: data.info ? data.info :'解绑失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '解绑失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      recharge:function (card) {
        this.$bridgefunc.customPush({
          path: '/minecardrecharge',
          isnativetop:1,
          query:{
            card:encodeURIComponent(JSON.stringify(card)),
          }
        });
      },
      rechargeQuery:function (card) {
        this.$bridgefunc.customPush({
          path: '/minecarddemand',
          isnativetop:1,
          query: {
            cardNo: card.cardNo,
            tag: 2
          }
        });
      },
      consumeQuery:function (card) {
        this.$bridgefunc.customPush({
          path: '/minecardexpensedemand',
          isnativetop:1,
          query: {
            cardNo: card.cardNo,
            tag: 1
          }
        });
      },
      cardBind:function () {
        this.$bridgefunc.customPush({
          path: '/minecardbind',
          isnativetop:1
        });
      },
      //办卡指南路径写死
      newCardGuide:function () {
        this.$bridgefunc.customPush({
          path: 'https://app.95504.net/html/cardGuide/index.html',
          isnativetop:1
        });
      },
      getUserCardList:function () {
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
              _this.cardList =data.data
              if(!_this.cardList ||  !_this.cardList.length){
                _this.$store.state.login.bindCardState = '0';
              }
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
      this.getUserCardList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .minecardbot {
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    background-color $color-background-lll
    overflow: hidden;
    .cells{
      width 100%
      height 100%
      overflow-x hidden
      overflow-y:scroll;
      overflow-scrolling:touch;
      -webkit-overflow-scrolling:touch;
      .top-tab{
        padding:15px 0px 10px 0px;
        display:flex;
        width:100%;
        overflow:hidden;
        border-bottom:1px solid #dcdddd;
        background:#fff;
        .item{
          float:left;
          flex:2;
          text-align:center;
          display:block;
          img{
            display:inline-block;
            width:36px;
            height:36px;
          }
          p{
            font-size:$font-size-medium;
            color:$color-background-l;
            line-height:20px;
          }
        }
      }
      .scrollarea{
        overflow hidden

        .component{
          margin-top:10px;
          border-top:3px solid $color-theme-text-d;
        }
        .nodata{
          text-align center
          color:$color-background-l;
          margin-top  80px
        }
        .function{
          overflow:hidden;
          width:100%;
          background:#fff;
          border-top:1px solid $color-line-gray-l;
          .item{
            box-sizing:border-box;
            width:25%;
            text-align:center;
            float:left;
            padding: 9px 0px;
            span{
              display:block;
              color: $color-text;
              font-size:$font-size-medium-x;
              border-right:1px solid $color-line-gray-l;
            }
          }
          .item:last-child{
            border-right:none;
          }
        }
      }

    }

  }

</style>
