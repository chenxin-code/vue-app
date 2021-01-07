<template>
  <div>
    <nav-top title="电子加油卡" @backEvent="goback"></nav-top>
    <nav-content style='padding: 0 10px;'>
        <div class="card">
          <h2>当前余额（元）</h2>
          <p class="price">
            ￥<span>{{userInfo.refundAmount || 0}}</span>
          </p>
          <p>
            加油天津APP作为电子加油卡唯一使用渠道
          </p>
        </div>
        <div class="info">
          <van-cell v-if="showRef" title="申请退款" is-link :value="`可退款￥${userInfo.refundAmount || 0}`"  @click="goForRefund"/>
          <van-cell title="补开发票" is-link @click="goForEleCard" />
          <van-cell title="余额变动明细" is-link  @click="goForDetail"/>
        </div>
        <van-popup class='popup' v-model="showDialog" :style="{ height: '25%' ,width: '70%', borderRadius: '6px'}">
          <div class="top">
            一旦发起退款，退款到账前申请流程不可中止，期间电子加油卡余额将不可使用，整个流程大概需要2~4个月。
          </div>
          <div class="bottom">
            <div v-if='showInterval' class="red-btn interval">
              <span>{{countTime}}</span><span>s</span>
            </div>
            <div v-else class="red-btn submit" @click='toRefund'>
              确定
            </div>
            <div class="cancel" @click="cancelBtn">
              取消
            </div>
          </div>
        </van-popup>
    </nav-content>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showDialog: false,
        showInterval: false,
        timer: null,
        showRef: false,
        userInfo:{state: 50},
        countTime: 10
      }
    },
    created() {
      this.getInfo()
      this.getShowRef()
    },
    methods:{
      goForEleCard() {
        let obj = {
          path:"/openinvoiceDetail",
          query:{
            type: "electronicCard",
            totalMoney: this.userInfo.refundAmount
          }
        }
        this.$router.push(obj)
      },
      getShowRef() {
        this.$Loading.open()
        let obj = {
          "token": this.$store.state.login.token,
          // token:"o::C5DC820E3D6F459D828E66441673A8ED",
          "clusterCode":"TIANJIN_ELECARD_REFUND_CLUSTER"
        }
        this.$http.post("/app/json/app_user_cluster/checkClusterUserByCode",obj).then(res=>{
          this.$Loading.close()
          let data = res.data;
          if(data.status == 0) {
             this.showRef = data.data
          } else {
            this.$toast(data.info)
          }
          console.log(res,'res')
        }).catch((err)=>{
          console.error(err)
          this.$Loading.close()
        })
      },
      getInfo(){
        let obj = {
          token: this.$store.state.login.token
          // token: 'c:app:811560999DFB476BAF19F15C65A4A966'
        }
        this.$Loading.open()
        this.$http.post("/app/json/app_user_ele_card_refund/userEleCardRefundDetail",obj).then(res=>{
          let data = res.data;
          this.$Loading.close()
          if(data.status == 0) {
            this.userInfo = data.data || {}
          } else {
            this.$toast(data.info)
          }
        }).catch((err)=>{
          console.error(err)
          this.$Loading.close()
        })
      },
      goback() {
        this.$router.go(-1);
      },
      goForDetail() {
        this.$router.push("/balance_change_details")
      },
      goForRefund() {
        if(this.userInfo.state == 0 || this.userInfo.state == 15 || this.userInfo.state == 25) {
          this.showDialog = true;
          this.showInterval = true;
        } else if(this.userInfo.state == 30 || !this.userInfo.refundAmount) {
          this.$toast("当前无可退款金额");
          return;
        } else {
          let url = {
            path: "/electronic_refund_result",
            query:{
              type: 2,
              time: this.userInfo.createTime
            }
          }
          this.$router.push(url)
        }
        
      },
      toRefund() {
        let obj ={
          path:"/electronic_refund",
          query:{
            refundAmount: this.userInfo.refundAmount || 0
          }
        }
        this.$router.push(obj)
      },
      countDown() {
        clearInterval(this.timer)
        this.countTime = 10;
        this.timer = setInterval(()=> {
          this.countTime--
          if(this.countTime <= 0){
            this.showInterval = false;
            clearInterval(this.timer)
          }
        },1000)
      },
      cancelBtn() {
        this.showInterval = false;
        this.showDialog = false;
        clearInterval(this.timer)
      }
    },
    watch:{
      showInterval(val) {
        if(val) {
          this.countDown()
        } else {
          clearInterval(this.timer);
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.card{
  height: 130px;
  border-radius: 6px;
  padding: 30px 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #fff;
  background-image: linear-gradient(to right, #FF9D73 , #FF643F);
  margin-bottom: 15px;
  h2{
    margin-bottom: 10px;
  }
  .price{
    margin-bottom: 15px;
    span{
      font-size: 20px;
    }
  }
}
.info{
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  border-radius: 6px;
  padding: 10px;
}
.popup{
  font-family: PingFangSC-Regular, PingFang SC;
  .top{
    padding: 20px;
    color: #333;
    font-size: 13px;
    line-height: 24px;
    font-weight: 500;
  }
  .bottom{
    height: 45px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    display: flex;
    font-size: 14px;
    text-align: center;
    line-height: 45px;
    .red-btn{
      flex: 1;
      background-color: #F02C2D;
      color:#fff;
    }
    .cancel{
      flex: 1;
    }
  }
}
</style>