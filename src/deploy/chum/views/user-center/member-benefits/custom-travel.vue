<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="travel">
      <div class="info"><div class="info-con" @click="instruction"> <span class="icon">?</span> <span>说明</span></div></div>
      <div class="form">
        <van-form validate-first @failed="onFailed" @submit="save" ref="form">
          <van-field name="serviceType" label="产品类型">
            <template #input>
              <van-radio-group v-model="serviceType" direction="horizontal">
                <van-radio name="1">
                  出境游
                  <template #icon="props">
                    <img class="img-icon" :class="{'checked':serviceType==1}"/>
                  </template>
                </van-radio>
                <van-radio name="2">
                  国内游
                  <template #icon="props">
                    <img class="img-icon"  :class="{'checked':serviceType==2}" />
                  </template>
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="useStartPlace"
            name="useStartPlace"
            label="出发城市"
            required
            placeholder="请输入出发城市"
            :rules="[{ required: true, message: '请输入出发城市' }]"
          />
          <van-field
            v-model="useEndPlace"
            name="useEndPlace"
            required
            label="目的地"
            placeholder="请输入目的地"
            :rules="[{ required: true, message: '请输入目的地' }]"
          />
          <van-field
            v-model="useBeginTime"
            label="出发日期"
            required
            name="useBeginTime"
            placeholder="请选择出发日期"
            @click="showCalendar = true"
            :rules="[{ required: true, message: '请选择出发日期' }]"
          />
          <van-field
            v-model="useEndTime"
            name="useEndTime"
            label="返回日期"
            required
            placeholder="请选择返回日期"
            @click="showCalendar2 = true"
            :rules="[{ required: true, message: '请选择返回日期' }]"
          />
          <van-field
            v-model="useNumber"
            name="useNumber"
            label="出游人数"
            required
            placeholder="请输入出游人数"
            :rules="[{ required: true, message: '请输入出游人数' }]"
          />
          <van-field
            v-model="averageAmount"
            name="averageAmount"
            label="人均预算"
            required
            placeholder="请输入人均预算"
            :rules="[{ required: true, message: '请输入人均预算' }]"
          />
          <van-field
            v-model="userName"
            name="userName"
            label="联系人姓名"
            placeholder="请输入联系人姓名"
            disabled
            required
            :rules="[{ required: true, message: '请输入联系人姓名' }]"
          />
          <van-field
            v-model="userPhone"
            name="userPhone"
            label="手机号"
            placeholder="请输入手机号"
            required
            :rules="[{ required: true, message: '请输入手机号' },{pattern:patternPhone,message: '请输入有效手机号'}]"
          />
          <van-field
            v-model="useEmailAddress"
            name="useEmailAddress"
            label="邮箱地址"
            placeholder="请输入邮箱地址"
            required
            :rules="[{ required: true, message: '请输入邮箱地址' },{pattern,message: '邮箱不合法'}]"
          />
          <van-field
            v-model="userMessage"
            name="userMessage"
            label="备注信息"
            type="textarea"
            class="gray"
            maxlength="150"
            placeholder="航班时间，酒店星级，特殊要求，最多不超过150字。"
            label-class="spacial"
          />
        </van-form>
        <van-calendar v-model="showCalendar" @confirm="onConfirm"  :max-date="maxDate" :show-confirm="false"/>
        <van-calendar v-model="showCalendar2" @confirm="onConfirm2" :min-date="minDate" :show-confirm="false"/>
      </div>
      <div class="tips">
        *为必填项，出发日期为第三天及以后，截止日期不能早于出发日期，请您确认好订单
      </div>
      <div class="handle-con">
        <van-button round  type="default" class="btn cancel" @click="cancel">取消</van-button>
        <van-button round  type="info" native-type="submit" class="btn save" @click="save1">
          提交需求
        </van-button>
      </div>
      <van-action-sheet v-model="show" title="说明" :round=false>
        <div class="line"></div>
        <div class="content" v-html="content">
          {{content}}
<!--          <div class="title">银卡会员 金卡会员</div>-->
<!--          <div class="contain">-->
<!--            会员本人自动成为CHUM Courtesy定制游会员，享受定制游产品9.5折优惠。-->
<!--          </div>-->
<!--          <div class="title">企业卡会员</div>-->
<!--          <div class="contain">-->
<!--            5名会员每人自动成为CHUM Courtesy定制游会员，享受定制游产品9折优惠。-->
<!--          </div>-->
<!--          <div class="contain">-->
<!--            咨询请致电服务咨询电话010-85228088或咨询CHUM Courtesy微信服务号微信客服。-->
<!--          </div>-->
        </div>
        <van-button   type="info" native-type="submit" class="sliver" @click="show=false">
          我知道了
        </van-button>
      </van-action-sheet>
    </nav-content>
    <CheckPaidMember @failHandler="failHandler"></CheckPaidMember>
  </div>
</template>
<script>
  import {Form,Calendar} from 'vant';
    export default {
        name: "customTravel",
        components: {
          [Form.name]: Form,
          [Calendar.name]: Calendar,
          CheckPaidMember: () => import('../../check-paid-member/check-paid-member')
        },
        data() {
            return {
              content:null,
              userMessage:"",
              useEmailAddress:null,
              userPhone:null,
              userName:null,
              averageAmount:null,
              useNumber:null,
              useEndTime:null,
              useBeginTime:null,
              useEndPlace:null,
              useStartPlace:null,
              serviceType:1,
              form:{},
              pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
              patternPhone: /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
              showCalendar:false,
              showCalendar2:false,
              show:false,
              minDate:new Date(),
              maxDate:new Date("2100-12-30")
            }
        },
        methods: {
          failHandler() {
            this.$router.go(-1)
          },
          onFailed(errorInfo) {
            console.log('failed', errorInfo);
          },
          onConfirm(date) {
            this.useBeginTime=this.$util.getMyDate(date).replace(/-/g,'/')
            this.showCalendar = false;
            this.minDate=new Date(date)
          },
          onConfirm2(date) {
            this.useEndTime=this.$util.getMyDate(date).replace(/-/g,'/')
            this.showCalendar2 = false;
            this.maxDate=new Date(date)
          },
          instruction(){
            this.show=true
          },
          save1(){
            this.$refs.form.submit()
          },
          cancel(){
            this.$router.go(-1)
          },
          save(item){
           console.log(item)
            let params =Object.assign(item,{
              serviceType:this.serviceType,
              equityMemberId:this.$route.query.id,
              memberId:this.$route.query.memberId,
              memberName:this.$route.query.memberName
            })
            this.$http.post("/app/json/equity_use_travel/addTravel", params).then(res => {
              let data = res.data
              if (data.status == 0) {
                console.log(data)
                // this.$Toast("提交成功")
                this.$router.push({
                              path: "/benefits/success",
                              query: {
                                id:data.data
                              }
                            })
              } else {
                this.$Toast(data.info)
              }
            }).catch((err) => {
              this.$Toast(err)
            })
          },
          getInfo(){
            let params = {

            }
            this.$http.post("/app/json/news/getNewsList?values=57", params).then(res => {
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
        this.getInfo()
      },
      mounted() {

        document.getElementsByName("useBeginTime")[0].addEventListener("focus", function(){
          document.activeElement.blur();
        });
        document.getElementsByName("useEndTime")[0].addEventListener("focus", function(){
          document.activeElement.blur();
        });
      },
      beforeDestroy() {
        document.getElementsByName("useBeginTime")[0].removeEventListener("focus", function(){
          document.activeElement.blur();
        });
        document.getElementsByName("useEndTime")[0].removeEventListener("focus", function(){
          document.activeElement.blur();
        });
      }
    }
</script>

<style lang="stylus" scoped>
.travel {
    overflow scroll
  .info {
    height 35px
    margin 0 20px
    display flex
    justify-content flex-end
    align-items center
    .info-con {
      width 42px
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
  .form{
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 10px 0px rgba(0,0,0,0.1);
    border-radius:10px;
    margin 0 20px
    .product-item{
      display flex
      justify-content space-between
      align-items center
      height 44px
    }
    .img-icon{
      width 20px
      height 20px
      background url("../userimgs/unselect.png") center no-repeat
    }
    .checked{
      width 20px
      height 20px
      background url("../userimgs/select.png") center no-repeat
      background-size contain
    }
    .spacial{
      display block
    }
    /deep/.gray .van-field__value{
      height:80px;
      background:rgba(246,246,246,1);
      border-radius:5px;
    }
    .gray{
      display block

    }
  }
  .handle-con{
    display flex
    justify-content space-between
    align-items center
    margin 10px 20px
    /*margin-bottom 10px*/
    .btn{
      width 162px
      height 49px
    }
    .save{
      height:49px;
      background:linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%);
      border-radius:24px;
      color #C9A063
      border none
      /*border 1px solid blue*/
    }
    .cancel{
      height:49px;
      background:rgba(255,255,255,1);
      border-radius:24px;
      border:1px solid rgba(49,49,49,1);
      color #C9A063
    }
  }
  .tips{
    font-size:13px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:19px;
    margin 0 30px
    margin-top 5px
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
  .title{
    height:23px;
    font-size:16px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(16,16,16,1);
    line-height:23px;
    margin-bottom 3px
  }
  .content{
    padding 12px 20px
    max-height 400px
    min-height 260px
    overflow-y scroll
    .contain{
      margin-bottom 8px
      height:37px;
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(16,16,16,1);
      line-height:19px;
    }
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
