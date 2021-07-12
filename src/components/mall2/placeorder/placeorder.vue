/**Created by liaoyingchao on 2018/11/2.*/

<template>
  <div class="placeorder mall2">
    <nav-top @backEvent="$router.go(-1)" v-if="!noNavTop"></nav-top>
    <nav-content v-if="complete" :style="getContentTop()">
      <div class="flex-div">
        <div class="scroll-div">
          <div
            class="block-div no-padding-bottom"
            v-if="
              (buyType != 'songli' &&
                deliveryType == 2 &&
                occurData.needAddress == 1 &&
                $route.params.productType != 514) ||
                (deliveryType == 1 &&
                  $route.query.entryType != 'wish' &&
                  $route.params.productType != 514)
            "
          >
            <div
              v-if="
                $store.state.mall2.selectAddress.id > 0 && deliveryType == 2
              "
              @click="toSelectAddress"
            >
              <div class="flex-row">
                <div class="name theme_font_black">
                  {{ $store.state.mall2.selectAddress.receiverName }}
                </div>
                <div class="name theme_font_black">
                  {{ $store.state.mall2.selectAddress.mobile }}
                </div>
                <div
                  class="act-item-full theme_standard_bg theme_font_white"
                  v-if="$store.state.mall2.selectAddress.isDefault == 1"
                >
                  默认
                </div>
              </div>
              <div class="flex-row">
                <div class="full theme_font_tint font-small">
                  {{ $store.state.mall2.selectAddress.addressFull }}
                </div>
                <div>
                  <i
                    class="iconfont mall-gengduojiantou theme_font_tint icon-font"
                  ></i>
                </div>
              </div>
            </div>
            <div
              v-if="
                !($store.state.mall2.selectAddress.id > 0) &&
                  deliveryType == 2 &&
                  $route.params.productType != 514
              "
              @click="toSelectAddress"
            >
              <div class="flex-row">请选择地址信息</div>
            </div>
            <div
              v-if="
                $store.state.mall2.zitiAddress.id > 0 &&
                  deliveryType == 1 &&
                  $route.params.productType != 514
              "
              @click="toSelectZitiAddress"
            >
              <div class="pickup-shop">
                <div style="flex: 1">
                  <div class="flex-row">
                    <div class="name theme_font_black">
                      自提店铺：{{ $store.state.mall2.zitiAddress.storeName }}
                    </div>
                  </div>
                  <div class="flex-row">
                    <div
                      class="full theme_font_tint font-small"
                      style="line-height: 1.4"
                    >
                      {{ $store.state.mall2.zitiAddress.addressFull }}
                      {{
                        $store.state.mall2.zitiAddress.phone &&
                        $store.state.mall2.zitiAddress.phone != ""
                          ? "(" + $store.state.mall2.zitiAddress.phone + ")"
                          : ""
                      }}
                    </div>
                  </div>
                </div>
                <div>
                  <i
                    class="iconfont mall-gengduojiantou theme_font_tint icon-font"
                  ></i>
                </div>
              </div>
            </div>
            <div class="colorfulline">
              <img src="static/image/mall2/colorfulline.png" />
            </div>
          </div>

          <div
            class="block-div"
            v-if="deliveryType == 1 && $route.params.productType != 514"
          >
            <div class="flex-row">
              <div class="title theme_font_black">提货人信息</div>
            </div>
            <div class="flex-row flex-row-smallbottom">
              <div class="label-middle theme_font_common" style="width: 2.6rem">
                姓名
              </div>
              <div class="full">
                <input
                  class="row-input"
                  placeholder="请输入提货人姓名"
                  v-model="$store.state.mall2.pickUpUser"
                />
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle theme_font_common" style="width: 2.6rem">
                联系方式
              </div>
              <div class="full">
                <input
                  class="row-input"
                  placeholder="请输入提货人联系方式"
                  v-model="pickupPhone"
                />
              </div>
            </div>
            <div
              class="flex-row"
              @click="openPicker"
              v-if="
                hasShengxian == false &&
                  $store.state.globalConfig.order_pickup_time_selecter_show !=
                    'false'
              "
            >
              <!--没有生鲜的时候才能选时间-->
              <div class="label-middle theme_font_common" style="width: 2.6rem">
                预约自提时间
              </div>
              <div
                class="full theme_font_common"
                :class="{ theme_font_tint_i: pickupTime == '' }"
                style="text-align: right"
                v-if="pickupTime"
              >
                {{ pickerConfirm(pickupTime) }}
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
            <div class="flex-row" v-if="hasShengxian == true">
              <!--生鲜提货时间是配置的，不能选择-->
              <div class="pick-up-tip">
                提货时间：{{ getSelectReceiveTime() }}到{{
                  getReceiveEndTime()
                }}，超过自提时间后系统将自动取消订单<span
                  v-if="
                    $store.state.globalConfig.order_fresh_pickup_cancel_type !=
                      '0'
                  "
                  >并退款</span
                ><span
                  v-if="
                    $store.state.globalConfig.order_pickup_cancel_tip_extend
                  "
                  >{{
                    $store.state.globalConfig.order_pickup_cancel_tip_extend
                  }}</span
                >
              </div>
            </div>
            <div
              class="flex-row"
              v-else-if="
                $store.state.globalConfig.order_pickup_cancel_tip_show !=
                  'false' && $store.state.globalConfig.presaleType != 2
              "
            >
              <div class="pick-up-tip">
                请于{{
                  pickUpEndTime
                }}之前提货，超过自提时间后系统将自动取消订单并退款<span
                  v-if="
                    $store.state.globalConfig.order_pickup_cancel_tip_extend
                  "
                  >{{
                    $store.state.globalConfig.order_pickup_cancel_tip_extend
                  }}</span
                >
              </div>
            </div>
          </div>

          <!-- 心愿单 -->
          <div
            class="block-div wish-message-container"
            v-if="$route.query.entryType == 'wish'"
          >
            <div class="top">
              <p class="title">对TA说的话</p>
              <span class="random-btn" @click="getWishMsg()">随机换一句</span>
            </div>
            <div class="msg-input-c">
              <van-field
                type="textarea"
                class="msg-input"
                v-model="wishData.payMsg"
                placeholder="请输入想说的话"
              />
            </div>
            <div class="nick-container">
              <p class="nick-title">留言昵称</p>
              <input
                type="text"
                v-model="wishData.payNiceName"
                class="name"
                placeholder="请输入昵称"
              />
            </div>
          </div>

          <div class="block-div" v-if="occurData.needVirtualUserPhone == '1'">
            <div class="flex-row">
              <div class="right-margin theme_font_common">接收短信的手机号</div>
              <div class="theme_font_common">
                {{ $store.state.login.phone }}
              </div>
            </div>
            <div class="flex-row theme_font_tint">
              <div class="font-small">
                购买成功后相关短信会自动发送到您手机上
              </div>
            </div>
          </div>

          <!-- 支付方式 -->
          <div class="block-div">
            <div class="flex-row" @click="payWayShow">
              <div class="label-middle theme_font_common">支付方式</div>
              <div class="full"></div>
              <div class="theme_font_common right-margin">{{ payWayText }}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>
          <div class="block-div" v-if="pageType == 2">
            <div class="flex-row" @click="contratWayShow">
              <div class="label-middle theme_font_common" style="width: 100px">
                预约单联系方式
              </div>
              <div class="full"></div>
              <div class="theme_font_common right-margin">
                {{ contratWayText }}
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
            <div class="" v-if="contratWayText != '选择联系方式'">
              <van-cell title="姓名：" :value="selectItem.realName" />
              <van-cell title="联系电话：" :value="selectItem.userName" />
            </div>
          </div>

          <div class="block-div" v-for="store in occurData.store">
            <!--{{returnStoreProducts(store)}}-->
            <!--            <div class="flex-row">-->
            <!--              <div class="name">{{store.storeName}}</div>-->
            <!--            </div>-->
            <div v-if="store.storeProData.num == 1">
              <div class="pro-row" v-for="prodata in store.storeProData.proArr">
                <div class="img-div">
                  <img :src="prodata.phPictureUrl" />
                  <div class="presale" v-if="paramsData.cartType == 1">
                    预售
                  </div>
                </div>
                <div class="info-div">
                  <div class="title theme_font_black">
                    {{ prodata.productName }}
                  </div>
                  <div class="title theme_font_black">
                    <span>{{ prodata.specs }}</span>
                  </div>
                  <div class="price">
                    <PriceOrder :productData="prodata"></PriceOrder>
                    <van-stepper
                      v-model="prodata.number"
                      class="wish-prod-stepper"
                      v-if="$route.query.entryType == 'wish'"
                      :max="$route.params.wishProdInfo.saleNumMax"
                      :min="$route.params.wishProdInfo.saleNumBegin"
                      :step="$route.params.wishProdInfo.saleNumStep"
                      integer
                    />
                    <span style="float: right" v-else
                      >x {{ prodata.number }}</span
                    >
                  </div>
                  <div
                    v-if="
                      prodata.currentSelfActivity &&
                        prodata.currentSelfActivity.mktActivityType != ''
                    "
                    class="activity-type theme_bg_red"
                  >
                    {{ prodata.currentSelfActivity.mktActivityType }}
                  </div>
                </div>
              </div>
              <div
                v-if="occurData.needPickupId == 1"
                @click="toSelectZitiAddress"
              >
                <div class="pickup-shop">
                  <div style="flex: 1">
                    <div class="flex-row">
                      <div class="name theme_font_black">
                        兑换点：{{ $store.state.mall2.zitiAddress.storeName }}
                      </div>
                    </div>
                  </div>
                  <div>
                    <i
                      class="iconfont mall-gengduo more-icon theme_font_tint"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="service" v-if="store.storeProData.serviceArr.length">
                <div class="title">保障服务</div>
                <div
                  class="service-row line_top"
                  v-for="prodata in store.storeProData.serviceArr"
                  @click="toServiceEvent(prodata)"
                >
                  <div class="name single-line">{{ prodata.productName }}</div>
                  <div class="price">
                    ¥{{ $util.toDecimal2(prodata.price) }} x
                    {{ prodata.number }}
                    <i class="iconfont mall-gengduojiantou"></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="store.storeProData.num > 1"
              @click="showProsDetailEvent(store)"
            >
              <div class="pros-row">
                <div class="pros-msg">
                  <span>共{{ store.storeProData.proNum }}件</span>
                  <i
                    class="iconfont mall-gengduo more-icon theme_font_tint"
                  ></i>
                </div>
                <div
                  class="img-div"
                  v-for="(pro, imgIdx) in store.storeProData.proArr"
                  v-if="imgIdx < 3"
                >
                  <img :src="pro.phPictureUrl" />
                  <div class="presale" v-if="paramsData.cartType == 1">
                    预售
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle theme_font_common">备注</div>
              <div class="full">
                <input
                  class="row-input theme_font_common"
                  placeholder="请留下您想说的话"
                  v-model="store.remark"
                />
              </div>
            </div>
          </div>

          <div class="block-div" v-if="productType == 8">
            <div class="flex-row" @click="openServiceTimePicker">
              <!--没有生鲜的时候才能选时间-->
              <div class="label-middle theme_font_common">服务时间</div>
              <div class="full theme_font_common" style="text-align: right">
                {{ serviceDateTime }}
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>

          <!--金豆商城不支持开发票-->
          <!--          <div-->
          <!--            class="block-div"-->
          <!--            v-if="(!cardType || (cardType && cardType == 551)) && $store.state.globalConfig.invoice_shopping_enable != 'false' && paramsData.orderCategory != 1&&$store.state.globalConfig.cut_price_strict!=1">-->
          <!--            <div class="flex-row">-->
          <!--              <div class="title full theme_font_common">发票</div>-->
          <!--              <div class="swith" @click="useInvoiceEvent">-->
          <!--                <img v-if="useInvoice" src="static/image/mall2/switch-on.png"/>-->
          <!--                <img v-if="!useInvoice" src="static/image/mall2/switch-off.png"/>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="flex-row" v-if="useInvoice" @click="changeInvoice">-->
          <!--              <div class="label-middle theme_font_common">发票信息</div>-->
          <!--              <div class="full"></div>-->
          <!--              <div-->
          <!--                class="theme_font_black right-margin"-->
          <!--                :class="{theme_font_tint: invoiceInfo == ''}"-->
          <!--              >-->
          <!--                {{invoiceInfo !=-->
          <!--                '' ? invoiceInfo : '请编辑发票信息'}}-->
          <!--              </div>-->
          <!--              <div>-->
          <!--                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

          <div
            class="block-div"
            v-if="
              (!cardType || (cardType && cardType == 551)) &&
                paramsData.orderCategory != 1 &&
                $route.query.entryType !== 'wish'
            "
          >
            <div class="flex-row" @click="couponEvent">
              <div class="label-middle theme_font_common">优惠券</div>
              <div class="full"></div>
              <div v-if="lastRes.occur" class="theme_font_black right-margin">
                优惠{{ $util.toDecimal2(occurData.couponAmount) }}元
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
            <!--能使用的各种金额-->
            <div
              v-for="digital in occurData.digitalList"
              v-if="digital.acctType != 'LimitWallet'"
            >
              <!--去掉易捷卡的展示-->
              <div class="flex-row" v-if="digital.deductionState != 0">
                <div class="label-middle theme_font_common">
                  {{ getDigitalDisplayName(digital.acctType) }}
                </div>
                <div class="full"></div>
                <div class="right-margin" v-if="digital.userCanUseDigital > 0">
                  共{{ digital.userBalanceDigital }}，可用{{
                    digital.userCanUseDigital
                  }}，抵￥{{
                    $util.toDecimal2(digital.userCanUseDigitalAmount)
                  }}元
                </div>
                <div class="right-margin" v-if="digital.userCanUseDigital <= 0">
                  共{{ digital.userBalanceDigital }}，{{
                    getCanNotUseStr(digital.deductionState)
                  }}，不能使用
                </div>
                <div class="swith" @click="useDigitalEvent(digital)">
                  <img
                    v-if="digital.payDigital > digital.fixedDigital"
                    src="static/image/mall2/switch-on.png"
                  />
                  <img
                    v-if="digital.payDigital <= digital.fixedDigital"
                    src="static/image/mall2/switch-off.png"
                  />
                </div>
              </div>
            </div>
            <!--<div class="flex-row" v-if="lastRes.pointsDeductionEnable && occurData.userCanUsePoints == 0">-->
            <!--<div class="label-middle theme_font_common label-btn" @click="pointsRuleEvent()">积分<i class="iconfont mall-info theme_font_gray" style="margin-left: 3px;"></i></div>-->
            <!--<div class="full"></div>-->
            <!--<div v-if="occurData.userBanlancePoints < lastRes.pointsDeductionStep">-->
            <!--共{{occurData.userBanlancePoints}}分，积分不足{{lastRes.pointsDeductionStep}}无法使用-->
            <!--</div>-->
            <!--<div v-if="occurData.userBanlancePoints >= lastRes.pointsDeductionStep">-->
            <!--共{{occurData.userBanlancePoints}}分，订单金额不足{{lastRes.pointsDeductionStep * lastRes.pointsGainPerUnit / lastRes.pointsGainUnitCount / 100}}元无法使用-->
            <!--</div>-->
            <!--</div>-->
          </div>

          <!--易捷卡信息-->
          <div
            class="block-div"
            v-if="
              cardList.length != 0 &&
                paramsData.orderCategory != 1 &&
                limitType == 'true'
            "
          >
            <!--<div class="table-view yj-card">-->
            <!--<div class="table-view-cell">-->
            <!--<div class="table-view-cell-text">易捷卡</div>-->
            <!--<div class="table-view-cell-arrow">-->
            <!--<p>{{cardName ? cardName : $route.params.cardName}}</p>-->
            <!--<p>{{cardName ? cardName : $route.params.cardName}}</p>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <div class="flex-row" @click="showYJChange = true">
              <div class="label-middle theme_font_common">易捷卡</div>
              <div
                class="full theme_font_black right-margin"
                v-if="radio != 'a'"
                style="text-align: right"
              >
                <p v-if="$route.params.cardName || cardDetails.cardName">
                  {{
                    cardDetails.cardName
                      ? cardDetails.cardName
                      : $route.params.cardName
                  }}
                </p>
                <p v-else>选择可用易捷卡</p>
                <p
                  v-if="$route.params.cardName || cardDetails.cardName"
                  class="theme_font_tint font-small"
                  style="padding-top: 3px"
                >
                  余额{{ $util.toDecimal2(cardAmount) }}元，抵扣{{
                    $util.toDecimal2(userCanUseDigital)
                  }}元
                </p>
              </div>
              <div
                class="full theme_font_black right-margin"
                v-else
                style="text-align: right"
              >
                不使用易捷卡
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>
          <div
            class="block-div"
            v-if="
              cardType == '552' &&
                paramsData.orderCategory != 1 &&
                limitType == 'true'
            "
          >
            <div class="table-view yj-card">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">易捷卡</div>
                  <div class="right">{{ $route.params.cardName }}</div>
                </div>
              </div>
            </div>
          </div>

          <!--易捷卡信息-->
          <div class="block-div">
            <div class="flex-row">
              <div class="label-middle full theme_font_common">商品金额</div>
              <div class="theme_font_black">
                ￥{{ $util.toDecimal2(occurData.amount) }}
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle full theme_font_common">立减</div>
              <div class="theme_font_red">
                -￥{{ $util.toDecimal2(occurData.discountAmount) }}
              </div>
            </div>
            <div class="flex-row" @click="showFreightDetail">
              <div class="label-middle full theme_font_common">
                运费
                <i
                  class="iconfont mall-info theme_font_gray"
                  style="margin-left: 3px"
                ></i>
              </div>
              <div class="theme_font_red">
                +￥{{
                  $util.toDecimal2(
                    parseFloat(occurData.freightAmount) -
                      parseFloat(occurData.freightDiscountAmount)
                  )
                }}
              </div>
            </div>
            <div
              class="flex-row"
              v-if="
                paramsData.orderCategory != 1 &&
                  $route.query.entryType != 'wish'
              "
            >
              <div class="label-middle full theme_font_common">优惠券</div>
              <div class="theme_font_red">
                -￥{{ $util.toDecimal2(occurData.couponAmount) }}
              </div>
            </div>
            <div
              class="flex-row"
              v-if="
                limitType == 'true' &&
                  cardList.length != 0 &&
                  (cardDetails.cardName || $route.params.cardName) &&
                  radio != 'a'
              "
            >
              <div class="label-middle full theme_font_common">
                {{
                  cardDetails.cardName
                    ? cardDetails.cardName
                    : $route.params.cardName
                }}
              </div>
              <div class="theme_font_red">
                -￥{{ $util.toDecimal2(userCanUseDigital) }}
              </div>
            </div>
            <div
              class="flex-row"
              v-if="limitType == 'true' && cardType == '552' && radio != 'a'"
            >
              <div class="label-middle full theme_font_common">
                {{ $route.params.cardName }}
              </div>
              <div class="theme_font_red">
                -￥{{ $util.toDecimal2(occurData.couponAmount) }}
              </div>
            </div>
            <div
              class="flex-row"
              v-for="digital in occurData.digitalList"
              v-if="
                digital.payDigital > digital.fixedDigital &&
                  digital.acctType != 'LimitWallet'
              "
            >
              <!--去掉易捷卡的展示-->
              <div class="label-middle full theme_font_common">
                {{ getDigitalDisplayName(digital.acctType) }}
              </div>
              <div class="theme_font_red">
                -￥{{ $util.toDecimal2(digital.userCanUseDigitalAmount) }}
              </div>
            </div>
          </div>
          <!--          <div-->
          <!--            class="block-div"-->
          <!--            :class="{'is-need-referrer': occurData.needReferrer}"-->
          <!--            v-if="recommendDisabled && (!cardType || (cardType && cardType == 551))&&$store.state.globalConfig.cut_price_strict!=1">-->
          <!--            <div class="flex-row">-->
          <!--              <div class="passwords-input">-->
          <!--                <div class="label-middle full theme_font_common">推荐人</div>-->
          <!--                <div class="passwords">-->
          <!--                  <input placeholder="请输入推荐码" v-model="referrer" :disabled="!canEditReferrer"/>-->
          <!--                </div>-->
          <!--                <div class="show-passwords" @click="scanCodeFunc" v-show="canEditReferrer">-->
          <!--                  <img src="static/image/setting/icon-scan.png" class="scancode"/>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>

        <div class="bottom-btns">
          <div
            class="tip theme_bg_yl theme_standard_font theme_light_bg"
            v-if="deliveryType == 2 && occurData.needAddress == 1"
          >
            {{ $store.state.mall2.selectAddress.addressFull }}
          </div>
          <div
            class="btn theme_standard_bg theme_font_white"
            v-if="buyType == 'songli'"
            @click="checkProductStock"
          >
            提交礼单
          </div>
          <div
            class="btn theme_standard_bg theme_font_white"
            v-else
            @click="checkProductStock"
          >
            提交订单
          </div>
          <!--<div class="btn theme_bg_y theme_font_white"  v-if="occurData && occurData.fixedPoints > occurData.userBanlancePoints">积分不足</div>-->
          <div class="price">
            <div class="rmb-div" v-if="Object.keys(occurData).length">
              <span class="count">共{{ count }}件</span>

              <span
                class="theme_font_red"
                v-show="$mallCommon.getOccurShowPrice(occurData)"
                >￥</span
              >
              <span
                class="left-no-space price-big theme_font_red"
                v-show="$mallCommon.getOccurShowPrice(occurData)"
                >{{ getTotalPriceDuan(0) }}</span
              >
              <span
                class="theme_font_red"
                v-show="$mallCommon.getOccurShowPrice(occurData)"
                >.{{ getTotalPriceDuan(1) }}</span
              >
              <div
                class="digital-div"
                v-for="(digital, digitalindex) in occurData.digitalList"
                v-if="$mallCommon.getTotalUsePoints(digital) > 0"
              >
                <span
                  class="price-big theme_font_red"
                  v-if="
                    digitalindex !=
                      $mallCommon.getFirstVartualIndex(occurData) ||
                      $mallCommon.getOccurShowPrice(occurData)
                  "
                  >+</span
                >
                <span class="price-big theme_font_red">{{
                  $mallCommon.getTotalUsePoints(digital)
                }}</span>
                <span class="theme_font_red">{{
                  $mallCommon.getTotalUnitStr(digital.acctType)
                }}</span>
              </div>
            </div>
          </div>
          <div class="adapter-iphoneX" v-if="this.$util.getIsIphoneX_X()"></div>
        </div>
        <!--          易捷卡弹框（充值卡）-->
        <van-popup class="pay-modal" position="bottom" v-model="showYJChange">
          <div class="top">
            <div class="close-img">
              <div class="text">易捷卡</div>
              <div class="img">
                <img
                  @click="showYJChange = false"
                  class="close-btn"
                  src="../../../../static/image/coupon/close-btn.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <van-radio-group v-model="radio">
            <van-radio
              class="title-change"
              checked-color="#f80f16"
              name="a"
              @click="changeYjCard"
              >不使用易捷卡</van-radio
            >
            <van-radio
              checked-color="#f80f16"
              :name="index"
              v-for="(item, index) in cardList"
              :key="index"
              @click="changeYjCard(item)"
            >
              <div class="item">
                <img class="pro-img" :src="item.cardFrontPicUrl" alt="" />
                <div class="card-content">
                  <p class="top">
                    <span class="card-name">{{ item.cardName }}</span>
                    <span class="card-type">{{ item.cardTypeStr }}</span>
                  </p>
                  <p class="mid-price">
                    <span class="icon">余额：￥</span>{{ item.balance }}
                  </p>
                  <div class="btm-content">
                    <span class="card-number">卡号：{{ item.cardNo }}</span>
                  </div>
                </div>
              </div>
            </van-radio>
          </van-radio-group>
          <div class="pay-confirm" @click="queryBtn">确定</div>
        </van-popup>
        <!--          易捷卡弹框（充值卡）-->
      </div>
    </nav-content>
    <pop-view v-if="payWayPopShow" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pop-title theme_font_common">请选择支付方式</div>
        <div class="items-div pop-scroll-div">
          <div
            class="item theme_font_common theme_bg_white_ef"
            :class="{
              theme_light_bg: payWaySelected == payway.tag,
              theme_standard_font_i: payWaySelected == payway.tag,
              theme_standard_bdr_i: payWaySelected == payway.tag
            }"
            @click="payWayEvent(payway)"
            v-for="payway in payWays"
          >
            {{ payway.text }}
          </div>
        </div>
        <div
          class="bottom-btn theme_font_white theme_standard_bg bottom-space"
          @click="popSureEvent"
        >
          确定
        </div>
      </div>
    </pop-view>
    <!--    微店团购支付方式-->
    <pop-view v-if="payWayPopShow1" @closeEvent="popClose2">
      <div class="pop-body">
        <div class="pop-title theme_font_common">请选择支付方式</div>
        <div class="items-div pop-scroll-div">
          <div
            class="item theme_font_common theme_bg_white_ef"
            :class="{
              theme_light_bg: payWaySelected == index,
              theme_standard_font_i: payWaySelected == index,
              theme_standard_bdr_i: payWaySelected == index
            }"
            @click="payWayEvent1(payway, index)"
            v-for="(payway, index) in payWays1"
          >
            {{ payway.text }}
          </div>
        </div>
        <div
          class="bottom-btn theme_font_white theme_standard_bg bottom-space"
          @click="popSureEvent2"
        >
          确定
        </div>
      </div>
    </pop-view>
    <pop-view v-if="contratWayPopShow" @closeEvent="popClose1">
      <div class="pop-body">
        <div class="pop-title theme_font_common">请选择认证信息</div>
        <div class="items-div pop-scroll-div">
          <van-radio-group v-model="radio1">
            <van-cell-group>
              <van-cell
                title=""
                clickable
                @click="changePer(item, index)"
                v-for="(item, index) in contratWayList"
                :key="index"
              >
                <template #icon>
                  <div class="per-con">
                    <div class="title">
                      {{ item.type == 1 ? "企业" : "个人" }}
                    </div>
                    <div class="detail" v-if="item.userName">
                      <div class="name">姓名：{{ item.realName }}</div>
                      <div class="phone">手机号：{{ item.userName }}</div>
                    </div>
                    <div class="detail" v-else>
                      <div class="name">
                        暂未{{ item.type == 1 ? "企业团购" : "实名" }}认证,点击
                        <span @click="auther(item.type)" style="color: #8080ff"
                          >前往认证</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
                <template #right-icon>
                  <van-radio :name="index" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <!--        <div-->
        <!--          class="bottom-btn theme_font_white theme_standard_bg bottom-space"-->
        <!--          @click="popSureEvent1"-->
        <!--        >确定-->
        <!--        </div>-->
      </div>
    </pop-view>
    <pop-view v-if="showProsDetail" @closeEvent="showProsDetail = false">
      <div class="pop-body">
        <div class="pop-title theme_font_common">商品明细</div>
        <div class="pop-scroll-div">
          <div
            class="pro-row"
            v-for="prodata in currentStore.storeProData.proArr"
          >
            <div class="img-div">
              <img :src="prodata.phPictureUrl" />
              <div class="presale" v-if="paramsData.cartType == 1">预售</div>
            </div>
            <div class="info-div">
              <div class="title-min theme_font_black">
                {{ prodata.productName }}
              </div>
              <div class="title-min theme_font_gray">
                <span class="font-small">{{ prodata.specs }}</span>
              </div>
              <div class="price">
                <PriceOrder :productData="prodata"></PriceOrder>
                <span style="float: right">x {{ prodata.number }}</span>
              </div>
            </div>
          </div>
          <div class="service">
            <div class="title">保障服务</div>
            <div
              class="service-row line_top"
              v-for="prodata in currentStore.storeProData.serviceArr"
              @click="toServiceEvent(prodata)"
            >
              <div class="name single-line">{{ prodata.productName }}</div>
              <div class="price">
                ¥{{ $util.toDecimal2(prodata.price) }} x {{ prodata.number }}
                <i class="iconfont mall-gengduojiantou"></i>
              </div>
            </div>
          </div>
          <!--<div class v-for="activity in currentStore.activity">-->
          <!---->
          <!--</div>-->
          <!--<div class v-if="currentStore.noActivityCart.length > 0">-->
          <!--<div class="pro-row" v-for="prodata in currentStore.noActivityCart">-->
          <!--<div class="img-div">-->
          <!--<img :src="prodata.phPictureUrl"/>-->
          <!--</div>-->
          <!--<div class="info-div">-->
          <!--<div class="title-max double-line theme_font_black">{{prodata.productName}}</div>-->
          <!--<div class="title-max double-line theme_font_gray">-->
          <!--<span>{{prodata.specs}}</span>-->
          <!--</div>-->
          <!--<div class="price">-->
          <!--<PriceOrder :productData="prodata"></PriceOrder>-->
          <!--<span style="float: right;">x {{prodata.number}}</span>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
        </div>
      </div>
    </pop-view>
    <mt-datetime-picker
      ref="dateDom"
      type="date"
      v-model="pickupTime"
      :startDate="pickupStartTime"
      :endDate="getEndDate()"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
    ></mt-datetime-picker>
    <Agreement
      :propsValue="9"
      v-if="showAgreement"
      @backEvent="showAgreement = false"
    ></Agreement>
    <Agreement
      :propsValue="11"
      v-if="showPointsRule"
      @backEvent="showPointsRule = false"
    ></Agreement>
    <input type="hidden" :value="recommend" />
  </div>
</template>

<script>
import Coupon from "../common/coupon";
import Invoice from "../common/invoice";
import Freight from "../common/freight";
import NoStock from "../common/no-stock";
import DigitalPwd from "../common/digital-pwd";
import PriceOrder from "@/components/commonui/price/price-order";
import Agreement from "@/components/usercenter/register/agreement";
import md5String from "../../../utils/md5";
import { Dialog, Toast } from "vant";
import { mapActions } from "vuex";
import DatetimePicker from "@/components/commonui/datetime-picker";
export default {
  name: "placeorder",
  components: {
    PriceOrder,
    Agreement
  },
  data() {
    return {
      contactFlag: false,
      contratWayList: [],
      //上个页面的结算参数
      paramsData: {},
      payWays: [
        {
          text: "在线支付",
          tag: "1"
        }
        // {
        //   text: "货到付款",
        //   tag: "0",
        // },
        // {
        //   text: "提货付款",
        //   tag: "0",
        // },
      ],
      payWays1: [
        {
          text: "在线支付",
          tag: "1"
        }
        // {
        //   text: "货到付款",
        //   tag: "0",
        // },
        // {
        //   text: "提货付款",
        //   tag: "1",
        // },
      ],
      contratWayText: "选择联系方式",
      payWaySelected: 1,
      payWayText: "在线支付",
      payWayPopShow: false,
      contratWayPopShow: false,
      usePoints: false,
      payDigitals: [],
      useInvoice: false,
      lastRes: {},
      pointsGain: 0,
      occurData: {},
      usedCoupons: [],
      invoiceData: null,
      invoiceInfo: "",
      currentInvoice: {},
      proImgArr: [],
      showProsDetail: false,
      pickupPhone: this.$store.state.userInfo.phone,
      pickupTime: "",
      currentStore: {},
      isFirst: true,
      //推荐码
      referrer: "",
      //扫描出来的推荐码
      scanCode: "",
      showAgreement: false,
      showPointsRule: false,
      digitalPWD: "",
      dictByAlias: [],
      easyCardId: "", // 从易捷卡页面过来的才有easyCardId(只有计次卡不要发票、不要推荐人、优惠券)
      cardBalance: "", // 易捷卡支付信息
      showYjPayInfo: false, // 易捷卡支付信息展示
      cardType: "", // 区分充值卡 计次卡 551充值卡 552 计次卡(只有计次卡不要发票、不要推荐人、优惠券)
      showYJChange: false, // 易捷卡弹框
      radio: -1, // 易捷卡选择
      radio1: 0, // 易捷卡选择
      cardList: [], // 卡列表
      cardDetails: "", // 卡名称
      userCanUseDigital: "", // 易捷卡金额
      cardAmount: "",
      limitType: "", // 易捷卡配置
      deliveryType: "", // 配送方式
      complete: false,
      backReloadCoupon: false,
      pickUpEndTime: "", // 最晚提货时间
      hasShengxian: false,
      // 选择的预约单联系方式
      selectItem: {},
      pageType: null,
      payWayPopShow1: false,
      //是否超过最大支付金额标志
      overFlag: false,
      wishData: {
        payNiceName: "",
        payMsg: ""
      },
      buyType: "",
      lbId: "",
      lsProductName: "",
      noNavTop: false,
      productType: "",
      serveStartTime: "",
      serveEndTime: "",
      selectedServiceTime: "",
      microStoreCode: "",
      proSkuDistributionId: "",
      pickupStartTime: new Date(),
      count: 0
    };
  },
  computed: {
    serviceDateTime() {
      if (this.selectedServiceTime == "") {
        return "请选择服务时间";
      }
      return (
        this.selectedServiceTime.date.label +
        " " +
        this.selectedServiceTime.time.label
      );
    },
    recommendDisabled() {
      return (
        !this.$store.state.globalConfig.recommendDisabled ||
        !Number(this.$store.state.globalConfig.recommendDisabled)
      );
    },
    recommend() {
      let recommend = "";
      // 通过接口获取推荐人， login.js
      if (
        this.$store.state.globalConfig.rfrCodeType &&
        this.$store.state.rfrCodeMap
      ) {
        // bindCardReferrer;//绑卡推荐人  orderReferrer;//订单推荐人 regReferrer;//注册推荐人 lastReferrer;//最后的推荐人
        recommend = this.$store.state.rfrCodeMap[
          this.$store.state.globalConfig.rfrCodeType
        ];
      }
      // URL入参，暂时定优先级最高，不清楚意义
      if (
        this.$route.params.recommendPhone ||
        this.$route.query.recommendPhone
      ) {
        recommend =
          this.$route.params.recommendPhone || this.$route.query.recommendPhone;
      }

      // 商品推荐购物带过来的推荐人
      if (sessionStorage.getItem("USER_NO")) {
        recommend = sessionStorage.getItem("USER_NO");
      }

      this.referrer = recommend;
      return recommend;
    },
    canEditReferrer() {
      return (
        this.$store.state.globalConfig.appCanEditReferrer == 1 ||
        !this.recommend
      );
    }
  },
  created() {
    console.log(this.$route.params.cutPrice);
    console.log(
      this.$store.state.globalConfig.order_pickup_cancel_tip_show != "false"
    );
    let durationHours =
      this.$store.state.globalConfig.order_timeout_pickup_cancel || 360;
    if (parseInt(durationHours) == 0) {
      durationHours = 360;
    }
    let t1 = new Date().getTime();
    t1 += parseInt(durationHours) * 3600 * 1000;
    this.pickUpEndTime = this.$util.getPreTime(t1);

    // 获取LimitWallet的limitType
    let acctList = this.$store.state.globalConfig.acctList || [];
    let startUsing = "";
    acctList.forEach(item => {
      if (item.acctType == "LimitWallet") {
        startUsing = item.startUsing;
      }
    });
    this.limitType = startUsing;
    if (this.$route.query.SCREEN) {
      // 扫码购 流程
      // if (true) {
      this.getShortAddress(this.$route.query.SCREEN);
      // this.getShortAddress('GBhQwKRpkN')
    } else {
      this.complete = true;
      this.lastRes = this.$route.params.res ? this.$route.params.res : {};
      this.easyCardId = this.$route.params.easyCardId;
      this.cardType = this.$route.params.cardType;
      this.buyType = this.$route.params.buyType || "";
      this.lbId = this.$route.params.lbId || "";
      this.microStoreCode = this.$route.params.microStoreCode || "";
      this.proSkuDistributionId = this.$route.params.proSkuDistributionId || "";
      this.productType = this.$route.params.productType || "";
      this.serveStartTime = this.$route.params.serveStartTime || "0:00";
      this.serveEndTime = this.$route.params.serveEndTime || "24:00";
      this.lsProductName = this.$route.params.lsProductName || "";
      this.paramsData = this.$route.params.paramsData
        ? this.$route.params.paramsData
        : {};
      this.deliveryType = this.$route.params.deliveryType
        ? this.$route.params.deliveryType
        : "2";

      if (this.$route.query.carts) {
        this.deliveryType = this.$route.query.deliveryType
          ? this.$route.query.deliveryType
          : "1";
        this.noNavTop = this.$route.query.noNavTop == "1" ? true : false;
        this.paramsData = {
          carts: JSON.parse(this.$route.query.carts),
          userAddress: this.$store.state.mall2.selectAddress,
          pickupId: this.$route.query.pickupId,
          userAddressId: this.$store.state.mall2.selectAddress.id,
          deliveryType: this.deliveryType
        };
        if (this.$route.query.pickupId) {
          this.$mallCommon.getSysStoreById(
            this.$route.query.pickupId,
            pickupAddress => {
              this.$store.state.mall2.zitiAddress = pickupAddress;
              sessionStorage.setItem(
                "RHY_Pickup_Address",
                this.$route.query.pickupId
              );
              this._reSettleCart(this.paramsData.carts);
              this.$userCenter._setDefaultPickupAddress(pickupAddress.id);
            }
          );
        } else if (this.$route.query.pickupAddress) {
          let pickupAddress = JSON.parse(this.$route.query.pickupAddress);
          this.$store.state.mall2.zitiAddress = pickupAddress;
          sessionStorage.setItem(
            "RHY_Pickup_Address",
            this.$route.query.pickupAddress
          );
          this._reSettleCart(this.paramsData.carts);
          this.$userCenter._setDefaultPickupAddress(pickupAddress.id);
        } else {
          this._reSettleCart(this.paramsData.carts);
        }
      } else {
        if (!this.$route.params.paramsData) {
          if (sessionStorage.getItem("Place_Order_Params")) {
            this.paramsData = JSON.parse(
              sessionStorage.getItem("Place_Order_Params")
            );
            this.deliveryType = sessionStorage.getItem(
              "Place_Order_Delivery_Type"
            );
            this._reSettleCart(null);
          } else {
            this.$MessageBox
              .alert("当前状态不支持刷新！", "提示")
              .then(action => {
                this.$router.go(-1);
              });
          }
        } else {
          sessionStorage.setItem(
            "Place_Order_Params",
            JSON.stringify(this.paramsData)
          );
          sessionStorage.setItem(
            "Place_Order_Delivery_Type",
            this.deliveryType
          );
          this.initData();
        }
      }

      // 获取推荐人
      this.rfrCodeMapAction();

      if (this.limitType == "true") {
        this.getCardList();
      }
    }
    if (
      this.$store.state.mall2.pickUpUser == undefined ||
      this.$store.state.mall2.pickUpUser == ""
    ) {
      this.$store.state.mall2.pickUpUser = this.$store.state.login.nickName;
    }
    let cancelTime =
      this.$store.state.globalConfig.order_timeout_pickup_cancel || 0;
    let nowTime = new Date();
    nowTime.setHours(nowTime.getHours() + parseInt(cancelTime));
    this.pickupTime = nowTime;

    // 从心愿单购买进入
    if (this.$route.query.entryType == "wish") {
      this.getWishMsg(1);
    }
  },
  mounted() {
    this.pageType = this.$route.query.pageType;
    // 企业团购type=2默认提货付款
    // this.pageType=2
    if (this.pageType == 2) {
      this.payWaySelected = 2;
      this.payWayText = "提货付款";
      // 预约单联系人配置显示与否
      // this.contactFlag=this.$store.state.globalConfig.contacts
      // this.payWays=this.payWays1
    }
    // 砍价不用地址
    if (this.$route.params.productType != 514) {
      this.noMath();
    }

    // this.referrer = sessionStorage.getItem('USER_NO')
    // console.log(1,this.referrer)
    //   alert(this.referrer)
    // if (this.referrer) {
    //   this.canEditReferrer = false
    // }
    // alert(this.canEditReferrer)
    // this.getDictByAlias();
  },
  methods: {
    // 家政服务，选中服务时间
    openServiceTimePicker: function() {
      let curDate = new Date();
      let nextDay = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);
      DatetimePicker.open({
        beginDate: nextDay,
        beginTime: this.serveStartTime,
        endTime: this.serveEndTime,
        selectedDateTime: (date, time) => {
          console.log(date, time);
          this.selectedServiceTime = {
            date: date,
            time: time
          };
          // this.serviceDateTime = this.selectedServiceTime.date.dateStr + ' ' + this.selectedServiceTime.time.label
        }
      });
    },
    // 去认证
    auther(type) {
      // 企业认证
      if (type == 1) {
        this.$router.push({
          path: "/authentication/index",
          query: {}
        });
        //个人实名认证
      } else {
        this.$router.push({
          path: "/authentication/index",
          query: {}
        });
      }
    },
    changePer(item, index) {
      this.contratWayPopShow = false;
      this.selectItem = item;
      this.radio1 = index;
      if (item.type == 1) {
        this.contratWayText = "企业";
      } else {
        this.contratWayText = "个人";
      }
    },
    getAuthInfo: function() {
      let params = {};
      this.$http
        .post("/app/json/app_purchase_order/getAuthInfo", params)
        .then(res => {
          let data = res.data;
          console.log(res);
          if (data.status == 0) {
            this.contratWayList = res.data.data;
            this.contratWayPopShow = true;
          } else {
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$Toast(err);
        });
    },
    toServiceEvent: function(item) {
      let url = "/app/json/product/getThirdServeDetail";
      let paramsData = {
        id: item.thirdServeId
      };
      this.$http.post(url, paramsData).then(res => {
        let data = res.data;
        if (data.status == 0) {
          let pageUrl = data.data.pageUrl;
          if (pageUrl == "") {
            this.$Toast("暂无详情！");
            return;
          } else {
            if (pageUrl.indexOf("?") != -1) {
              pageUrl = pageUrl + "&";
            } else {
              pageUrl = pageUrl + "?";
            }
            pageUrl +=
              "token" +
              "=" +
              token +
              "&lng=" +
              store.state.currentLocation.posx +
              "&lat=" +
              store.state.currentLocation.posy +
              "&pickupId=" +
              store.state.mall2.zitiAddress.id +
              "&webtype=" +
              store.state.webtype;
            window.location.href = pageUrl;
          }
        }
      });
    },
    getSelectReceiveTime: function() {
      // order.fresh.pickup.timeout.startday";             // 生鲜提货时间开始天数
      // order.fresh.pickup.timeout.starttime";            // 生鲜提货时间开始时间
      let sd =
        this.$store.state.globalConfig.order_fresh_pickup_timeout_startday || 0;
      let d = this.$util.nextDate(sd);
      let st =
        this.$store.state.globalConfig.order_fresh_pickup_timeout_starttime ||
        "09:00:00";

      let str =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        st;

      return str;
    },
    getReceiveEndTime: function() {
      // "order.fresh.pickup.timeout.endtime";                // 生鲜提货时间截止时间
      // order.fresh.pickup.timeout.endday";                 // 生鲜提货时间截止天数
      let ed =
        this.$store.state.globalConfig.order_fresh_pickup_timeout_endday || 1;
      let d = this.$util.nextDate(ed);
      let et =
        this.$store.state.globalConfig.order_fresh_pickup_timeout_endtime ||
        "15:00:00";

      let str =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        et;

      return str;
    },
    getShortAddress(code) {
      // 大屏扫码购  获取长码 结算信息
      this.$request
        .post("/app/json/short_address/getShortAddress", {
          code: code
        })
        .then(res => {
          if (res.status == 0) {
            let data = JSON.parse(res.data.addressData);
            this.deliveryType = data.deliveryType;
            data.token = this.$store.state.login.token;
            this.paramsData = data;
            console.log(data);
            this._reSettleCart(data.carts);
          } else {
            this.$toast(res.info);
          }
        });
    },
    getTotalPriceDuan: function(index) {
      let str = this.$util.toDecimal2(this.occurData.payAmount);
      let arr = str.split(".");
      return arr[index];
    },

    queryBtn() {
      // 确定不使用易捷卡按钮
      this.showYJChange = false;
      if (this.radio == "a") {
        this._reSettleCart(null, "");
      } else {
        this._reSettleCart(null, this.cardDetails.cardNo);
      }
    },
    getCardList() {
      // 不判断非空，会使得代码部分情况下报错
      if (!this.occurData.store) {
        return;
      }
      // 获取我的卡包列表
      let proSkus = [];
      this.occurData.store.forEach(item => {
        item.noActivityCart.forEach(item2 => {
          proSkus.push({ skuId: item2.skuId, storeOuCode: item2.storeOuCode });
        });
      });

      this.$request
        .post("/app/json/app_user_easy_card/getCardList", {
          proSkus: proSkus
        })
        .then(res => {
          if (res.status == 0) {
            this.cardList = res.data || [];
            if (this.cardList.length) {
              this.radio = -1;
              for (let key in this.cardList) {
                if (this.cardList[key].cardNo == this.$route.params.cardNo) {
                  this.radio = parseInt(key);
                }
              }
            }
          } else {
            this.$Toast(res.info);
          }
        });
    },
    changeYjCard(item) {
      if (this.radio != "a") {
        // 选的不使用易捷卡
        this.cardAmount = item.balance;
        this.cardDetails = item;
      } else {
        this.cardAmount = 0;
        this.cardDetails = "";
      }
    },
    getCanNotUseStr: function(state) {
      if (state == 1 || state == 3) {
        return "余额不足";
      } else if (state == 1) {
        return "订单金额不够";
      } else {
        return "未知原因";
      }
    },
    // 虚拟支付
    // 字典匹配
    // 1.先从字典库查询所有的值存在本地
    getDictByAlias: function() {
      let Url = "/app/json/app_dict/getDictByAlias";
      let paramsData = {
        token: this.$store.state.login.token,
        alias: "rewards_group"
      };
      this.$http.post(Url, paramsData).then(res => {
        let data = res.data;
        if (data.status == 0 && data.data.length != 0) {
          this.dictByAlias = data.data;
        }
      });
    },
    // // 2.页面显示的时候先匹配字典库存的子账户名称,如果有就使用,如果没有就调用公共的虚拟支付名称
    // setDisplayName(datainfo) {
    //   var acctType = datainfo;
    //   var dictValue = "";
    //   if (this.dictByAlias.length != 0) {
    //     for (var i = 0; i < this.dictByAlias.length; i++) {
    //       if (this.dictByAlias[i].dictAlias == "200001") {
    //         dictValue = this.dictByAlias[i].dictValue;
    //         console.log(this.dictByAlias[i].dictValue);
    //         return dictValue;
    //       }
    //     }
    //   }
    //   if (dictValue == "" || dictValue == null) {
    //     console.log(acctType, "22222222");
    //     var dictValue_displayName = this.getDigitalDisplayName(acctType);
    //     console.log(dictValue_displayName, "dictValue_displayName");
    //     return dictValue_displayName;
    //   }
    // },
    // 3. 匹配公共的虚拟支付名称
    getDigitalDisplayName: function(acctType) {
      return this.$mallCommon.accTypeToName(acctType, "200001");
    },
    pointsRuleEvent: function() {
      this.showPointsRule = true;
    },
    getEndDate: function() {
      let cancelTime =
        this.$store.state.globalConfig.order_timeout_pickup_cancel || 0;
      let dd = new Date(this.pickupStartTime.getTime());
      if (cancelTime) {
        dd.setHours(dd.getHours() + parseInt(cancelTime));
      } else {
        dd.setDate(dd.getDate() + 14);
      }
      return dd;
    },
    scanCodeFunc: function() {
      this.$bridgefunc.scanCode(dic => {
        this.scanCode = dic.code;
        this.referrer = dic.code;
      });
    },

    getTotalPrice: function() {
      return this.$util.toDecimal2(this.occurData.payAmount);
    },
    getImgArrs: function(store) {
      let arr = [];
      for (let i = 0; i < store.activity.length; i++) {
        let a1 = store.activity[i].cart;
        for (let j = 0; j < a1.length; j++) {
          arr.push(a1[j].phPictureUrl);
        }
        // let a2 = store.activity[i].gift
        // for (let j = 0; j < a2.length; j++) {
        //   arr.push(a2[j].phPictureUrl)
        // }
      }
      let a3 = store.noActivityCart;
      for (let j = 0; j < a3.length; j++) {
        arr.push(a3[j].phPictureUrl);
      }
      return arr;
    },
    getNoStockImgArrs: function(store) {
      let noStockArr = [];
      let canBuyArr = [];
      for (let i = 0; i < store.activity.length; i++) {
        let a1 = store.activity[i].cart;
        for (let j = 0; j < a1.length; j++) {
          let item = a1[j];
          if (item.number > item.stockNumber) {
            if (
              item.currentSelfActivity != "" &&
              item.currentSelfActivity.mktActivityId &&
              item.currentSelfActivity.mktActivityId != ""
            ) {
              item.selfActivityId = item.currentSelfActivity.mktActivityId;
            }
            noStockArr.push(item);
          } else {
            let citem = {
              id: "",
              skuId: item.skuId,
              storeOuCode: item.storeOuCode,
              number: item.number,
              activityId: item.activityId,
              proSkuDistributionId: item.proSkuDistributionId || "",
              checked: item.checked,
              isGift: item.isGift,
              spCode: item.spCode
              //selfActivityId: item.currentSelfActivity != '' ? item.currentSelfActivity.mktActivityId : '',
            };
            if (
              item.currentSelfActivity != "" &&
              item.currentSelfActivity.mktActivityId &&
              item.currentSelfActivity.mktActivityId != ""
            ) {
              citem.selfActivityId = item.currentSelfActivity.mktActivityId;
            }
            canBuyArr.push(citem);
          }
        }
        // let a2 = store.activity[i].gift
        // for (let j = 0; j < a2.length; j++) {
        //   let item = a2[j]
        //   if (item.number > item.stockNumber) {
        //     noStockArr.push(item)
        //   } else {
        //     let citem = {
        //       id: '',
        //       skuId: item.skuId,
        //       storeOuCode: item.storeOuCode,
        //       number: item.number,
        //       activityId: item.activityId,
        //       checked: item.checked,
        //       isGift: item.isGift
        //     }
        //     canBuyArr.push(citem)
        //   }
        // }
      }
      let a3 = store.noActivityCart;
      for (let j = 0; j < a3.length; j++) {
        let item = a3[j];
        if (item.number > item.stockNumber) {
          if (
            item.currentSelfActivity != "" &&
            item.currentSelfActivity.mktActivityId &&
            item.currentSelfActivity.mktActivityId != ""
          ) {
            item.selfActivityId = item.currentSelfActivity.mktActivityId;
          }
          noStockArr.push(item);
        } else {
          let citem = {
            id: "",
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            number: item.number,
            activityId: item.activityId,
            proSkuDistributionId: item.proSkuDistributionId || "",
            checked: item.checked,
            isGift: item.isGift,
            spCode: item.spCode
          };
          if (
            item.currentSelfActivity != "" &&
            item.currentSelfActivity.mktActivityId &&
            item.currentSelfActivity.mktActivityId != ""
          ) {
            citem.selfActivityId = item.currentSelfActivity.mktActivityId;
          }
          canBuyArr.push(citem);
        }
      }
      return { noStockArr: noStockArr, canBuyArr: canBuyArr };
    },
    // getYjNumber() {
    //   let numberList = ''
    //   let store = this.occurData.store
    //   for (let i = 0; i < store.length; i++) {
    //     numberList = this.getNoStockImgArrs(store[i])
    //   }
    //   console.log('我是numberList')
    //   console.log(numberList)
    //   console.log('我是numberList')
    //   let number = 0
    //   numberList.canBuyArr.forEach(item => {
    //     number = number + item.number
    //   })
    //   numberList.noStockArr.forEach(item => {
    //     number = number + item.number
    //   })
    //   return number
    //   console.log('我是number')
    //   console.log(number)
    //   console.log('我是number')
    // },
    showFreightDetail: function() {
      let storeArr = [];
      for (let i = 0; i < this.occurData.store.length; i++) {
        let store = this.occurData.store[i];
        let item = {};
        item.storeName = store.storeName;
        item.freightAmount = store.freightAmount;
        item.freightDiscountAmount = store.freightDiscountAmount;
        item.proImgs = this.getImgArrs(store);
        storeArr.push(item);
      }

      Freight.open({
        initData: {
          listData: storeArr
        },
        sureEvent: () => {
          Freight.close();
        }
      });
    },
    pickerConfirm: function(value) {
      // let nowTime = this.$util.getDataString(value)
      // let orderTime = this.$store.state.globalConfig.order_timeout_pickup_cancel * 60 * 60 * 1000
      // let time = parseInt(nowTime) + parseInt(orderTime)
      let week = "星期" + "天一二三四五六 ".charAt(new Date(value).getDay());
      let date = this.$util.getMyDate(value);
      console.log(value);
      return date + " 【" + week + "】";
      // return '请于' + date + "完成提货";
    },
    openPicker() {
      this.$refs.dateDom.open();
    },
    showProsDetailEvent: function(store) {
      this.currentStore = store;
      this.showProsDetail = true;
    },
    getPeisongString: function(type) {
      if (type == "0") {
        return "快递配送";
      } else if (type == "1") {
        return "京东配送";
      }
      return "第三方配送";
    },
    toSelectZitiAddress: function() {
      if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
        return;
      }
      console.log(this.paramsData);

      let carts = this.paramsData.carts;
      let skuIds = [];
      for (let i = 0; i < carts.length; i++) {
        skuIds.push(carts[i].skuId);
      }
      this.$router.push({
        path: "/mall2/mypickupaddress",
        query: {
          skuIds: JSON.stringify(skuIds)
        }
      });
    },
    toSelectAddress: function() {
      this.$router.push({
        path: "/mall2/addresslist"
      });
    },
    // 获取前面已填写的发票
    useInvoiceEvent: function() {
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
    changeInvoice: function() {
      Invoice.open({
        initData: {
          ...this.invoiceData,
          token: this.$store.state.login.token
        },
        selectedInvoice: invoice => {
          console.log(invoice);
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
        },
        invoiceInformation: () => {
          this.showAgreement = true;
        }
      });
    },
    reloadSelectedCoupon: function() {
      if (this.backReloadCoupon == false) {
        return;
      }
      this.backReloadCoupon = false;
      let couNo = this.occurData.couNo;
      this.usedCoupons = [];
      if (couNo.length > 0) {
        for (let i = 0; i < couNo.length; i++) {
          this.usedCoupons.push({
            couNo: couNo[i]
          });
        }
      }
      let canCoupons = [];
      for (let i = 0; i < this.occurData.userCanUseCoupon.length; i++) {
        let couNo1 = this.occurData.userCanUseCoupon[i].couNo;
        this.occurData.userCanUseCoupon[i].selected = false;
        for (let j = 0; j < this.usedCoupons.length; j++) {
          let couNo2 = this.usedCoupons[j].couNo;
          if (couNo2 == couNo1) {
            this.occurData.userCanUseCoupon[i].selected = true;
            break;
          }
        }
        canCoupons.push(this.occurData.userCanUseCoupon[i]);
      }

      Coupon.reloadSelectedCoupon(
        canCoupons,
        [],
        this.occurData.userCanUseWhenNotSelectCoupon
      );
    },
    couponEvent: function() {
      let canCoupons = [];
      for (let i = 0; i < this.occurData.userCanUseCoupon.length; i++) {
        let couNo1 = this.occurData.userCanUseCoupon[i].couNo;
        this.occurData.userCanUseCoupon[i].selected = false;
        for (let j = 0; j < this.usedCoupons.length; j++) {
          let couNo2 = this.usedCoupons[j].couNo;
          if (couNo2 == couNo1) {
            this.occurData.userCanUseCoupon[i].selected = true;
            break;
          }
        }
        canCoupons.push(this.occurData.userCanUseCoupon[i]);
      }
      Coupon.open({
        initData: {
          listData: [],
          userCanNotUseCoupon: this.occurData.userCanNotUseCoupon,
          userCanUseCoupon: canCoupons,
          userCanUseWhenNotSelectCoupon: this.occurData
            .userCanUseWhenNotSelectCoupon,
          type: "use",
          skuId: "",
          categoryId: "",
          storeOuCode: "",
          token: this.$store.state.login.token,
          payAmount: this.$util.toDecimal2(
            parseFloat(this.occurData.payAmount) +
              parseFloat(this.occurData.couponAmount)
          )
        },
        selectedCoupon: couponArr => {
          this.usedCoupons = couponArr;
          this.backReloadCoupon = true;
          this._reSettleCart(null);
          //Coupon.close();
        }
      });
    },
    useDigitalEvent: function(digital) {
      if (digital.userCanUseDigital <= 0) {
        let str = this.getCanNotUseStr(digital.deductionState);
        this.$Toast(
          str +
            "，不支持" +
            this.getDigitalDisplayName(digital.acctType) +
            "支付！"
        );
        return;
      }
      let acctType = digital.acctType;
      if (digital.payDigital <= digital.fixedDigital) {
        // 当前是关闭装
        let arr = [];
        for (let i = 0; i < this.payDigitals.length; i++) {
          if (this.payDigitals[i].acctType != acctType) {
            arr.push(this.payDigitals[i]);
          }
        }
        this.payDigitals = arr;

        this.payDigitals.push({
          acctType: acctType,
          payDigital: digital.userCanUseDigital + digital.fixedDigital
        });
      } else {
        let arr = [];
        for (let i = 0; i < this.payDigitals.length; i++) {
          if (this.payDigitals[i].acctType != acctType) {
            arr.push(this.payDigitals[i]);
          } else {
            arr.push({
              acctType: acctType,
              payDigital: digital.fixedDigital
            });
          }
        }
        this.payDigitals = arr;
      }
      this._reSettleCart(null);
    },
    usePointsEvent: function() {
      if (this.occurData.userCanUsePoints == 0) {
        this.$Toast("您没有当前订单可用积分！");
        return;
      } else {
        this.usePoints = !this.usePoints;
        this._reSettleCart(null);
      }
    },
    payWayShow: function() {
      //企业团购
      if (this.pageType == 2) {
        this.payWayPopShow1 = true;
      } else {
        this.payWayPopShow = true;
      }
    },
    contratWayShow: function() {
      this.getAuthInfo();
    },
    payWayEvent: function(payway) {
      if (payway.tag == 0) {
        this.$Toast("暂不支持！");
        return;
      }
      this.payWaySelected = payway.tag;
      this.payWayText = payway.text;
    },
    payWayEvent1: function(payway, index) {
      if (payway.tag == 0) {
        this.$Toast("暂不支持！");
        return;
      }
      this.payWaySelected = index;
      this.payWayText = payway.text;
    },
    popSureEvent: function() {
      this.payWayPopShow = false;
    },
    popSureEvent1: function() {
      this.contratWayPopShow = false;
    },
    popSureEvent2: function() {
      this.payWayPopShow1 = false;
    },
    popClose: function() {
      this.payWayPopShow = false;
    },
    popClose2: function() {
      this.payWayPopShow1 = false;
    },
    popClose1: function() {
      this.contratWayPopShow = false;
    },
    // 重新结算
    _reSettleCart: function(carts, cardNo) {
      console.log(333);
      this.$Loading.open();
      let url = "/app/json/app_cart/SettleCart";
      let paramsData = this.paramsData;
      paramsData.couNo = [];
      if (carts) {
        paramsData.carts = carts;
      } else {
        if (this.usedCoupons.length > 0) {
          for (let i = 0; i < this.usedCoupons.length; i++) {
            paramsData.couNo.push(this.usedCoupons[i].couNo);
          }
        } else {
          paramsData.couNo.push("-1");
        }
      }
      paramsData.limitWalletCardNo = cardNo;

      if (this.deliveryType == 2) {
        if (this.$store.state.mall2.selectAddress.id != "") {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id;
        }
      }

      paramsData.pickupId = this.$store.state.mall2.zitiAddress.id;

      // if (this.usePoints) {
      //   paramsData.points = this.occurData.userCanUsePoints
      // } else {
      //   paramsData.points = 0
      // }
      let arr = [];
      for (let i = 0; i < this.payDigitals.length; i++) {
        let item = this.payDigitals[i];
        if (item.acctType != "LimitWallet") {
          arr.push(item);
        }
      }
      paramsData.payDigital = arr;

      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          this.complete = true;
          if (data.status == 0) {
            this.hasShengxian = false;
            this.lastRes = data.data;
            this.paramsData = paramsData;
            this.initData();
            if (this.limitType == "true") {
              this.getCardList();
            }
            this.$mallCommon.isExistCanNotAttendActivity(data.data.occur, true);
          } else {
            this.$Toast(data.info);
            this.reloadSelectedCoupon();
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
          this.reloadSelectedCoupon();
        }
      );
    },
    checkProductStock: function() {
      if (this.pageType == 2) {
        if (!this.selectItem.realName) {
          this.$Toast("请选择预约单联系方式！");
          return;
        }
      }
      if (this.productType == 8) {
        if (this.selectedServiceTime == "") {
          this.$Toast("请选择服务时间");
          return;
        }
      }
      console.log("save");
      if (!this.occurData.store || this.occurData.store.length == 0) {
        if (this.deliveryType == 1) {
          this.$Toast("当前自提点无库存！");
        } else {
          this.$Toast("当前地址无库存！");
        }
        return;
      }
      // 判断地区
      if (this.deliveryType == 1) {
        if (
          this.$store.state.mall2.pickUpUser == undefined ||
          this.$store.state.mall2.pickUpUser == ""
        ) {
          if (this.$route.params.productType != 514) {
            this.$Toast("请完善自提人信息");
            return;
          }
        } else if (this.pickupPhone == "") {
          if (this.$route.params.productType != 514) {
            this.$Toast("请完善自提人信息");
            return;
          }
        }
        this.$bridgefunc.vuexStorage();
      }
      if (
        !(this.$store.state.mall2.selectAddress.id > 0) &&
        this.deliveryType == 2 &&
        this.occurData.needVirtualUserPhone != "1"
      ) {
        if (this.$route.params.productType != 514) {
          this.$Toast("请维护并选择收货地址！");
          return;
        }
      }

      if (this.occurData.needPickupId == "1") {
        if (!(this.$store.state.mall2.zitiAddress.id > 0)) {
          this.$Toast("请选择商品兑换点！");
          return;
        }
      }

      // 判断是否填写推荐人
      if (this.occurData && this.occurData.needReferrer) {
        if (!this.referrer || this.referrer.length == 0) {
          this.$Toast("请填写推荐人");
          return false;
        }
      }

      for (let i = 0; i < this.payDigitals.length; i++) {
        let d = this.payDigitals[i];
        if (d.payDigital > 0 && d.payDigital > d.userBalanceDigital) {
          let str = "可用";
          str += this.getDigitalDisplayName(d.acctType);
          str += "余额不足！";
          this.$Toast(str);
          return;
        }
      }

      // 判断库存是否足够 提交订单先判断库存
      let storeArr = [];
      let carts = [];
      let hasNoStockItem = false;
      for (let i = 0; i < this.occurData.store.length; i++) {
        let store = this.occurData.store[i];
        let item = {};
        item.storeName = store.storeName;
        let idata = this.getNoStockImgArrs(store);
        carts = carts.concat(idata.canBuyArr);
        item.noStockArr = idata.noStockArr;
        if (idata.noStockArr.length > 0) {
          hasNoStockItem = true;
        }
        storeArr.push(item);
      }
      if (carts.length == 0) {
        this.$Toast("当前区域商品库存不足！");
        return;
      }
      if (this.cardBalance.balance - this.number <= 0) {
        this.$Toast("当前区域商品库存不足！");
        return;
      }
      if (hasNoStockItem) {
        NoStock.open({
          initData: {
            listData: storeArr
          },
          cancelEvent: () => {
            NoStock.close();
          },
          submitEvent: () => {
            NoStock.close();
            this._reSettleCart(carts);
          }
        });
      } else {
        if (this.pageType == 2) {
          if (this.payWayText == "提货付款") {
            //如果提货付款方式
            this.overFlag = true;
            this._submitOrder(carts);
          } else {
            // 不是提货付款，校验金额
            this.checkHighest_recharge(carts);
          }
        } else {
          this.checkCouponPrice(carts);
        }
      }
    },
    // 判断是否超过最大支付金额
    checkHighest_recharge(carts) {
      var that = this;
      if (this.occurData.amount > 10000) {
        Toast("订单金额已超过10000元，请选择提货支付支付方式");
      } else if (
        this.occurData.amount >
        this.$store.state.globalConfig.bulkpurchase_modifyprice
      ) {
        this.overFlag = true;
        Dialog.confirm({
          title: "标题",
          confirmButtonText: "申请改价",
          className: "price-con",
          getContainer: ".placeorder",
          cancelButtonText: "算了吧~",
          message: `您的订单金额已到达改价金额${this.$store.state.globalConfig.bulkpurchase_modifyprice}元，可选择联系管理员进行改价后进行支付`
        })
          .then(() => {
            that.checkCouponPrice(carts);
            // /mall2/submitFinished
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else {
        that.checkCouponPrice(carts);
      }
    },
    checkCouponPrice: function(carts) {
      if (
        this.occurData.cashCouponFaceValue > this.occurData.cashCouponAmount
      ) {
        this.$MessageBox
          .confirm("您的优惠券金额比订单金额大，确定使用吗？", "提示", {
            confirmButtonText: "确定"
          })
          .then(action => {
            this.checkNeedPwd(carts);
          })
          .catch(action => {});
      } else {
        this.checkNeedPwd(carts);
      }
    },
    checkNeedPwd: function(carts) {
      // needPayPwd: false, // 是否需要支付密码
      // payPwdState: 0, // 支付密码状态 0 未设置支付密码 1 支付密码已锁定 2 已设置支付密码
      this.digitalPWD = "";
      if (this.occurData.needPayPwd) {
        // 是否需要支付密码
        let hasDigitail = true;
        // for (let i = 0; i < this.payDigitals.length; i++) {
        //   let d = this.payDigitals[i]
        //   if (d.payDigital > 0) {
        //     hasDigitail = true
        //     break ;
        //   }
        // }
        if (hasDigitail) {
          // 是否需要虚拟支付
          if (this.occurData.payPwdState == "1") {
            this.$Toast("支付密码已锁定，请稍后再试！");
            return;
          }
          DigitalPwd.open({
            initData: {
              payPwdState: this.occurData.payPwdState
            },
            toSettingPwd: () => {
              this.$router.push({
                path: "/usercenter/nosetpwd",
                query: {
                  isSet: 0
                }
              });
              DigitalPwd.close();
            },
            inputFinished: value => {
              this.digitalPWD = value;
              this._submitOrder(carts);
              DigitalPwd.close();
            }
          });
        } else {
          this._submitOrder(carts);
        }
      } else {
        this._submitOrder(carts);
      }
    },
    pustLiveStreamMsg: function() {
      if (this.lbId == "") {
        return;
      }
      let url = "/app/json/live_broadcast/comment";
      let params = {
        lbId: this.lbId,
        content: "【下单】成功下单 " + this.lsProductName + " 🎉🎉🎉"
      };

      this.$http.post(url, params).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    updateBargainPayInfo: function(item) {
      let url = "/app/json/user_bargain/updateBargainPayInfo";
      let params = {
        id: item.id,
        orderId: item.orderId
      };
      this.$http.post(url, params).then(res => {
        // 砍价 前端不进行任何操作
      });
    },
    _submitOrder: function(carts) {
      let url = "/app/json/app_shopping_order/submit";
      let paramsData = this.$util.deepClone(this.paramsData);
      if (this.deliveryType == 1) {
        paramsData.pickupReceiver = this.$store.state.mall2.pickUpUser;
        paramsData.pickupMobile = this.pickupPhone;
        if (
          this.$store.state.globalConfig.order_pickup_time_selecter_show !=
          "false"
        ) {
          let time = this.$util.getMyDate(this.pickupTime);
          paramsData.selectReceiveTime = time;
        }
      }
      paramsData.pickupId = this.$store.state.mall2.zitiAddress.id;
      if (this.productType == 8) {
        if (this.selectedServiceTime != "") {
          paramsData.selectReceiveTime =
            this.selectedServiceTime.date.dateStr +
            " " +
            this.selectedServiceTime.time.label +
            ":00";
        }
      }
      // 下单场景
      paramsData.orderScene = this.$util.orderScene();
      paramsData.carts = carts;
      paramsData.couNo = [];
      if (this.usedCoupons.length > 0) {
        for (let i = 0; i < this.usedCoupons.length; i++) {
          paramsData.couNo.push(this.usedCoupons[i].couNo);
        }
      }
      paramsData.remark = [];
      for (let i = 0; i < this.occurData.store.length; i++) {
        let astore = this.occurData.store[i];
        let rm = {
          storeOuCode: astore.storeOuCode,
          remark: astore.remark
        };
        paramsData.remark.push(rm);
      }
      if (this.occurData.needVirtualUserPhone == "1") {
        paramsData.virtualUserPhone = this.$store.state.login.phone;
      }
      paramsData.userAddress = this.$store.state.mall2.selectAddress;
      paramsData.userAddressId = this.$store.state.mall2.selectAddress.id;
      paramsData.token = this.$store.state.login.token;
      paramsData.payDigital = this.payDigitals;
      if (this.digitalPWD != "") {
        paramsData.payPwd = md5String(this.digitalPWD);
      }

      //推荐人
      if (this.referrer && this.referrer.length) {
        paramsData["rfrCode"] = this.referrer;
        // 1 手动输入  2扫一扫
        if (this.referrer == this.scanCode) {
          paramsData["rfrCodeType"] = 2;
        } else {
          paramsData["rfrCodeType"] = 1;
        }
      }

      paramsData.userInvoice = {};
      if (this.currentInvoice != null && this.useInvoice == true) {
        paramsData.userInvoice.invoiceUse = "1";
        paramsData.userInvoice.invoiceType = "1";
        if (this.currentInvoice.type == 0) {
          // 个人
          paramsData.userInvoice.invoiceTitleType = "4";
          paramsData.userInvoice.invoiceTitle = "个人"; //this.currentInvoice.name
        } else {
          // 公司
          paramsData.userInvoice.invoiceTitleType = "5";
          paramsData.userInvoice.invoiceTitle = this.currentInvoice.company;
        }
        paramsData.userInvoice.invoiceUserName = this.currentInvoice.name;
        paramsData.userInvoice.invoiceUserEmail = this.currentInvoice.email;
        paramsData.userInvoice.invoiceUserMobile = this.currentInvoice.phone;
        paramsData.userInvoice.invoiceUserOrgTaxNo = this.currentInvoice.identifyNumber;
        // 票内容类型(0: 商品明细, 1:商品类别)
        paramsData.userInvoice.invoiceDetailType = this.currentInvoice.selectedGoodsType;
      }

      // 心愿单，下单相关
      if (this.$route.query.entryType == "wish") {
        if (!this.wishData.payMsg || !this.wishData.payNiceName) {
          return false;
        } else {
          paramsData.payUserNickName = this.wishData.payNiceName;
          paramsData.payUserMsg = this.wishData.payMsg;

          // 将地址信息更换为心愿人信息
          paramsData.userAddressId = this.paramsData.userAddressId;
          paramsData.provinceId = this.paramsData.provinceId;
          paramsData.cityId = this.paramsData.cityId;
          paramsData.countryId = this.paramsData.countryId;

          delete paramsData.payDigital;
          delete paramsData.userAddress;
        }
      }
      // 心愿单，下单相关end

      // 送礼相关
      if (this.buyType == "songli") {
        paramsData.orderPayType = "4";
      }
      // 微店 （河北二级页面
      let microStoreCode = sessionStorage.getItem("MICRO_StoreCode");
      if (microStoreCode) {
        paramsData.microStoreCode = microStoreCode;
      }
      if (this.microStoreCode) {
        paramsData.microStoreCode = this.microStoreCode;
      }
      this.$Loading.open();
      console.log(paramsData);
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            if (paramsData.bargainOrderId) {
              this.updateBargainPayInfo({
                id: paramsData.bargainOrderId,
                orderId: data.data.orderId
              });
            }
            sessionStorage.removeItem("RHY_Pickup_Address");
            sessionStorage.removeItem("Place_Order_Params");
            sessionStorage.removeItem("Place_Order_Delivery_Type");
            if (this.getTotalPrice() == 0) {
              // 发送直播购买成功消息
              this.pustLiveStreamMsg();
              if (this.buyType == "songli") {
                this.$router.replace({
                  path: "/config-giftBox",
                  query: {
                    payInfo: JSON.stringify(data.data),
                    carts: JSON.stringify(carts),
                    deliveryType: this.deliveryType
                  }
                });
              } else {
                this.$router.replace({
                  path: "/mall2/paysuccess",
                  query: {
                    selectedIndex: 1,
                    orderCategory: this.paramsData.orderCategory,
                    vipUnitUserCode: this.paramsData.vipUnitUserCode,
                    name: this.$route.params.name
                  }
                });
              }
            } else {
              if (this.overFlag) {
                this.$router.replace({
                  path: "/mall2/submitFinished",
                  query: {
                    payInfo: JSON.stringify(data.data),
                    occurOuCode: this.occurData.ouCode,
                    orderCategory: this.paramsData.orderCategory,
                    vipUnitUserCode: this.paramsData.vipUnitUserCode,
                    buyType: this.buyType, // songli
                    giftCards: JSON.stringify(carts),
                    deliveryType: this.deliveryType,
                    lbId: this.lbId
                  }
                });
              } else {
                this.$router.replace({
                  path: "/mall2/checkstand",
                  query: {
                    payInfo: JSON.stringify(data.data),
                    occurOuCode: this.occurData.ouCode,
                    orderCategory: this.paramsData.orderCategory,
                    vipUnitUserCode: this.paramsData.vipUnitUserCode,
                    buyType: this.buyType, // songli
                    giftCards: JSON.stringify(carts),
                    deliveryType: this.deliveryType,
                    name: this.$route.params.name,
                    lbId: this.lbId,
                    cutPrice: true // 砍价
                  }
                });
              }
            }
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    returnStoreProducts: function(store) {
      let num = 0;
      let num1 = 0; // 商品个数总数
      let proArr = [];
      let serviceArr = []; // 包含服务个数
      for (let k = 0; k < store.noActivityCart.length; k++) {
        let pro = store.noActivityCart[k];
        num1 += pro.number;
        if (pro.productType == 512) {
          // productType = 512 代表润滑油增值服务商品
          serviceArr.push(pro);
        } else {
          num++;
          pro.showLinePrice = true;
          proArr.push(pro);
          if (pro.productType == 6) {
            this.hasShengxian = true;
          }
        }
      }
      // num += store.noActivityCart.length
      for (let i = 0; i < store.activity.length; i++) {
        for (let j = 0; j < store.activity[i].cart.length; j++) {
          let pro = store.activity[i].cart[j];
          num1 += pro.number;
          if (pro.productType == 512) {
            // productType = 512 代表润滑油增值服务商品
            serviceArr.push(pro);
          } else {
            num++;
            pro.showLinePrice = true;
            proArr.push(pro);
            if (pro.productType == 6) {
              this.hasShengxian = true;
            }
          }
        }
      }
      let storeProData = {
        num: num,
        proNum: num1,
        proArr: proArr,
        serviceArr: serviceArr
      };
      store.storeProData = storeProData;

      this.count = store.storeProData.proNum;
    },
    initData: function() {
      this.pointsGain = this.lastRes.pointsGain;
      this.occurData = this.lastRes.occur[0];
      let beginPickupTime = this.occurData.beginPickupTime;
      if (beginPickupTime) {
        this.pickupStartTime = new Date(beginPickupTime.replace(/-/g, "/"));
      }
      if (!this.occurData) {
        this.occurData = {};
        if (this.deliveryType == 1) {
          this.$Toast("当前自提点无库存！");
        } else {
          this.$Toast("当前地址无库存！");
        }
        return;
      }

      for (let i = 0; i < this.occurData.store.length; i++) {
        let store = this.occurData.store[i];
        this.returnStoreProducts(store);
      }

      let couNo = this.occurData.couNo;
      this.usedCoupons = [];
      if (couNo && couNo.length > 0) {
        for (let i = 0; i < couNo.length; i++) {
          this.usedCoupons.push({
            couNo: couNo[i]
          });
        }
      }
      this.payDigitals = [];
      for (let i = 0; i < this.occurData.digitalList.length; i++) {
        let dItem = this.occurData.digitalList[i];
        if (dItem.acctType == "LimitWallet") {
          this.cardAmount = dItem.userBalanceDigital;
          this.userCanUseDigital = dItem.userCanUseDigital;
        }
        if (dItem.payDigital > dItem.fixedDigital) {
          this.payDigitals.push({
            acctType: dItem.acctType,
            userBalanceDigital: dItem.userBalanceDigital,
            payDigital: dItem.userCanUseDigital + dItem.fixedDigital
          });
        } else {
          this.payDigitals.push({
            acctType: dItem.acctType,
            userBalanceDigital: dItem.userBalanceDigital,
            payDigital: dItem.fixedDigital
          });
        }
      }

      this.reloadSelectedCoupon();
    },
    noMath: function() {
      let noMatch = this.$route.params.noMatch
        ? this.$route.params.noMatch
        : false;
      if (noMatch) {
        this.$MessageBox
          .confirm("没有相关区域的收货地址，是否要添加？", "提示", {
            confirmButtonText: "确定"
          })
          .then(action => {
            this.$router.push({
              path: "addaddress",
              query: {
                type: 1,
                isSave: true,
                direct: "direct"
              }
            });
          })
          .catch(action => {});
      }
    },

    // 获取心愿单付款人信息以及留言
    getWishMsg(isDefault = "") {
      this.$http
        .post("/app/json/wish_order/getRandomWishOrderConfig", {
          type: 2,
          isDefault
        })
        .then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.wishData = data.data;
          } else {
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$Toast(err);
        });
    },
    getContentTop: function() {
      if (this.noNavTop) {
        return "top: 0px;";
      }
      return "";
    },
    ...mapActions(["rfrCodeMapAction"])
  },
  activated() {
    if (this.isFirst) {
      this.isFirst = false;
    } else {
      this._reSettleCart(null);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.path == "/mall2/addresslist" ||
      to.path == "/mall2/mypickupaddress" ||
      to.path == "/mall2/addaddress" ||
      to.path == "/usercenter/agreement" ||
      to.path == "/usercenter/nosetpwd"
    ) {
    } else {
      this.$keepaliveHelper.deleteCache(this);
    }
    next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.adapter-iphoneX{
  width: 100%;
  height: 34px;
  background-color: #fff;
}

.cancel-tip {
  font-size: 12px;
  line-height: 16px;
  padding: 8px 0;
}

>>> .service {
  .title {
    padding: 10px 0;
  }

  .service-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
    color: #333;
    justify-content: space-between;

    .name {
      color: #333;
      width: 200px;
    }

    i {
      font-size: 12px;
      color: #333;
    }
  }
}

// 推荐人必填
.is-need-referrer {
  .label-middle {
    padding-left: 10px;
    position: relative;

    &::before {
      content: '*';
      display: block;
      font-size: 13px;
      color: $color-theme-r;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

// 心愿单相关样式
.wish-message-container {
  .top {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    padding: 12px 5px;
    align-items: center;

    .title {
      color: #333;
    }

    .random-btn {
      display: block;
      font-size: 13px;
      color: $color-text-d;
      extend-click();
    }
  }

  .msg-input-c {
    background-color;

    .msg-input {
      background-color: #f6f6f6;
      border-radius: 5px;
    }
  }

  .nick-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 5px;
    font-size: 14px;
    color: #333;

    .nick-title {
      font-size: 13px;
    }

    .name {
      text-align: right;
    }
  }
}

.wish-prod-stepper {
  float: right;
}

.placeorder {
  // 心愿单相关样式end
  width: 100%;
  height: 100%;
  overflow: hidden;

  .pick-up-tip {
    line-height: 1.4;
    margin: -5px 0px;
    color: red;
  }

  .points-rule-btn {
    margin: -10px 0;
    padding: 10px 0;
  }

  .pickup-shop {
    display: flex;
    align-items: center;
  }

  .flex-div {
    height: 100%;
    display: flex;
    flex-direction: column;

    .scroll-div {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      .colorfulline {
        margin: 0 -8px;
        height: 3px;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }

    .bottom-btns {
      /* height 70px; */
      overflow: hidden;

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
        // line-height 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        /* justify-content space-between;
        align-content space-between */
        /* .rmb-div {
          flex 1;
        } */
        .rmb-div {
          text-align: end;

          .count{
            margin-right:10px;
          }
        }

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
  }

  .pro-row {
    display: flex;
    align-items: center;

    .img-div {
      position: relative;
      width: 80px;
      height: 80px;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      .presale {
        position: absolute;
        left: 0;
        bottom: 0;
        border-radius: 0 15px 0 0;
        background: linear-gradient(90deg, #F8089F, #F80E26);
        font-size: 14px;
        font-weight: 500;
        color: white;
        padding: 5px 12px;
        z-index: 2;
      }
    }

    .info-div {
      padding-left: 8px;
      line-height: 16px;
      min-height: $font-size-medium;
      font-size: $font-size-medium;
      flex: 1;

      .title {
        margin-bottom: 5px;
      }

      .font-small {
        font-size: 12px;
      }
    }

    .activity-type {
      margin-top: 3px;
      font-size: 12px;
      padding: 2px 5px;
      width: 66px;
      border-radius: 3px;
      text-align: center;
      color: white;
    }
  }

  .pros-row {
    padding-bottom: 8px;
    /* overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap; */
    font-size: 0px;

    .img-div {
      margin-right: 8px;
      display: inline-block;
      width: 80px;
      height: 80px;
      position: relative;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      .presale {
        position: absolute;
        left: 0;
        bottom: 0;
        border-radius: 0 15px 0 0;
        background: linear-gradient(90deg, #F8089F, #F80E26);
        font-size: 14px;
        font-weight: 500;
        color: white;
        padding: 5px 12px;
        z-index: 2;
      }
    }

    .pros-msg {
      float: right;
      margin-top: 30px;
      font-size: 12px;

      i {
        font-size: 16px;
      }
    }
  }

  .title-max {
    height: 32px;
    margin-bottom: 8px;
  }

  .title-min {
    margin-bottom: 8px;
  }

  .scan-div {
    padding: 5px 10px;
  }

  .passwords-input {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .passwords {
      width: 75%;

      input {
        height: 30px;
        display: block;
        width: 100%;
        padding-left: 8px;
        font-size: $font-size-medium;
      }
    }

    .show-passwords {
      extend-click();

      img {
        display: block;
      }

      .scancode {
        width: 20px;
        height: 20px;
      }
    }
  }
}

.yj-pay-title {
  font-weight: bold !important;
  font-size: 14px !important;
}

.yj-card {
  .table-view-cell {
    padding: 13px 0;
  }
}

.item {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;

  .pro-img {
    width: 100%;
    display: block;
    height: 150px;
  }

  .card-content {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 15px 10px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: left;
    flex-direction: column;

    .top {
      display: flex;
      justify-content: space-between;

      .card-name {
        font-size: 18px;
        max-width: 266px;
        ellipse();
      }

      .card-type {
        font-size: 14px;
      }
    }

    .mid-price {
      margin-top: 15px;
      font-size: 28px;

      .icon {
        font-size: 14px;
      }
    }

    .btm-content {
      margin-top: 10px;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .now-use {
        font-size: 12px;
        padding: 1px 0;
        width: 65px;
        line-height: 22px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 15px;
      }
    }
  }
}

.pay-modal {
  border-radius: 15px 15px 0 0;
  height: 60%;
  display: flex;
  flex-direction: column;

  .spend-price {
    font-size: 30px;
    text-align: center;
    margin-top: 30px;
    font-weight: 700;

    span {
      font-size: 20px;
      font-weight: 500;
    }
  }

  .van-cell {
    align-items: center;
  }

  .pay-label {
    display: flex;
    align-items: center;

    .pay-icon {
      width: 25px;
      margin-right: 10px;
    }
  }

  .van-hairline--top-bottom::after {
    display: none;
  }

  .pay-confirm {
    padding: 15px 0;
    width: 100%;
    background-color: $color-theme-r;
    text-align: center;
    font-size: 20px;
    color: #fff;
    margin-top: 15px;
    flex-shrink: 0;
  }

  .close-img {
    padding: 15px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid $color-line-gray-l;

    .text {
      font-size: 16px;
    }

    .img {
      position: absolute;
      right: 10px;

      .close-btn {
        width: 15px;
      }
    }
  }

  /deep/ .van-checkbox {
    justify-content: center;
    padding: 10px 0;
  }

  .title-change {
    justify-content: center;
    align-items: center;
    padding: 5px 0 10px 0;

    /deep/ .van-radio__label {
      flex: inherit;
    }
  }

  /deep/ .van-radio-group {
    padding: 0 10px;
    flex: 1;
    overflow-y: auto;
    height: 100%;
  }

  .top {
    flex-shrink: 0;
    margin-bottom: 10px;
  }
}

/deep/ .van-radio__label {
  flex: 1;
}

/deep/ .van-dialog__content .van-dialog__message {
  padding: 20px 10px;
}
</style>
