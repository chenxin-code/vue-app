 /**Created by steven on 2018/6/12.*/

<template>
  <div class="Mall-ShoppingCart">

    <nav-top @backEvent="backEvent" >
      <div class="title-right"  @click="setIsEditting"> {{isEditing?'完成':'编辑'}}</div>
    </nav-top>

    <div class="sh-content" ref="content" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <div class="cart-content" v-if="dataList.length">
        <!--购物车列表循环-->
        <div class="cartList">
          <div v-for="(oItem,oIndex) in dataList">
            <div class="listTop" :class="{'Selected':oItem.selected,'unSelected':!oItem.selected}" @click="toggle(oIndex)">
              <span class="companyName">{{oItem.name}}</span>
            </div>
            <!--子列表循环-->
            <ul class="cartChildList" v-for="(mItem,mIndex) in oItem.rows">
              <li class="childItem">
                <div class="listTop" :class="{'Selected':mItem.selected,'unSelected':!mItem.selected}" @click="toggle(oIndex,mIndex)">
                  <i class="active"></i>
                  <span class="companyName">{{mItem.name}}</span>
                </div>
                <!--子列表里面的列表循环-->
                <div class="goodsInfo " v-for="(goodItem,goodIndex) in mItem.rows">
                  <div class="isselect" :class="{'Chsoed':goodItem.selected,'unChose':!goodItem.selected}" @click="toggle(oIndex,mIndex,goodIndex)">
                    <i class="active"></i>
                  </div>
                  <div class="box-shadow" @click="productEvent(goodItem)">
                    <div class="cover">
                      <!--phPicUrl-->
                      <!--<img src="../../../static/image/mall/cart-cover.png"/>-->
                      <img :src="goodItem.phPictureUrl"/>
                    </div>
                    <div class="desc">
                      <p class="productName">{{goodItem.productName}}</p>
                      <p class="weight"></p>
                      <div class=" prices_quantities">
                        <p class="prices">￥<span>{{goodItem.price}}</span></p>
                        <div class="quantities">
                          <i  :class="{'subtractactive':goodItem.number>1,'subtractno':goodItem.number==1}" @click.stop="numOper(false,oIndex,mIndex,goodIndex)"></i>
                          <i class="num">{{goodItem.number}}</i>
                          <i class="add" @click.stop="numOper(true,oIndex,mIndex,goodIndex)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--结算-->
      <div class="position">
        <div class="balance " :class="{'unActive':!selectedAll,'Actived':selectedAll}"  @click="setAllSelect">
          <p class="choseAll" :class="{'nochose':!dataList.length}">全选</p>
          <div class="payStyle" v-if="!isEditing" >
            <p class="total">合计:￥{{totalAmount}}元</p>
            <span class="goPay" @click="goPay">去结算({{totalNum}})</span>
          </div>
          <div class="delStyle" v-if="isEditing">
            <span class="del" @click="deleteItems">删除</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast } from 'mint-ui'

export default {
  name: "Mall-ShoppingCart",
  components: {
    Toast
  },
  props: {
    hasBack: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      isEditing:false,
      selectedAll:false,
      totalAmount:0,
      totalNum:0,
      saveSaleList:[],
      saveSelectAll:null,
      dataList: [],
    }
  },
  methods: {
    productEvent: function (goodItem) {
      console.log(goodItem)
      this.$bridgefunc.customPush({
        path: '/mallgooddetail',
        query: {
          skuId: goodItem.skuId,
          storeOuCode: goodItem.storeOuCode,
          from: 'cart'
        },
      });
    },
    setIsEditting:function(){
      this.isEditing = !this.isEditing;
      if(this.isEditing){
        this.saveSelectAll = this.selectedAll;
        this.saveSaleList = [].concat(JSON.parse(JSON.stringify(this.dataList)));
        this.selectedAll = false;
        this.retsetAll();
      }else{
        this.totalNum = 0;//重置商品数量
        this.totalAmount = "0.00";//重置金额
        //重置选择状态
        this.saveSelectAll = this.selectedAll;
        this.saveSaleList = [].concat(JSON.parse(JSON.stringify(this.dataList)));
        this.selectedAll = false;
        this.retsetAll();
      }
    },
    goPay:function(){
      var event = window.event||arguments[0];
      event.stopPropagation();
      let payIds = this.getIds();
      this.placeOrder(payIds)
    },
    backEvent: function () {
      this.$bridgefunc.customGo(-1)
    },
    deleteItems:function(){
      var event = window.event||arguments[0];
      event.stopPropagation();
      let _this = this;
      let ids = _this.getIds();
      if (ids.length == 0) {
        this.$Toast("清选择要删除的商品")
        return
      }
      this.$MessageBox.confirm('确认删除？', '提示',{confirmButtonText:'确定'}).then(action => {
        _this._deleteItemsApi(ids)
      }).catch(action => {
      });
    },
    _deleteItemsApi: function (ids) {
      this.$Loading.open();
      let url = '/app/json/ord_cart/deleteCart'
      //onsole.log(this.$store.state.login.token)
      let params1 = {
        token: this.$store.state.login.token,
        ordCartIds: ids
      }
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close()
        _this.$Toast('商品已删除')
        let data = res.data;
        if (data.status == 0) {
          _this.getDataList();
        } else {
          _this.$Toast(data.info)
        }
      }, error => {
        _this.$Loading.close()
        _this.$Toast('获取数据失败')
      });
    },
    getIds:function(){
      let  deleteItems = [];
      for(let i = 0; i < this.dataList.length; i++){
        let item = this.dataList[i];
        let tempItems = this._getSelectedIds(item);
        deleteItems = deleteItems.concat(tempItems);
      }
      return deleteItems;
    },
    _getSelectedIds:function(item){
      let itemIds = [];
      if (item.rows){
        for(let i = 0; i < item.rows.length; i++){
          let sonItem = item.rows[i];
          if (sonItem){
            itemIds = itemIds.concat( this._getSelectedIds(sonItem));
          } else {
            continue;
          }
        }
      } else if(item.selected){
        itemIds.push(item.id);
      }

      return itemIds;

    },
    toggle:function (oIndex,mIndex,goodIndex) {
      //event.stopPropagation();
      let oItem;
      let mItem;
      let currentItem;
      if(typeof(oIndex) !== 'undefined'){
        oItem  = this.dataList[oIndex];
        currentItem = this.dataList[oIndex];
        if(typeof(mIndex) !== 'undefined' && oItem){
          mItem = oItem.rows[mIndex];
          currentItem =  oItem.rows[mIndex];
          if(typeof(goodIndex) !== 'undefined' && mItem){
            currentItem =  mItem.rows[goodIndex];
          }
        }
      }
      currentItem.selected = !currentItem.selected;
      this._setSonItem(currentItem);
      if(mItem){
        mItem.selected=  this._itemIsSelect(mItem);
      }
      if(oItem){
        oItem.selected=  this._itemIsSelect(oItem);
      }

      let  allSelected = true;
      for(let i = 0; i < this.dataList.length; i++){
        let item = this.dataList[i];
        if(!item.selected){
          allSelected = false
          break;
        }
      }
      this.selectedAll = allSelected;
      this._setTotalAmount();
    },
    _setTotalAmount:function(){

      if(this.isEditing){
        return;
      }
      let tempAmount = 0;
      let tempNum = 0;
      for(let i = 0; i < this.dataList.length; i++){
        let item = this.dataList[i];
        if (item){
          let dic =  this._getItemAmount(item);
          tempAmount += dic.amount;
          tempNum += dic.number;
        } else {
          continue;
        }
      }
      this.totalAmount =  this.$util.toDecimal2(tempAmount);
      this.totalNum = tempNum;
    },
    _getItemAmount:function(item){
      let tempAmount = 0;
      let tempNum = 0;
      if (item.rows){
        for(let i = 0; i < item.rows.length; i++){
          let sonItem = item.rows[i];
          if (sonItem){
            let dic =  this._getItemAmount(sonItem);
            tempAmount += dic.amount;
            tempNum += dic.number;
          } else {
            continue;
          }
        }
      } else if(item.selected){
        tempAmount = item.price*item.number;
        tempNum = item.number;
      }
      let dic = {number:tempNum,amount:tempAmount};
      return dic;

    },
    _itemIsSelect:function(item){
      if(item.rows){
        let  allSelected = true;
        for(let i = 0; i < item.rows.length; i++){
          let sonItem = item.rows[i];
          if(!sonItem.selected){
            allSelected = false
            return false;
          }
        }
        return allSelected;
      }
    },
    _setSonItem:function(item){
      if(item.rows){
        for(let i = 0; i < item.rows.length; i++){
          let sonItem = item.rows[i];
          sonItem.selected = item.selected;
          this._setSonItem(sonItem);
        }
      }
    },
    numOper:function (isAdd,oIndex,mIndex,goodIndex) {
      let  oItem = this.dataList[oIndex];
      let mItem = oItem.rows[mIndex];
      let goodItem = mItem.rows[goodIndex];
      let tempNum = goodItem.number;
      if(isAdd){
        if(tempNum >= 999 ){
          return;
        }
        tempNum += 1;
      }else {
        if(tempNum > 1){
          tempNum -= 1;
        }
      }

      this.$Loading.open();
      let url = '/app/json/ord_cart/updateCart';
      let paramsData = {
        token: this.$store.state.login.token,
        number: tempNum,
        id:goodItem.id
      };
      let _this = this;
      this.$http.post(url, paramsData).then(
        res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            goodItem.number = tempNum;
            _this._setTotalAmount();

          } else {
            _this.$Toast(data.info);
          }
        },
        error => {
          _this.$Loading.close();
          _this.$Toast('更新数量失败');

        }
      );

    },
    setAllSelect:function () {
      if(!this.dataList.length){
        return;
      }
      this.selectedAll = !this.selectedAll;
      this.retsetAll();
    },
    retsetAll:function () {
      let tempList = [].concat(JSON.parse(JSON.stringify(this.dataList)));
      for(let i = 0; i < tempList.length; i++){
        let item = tempList[i];
        if (item){
          item.selected = this.selectedAll;
          this._setSonItem(item);
        } else {
          continue;
        }
      }
      this.dataList = [].concat(JSON.parse(JSON.stringify(tempList)));
      this._setTotalAmount();
    },
    getDataList:function () {
      this.$Loading.open();
      let url = '/app/json/ord_cart/findCartList';
      let paramsData = {
        token: this.$store.state.login.token,
        groupAttr:"ouName,storeName"
      };
      let _this = this;
      this.$http.post(url, paramsData).then(
        res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.dataList = _this._calDatas(data.data);
            _this.saveSaleList = [].concat(JSON.parse(JSON.stringify(this.dataList)));
            _this.retsetAll();
            if(!_this.dataList.length){
              // _this.$ErrPage.open({
              //   el:_this.$refs.content,
              //   errType: 'NoCart',
              //   pageType: 'hasNav',
              //   btnCallBack: function () {
              //     this.$bridgefunc.customPush({
              //       path: '/mallgoodlist'
              //     })
              //   }
              // })
            }
            _this.$nextTick(() => {
              _this.setAllSelect()
            })
          } else {
            _this.$Toast(data.info);
            _this.$ErrPage.open({
              el:_this.$refs.content,
              errType: 'NetError',
              btnCallBack: function () {
                _this.getDataList()
                _this.$ErrPage.close()
              }
            })
          }
        },
        error => {
          _this.$Loading.close();
          _this.$ErrPage.open({
            el:_this.$refs.content,
            errType: 'NetError',
            btnCallBack: function () {
              _this.getDataList()
              _this.$ErrPage.close()
            }
          })
          _this.$Toast('获取列表失败');

        }
      );
    },
    _calDatas:function (data) {
      let tempList = [];
      for(let key in data) {
        let tempDic  = {};
        tempDic.name = key;
        let tempObj = data[key];
        if( Array.isArray(tempObj) ){
          tempDic.rows = tempObj
        }else if( tempObj instanceof Object){
          tempDic.rows =  this._calDatas(tempObj);
        }else {
          continue;
        }
        tempList.push(tempDic);
      }
      return tempList;
    },
    placeOrder: function (ids) {
      if (ids.length == 0) {
        this.$Toast("您还没有选择任何商品！")
        return
      }
      this.$Loading.open()
      let url = '/app/json/ord_cart/startSettle';
      let params1 = {
        token: this.$store.state.login.token,
        totalAmount: this.totalAmount,
        ordCartIds: ids,
        groupAttr: 'storeName'
      };
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close()
        let data = res.data;
        if (data.status == 0) {
          let orderData = data.data.resultDataTwo
          let proData = orderData
          let pros = []
          for (let key in proData) {
            let arr = proData[key]
            for (let i = 0; i < arr.length; i++) {
              pros.push(arr[i])
            }
          }
          _this.$store.state._products = pros
          _this.$bridgefunc.vuexStorage(function () {
            _this.$bridgefunc.customPush({
              path: '/mallorderform',
              query: {
                type: 'cart',
                freightAmount: data.data.freightAmount,
                ordcartids: JSON.stringify(data.data.ordCartIds)
              }
            })
          })
        } else {
          _this.$Toast(data.info)
        }
      }, error => {
        _this.$Loading.close()
        _this.$Toast('获取数据失败')
      });
    }
  },
  created () {
    this.getDataList();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
$bottom-height = 50px
$select-height = 18px
$selectpdl = 24px


.Mall-ShoppingCart {
  position relative
  width 100%
  height 100%

  .position{
    width:100%;
    height:$bottom-height;
    position:absolute;
    bottom:0px;
    left:0px
    padding:0px 0px 0px 3%;
    z-index:99;
    background:#fff;
    border-top 1px solid #efefef
    /*background:red;*/

    .balance{
      overflow:hidden;
      height:100%;
      background-position:left center;
      background-repeat:no-repeat;
      background-size:$select-height $select-height;
      padding-left:$selectpdl;
      p{
        float:left;
        line-height:$bottom-height;
        font-size:$font-size-medium;
        color:$color-text;
      }
      .choseAll{
        padding:0px 15px 0px 0px;
      }
      .nochose{
        color:$color-text-l;
      }
      .goPay{
        float:right;
        width:30%;
        height:$bottom-height;
        line-height:$bottom-height;
        background-color:#fa571c;
        color:#fff;
        text-align:center;
        font-size:$font-size-medium-x;
      }
      .delStyle{
        float:right;
        margin-right:3%;
        .del{
          width:80px;
          height:40px;
          display :block;
          line-height:40px;
          text-align:center;
          margin-top:5px;
          border:1px solid $color-line-gray-l;
          border-radius:22px;
        }
      }
    }
    .unActive{
      background-image:url("../../../static/image/mall/select1.png");
    }
    .Actived{
      background-image:url("../../../static/image/mall/select2.png");
    }
  }

  .sh-content{
    position absolute
    left 0
    right 0
    bottom 0
    overflow-y hidden;
  }
  .cart-content{
    position absolute
    top 0
    left 0
    right 0
    bottom $bottom-height
    overflow-y:scroll;
    -webkit-overflow-scrolling:touch;

    .cartList{
      padding 5px 3% 10px  3%
      .listTop{
        overflow:hidden;
        background-position:0px 0px;
        background-repeat:no-repeat;
        background-size:$select-height $select-height;
        padding-left:$selectpdl;
        height:$select-height;
        margin-top 15px
        margin-bottom 10px
        .companyName{
          float:left;
          font-size:$font-size-medium;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          line-height  20px;
        }
      }
      .unSelected{
        background-image:url("../../../static/image/mall/select1.png");
      }
      .Selected{
        background-image:url("../../../static/image/mall/select2.png");
      }
      .cartChildList{
        .childItem{
          overflow:hidden;
          .listTop{
            margin-top:10px;
            margin-bottom:10px;
          }
          .goodsInfo{
            width:100%;
            padding-bottom:2px;
            margin-bottom:10px;

            overflow:hidden;
            padding-top :1px;
            .isselect{
              height:94px;
              width:8%;
              float:left;
              position:relative;
              margin-right:3px;
              .active{
                width:24px;
                height:24px;
                display:block;
                background-position:0px 0px;
                background-repeat:no-repeat;
                background-size:$select-height $select-height;
                position:absolute;
                left:3px;
                top:50%;
                margin-top:-12px;
              }
            }
            .unChose{
              .active{
                background-image:url("../../../static/image/mall/select1.png");
              }
            }
            .Chsoed{
              .active{
                background-image:url("../../../static/image/mall/select2.png");
              }
            }
            .box-shadow{
              width:90%;
              height:96px;
              padding:10px 3%;
              box-shadow:0px 0px 5px #efefef;
              overflow:hidden;
              $imgHeight = 75px
              .cover{
                float:left;
                width:$imgHeight;
                height:$imgHeight;
                border:1px solid $color-background-ll;
                margin-right:5px;
                img{
                  display:block;
                  width:100%;
                  height 100%;
                }
              }
              .desc{
                padding-left:6px;
                height $imgHeight
                overflow hidden
                position relative
                .productName{
                  font-size:$font-size-medium;
                  color:$color-text;
                  font-weight:$font-weight-m;
                  min-height:16px;
                  line-height:16px;
                  max-height 32px
                  display: -webkit-box;
                  overflow: hidden;
                  white-space: normal !important;
                  text-overflow: ellipsis;
                  word-wrap: break-word;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical
                }
                .weight{
                 /* padding:20px 0px;
                  font-size:$font-size-medium;
                  color:$color-background-l;*/
                }
                .prices_quantities{
                  overflow:hidden;
                  position: absolute;
                  bottom: 0;
                  width: 100%;
                  vertical-align middle
                  .prices{
                    float:left;
                    color:#ff6902;
                    span{
                      font-size $font-size-large-x
                      font-weight $font-weight-m
                    }
                  }
                  .quantities{
                    float:right;
                    i{
                      font-style:normal;
                      color:$color-background-l;
                      font-size:$font-size-medium;
                      float:left;
                    }

                    .subtractactive{
                      width:24px;
                      height:24px;
                      background:url("../../../static/image/mall/nu_re1.png") 0px 0px no-repeat;
                      background-size:24px 24px;
                    }
                    .subtractno{
                      width:24px;
                      height:24px;
                      background:url("../../../static/image/mall/nu_re.png") 0px 0px no-repeat;
                      background-size:24px 24px;
                    }
                    .num{
                      padding:0px 5px;
                      line-height:24px;
                    }
                    .add{
                      width:24px;
                      height:24px;
                      background:url("../../../static/image/mall/nu_add.png") 0px 0px no-repeat;
                      background-size:24px 24px;
                    }

                  }
                }
              }
            }
          }
          .goodsInfo:last-child{
            margin-bottom:0px;
          }
          /*
          .unSelected{
            background-image:url("../../../static/image/mall/select1.png");
          }
          .Selected{
            background-image:url("../../../static/image/mall/select2.png");
          }
          */
        }
      }
    }
  }

}
</style>
