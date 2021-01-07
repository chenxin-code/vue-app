<template>
  <div class="body">
    <div class="head" :style="{backgroundImage: messageBoj.backgroundImgUrl?'url('+messageBoj.backgroundImgUrl+')':'url(\'/static/image/microShop/up.png\')'}">
      <nav-top @backEvent="backEvent" :title="messageBoj.storeName?messageBoj.storeName:'店铺名称'"></nav-top>
      <div class="containerTop">
        <div class="containerTopImg">
          <div class="containerTopImgTop">
            <img :src="messageBoj.pictureUrl?messageBoj.pictureUrl:$store.state.globalConfig.microshop_headurl" alt>
            <span>{{messageBoj.storeName?messageBoj.storeName:userInfo.phone}}</span>
          </div>
          <div class="containerTopImgBum">
            <span>已收藏</span>
          </div>
        </div>
        <div class="containerTopText">
          <span>简介：{{messageBoj.storeProfile?messageBoj.storeProfile:'设置简介'}}</span>
        </div>
      </div>
    </div>
    <nav-content>
      <div class="main">
        <div class="row">
          <div class="type-btn" :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}" @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes">
            <i class="iconfont theme_font_common icon-size"
               :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"></i>
            <span class="theme_font_common" :class="{theme_standard_font_i: selectedType == item.tag}">{{item.text}}</span>
          </div>
        </div>
        <div class="box" v-show="!showView">
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/2.jpg" alt="">
            </div>
            <div class="right">
              <p>维他豆奶</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/3.jpg" alt="">
            </div>
            <div class="right">
              <p>小米手机</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/1.jpg" alt="">
            </div>
            <div class="right">
              <p>火龙果（配送）</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/4.jpg" alt="">
            </div>
            <div class="right">
              <p>西柚</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/3.jpg" alt="">
            </div>
            <div class="right">
              <p>小米手机</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="box" v-show="showView">
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/3.jpg" alt="">
            </div>
            <div class="right">
              <p>小米手机</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/4.jpg" alt="">
            </div>
            <div class="right">
              <p>西柚</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/2.jpg" alt="">
            </div>
            <div class="right">
              <p>维他豆奶</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/1.jpg" alt="">
            </div>
            <div class="right">
              <p>火龙果（配送）</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="div1">
            <div class="img">
              <img src="static/image/microShop/3.jpg" alt="">
            </div>
            <div class="right">
              <p>小米手机</p>
              <p>￥219.00</p>
              <div>
                <span>团购</span>
                <span>领券</span>
                <span>积分兑换</span>
                <img src="static/image/microShop/icon19@2x.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import list from "../common/list";
  import { mapGetters } from "vuex";
  export default {
    name: "shop-preview",
    components: {
      list
    },
    data() {
      return {
        deliveryTypes: [
          {
            text: "配送",
            fontclass: "mall-peisong",
            tag: "2"
          },
          {
            text: "自提",
            fontclass: "mall-ziti",
            tag: "1"
          }
        ],
        params: {},
        styleObj: {
          listStyle: false,
          rowStyle: false,
          isScreen: false,
          isHeight: "64"
        },
        selectedType: 2,
        showView: true,
        messageBoj: {}
      };
    },
     computed: {
      ...mapGetters(["getPutaggregate","userInfo"])
    },
    mounted() {
      console.log(this.$route.params.mall);
      this.messageBoj = this.$route.params.mall
    },
    methods: {
      backEvent: function() {
        this.$router.go(-1);
      },
      selectedTypeEvent: function (tag) {
        let that = this
        that.selectedType = tag;
        if (that.selectedType == 2) {
          that.showView = true
        } else if (that.selectedType == 1) {
          that.showView = false
        }
      },
      productEvent() {},
      addToCart() {}
    }
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';

  .body {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .containerTop {
      //     color: #fff;
      width: 100%;
      /* background-image: url(/static/image/microShop/down.png);*/
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      padding: 0.533333rem;
      border: 1px solid bac;
      height: 130px;
      top 180px;
      position absolute
      .containerTopText {
        width: 100%;
        display: inline-block;
        margin-top: 10px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .containerTopImg {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .containerTopImgTop {
          display: flex;
          align-items: center;

          img {
            width: 60px;
            height: 60px;
            border-radius 50%;
          }

          span {
            margin-left: 10px;
            font-size: 18px;
            font-weight: 500;
          }
        }

        .containerTopImgBum {
          padding: 2px 6px;
          border-radius: 10px;
          /*border: 1px solid #fff;*/
          border: 1px solid;
        }
      }
    }

    .main {
      margin-top 10px;
      background white;
      .row {
        padding 5px 15px;
        display flex;

        .type-btn {
          font-size $font-size-medium
          padding 4px 10px;
          border-radius 15px;
          border 0.6px solid transparent;

          .icon-size {
            font-size $font-size-medium
          }
        }

        .space {
          flex 1;
        }

        .local-div {
          max-width 180px;
          display flex;
          align-items center;
          font-size $font-size-medium-s
          .icon-size {
            font-size $font-size-medium
          }
          span {
            padding 2px;
          }
        }

        &.row-filter {
          justify-content: space-around;
        }
        .filter-btn {
          padding 7px;
          display flex;
          align-items center;
          justify-content: center;

          .arrows {
            display inline;
          }

          .arrow-icon {
            margin-top -4px;
            margin-bottom -4px;
            display block;
            font-size 12px;
          }
          .filter-size {
            font-size 17px;
          }
          .filter-size-1 {
            font-size 14px;
            padding 2px 3px 0px;
          }
          span {
            font-weight 500;
          }
        }
      }
      .box {
        overflow hidden
        .div1 {
          display flex
          justify-content space-between;
          width 90%;
          margin 20px auto
          .img {
            width 30%;
            img {
              width 100%;
            }
          }
          .right {
            width 60%;
            p:nth-child(1) {
              font-size 16px;
              margin-bottom 30px;
            }
            p:nth-child(2) {
              font-size 16px;
              color #f80f16
              font-weight 600
              margin-bottom 10px;
            }
            div {
              span {
                float left
                height 16px;
                line-height 16px;
                padding 0 8px;
                text-align center;
                color #f80f16
                border 1px solid #f80f16
                border-radius 10px;
                margin: 0 3px;
              }
              img {
                float right
                width 20px;
              }
            }
          }
        }
      }
    }
  }
  /deep/ .theme_font_black {
    /*color white!important;   */
  }
  /deep/ .nav-content {
    /*height 190px;*/
    top 310px!important;
    /*overflow visible!important*/
    overflow-y auto!important
  }
  .head {
    height: 180px;
    position: absolute;
    width: 100%;
    background-position: 50% 50%;
    background-size: 100% 100%;
  }
  /deep/ .theme_bg_white {
    background-color transparent!important
  }
</style>
