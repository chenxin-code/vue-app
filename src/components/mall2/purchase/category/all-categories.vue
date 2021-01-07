/**Created by liaoyingchao on 2019-04-09.*/

<template>
  <div class="all-categories" @click.stop="cancelSelect">
    <div class="categories-bottom" @click.stop="stop">
      <div class="pg-title" :style="{ marginTop: this.$store.state.barHeight+'px' }">分类</div>
      <div style="flex: 1;overflow: hidden;">
        <div ref="leftScroll" class="left-div theme_bg_white_f5">
          <div class="cat-div" :class="{theme_bg_white_i: selectedId == idx}" v-for="(item, idx) in category" @click="categoryEvent(idx)">
            <div class="title-div theme_font_gray"
                 :class="{'theme_border_red_i theme_font_black_i title-div-selected': selectedId == idx}">{{item.name}}
            </div>
          </div>
        </div>
        <div class="right-div">
          <div class="sub-right-div">
            <div class="block-div" v-for="(item, idx) in subCategories">
              <div class="title-row theme_font_black">
                <div class="title">{{item.name}}</div>
                <!--<div class="more-btn theme_font_red" v-if="item.clsType != 0" @click="toProductList(item, 2)">-->
                <!--<span>全部</span>-->
                <!--<i class="iconfont mall-gengduojiantou more-size"></i>-->
                <!--</div>-->
              </div>
              <div class="s-cate" v-for="(subItem, cIndex) in item.childs" @click.stop="toProductList(subItem, 3)">
                <div class="cate-img">
                  <img :src="subItem.phUrl">
                </div>
                <div class="cate-name single-line theme_font_black">{{subItem.name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "all-categories",
    components: {},
    data() {
      return {
        category: [{
          clsType: '',
          id: '',
          name: "全部商品",
          parentId: '',
          phUrl: "",
          sort: '',
          cateLevel: ''
        }],
        selectedId: 0,
        subCategories: [],
      }
    },
    methods: {
      stop: function () {

      },
      cancelSelect: function () {
        this.$emit('closeEvent')
      },
      categoryEvent: function (idx) {
        if (idx == 0) {
          let item = this.category[0]
          this.$emit('cateEvent', item)
          return
        }
        this.selectedId = idx;
        this.subCategories = this.category[idx].childs;
        this.subPageRefreshEvent()
      },
      subPageRefreshEvent: function () {
        this.subPageRefresh = false
        this.$nextTick(() => {
          this.subPageRefresh = true
        })
      },
      toProductList: function (item, cateLevel) {
        item.cateLevel = cateLevel
        this.$emit('cateEvent', item)
      },
      _loadProCateList: function () {
        let url = '/app/json/pro_sku_purchase/queryPurchaseClass';
         let paramsData = {
          token: this.$store.state.login.token
        };
         this.$http.post(url, paramsData).then(res => {
            let data = res.data;
            if (data.status == 0) {
              this.category = data.data.list;
              let all = {
                clsType: '',
                id: '',
                cateLevel: '',
                name: "全部商品",
                parentId: '',
                phUrl: "",
                sort: '',
              }
              this.category.unshift(all)
              if (this.category.length > 1) {
                this.subCategories = this.category[1].childs
              }
              this.selectedId = 1
            } else {
            }
          },
          error => {
          });
      },
    },
    created() {
      this._loadProCateList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .all-categories {
    position fixed;
    left 0px;
    top 0px;
    width 100%
    height 100%
    overflow hidden
    background-color rgba(0, 0, 0, 0.5)
    z-index 10;
    .categories-bottom {
      width 90%;
      background-color white;
      height 100%;
      overflow hidden;
      display flex;
      flex-direction column;
      .pg-title {
        padding 15px;
        font-size 20px;
      }
      .left-div {
        height 100%;
        width 90px;
        float left;
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch;

        .cat-div {
          padding 10px 0;

          .title-div {
            margin  6px 0;
            border-left-width 4px;
            border-color transparent;
            border-style solid;
            font-size $font-size-medium;
            text-align center;
          }
          .title-div-selected {
            font-weight:  500
            font-size $font-size-medium-x
          }
        }
      }

      .right-div {
        height 100%;
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch;

        .sub-right-div {
          padding 0 8px 0 10px;
          overflow hidden;
          .block-div {
            box-shadow 0 1px 8px #efefef;
            margin-bottom 8px;
            border-radius 8px;
            padding 5px 4px;
            overflow hidden;

            .title-row {
              font-size $font-size-small;
              font-weight 600
              display flex;
              align-items center;
              padding 4px 0px 0;
              height: 25px;
              line-height: 25px;
              .title {
                flex 1;
              }

              .more-btn {
                padding 8px 0;
                .more-size {
                  font-size $font-size-medium-x;
                }
              }
            }

            .s-cate {
              padding 6px 0px 10px;
              width 33.3%;
              float left;
              .cate-img {
                position relative;
                margin-left 15%
                width 70%;
                padding-bottom 70%;
                img {
                  position absolute;
                  display block;
                  left 0px;
                  top 0px;
                  width 100%;
                  height 100%;
                }
              }
              .cate-name {
                font-size $font-size-small-s;
                padding 10px 5px 0px 5px;
                text-align center;
              }
            }

          }
        }
      }
    }
  }
</style>
