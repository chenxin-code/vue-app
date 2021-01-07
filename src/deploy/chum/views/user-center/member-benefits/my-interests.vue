<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="swiper-f">
        <swiper :options="swiperOption" ref="mySwiper" class="swiper-container">
          <swiper-slide v-for="(item, index) in cardList" :key="index">
            <div class="swiper-item" :style="{'background-image': `url(${item.cardMemberModel.backgroundPic})`}">
              <p class="card-title">{{ item.cardMemberModel.equityCardName }}</p>
              <div class="btm-info">
                <p class="expiration-date">{{ dealWithExpirDate(item.cardMemberModel) }}</p>
                <p class="card-no">NO.{{ item.cardMemberModel.equityCardCode }}</p>
              </div>
              <p class="tips" v-if="item.cardMemberModel.receiveType == 4">赠送</p>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination" v-show="entryType == 1"></div>
      </div>
      <div class="explanation-btn" @click="intro(currentObj)">权益说明&gt;</div>
      <div class="interests-list" v-if="interestsList.length">
        <div
          class="item"
          :class="{disabled: dealwithSurplusNum(item.surplusNumber) === 0}"
          v-for="(item, index) in interestsList"
          :key="index"
          @click="enjoyBenefits(item)">
          <img :src="item.equityPic" alt="" class="icon-inter">
          <p class="name">
            <span class="eq-name">{{ item.equityName }}</span>
            <span class="count" v-if="item.surplusNumber !== ''">{{ dealwithSurplusNum(item.surplusNumber) == -1 ? '无限' : `剩余${dealwithSurplusNum(item.surplusNumber)}次` }}</span></p>
          <van-icon name="arrow" class="icon-arrow"/>
        </div>
      </div>
      <div class="no-result" v-else>暂无权益~</div>
    </nav-content>
    <CheckPaidMember @failHandler="failHandler"></CheckPaidMember>
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
          pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
          },
          on: {
            slideChange: this.slideChange
          }
        },
        cardList: [],
        interestsList: [
          // {
          //   name: '国内机场休息室服务（不限次）',
          //   equityPic: require('../../../assets/images/icon-inter-1.png'),
          // },
        ],
        currentObj: null,
        entryType: 0,
        equityCardName: '',
        equityCardId: NaN
      }
    },
    mounted() {
      this.entryType = this.$route.query.entryType || 0
      this.equityCardName = this.$route.query.equityCardName || ''
      this.equityCardId = this.$route.query.equityCardId || NaN

      this.initInfo()
    },
    computed: {
      mySwiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    components: {
      CheckPaidMember: () => import('../../check-paid-member/check-paid-member.vue')
    },
    methods: {
      failHandler() {
        this.$router.go(-1)
      },
      // 检查用户是否有护照信息
      checkHasPassport() {
        this.$Loading.open()
        this.$http.post('/app/json/user/getUserCertificateList', {
          cateType: 1
        }).then(res => {
          this.$Loading.close()
          let tempData = res.data
          if (tempData.status == 0) {
            if (tempData.data) { // 有护照信息
              this.$router.push({
                path: '/usercenter/myqrcode'
              })
            } else { // 无护照信息
              this.$Toast('请先维护护照信息')
              this.$router.push({
                path: '/usercenter/passportedit'
              })
            }
          } else {
            this.$Toast(tempData.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`getUserCertificateList err ${err}`)
        })
      },
      slideChange() {
        this.interestsList = this.cardList[this.mySwiper.activeIndex].memberModels || []
        this.currentObj = this.cardList[this.mySwiper.activeIndex] || null
      },
      initInfo() {
        this.$Loading.open()
        let params = {
          equityCardState: 1,
          receiveType: 99
        }
        // 全流程卡
        if (this.entryType == 1) {
          params.receiveType = 5
        }
        this.$http.post('/app/json/equity_card/equityMemberUseRecord', params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.cardList = data.data || []
            if (data.data instanceof Array && data.data.length > 0) {
              this.interestsList = data.data[0].memberModels || []
              this.currentObj = data.data[0] || null
              
              if (this.equityCardName) {
                let swiperIndex = NaN
                data.data.forEach((item, index) => {
                  if (item.equityCardName == this.equityCardName) {
                    swiperIndex = index
                  }
                })
                this.$nextTick(() => {
                  this.mySwiper.slideTo(swiperIndex, 500, false)
                })
              }
            }
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`equityMemberUseRecord err ${err}`)
        })
      },
      dealWithExpirDate(cardInfo) {
        let result = '有效期：-'
        if (cardInfo.validityType == 1) {
          result = '有效期：永久有效'
        } else {
          result = '有效期至：' + moment(cardInfo.invalidTime).format('YYYY-MM-DD')
        }
        return result;
      },
      intro(item) {
        if (item) {
          this.$router.push({
            path: '/benefits/benefitsInfo',
            query: {
              id: item.cardMemberModel.id
            }
          })
        }
      },
      enjoyBenefits(item) {
        if (item.surplusNumber === 0 || item.surplusNumber === '0') {
          return false
        }
        let url = ''
        switch (item.equityType) {
          // 1约车服务3.会员卡核销4.第三方权益5.定制游6.签证特惠7.保险
          case 51001:
            url = '/benefits/vipCar'
            break;
          case 51003:
            url = '/benefits/selectStore'
            break;
          case 51004:
            this.checkHasPassport()
            break;
          case 51005:
            url = '/benefits/customTraval'
            break;
          case 51006:
            url = '/benefits/visaApplication'
            break;
          case 51007:
            url = '/benefits/myInsurance'
            break;
          default:
            url = ""
            break;
        }
        this.$router.push({
          path: url,
          query: {
            id: item.id,
            equityId:item.equityId,
            memberId:item.memberId,
            memberName:item.memberName,
            memberPhone:item.memberPhone

          }
        })
      },
      dealwithSurplusNum(num) {
        /*
          1. 为空则不展示剩余次数
          2. 0 或者 '0' 展示剩余0次，列表禁止点击
          3. 为 '无限制' 展示 无限
          4. 其他情况展示 num 值
        */
        if (num === '') {
          return false
        } else if (num === 0 || num === '0') {
          return 0
        } else if (num === '无限制') {
          return -1
        } else {
          return num
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (
        to.path != '/benefits/vipCar' &&
        to.path != '/benefits/selectStore' &&
        to.path != '/benefits/customTraval' &&
        to.path != '/benefits/visaApplication' &&
        to.path != '/benefits/myInsurance' &&
        to.path != '/benefits/benefitsInfo' &&
        to.path != '/usercenter/myqrcode' &&
        to.path != '/usercenter/passportedit'
      ) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    background-color: #C9A063;
    overflow-y auto;
  }

  .swiper-f {
    position relative;
    .swiper-pagination {
      bottom -22px;
      font-size 12px;
      color #fff;
      /deep/ .swiper-pagination-current {
        font-size 16px;
      }
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

      .expiration-date,
      .card-no {
        font-size 12px;
        font-weight 400;
        padding 4px 0;
      }

      .tips {
        font-size 12px;
        height 20px;
        line-height 19px;
        text-align center;
        padding 0 20px;
        position absolute;
        right 0;
        top 0;
        background-color: $color-theme-r;
        color #fff;
        transform: translate(17px, 4px) rotate(45deg);
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
      
      &.disabled::after {
        content '';
        display block;
        width 100%;
        height 100%;
        background-color rgba(255, 255, 255, .7);
        position absolute;
        left 0;
        top 0;
      }

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
        display flex;
        justify-content space-between;
        align-items center;
        .eq-name {
          width 70%;
          ellipse();
        }
        .count {
          font-size 12px;
          color #999;
        }
      }

      .icon-arrow {
        font-size 15px;
        color #9FA0A0;
      }
    }
  }

  .no-result {
    color #fff;
    font-size 13px;
    text-align center;
    padding 40px 0;
  }
</style>
