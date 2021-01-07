<template>
  <div>
    <nav-top title="我的先享卡" @backEvent="goback"></nav-top>
    <nav-content>
      <div class="content" :style="bgUrl">
        <img class='tip' src="./images/share-title.png" alt="">
        <h2 @click='show=true'>
          邀请记录
        </h2>
        <div class="footer">
          <div class="btn" @click="getCard"></div>
          <div class="btn" @click='shareCard'></div>
        </div>
      </div>
      <van-popup class='popup'  position="bottom" closeable round :style="{ height: '60%', background: '#FFEFDA' }"  v-model="show">
        <h2>我的邀请记录</h2>
        <div class="table">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            class="search-list"
          >
          <div class="row title">
            <div class="col col1">序号</div>
            <div class="col">用户手机号</div>
            <div class="col col2">领卡时间</div>
            <div class="col">履约状态</div>
            <div class="col">完成约定次数</div>
          </div>
          <div class="row t-content" v-for="(item,index) in list" :key='index'>
            <div class="col col1">{{index + 1}}</div>
            <div class="col">{{item.applyPhone}}</div>
            <div class="col col2">{{item.getTime}}</div>
            <div class="col">{{item.state | state}}</div>
            <div class="col">{{item.completeCnt || 0}}次</div>
          </div>
          </van-list>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
import Config from '@/api/config'
  export default {
      data(){
        return {
          show: false,
          page: 0,
          rows: 10,
          totalAmount: 0,
          loading: false,
          finished: false,
          dataInfo:{},
          list:[]
        }
      },
      created() {

        this.onLoad()
        this.getInfo()
      },
     methods:{
      goback() {
        this.$router.go(-1)
      },
      getCard() {
        this.$Loading.open()
        let obj = {
          invited: 1,
          referrerUserId: this.$route.query.userId,
          discountCardId: this.dataInfo.id
        }
        this.$http.post("/app/json/wx_discount_card/applyDiscountCard",obj).then(res=>{
          this.$Loading.close()
          console.log(res,'res')
          let data = res.data;
          if(data.status == 0) {
            if(data.data && data.data.prepare_card_token) {
              this.goForCard(data.data.prepare_card_token)
            } else {
              this.$toast("未获取到先享卡token")
            }
          } else {
            this.$toast(data.info)
          }
        }).catch(err=>{
          console.error(err);
          this.$Loading.close()
        })
      },
      getInfo() {
        this.$http.post("/app/json/wx_discount_card/getShareableCard").then(res=>{
          let data = res.data;
          if(data.status == 0) {
            this.dataInfo = data.data || {}
          } else {
            this.$toast(data.info)
          }
        })
      },
      goForCard(val) {
        wx.navigateToMiniProgram({
          appId: 'wxcc2e4fbc5887661e',
          path: `/pages/get-card/get-card?prepare_card_token=${val}`
        })
      },
      shareCard() {
        // console.log("分享卡片")
        // sharedBGP;           //  分享邀请页背景
        // guideRemarks;        //  领卡引导文案
        // appSharedBGP;        //  app分享邀请页背景
        // appGuideRemarks;     //  app领卡引导文案
        let shareData = {
          title: this.dataInfo.appGuideRemarks,
          // sharetext: this.dataInfo.guideRemarks,
          imageurl: this.dataInfo.appSharedBGP,
        }
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + this.$route.fullPath+"?userId="+this.$store.state.userInfo.userId
        this.$bridgefunc.wechatShare(shareData)
        
      },
      onLoad() {
        this.$Loading.open();
        this.page ++;
        let paramsData = {
          page: this.page,
          rows: this.rows,
          cardTemplateId: this.dataInfo.cardTemplateId,
        }
        this.$http.post("/app/json/wx_discount_card/getUserInvite",paramsData).then(res=>{
           let data = res.data
          if (data.status == 0) {
            const list = data.data || []
            this.list = this.list.concat(list)
            if (this.list.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.Loading = false
          this.$Loading.close()
        }).catch(err=>{
          this.$Loading.close()
        })
      }
    },
    filters:{
      state(val) {
        let str = ''
        switch(val) {
          case 'ONGOING':
            str = '约定进行中'
            break;
          case 'CHECKING':
            str = '到期核对中'
            break;
          case 'FINISHED':
            str = '已完成约定'
            break;
          case 'UNFINISHED':
            str = '未完成约定'
            break;
        }
        return str;
      }
    },
    computed:{
      bgUrl() {
        let styl = {}
        if ((this.dataInfo.sharedBGP)) {
          styl = {backgroundImage: `url(${this.dataInfo.sharedBGP})`}
        } else {
          styl = {backgroundImage: `url(${require('./images/share-bg.png')})`}
        }
        return styl
      }
    }
  }
</script>

<style lang="stylus" scoped>
.content{
  height: 100%;
  background-repeat:no-repeat;
  background-size: 100% 100%;

  .tip{
    width: 70%;
    position absolute;
    top: 18%;
    left: 50%;
    transform: translateX(-50%)
  }
  h2{
    color: #fff;
    text-align: right;
    font-size: 15px;
    line-height: 40px;
    padding: 0 10px;
  }
  .footer{
    height: 100px;
    position absolute;
    bottom: 0;
    left: 0;
    width:100%;
    display: flex;
    justify-content: space-around;
    .btn{
      width: 42%;
      height: 50px;
      background: url(./images/share-btn.png) no-repeat;
      background-size: 100% 100%;
      &:nth-child(1) {
        background-image: url(./images/get-btn.png);
      }
    }
  }
  
}
 .popup{
    h2{
      text-align center;
      font-size: 16px;
      line-height: 46px;
      font-weight: 600;
      color: #333333;
    }
    .table{
      .row{
        display: flex;
        padding: 0 8px;
        justify-content: space-between;
        &:nth-child(2n-1){
          background-color: #FE987E; 
        }
        &.title{
          color: #fff;
        } 
        .col{
          flex: 20%;
          text-align center;
          line-height: 32px;
          font-size: 12px;
          transform: scale(0.9);
          white-space: nowrap;
        }
        .col1{
          flex: 10%;
        }
        .col2{
          flex: 30%;
        }
      }
    }
  }
</style>