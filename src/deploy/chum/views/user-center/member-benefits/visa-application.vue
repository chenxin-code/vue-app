<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="vip-car">
      <div class="content-con">
        <div class="info">
          <div class="info-con" @click="instruction"><span class="icon">?</span> <span>办签说明</span></div>
        </div>
        <van-form validate-first @failed="onFailed" ref="form" @submit="save">
          <div class="form">
            <van-field
              required
              v-model="liveAddress"
              name="liveAddress"
              label="常住地"
              @click="show2=true"
              placeholder="您的常住地是哪"
              :rules="[{ required: true, message: '请输入常住地' }]"
            />
            <van-field
              required
              v-model="targetPlace"
              @click="show1=true"
              name="targetPlace"
              label="出行国家"
              placeholder="您要去哪个国家"
              :rules="[{ required: true, message: '请输入出行国家' }]"
            />
            <van-field
              required
              v-model="useBeginTime"
              name="useBeginTime"
              label="出行日期"
              placeholder="计划出行日期"
              @click="showCalendar = true"
              :rules="[{ required: true, message: '请选择出行日期' }]"
            />
          </div>
          <div class="form">
            <van-field
              v-model="userName"
              name="userName"
              required
              label="姓名"
              placeholder="请输入姓名"
              disabled
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
              v-model="userMessage"
              name="userMessage"
              label="备注信息"
              type="textarea"
              class="gray"
              placeholder=""
              label-class="spacial"
            />
          </div>
        </van-form>
        <van-calendar v-model="showCalendar" @confirm="onConfirm" :show-confirm="false"/>
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
        {{content}}
<!--        <div class="contain">-->
<!--          1、会员卡有效期内，会员获赠不限次签证费50元抵用券优惠，可受理领区以及可办理国家等详情详见下表单，表外的办理签证国家及领区暂不适用本权益。-->
<!--        </div>-->
<!--        <div class="contain">-->
<!--          2、签证优惠权益仅限会员本人及至多两名亲友使用。-->
<!--        </div>-->
<!--        <div class="contain">-->
<!--          3、权益仅限办理签证时抵扣，不能叠加使用，不能抵换现金。-->
<!--        </div>-->
      </div>
      <van-button type="info" native-type="submit" class="sliver" @click="show=false">
        我知道了
      </van-button>
    </van-action-sheet>
    <van-action-sheet v-model="show1" :actions="actions" @select="onSelect" title="选择签证国家">
      <div class="line"></div>
      <div class="btn-con">
        <van-button round type="info" v-for="(item,key) in countryList" class="country" :class="{'select':!item.flag}" @click="addClass(item)" :key="key">{{item.dictValue}}</van-button>
      </div>
      <van-button type="info" native-type="submit" class="sliver" @click="select">
        确定
      </van-button>
    </van-action-sheet>
    <van-action-sheet v-model="show2" :actions="actions" @select="onSelect" title="选择常住地">
      <div class="line"></div>
      <div class="btn-con">
        <van-button round type="info" v-for="(item,key) in homeList" class="country"  :class="{'select':homeIndex==key}" @click="select2(item,key)" :key="key">{{item.name}}</van-button>
      </div>
<!--      <van-button type="info" native-type="submit" class="sliver" @click="select">-->
<!--        确定-->
<!--      </van-button>-->
    </van-action-sheet>
    <CheckPaidMember @failHandler="failHandler"></CheckPaidMember>
  </div>
</template>
<script>
  import {Form, Calendar} from 'vant';

  export default {
    name: "visaApplication",
    components: {
      [Form.name]: Form,
      [Calendar.name]: Calendar,
      CheckPaidMember: () => import('../../check-paid-member/check-paid-member')
    },
    data() {
      return {
        actions:[],
        show:false,
        show1:false,
        show2:false,
        active: 1,
        content:null,
        userPhone: null,
        userName: null,
        useBeginTime: null,
        targetPlace: null,
        liveAddress: null,
        userMessage: null,
        homeIndex:null,
        list: [
          {name: '接机'},
          {name: '送机'},
        ],
        countryList:[
          {name:"英国",flag:true},
          {name:"法国",flag:true},
          {name:"德国",flag:true},
          {name:"意大利",flag:true},
          {name:"德国",flag:true}
        ],
        selectList:[],
        form: {},
        showCalendar: false,
        show: false,
        homeList:[],
        patternPhone: /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
      }
    },
    methods: {
      failHandler() {
        this.$router.go(-1)
      },
      cancel() {
        this.$router.go(-1)
      },
      onSelect(){

      },
      confirm() {
        this.$refs.form.submit()
      },
      instruction() {
        this.show = true
      },
      onFailed() {

      },
      select(){
        this.selectList=[]
        this.targetPlace=''
        this.countryList.forEach((value,index,arr)=>{
          console.log(value,index,arr)
          if(!value.flag){
            this.selectList.push(value)
            this.targetPlace+=','+value.dictValue
          }
          // value.flag=!value.flag
        })
        if( this.targetPlace.length>0){
          this.targetPlace= this.targetPlace.substr(1)
        }
        this.show1=false



      },
      select2(item,index){
        console.log(item,index)
        this.homeIndex=index
        console.log(this.homeIndex)
        this.liveAddress=item.name
        this.show2=false



      },
      onConfirm(date) {
        this.useBeginTime = this.$util.getMyDate(date).replace(/-/g, '/')
        this.showCalendar = false;
      },
      save(item) {
        console.log(item)
        let params =Object.assign(item,{
          serviceType:this.serviceType,
          equityMemberId:this.$route.query.id,
          memberId:this.$route.query.memberId,
          memberName:this.$route.query.memberName
        })
                this.$http.post("/app/json/equity_use_visa/addVisa", params).then(res => {
                  let data = res.data
                  if (data.status == 0) {
                    // this.$Toast("提交成功")
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
      getInfo(){
        let params = {

        }
        this.$http.post("/app/json/news/getNewsList?values=59", params).then(res => {
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
      },
      getCountry(){
        let params = {
          "alias":"visa_country"
        }
        this.$http.post("/app/json/app_dict/getDictByAlias", params).then(res => {
          let data = res.data
          if (data.status == 0) {
            console.log(res)
            this.countryList=res.data.data
            this.countryList.map((value,index,arr)=>{
              this.$set(value,"flag",true)
            })
          } else {
            this.$Toast(data.info)
          }
        }).catch((err) => {
          this.$Toast(err)
        })
      },
      addClass(item){
        if(item.flag){
          item.flag=false
        }else{
          item.flag=true
        }
      },
      getHome(){
        let url = '/app/json/area/loadAreaList';
        let params1 = {
          token: this.$store.state.login.token,
          parentId: 0
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            console.log(data);
            this.homeList=data.data;
            // this.homeList.map((value,index)=>{
            //  this.$set(value,"flag",true)
            // })

          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          console.log('获取失败', error);
          this.$Toast('获取数据失败')
        });
      }

    },
    created() {
      this.userName=this.$route.query.memberName
      this.userPhone=this.$route.query.memberPhone
      this.getInfo()
      this.getHome()
      this.getCountry()
    },
    mounted() {

      document.getElementsByName("liveAddress")[0].addEventListener("focus", function(){
        document.activeElement.blur();
      });
      document.getElementsByName("targetPlace")[0].addEventListener("focus", function(){
        document.activeElement.blur();
      });
      document.getElementsByName("useBeginTime")[0].addEventListener("focus", function(){
        document.activeElement.blur();
      });

    },
    beforeDestroy() {
      document.getElementsByName("liveAddress")[0].removeEventListener("focus", function(){
        document.activeElement.blur();
      });
      document.getElementsByName("targetPlace")[0].removeEventListener("focus", function(){
        document.activeElement.blur();
      });
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
    border none
    height: 49px;
    background: linear-gradient(270deg, rgba(49, 49, 49, 1) 0%, rgba(84, 84, 84, 1) 51%, rgba(49, 49, 49, 1) 100%);
    border-radius: 24px;
    color #C9A063
    border none
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
    width 100%;
    border none
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
    padding 12px 20px
    min-height 260px
    max-height 500px
    overflow-y scroll
    .contain {
      margin-bottom 8px
      /*height:37px;*/
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(16, 16, 16, 1);
      line-height: 19px;
    }
    img{
      width 100%
    }
  }
  .content >>> img{
    display block
    margin 0 auto
    width 80%
  }
  .btn-con{
    display flex
    justify-content flex-start
    padding 10px
    flex-wrap wrap
    max-height 400px
    min-height 260px
    overflow scroll
    align-content: flex-start;
    .country{
      width 23%
      margin-left 5px
      margin-top 10px
      background: rgba(255, 255, 255, 1);
      color #969799;
      /*color black;*/
      /*border-radius: 24px;*/
      border: 1px solid #969799;
      /*border: 1px solid black;*/
      height: 35px;
      border-radius: 5px;
      line-height: 35px;
    }
    /deep/.van-button__text{
      font-size 12px
    }
  }
  .btn-con:after{
    content:'';
    width:21%;
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
  .select.country{
    color: #c9a063;
    background-color: white;
    border: 1px solid #c9a063!important;
  }
</style>
