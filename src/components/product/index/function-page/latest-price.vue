/**Created by liaoyingchao on 2019/1/15.*/

<template>
  <div class="latest-price">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="top-div">
          <div class="img-bg-corner">
            <img src="static/image/index/latest-price/myBgImg-1.png"/>
          </div>
          <div class="info-div">
            <div class="text-div">
              <div class="big-text">最新油价</div>
              <!--<div class="sub-text">汽油、柴油、天然气今日价格</div>-->
            </div>
            <div class="img-div">
              <img src="static/image/index/latest-price/top-img.png"/>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="cate-div" v-for="(items, idx) in listShowDatas" v-if="items.length > 0">
            <div class="title-row">
              <img :src="'static/image/index/latest-price/yj-'+(idx+1)+'.png'"/>
              <span>{{getTitleText(idx)}}</span>
            </div>
            <div class="items-div">
              <div class="item-div" v-for="item in items">
                <div class="title">
                  <p class="theme_font_common">{{item.oilName}}</p>
                  <p class="font-small theme_font_gray">自{{getTimeStr(item)}}开始执行</p>
                </div>
                <div class="price theme_font_gray">￥<span class="theme_font_black">{{item.oilPrice}}</span>{{item.listUnit}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "latest-price",
    components: {},
    data() {
      return {
        proOilPriceModelList: [],
        listShowDatas: []
      }
    },
    methods: {
      getTitleText: function (idx) {
        if (idx == 0) {
          return '汽油'
        } else if (idx == 1) {
          return '柴油'
        }
        return '天然气'
      },
      getTimeStr: function (item) {
        let beginTime = item.beginTime
        beginTime = beginTime.replace(/-/g, '/');
        let oDate = new Date(beginTime),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMinute = oDate.getMinutes(),
          oSecond = oDate.getSeconds(),

          oTime = oYear + '年' + this.$util.getzf(oMonth) + '月' + this.$util.getzf(oDay) + '日' + this.$util.getzf(oHour) + '时' + this.$util.getzf(oMinute) + '分' + this.$util.getzf(oSecond) + '秒';//最后拼接时间
        return oTime;
      },
      getOilPrice: function () {
        let url = '/app/json/product/queryOilPriceList';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$Loading.open()
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          this.$Loading.close()
          if (data.status == 0) {
            if (data.data.proOilPriceModelList.length > 0) {
              this.proOilPriceModelList = data.data.proOilPriceModelList
              this.dataProcessing();
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败！')
        })
      },
      dataProcessing: function () {
        console.log(this.proOilPriceModelList)
        let arr1 = [], arr2 = [], arr3 = []; // arr1 汽油 arr2 柴油 arr3 天然气
        for (let i = 0; i < this.proOilPriceModelList.length; i++) {
          let item = this.proOilPriceModelList[i]
          if (item.oilCategory == 0) {
            arr1.push(item)
          } else if (item.oilCategory == 1) {
            arr2.push(item)
          } else if (item.oilCategory == 2) {
            arr3.push(item)
          }
        }
        this.listShowDatas = []
        this.listShowDatas.push(arr1, arr2, arr3)
      }
    },
    created() {
      this.getOilPrice();
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .latest-price {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      width 100%;
      height 100%;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      .top-div {
        position relative;
        overflow hidden;
        z-index 9;
        height 150px;
        .img-bg-corner {
          width: 180%;
          height: 150px;
          position: absolute;
          left: -40%;
          top: 0;
          z-index -1
          content: '';
          overflow hidden;
          border-radius: 0 0 50% 50%;
          img {
            position absolute;
            left 20%;
            top 0px;
            width 60%
            height 150px;
          }
        }
        .info-div {
          display flex
          align-items center;
          padding 20px 35px;
          .text-div {
            flex 1;
            .big-text {
              font-weight 500;
              font-size 30px;
              color white;
            }
            .sub-text {
              margin-top 12px;
              font-weight 500;
              font-size 13px;
              color #FAE2A1;
            }
          }
          .img-div {
            img {
              display block;
              width 90px;
            }
          }
        }
      }
      .content {
        .cate-div {
          .title-row {
            display flex;
            align-items center;
            padding 8px;
            img {
              height 20px;
              margin-right 5px;
            }
            span {
              font-size 14px;
            }
          }
          .items-div {
            box-shadow 0 1px 8px #efefef;
            border-radius 5px;
            margin 2px 8px 5px;
            padding 0px 8px;
            .item-div {
              padding 12px 0px;
              display flex;
              align-items center;
              .title {
                flex 1;
                font-size 15px;
                p:nth-child(2) {
                  padding-top 5px;
                }
              }
              .price {
                font-size 12px;
                span {
                  padding 0px 2px;
                  font-size 18px;
                }
              }
            }
            .item-div:nth-child(n+2) {
              border-top 0.5px solid #efefef;
            }
          }
        }
      }
    }
  }
</style>
