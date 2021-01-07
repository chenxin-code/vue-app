<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="store-detail">
      <div class="img-con">
        <img :src="item.imageUrl" alt="">
      </div>
      <div class="main">
        <div class="title">{{item.storeName}}</div>
        <div class="time"><img src="../userimgs/icon-time.png" alt="">{{item.openingTime}}</div>
        <div class="address"><img src="../userimgs/icon-local.png" alt="">{{item.addressFull}}
        </div>
      </div>
      <div class="facility">
        <div class="title">设施</div>
        <div class="facility-list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="icon"><img src="../userimgs/select.png" alt=""></div>
            <div class="name">支持虚拟卡</div>
          </div>
        </div>
      </div>
      <div class="tip">
        <div class="title">服务须知</div>
        <div class="content">
          标准服务时间：2.0小时 2周岁以下儿童免费
          不同机场休息室的登机提醒服务以实际提供的服务为准，请您到达贵宾厅后，情务必咨询现场工作人员确认，以免误机。
          (具体操作以该休息室相关规定为准)
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
    export default {
        name: "storeDetail",
        components: {},
        data() {
            return {
              item:{},
              list:[
                {},{},{},{}, {},{},{},{}
              ]
            }
        },
        methods: {
          getInfo(){
            let params = {
                     id:this.$route.query.id
                    }
                    this.$http.post("/app/json/equity_card/queryStoreDetail", params).then(res => {
                      let data = res.data
                      if (data.status == 0) {
                      this.item=res.data.data
                      } else {
                        this.$Toast(data.info)
                      }
                    }).catch((err) => {
                      this.$Toast(err)
                    })
          }
        },
      mounted() {
          this.getInfo()
      }
    }
</script>

<style lang="stylus" scoped>
  .store-detail{
    overflow scroll
  }
.facility,.tip{
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1);
  border-radius:5px;
  margin 13px 20px
  padding 15px 12px
  .facility-list{
    display flex;
    justify-content space-between
    margin-top 15px
    flex-wrap wrap
    align-content:space-between
  }

  .item{
    width 23%
    height 40px
    margin-bottom 10px
    .icon{
      height 20px
      position relative
      margin-bottom 8px
      img{
        top 0
        left 0
        bottom 0
        right 0
        margin auto
        position absolute
        max-width: 100%;
        max-height: 100%;
      }
    }
    .name{
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:17px;
      text-align center
    }
  }
}
  .title{
    font-size:15px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(16,16,16,1);
    line-height:21px;
  }
  .main{
    margin 10px 20px
    .time{
      font-size:13px;
      font-family:ArialMT;
      color:rgba(16,16,16,1);
      line-height:16px;
      margin 6px 0

    }
    .address{
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(16,16,16,1);
      line-height:19px;
      margin 6px 0
    }
    img{
      width 15px
      height 15px
      vertical-align middle
      margin-right 5px
    }
  }
</style>
