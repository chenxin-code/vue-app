<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" v-if="hasBack"></nav-top>
    <nav-content class="container" :class="{'no-top-nav': !hasBack}">
      <div class="swiper-container">
        <!-- 顶部轮播 -->
        <swiper
          ref="mySwiper"
          :options="swiperOptions"
          class="my-swiper"
          v-if="swiperList.length > 0">
          <swiper-slide class="item" v-for="(item, index) in swiperList" :key="index">
            <img :src="item.hotMainUrl" alt @click="brandClick(item)"/>
          </swiper-slide>
          <div class="sliding-prompt">
            <span class="icon">→</span>
            <p class="text">左滑查看更多</p>
          </div>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <!-- 搜索框 -->
      <div class="search-container">
        <p class="label">找大牌</p>
        <van-search
          class="search-input"
          v-model="searchValue"
          left-icon
          right-icon="search"
          placeholder="请输入内容"
          @search="searchHandler"
          @clear="clearHandler"
        ></van-search>
      </div>
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
              <van-cell
                v-for="item in value"
                :key="item.id"
                @click="brandClick(item)"
                :title="item.featureValue"
              />
            </div>
            <div v-else>
              <van-cell title="品牌入驻中~" class="no-result"/>
            </div>
          </div>
        </van-index-bar>
      </div>
    </nav-content>
  </div>
</template>
<script>
import "@/common/stylus/swiper-1036.styl"
export default {
  props: {
    hasBack: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      searchValue: '',
      indexList: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'],
      swiperList: [],
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        on: {
          touchEnd: this.touchEnd
        }
      },
      brandList: {}
    }
  },
  computed: {
    mySwiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted() {
    this.getHotBrand()
    this.getHotBrandTopList()
  },
  methods: {
    // 查询热推品牌
    getHotBrandTopList() {
      this.$Loading.open();
      this.$http
        .post('/app/json/app_brand/getHotBrandList', {
          isHot: 1,
          page: 1,
          rows: 5
        })
        .then(res => {
          let data = res.data
          if (data.status == 0) {
            this.swiperList = data.data || []
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close();
        })
        .catch(err => {
          this.$Toast(`getHotBrandList err ${err}`)
          this.$Loading.close();
        })
    },
    // 查询品牌列表
    getHotBrand(featureValue) {
      this.$Loading.open();
      this.$http
        .post('/app/json/app_brand/getHotBrandList', {
          featureValue,
          page: 1,
          rows: 1000
        })
        .then(res => {
          this.brandList = {};
          let data = res.data
          if (data.status == 0) {
            if (!featureValue) {
              this.dealwithBrand(data.data)
            } else {
              this.brandList['#'] = [];
              this.brandList['#'].push(...data.data)
            }
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close();
        })
        .catch(err => {
          this.$Toast(`getHotBrandList err ${err}`)
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
          if (item.firstName) {
            if (this.brandList[item.firstName.toUpperCase()]) {
              this.brandList[item.firstName.toUpperCase()].push(item);
            }
          } else {
            otherItem.push(item);
          }
        })
      }
      this.brandList['#'] = otherItem;
    },
    // 轮播图滑动查看更多
    touchEnd(event) {
      if (this.mySwiper.isEnd) {
        // 是最后一个slider
        if (this.mySwiper.touches.diff < -150) {
          this.$router.push({
            path: 'brand_hot_list'
          })
        }
      }
    },
    // 品牌点击
    brandClick(brand) {
      this.$router.push({
        path: 'brand_prod_list',
        query: {
          brandId: brand.id,
        }
      })
    },
    // 搜索
    searchHandler(value) {
      if (value !== '') {
        this.getHotBrand(value);
      } else {
        this.getHotBrand();
      }
    },
    // 清除
    clearHandler() {
      this.getHotBrand();
    },
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

.swiper-container {
  width 100%;
}

.my-swiper {
  .item {
    width 100%;
    img {
      display: block;
      width: 100%;
      height: 130px;
    }
  }

  .sliding-prompt {
    display: flex;
    align-items: center;

    .icon {
      display: block;
      font-size: 18px;
      padding: 0 5px;
      transform: rotate(180deg);
    }

    .text {
      font-size: 14px;
      color: #353535;
    }
  }
}

.search-container {
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-top: 25px;

  .label {
    font-size: 14px;
  }

  .search-input {
    flex: 1;
    padding: 0;
    padding-left: 10px;

    .van-search__content {
      .van-cell {
        font-size: 13px;
        padding: 3px 10px 3px 0;
      }

      background-color: #f6f6f6;
    }
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
</style>
