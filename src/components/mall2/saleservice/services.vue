<template>
  <div class="returnservice">
    <nav-top :title="service" @backEvent="turnback"></nav-top>
    <nav-content v-if="isShow">
      <div class="scroll-info" ref="servicescrl">
        <div class="padding-con shadow-cell">
<!--          <goods-cell :goods-info="serviceItem" :goods-count="serviceItem.number"></goods-cell>-->
          <goods-cell :goods-info="serviceItem" :goods-count="$route.query.count":type="2"></goods-cell>
        </div>
<!--        <div class="return-con" v-if="serviceType==0&&$store.state.globalConfig.after_sale_whole_order_return==1&&goodsInfo.supportSingleProReturn==0">-->
        <div class="return-con" v-if="$route.query.flag">
          <div class="padding-con shadow-cell" v-if="serviceItem.returnSkuList.length>0">
            <div v-for="goods in serviceItem.returnSkuList">
              <goods-cell :goods-info="goods" :goods-count="goods.number"></goods-cell>
            </div>
          </div>
        </div>
<!--        <div v-if="serviceType==0|| serviceType==4&& serviceItem.returnSkuList.length" class="goods-list padding-con shadow-cell">-->
        <div v-if="(serviceType==0|| serviceType==4)&& serviceItem.returnSkuList.length&&!$route.query.flag" class="goods-list padding-con shadow-cell">
<!--          <div class="return-config-con" v-if="($store.state.globalConfig.after_sale_whole_order_return==1&&goodsInfo.supportSingleProReturn==1)||$store.state.globalConfig.after_sale_whole_order_return==0">-->
            <P class="title-font">以下商品可选择一起批量退货</P>
            <div class="allselected" @click="allSelected()">
              <i v-if="!selectAllBtn" class="iconfont mall-weixuanzhong theme_font_gray"></i>
              <i v-if="selectAllBtn" class="iconfont mall-dui theme_font_red"></i>
              <span class="content-font">&nbsp全选&nbsp({{selectedCount}})</span>
            </div>
            <div class="goods-cell" v-for="goods in serviceItem.returnSkuList" @click="returnGoodsClick(goods)">
              <div class="left-select">
                <i v-if="!goods.isChecked" class="iconfont mall-weixuanzhong theme_font_gray"></i>
                <i v-if="goods.isChecked" class="iconfont mall-dui theme_font_red"></i>
              </div>
              <div class="right-info">
                <img :src="goods.phPictureUrl"/>
                <div class="right-good">
                  <div class="goods-title theme_font_common content-font"><p>{{goods.skuName}}</p></div>
                  <div class="goods-price theme_font_gray">
                    <p class="small-font">购买数量：{{goods.number}}</p>
                    <!--<counter v-model="goods.count" :maxValue="goods.number"></counter>-->
                    <van-stepper v-model="goods.count" :min="1" :max="goods.number" integer @change="numchange(goods.count,goods.number)" @overlimit="overlimit"/>
                  </div>
                </div>
              </div>
            </div>

<!--          </div>-->
          </div>
        <div class="padding-con shadow-cell" @click="isShowChooseReason">
          <div class="reason content-font">
            <p>申请原因</p>
            <div class="theme_font_gray full single-line">
              {{reason}}
            </div>
            <i class="iconfont mall-gengduo theme_font_gray content-font"></i>
          </div>
        </div>
        <div v-if="serviceType==1" class="padding-con shadow-cell" @click="changeGoods">
          <div class="reason content-font">
            <p>换新商品</p>
            <div class="theme_font_gray full single-line">
              {{goodSkuName != '' ? goodSkuName : '请选择换新商品'}}
            </div>
            <i class="iconfont mall-gengduo theme_font_gray content-font"></i>
          </div>
        </div>
        <div class="padding-con shadow-cell">
          <p class="content-font">问题描述</p>
          <MixInput class="mixinput"
                    :text.sync="commentText"
                    :imageUrls.sync="commentImages"
                    placeholder="请描述申请售后服务的具体原因，同时上传图片">
          </MixInput>
        </div>
        <div v-if="serviceType==2" class="padding-con shadow-cell">
          <p class="content-font">维修方式</p>
          <div v-if="serviceItem.interfaceType == '2'">
            <div class="policy-title content-font">
              <p class="theme_bg_white border-con theme_font_red theme_bg_ml_red theme_border_red">上门取件</p>
            </div>
          </div>
          <div v-else>
            <div class="policy-title content-font" v-for="policy in serviceItem.repairList"
                 @click="chooseRepairMethod(policy.code)">
              <p class="theme_bg_white"
                 :class="{'border-con theme_font_red theme_bg_ml_red theme_border_red':methodsType==policy.code}">
                {{policy.value}}</p>
            </div>
          </div>
          <!--<p class="theme_font_gray small-font">寄回地址会在申请通过后以短信形式告知，或在申请记录中查询</p>-->
        </div>
        <div v-if="serviceType==0 || serviceType==1 || (methodsType==1 && serviceType==2)"
             class="padding-con shadow-cell">
          <p class="content-font">退货方式</p>
          <div v-if="serviceItem.interfaceType == '2'">
            <div class="policy-title content-font">
              <p class="theme_bg_white border-con theme_font_red theme_bg_ml_red theme_border_red">上门取件</p>
            </div>
          </div>
          <div class="policy-title theme_font_red content-font" v-else>
            <p class="theme_bg_ml_red theme_border_red  border-con">快递至第三方卖家</p>
          </div>
          <!--<p v-if="serviceType !=0" class="theme_font_gray small-font">寄回地址会在申请通过后以短信形式告知，或在申请记录中查询</p>-->
        </div>
        <div v-if="(serviceType!=0&& serviceType!=4)|| serviceItem.interfaceType == '2'" class="padding-con shadow-cell">
          <p class="content-font">{{(methodsType==0&&serviceType==2)?'上门地址':'收货地址'}}<span
            class="small-font theme_font_gray">（{{(methodsType==0&&serviceType==2)?'该地址是上门维修地址':'该地址是寄回给您的地址'}}）</span>
          </p>
          <div class="small-font theme_font_common address-con" @click="chooseAddress">
            <div class="address-left"><i class="iconfont mall-dingwei theme_font_red content-font"></i>&nbsp{{address}}
            </div>
            <i class="iconfont mall-gengduojiantou theme_font_gray content-font"></i>
          </div>
        </div>
        <div class="padding-con shadow-cell">
          <div class="input-cell">
            <p class="left-info content-font theme_font_common">联系人</p>
            <input class="input-info theme_bg_white_ef" type="text" v-model="contactname"/>
          </div>
          <div class="input-cell">
            <p class="left-info content-font theme_font_common">联系电话</p>
            <input class="input-info theme_bg_white_ef" type="number" v-model="contactphone"/>
          </div>
        </div>
      </div>
      <div class="submit-btn theme_bg_red theme_font_white" @click="_submitClick"><p>提交</p></div>
    </nav-content>
    <pop-view v-if="showReasons" @closeEvent="closeReason">
      <div class="reasons padding-con">
        <P class="reasons-title theme_font_common">申请原因</P>
        <div class="reasons-cell" v-for="(tip ,index) in reasonsList" @click="chooseReason(tip,index)">
          <i v-if="!tip.isChecked" class="iconfont mall-weixuanzhong theme_font_gray"></i>
          <i v-if="tip.isChecked" class="iconfont mall-dui theme_font_red"></i>
          <p class="reason-con theme_font_gray">{{tip.value}}</p>
        </div>
        <div class="submit-btn theme_bg_red theme_font_white" @click="closeReason"><p>确定</p></div>
      </div>
    </pop-view>
    <pop-view v-if="showChangeInfo" @closeEvent="closeGoods">
      <div class="change-info padding-con">
        <div class="top-image">
          <img :src="serviceItem.phPictureUrl">
          <P class="theme_font_common">商品编码：{{serviceItem.skuId}}</P>
        </div>
        <div class="brand-con">
          <div class="title content-font theme_font_common">品牌、规格</div>
          <div class="brand-cell" v-for="(tip ,index) in serviceItem.changeSkuList" @click="chooseGoods(tip,index)">
            <i v-if="!tip.isChecked" class="iconfont mall-weixuanzhong theme_font_gray"></i>
            <i v-if="tip.isChecked" class="iconfont mall-dui theme_font_red"></i>
            <p class="specs-con theme_font_gray">{{tip.skuName}}</p>
          </div>
        </div>
        <div class="submit-btn theme_bg_red theme_font_white" @click="closeGoods"><p>确定</p></div>
      </div>
    </pop-view>

  </div>
</template>

<script>
  import GoodsCell from '../common/goods-cell'
  // import Counter from '@/components/commonui/counter/counter'
  import MixInput from '@/components/commonui/mix-input/index'
  import {Indicator, Toast} from 'mint-ui';

  export default {
    name: 'returnservice',
    components: {
      GoodsCell,
      // Counter,
      MixInput,
      Indicator,
      Toast
    },
    data() {
      return {
        isShow: false,
        serviceType: 0,//服务类型
        service: '',//界面title
        selectedCount: 0,//退货时 选择批量退货数量
        contactname: '',//联系人
        contactphone: '',//联系人手机号
        methodsType: 0,//维修方式
        commentText: '',//申请描述
        commentImages: [],//申请售后图片
        showReasons: false,
        goodsInfo: {},//上个界面传值
        address: '',//选择地址、
        goodsCount: 0,//上界面 可申请数量
        reasonsList: [],//申请原因
        showChangeInfo: false,
        selectAddress: {},
        serviceItem: {},//请求的数据
        reason: '选择申请原因',
        selectAllBtn: false,
        scrollValue: 0,
        isSelectAddress: false,
        goodSkuName: ''
      }
    },
    methods: {
      numchange(num){
        event.stopPropagation();//原生阻止冒泡事件
        console.log(num)
      },
      overlimit(){
        event.stopPropagation();//原生阻止冒泡事件
      },
      getNavTitle: function () {
        console.log('getTitle')
        if (this.serviceType == 0) {
          this.service = '退货';
        } else if (this.serviceType == 1) {
          this.service = '换货';
        } else if (this.serviceType == 2) {
          this.service = '维修';
        } else if (this.serviceType == 3) {
          this.service = '补发商品';
        }else if(this.serviceType == 4){
          this.service = '退款(无需退货)';
        }
        console.log(this.service, this.serviceType)
      },
      _submitClick: function () {//提交售后
        if (this.contactphone === '' || !this.$util.checkMobile(this.contactphone)) {
          Toast({
            message: '请输入正确的手机号码',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.contactname === '') {
          Toast({
            message: '请输入联系人',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        let url = '/app/json/app_order_after_sale/afterSubmit'
        let params1 = {
          token: this.$store.state.login.token,
          province: this.isSelectAddress ? this.$store.state.mall2.selectAddress.province : this.serviceItem.province,
          city: this.isSelectAddress ? this.$store.state.mall2.selectAddress.city : this.serviceItem.city,
          country: this.isSelectAddress ? this.$store.state.mall2.selectAddress.country : this.serviceItem.country,
          town: this.isSelectAddress ? this.$store.state.mall2.selectAddress.town : this.serviceItem.town,
          address: this.address,
          skuDetailList: [],
          issueDesc: this.commentText,//问题描述
          picList: this.commentImages,//问题描述 图片
          consignee: '',//收货人
          realName: '',//退换货-收货人
          phone: '',//退换货-收货人联系电话
          remark: '',//备注
          type: this.serviceType==4?5:this.serviceType,//类型（0退货1换货2维修3补发5退款无需退货序号4 type传5）
          receiver: this.contactname,//收货人、
          mobile: this.contactphone,//收货人联系手机
          applyReason: '',
          number: this.$route.query.flag?this.serviceItem.number:this.$route.query.count,//申请数量
          mainOrderId: this.serviceItem.mainOrderId,
          id: this.serviceItem.id,
          skuId: this.serviceItem.skuId,
          phPictureUrl: this.serviceItem.phPictureUrl,//商品图片地址
          repairType: this.serviceType == 2 ? this.methodsType : ''//维修方式
        }
        for (let index in this.reasonsList) {
          if (this.reasonsList[index].isChecked) {
            params1.applyReason = this.reasonsList[index].code;
          }
        }
        if (this.serviceType == 0) {//退货时，一起批量退货信息
          let returnArr = [];
          for (let index in this.serviceItem.returnSkuList) {
            if(this.$route.query.flag==true){
              returnArr=this.serviceItem.returnSkuList
            }else{
              if (this.serviceItem.returnSkuList[index].isChecked) {
                let item = this.serviceItem.returnSkuList[index];
                returnArr.push({
                    phPictureUrl: item.phPictureUrl,
                    salePrice: item.salePrice,
                    skuId: item.skuId,
                    skuName: item.skuName,
                    number: item.count //申请数量
                  }
                )
              }
            }

          }
          params1.skuDetailList = returnArr;
        } else if (this.serviceType == 1) {//换货商品
          let returnArr = [];
          for (let index in this.serviceItem.changeSkuList) {
            if (this.serviceItem.changeSkuList[index].isChecked) {
              let item = this.serviceItem.changeSkuList[index];
              returnArr.push({
                  phPictureUrl: item.phPictureUrl,
                  salePrice: item.salePrice,
                  skuId: item.skuId,
                  skuName: item.skuName,
                  number: item.number
                }
              )
            }
          }
          params1.skuDetailList = returnArr;
        }
        if (params1.applyReason === '') {
          Toast({
            message: '请输选择申请原因',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        // 京东的商品，需要增加部分参数
        if (this.serviceItem.interfaceType == '2') {
          if (this.$store.state.mall2.selectAddress.provinceId == null || this.$store.state.mall2.selectAddress.provinceId == '' || this.$store.state.mall2.selectAddress.provinceId == undefined) {
            Toast({
              message: '请选择取件地址',
              position: 'bottom',
              duration: 2000,
            });
            return ;
          }
          params1.pickwareType = 4;
          params1.pickwareProvince = this.$store.state.mall2.selectAddress.provinceId;
          params1.pickwareCity = this.$store.state.mall2.selectAddress.cityId;
          params1.pickwareCounty = this.$store.state.mall2.selectAddress.countryId;
          params1.pickwareAddress = this.$store.state.mall2.selectAddress.address;
          params1.returnwareProvince = this.$store.state.mall2.selectAddress.provinceId;
          params1.returnwareCity = this.$store.state.mall2.selectAddress.cityId;
          params1.returnwareCounty = this.$store.state.mall2.selectAddress.countryId;
        }
        this.$Loading.open();
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('提交售后:', data);
          if (data.status == 0) {
            let arr = data.data;
            this.$store.state.mall2.servicecontact.contactname = this.contactname;
            this.$store.state.mall2.servicecontact.contactphone = this.contactphone;
            this.$router.push({
              path: '/mall2/submitsuccess',
              // query: {
              //   // orderInfo: encodeURIComponent(JSON.stringify(this.order)),
              // }
            })

          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('提交售后', error);
          this.$Toast('提交数据失败')
        });

      },
      allSelected: function () {//全选
        this.selectAllBtn = !this.selectAllBtn;
        for (let index in this.serviceItem.returnSkuList) {
          if (this.selectAllBtn) {
            this.serviceItem.returnSkuList[index].isChecked = true;
          } else {
            this.serviceItem.returnSkuList[index].isChecked = false;
          }
        }
        this.selectedCount = this.selectAllBtn ? this.serviceItem.returnSkuList.length : 0;
      },
      returnGoodsClick: function (goods) {//一起选择退货商品
        goods.isChecked = !goods.isChecked;
        let count = 0
        for (let index in this.serviceItem.returnSkuList) {
          if (this.serviceItem.returnSkuList[index].isChecked) {
            count += 1;
          }
        }
        this.selectedCount = count;
        if (count == this.serviceItem.returnSkuList.length) {
          this.selectAllBtn = true;
        } else {
          this.selectAllBtn = false;
        }
      },
      isShowChooseReason: function () {//申请理由
        console.log('申请理由')
        if (!this.showReasons) {
          this.showReasons = !this.showReasons;
        }
      },
      chooseReason: function (tip, idx) {
        for (let index in this.reasonsList) {
          if (index != idx) {
            this.reasonsList[index].isChecked = false;
          }
        }
        tip.isChecked = true;
        console.log('tip', tip)
      },
      closeReason: function () {//选择原因/商品
        for (let index in this.reasonsList) {
          if (this.reasonsList[index].isChecked) {
            this.reason = this.reasonsList[index].value;
          }
        }
        this.showReasons = false;
      },
      chooseGoods: function (goods, idx) {//选择商品
        for (let index in this.serviceItem.changeSkuList) {
          if (index != idx) {
            this.serviceItem.changeSkuList[index].isChecked = false;
          }
        }
        goods.isChecked = true;
        this.goodSkuName = goods.skuName
      },
      closeGoods: function (tip) {//选择商品
        this.showChangeInfo = false;
      },
      changeGoods: function () {//选择换新商品
        this.showChangeInfo = !this.showChangeInfo;
      },
      chooseAddress: function () {//选择地址
        this.$router.push({
          path: 'addresslist',
        });
      },
      chooseRepairMethod: function (type) {//选择维修方式

        if (type == '0') {
          this.methodsType = 0;
        } else if (type == '1') {
          this.methodsType = 1;
        }
        console.log(this.methodsType)
      },
      dealData: function () {
        let arr = [];
        if (this.serviceType == 0||this.serviceType == 4) {//
          arr = this.serviceItem.returnList;
        } else if (this.serviceType == 1) {
          arr = this.serviceItem.changeList;
        } else if (this.serviceType == 2) {
          arr = this.serviceItem.repairReasonList;
        } else if (this.serviceType == 3) {
          arr = this.serviceItem.fillList;
        }
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          this.reasonsList.push({
            isChecked: false,
            value: item.value,
            code: item.code
          })
        }

        if (this.serviceType == 0) {
          for (let index in this.serviceItem.returnSkuList) {
            this.$set(this.serviceItem.returnSkuList[index], 'count', 1)
            this.$set(this.serviceItem.returnSkuList[index], 'isChecked', false)
          }
          console.log('returnSkuList', this.serviceItem.returnSkuList)
        } else if (this.serviceType == 1) {
          for (let index in this.serviceItem.changeSkuList) {
            this.$set(this.serviceItem.changeSkuList[index], 'count', 0)
            this.$set(this.serviceItem.changeSkuList[index], 'isChecked', false)
          }
          console.log('changeSkuList', this.serviceItem.changeSkuList)
        }
        this.address = this.serviceItem.provinceName+this.serviceItem.cityName+this.serviceItem.countryName+this.serviceItem.townName+this.serviceItem.address;

        this.contactname = this.serviceItem.receiver;
        this.contactphone = this.serviceItem.mobile;
      },
      _getApplyPage: function () {//查询退货时可以一起退货的商品接口/原因等
        let url = '/app/json/app_order_after_sale/applyPage'
        this.$Loading.open();
        let params1 = {
          token: this.$store.state.login.token,
          mainOrderId: this.goodsInfo.mainOrderId,
          id: this.goodsInfo.id,
          skuId: this.goodsInfo.skuId,
          type: this.serviceType == 4 ? 5 : this.serviceType, // 类型（0退货1换货2维修3补发5退款无需退货序号4 type传5）
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('退货商品:', data);
          if (data.status == 0) {
            this.serviceItem = data.data;
            this.dealData();
            this.isShow = true;
            console.log(this.reasonsList);
          } else {
            this.$Toast(data.info)
            this.isShow = false;
          }
        }, error => {
          this.isShow = false;
          this.$Loading.close()
          console.log('获取退货商品', error);
          this.$Toast('获取数据失败')
        });
      },
      turnback: function () {//返回
        this.$router.go(-1);
      },
    },
    created() {
      this.serviceType = this.$route.query.type;
      this.goodsInfo = this.$route.query.order ? JSON.parse(decodeURIComponent(this.$route.query.order)) : '';
      this.goodsCount = this.$route.query.count ? JSON.parse(decodeURIComponent(this.$route.query.count)) : 0;
      // this.address = this.$store.state.mall2.defaultAddress.addressFull;
      this.getNavTitle();
      this._getApplyPage();
      this.contactname = this.$store.state.mall2.servicecontact.contactname;
      this.contactphone = this.$store.state.mall2.servicecontact.contactphone;
      // if (this.serviceType == 0) {
      //   this._getReturnItem()
      // }
    },
    activated() {
      if (this.scrollValue != 0) {
        this.$refs.servicescrl.scrollTop = this.scrollValue
      }
    },
    beforeRouteLeave(to, from, next) {
      if ('/mall2/addresslist' != to.path) {
        this.$keepaliveHelper.deleteCache(this)
      } else {
        this.scrollValue = this.$refs.servicescrl.scrollTop
      }
      next()
    },
    watch: {
      '$store.state.mall2.selectAddress': function () {
        this.isSelectAddress = true;
        this.address = this.$store.state.mall2.selectAddress.addressFull;
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .returnservice {
    width 100%
    height 100%
    overflow hidden
    .scroll-info {
      position absolute
      top 0px;
      right 0px;
      left 0px;
      bottom 50px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch
      .goods-list {
        .allselected {
          margin-top 10px
          display flex
          align-items center
          i {
            font-size 19px
          }
        }

        .goods-cell {
          padding 10px 0px
          display flex
          align-items center
          .left-select {
            i {
              font-size 19px
            }

          }
          .right-info {
            flex 1
            display flex
            align-items center
            img {
              width 73px
            }
            .right-good {
              width 100%
              .goods-title {
                -webkit-line-clamp: 2;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                p {
                  line-height 15px
                }
              }
              .goods-price {
                display flex
                align-items center
                margin-top 10px
                P {
                  flex 1
                }
              }
            }
          }
        }

      }
      .reason {
        display flex
        align-items center
        padding 8px 0px
        p {
          width 80px;
        }
        .full {
          padding-right 8px;
          text-align right;
          flex 1
        }
      }
      .policy-title {
        margin 10px 0px
        display inline-block
        margin-right 16px
        p {
          padding 5px 10px
          border-radius: 15px;
          -webkit-border-radius: 15px;
        }
      }
      .input-cell {
        display flex
        align-items center
        height 38px
        padding 5px 0px
        /*background-color magenta*/
        .left-info {
          width 60px
        }
        .input-info {
          height 100%
          width 190px
          padding-left 7px
          border-radius: 15px;
          -webkit-border-radius: 15px;
          font-size font-size $font-size-medium-s
        }
      }

      .address-con {
        display flex
        align-items center
        margin-top 12px
        .address-left {
          flex 1
        }
      }
      .mixinput {
        margin-top 10px
      }
    }

    .submit-btn {
      position absolute
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      display flex
      align-items center
      P {
        width 100%
        text-align center
        font-weight $font-weight-xx
        font-size $font-size-large
      }
    }

    .reasons {
      height 340px
      .reasons-title {
        font-size $font-size-medium-x
        margin-top 5px
      }
      .reasons-cell {
        display flex
        align-items center
        margin-top 10px
        i {
          font-size $font-size-large
        }
        .reason-con {
          flex 1
          margin-left 10px
          font-size $font-size-medium
        }

      }

    }
    .change-info {
      .top-image {
        padding-bottom 12px;
        display flex
        align-items center
        img {
          width 80px;
          height 80px;
          margin-right 8px;
        }
        p {
          margin-left 5px
          font-size $font-size-medium
        }
      }

      .brand-con {
        /*padding-bottom 50px*/
        height 225px
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch
        .title {
          padding 10px 0px;
        }
        .brand-cell {
          display flex
          align-items center
          padding 10px 0px
          i {
            font-size $font-size-large
          }
          .specs-con {
            flex 1
            margin-left 10px
            font-size $font-size-medium
          }
        }
      }
    }
    .padding-con {
      padding 10px 10px
    }
    .title-font {
      font-size $font-size-medium
      font-weight $font-weight-x
    }
    .content-font {
      font-size $font-size-medium-s
    }
    .small-font {
      font-size $font-size-small
    }
    .border-con {
      border 0.5px solid
    }

  }

</style>
