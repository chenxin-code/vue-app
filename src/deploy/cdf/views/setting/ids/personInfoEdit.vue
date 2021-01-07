<template>
  <div class="vertify_root">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="block">
          <div class="title-p">证件类型</div>
          <div class="cardlist">
            <div class="cardItem-area" v-for="cardItem in cards" :key="cardItem.name">
              <div
                class="cardItem line_radius"
                :class="{'theme_standard_bdr_i theme_standard_font_i':cardItem.selected}"
                @click="cardClick(cardItem)"
              >{{cardItem.cardName}}</div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="title-p">证件号码</div>
          <div class="cardnum-title line_radius">
            <van-field
              v-model="cardCode"
              type="phone"
              :border="false"
              placeholder="请输入证件号码"
              maxlength="6"
              size="16"
            />
            <img class="img-class" src="./userImgs/user_camera.png" />
          </div>
        </div>
        <div class="block">
          <div class="title-p">姓名</div>
          <div class="cardnum-title line_radius">
            <van-field v-model="username" type="phone" placeholder="请输入姓名" maxlength="6" size="16" />
          </div>
        </div>
        <div class="block">
          <div class="title-p">英文名/拼音</div>
          <div class="cardnum-title line_radius">
            <van-field
              v-model="en_name"
              type="phone"
              placeholder="请输入英文名/拼音"
              maxlength="6"
              size="16"
            />
          </div>
        </div>
        <div class="block">
          <div class="title-p">出生年月</div>
          <div class="cardnum-title line_radius">
            <van-field
              v-model="birthday"
              type="phone"
              placeholder="请选择或输入出生日期"
              :border="false"
              maxlength="6"
              size="16"
            />
            <img
              class="img-class"
              @click="pickerClick"
              ref="DatetimePicker"
              src="./userImgs/user_birthday.png"
            />
          </div>
        </div>
        <div class="submit theme_standard_bg" @click="submitClick">提交</div>
      </div>
    </nav-content>
    <van-popup v-model="showTimePicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        @cancel="cancleClick"
        @confirm="confirmClick"
        type="date"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  created(){
    this.currentCard = this.cards[0];
  },
  data() {
    return {
      cards: [
        { cardName: "身份证",cardType:0, selected: true },
        { cardName: "护照", cardType:3,selected: false },
        { cardName: "港澳通行证",cardType:2, selected: false },
        { cardName: "台胞证",cardType:1, selected: false },
        { cardName: "边民证", cardType:4,selected: false }
      ],
      currentCard: null,
      realname: "",
      cardCode: "",
      en_name: "",
      birthday: "",
      currentDate: new Date(),
      showTimePicker: false
    };
  },
  methods: {
    pickerClick() {
      if (!this.showTimePicker) {
        this.showTimePicker = !this.showTimePicker;
      }
    },
    cancleClick() {
      this.showTimePicker = false;
    },
    confirmClick(value) {
      let date = value;
      let m = date.getMonth() + 1;
      let d = date.getDate();
      if (m >= 1 && m <= 9) {
        m = "0" + m;
      }
      if (d >= 0 && d <= 9) {
        d = "0" + d;
      }
      let timer = date.getFullYear() + "年" + m + "月" + d + "日";
      this.birthday = timer;
      this.showTimePicker = false;
    },
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
    submitClick() {
      let url = "/app/json/we_chat/perfect";
      // let url = "/app/json/user/certificateSubmit";
      if(this.cardCode == ''){
         this.$Toast('证件号码不能忘为空');
         return;
      }else if(this.realname == ''){
         this.$Toast('姓名不能忘为空');
         return;
      }else if(this.en_name ==''){
         this.$Toast('英文名/拼音不能忘为空');
         return;
      }else if(this.birthday ==''){
         this.$Toast('出生年月不能为空');
         return;
      }
      this.$Loading.open();
      this.$http.post(url,{
          idType:this.currentCard.cardType,
          realName:this.realname,
          enRealName:this.en_name,
          birthday:this.birthday,
          idCard:this.cardCode
        })
        .then(res => {
          this.$Loading.close();
          let {msg,data} = res;
          this.$Toast(msg);
        })
        .catch(err => {
          this.$Loading.close();
          this.$Toast("请求出错");
        });
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
.vertify_root {
  .content {
    padding: 0 20px;
    height: 100%;
    overflow-y: auto;

    .title-p {
      font-size: 16px;
      color: #221916;
      font-weight: 600;
    }

    .block {
      margin: 20px 1px 0;

      .cardlist {
        margin: 5px -5px -5px;
        display: flex;
        flex-wrap: wrap;

        .cardItem-area {
          width: 33.33%;

          .cardItem {
            margin: 5px;
            height: 50px;
            font-size: 16px;
            line-height: 50px;
            text-align: center;
            color: #9FA0A0;
          }
        }
      }

      .cardnum-title {
        margin-top: 10px;
        height: 50px;
        display: flex;
        align-items: center;

        >>>.van-cell {
          background-color: transparent;
        }

        .img-class {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    .submit {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      width: 335px;
      height: 50px;
      color: #FFFFFF;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
    }
  }
}
</style>
