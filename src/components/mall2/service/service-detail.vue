<template>
    <div>
      <nav-top :noTitle='true' @backEvent="backEvent" :bgImg='bgImg' >
      </nav-top>
      
      <nav-content>
        <div class="form">
            <div class="f-input">
              <h2 class="left">基本信息</h2>
            </div>
            <div class="f-input">
              <div class="left">权益名称</div>
              <div class="right">
                  {{infoData.equityName}}
              </div>
            </div>
            <div class="f-input">
              <div class="left">订单号：</div>
              <div class="right">
                 {{infoData.id}}
              </div>
            </div>
            <div class="f-input">
              <div class="left">使用时间：</div>
              <div class="right r-car">
                  {{infoData.useTime}}
              </div>
            </div>
            <!-- 51008是道路，51009是保险 -->
            <div class="f-input" v-if='infoData.servicePhone && infoData.equityTypeCode == 51008'>
              <div class="left">客服电话</div>
              <div class="right r-call">
                  <span>
                    {{infoData.servicePhone}}
                  </span>
                  <a :href="'tel:'+infoData.servicePhone">
                    <span class='pn'>立即拨号</span>
                    <van-icon size="24" name="phone-circle" />
                  </a>
              </div>
            </div>
            <p>
             
            </p>
        </div>
        <div class="form">
            <div class="f-input">
              <h2 class="left">申请信息</h2>
            </div>
            <div class="f-input">
              <div class="left">姓名：</div>
              <div class="right">
                  {{infoData.userName}}
              </div>
            </div>
            <div class="f-input">
              <div class="left">手机号：</div>
              <div class="right">
                 {{infoData.userPhone}}
              </div>
            </div>
            <div class="f-input">
              <div class="left">车牌号：</div>
              <div class="right r-car">
                  {{infoData.carNumber}}
              </div>
            </div>
        </div>
      </nav-content>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: true,
        type: 1,
        infoData:{}
      }
    },
    methods:{
      backEvent() {
        this.$router.go(-1)
      }
    },
    created() {
      let obj = {
        id: this.$route.query.id
      }
      this.$http.post("/app/json/equity_member/useEquityDetail",obj).then(res=>{
        let data = res.data
        if(data.status == 0) {
          this.infoData = data.data
        } else {
          this.$toast(res.data.info)
        }
      })
    },
    computed: {
      headImg() {
        return this.$store.state.userInfo.avtUrl;
      },
      bgImg() {
        // 51008为道路，51009为保险，目前只支持这两种
        let equityType = this.$route.query.equityType;
        if(equityType == 51008) {
          return require('./images/bg2.png')
        } else {
          return require('./images/bg3.png')
        }
        
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

.form{
  padding: 10px;
  box-shadow: 0px 0px 3px rgba(0,0,0,0.3)
  position relative
  top: 2px;
  width: 95%;
  border-radius 4px;
  margin: 10px auto;
  .f-input{
    display flex;
    align-items center;
    margin: 15px 0;
    h2{
      color: #333;
      font-size 15px
      line-height 30px
      font-weight 600
    }
    .left{
      flex: 3
      font-size: 14px;
      color: #333333;
    }
    .right{
      flex: 8
      input{
        background:#F6F6F6;
        width: 100%;
        padding: 10px 20px;
        border-radius 15px
        vertical-align middle;
        &::placeholder{
          color: #999999;
        }
      }
      
    }
    .r-call{
      display: flex;
      justify-content: space-between
      align-items: center;
      a{
        color:#F02C2D;
        font-size 14px;
        position relative
        display: inline-block
        vertical-align middle
        .pn{
          vertical-align text-top
          margin-right: 5px;
        }
      }
    }
  }
}
.content{
  padding: 2%;
  padding-bottom: 75px;
}
</style>