/**Created by liaoyingchao on 2018/11/7.*/

<template>
  <div class="index">
    <div class="right-div theme_bg_white" @click="clickStop">
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
        <div class="big-filtrate" v-if="brands.length > 0 && brandShow">
          <div class="big-title">品牌</div>
          <div class="items-div" v-for="item in brands">
            <div class="item theme_font_gray theme_border_light"
                 :class="{theme_bg_ml_red: sbItem.selected, theme_font_red_i: sbItem.selected, theme_border_red_i: sbItem.selected}"
                 v-for="sbItem in item.brandList" @click="brandSelected(sbItem)">{{sbItem.name}}
            </div>
          </div>
        </div>
        <div class="big-filtrate" v-if="featureies.length > 0 && featureShow">
          <div class="big-title">商品属性</div>
          <div class="items-div" v-for="item in featureies">
            <div class="title theme_font_common">{{item.name}}</div>
            <div class="item theme_font_gray theme_border_light"
                 :class="{theme_bg_ml_red: sfItem.selected, theme_font_red_i: sfItem.selected, theme_border_red_i: sfItem.selected}"
                 v-for="sfItem in item.featureList" @click="featureSelected(sfItem)">{{sfItem.name}}
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-btns">
        <div class="btn" @click="resetData">重置</div>
        <div class="btn theme_font_white theme_bg_red" @click="sureEvent">确定</div>
      </div>
    </div>
    <div class="other-div" @click="closeEvent"></div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['category'],
    components: {},
    data() {
      return {
        brands: [],
        brandShow: true,
        featureies: [],
        featureShow: true,
        minPrice: '',
        maxPrice: ''
      }
    },
    methods: {
      closeEvent: function () {
        this.$emit('closeEvent')
      },
      clickStop: function () {
        console.log('clickStop');
      },
      sureEvent: function () {
        let filtrateData = {
          brands: [],
          featureies: [],
          maxPrice: this.maxPrice,
          minPrice: this.minPrice
        }
        for (let i = 0; i < this.brands.length; i++) {
          let item = this.brands[i]
          for (let j = 0; j < item.brandList.length; j++) {
            let sitem = item.brandList[j]
            if (sitem.selected) {
              filtrateData.brands.push(sitem)
            }
          }
        }
        for (let i = 0; i < this.featureies.length; i++) {
          let item = this.featureies[i]
          for (let j = 0; j < item.featureList.length; j++) {
            let sitem = item.featureList[j]
            if (sitem.selected) {
              filtrateData.featureies.push(sitem)
            }
          }
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
        this.brandShow = false
        this.featureShow = false
        this.$nextTick(() => {
          this.brandShow = true;
          this.featureShow = true;
        })
      },
      _getFiltraties: function () {
        if (this.category == '') {
          return ;
        }
        this.$Loading.open();
        let url = '/app/json/product/getAppProFeatureList';
        let paramsData = {
          token: this.$store.state.login.token,
          categoryId: this.category
        };
        this.$http.post(url, paramsData).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.brands = data.data.brandList;
            this.featureies = data.data.featureList;
          } else {
            this.$Toast(data.info);
          }
        }, error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        });
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
      this._getFiltraties();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
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
      width 80%;
      height 100%;
      .scroll-div {
        position absolute;
        left 0px;
        right 0px;
        top 0px;
        bottom 50px;
        overflow-y auto;
        -webkit-overflow-scrolling touch;
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
              font-size 14px;
            }
            .item {
              float left;
              margin-left 8px;
              margin-top 7px;
              border-width 0.5px
              border-style solid;
              border-radius 18px;
              padding 6px 12px;
              font-size 14px;
            }
            .price {
              float left;
              margin-left 8px;
              margin-right 10px;
              margin-top 7px;
              border-width 0.5px
              border-style solid;
              border-radius 20px;
              font-size 14px;
              input {
                height 26px;
                border none
                background none
                width 100px;
                text-align center;
              }
            }
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
        box-shadow 0 -2px 2px #efefef;
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
