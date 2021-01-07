<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="vip-car">
      <div class="content-con">
        <div class="info">
          <div class="info-con" @click="instruction"><span class="icon">?</span> <span>说明</span></div>
        </div>
        <div class="list-con">
          <van-list
            v-model="isLoading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="200"
            @load="loadMore">
            <li
              v-for="(item,index) in insuranceList" :key="index"
              class="item" @click="detail(item)">
              <div  class="card">
                <div class="left">
<!--                  <div class="title">{{item.equityTypeName}}</div>-->
                  <div class="title">{{changeStatus(item.serviceType)}}</div>
                  <div class="range">保障期限： {{changeTime(item)}}</div>
                </div>
                <div class="right">
                  <div v-if="item.useState==2&&changeDate1(item)==2">
                    <div class="date" ><span class="num">{{changeDate(item)}}</span>天</div>
                    <div class="bottom">已保障</div>
                  </div>
                  <div v-else-if="item.useState==2&&changeDate1(item)==0">
                    <div class="insuStatus">未生效</div>
                  </div>
                  <div v-else-if="item.useState==2&&changeDate1(item)==1">
                    <div class="insuStatus">已过期</div>
                  </div>
                  <div v-else-if="item.useState==0">
                    <div class="insuStatus">未受理</div>
                  </div>
                  <div v-else-if="item.useState==1">
                    <div class="insuStatus">投保中</div>
                  </div>

                </div>
              </div>
            </li>
          </van-list>
        </div>
      </div>
    </nav-content>
    <van-action-sheet v-model="show" title="说明" :round=false>
      <div class="line"></div>
      <div class="content" v-html="content">
        {{content}}
<!--        <div class="contain">-->
<!--          1、自填写投保单当日起，三个工作日内生效（生效日请以短信时间为准，若未收到短信可通过客户电话进行查询）。-->
<!--         </div>-->
<!--        <div class="contain">-->
<!--          2、会员卡有效期内，会员每人获赠1份一年期1200元最高保额的航班延误险。在保险期间内航班延误（以到达时间为标准）3小时以上（含3小时），保险人依照约定承担赔偿责任，若被保险人投保的航班发生取消/备降/返航等其他情形的，不承担保险责任。-->
<!--        </div>-->
<!--        <div class="contain">-->
<!--          3、会员卡有效期内，会员每人获赠1份一年期1000元最高保额的行李延误险。在保险期间内，航班行李延误6小时以上（含6小时），被保险人可获赔偿500元。-->
<!--        </div>-->
<!--        <div class="contain">-->
<!--          4、会员卡有效期内，会员每人获赠1份一年期2000元最高保额的行李遗失险。在保险期间内，托运过程中行李遗失，保险人依照约定承担赔偿责任，单次赔偿上限2000元。-->
<!--        </div>-->
      </div>
      <van-button   type="info" native-type="submit" class="sliver" @click="show=false">
        我知道了
      </van-button>
    </van-action-sheet>
    <CheckPaidMember @failHandler="failHandler"></CheckPaidMember>
  </div>
</template>
<script>
  export default {
    name: "myInsurance",
    components: {
      CheckPaidMember: () => import('../../check-paid-member/check-paid-member')
    },
    data() {
      return {
        content:null,
        insuranceList:[],
        shopType:1,
        isLoading: true,
        finished: false,
        pageInfo: {
          page: 0,
          rows: 10
        },
        show:false
      }
    },
    methods: {
      failHandler() {
        this.$router.go(-1)
      },
      instruction(){
        this.show=true
      },
      changeStatus(status){
        let obj=['','航班延误险','行李延误险','行李遗失险']
        return obj[status]
      },
      changeTime(item){
        if(item.useBeginTime){
          return `${item.useBeginTime.split(' ')[0]}至${item.useEndTime.split(' ')[0]}`
        }else{
          return " "
        }
      },
      changeDate(item){
       let useBeginTime=item.useBeginTime.replace(/-/g,"/")
        if(item.useState==2&&useBeginTime){
          let date=(new Date()-new Date(useBeginTime))/(60*60*1000*24)
          console.log(date)
          return parseInt(date)
        }else{
          console.log(123)
          return " "
        }

      },
      changeDate1(item){
        // item.useBeginTime="2020-05-22 00:00:00"
        let  useBeginTime= item.useBeginTime.replace(/-/g,"/")
        // item.useBeginTime.replace(/-/g,"/")
        let useEndTime=item.useEndTime.replace(/-/g,"/")
        console.log(useBeginTime)
          let date=new Date()-new Date(useBeginTime)
        if(date>0){
          if(new Date()-new Date(useEndTime)>0){
            // 当前时间大于结束时间，已过期
            return 1
          }else{
            // 当前时间小于结束时间，大于生效时间 保障中
            return 2
          }
        }else{
          // 当前时间小于开始时间 未生效
          return 0
        }


      },
      loadMore() {
        this.isLoading = true;
        this.pageInfo.page++;
        this.$Loading.open();
        this.$http.post('/app/json/equity_use_insure/getInsureList', {
          // shopType:this.shopType,
          equityMemberId:this.$route.query.id,
          ...this.pageInfo
        }).then(res => {
          this.isLoading = false;
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.insuranceList.push(...data.data);
              if (this.insuranceList.length >= data.totalRecords) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.$Toast(data.info);
            this.finished = true;
          }
          this.$Loading.close();
        }).catch(err => {
          this.finished = true;
          this.$Toast(err);
          this.$Loading.close();
        })
      },
      detail(item){
        if(item.useState==2){
          this.$router.push({
            path: "/benefits/insuranceDetail",
            query: {
              item:JSON.stringify(item)
            }
          })
        }

      },
      getInfo(){
        let params = {

        }
        this.$http.post("/app/json/news/getNewsList?values=60", params).then(res => {
          let data = res.data
          if (data.status == 0) {
            console.log(res)
            this.content=res.data.data[0].content
          } else {
            this.$Toast(data.info)
          }
        }).catch((err) => {
          this.$Toast(err)
        })
      }
    },
    created() {
      this.loadMore()
      this.getInfo()
      console.log(123)
    }
  }
</script>

<style lang="stylus" scoped>
  .info {
    height 35px
    margin 0 20px
    display flex
    justify-content flex-end
    align-items center

    .info-con {
      /*width 66px*/
      display flex
      justify-content space-between
      align-items center
      font-size 12px

      .icon {
        display block
        width 15px
        height 15px
        border-radius 50%
        border 1px solid #333333
        display flex
        justify-content center
        align-items center
      }
    }
  }
  .card{
    margin 10px 20px
    padding 10px 13px
    display flex
    justify-content space-between
    align-items center
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1);
    border-radius:5px;
    .title{
      font-size:16px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(16,16,16,1);
      line-height:23px;
      margin-bottom 8px
    }
    .range{
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(159,160,160,1);
      line-height:19px;
    }
    .right{
      font-size:11px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(159,160,160,1);
      line-height:15px;
      .num{
        font-size:15px;
        font-family:Arial-BoldMT,Arial;
        font-weight:normal;
        color:rgba(16,16,16,1);
        line-height:17px;
      }
    }
  }
  .content{
    /*margin 0 20px*/
    padding 12px 20px
    min-height 260px
    max-height 500px
    overflow scroll
    .contain{
      margin-bottom 8px
      /*height:37px;*/
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(16,16,16,1);
      line-height:19px;
    }
  }
  .content >>> img{
    display block
    margin 0 auto
    width 80%
  }
  .sliver{
    height:49px;
    width 100%;
    border none
    background:linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%);
    .van-button__text{
      font-size:18px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:#C9A063;
      line-height:25px;
    }
  }
  .line{

    position: relative;
    border: none;
    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      /*width: 96%;*/
      height: 1px;
      background:rgba(220,221,221,1);
      margin 0 20px
      right 0
    }

  }
  @media screen and (-webkit-min-device-pixel-ratio: 2) {
    .line:after {
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  @media screen and (-webkit-min-device-pixel-ratio: 3) {
    .line:after {
      -webkit-transform: scaleY(0.33);
      transform: scaleY(0.33);
    }
  }
  .insuStatus{
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(16,16,16,1);
    line-height:20px;
  }
  .date{
    margin-bottom 5px
  }
</style>
