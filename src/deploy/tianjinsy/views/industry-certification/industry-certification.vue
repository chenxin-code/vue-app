<template>
  <div class="industry-index">
    <nav-top title="职业认证" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="industry-content" v-if="isnotSubmit">
      <div class="step-modular">
        <div class="step-arr">
          <div class="step-item" v-for="(item, index) in stepArr" :key="index">
            <img :src="industryIndex == index ? item.imgIconOn : item.imgIcon" alt="">
            <span>{{item.title}}</span>
          </div>
        </div>
      </div>
      <div v-if="modalType">
        <component :is="modalType" ref="childCom" :subParams="subParams" :materialTxt="materialTxt"></component>
      </div>
      
      <div class="approve" @click="toApprovalHandle">
        <img src="../../assets/images/approve-btn.png" alt="">
      </div>
    </nav-content>
    <nav-content v-if="!isnotSubmit" class="sub-success">
      <div class="success-content">
        <img src="../../assets/images/ok-btn.png" alt="">
        <p class="success-title">上传完成，等待工作人员审核</p>
        <p>审核时间大约需要5个工作日</p>
      </div>
    </nav-content>
    <div class="sub-btn" @click="subHandle">
      <span>{{btnTxt}}</span>
    </div>
  </div>
</template>
<script>

  export default {
    components: {
      'UserInfo': () => import('./components/user-info'),
      'DrivingInfo': () => import('./components/driving-info'),
      'MaterialInfo': () => import('./components/material-info')
    },
    data() {
      return {
        isnotSubmit: true,
        industryIndex: 0,
        modalType: 'UserInfo',
        stepArr: [
          {
            title: '身份信息',
            imgIcon: require('../../assets/images/userInfo.png'),
            imgIconOn: require('../../assets/images/userInfo-on.png')
          }, {
            title: '行车信息',
            imgIcon: require('../../assets/images/driving.png'),
            imgIconOn: require('../../assets/images/driving-on.png')
          }, {
            title: '资质材料',
            imgIcon: require('../../assets/images/material.png'),
            imgIconOn: require('../../assets/images/material-on.png')
          }
        ],
        btnTxt: '下一步',
        subParams: {},
        materialTxt: ''
      }
    },
    mounted() {
    },
    methods: {
      subHandle() {
        if (this.isnotSubmit) {
          if (this.modalType == 'UserInfo') {
            if (this.$refs.childCom.isclause) {
              let {realName, phone, idcardNum} = this.$refs.childCom.userFromData
              if (realName && phone && idcardNum) {
                this.subParams = {...this.$refs.childCom.userFromData}
                this.industryIndex++
                this.modalType = 'DrivingInfo'
              } else {
                this.$Toast('请将内容填写完整')
              }
            } else {
              this.$Toast('请阅读并同意服务条款')
            }
          } else if (this.modalType == 'DrivingInfo') {
            let {commonArea, commonOil, drivingUrl, monthOilLitre, onlineCarType, plateNum, vechileType} = this.$refs.childCom.drivingFromData
            console.log(this.$refs.childCom.drivingFromData)
            if (commonArea && commonOil && monthOilLitre && onlineCarType != null && plateNum && vechileType) {
              if (this.$refs.childCom.checked) {
                if (!drivingUrl) {
                  this.$Toast('请上传行驶证副页照片')
                  return
                }
              }
              this.subParams = {
                ...this.subParams,
                ...this.$refs.childCom.drivingFromData,
                isHybrid: this.$refs.childCom.checked ? 1 : 0
              }
              if (!this.$refs.childCom.checked) delete this.subParams.drivingUrl
              this.industryIndex++
              this.modalType = 'MaterialInfo'
              if (this.subParams.onlineCarType == 0) { // 无网约车
                this.materialTxt = '请拍摄手机网约车平台“我的”页和司机身份证头像面合照'
              } else if (this.subParams.onlineCarType == 1) {
                this.materialTxt = '请上传您的"网络预约出租车驾驶员证和您身份证头像面合照"'
                this.btnTxt = '提交'
              }
            } else {
              this.$Toast('请将内容填写完整')
            }
          } else if (this.modalType == 'MaterialInfo') {
            if (this.subParams.onlineCarType == 0 && this.btnTxt == '下一步') { // 无网约车
              if (this.$refs.childCom.materialFormData.paperImgUrl) {
                this.materialTxt = '请拍摄手机网约车平台跑单流水页和司机身份证头像面合照'
                this.btnTxt = '提交'
                this.subParams = {
                  ...this.subParams,
                  paperImgUrl: this.$refs.childCom.materialFormData.paperImgUrl
                }
                this.$refs.childCom.paperImgUrl = ''
                this.$refs.childCom.materialFormData.paperImgUrl = ''
              } else {
                this.$Toast('请上传指定图片')
              }
            } else {
              console.log(213)
              if (this.$refs.childCom.materialFormData.paperImgUrl) {
                console.log(456)
                if (this.subParams.onlineCarType == 0) {
                  this.subParams = {
                    ...this.subParams,
                    paperImgUrl: `${this.subParams.paperImgUrl},${this.$refs.childCom.materialFormData.paperImgUrl}`
                  }
                } else if (this.subParams.onlineCarType == 1) {
                  this.subParams = {...this.subParams, ...this.$refs.childCom.materialFormData}
                }
                this.subIndustryHandle()
              } else {
                this.$Toast('请上传指定图片')
              }
            }
          }
        } else {
          this.isnotSubmit = true
          this.subParams = {}
          this.modalType = 'UserInfo'
          this.industryIndex = 0
          this.btnTxt = '下一步'
        }

      },
      toApprovalHandle() {
        this.$router.push({
          path: '/approval_state'
        })
      },
      subIndustryHandle() {
        let subUrl = '/app/json/user_industry/submmitIndustryForTianjin'
        this.$request.post(subUrl, this.subParams).then(res => {
          if (res.status == 0) {
            this.isnotSubmit = false
            this.$Toast('添加成功')
            this.btnTxt = '继续添加'
          } else {
            this.$Toast(res.info)
          }
        })
      }
    }
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .industry-index {
    position relative;
    
    .industry-content {
      padding 10px;
      
      .approve {
        img {
          width: 50px;
          position absolute;
          top 10%;
          right 0;
        }
      }
      
      .step-modular {
        width: 100%;
        height: 100px;
        background: #FFFFFF;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        margin-bottom 10px;
        
        .step-arr {
          display flex;
          justify-content space-around;
          align-items center
          height 100%;
          
          
          .step-item {
            display: flex;
            flex-direction column;
            align-items center;
            justify-content space-around;
            height 60px;
            position relative;
            
            img {
              width 25px;
              height 25px;
            }
            
            span {
              font-size 14px;
              color #333;
            }
            
            &::after {
              content '';
              display inline-block;
              position absolute;
              width 50px;
              height 2px;
              background #d1d1d1;
              right -60px;
            }
            
            &:last-child:after {
              display none;
            }
          }
        }
      }
      
      
    }
    
    
    .sub-success {
      .success-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top 110px;
        
        img {
          width 60px;
        }
        
        p {
          color #ccc;
        }
        
        .success-title {
          font-size: 16px;
          line-height: 40px;
          color #000
        }
      }
    }
    
    .sub-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background: #F02C2D;
      color: #fff;
      font-size: 14px;
    }
  }

</style>