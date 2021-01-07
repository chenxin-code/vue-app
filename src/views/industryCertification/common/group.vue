
<template>
  <div class="group" :class="{'industryStateCalc':(groupObj.userClusterModel.industryState == 1 || groupObj.userClusterModel.industryState == 2 || groupObj.userClusterModel.industryState == 6 )}">
    <van-cell-group style="margin-bottom: 6px;">
      <van-field v-model="groupObj.userClusterModel.clusterName" label="行业群组:" input-align="right" :readonly="true" border/>
      <!-- <van-field v-model="getIndustryDetail.groupStatus" label="认证状态:" input-align="right" :readonly="true" border /> -->
      <van-field v-model="groupObj.groupText" label="群组状态:" input-align="right" :readonly="true" border />
      <van-field v-if="groupObj.userClusterModel.industryState == 6" label="审核未通过原因:" label-width='180' input-align="right" :readonly="true" border />
      <van-field v-if="groupObj.userClusterModel.industryState == 6" v-model="text" type="textarea" :readonly="true"/>
    </van-cell-group>
    <van-cell-group v-if="groupObj.isCertificate" style="margin-bottom: 6px;">
      <van-field label="实名认证" input-align="right" :readonly="true" border/>
      <van-field v-model="groupObj.usercertificate.name" label="姓名:" input-align="right" :readonly="true" border />
      <van-field v-model="groupObj.usercertificate.idcardNum" label="身份证号:" input-align="right" :readonly="true" border />
      <div class="certificates">
        <div class="certificatesItem">
          <div class="imgBox">
            <img class="backgroundImg" :src="groupObj.usercertificate.imgFront || 'static/image/vocational-certification/rx@2x.png'" alt="">
          </div>
          <div class="text">
            <div class='textBox'>
              <span>身份证正面</span>
            </div>
          </div>
        </div>
        <div class="certificatesItem">
          <div class="imgBox">
            <img class="backgroundImg" :src="groupObj.usercertificate.imgBehind || 'static/image/vocational-certification/gh@2x.png'" alt="">
          </div>
          <div class="text">
            <div class='textBox'>
              <span>身份证背面</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>
    <van-cell-group v-if="groupObj.isDrinving" style="margin-bottom: 6px;">
      <van-field label="驾驶证认证" input-align="right" :readonly="true" border/>
      <van-field v-model="groupObj.driverInfoModel.name" label="姓名:" input-align="right" :readonly="true" border />
      <van-field v-model="groupObj.driverInfoModel.driveCode" label="证件号:" input-align="right" :readonly="true" border />
      <van-field v-model="groupObj.driverInfoModel.driveDocNo" label="档案编号:" input-align="right" :readonly="true" border />
      <van-field v-model="groupObj.driverInfoModel.licenceCore" label="驾驶证背面编号:" input-align="right" :readonly="true" border label-width="120px"/>
        <div class="certificates">
        <div class="certificatesItem">
          <div class="imgBox">
            <img class="backgroundImg" :src="groupObj.driverInfoModel.imageUrl || 'static/image/vocational-certification/rx@2x.png'" alt="">
          </div>
          <div class="text">
            <div class='textBox'>
              <span>驾驶证首页</span>
            </div>
          </div>
        </div>
        <div class="certificatesItem">
          <div class="imgBox">
            <img class="backgroundImg" :src="groupObj.driverInfoModel.imageUrl2 || 'static/image/vocational-certification/gh@2x.png'" alt="">
          </div>
          <div class="text">
            <div class='textBox'>
              <span>驾驶证副页</span>
            </div>
          </div>
        </div>
      </div>
      <div class="certificates">
        <div class="certificatesItem">
          <div class="imgBox">
            <img class="backgroundImg" :src="groupObj.driverInfoModel.backImageUrl || 'static/image/vocational-certification/rx@2x.png'" alt="">
          </div>
          <div class="text">
            <div class='textBox'>
              <span>驾驶证背面图片</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>
    <van-cell-group v-if="groupObj.isVehicle" style="margin-bottom: 6px;">
      <van-field label="行驶证认证" input-align="right" :readonly="true" border/>
      <van-field v-model="groupObj.vehicleModel.ownerName" label="所有人姓名" placeholder="请输入所有人姓名" :readonly="true" input-align="right" />
      <van-field v-model="groupObj.vehicleModel.vin" maxlength='17' label="车辆识别号" placeholder="请输入车辆识别号" :readonly="true" input-align="right" />
      <van-field v-model="groupObj.vehicleModel.engineNum" label="发动机号" placeholder="请输入发动机号" :readonly="true" input-align="right" />
      <van-field v-model="groupObj.vehicleModel.vehType" label="车辆类型" placeholder="请输入车辆类型" :readonly="true" input-align="right" />
        <div class="certificates">
        <div class="certificatesItem">
          <div class="imgBox">
            <img class="backgroundImg" :src="groupObj.vehicleModel.imageUrl || 'static/image/vocational-certification/rx@2x.png'" alt="">
          </div>
          <div class="text">
            <div class='textBox'>
              <span>行驶证首页</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>
    <van-cell-group v-if="paperArr.length">
      <van-field label="资格认证" input-align="right" :readonly="true" border/>
      <van-field v-model="groupObj.userClusterModel.industryClusterMember.ouName" label="地市" :readonly="true" input-align="right" />
      <van-field v-model="groupObj.userClusterModel.industryClusterMember.referrer" label="推荐人" :readonly="true" input-align="right" />
        <div class="certificates" v-for="(item,index) in paperArr" :key="index">
        <div class="certificatesItem">
          <div class="imgBox">
            <img class="backgroundImg" :src="item.url || 'static/image/vocational-certification/rx@2x.png'" alt="">
          </div>
          <div class="text">
            <div class='textBox'>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>
    <div class="bottom-btns">
      <span class="btns-item" v-if='groupObj.userClusterModel.industryState == 1' @click="confirmGroup(2)">退出认证</span>
      <span class="btns-item" v-if='groupObj.userClusterModel.industryState == 2' @click="confirmGroup(1)">启用认证</span>
      <span class="btns-item" v-if='groupObj.userClusterModel.industryState == 6' @click="openingBtn">重新审核</span>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
export default {
  name: "group",
  mixins: [mixin],
  props:['getIndustryDetail'],
  data() {
    return {
      text: '',
      popupCard: false,
      paperArr: [],
      groupObj: {
        userClusterModel: ''
      },
      obj: {
        industryClusterMember: {
          clusterState: ''
        }
      },
      countDown: true, // true 开启 false 关闭
      recordTime: '',
      currentTime: '',
      usercertificate: {},
      driverInfoModel: {},
      vehicleModel: {}
    };
  },
  mounted() {
    this.groupObj = JSON.parse(JSON.stringify(this.getIndustryDetail))
    this.groupObj.groupText = this.cardListType(this.groupObj.userClusterModel.industryState)
    let industryClusterMember = this.groupObj.userClusterModel.industryClusterMember || {}
    if (industryClusterMember.paperImgUrl) {
      let paperImgUrlArr = industryClusterMember.paperImgUrl.split(',')
      let papersNameArr = industryClusterMember.papersName.split(',')
      paperImgUrlArr.forEach((element,index) => {
        this.paperArr.push({name: papersNameArr[index],url: element})
      });
    }
    console.log(this.groupObj)
    this.$request.post(this.findIdentifyClusterInfoUrl,{clusterId: this.groupObj.userClusterModel.id}).then(res => {
      if (res.status == 0) {
       this.text = res.data.examineMsg || ''
      } else {
        this.$Toast(res.info)
      }
    })
  },
  methods: {
    getSidesStyle: function () {
      let styleStr = '';
      let industryState = this.groupObj.userClusterModel.industryState
      if (sidesMargin == 1 || industryState == 2) {
        styleStr = 'height: ' + sidesMargin + '%';
      } else {
        styleStr = 'height: 100%';
      }
      return styleStr;
    },
    confirmGroup(status){
      this.$request.post(this.findIdentifyClusterInfoUrl,{clusterId: this.groupObj.userClusterModel.id}).then(res => {
        if (res.status == 0) {
          this.openOrCloseIndustry(res.data.id,status)
        } else {
          this.$Toast(res.info)
        }
      })
    },
    openOrCloseIndustry(id,status){
      // clusterState：2关闭，1:开启
      let obj = {id: id,clusterState: status}
      this.$request.post(this.openOrCloseIndustryUrl,obj).then(res => {
        if (res.status == 0) {
          this.$Toast(`认证操作成功`)
          this.$router.go(-1)
        } else {
          this.$Toast(res.info)
        }
      })
    },
    backEvent() {
      this.$router.go(-1);
    },
    getCheckIdentifyAllDetail() {
      this.$request.post(this.checkIdentifyAllDetail, {}).then(res => {
        if (res.status == 0) {
          let data = res.data
          console.log(data)
          this.usercertificate = data.usercertificate
          this.driverInfoModel = data.driverInfoModel
          this.vehicleModel = data.vehicleModel
          // resolve(data)
        } else {
          this.$Toast(res.info)
        }
      })
    },
    openingBtn() {
      this.$request.post('/app/json/user/industryRecertification', {}).then(res => {
        if (res.status == 0) {
          this.$router.replace({
            path: "/industryCertification/replacePage",
            query: {
              id: this.groupObj.userClusterModel.id
            }
          });
        } else {
          this.$Toast(res.info)
        }
      })
    },
    timeOut() {
      this.countDown = true
    }
  },
  components: {
    Countdown: () => import("@/components/Vendor/countdown/countdown")
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.group {
  position: relative;
  width: 100%;
  height 100%
  background-color #f6f6f6
  overflow-y: auto;
  .bottom-btns {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    .btns-item {
      height: 50px;
      width: 100%;
      color: #fff;
      font-size: 16px;
      display: inline-block;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f02e2c;
    }
  }
  .certificates{
    width 100%
    height 140px
    display flex
    justify-content center
    align-items center
    .certificatesItem{
      width 50%
      height 140px
      padding 5px
      display flex
      flex-direction column
      justify-content center
      align-items center
      .imgBox{
        position relative
        width 100%
        height 100px
        .backgroundImg{
          width 100%
          height 100%
        }
        .tipsImg{
          width 50px
          height 50px
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          margin auto
        }
      }
      .text{
        width 100%
        height 26px
        color #636363
        display flex
        flex-direction column-reverse
        align-items center
        .textBox{
          display flex
          justify-content center
          align-items center
          .question-o{
            font-size 14px
          }
        }
      }
    }
  }
}
.industryStateCalc{
  height calc(100% - 50px)
}
</style>
