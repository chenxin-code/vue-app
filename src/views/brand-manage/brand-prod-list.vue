<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <!-- 品牌信息 -->
      <div class="brand-c">
        <img src="./images/prod-bg.png" alt class="brand-bg" />
        <div class="content">
          <div class="brand-info">
            <img
              v-if="brandInfo.logo"
              :src="brandInfo.logo"
              alt
              class="logo"
            />
            <div class="right">
              <p class="brand-name">{{ brandInfo.featureValue }}</p>
              <div class="prod-info">
                <img src="./images/icon-buy.png" alt class="icon-prod-num" />
                <span class="num">{{ totalProd }}</span>
              </div>
            </div>
          </div>
          <div class="brand-description">
            <div
              class="text-c"
              ref="textC"
              :class="{'is-down': isDrowdown}"
              v-html="escape2Html(brandInfo.description)"
              v-if="brandInfo.description"
            ></div>
            <div class="text-c" v-else>暂无说明~</div>
            <img
              src="./images/icon-drow.png"
              alt
              class="drow-btn"
              :class="{'is-down': isDrowdown}"
              @click="drowBtnEvent"
            />
          </div>
          <div class="collect-btn" @click="toggleSave" :class="{'is-save': brandInfo.isCollected !== 0}">{{ brandInfo.isCollected === 0 ? '收藏' : '已收藏' }}</div>
        </div>
      </div>
      <!-- 商品列表 -->
      <div class="prod-list">
        <div class="filter-container">
          <div
            class="change-show-type-btn"
            @click="listStyleEvent">
            <i class="iconfont mall-datubiao theme_font_common" v-if="listStyle == 1"></i>
            <i class="iconfont mall-qiehuan theme_font_common" v-if="listStyle == 2"></i>
          </div>
          <div class="row">
            <div class="filter-btn theme_font_black" @click="filterEvent(0)">
              <span :class="{theme_standard_font_i: filterType == 0}">综合</span>
            </div>
            <div class="filter-btn theme_font_black" @click="filterEvent(1)">
              <span :class="{theme_standard_font_i: filterType == 1 || filterType == 2}">销量</span>
            </div>
            <div class="filter-btn theme_font_black" @click="filterEvent(2)">
              <span :class="{theme_standard_font_i: filterType == 3 || filterType == 4}">价格</span>
              <div v-show="filterType == 3 || filterType == 4">
                <i class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
                    :class="{theme_standard_font_i: filterType == 3}"></i>
                <i class="iconfont mall-xiala arrow-icon theme_font_tint"
                    :class="{theme_standard_font_i: filterType == 4}"></i>
              </div>
            </div>
            <div class="filter-btn theme_font_black" @click="superFilter">
              <span>筛选</span>
              <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
            </div>
          </div>
        </div>
        <div class="list-content">
          <div class="list-pull-to" ref="scrollContainer">
            <van-list
              v-model="isLoading"
              :finished="finished"
              finished-text="没有更多了"
              :offset="200"
              @load="_loadProList">
              <CardList
                @productEvent="productEvent"
                @addToCart="addToCart"
                :listData="listData"
                v-if="listData.length > 0 && listStyle == 1"></CardList>
              <DetailList
                @productEvent="productEvent"
                @addToCart="addToCart"
                :listData="listData"
                v-if="listData.length > 0 && listStyle == 2"></DetailList>
            </van-list>
          </div>
          <div class="no-list" v-if="isNoList">
            <div class="img-div">
              <img src="static/image/mall2/no-data-img.png">
            </div>
            <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
          </div>
        </div>
      </div>
    </nav-content>
    <Filtrate
      @filtrateEvent="filtrateEvent"
      @closeEvent="filtrateCloseEvent"
      category=""
      v-show="showFiltrate"></Filtrate>
  </div>
</template>
<script>
import CardList from '../../components/mall2/list/base/card-list'
import DetailList from '../../components/mall2/list/base/detail-list'
import Filtrate from '../../components/mall2/list/filtrate/index'
export default {
  components: {
    Filtrate,
    CardList,
    DetailList,
  },
  data() {
    return {
      isDrowdown: false,
      brandInfo: {},
      filterType: 0,
      listData: [],
      isNoList: false,
      listStyle: 1,
      queryPage: 0,
      showFiltrate: false,
      filterFeatureies: [],
      maxPrice: '',
      minPrice: '',
      totalProd: 0,

      isLoading: true,
      finished: false,
      scrollPosition: 0,
    }
  },
  watch: {
  },
  activated() {
    this.$refs.scrollContainer.scrollTop = this.scrollPosition
  },
  mounted() {
    this.getBrandDetail();
    this._loadProList();

    this.$nextTick(() => {
      this.$refs.scrollContainer.addEventListener('scroll', (e) => {
        this.scrollPosition = this.$refs.scrollContainer.scrollTop
      })
    })
  },
  methods: {
    drowBtnEvent: function () {
      this.isDrowdown = !this.isDrowdown
      if (this.$refs.textC) {
        this.$refs.textC.scrollTop = 0
      }
    },
    getBrandDetail() {
      this.$Loading.open();
      this.$http.post('/app/json/app_brand/getBrandDetailById', {
        id: this.$route.query.brandId
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.brandInfo = data.data || {};
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`getBrandDetailById err ${err}`);
        this.$Loading.close();
      })
    },
    escape2Html(str) {
      try {
        str = decodeURIComponent(str)
      }
      catch(e){
        console.error(e)
      }
     var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
     return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
    },
    // 切换收藏
    toggleSave() {
      console.log(this.brandInfo);
      this.$Loading.open();
      this.$http.post('/app/json/user_pro_collect/addOrCancelUserProCollect', {
        collectType: 3,
        brandId: this.$route.query.brandId,
        brandName: this.brandInfo.featureValue,
        logoUrl: this.brandInfo.logo
      }).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            if (this.brandInfo.isCollected == 0) {
              this.$Toast('收藏成功');
            } else {
              this.$Toast('已取消收藏');
            }
            this.getBrandDetail();
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
        },
        error => {
          this.$Toast('请求数据失败！')
          this.$Loading.close();
        }
      );
    },
    filterEvent(type) {
      if (type == 0) {
        // 综合排序
        this.filterType = 0
      } else if (type == 1) {
        // 销量 点一下降序 点一下取消
        if (this.filterType == 2) {
          this.filterType = 0
        } else {
          this.filterType = 2
        }
      } else if (type == 2) {
        // 价格
        if (this.filterType == 3) {
          this.filterType = 4
        } else {
          this.filterType = 3
        }
      }
      this.queryPage = 0;
      this.listData = [];
      this.isLoading = true,
      this.finished = false,
      this._loadProList()
    },
    superFilter() {
      this.showFiltrate = true
    },
    _loadProList() {
      this.isLoading = true;
      this.$Loading.open();
      this.queryPage++;
      let paramsData = {
        brandIds: [this.$route.query.brandId],
        deliverType: 2,
        rows: 20,
        featureIds: this.filterFeatureies,
        // 价格筛选
        maxPrice: this.maxPrice,
        minPrice: this.minPrice,
        page: this.queryPage
      }
      if (this.filterType == 1) {
        // 销量 升序
        paramsData.orderByKey = '1'
        paramsData.ascOrDesc = '0'
      } else if (this.filterType == 2) {
        // 销量 降序
        paramsData.orderByKey = '1'
        paramsData.ascOrDesc = '1'
      } else if (this.filterType == 3) {
        // 价格 降序
        paramsData.orderByKey = '0'
        paramsData.ascOrDesc = '0'
      } else if (this.filterType == 4) {
        // 价格 升序
        paramsData.orderByKey = '0'
        paramsData.ascOrDesc = '1'
      }
      this.$http.post('/app/json/product/getAppProSearchList', paramsData).then(res => {
        this.isLoading = false;
        let data = res.data;
        if (data.status == 0) {
          this.listData.push(...data.data.list);
          if (this.totalProd === 0) {
            this.totalProd = data.data.page.count || 0
          }
          if (data.data.page.count <= this.listData.length) {
            this.finished = true;
          }
        } else {
          this.$Toast(data.info);
          this.isNoList = true;
          this.finished = true;
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`getAppProSearchList err ${err}`);
        this.$Loading.close();
        this.isNoList = true;
        this.finished = true;
        this.isLoading = false;
      })
    },
    listStyleEvent() {
      this.listStyle = (this.listStyle ==  1) ? 2 : 1;
    },
    productEvent(product) {
      let path = '/mall2/detail/' + this.$util.getDataString()
      if (product.productType == 2) {
        path = '/mall2/ticketdetail';
      } 
      this.$router.push({
        path: path,
        query: {
          lastPath: this.$route.path,
          id: product.id,
          skuId: product.skuId,
          productType: product.productType,
          activityId: product.activityId,
          skuCode: product.skuCode, // 商品编码
          storeOuCode: product.storeOuCode, // 店铺编码
        }
      })
    },
    addToCart(item) {
      this.$Loading.open();
      let url = '/app/json/app_cart/addCart';
      let paramsData = {
        carts: [{
          skuId: item.skuId,
          storeOuCode: item.storeOuCode,
          selfActivityId: item.activityId,
          deliveryType: 2,
          number: 1,
        }],
        deliveryType: 2
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.cartNum = data.data;
            this.$Toast("添加购物车成功！")
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        }
      );
    },
    filtrateEvent(filtrateData) {
      this.showFiltrate = false
      this.filterFeatureies = []
      for (let i = 0; i < filtrateData.featureies.length; i++) {
        this.filterFeatureies.push({
          id: filtrateData.featureies[i].id,
          featureType: filtrateData.featureies[i].featureType,
        })
      }
      this.maxPrice = filtrateData.maxPrice;
      this.minPrice = filtrateData.minPrice;

      this.queryPage = 0;
      this.listData = [];
      this.isLoading = true,
      this.finished = false,
      this._loadProList()
    },
    filtrateCloseEvent() {
      this.showFiltrate = false
    },
  },
  beforeRouteLeave(to, from, next) {
    console.log(to.path.indexOf('/mall2/detail') == -1)
    if (to.path.indexOf('/mall2/detail') == -1 && to.path != '/mall2/ticketdetail') {
      this.$keepaliveHelper.deleteCache(this)
    }
    next()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.container {
  display flex;
  flex-direction column;
  .brand-c {
    .brand-bg {
      display: block;
      width: 100%;
    }

    .content {
      background-color: #fff;
      position: relative;
      margin: -70px 10px 0;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 0 5px #ddd;

      .brand-info {
        display: flex;
        align-items: center;

        .logo {
          display: block;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .brand-name {
            font-size: 16px;
            font-weight: 500;
            padding-right: 45px;
            ellipse();
            width 240px;
          }

          .prod-info {
            display: flex;
            align-items: center;
            margin-top: 10px;

            .icon-prod-num {
              display: inline-block;
              width: 12px;
            }

            .num {
              font-size: 12px;
              padding-left: 5px;
            }
          }
        }
      }

      .brand-description {
        display: flex;
        margin-top: 15px;

        .text-c {
          flex: 1;
          font-size: 14px;
          line-height: 18px;
          color: #333;
          // ellipse()
          height: 19px;
          max-height 100px;
          overflow: hidden;

          &.is-down {
            // text-overflow: clip
            // overflow: auto;
            // white-space: break-spaces
            height: auto;
            overflow: auto;
          }
        }

        .drow-btn {
          display: block;
          width: 18px;
          height: 18px;
          margin-left: 8px;
          extend-click();

          &.is-down {
            transform: rotate(180deg);
          }
        }
      }

      .collect-btn {
        font-size: 12px;
        color: #fff;
        background-color: #cf000e;
        // height: 22px;
        // line-height: 20px;
        line-height 1;
        padding: 6px 10px 4px;
        border-radius: 10px;
        position: absolute;
        right: 10px;
        top: 10px;
        &.is-save {
          background-color $color-background
        }
      }
    }
  }
  .prod-list {
    flex 1;
    display flex;
    flex-direction column;
    .filter-container {
      display flex;
      align-items center;
      .change-show-type-btn {
        margin-left 10px;
        .iconfont {
          font-size 24px;
        }
      }
      .row {
        flex 1;
        padding 5px 15px;
        display flex;
        justify-content space-between;

        .type-btn {
          font-size $font-size-medium
          padding 4px 10px;

          &.type-btn:before {
            border-color transparent
          }

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

        &.row-channel {
          display: flex;
          overflow-x: auto;
          justify-content: space-between;
          align-items center;

          .channel-btn {
            padding 6px 0px 4px;
            padding-right 20px;

            .text {
              text-align: center;
              white-space: nowrap;
              padding-bottom 6px
              position relative;

              &.active {
                color #f80f16;
              }

              &.active::before {
                content: "";
                display: block;
                clear: both;
                background-color #f80f16;
                position: absolute;
                left: 0;
                right 0;
                bottom: 0;
                height 2px;
              }
            }
          }
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
    }
    .list-content {
      background-color #f6f6f6
      flex 1;
      overflow hidden;
      position: relative;

      .list-pull-to {
        position: absolute;
        top: 5px;
        left: 0;
        right: 0;
        bottom: 5px;
        overflow-y auto;
      }

      .no-list {
        position absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x hidden;
        overflow-y auto;
        -webkit-overflow-scrolling touch;

        .img-div {
          margin-top 20px;
          text-align center;

          img {
            width 160px;
          }
        }

        .tip {
          margin-top 10px;
          padding 10px;
          font-size 12px;
          text-align center;
        }
      }
    }
  }
}
</style>
