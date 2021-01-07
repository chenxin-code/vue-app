/**Created by steven on 2018/4/25.*/

<template>
  <div class="ticketbot">
    <div class="top-div">
      <stnavbar  v-model="selected" >
        <stnavitem v-for="(item,index) in tabs" :key="index" :id="item.id">
          {{item.name}}
        </stnavitem>
      </stnavbar>
    </div>
    <div class="ticket-container">
      <ul class="ticket-list " v-show="selected == 'freeList'">
        <li class="item itemfree" v-if="" v-for="item in dataList.freeList" >
          <div class="item-content">
            <div class="item-img">
              <img :src="getSrc(item.imgurl)"/>
            </div>
            <div class="item-description">
              <p class="title single-line">{{item.typetitle}}</p>
              <p class="money single-line">{{item.typename}}</p>
              <p class="time ">{{item.coustartdate}}至{{item.couenddate}}</p>
            </div>
          </div>

          <div class="item-btn"  v-if="item.isdon == '1'">
            <div class="btn"   @click="giveOthers(item)">转赠</div>
            <i class="line-1"></i>
            <div class="btn" @click="enterDetail(item)">立即使用</div>
          </div>
          <div class="item-btn"  v-if="item.isdon != '1'">
            <div class="btn btn100" @click="enterDetail(item)">立即使用</div>
          </div>
        </li>
      </ul>
      <ul class="ticket-list  used-list" v-show="selected == 'usedList'">
        <li class="item" :class="{itemfree:item.state == 1,itemused:item.state != 1}" v-for="item in dataList.usedList" @click="">
          <!--<div class="item-content" @click="enterDetail(item)">-->
          <!--<div class="item-img">-->
          <!--<img :src="item.couPic"/>-->
          <!--</div>-->
          <!--<div class="item-description">-->
          <!--<p class="title single-line">{{item.couTypeTitle}}</p>-->
          <!--<p class="money single-line">{{item.couTypeSubTitle}}</p>-->
          <!--<p class="time single-line">{{item.validDate}}</p>-->
          <!--</div>-->
          <!--</div>-->
          <div class="item-content" @click="enterUsedDetail(item)">
            <div class="item-img">
              <img :src="item.imgurl"/>
            </div>
            <div class="item-description">
              <p class="title single-line">{{item.typetitle}}</p>
              <p class="money single-line">{{item.typename}}</p>
              <p class="time ">{{item.coustartdate}}至{{item.couenddate}}</p>
            </div>
          </div>
          <div class="item-btn" v-if="item.state == 1">
            <div class="btn btn100"  @click="cancelGiveOthers(item)">撤销转赠</div>
          </div>
        </li>
      </ul>
      <ul class="ticket-list used-list" v-show="selected == 'expireList'">
        <li class="item itemused" v-for="item in dataList.expireList">
          <div class="item-content">
            <div class="item-img">
              <img :src="item.imgurl"/>
            </div>
            <div class="item-description">
              <p class="title single-line">{{item.typetitle}}</p>
              <p class="money single-line">{{item.typename}}</p>
              <p class="time single-line">{{item.coustartdate}}至{{item.couenddate}}</p>
            </div>
          </div>
        </li>
      </ul>
      <ul class="ticket-list used-list" v-show="selected == 'donationList'">
        <li class="item itemused" v-for="item in dataList.donationList">
          <div class="item-content">
            <div class="item-img">
              <img :src="item.imgurl"/>
            </div>
            <div class="item-description">
              <p class="title single-line">{{item.typetitle}}</p>
              <p class="money single-line">{{item.typename}}</p>
              <p class="time single-line">{{item.coustartdate}}至{{item.couenddate}}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="present" v-show="isShareShow">
      <div class="top" @click="closeFunc()"></div>
      <div class="bottom">
        <div class="title">
          <span>赠送给好友</span>
          <i class="close-btn" @click="closeFunc()"></i>
        </div>
        <div class="position" @click="wechatShare()">
          <div class="share-way">
            <img src="../../../../static/image/elticket/zhifu2.png" class="share-btn"/>
          </div>
          <p class="share-name">微信</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast } from 'mint-ui'
import stnavbar from '@/components/commonui/st-navbar/st-navbar'
import stnavitem from '@/components/commonui/st-navbar/st-navitem'

export default {
  name: "mine-elticket",
  components: {
    Toast,
    stnavbar,
    stnavitem,
  },
  data () {
    return {
      selected:'',
      dataList:{
        freeList:[],
        usedList:[],
        expireList:[],
        donationList:[],
      },
      isShareShow:false,
      shareData:{},
      tabs:[
        {originalname:'未使用',name:'未使用',id:'freeList',pageOn:1},
        {originalname:'已使用',name:'已使用',id:'usedList',pageOn:1},
        {originalname:'已过期',name:'已过期', id:'expireList',pageOn:1},
        {originalname:'已转赠',name:'已转赠', id:'donationList',pageOn:1},
      ]
    }
  },
  watch:{
    selected(curVal,oldVal){
      this.getListData();
    },
  },
  methods: {
    getSrc:function (src) {
      let tempSrc = src + '&token='+ this.$store.state.login.token;
      return tempSrc;
    },

    getListData:function () {
      this.$Loading.open()
      let url = '';
      if(this.selected == 'freeList'){
        url = 'app/json/coupon/unusedcoupons'
      }else if(this.selected == 'usedList'){
        url = 'app/json/coupon/usedcoupons'
      }else if(this.selected == 'expireList'){
        url = 'app/json/coupon/overduecoupons'
      }else if(this.selected == 'donationList'){
        url = 'app/json/coupon/donatedcoupons'
      }

      let params1 = {
        phone:this.$store.state.login.phone,
        token:this.$store.state.login.token
      }
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close();
        let data = res.data;console.log(data)
        if(data.status == 0){
          let arr = [];
          if(Array.isArray(data.data)){
            arr = data.data;
          }
          _this.dataList[_this.selected] = arr;

          let tempTabs = _this.tabs;
          for (let i = 0; i < tempTabs.length; ++i) {
            let item = tempTabs[i]
            if(item.id == _this.selected){
              if(arr.length){
                item.name = item.originalname + '('+arr.length+')';
              }else {
                item.name = item.originalname;
              }
              break
            }
          }
          _this.tabs = tempTabs;
        }else {
          Toast({
            message: data.info,
            position: 'bottom',
            duration: 2000,
          });
        }

      }, error => {
        _this.$Loading.close();
        console.log('获取我的电子券', error)
      })
    },
    enterDetail:function (item) {
      this.$bridgefunc.newPage(
        {
          weburl:'/mineelticketfreelist?voucher='+item.voucher,
          isnativetop:item.isNavTop?item.isNavTop:1,
        });
    },
    enterUsedDetail:function (item){//已使用电子券详情
      if(item.state != 1){
        this.$bridgefunc.newPage(
          {
            weburl:'/mineelticketused?voucher='+item.voucher,
            isnativetop:item.isNavTop?item.isNavTop:1
          });
      }
    },
    giveOthers:function (item) {
      if(item.isdon != '1'){
        return;
      }
      this.$Loading.open()
      let url = 'app/json/coupon/startGive';
      let params1 = {
        couNo: item.voucher,
        phone:this.$store.state.login.phone,
        token: this.$store.state.login.token
      }
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close();
        let data = res.data;
        if(data.status == 0){
          _this.isShareShow = true;
          _this.shareData  = {};
          _this.shareData.title = data.data.couTypeTitle;
          _this.shareData.sharetext = data.data.couTypeSubTitle;
          _this.shareData.imageurl = data.data.couPic;
          _this.shareData.detailurl = data.data.linkUrl;
          _this.getListData();
        }else {
          Toast({
            message: data.info,
            position: 'bottom',
            duration: 2000,
          });
        }
      }, error => {
        _this.$Loading.close();
        console.log('转赠电子券', error)
      })
    },
    cancelGiveOthers:function (item) {
      this.$Loading.open()
      let url = 'app/json/coupon/cancelGive';
      let params1 = {
        couNo: item.voucher,
        phone:this.$store.state.login.phone,
        token:this.$store.state.login.token
      }
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close();
        let data = res.data;
        if(data.status == 0){
          _this.getListData();
        }else {
          Toast({
            message: data.info,
            position: 'bottom',
            duration: 2000,
          });
        }

      }, error => {
        _this.$Loading.close();
        console.log('撤销转赠电子券', error)
      })
    },
    closeFunc:function () {
      this.isShareShow = false;
    },
    wechatShare:function(){
      this.isShareShow = false;
      this.$bridgefunc.wechatShare(this.shareData);
    }
  },
  created () {
    let item = this.tabs[0];
    this.selected = item.id;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" type="text/stylus"  scoped>
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/regularfont.styl'

.ticketbot {
  position absolute
  top 0px
  bottom 0px
  left 0px
  right 0px
  background-color $color-background-lll

  .top-div {
    position absolute
    top 0px
    left 0px
    right 0px
    height 48px
    // -webkit-overflow-scrolling: touch;
  }
  .ticket-container {
    position absolute
    top 60px
    bottom 0px
    left 0px
    right 0px
    overflow-x hidden
    overflow-y auto
    -webkit-overflow-scrolling: touch;
  }

  .ticket-list{
    width:94%;
    margin:0 auto
    .item{
      background-size:100% 100%;
      width:100%;
      height:100%;
      /*background: #fff*/
      overflow:hidden;
      margin-bottom:10px;
      position:relative;
      .item-content{
        width:100%;
        overflow:hidden;
        .item-img{
          width:20%;
          float:left;
          img{
            display:block;
            width:100%;
          }
        }
        .item-description{
          width:76%;
          float:right;
          .title{
            font-size:$font-size-large;
            color: $color-theme-text-d;
            font-weight:$font-weight-xx;
            line-height:22px;
          }
          .money{
            font-size:$font-size-medium;
            color:#4c4948;
            -webkit-margin-before: 0em;
            -webkit-margin-after: 0em;
          }
          .time{
            color:#9fa0a0;
            font-size:$font-size-medium;

          }
        }
      }
      .item-btn{
        width:98.5%;
        padding:0px 0.5%;
        overflow:hidden;
        position:absolute;
        left:50%;
        bottom:0px;
        margin-left:-49.2%;
        background:$color-theme-text-l;
        height:50px;
        /*border-radius:0px 0px 8px 8px;*/

        .btn{
          width:50%;
          display:block;
          float:left;
          font-size:16px;
          text-align:center;
          color:#fff;
          line-height:50px;
          font-weight:500;
        }
        .btn100{
          width:100%;
        }

        .line-1{
          float:left;
          width:1px;
          height:20px;
          background:#fff;
          position:absolute
          left:50%;
          bottom:15px;
        }
      }
    }
  }

  .used-list{
    .item{
      width:100%;
      height:100%;
      background-size:100% 100%;
      overflow:hidden;
      margin-bottom:10px;
      .item-description{
        .title{
          color:#fff;
        }
      }

    }
  }
  .itemfree{
    background:url("../../../../static/image/elticket/quan_bg4.png")0px 0px no-repeat;
    border-radius:0px 0px 8px 8px;
    .item-content{
      padding:20px 5% 70px 5%;
    }
  }
  .itemused{
    background:url("../../../../static/image/elticket/quan_bg2.png")0px 0px no-repeat;
    border-radius:0px 0px 8px 8px;
    .item-content{
      padding:20px 5%;
    }
  }
  .present{
    width:100%;
    height:100%;
    position:absolute;
    left:0px;
    left:0px;
    z-index:9;
    background:rgba(0,0,0,0.2)
    .top{
      height:82%;
    }
    .bottom{
      background:#fff;
      height:18%;
      position:relative;
      .title{
        text-align:center;
        padding:5px 0px;
        background:#eee;
        position:relative
        span{
          color:#999;
          font-size:14px;
        }
        .close-btn{
          position:absolute;
          right:10px;
          top:50%;
          margin-top:-11px;
          width:22px;
          height:22px;
          background:url("../../../../static/image/mine/close-btn.png")0px 0px no-repeat;
          background-size:22px 22px;
        }
      }
      .position{
        position:absolute;
        left:0px;
        bottom:0px;
        width:100%;
        .share-way{
          text-align:center;
          .share-btn{
            display:inline-block;
            width:40px;
            height:40px;
          }
        }
        .share-name{
          text-align:center;
          color:#000;
          font-size:16px;
          font-weight:600;
        }
      }


    }
  }
}
</style>
