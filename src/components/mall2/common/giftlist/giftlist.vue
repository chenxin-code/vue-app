/**Created by steven on 2018/11/12.*/

<template>
  <div class="giftlist" v-if="visible">
    <pop-view v-if="visible" @closeEvent="popClose">
      <div class="pop-body theme_bg_white">
        <p class="pop-title theme_font_black">{{giftType == 1?'满赠商品':'换购商品'}}</p>
        <div class="pop-content">
          <div class="pop-row" v-for="(cartitem,index) in listData" @click="chooseFinish(cartitem)">
            <i class="iconfont font-large"
               :class="cartitem.checked?'mall-xuanzhong theme_font_red':'mall-weixuanzhong theme_font_gray'"></i>
            <div class="good-content">
              <div class="good-img">
                <img :src="cartitem.phPictureUrl" :class="{'no-stock': (cartitem.remainNum < cartitem.number && cartitem.remainNum != -1)}" alt="">
              </div>
              <div class="good-detail">
                <div class="good-info">
                  <p class="good-name" :class="{'theme_font_tint_i': (cartitem.remainNum == '0' || cartitem.remainNum == '')}">{{cartitem.productName}}</p>
                  <div class="good-paras">
                    <div class="paras-left">
                      <p class="size theme_font_gray" :class="{'theme_font_tint_i': (cartitem.remainNum == '0' || cartitem.remainNum == '')}">{{cartitem.specs}}</p>
                      <div>
                        <span class="money-small theme_font_red" :class="{'theme_font_tint_i': (cartitem.remainNum == '0' || cartitem.remainNum == '')}">￥</span><span class="money-large theme_font_red" :class="{'theme_font_tint_i': (cartitem.remainNum == '0' || cartitem.remainNum == '')}">{{getItemAmount(cartitem.price,0)}}.</span><span
                        class="money-small theme_font_red" :class="{'theme_font_tint_i': (cartitem.remainNum == '0' || cartitem.remainNum == '')}">{{getItemAmount(cartitem.price,1)}}</span>
                      </div>
                    </div>
                    <div class="paras-right">
                      <span  class="gift-num theme_font_gray" :class="{'theme_font_tint_i': (cartitem.remainNum == '0' || cartitem.remainNum == '')}">x {{cartitem.number}}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="gift-bottom">
          <div class="bt-left theme_font_gray">已选择{{getCheckedCount()}}件</div>
          <div class="bt-right theme_bg_red theme_font_white" @click="sureFinish">确定</div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "giftlist",
    components: {},
    data() {
      return {
        listData: [],
        visible: false,
        sureFunc: null,
        activityId:'',
        //1赠品 2换购
        giftType:1,
        //是否只浏览
        isScan:false
      }
    },
    methods: {
      popClose: function () {
        this.visible = false;
      },
      chooseFinish: function (item) {
        if (item.remainNum < item.number && item.remainNum != -1) {
          this.$Toast('当前商品库存不足')
          return
        }
        if(this.isScan){
          this.$Toast('条件未满足')
          return;
        }
        if (item.checked != undefined) {
          item.checked = !item.checked;
        } else {
          Vue.set(item, 'checked', true)
        }
        if(item.checked = true){
          for(let i=0; i < this.listData.length; i++){
            let titem = this.listData[i];
            if(titem != item){
              titem.checked = false;
            }
          }
        }
      },
      getItemAmount: function (amount, index) {
        if (amount) {
          let money = amount + '';
          let arr = [];
          if (money) {
            arr = money.split(".");
          }
          if (arr.length > index) {
            return arr[index]
          } else {
            return '00'
          }
        } else {
          if (index == 0) {
            return '0'
          }
          return '00'
        }
      },
      getCheckedCount:function () {
        let count = 0;
        for(let i = 0;i < this.listData.length; i ++){
          let item = this.listData[i];
          if (item.checked){
            count += 1;
          }
        }
        return count+'/'+this.listData.length;
      },
      sureFinish:function () {
        if(this.isScan){
          this.visible = false;
          return;
        }
        let carts = []
        for(let i = 0;i < this.listData.length; i ++){
          let item = this.listData[i];
          if (item.checked){
            carts.push({
              skuId: item.skuId,
              storeOuCode: item.storeOuCode,
              number: item.number,
              activityId:this.activityId,
              isGift: this.giftType
            })
          }
        }
        if (carts.length == 0) {
          this.visible = false;
          return
        }
        if(this.sureFunc){
          this.sureFunc(carts);
          this.visible = false;
        }
      }

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  $margin-value=10px

  .giftlist {
    width 100%
    height 100%
    overflow hidden


    .pop-body {
      width 100%
      position absolute
      top 0px
      bottom 0px
      .gift-bottom {
        position absolute
        bottom 0px
        width 100%
        height 50px
        display flex
        align-items center
        justify-content space-between
        box-shadow 0px -2px 2px #efefef
        .bt-left{
          flex 1
          padding-left $margin-value
          font-size $font-size-medium
        }
        .bt-right{
          font-size $font-size-large
          height 100%
          width 150px
          line-height 50px
          text-align center
        }
      }
      .pop-title {
        text-align center;
        font-weight 500;
        padding 18px 16px 8px;
        font-size 15px;
      }

      .pop-content{
        position absolute
        top 40px
        bottom 50px
        width 100%
        overflow auto
        .pop-row {
            margin 0px $margin-value
            padding 3px 0px
            border-bottom 1px solid $color-line-gray-l
            display flex
            justify-content space-between
            align-items center
            .good-content{
              margin-left 2px
              padding 2px
              display flex
              align-items center
              width 100%

              .good-img {
                width 80px
                height 80px
                img {
                  width 100%
                  height 100%
                }
                .no-stock {
                  opacity 0.4;
                }
              }

              .good-detail {
                flex 1
                padding-left  3px
                display flex

                .good-info {
                  flex 1
                  margin-left 2px

                  .good-name{
                    font-size $font-size-medium
                    margin-bottom 4px
                  }

                  .good-paras{
                    display flex
                    justify-content space-between
                    align-items flex-end
                    .paras-left{
                      .size{
                        font-size $font-size-medium-s
                        margin-bottom 4px
                      }
                      .money-small{
                        font-size $font-size-small
                      }
                      .money-large{
                        font-size $font-size-medium-x
                      }
                    }
                    .paras-right{
                      .gift-num{
                        margin-right 5px;
                        font-size $font-size-small
                      }
                    }

                  }
                }
              }

            }
          }


      }


    }
    .font-large {
      font-size $font-size-large
    }
  }
</style>
