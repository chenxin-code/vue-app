<template>
  <div class="body">
    <!--标题-->
    <navbar :title="'本团订单'"></navbar>
    <div class="header">
      <!--菜单. 如果up配置了isBounce为false,则需加上mescroll-touch-x,原因: http://www.mescroll.com/qa.html#q10 -->
      <div class="tabs-warp">
        <div ref="tabsContent" class="tabs-content mescroll-touch-x">
          <div style="display: inline-block"> <!--PC端运行,加上这个div可修复tab-bar错位的问题 -->
            <ul class="tabs" ref="tabs">
              <li class="tab" v-for="(tab,i) in tabs" :class="{active: i===curIndex}" :style="{width: tabWidth+'px'}" :key="i" @click="changeTab(i)">{{tab.name}}</li>
            </ul>
            <div class="tab-bar" :style="{width: barWidth+'px', left: barLeft}"></div>
          </div>
        </div>
      </div>
    </div>
    <!--轮播-->
    <swiper ref="mySwiper" :options="swiperOption">
      <!--首页-->
      <swiper-slide>
        <mescroll-vue ref="mescroll0" :down="getMescrollDown(0)" :up="getMescrollUp(0)" @init="mescrollInit(0,arguments)">
          <ul id="dataList0">
            <li class="data-li" v-for="pd in tabs[0].list" :key="pd.activityOrderItemNo">
              <div class="title">
                {{pd.activityOrderItemNo}}
                <span class="tabState">{{pd.stateText}}</span>
              </div>
              <div class="personal">
                <div class="headPortrait">
                  <img :src="pd.contactAvatar" />
                </div>
                <div class="name">{{pd.contactName}}</div>
                <div class="phone">{{pd.contactPhone}}</div>
                <span class="extractState" :class="pd.deliveryMode == 1 ? 'since' : 'give'">{{pd.deliveryMode == 1 ? "自提" : "配送上门"}}</span>
              </div>
              <div class="commodity">
                <ul class="commodityList">
                  <li v-for="item in pd.productSkuInfo" :key="item.id">
                    <img :src="item.groupbuySkuPicurl" />
                  </li>
                </ul>
              </div>
              <div class="total">
                <p>共计{{pd.productQuantity}}件商品，合计支付 <span>¥{{pd.totalAmount}}</span></p>
              </div>
            </li>
          </ul>
        </mescroll-vue>
      </swiper-slide>
      <!-- 奶粉 可不配down-->
      <swiper-slide>
        <mescroll-vue ref="mescroll1" :up="getMescrollUp(1)" @init="mescrollInit(1,arguments)">
          <ul id="dataList1">
            <li class="data-li" v-for="pd in tabs[1].list" :key="pd.activityOrderItemNo">
              <div class="title">
                {{pd.activityOrderItemNo}}
                <span class="tabState">{{pd.stateText}}</span>
              </div>
              <div class="personal">
                <div class="headPortrait">
                  <img :src="pd.contactAvatar" />
                </div>
                <div class="name">{{pd.contactName}}</div>
                <div class="phone">{{pd.contactPhone}}</div>
                <span class="extractState" :class="pd.deliveryMode == 1 ? 'since' : 'give'">{{pd.deliveryMode == 1 ? "自提" : "配送上门"}}</span>
              </div>
              <div class="commodity">
                <ul class="commodityList">
                  <li v-for="item in pd.productSkuInfo" :key="item.id">
                    <img :src="item.groupbuySkuPicurl" />
                  </li>
                </ul>
              </div>
              <div class="total">
                <p>共计{{pd.productQuantity}}件商品，合计支付 <span>¥{{pd.totalAmount}}</span></p>
              </div>
            </li>
          </ul>
        </mescroll-vue>
      </swiper-slide>
      <!-- 面膜-->
      <swiper-slide>
        <mescroll-vue ref="mescroll2" :up="getMescrollUp(2)" @init="mescrollInit(2,arguments)">
          <ul id="dataList2">
            <li class="data-li" v-for="pd in tabs[2].list" :key="pd.activityOrderItemNo">
              <div class="title">
                {{pd.activityOrderItemNo}}
                <span class="tabState">{{pd.stateText}}</span>
              </div>
              <div class="personal">
                <div class="headPortrait">
                  <img :src="pd.contactAvatar" />
                </div>
                <div class="name">{{pd.contactName}}</div>
                <div class="phone">{{pd.contactPhone}}</div>
                <span class="extractState" :class="pd.deliveryMode == 1 ? 'since' : 'give'">{{pd.deliveryMode == 1 ? "自提" : "配送上门"}}</span>
              </div>
              <div class="commodity">
                <ul class="commodityList">
                  <li v-for="item in pd.productSkuInfo" :key="item.id">
                    <img :src="item.groupbuySkuPicurl" />
                  </li>
                </ul>
              </div>
              <div class="total">
                <p>共计{{pd.productQuantity}}件商品，合计支付 <span>¥{{pd.totalAmount}}</span></p>
              </div>
            </li>
          </ul>
        </mescroll-vue>
      </swiper-slide>
      <!-- 图书-->
      <swiper-slide>
        <mescroll-vue ref="mescroll3" :up="getMescrollUp(3)" @init="mescrollInit(3,arguments)">
          <ul id="dataList3">
            <li class="data-li" v-for="pd in tabs[3].list" :key="pd.activityOrderItemNo">
              <div class="title">
                {{pd.activityOrderItemNo}}
                <span class="tabState">{{pd.stateText}}</span>
              </div>
              <div class="personal">
                <div class="headPortrait">
                  <img :src="pd.contactAvatar" />
                </div>
                <div class="name">{{pd.contactName}}</div>
                <div class="phone">{{pd.contactPhone}}</div>
                <span class="extractState" :class="pd.deliveryMode == 1 ? 'since' : 'give'">{{pd.deliveryMode == 1 ? "自提" : "配送上门"}}</span>
              </div>
              <div class="commodity">
                <ul class="commodityList">
                  <li v-for="item in pd.productSkuInfo" :key="item.id">
                    <img :src="item.groupbuySkuPicurl" />
                  </li>
                </ul>
              </div>
              <div class="total">
                <p>共计{{pd.productQuantity}}件商品，合计支付 <span>¥{{pd.totalAmount}}</span></p>
              </div>
            </li>
          </ul>
        </mescroll-vue>
      </swiper-slide>
      <!-- 果汁-->
      <swiper-slide>
        <mescroll-vue ref="mescroll4" :up="getMescrollUp(4)" @init="mescrollInit(4,arguments)">
          <ul id="dataList4">
            <li class="data-li" v-for="pd in tabs[4].list" :key="pd.activityOrderItemNo">
              <div class="title">
                {{pd.activityOrderItemNo}}
                <span class="tabState">{{pd.stateText}}</span>
              </div>
              <div class="personal">
                <div class="headPortrait">
                  <img :src="pd.contactAvatar" />
                </div>
                <div class="name">{{pd.contactName}}</div>
                <div class="phone">{{pd.contactPhone}}</div>
                <span class="extractState" :class="pd.deliveryMode == 1 ? 'since' : 'give'">{{pd.deliveryMode == 1 ? "自提" : "配送上门"}}</span>
              </div>
              <div class="commodity">
                <ul class="commodityList">
                  <li v-for="item in pd.productSkuInfo" :key="item.id">
                    <img :src="item.groupbuySkuPicurl" />
                  </li>
                </ul>
              </div>
              <div class="total">
                <p>共计{{pd.productQuantity}}件商品，合计支付 <span>¥{{pd.totalAmount}}</span></p>
              </div>
            </li>
          </ul>
        </mescroll-vue>
      </swiper-slide>
      <!-- 奶瓶-->
      <swiper-slide>
        <mescroll-vue ref="mescroll5" :up="getMescrollUp(5)" @init="mescrollInit(5,arguments)">
          <ul id="dataList5">
            <li class="data-li" v-for="pd in tabs[5].list" :key="pd.activityOrderItemNo">
              <div class="title">
                {{pd.activityOrderItemNo}}
                <span class="tabState">{{pd.stateText}}</span>
              </div>
              <div class="personal">
                <div class="headPortrait">
                  <img :src="pd.contactAvatar" />
                </div>
                <div class="name">{{pd.contactName}}</div>
                <div class="phone">{{pd.contactPhone}}</div>
                <span class="extractState" :class="pd.deliveryMode == 1 ? 'since' : 'give'">{{pd.deliveryMode == 1 ? "自提" : "配送上门"}}</span>
              </div>
              <div class="commodity">
                <ul class="commodityList">
                  <li v-for="item in pd.productSkuInfo" :key="item.id">
                    <img :src="item.groupbuySkuPicurl" />
                  </li>
                </ul>
              </div>
              <div class="total">
                <p>共计{{pd.productQuantity}}件商品，合计支付 <span>¥{{pd.totalAmount}}</span></p>
              </div>
            </li>
          </ul>
        </mescroll-vue>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
// 引入mescroll的vue组件
import MescrollVue from "mescroll.js/mescroll.vue";
import Qs from "qs";
// 模拟数据
// import mockData from "./pdlist";
let mockData = [];
import navbar from "@/components/bulk/components/navbar";
export default {
  name: "mescrollSwiperNav",
  data() {
    return {
      tabs: [
        { name: "全部", mescroll: null, list: [], isListInit: false },
        { name: "待发货", mescroll: null, list: [], isListInit: false },
        { name: "待配送", mescroll: null, list: [], isListInit: false },
        { name: "待提货", mescroll: null, list: [], isListInit: false },
        { name: "已完成", mescroll: null, list: [], isListInit: false },
        { name: "已关闭", mescroll: null, list: [], isListInit: false },
      ],
      tabWidth: 60, // 每个tab的宽度
      barWidth: 50, // tab底部红色线的宽度
      curIndex: 0, // 当前tab的下标
      tabScrollLeft: 0, // 菜单滚动条的位置
      swiperOption: {
        // 轮播配置
        on: {
          transitionEnd: () => {
            this.changeTab(this.swiper.activeIndex);
          },
        },
      },
    };
  },
  components: {
    navbar,
    MescrollVue, // Mescroll组件
  },
  computed: {
    swiper() {
      // 轮播对象
      return this.$refs.mySwiper.swiper;
    },
    barLeft() {
      // 红线的位置
      return (
        this.tabWidth * this.curIndex +
        (this.tabWidth - this.barWidth) / 2 +
        "px"
      );
    },
  },
  methods: {
    // 多mescroll的配置,需通过方法获取,保证每个配置是单例
    getMescrollDown(tabIndex) {
      let isAuto = tabIndex === 0; // 第一个mescroll传入true,列表自动加载
      return {
        auto: isAuto,
        callback: this.downCallback,
      };
    },
    // mescroll上拉加载的配置
    getMescrollUp(tabIndex) {
      let emptyWarpId = "dataList" + tabIndex;
      return {
        auto: false,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          warpId: emptyWarpId, // 父布局的id;
          icon: "http://www.mescroll.com/img/mescroll-empty.png", // 图标,默认null
          tip: "暂无相关数据~", // 提示
          btnClick: function () {
            // 点击按钮的回调,默认null
            alert("点击了按钮,具体逻辑自行实现");
          },
        },
        toTop: {
          // 配置回到顶部按钮
          src: "http://www.mescroll.com/img/mescroll-totop.png", // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
        },
      };
    },
    // mescroll初始化的回调
    mescrollInit(tabIndex, arg) {
      this.tabs[tabIndex].mescroll = arg[0]; // 传入mescroll对象
      this.tabs[tabIndex].mescroll.tabIndex = tabIndex; // 加入标记,便于在回调中取到对应的list
    },
    // 切换菜单
    changeTab(tabIndex) {
      if (this.curIndex === tabIndex) return; // 避免重复调用
      let curTab = this.tabs[this.curIndex]; // 当前列表
      let newTab = this.tabs[tabIndex]; // 新转换的列表
      curTab.mescroll && curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
      this.curIndex = tabIndex; // 切换菜单
      this.swiper.slideTo(tabIndex);
      // 菜单项居中动画
      if (curTab.mescroll) {
        let tabsContent = this.$refs.tabsContent;
        let tabDom = tabsContent.getElementsByClassName("tab")[tabIndex];
        let star = tabsContent.scrollLeft; // 当前位置
        let end =
          tabDom.offsetLeft +
          tabDom.clientWidth / 2 -
          document.body.clientWidth / 2; // 居中
        this.tabScrollLeft = end;
        curTab.mescroll.getStep(star, end, function (step) {
          tabsContent.scrollLeft = step; // 从当前位置逐渐移动到中间位置,默认时长300ms
        });
      }
      if (newTab.mescroll) {
        if (!newTab.isListInit) {
          // 加载列表
          newTab.mescroll.triggerDownScroll();
        } else {
          // 检查新转换的列表是否需要显示回到到顶按钮
          setTimeout(() => {
            let curScrollTop = newTab.mescroll.getScrollTop();
            if (curScrollTop >= newTab.mescroll.optUp.toTop.offset) {
              newTab.mescroll.showTopBtn();
            } else {
              newTab.mescroll.hideTopBtn();
            }
          }, 30);
        }
      }
    },
    /* 下拉刷新的回调 */
    downCallback(mescroll) {
      // 这里加载你想下拉刷新的数据, 比如刷新tab1的轮播数据
      if (mescroll.tabIndex === 0) {
        // loadSwiper();
      } else if (mescroll.tabIndex === 1) {
        // ....
      } else if (mescroll.tabIndex === 2) {
        // ....
      }
      mescroll.resetUpScroll(); // 触发下拉刷新的回调,加载第一页的数据
    },
    /* 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    upCallback(page, mescroll) {
      // if (mescroll.tabType === 0) {
      //   // 可以单独处理每个tab的请求
      // }else if (mescroll.tabType === 1) {
      //   // 可以单独处理每个tab的请求
      // }
      this.tabs[mescroll.tabIndex].isListInit = true; // 标记列表已初始化,保证列表只初始化一次
      this.getListDataFromNet(
        mescroll.tabIndex,
        page.num,
        page.size,
        (curPageData) => {
          mescroll.endSuccess(curPageData.length); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          if (page.num === 1) this.tabs[mescroll.tabIndex].list = []; // 如果是第一页需手动制空列表
          this.tabs[mescroll.tabIndex].list = this.tabs[
            mescroll.tabIndex
          ].list.concat(curPageData); // 追加新数据
        },
        () => {
          if (page.num === 1) this.tabs[mescroll.tabIndex].isListInit = false;
          mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
        }
      );
    },
    /* 联网加载列表数据
          在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
          请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
          实际项目以您服务器接口返回的数据为准,无需本地处理分页.
          * */
    getListDataFromNet(
      tabIndex,
      pageNum,
      pageSize,
      successCallback,
      errorCallback
    ) {
      // 延时一秒,模拟联网
      // setTimeout(() => {
        let tabNum = '';
        tabIndex == 0 ? tabNum = '' : tabNum = tabIndex;
        let obj = {
          groupBuyingOrderNo: 8,
          pageNum: pageNum,
          pageSize: pageSize,
          orderItemState:tabNum
        };
        this.$http
      .post(
        "/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId",
         Qs.stringify(obj)
      )
      .then((res) => {
          mockData = res.data.data.records;
            var listData = [];
            for (var i = 0; i < mockData.length; i++) {
                if(mockData[i].productSkuInfo){
                  mockData[i].productSkuInfo = JSON.parse(mockData[i].productSkuInfo);
                }
                if(mockData[i].activityOrderItemState == 1){
                  mockData[i]["stateText"] = "待发货";
                }
                else if(mockData[i].activityOrderItemState == 2){
                  mockData[i]["stateText"] = "待配送";
                }
                else if(mockData[i].activityOrderItemState == 3){
                  mockData[i]["stateText"] = "已提货";
                }
                else if(mockData[i].activityOrderItemState == 4){
                  mockData[i]["stateText"] = "已完成";
                }
                else if(mockData[i].activityOrderItemState == 5){
                  mockData[i]["stateText"] = "已关闭";
                }
                listData.push(mockData[i]);
            }
           
            // 回调
            successCallback && successCallback(listData);
          
        });
      // }, 1000);
    },
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next((vm) => {
      let curMescroll = vm.$refs["mescroll" + vm.curIndex]; // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      curMescroll && curMescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      // 恢复水平菜单的滚动条位置
      if (vm.$refs.tabsContent)
        vm.$refs.tabsContent.scrollLeft = vm.tabScrollLeft;
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    let curMescroll = this.$refs["mescroll" + this.curIndex]; // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
    curMescroll && curMescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
};
</script>

<style scoped>
/*模拟的标题*/
.body {
  background-color: #f6f6f6 !important;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.header {
  z-index: 9990;
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 16px;
  text-align: center;
  background-color: white;
}
.header .btn-left {
  position: absolute;
  top: 0;
  left: 0;
  padding: 12px 12px 0 12px;
}
.header .title {
  margin-top: 12px;
}
/*菜单*/
.tabs-warp {
  height: 42px; /*高度比tabs-content小, 目的是隐藏tabs的水平滚动条*/
  overflow-y: hidden;
  border-bottom: 1px solid #eee;
  box-sizing: content-box;
}
.tabs-warp .tabs-content {
  width: 100%;
  height: 50px;
  overflow-x: auto;
}
.tabs-warp .tabs-content .tabs {
  width: 100%;
  white-space: nowrap;
}
.tabs-warp .tabs-content .tabs li {
  display: inline-block;
  height: 40px;
  line-height: 45px;
  vertical-align: middle;
}
.tabs-warp .tabs-content .tabs .active {
  color: #C61606;
}
/*菜单进度*/
.tabs-warp .tab-bar {
  position: relative;
  height: 2px;
  background-color: #C61606;
  transition: left 300ms;
}
/*列表*/
.swiper-container {
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  bottom: 0;
}
img{ max-width: 100%;}
.data-li{ margin: 15px; padding: 15px; background-color: #fff; border-radius: 12px;}
.title{ font-size: 16px; font-weight: 500; position: relative; line-height: 25px;}
.tabState{ position: absolute; right: 0; color:#C82010;  line-height: 25px;}

.personal{ display: flex; font-size: 14px; line-height: 25px; position: relative; margin: 10px 0 0px 0;}
.headPortrait img{ width: 25px; height: 25px; border-radius: 50%;}
.name{ margin: 0 15px;}
.extractState{ position: absolute; right: 0; padding: 0 5px; line-height: 20px; border-radius: 5px;}
.extractState.since{ border:1px solid #FF9E4F; color:#FF9E4F;}
.extractState.give{color:#4F87FF; border:1px solid #4F87FF;}

.commodityList{display: flex; margin: 5px 0 10px 0; }
.commodityList li{ margin-right: 10px;}
.commodityList li img{width: 65px; height: 65px; border-radius: 8px;}

.total{ font-size: 14px;}
.total span{ font-weight: bold; font-size: 16px;}
</style>
