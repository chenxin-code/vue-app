<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="navclass">
      <div class="list-root">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <div v-if="loveItems && loveItems.length>0">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check='false'
 @load="loadMore">
              <van-cell v-for="item in loveItems" :key="item.index">
                <div class="item-cell">
                      <div class="name-title">{{item.unitName}}</div>
                      <div class="item-count">捐赠数量：{{item.payPoints}}</div>
                      <div class="item-donate-time">捐赠时间：{{item.completeTime}}</div>
                </div>
              </van-cell>
            </van-list>
          </div>
          <div class="donate-null" v-else>
            <img src="./img/data_null.png" />
            <div>当前暂无捐赠记录~</div>
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
      currentPage:0
    };
  },
  methods: {
    loadMore() {
        if(this.refreshing){
            this.refreshing = false;
        }
        this.donateHistory(false);
    },
    onRefresh() {
     // 清空列表数据
        if(this.loading){
          this.loading = false;
        }
      this.donateHistory(true);
    },
    donateHistory(isRefresh){
      let page;
      let rows = 10;
      if(isRefresh){
         page = 1;
      }else{
         page = this.currentPage + 1;
      }
      let url = '/app/json/shopping_donate/queryOrder';
      let params = {page:page,rows:rows,state:3,orderType:'200001010002'};
      this.$Loading.open();
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
               this.loveItems = data==''?[]:data.orderList;
            }else{
               data.orderList.forEach(element => {
                  this.loveItems.push(element);
               });
            }
          }else{
              this.$Toast(info);
          }
      }).catch(err=>{
          this.$Loading.close();
          this.$Toast('出错了～');
      });
    }
  },
  created() {
    this.donateHistory(true);
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
.navclass {
  display: flex;
  flex-direction: column;
  background-color: #F6F6F6;
  overflow-y:scroll;
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
      height: 79px;

      .item-cell {
        background-color: white;
        height: 79px;
        display: flex;
        flex-direction: column;
        padding: 10px 10px;
          .name-title {
            color: #333333;
            font-size: 14px;
            height: 14px;
            font-weight: 500;
          }
          .item-count {
            margin-top:5px;
            color: #666666;
            font-size: 12px;
            height: 14px;
          }
          .item-donate-time {
            margin-top:5px;
            color: #666666;
            font-size: 12px;
            height: 14px;
          }
      }
    }
  }
  .donate-null {
    width:100%;
    display:flex;
    margin:70px auto 0px auto;
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
