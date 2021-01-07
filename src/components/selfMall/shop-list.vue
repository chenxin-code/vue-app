<template>
  <div class="shop-list-container">
    <nav-top title="自提商城" @backEvent="backEvent" />
    <nav-content>
      <div class="search-box" @click="searchShop">
        <i class="iconfont mall-sousuo theme_font_tint"></i>
        <div class="search-placeholder">请输入店铺或商品名称</div>
      </div>
      <pull-to
        ref="listContent"
        :bottomConfig="{pullText: '', triggerText: '释放更新', loadingText: '加载中...', doneText: isCanLoadMore?'加载完成':'没有更多数据了', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
        :isBottomAutoS="true"
        :bottom-load-method="_loadProList"
        :isBottomBounce="isCanLoadMore"
        >
        <div class="shop-group">
          <div class="shop-list" v-for="key in 10">
            <div class="shop-logo"><img src="" alt=""></div>
            <div class="shop-detail-info">
              <div class="shop-name">麦当劳(北七家店)</div>
              <div class="shop-address">北京市朝阳区朝阳街道3号</div>
            </div>
            <div class="shop-status-info">
              <div class="shop-location"><i class="icon"></i><span>2.6KM</span></div>
              <div class="shop-status">营业中</div>
            </div>
          </div>
        </div>
      </pull-to>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'

  export default {
    name: 'SelfMallShopList',
    components:{
      PullTo,
    },
    data() {
      return {
        nowPage: 1,//分页信息
        isCanLoadMore: false,// 是否可以上拉加载更多
      }
    },
    created() {
      this._loadProList(null, true)
    },
    methods:{
      searchShop(){
        console.log('searchShop');
      },
      backEvent() {
        this.$router.go(-1)
      },
      // 获取普通商品列表
      _loadProList: function (loaded, refreshCate = false) {
        console.log('_loadProList');
        return ;
        this.isCanLoadMore = false;
        this.isNoList = false
        let page = this.nowPage + 1;
        if (this.nowPage == 0) {
          this.listData = [];
        }
        this.$Loading.open();
        let url = '/app/json/product/getAppProSearchList';
        let paramsData = {
          token: this.$store.state.login.token,
          page: page,
          rows: 20,
          orderByKey: '',
          ascOrDesc: '',
          deliverType: this.selectedType,
          categoryId: this.category,
          cateLevel: this.cateLevel,
          brandIds: this.filterBrands,
          featureIds: this.filterFeatureies,
          // 券ID，券相关列表的时候使用
          couTypeCode: this.couponId,
          // 活动ID，活动的时候使用
          activityId: this.activityId,
          // 搜索key
          proName: this.searchKey,
          // 分类类型
          clsType: this.clsType,
          // 价格筛选
          maxPrice: this.maxPrice,
          minPrice: this.minPrice,
          easyCardId: this.$route.query.easyCardId,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
        };
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

        paramsData.supportCountryDelivery = '0'

        paramsData.area = {
          provinceId: this.location.provinceId,
          cityId: this.location.cityId,
          countryId: this.location.countryId,
          townId: this.location.townId
        }
        // 店铺ID
        let storeOuCode = this.$route.query.storeOuCode;
        storeOuCode ? paramsData.storeOuCode = storeOuCode : null;
        if (this.productType && this.productType != '') {
          paramsData.productType = this.productType
        }

        if (this.categoryIdList != '') {
          paramsData.categoryIdList = this.categoryIdList
        }

        this.$http.post(url, paramsData).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            if (this.activityId) {
              this.$actionStatistics.listAction('130020', JSON.stringify(paramsData), this.activityId)
            } else {
              this.$actionStatistics.listAction('130010', JSON.stringify(paramsData), this.activityId)
            }

            if (this.nowPage != 0) {
              this.listData = this.listData.concat(data.data.list);
            } else {
              this.listData = data.data.list;
              if (this.listData.length == 0) {
                let isShow = sessionStorage.getItem('Pickup_YD_Is_Show')
                if (isShow != '1') {
                  this.pickuYD = true
                  sessionStorage.setItem('Pickup_YD_Is_Show', '1')
                } else {
                  this.isNoList = true
                }
              } else {
                this.deductionSkuId = this.listData[0].skuId
                this.storeOuCode = this.listData[0].storeOuCode
                if (refreshCate) {
                  this.$refs.All_Category.loadProCateList(this.storeOuCode)
                }
              }
              if (this.pageType != '' && this.cateList.length <= 1) {
                let cList = data.data.cateList
                this.cateList = [{
                  'name': '全部分类',
                  'id': '',
                  'childList': [{
                    'name': '全部分类',
                    'id': ''
                  }]
                }]
                for (let i = 0; i < cList.length; i++) {
                  let subArr = cList[i].childList
                  this.cateList = this.cateList.concat(subArr);
                }
              }
            }
            this.nowPage++;
            if (data.data.page.count <= this.listData.length) {
              this.isCanLoadMore = false;
            } else {
              this.isCanLoadMore = true;
            }
          } else {
            this.$Toast(data.info);
          }
          if (loaded) {
            loaded('done');
          }
        },
        error => {
          if (loaded) {
            loaded('done');
          }
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        });
      },
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .shop-list-container{
    .nav-content{
      display:flex;
      flex-direction:column;
      .search-box{
        flex-shrink:0;
        display:flex;
        justify-content:center;
        align-items:center;
        height:35px;
        box-shadow 0 0px 8px #efefef;
        border-radius:15px;
        margin:5px 10px 0;
        color:#999;
        .search-placeholder{
          margin-left:5px;
        }
      }
      .vue-pull-to-wrapper{
        flex:1;
        overflow:hidden;
        .shop-group{
          margin:0 10px;
          .shop-list{
            display:flex;
            box-shadow 0 0px 8px #efefef;
            border-radius:10px;
            padding:10px;
            margin-top:10px;
            .shop-logo{
              flex-shrink:0;
              margin-right:10px;
              img{
                display:block;
                width 80px
                height 80px
                background-color #f00;
                border-radius:10px;
                overflow:hidden;
              }
            }
            .shop-detail-info{
              flex:1;
              .shop-name{
                font-size:17px;
                margin-top:5px;
              }
              .shop-address{
                margin-top:15px;
                color:#888;
              }
            }
            .shop-status-info{
              flex-shrink:0;
              .shop-location{
                color:#666;
                padding:3px 5px;
                border:1px solid #ccc;
                border-radius:10px;
                display:flex;
                align-items:center;
                .icon{
                  width 15px
                  height 15px
                  background:url(./img/location.png) 0 0 no-repeat;
                  background-size:100% 100%;
                  margin-right:3px;
                }
              }
              .shop-status{
                text-align:right;
                color:#FA3F44;
                margin-top:10px;
              }
            }
          }
        }
      }
    }
  }
</style>

