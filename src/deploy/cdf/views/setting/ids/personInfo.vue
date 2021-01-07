<template>
  <div>
    <nav-top :title="toptitle" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="vertify-root">
        <div class="msgtip">若姓名信息不正确，请重新上传照片或修改</div>
        <div class="cardtype-root">
          <div class="title-p">姓名</div>
          <div class="cardnum-title line_radius">
            <van-field
              class="input-style"
              v-model="username"
              type="phone"
              maxlength="6"
              size="16"
              :readonly="true"
            />
          </div>
        </div>
        <div class="cardtype-root">
          <div class="title-p">证件号码</div>
          <div class="cardnum-title line_radius">
            <van-field
              class="input-style"
              v-model="cardCode"
              type="phone"
              :readonly="true"
              maxlength="6"
              size="16"
            />
          </div>
        </div>
        <div class="cardtype-root">
          <div class="title-p">有效期</div>
          <div class="cardnum-title line_radius">
            <van-field
              class="input-style"
              v-model="expiredTime"
              :readonly="true"
              type="phone"
              maxlength="6"
              size="16"
            />
          </div>
        </div>
        <div class="buttonarea">
          <div>重新上传证件照片</div>
          <div>下一步</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cards: [
        { cardName: "身份证", selected: true },
        { cardName: "台胞证", selected: false },
        { cardName: "港澳通行证", selected: false },
        { cardName: "护照", selected: false },
        { cardName: "边民证", selected: false }
      ],
      username: "张三",
      cardCode: "100000199006011234",
      expiredTime: "2015.11.23-2025.11.22",
      toptitle: "个人信息"
    };
  },
  methods: {
    cardClick(card) {
      if (!card.selected) {
        card.selected = !card.selected;
      }
      this.cards.forEach(item => {
        if (item.cardName != card.cardName && item.selected) {
          item.selected = !item.selected;
          window.console.log(6666);
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.vertify-root {
  display: flex;
  flex-direction: column;

  .msgtip {
    margin: 20px 20px 0px 20px;
    text-align: center;
    width: 335px;
    height: 33px;
    line-height: 33px;
    background-color: rgba(255, 229, 188, 0.3);
    border: 1px solid #FFE5BC;
    font-size: 16px;
    color: #9FA0A0;
    border-radius: 5px;
  }

  .cardtype-root {
    padding: 20px 0px 0px 0px;
  }

  .title-p {
    font-size: 16px;
    padding: 0px 25px;
    color: #221916;
    font-weight: 500;
  }

  .cardnum-title {
    height: 50px;
    margin: 10px 20px 0 20px;
    display: flex;
    align-items: center;
    padding-right: 15px;

    .input-style {
      color: #221916;
    }
  }

  .buttonarea {
    display: flex;
    position: absolute;
    justify-content: space-between;
    margin: 0 auto;
    padding: 0px 20px 0px 20px;
    width: 100%;
    bottom: 20px;

    div {
      background-color: #CF000D;
      color: #FFFFFF;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
      width: 48%;
      line-height: 50px;
    }
  }
}
</style>
