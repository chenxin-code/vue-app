/**Created by liaoyingchao on 2018/11/7.*/

<template>
  <div class="index">
    <div class="right-div theme_bg_white">
      <div class="scroll-div">
        <div class="big-filtrate">
          <div class="big-title">价格区间</div>
          <div class="items-div">
            <div class="price theme_border_light">
              <input placeholder="最低价" type="number" v-model="minPrice"/>
            </div>
            <div class="price theme_border_light">
              <input placeholder="最高价" type="number" v-model="maxPrice"/>
            </div>
          </div>
        </div>
        <div class="big-filtrate" v-if='globalConfig.pro_search_stock_button_show == 1'>
          <div class="big-title">库存</div>
          <div class="items-div groupRadio">
            <van-radio-group v-model="proSkuHasStock" direction="horizontal" icon-size='16px' checked-color='#f80f16'>
              <van-radio name="">全部</van-radio>
              <van-radio name="1">有库存</van-radio>
              <!-- <van-radio name="0">无库存</van-radio> -->
            </van-radio-group>
          </div>
        </div>
<!--        <div class="big-filtrate" v-if="brands.length > 0 && brandShow">-->
<!--          <div class="big-title">品牌</div>-->
<!--          <div class="items-div" v-for="item in brands">-->
<!--            <div class="item theme_font_gray theme_border_light"-->
<!--                 :class="{theme_bg_ml_red: sbItem.selected, theme_font_red_i: sbItem.selected, theme_border_red_i: sbItem.selected}"-->
<!--                 v-for="sbItem in item.brandList" @click="brandSelected(sbItem)">{{sbItem.name}}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <div class="brand big-filtrate" v-if="cateText != '全部商品'">
          <div class="big-title brand-title">
            <div class="left">品牌</div>
            <div class="info" v-if="selectBrandList.length" >
              <span class="text">{{showBrand}}</span>
            </div>
            <div class="right" @click="showOil = !showOil" v-if="brands.length > 9">
              <van-icon v-if="showOil" name="arrow-up" />
              <van-icon v-else name="arrow-down" />

<!--              <i :class="{active: showOil}" class="icon iconfont mall-arrow-down"></i>-->
            </div>
          </div>
          <ul class="brand-list items-div" >
            <li class="brand-item theme_font_gray" v-for="(item, index) in brands" :key="index" v-if="dealShowIndex(index)">
              <div class="content theme_border_light" :class="{active: arr.includes(index)}" @click="selectBrand(item, index)">
                <div class="china" :class="{'special': !item.enName}">{{dealText(item.name, 5)}}</div>
                <div class="english">{{item.name ? dealText(item.enName, 11) : dealText(item.enName, 9)}}</div>
              </div>
            </li>
            <li class="brand-item theme_font_gray" v-if="showOil">
              <div class="content theme_border_light" @click="showAllBrand = true">
                <div class="china">全部品牌</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="big-filtrate" v-if="featureies.length > 0 && featureShow">
          <div class="big-title">商品属性</div>
          <Fediv class="items-div" v-for="(item, index) in featureies" :key="index">
            <div class="title theme_font_common">{{item.name}}</div>
            <div class="item theme_font_gray theme_border_light"
                 :class="{theme_bg_ml_red: sfItem.selected, theme_font_red_i: sfItem.selected, theme_border_red_i: sfItem.selected}"
                 v-for="sfItem in item.featureList" @click="featureSelected(sfItem)">{{sfItem.name}}
            </div>
          </Fediv>
        </div>
      </div>
      <div class="bottom-btns">
        <div class="btn" @click="resetData">重置</div>
        <div class="btn" style="border-left: solid 1px #efefef; color: red;" @click="sureEvent">确定</div>
      </div>
    </div>
    <Brand @closeEventBtn="closeEventBtn" @closeEvent="filtrateCloseEvent" v-if="showAllBrand" :category="category" :selectBrandList="selectBrandList"></Brand>
    <div class="other-div" @click="closeEvent"></div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import Brand from '../brand/brand-list'
  import {cloneDeep} from 'lodash'
  export default {
    name: "index",
    props: ['category', 'cateText', 'cateLevel'],
    components: {Brand},
    data() {
      return {
        showAllBrand: false,
        brand: [],
        arr: [],
        showOil: false, // 油品
        selectBrandList: [], // 已选的品牌
        showBrandList: [],
        showBrand: '',
        brands: [],
        brandShow: true,
        featureies: [],
        featureShow: true,
        minPrice: '',
        maxPrice: '',
        proSkuHasStock: '',
        brandIds: [],
        info: []
      }
    },
    computed: {
      ...mapState(["globalConfig"])
    },
    mounted() {
    },
    methods: {
      dealShowIndex(index) {
        if (!this.showOil) {
          return index < 9
        } else if (!this.info.length) {
          return index < 17
        } else {
          return true
        }
      },
      filtrateCloseEvent(info) {
        this.info = info
        console.log(info)
        this.showAllBrand = false
        /**
         * @type {Array}
         * 获取最新全部品牌里面选中的数据 复制给brands
         */
        let arr = []
        this.selectBrandList = []
        this.brands.map(Bitem => {
          this.$set(Bitem, 'flag', false)
          info.map(Citem => {
            if (Bitem.id == Citem.id) {
              this.$set(Bitem, 'flag', true)
            }
          })
        })
        /**
         * @type {Array}
         * 处理brands选中的排序 选中的放最后面
         */
        let preResult = []
        let surResult = []
        let newBrands = []
        let list = this.brands
        this.brands = []
        list.forEach(item => {
          if (item.flag === true) {
            preResult.push(item)
          } else {
            surResult.push(item)
          }
        })
        let newList = surResult.slice(0,17)
        console.log(surResult)
        console.log(newList)
        newBrands = [...newList, ...preResult]
        this.brands = cloneDeep(newBrands)
        console.log(this.brands)
        /**
         * @type {Array}
         * 处理选中效果
         */
        this.brands.map((item, index) => {
          if (item.flag == true) {
            arr.push(index)
            this.selectBrandList.push(item)
          }
        })
        /**
         * @type {Array}
         * 处理选中文字展示
         */
        let str = ''
        this.showBrandList = []
        let showBrandList = []
        this.selectBrandList.forEach(item => {
          if (item.enName) {
            str = (item.name + '(' + item.enName + ')')
          } else {
            str = item.name
          }
          showBrandList.push(str)
        })
        this.showBrandList = cloneDeep(showBrandList)
        let _showBrand = ''
        _showBrand = this.showBrandList.join(',')
        this.showBrand = _showBrand.slice(0, 20) + (_showBrand.length > 20 ? '...' : '')
        this.arr = cloneDeep(arr)
      },
      closeEventBtn() {
        this.showAllBrand = false
      },
      _getFiltraties: function () {
        if (this.category == '') {
          return ;
        }
        let url = '/app/json/product/getAppProFeatureList';
        let paramsData = {
          categoryId: this.category,
          cateLevel: this.cateLevel
        };
        this.$http.post(url, paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.brands = data.data.brandList[0].brandList;
            this.brands.forEach(item => {
              item.flag = false
            })
            this.featureies = data.data.featureList;
          } else {
          }
        }, error => {
        });
      },
      selectBrand(item, index) {
        /**
         * @type {Array}
         * 处理选中效果
         */
        if (this.arr.includes(index)) {
          this.arr = this.arr.filter(function(ele) {
            return ele != index;
          });
        } else {
          this.arr.push(index);
        }
        /**
         * @type {Array}
         * 获取选中数据
         */
        if (this.selectBrandList.includes(item)) {
          this.selectBrandList = this.selectBrandList.filter(function(ele) {
            return ele != item;
          });
        } else {
          this.selectBrandList.push(item)
        }
        this.selectBrandList.forEach(item => {
          item.flag = true
        })
        /**
         * @type {Array}
         * 处理选中数据文本展示
         */
        let str = ''
        this.showBrandList = []
        this.selectBrandList.forEach(item => {
          if (item.enName) {
            str = (item.name + '(' + item.enName + ')')
          } else {
            str = item.name
          }
          this.showBrandList.push(str)
        })
        let _showBrand = ''
        _showBrand = this.showBrandList.join(',')
        this.showBrand = _showBrand.slice(0, 20) + (_showBrand.length > 20 ? '...' : '')
      },
      dealText(text, length) {
        // text 内容， length 超出几位展示省略号
        if (text) {
          let completeText = text.slice(0, length)
          return completeText + (text.length > length ? '...' : '')
        }
      },
      closeEvent: function () {
        this.$emit('closeEvent')
      },
      sureEvent: function () {
        let filtrateData = {
          brands: [],
          featureies: [],
          maxPrice: this.maxPrice,
          minPrice: this.minPrice,
          proSkuHasStock: this.proSkuHasStock,
          brandIds: []
        }
        if (this.selectBrandList.length) {
          this.selectBrandList.forEach(item => {
            filtrateData.brandIds.push(item.id)
          })
        }
        this.$emit('filtrateEvent', filtrateData)
      },
      resetData: function () {
        for (let i = 0; i < this.brands.length; i++) {
          let item = this.brands[i]
          for (let j = 0; j < item.brandList.length; j++) {
            let sitem = item.brandList[j]
            sitem.selected = false
          }
        }
        for (let i = 0; i < this.featureies.length; i++) {
          let item = this.featureies[i]
          for (let j = 0; j < item.featureList.length; j++) {
            let sitem = item.featureList[j]
            sitem.selected = false
          }
        }
        this.minPrice = '';
        this.maxPrice = '';
        this.proSkuHasStock = '';
        this.brandShow = false
        this.featureShow = false
        this.$nextTick(() => {
          this.brandShow = true;
          this.featureShow = true;
        })
      },
      brandSelected: function (item) {
        if (item.selected) {
          item.selected = false
        } else {
          item.selected = true
        }
        this.brandShow = false;
        this.$nextTick(() => {
          this.brandShow = true;
        })
      },
      featureSelected: function (item) {
        if (item.selected) {
          item.selected = false
        } else {
          item.selected = true
        }
        this.featureShow = false;
        this.$nextTick(() => {
          this.featureShow = true;
        })
      }
    },
    created() {
      console.log(this.globalConfig.pro_search_stock_button_show)
      this._getFiltraties();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    position fixed;
    left 0px;
    top 0px;
    width 100%
    height 100%
    overflow hidden
    background-color rgba(0, 0, 0, 0.5)
    z-index 10;
    .right-div {
      position relative;
      float right;
      width 90%;
      height 100%;
      .scroll-div {
        position absolute;
        left 0px;
        right 0px;
        top 0px;
        bottom 50px;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
        .brand {
          .brand-title {
            display flex
            justify-content space-between
            .right {
              .icon {

                &.active {
                  transform rotate(-180deg)
                }
              }
            }
            .info {
              .text {
                font-size $font-size-small-s
              }
            }
          }
          .brand-list {
            overflow hidden
            .brand-item {
              float left
              width 33%
              padding: 5px 2px
              .content {
                border-style solid;
                border-width 0.5px
                border-radius 20px
                padding: 2px
                display flex
                justify-content center
                align-items center
                flex-direction column
                /*line-height 16px*/
                font-size $font-size-medium;
                height: 40px
                .special {
                  font-size 15px
                }
              }
              .active {
                border-color: #F90000
                color: #F90000
                background-color: rgba(247, 218, 218, 1)
              }
            }
          }
        }
        .big-filtrate {
          padding-left 4px;
          overflow hidden;
          .big-title {
            margin 8px 8px 5px;
            font-size 14px;
          }
          .items-div {
            overflow hidden;
            margin-bottom 10px;
            .title {
              padding 8px;
              font-size $font-size-medium;
            }
            .item {
              float left;
              margin-left 8px;
              margin-top 7px;
              border-width 0.5px
              border-style solid;
              border-radius 18px;
              padding 6px 12px;
              font-size $font-size-medium;
            }
            .price {
              float left;
              margin-left 8px;
              margin-right 10px;
              margin-top 7px;
              border-width 0.5px
              border-style solid;
              border-radius 20px;
              font-size $font-size-medium;
              input {
                height 26px;
                border none
                background none
                width 100px;
                text-align center;
              }
            }
          }
          .groupRadio {
            margin 10px
          }
        }
        .big-filtrate:nth-child(1) {
          margin-top 28px;
        }
      }
      .bottom-btns {
        position absolute;
        left 0px;
        right 0px;
        bottom 0px;
        height 50px;
        border: solid 1px #efefef;
        display flex;
        .btn {
          text-align center;
          line-height 50px;
          height 50px;
          flex 1;
          font-size 18px;
          font-weight 500;
        }
      }
    }
    .other-div {
      overflow hidden;
      height 100%;
    }
  }
</style>
