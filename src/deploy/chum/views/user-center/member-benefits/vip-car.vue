<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="vip-car">
      <div class="content-con">
        <van-tabs v-model="serviceType" line-height="0">
          <van-tab v-for="(item,index) in list" :key="index" :name="item.code">
            <template #title>
              <van-button round type="default" class="tab-btn cancel btn">{{item.name}}</van-button>
            </template>
          </van-tab>
        </van-tabs>
        <div class="info">
          <div class="info-con" @click="instruction"><span class="icon">?</span> <span>乘车须知</span></div>
        </div>
        <van-form validate-first @failed="onFailed" ref="form" @submit="save">
          <div class="form">
            <van-field ref="time"
              v-model="useBeginTime"
              label="预约时间"
              name="useBeginTime"
              required
              placeholder="请选择预约时间"
              @click="showCalendar = true"
              :rules="[{ required: true, message: '请选择预约时间' }]"
            />
            <van-field
              v-model="flightNo"
              name="flightNo"
              label="航班号"
              required
              placeholder="请输入航班号"
              :rules="[{ required: true, message: '请输入航班号' }]"
            />
            <van-field
              v-model="useStartPlace"
              name="useStartPlace"
              label="机场名称"
              required
              placeholder="请输入机场名称"
              :rules="[{ required: true, message: '请输入机场名称' }]"
            />
            <van-field
              v-model="useEndPlace"
              name="useEndPlace"
              label="目的地"
              required
              :placeholder="serviceType==1?'您要去哪儿':'您在哪儿上车'"
              :rules="[{ required: true, message: '请输入目的地' }]"
            />
<!--            <van-calendar v-model="showCalendar" @confirm="onConfirm"/>-->
          </div>
          <div class="form">
            <van-field
              v-model="userName"
              name="userName"
              label="姓名"
              required
              disabled
              placeholder="请输入姓名"
              :rules="[{ required: true, message: '请输入姓名' }]"
            />
            <van-field
              v-model="userPhone"
              name="userPhone"
              label="联系方式"
              required
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请输入手机号' },{pattern:patternPhone,message: '请输入有效手机号'}]"
            />

            <van-field
              v-model="carRemarks"
              name="carRemarks"
              label="备注信息"
              type="textarea"
              class="gray"
              placeholder="用户留言，非必填"
              label-class="spacial"
            />
<!--            <van-calendar v-model="showCalendar" @confirm="onConfirm"/>-->
            <van-popup position="bottom" v-model="showCalendar">
              <van-datetime-picker
                v-model="currentDate"
                title="选择用车时间"
                type="datetime"
                :min-date="minDate"
                :max-date="maxDate"
                @confirm="onConfirm"
                @cancel="showCalendar = false"
                :formatter="formatter"
                :filter="filter"
              />
            </van-popup>
          </div>
        </van-form>
        <div class="tips">
          注：
          1、只能预约24小时之后的接送机服务，请合理规划您的出行时间，以免耽误您的行程。
          2、行李件数最多可带3件
        </div>
      </div>
      <div class="handle-con">
        <van-button round type="default" class="btn cancel" @click="cancel">取消</van-button>
        <van-button round type="info" native-type="submit" class="btn save" @click="confirm">
          提交需求
        </van-button>
      </div>
    </nav-content>
    <van-action-sheet v-model="show" title="说明" :round=false>
      <div class="line"></div>
      <div class="content" v-html="content">
       {{ content}}
<!--        <div class="contain">-->
<!--          1、银卡会员： 会员卡有效期内，会员本人享受礼宾车接送服务1次，单次100公里以内免费，超出部分需按实际费用支出，此服务仅限国内使用。-->
<!--        </div>-->
<!--        <div class="contain">-->
<!--          2、金卡会员&企业卡会员 会员卡有效期内，会员每人享受礼宾车接送服务2次，单次100公里以内免费，超出部分需按实际费用支出，此服务仅限国内使用。-->
<!--        </div>-->
<!--        <div class="contain">-->
<!--          3、乘车说明：行李、预约时间等。-->
<!--        </div>-->
      </div>
      <van-button type="info" native-type="submit" class="sliver" @click="show=false">
        我知道了
      </van-button>
    </van-action-sheet>
    <CheckPaidMember @failHandler="failHandler"></CheckPaidMember>
  </div>
</template>
<script>
  import {Form, Calendar} from 'vant';

  export default {
    name: "vipCar",
    components: {
      [Form.name]: Form,
      [Calendar.name]: Calendar,
      CheckPaidMember: () => import('../../check-paid-member/check-paid-member')
    },
    data() {
      return {
        minDate: null,
        maxDate: new Date(2225, 10, 1),
        currentDate: new Date(),
        content:null,
        userName:null,
        useStartPlace:null,
        useEndPlace:null,
        flightNo:null,
        useBeginTime:null,
        userPhone:null,
        serviceType: 1,
        carRemarks:null,
        patternPhone: /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
        list: [
          {name: '接机',code:1},
          {name: '送机',code:2}
        ],
        form: {},
        showCalendar: false,
        show: false
      }
    },
    methods: {
      failHandler() {
        this.$router.go(-1)
      },
      cancel() {
        this.$router.go(-1)
      },
      confirm() {
        this.$refs.form.submit()
      },
      filter(type, options) {
        if (type === 'minute') {
          return options.filter((option) => option % 10 === 0);
        }

        return options;
      },
      formatter(type, value) {
        console.log(type,value)
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }else if(type === "day"){
          return `${value}日 `
        }else if(type === "hour"){
          return `${value}时`
        }else if(type === "minute"){
          return `${value}分 `
        }
        return value;
      },
      save(item){
        console.log(item);
        let params =Object.assign(item,{
          serviceType:this.serviceType,
          equityMemberId:this.$route.query.id,
          memberId:this.$route.query.memberId,
          memberName:this.$route.query.memberName
        })
                this.$http.post("/app/json/equity_use_car/addCar", params).then(res => {
                  let data = res.data
                  if (data.status == 0) {
                    this.$router.push({
                      path: "/benefits/success",
                      query: {
                        id:res.data.data
                      }
                    })
                  } else {
                    this.$Toast(data.info)
                  }
                }).catch((err) => {
                  this.$Toast(err)
                })
      },
      instruction() {
        this.show = true
      },
      onFailed() {

      },
      onConfirm(date) {
        console.log(date)
        // this.useBeginTime=this.$util.getPayTimemin(date).replace(/-/g,'/')
        this.useBeginTime=this.$util.getPreTime(date).replace(/-/g,'/')
        // this.startDate = `${date.getMonth() + 1}/${date.getDate()}`;
        this.showCalendar = false;
      },
      getInfo(){
        let params = {

                }
                this.$http.post("/app/json/news/getNewsList?values=58", params).then(res => {
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
      this.userName=this.$route.query.memberName
      this.userPhone=this.$route.query.memberPhone
      this.minDate=new Date()
      this.minDate.setDate( this.minDate.getDate()+1)
      this.getInfo()
    },
    mounted() {

      document.getElementsByName("useBeginTime")[0].addEventListener("focus", function(){
        document.activeElement.blur();
      });
    },
    beforeDestroy() {
      document.getElementsByName("useBeginTime")[0].removeEventListener("focus", function(){
        document.activeElement.blur();
      });
    }

  }
</script>

<style lang="stylus" scoped>
  .vip-car {
    overflow scroll
  }

  .handle-con {
    display flex
    justify-content space-between
    align-items center
    margin 25px 20px
  }

  .btn {
    width 162px
    height 49px
  }

  .save {
    height: 49px;
    background: linear-gradient(270deg, rgba(49, 49, 49, 1) 0%, rgba(84, 84, 84, 1) 51%, rgba(49, 49, 49, 1) 100%);
    border-radius: 24px;
    color #C9A063
    border none
    /*border 1px solid blue*/
  }

  .cancel {
    height: 49px;
    background: rgba(255, 255, 255, 1);
    border-radius: 24px;
    border: 1px solid rgba(49, 49, 49, 1);
    color #C9A063
  }

  .tab-btn {
    height 44px !important
    background: rgba(255, 255, 255, 1);
    border-radius: 24px;
    border: 1px solid rgba(201, 160, 99, 1);
  }

  /deep/ .van-tabs__wrap {
    border none
  }

  /deep/ .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    border none
  }

  /deep/ .van-tab--active .tab-btn {
    background: rgba(201, 160, 99, 1);
    border-radius: 24px;
    color #FFFFFF
  }

  /deep/ .van-tabs__wrap {
    margin 15px 20px
  }

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

  .form {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin 0 20px
    margin-bottom 10px

    .product-item {
      display flex
      justify-content space-between
      align-items center
      height 44px
    }

    .img-icon {
      width 20px
      height 20px
      background url("../userimgs/unselect.png") center no-repeat
    }

    .checked {
      width 20px
      height 20px
      background url("../userimgs/select.png") center no-repeat
      background-size contain
    }

    .spacial {
      display block
    }

    /deep/ .gray .van-field__value {
      height: 80px;
      background: rgba(246, 246, 246, 1);
      border-radius: 5px;
    }
    .gray{
      display block
    }

  }

  .tips {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 19px;
    margin 0 30px
    margin-top 5px
  }

  .sliver {
    height: 49px;
    border none
    width 100%;
    background: linear-gradient(270deg, rgba(49, 49, 49, 1) 0%, rgba(84, 84, 84, 1) 51%, rgba(49, 49, 49, 1) 100%);

    .van-button__text {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #C9A063;
      line-height: 25px;
    }
  }

  .title {
    height: 23px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(16, 16, 16, 1);
    line-height: 23px;
    margin-bottom 3px
  }

  .content {
    /*margin 0 20px*/
    padding 12px 20px
    max-height 400px
    min-height 260px
    overflow scroll
    .contain {
      margin-bottom 8px
      /*height:37px;*/
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(16, 16, 16, 1);
      line-height: 19px;
    }
  }
  .content >>> img{
    display block
    margin 0 auto
    width 80%
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
</style>
