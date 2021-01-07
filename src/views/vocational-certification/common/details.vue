
<template>
  <div class="group">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <van-cell-group style="margin-bottom: 6px;">
        <van-field v-model="obj.clusterName" label="行业群组:" input-align="right" :readonly="true" border/>
        <van-field v-model="obj.groupStatus" label="审批状态:" input-align="right" :readonly="true" border />
        <van-field v-model="obj.status" label="群组状态:" input-align="right" :readonly="true" border />
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
    </nav-content>
    <!-- <div class="bottom-btns">
      <span class="btns-item" @click="backEvent">返回列表</span>
    </div> -->
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
        // stateText: ''
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
    this.obj.status = '已关闭'
  
    if (this.obj.industryClusterMember) {
      if (this.obj.industryClusterMember.examineState == 0) {
        this.obj.groupStatus = '待审核'
      } else if (this.obj.industryClusterMember.examineState ==1) {
        this.obj.groupStatus = '已审核'
      } else if (this.obj.industryClusterMember.examineState ==2) {
        this.obj.groupStatus = '已拒绝'
      }
    } else {
      this.obj.groupStatus = '未申请'
    }
    this.getCheckIdentifyAllDetail()
  },
  methods: {
    getCheckIdentifyAllDetail() {
      this.$request.post(this.checkIdentifyAllDetail, {}).then(res => {
        if (res.status == 0) {
          let data = res.data
          this.usercertificate = data.usercertificate
          this.driverInfoModel = data.driverInfoModel
          this.vehicleModel = data.vehicleModel
        } else {
          this.$Toast(res.info)
        }
      })
    },
    backEvent() {
      this.$router.go(-1);
    }
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
