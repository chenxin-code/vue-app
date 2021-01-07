/**Created by steven on 2018/6/12.*/

<template>
  <div class="Mall-OrderList">
    <nav-top @backEvent="backEvent" >
    </nav-top>
    <ul class="tab" :style="{'margin-top': (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <li class="item" :class="{selected:selected == item.identifier}" v-for="(item,index) in tabs" @click="selectedFunc(item)"><span>{{item.name}}</span></li>
    </ul>
    <!--待付款-->
    <ul ref="dzf" class="orderList" v-show="selected == 'dzf'" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight()+44)+ 'px'}">
      <li class="orderItem" v-for="(item,index) in dzfList">
        <div class="div-top publicStyle">
          <span class="serialNumber">交易流水号:{{item.tradeNo}}</span>
          <!--待支付模块-->
          <div class="state" >
            <span class="">等待付款</span>
          </div>
        </div>
        <div class="productInfo" :class="{'no-top-padding': index != 0}" v-for="(productItem,index) in item.corderItemList">
          <div class="cover">
            <img :src="productItem.phPictureUrl"/>
          </div>
          <div class="desc">{{productItem.productName}}</div>
        </div>
        <div class="total publicStyle">
          <p class="serialNumber">共{{item.num}}件商品实付款：<span>￥{{item.payAmount}}</span></p>
        </div>
        <div class="btnArea publicStyle">
          <span class="btn cancel" @click="cancelOrder(item)">取消订单</span>
          <span class="btn ensure" @click="payOrder(item)">去付款</span>
        </div>
      </li>
    </ul>

    <!--待收货-->
    <ul ref="dsh" class="orderList" v-show="selected == 'dsh'">
      <li class="orderItem" v-for="(item,index) in dshList">
        <div class="div-top publicStyle">
          <span class="serialNumber">订单号:{{item.tradeNo}}</span>
          <!--待收货-->
          <div class="state" >
            <span class="">已完成</span>
          </div>
        </div>
        <div class="productInfo" :class="{'no-top-padding': index != 0}" v-for="(productItem,index) in item.corderItemList">
          <div class="cover">
            <img :src="productItem.phPictureUrl"/>
          </div>
          <div class="desc">{{productItem.productName}}</div>
        </div>
        <div class="total publicStyle">
          <p class="serialNumber">共{{item.num}}件商品实付款：<span>￥{{item.payAmount}}</span></p>
        </div>
      </li>
    </ul>

    <!--已完成-->
    <ul  ref="ywc" class="orderList" v-show="selected == 'ywc'">
      <li class="orderItem" v-for="(item,index) in ywcList">
        <div class="div-top publicStyle">
          <span class="serialNumber">订单号:{{item.tradeNo}}</span>
          <!--已完成-->
          <div class="state complete">
            <span class="icon-complete"></span>
            <span class="icon-del" ></span>
          </div>
        </div>
        <div class="productInfo" :class="{'no-top-padding': index != 0}" v-for="(productItem,index) in item.corderItemList">
          <div class="cover">
            <img :src="productItem.phPictureUrl"/>
          </div>
          <div class="desc">{{productItem.productName}}</div>
        </div>
        <div class="total publicStyle">
          <p class="serialNumber">共{{item.num}}件商品实付款：<span>￥{{item.payAmount}}</span></p>
        </div>
        <div class="btnArea publicStyle">
          <span class="btn cancel">评价晒单</span>
          <span class="btn ensure">再次购买</span>
        </div>
      </li>
    </ul>

    <!--已取消-->
    <ul ref="yqx" class="orderList" v-show="selected == 'yqx'">
      <li class="orderItem" v-for="(item,index) in yqxList">
        <div class="div-top publicStyle">
          <span class="serialNumber">订单号:{{item.tradeNo}}</span>
          <!--已取消-->
          <div class="state canceled" >
            <span class="cancelText">已取消</span>
            <span class="icon-del" @click="removeTodo(index)"></span>
          </div>
        </div>
        <div class="productInfo" :class="{'no-top-padding': index != 0}" v-for="(productItem,index) in item.corderItemList">
          <div class="cover">
            <img :src="productItem.phPictureUrl"/>
          </div>
          <div class="desc">{{productItem.productName}}</div>
        </div>
        <div class="total publicStyle">
          <p class="serialNumber">共{{item.num}}件商品实付款：<span>￥{{item.payAmount}}</span></p>
        </div>
        <div class="btnArea publicStyle">
          <!--<span class="btn cancel">取消订单</span>-->
          <span class="btn ensure">再次购买</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {Toast } from 'mint-ui'
export default {
  name: "Mall-OrderList",
  components: {
    Toast,
  },
  props: {
    hasBack: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      isShow:false,
      itemShow:true,
      dzfList:[],
      dshList:[],
      ywcList:[],
      yqxList:[],
      tabs:[
        {name:'待支付',identifier:'dzf',id:1},
        {name:'待收货',identifier:'dsh',id:3},
        {name:'已完成',identifier:'ywc',id:9},
        {name:'已取消',identifier:'yqx',id:8},
      ],
      selected:'dzf',
    }
  },
  methods: {
    getOrdersList: function () {
      let params1 = {
        token: this.$store.state.login.token,
        state: '',
        page: {
          pageSize: 10,
          index: 1
        },
        orderType: '200001'
      };
      if (this.selected == 'dzf') {
        if (this.dzfList.length != 0) {
          return ;
        }
        params1.state = '1'
      } else if (this.selected == 'dsh') {
        if (this.dshList.length != 0) {
          return ;
        }
        params1.state = '4'
      } else if (this.selected == 'ywc') {
        if (this.ywcList.length != 0) {
          return ;
        }
        params1.state = '9'
      } else if (this.selected == 'yqx') {
        if (this.yqxList.length != 0) {
          return ;
        }
        params1.state = '8'
      }
      this.$Loading.open()
      let url = '/app/json/order/queryState';
      console.log(this.$store.state.login.token)
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close()
        let data = res.data;
        console.log(data);
        if (data.status == 0) {
          if (this.selected == 'dzf') {
            _this.dzfList = data.data.rows
          } else if (this.selected == 'dsh') {
            _this.dshList = data.data.rows
          } else if (this.selected == 'ywc') {
            _this.ywcList = data.data.rows
          } else if (this.selected == 'yqx') {
            _this.yqxList = data.data.rows
          }
          if(!data.data.rows.length){
            _this.$ErrPage.open({
              el:_this.$refs[_this.selected],
              errType: 'NoOrder',
              btnCallBack: function () {
                _this.getOrdersList()
                _this.$ErrPage.close()
              }
            })
          }
        } else {
          _this.$ErrPage.open({
            el:_this.$refs[_this.selected],
            errType: 'NetError',
            btnCallBack: function () {
              _this.getOrdersList()
              _this.$ErrPage.close()
            }
          })
          _this.$Toast(data.info)
        }
      }, error => {
        _this.$Loading.close()
        console.log('获取失败', error);
        _this.$ErrPage.open({
          el:_this.$refs[_this.selected],
          errType: 'NetError',
          btnCallBack: function () {
            _this.getOrdersList()
            _this.$ErrPage.close()
          }
        })
        _this.$Toast('获取数据失败')
      });
    },
    cancelOrder: function (item) {
      this.$Loading.open()
      let url = '/app/json/order/cancelOrder';
      let params1 = {
        orderType: '200001',
        token: this.$store.state.login.token,
        orderId: item.id
      };
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close()
        let data = res.data;
        console.log(data);
        if (data.status == 0) {
          let index = -1
          for (let i = 0; i < _this.dzfList.length; i++) {
            let item1 = _this.dzfList[i]
            if (item1.id == item.id) {
              index = i
              break
            }
          }
          console.log(index)
          if (index > -1) {
            _this.dzfList.splice(index, 1)
            _this.$Toast('取消成功！')
          }
        } else {
          _this.$Toast(data.info)
        }
      }, error => {
        _this.$Loading.close()
        console.log('获取失败', error);
        _this.$Toast('获取数据失败')
      });
    },
	payOrder: function (item) {
		this.$Loading.open()
		let pay_url = '/app/json/order/pay';
		let pay_params= {
			token: this.$store.state.login.token,
			orderId: item.id,
			orderType: '210001',
			payMode:"210",
			amount:item.payAmount,
			payModeSub:"210001"
		};
		let _this = this
 		this.$http.post(pay_url, pay_params).then(res => {
			_this.$Loading.close()
			let data = res.data;
			console.log(data.info)
			if (data.status == -1) {
				_this.$Toast('华丽的'+data.info+'又出现了')
			}
		})
	},
    selectedFunc:function (item) {
      this.selected = item.identifier;
      this.getOrdersList()
    },
    removeTodo: function (index) {
      this.yqxList = data.rows;
      this.yqxList.splice(index, 1);
    },
    backEvent: function () {
      // this.$bridgefunc.customPush({
      //   path: '/mallshoppingcart'
      // })
      this.$bridgefunc.customGo(-1);
    }
  },
  created () {
    this.getOrdersList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"
.Mall-OrderList {
  position absolute
  top 0px
  bottom 0px
  left 0px
  right 0px
  background-color:#F5F6F5;
  overflow hidden
  .tab{
    overflow:hidden;
    display:flex;
    height:44px;
    padding:0px 3%;
    position:relative;
    top:0px;
    left:0px;
    z-index:99;
    background:#fff;
    &:after {
      content: ' ';
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #d3d3d3;
      color: $color-line-gray-l;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 2;
    }
    .item{
      flex:4;
      float:left;
      text-align:center;
      font-size:14px;
      line-height:44px;
      span{
        display:inline-block;
      }
    }
    .selected{
      font-size:15px;
      color:#fa571c;
      span{
        position:relative;
        font-weight:600;
        &:after {
          content: ' ';
          box-sizing: border-box;
          position: absolute;
          left: 0;
          bottom -3px;
          right: 0;
          height: 1px;
          border-bottom: 6px solid #fa571c;
          transform-origin: 0 0;
          transform: scaleY(0.5);
          z-index: 99;
        }
      }

    }
  }
  .publicStyle{
    width:100%;
    padding:0px 3%;
    height:44px;
    line-height:44px;
    text-align:right;
    background:#fff;
  }

  .orderList{
    position absolute
    left 0px;
    right 0px;
    bottom 0px;
    overflow-y:scroll;
    -webkit-overflow-scrolling:touch;
    .orderItem{
      background-color:#FBFBFB;
      overflow:hidden;
      margin-top:8px;
      .div-top{
        font-size:$font-size-medium;
        .serialNumber{
          float:left;
          font-size:$font-size-medium;
        }
        .state{
          float:right;
          color:#fb571a;
        }
        .complete{
          position:relative;
          .icon-complete{
            width:70px;
            height:58px;
            display:inline-block;
            background:url("../../../static/image/mall/icon4.png")0px 0px no-repeat;
            background-size:cover;
            position:absolute;
            right:40px;
            z-index:99;
          }
          .icon-del{
            width:20px;
            height:20px;
            display:inline-block;
            background:url("../../../static/image/mall/icon3.png")0px center no-repeat;
            background-size:cover;
            position:absolute;
            right:0px;
            top:50%;
            margin-top:15px;
            z-index:99;
          }
        }
        .canceled{
          position:relative;
          .cancelText{
            display inline-block
            color:#999;
            margin-right:40px;
          }
          .icon-del{
            width:20px;
            height:20px;
            display:inline-block;
            background:url("../../../static/image/mall/icon3.png")0px center no-repeat;
            background-size:cover;
            position:absolute;
            right:0px;
            top:50%;
            margin-top:-10px;
            z-index:99;
          }
        }
      }
      .productInfo{
        text-align: center;
        width:100%;
        height:100%;
        padding:10px 3%;
        overflow:hidden;
        .cover{
          float:left;
          margin-right:3%;
          height:60px;
          img{
            display:block;
            width:60px;
            height:60px;
          }
        }
        .desc{
          height:60px;
          line-height:60px;
          text-align:left;
          font-size:$font-size-medium;
        }
      }
      .no-top-padding {
        padding-top 0px;
      }
      .total{
        position:relative;
        &:after {
          content: ' ';
          box-sizing: border-box;
          position: absolute;
          left: 0;
          bottom 0;
          right: 0;
          height: 1px;
          border-top: 1px solid #d3d3d3;
          color: $color-line-gray-l;
          transform-origin: 0 0;
          transform: scaleY(0.5);
          z-index: 2;
        }
        .serialNumber{
          font-size:$font-size-medium-s;
          span {
            font-size 15px
          }
        }
      }
      .btnArea{
        text-align:right;
        .btn{
          display:inline-block;
          border:1px solid #d3d3d3;
          width:90px;
          text-align:center;
          height:30px;
          line-height:30px;
          margin-left:10px;
          border-radius:15px;
          -webkit-border-radius:15px;
          font-size:$font-size-medium;
        }
        .cancel{
          color:$color-text;
        }
        .ensure{
          border-color:#fe6902;
          color:#fe6902;
        }
      }
    }
  }

}
</style>
