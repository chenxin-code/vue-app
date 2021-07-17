<template>
  <div class="edit-travel-content">
    <div class="travel-content">
      <div class="van-traverl-form">
        <van-form ref="form">
          <div class="van-form-header">
            请确保姓名和证件一致
          </div>
          <div class="van-form-content">
            <div class="van-form-item">
              <div class="form-item-title required">
                姓名
              </div>
              <div class="form-item-content">
                <van-field
                  v-model="travelForm.name"
                  label=""
                  placeholder="请输入姓名"
                  :rules="rules.name"
                />
              </div>
            </div>
            <div class="van-form-item">
              <div class="form-item-title required">
                证件类型
              </div>
              <div class="form-item-content">
                <van-field
                  required
                  readonly
                  clickable
                  label=""
                  :value="travelForm.cerLabel"
                  :rules="rules.cerNo"
                  placeholder="选择证件类型"
                  @click="showPicker = true"
                />
                <van-popup v-model="showPicker" round position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="columns"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"
                  />
                </van-popup>
              </div>
            </div>
            <div class="van-form-item">
              <div class="form-item-title required">
                证件号码
              </div>
              <div class="form-item-content">
                <van-field
                  v-model="travelForm.cerNo"
                  label=""
                  maxlength="18"
                  placeholder="请输入证件号码"
                  :rules="rules.cerNo"
                />
              </div>
            </div>
            <div class="van-form-item">
              <div class="form-item-title">
                手机号码
              </div>
              <div class="form-item-content">
                <van-field
                  v-model="travelForm.phone"
                  label=""
                  type="tel"
                  placeholder="请输入手机号码"
                  :rules="rules.phone"
                />
              </div>
            </div>
          </div>
        </van-form>
      </div>
    </div>
    <div class="travel-notice">
      <div class="travel-item travel-agree">
        <van-checkbox
          class="van-checkbox__agree"
          v-model="checked"
          checked-color="#4ed84b"
          icon-size="16"
          >阅读并同意</van-checkbox
        >
      </div>
      <div class="travel-item">
        <div class="rich-text">
          您已知晓您在邻里邦Pro录入的旅客身份证信息，将用于您预订所有需要实名制的旅游产品，
          并在使用时进行验证，请确保此信息的真实有效，我们将通过加密等方式保护此信息，
          且仅在有具体交易时授权提供给相关第三方。
        </div>
      </div>
    </div>
    <timesConfirmButton @submit-click="onSubmit" />
  </div>
</template>

<script>
import traveler from "@/api/request/apiAddress/traveler";
import { cerTypeList } from "./hooks";
export default {
  name: "edit-travel",
  components: {
    // Home
  },
  data() {
    return {
      checked: false,
      showPicker: false,
      cerTypeList: cerTypeList(),
      columnsValue: ["ID"],
      columns: ["身份证"],
      travelForm: {
        cerNo: "",
        cerType: "ID",
        id: "",
        name: "",
        phone: "",
        userId: "",
        cerLabel: "身份证"
      },
      rules: {
        name: [{ required: true }],
        cerLabel: [{ required: true }],
        cerNo: [{ required: true }],
        phone: [{ validator: this.validatorIphone, required: true , message: '请输入正确格式手机号' }],
        checked: [{ required: true }]
      }
    };
  },
  created() {
    // if (!this.$util.judgeType()) {
    //   this.$refs.bottomBtn.style.height = "70px";
    // }
  },
  mounted() {
    //获取表单数据form
    const isBuild = this.$route.query.isBuild;
    if (isBuild) {
      this.travelForm = {
        ...this.travelForm,
        ...this.editTravelPerson,
        cerLabel: this.editTravelPerson.cerTypeName
      };
      this.checked = true;
    } else {
      this.travelForm = {
        ...this.travelForm,
        cerLabel: this.editTravelPerson.cerTypeName
      };
    }
  },
  computed: {
    //编辑出行人信息
    editTravelPerson() {
      return this.$store.state.traveler.editTravelPerson;
    }
  },
  methods: {
    validatorIphone(num) {
      return this.$util.checkInvoiceMobile(num);
    },
    //校验
    vaildForm() {
      return new Promise((resole, reject) => {
        if (!this.checked) {
          this.$toast({
            message: "请勾选并阅读并同意该协议"
          });
          reject();
          return;
        }
        this.$refs.form
          .validate()
          .then(res => {
            // 验证通过
            console.log("res----->", res);
            resole();
          })
          .catch(err => {
            //验证失败
            console.log("err----->", err);
            reject();
          });
      });
    },
    //提交
    async onSubmit(values) {
      console.log("submit--->", values);
      await this.vaildForm();
      this.saveOrUpdateTraveler();
    },
    //选择身份
    onConfirm(value) {
      const iDEX = this.columns.indexOf(value);
      this.travelForm.cerLabel = value;
      this.travelForm.cerType = this.columnsValue[iDEX];
      this.showPicker = false;
    },
    //切换支付tab状态栏
    onTab(item) {
      console.log("onTab---->", item);
    },
    //新增一个保存修改出行人信息
    saveOrUpdateTraveler() {
      const params = {
        cerNo: this.travelForm.cerNo,
        cerType: this.travelForm.cerType,
        id: this.travelForm.id,
        name: this.travelForm.name,
        phone: this.travelForm.phone,
        userId: this.travelForm.userId
      };
      traveler.saveOrUpdateTraveler(params).then(res => {
        console.log("saveOrUpdateTraveler--->", res);
        if (res.code == 200) {
          console.log("res--->", res);
          this.$router.back();
        } else {
          if (res.message) {
            this.$toast(res.message);
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.edit-travel-content {
  .travel-content {
    .van-form {
      margin: 12px;
      padding: 20px;
      background-color: #fff;
      border-radius: 6px;
      .van-form-header {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e8374a;
        line-height: 20px;
        margin-bottom: 20px;
      }
      .van-form-item {
        margin-bottom: 10px;
        .form-item-title {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #121212;
          line-height: 20px;
          &.required::before {
            content: "*";
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #e8374a;
            line-height: 20px;
          }
        }
      }
    }
  }
  .travel-notice {
    margin: 0 12px 70px 12px;
    .travel-agree {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
    .rich-text {
      margin-top: 6px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
  }
  .travel-submit {
    .bottom-button {
      width: 375px;
      height: 98px;
      background: #ffffff;
      box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
      position: fixed;
      bottom: 0;
      .confirm-button {
        margin-top: 13px;
        width: 324px;
        height: 49px;
        background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
        border-radius: 12px;
        margin-left: 25px;
        text-align: center;
        line-height: 49px;
        color: #ffffff;
        font-size: 14px;
      }
    }
  }
}
</style>
