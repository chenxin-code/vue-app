<template>
  <div class="donate-input-root">
    <div class="input-title">我要捐助</div>
    <div class="account-curr">账户剩余积分 {{integralList == ''?'0':integralList}}</div>
    <div class="selects">
      <div class="integrate-area" v-for="integrate in integrations" :key="integrate.value">
        <div class="integrate-unselect single-line" :class="{integrateSelect:integrate.selected}" @click="selectIntegrate(integrate)">{{integrate.value}}</div>
      </div>
    </div>
    <div class="input-line">
      <van-field type="number" v-model="myintegralList" placeholder="自定义捐赠分数" @focus="focusEdit" />
    </div>
    <div class="textarea-line">
      <van-field type="textarea" v-model="remark" placeholder="为你的爱心留个言吧~"  />
    </div>
    <div class="read-agreement">
      查看
      <span class="agreenment" @click="readAgreement">《捐赠协议》</span>
    </div>
    <div class="donate-btn" @click="agreeToDonate">同意协议并捐赠</div>
  </div>
</template>
<script>
export default {
  name:'donate-input',
  props:[
    'integrations_p',
    'currentIntegrate_p',
    'integralList_p',
    'myintegralList_p',
     'remark_p'
    // currentIntegrate:{
    //   type:String,
    //   default:''
    // },
    // integralList:{
    //   type:String,
    //   default:''
    // }
  ],
  data() {
    return {
      integrations: [
      ],
      currentIntegrate:'',
      integralList:'',
      myintegralList:'',
      remark:''
    };
  },
  watch:{
    'integrations_p':{
      handler(oldVal,newVal){
        this.integrations = this.integrations_p;
        this.$forceUpdate();
      },
      deep:true,
      immediate:false
    },
    // 'myintegralList_p':{
    //   handler(oldVal,newVal){
    //     this.myintegralList = this.myintegralList_p;
    //     this.$forceUpdate();
    //   },
    //   deep:true,
    //   immediate:false
    // },
    // 'currentIntegrate_p':{
    //     handler(oldVal,newVal){
    //     this.currentIntegrate = this.currentIntegrate_p;
    //     this.$forceUpdate();
    //   },
    //   deep:true,
    //   immediate:false
    // },
    // 'remark_p':{
    //   handler(oldVal,newVal){
    //     this.remark = this.remark_p;
    //     this.$forceUpdate();
    //   },
    //   deep:true,
    //   immediate:false
    // }

  },
  methods:{
    selectIntegrate(integrate){
        integrate.selected = !integrate.selected;
        this.integrations.forEach(e=>
        {
          if(e.type != integrate.type){
              e.selected = false;
          }
        });
        this.currentIntegrate = integrate;
    },
    agreeToDonate(){
        let param = {currentIntegrate:this.currentIntegrate,integralList:this.integralList,myintegralList:this.myintegralList,remark:this.remark};
        this.$emit('agreeToDonateDo',param);
     },
    readAgreement(){
      this.$router.push({path:'/usercenter/agreement',query:{value:18}});
    },
    focusEdit:function(){
      this.currentIntegrate = '';
      this.integrations.forEach(e=>
        {
              e.selected = false;
        });
    },
    // getAccountBaseInfo() {
    //     // 获取积分接口
    //     let paramsData = {
    //       token: this.$store.state.login.token,
    //       acctType: 3
    //     }
    //     this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
    //       let data = res.data
    //       if (data.status == 0) {
    //         this.integralList = data.data;
    //       } else {
    //         this.$Toast('获取当前积分失败');
    //       }
    //     }).catch(err=>{
    //         this.$Toast(err);
    //     });
    //  },
  },
  mounted(){
    this.integrations = this.integrations_p;
    this.currentIntegrate = this.currentIntegrate_p;
    this.integralList = this.integralList_p;
    this.myintegralList = this.myintegralList_p;
    this.remark = this.remark_p;
  }
};
</script>
<style lang="stylus" scoped>
.donate-input-root {
  height: 357px;
  background-color: white;
  padding: 10px 10px 0px 10px;

  .input-title {
    color: #333333;
    font-size: 15px;
    text-align: center;
    font-weight: 500;
  }

  .account-curr {
    color: #333333;
    font-size: 13px;
  }

  .selects {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    .integrate-area {
      width: 25%;
      padding: 2px 10px 2px 0px;

      .integrate-unselect {
        background-image:url("../img/unselect_integrate.png");
        background-repeat:no-repeat;
        background-size:100% 100%;
        -moz-background-size:100% 100%;
        min-height: 40px;
        line-height: 40px;
        // border: 0.7px solid #DCDDDD;
        text-align: center;
        border-radius: 5px;
      }
      .integrateSelect {
          background-image:url("../img/select_integrate.png");
          background-repeat:no-repeat;
          background-size:100% 100%;
          -moz-background-size:100% 100%;
      }
    }
  }

  .input-line {
    margin-top: 10px;
    padding:0.6px 0.6px;
    border: 0.7px solid #DCDDDD;
    width: 172.5px;
    border-radius: 5px;
  }

  .textarea-line {
    padding: 1px 1px 1px 1px;
    margin-top: 10px;
    width: 100%;
    border: 0.7px solid #DCDDDD;
    border-radius: 5px;
  }

  .read-agreement {
    margin-top: 16px;
    color: #333333;
    font-size: 13px;

    .agreenment {
      color: #F02C2D;
    }
  }

  .donate-btn {
    position: absolute;
    width: 100%;
    left: 0px;
    background-color: #F02C2D;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 49px;
    color: white;
    bottom: 0px;
  }
}
</style>
