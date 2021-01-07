<template>
  <div>
    <!-- webType:1:app,2:微信公众号,3:小程序 -->
<!--    <nav-top @backEvent="backEvent"  :noBack="$store.state.webtype == 3"></nav-top>-->
    <nav-top @backEvent="backEvent"  :noBack="$store.state.webtype == 3&&!$route.query.EnterFlag"></nav-top>
    <nav-content class="group-detail-container" v-if="detailShow">
      <div class="group-detail">
        <div class="detail-top">
          <div class="countdown">
            <span>砍价倒计时:</span>
            <countdown class="count-down-con" :hiddenDay="false" :endTime="detailsRow.timEnew" type="theme_bg_white" @timeOut="timeOut"></countdown>
          </div>
          <div class="sku-detail" @click="toDetails" v-if="$store.state.webtype == 1">
            <span>商品详情</span>
          </div>
        </div>
        <group :groupCoupon="detailsRow" :showStatus="1" :isLeader="true" @success='success'/>
      </div>
      <div class="scrolling" v-if="$store.state.webtype == 2 || $store.state.webtype == 3">
        <div class="status" v-if='detailsRow.state == 1'>
          <div class='text'>已砍 {{ $util.toDecimal2((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100)/100)}}元，还差 {{$util.toDecimal2((Number(detailsRow.actPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</div>
          <div class="progress"><van-progress pivot-text="" color="#ee0a24" :percentage="Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100 ? (Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100) / (Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)*100 : 0" /> </div>
          <div class="progress-text"><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
          <div class="progress-text" v-if="isCutPrice&&getIsTakePartCutObj.role==1"><span style="display: block;margin:0 auto;font-size: 16px">助力成功</span></div>
          <div class="btn">
            <!-- // state 1 帮砍中  2 成功  3失败 -->
            <!-- 0:自砍，1:帮砍 -->
            <!-- <span v-if="getIsTakePartCutObj.role">
              <span v-if="!isCutPrice" @click.stop="assistance(detailsRow)">我要助力</span>
              <span v-if="isCutPrice">助力成功</span>
            </span>
            <span v-if="!getIsTakePartCutObj.role" @click.stop="launchBtn(detailsRow)">邀请好友砍价</span> -->
              <span v-if="!isCutPrice" @click.stop="assistance(detailsRow)">我要助力</span>
<!--              <span v-if="isCutPrice && getIsTakePartCutObj.role==1">助力成功</span>-->
              <span v-if="isCutPrice && getIsTakePartCutObj.role==0" @click.stop="launchBtn(detailsRow)">邀请好友砍价</span>
              <span v-if="isCutPrice && getIsTakePartCutObj.role==1" @click.stop="enterHome">发起我的砍价</span>
              <span v-if="!isCutPrice && getIsTakePartCutObj.role==1" @click.stop="enterHome">发起我的砍价</span>
          </div>
        </div>
        <div class="status success" v-if='detailsRow.state == 2'>
           <div class='text'>已砍 {{ $util.toDecimal2((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100)/100)}}元，还差 {{$util.toDecimal2((Number(detailsRow.actPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</div>
          <div class="progress"><van-progress pivot-text="" color="#44ab0a" :percentage="((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100) / (Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)*100) || 0" /> </div>
          <div class="progress-text" v-if="getIsTakePartCutObj.role==0"><span style="margin-right: 90px;">恭喜您砍价成功！</span><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
          <div class="progress-text" v-if="getIsTakePartCutObj.role!=0"><span style="margin-right: 90px;">您的好友已完成砍价</span><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
          <div class="progress-text" v-if="isCutPrice&&getIsTakePartCutObj.role==1"><span style="display: block;margin:0 auto;font-size: 16px">助力成功</span></div>
          <div class="btn" v-if='detailsRow.orderState == 2'>
            <span v-if="!getIsTakePartCutObj.role" @click.stop="payEvent(detailsRow)">去支付</span>
<!--            <span v-if="getIsTakePartCutObj.role">助力成功</span>-->
            <span v-if="getIsTakePartCutObj.role" @click.stop="enterHome">发起我的砍价</span>

          </div>
          <div class="btn" v-if='detailsRow.orderState == 3'>
            <span v-if="!getIsTakePartCutObj.role" >已支付</span>
<!--            <span v-if="getIsTakePartCutObj.role">助力成功</span>-->
            <span v-if="getIsTakePartCutObj.role" @click.stop="enterHome">发起我的砍价</span>
          </div>
          <div class="btn" v-else>
            <span v-if="getIsTakePartCutObj.role==0" @click.stop="successBtn(detailsRow)">立即购买</span>
<!--            <span v-if="getIsTakePartCutObj.role==1">助力成功</span>-->
            <span v-if="getIsTakePartCutObj.role==1" @click.stop="enterHome">发起我的砍价</span>
          </div>
        </div>
        <div class="status fail" v-if='detailsRow.state == 3 || detailsRow.state == 4'>
           <div class='text'>已砍 {{ $util.toDecimal2((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100)/100)}}元，还差 {{$util.toDecimal2((Number(detailsRow.actPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</div>
          <div class="progress"><van-progress pivot-text="" color="#ee0a24" :percentage="((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100) / (Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)*100) || 0" /> </div>
          <div class="progress-text"><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
          <div class="progress-tip" v-if="detailsRow.state == 4&&getIsTakePartCutObj.role==0"><span>您慢了一步，本场活动已销售空，砍价失败</span></div>
          <div class="progress-tip" v-if="getIsTakePartCutObj.role==1"><span>您的好友砍价已失败</span></div>
          <div class="btn">
            <span @click.stop="failBtn">砍价失败</span>
          </div>
        </div>
        <p v-if="prizeCoupon.length">帮砍赠券</p>
        <div class="evaluation">
          <couponGroup v-for="(item,index) in prizeCoupon" :groupCoupon="item" :detailsRow='detailsRow' :getIsTakePartCutObj="getIsTakePartCutObj" @getCouScan='getCouScan' :isCutPrice='isCutPrice' :key="index"/>
        </div>
        <p>砍价记录</p>
        <div class="evaluation">
          <div class="evaluation-top" v-for="(item,index) in friendList" :key="index" v-show="index < 3 || isEvaluation">
<!--            <span>{{phone(item.userName)}}</span>-->
            <span>{{item.userName}}</span>
            <span>{{item.role ? '帮砍' : '自砍'}} ¥{{item.cutPrice}}</span>
            <span>{{item.cutTime}}</span>
          </div>
          <div class="evaluationBtn" v-if="friendList.length && friendList.length >=3">
            <div class="evaluationText" @click="isEvaluation = !isEvaluation">
              <span v-if="!isEvaluation">查看更多</span>
              <van-icon name="arrow-up" v-if="isEvaluation"/>
              <span v-if="isEvaluation">收起</span>
              <van-icon name="arrow-down" v-if="!isEvaluation"/>
            </div>
          </div>
          <div class="evaluationBtn" style="color: #989898"> 暂无其他砍价记录~ </div>
        </div>
        <p>砍价流程</p>
        <div class="group-process">
          <div class="group-process-content">
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/发起砍价.png" alt="">-->
<!--              <p class="text">发起砍价</p>-->
<!--            </div>-->
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/邀请帮砍.png" alt="">-->
<!--              <p class="text">邀请帮砍</p>-->
<!--            </div>-->
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/砍价成功.png" alt="">-->
<!--              <p class="text">砍价成功</p>-->
<!--            </div>-->
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/领券下单.png" alt="">-->
<!--              <p class="text">支付下单</p>-->
<!--            </div>-->
          </div>
          <div class="group-process-actDesc" v-html="detailsRow.actDesc">{{rexFilter(detailsRow.actDesc)}}</div>
        </div>
      </div>
      <div class="scrolling" v-else>
        <div class="status" v-if='detailsRow.state == 1'>
          <div class='text'>已砍 {{ $util.toDecimal2((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100)/100)}}元，还差 {{$util.toDecimal2((Number(detailsRow.actPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</div>
          <div class="progress"><van-progress pivot-text="" color="#ee0a24" :percentage="Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100 ? (Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100) / (Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)*100 : 0" /> </div>
          <div class="progress-text"><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
          <div class="btn">
            <span @click.stop="launchBtn(detailsRow)">邀请好友砍价</span>
          </div>
        </div>
        <div class="status success" v-if='detailsRow.state == 2'>
          <div class='text'>已砍成功</div>
          <div class="progress"><van-progress pivot-text="" color="#44ab0a" :percentage="((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100) / (Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)*100) || 0" /> </div>
          <div class="progress-text" v-if="getIsTakePartCutObj.role==0"><span style="margin-right: 90px;">恭喜您砍价成功！</span><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
<!--          包含砍价的人和没砍价的人-->
          <div class="progress-text" v-if="getIsTakePartCutObj.role!=0"><span style="margin-right: 90px;">您的好友已完成砍价</span><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
          <div class="btn">
<!--            邀请砍价的人-->
<!--            <span v-if="!getIsTakePartCutObj.role && detailsRow.orderState == 3">已支付</span>-->
            <span v-if="getIsTakePartCutObj.role==0 && detailsRow.orderState == 3">已支付</span>
<!--            <span v-if="!getIsTakePartCutObj.role && detailsRow.orderState == 2" @click.stop="payEvent(detailsRow)">去支付</span>-->
            <span v-if="getIsTakePartCutObj.role==0 && detailsRow.orderState == 2" @click.stop="payEvent(detailsRow)">去支付</span>
<!--            <span v-if="!getIsTakePartCutObj.role && detailsRow.orderState != 2 && detailsRow.orderState != 3" @click.stop="successBtn(detailsRow)">立即购买</span>-->
            <span v-if="getIsTakePartCutObj.role==0 && detailsRow.orderState != 2 && detailsRow.orderState != 3" @click.stop="successBtn(detailsRow)">立即购买</span>
<!--            砍价的人-->
            <span v-if="getIsTakePartCutObj.role==1" @click.stop="launchBtn(detailsRow)">邀请好友砍价</span>
            <span v-if="getIsTakePartCutObj.role==1" @click.stop="enterHome">发起我的砍价</span>
          </div>
        </div>
        <div class="status fail" v-if='detailsRow.state == 3 || detailsRow.state == 4'>
           <div class='text'>已砍 {{ $util.toDecimal2((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100)/100)}}元，还差 {{$util.toDecimal2((Number(detailsRow.actPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</div>
          <div class="progress"><van-progress pivot-text="" color="#ee0a24" :percentage="((Number(detailsRow.origPrice)*100-Number(detailsRow.actPrice)*100) / (Number(detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)*100) || 0" /> </div>
          <div class="progress-text"><span>¥ {{$util.toDecimal2(Number((detailsRow.origPrice)*100-Number(detailsRow.minPrice)*100)/100)}}元</span></div>
          <div class="progress-tip" v-if="detailsRow.state == 4&&getIsTakePartCutObj.role==0"><span>您慢了一步，本场活动已销售空，砍价失败</span></div>
          <div class="progress-tip" v-if="getIsTakePartCutObj.role==1"><span>您的好友砍价已失败</span></div>
          <div class="btn">
            <span @click.stop="failBtn">砍价失败</span>
          </div>
        </div>
        <p v-if="prizeCoupon.length">帮砍赠券</p>
        <div class="evaluation">
          <couponGroup v-for="(item,index) in prizeCoupon" :groupCoupon="item" :detailsRow='detailsRow' :getIsTakePartCutObj="getIsTakePartCutObj" @getCouScan='getCouScan' :isCutPrice='isCutPrice' :key="index"/>
        </div>
        <p v-if="friendList.length">砍价记录</p>
        <div class="evaluation" v-if="friendList.length">
          <div class="evaluation-top" v-for="(item,index) in friendList" :key="index" v-show="index < 3 || isEvaluation">
<!--            <span>{{phone(item.userName)}}</span>-->
            <span>{{item.userName}}</span>
            <span>{{item.role ? '帮砍' : '自砍'}} ¥{{item.cutPrice}}</span>
            <span>{{item.cutTime}}</span>
          </div>
          <div class="evaluationBtn" v-if="friendList.length && friendList.length >=3">
            <div class="evaluationText" @click="isEvaluation = !isEvaluation">
              <span v-if="!isEvaluation">查看更多</span>
              <van-icon name="arrow-up" v-if="isEvaluation"/>
              <span v-if="isEvaluation">收起</span>
              <van-icon name="arrow-down" v-if="!isEvaluation"/>
            </div>
          </div>
          <!-- <div class="evaluationBtn" style="color: #989898"> 暂无砍价记录~ </div> -->
        </div>
        <p>拼团流程</p>
        <div class="group-process">
          <div class="group-process-content">
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/发起砍价.png" alt="">-->
<!--              <p class="text">发起砍价</p>-->
<!--            </div>-->
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/邀请帮砍.png" alt="">-->
<!--              <p class="text">邀请帮砍</p>-->
<!--            </div>-->
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/砍价成功.png" alt="">-->
<!--              <p class="text">砍价成功</p>-->
<!--            </div>-->
<!--            <div class="group-process-item">-->
<!--              <img class="img" src="../image/领券下单.png" alt="">-->
<!--              <p class="text">支付下单</p>-->
<!--            </div>-->
          </div>
          <div class="group-process-actDesc" v-html="detailsRow.actDesc">{{rexFilter(detailsRow.actDesc)}}</div>
<!--          <div class="group-process-actDesc" v-html="detailsRow.actDesc">{{detailsRow.actDesc}}</div>-->
        </div>
      </div>
     </nav-content>
     <div class="mall2">
      <pop-view v-if="showPop" @closeEvent="popClose">
        <div class="pop-body">
          <div class="pro-row">
            <div class="img-div">
              <img :src="detailData.phMainUrl">
            </div>
            <div class="info-div">
              <div class="title theme_font_black" v-html="getSkuNameStr(detailData)"></div>
            </div>
          </div>
          <div class="pop-scroll-div">
            <!-- <div class="items-div" v-for="(feature, fidx) in detailData.featureList" v-if="featureRefresh">
              <div class="title theme_font_common">{{feature.featureName}}</div>
              <div class="item theme_font_common theme_bg_white_ef"
                  :class="{'theme_light_bg_i theme_standard_font_i theme_standard_bdr_i': subFeature.selected, 'theme_font_tint_i': getCanSelectWith(fidx, subFeature)}"
                  v-for="subFeature in feature.featureValueList" @click="subFeatureEvent(subFeature, fidx)">
                {{subFeature.featureValue}}
              </div>
            </div> -->
            <div class="count-line">
              <div class="full theme_font_common">购买数量（库存 {{stockNum < 1000 ? stockNum : '充足'}}）</div>
              <van-stepper v-model="selectedNum" :min="minNum" :max="maxNum" :step="stepNum" @change="numChange" integer/>
            </div>
          </div>
          <div class="bottom-btn theme_font_white theme_bg_red" @click="popSureEvent">立即购买
          </div>
        </div>
      </pop-view>
     </div>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex";
  import Config from '@/api/config'
  import wxfunc from '@/utils/wxfunc'
  import group from "./group.vue"
  import couponGroup from "./coupon-group.vue"
  import Countdown from "@/components/Vendor/countdown/countdown"
  export default {
    name: '',
    data() {
      return {
        detailShow: false,
        shareView: false,
        time: '',
        param: {},
        skuItem: {},
        showPop: false,
        deliveryType: '',
        selectedNum: 1,
        stepNum: 1,
        maxNum: 1,
        minNum: 1,
        stockNum: 1,
        detailData: {},
        getIsTakePartCutObj: {
          role: 0,
          isGetPrize: 0
        },
        bargainOrderId: '',
        prizeCoupon: [],
        friendList: [],
        detailsRow: {
          tagging: 'bargainDetails'
        },
        isEvaluation: false,
        isCutPrice: false
      }
    },
    computed: {
      ...mapGetters(["userInfo"]),
      bg() {
        return require('../image/group_bg_top.png')
      }
    },
    activated() {
      this.showPop = false
      this.skuItem = this.$route.query
      this.param.id = this.skuItem.origId
      // origId  id
      // origUserId  app 点 为空 不传 分享出去打开时 获取 URL 上（分享人的）
      if (this.$store.state.webtype != 1) {
        this.param.origUserId = this.$route.query.userId // 分享出去传
      }
      this.getdDetails(this.param)
      this._getProductDetail()
    },
    mounted() {
      // console.log(this.detailsRow,'this.detailsRow')
      // let shareData = {};
      // let item = this.detailsRow
      // shareData.title = item.proName
      // shareData.sharetext = item.actDesc
      // shareData.imageurl = item.pcMainUrl
      // shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/bargain/bargain_details?id=${this.skuItem.id}&skuId=${this.skuItem.skuId}&productId=${this.skuItem.id}&bargainActId=${this.skuItem.bargainActId}&storeOuCode=${this.skuItem.storeOuCode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&origId=${this.skuItem.origId}`
      // console.log(shareData.detailurl,'shareData.detailurl')
      // if (this.$store.state.webtype == 1) {
      //   // this.$bridgefunc.wechatShare(shareData)
      // } else if (this.$store.state.webtype == 2) {
      //   wxfunc.wxSetShareData(shareData);
      // } else if (this.$store.state.webtype == 3) {
      //   let path = wxfunc.wxmpPath(this.$route)
      //   let share = {
      //     title: item.proName,
      //     path: Config.shareUrl + `/bargain/bargain_details?id=${this.skuItem.id}&skuId=${this.skuItem.skuId}&productId=${this.skuItem.id}&bargainActId=${this.skuItem.bargainActId}&storeOuCode=${this.skuItem.storeOuCode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&origId=${this.skuItem.origId}`,
      //     imageUrl: item.pcMainUrl
      //   }
      //   wx.miniProgram.postMessage({ data: JSON.stringify(share) });
      // }
    },
    methods: {
      rexFilter(originString){
          var result = originString.replace(/&([^&;]+);/g, function(matchStr, b) {
            var entity = {
              quot: '"',
              lt: '<',
              gt: '>',
              apos: "'",
              amp: '&',
              ldquo: '“',
              rdquo: '”'
            };
            var r = entity[b];
            return typeof r === 'string' ? r : matchStr;
          });
          return result;
      },
      enterHome(){
        this.$router.push({
          path:'/bargain/home'
        })
      },
      shareM(){
        console.log(this.detailsRow,'this.detailsRow')
        let shareData = {};
        let item = this.detailsRow
        shareData.title = item.proName
        shareData.sharetext = item.actDesc
        shareData.imageurl = item.pcMainUrl
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/bargain/bargain_details?id=${this.skuItem.id}&skuId=${this.skuItem.skuId}&productId=${this.skuItem.id}&bargainActId=${this.skuItem.bargainActId}&storeOuCode=${this.skuItem.storeOuCode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&origId=${this.skuItem.origId}`
        console.log(shareData.detailurl,'shareData.detailurl')
        if (this.$store.state.webtype == 1) {
          // this.$bridgefunc.wechatShare(shareData)
        } else if (this.$store.state.webtype == 2) {
          wxfunc.wxSetShareData(shareData);
        } else if (this.$store.state.webtype == 3) {
          let path = wxfunc.wxmpPath(this.$route)
          let share = {
            title: item.proName,
            path: Config.shareUrl + `/bargain/bargain_details?id=${this.skuItem.id}&skuId=${this.skuItem.skuId}&productId=${this.skuItem.id}&bargainActId=${this.skuItem.bargainActId}&storeOuCode=${this.skuItem.storeOuCode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&origId=${this.skuItem.origId}`,
            imageUrl: item.pcMainUrl
          }
          wx.miniProgram.postMessage({ data: JSON.stringify(share) });
        }
      },
      phone(str) {
        let pat=/(\d{3})\d*(\d{4})/
        return str.replace(pat,'$1****$2');
      },
      getIsTakePartCut (origId) {
        this.$request.post("/app/json/user_bargain/getIsTakePartCut",{ origId: origId,origUserId: this.detailsRow.origUserId}).then(res => {
          if (res.status == 0) {
            this.isCutPrice = !!res.data
            this.getIsTakePartCutObj = res.data || {}
            this.detailShow = true
          } else {
            this.$Toast(res.info);
          }
        })
      },
      timeOut() {
        this.$request.post("/app/json/user_bargain/bargainActEnd",{id: this.detailsRow.id}).then(res => {
          if (res.status == 0) {
          } else {
            this.$Toast(res.info);
          }
        })
      },
      toDetails() {
        let path = '/bargain/prodetail'
        this.$router.push({
          path: path,
          query: Object.assign({},this.skuItem,{justdetail: 1})
        })
      },
      getdDetails(obj) { // productId：活动商品id，bargainActId：活动id，origUserId：发起人用户ID
        this.$request.post("/app/json/user_bargain/getBargainProductDetail",obj).then(res => {
          if (res.status == 0) { // state 1 帮砍中  2 成功  3失败 4无库存导致的失败
            this.detailsRow = Object.assign({},{tagging: 'bargainDetails'},res.data || {})
            this.detailsRow.timEnew = this.$util.getDateFromString(this.detailsRow.createTime) + this.detailsRow.lengthTime * 60
            this.prizeCoupon = JSON.parse(this.detailsRow.prizeCoupon)
            this.getIsTakePartCut(this.detailsRow.id)
            this.shareM()
            this.getFriendList()
          } else {
            this.$Toast(res.info);
            this.detailsRow = Object.assign({},{tagging: 'bargainDetails'})
          }
        })
      },
      getFriendList() {
        let obj = Object.assign({origId: this.detailsRow.id},{ productId: this.detailsRow.productId,bargainActId: this.detailsRow.bargainActId, origUserId: this.detailsRow.origUserId})
        this.$request.post("/app/json/user_bargain/getFriendList",obj).then(res => {
          if (res.status == 0) {
            this.friendList = res.data || []
          } else {
            this.$Toast(res.info);
          }
        })
      },
      getCouScan(row) { // 领券
        this.$request.post("/app/json/user_bargain/startPrizeAct", Object.assign({},{id: this.detailsRow.id, actId: this.detailsRow.actId},this.param)).then(res => {
          if (res.status == 0) {
            this.$Toast('领取成功')
            this.getdDetails(this.param)
          } else {
            this.$Toast(res.info);
          }
        })
      },
      cutPriceBtn() { // origUserId：发起人用户ID，role：角色（0:自砍，1:帮砍） productId：帮砍商品id
        let obj = {
          productId: this.detailsRow.productId,
          // origUserId: this.detailsRow.userId
        }
        if (this.$store.state.webtype != 1) {
          obj.role = 1
          obj.origUserId = this.detailsRow.origUserId
        } else {
          obj.role = 0
        }
        this.$request.post("/app/json/user_bargain/cutPrice", obj).then(res => {
          if (res.status == 0) {
            console.log(this.$util.getPreTime(this.time))
            this.$Toast('助力成功');
            this.getdDetails(this.param)
            this.getFriendList(this.param)
          } else {
            this.$Toast(res.info);
          }
        })
      },
      success() {},
      // 阻力
      assistance() {
        this.$request.post("/app/json/user_bargain/cutPrice",{origId: this.detailsRow.id,productId: this.detailsRow.productId, origUserId: this.detailsRow.origUserId, role: 1}).then(res => {
          if (res.status == 0) {
            this.$Toast('助力成功')
            this.getdDetails(this.param)
            this.getFriendList(this.param)
          } else {
            this.$Toast(res.info);
          }
        })
      },
      // 邀请
      launchBtn(item) {
        // if (this.$store.state.webtype == 1) {
        //   let shareData = {};
        //   shareData.title = item.proName
        //   shareData.sharetext = item.actDesc
        //   shareData.imageurl = item.pcMainUrl
        //   shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/bargain/bargain_details?id=${this.skuItem.id}&skuId=${this.skuItem.skuId}&productId=${this.skuItem.id}&bargainActId=${this.skuItem.bargainActId}&storeOuCode=${this.skuItem.storeOuCode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&origId=${this.skuItem.origId}`
        //   this.$bridgefunc.wechatShare(shareData)
        // } else if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
        //   let shareData = {
        //     title: item.proName,
        //     sharetext: item.actDesc,
        //     path: (this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/bargain/bargain_details?id=${this.skuItem.id}&skuId=${this.skuItem.skuId}&productId=${this.skuItem.id}&bargainActId=${this.skuItem.bargainActId}&storeOuCode=${this.skuItem.storeOuCode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&origId=${this.skuItem.origId}`),
        //     imageUrl: item.pcMainUrl
        //   }
        //   wx.miniProgram.postMessage({data:JSON.stringify(shareData)})
        //   this.shareView = true
        // }

        let shareData = {};
        shareData.title = item.proName
        shareData.sharetext = item.actDesc
        shareData.imageurl = item.pcMainUrl
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/bargain/bargain_details?id=${this.skuItem.id}&skuId=${this.skuItem.skuId}&productId=${this.skuItem.id}&bargainActId=${this.skuItem.bargainActId}&storeOuCode=${this.skuItem.storeOuCode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&origId=${this.skuItem.origId}`

        if (this.$store.state.webtype == 1) {
          this.$bridgefunc.wechatShare(shareData)
        } else if (this.$store.state.webtype == 2) {
          wxfunc.getWechatSignature((isSignature) => {
            if (isSignature) {
              this.shareView = true
            } else {
              console.log('签名失败');
            }
          });
        } else if (this.$store.state.webtype == 3) {
          this.shareView = true
        }
      },
      failBtn() {},
      payEvent: function(item) {
        let obj = {
          orderType: '200015',
          orderId: item.orderId
        }
        this.$request.post("/app/json/app_shopping_order/detail", obj).then(res => {
          if (res.status == 0) {
            let data = res.data || {}
            this.$router.push({
              path: '/mall2/checkstand',
              query: {
                payInfo: JSON.stringify({
                  orderId: data.id,
                  orderType: data.orderType,
                  payAmount: data.payAmount,
                  tradeNo: data.tradeNo
                }),
                occurOuCode: data.ouCode,
                cutPrice:true
              }
            })
          } else {
            this.$Toast(res.info);
          }
        })
      },
      // 立即购买
      successBtn: function () {
        // if (this.stockNum < this.selectedNum) {
        //   this.$Toast('当前商品库存不足！')
        //   return;
        // }
        this.$Loading.open();
        let url = '/app/json/app_cart/SettleCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: this.detailData.skuId,
            storeOuCode: this.detailData.storeOuCode,
            number: 1,
            checked: '1',
          }],
          deliveryType: this.detailData.deliveryType,
          userAddress: this.$store.state.mall2.selectAddress,
          pickupId: this.$store.state.mall2.zitiAddress.id,
          bargainOrderId: this.detailsRow.id
        };
        if (this.deliveryType == 2) {
          if (this.$store.state.mall2.selectAddress.id > 0) {
            paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
          }
        }
        console.log(this.detailData,'this.detailData')
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let params = {
                cutPrice:1,
                res: data.data,
                paramsData: paramsData,
                productType: this.detailData.productType,// 充值卡类商品514没有地址和自提点
                deliveryType: this.detailData.deliveryType,
                skuCode: this.$route.query.skuCode, // 商品编码
                storeOuCode: this.$route.query.storeOuCode, // 店铺编码
              };
              let recommendPhone = this.$route.query.recommendPhone
              if (recommendPhone && recommendPhone != undefined && recommendPhone != '') {
                params.recommendPhone = recommendPhone
              }
              if (!(this.$store.state.mall2.selectAddress.id > 0) && this.detailData.deliveryType == 2) {
                if (this.matchAddress) {
                  this.$store.state.mall2.selectAddress = this.matchAddress;
                  this.$bridgefunc.vuexStorage(() => {
                  })
                } else {
                  params.noMatch = true;
                }
              }
              if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
                this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
                  this.$router.push({
                    name: '填写订单',
                    params: params
                  })
                }).catch(action => {
                });
              } else {
                this.$router.push({
                  name: '填写订单',
                  params: params
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
      // 请求详情信息
      _getProductDetail: function () {
        this.$Loading.open();
        let url = '/app/json/product/getAppProDetail';
        let paramsData = {
          token: this.$store.state.login.token,
          // productType: this.productType,
          skuId: this.skuItem.skuId,
          featureValueIds: this.myFeatures,
          lng: this.$store.state.currentLocation.posx,
          lat: this.$store.state.currentLocation.posy,
          deliverType: this.$store.state.mall2.staticDeliverType
        };
        if (paramsData.deliverType == 1 || paramsData.deliverType == '') {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
          paramsData.pickupStoreOuCode = this.$store.state.mall2.zitiAddress.storeCode ? this.$store.state.mall2.zitiAddress.storeCode : this.$route.query.storeOuCode ? this.$route.query.storeOuCode : '';
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detailData = data.data;
              if (this.detailData.remainNum === 0) {
                this.$Toast('活动商品库存已售空，需原价购买！')
              }
              if (this.selectedNum < this.detailData.saleNumBegin) {
                this.selectedNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              }
              this.deliveryType = this.detailData.deliveryType
              this.stockNum = this.detailData.stockNum || 0
              this.stepNum = this.detailData.saleNumStep != '' ? this.detailData.saleNumStep : 1
              this.minNum = this.detailData.saleNumBegin != '' ? this.detailData.saleNumBegin : 1
              this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
              if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
                if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                  this.maxNum = this.detailData.discountGoodsCntPerOrder
                }
              }
              // 全局价格处理
              let dpedData = this.$mallCommon.priceFromItem(this.detailData)
              this.detailData.dpedData = dpedData;
              // this._getCustomStock()

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
      // 获取当前库存
      _getCustomStock: function () {
        if (this.deliveryType == 2 && (this.$store.state.mall2.selectAddress.id == '' || this.$store.state.mall2.selectAddress.id == undefined) && (this.$store.state.mall2.selectAddress.provinceId == '' || this.$store.state.mall2.selectAddress.provinceId == undefined)) {
          //配送下没有地址就不去  取库存了
          return;
        }
        if (this.deliveryType == 1 && (this.$store.state.mall2.zitiAddress.id == '' || this.$store.state.mall2.zitiAddress.id == undefined)) {
          // 自提并且没有自提点id
          return;
        }
        let url = '/app/json/app_stock/querySkuStockByApp';
        let paramsData = {
          token: this.$store.state.login.token,
          productList: [{skuId: this.detailData.skuId}],
          areaAddress: {
            province: this.$store.state.mall2.selectAddress.provinceId,
            city: this.$store.state.mall2.selectAddress.cityId,
            area: this.$store.state.mall2.selectAddress.countryId,
            town: this.$store.state.mall2.selectAddress.townId
          },
          productType: this.detailData.productType,// 充值卡类商品514没有地址和自提点
          deliverType: this.deliveryType,
          selfPickStore: this.$store.state.mall2.zitiAddress.id,
          storeCode: this.detailData.storeOuCode
        };
        this.$Loading.open()
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let productList = data.data.productList
              if (productList.length > 0) {
                this.stockNum = productList[0].stockCurrentNumber
                if (this.mktStockNum != -1) {
                  // 活动库存，小于当前库存，取活动库存当库存
                  this.stockNum = this.mktStockNum < this.stockNum ? this.mktStockNum : this.stockNum
                }
                this.maxNum = this.detailData.saleNumMax != '' ? this.detailData.saleNumMax : -1
                if (this.detailData.discountGoodsCntPerOrder != undefined && this.detailData.discountGoodsCntPerOrder != '') {
                  if (this.maxNum > this.detailData.discountGoodsCntPerOrder) {
                    this.maxNum = this.detailData.discountGoodsCntPerOrder
                  }
                }
                this.maxNum = this.maxNum > this.stockNum ? this.stockNum : this.maxNum
              }
            } else {
              if (data.errorCode == 2201) {
              } else {
                this.$Toast(data.info);
              }
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      popClose: function () {
        this.showPop = false;
      },
      numChange: function () {
        this.generateSelectedText()
      },
      generateSelectedText: function () {
        // this.selectedText = ''
        // this.myFeatures = [];
        // for (let i = 0; i < this.detailData.featureList.length; i++) {
        //   let item = this.detailData.featureList[i]
        //   for (let j = 0; j < item.featureValueList.length; j++) {
        //     let subItem = item.featureValueList[j]
        //     if (subItem.selected) {
        //       this.selectedText += subItem.featureValue + '，'
        //       this.myFeatures.push(subItem.featureValueId)
        //       break;
        //     }
        //   }
        // }
        // this.selectedText += this.selectedNum + (this.detailData.metric ? this.detailData.metric : '件')
      },
      getSkuNameStr: function (item) {
        let skuName = item.showTitle
        if (item.interfaceType == '2') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_1 || '京东'}</span>` + skuName
        } else if (item.interfaceType == '1') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_2 || '有路'}</span>` + skuName
        }
        return skuName
      },
      backEvent() {
        this.$router.go(-1)
        this.$keepaliveHelper.deleteCache(this)
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    components: {
      group,
      Countdown,
      couponGroup
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .group-detail-container {
    .detail-top {
      display flex
      align-items center
      justify-content space-between
      .sku-detail {
        color #f61516
        font-size: 10px
        padding 4px 8px
        border-radius: 10px
        background-color: #fff;
      }
    }
    .countdown {
      color #fff
      height 40px
      display flex
      align-items center
      justify-content: flex-start
      span {
        color #fff
        font-size: 14px
        font-weight 600
      }
      .count-down-con{
        justify-content: flex-start
        >>> .theme_font_white{
          color #f61516
        }
      }
    }
    .group-detail {
      padding 8px
      height 160px
      background: url("../image/group_bg_bottom.png") no-repeat
      background-size: 100% 100%
    }
    .scrolling {
      height calc(100% - 160px);
      overflow auto
      -webkit-overflow-scrolling touch
    }
    .status {
      /*height 110px*/
      padding 20px 10px 0
      .text {
        color #f61516
      }
      .progress {
        margin 12px 0
        /deep/ .van-progress{
          height 6px
        }
      }
      .progress-text {
        color #44ab0a
        margin-bottom 8px
        display flex
        justify-content flex-end
      }
      .progress-tip {
        width 100%
        display flex
        justify-content center
        margin-bottom 8px
        align-items center
        font-size 12px
      }
      .btn {
        display flex
        justify-content center
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        span {
          width 200px
          color: #fff;
          font-size: 14px;
          border-radius 16px;
          background: #f02e2e
          padding 10px 0
          text-align: center
          display inline-block
          margin-bottom 10px
        }
      }
    }
    .success {
      .text {
        color #44ab0a
      }
      .btn {
        display flex
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        span {
          color: #fff;
          background: #44ab0a
          margin-bottom: 10px;
        }
      }
    }
    .fail {
      .text {
        color #b5b5b6
      }
      .progress-text {
        color #b5b5b6
        justify-content space-between
      }
      .btn {
        display flex
        justify-content center
        span {
          color: #fff;
          background: #b5b5b6
        }
      }
    }
    p {
      font-size 14px
      margin 12px
    }
    .evaluation {
      height: auto
      margin-top 25px
      padding 0 10px
      background-color #fdfbf9

      .evaluation-top {
        padding 12px 6px
        border-bottom 1px solid #e5e2d2
        display flex
        justify-content space-between
      }
      .evaluationBtn {
        color #f02e2e
        padding 14px 0
        display flex
        justify-content center
        .evaluationText {
          display flex
          align-items center
          justify-content center
          flex-direction column
        }
      }
    }
    .group-process {
      height: auto
      margin 0 10px
      background-color #fdfbf9

      .group-process-content {
        border-radius 5px
        padding 10px
        height 80px
        display flex
        justify-content space-between
        background url("../image/cutPrice.png") no-repeat center
        background-size contain

        .group-process-item {
          flex 1
          text-align: center
          position: relative

          & + .group-process-item {
            &:after {
              content ''
              position: absolute
              top: 14px
              width 50%
              background: #fff1d8
              height 1px
              left: -25%
            }
          }

          .img {
            width 25px

          }

          .text {
            font-size: 12px
          }
        }
      }
      .group-process-actDesc{
        color #b6b6b3
        padding 0px 20px 10px
        line-height 20px
      }
    }
  }
  >>> .stateBox {
    z-index: 2001;
    width: 80%;
    text-align: center;
    font-size: 16px;
    color white;
    top 200px;

    img {
      width 80px;
      margin 0 0 15px 160px;
    }
  }
  >>> .van-popup {
    background transparent;
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
</style>
