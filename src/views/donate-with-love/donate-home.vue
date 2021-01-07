<template>
  <div>
    <nav-top title="爱心捐赠" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="navclass">
              <div class="bannner-back">
          <div class="div-h5" v-html="bannerContent"/>
          <!-- src = './img/banner.png'/> -->
          <div class="donate-his" @click="donateHistory">捐赠记录</div>
        </div>
        <div class="donate-record">
            <div class="currenttimes">目前已凝聚<span>{{donateTotalCnt==''||donateTotalCnt == 0 ?'0':donateTotalCnt}}</span>次爱心捐赠</span></div>
            <div class="line-row"/>
            <div class="attemt-count">
              <div class="joined-count">
                已参与捐助项目数
                <span>{{attendProCnt==''||attendProCnt == 0 ?'0':attendProCnt}}</span>
              </div>
              <div class="donate-count">
                已捐助爱心积分
                <span>{{donateUnit==''||donateUnit == 0 ?'0':donateUnit}}</span>
              </div>
            </div>
        </div>
        <div class="list-root">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <!-- <div v-if="loveItems && loveItems.length>0"> -->
                <van-list
                  v-if="loveItems && loveItems.length>0"
                  :immediate-check='false'
                  v-model="loading"
                  :finished="finished"
                  :offset="10"
                  finished-text="没有更多了"
                  @load="loadMore"
                  >
                  <van-cell v-for="item in loveItems" :key="item.index">
                    <div class="item-cell">
                      <img class="item-img" :src='item.projectPic' />
                      <div class='item-bottom'>
                        <div>
                          <div class="name-title">{{item.projectName}}</div>
                          <div class="item-left">{{item.attendPersonCnt==''?0:item.attendPersonCnt}}人已捐</div>
                        </div>
                        <div class="item-right" @click="toDonate(item)">我要捐助</div>
                      </div>
                    </div>
                  </van-cell>
                </van-list>
              <!-- </div> -->
              <div class='donate-null' v-else>
                <img src='./img/data_null.png'/>
                <div>当前暂无需要捐赠的爱心项目~</div>
              </div>
          </van-pull-refresh>
        </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      loveItems:[],
      refreshing: false,
      loading: false,
      finished: false,
      donateTotalCnt:0,//捐赠总次数
      attendProCnt:0,//参与项目数
      donateUnit:0,//捐赠积分
      bannerContent:'',
      currentPage:1,
    };
  },
  // beforeRouteEnter(to,from,next) {
  //     debugger
  //     console.log('');
  // },

  methods: {
    loadMore() {
        if(this.refreshing){
            this.refreshing = false;
        }
        this.donationList(false);
    },
    onRefresh() {
      // 清空列表数据
      if(this.loading){
            this.loading = false;
        }
      this.donationList(true);
    },
    donationSumInfo(){
      let url = '/app/json/app_love_donation/queryLoveDonationSumInfo';
      this.$Loading.open();
      this.$http.post(url,{}).then(res=>{
        this.$Loading.close();
        let {status,info,data} = res.data;
        if(status == 0){
            this.donateTotalCnt = data.donateTotalCnt;
            this.attendProCnt = data.attendProCnt;
            this.donateUnit = data.donateUnit;
        }else{
            this.$Toast(info);
        }
      }).catch(err=>{
        this.$Loading.close();
        this.$Toast('出错了～');
      });
    },
    //
    donationList(isRefresh){
      let page;
      let rows = 10;
      if(isRefresh){
         page = 1;
      }else{
         page = this.currentPage + 1;
      }
      this.$Loading.open();
      let url = '/app/json/app_love_donation/queryLoveDonationList';
      let params = {page:page,rows:rows};
      this.$http.post(url,params).then(res=>{
          this.$Loading.close();
          let {status,info,data} = res.data;
          if(status == 0){
            this.currentPage = page;
            if(data.length<rows){
              this.finished = true;
            }else{
              this.finished = false;
            }
            this.loading = false;
            this.refreshing = false;
            if(isRefresh){
               this.loveItems = data;
            }else{
               data.forEach(element => {
                  this.loveItems.push(element);
               });
            }
          }else{
              this.$Toast(info);
          }
      }).catch(err=>{
          this.$Loading.close();
      });
    },
    toDonate(item) {
      //去捐助
      this.$router.push({path:'/donate-detail',query:{donateItem:item}});
    },
    donateHistory(){
      this.$router.push({path:'/donate-history',query:{}});
      //捐赠记录
    },
    donateBanner(){
      let url = '/app/json/news/getNewsList';
      let data = {values:53};
      this.$http.get(url,{params:data}).then(res=>{
        // bannerContent
        let {status,info,data} = res.data;
          if(status == 0){
             this.bannerContent = this.$util.replaceH5Img(data[0].content);
          }else{
              this.$Toast(info);
          }
      }).catch(err=>{
          this.$Toast(err);
      });
    }
  },
  created() {
    this.donateBanner();
    this.donationSumInfo();
    this.onRefresh();
  }

};
</script>
<style lang="stylus" scoped type="text/stylus">
.navclass {
    display: flex;
    flex-direction: column;
    background-color:#F6F6F6;
    // overflow:scroll;
    overflow-y:scroll;
    .bannner-back {
      width: 100%;
      height: 100px;
    .donate-his{
        position:absolute;
        background-color:white;
        border-radius:10px;
        top:10px;
        right:10px;
        min-width:60px;
        height:20px;
        font-size:12px;
        color:#246DF4;
        line-height:20px;
        text-align:center;
        z-index:5;
      }
      .div-h5 {
        display: block;
        width: 100%;
        height:145px;
        margin: auto auto;
      }
    }
    .donate-record {
          background-color: white;
          margin-left:10px;
          margin-right:10px;
          border-radius:5px;
          height: 110px;
          .currenttimes {
            margin-top:10px;
            text-align: center;
            color:#333333;
            font-size: 12px;
            span{
              margin-left:5px;
              margin-right:5px;
              font-size:15px;
              color:#F02C2D;
            }
          }
          .line-row {
            height:0.7px;
            margin:10px 10px 0 10px;
            background-color:#DCDDDD;
          }
      .attemt-count {
        display:flex;
        flex-direction:row;
        margin-top:20px;
        .joined-count {
          display:block;
          width:50%;
          color:#000000;
          text-align:center;
          font-size:13px;
          span {
            margin-top:6px;
            display: block;
            color:#F02C2D;
            font-size:24px;
          }
        }
        .donate-count {
          width:50%;
          text-align:center;
          font-size:13px;
          span {
            margin-top:6px;
            display: block;
            color:#F02C2D;
            font-size:24px;
          }
        }
      }
    }
  .list-root {
    margin:10px 10px 0px 10px;
    flex:1;
    >>>.van-pull-refresh {
      height:100%;
    }
    >>>.van-cell {
      padding 0px 0px 0px 0px;
      border-radius:5px;
      background-color:#F6F6F6;
      margin-bottom:10px;
      height:171.5px;
    }
    .item-cell {
     background-color:white;
     height:171.5px;
     .item-img{
       width:100%;
       height:120px;
     }
     .item-bottom{
       display:flex;
       flex-direction:row;
       justify-content:space-between;
       align-items:center;
       height:33px;
       font-size:14px;
       color:#333333;
       margin:5px 0px 0px 10px;
      //  margin-left:10px;
       .name-title {
         color:#333333;
         font-size:14px;
         height:14px;
         font-weight:500;
       }
       .item-left {
          margin-top:7px;
          width:150px;
          color:#999999;
          font-size:12px;
       }
       .item-right {
          width:60px;
          height:25px;
          font-size:12px;
          text-align:center;
          margin-right:10px;
          color:white;
          background-color:#F02C2D;
          border-radius:12.5px;
       }
     }
    }
  }
  .donate-null {
    width:100%;
    display:flex;
    margin:17.5px auto 0px auto;
    flex-direction:column;
    align-items:center;
     img {
        width: 177.5px;
      }
      div {
        text-align:center;
        font-size: 13px;
        margin: 9px 0 auto 0;
        color: #333333;
      }
  }

}
</style>
