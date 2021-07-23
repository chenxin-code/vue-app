<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="选择收货地址"></nav-top>
    <nav-content style="display:flex;flex-direction:column;background:#f6f6f6;">
      <div class="input-box">
       <input type="text" v-model="searchVal" placeholder="当前商品可选提货地点" style="width:100%;height:100%">
      </div>
      <div class="pick_up_address" style="flex:1;height:0;overflow:auto;">
        <div class="master-info-list" v-for="(item,index) in list" :key="index" @click="changePlace(item,index)">
          <div class="asyncSrc">
            <img src="https://times-mall-uat.oss-cn-shenzhen.aliyuncs.com/0ed8ff39422447d68f3c16234519df2d.jpg" alt="">
          </div>
          <div class="asyncBox">
            <div class="asyncBox-ul">
              <div class="asyncBox-ul-dd">
                <div class="mas-name">
                  {{item.teamLeaderName}}
                </div>
                <div class="sign" v-if="item.userNo == defaultID">
                  默认
                </div>
              </div>
              <div class="asyncBox-ul-dt">
                <div class="asyncBox-ul-dt-place">提货地点：{{item.cucName}} {{item.cudName}}{{item.cuName}}{{item.teamLeaderAddress}}</div>
                <div class="asyncBox-ul-dt-icon">
                  <img src="./components/channelSearch/arrow.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  name: "confirmOrder",
  props: {},
  data() {
    return {
      list:[],
      sign:0,
      searchVal:"",
      defaultID:''
    }
  },
  created() {
    this.getList();
    this.defaultID = this.$store.state.CharseInfo.masterPlace.userNo;
  },
  methods: {
    changePlace(item,index){
      this.sign = index;
      this.$store.commit("setCharseInfo",{
        masterPlace:item
      });
      this.defaultID = item.userNo;
      this.$router.go(-1);
    },
    getList(){
      let url = `/app/json/group_buying_head_info/findHeadInfoByList?validState=true&sortBy:headWeight_DESC&activityId=${this.$store.state.CharseInfo.activityId}&cuNo=${this.$store.state.communityId}`;
      this.$http.get(url).then(res => {
        if(res.data.status == 0)this.list = res.data.data.records;
      }).catch(e=>{
        console.log(e);
      })
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.body {
  width: 100%;
  height: 100%;
  overflow: auto;
  .input-box {
    height: 32px;
    font-size 14px
    line-height 20px
    background: #FFFFFF;
    box-shadow: 0 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 10px 0;
    padding-left: 10px;
    color #666666
  }
  .pick_up_address{
    padding:0 10px;
    box-sizing:border-box;
  }
  .master-info-list{
    width:100%;
    min-height: 100px;
    background: #FFFFFF;
    box-shadow: 0 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 8px;
    display:flex;
    display :flex;
    align-items :center;
    padding: 15px;
    margin-top:15px;
    .asyncSrc{
      width: 65px;
      height: 65px;
      border-radius:50%;
      overflow :hidden;
      flex-sharink:0;
      margin-left:10px;
      img{
        width:100%;
        height:100%;
      }
    }
    .asyncBox{
     height:100%;
     flex: 1;
     flex-sharink:0;
    }
    .asyncBox-ul{
      width:100%;
      height:100%;
      color:#666666;
      font-size:14px;
      display:flex;
      flex-direction :column;
      .asyncBox-ul-dd{
        width:100%;
        display :flex;
        justify-content :space-between;
        padding:0 15px;
        box-sizing boreder-box;
        flex:4;
        flex-sharink:0;
        display:flex;
        align-items :center;
        justify-content :space-between;
        .mas-name{
          width:80%;
        }
        .sign{
          padding: 2px ;
          border:1px solid #B52232;
          border-radius:2px;
          color:#B52232;
        }
      }
      .asyncBox-ul-dt{
        flex:6;
        flex-sharink:0;
        width:100%;
        display :flex;
        justify-content :space-between;
        padding:0 15px;
        box-sizing boreder-box;
      }
      .asyncBox-ul-dt-place{
        width:80%;
        line-height:1.3;
      }
      .asyncBox-ul-dt-icon{
        img{
          width:8px;
        }
      }
    }
  }
}
</style>

