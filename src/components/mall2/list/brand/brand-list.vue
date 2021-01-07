<template>
  <div class="index">
    <div class="right-div theme_bg_white">
      <nav-top title="品牌" @backEvent="closeEvent" v-if="hasBack">
        <div class="phone-bill" @click="queryBtn">确定</div>
      </nav-top>
      <nav-content class="container" :class="{'no-top-nav': !hasBack}">
        <!-- 品牌索引列表 -->
        <div class="brand-list">
          <van-index-bar
            :sticky="false"
            :index-list="indexList"
            class="reset-index-bar-style">
            <div v-for="(value, key) in brandList" :key="key">
              <van-index-anchor :index="key" class="reset-anchor">
                <span class="text">{{ key }}</span>
              </van-index-anchor>
              <div v-if="value.length > 0">
                <div class="table-view">
                  <div class="table-view-cell" v-for="(item, index) in value" :key="item.id"
                       @click="brandClick(key, index)">
                    <div class="table-view-cell-text special">
                      <div class="icon" v-if="item.flag">
                        <van-icon name="success" icon="#F90000"/>
                      </div>
                      <div class="text">{{item.name}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <van-cell title="品牌入驻中~" class="no-result"/>
              </div>
            </div>
          </van-index-bar>
        </div>
      </nav-content>
    </div>
  </div>
</template>
<script>
  import {cloneDeep} from 'lodash'

  export default {
    name: "index",
    props: {
      hasBack: {
        type: Boolean,
        default: true,
      },
      category: '',
      selectBrandList: {
        type: Array,
        default: []
      },
      icon: 'success'
    },
    data() {
      return {
        indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
        brandList: {},
        seletBrand: []
      }
    },
    computed: {},
    mounted() {
      this.getAppProFeatureList()
      console.log('this.selectBrandList')
      console.log(this.selectBrandList)
    },
    methods: {
      closeEvent() {
        this.$emit('closeEventBtn')
      },
      queryBtn() {
        this.seletBrand = []
        for (const brandKey in this.brandList) {
          if (this.brandList[brandKey].length) {
            this.brandList[brandKey].forEach(item => {
              if (item.flag == true) {
                this.seletBrand.push(item)
              }
            })
          }
        }
        this.$emit('closeEvent', this.seletBrand)
      },
      brandClick(pk, ci) {
        const brandList = cloneDeep(this.brandList)
        for (const brandKey in brandList) {//遍历json对象的每个key/value对,p为key
          if (brandKey == pk) {
            let parentItem = brandList[brandKey]
            parentItem = parentItem.map((item, index) => {
              if (ci == index) {
                item.flag = !item.flag
              }
              return item
            })
            this.$set(brandList, brandKey, parentItem)
          }
        }
        this.brandList = cloneDeep(brandList)
      },
      // 查询品牌列表
      getAppProFeatureList(featureValue) {
        this.$Loading.open();
        this.$http
          .post('/app/json/product/getAppProFeatureList', {
            categoryId: this.category
          })
          .then(res => {
            this.brandList = {};
            let data = res.data
            if (data.status == 0) {
              this.list = data.data.brandList[0].brandList
              this.list.forEach(item => {
                item.flag = false
              })
              if (this.selectBrandList.length) {
                this.list.forEach(item => {
                  this.selectBrandList.forEach(item2 => {
                    if (item.id == item2.id) {
                      item.flag = item2.flag
                    }
                  })
                })
              }
              if (!featureValue) {
                this.dealwithBrand(this.list)
              } else {
                this.brandList['#'] = [];
                this.brandList['#'].push(...this.list)
              }
            } else {
              this.$Toast(data.info)
            }

            this.$Loading.close();
          })
          .catch(err => {
            this.$Loading.close();
          })
      },
      // 处理热推列表数据
      dealwithBrand(list) {
        let otherItem = [];
        this.indexList.forEach(item => {
          this.brandList[item] = [];
        })
        if (list instanceof Array && list.length > 0) {
          list.forEach(item => {
            if (item.fistrName) {
              if (this.brandList[item.fistrName.toUpperCase()]) {
                this.brandList[item.fistrName.toUpperCase()].push(item);
              }
            } else {
              otherItem.push(item);
            }
          })
        }
        this.brandList['#'] = otherItem;
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';

  .reset-index-bar-style {
    /deep/ .van-index-bar__index {
      transition all .05s linear;

      &.van-index-bar__index--active {
        transform scale(1.5) translateX(-2px)
      }
    }
  }

  .container {
    display: flex;
    flex-direction: column;

    &.no-top-nav {
      top 0 !important;
    }
  }

  .brand-list {
    flex: 1;
    position: relative;
    margin-top: 10px;

    /deep/ .van-index-bar {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      overflow: auto;

      .van-index-bar__sidebar {
        top: 50%;
      }
    }

    .reset-anchor {
      background-color #f7f7f7;
      position relative;

      .text {
        font-weight 700;

        &::after {
          content '';
          display block;
          width 4px;
          height 100%;
          background-color #cf000e
          position absolute;
          left 0
          top 0;
        }
      }
    }

    /deep/ .no-result {
      color #ccc;
    }
  }

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

      .phone-bill {
        font-size: 16px
        text-align right
        margin-right: 10px
      }
    }
  }

  other-div {
    overflow hidden;
    height 100%;
  }

  /deep/ .van-icon-success {
    color: #F90000
  }

  .special {
    justify-content end !important

    .icon {
      padding-right: 5px !important
    }
  }
</style>
