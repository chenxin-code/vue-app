
<template>
  <div class="group">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <van-cell-group style="margin-bottom: 6px;">
        <van-field v-model="groupObj.clusterName" label="行业群组:" input-align="right" :readonly="true" border/>
        <van-field v-model="groupObj.groupStatus" label="认证状态:" input-align="right" :readonly="true" border />
        <van-field v-model="groupObj.stateText" label="群组状态:" input-align="right" :readonly="true" border />
      </van-cell-group>
      <van-cell-group v-if="usercertificate" style="margin-bottom: 6px;">
        <van-field label="实名认证" input-align="right" :readonly="true" border/>
        <van-field v-model="usercertificate.name" label="姓名:" input-align="right" :readonly="true" border />
        <van-field v-model="usercertificate.idcardNum" label="身份证号:" input-align="right" :readonly="true" border />
        <div class="certificates">
          <div class="certificatesItem">
            <div class="imgBox">
              <img class="backgroundImg" :src="usercertificate.imgFront || 'static/image/vocational-certification/rx@2x.png'" alt="">
            </div>
            <div class="text">
              <div class='textBox'>
                <span>身份证正面</span>
              </div>
            </div>
          </div>
          <div class="certificatesItem">
            <div class="imgBox">
              <img class="backgroundImg" :src="usercertificate.imgBehind || 'static/image/vocational-certification/gh@2x.png'" alt="">
            </div>
            <div class="text">
              <div class='textBox'>
                <span>身份证背面</span>
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group v-if="driverInfoModel" style="margin-bottom: 6px;">
        <van-field label="驾驶证认证" input-align="right" :readonly="true" border/>
        <van-field v-model="driverInfoModel.name" label="姓名:" input-align="right" :readonly="true" border />
        <van-field v-model="driverInfoModel.driveCode" label="证件号:" input-align="right" :readonly="true" border />
        <van-field v-model="driverInfoModel.driveDocNo" label="档案编号:" input-align="right" :readonly="true" border />
        <van-field v-model="driverInfoModel.licenceCore" label="驾驶证背面编号:" input-align="right" :readonly="true" border label-width="120px"/>
         <div class="certificates">
          <div class="certificatesItem">
            <div class="imgBox">
              <img class="backgroundImg" :src="driverInfoModel.imageUrl || 'static/image/vocational-certification/rx@2x.png'" alt="">
            </div>
            <div class="text">
              <div class='textBox'>
                <span>驾驶证首页</span>
              </div>
            </div>
          </div>
          <div class="certificatesItem">
            <div class="imgBox">
              <img class="backgroundImg" :src="driverInfoModel.imageUrl2 || 'static/image/vocational-certification/gh@2x.png'" alt="">
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
              <img class="backgroundImg" :src="driverInfoModel.backImageUrl || 'static/image/vocational-certification/rx@2x.png'" alt="">
            </div>
            <div class="text">
              <div class='textBox'>
                <span>驾驶证背面图片</span>
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group v-if="vehicleModel">
        <van-field label="行驶证认证" input-align="right" :readonly="true" border/>
        <van-field v-model="vehicleModel.ownerName" label="所有人姓名" placeholder="请输入所有人姓名" :readonly="true" input-align="right" />
        <van-field v-model="vehicleModel.vin" maxlength='17' label="车辆识别号" placeholder="请输入车辆识别号" :readonly="true" input-align="right" />
        <van-field v-model="vehicleModel.engineNum" label="发动机号" placeholder="请输入发动机号" :readonly="true" input-align="right" />
        <van-field v-model="vehicleModel.vehType" label="车辆类型" placeholder="请输入车辆类型" :readonly="true" input-align="right" />
         <div class="certificates">
          <div class="certificatesItem">
            <div class="imgBox">
              <img class="backgroundImg" :src="vehicleModel.imageUrl || 'static/image/vocational-certification/rx@2x.png'" alt="">
            </div>
            <div class="text">
              <div class='textBox'>
                <span>行驶证首页</span>
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>
      <!-- <div class="countdown-btns">
      <span class="btns-item" v-if='obj.industryClusterMember.clusterState == 2 && !countDown'>
        <Countdown :endTime="recordTime/1000" @timeOut="timeOut"/> 后可开启群组
      </span>
    </div> -->
    </nav-content>
    <div class="bottom-btns">
      <span class="btns-item" v-if='obj.industryClusterMember.clusterState == 1' @click="confirmGroup(2)">退出认证</span>
      <span class="btns-item" v-if='obj.industryClusterMember.clusterState == 2' @click="confirmGroup(1)">启用认证</span>
      <!-- <span class="btns-item" v-if='obj.industryClusterMember.clusterState == 2 && countDown' @click="confirmGroup">启用群组</span> -->
    </div>
    <!-- <van-popup v-model="popupCard" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <p>确认退出认证吗？</p>
        <span>关闭后，24小时后才可再次开启</span>
      </div>
      <div class="popupCardBtn">
        <span @click="popupCard=false">取消</span>
        <span @click="confirmGroup">确认</span>
      </div>
    </van-popup> -->
  </div>
</template>
<script>
import mixin from "../mixin";
export default {
  name: "group",
  mixins: [mixin],
  data() {
    return {
      popupCard: false,
      groupObj: {
        clusterName: '',
        groupStatus: '',
        stateText: ''
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
    this.obj = this.$route.query
    this.groupObj.clusterName = this.obj.clusterName
    this.recordTime = this.obj.industryClusterMember.createTime + 60*60*24*1000
    this.currentTime = this.$util.getDataString()
    console.log(this.obj)
    this.groupObj.stateText = this.obj.state == 1 ? '已认证' : '已关闭'

    if (this.obj.industryClusterMember) {
      if (this.obj.industryClusterMember.examineState == 0) {
        this.groupObj.groupStatus = '待审核'
      } else if (this.obj.industryClusterMember.examineState ==1) {
        this.groupObj.groupStatus = '已审核'
      } else if (this.obj.industryClusterMember.examineState ==2) {
        this.groupObj.groupStatus = '已拒绝'
      }
    } else {
      this.groupObj.groupStatus = '未申请'
    }
    // if (this.obj.industryClusterMember) {
    //   this.groupObj.groupStatus = this.cardListType(this.obj.industryClusterMember.clusterState)
    // } else {
    //   this.groupObj.groupStatus = '未申请'
    // }
    // this.countDown = this.recordTime < this.currentTime
    // this.groupObj.groupStatus = this.cardListType(this.obj.industryClusterMember.clusterState)
    this.getCheckIdentifyAllDetail()
  },
  methods: {
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
    backEvent() {
      this.$keepaliveHelper.deleteCache(this);
      this.$router.go(-1);
    },
    confirmGroup(status){
      this.$request.post(this.findIdentifyClusterInfoUrl,{clusterId: this.obj.id}).then(res => {
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
  overflow: hidden;
  /deep/ .nav-content {
    height calc(100% - 120px)
    overflow-y: auto;
    padding-top 10px
    background-color #f6f6f6
  }
  .countdown-btns{
    padding 10px
    margin-top 20px
    height: 40px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    /deep/ .red-div{
      font-size 14px
      font-weight 500
    }
    span {
      height: 40px;
      border-radius 10px
    }
  }
  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      height: 50px;
    }
  }
  .btns-item {
    width: 100%;
    color: #fff;
    font-size: 16px;
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f02e2c;
  }
  /deep/ .van-popup {
    width: 76%;
    font-size: 14px;
    color: #8c8c8c;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popupCard {
    height: 170px;
    flex-direction: column;
    line-height: 26px;

    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p{
        color #000
        font-size 18px
      }
      span{
        color: #444141;
      }
    }
    .popupCardBtn {
      width: 100%;
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;
      font-size 16px

      span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      >:last-child {
        color #fff;
        background-color #f02e2c
      }
    }
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
</style>
