<template>
  <div class="iddetail">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list">
          <div class="list-con">
            <div class="row" v-if="this.carditem.cateType == 0">
              <div class="label">姓名</div>
              <div class="labelvalue">{{carditem.realName}}</div>
            </div>
            <div class="row line_top" v-if="this.carditem.cateType == 0">
              <div class="label">身份证号</div>
              <div class="labelvalue">{{$util.dealIds(carditem.idcardNum)}}</div>
            </div>
            <div v-if="this.carditem.cateType == 1">
              <div class="row line_top">
                <div class="label">普通护照号</div>
                <div class="labelvalue">
                  <van-field
                    class="van"
                    size="16"
                    v-model="passportNum"
                    @focus="focusEn"
                    @blur="blurEn"
                    type="phone"
                    input-align="right"
                  />
                </div>
              </div>
              <div class="row line_top">
                <div class="label">公务护照号</div>
                <div class="labelvalue">
                  <van-field
                    class="van"
                    size="16"
                    v-model="pubPassportNum"
                    @focus="focusEn"
                    @blur="blurEn"
                    type="phone"
                    input-align="right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
           <div class="empty"></div>
          <div v-if="canEdit" class="submit" @click="queryBtn">保存</div>
        </div>
    </nav-content>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      mindate: new Date(1900, 1, 1),
      maxdate: new Date(2050, 1, 1),
      passportNum: '',
      pubPassportNum: '',
      cateType:'', // 证件类型
      idData: {},
      carditem: {},
      cardList: [],
      currentDate: new Date(),
      showTimePicker: false,
      pickerType: "",
      canEdit: false
    };
  },
  watch: {
    currentEndDate: function(val, oldval) {
      if (
        this.currentEffectDate != "未填写" &&
        this.currentEndDate != "未填写" &&
        this.carditem.expiryDate == ""
      ) {
        let curr = new Date(this.currentEffectDateTime);
        let endate = new Date(this.currentEndDateTime);
        if (curr >= endate) {
          this.currentEndDate = "未填写";
        }
      }
    },
    currentEffectDate: function(val, oldval) {
      if (
        this.currentEffectDate != "未填写" &&
        this.currentEndDate != "未填写" &&
        this.carditem.effectDate == ""
      ) {
        let curr = new Date(this.currentEffectDateTime);
        let endate = new Date(this.currentEndDateTime);
        if (curr >= endate) {
          this.currentEffectDate = "未填写";
        }
      }
    }
  },
  methods: {
    getIdCate: function(cateType) {
      if (cateType == 0) {
        return "身份证";
      } else if (cateType == 3) {
        return "台胞证";
      } else if (cateType == 2) {
        return "港澳通行证";
      } else if (cateType == 1) {
        return "护照";
      } else if (cateType == 4) {
        return "边民证";
      } else {
        return "其他";
      }
    },
    //英文名获取焦点
    focusEn() {
      this.canEdit = true;
      // if (this.passportNum == "未填写") {
      //   this.passportNum = "";
      //   this.canEdit = true;
      // }
    },
    //英文名失去焦点
    blurEn() {
      if (this.passportNum == "") {
        this.passportNum = '未填写'
      }
      if (this.pubPassportNum == '') {
        this.pubPassportNum == '未填写'
      }
    },
    pickerClick(type) {
      this.canEdit = true;
      if (type == 1) {
        this.mindate = new Date(1900, 1, 1);
        this.maxdate = new Date();
      } else if (type == 2) {
        this.mindate = new Date(1900, 1, 1);
        this.maxdate = new Date();
      } else if (type == 3) {
        this.mindate = new Date();
        this.maxdate = new Date(2050, 1, 1);
      }
      if (this.carditem.cateType == 0) {
        this.$Toast(this.$i18n.t("loginRegisterLang.birthinputToast"));
        return;
      }
      this.pickerType = type;
      if (!this.showTimePicker) {
        this.showTimePicker = !this.showTimePicker;
      }
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
      let timer = date.getFullYear() + "-" + m + "-" + d;
      if (this.pickerType == 1) {
        this.birthday = timer;
      } else if (this.pickerType == 2) {
        this.currentEffectDate = timer;
        this.currentEffectDateTime = value;
      } else if (this.pickerType == 3) {
        this.currentEndDate = timer;
        this.currentEndDateTime = value;
      }
      this.currentDate = new Date();
      this.showTimePicker = false;
    },
    cancleClick() {
      this.showTimePicker = false;
    },

    timeFormat: function(time) {
      if (time != "") {
        return time.split(" ")[0];
      }
    },
    idcardList(type) {
      let params = {idType:type};
      let url = "/app/json/user/getUserCertificateList";
      this.$Loading.open();
      this.$http
        .post(url, params)
        .then(res => {
          this.$Loading.close();
          let { status, result, info } = res.data;
          if (status == 0) {
            // this.carditem = res.data.data[0];
            if(res.data.data){
              res.data.data.forEach(element => {
                  if(element.cateType == type){
                    this.carditem = element;
                    if(!this.carditem.realName||this.carditem.realName.length<=0){
                      this.carditem.realName = this.carditem.name;
                    }
                    return false;
                  }
              });
            }
            if (!this.carditem.name) {
              this.carditem.name = this.$store.state.userInfo.realName;
            }
            if(!this.carditem.realName){
               this.carditem.realName = this.carditem.name;
            }
            // this.carditem.realName = this.$store.state.userInfo.realName;
            this.passportNum = this.carditem.passportNum ? this.carditem.passportNum : '未填写'
            this.pubPassportNum = this.carditem.pubPassportNum ? this.carditem.pubPassportNum : '未填写'
            // if (!this.carditem.enRealName) {
            //   this.carditem.enRealName = this.$store.state.userInfo.enRealName;
            // }
            // this.currentEnRealName = this.carditem.enRealName
            //   ? this.carditem.enRealName
            //   : "未填写";
            // if (this.carditem.cateType != 0) {
            //   this.currentEffectDate = this.carditem.effectDate
            //     ? this.$util.getMyDate(this.carditem.effectDate)
            //     : "未填写";
            //   this.currentEndDate = this.carditem.expiryDate
            //     ? this.$util.getMyDate(this.carditem.expiryDate)
            //     : "未填写";
            // }
          } else {
            this.$Toast(info);
          }
        })
        .catch(err => {
          this.$Loading.close();
        });
    },
    //提交身份信息验证
    queryBtn() {
        // 提交按钮
        if(this.passportNum == ''){
          thsi.$Toast('护照号不能为空');
          return;
        }else if (this.$util.checkPassport(this.passportNum) == false) {
          this.passportNum = '';
          this.$Toast('护照号填写有误');
          return;
        } else {
          this.$request.post('/app/json/user/passportSubmmit', {
            cateType:1,
            pubPassportNum: this.pubPassportNum, // 公务护照号
            passportNum: this.passportNum, // 普通护照号
          }).then(res => {
            if (res.status === 0) {
              this.$router.go(-1);
            } else {
              this.$Toast(res.info ? res.info : '提交失败')
            }
          })
        }
      },
  },
  created() {
    this.cateType = this.$route.query.type;
    this.idData = this.$route.query.idData || {};
    this.idcardList(this.cateType);

    console.log(this.$route.query.type)
    console.log(this.$route.query.idData)
  }
};
</script>
<style lang="stylus" scoped>
.iddetail {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    background-color: #f6f6f6;

    .list {
      flex: 1;
      overflow-y: auto;
      padding: 20px 20px;

      .list-con {
        background-color: white;
        padding: 0 10px;
        border-radius: 5px;
        margin-bottom: 10px;
      }

      .row {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0px 0px;
        font-size: 18px;

        .label {
          min-width: 100px;
          font-size: 16px;
          // font-weight: 600;
          flex: 2;
        }

        .labelvalue {
          margin-right:10px;
          font-size: 16px;
          text-align: right;
          color: #9FA0A0;
          flex: 1;

          .van-cell {
            font-size: 16px;
          }
        }

        .van {
          padding: 0px 0px;
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
}
</style>
