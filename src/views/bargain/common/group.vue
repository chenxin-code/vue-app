<!--列表的砍价商品-->
<template>
  <div>
    <div class="coupon" :class="{shadow: !groupCoupon.tagging}" @click="toDetails(groupCoupon,type)" v-if="groupCoupon" >
      <div class="coupon-type" :style="{width: groupCoupon.tagging ? '65px' : '85px',height: groupCoupon.tagging ? '65px' : '85px'}">
        <img v-lazy="groupCoupon.pcMainUrl" class="img" alt="">
      </div>
      <div class="coupon-content">
        <div class="title">
          <div class="dowm" v-if="groupCoupon.actState == 1"><countdown class="count-down-con" :hiddenDay="false" :endTime="groupCoupon.timEnew"></countdown></div>
          {{groupCoupon.proName}}
        </div>
        <div class="title sotck" v-if="mybargainList">
<!--          <div class="stock"><span class="span1">正在疯抢</span><span class="span2">剩余库存{{groupCoupon.actStock}}</span></div>-->
<!--          <van-progress :percentage="getPer(groupCoupon)" stroke-width="20" track-color='#8b4513' style="width: 60%" color="#f2826a"/>-->
          <div class="prograss">
           <div class="p1" :style="getTotalHeight(groupCoupon)">{{((groupCoupon.actStock/groupCoupon.setActStock*100).toFixed(0))+'%'}}</div>
           <div class="p2"></div>
          </div>
          <div> <span>正在疯抢</span> <span>剩余库存{{groupCoupon.actStock}}</span></div>
        </div>
        <div class="operation" v-if="groupCoupon.tagging == 'bargainDetails'">
          <div class="price bargainDetails">
            <div class="price-top">可砍至 ¥{{$util.toDecimal2(groupCoupon.minPrice)}}</div>
            <div class="price-buttom" :class="{'price-lift': groupCoupon.tagging}">原价 ¥{{$util.toDecimal2(groupCoupon.originalPrice || groupCoupon.origPrice)}}</div>
          </div>
        </div>
        <div class="operation" v-else>
          <template v-if="mybargainList">
            <div class="price" v-if="groupCoupon.state == 1">
              <div class="count-down"><countdown class="count-down-con" :hiddenDay="true" :endTime="groupCoupon.timEnew"></countdown> 后结束</div>
              <div class="font-small" style="color: #989898;">还差 <span style="color: #f80f16">{{$util.toDecimal2((Number(groupCoupon.actPrice)*100-Number(groupCoupon.minPrice)*100)/100)}}元</span> 元</div>
            </div>
            <div class="price" v-if="groupCoupon.state == 2">
              <div class="font-small" style="color: #989898;">砍价结束</div>
              <div style="height: 12px"></div>
              <div class="font-small" style="color: #989898">还差 <span style="color: #f80f16">{{$util.toDecimal2((Number(groupCoupon.actPrice)*100-Number(groupCoupon.minPrice)*100)/100)}}</span> 元，砍价成功</div>
            </div>
            <div class="price" v-if="groupCoupon.state == 3">
              <div class="font-small" style="color: #989898;">砍价结束</div>
              <div style="height: 12px"></div>
              <div class="font-small" style="color: #989898;">还差 <span style="color: #f80f16">{{$util.toDecimal2((Number(groupCoupon.actPrice)*100-Number(groupCoupon.minPrice)*100)/100)}}元</span> 元，砍价失败</div>
            </div>
            <div>
              <!-- <span v-if="groupCoupon.state == 0" class="btn" @click.stop="launchBtn(groupCoupon)">发起砍价</span> -->
              <span v-if="groupCoupon.state == 1" class="btn" @click.stop="invitationBtn(groupCoupon)">邀请好友</span>
              <span v-if="groupCoupon.state == 2 && groupCoupon.orderState != 2 && groupCoupon.orderState != 3" class="btn" @click.stop="successBtn(groupCoupon)">立即购买</span>
              <span v-if="groupCoupon.state == 2 && groupCoupon.orderState == 3" class="btn">已支付</span>
              <span v-if="groupCoupon.state == 2 && groupCoupon.orderState == 2" @click.stop="payEvent(groupCoupon)" class="btn">去支付</span>
              <span v-if="groupCoupon.state == 3" class="btn" @click.stop="toDetails(groupCoupon,type)">查看详情</span>
            </div>
          </template>
          <template v-else>
            <div class="price">
              <div class="price-top price-top-new">可砍至 ¥{{$util.toDecimal2(groupCoupon.minPrice)}}</div>
              <div class="price-buttom">
                <span class="price">原价 ¥{{$util.toDecimal2(groupCoupon.originalPrice || groupCoupon.origPrice)}}</span>
                <span class="price-lift">库存 {{groupCoupon.actStock || 0}}</span>
              </div>
            </div>
            <div v-if="type.cutActivityType==1">
              <span  class="dis-btn" >未开始</span>
            </div>
            <div v-else class="btn-con">
              <div>
                <!-- actState;// 活动商品状态 // 0：未发起，1：进行中。2：砍价结束 -->
                <span v-if="groupCoupon.actState == 0" class="btn" @click.stop="launchBtn(groupCoupon)">发起砍价</span>
                <span v-if="groupCoupon.actState == 1" class="btn" @click.stop="invitationBtn(groupCoupon)">邀请好友</span>
                <span v-if="groupCoupon.actState == 2" class="btn" @click.stop="launchBtn(groupCoupon)">再次发起</span>
                <span v-if="groupCoupon.actState == 4" class="btn">暂无库存</span>

              </div>
              <van-progress :percentage="percentage" color="#ee0a24"/>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex";
  import Config from "@/api/config";
  import wxfunc from '@/utils/wxfunc'
  import Countdown from "@/components/Vendor/countdown/countdown"
  export default {
    name: '',
    components: {
      Countdown
    },
    props: {
      groupCoupon: {
        type: Object,
        default() {
          return null
        }
      },
      mybargainList: {
        type: Boolean,
        required: false,
        default: false
      },
      type: {
        type: Object,
        required: false,
        default: ()=>{
          return {}
        }
      }
    },
    data() {
      return {
        shareView: false,
        isToUse: false,
        countDownTimeout: false,
        percentage:0,
      }
    },
    mounted() {
      let shareData = {};
      let item = this.groupCoupon
      shareData.title = item.proName
      shareData.sharetext = item.actDesc
      shareData.imageurl = item.pcMainUrl
      shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/bargain/bargain_details?id=${item.id}&skuId=${item.skuId}&origId=${item.origId || item.id}&productId=${item.id}&bargainActId=${item.bargainActId}&storeOuCode=${item.storeOucode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&bargainOrderId=${item.id}`;

      if (this.$store.state.webtype == 1) {
        // this.$bridgefunc.wechatShare(shareData)
      } else if (this.$store.state.webtype == 2) {
        wxfunc.wxSetShareData(shareData);
      } else if (this.$store.state.webtype == 3) {
        let path = wxfunc.wxmpPath(this.$route)
        let share = {
          title: item.proName,
          path: Config.shareUrl + `/bargain/bargain_details?id=${item.id}&skuId=${item.skuId}&origId=${item.origId || item.id}&productId=${item.id}&bargainActId=${item.bargainActId}&storeOuCode=${item.storeOucode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&bargainOrderId=${item.id}`,
          imageUrl: item.pcMainUrl
        }
        wx.miniProgram.postMessage({ data: JSON.stringify(share) });
      }
      this.percentage=((this.groupCoupon.actStock/this.groupCoupon.setActStock)*100).toFixed(2) || 0
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    methods: {
      getTotalHeight:function (item) {
        return 'width:'+((item.actStock/item.setActStock*100).toFixed(0)) + '%';
      },
      getPer(item){
        return (item.actStock/item.setActStock*100).toFixed(0)||0
      },
      toDetails(item,type) {
        console.log(type)
        if(type.cutActivityType!=0){
          return
        }
        if (item.actState == 4) {
          return
        }
        if (item.actState == 0 || item.actState == 2) {
          // justdetail=1 查看
          let path = '/bargain/prodetail'
          this.$router.push({
            path: path,
            query: {
              id: item.id,
              skuId: item.skuId,
              origId: item.origId,
              // userId: this.userInfo.userId,
              productId: item.id,
              bargainActId: item.bargainActId,
              storeOuCode: item.storeOucode,
              oprice: item.originalPrice || item.origPrice,
              kprice: item.minPrice,
              bargainOrderId: item.id
            }
          })
        } else {
          this.$router.push({
            path: `/bargain/bargain_details`,
            query: {
              id: item.id,
              // userId: this.userInfo.userId,
              skuId: item.skuId,
              origId: item.state ? item.id : item.origId,
              productId: item.id,
              bargainActId: item.bargainActId,
              storeOuCode: item.storeOucode,
              oprice: item.originalPrice || item.origPrice,
              kprice: item.minPrice,
              bargainOrderId: item.id,
              EnterFlag:true
            }
          })
        }
      },
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
                cutPrice:true,
              }
            })
          } else {
            this.$Toast(res.info);
          }
        })
      },
      launchBtn(item) { // 发起 productId：参与活动商品id，bargainActId：活动id
        let path = '/bargain/prodetail'
        this.$router.push({
          path: path,
          query: {
            id: item.id,
            skuId: item.skuId,
            origId: item.origId,
            productId: item.id,
            bargainActId: item.bargainActId,
            storeOuCode: item.storeOucode,
            oprice: item.originalPrice || item.origPrice,
            kprice: item.minPrice,
            bargainOrderId: item.id
          }
        })
      },
      invitationBtn(item) { // 邀请
        console.log(this.$parent)
        console.log(item,'item')
        let shareData = {};
        shareData.title = item.proName
        shareData.sharetext = item.actDesc
        shareData.imageurl = item.pcMainUrl
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/bargain/bargain_details?id=${item.id}&skuId=${item.skuId}&origId=${item.origId || item.id}&productId=${item.id}&bargainActId=${item.bargainActId}&storeOuCode=${item.storeOucode}&oprice=${item.originalPrice || item.origPrice}&kprice=${item.minPrice}&userId=${this.userInfo.userId}&bargainOrderId=${item.id}`;
        // this.$emit('inventFrend',true)
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
          this.$emit('inventFrend',true)
          // this.shareView = true
        }
      },
      successBtn(groupCoupon) {
        this.$emit('successBtn', groupCoupon)
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import "./css/price.styl"
  .shadow {
    box-shadow 0 1px 8px #efefef;
  }
  .coupon {
    height 100%
    display flex
    align-items stretch
    padding 12px;
    border-radius 8px;
    margin-bottom 10px
    background-color #fff
    .coupon-type {
      background-size 100% 100%
      display flex
      align-items center
      justify-content center
      font-weight: 600;
      color: $color-theme

      .img {
        width 100%;
        height 100%
        border-radius: 8px
      }
    }

    .coupon-content {
      flex 1
      font-size: 14px
      padding-left: 10px;
      display flex
      flex-direction column
      justify-content space-between
      .title {
        line-height 20px
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
      }
      .operation {
        display flex
        align-items center
        justify-content space-between
        .price {
          .count-down {
            display flex
            align-items center
            font-size 10px
            color: #989898
            margin-bottom 8px
            .count-down-con{
              justify-content: flex-start
            }
          }

          .price-top{
            color #f61516
            font-size: 16px
          }
          .price-top-new {
            margin-bottom 8px
          }
          .price-buttom {
            color #989898
            font-size: 10px
            .price {
              text-decoration line-through
            }
          }
          .price-lift{
            margin-left 10px
          }
        }
        .bargainDetails {
          display flex
          align-items center
        }
        .btn {
          color: #fff;
          display block
          font-size: 14px;
          border-radius 14px;
          background: #f02e2e
          padding 5px 10px;
          text-align: center
        }
        .dis-btn {
          color: #fff;
          display block
          font-size: 14px;
          border-radius 14px;
          background: #a59e9e;
          padding 5px 10px;
          text-align: center
        }
      }
    }
  }
  .dowm {
    line-height 10px
    display: inline-block
    .count-down-con{
      justify-content: flex-start
    }
  }
  .btn-con{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .operation{
    height 60px
  }
  .sotck {
     padding 5px
    .van-progress{
      width 72%
      border-radius 10px
    }
    .prograss{
      width 72%
      border-radius 10px
      height 20px
      background #8b4513
      display flex;
      justify-content space-between
      color white
      .p1{
        background #f2826a
        border-radius 10px
        text-align right
      }
      .p2{
        flex:1
        text-align right
        border-radius   10px
      }
    }
  }
  .stock{
    padding 5px
    background #8b4513
    border-radius 10px
    height 20px
    width 72%
    display: flex;
    justify-content: space-between;
    align-items: center;
    background url("../image/sandian.png") center no-repeat
    background-size contain

    .span1{
      border-radius 10px 0 0 10px
      color white
    }
    .span2{
      border-radius  0 10px 10px 0
      color white
    }

  }
  /deep/.sotck .van-progress__pivot {
    height 100%
    border-radius: 0 1rem 1rem 0;
  }
</style>
