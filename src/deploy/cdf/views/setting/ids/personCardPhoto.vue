<template>
  <div>
    <nav-top :title="toptitle" @backEvent="this.$route.go(-1)"></nav-top>
    <nav-content>
      <div class="vertify-root">
        <div class="msgtip">请上传本人身份证人像面和国徽面照片</div>
        <div class="idcardstyle" @click="selectPhotoClick('0')">
          <img src="./userImgs/idcard_0.png" />
          <div>拍摄人像面照片</div>
        </div>
        <div class="idcardstyle" @click="selectPhotoClick('1')">
          <img src="./userImgs/idcard_1.png" />
          <div>拍摄国徽面照片</div>
        </div>
        <div class="nextbtn">下一步</div>
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
  mounted() {},
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
    },
    //获取证件正反面
    selectPhotoClick(phototype) {
      this.$Toast("相册");
      this.$bridgefunc.getPhoto("3", base64 => {
        this.uploadCardPhotoClick(phototype, base64);
      });
    },
    // cardtype证件正反面类型 0 1,图片信息 base64Str
    uploadCardPhotoClick(cardtype, base64Str) {
      let url = "/app/json/ocr/ocrCertificate";
      //ocrType证件类型/0/1身份证
      this.$Loading.open();
      this.$http
        .post(url, { ocrType: cardtype, base64Str: base64Str })
        .then(res => {
          this.$Toast("正常响应了");
          this.$Loading.close();
        })
        .catch(err => {
          this.$Toast("异常了");
          this.$Loading.close();
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
.vertify-root {
  display: flex;
  flex-direction: column;
  align-items: center;

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

  .idcardstyle {
    display: flex;
    flex-direction: column;
    margin: 20px auto 27px auto;

    img {
      width: 222px;
      height: 150px;
    }

    div {
      margin-top: 4px;
      text-align: center;
      color: #9FA0A0;
      font-size: 16px;
    }
  }

  .nextbtn {
    position: absolute;
    text-align: center;
    bottom: 20px;
    width: 335px;
    height: 50px;
    line-height: 50px;
    border-radius: 5px;
    background-color: #CF000D;
    color: #FFFFFF;
    font-size: 16px;
  }
}
</style>
