/**Created by liaoyingchao on 2019/2/20.*/

<template>
  <div class="sy-card">
    <div class="content">
      <swiper :options="swiperOption" ref="swiper">
        <swiper-slide class="swiper_slide_div" v-for="(cardInfo,idx) in cardList" :key="idx" v-if="cardList">
          <div class="card_background">
            <div class="header-message">
              <div class="card-icon-style">
                <img src="static/image/refuel/logo.png">
                <div>中国石油</div>
              </div>
              <div class="top-div">
                <div class="top-div1">
                  <span class="type_div">{{cardInfo.cardType}}</span>
                  <span class="item-spans">
                <span class="default" v-show="cardInfo.isDefault">默认卡</span>
                    <!--<span class="default">{{cardInfo.isDefault}}默认卡</span>-->
                <span class="yunPay" v-show="cardInfo.isYunCard">移动支付</span>
                    <!--<span class="yunPay">{{cardInfo.isYunCard}}移动支付</span>-->
                </span>
                </div>
                <div class="top-div2">{{cardInfo.cityName}}</div>
              </div>
              <div class="bottom-div">
                <div class="num_div">{{cardInfo.isEyeShow ? cardInfo.cardNo : '*********' +
                  cardInfo.cardNo.substring(cardInfo.cardNo.length-5)}}
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="eye_div" @click="clickEye(cardInfo)">
                <img src="static/images/eyeShow.png" v-if='cardInfo.isEyeShow'/>
                <img src="static/images/eyeHidden.png" v-else/>
              </div>
              <div class="cardMoney_div">
                <div class="moudle_div">
                  <div class="text2_div">总金额(元)</div>
                  <div class="text1_div">{{cardInfo.isEyeShow ? cardInfo.totalBalance : '****'}}</div>
                </div>
                <div class="moudle_div">
                  <div class="text2_div">备用金(元)</div>
                  <div class="text1_div">{{cardInfo.isEyeShow ? cardInfo.reserveBalance : '****'}}</div>
                </div>
              </div>
              <div class="cardMoney_div">
                <div class="moudle_div">
                  <div class="text2_div">卡余额(元)</div>
                  <div class="text1_div">{{cardInfo.isEyeShow ? cardInfo.cardBalance : '****'}}</div>
                </div>
                <div class="moudle_div">
                  <div class="text2_div">总积分</div>
                  <div class="text1_div">{{cardInfo.isEyeShow ? cardInfo.pointBalance : '****'}}</div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    name: "sy-card",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    data() {
      let that = this;
      return {
        cards: [],
        activeIndex: 0,
        cardInfo: {},
        index: 0,//当前显示的第几个
        swiperOption: {
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          },
          on: {
            slideChange: function () {
              // that.activeIndex = this.activeIndex
              // that.cardInfo = that.cardList[this.activeIndex];
              // that.getYunCardStatus()
              // that.$emit('putCardInfo', that.cardInfo)
            }
          },
          pagination: {
            el: '.swiper-pagination',
          },
        },
      }
    },
    computed: {
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    methods: {
      getMyCards: function () {
        let url = this.$market.apiBaseURL() + '/app/json/card/getUserCardList';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.cards = data.data;
          } else {

          }
        }, error => {
        })
      }
    },
    created() {
      if (this.usePorpData == true) {
        this.getMyCards()
      } else {
        this.cards = [{
          "cityName": "邯郸市",
          "cardNo": "9002560000000063",
          "cardType": "普通个人卡",
          "totalBalance": "7504.32",
          "pointBalance": "1288",
          "cardBalance": "7000.00",
          "reserveBalance": "504.32",
          "userName": "用户名"
        }, {
          "cityName": "邯郸市",
          "cardNo": "9002560000000064",
          "cardType": "普通个人卡",
          "totalBalance": "8075.18",
          "pointBalance": "232",
          "cardBalance": "7000.00",
          "reserveBalance": "1075.18",
          "userName": "用户名"
        }, {
          "cityName": "济南市",
          "cardNo": "9000100000196629",
          "cardType": "个人卡",
          "totalBalance": "4992.08",
          "pointBalance": "39",
          "cardBalance": "0.00",
          "reserveBalance": "4992.08",
          "userName": "用户名"
        }];
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .sy-card {
    .content {

    }
  }
</style>
