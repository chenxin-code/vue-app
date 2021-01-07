<template>
    <div>
      <nav-top title="评价" @backEvent="$router.go(-1)"></nav-top>
      <nav-content>
        <div class="adress">
          <div class="icon-con"> <img src="static/image/mall2/oil.png" alt="" ></div>
          <div class="ad">{{form.ouName||$route.query.storeName }}({{$route.query.standOuCode}})</div>
        </div>
        <div class="order-info" v-if="!$route.query.storeName">
          <div class="title">加油订单信息</div>
          <div class="info-item">
            <div>交易流水：</div>
            <div>{{$route.query.refuelOrderId||details.refuelOrderId||details.orderId}}</div>
          </div>
          <div class="info-item">
            <div>加油时间：</div>
            <div>{{details.createTime}}</div>
          </div>
<!--          <div class="info-item">-->
<!--            <div>员工码：</div>-->
<!--            <div>{{details.empNo}}</div>-->
<!--          </div>-->
          <div class="info-item">
            <div>加油金额(元)：</div>
            <div>{{details.refuelAmount}}</div>
          </div>
        </div>
        <div class="order-info" v-else>
          <div class="title">加油订单信息</div>
          <div class="info-item">
            <div>交易流水：</div>
            <div>{{$route.query.refuelOrderId||details.refuelOrderId}}</div>
          </div>
          <div class="info-item" @click="openTime">
            <van-field
              v-model="form.createTime"
              label="加油时间"
              placeholder="请选择加油时间"
              input-align="right"
              :readonly="$route.query.viewFlag==1"
              right-icon="arrow"
            />
          </div>
          <div class="info-item">
            <van-field
              v-model="form.empNo"
              label="员工简码"
              placeholder="请输入员工简码"
              input-align="right"
              :readonly="$route.query.viewFlag==1"
            />
          </div>
          <div class="info-item">
            <van-field
              v-model="form.refuelAmount"
              label="加油金额(元)"
              placeholder="请填写加油金额"
              input-align="right"
              :readonly="$route.query.viewFlag==1"
              :required="true"
            />
          </div>
        </div>
        <div class="order-info">
<!--            <evaluate-item :answerList="answerList" :prize="questionPrize" :view="$route.query.viewFlag" :form="form" :evaluateType="details.evaluateType" :randomId="randomId"></evaluate-item>-->
            <evaluate-item :answerList="answerList" :prize="questionPrize" :view="view" :form="form" :evaluateType="details.evaluateType" :randomId="randomId"></evaluate-item>
        </div>
        <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
          <van-datetime-picker
            v-model="currentDate"
            type="datetime"
            title="选择加油时间"
            @confirm="confirm"
            @cancel="show=false"
          />
        </van-popup>
      </nav-content>

    </div>
</template>
<script>
  import evaluateItem from './evaluate-item'
  import api from './api'
  import {Toast} from "vant";
    export default {
        name: "",
      mixins:[api],
        components: {
          evaluateItem
        },
        data() {
            return {
              form:{
                empNo:null,
                createTime:null,
                refuelAmount:null,
                ouName:null
              },
              randomId:null,
              questionPrize:{},
              answerList:[],
              value:null,
              show:false,
              // currentDate:this.$util.getPayTime(),
              currentDate:new Date(),
              minDate:new Date(),
              details:{},
              view:0,
            }
        },
        methods: {
          openTime(){
            if(this.$route.query.viewFlag!=1){
              this.show=true
            }

          },
          confirm(time){
            console.log(time)
            this.show=false
            this.form.createTime=this.$util.getPreTime(time)
          },
          loadData() {
            this.randomId=Math.random().toString(36).substr(2)
            let that = this;
            let params1 = {
              id: this.$route.query.id,
              orderId: this.$route.query.storeName?this.randomId:this.$route.query.orderId,
              refuelOrderId: this.$route.query.refuelOrderId,
            };
            that.$http.post('/app/json/questionaire/appUserConfig',params1).then(res => {
              console.log(res);
              if (res.data.result === "success") {
                this.getQuest()
                this.details = res.data.data
                document.title=res.data.data.title
                this.form.createTime=res.data.data.createTime
                this.form.empNo=res.data.data.empNo
                this.form.refuelAmount=res.data.data.refuelAmount
                this.form.ouName=res.data.data.ouName
                this.questionPrize = JSON.parse(res.data.data.questionPrize)
                let answerList = res.data.data.subjectList;
                that.userId = res.data.data.userId
                let ifShare = res.data.data.questionShare ? JSON.parse(res.data.data.questionShare) : ''
                console.log(ifShare);
                if (ifShare.length == 0) { //判断是否可以分享
                  that.shareView = false
                } else {
                  that.shareView = true
                }
                answerList.forEach(function (item) {
                  item.show = false
                  if (
                    item.kindId === 1 ||
                    item.kindId === 2 ||
                    item.kindId === 3 ||
                    item.kindId === 4
                  ) {
                    let list = JSON.parse(item.options);
                    list.forEach(function (itemOption) {
                      itemOption.name = itemOption.lable;
                    });
                    item.options = list;
                  }
                  if (item.kindId === 2) {

                    item.result = []
                  } else if (item.kindId === 6) {
                    item.result = 0
                  } else {
                    item.result = "";
                    if (item.kindId === 4) {
                      item.show = false
                    }
                  }
                });
                answerList.forEach(function (item) { //打分题后面添加评价,简答题字数检验
                  item.evaluate = ''
                  item.tips = ''
                })
                that.answerList = JSON.parse(JSON.stringify(answerList));
                that.answerList.forEach((value,index,arr)=>{
                  if(value.kindId==2){
                    value.options.forEach((value1,index1,arr1)=>{
                      that.$set(that.answerList[index].options[index1],"flag",false)
                    })
                  }
                })
                //分享
                that.shareTitle = res.data.data.shareTitle
                that.shareContent = res.data.data.shareContent
                that.shareImgUrl = res.data.data.shareImgUrl
              } else {
                console.log(res.data.info);
              }
            });
          },
          getQuest(){
            // this.randomId=Math.random().toString(36).substr(2)
            let params = {
              id: this.$route.query.id,
              orderId: this.$route.query.storeName?this.randomId:this.$route.query.orderId,
              refuelOrderId: this.$route.query.refuelOrderId,
              // token: this.$store.state.login.token,
              //随机字符串为了多次答题
            }
            this.$http.post('/app/json/questionaire/startAnswer',params).then(res => {
              this.$Loading.close();
              console.log(res);
              if (res.data.result === 'success') {
              } else {
                this.loadDataDetail()
                // Toast(res.data.info)
              }
            })
          },
          loadDataDetail() {
            let that = this;
            let params1 = {
              id: this.$route.query.id,
              orderId: this.$route.query.storeName?this.randomId:this.$route.query.orderId,
              refuelOrderId: this.$route.query.refuelOrderId,
            };
            that.historydetailData(params1).then(res => {
              if (res.data.result === "success") {
                this.view=1
                this.details = res.data.data
                let answerList = JSON.parse(res.data.data.resultJson)
                console.log(JSON.parse(JSON.stringify(answerList)))
                answerList.forEach(function(item) {
                  //打分题后面添加评价
                  item.evaluate = "";
                });
                that.userId = res.data.data.userId;
                let ifShare = res.data.data.questionShare
                  ? JSON.parse(res.data.data.questionShare)
                  : "";
                if (ifShare.length == 0) {
                  //判断是否可以分享
                  that.shareView = false;
                } else {
                  that.shareView = true;
                }
                answerList.forEach(function(item, index) {
                  if (
                    item.kindId === 1 ||
                    item.kindId === 2 ||
                    item.kindId === 3 ||
                    item.kindId === 4
                  ) {
                    let list = JSON.parse(item.options) || [];
                    list.forEach(function(itemOption) {
                      itemOption.name = itemOption.lable;
                    });
                    item.options = list;
                  }
                  if (item.kindId === 2) {
                    item.result = item.result.split(",");
                  } else if (item.kindId === 6||item.kindId === 8) {
                    item.result = Number(item.result) || 0;
                    // if (item.result == 1) {
                    //   item.evaluate = "非常差";
                    // } else if (item.result == 2) {
                    //   // item.evaluate = "差";
                    //   item.evaluate = "差";
                    // } else if (item.result == 3) {
                    //   item.evaluate = "一般";
                    // } else if (item.result == 4) {
                    //   item.evaluate = "好";
                    // } else if (item.result == 5) {
                    //   item.evaluate = "非常好";
                    // }
                    // that.$set(item,'evaluate1',{})

                    item.evaluate1={}
                    item.evaluate1.explain=item.evaluate
                    item.evaluate1.reasonArr=JSON.parse(item.resultDes)
                  } else {
                    // item.result = "";
                    if (item.kindId === 4) {
                      item.show = false;
                    }
                  }
                });
                that.answerList = answerList;
                //分享
                that.shareTitle = res.data.data.shareTitle;
                that.shareContent = res.data.data.shareContent;
                that.shareImgUrl = res.data.data.shareImgUrl;
                this.form.time=res.data.data.createTime
                this.form.empNo=res.data.data.empNo
                this.form.money=res.data.data.refuelAmount
                this.form.ouName=res.data.data.ouName
                that.finishFlag=true
                that.$forceUpdate()
              } else {
              }
            });
          },
        },
      created(){
          this.view=this.$route.query.viewFlag
          if(this.$route.query.viewFlag==1){
            this.loadDataDetail()
          }else{
            this.loadData();
          }


      }
    }
</script>

<style lang="stylus" scoped>
  .nav-content{
    overflow scroll
  }
.adress{
  margin 10px 10px
  height: 45px;
  background: #FFFFFF;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
  border-radius: 6px;
  display flex
  justify-content flex-start
  align-items center
  .icon-con{
    width 20px
    height 20px
    padding 5px
    img{
      width 100%
    }
  }
  .ad{

    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }
}
  .order-info{
    margin 10px
    padding 15px 10px
    /*height: 150px;*/
    background: #FFFFFF;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
    border-radius: 6px;
    .info-item{
      display flex
      justify-content space-between
      align-items center
      /*width: 157px;*/
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin-top 10px
    }
    .title{

      /*width: 84px;*/
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
    }
  }
  .van-cell {
    padding 0
  }
  /deep/.van-cell--required::before{
      left -8px
    }
</style>
