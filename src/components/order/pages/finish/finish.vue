<template>
  <div
    class="finish"
    :class="{
      'finish-x': this.$util.getIsIphoneX_X(),
      'empty-page': showEmpty
    }"
  >
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      class="refresh-page"
    >
      <van-list
        v-model="loading"
        :finished="allFinish"
        :finished-text="showEmpty ? '' : '- 亲, 没有更多订单了 -'"
        @load="onLoad"
        :error.sync="error"
        :error-text="errorText"
        :immediate-check="true"
        offset="1"
      >
        <property-bill v-show="isLoadPropertyBill" :results="billResults" />
        <div
          v-for="(item,index) in currentOrderList"
          :key="item.billId+'_'+index?item.billId:item.id+'_'+index"
          class="scroll"
        >
          <OrderItem
            :dataList="item.dataList"
            :params="item.params"
            :billType="item.billType"
            :amount="item.amount"
            :submitTime="item.submitTime"
            :billDetailObj="item.billDetailObj"
            :orderType="item.orderType"
            :billId="item.billId"
            pageType="finish"
            :state="item.state"
            :orderCanEvaluate="item.orderCanEvaluate"
            :shoppingOrderId="item.shoppingOrderId"
            :bulkOrderType="item.bulkOrderType"
            :id="item.id"
            :tradeNo="item.tradeNo"
            :orderItem="item"
            :tag="item.tag"
            :orderStateType="item.orderStateType"
          ></OrderItem>
        </div>
        <Empty
          v-if="
            billResults.length == 0 && currentOrderList.length == 0 && !loading
          "
        ></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import propertyBill from "@/components/order/components/bill-item2/bill-item";
import OrderItem from "../../components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
import { fetchMethod } from "@/utils/tmHttp.js";
export default {
  name: "finish",
  data() {
    return {
      userRoomId: "",
      loading: false,
      finished: false,
      error: false,
      errorText: "请求失败，点击重新加载",
      properWorng: false,
      refreshing: false,
      refresh: false,
      orderList: [],
      currentPage: 1,
      totalPage: 0,
      queryBadge: {},
      page: 0,
      index: 0,
      pageSize: 5,
      tmpage: 1,
      tmorderList: [],
      tmfinished: false,
      showEmpty: false,
      allFinish: false,
      currentOrderList:[],
      mallRequestDone: false,
      mallOrderFormList: [],
      serviceRequestDone: false,
      serviceMallOrderFormList: [],
      tabs: {
        text: "已完成",
        tag: "9",
        type: ["200017"]
      },
      isLoadPropertyBill: false, //是否加载物业缴费账单组件
      billResults: [], //物业缴费数据
      reqBillType: "2,3,4,5,6,7,8,9,10,11,14", //账单类型 1-物业收费账单,2-月保续费账单,3-停车费账单,4-临时收费账单,5-零售,6-预缴费,7-旅游,8-家政,9-拎包,10-押金,11-新零售,12-美居,13-服务商城,14-维修服务费
      mallNowPage:0,
      mallTotalPage:null,
      mallAllDone: false,
      serviceMallNowPage:0,
      serviceMallTotalPage:null,
      serviceMallAllDone: false,
    };
  },
  components: {
    propertyBill,
    OrderItem,
    Empty
  },
  created() {
    this.getRoomId();
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    //获取原生人房
    getRoomId() {
      appLocalstorage
        .get({ key: "LLBUserRoomId", isPublic: true })
        .then(res => {
          if (res.hasOwnProperty("result")) {
            this.userRoomId = res.result;
          } else {
            this.userRoomId = "";
          }
        });
    },
    //获取物业账单列表
    propertyFn() {
      let airDefenseNoStr = this.userRoomId
        ? this.userRoomId
        : this.$store.state.userRoomId;
      let airDefenseNo = airDefenseNoStr.replace(/\|/gi, ","); //正则，将所有"|"替换成","
      let propertyObj = {
        airDefenseNo: airDefenseNo,
        memberId: this.$store.state.userInfo.phone
          ? this.$store.state.userInfo.phone
          : "",
        status: 90, //账单状态 10-待支付 90-成功
        type: 1, //type 1、列表 2、详情
        pageNo: "",
        pageTimes: ""
      };
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "https://m-center-uat-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "https://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");
      return new Promise((resolve, reject) => {
        this.$http.get(url, { params: propertyObj }).then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      });
    },
    /**
     * 请求自建商城订单数据 
     */
    requestMallOrderFormList(){
      // console.log("开始请求",this.mallNowPage);

      if (this.$store.state.environment == "development") {
        this.reqBillType = "2,3,4,5,6,7,8,9,10,11,14,15";
      }
      this.loading = true;

      this.mallNowPage++;

      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        // state: this.tabs.tag,
        page: { index: this.mallNowPage, pageSize: this.pageSize },
        airDefenseNo: this.userRoomId
          ? this.userRoomId
          : this.$store.state.userRoomId,
        billType: this.reqBillType
      };

      console.log("自建商城开始请求",this.mallNowPage);
      if(this.mallTotalPage != null && this.mallNowPage == this.mallTotalPage){
        this.loading = false;
        this.mallRequestDone = true;
        this.mallAllDone = true;
        this.handelMegerOrderForm();
        this.handelShowTip()
        return;
      }
      

      if(this.mallNowPage != 1 && this.mallTotalPage != null && this.mallNowPage > this.mallTotalPage){
        this.mallNowPage = this.mallTotalPage;
        this.loading = false;
        this.mallAllDone = true;
        console.log("自建商城已请求到最后数量,调整下标",this.mallNowPage);
        this.handelMegerOrderForm();
        this.handelShowTip()
        return;
      }
      this.mallRequestDone = false;
      // console.log("请求自建商城订单当前页数: ",this.mallNowPage);
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then(
          res => {
            this.loading = false;
            // console.log("请求完成",this.mallNowPage);
            // console.log("请求自建商城订单列表完成: ",res);
            if(res.data.status != 0){
              this.error = true;
              return;
            }
            this.mallTotalPage = res.data.data.pages;
            // console.log("请求自建商城订单列表总页数: ",this.mallTotalPage);
            let formateList = this.handelMallOrderFormList(res.data);
            console.log("没有获取到数据重新请求: ",!formateList && this.mallNowPage <= this.mallTotalPage);
            if(!formateList && this.mallNowPage <= this.mallTotalPage){
              // this.mallNowPage++;
              this.requestMallOrderFormList();
              this.handelShowTip()
            }else{
              this.mallOrderFormList = formateList;
              console.log("商城订单过滤后结果",this.mallOrderFormList);
              this.mallRequestDone = true;
              this.handelMegerOrderForm();
              this.handelShowTip()
              return;
            }
          },
          err => {
            console.log(err);
            this.loading = false;
            this.error = true;
          }
        );
    },
    /** 
     * 处理自建商城请求返回数据 
     */
    handelMallOrderFormList(res){
      let { status, data } = res;
      this.loading = false;
      if (status != 0) {
          return;
      }
      // console.log("处理商城订单逻辑: ",data.records)
      let ownlist = [],
        indexList = [];
      indexList = data.records.filter(
        item => item.billType != 11 || (item.orderStateType == "200017" && item.state == 9)
      );
      if (!indexList || indexList.length <= 0) {
        return;
      }
      indexList.map(item => {
        let list = {
          billType: item.billType,
          tag: 9, //订单状态
          billId: item.billId,
          amount: item.totalPrice,
          submitTime: item.submitTime,
          deliverType: item.deliverType,
          orderId: item.id,
          orderType: item.orderStateType,
          orderCategory: item.orderCategory,
          orderCanEvaluate: item.orderCanEvaluate,
          state: item.state,
          bulkOrderType: item.orderType,
          shoppingOrderId: item.shoppingOrderId,
          id: item.id,
          tradeNo: item.tradeNo,
          orderState: item.orderStateType,
          orderStateType: item.orderStateType,
          orderType: item.orderType, //订单类型
          shopOrderNo: item.orderFormItemList[0]
            ? item.orderFormItemList[0].storeOuCode
            : "",
          params: {
            deliverType: item.deliverType,
            orderId: item.id,
            orderType: item.orderStateType,
            orderCategory: item.orderCategory,
            orderCanEvaluate: item.orderCanEvaluate,
            orderStateType: item.orderStateType,
            state: item.state,
            shoppingOrderId: item.shoppingOrderId
          },
          // case 17:
          //   return "支付已完成 · 待发货";
          // case 4:
          //   return "支付已完成 · 待收货";
          // case 9:
          //   return "订单已完成";
          // case 12:
          //   return "订单已取消";
          billDetailObj: {
            businessCstNo: item.loginUserPhone,
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag:
              item.state == 17
                ? "16"
                : item.state == 16
                ? "16"
                : item.state == 4
                ? "4"
                : item.state == 9
                ? "9"
                : item.state == 12
                ? "7"
                : item.state,
            tabIndex: 5,
            awardActivityList: item.awardActivityList,
            isRefund: item.isRefund
          },
          dataList: item.orderFormItemList.map(sub => {
            return {
              billType: item.billType,
              billImg: sub.iconUrl,
              billName: sub.name,
              billAmount: sub.unitPrice,
              billNum: sub.quantity,
              skuId: sub.itemId,
              id: sub.itemId,
              storeOuCode: sub.storeOuCode,
              expressNo: item.expressNo,
              expressName: item.expressName,
              interfaceType: item.interfaceType,
              deliverType: item.deliverType,
              itemTypeName: sub.itemTypeName,
              snapshotTime: sub.snapshotTime,
              info: sub.info,
              address: item.address,
              cityId: item.cityId,
              countryId: item.countryId,
              countryName: item.countryName,
              provinceId: item.provinceId,
              provinceName: item.provinceName,
              townId: item.townId,
              townName: item.townName,
              receiver: item.receiver,
              mobile: item.mobile,
              itemOrderId: sub.itemOrderId,
              orderState: item.orderStateType,
              orderType: item.orderType, //订单类型
              shopOrderNo: sub.storeOuCode,
              tradeNo: item.tradeNo
            };
          })
        };
        ownlist.push(list);
      });
      // 加载状态结束
      this.loading = false;
      return ownlist;
    },
    /**
     * 请求服务商城订单数据 
     */
    requestServiceMallOrderFormList(){

      this.serviceMallNowPage++;
      console.log("服务商城开始请求",this.serviceMallTotalPage);

      if(this.serviceMallTotalPage != null && this.serviceMallNowPage == this.serviceMallTotalPage){
        this.loading = false;
        this.serviceRequestDone = true;
        this.serviceMallAllDone = true;
        this.handelMegerOrderForm();
        this.handelShowTip()
        return;
      }

      if(this.serviceMallNowPage != 1 && this.serviceMallTotalPage != null  && this.serviceMallNowPage > this.serviceMallTotalPage){
        this.serviceMallNowPage = this.serviceMallTotalPage;
        this.loading = false;
        this.serviceMallAllDone = true;
        console.log("服务商城已请求到最后数量,调整下标",this.mallNowPage);
        this.handelMegerOrderForm();
        this.handelShowTip()
        return;
      }

      let param = {
        orderStateList: ["COMPLETED"],
        pageNum: this.serviceMallNowPage,
        pageSize: this.pageSize
      };
      this.loading = true;
      this.serviceRequestDone = false;
      let seriveAPI = "/times-center-trade/mall/order/v1/shop/list";
      fetchMethod("POST", seriveAPI, param)
        .then(res => {
          console.log("服务商城订单列表请求结果: ",res)
          this.loading = false;
          if(res.code != 200){
            this.tmerror = true;
            return;
          }
          this.serviceMallTotalPage = res.data.pages;
          let formateList = this.handelServiceMallOrderForm(res);
          console.log("formateList",formateList);
          this.handelShowTip()
          if(!formateList && this.serviceMallNowPage <= this.serviceMallTotalPage){
            this.requestServiceMallOrderFormList();
          }else{
            this.serviceMallOrderFormList = formateList;
            this.serviceRequestDone = true;
            this.handelMegerOrderForm();
            this.handelShowTip()
            return;
          }
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.tmerror = true;
        });
    },
    /**
     * 处理服务商城请求返回数据
     */
    handelServiceMallOrderForm(res){
      console.log("处理服务商城订单  -> ",res);
      let { code, data } = res;
      this.loading = false;
      if(code != 200){
        return;
      }
      let { records } = data;
      let list = [];
      if (!records || records.length < 0) {
        return;
      }
      let lists = this.formatOrderList(data);
      if (!lists || lists.length <= 0) {
        return;
      }
      lists.map(item => {
        let init = {
          billType: 13, //清单列表
          amount: item.amountPay, //实付金额
          submitTime: item.orderTime, //下单时间
          deliverType: "", //配送方式
          orderId: item.id, //店铺订单主键
          orderCategory: "", // item.orderCategory,
          orderMode: "", // item.orderMode, //
          shoppingOrderId: "", // item.shoppingOrderId,
          bulkOrderType: item.orderType, //团购订单类型
          id: item.id,
          tradeNo: item.tradeNo, //交易单号
          orderState: item.orderState,
          orderType: item.orderType, //订单类型
          shopOrderNo: item.shopOrderNo,
          params: {
            deliverType: "", //配送方式
            orderId: item.id,
            orderType: item.orderType, //订单类型
            orderCategory: "", //item.orderCategory,
            orderStateType: "200017", // item.orderStateType,
            state: 17, //订单状态
            tradeNo: item.tradeNo //交易单号
          },
          billDetailObj: {
            groupBuyActivityId: "", //item.groupBuyActivityId
            groupBuyId: "",
            payMode: "", // item.payType,//是否是支付方式
            tradeNo: item.tradeNo, //交易单号
            shoppingOrderId: "", //item.shoppingOrderId
            orderPayType: "", //item.payType,//是否是支付方式
            id: item.id,
            tag: "16",
            tabIndex: 3,
            awardActivityList: item.awardActivityList
          }
        };
        let dataList = [];
        dataList.push({
          billType: 13,
          tag: 16, //状态订单
          billImg: item.orderItemData.itemImg, //商品图片
          billName: item.orderItemData.itemName,
          billAmount: item.orderItemData.itemPrice,
          billNum: item.orderItemData.buyNum,
          skuId: item.orderItemData.skuId,
          id: item.orderItemData.id,
          storeOuCode: "",
          expressNo: "",
          expressName: "",
          interfaceType: "",
          deliverType: "",
          address: item.projectName,
          cityId: "",
          countryId: "",
          countryName: "",
          provinceId: "",
          provinceName: "",
          townId: "",
          townName: "",
          receiver: item.receiverName,
          mobile: item.receiverPhone,
          orderState: item.orderState,
          tradeNo: item.tradeNo,
          orderType: item.orderType,
          shopOrderNo: item.shopOrderNo
        });
        init.dataList = dataList;
        list.push(init);
      });
      // 加载状态结束
      this.loading = false;
      return list;
    },
    /**
     * 控制合并订单
     */
    handelMegerOrderForm(){
      console.log("商城请求完成",this.mallRequestDone);
      console.log("服务商城请求完成",this.serviceRequestDone);
      if(this.mallRequestDone && this.serviceRequestDone){
        if(this.mallOrderFormList){
            console.log("自建商城合并数据",this.mallOrderFormList);
            this.currentOrderList = this.currentOrderList.concat(this.mallOrderFormList);
            this.currentOrderList = this.sortKey(this.currentOrderList, "submitTime");
            this.mallOrderFormList = [];
        }
        if(this.serviceMallOrderFormList){
            console.log("服务商城合并数据",this.serviceMallOrderFormList);
            this.currentOrderList = this.currentOrderList.concat(this.serviceMallOrderFormList);
            this.currentOrderList = this.sortKey(this.currentOrderList, "submitTime");
            this.serviceMallOrderFormList = [];
        }
        if(this.currentOrderList.length != 0 && this.currentOrderList.length <= 2 && this.currentOrderList){
          this.onLoad();
          console.log("currentOrderList.length",this.currentOrderList);
        }
        // this.$nextTick(()=>{
        //   let obj = {}
        //   this.currentOrderList = this.currentOrderList.reduce((cur,next) => {
        //     console.log(next)
        //       obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
        //       return cur;
        //   },[])
        //   console.log('去重',this.currentOrderList)
        //   /*按时间排序*/
        // })
          console.log("合并完成",this.currentOrderList);
      }
    },
    /**
     * 控制显示提示
     */
    handelShowTip(){
      
      console.log(this.finished , this.mallAllDone , this.serviceMallAllDone)
      this.allFinish = this.finished && this.mallAllDone && this.serviceMallAllDone
      //如果物业账单列表和电商订单列表都为空,并且请求不出错的情况下，则显示页面显示空状态
      if ( this.billResults.length === 0 && this.currentOrderList.length === 0 && !this.error ) {
        this.showEmpty = true;
      } else {
        this.showEmpty = false;
      }
    },
    //获取电商订单列表
    // orderFn() {
    //   //这里是帮租售在uat加15类型测试的，不上生产环境
    //   if (this.$store.state.environment == "development") {
    //     this.reqBillType = "2,3,4,5,6,7,8,9,10,11,14,15";
    //   }
    //   let obj = {
    //     orderType: this.tabs.type[0],
    //     orderTypeList: this.tabs.type,
    //     // state: this.tabs.tag,
    //     page: { index: this.currentPage, pageSize: this.pageSize },
    //     airDefenseNo: this.userRoomId
    //       ? this.userRoomId
    //       : this.$store.state.userRoomId,
    //     billType: this.reqBillType
    //   };

    //   return new Promise((resolve, reject) => {
    //     this.$http
    //       .post("/app/json/app_shopping_order/findOrderFormList", obj)
    //       .then(
    //         res => {
    //           resolve(res);
    //         },
    //         err => {
    //           reject(err);
    //           this.loading = false;
    //         }
    //       );
    //   });
    // },
    onLoad() {
      this.commFn();
      this.requestMallOrderFormList();
      this.requestServiceMallOrderFormList();
      // this.refreshing = false;
      // this.loading = true;
      // if (this.allFinish) {
      //   return;
      // }
      // this.commFn();
    },
    //滚动条与底部距离小于 offset 时触发
    commFn() {
      if(this.finished){
        return
      }
      let orderError = false;
      let propertyError = false;
      let promiseArr = [this.propertyFn()];
      // if (this.currentPage > 1 && !this.properWorng) {
      //   //如果当前页数大于1，那么说明是下滑分页的操作，因为物业账单没有分页，所以此时只需要请求电商订单的接口就好，不需要再请求物业账单接口了
      //   promiseArr = [this.orderFn(), this.tMallFn()];
      // } else {
      //   promiseArr = [this.propertyFn(), this.orderFn(), this.tMallFn()];
      // }

      Promise.allSettled(promiseArr).then(res => {
        let propertyRes = "";
        
        // if (res.length > 2) {
        //   //如果是初始化或者是下拉刷新，会请求两个接口，此时res的长度就是2。所以物业账单和电商订单都要根据对应下标拿数据
          propertyRes = res[0];
        //   orderRes = res[1];
        //   tmRes = res[2];
        // } else {
        //   propertyRes = "";
        //   orderRes = res[0];
        //   tmRes = res[1];
        // }
        //这里是物业账单接口返回的数据处理逻辑
        if (propertyRes && propertyRes.status === "fulfilled") {
          let results = propertyRes.value.data;
          //接口发送请求成功
          if (results.code === 200) {
            this.loading = false;
            this.billResults = results.data.finish;
          } else {
            this.billResults = [];
            this.loading = false;
          }
          if (this.billResults.length) {
            this.isLoadPropertyBill = true;
          } else {
            //如果没有物业账单数据，则不显示物业账单标题
            this.isLoadPropertyBill = false;
          }
        } else {
          if (propertyRes) {
            this.loading = false;
            this.error = true;
            propertyError = true;
            this.properWorng = true;
          } 
          // else {
          //   this.loading = false;
          //   //如果propertyRes为空，则说明是翻页操作，此时error要为false，否则会提示物业账单错误信息
          //   this.error = false;
          //   propertyError = false;
          //   this.properWorng = false;
          // }
        }

        // //这里是电商订单接口返回的数据处理逻辑
        // if (orderRes && orderRes.status === "fulfilled") {
        //   this.ownFn(orderRes.value);
        // } else {
        //   this.loading = false; // 加载状态结束
        //   this.error = true;
        //   orderError = true;
        // }

        // /*服务商城的数据*/
        // if (tmRes && tmRes.status == "fulfilled") {
        //   this.tmallDataFn(tmRes.value);
        // } else {
        //   this.loading = false; // 加载状态结束
        // }

        if (propertyError) {
          this.finished = false;
          this.errorText = "物业账单和订单请求失败，点击重新加载";
          this.$toast("物业账单和订单请求失败，点击重新加载");
        }
        this.finished = true;
        // this.allLoadingFn();
        this.handelShowTip();
      });
    },

    // 下拉刷新时触发
    onRefresh() {
      this.currentPage = 1;
      this.mallNowPage = 0;
      this.mallTotalPage = null;
      this.serviceMallNowPage = 0;
      this.serviceMallTotalPage = null;
      this.mallRequestDone=false;
      this.mallOrderFormList=[];
      this.serviceRequestDone=false;
      this.serviceMallOrderFormList=[];
      this.finished = false; //将没有更多的状态改成false
      this.mallAllDone=false;
      this.serviceMallAllDone=false;
      this.tmpage = 1;
      this.refreshing = false;
      this.billResults = []; //清空物业账单数据
      this.currentOrderList = []; //清空订单数据
      this.orderList = [];
      this.allFinish = false;
      this.onLoad();
    },
    /*自建商城的数据*/
    // ownFn(res) {
    //   let { status, data } = res.data,
    //   { pages, records } = data;
    //   let { currentPage } = this,
    //   totalPage = Number(pages);
    //   this.loading = false;
    //   this.currentPage++;
    //   if (status == 0) {
    //     if (currentPage < totalPage || currentPage == totalPage) {
    //       //如果当前页数等于接口返回的页数，那么finished为true，否则会一直加载接口
    //       if (currentPage == totalPage) {
    //         this.ownfinished = true;
    //       }
    //       // var indexList = data.records; //将请求到的内容赋值给一个变量
    //       let ownlist = [],
    //         indexList = [];
    //       indexList = data.records.filter(
    //         item =>
    //           item.billType != 11 ||
    //           (item.orderStateType == "200017" && item.state == 9)
    //       );
    //       //   this.orderList =
    //       //     this.currentPage == 1
    //       //       ? indexList
    //       //       : this.orderList.concat(indexList);
    //       //   this.page = data.pages; //将总页数赋值给this
    //       if(indexList.length == 0 && currentPage < totalPage){
    //         // this.currentPage++;
    //         this.ownfinished = false;
    //         console.log('1111111111111111111111111111111111111111111111')
    //         this.onLoad()
    //         return
    //       }
    //       if (indexList.length > 0) {
    //         indexList.map(item => {
    //           let list = {
    //             billType: item.billType,
    //             tag: 9, //订单状态
    //             billId: item.billId,
    //             amount: item.totalPrice,
    //             submitTime: item.submitTime,
    //             deliverType: item.deliverType,
    //             orderId: item.id,
    //             orderType: item.orderStateType,
    //             orderCategory: item.orderCategory,
    //             orderCanEvaluate: item.orderCanEvaluate,
    //             state: item.state,
    //             bulkOrderType: item.orderType,
    //             shoppingOrderId: item.shoppingOrderId,
    //             id: item.id,
    //             tradeNo: item.tradeNo,
    //             orderState: item.orderStateType,
    //             orderStateType: item.orderStateType,
    //             orderType: item.orderType, //订单类型
    //             shopOrderNo: item.orderFormItemList[0]
    //               ? item.orderFormItemList[0].storeOuCode
    //               : "",
    //             params: {
    //               deliverType: item.deliverType,
    //               orderId: item.id,
    //               orderType: item.orderStateType,
    //               orderCategory: item.orderCategory,
    //               orderCanEvaluate: item.orderCanEvaluate,
    //               orderStateType: item.orderStateType,
    //               state: item.state,
    //               shoppingOrderId: item.shoppingOrderId
    //             },
    //             // case 17:
    //             //   return "支付已完成 · 待发货";
    //             // case 4:
    //             //   return "支付已完成 · 待收货";
    //             // case 9:
    //             //   return "订单已完成";
    //             // case 12:
    //             //   return "订单已取消";
    //             billDetailObj: {
    //               businessCstNo: item.loginUserPhone,
    //               groupBuyActivityId: item.groupBuyActivityId,
    //               groupBuyId: item.groupBuyId,
    //               payMode: item.payMode,
    //               tradeNo: item.tradeNo,
    //               shoppingOrderId: item.shoppingOrderId,
    //               orderPayType: item.orderPayType,
    //               id: item.id,
    //               tag:
    //                 item.state == 17
    //                   ? "16"
    //                   : item.state == 16
    //                   ? "16"
    //                   : item.state == 4
    //                   ? "4"
    //                   : item.state == 9
    //                   ? "9"
    //                   : item.state == 12
    //                   ? "7"
    //                   : item.state,
    //               tabIndex: 5,
    //               awardActivityList: item.awardActivityList,
    //               isRefund: item.isRefund
    //             },
    //             dataList: item.orderFormItemList.map(sub => {
    //               return {
    //                 billType: item.billType,
    //                 billImg: sub.iconUrl,
    //                 billName: sub.name,
    //                 billAmount: sub.unitPrice,
    //                 billNum: sub.quantity,
    //                 skuId: sub.itemId,
    //                 id: sub.itemId,
    //                 storeOuCode: sub.storeOuCode,
    //                 expressNo: item.expressNo,
    //                 expressName: item.expressName,
    //                 interfaceType: item.interfaceType,
    //                 deliverType: item.deliverType,
    //                 itemTypeName: sub.itemTypeName,
    //                 snapshotTime: sub.snapshotTime,
    //                 info: sub.info,
    //                 address: item.address,
    //                 cityId: item.cityId,
    //                 countryId: item.countryId,
    //                 countryName: item.countryName,
    //                 provinceId: item.provinceId,
    //                 provinceName: item.provinceName,
    //                 townId: item.townId,
    //                 townName: item.townName,
    //                 receiver: item.receiver,
    //                 mobile: item.mobile,
    //                 itemOrderId: sub.itemOrderId,
    //                 orderState: item.orderStateType,
    //                 orderType: item.orderType, //订单类型
    //                 shopOrderNo: sub.storeOuCode,
    //                 tradeNo: item.tradeNo
    //               };
    //             })
    //           };
    //           ownlist.push(list);
    //         });
    //           this.concatFn(ownlist);
    //       } else {
    //         this.ownfinished = true;
    //       }
    //       // 加载状态结束
    //       this.loading = false;
    //     }
    //   } else {
    //     // 加载状态结束
    //     this.loading = false; //将加载状态关掉
    //     this.error = true; //大家错误状态
    //   }
    // },
    // /*服务商城的接口 --billType(物业清单) = 13*/
    // tMallFn() {
    //   let list = [],
    //     { tmpage, pageSize } = this;
    //   let param = {
    //     orderStateList: ["COMPLETED"],
    //     pageNum: tmpage,
    //     pageSize: pageSize
    //   };
    //   return new Promise((resolve, reject) => {
    //     let seriveAPI = "/times-center-trade/mall/order/v1/shop/list";
    //     fetchMethod("POST", seriveAPI, param)
    //       .then(res => {
    //         resolve(res);
    //       })
    //       .catch(err => {
    //         reject(err);
    //         this.loading = false;
    //         //   this.loading = false;
    //         //   this.tmerror = true; //大家错误状态
    //         //   this.tmfinished = false;
    //         //   return false;
    //       });
    //   });
    // },
    // /*服务商城的数据*/
    // tmallDataFn(res) {
    //   let { code, data } = res,
    //     { tmpage } = this;
    //   this.loading = false;
    //   if (code == 200) {
    //     let { records, pages } = data;
    //     this.tmpage++;
    //     let list = [];
    //     if (tmpage <= pages) {
    //       if (tmpage == pages) {
    //         this.tmfinished = true;
    //       }
    //       if (records.length > 0) {
    //         let lists = this.formatOrderList(data);
    //         lists.map(item => {
    //           let init = {
    //             billType: 13, //清单列表
    //             amount: item.amountPay, //实付金额
    //             submitTime: item.orderTime, //下单时间
    //             deliverType: "", //配送方式
    //             orderId: item.id, //店铺订单主键
    //             orderCategory: "", // item.orderCategory,
    //             orderMode: "", // item.orderMode, //
    //             shoppingOrderId: "", // item.shoppingOrderId,
    //             bulkOrderType: item.orderType, //团购订单类型
    //             id: item.id,
    //             tradeNo: item.tradeNo, //交易单号
    //             orderState: item.orderState,
    //             orderType: item.orderType, //订单类型
    //             shopOrderNo: item.shopOrderNo,
    //             params: {
    //               deliverType: "", //配送方式
    //               orderId: item.id,
    //               orderType: item.orderType, //订单类型
    //               orderCategory: "", //item.orderCategory,
    //               orderStateType: "200017", // item.orderStateType,
    //               state: 17, //订单状态
    //               tradeNo: item.tradeNo //交易单号
    //             },
    //             billDetailObj: {
    //               groupBuyActivityId: "", //item.groupBuyActivityId
    //               groupBuyId: "",
    //               payMode: "", // item.payType,//是否是支付方式
    //               tradeNo: item.tradeNo, //交易单号
    //               shoppingOrderId: "", //item.shoppingOrderId
    //               orderPayType: "", //item.payType,//是否是支付方式
    //               id: item.id,
    //               tag: "16",
    //               tabIndex: 3,
    //               awardActivityList: item.awardActivityList
    //             }
    //           };
    //           let dataList = [];
    //           dataList.push({
    //             billType: 13,
    //             tag: 16, //状态订单
    //             billImg: item.orderItemData.itemImg, //商品图片
    //             billName: item.orderItemData.itemName,
    //             billAmount: item.orderItemData.itemPrice,
    //             billNum: item.orderItemData.buyNum,
    //             skuId: item.orderItemData.skuId,
    //             id: item.orderItemData.id,
    //             storeOuCode: "",
    //             expressNo: "",
    //             expressName: "",
    //             interfaceType: "",
    //             deliverType: "",
    //             address: item.projectName,
    //             cityId: "",
    //             countryId: "",
    //             countryName: "",
    //             provinceId: "",
    //             provinceName: "",
    //             townId: "",
    //             townName: "",
    //             receiver: item.receiverName,
    //             mobile: item.receiverPhone,
    //             orderState: item.orderState,
    //             tradeNo: item.tradeNo,
    //             orderType: item.orderType,
    //             shopOrderNo: item.shopOrderNo
    //           });
    //           init.dataList = dataList;
    //           list.push(init);
    //         });
    //         this.concatFn(list);
    //       } else {
    //         this.tmfinished = true;
    //       }
    //     } else {
    //       this.tmfinished = true;
    //     }
    //   } else {
    //     this.tmfinished = false;
    //     this.tmerror = true; //大家错误状态
    //     this.tmfinished = true;
    //   }
    // },
    /*服务商城的数据格式化*/
    formatOrderList(data) {
      //交易单
      let records = data.records;
      let recordsArray = [];
      for (let index = 0; index < records.length; index++) {
        let recordDataNew = {};
        let recordData = records[index];
        //店铺订单列表
        let orderItemList = recordData.orderItemList;
        //店铺订单列表第一个数据
        const orderItemData = (orderItemList && orderItemList[0]) || {};
        // console.log("orderItemData--->", orderItemData);
        //商品订单详情
        recordDataNew = {
          ...recordData,
          orderItemData: orderItemData
        };
        delete recordDataNew.orderItemList;
        recordsArray.push(recordDataNew);
      }
      return recordsArray;
    },
    /*按时间排序*/
    sortKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    // concatFn(list) {
    //   this.orderList = this.orderList.concat(list);
    //   /*按时间排序*/
    //   this.currentOrderList = this.sortKey(this.orderList, "submitTime");
    // },
    allLoadingFn() {
      if (this.mallAllDone && this.serviceMallAllDone) {
        this.loading = false;
        this.allFinish = true;
      } else {
        this.allFinish = false;
      }
      if (this.tmerror && this.error) {
        this.error = true;
      } else {
        this.error = false;
      } 
      console.log(this.allFinish, "allFinishl--loading2");
    },

    // 初始化数据
    initData() {
      this.currentOrderList = this.orderList.map(item => {
        return {
          billType: item.billType,
          tag: 9, //订单状态
          billId: item.billId,
          amount: item.totalPrice,
          submitTime: item.submitTime,
          deliverType: item.deliverType,
          orderId: item.id,
          orderType: item.orderStateType,
          orderCategory: item.orderCategory,
          orderCanEvaluate: item.orderCanEvaluate,
          state: item.state,
          bulkOrderType: item.orderType,
          shoppingOrderId: item.shoppingOrderId,
          id: item.id,
          tradeNo: item.tradeNo,
          orderState: item.orderStateType,
          orderType: item.orderType, //订单类型
          orderStateType: item.orderStateType,
          shopOrderNo: item.orderFormItemList[0]
            ? item.orderFormItemList[0].storeOuCode
            : "",
          params: {
            deliverType: item.deliverType,
            orderId: item.id,
            orderType: item.orderStateType,
            orderCategory: item.orderCategory,
            orderCanEvaluate: item.orderCanEvaluate,
            orderStateType: item.orderStateType,
            state: item.state,
            shoppingOrderId: item.shoppingOrderId
          },
          // case 17:
          //   return "支付已完成 · 待发货";
          // case 4:
          //   return "支付已完成 · 待收货";
          // case 9:
          //   return "订单已完成";
          // case 12:
          //   return "订单已取消";
          billDetailObj: {
            businessCstNo: item.loginUserPhone,
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag:
              item.state == 17
                ? "16"
                : item.state == 16
                ? "16"
                : item.state == 4
                ? "4"
                : item.state == 9
                ? "9"
                : item.state == 12
                ? "7"
                : item.state,
            tabIndex: 5,
            awardActivityList: item.awardActivityList,
            isRefund: item.isRefund
          },
          dataList: item.orderFormItemList.map(sub => {
            return {
              billType: item.billType,
              billImg: sub.iconUrl,
              billName: sub.name,
              billAmount: sub.unitPrice,
              billNum: sub.quantity,
              skuId: sub.itemId,
              id: sub.itemId,
              storeOuCode: sub.storeOuCode,
              expressNo: item.expressNo,
              expressName: item.expressName,
              interfaceType: item.interfaceType,
              deliverType: item.deliverType,
              itemTypeName: sub.itemTypeName,
              snapshotTime: sub.snapshotTime,
              info: sub.info,
              address: item.address,
              cityId: item.cityId,
              countryId: item.countryId,
              countryName: item.countryName,
              provinceId: item.provinceId,
              provinceName: item.provinceName,
              townId: item.townId,
              townName: item.townName,
              receiver: item.receiver,
              mobile: item.mobile,
              itemOrderId: sub.itemOrderId,
              orderState: item.orderStateType,
              orderType: item.orderType, //订单类型
              shopOrderNo: sub.storeOuCode,
              tradeNo: item.tradeNo
            };
          })
        };
      });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
// .scroll {
// padding-top: 10px;
// }
.finish {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 130px;

  &.finish-x {
    padding-bottom: 150px;
  }

  &.empty-page {
    overflow-y: hidden;
  }

  .refresh-page {
    min-height: 100%;
  }
}
</style>
