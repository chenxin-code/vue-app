<template>
  <div class="fillorder mall2">
    <nav-top @backEvent="turnback"></nav-top>
    <nav-content>
      <div class="scroll-order">
        <div class="top-title shadow-cell edge left-icon">
          <!--<P class="bigtitle">{{proName}}</P>-->
          <div class="attention">
            <div class="left-icon">
              <!--<i class="iconfont mall-dui theme_font_red"></i>-->
              <!--<span class="theme_font_gray">凭身份证直接入园</span>-->
              <P class="bigtitle">{{proName}}</P>
            </div>
            <P class="right-note theme_font_red" @click="readDescription">购买说明</P>
          </div>
        </div>
        <div class="top-title shadow-cell edge">
          <P class="bigtitle">使用日期<span class="use-date theme_font_red">({{cartItem.bookingDate}})</span></P>
          <!--<p class="choose-date theme_font_red">{{cartItem.bookingDate}}</p>-->
          <!--<div class="choose-date">-->
          <!--<p class="theme_font_red small-font">{{cartItem.bookingDate}}</p>-->
          <!--<div class="date-con" v-for="(inde,index) in dates" @click="chooseDate(inde,index)"-->
          <!--:class="chooseIndex==index ?'theme_bg_red':'border_con'">-->
          <!--<p class="date-title theme_font_gray" :class="{'theme_font_white':chooseIndex==index}">{{inde.title}}</p>-->
          <!--<p class="date-price theme_font_common" :class="{'theme_font_white':chooseIndex==index}">-->
          <!--{{inde.price}}</p>-->
          <!--</div>-->
          <!--</div>-->
          <div class="limit-con">
            <div class="left-place">
              <p class="bigtitle">{{cartItem.bookingType}}&nbsp&nbsp
                <span class="small-font theme_font_red">￥</span><span
                  class="bigtitle theme_font_red">{{cartItem.price}}</span>
              </p>
              <div class="content theme_font_common">成人或身高1.5米（不含）以上儿童</div>
              <div class="content theme_font_red">每笔订单最多可购20张，最少不少于1张</div>
            </div>
            <div class="right-place">
              <!--<Counter v-model="memberCount" :stepNum="saleNumStep" :minValue="saleNumBegin" :maxValue="countMax" @numChange="numChange"></Counter>-->
              <van-stepper v-model="memberCount" :min="saleNumBegin" :max="countMax" :step="saleNumStep" @change="numChange" integer/>
            </div>
          </div>
        </div>
        <div class="top-title shadow-cell edge">
          <div class="menmber">
            <P class="bigtitle">出行人<span class="small-font">（您需填写{{memberCount}}位出行人）</span></P>
            <!--<div class="addmenmber">-->
              <!--<div class="left-mem theme_font_gray">需添加{{memberCount}}位出行人</div>-->
              <!--<i class="iconfont mall-jia-copy theme_font_red" @click="addpeople"></i>-->
            <!--</div>-->
          </div>
          <div class="person-cell" v-if="personList.length" v-for="(person,index) in personList">
            <div class="info-row theme_font_gray">
              <span class="theme_font_common">姓名</span>
              <input placeholder="请输入出行人姓名" v-model="person.name"/>
            </div>
            <div class="info-row theme_font_gray">
              <span class="theme_font_common">身份证号</span>
              <input placeholder="请输入出行人身份证号码" v-model="person.Idcard"/>
            </div>
            <div class="info-row theme_font_gray">
              <span class="theme_font_common">手机号</span>
              <input placeholder="请输入出行人手机号" v-model="person.phone"/>
            </div>
          </div>
        </div>
        <div class="top-title shadow-cell edge">
          <div class="bigtitle">联系人信息<span class="small-font">（必填）</span></div>
          <div class="fields">
            <div class="info-row theme_font_gray">
              <span class="theme_font_common">手机号</span>
              <input placeholder="仅支持中国大陆手机号" v-model="phone"/>
              <div>
                <count-button class="theme_font_red_i"  @getSmsEvent="getMsgCode" :phone="phone" ref="countBtn"></count-button>
              </div>
            </div>
            <div class="info-row theme_font_gray">
              <span class="theme_font_common">验证码</span>
              <input placeholder="请输入验证码" v-model="verifyCode"/>
            </div>
            <div class="info-row theme_font_gray">
              <span class="theme_font_common">身份证号</span>
              <input placeholder="请输入18位有效身份证" v-model="identityCard"/>
            </div>
            <!--<mt-field class="mtfield" label="手机号" placeholder="仅支持中国大陆手机号" v-model="phone">-->
              <!--&lt;!&ndash;<div class="verify-btn theme_font_red theme_border_red">&ndash;&gt;-->
              <!--&lt;!&ndash;获取验证码&ndash;&gt;-->
              <!--<count-button class="theme_font_red_i"  @getSmsEvent="getMsgCode"  ref="countBtn"></count-button>-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</mt-field>-->
            <!--<mt-field class="mtfield" label="验证码" placeholder="验证码" v-model="verifyCode"></mt-field>-->
            <!--<mt-field class="mtfield" label="身份证号" placeholder="请输入18位有效身份证" v-model="identityCard"></mt-field>-->
          </div>
        </div>
        <div class="top-title shadow-cell edge">
          <div class="info-row theme_font_gray" @click="couponEvent">
            <span class="theme_font_common">优惠券</span>
            <div class="value theme_font_black">优惠{{$util.toDecimal2(currentOccur.couponAmount)}}元</div>
            <div>
              <i class="iconfont mall-gengduojiantou theme_font_gray"></i>
            </div>
          </div>
          <div class="info-row theme_font_gray">
            <span class="theme_font_common">发票</span>
            <div class="value theme_font_tint">请参考商品详情说明或联系商家咨询</div>
          </div>
          <!--<mt-field class="mtfield" label="优惠券"-->
                    <!--:placeholder="currentOccur.userCanUseCoupon.length?'可用'+currentOccur.userCanUseCoupon.length+'张':'暂无可用'"-->
                    <!--v-model="cusCouFaceValue" readonly='readonly'>-->
            <!--<i class="iconfont mall-gengduojiantou theme_font_gray" @click="couponEvent"></i>-->
          <!--</mt-field>-->
          <!--<mt-field class="mtfield" label="发票" placeholder="请参考商品详情说明或联系商家咨询" readonly='readonly'></mt-field>-->
        </div>
        <div class="block-div">
          <div class="flex-row">
            <div class="label-middle full theme_font_common">商品金额</div>
            <div class="theme_font_black">￥{{$util.toDecimal2(currentOccur.amount)}}</div>
          </div>
          <div class="flex-row">
            <div class="label-middle full theme_font_common">立减</div>
            <div class="theme_font_red">-￥{{$util.toDecimal2(currentOccur.discountAmount)}}</div>
          </div>
          <!--<div class="flex-row">-->
            <!--<div class="label-middle full theme_font_common">运费</div>-->
            <!--<div class="theme_font_red">+￥{{$util.toDecimal2(currentOccur.freightAmount)}}</div>-->
          <!--</div>-->
          <div class="flex-row">
            <div class="label-middle full theme_font_common">优惠券</div>
            <div class="theme_font_red">-￥{{$util.toDecimal2(currentOccur.couponAmount)}}</div>
          </div>
          <div class="flex-row">
            <div class="label-middle full theme_font_common">积分</div>
            <div class="theme_font_red">-￥{{$util.toDecimal2(currentOccur.pointsAmount)}}</div>
          </div>
        </div>
      </div>
      <div class="bottom-con">
        <div class="tip-con theme_font_red theme_bg_yl">
          <div class="tips">
            <p>请您确认平台将收集您的上述个人信息实现本服务</p>
            <p>提交订单即视为同意</p>
          </div>
        </div>
        <div class="btn-con">
          <div class="amount-con">
            <p class="amount">应付总金额：
              <span class="theme_font_red small-font">￥</span><span class="theme_font_red  bigtitle">{{$util.toDecimal2(currentOccur.payAmount)}}</span>&nbsp&nbsp共{{memberCount}}张
              <!--<span class="theme_font_red " @click="detailsClick">明细<i-->
                <!--class="iconfont mall-gengduojiantou theme_font_gray"></i></span>-->
            </p>
          </div>
          <div class="submit-btn theme_bg_red theme_font_white" @click="_submieClick"><p>提交订单</p></div>
        </div>
      </div>
    </nav-content>
    <pop-view v-if="showDescription" @closeEvent="popClose">
      <div class="introductions">
        <div class="bigtitle">购买说明</div>
        <!--<div class="subtitle theme_font_red">{{proName}}票规则说明</div>-->
        <div class="subtitle theme_font_red"></div>
        <div class="detail-content-div" v-html="mobileParam"></div>
        <!--<div class="intro-cell" v-for="explain in descriptions">-->
          <!--<div class="explain-title theme_font_common">{{explain.title}}</div>-->
          <!--<div class="explain theme_font_gray" v-for="detail in explain.values">{{detail}}</div>-->
        <!--</div>-->
      </div>
    </pop-view>
  </div>
</template>

<script>
  import {Field} from 'mint-ui';
  // import Counter from '@/components/commonui/counter/counter'
  import CountButton from '@/components/commonui/count-button';
  import {Indicator, Toast} from 'mint-ui';
  import Coupon from '../common/coupon'

  export default {
    name: 'fillorder',
    components: {
      Field,
      // Counter,
      CountButton,
      Indicator,
      Toast
    },
    data() {
      return {
        chooseIndex: 0,
        phone: '',
        verifyCode: '',
        identityCard: '',
        memberCount: 1,
        showDescription: false,
        descriptions: [
          {
            title: '预订规则',
            values: [
              '购买时间：18：00前可购买当天以后的票',
              '有效期：制定日起当天使用'
            ],
          }, {
            title: '费用说明',
            values: [
              '费用包括：汕头方特欢乐世界票（1大1小）1张',
            ],
          }, {
            title: '使用说明',
            values: [
              '入园方式：汕头方特欢乐世界票（1大1小）1张',
              '商品说明：适用于一位成人和一位儿童（1.2米<=儿童身高<1.5）'
            ],
          }, {
            title: '退改规则',
            values: [
              '退款说明：门票已购买不支持退票',
              '改票说明：不支持改期'
            ],
          }, {
            title: '其他说明',
            values: [
              '限购说明：每笔订单限购5张',
              '其他事项：门票一经预订不支持退款'
            ],
          }
        ],
        occur: [],//订单数据
        currentOccur: {},
        overtime: false,
        personList: [{
          name: '',
          Idcard: '',
          phone: ''
        }],
        usedCoupon: {
          couNo: '-1'// -1 时代表不用电子券
        },
        cartItem: {},
        cusCouFaceValue: '优惠0.00元',
        isShow:false,
        proName: '',

        saleNumBegin: '',
        saleNumStep: '',
        saleNumMax: '',
        stockNum: '',
        countMax: 20,
        mobileParam: ''
      }
    },
    methods: {
      numChange: function () {
        if (this.personList.length > this.memberCount) {
          let num = this.personList.length - parseInt(this.memberCount)
          this.personList.splice(this.memberCount, num);
        } else if (this.personList.length < this.memberCount) {
          let num = parseInt(this.memberCount) - this.personList.length
          for (let i = 0; i < num; i++) {
            this.personList.push({
              name: '',
              Idcard: '',
              phone: ''
            })
          }
        }
      },
      readDescription: function () {//购买说明
        this.showDescription = !this.showDescription;
      },
      popClose: function () {
        this.showDescription = !this.showDescription;
      },
      _getverifyCode: function () {//获取验证码
        if (this.phone === '' || !this.$util.checkMobile(this.phone)) {
          Toast({
            message: '请输入正确的手机号码',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open();
        let url = '';
        let params1 = {
          token: this.$store.state.login.token,
          // id:id
        }
        console.log(params1)
        this.$http.post(url, params1).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              // button 开始倒计时
              // 设置短信验证码输入框 允许输入
              // 复原短信验证码超时状态为false未超时。
              this.$refs.countBtn.countDown();
              this.overtime = false;
              Toast({
                message: data.info ? data.info : '验证码发送成功',
                position: 'bottom',
                duration: 2000,
              });
            } else {
              Toast({
                message: data.info ? data.info : '验证码发送失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            this.$Loading.close();
            Toast({
              message: '验证码发送失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );

      },
      chooseDate: function (item, index) {
        this.chooseIndex = index;
      },
      detailsClick: function () {//明细

      },
      // addpeople: function () {//添加出行人
      //   this.$router.push('/mall2/newlyperson');
      // },
      _submieClick: function () {//提交订单
        if (this.verifyCode === '') {
          Toast({
            message: '请输入验证码',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.identityCard === '' || this.identityCard.length != 18 || !this.$util.IDCardCheck(this.identityCard)) {
          Toast({
            message: '请输入有效的身份证号',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.phone === '' || !this.$util.checkMobile(this.phone)) {
          Toast({
            message: '请输入有效的手机号码',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        // if (this.personList.length < this.memberCount) {
        //   Toast({
        //     message: '请添加' + this.memberCount + '位出行人',
        //     position: 'bottom',
        //     duration: 2000,
        //   });
        //   return
        // }
        let finished = true
        for (let i = 0; i < this.personList.length; i++) {
          let item = this.personList[i]
          let msg = '请完善出行人信息！'
          if (item.name == '') {
            finished = false
          }
          if (item.Idcard == '') {
            finished = false
          } else if (!this.$util.IDCardCheck(item.Idcard)) {
            finished = false
            msg = '请输入正确的身份证号码！'
          }
          if (item.phone == '') {
            finished = false
          } else if (!this.$util.checkMobile(item.phone)) {
            finished = false
            msg = '请输入正确的手机号码！'
          }
          if (!finished) {
            Toast({
              message: msg,
              position: 'bottom',
              duration: 2000,
            });
            return
          }
        }
        this.$Loading.open();
        let url = '/app/json/app_shopping_order/submit';
        let params1 = {
          token: this.$store.state.login.token,
          guest: this.personList,
          virtualUserPhone: this.phone,
          virtualUserIdcard: this.identityCard,
          virtualCheckcode: this.verifyCode,
          carts: [{
            skuId: this.cartItem.skuId,
            storeOuCode: this.cartItem.storeOuCode,
            number: this.memberCount,
            checked: '1',
          }],
          deliveryType: this.cartItem.deliverType,
          couNo: []
        }
        // 下单场景
        params1.orderScene = this.$util.orderScene()
        if (this.usedCoupon.couNo && this.usedCoupon.couNo != '-1') {
          params1.couNo.push(this.usedCoupon.couNo);
        }
        console.log(params1)
        this.$http.post(url, params1).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              if (parseFloat(data.data.payAmount) == 0) {
                this.$router.replace({
                  path: '/mall2/paysuccess',
                  query:{
                    selectedIndex:3
                  }
                });
              } else {
                // this.$router.replace({
                //   name: '收银台',
                //   params: {
                //     payInfo: data.data,
                //     occurOuCode: this.currentOccur.ouCode
                //   }
                // })
                this.$router.replace({
                  path: '/mall2/checkstand',
                  query: {
                    payInfo: JSON.stringify(data.data),
                    // this.occurData.ouCode,
                    occurOuCode: this.currentOccur.ouCode
                  }
                })
              }
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      countOverTime: function (val) {//
        this.overtime = val;
      },
      //获取短信验证码
      getMsgCode:function(imgVerifyCode,uuid){
        if(this.phone == ''){
          this.$Toast('手机号不能为空!')
          return;
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          phone: this.phone,
          smsType:'1110',
          imgVerifyCode:imgVerifyCode,
          uuid:uuid
        };
        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$Toast('获取短信验证码成功')
            }else {
              this.$Toast(data.info?data.info:'获取短信验证码失败')
              this.$refs.countBtn.resetClock();
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
            this.$refs.countBtn.resetClock();
          }
        )
      },
      deleteClick: function (person,index) {//删除出行人
        this.personList.splice(index,1)
        this.$store.state.mall2.tripPeopleList = this.personList;
      },
      couponEvent: function () {
        for (let i = 0; i < this.currentOccur.userCanUseCoupon.length; i++) {
          if (this.currentOccur.userCanUseCoupon[i].couNo == this.usedCoupon.couNo) {
            this.currentOccur.userCanUseCoupon[i].selected = true
          } else {
            this.currentOccur.userCanUseCoupon[i].selected = false
          }
        }
        Coupon.open({
          initData: {
            listData: [],
            userCanNotUseCoupon: this.currentOccur.userCanNotUseCoupon,
            userCanUseCoupon: this.currentOccur.userCanUseCoupon,
            type: 'use',
            skuId: '',
            categoryId: '',
            storeOuCode: '',
            token: this.$store.state.login.token
          },
          selectedCoupon: (coupon) => {
            console.log(coupon)
            this.usedCoupon = coupon;
            this._settleCart();
            Coupon.close();
          }
        })
      },
      _settleCart: function () {
        this.$Loading.open();
        let url = '/app/json/app_cart/SettleCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: this.cartItem.skuId,
            storeOuCode: this.cartItem.storeOuCode,
            number: this.memberCount,
            checked: '1',
          }],
          deliveryType: this.cartItem.deliverType,
          couNo: []
        };
        console.log(this.usedCoupon)
        if (this.usedCoupon.couNo) {
          paramsData.couNo.push(this.usedCoupon.couNo);
        }
        console.log(paramsData)
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.occur = data.data.occur
              this.currentOccur = this.occur[0]
              this.$mallCommon.isExistCanNotAttendActivity(data.data.occur, true);
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      turnback:function () {//返回
        this.$router.go(-1);
        this.$keepaliveHelper.deleteCache(this)
      },
    },
    watch: {
      'memberCount': function (val, oldVal) {
        if (val) {
          this._settleCart();
        }
      },
      '$store.state.mall2.tripPeopleList':function () {
        this.personList = this.$store.state.mall2.tripPeopleList;
      },
      verifyCode(val) {
        this.verifyCode = this.$util.checkVerifyCodeLenght(this.verifyCode);
      }
    },
    created() {
      this.occur = this.$route.params.occur ? this.$route.params.occur : []
      this.proName = this.$route.params.proName ? this.$route.params.proName : ''

      this.saleNumBegin = this.$route.params.saleNumBegin
      this.saleNumStep = this.$route.params.saleNumStep
      this.saleNumMax = this.$route.params.saleNumMax
      this.stockNum = this.$route.params.stockNum

      this.mobileParam = this.$route.params.mobileParam ? this.$route.params.mobileParam : ''

      this.countMax = this.saleNumMax > this.stockNum ? this.stockNum : this.saleNumMax;

      if (this.occur.length) {
        this.currentOccur = this.occur[0]
        let couNo = this.currentOccur.couNo
        if (couNo.length > 0) {
          this.usedCoupon.couNo = couNo[0]
        }
      }
      if (this.currentOccur.store.length) {
        // activity里面没有数据就取noActivityCart里面的数据
        let activity = this.currentOccur.store[0].activity//activity 里面的 cart 与 noActivityCart 数据结构相同
        if (!activity.length){
          activity = this.currentOccur.store[0].noActivityCart
          this.cartItem = activity[0]
          this.memberCount = this.cartItem.number
        }else {
          if (activity.length) {
            let activityItem = activity[0]
            if (activityItem.cart.length) {
              this.cartItem = activityItem.cart[0]
              this.memberCount = this.cartItem.number
            }
          }
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      // if (to.path == 'ticketdetail'){
        this.$keepaliveHelper.deleteCache(this)
      // }
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .fillorder {
    width 100%
    height 100%
    overflow hidden
    .scroll-order {
      position absolute
      top 0px;
      right 0px;
      left 0px;
      bottom 80px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch
      .top-title {
        /*height 200px*/
        p {
          padding-top 5px
          white-space: nowrap
          text-overflow: ellipsis
          overflow: hidden

        }
        .attention {
          display: flex
          margin-top 10px
          .left-icon {
            flex 1
            display flex
            align-items center
            font-size $font-size-small
            span {
              margin-left 8px
            }
            i {
              font-size $font-size-medium-x
            }
          }
          .right-note {
            font-size $font-size-medium-s

          }
        }
      }
      .choose-date {
        margin-left 12px
        font-size $font-size-medium
        /*background-color magenta*/
        /*
        .date-con {
          display inline-block
          width 22.5%
          margin-left 2%
          padding 20px 0px
          text-align center
          border-radius: 8px;
          -webkit-border-radius: 8px;
          .date-title {
            font-size $font-size-small
            font-weight $font-weight-m
          }
          .date-price {
            margin-top 18px
            font-size $font-size-medium-s
            font-weight $font-weight-x
          }
        }*/
      }
      .limit-con {
        margin-top 10px;
        display flex
        .left-place {
          flex 1
          .content {
            margin-top 14px;
            margin-bottom 5px;
            font-size $font-size-small
          }
        }
        .right-place {
          font-size $font-size-small
          height 25px
        }
      }
      .menmber {
        // border-bottom 1px solid $color-text-lll
        .addmenmber {
          display flex
          margin 10px 0px
          .left-mem {
            flex 1
            font-size $font-size-small
          }
          i {
            font-size $font-size-medium
          }
        }
      }

      .person-cell {
        padding 10px 0;
        border-bottom 1px solid #efefef
      }
      .info-row {
        display flex;
        align-items center;
        padding 3px 0px;
        span {
          width 70px;
          font-size $font-size-medium-s
        }
        input {
          padding-right 10px;
          flex 1;
          font-size $font-size-medium-s
          height 24px;
        }
        .value {
          padding-right 10px;
          flex 1;
          font-size $font-size-medium-s
          line-height 24px;
          height 24px;
        }
      }
      .person-cell:nth-last-child(1) {
        padding-bottom 0px
        border-bottom none
      }
      .contact {
        padding 10px 12px 0px 12px
      }
      .coupon {
        padding 12px 0px
      }
      .fields {
        padding 10px 0 0;
      }
    }
    .bottom-con {
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      overflow hidden;

      .tip-con {
        /*padding 8px 24px*/
        width 100%
        font-size $font-size-small-s
        .tips {
          overflow hidden;
          padding 4px 12px;
          line-height 16px;
        }
      }
      .btn-con {
        display flex
        height 50px
        width 100%

        .amount-con {
          flex 1
          display flex
          align-items center
          .amount {
            /*text-align center*/
            margin-left 5px
            font-size $font-size-medium-s
            i {
              font-size $font-size-medium
            }
          }
        }
        .submit-btn {
          padding 0px 12px
          display flex
          align-items center
          p {
            font-weight $font-weight-xx
            font-size $font-size-large
          }
        }
      }
    }
    .introductions {
      padding 12px 10px
      .detail-content-div {

      }
      .subtitle {
        font-size $font-size-medium-s
        margin-top 12px
      }
      .intro-cell {
        padding 10px 0px
        border-bottom 1px solid $color-text-ll
        .explain-title {
          font-size $font-size-medium-s
          font-weight $font-weight-m
        }
        .explain {
          margin-top 8px
          font-size $font-size-small
        }
      }

    }
    .bigtitle {
      font-size $font-size-medium-x
      font-weight $font-weight-m
      .use-date {
        font-size 12px;
        margin-left 10px;
      }
    }
    .edge {
      padding 10px 12px
    }
    .border_con {
      border 1px solid $color-text-lll
    }
    .small-font {
      font-size $font-size-small-s
    }

    .margin-con {
      margin-bottom 10px
    }
  }

</style>
