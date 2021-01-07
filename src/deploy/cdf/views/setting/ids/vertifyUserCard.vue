<template>
  <div>
    <nav-top :title="toptitle" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="vertify-root">
        <div class="cardtype-root">
          <div class="title-p">证件类型</div>
          <div class="cardlist">
            <div class="cardItem-area" v-for="cardItem in cards" :key="cardItem.name">
              <div
                class="cardItem"
                :class="{'cardItemSelected':cardItem.selected}"
                @click="cardClick(cardItem)"
              >{{cardItem.cardName}}</div>
            </div>
          </div>
        </div>
        <div class="cardtype-root">
          <div class="title-num">证件号码</div>
          <div class="cardnum-title line_radius">
            <van-field
              v-model="cardCode"
              type="phone"
              placeholder="请输入证件号码"
              maxlength="6"
              size="16"
            />
          </div>
        </div>
        <div class="discribe-title">请填写您注册时所使用的证件类型及证件号码，如证件信息不一致，请联系客服电话 ：</div>
        <a :href="'tel:' + '400-050-0180'" class="phone theme_font_red_i">400-050-0180</a>
        <div class="submit theme_standard_bg">提交</div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      created(){
          this.currentCard = this.cards[0];
      },
      cards: [
        { cardName: "身份证", selected: true },
        { cardName: "台胞证", selected: false },
        { cardName: "港澳通行证", selected: false },
        { cardName: "护照", selected: false },
        { cardName: "边民证", selected: false }
      ],
      currentCard: null,
      cardCode: "",
      toptitle: "验证证件信息"
    };
  },
  methods: {
    cardClick(card) {
      if (!card.selected) {
        card.selected = !card.selected;
        this.currentCard = card;
      }
      this.cards.forEach(item => {
        if (item.cardName != card.cardName && item.selected) {
          item.selected = !item.selected;
          window.console.log(6666);
        }
      });
    },
    vertifyCardSubmit(){
      let url = "/app/json/we_chat/verifyCert";
      if(this.cardCode == ''){
          this.$Toast('证件号码不能为空');
          return;
      }
      this.$Loading.open();
      this.$http.post(url,{
        verifyCertType:this.cardType,
        verifyCertNo:this.cardCode,
        // code:--//微信Code
      }).then(res=>{}).catch(err=>{});
    }
  }
};
</script>
<style lang="stylus" scoped>
.vertify-root {
  display: flex;
  padding-left: 15px;
  padding-right: 15px;
  flex-direction: column;

  .cardlist {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 0px 0px 0px;
    margin-bottom: 0px;

    .cardItem-area {
      display: flex;
      align-items: center;
      width: 33.33%;
      justify-content: space-around nowrap;
      padding: 5px 5px;

      .cardItem {
        width: 100%;
        height: 50px;
        border: 1px solid #CFCFCF;
        display: inline-block;
        border-radius: 5px;
        font-size: 16px;
        line-height: 50px;
        text-align: center;
        color: #9FA0A0;
      }

      .cardItemSelected {
        border: 1px solid #CF000D;
        color: #CF000D;
      }
    }
  }

  .cardtype-root {
    .title-p {
      margin-top: 20px;
      font-size: 16px;
      padding: 0px 5px;
      color: #221916;
      font-weight: 500;
    }

    .title-num {
      margin-top: 15px;
      font-size: 16px;
      padding: 0px 5px;
      color: #221916;
      font-weight: 500;
    }

    .cardnum-title {
      height: 50px;
      margin: 10px 5px 0 5px;
      display: flex;
      align-items: center;
      padding-right: 15px;
    }
  }

  .discribe-title {
    margin-top: 20px;
    width: 100%;
    padding: 0px 5px 0px 5px;
    font-size: 16px;
    color: #9FA0A0;
  }

  .phone {
    padding: 0px 5px 0px 5px;
    line-height: 30px;
    font-size: 16px;
    color: #CF000D;
  }

  .submit {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 11px auto;
    width: 335px;
    height: 50px;
    color: #FFFFFF;
    font-size: 16px;
    text-align: center;
    border-radius: 5px;
  }
}
</style>
