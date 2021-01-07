<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="navclass">
      <div class="donate-result">
        <img src="./img/thanks.png" />
        <div class="thanks">感谢捐赠</div>
        <div class="donate-name">{{donateItem.projectName}}</div>
        <div class="goHomeBtn" @click="goHome">返回首页</div>
      </div>
      <div class="other-donate">其他爱心项目</div>
      <div class="list-root">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <div v-if="loveItems && loveItems.length>0">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
              <van-cell v-for="item in loveItems" :key="item.index">
                <div class="item-cell">
                  <img class="item-img" :src='item.projectPic'/>
                  <div class="item-bottom">
                    <div>
                      <div class="name-title">{{item.projectName}}</div>
                      <div class="item-left">{{item.attendPersonCnt==''?0:item.attendPersonCnt}}人已捐</div>
                    </div>
                    <div class="item-right" @click="toDonate(item)">我要捐助</div>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </div>
          <div class="donate-null" v-else>
            <img src="./img/data_null.png" />
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
      loveItems: [],
     refreshing: false,
      loading: false,
      finished: false,
      currentPage:1,
      donateItem:'',
    };
  },
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
    goHome() {
      this.$router.replace({ path: "/donate-home", query: {} });
    },
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
            this.loveItems.forEach((e,index,arr)=>{
              if(e.id == this.donateItem.id){
                arr.splice(index,1);
              }
            })
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
  },
  created() {
    this.donateItem = this.$route.query.donateItem;
    this.onRefresh();
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
.navclass {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  background-color: #F6F6F6;
  padding: 10px 10px 0px 10px;
  overflow-y:scroll;

  .donate-result {
    background-color: white;
    min-height: 156px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0px;

    img {
      width: 45px;
    }

    .thanks {
      margin-top: 10px;
      font-size: 15px;
      color: #333333;
      font-weight: 400;
    }

    .donate-name {
      margin-top: 7px;
      color: #666666;
      font-size: 12px;
    }

    .goHomeBtn {
      background-color: #F02C2D;
      margin-top: 12.5px;
      color: white;
      font-size: 15px;
      font-weight: 500;
      border-radius: 17.5px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      width: 130px;
    }
  }

  .other-donate {
    margin-top: 10px;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
  }

  .list-root {
    margin: 10px 10px 0px 10px;
    flex:1;
    >>>.van-pull-refresh {
      height:100%;
    }
    >>>.van-cell {
      padding: 0px 0px 0px 0px;
      border-radius: 5px;
      background-color: #F6F6F6;
      margin-bottom: 10px;
      height: 171.5px;
    }

    .item-cell {
      background-color: white;
      height: 171.5px;

      .item-img {
        width: 100%;
        height: 120px;
      }

      .item-bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 33px;
        font-size: 14px;
        color: #333333;
        margin: 5px 0px 0px 10px;

        .name-title {
          color: #333333;
          font-size: 14px;
          height: 14px;
          font-weight: 500;
        }

        .item-left {
          margin-top: 7px;
          width: 150px;
          color: #999999;
          font-size: 12px;
        }

        .item-right {
          width: 60px;
          height: 25px;
          font-size: 12px;
          text-align: center;
          margin-right: 10px;
          color: white;
          background-color: #F02C2D;
          border-radius: 12.5px;
        }
      }
    }
  }

  .donate-null {
    width: 100%;
    display: flex;
    margin: 17.5px auto 0px auto;
    flex-direction: column;
    align-items: center;

    img {
      width: 177.5px;
    }

    div {
      text-align: center;
      font-size: 13px;
      margin: 9px 0 auto 0;
      color: #333333;
    }
  }
}
</style>
