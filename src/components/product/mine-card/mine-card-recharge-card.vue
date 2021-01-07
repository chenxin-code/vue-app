<template>
  <div class="minr-card-recharge">
    <div class="cells">
      <div class="card-pay">
        <input type="text" placeholder="请输入充值卡密码" class="passwordInput" v-model="rechargeableCard"/>
      </div>
      <div class="agree">
        <p class="agree-item">充值后可以前往指定加油站服务网点索取发票</p>
        <p class="agree-item">点击“确定充值”按钮即同意<i @click="rechargeGuide">《*****客户端充值协议》</i></p>
      </div>
      <div class="submit">
        <button class="btn" :class="this.rechargeableCard.length >0 ? 'isActive':''" @click="recharge()">确定充值</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {  Toast } from 'mint-ui';
  import mineCardInfo from './mine-card-info'
  import defaultImg from "@/assets/dot.png";

  export default {
    name: 'mineCard',
    props: [
      'card',
    ],
    components: {
      mineCardInfo
    },
    data() {
      return {
        rechargeableCard: '',
        isActive: '',
      }
    },
    methods: {
      //办卡指南路径写死
      rechargeGuide:function () {
        this.$bridgefunc.customPush({
          path: 'http://app.95504.net/html/recharge-agreement.html',
          isnativetop:1
        });
      },
      testFunc: function () {
        console.log('testFunc')
      },
      getCookie: function () {
        return "4.3M";
      },
      recharge: function () {

        if(!this.rechargeableCard || this.rechargeableCard == ''){
          Toast({
            message: '请输入充值卡密码',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open();
        let url = '/app/json/card/rechargeByCard';

        let _this = this;
        this.$http.post(url, {
          token: this.$store.state.login.token,
          cardNo: this.card.cardNo,
          rechargeableCard: this.rechargeableCard
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              Toast({
                message: data.info ? data.info :'充值成功',
                position: 'bottom',
                duration: 2000,
              });
            } else {
              Toast({
                message: data.info ? data.info :'充值失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '充值失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );

      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .minr-card-recharge {
    background-color: $color-background-lll;
    width: 100%;
    height: auto;
    overflow: hidden;
    .cells {
      overflow: hidden;
      .card-pay {
        padding: 10px 3%;
        background: #fff;
        .passwordInput {
          width: 100%;
          border: 1px solid $color-text-l;
          padding: 10px 0px;
          background: none;
          outline: none;
          font-size: $font-size-medium;
          text-align: center;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          color: $color-text;
        }
      }
      .submit {
        padding: 10px 3%;
        .btn {
          width: 100%;
          background: $color-theme-btn-l;
          color: #fff;
          font-size: 16px;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          border: none;
          padding: 8px 0px;
        }
        .isActive {
          background: $color-theme-btn-d;
        }
      }
      .agree {
        padding: 12px 3%;
      // margin-top: 10px;
        overflow: hidden;

        .agree-item {
          color: $color-text-l;
          font-size: $font-size-small;
          text-align: center;
          i {
            color: orange;
            font-style: normal;
          }
        }
        .warm-tip {
          text-align: center;
          color: $color-text-l;
          font-size: font-size-small;
        // margin-top: 10px;
        }
      }
    }

  }

</style>
