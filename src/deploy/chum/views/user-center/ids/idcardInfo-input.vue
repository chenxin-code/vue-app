<template>
  <div class="idcardroot">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="idcontent-root">
      <div class="tiparea">
        <img src="../userimgs/edit_notice.png" />
        <div>因会员卡部分权益需要使用您的身份信息，请你务必如实填写。</div>
      </div>
      <div class="info-edit">
        <div class="info-row">
          <div class="title">真实姓名</div>
          <div class="inputrow cell-line">
            <van-field v-model="realname" placeholder="请输入您的真实姓名" />
          </div>
        </div>
        <div class="info-row">
          <div class="title">身份证</div>
          <div class="inputrow">
            <van-field v-model="idcardNum" placeholder="请输入您的身份证号" @blur="cardCodeBlur(1)" />
          </div>
        </div>
        <!-- <div class="info-row">
          <div class="title">护照</div>
          <div class="inputrow">
            <van-field v-model="passportNum" placeholder="请输入您的护照号" @blur="cardCodeBlur(2)" />
          </div>
        </div> -->
        <div class="info-row">
          <div class="title">出生日期</div>
          <div class="inputrow" @click="pickerClick">
            <van-field disabled v-model="birthday" placeholder="请输入您的出生日期" />
          </div>
        </div>
        <div class="info-row">
          <div class="title">性别</div>
          <div class="sex">
            <div class="unsel" :class="{'sel':sex==1}" @click="sexClick(1)">男</div>
            <div class="unsel" :class="{'sel':sex==2}" @click="sexClick(2)">女</div>
          </div>
        </div>
      </div>
      <div class="empty"></div>
      <div class="submit chum-public-btn" @click="queryBtn">提交</div>
    </nav-content>
    <van-popup v-model="showTimePicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        @cancel="cancleClick"
        @confirm="confirmClick"
        :min-date="mindate"
        :max-date="maxdate"
        type="date"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showTimePicker: false,
      realname: "",
      idcardNum: "", // 身份证号
      passportNum:"",//护照号
      currentDate: new Date(1990, 1, 1),
      birthday: "",
      sex: "",
      mindate: "",
      maxdate: ""
    };
  },
  methods: {
    sexClick(sex) {
      this.sex = sex;
    },
    cardCodeBlur(type) {//1：身份证；2：护照
      if(type == 1){
        if (this.idcardNum == "") {
          this.$Toast("证件号不能为空");
          return;
        } else if (this.$util.identityCodeValid(this.idcardNum) == false) {
          this.$Toast("证件号输入错误");
          return;
        } else {
          this.birthday = this.$util.getBirth(this.idcardNum);
        }
      }else{
        if(this.passportNum=="") {
           this.$Toast("护照号为空");
           return;
        }else if(this.$util.checkPassport(this.idcardNum) == false){
          this.idcardNum = '';
          this.$Toast('护照号填写有误');
          return;
        }
      }
    },
    //提交身份信息验证
    queryBtn() {
      // 提交按钮
      if (this.realname == "") {
        this.$Toast("请输入姓名");
        return;
      } else if (this.idcardNum == "") {
        this.$Toast("请输入身份证号");
        return;
      } else if (this.$util.identityCodeValid(this.idcardNum) == false) {
        this.$Toast("身份证号填写有误");
        return;
      } else {
        if (parseInt(this.idcardNum.substr(16, 1)) % 2 == 1) {
          this.sex = "1";
        } else {
          this.sex = "2";
        }
        this.birthday = this.$util.getBirth(this.idcardNum);
        let termDate = this.valid;

        let param = {
            name: this.realname, // 姓名
            cateType: 0,
            sex: this.sex, // 性别
            idcardNum: this.idcardNum // 身份证号
          };
        let birth = this.birthday;
        birth = birth
          .replace("年", "-")
          .replace("月", "-")
          .replace("日", "");
        param.birthDate = birth;
        // if(this.passportNum){
        //   param.passportNum = this.passportNum;
        // }
        this.$Loading.open();
        this.$request
          .post("/app/json/user/identifySubmmit", param)
          .then(res => {
            this.$Loading.close();
            if (res.status === 0) {
              if (this.$route.query.source == 1) {
                // 1 代表是从审核结果页面过去的
                this.$router.go(-2);
              } else {
                this.$router.go(-1);
              }
            } else {
              this.$Toast(res.info ? res.info : "提交失败");
            }
          })
          .catch(err => {
            this.$Loading.close();
          });
      }
    },
    pickerClick() {
      this.showTimePicker = !this.showTimePicker;
      this.mindate = new Date(1900, 1, 1);
      this.maxdate = new Date();
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
      this.currentDate = new Date(1990, 1, 1);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl';

.idcontent-root {
  display: flex;
  flex:1;
  flex-direction: column;
  .tiparea {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    padding: 5px 20px;
    background-color: #FBF8D9;
    color: #F59B27;
    font-size: 11px;
    font-weight: 600;

    img {
      margin-right: 8px;
      width: 15px;
    }

    div {
      font-weight: 500;
    }
  }

  .info-edit {
    padding: 20px 20px;

    .info-row {
      margin-bottom: 8px;

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #101010;
        margin-bottom: 10px;
      }

      .sex {
        display: flex;
        flex-direction: row;

        .unsel {
          border: 0.6px solid #CFCFCF;
          background-color: #FFFFFF;
          width: 105px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          margin-right: 10px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: #9FA0A0;
        }

        .sel {
          background: linear-gradient(180deg, rgba(230, 206, 156, 1) 0%, rgba(201, 160, 99, 1) 100%);
          color: #313131;
        }
      }

      .inputrow {
        border: 0.8px solid #CFCFCF;
        border-radius: 5px;
        height: 50px;
        padding: 1px 5px;

      }
    }
  }
 .empty {
   flex:1;
 }
  .submit {
    margin:0px auto 20px auto;
    width: 80%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 25px;
    background: linear-gradient(270deg, rgba(49, 49, 49, 1) 0%, rgba(84, 84, 84, 1) 51%, rgba(49, 49, 49, 1) 100%);
    color: #C9A063;
    font-size: 16px;
  }
}
</style>
