/**Created by LiuYong on 2020-11-13.*/

<template>
  <div class="yj-coupon">
    <nav-top @backEvent="$router.go(-1)" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="coupon-box">
        <div class="coupon-container">
          <ul class="coupon-group">
            <li class="coupon-list" @click="selectCoupon(idx)" v-for="(item,idx) in couponList">
              <div class="row-top">
                <div class="price">
                  <span class="icon">￥</span>
                  <span class="num">{{item.skuFeatures[0] ? item.skuFeatures[0].featureValue : ''}}</span>
                </div>
                <div class="text" v-if="item.skuFeatures[1] && item.skuFeatures[1].featureValue">
                  <div>{{item.skuFeatures[1] ? item.skuFeatures[1].featureValue : 0}}</div>
                </div>
              </div>
              <div class="row-bottom">
                <div class="text">{{item.spuName}}</div>
                <div class="price-box">
                  <PriceOrder :listitem="item" />
                  <div class="select-icon">
                    <i class="icon iconfont" :class="idx == couponIdx ? 'mall-xuanzhong' : 'mall-weixuanzhong'"></i>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="flex-div">
          <div class="label">购买数量</div>
          <div class="content">
            <SbxAdder v-model="selectedNum" @on-change="_reSettleCart" disabled/>
          </div>
        </div>
      </div>
      <div class="price-info">
        <div class="flex-div">
          <div class="label">商品金额</div>
          <div class="content">￥{{occurData.amount}}</div>
        </div>
        <div class="flex-div">
          <div class="label">选择优惠券</div>
          <div class="content">
            <van-icon name="ellipsis" size="25" style="font-weight:bold;" v-if="chooseCouponList.length"/>
            <span class="empty" v-else>暂无优惠券</span>
          </div>
        </div>
        <div class="flex-div">
          <div class="label">应付金额</div>
          <div class="content red">￥{{occurData.payAmount}}</div>
        </div>
      </div>
      <div class="terms" v-if="mobileDetail">
        <div class="terms-title">使用说明</div>
        <div class="terms-content" v-html="mobileDetail"></div>
      </div>
      <div class="terms">
        <div class="terms-title">使用方式</div>
        <div class="terms-content">
          <img src="./imgs/tt.jpg" alt="">
        </div>
      </div>
      <div class="buy-now" @click="submit">立即购买</div>
    </nav-content>
  </div>
</template>

<script>
  import PriceOrder from '@/components/commonui/price/price-order'
  import SbxAdder from './base/sbx-adder';

  export default {
    name: "yj-coupon",
    components:{
      SbxAdder,
      PriceOrder
    },
    data() {
      return {
        selectedNum:1,
        couponIdx:0,
        couponList:[],
        spuModels:[],
        chooseCouponList:[],
        occurData:{},
      }
    },
    computed:{
      detailData(){
        return this.couponList[this.couponIdx]
      },
      detailSpuModels(){
        return this.spuModels[this.couponIdx]
      },
      mobileDetail(){
        return this.detailSpuModels
          ? this.detailSpuModels.mobileDetail
          : '';
      },
    },
    methods: {
      getTabOrders: async function (loaded) {
        // 获取面额
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          productType: '515' // 501话费充值，502流浪充值
        }
        const res = await this.$http.post('/app/json/product_recharge/getRechargeProList', paramsData)
        let data = res.data
        if (data.status == 0) {
          data.data.list.forEach(item=>{
            // todo
            item.salePrice+='a'
            let dpedData = this.$mallCommon.priceFromItem(item)
            item.dpedData = dpedData;
          })
          this.couponList = data.data.list
          this.spuModels = data.data.spuModels
          data.data.list.length && this._reSettleCart();
        } else {
          this.$Toast(data.info)
        }
        this.$Loading.close()
      },
      selectCoupon(idx){
        this.couponIdx = idx
        this._reSettleCart();
      },
      _reSettleCart: function () {
        this.$Loading.open()
        let url = "/app/json/fee_life_order/settle";
        let paramsData = {
          deliveryType: 2
        }
        paramsData.carts = [{
          number: this.selectedNum,
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode,
          selfActivityId: this.detailData.activityId,
          checked: 1
        }];
        paramsData.couNo = ['-1'];
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close()
            let data = res.data;
            if (data.status == 0) {
              this.occurData = data.data.occur[0];
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            Loading.close();
            this.$Toast("请求数据失败！");
          }
        );
      },
      // submit
      submit: function () {
        this.$Loading.open();
        let paramsData = {
          deliveryType: 2
        }
        paramsData.carts = [{
          number: this.selectedNum,
          skuId: this.detailData.skuId,
          storeOuCode: this.detailData.storeOuCode,
          selfActivityId: this.detailData.activityId,
          checked: 1
        }];

        this.$http.post('/app/json/fee_life_order/submit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$Toast('兑换成功')
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
    },
    created() {
      this.getTabOrders()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/lines.styl'

  flexDiv(){
    .flex-div{
      display:flex;
      height:50px;
      justify-content:space-between;
      align-items:center;
      margin:0 12.5px
      .label{
        font-weight:bold;
        font-size:15px;
      }
      .content{
        font-size:15px;
        &.red{
          color:#FF3C55;
        }
        .empty{
          color:#999;
        }
      }
      +.flex-div{
        line_top();
      }
    }
  }

  .yj-coupon {
    overflow hidden
    .nav-content{
      overflow-y:auto;
      background-color #F5F5F5
      padding-bottom 50px
      .coupon-box {
        background:#fff;
        padding-top:10px;
        padding-bottom 5px
        margin-bottom:10px;
        .coupon-container{
          height:150px;
          overflow:hidden;
          .coupon-group{
            display:flex;
            overflow-x:auto;
            margin-bottom:5px;
            padding 0 12.5px
            height:180px;
            .coupon-list{
              flex-shrink:0;
              width 130px
              height 150px
              border-radius 6px
              overflow:hidden;
              background-image url(./imgs/yj-bg2.png);
              background-size:100% 100%;
              position:relative;
              color:#fff;
              display:flex;
              flex-direction:column;
              row(){
                padding:10px;
                flex:1;
              }
              .row-top{
                row()
                .price{
                  padding-top 3px
                  .icon{
                    font-size:15px;
                    font-weight:bold;
                  }
                  .num{
                    font-size:30px;
                    font-weight:bold;
                  }
                }
                .text{
                  margin-top:4px;
                  div{
                    font-size:14px;
                    display:inline-block;
                    background-color:#fff;
                    color:#ff4f65;
                    border-radius:10px;
                    line-height:19px;
                    padding:0 7px;
                  }
                }
              }
              .row-bottom{
                row()
                padding:10px 10px;
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                .text{
                  font-size:13px;
                  line-height:16px;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                }
                .price-box{
                  display:flex;
                  align-items: flex-end;
                  .price-order{
                    flex:1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    >>>.left-m-8{
                      margin-left:2px;
                    }
                  }
                  .select-icon{
                    flex-shrink:0;
                    font-size 0
                  }
                }
                >>>.theme_font_red, >>>.theme_font_tint{
                  color:#fff;
                }
              }
              +.coupon-list{
                margin-left 12.5px
              }
            }
          }
        }
        flexDiv()
      }
      .price-info{
        background-color #fff
        margin-bottom:10px;
        flexDiv();
      }
      .terms{
        background:#fff;
        padding 18px 12.5px 12px;
        font-size:15px;
        .terms-title{
          font-weight:bold;
          margin-bottom:15px;
        }
        .terms-content{
          text-indent:25px;
          line-height:25px;
          word-break:break-all;
          img{
            display:block;
            width 100%
          }
        }
        +.terms{
          margin-top:10px;
        }
      }
      .buy-now{
        position:fixed
        bottom:0;
        left:0
        right:0
        height:50px;
        background-color:#ff3c55;
        display:flex;
        justify-content:center;
        align-items:center;
        color:#fff;
        font-size:18px;
      }
    }
  }
</style>
