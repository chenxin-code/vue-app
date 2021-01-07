<template>
    <div>
      <nav-top :noTitle='true' @backEvent="backEvent" :bgImg='bgImg' >
      </nav-top>
      <div class="use-eq">
        <p>
          您当前正在使用“{{$route.query.equityName || ''}}”
        </p>
        <p>
          为更好的提供服务
        </p>
        <p>
          填写下列信息即可使用权益
        </p>
      </div>
      <nav-content>
        <!-- form提交内容 -->
        <div class="form">
            <div class="f-input">
              <div class="left">姓名：</div>
              <div class="right">
                  <input type="text" v-model="formData.userName" placeholder="请填写您的姓名" />
              </div>
            </div>
            <div class="f-input">
              <div class="left">手机号：</div>
              <div class="right">
                  <input type="text" v-model="formData.userPhone" placeholder="请填写您的手机号" />
              </div>
            </div>
            <div class="f-input">
              <div class="left">车牌号：</div>
              <div class="right r-car">
                  <div class='car' @click='show=true'>
                    <span>{{csd}}</span>
                    <van-icon :name="show?'arrow-up':'arrow-down'" />
                  </div>
                  <input type="text" v-model="carNum" placeholder="请填写车牌号" />
              </div>
            </div>
            <p>
              <van-checkbox @change='changeCheck' v-model="checkPro" shape="square">活动隐私权益</van-checkbox>
            </p>
        </div>
        <div class="btns">
          <van-button class='use-btn' type="primary" round color='#F02C2D' block @click='submit'>立即使用</van-button>
        </div>
      </nav-content>
      <!-- 弹出协议 -->
      <van-popup v-model="showPro" position="right" close-icon-position="top-left" :style="{ height: '100%',width: '100%' }" closeable >
        <p class='proto-content' v-html='protocal.content'>内容</p>
        <div class="btns">
          <van-button class='use-btn' type="primary" round color='#F02C2D' block @click='confirm'>确认</van-button>
        </div>
      </van-popup>
      <!-- 车牌号 -->
      <van-popup v-model="show" get-container="body"  position="bottom"  round :style="{ height: '40%' }">
        <van-picker
          title="车属地"
          show-toolbar
          :columns="carList"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: false,  //显示车属地
        showPro: false,  // 显示协议
        checkPro: false, //勾选协议
        formData:{
          userName: null,
          userPhone: null,
          carNumber: null
        },
        csd: '京',
        protocal:{}, // 协议
        carNum: null,
        infoData:{},
        carList:[
          '京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏','浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼','川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新','藏', '使', '领', '警', '学', '港', '澳'
        ]
      }
    },
    created() {
      this.$http.post("/app/json/news/getNewsList?values=71").then(res=>{
        let data = res.data
        if(data.status == 0) {
          this.protocal = data.data[0] || {}
        } else {
          this.$toast(data.info)
        }
      }).catch((err)=>{
        this.$toast('系统错误',err)
      })
    },
    methods:{
      submit() {
        if(!this.formData.userName) {
          this.$toast("请输入姓名")
          return;
        }
        if(!this.formData.userPhone) {
          this.$toast("请输入手机号")
          return;
        }
        if(!this.carNum) {
          this.$toast("请输入车牌号")
          return;
        }
        if(!this.$util.checkMobile(this.formData.userPhone)){
          this.$toast('请输入正确的手机号码');
          this.formData.userPhone = null;
          return;
        }
        if(!this.checkPro) {
          this.showPro = true
          this.checkPro = true;
        }
        this.formData.carNumber= this.csd+this.carNum;
        
        if(!this.plateNumber(this.formData.carNumber) && !this.newEnergy(this.formData.carNumber)) {
          this.$toast("请输入正确的车牌号码")
          this.carNum = null;
          this.formData.carNumber = null;
          return;
        }
        let params = this.$route.query
        let obj = {
          ...this.formData,
          equityId: params.equityId,
          memberEquityTypeCode: params.memberEquityTypeCode
        }
        this.$http.post('/app/json/equity_member/useMemberEquity',obj).then(res=>{
          let data = res.data
          if(data.status == 0) {
            let obj = {
              path: '/service_success',
            }
            this.$router.push(obj)
          } else {
            this.$router.replace('/service_list')
            this.$toast(res.data.info)
          }
        })
      },
      confirm() {
        this.showPro = false;
        this.checkPro = true;
      },
      changeCheck(val) {
        if(val) this.showPro = true;
      },
      plateNumber(value){ // 车牌号
        let regplateNumber = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;
        return regplateNumber.test(value)
      },
      newEnergy(value) { // 新能源车牌号
        let newEnergy = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$)/;
        return newEnergy.test(value)
      },
      backEvent() {
        this.$router.go(-1)
      },
      onConfirm(val) {
        this.csd = val;
        this.show = false;
      },
      onCancel() {
        this.show = false;
      }
    },
    computed: {
      headImg() {
        return this.$store.state.userInfo.avtUrl;
      },
      bgImg() {
        return require('./images/bg.png')
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
  z-index 999 !important;
  position relative !important
}
/deep/ .nav-content{
  top: 180px !important;
}
/deep/ .van-cell__value--alone{
  font-size: 20px !important;
  text-align: center !important;
}
.proto-content{
  padding: 80px 3%;
  height: 100%;
}
.use-eq{
  position absolute
  width 80%
  text-align center
  top: 40px
  left: 50%;
  transform: translateX(-50%)
  color:#fff
  font-size 15px
  line-height 30px
  z-index 10
}
.h_cont{
  position absolute
  width: 90%;
  height: 100px;
  background:#fff;
  z-index 999;
}
.form{
  padding: 10px;
  box-shadow: 0px 0px 3px rgba(0,0,0,0.3)
  position relative
  top: 2px;
  width: 95%;
  border-radius 4px;
  margin: 0 auto;
  .f-input{
    display flex;
    align-items center;
    margin: 15px 0;
    .left{
      flex: 2
      font-size: 14px;
      color: #333333;
    }
    .right{
      flex: 8
      input{
        background:#F6F6F6;
        width: 100%;
        padding: 10px 20px;
        border-radius 15px
        vertical-align middle;
        &::placeholder{
          color: #999999;
        }
      }
      
    }
    .r-car{
      display: flex;
      .car{
        display: inline-block
        background:#F6F6F6;
        padding: 10px 20px;
        border-radius 15px
        font-size: 16px;
        color: #333333;
        margin-right: 10px;
        display: flex;
      }
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
.list{
  padding: 40px 20px;
  height: 100%;
  overflow: auto;
}

</style>