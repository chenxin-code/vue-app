<template>
    <div>
      <nav-top title="我的服务" @backEvent="backEvent" :bgImg='bgImg' >
        <div class="header">
          <div class="user-info">
            <div class="user-header-img">
              <img v-if="headImg" :src="headImg" class="user-logo" />
              <img v-else width="100%" src="./images/user-logo.png" />
            </div>
            <div class="user-info-right">
              <div class="user-name">
                {{
                  $store.state.userInfo.nickName
                    ? $store.state.userInfo.nickName
                    : $store.state.userInfo.userName
                }}
              </div>
            </div>
          </div>
          
        </div>
          <div class="account">
            <div class='unit br' @click='changeType(1)' :class="{'cur-type': pageInfo.type == 1}">
              <span class='tit'>待使用</span>
              <span>{{eqNumber.unUseCount || 0}}</span>
            </div>
            <div  class='unit br'  @click='changeType(3)' :class="{'cur-type': pageInfo.type == 3}">
              <span  class='tit'>已使用</span>
              <span>{{eqNumber.useCount || 0}}</span>
            </div>
            <div  class='unit' @click='changeType(2)' :class="{'cur-type': pageInfo.type == 2}">
              <span  class='tit'>已过期</span>
              <span>{{eqNumber.expiredCount || 0}}</span>
            </div>
        </div>
      </nav-top>
      <nav-content>
        <div class="content">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="100"
            @load="onLoad"
          >
          <template v-if='dataList.length'>
            <service v-for='(item,index) in dataList' :key='index' :item='item' style='margin: 10px 0;'></service>
          </template>
          <template v-else>
            <div class='no-data'>
              <img  src="./images/no_data.png" alt="">
              <p>当前无可用服务~</p>
            </div>
          </template>
          </van-list>
        </div>
      </nav-content>
  </div>
</template>

<script>
import service from './components/service'
  export default {
    components:{
      service
    },
    data() {
      return {
        loading: false,
        finished: false,
        pageInfo:{
          page: 0,
          rows: 10,
          type: 1,
          token: this.$store.state.login.token
        },
        eqNumber: {},
        dataList:[
        ]
      }
    },
    methods:{
      getEqAmount() {
        let obj = {
          token: this.$store.state.login.token
        }
        this.$http.post("/app/json/equity_member/equityCount",obj).then(res=>{
          
          let data = res.data;
          if(data.status == 0) {
            this.eqNumber = data.data
          } else {
            this.$toast(res.data.info)
          }
        })
      },
      changeType(num) {
       this.pageInfo.type = num
        this.reset()
      },
      reset() {
        this.dataList = []
        this.finished = false
        this.loading = false
        this.pageInfo.page = 0;
        this.onLoad()
        
      },
      onLoad() {
        this.loading = true
        this.pageInfo.page++
        this.$Loading.open()
        this.$http.post("/app/jqGrid/equity_member/equityService",this.pageInfo).then(res=>{
          let data = res.data;
          this.loading = false
          if(data.status == 0) {
              if (data.data instanceof Array) {
                 this.dataList.push(...data.data)
                 if (this.dataList.length >= data.records) {
                    this.finished = true
                 }
              } else {
                   this.finished = true
              }
          } else {
            this.$message.error(res.info)
          }
          this.$Loading.close()
        }).catch(err=>{
          this.$Loading.close()
        })
      },
      backEvent() {
        this.$router.replace('/common')
      }
    },
    mounted() {
      this.getEqAmount()
    },
    computed: {
      headImg() {
        return this.$store.state.userInfo.avtUrl;
      },
      bgImg() {
        return require('./images/bg.png')
      }
    }
  }
</script>

<style lang="stylus" scoped>
/deep/.nav-top .navcontent,/deep/ .nav-top{
  height: 170px !important;
  overflow: visible !important;
}
/deep/ .nav-back-btn{
  position relative !important
}
/deep/ .nav-content{
  top: 210px !important;
}
.header {
    display: flex;
    justify-content: flex-start;
    position: relative;

    .avatar {
      width: 60px;
      flex: 1;
    }

    .content {
      padding-left: 5px;
      flex: 2;

      .sub-title {
        font-size: 18px;
        line-height: 60px;
      }
    }

    
  }
.cur-type{
  .tit{
    color: #F02C2D !important;
  }
  span{
    color: #F02C2D;
  }
}
.account {
  z-index: 100;
  width: 96%;
  padding: 10px 0;
  background: #fff;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: flex;
  color: #000;
  text-align: center;

  .br {
    border-right: 0.5px solid #A1A1A1;
  }

  .unit {
    flex: 1;
    line-height: 20px;
    .tit {
      font-size: 13px;
      color: #A1A1A1;
    }

    span {
      font-size: 16px;
      display: block;
      font-weight: 500;
    }
  }
}
.user-info {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  z-index: 2;

  .user-header-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    line-height: 70px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .user-info-right {
    flex: 1;
    padding: 0px 10px;

    .user-name {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
  }
}
.content{
  height: calc(100% - 30px);
  padding: 0 2%;
  overflow-y: scroll;
  
}
.no-data{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-top: 60px;
  img{
    width: 40%;
  }
  p{
    padding-top: 15px;
  }
}
</style>