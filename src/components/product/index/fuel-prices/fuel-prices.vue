/**Created by liaoyingchao on 2018/12/21.*/

<template>
  <div class="fuel-prices" ref="paomadeng" :style="getFuelPricesBgStyle()">
    <div class="flex-div" :style="getSidesStyle()" v-if="moduleData.styleTempl == 1">
      <div class="titleImg">
        <img :src="moduleData.titleImg">
      </div>
      <div class="paomadeng-div" v-if="refresh" :class="hotareaClass({idCode: moduleData.idCode + 'toFuelPricesPage'})" @click.stop="hotEvent('toFuelPricesPage');toFuelPricesPage()">
        <div class="pmd-scroll" ref="runDiv" :style="{animationDuration: runTime+'s'}">
          <div class="listitem" v-for="(item,idx) in listShowDatas" :key="idx">
            <p class="gasname single-line" :style="getBgColor(item.oilName)">{{item.oilName}}</p>
            <div class="gasprice line_top">
              <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
            </div>
          </div>
        </div>
        <div class="pmd-scroll" :style="{animationDuration: runTime+'s'}">
          <div class="listitem" v-for="(item,idx) in listShowDatas" :key="idx">
            <p class="gasname single-line" :style="getBgColor(item.oilName)">{{item.oilName}}</p>
            <div class="gasprice line_top">
              <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-div-2" :style="getSidesStyle()" v-if="moduleData.styleTempl == 2">
      <div class="titleImg">
        <img :src="moduleData.titleImg">
      </div>
      <div class="paomadeng-div" :class="hotareaClass({idCode: moduleData.idCode + 'toFuelPricesPage'})" @click.stop="hotEvent('toFuelPricesPage');toFuelPricesPage()">
        <div class="pmd-scroll" :style="pmdStyle" v-if="refresh">
          <!--<transition-group name="list">-->
          <div ref="runDiv" class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="listitem" v-for="(item,idx) in listShowDatas" :key="idx">
              <!--style="width: 100px; margin-left: 10px;"-->
              <div class="gas-img">
                <img :src="item.imgUrl != '' ? item.imgUrl : 'static/images/fuel-prices/92.png'"/>
              </div>
              <div class="gasprice">
                <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
              </div>
            </div>
          </div>
          <div class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="listitem" v-for="(item,idx) in listShowDatas" :key="idx">
              <div class="gas-img">
                <img :src="item.imgUrl != '' ? item.imgUrl : 'static/images/fuel-prices/92.png'"/>
              </div>
              <div class="gasprice">
                <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
              </div>
            </div>
          </div>
          <!--</transition-group>-->
        </div>
      </div>
    </div>
    <div class="flex-div-2 flex-div-3" :style="getSidesStyle()" v-if="moduleData.styleTempl == 3">
      <div class="titleImg">
        <img :src="moduleData.titleImg">
      </div>
      <div class="paomadeng-div" :class="hotareaClass({idCode: moduleData.idCode + 'toFuelPricesPage'})" @click.stop="hotEvent('toFuelPricesPage');toFuelPricesPage()">
        <div class="pmd-scroll" :style="pmdStyle" v-if="refresh">
          <!--<transition-group name="list">-->
          <div ref="runDiv" class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="listitem" v-for="(item,idx) in listShowDatas" :key="idx">
              <!--style="width: 100px; margin-left: 10px;"-->
              <div class="gas-img">
                <img :src="item.imgUrl != '' ? item.imgUrl : 'static/images/fuel-prices/st3_92.png'"/>
                <!--<img src="static/images/fuel-prices/st3_92.png"/>-->
              </div>
              <div class="gasprice">
                <span class="price">¥{{item.oilPrice}}</span>
              </div>
            </div>
          </div>
          <div class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="listitem" v-for="(item,idx) in listShowDatas" :key="idx">
              <div class="gas-img">
                <img :src="item.imgUrl != '' ? item.imgUrl : 'static/images/fuel-prices/st3_92.png'"/>
                <!--<img src="static/images/fuel-prices/st3_92.png"/>-->
              </div>
              <div class="gasprice">
                <span class="price">¥{{item.oilPrice}}</span>
              </div>
            </div>
          </div>
          <!--</transition-group>-->
        </div>
      </div>
    </div>
    <div class="flex-div-2 flex-div-4" :style="getSidesStyle()" v-if="moduleData.styleTempl == 4">
      <div class="titleImg">
        <img :src="moduleData.titleImg">
      </div>
      <div class="paomadeng-div" :class="hotareaClass({idCode: moduleData.idCode + 'toFuelPricesPage'})" @click.stop="hotEvent('toFuelPricesPage');toFuelPricesPage()">
        <div class="pmd-scroll" :style="pmdStyle" v-if="refresh">
          <!--<transition-group name="list">-->
          <div ref="runDiv" class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="oil-cate" v-for="(dic,idx) in showDicData" :key="idx">
              <div class="title">{{dic.name}}:</div>
              <div class="listitem" v-for="(item,idx) in dic.arr" :key="idx">
                <p class="gasname single-line" :style="getBgColor(item.oilName)">{{item.priceTypeName}}</p>
                <div class="gasprice line_top">
                  <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="oil-cate" v-for="(dic,idx) in showDicData" :key="idx">
              <div class="title">{{dic.name}}:</div>
              <div class="listitem" v-for="(item,idx) in dic.arr" :key="idx">
                <p class="gasname single-line" :style="getBgColor(item.oilName)">{{item.priceTypeName}}</p>
                <div class="gasprice line_top">
                  <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
                </div>
              </div>
            </div>
          </div>
          <!--</transition-group>-->
        </div>
      </div>
    </div>
    <div class="flex-div-2 flex-div-4 flex-div-5" :style="getSidesStyle()" v-if="moduleData.styleTempl == 5">
      <div class="titleImg">
        <img :src="moduleData.titleImg">
      </div>
      <div class="paomadeng-div" :class="hotareaClass({idCode: moduleData.idCode + 'toFuelPricesPage'})" @click.stop="hotEvent('toFuelPricesPage');toFuelPricesPage()">
        <div class="pmd-scroll" :style="pmdStyle" v-if="refresh">
          <!--<transition-group name="list">-->
          <div ref="runDiv" class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="oil-cate" v-for="(dic,idx) in showDicData" :key="idx">
              <!--<div class="title">{{dic.name}}:</div>-->
              <div class="listitem" v-for="(item,idx2) in dic.arr" :key="idx2">
                <p class="gasname single-line" :style="getBgColor(item.oilName)">{{item.priceTypeName}}{{dic.name}}</p>
                <div class="gasprice line_top">
                  <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="scroll-item" :style="{animationDuration: runTime+'s'}">
            <div class="oil-cate" v-for="(dic,idx) in showDicData" :key="idx">
              <!--<div class="title">{{dic.name}}:</div>-->
              <div class="listitem" v-for="(item,idx) in dic.arr" :key="idx">
                <p class="gasname single-line" :style="getBgColor(item.oilName)">{{item.priceTypeName}}{{dic.name}}</p>
                <div class="gasprice line_top">
                  <span class="price">{{item.oilPrice}}</span> <span class="unit">{{item.listUnit}}</span>
                </div>
              </div>
            </div>
          </div>
          <!--</transition-group>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import componentApi from '../_js/component-api'
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'fuel-prices',
    components: {},
    mixins: [componentApi,hee],
    props: ['myIndex', 'usePorpData', 'propData'],
    data() {
      return {
        showIndex: 0,
        listShowDatas: [],
        pmdStyle: '',
        refresh: true,
        runTime: 10,
        showDicData: {}
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getBgColor: function (name) {
        if (name.indexOf('92') != -1) {
          return "background-color: #E93324;"
        } else if (name.indexOf('95') != -1) {
          return "background-color: #69AC60;"
        } else if (name.indexOf('98') != -1) {
          return "background-color: #225236;"
        }
        return ""
      },
      modeleReshow: function () {

      },
      toFuelPricesPage: function () {
        if (this.moduleData.styleTempl == 4 || this.moduleData.styleTempl == 5) {
          this.$market.customPush({
            path: '/latestprice2'
          })
        } else {
          this.$market.customPush({
            path: '/latestprice'
          })
        }
      },
      getFuelPricesBgStyle: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color + ";"
        }
        return styleStr
      },
      getSidesStyle: function () {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        // let upDownMargin = this.moduleData.upDownMargin
        // if (upDownMargin > 0) {
        //   styleStr += 'padding-top: ' + upDownMargin + '%; padding-bottom: ' + upDownMargin + '%;'
        // }
        return styleStr;
      },
      _getMyData: function () {
        let url = this.$market.apiBaseURL() + '/app/json/product/queryOilPriceList';
        let paramsData = {};
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            if (data.data.proOilPriceModelList.length > 0) {
              this.listShowDatas = data.data.proOilPriceModelList
              // 必须大于3个才满屏
              if (this.listShowDatas.length < 3) {
                this.listShowDatas = this.listShowDatas.concat(data.data.proOilPriceModelList)
                if (this.listShowDatas.length < 3) {
                  this.listShowDatas = this.listShowDatas.concat(data.data.proOilPriceModelList)
                }
              }
              if (this.moduleData.styleTempl == 4 || this.moduleData.styleTempl == 5) {
                this.initData(this.listShowDatas)
              }
              this.refresh = false
              this.$nextTick(() => {
                this.refresh = true
                this.$nextTick(() => {
                    this.running();
                })
              })
            }
          } else {
          }
        }, error => {
        })
      },
      initData: function (oArr) {
        // let arr1 = [], arr2 = [], arr3 = []; // arr1 汽油 arr2 柴油 arr3 天然气
        let dic = {}
        for (let i = 0; i < oArr.length; i++) {
          let item = oArr[i]
          let key = item.oilCategory + '_' + item.oilCategoryOrder
          if (dic[key]) {
            dic[key].arr.push(item)
          } else {
            let arr = []
            arr.push(item)
            dic[key] = {
              name: item.oilName,
              arr: arr
            }
          }
        }
        this.showDicData = dic
      },
      running: function () {
        if (this.$refs.runDiv) {
          let len = this.$refs.runDiv.clientWidth
          this.runTime = Math.floor(len / 50)

          if (this.runTime < 2 * this.listShowDatas.length) {
            this.runTime = 2 * this.listShowDatas.length
          }
        }
      },
      lazyLoadPageData: function () {
        this._getMyData();
      }
    },
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    watch: {
      'moduleData.styleTempl': function () {
        this._getMyData();
      }
    },
    created() {
      if (this.$store.state.webtype == -1 && !this.moduleData.idCode) {
        this.moduleData.idCode = this.$util.randomString()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .fuel-prices {
    width 100%
    height 100%
    overflow hidden

    .flex-div {
      height 100%
      overflow hidden
      display flex;
      align-items center;

      .titleImg {
        position relative;
        z-index 9;
        overflow hidden
        height 66px;
        margin-right -4px;

        img {
          display block;
          height 100%;
        }
      }

      .paomadeng-div {
        flex 1;
        overflow hidden;
        height 66px;
        font-size 0px;
        white-space: nowrap;

        .pmd-scroll {
          display inline-block;
          padding-top 4px;
          height 100%;
          overflow hidden;
          white-space: nowrap;
          font-size 0px;
          animation: slidein 10s linear 1s infinite running;

          .listitem {
            display inline-block;
            overflow hidden;
            width 100px;
            border-radius 8px;
            // border 1px solid #ddd;
            text-align center;
            font-size 12px;
            margin-right 10px;
            position relative;
            &.listitem:before {
              content: "";
              position: absolute;
              top: -50%;
              bottom: -50%;
              left: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              border: solid 1px #ddd;
              border-radius: 16px;
              box-sizing: border-box;
            }

            .gasname {
              padding 5px;
              color white;
              background-color #AAAAAA
            }

            .gasprice {
              padding 5px;
              background-color #f6f6f6;

              .price {
                font-size 24px;
                font-weight 500;
                color red;
              }

              .unit {
                font-size 12px;
                color #666;
              }
            }
          }
        }
      }
    }

    .flex-div-2 {
      height 45px;
      overflow hidden
      display flex;
      align-items center;

      .titleImg {
        position relative;
        z-index 9;
        overflow hidden
        height 100%;
        margin-right -4px;

        img {
          display block;
          height 100%;
        }
      }

      .paomadeng-div {
        flex 1;
        overflow hidden;
        font-size 0px;
        height 45px;

        .pmd-scroll {
          position relative;
          height 100%;
          overflow hidden;
          white-space: nowrap;
          font-size 0px;

          .scroll-item {
            /*position absolute;
            top 50%;
            margin-top -12px;
            left 0;*/
            margin-top 10px;
            display inline-block;
            overflow hidden;
            animation: slidein 10s linear 1s infinite running;
          }

          .listitem {
            margin-right 10px;
            display inline-block;
            overflow hidden;
            text-align center;
            font-size 0px;

            .gas-img {
              display inline-block;
              vertical-align middle;

              img {
                display block;
                height 24px;
              }
            }

            .gasprice {
              display inline-block;
              vertical-align middle;

              .price {
                font-size 18px;
                font-weight 500;
                color black;
              }

              .unit {
                padding-bottom 1px;
                font-size 12px;
              }
            }
          }
        }
      }
    }

    .flex-div-3 {
      .paomadeng-div {
        .pmd-scroll {
          .scroll-item {
            margin-top 0px;
          }
          .listitem {
            position relative;
            padding 0 10px;

            .gas-img {

              img {
                display block;
                height 43px;
              }
            }

            .gasprice {
              position absolute;
              left 40px;
              bottom 5px;
              /*display none;*/

              .price {
                font-size 12px;
                color #EA4464;
              }

              .unit {
                padding-bottom 1px;
                font-size 12px;
              }
            }
          }
        }
      }
    }
    .flex-div-4 {
      height 66px;
      .titleImg {
        position relative;
        z-index 9;
        overflow hidden
        height 66px;
        margin-right -4px;

        img {
          display block;
          height 100%;
        }
      }
      .paomadeng-div {
        height 66px;
        .pmd-scroll {
          .scroll-item {
            margin-top 1px;
            font-size 0;
          }
          .oil-cate {
            display inline-block;
            vertical-align bottom;
            font-size 0;
            .title {
              font-size 14px;
              display inline-block;
              vertical-align bottom;
              line-height 55px;
              padding 0 10px;
            }
          }
          .listitem {
            display inline-block;
            vertical-align bottom;
            overflow hidden;
            width 100px;
            border-radius 8px;
            // border 1px solid #ddd;
            text-align center;
            font-size 12px;
            margin-right 10px;
            position relative;
            &.listitem:before {
              content: "";
              position: absolute;
              top: -50%;
              bottom: -50%;
              left: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              -webkit-transform: scale(0.5);
              transform: scale(0.5);
              border: solid 1px #ddd;
              border-radius: 16px;
              box-sizing: border-box;
            }

            .gasname {
              padding 5px;
              color white;
              background-color #AAAAAA
            }

            .gasprice {
              padding 5px;
              //background-color #f6f6f6;

              .price {
                font-size 24px;
                font-weight 500;
                color red;
              }

              .unit {
                font-size 12px;
                color #666;
              }
            }
          }
        }
      }
    }
    .flex-div-5 {
      .paomadeng-div {
        .pmd-scroll {
          .listitem {
            width 120px;
            .gasprice {
              display block;
              //background-color white;
            }
          }
        }
      }
    }
    .rowup {
      position: relative;
      /*width: ;*/
      height: 100%;
      -webkit-animation: 10s rowup linear infinite normal;
      animation: 10s rowup linear infinite normal;
    }

  }

  @keyframes slidein {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%); // 每行高50
    }
  }

  .list-enter-active, .list-leave-active {
    transition: all 10s linear;
  }

  .list-leave-to {
    transform: translateX(-100%);
  }

  .list-enter {
    transform: translateX(100%);
  }
</style>
