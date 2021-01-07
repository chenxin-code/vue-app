<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" :title="title"></nav-top>
    <nav-content>
      <div v-if="!cardView">
        <div class="name">
        <div>
          <input type="text" v-model="card">
          <i class="icon iconfont mall-guanbi" @click="deleteData"></i>
        </div>
        <!-- <p>{{card.length}}/10</p> -->
      </div>
      <div class="answer theme_bg_red" @click="verification">提交银行卡</div>
      </div>

      <div v-show='cardView'>
            <van-cell-group>
              <van-field label="银行卡类型" v-model="cardObj.bankName" input-align="right" :readonly='true'/>
              <van-field label="银行卡卡号" v-model="cardObj.card" input-align="right" :readonly='true'/>
            </van-cell-group>
            <div class="answer theme_bg_red">
              <span @click="commit">保存并下一步</span>
            </div>
      </div>
    </nav-content>
    <div v-show="popupCard" class="card">
      <van-popup v-model="popupCard" class="popupCard" :close-on-click-overlay="false">
        <div class="popupCardText">
          <span v-if="cardObj.info">{{cardObj.info.split(',')[0]}}</span>
          <span v-if="cardObj.info">{{cardObj.info.split(',')[1]}}</span>
        </div>
        <div class="popupCardBtn">
          <span @click="popupCardBtn">{{(cardObj.info?(cardObj.info).includes('次数'):'') ? '关闭' : '重新输入'}}</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
  import api from './api'
  import {Toast} from 'vant'
  import {mapGetters} from "vuex";

  export default {
    name: "modifyname",
    mixins: [api],
    data() {
      return {
        card: '', // 卡号
        popupCard: false,
        title: '修改银行卡',
        cardView: false,
        id: '',
        cardObj: {}
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    mounted() {
      this.card = this.$route.query.card || ''
      this.bankName = this.$route.query.bankName || ''
    },
    methods: {
      deleteData() {
        this.card = ''
      },
      verification() {
        if (!(/^[1-9]\d{9,29}$/.test(this.card))) {
          Toast('请输入正确的银行卡号')
          return
        }
        this.$request.post('/app/json/micro_store_front_end/verifyBankNo', {card: this.card}).then(res => {
            if (res.status === 0) {
              let obj = res.data || {}
                this.cardObj = {
                  card: obj.card,
                  bank: obj.bank,
                  bankName: obj.bankCard,
                  cardName: obj.cardName,
                  cardType: obj.cardType,
                  info: ''
                }
                this.title = '验证通过'
                this.cardView = true
            } else {
              this.popupCard = true
              this.cardObj.info = res.info ||''
            }
          })
      },
      commit() {
        let that = this
        console.log(that.getPutaggregate.id);
        let params = {
          token: this.$store.state.login.token,
          id: that.getPutaggregate.id,
          card: that.cardObj.card,
          bankName: that.cardObj.bankName
        }
        this.$Loading.open()
        that.modifyBankData(params).then(res => {
          this.$Loading.close()
          if (res.data.result === 'success') {
            this.$router.go(-1)
          } else {
            Toast(res.data.info)
          }
        })
      },
      popupCardBtn() {
      this.card = ''
      this.popupCard = false
    },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;

    .name {
      background white;
      overflow hidden;
      margin-top 10px;
      padding-bottom 12px;

      div {
        width 90%;
        margin 12px auto 20px auto;
        padding 10px 0;
        border-radius 6px;
        background #f6f6f6
        display flex;
        justify-content space-between

        input {
          background #f6f6f6
          font-size 16px;
          text-indent 6px;
          width 300px;
        }

        .iconfont {
          width 18px;
          height 18px;
          margin-right 10px;
          font-size 20px;
        }
      }

      p {
        margin-top 10px;
        text-align right;
        margin-right 10px;
        font-size 14px;
      }
    }

    .answer {
      position: fixed;
      bottom: 0px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: white;
      font-size: 18px;

      a {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 18px;
      }
    }

    .card {
    /deep/ .van-popup {
      width: 76%;
      font-size: 14px;
      color: #8c8c8c;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .popupCard {
      height: 160px;
      flex-direction: column;
      line-height: 26px;
      
      .popupCardText {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .popupCardBtn {
        width: 100%;
        color: #000;
        height: 50px;
        display: flex;
        justify-content: center;
        font-size 16px

        span {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        >:last-child {
          color #fff;
          background-color #f02e2c
        }
      }
    }
  }
  }
</style>
