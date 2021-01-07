<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="container">
        <div class="main-store">
          <div class="store">
            <div class="icon"><img src="./img/logo.png" alt="" width="24px" height="24px"></div>
            <div class="store-right">
              <div class="store-name">{{storeName}}</div>
              <div class="store-address">{{storeAddress}}</div>
            </div>
          </div>
          <div class="coupon" v-for="(item,index) in  couponList">
            <div class="coupon-left">
              ¥<span class="number">{{item.couFaceValue}}</span> 满{{item.couThresholdAmount}}元可用
            </div>
            <div class="coupon-right">待使用</div>
          </div>
          <div  class="coupon" v-show="couponList.length%2!=0" v-for="(item1,index1) in 2-couponList.length%2" :key="index1+'.'"></div>
          <!--          <div class="coupon">-->
<!--            <div class="coupon-left">-->
<!--              ¥<span class="number">20</span> 满十元可用-->
<!--            </div>-->
<!--            <div class="coupon-right">待使用</div>-->
<!--          </div>-->
        </div>

        <div class="good">
          <div class="good-item" v-for="(item,index) in skuList">
            <div class="img"><img src="./img/logo.png" alt=""></div>
            <div class="des">
              <div class="title">{{item.skuName}}</div>
              <div class="con">
                <div class="con-left">
                  <div class="con-top">¥{{item.onlineSalePrice}}</div>
                  <div class="con-bottom"><span>总量:{{item.actStockNum}}</span> <span>已售:{{item.stockSaleNumber}}</span></div>
                </div>
                <div class="con-right">
                  <van-stepper v-model="item.num" :min="minNum" :max="maxNum" :step="stepNum" integer :disabled="statusFlag!=1"/>
                </div>
              </div>

            </div>
          </div>
          </div>

      </div>
      <div class="bottom-con" v-if="statusFlag==1&&showFlag">
        <div class="left">
          <div class="top">
            合计金额：<span class="total-con">{{totalAmount}}元</span>
          </div>
          <div class="bottom" v-if="!couponLevel.flag">
            还差{{couponLevel.couThresholdAmount}}元可抵扣<span class="dis-con">{{couponLevel.couFaceValue}}元</span>
          </div>
          <div class="bottom" v-else>
            券抵扣金额：<span class="dis-con">{{couponLevel.couFaceValue}}元</span>
          </div>
        </div>
        <div class="right">
          <span class="buy" @click="goOrder">结算({{totalNum}})</span>
        </div>
      </div>
            <div class="status" v-if="statusFlag==0">
              <van-button   type="info" native-type="submit" class="sliver" @click="show=false">
                活动倒计时 {{day}}
              </van-button>
            </div>
            <div class="status" v-if="statusFlag==2">
              <van-button   type="info" native-type="submit" class="sliver finish" @click="show=false">
                活动已结束
              </van-button>
            </div>
    </nav-content>
  </div>
</template>
<script>
  import QRCode from 'qrcode'
  import ClipboardJS from 'clipboard'

  export default {
    name: 'benefitsCode',
    components: {},
    computed: {
      totalAmount() {
        let price = 0
        this.skuList.map(value => {
          if (value.num > 0) {
            price += value.num * value.onlineSalePrice
          }

        })
        return price
      },
      totalNum() {
        let num = 0
        this.skuList.map(value => {
          num += Number(value.num)
        })
        return num
      },
      chajia(){
        if(this.couponListTemp[0]){
          return this.totalAmount-this.couponListTemp[0].couThresholdAmount
        }else{
          return this.totalAmount
        }

      },
      couponLevel(){
        console.log(123)
        if(this.couponListTemp[0]){
          if(this.totalAmount<this.couponListTemp[0].couThresholdAmount){
            return {
              flag:false,
              couThresholdAmount:this.couponListTemp[0].couThresholdAmount-this.totalAmount,
              couFaceValue:this.couponListTemp[0].couFaceValue,
              index:0

            }
          }else{
            let arr=this.couponListTemp.filter((value,index)=>{
              return value.couThresholdAmount<=this.totalAmount
            })
            return {
              flag:true,
              couFaceValue:arr[arr.length-1].couFaceValue,
              couThresholdAmount:arr[arr.length-1].couThresholdAmount
            }

          }
        }else{
          return {
            flag:false,
            index:0
          }
        }


      }
    },
    data() {
      return {
        // totalNum:5,
        selectedNum: null,
        minNum: 0,
        maxNum: 10000,
        stepNum: 1,
        skuList: [],
        couponList: [],
        couponListTemp:[],
        pickupId:null,
        showFlag:true,
        statusFlag:1,
        day:null,
        storeName:null,
        storeAddress:null,
        startDate:null,
        endDate:null,
        // chajia:null
      }
    },
    mounted() {
      console.log(this.$route.query)
      this.getDetail()
    },
    methods: {
       dateDiff(d1,d2){
         var new_date = new Date(d1); //新建一个日期对象，默认现在的时间
         var old_date = new Date(d2); //设置过去的一个时间点，"yyyy-MM-dd HH:mm:ss"格式化日期

         var difftime = (new_date - old_date)/1000; //计算时间差,并把毫秒转换成秒

         var days = parseInt(difftime/86400); // 天  24*60*60*1000
         var hours = parseInt(difftime/3600)-24*days;    // 小时 60*60 总小时数-过去的小时数=现在的小时数
         var minutes = parseInt(difftime%3600/60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
         var seconds = parseInt(difftime%60);
         if(days<10){
           days='0'+days
         }
         if(hours<10){
           hours='0'+hours
         }
         if(minutes<10){
           minutes='0'+minutes
         }
         if(seconds<10){
           seconds='0'+seconds
         }
        return days+"天"+hours+":"+minutes+":"+seconds
      },
      getDetail(){
        let params = {
                 id:this.$route.query.actId
                }
                this.$http.post('/app/json/special_act_order/getFiveAdvanceActivityDetail', params).then(res => {
                  let data = res.data
                  console.log(data,data)
                  if (data.status == 0) {
                    if(data.data.userCanUseCoupon.length>0){
                      this.couponList=data.data.userCanUseCoupon
                    }else{
                      this.showFlag=false;
                      this.$dialog.confirm({message: '当前账户无可用电子券,将无法进行下单', confirmButtonColor: '#F80F16',confirmButtonText:'我知道了'}).then(() => {

                      })
                    }
                    this.startDate=data.data.startDate.replace(/-/g,"/")
                    this.endDate=data.data.endDate.replace(/-/g,"/")
                    if(new Date()-new Date(this.startDate)>0&&new Date()-new Date(this.endDate)<0){
                      this.statusFlag=1
                    }else if(new Date()-new Date(this.endDate)>0){
                      this.statusFlag=2
                    }else{
                      this.statusFlag=0
                      this.day=this.dateDiff(new Date(this.startDate),new Date())
                    }

                    this.skuList=data.data.skuList
                    // this.pickupId=data.data.pickupId
                    this.pickupId=data.data.selflift.id
                    this.storeName=data.data.selflift.storeName
                    this.storeAddress=data.data.selflift.addressFull
                    // this.storeName=data.data.storeName
                    // this.storeAddress=data.data.storeAddress
                    this.skuList.map((value,index) => {
                    this.$set(this.skuList[index],'num',0)
                    })
                    // 升序排列
                    this.couponListTemp=this.couponList.sort(function(a,b){
                      return a.couThresholdAmount-b.couThresholdAmount

                    })
                  } else {
                    this.$Toast(data.info)
                  }
                }).catch((err) => {
                  this.$Toast(err)
                })
      },
      goOrder() {
        if(!this.couponLevel.flag){
          this.$Toast('未达到券的使用金额，无法下单！')
          return
        }
        let params = {
          paramsData: {
            carts: [],
            specialActivityId:this.$route.query.actId

          },
          deliveryType: 1,
          res: {
            occur: [
              {
                userCanUseCoupon:[...this.couponList],
                couNo:[],
                userCanNotUseCoupon:[],
                userCanUseWhenNotSelectCoupon:[]
              }
      ]
      }

      }
        ;
        this.skuList.map(value=>{
          if(value.num>0){
          params.paramsData.carts.push({
            skuId:value.skuId,
            storeOuCode:this.$route.query.storeOuCode,
            number:value.num,
            //如果有数量即为选中状态
            checked:value.num>0?1:0
          })
          }
        })
        params.paramsData.pickupId=this.pickupId
        // this.storeName='123'
        // this.storeAddress='nfjnvdfjkng'
        params.paramsData.storeName=this.storeName
        params.paramsData.storeAddress=this.storeAddress
        this.couponList.map(value => {
          params.res.occur[0].userCanUseCoupon.push(value)
          params.res.occur[0].couNo.push(value.couNo)
        })
        console.log(params,'params')
        this.$router.push({
          name: '五进活动提交订单',
          params: params
        })
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .main {
    height 100%
  }

  .container {
    position relative
    height 100%
    overflow scroll
    padding-bottom 50px
  }

  .main-store {
    display flex;
    background: rgba(102, 102, 102, 1);
    padding 15px 10px
    flex-wrap wrap
    justify-content space-around

    .store {
      width 100%
      display flex
      align-items center

      .icon {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 1);
        border: NaNpx solid rgba(220, 221, 221, 1);
        border-radius: 50%;
        margin-right 10px
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .store-name {
        height: 16px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
      }

      .store-address {
        height: 12px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
      }
    }

    .coupon {
      width 173px
      height 44px
      display flex
      align-items center
      margin-top 15px

      .coupon-left {
        flex 1
        width: 115px;
        height: 44px;
        background: linear-gradient(-55deg, rgba(104, 124, 214, 1), rgba(104, 157, 219, 1));
        border-radius: 6px 0px 0px 6px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
        padding 12px 8px

        .number {
          height: 16px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 18px;
        }
      }

      .coupon-right {
        /*width: 58px;*/
        height: 44px;
        background: rgba(255, 255, 255, 1);
        border-radius: 0 6px 6px 0;
        padding 0 5px
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height 44px
      }
    }
  }

  .good {
    margin 15px 10px
    padding 15px 10px
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;

    .good-item {
      display flex
      margin-bottom 10px

      img {
        width: 100px;
        height: 100px;
        border-radius: 6px;
      }

      .des {
        flex 1
        margin-left 9px
        display flex
        flex-wrap wrap
        align-content space-between

        .title {
          height: 37px;
          font-size: 15px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 22px;
        }

        .con {
          width 100%
          display flex
          justify-content space-between
          height 40px

          .con-right {
            width 95px
            display: flex;
            align-items: flex-end;
          }

          .con-left {
            flex 1
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .con-top {
              height: 12px;
              font-size: 12px;
              font-family: Arial;
              font-weight: bold;
              color: rgba(240, 44, 45, 1);
              width 100%
            }

            .con-bottom {
              width 100%
              height: 12px;
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
            }
          }
        }
      }
    }
  }

  .bottom-con {
    position absolute
    width 100%
    bottom 0
    height: 49px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -3px 7px 0px rgba(246, 246, 246, 1);
    display flex

    .left {
      flex 1
      margin-left 7px
      margin-top 9px

      .top, .bottom {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 18px;
      }
    }

    .right {
      width: 126px;
      height: 49px;
      background: rgba(240, 44, 45, 1);
      display flex
      justify-content center
      align-items center

      .buy {
        height: 17px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
    }

  }

  .status {
    position absolute
    width 100%
    bottom 0
    height: 49px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -3px 7px 0px rgba(246, 246, 246, 1);
  }

  .sliver {
    height: 49px;
    width 100%;
    border none
    background: #F02C2D;

    .van-button__text {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 25px;
    }
  }

  .finish {
    background #999999

    .van-button__text {
      color: #FFFFFF
    }

  }
  .total-con,.dis-con{
    color: #F02C2D;
  }
</style>
