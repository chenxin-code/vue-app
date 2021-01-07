<template>
    <div>
      <nav-top :noTitle='true' @backEvent="backEvent" :bgImg='bgImg' >
          <div class="account">
            <div class='unit br' @click='changeEq(1)'>
              <span class='icon'></span>
              <span class='tit' :class="{cur: type == 1}">使用指南</span>
            </div>
            <div  class='unit'  @click='changeEq(2)'>
              <span class='icon ser'></span>
              <span class='tit'  :class="{cur: type == 2}">权益介绍</span>
            </div>
        </div>
      </nav-top>
      
      <nav-content>
        <div class='content' v-html='type == 1 ? infoData.equityDes : infoData.instructions'></div>
        <div class="btns">
          <van-button class='use-btn' type="primary" round color='#F02C2D' block @click='submit'>立即使用</van-button>
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
        this.$router.replace("/service_list")
      },
      changeEq(num) {
        this.type = num
      },
      submit() {
        let obj = {
          path: '/rights_use',
          query: {
            memberEquityTypeCode: this.infoData.equityType,
            equityId: this.infoData.id,
            equityName: this.infoData.equityName
          }
        }
        this.$router.push(obj)
      }
    },
    created() {
      this.infoData = JSON.parse(window.localStorage.getItem("eqItem")) || {}
    },
    computed: {
      headImg() {
        return this.$store.state.userInfo.avtUrl;
      },
      bgImg() {
        // 51008为道路，51009为保险，目前只支持这两种
        let obj = JSON.parse(window.localStorage.getItem("eqItem")) || {};
        if(obj.equityType == 51008) {
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
.account {
  z-index: 100;
  width: 96%;
  padding: 10px 0;
  background: #fff;
  position: absolute;
  bottom: -20px;
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
    line-height: 50px;
    .tit {
      font-size: 16px;
      display:inline-block
      vertical-align middle
      color: #38302D;
    }
    .cur{
      // color:#F02C2D
    }
    .icon {
      width 20px
      display: inline-block
      vertical-align middle
      height 20px
      background: url(./images/use1.png) no-repeat;
      background-size: 100% auto;
      margin-right: 5px

    }
    .ser{
      background-image: url('./images/use2.png')
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
.btns{
  position absolute;
  bottom: 0;
  left:0;
  right: 0;
  padding: 15px 2%;
  background: rgba(255,255,255,0.2)
}
.content{
  padding: 2%;
  padding-bottom: 75px;
}
</style>