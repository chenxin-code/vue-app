<template>
  <div class="confirm">
    <div class="product-message">
      <div style="display: flex">
        <img
          src="@/assets/housekeep/jingppinluxian@2x.png"
          alt=""
          class="travel-icon"
        />
        <div class="content-text">
          {{ tourPageParams.spuName }}
        </div>
      </div>
      <div class="contact-message">
        <div><span style="color: #999999">出发日期：</span>{{ startDate }}</div>
        <div>
          <span style="color: #999999">出游人数：</span
          >{{ tourPageParams.adultNum }}成人<span
            v-if="tourPageParams.childNum > 0"
            >,{{ tourPageParams.childNum }}儿童</span
          >
        </div>
      </div>
    </div>

    <div class="trip-people-message">
      <div class="trip-header">
        <div class="left">
          <img src="@/assets/housekeep/出行人@2x.png" />
          <span class="left-text">出行人信息</span>
        </div>
        <div class="right" @click="onChooseTravel">
          <span class="right-text">添加出行人</span
          ><img src="@/assets/housekeep/选择@2x.png" alt="" />
        </div>
      </div>

      <div class="trip-list">
        <div
          v-for="(item, index) in defaultRecords"
          :key="index"
          class="item"
          @click="changeActive(item)"
        >
          <div :class="item.isActive ? 'isActive' : ''">{{ item.name }}</div>
        </div>
      </div>
      <div
        class="divLine-dashed"
        style="margin: 0 15px;"
        v-if="hasActivePerson"
      ></div>

      <div v-for="(item, index) in defaultRecords" :key="index">
        <div class="trip-list-people" v-if="item.isActive">
          <div class="trip-item">
            <img
              src="@/assets/housekeep/delete@2x.png"
              @click="changeActive(item)"
            />
            <div class="trip-people-msg">
              <div class="top">
                {{ item.name }}
                <div
                  class="people-label"
                  :class="item.travlerType == 'ADULT' ? 'adult' : 'child'"
                >
                  <div class="text">
                    {{ item.travelerTypeName }}
                  </div>
                </div>
              </div>
              <div class="bottom">身份证：{{ item.cerNo }}</div>
            </div>
          </div>
          <!-- <div
            class="divLine-dashed"
            style="width: 325px;margin-left: 15px"
          ></div> -->
        </div>
      </div>
    </div>

    <div class="linkman-message">
      <div class="linkman-header">
        <div class="left">
          <img src="@/assets/housekeep/联系人 2@2x.png" />
          <span class="left-text">联系人信息</span>
        </div>
        <!-- <div class="right">
          <span class="right-text">添加联系人</span
          ><img src="@assets/images/housekeep/arrow-icon.png" alt="" />
        </div> -->
      </div>
      <div class="divLine-solid"></div>
      <van-field
        v-model="name"
        label="姓名"
        placeholder="请填写联系人姓名"
        input-align="right"
      />
      <van-field
        v-model="tel"
        type="tel"
        label="手机号"
        placeholder="请填写联系人手机号"
        input-align="right"
        style="border-radius: 12px"
      />
    </div>

    <van-field
      class="remark"
      v-model="remark"
      label="订单备注"
      placeholder="输入订单备注（选填）"
      input-align="right"
    />

    <div class="order-sum">
      <van-cell
        title="订单总金额"
        :value="totalPrize | currencyFormat('¥')"
        value-class="redfont"
        style="border-radius: 12px"
      />
      <div class="divLine-solid"></div>
      <van-cell title="成人" style="border-radius: 12px">
        <div>
          <span style="color:#E8374A"
            >{{ tourPageParams.adultPrices | currencyFormat("¥") }}
          </span>
          <span> x{{ tourPageParams.adultNum }}</span>
        </div>
      </van-cell>
      <van-cell
        title="儿童"
        style="border-radius: 12px"
        v-if="tourPageParams.childNum > 0"
      >
        <div>
          <span style="color: #E8374A"
            >{{ tourPageParams.childPrices | currencyFormat("¥") }}
          </span>
          <span> x{{ tourPageParams.childNum }}</span>
        </div>
      </van-cell>
    </div>
    <!--  -->
    <div class="bottom-button" ref="bottomBtn">
      <div class="left">
        <span>需付款:</span
        ><span class="amt">{{ totalPrize | currencyFormat("¥") }}</span>
      </div>
      <div class="right" @click="submit">提交订单</div>
    </div>
  </div>
</template>

<script>
// import mathFunction from "@/utils/mathTools";
// import traveler from "@/api/request/apiAddress/traveler";
// import orderService from "@request/orderService";
export default {
  components: {
  },
  data() {
    return {
      hasActivePerson: false,
      tourPageParams: {
        spuName: '拉萨+林芝+山南+布达拉宫+大峡谷8日7晚跟团游（5钻）',
        adultNum: '79adkalb',
        childNum: 2,
        adultPrices:20,

      },
      defaultRecords: [
        {name:'张三',isActive:true,travlerType:'ADULT',travelerTypeName:'成人',cerNo:'4409************339'},
        {name:'张三'},
        {name:'张三',isActive:true,travlerType:'ADULT',travelerTypeName:'儿童',cerNo:'4409************339'},
        {name:'张三'},
      ],
      name: "",
      tel: "",
      remark: "",
      preTripList: [],
      startDate: "109908",
      totalPrize: 1986
    };
  },
  activated() {
    // console.log("tourPage_data", this.$util.storages().get("tourPage_data"));
    // this.tourPageParams = this.$util.storages().get("tourPage_data");
    // let { adultNum, childNum, adultPrices, childPrices } = this.tourPageParams;
    // console.log(444);
    // console.log(this.tourPageParams);
    // this.totalPrize = adultNum * adultPrices + childNum * childPrices;

    // this.startDate = this.tourPageParams.adultObj.time;
    // this.preTripList = [
    //   ...this.$store.state.traveler.travelPerson.travelerDtoList
    // ];
    // console.log("preTripList---->", this.preTripList);
    // this.defaultRecords = JSON.parse(JSON.stringify(this.preTripList));
    // this.defaultRecords.forEach(item => {
    //   console.log("item", item);
    //   this.$set(item, "isActive", true);
    // });
  },
  created() {
    // traveler
    //   .getTravelerList({
    //     pageNum: 1,
    //     pageSize: 4
    //   })
    //   .then(({ data, code }) => {
    //     if (code == 200) {
    //       this.defaultRecords = data.records;
    //       this.defaultRecords.forEach(item => {
    //         this.$set(item, "isActive", false);
    //       });
    //     }
    //   });
  },
  methods: {
    //校验出行人信息
    vaildTravelForm() {
      const adultNum = this.tourPageParams.adultNum;
      const childrenNum = this.tourPageParams.childNum;
      const travelerSelectList = this.defaultRecords.filter(item => {
        return item.isActive == true;
      });

      const nullPhone = travelerSelectList.every(item => {
        return !item.phone;
      });
      const selectAudlt = travelerSelectList.filter(its => {
        return its.travlerType == "ADULT";
      });
      const selectChildren = travelerSelectList.filter(its => {
        return its.travlerType == "CHILD";
      });
      const selectAudltNum = selectAudlt.length;
      const selectChildrenNum = selectChildren.length;
      let message = "";
      return new Promise((resolve, reject) => {
        if (
          adultNum == selectAudltNum &&
          childrenNum == selectChildrenNum &&
          !nullPhone
        ) {
          resolve();
        } else {
          if (adultNum !== selectAudltNum) {
            if (adultNum > 0 && childrenNum > 0) {
              message = `请按您的出行人数添加旅客：<br> ${adultNum}成人 ${childrenNum}儿童`;
            } else {
              message = `请按您的出行人数添加旅客：<br> ${adultNum}成人`;
            }
          }
          if (childrenNum !== selectChildrenNum) {
            if (adultNum > 0 && childrenNum > 0) {
              message = `请按您的出行人数添加旅客：<br> ${adultNum}成人 ${childrenNum}儿童`;
            } else {
              message = `请按您的出行人数添加旅客：<br>  ${childrenNum}儿童`;
            }
          }
          if (adultNum == 0 && childrenNum > 0) {
            message = `出于安全考虑，<br> 18岁以下未成年人需要至少一名成年旅客陪同`;
          }
          if (nullPhone) {
            message = `请至少填写一位出行旅客的手机号码`;
          }
          if (message) {
            this.$dialog({
              message: message,
              confirmButtonText: "我知道了"
            });
          }
          reject();
        }
      });
    },
    changeActive(item) {
      item.isActive = !item.isActive;
      this.hasActivePerson = this.defaultRecords.some(item => {
        return item.isActive == true;
      })
    },
    check() {
      let flag = false;
      let message = "";
      if (!this.tel) {
        message = "联系人手机号不能为空";
        flag = true;
      }
      if (!this.name) {
        flag = true;
        message = "联系人名字不能为空";
      }
      if (!this.$util.checkInvoiceMobile(this.tel)) {
        flag = true;
        message = "请输入正确手机号";
      }

      if (flag) {
        this.$dialog({
          message: message,
          confirmButtonText: "好的"
        });
      }
      return flag;
    },
    async submit() {
      await this.vaildTravelForm();
      let flag = this.check();
      if (flag) {
        return;
      }
      let {
        adultNum,
        childNum,
        adultPrices,
        childPrices,
        businessTypeId,
        adultObj,
        childObj,
        projectCommunityId
      } = this.tourPageParams;
      adultObj.buyNum = adultNum;
      childObj.buyNum = childNum;
      const travelerIdList = this.defaultRecords.filter(item => {
        if (item.isActive) {
          return item.id;
        }
      });
      let params = {
        orderItemList: [],
        travelInfo: {
          contactsName: this.name,
          contactsPhone: this.tel,
          depDate: this.startDate,
          audltNum: adultNum,
          childNum: childNum
        },
        travelerIdList: travelerIdList.map(item => item.id),
        billType: 13,
        orderSource: "TIMES_XINGXUAN",
        orderType: "TRAVEL",
        paymentMethod: "ONLINE",
        projectId: projectCommunityId,
        tradeRemark: this.remark
      };
      params.orderItemList.push(adultObj);
      params.orderItemList.push(childObj);
      console.log("params", JSON.stringify(params));
      //切换为一键支付
      this.$wxsdk.payWay(params);
    },
    //添加/编辑出行人
    onChooseTravel() {
      let params = {
        adultNum: this.tourPageParams.adultNum,
        childrenNum: this.tourPageParams.childNum,
        travelerDtoList: this.defaultRecords.filter(item => {
          return item.isActive;
        })
      };
      this.$store.dispatch("traveler/setTravelPerson", params);
      this.$router.push({
        path: "/travel/chooseTravel"
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.confirm::-webkit-scrollbar { width: 0 !important }
.confirm{
  overflow: auto;
  padding-bottom: 100px;
  background: #F8F8F8  !important;
}
.redfont {
  color: #e8374a;
}
.divLine-solid {
  width: 323px;
  margin-left: 15px;
  height: 1 / 2px;
  background: #f0f0f0;
}
.divLine-dashed {
  border: 1px dashed #f0f0f0;
}
.product-message {
  width: 351px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  border-radius: 12px;
  margin: 20px 0 0 12px;
  padding-bottom: 5px;
  .travel-icon {
    width: 30px;
    height: 30px;
    margin: 20px 8px 0 16px;
  }
  .content-text {
    margin-top: 20px;
    width: 287px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #121212;
    line-height: 20px;
  }
  .contact-message {
    margin: 8px 0 15px 20px;
    font-size: 12px;
    // font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    >div{
      padding-bottom :5px;
    }
  }
}
.trip-people-message {
  width: 351px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  border-radius: 12px;
  margin: 12px;
  .trip-header {
    display: flex;
    justify-content: space-between;
    height: 53px;
    line-height: 53px;
    align-items: center;
    .left {
      display: flex;
      margin-left: 15px;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
      .left-text {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #121212;
        margin-left: 8px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      margin-right: 15px;
      .right-text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      img {
        width: 16px;
        height: 16px;
        margin-left: 8px;
      }
    }
  }
  .trip-list {
    display: flex;
    text-align: center;
    flex-wrap: wrap;
    .isActive {
      background: #e8374a;
      color: #ffffff;
      border-radius: 8px;
    }
    .item {
      margin: 8px;
      width: 20%;
      height: 32px;
      line-height: 32px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e5e5;
    }
  }

  .trip-list-people {
    .trip-item {
      display: flex;
      align-items: center;
      width: 351px;
      height: 50px;
      padding-left: 15px;
      box-sizing :border-box;
      img {
        width: 16px;
        height: 16px;
      }
      .trip-people-msg {
        display: flex;
        margin-left: 15px;
        flex-direction: column;
        .top {
          display: flex;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          align-items: center;
          .people-label {
            width: 28px;
            height: 16px;

            border-radius: 9px;
            font-size: 9px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 16px;
            text-align: center;
            margin-left: 10px;
            .text {
              transform: scale(0.8);
            }
          }
          .child {
            background: #edfffb;
            color: #2acfa6;
          }
          .adult {
            background: #fcecee;
            color: #e8374a;
          }
        }
        .bottom {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
        }
      }
    }
  }
}

.linkman-message {
  width: 351px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  border-radius: 12px;
  margin: 12px;
  .linkman-header {
    display: flex;
    justify-content: space-between;
    height: 53px;
    line-height: 53px;
    align-items: center;
    .left {
      display: flex;
      margin-left: 15px;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
      .left-text {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #121212;
        margin-left: 8px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      margin-right: 15px;
      .right-text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      img {
        width: 16px;
        height: 16px;
        margin-left: 8px;
      }
    }
  }
}
.remark {
  width: 351px;
  margin: 12px;
  border-radius: 12px;
}
.order-sum {
  width: 351px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  border-radius: 12px;
  margin: 12px 0 80px 12px;
}

.times-button {
  margin-top: 20px;
  padding: 5px 15px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #ffffff;
  .slot-content {
    width: 50%;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121212;
    }
    .amt {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #e8374a;
    }
  }
}
.bottom-button {
  display: flex;
  padding: 0 20px;
  box-sizing :border-box;
  justify-content: space-between;
  align-items :center;
  width: 375px;
  height: 98px;
  background: #ffffff;
  position: fixed;
  bottom: 0;

  .left {
    display: flex;
    span {
      font-size: 15px;
      transform: scale(0.8);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121212;
    }
    .amt {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #e8374a;
    }
  }
  .right {
    width: 240px;
    height: 39px;
    background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
    border-radius: 8px;
    text-align: center;
    line-height: 39px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
