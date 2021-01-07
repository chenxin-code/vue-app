/**Created by liaoyingchao on 2018/11/9.*/

<template>
  <div class="index mall2">
    <nav-top @backEvent="turnback"></nav-top>
    <nav-content>
      <div class="search">
        <div class="graybg theme_bg_white_ef">
          <i class="iconfont mall-sousuo theme_font_tint" @click="sraechClick"></i>
          <form class="search-input" action="" id="form1">
            <input style="display: none" type="text" name="keyword" />
            <input class="search-input" type="search"
                   placeholder="输入您想查找的商品名称" @keyup.enter="sraechClick" v-model="searchStr">
          </form>
        </div>
      </div>
      <div class="tabs">
        <div class="tab-item" v-for="item in tabs" @click="tabEvent(item.tag)">
          <div class="text theme_font_black" :class="{theme_font_red_i: tabSelected == item.tag}">{{item.text}}</div>
          <div class="line" :class="{theme_bg_red_i: tabSelected == item.tag}"></div>
        </div>
      </div>
      <div class="scroll-div">
        <pull-to
          ref="servicelistscrl" :isBottomAutoS="true"
          :isBottomBounce="isCanLoadMore"
          :bottom-load-method="loadMore">
          <div v-if="tabSelected == '1'">
            <div class="block-div" v-for="order in currentList">
              <div class="flex-row">
                <div class="full theme_font_common"><i class="iconfont mall-dianpu theme_font_red"></i> {{order.storeName}}</div>
              </div>
              <div class="pro-row" v-for="item in order.repairList">
                <div class="img-div">
                  <img :src="item.phPictureUrl">
                </div>
                <div class="info-div">
                  <div class="double-title theme_font_common double-line">{{item.skuName}}</div>
                  <div class="shenqing-btn theme_font_gray" v-if="tabSelected ==1" @click="applyOrdetail(item)">申请售后</div>
                  <div class="font-small theme_font_gray top-margin">数量：{{item.number}}</div>
                </div>
              </div>
              <!--<div class="flex-row flex-row-smallbottom">-->
                <!--<div class="theme_font_red" v-show="tabSelected !=1">{{getStateTitle(order)}}</div>-->
                <!--<div class="full"></div>-->
                <!--<div class="row-btn theme_font_tint" :class="{'theme_font_red theme_border_red' :order.state==2}" v-show="tabSelected ==2 && getLeftBtnTitle(order).length"-->
                     <!--@click="cancelapply(order)">{{getLeftBtnTitle(order)}}-->
                <!--</div>-->
                <!--<div class="row-btn theme_font_red theme_border_red" @click="applyOrdetail(order)">-->
                  <!--{{getRightBtnTitle(order)}}-->
                <!--</div>-->
              <!--</div>-->
            </div>
          </div>
          <div v-if="tabSelected != '1'">
            <div class="block-div" v-for="order in currentList">
              <div class="flex-row">
                <div class="font-small full theme_font_gray">服务单号：{{order.id}}</div>
                <div class="font-small theme_font_gray">{{getTypeTile(order)}}</div>
              </div>
              <div v-if="order.ordRepairItems.length>0">
                <div class="pro-row"  v-for="(item,index) in order.ordRepairItems">
                  <div class="img-div">
                    <img :src="item.phPictureUrl">
                  </div>
                  <div class="info-div">
                    <div class="title theme_font_common">{{item.skuName}}</div>
                    <div class="font-small theme_font_gray top-margin">数量：{{item.number}}</div>
                  </div>
                </div>
              </div>

              <div class="pro-row" v-else>
                <div class="img-div">
                  <img :src="order.phPictureUrl">
                </div>
                <div class="info-div">
                  <div class="title theme_font_common">{{order.skuName}}</div>
                  <div class="font-small theme_font_gray top-margin">数量：{{order.number}}</div>
                </div>
              </div>
              <div class="flex-row flex-row-smallbottom">
                <div class="theme_font_red" v-show="tabSelected !=1">{{getStateTitle(order)}}</div>
                <div class="full"></div>
                <div class="row-btn theme_font_gray" v-show="tabSelected ==2 && getLeftBtnTitle(order).length"
                     @click="cancelapply(order)">{{getLeftBtnTitle(order)}}
                </div>
                <div class="row-btn theme_font_gray" @click="applyOrdetail(order)">
                  {{getRightBtnTitle(order)}}
                </div>
              </div>
            </div>
          </div>
        </pull-to>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Receipt from '../common/receipt-pop'
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'

  export default {
    name: "index",
    components: {
      Receipt,
      PullTo
    },
    data() {
      return {
        tabs: [{
          text: '售后申请',
          tag: '1'
        }, {
          text: '处理中',
          tag: '2'
        }, {
          text: '申请记录',
          tag: '3'
        }],
        tabSelected: '1',
        aftersalesList: [],
        processingOrderList: [],
        recordList: [],
        currentList: [],
        typeTile: '',
        stateTitle: '',
        isShowLeftBtn: false,
        scrollValue:0,
        searchStr: '',
        loading: true,
        showLoading: false,
        noMore: false,
        pageIndex: 0,
        isCanLoadMore: true,
        lastPath: ''
      }
    },
    methods: {
      loadMore: function (loaded) {
        this.loading = true
        this.showLoading = true
        this._getServiceList(this.tabSelected, loaded)
      },
      sraechClick: function () {
        this.pageIndex = 0
        this._getServiceList(this.tabSelected, null);
      },
      tabEvent: function (tag) {
        this.tabSelected = tag
        this.pageIndex = 0
        this.isCanLoadMore = true
        this._getServiceList(tag, null)
      },
      _getServiceList: function (index, loaded) {//获取售后列表
        let url = '';
        let page = this.pageIndex + 1;
        if (index == 1) {
          url = '/app/json/app_order_after_sale/queryAfterOrder';
        } else if (index == 2) {
          url = '/app/json/app_order_after_sale/queryProcessingOrder';
        } else if (index == 3) {
          url = '/app/json/app_order_after_sale/queryCompletedOrder';
        }
        if (page == 1) {
          this.currentList = [];
          this.$Loading.open();
        }
        let params1 = {
          token: this.$store.state.login.token,
          skuName: this.searchStr,
          page: {
            index: page,
            pageSize: 10
          }
        }

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          if (loaded) {
            loaded('done')
          }
          let data = res.data;
          console.log('售后:', data);
          if (data.status == 0) {
            this.pageIndex ++
            this.loading = false
            this.showLoading = true
            let arr = data.data;
            if (arr.length) {
              if (page == 1) {
                this.currentList = arr;
              } else {
                this.currentList = this.currentList.concat(arr);
              }
            }
            if (arr.length < 10) {
              this.isCanLoadMore = false
              // this.loading = true
              // this.showLoading = false
              // if (page != 1) {
              //   this.noMore = true
              // }
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          if (loaded) {
            loaded('done')
          }
          this.$Toast('获取数据失败')
        });
      },
      cancelapply: function (order) {//取消申请 or 再次申请
        if (order.state == 10) {//再次申请
          this.$router.replace({
            path: '/mall2/choosesertype',
            query: {
              id: this.orderInfo.id,
              reApply: '1'
            }
          });
        }else if (order.state == 2){//重写快递单号 进入returning界面提交快递单号
          this.$router.push({
            path: '/mall2/returninggoods',
            query: {
              id: order.id,
            }
          });
        }else {
          this._cancelapplyOrder(order);//取消申请
        }
      },
      _cancelapplyOrder:function(order){//取消申请
        this.$Loading.open();
        let url = '/app/json/app_order_after_sale/updateAfterStatus';
        let params1 = {
          token: this.$store.state.login.token,
          id: order.id,
          state:'9'//取消
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          console.log('订单取消:', data);
          if (data.status == 0) {
            this.$Toast('取消订单成功')
            this.pageIndex = 0
            this._getServiceList(this.tabSelected, null);
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('订单取消失败')
        });
      },
      applyOrdetail: function (order) {//申请or查看详情or 退货、换货、维修
        let path = '';
        if (this.tabSelected == 1) {
          this.$Loading.open();
          this.$http.post('/app/json/app_order_after_sale/AfterSalesType', {
            id: order.id,
            afterType: 0
          }).then(res => {
            let data = res.data;
            if (data.status == 0) {
              if (data.data.interfaceType == '1' && this.$store.state.globalConfig.uroad_pro_after_sale_prompt == '1') {
                this.$MessageBox.alert('请在商城我的页面客服反馈京东商品售后问题。', '提示').then(action => {});
                return ;
              }
              if (data.data.productType == 5 && data.data.returnFlag == 1) { // 券商品并且支持退款
                this.$router.push({
                  path: '/mall2/virtualgoods',
                  query: {
                    id: order.id,
                    mainOrderId: order.mainOrderId,
                    skuId: order.skuId
                  }
                });
              } else {
                this.$router.push({
                  path: '/mall2/choosesertype',
                  query: {
                    id: order.id,
                  }
                });
              }
            } else {
              this.$Toast(data.info);
            }
            this.$Loading.close();
          }).catch(err => {
            this.$Toast(`AfterSalesType err ${err}`);
            this.$Loading.close();
          })
        } else if (this.tabSelected == 3) {
          path = '/mall2/detailservice';//
        } else if (this.tabSelected == 2) {
          if (order.state == 1) {
            //只有在 0退货  1换货  还有返厂维修时才跳returninggoods
            if(order.type == 0 || order.type == 1){
              path = '/mall2/returninggoods';
            }else if(order.type == 2){
              if (order.repairType == 1) {// 0上门  1返厂
                path = '/mall2/returninggoods';
              }else {
                path = '/mall2/detailservice';
              }
            }else {
              path = '/mall2/detailservice';
            }

          } else {
            path = '/mall2/detailservice';
          }
        }
        this.$router.push({
          path: path,
          query: {
            id: order.id,
          }
        });
      },
      getTypeTile: function (order) {
        let str = '';
        if (order.type == 0) {
          str = '退货';
        } else if (order.type == 1) {
          str = '换货';
        } else if (order.type == 2) {
          str = '维修';
        } else if (order.type == 3) {
          str = '补货';
        }//stateTitle
        return str;
      },
      getStateTitle: function (order) {
        let title = '';
        if (order.state == 0) {
          title = '商家审核中';
        } else if (order.state == 1) {
          title = '审核通过';
        } else if (order.state == 2) {
          title = '客户已发货';
        } else if (order.state == 3) {
          title = '等待商家处理';
        } else if (order.state == 4) {
          title = '商家已发货';
        } else if (order.state == 5) {
          title = '已退款';
        } else if (order.state == 6) {
          title = '商家上门维修';
        } else if (order.state == 7) {
          title = '客户已确认';
        } else if (order.state == 8) {
          title = '已完成';
        } else if (order.state == 9) {
          title = '已取消';
        } else if (order.state == 10) {
          title = '审核未通过';
        } else if (order.state == 11) {
          title = '已关闭';
        } else if (order.state == 12) {
          title = '退款中';
        }
        return title;
      },
      getLeftBtnTitle: function (order) {
        let str = '';
        if (order.state == 0 || order.state == 1 && order.productType != 5) {//左边按钮 显示去取消申请
          str = '取消申请';
        } else if (order.state == 10) {
          str = '再次申请';
        } else if (order.state == 2) {//显示填写快递单，然后进入returning界面提交快递单号
          str = '填写快递单';
          if (order.interfaceType == 2) {
            str = ''
          }
        }
        return str;
      },
      getRightBtnTitle: function (order) {
        let str = '';
        if (this.tabSelected == 1) {
          str = '申请售后';
        } else if (this.tabSelected == 2) {
          if (order.state == 1) {//右边按钮 显示去取消申请
            if (order.type == 0) {
              // str = '退货';
              str = '填写快递单';
              if (order.interfaceType == 2) {
                str = ''
              }
            } else if (order.type == 1) {
              // str = '换货';
              str = '填写快递单';
              if (order.interfaceType == 2) {
                str = ''
              }
            } else if (order.type == 2) {//返厂维修时显示维修
              // str = '维修';
              str = '填写快递单';
              if (order.interfaceType == 2) {
                str = ''
              }
            } else {
              str = '查看详情';
            }
          } else {
            str = '查看详情';
          }
        } else {
          str = '查看详情';
        }
        return str;
      },
      turnback:function () {//返回
        this.$router.go(-1);
      },
    },
    created() {
      this.lastPath = this.$route.query.lastPath
    },
    activated () {
      this.$refs.servicelistscrl.scrollTop = this.scrollValue
      this.pageIndex = 0
      this._getServiceList(this.tabSelected, null);//请求售后列表
    },
    beforeRouteLeave (to, from, next) {
      if (this.lastPath == to.path) {
        this.$keepaliveHelper.deleteCache(this)
      } else {
        this.scrollValue = this.$refs.servicelistscrl.scrollTop
      }
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .index {
    width 100%
    height 100%
    overflow hidden
    .search{
      /*position absolute*/
      left 0px
      width 100%
      padding 10px 10px
      .graybg{
        height 30px
        border-radius:20px;
        -webkit-border-radius:20px;
        display flex
        align-items center
        overflow hidden
        //background-color rgb(239,239,239)
        //.sraech-btn{
        //margin-left 20px
        // width 40px
        //height 40px
        //}
        i{
          margin-left 5px;
          padding 7px;
          font-size 16px
        }
        .search-input{
          flex 1
          padding-right 8px;
          height 100%;
          input {
            background none
            border none
            height 100%;
            font-size $font-size-medium
            width 100%;
          }
        }
      }
    }
    .scroll-div {
      position absolute;
      left 0px;
      right 0px;
      top 85px;
      bottom 0px;
      overflow hidden
      .double-title {
        font-size $font-size-medium;
        line-height 18px;
        height 36px;
        margin-bottom 5px;
      }
      .show-loading {
        text-align center;
        font-size 14px;
        padding 10px;
      }
      .top-margin {
        margin-top 8px;
      }
      .block-div:nth-child(1) {
        margin-top 4px;
      }
      .shenqing-btn {
        margin-top 6px;
        line-height $font-size-medium;
        font-size $font-size-medium;
        padding 6px 8px;
        border-radius 16px;
        border-width 0.5px
        border-style solid
        float right;
      }
      -webkit-overflow-scrolling touch
      .img-div {
        width 70px;
        height 70px;
      }
    }
  }
  .mall2 .block-div .pro-row{
    /*align-items flex-start*/
  }
  .mall2 .block-div .pro-row .info-div{
//    bdr-b()
    /*padding-bottom:10px;*/
  }
</style>
