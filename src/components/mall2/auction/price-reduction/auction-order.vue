<template>
  <div class="placeorder mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <!-- 选择地址 -->
      <div class="block-div no-padding-bottom">
        <div
          v-if="$store.state.mall2.selectAddress.id > 0 && deliveryType == 2"
          @click="toSelectAddress">
          <div class="flex-row">
            <div class="name theme_font_black">{{$store.state.mall2.selectAddress.receiverName}}</div>
            <div class="name theme_font_black">{{$store.state.mall2.selectAddress.mobile}}</div>
            <div
              class="act-item-full theme_standard_bg theme_font_white"
              v-if="$store.state.mall2.selectAddress.isDefault == 1">默认</div>
          </div>
          <div class="flex-row">
            <div class="full theme_font_tint font-small">{{$store.state.mall2.selectAddress.addressFull}}</div>
            <div>
              <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
            </div>
          </div>
        </div>
        <div
          v-if="(!($store.state.mall2.selectAddress.id > 0)) && deliveryType == 2"
          @click="toSelectAddress">
          <div class="flex-row">请选择地址信息</div>
        </div>
        <div class="colorfulline">
          <img src="static/image/mall2/colorfulline.png" />
        </div>
      </div>
      <!-- 支付方式 -->
      <div class="block-div">
        <div class="flex-row" @click="payWayShow">
          <div class="label-middle theme_font_common">支付方式</div>
          <div class="full"></div>
          <div class="theme_font_common right-margin">{{payWayText}}</div>
          <div>
            <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
          </div>
        </div>
      </div>
      <!-- 商品信息 -->
      <div class="block-div">
        <p class="institution-name">{{ prodInfoData.creatorOuName }}</p>
        <div class="prod-container">
          <img :src="prodInfoData.pic" alt="" class="prod-img">
          <div class="right">
            <p class="prod-name">{{ prodInfoData.skuName }}</p>
            <p class="prod-price">￥<span>{{ dealWithPrice(prodInfoData.onSalePrice)[0] }}</span>.{{ dealWithPrice(prodInfoData.onSalePrice)[1] }}</p>
            <span class="prod-num">x {{ prodInfoData.auctionSaleNum }}</span>
          </div>
        </div>
        <div class="flex-row">
          <div class="label-middle theme_font_common">备注</div>
          <div class="full">
            <input
              class="row-input theme_font_common"
              placeholder="请留下您想说的话"
              v-model="params.remark"/>
          </div>
        </div>
      </div>
      <!-- 发票 -->
      <div class="block-div">
        <div class="flex-row">
          <div class="title full theme_font_common">发票</div>
          <div class="swith" @click="useInvoiceEvent">
            <img v-if="useInvoice" src="static/image/mall2/switch-on.png"/>
            <img v-if="!useInvoice" src="static/image/mall2/switch-off.png"/>
          </div>
        </div>
        <div class="flex-row" v-if="useInvoice" @click="changeInvoice">
          <div class="label-middle theme_font_common">发票信息</div>
          <div class="full"></div>
          <div
            class="theme_font_black right-margin"
            :class="{theme_font_tint: invoiceInfo == ''}">
            {{invoiceInfo != '' ? invoiceInfo : '请编辑发票信息'}}
          </div>
          <div>
            <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
          </div>
        </div>
      </div>
      <!-- 商品汇总信息 -->
      <div class="block-div">
        <p class="auction-price-tips">降价拍不支持立减、优惠券和积分等任何优惠方式抵扣</p>
        <div class="flex-row">
          <div class="label-middle full theme_font_common">商品金额</div>
          <div class="theme_font_black">￥{{ dealWithPrice(prodInfoData.auctionSaleNum * prodInfoData.onSalePrice)[2] }}</div>
        </div>
        <div class="flex-row">
          <div class="label-middle full theme_font_common">运费</div>
          <div class="theme_font_red">
            +￥{{ dealWithPrice(prodInfoData.freightAmount)[2] }}
          </div>
        </div>
      </div>
      <!-- 提交 -->
      <div class="bottom-btns">
        <p class="result-price">￥<span>{{ dealWithPrice(prodInfoData.auctionSaleNum * prodInfoData.onSalePrice + prodInfoData.freightAmount)[0] }}</span>.{{ dealWithPrice(prodInfoData.auctionSaleNum * prodInfoData.onSalePrice + prodInfoData.freightAmount)[1] }}</p>
        <div class="tip theme_bg_yl theme_standard_font theme_light_bg">{{ $store.state.mall2.selectAddress.addressFull }}</div>
        <div class="btn theme_standard_bg theme_font_white" @click="checkProductStock">提交订单</div>
      </div>
    </nav-content>

    <!-- 更改支付方式 -->
    <pop-view v-if="payWayPopShow" @closeEvent="payWayPopShow = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">请选择支付方式</div>
        <div class="items-div pop-scroll-div">
          <div
            class="item theme_font_common theme_bg_white_ef"
            style="width: 100%; margin-bottom: 10px;"
            :class="{
              theme_light_bg: payWaySelected == payway.tag,
              theme_standard_font_i: payWaySelected == payway.tag,
              theme_standard_bdr_i: payWaySelected == payway.tag
            }"
            @click="payWayEvent(payway)"
            v-for="(payway, index) in payWays"
            :key="index">{{ payway.text }}</div>
        </div>
        <div
          class="bottom-btn theme_font_white theme_standard_bg bottom-space"
          @click="popSureEvent">确定
        </div>
      </div>
    </pop-view>
  </div>
</template>
<script>
import Invoice from "@/components/mall2/common/invoice";
import Freight from "@/components/mall2/common/freight";

export default {
  data() {
    return {
      deliveryType: 2,
      payWays: [
        {
          text: "在线支付",
          tag: "1"
        },
        {
          text: "货到付款",
          tag: "0"
        },
        {
          text: "提货付款",
          tag: "0"
        }
      ],
      payWayText: "在线支付",
      payWaySelected: 1,
      payWayPopShow: false,
      prodInfoData: {},
      params: {
        remark: '',
      },
      useInvoice: false,
      invoiceData: null,
      invoiceInfo: "",
      currentInvoice: {},
    }
  },
  mounted() {
    console.log(this.$route.query.auctionProdData)
    this.prodInfoData = JSON.parse(this.$route.query.auctionProdData)
  },
  methods: {
    toSelectAddress: function () {
      this.$router.push({
        path: "/mall2/addresslist"
      });
    },
    payWayShow() {
      this.payWayPopShow = true;
    },
    payWayEvent(payway) {
      if (payway.tag == 0) {
        this.$Toast("暂不支持！");
        return;
      }
      this.payWaySelected = payway.tag;
      this.payWayText = payway.text;
    },
    popSureEvent() {
      this.payWayPopShow = false;
    },
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = Number(price);
      if (!price) {
        return [0, 0, `0.00`];
      }
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum, `${integerNum}.${decimalNum}`];
    },
    // 获取前面已填写的发票
    useInvoiceEvent() {
      this.useInvoice = !this.useInvoice;
      if (this.useInvoice && this.invoiceData == null) {
        this.$Loading.open();
        let url = "/app/json/order_invoice/loadTwoTypeDefaultUserInvoiceHead";
        let paramsData = {
          token: this.$store.state.login.token
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.invoiceData = data.data;
              if (this.invoiceData.current == "personal") {
                this.currentInvoice = this.invoiceData.personal;
                this.currentInvoice.name = this.invoiceData.personal.title;
                this.invoiceInfo = this.invoiceData.personal.title;
                this.currentInvoice.type = 0;
              } else {
                this.currentInvoice.type = 1;
                this.currentInvoice = this.invoiceData.company;
                this.currentInvoice.invoiceTitle = this.invoiceData.company.title;
                this.invoiceInfo = this.invoiceData.company.title;
              }
              this.invoiceData.phone = this.$store.state.login.phone;
              this.invoiceData.email = this.$store.state.userInfo.email;
              this.invoiceData.name = this.$store.state.userInfo.nickName;
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        );
      }
    },
    changeInvoice() {
      Invoice.open({
        initData: {
          ...this.invoiceData,
          token: this.$store.state.login.token
        },
        selectedInvoice: invoice => {
          this.currentInvoice = invoice;
          if (invoice.type == 0) {
            // 个人
            this.invoiceInfo = "个人";

            this.invoiceData.personal.title = invoice.name;
            this.invoiceData.personal.userPhone = invoice.phone;
            this.invoiceData.personal.userEmail = invoice.email;
          } else {
            // 公司
            this.invoiceInfo = invoice.company;

            this.invoiceData.company.userPhone = invoice.phone;
            this.invoiceData.company.userEmail = invoice.email;
            this.invoiceData.company.orgTaxNo = invoice.identifyNumber;
            this.invoiceData.company.title = invoice.company;
          }
          Invoice.close();
        }
      });
    },
    // 提交订单
    checkProductStock() {
      // 降价拍下单
      let params = {
        auctionId: this.prodInfoData.id,
        payAmount: this.prodInfoData.onSalePrice * this.prodInfoData.auctionSaleNum,
        freightAmount: this.prodInfoData.freightAmount,
        salePrice: this.prodInfoData.onSalePrice,
        auctionCount: this.prodInfoData.auctionSaleNum,
        userAddressId: this.$store.state.mall2.selectAddress.id,
        provinceId: this.$store.state.mall2.selectAddress.provinceId,
        provinceName: this.$store.state.mall2.selectAddress.provinceName,
        cityId: this.$store.state.mall2.selectAddress.cityId,
        cityName: this.$store.state.mall2.selectAddress.cityName,
        countryId: this.$store.state.mall2.selectAddress.countryId,
        countryName: this.$store.state.mall2.selectAddress.countryName,
        townId: this.$store.state.mall2.selectAddress.townId,
        townName: this.$store.state.mall2.selectAddress.townName,
        address: this.$store.state.mall2.selectAddress.address,
        receiver: this.$store.state.mall2.selectAddress.receiverName,
        mobile: this.$store.state.mall2.selectAddress.mobile,
        remark: this.params.remark,
      };
      if (this.useInvoice) { // 开发票
        params.invoiceUserMake = 1;
        params.invoiceType = 0;

        if (this.invoiceInfo) {
          if (this.invoiceInfo == '个人') {
            params.invoiceTitleType = 4;
            params.invoiceTitle = this.$store.state.mall2.selectAddress.receiverName;
            params.invoiceUserName = this.invoiceData.personal.userName
            params.invoiceUserEmail = this.invoiceData.personal.userEmail;
            params.invoiceUserMobile = this.invoiceData.personal.userPhone;
            params.companyAddress = this.invoiceData.personal.companyAddress;
          } else {
            params.invoiceTitleType = 5;
            params.invoiceTitle = this.invoiceInfo;
            params.invoiceUserName = this.invoiceData.company.userName
            params.invoiceUserEmail = this.invoiceData.company.userEmail;
            params.invoiceUserMobile = this.invoiceData.company.userPhone;
            params.companyAddress = this.invoiceData.company.companyAddress;
            params.invoiceUserOrgTaxNo = this.invoiceData.company.invoiceUserOrgTaxNo;
          }
        } else {
          this.$Toast('请设置发票信息');
        }
      } else {
        params.invoiceUserMake = 0;
      }
      
      this.$Loading.open();
      this.$http.post('/app/json/app_product_auction/submit', params).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.$router.replace({
            path: '/mall2/checkstand',
            query: {
              payInfo: JSON.stringify(data.data),
              occurOuCode: data.data.occurOuCode,
              // orderCategory: this.paramsData.orderCategory,
              // vipUnitUserCode: this.paramsData.vipUnitUserCode
            }
          })
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.colorfulline {
  margin: 0 -8px;
  height: 3px;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.institution-name {
  font-size 16px;
  font-weight 700;
}
.auction-price-tips {
  font-size 12px;
  color $color-text-d;
  padding 10px 0;
}
.prod-container {
  display flex;
  margin 10px 0;
  .prod-img {
    display block;
    width 80px;
    height 80px;
  }
  .right {
    padding-left 10px;
    font-size 14px;
    flex 1;
    position relative;
    display flex;
    flex-direction column;
    justify-content space-between;
    .prod-name {
      line-height 20px;
      ellipse-2();
      margin-top 12px;
    }
    .prod-price {
      font-size 12px;
      color $color-theme-r;
      margin-bottom 12px;
      span {
        font-size 15px;
      }
    }
    .prod-num {
      position absolute;
      right 0
      bottom 12px;
    }
  }
}

.bottom-btns {
  overflow: hidden;
  position absolute;
  left 0
  right 0
  bottom 0;
  .result-price {
    position absolute;
    left 20px;
    top 50%;
    font-size 15px;
    color $color-theme-r;
    span {
      font-size 20px;
    }
  }

  .tip {
    padding: 5px 15px;
    display: flex;
    align-items: center;
    font-size: $font-size-small;
    line-height: 16px;

    i {
      margin: 6px;
      font-size: 15px;
    }
  }

  .price {
    height: 50px;
    overflow: hidden;
    padding: 0px 10px 0 20px;
    font-size: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .digital-div {
      padding-top: 3px;
      display: inline-block;
      font-size: 0px;

    }

    span {
      font-size: 14px;
      margin: 0;
      padding: 0;
    }

    .price-big {
      font-size: 20px;
    }
  }

  .btn {
    float: right;
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding: 0 25px;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
