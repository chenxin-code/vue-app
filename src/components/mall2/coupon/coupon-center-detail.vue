<template>
  <div>
    <nav-top title="领券详情" @backEvent="backEvent"></nav-top>
    <nav-content class="coupon-center" >
      <div v-if="!noneFlag">
        <div class="coupon">
          <coupon :unCenter='false' :couponLayoutType="1" :item="coupon2"  class="coupon-item" ></coupon>
          <img v-if="coupon2.state == 20 || coupon2.state != 1" class="received" src="@/assets/state/received.png" alt="">
        </div>
        <!-- 可用店铺 -->
        <div v-if="typeArr1.includes(couponType)">
          <div class="cell" >
            <van-cell broder title="可用店铺" @click="toStore(coupon2)" is-link />
          </div>
          <div class="cell" v-if="couponType == 'SC'">
            <van-cell broder title="可用商品"  @click="toList(coupon2)" is-link />
          </div>
        </div>
        <!-- 可用油站 -->
        <div class="cell" v-if="typeArr2.includes(couponType)">
          <van-cell broder title="可用油站" @click="toStationto" is-link />
        </div>
        <div class="rule-warpper" v-if="coupon2.couDesc">
          <div class="title">使用说明：</div>
          <div class="content" v-html="showHtml(coupon2.couDesc)" style="white-space:pre-wrap"></div>
        </div>
        <div class="my-coupon-link" v-if='coupon2.state == 1'>
          <div class="link theme_standard_bg" @click="collectingVoucher(coupon,coupon2)">{{coupon2.state == 20 ? '领取成功': '立即领取'}}</div>
        </div>
      </div>
      <div v-else-if="noneFlag&&!showFlag" class="empty">
<!--        <img src="@/assets/state/empty.png" alt="" width="80%">-->
      </div>
      <div v-else class="empty">
        <img src="@/assets/state/empty.png" alt="" width="80%">
      </div>

    </nav-content>
  </div>
</template>


<script>
  //  加油券		JY
  //  商城券		SC
  //  充值券		CZ
  //  第三方合作券		DSF
  //  便利店		BLD
  //  自营合作券 ZYHZM
import coupon from './base/coupon'
  export default {
    components:{
      coupon
    },
    data() {
      return {
        noneFlag:true,
        showFlag:false,
        defaultCouActivity:[],
        couActivity:[],
        coupon: {
          ruleId:-1
        },
        coupon2: {},
        typeArr1: ['SC','BLD'],// 跳转到可用店铺
        typeArr2: ['JY','ZYHZM','QF'] // 跳转到可用油站
      }
    },
    methods:{
      backEvent() {
        this.$router.go(-1)
      },// 领取券
      collectingVoucher(item, item2) {
        if(item2.state == 20) {
          return;
        }
        if (item.special) { // 专享券
          // 立即领取
          this.$request.post('/app/json/app_market/receiveAward', {
            awardRecId: item2.awardRecId
          }).then(res => {
            if (res.status === 0) {
              this.$Toast('领取成功')
              item2.state = 20
            } else {
              this.$Toast(res.info ? res.info : '领取失败')
            }
          })
        } else if (item2.state == -1) {
          this.$Toast('今日可领取次数已用尽')
          return false
        } else {
          this.$Loading.open()
          let params = {
            mktActivityId: item.mktActivityId,
            ruleId: item.ruleId,
            provinceId: this.$store.state.indexData.provinceId || '',
            cityId: this.$store.state.indexData.cityId || '',
            countryId: this.$store.state.indexData.countryId || '',
            townId: this.$store.state.indexData.townId || ''
          }
          this.$http.post('/app/json/app_market/getCouScanUrl', params).then(res => {
            let data = res.data
            if (data.status == 0 && data.data) {
              if (data.data.mktAwardModelList && data.data.mktAwardModelList.length > 0) {
                this.$Toast('领取成功')
                item2.state = 20
              } else {
                this.$Toast(data.info || '领取失败')
              }
            } else {
              this.$Toast(data.info || '领取失败')
            }
            this.$Loading.close()
          })
        }
      },
      showHtml(data) {
        return data
          .replace(data ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "\'")
          .replace(/&amp;/g, '&')
          .replace(/p&gt;/g, 'p')
          .replace(/&nbsp;/g, ' ')
      },
      toStore(coupon) {
        // let path = '/mall2/list/' + this.$util.getDataString()
        // if (coupon.canUseListPath) {
        //   path = coupon.canUseListPath
        // }
        this.$router.push({
          path: '/canusestore_list',
          query: {
            couTypeCode: coupon.couTypeCode,
            couNo: coupon.couNo
          }
        })
      },
      toList(coupon) {
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            pageType: 'coupon',
            coupon: coupon.couTypeCode,
            couThresholdAmount: coupon.couThresholdAmount,
            couFaceValue: coupon.couFaceValue,
            lastPath: this.$route.path,
            endTime: this.$util.getDateFromString(coupon.validEndDate)
          }
        })
        // this.$toast("开发中")
      },
      toStationto() {
        this.$router.push({
            path: '/stationto',
            query: {stationType:'coupon',RefuelGsOuCode: this.coupon2.couTypeUseConditionModel.refuelGsOuCode, RefuelGsOuCodeOp:this.coupon2.couTypeUseConditionModel.refuelGsOuCodeOp}
        })
      },
      getCouActivityAward() {
        this.$Loading.open()
        let params = {
          // province: this.$store.state.indexData.province,
          // city: this.$store.state.indexData.city
          provinceId: this.$store.state.indexData.provinceId || '',
          cityId: this.$store.state.indexData.cityId || '',
          countryId: this.$store.state.indexData.countryId || '',
          townId: this.$store.state.indexData.townId || ''
        }
        if (this.activityId) {
          params.mktActivityId = this.activityId
        }
        this.$http.post('/app/json/app_market/queryGetCouActivityAward', params).then(res => {
          let data = res.data
          if (data.status == 0) {
            if (data.data) { // 有数据
              // 设置专享券置顶
              this.defaultCouActivity = data.data.sort((a) => {
                if (a.activityTag == '专享券') {
                  return -1
                }
              })
              // 添加全部
              this.defaultCouActivity.unshift({
                activityModelList: [],
                activityTag: '全部'
              })
              // 获取所有券
              this.defaultCouActivity.forEach(value => {
                value.activityModelList.forEach(value2 => {
                  this.defaultCouActivity[0].activityModelList.push(value2)
                })
              })
              // 会员权益，专享券
              if (this.specialCoupon.length) {
                // 添加专享券
                let activityModelList = this.specialCoupon.map(item => {
                  item.special = true
                  return item
                })
                this.defaultCouActivity[0].activityModelList.unshift(...activityModelList) // 全部的列表数组前插入专享券列表
                this.defaultCouActivity.unshift({ // 整个二维数组前插入专享券
                  activityModelList: activityModelList,
                  activityTag: '专享券'
                })
              }
              if (this.defaultCouActivity.length && this.defaultCouActivity[this.couponTypeIndex]) {
                this.couActivity = this.defaultCouActivity[this.couponTypeIndex].activityModelList
              }
                this.handle(this.defaultCouActivity)
            }

          }
          this.pageInit = true
        })
      },
      handle(data){
        console.log(data,'data')
        data.forEach((value,index)=>{
          value.activityModelList.forEach((value1,index1)=>{
            value1.couList.forEach((value2,index2)=>{
                if(value2.couTypeCode==this.couTypeCode){
                  this.noneFlag=false
                  this.couponType=value2.couTypeCategoryAlias;
                  this.coupon=value1
                  this.coupon2=value2
                  console.log(this.coupon2,'this.coupon2')
                }
            })
          })
        })
        this.showFlag=true
        this.$Loading.close()
      },
      getCouDetail(){
          let params = {
            awardType: 10
          }
          this.$http.post(`/app/json/app_market/getCanReceiveAwardListGroupByActivity`, params).then(res => {
            let data = res.data
            let list = data.data || []
            if (data.status == 0) {
              this.specialCoupon = list
            }
            this.getCouActivityAward()
            // this.$Loading.close()
          })

      }
    },

    created() {
      this.activityId=this.$route.query.activityId
      this.couTypeCode=this.$route.query.couTypeCode
      // this.coupon = JSON.parse(this.$route.query.coupon);
      // this.coupon2 = JSON.parse(this.$route.query.coupon2);
      // console.log(this.coupon2)
      // this.couponType=this.coupon2.couTypeCategoryAlias;
      this.couponType='666';
      this.getCouDetail()
    }
  }
</script>

<style lang="stylus" scoped>
.coupon-center{
  padding: 10px;
  .coupon{
    position relative
    .received{
      width: 60px;
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
}
.cell{
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  margin: 5px 0;
}
.rule-warpper {
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius 5px;
    padding 10px;
    .title {
      font-weight: 600
    }
    .content {
      padding 11px 0
      line-height: 20px;
    }
  }
  .my-coupon-link {
      bottom: 15px;
      position: fixed
      width 100%
      /*padding 0 20%*/
      z-index 11
      left: 0;
      right: 0;
      padding: 0 5%;

      .link {
        display block
        // background: $color-theme-r
        border-radius 40px;
        text-align: center
        height 40px;
        line-height: 40px;
        color white
        font-size: 16px;
      }
    }
  .empty{
    display flex
    justify-content center
    align-items center
  }
</style>
