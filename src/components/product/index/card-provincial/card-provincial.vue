<template>
  <div>
    <div class="card-div">
      <div class="img-bg">
        <img src="static/images/card-provincial/jijia-bgi-head.png" alt="">
      </div>
      <div class="user-info">
        <div class="user-header-img">
          <img :src="headImg">
        </div>
        <div class="user-info-right">
          <div class="user-name">{{$store.state.userInfo.nickName ? $store.state.userInfo.nickName :
            $store.state.userInfo.userName}}
          </div>
          <div class="user-member">{{$store.state.mall2.myAssets.paidMember == '1' ? 'CHUM付费会员'
            : '普通会员'}}
          </div>
        </div>
      </div>
    </div>
    <div class="bind-card-div">
      <div class="bind-content">
        <div class="bindcard-img-bg">
          <img :src="cardBindBGI" alt="">
        </div>
        <div class="card-tips">
          <p>仅限外省（非河北省内）柴油卡参与</p>
        </div>

        <div class="card-txt">
          <div class="card-title">欢迎加入卡车冀家</div>
          <div v-if="cardNumber" class="bind-card-number" :class="hotareaClass({idCode: moduleData.idCode + 'addCardFun_1'})" @click="hotEvent('addCardFun_1');addCardFun()">您已绑定了{{cardNumber}}张柴油卡</div>
          <p v-else class="add-card-btn" :class="hotareaClass({idCode: moduleData.idCode + 'addCardFun_2'})" @click="hotEvent('addCardFun_2');addCardFun()">立即认证</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import hee from "../_js/hotarea-extend-event";

  export default {
    mixins: [hee],
    data() {
      return {
        cardBindBGI: 'static/images/card-provincial/bgi-notbind.png',
        cardNumber: 0
      }
    },
    props: ['myIndex', 'propData', 'usePorpData'],
    computed: {
      ...mapGetters(['clientWidth']),
      headImg() {
        if (this.$store.state.userInfo.headImg && this.$store.state.userInfo.headImg != 'undefined') {
          return this.$store.state.userInfo.headImg
        } else {
          return this.moduleData.headImg
        }
      },
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      // 模块数据
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    created() {
      if (!this.moduleData.headImg || this.moduleData.headImg == undefined || this.moduleData.headImg == '') {
        this.moduleData.headImg = 'static/images/defaultImg.png'
      }
      if (this.$store.state.webtype == -1 && !this.moduleData.idCode) {
        this.moduleData.idCode = this.$util.randomString()
      }
    },
    mounted() {
      this.getBindCardNumber()
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      addCardFun(){
        this.$market.customPush({
          path: '/bind_provincial_card',
        })
      },
      getBindCardNumber() {
        let params = {
          token: this.$store.state.login.token,
        }
        this.$http.post('/app/json/card/getOtherProvincesCardList', params).then(res => {
          if (res.data.status == 0) {
            const list = res.data.data || []
            if (list.length) {
              this.cardNumber = list.length
              this.cardBindBGI = 'static/images/card-provincial/bgi-bindcard.png'
            }
          } else {
            this.$Toast({
              message: res.data.info,
              position: 'bottom',
              duration: 2000
            });
          }
        })
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>

  .card-div {
    position relative;

    .img-bg {
      width: 200%;
      height: 130px;
      position: absolute;
      left: -50%;
      top: 0;
      z-index 1
      content: '';
      overflow hidden;
      border-radius: 0 0 50% 50%;
      z-index: 1;

      img {
        position absolute;
        left 25%;
        top 0px;
        width 50%
        height 130px;
      }
    }

    .user-info {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      z-index: 2;

      .user-header-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        text-align: center;
        line-height: 70px;
        border: 1px solid #e6e6e6;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .user-info-right {
        flex 1;
        padding 0px 10px;

        .user-name {
          font-size 16px;
          font-weight 500;
        }

        .user-member {
          display inline-block;
          margin-top 10px;
          text-align center;
          // min-width 60px;
          font-size 12px;
          padding 2px 10px;
          border-radius 20px;
          font-weight 600;
          background-color #F9E9E9;
          color #815C52;
        }
      }
    }
  }

  .bind-card-div {
    position: relative;
    padding: 10px;
    z-index: 3;

    .bind-content {
      position: relative;
      border-radius: 10px;
      top: -10px;

      .bindcard-img-bg {
        img {
          width: 100%;
        }
      }

      .card-txt {
        position: absolute;
        color: #fff;
        left: 20px;
        top: 20px;

        .card-title {
          font-size: 26px;
        }

        .bind-card-number {
          margin-top: 20px;
          font-size: 18px;
        }

        .add-card-btn {
          margin-top: 20px;
          padding: 5px;
          border: 1px solid #fff;
          border-radius: 15px;
          width: 80px;
          text-align: center;
        }
      }
      .card-tips {
        position: relative;
        background: #e4e4e4;
        height: 30px;
        line-height: 30px;
        text-align: center;
        top: -2px;
        margin: 0 10px;
        font-size: 14px;
        z-index: 2;
        border-radius: 0 0 10px 10px;
      }
    }
  }


</style>
