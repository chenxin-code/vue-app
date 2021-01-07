/**Created by liaoyingchao on 2020-07-10.*/

<template>
  <div class="exchange">
    <nav-top :bgImg="require('./img/t-bg.png')" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="conent-div">
        <img class="bg" src="./img/b-bg.png">
        <div class="block-div">
          <van-field :border="false" class="form-input" label="姓名" v-model="realName" placeholder="请填写保人姓名"/>
          <van-field :border="false" clickable class="form-input" label="车牌号" v-model="carNo" placeholder="请填写投保单车辆牌号" @click="show = true"/>
          <van-field :border="false" class="form-input" label="身份证号" v-model="idNo" placeholder="请填写投保人身份证号"/>
          <van-field :border="false" class="form-input" label="保单号后六位" v-model="policyNo" placeholder="请填写保单号后六位"/>
          <div class="btn-div" @click="exchangeEvent">
            <img src="./img/exchange-btn.png"/>
          </div>
          <div class="bottom-btn" @click="$router.push({path: '/user_center/offer_index'})">
            <img src="./img/bottom-btn.png"/></div>
        </div>
      </div>
      <virtual-keyboard v-bind:show.sync="show" @input="inputKey" @delete="deleteKey"></virtual-keyboard>
    </nav-content>
  </div>
</template>

<script>
  import VirtualKeyboard from "@/components/base/virtual-keyboard";
  import ExchangePop from '@/components/commonui/exchange-pop/index'

  export default {
    name: "exchange",
    components: {
      VirtualKeyboard
    },
    data() {
      return {
        show: false,
        realName: '',
        carNo: '',
        idNo: '',
        policyNo: ''
      }
    },
    methods: {
      inputKey(val) {
        //限制8位
        if (this.carNo.length < 8) {
          this.carNo = this.carNo + val;
        }
      },
      deleteKey() {
        this.carNo = this.carNo.substr(0, this.carNo.length - 1);
      },
      // 获取会员信息
      getMyAssets: function () {
        let url = '/app/json/user/getUserWallet';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.myAssets = data.data
            }
          },
          error => {
          }
        );
      },
      exchangeEvent: function () {
        if (this.realName == '' || this.carNo == '' || this.idNo == '' || this.idNo == '') {
          this.$Toast('请输入所以必填项！')
          return ;
        } else if (this.$util.identityCodeValid(this.idNo) == false) {
          this.$Toast('请输入正确的身份证号码！')
          return ;
        } else if (this.policyNo.length != 6) {
          this.$Toast('请输入正确的保单后六位！')
          return ;
        }
        this.$Loading.open();
        let url = '/app/json/acct/acctRechargeCode'
        let paramsData = {
          realName: this.realName,
          carNo: this.carNo,
          idNo: this.idNo,
          policyNo: this.policyNo,
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              ExchangePop.open({
                exchangeData: data.data,
                sureEvent: () => {
                  this.$router.go(-1)
                }
              });
              this.getMyAssets()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败，请稍后重试！')
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
  .exchange {
    width 100%
    height 100%
    overflow hidden
    .conent-div {
      height 100%;
      background-color #FD6802;
      overflow-y auto;
      position relative;
      .bg {
        display block;
        width 100%;
      }
      .block-div {
        position absolute;
        left 26px;
        right 26px;
        top 240px;
        margin 10px 15px;
        border-radius 5px;
        .van-cell {
          background-color transparent;
        }

        .btn-div {
          margin 15px auto;
          width 200px;
          font-size 0px;
          text-align center;
          img {
            height: 74px;
            width 189px;
          }
        }

        .bottom-btn {
          margin 10px -25px 0;
          font-size 0;
          text-align center;
          img {
            height: 62px;
            width 320px;
          }
        }
      }
    }
    >>>.van-field__control {
      text-align right;
    }
    >>>.van-field__label {
      span {
        font-weight 500;
      }
    }
  }
</style>
