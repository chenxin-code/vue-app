<template>
  <div class="mine-card-recharge">
    <div class="cells">
      <mineCardInfo @repickCard="repickCard" :item="card" :isShowBtn='true'></mineCardInfo>
      <ul class="tab-cat">
        <li class="item" v-for="(item,index) in tabList" @click="selectedFunc(index)"
            :class="{isActive:selected == index}"><i class="icon-line"></i><span>{{item.name}}</span></li>
      </ul>
      <mineCardRechargeInternet v-if="selected == 0" :card="card"></mineCardRechargeInternet>
      <mineCardRechargeCard v-if="selected == 1" :card="card"></mineCardRechargeCard>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import mineCardInfo from './mine-card-info'
  import mineCardRechargeInternet from './mine-card-recharge-internet'
  import mineCardRechargeCard from './mine-card-recharge-card'
  import defaultImg from "@/assets/dot.png";

  export default {
    name: 'mineCard',
    components: {
      mineCardInfo,
      mineCardRechargeInternet,
      mineCardRechargeCard
    },
    data() {
      return {
        card: {
          "cardBalance": "",
          "cardNo": "",
          "cardType": "",
          "cityName": "",
          "pointBalance": "",
          "reserveBalance": "",
          "totalBalance": ""
        },
        activeName: "互联网充值",
        selected: 0,
        tag: '互联网充值',
        tabList: [{
          "name": "互联网充值"
        },
          {
            "name": "充值卡充值"
          }
        ],

      }
    },
    mounted() {
      let _this = this;
      this.$bridgefunc.registePageShow(function () {
        _this.$bridgefunc.vuexRead()
      })
    },
    watch: {
      '$store.state.card.cardNo': function(val, oldVal) {
        if (this.$store.state.card.cardNo != '') {
          this.card = this.$util.cloneDeep(this.$store.state.card);
        }
      }
    },
    methods: {
      repickCard: function () {
        //console.log('testFunc')
        let url = '/minecardinfo'
        this.$bridgefunc.newPage({
          weburl: url,
          isnativetop: 1

        })
      },
      getCookie: function () {
        return "4.3M";
      },
      selectedFunc: function (index) {
        this.selected = index;
      },
      getUserCardList: function () {
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
              if (data.data.length == 0) {
                this.$MessageBox.confirm('无加油卡，是否绑定加油卡？', '提示', {confirmButtonText: '确定'}).then(action => {
                  _this.$bridgefunc.customPush({
                    path: '/minecardbind',
                    isnativetop:1,
                    query:{
                      isback:1
                    }
                  });
                }).catch(action => {
                  _this.$bridgefunc.customGo(-1);
                });
              }
              _this.card = data.data[0]
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
    created() {
      if (!this.$route.query.card) {
        this.getUserCardList();
      } else {
        this.card = JSON.parse(decodeURIComponent(this.$route.query.card));
      }
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .mine-card-recharge {
    background-color: $color-background-lll;
    width: 100%;
    height: 100%;
    overflow-x hidden
    overflow-y scroll;
    overflow-scrolling touch;
    -webkit-overflow-scrolling touch;
    .cells {
      overflow hidden
      .tab-cat {
        overflow: hidden;
        padding: 0px 3%;
        margin-top: 10px;
        background: #fff;
        position: relative;
        &:after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: '';
          background: #ddd;
          transform: scaleY(0.5);
          -webkit-transform: scaleY(0.5);
          z-index: 10;
        }

        .item {
          float: left;
          text-align: center;
          width: 48%;
          height: 40px;
          background: #fff;
          position: relative;
          .icon-line {
            width: 80px;
            height: 2px;
            background: transparent;
            display: block;
            position: absolute;
            bottom: 0px;
            left: 50%;
            margin-left: -40px;
          }
          span {
            font-size: 16px;
            display: block;
            color: #4c4948;
            line-height: 40px;
          }
        }
        .item:last-child {
          float: right;
        }
        .isActive {
          .icon-line {
            background: #ff6800;
          }
          span {
            color: #ff6800;
          }
        }
      }
    }

  }

</style>
