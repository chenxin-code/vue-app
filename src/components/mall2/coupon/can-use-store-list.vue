<template>
  <div class="coupon-list">
    <nav-top title="可用店铺" @backEvent="backEvent">
    </nav-top>
    <nav-content class="coupon-center">
      <div class="main">
        <van-dropdown-menu>
          <!--          <div class="left-top">-->
          <van-dropdown-item v-model="distance" :options="option1"/>
          <!--          </div>-->
          <div class="right-top">
            <!--            <van-search-->
            <!--              v-model="keyWords"-->
            <!--              shape="round"-->
            <!--              placeholder="请输入搜索关键词"-->
            <!--            />-->
            <div class="search-bg" @click="clickSearch">
              <div style="height: 30px;line-height: 30px;" class="search-main">
                <!--                <div class="search-icon" style="display: inline-block">-->
                <!--                  <img style="display: block;" width="16px" height="16px" src='static/images/header/search-w.png'/>-->
                <!--                </div>-->
                <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
                {{keyWords?keyWords:'请输入可用店铺'}}
              </div>
            </div>
          </div>
        </van-dropdown-menu>
        <ul class="stores-c">
          <van-list
            v-model="isLoading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="200"
            @load="loadMore">
            <li
              v-for="(item, index) in list"
              :key="index"
              class="item">
              <div class="top">
                <div class="left">
                  <img src="./scan-get-coupon/image/storelogo.png" alt="" class="prod-img">
                </div>
                <div class="center">
                  <p class="prod-name">{{ item.ouName }}</p>
                  <!--                  <p class="business-hours">时间：{{`${item.openingTime.slice(0,5)}-${item.closingTime.slice(0,5)}`}}</p>-->
                  <p class="prod-address"><van-icon name="location-o" />地址：{{item.addressFull}}</p>
                                <p class="prod-address">距离当前距离{{ $util.toDecimal2(item.distance / 1000) }}km</p>
                </div>
                <div class="right" @click="goToMap(item)">
                  <img src="./scan-get-coupon/image/banner.png" alt="" class="icon-nav">
                                    <span class="prod-distance">导航</span>
                </div>
              </div>
            </li>
          </van-list>
        </ul>
      </div>
      <van-dialog v-model="show" title="使用授权协议及免责申明" show-cancel-button confirmButtonText="同意并继续"  @confirm="enter">
        <div v-html="content" class="content"> {{content}}</div>

      </van-dialog>
    </nav-content>

  </div>
</template>
<script>
  import {DropdownMenu, DropdownItem,Dialog} from 'vant'
  import store from "../../../vuex/store";
  import Search from '@/components/mall2/common/search';
  import mallCommon from "../../../utils/mall2";
  import util from "../../../utils/util";
  import router from "../../../router";
  import QRCode from "qrcode";
  import ClipboardJS from "clipboard";
  import Verify from '@/components/commonui/common-verify/index'
  export default {
    name: "",
    components: {
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem
    },
    watch: {
      distance() {
        this.list=[]
        this.search();
      },
      // keyWords() {
      //   this.list=[]
      //   this.search();
      // },
    },

    data() {
      return {
        dynamicCode:null,
        totalPage:null,
        pageInfo: {
          page: 0,
          rows: 10
        },
        list:[],
        show:false,
        content:null,
        isLoading:false,
        finished:false,
        distance: 5000,
        keyWords: null,
        coupon: {},
        currentObj:{},
        option1: [
          {text: '5KM', value: 5000},
          {text: '10KM', value: 10000},
          {text: '20KM', value: 20000},
          {text: '50KM', value: 50000},
          {text: '100KM', value: 100000},
          {text: '全部', value: ''},
        ]
      }
    },
    created() {
      this.coupon = this.$route.query
      this.loadMore()
      this.getInfo()
    },
    methods: {
      clickSearch(){
        var that=this
        Search.open({
          initData: {
            barHeight: store.state.barHeight,
            searchHistory: [],
            flag:false,
            text:'可用店铺'
          },
          clearSearchHistory: () => {
            store.state.mall2.searchHistory = []
          },
          searchEvent: (searchStr) => {
            console.log(searchStr,'searchStr')
            Search.close()
            that.keyWords=searchStr
            // if (searchStr == '') {
            //   return;
            // }
            console.log(searchStr)
            // mallCommon.pushSearchHistory(searchStr)
            that.list=[]
            that.search();

          }
        })
      },
      goToMap(item) {
        console.log(item,this.$store.state)
        this.$bridgefunc.baiduNav(
          {
            startlong: this.$store.state.currentLocation.posx,
            startlat: this.$store.state.currentLocation.posy,
            endlong: item.posx,
            endlat: item.posy,
            type: "nav"
          }
        );
      },
      loadMore(){
        this.isLoading = true;
        this.pageInfo.page++;
        this.$Loading.open();
        let params = {
          couTypeCode: this.coupon.couTypeCode,
          getType: '1',// 百度或腾讯
          posx: this.$store.state.currentLocation.posx,
          posy: this.$store.state.currentLocation.posy,
          distLess:this.distance,
          storeOuName:this.keyWords,
          ...this.pageInfo
        }
        this.$http.post('/app/json/coupon/queryCanUseCouStoreList', params).then(res => {
          let data = res.data
          console.log(res)
          this.isLoading = false;
          if (data.status == 0) {
            console.log(this,"this")
            this.totalPage=res.data.totalPages
            //页码达到最大页码数不再请求
            if(this.totalPage==this.pageInfo.page){
              this.finished = true;
            }
            if(Object.prototype.toString.call(res.data.data)=="[object Array]"){
              this.list.push(...res.data.data)
            }else{
              this.finished = true;
            }
            // this.list= res.data.data
            // this.finished = true;
          } else {
            this.$Toast(data.info)

          }
          this.$Loading.close();
        }).catch((err) => {
          this.$Toast(err)
          this.finished = true;
        })

      },
      backEvent() {
        if (this.$route.query.type == 'subject') {
          this.$router.push({
            path: '/questionlist'
          })
        } else if (this.$route.query.type == 'serviceSubject') {
          this.$router.push({
            path: '/service/questionlist'
          })
        } else if (this.$route.query.type == 'equity_car') {
          this.$router.push({
            path: '/equity_card/equityList'
          })
        } else {
          this.$router.go(-1)
        }
      },
      getInfo(){
        let params = {

        }
        this.$http.post('/app/json/news/getNewsList?values=64', params).then(res => {
          let data = res.data
          console.log(res)
          if (data.status == 0) {
            this.content=res.data.data[0].content
          } else {
            this.$Toast(data.info)
          }
        }).catch((err) => {
          this.$Toast(err)
        })
      },
      search(){
        this.pageInfo.page=0
        this.loadMore()
      },
      getMyCouInfo() {
        if (this.$store.state.globalConfig.couponOpenVerify == '1') {
          Verify.open({
            type: 'coupon_verify',
            sureFunc: this.imgSureFunc,
            vertifyCancelEvent: () => {
              this.$router.go(-1)
            },
            paras:{
              phone: this.$store.state.login.phone
            }
          })
        } else {
          this.couponRequest(null, null);
        }
      },
      imgSureFunc:function(verifyCode,uuid) {
        this.couponRequest(verifyCode,uuid);
        // this.$emit('getSmsEvent',imgVerifyCode,uuid);
      },
      couponRequest: function (imgVerifyCode, uuid) {
        this.$Loading.open();
        let couNo = this.isGroupCoupon ? this.couponList[this.ind].couNo : this.$route.query.couNo
        let paramsData = {
          token: this.$store.state.login.token,
          couNo: couNo
        }
        if (imgVerifyCode != null && uuid != null) {
          paramsData.type = '20000'
          paramsData.imgVerifyCode = imgVerifyCode
          paramsData.uuid = uuid
          paramsData.couNo=this.coupon.couNo
        }
        this.$http.post(`/app/json/coupon/getMyCouInfo`, paramsData).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            console.log(data.data,"data.data")
            this.dynamicCode=data.data.dynamicCode
            // 跳转闪洗客页面
            window.location.href='http://mobile.shinexiche.com/welcome_wash?storeOuCode='+this.currentObj.storeCode+'&phone='+this.$store.state.login.phone+'&couNo='+this.coupon.couNo
            // this.couponDetail = data.data || {}
            // this.$nextTick(() => {
            //   QRCode.toCanvas(document.getElementById('qrcode'), this.couponDetail.dynamicCode || '', {width: 240})
            //   if(this.$refs.copybtn){
            //     this.copyBtn = new ClipboardJS(this.$refs.copybtn);
            //   }
            // })
          } else {
            if (this.$store.state.globalConfig.couponOpenVerify == '1') {
              this.$Toast("验证码验证失败，请重试！")
              this.getMyCouInfo()
            }
          }
        })
      },
      enter(){
        console.log(this.$store.state.login,'this.$store.state.login')
        window.location.href='http://mobile.shinexiche.com/welcome_wash?storeOuCode='+this.currentObj.storeCode+'&phone='+this.$store.state.login.phone+'&couNo='+this.coupon.couNo
        // window.location.href='http://mobile.shinexiche.com/welcome_wash?storeOuCode='+this.currentObj.storeCode+'&phone='+this.dynamicCode+'&couNo='+this.coupon.couNo
        // this.getMyCouInfo()
        // let dynamicCode=null
        // this.$http.post('/app/json/coupon/getMyCouInfo', {couNo:this.coupon.couNo }).then(res => {
        //   let data = res.data
        //   console.log(res)
        //   if (data.status == 0) {
        //     dynamicCode=res.data.dynamicCode
        //   } else {
        //     this.$Toast(data.info)
        //   }
        // }).catch((err) => {
        //   this.$Toast(err)
        // })
        // this.$router.push({
        //   path: '',
        //   query: {
        //     code:this.coupon.couTypeCode,
        //     storeCode:this.currentObj.storeCode
        //   }
        // })
      },
      useBenefits(item){
        this.show=true
        this.currentObj=item

      },
    }
  }
</script>

<style lang="stylus" scoped>
  .left-top {
    width 20%
  }

  .right-top {
    width 80%
  }

  /deep/ .van-dropdown-item__content {
    display flex
    flex-wrap wrap
  }

  /deep/ .van-dropdown-item__option {
    width 33%
    text-align center !important
  }
  /deep/ .van-ellipsis{
    width 50px
  }
  .stores-c {
    margin-top 20px
    height calc(100% - 70px)
    overflow-y scroll

    .item {
      border-radius 5px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 1);
      margin 20px

      &:first-child {
        margin-top 0
      }

      .top {
        display flex;
        align-items flex-start;
        padding 10px
      }

      .left {
        .prod-img {
          display block;
          width 75px;
          height 75px;
          // border 1px dashed #ddd;
          border-radius 4px;
          padding 5px
        }
      }

      .center {
        flex 1;
        padding 0 10px;
        display flex;
        flex-direction column;
        justify-content space-around;

        .prod-name {
          font-size 15px;
          font-weight 500;
          line-height 18px;
          ellipse-2();
          max-width: 165px;
          word-break: break-all;
        }

        .prod-address {
          font-size 13px;
          font-weight 400;
          color #9FA0A0;
          line-height 16px;
          margin-top 7px;
        }

        .business-hours {
          font-size 13px;
          font-weight 400;
          color #9FA0A0;
          margin-top 7px;
        }
      }

      .right {
        extend-click();

        .icon-nav {
          display block;
          width 20px;
          height 20px;
          margin 0 auto;
        }

        .prod-distance {
          display block;
          font-size 13px;
          color #9FA0A0;
          /*margin-top 8px;*/
        }
      }

      .van-button {
        width: 80px
        height 30px
        line-height: 20px;
        margin-left 10px

        .van-button__text {
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 400;
          color: white;
          line-height: 20px;
        }
      }

      .bottom {
        padding 10px 10px
        display flex
        justify-content: space-between;
        align-items: baseline;

      }

      .line {
        display block
        height: 1px;
        background: rgba(220, 221, 221, 1);
        margin 0 10px
      }
    }
  }
  .main{
    height 100%
    /*overflow scroll*/
  }
  .content{
    padding 20px
    max-height 500px
    overflow-y scroll
  }
  .search-bg {
    display: flex;
    align-items center;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    overflow: hidden;
    padding: 6px 15px;
    .mall-sousuo{
      vertical-align middle
    }
    .search-main {
      flex: 1;
      padding-right 10px;
      color #333;
      font-size 14px;
      background: #f5f5f5;
      border-radius: 15px;
      text-indent: 10px;
      height: 30px;
      line-height: 30px;
      .search-icon{
        vertical-align: middle;
      }
    }
  }
  /deep/.van-dropdown-menu{
    align-items center
  }
  /deep/ .van-button--info{
    border: 1px solid rgb(240, 44, 45);
  }
  /deep/ .van-list{
    padding-top 5px
  }
  .icon{
    width 16px;
    height 16px;
    display inline-block;
    background url("./scan-get-coupon/image/car.png")
    background-size contain
    margin-right 10px
    vertical-align: middle;
  }
  .right{
    display flex;
    align-items center
    flex-direction: column;
  }
  .main .van-dropdown-menu {
    display flex
  }
  /deep/.van-dropdown-menu__bar{
    box-shadow none!important
  }
</style>
