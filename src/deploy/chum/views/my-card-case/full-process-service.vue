<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="top-c">
        <swiper :options="swiperOption" ref="mySwiper" class="swiper-container">
          <swiper-slide v-for="(item, index) in cardList" :key="index">
            <div class="swiper-item" :style="{'background-image': `url(${item.backgroundPic})`}">
              <p class="card-title">{{ item.equityCardName }}</p>
            </div>
          </swiper-slide>
        </swiper>
        <div class="explanation-btn" @click="intro">权益说明&gt;</div>
        <div class="interests-list">
          <div class="item" v-for="(item, index) in interestsList" :key="index" @click="enjoyBenefits(item)">
            <img :src="item.equityPic" alt="" class="icon-inter">
            <p class="name">{{ item.equityName }}</p>
            <van-icon name="arrow" class="icon-arrow"/>
          </div>
        </div>
      </div>
      <div class="chum-public-btn btm-btn">
        <van-button
          :disabled="disReceiveBtn"
          round
          block
          type="info"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="receiveHandler">立即领取
        </van-button>
      </div>
    </nav-content>
    <van-popup v-model="successModal" class="receive-modal" :close-on-click-overlay="false">
      <p class="text">恭喜您成功领取了【{{ interestName }}】,进入“我的-我的卡包”页面进行查看！</p>
      <div class="btn-c">
        <span @click="successModal = false">稍后查看</span>
        <span class="red" @click="viewNow">立即查看</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data() {
      return {
        swiperOption: {
          slidesPerView: 1.5,
          centeredSlides: true,
          speed: 500,
          observer: true,
          observeParents: true,
        },
        cardList: [],
        interestsList: [],
        currentObj: null,
        successModal: false,
        cardInfo: {},
        interestName: '',
        disReceiveBtn: false,
      }
    },
    mounted() {
      if (this.$route.query.cardInfo) {
        this.cardInfo = JSON.parse(decodeURIComponent(this.$route.query.cardInfo))
        this.initInfo()
      }
    },
    computed: {
      mySwiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    components: {},
    methods: {
      initInfo() {
        this.$Loading.open()
        this.$http.post('/app/json/equity_card/receiveDetail', {
          id: this.cardInfo.equityCardId
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.cardList.push(data.data)
            if (this.cardList[0]) {
              this.interestName = this.cardList[0].equityCardName
            }
            this.interestsList = data.data.equityItemModels[0].infoModels || []
            this.currentObj = this.interestsList[0] || null
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`equityMemberUseRecord err ${err}`)
        })
      },
      intro() {
        let ids = []
        this.interestsList.forEach(item => {
          ids.push(item.id)
        })
        this.$router.push({
          path: '/benefits/benefitsInfo',
          query: {
            entryType: 1,
            id: ids.join(',')
          }
        })
      },
      receiveHandler() {
        this.$Loading.open()
        this.$http.post('/app/json/app_equity_card/addEquityCardMember', this.cardInfo).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.successModal = true
            this.disReceiveBtn = true
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`addEquityCardMember err ${err}`)
        })
      },
      viewNow() {
        this.$router.push({
          path: '/my_card_case'
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    background-color: #C9A063;
    display flex;
    flex-direction column;

    .top-c {
      flex 1;
      overflow-y auto;
    }
    .btm-btn {
      padding 10px 20px;
    }
  }

  .swiper-container {
    margin-top 15px;

    /deep/ .swiper-slide {
      transition: .3s;
      transform: translateY(14px) scale(0.8);
    }

    /deep/ .swiper-slide-active,
    .swiper-slide-duplicate-active {
      transform: translateY(0) scale(1);
    }

    .swiper-item {
      height 140px;
      border-radius 10px;
      padding 15px 10px;
      display flex;
      flex-direction column;
      justify-content flex-end;
      overflow hidden
      position relative;
      background-repeat no-repeat;
      background-size 100% 100%;

      .card-title {
        font-size 12px;
        font-weight 400;
        line-height 18px;
        padding-bottom 3px;
      }

    }
  }

  .explanation-btn {
    padding 15px 20px 10px;
    font-size 14px;
    font-weight 500;
    color #fff;
    text-align right;
  }

  .interests-list {
    padding 0 10px;
    border-radius 5px;
    background-color: #fff;
    margin 0 20px 20px;

    .item {
      height 55px;
      line-height 55px;
      bdr-b();
      display flex;
      align-items center;

      .icon-inter {
        display block;
        width 25px;
        height 25px;
        margin-right 5px;
      }

      .name {
        font-size 15px;
        font-weight 400;
        flex 1;
      }

      .icon-arrow {
        font-size 15px;
        color #9FA0A0;
      }
    }
  }

  .receive-modal {
    width 300px;
    height 180px;
    border-radius 5px;
    display flex;
    flex-direction column;
    .text {
      flex 1;
      padding 0 23px;
      display flex;
      flex-direction column;
      justify-content center;
      font-size 15px;
      font-weight 400;
      line-height 21px;
    }
    .btn-c {
      display flex;
      bdr-t();
      span {
        font-size 14px;
        font-weight 500;
        flex 1;
        text-align center;
        padding 12px 0;
      }
      .red {
        color #F02C2D
        bdr-l();
      }
    }
  }
</style>
