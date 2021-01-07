<template>
  <div class="stepsContent">
    <!-- 身份证 -->
    <div v-if="activeContent.activeObj.type == 'IDcard'">
      <div class="certificatesBox">
        <div class="certificates">
          <div class="certificatesItem">
            <div class="imgBox" @click="takePictures(3,'imgFront')">
              <img class="backgroundImg" :src="identityObj.imgFront || 'static/image/vocational-certification/rx@2x.png'" alt="">
              <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
            </div>
            <div class="text">
              <div class='textBox' @click="seePictures({credName:'身份证正面', credImg:'picture2@2x'})">
                <span>身份证正面</span>&nbsp;
                <van-icon class="question-o" name="question-o" />
              </div>
            </div>
          </div>
          <div class="certificatesItem">
            <div class="imgBox" @click="takePictures(3,'imgBehind')">
              <img class="backgroundImg" :src="identityObj.imgBehind || 'static/image/vocational-certification/gh@2x.png'" alt="">
              <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
            </div>
            <div class="text">
              <div class='textBox' @click="seePictures({credName:'身份证背面', credImg:'ID@2x'})">
                <span>身份证背面</span>&nbsp;
                <van-icon class="question-o" name="question-o" />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="certificates" v-if="$store.state.globalConfig.certificate_check_selfie == '1'">
          <div class="certificatesItem">
            <div class="imgBox" @click="takePictures('','selfImageUrl')">
              <img class="backgroundImg" :src="identityObj.selfImageUrl || 'static/image/vocational-certification/zp@2x.png'" alt="">
              <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
            </div>
            <div class="text">
              <div class='textBox' @click="seePictures({credName:'手持身份证照片', credImg:'picture4@2x',type: true})">
                <span>手持身份证照片</span>&nbsp;
                <van-icon class="question-o" name="question-o" />
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <van-cell-group>
        <van-field v-model="identityObj.name" :disabled='status.identityObj' label="姓名" placeholder="请输入姓名" required input-align="right" />
        <van-field v-model="identityObj.idcardNum" :disabled='status.identityObj' label="证件号" placeholder="请输入18位身份证号" required input-align="right" />
      </van-cell-group>
    </div>
    <!-- 驾驶证 -->
    <div v-if="activeContent.activeObj.type == 'DriverCard'">
      <div class="certificatesBox">
        <div class="certificates">
          <div class="certificatesItem">
            <div class="imgBox" @click="takePictures(3,'imageUrl')">
              <img class="backgroundImg" :src="drive.imageUrl || 'static/image/vocational-certification/rx@2x.png'" alt="">
              <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
            </div>
            <div class="text">
              <div class='textBox' @click="seePictures({credName:'驾驶证首页', credImg:'驾驶证正'})">
                <span>驾驶证首页</span>&nbsp;
                <van-icon class="question-o" name="question-o" />
              </div>
            </div>
          </div>
          <div class="certificatesItem">
            <div class="imgBox" @click="takePictures(3,'imageUrl2')">
              <img class="backgroundImg" :src="drive.imageUrl2 || 'static/image/vocational-certification/gh@2x.png'" alt="">
              <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
            </div>
            <div class="text">
              <div class='textBox' @click="seePictures({credName:'驾驶证副页', credImg:'驾驶证反'})">
                <span>驾驶证副页</span>&nbsp;
                <van-icon class="question-o" name="question-o" />
              </div>
            </div>
          </div>
        </div>
        <div class="certificates">
          <div class="certificatesItem">
            <div class="imgBox" @click="takePictures('3','backImageUrl','isCheck')">
              <img class="backgroundImg" :src="drive.backImageUrl || 'static/image/vocational-certification/gh@2x.png'" alt="">
              <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
            </div>
            <div class="text">
              <div class='textBox' @click="seePictures({credName:'驾驶证背面图片', credImg:'驾驶证背面'})">
                <span>驾驶证背面图片</span>&nbsp;
                <van-icon class="question-o" name="question-o" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-cell-group>
        <van-field v-model="drive.name" :disabled='status.drive' label="姓名" label-width='100' placeholder="请输入姓名" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'姓名', credImg:'name@2x'})" input-align="right" />
        <van-field v-model="drive.driveCode" :disabled='status.drive' label="证号" label-width='100' placeholder="请输入证号" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'证号', credImg:'number@2x'})" input-align="right" />
        <van-field v-model="drive.driveDocNo" :disabled='status.drive' maxlength='12' label="档案编号" label-width='100' placeholder="请输入档案编号" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'档案编号', credImg:'archives@2x'})" input-align="right" />
        <van-field v-model="drive.licenceCore" :disabled='status.drive' label="驾驶证背面编号" label-width='140' placeholder="请输入驾驶证背面编号" clearable right-icon="question-o" @click-right-icon="seePictures({credName:'驾驶证背面编号', credImg:'chip@2x'})" input-align="right" />
      </van-cell-group>
    </div>
    <!-- 行驶证 -->
    <div v-if="activeContent.activeObj.type == 'DrivingCard'">
      <div class="certificatesBox">
        <div class="certificates">
          <div class="certificatesItem">
            <div class="imgBox" @click="takePictures(3,'imageUrl3')">
              <img class="backgroundImg" :src="travel.imageUrl2 || 'static/image/vocational-certification/rx@2x.png'" alt="">
              <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
            </div>
            <div class="text">
              <div class='textBox' @click="seePictures({credName:'行驶证首页', credImg:'行驶证'})">
                <span>行驶证首页</span>&nbsp;
                <van-icon class="question-o" name="question-o" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-cell-group>
        <!-- button1@2x.png -->
        <div class="plateNum">
          <div class="plateNumImg">
            <img v-if="isNewEnergy" class='img' src="static/image/vocational-certification/button2@2x.png" alt="" @click.stop='isNewEnergy = false'>
            <img v-else class='img' src="static/image/vocational-certification/button1@2x.png" alt="" @click.stop='isNewEnergy = true'>
          </div>
          <van-field v-model="travel.plateNum" :disabled='status.travel' maxlength='8' @focus="focus" label="车牌号" :placeholder="isNewEnergy?'请输入车牌号':'新能源车牌号'" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'车牌号', credImg:'platenumber@2x'})" input-align="right" />
        </div>
        <van-field v-model="travel.ownerName" :disabled='status.travel' label="所有人姓名" placeholder="请输入所有人姓名" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'所有人姓名', credImg:'name2@2x'})" input-align="right" />
        <van-field v-model="travel.vin" :disabled='status.travel' maxlength='17' label="车辆识别号" placeholder="请输入车辆识别号" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'车辆识别号', credImg:'VIN@2x'})" input-align="right" />
        <van-field v-model="travel.engineNum" :disabled='status.travel' label="发动机号" placeholder="请输入发动机号" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'发动机号', credImg:'Enginenumber@2x'})" input-align="right" />
        <van-field v-model="travel.vehType" :disabled='status.travel' label="车辆类型" placeholder="请输入车辆类型" clearable required right-icon="question-o" @click-right-icon="seePictures({credName:'车辆类型', credImg:'type@2x'})"  input-align="right" />
      </van-cell-group>
    </div>
    <!-- 资格认证 -->
    <div v-if="activeContent.activeObj.type == 'qualifications'">
      <div v-for="(item,index) in idNameList" :key="index">
        <van-cell-group>
          <div @click='clickField'>
             <van-field v-model="qualifications.ouNameNew" label="选择地市:" input-align="right" placeholder="请选择地市" :readonly='true'/>
            <!-- <van-field v-model="qualifications.areaName" label="选择地市:" input-align="right" placeholder="请选择地市" /> -->
          </div>
          <van-field v-model="qualifications.referrer" label="推荐人(选填):" input-align="right" placeholder="请填写推荐人手机号"  right-icon="scan" @click-right-icon='clickRightIcon'>
          </van-field>
          <van-field v-model="item.credName" label="证件名称:" input-align="right" :readonly='true'/>
        </van-cell-group>
        <div class="certificatesBox">
          <div class="certificates">
            <div class="certificatesItem">
              <div class="imgBox" @click="takePictures('','',index)">
                <img class="backgroundImg" :src="item.newCredImg || 'static/image/vocational-certification/rx@2x.png'" alt="">
                <img class="tipsImg" src="static/image/vocational-certification/icon1@2x.png" alt="">
              </div>
              <div class="text">
                <div class='textBox' @click="seePictures(item,true)">
                  <span>查看示意图</span>&nbsp;
                  <van-icon class="question-o" name="question-o" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 审核 -->
    <div v-if="activeContent.activeObj.type == 'examine'">
      <div v-for="(item,index) in idNameList" :key="index">
        <van-cell-group>
          <van-field v-model="activeContent.ouNameNew" label="选择地市:" input-align="right" placeholder="请选择地市" :readonly='true'/>
          <!-- <van-field v-model="activeContent.areaName" label="选择地市:" input-align="right" placeholder="请选择地市" :readonly='true'/> -->
          <van-field v-model="activeContent.referrer" label="推荐人:" input-align="right" placeholder="请填写推荐人手机号" :readonly='true'/>
          <van-field v-model="item.credName" label="证件名称:" input-align="right" :readonly='true'/>
        </van-cell-group>
        <div class="certificatesBox">
          <div class="certificates">
            <div class="certificatesItem">
              <div class="imgBox">
                <img class="backgroundImg" :src="item.credImg" alt="">
              </div>
              <div class="text">
                <p>查看示意图</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup">
        <van-popup v-model="isExamine" class="popupCard" :close-on-click-overlay="false">
          <div class="popupCardText">
            <p>提交成功！</p>
            <span>正在进行系统审核...</span>
          </div>
        </van-popup>
      </div>
    </div>
    <!-- 上传图片 -->
    <photograph ref="photograph" :uploadData='uploadData' @picturesData='picturesData' @onCancel='onCancel' />
    <virtual-keyboard :show="show" @input="inputKey" @delete="deleteKey" @blur="show = false"></virtual-keyboard>
    <van-popup class="tips" :class="img.type ? 'tipsA' : 'tipsB'" v-model="tips" position="bottom" :close-on-click-overlay="false">
      <div class="tipsIcon">
        <van-icon class="icon" name="cross" @click="tips = false"/>
      </div>
      <div class="tipsContent">
        <div class='topTipsContent' v-if='img.type'>
          <div class='topImg'>
            <img src="static/image/vocational-certification/standard@2x.png" alt="" />
            <p>标准</p>
          </div>
          <div class='topImg'>
            <img src="static/image/vocational-certification/angle@2x.png" alt="" />
            <p>倾斜</p>
          </div>
          <div class='topImg'>
            <img src="static/image/vocational-certification/vague@2x.png" alt="" />
            <p>模糊</p>
          </div>
        </div>
        <div class="topText" v-if="img.type">
          <p>身份证拍照正确样式</p>
        </div>
        <img :src="img.credImg" alt="" :style="{width: `${img.type ? '140px' : ''}`}"/>
        <span>{{img.credName}}</span>
      </div>
    </van-popup>
    <org-tree ref="address" @setAddressEvent="setAddressEvent"></org-tree>
    <!-- <RegionSelect v-if="showSelect" ref="regionselect" :initData="initData" @selectedItemsEvent="selectedItemsEvent" @closeEvent="regionCloseEvent"></RegionSelect> -->
    <!-- 确认提交信息 -->
    <div class="popup">
      <van-popup v-model="popupIDcard" :close-on-click-overlay="false" class="examine">
        <div class="popupContent">
          <van-cell-group>
            <van-field label="信息确认" input-align="right" :readonly='true'/>
            <van-field v-model="identityObj.name" label="姓名:" input-align="right" :readonly='true'/>
            <van-field v-model="identityObj.idcardNum" label="证件号:" input-align="right" :readonly='true'/>
          </van-cell-group>
          <span class="contentText">请再次确认提交的信息内容，一经提交审批，将不予进行修改</span>
        </div>
        <div class="popupCardBtn">
          <span @click="popupIDcard=false">修改</span>
          <span @click="popupIDcardBtn">确定</span>
        </div>
      </van-popup>
      <van-popup v-model="popupDriverCard" :close-on-click-overlay="false" class="examine">
        <div class="popupContent">
          <van-cell-group>
            <van-field label="信息确认" input-align="right" :readonly='true'/>
            <van-field v-model="drive.name" label="姓名:" input-align="right" :readonly='true'/>
            <van-field v-model="drive.driveCode" label="证件号:" input-align="right" :readonly='true'/>
            <van-field v-model="drive.driveDocNo" label="档案编号:" input-align="right" :readonly='true'/>
            <van-field v-model="drive.licenceCore" label="芯片编码:" input-align="right" :readonly='true'/>
          </van-cell-group>
          <span class="contentText">请再次确认提交的信息内容，一经提交审批，将不予进行修改</span>
        </div>
        <div class="popupCardBtn">
          <span @click="popupDriverCard=false">修改</span>
          <span @click="popupDriverCardBtn">确定</span>
        </div>
      </van-popup>
      <van-popup v-model="popupDrivingCard" :close-on-click-overlay="false" class="examine">
        <div class="popupContent">
          <van-cell-group>
            <van-field label="信息确认" input-align="right" :readonly='true'/>
            <van-field v-model="travel.ownerName" label="所有人姓名:" input-align="right" :readonly='true'/>
            <van-field v-model="travel.vin" label="车辆识别号:" input-align="right" :readonly='true'/>
            <van-field v-model="travel.engineNum" label="发动机号:" input-align="right" :readonly='true'/>
            <van-field v-model="travel.vehType" label="车辆类型:" input-align="right" :readonly='true'/>
          </van-cell-group>
          <span class="contentText">请再次确认提交的信息内容，一经提交审批，将不予进行修改</span>
        </div>
        <div class="popupCardBtn">
          <span @click="popupDrivingCard=false">修改</span>
          <span @click="popupDrivingCardBtn">确定</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
import eventBus from '@/utils/eventBus.js'
import Photo from '@/components/commonui/choosephoto'

export default {
  name: "stepsContent",
  mixins: [mixin],
  props: {
    activeContent: {
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      initData: {
        title: '请选择地区'
      },
      showSelect: false,
      isNewEnergy: true,
      tips: false,
      img:{
        credImg: '',
        credName: '',
        type: null
      },
      show: false,
      isExamine: false,
      parameterUrl: '',
      takeIndex: 0,
      uploadData: {
        isShowUpload: false,
      },
      identityObj: {
        imgFront: '',      // 证件正面照片
        imgBehind: '',     // 证件背面照片
        // selfImageUrl: '',  // 用户上传的自拍照片
        name: '',          // 姓名
        idcardNum: '',     // 身份证号
        sex: ''            // 性别
      },
      drive: {
        imageUrl: '',      // 驾驶证首页
        imageUrl2: '',     // 驾驶证副页
        backImageUrl: '',  // 驾驶证背面
        name: '',          // 姓名
        driveCode: '',     // 驾照编码
        driveDocNo: '',    // 档案编号
        licenceCore: '',   // 驾驶证证芯编号
      },
      travel: {
        imageUrl2: '',     // 行驶证首页
        plateNum: '',      // 车牌号
        ownerName: '',     // 所有人姓名
        vin: '',           // 车辆识别代号
        engineNum: '',     // 发动机号
        vehType: '',       // 车辆类型
      },
      qualificationsObj: {},
      qualifications: {
        papersName: '',    // 证书名称
        paperImgUrl: '',   // 证书图片地址
        clusterId: '',     // 群组id
        clusterCode: '',   // 群组编码
        clusterName: '',    // 群组名称
        areaName: '',
        areaId: '',
        ouCode: '',
        ouName: '',
        ouNameNew: '',
        referrer: ''
      },
      status: {
        identityObj: false,
        drive: false,
        travel: false
      },
      popupIDcard: false,
      popupDriverCard: false,
      popupDrivingCard: false,
      activeTypeNew: '',
      isActiveObjNew: {},
      activeNew: {}
    };
  },
  mounted() {
    this.qualificationsObj = JSON.parse((this.$route.query || {}).expression)
    this.idNameList = this.activeContent.expression.idNameList
      this.idNameList.forEach(res=>{
        this.$set(res,'newCredImg','')
      })
    this.$request.post(this.checkIdentifyAllDetail, {}).then(res => {
      if (res.status == 0) {
        let data = res.data
        if (data.usercertificate) { // 身份
          Object.assign(this.identityObj, this.mergeObj(data.usercertificate, this.identityObj))
          this.status.identityObj = true
        }
        if (data.driverInfoModel) { // 驾驶证
          Object.assign(this.drive, this.mergeObj(data.driverInfoModel, this.drive))
          this.status.drive = true
        }
         if (data.vehicleModel) { // 行驶证
          Object.assign(this.travel, this.mergeObj(data.vehicleModel, this.travel))
          this.status.travel = true
        }
        eventBus.$emit('isActive', this.status)
        // "isCertificate":1:已认证，其他未认证,（身份）
        // "isDrinving":1:已认证，其他未认证,（驾驶证）
        // "isVehicle":1:已认证，其他未认证（行驶证或车辆
      } else {
        this.$Toast(res.info)
      }
    });
    let defaultProvince = this.$store.state.mall2.selectAddress.provinceName
    if (defaultProvince) {
      this.initData.initAreas = [defaultProvince]
      this.initData.canNotReselect = false
    }
  },
  methods: {
    clickRightIcon() {
      this.$bridgefunc.scanCode((dic) => {
        this.qualifications.referrer = dic.code
      })
    },
    focus() {
      this.show = true
      document.activeElement.blur()
    },
    inputKey(val) {
      this.travel.plateNum = this.travel.plateNum + val
    },
    deleteKey() {
       this.travel.plateNum =  this.travel.plateNum.substr(0,  this.travel.plateNum.length - 1)
    },
    seePictures(item,state){
      this.img = {
        credImg: '',
        credName: '',
        type: null
      },
      this.tips = true
      let obj = JSON.parse(JSON.stringify(item))
      if(!state) obj.credImg = `static/image/vocational-certification/${obj.credImg}.png`
      Object.assign(this.img, obj)
    },
    takePictures(type, url, index) {
      console.log(type, url, index)
      this.takeIndex = index
      this.parameterUrl = url
      // this.uploadData.type = type
      // this.uploadData.isShowUpload = true
      Photo.open({
        linkFunc: (picUrl, base64Data) => {
          if (base64Data.indexOf(',')) {
            base64Data = base64Data.split(',')[1]
          }
          this.picturesData(picUrl, base64Data)
        },
        type: type,
        token: this.$store.state.login.token,
      });
    },
    picturesData(data,base64StrImg){
      if(this.activeContent.activeObj.type == 'qualifications'){
        this.$set(this.idNameList[this.takeIndex], 'newCredImg', data)
        return
      }
      if (this.parameterUrl == 'backImageUrl') {
        this.drive[this.parameterUrl] = data;
        return
      }
      let type = 0
      if (this.parameterUrl == 'imgFront') {
        type = 0
      } else if (this.parameterUrl == 'imgBehind') {
        type = 1
      } else if (this.parameterUrl == 'imageUrl') {
        type = 2
      } else if (this.parameterUrl == 'imageUrl2') {
        type = 3
      } else if (this.parameterUrl == 'imageUrl3') {
        type = 4
      }
      if (this.$store.state.globalConfig.certificate_check_type == 2) { // 0：不审核，1：后台人工审核，2：调用接口审核）
        if (this.parameterUrl != 'backImageUrl') {
          this.ocrCertificate(type, base64StrImg, this.activeContent.activeObj.type, data)
        }
      } else {
        switch (this.activeContent.activeObj.type) {
          case 'IDcard': this.identityObj[this.parameterUrl] = data;
            break;
          case 'DriverCard': this.drive[this.parameterUrl] = data;
            break;
          case 'DrivingCard': this.travel[this.parameterUrl] = data;
            break;
        }
      }
    },
    ocrCertificate(type, base64StrImg, activeObjType, dataUrl) {
      // ocr识别  type: 0 身份证正面    1 身份证反面    2 驾驶证     3 驾驶证副页    4 行驶证       5 行驶证副页
      //                 imgFront       imgBehind     imageUrl    imageUrl2     imageUrl2
      this.$request.post('/app/json/ocr/ocrCertificate', {
        ocrType: type,
        base64Str: base64StrImg,
      }).then(res => {
        let data = res.data
        if (res.status === 0) {
          switch (activeObjType) {
            case 'IDcard': this.identityObj[this.parameterUrl] = dataUrl;
              break;
            case 'DriverCard': this.drive[this.parameterUrl] = dataUrl;
              break;
            case 'DriverCard': this.drive[this.parameterUrl] = dataUrl;
              break;
            case 'DrivingCard': this.travel[this.parameterUrl] = dataUrl;
              break;
          }
          if (activeObjType == 'IDcard') {
            if (type == 0) {
              this.identityObj.idcardNum = data.idno
              this.identityObj.name = data.name
            } else {}
          } else if (activeObjType == 'DriverCard') {
            if (type == 2) {
              this.drive.name = data.name
              this.drive.driveCode = data.license_no
            } else {
              this.drive.driveDocNo = data.archive_no
              this.drive.licenceCore = data.card_no
            }
          } else if (activeObjType == 'DrivingCard') {
            if (type == 4) {
              this.travel.plateNum = data.plateno
              this.travel.ownerName = data.owner
              this.travel.vin = data.vin
              this.travel.engineNum = data.engine_no
              this.travel.vehType = data.vehicle_type
            }
          }
        } else {
          this.$toast(res.info || '识别失败！')
        }
      })
    },
    submmitIndustryFun() {
      this.qualifications.clusterId = this.activeContent.id
      this.qualifications.clusterCode = this.activeContent.clusterCode
      this.qualifications.clusterName = this.activeContent.clusterName
      this.$request.post(this.submmitIndustryUrl, this.qualifications).then(res => {

      })
    },
    getIdentityObj(isActiveObj,active){
      let activeType = this.activeContent.steps[this.activeContent.steps.length-2].type
      this.activeTypeNew = activeType
      this.isActiveObjNew = isActiveObj
      this.activeNew = active
      if (this.activeContent.activeObj.type == 'IDcard' ) {
        if (!this.status.identityObj) {
          for (const key in this.identityObj) {
            if (key == 'idcardNum') {
              if (!this.identityObj[key]) {
                return this.$Toast(`${this.Verification[key]}不能为空`)
              } else {
                if (this.regIdNo(this.identityObj[key])) {
                  this.identityObj['sex'] = this.gender(this.identityObj['idcardNum'])
                } else {
                  return this.$Toast(`请输入正确的${this.Verification[key]}`)
                }
              }
            }
            if(this.$store.state.globalConfig.certificate_check_selfie == '1'){
              //  if (key == 'selfImageUrl' && !this.identityObj[key]) {
              if (!this.identityObj[key]) {
                return this.$Toast(`${this.Verification[key]}不能为空`)
              }
            }
            // if (key != 'idcardNum' && key != 'sex' && key != 'selfImageUrl' && !this.identityObj[key]) {
            if (key != 'idcardNum' && key != 'sex' && !this.identityObj[key]) {
              return this.$Toast(`${this.Verification[key]}不能为空`)
            }
          }
          this.popupIDcard = true
        } else {
          if(activeType == 'IDcard'){
            this.routerPush()
          }
          eventBus.$emit('isActive',isActiveObj, 'true', active)
        }
      } else if(this.activeContent.activeObj.type == 'DriverCard') {
        if (!this.status.drive) {
          for (const key in this.drive) {
            if (key == 'driveDocNo') {
              if (!this.drive[key]) {
                return this.$Toast(`${this.Verification[key]}不能为空`)
              } else {
                if (this.numbers(this.drive[key])) {
                } else {
                  return this.$Toast(`${this.Verification[key]}仅支持12位数字`)
                }
              }
            }
            if(key != 'driveDocNo' && key != 'licenceCore' && !this.drive[key]){
              return this.$Toast(`${this.Verification[key]}不能为空`)
            }
          }
          this.popupDriverCard = true
        } else {
          eventBus.$emit('isActive',isActiveObj, 'true', active)
          if(activeType == 'DriverCard'){
            this.routerPush()
          }
        }
      } else if (this.activeContent.activeObj.type == 'DrivingCard') {
        if (!this.status.travel) {
          for (const key in this.travel) {
            if (key == 'plateNum') {
              if (!this.travel[key]) {
                return this.$Toast(`${this.Verification[key]}不能为空`)
              } else {
                if (this.isNewEnergy) {
                  if (!this.plateNumber(this.travel[key])) {
                    return this.$Toast(`请输入正确的${this.Verification[key]}`)
                  }
                } else {
                  if (!this.newEnergy(this.travel[key])) {
                    return this.$Toast(`请输入正确的新能源${this.Verification[key]}`)
                  }
                }
              }
            }
            if (key == 'vehType') {
              if (!this.travel[key]) {
                return this.$Toast(`${this.Verification[key]}不能为空`)
              } else {
                if (!this.chinese(this.travel[key])) {
                  return this.$Toast(`${this.Verification[key]}只能输入中文`)
                }
              }
            }
            if (key == 'vin') {
              if (!this.travel[key]) {
                return this.$Toast(`${this.Verification[key]}不能为空`)
              } else {
                if (!this.englishNumbers(this.travel[key])) {
                  return this.$Toast(`${this.Verification[key]}仅支持17位的数字和字母`)
                }
              }
            }
            if(key != 'idcardNum' && key != 'vehType' && key != 'vin' && !this.travel[key]){
              return this.$Toast(`${this.Verification[key]}不能为空`)
            }
          }
          this.travel.imageUrl = this.travel.imageUrl2
          this.popupDrivingCard = true
        } else {
          eventBus.$emit('isActive',isActiveObj, 'true', active)
          if(activeType == 'DrivingCard'){
            this.routerPush()
          }
        }
      } else if (this.activeContent.activeObj.type == 'qualifications') {
        let ouNameStatus = true
        // if(!this.qualifications.areaId) {
        //   ouNameStatus = false
        //   return this.$Toast(`地市不能为空`)
        // }
        if(!this.qualifications.ouCode) {
          ouNameStatus = false
          return this.$Toast(`地市不能为空`)
        }
        // let idNameListArr = this.activeContent.expression.idNameList
        let papersName = []
        let paperImgUrl = []
        let status = true
        this.idNameList.forEach(item => {
          if (!item.newCredImg) {
            status = false
            return this.$Toast(`证件图不能为空`)
          }
          papersName.push(item.credName)
          paperImgUrl.push(item.newCredImg)
        });
        if (ouNameStatus && status) {
          // this.qualifications.areaId = this.qualifications.areaId
          // this.qualifications.areaName = this.qualifications.areaName
          this.qualifications.ouName = this.qualifications.ouName
          this.qualifications.ouCode = this.qualifications.ouCode

          this.qualifications.referrer = this.qualifications.referrer
          this.qualifications.papersName = papersName.join(',')
          this.qualifications.paperImgUrl = paperImgUrl.join(',')
          this.qualifications.clusterId = this.activeContent.id
          this.qualifications.clusterCode = this.activeContent.clusterCode
          this.qualifications.clusterName = this.activeContent.clusterName
          this.$request.post(this.submmitIndustryUrl, this.qualifications).then(res => {
            if (res.status === 0) {
              this.$Toast('提交成功')
              eventBus.$emit('isActive',isActiveObj, 'true', active)
              this.routerPush()
            } else {
              this.$Toast(res.info)
            }
          })
        }
      }
    },
    routerPush(){
      this.isExamine = true
      setTimeout(res=>{
        if (this.$route.query.feedback) {
          this.$router.go(-2)
        } else {
          this.$router.go(-1)
        }
      },2000)
    },
    onCancel(){
      this.uploadData.isShowUpload = false
    },
    clickField() {
      // this.showSelect = true
      // this._getRegionData(0)
      this.$refs.address.initAddress()
    },
    selectedItemsEvent(selectedValue) {
      let item = selectedValue.item;
      this.qualifications.areaName = item.name
      this.qualifications.areaId = item.id
      if(item.level == 3) {
        this.showSelect = false;
      }
      if (item.level <= 2) {
        this._getRegionData(item.id)
      }
    },
    setAddressEvent (data) {
      this.qualifications.ouName = data.ouName
      this.qualifications.ouNameNew = data.ouNameNew
      this.qualifications.ouCode = data.ouCode
    },
    regionCloseEvent() {
      this.showSelect = false;
    },
    // this.activeTypeNew = activeType
    //   this.isActiveObjNew = isActiveObj
    popupIDcardBtn() {
      this.popupIDcard = false
      this.$request.post(this.identifySubmmitUrl, this.identityObj).then(res => {
        if (res.status === 0) {
          // IDcard","DriverCard","DrivingCard
          // this.qualificationsObj.idNameList
          if (!this.qualificationsObj.idNameList.length) {
            if (this.qualificationsObj.cardList.includes("DriverCard") && this.qualificationsObj.cardList.includes("DrivingCard")) {
              if (this.status.drive && this.status.travel) {
                this.submmitIndustryFun()
              }
            } else {
              if (this.qualificationsObj.cardList.includes("DriverCard")) {
                if (this.status.drive) {
                  this.submmitIndustryFun()
                }
              }
              if (this.qualificationsObj.cardList.includes("DrivingCard")) {
                if (this.status.travel) {
                  this.submmitIndustryFun()
                }
              }
            }
          }
          this.$Toast('提交成功')
          eventBus.$emit('isActive',this.isActiveObjNew, 'true', this.activeNew)
          if(this.activeTypeNew == 'IDcard'){
            this.routerPush()
          }
        } else {
          this.$Toast(res.info)
        }
      })
    },
    popupDriverCardBtn() {
      this.popupDriverCard = false
      this.$request.post(this.driverInfoSubmmitUrl, this.drive).then(res => {
        if (res.status === 0) {
          if (res.data.failMsg == "身份信息不一致") {
            this.$Toast('身份信息不一致')
          } else {
            if (!this.qualificationsObj.idNameList.length) {
              if (!this.qualificationsObj.cardList.includes("DrivingCard")) {
                this.submmitIndustryFun()
              } else {
                if (this.status.travel) {
                  this.submmitIndustryFun()
                }
              }
            }
            this.$Toast('提交成功')
            eventBus.$emit('isActive',this.isActiveObjNew, 'true', this.activeNew)
            if(this.activeTypeNew == 'DriverCard'){
              this.routerPush()
            }
          }
        } else {
          this.$Toast(res.info)
        }
      })
    },
    popupDrivingCardBtn() {
      this.popupDrivingCard = false
      this.$request.post(this.bindVehicleUrl, this.travel).then(res => {
        if (res.status === 0) {
          if (!this.qualificationsObj.idNameList.length) {
            this.submmitIndustryFun()
          }
          this.$Toast('提交成功')
          eventBus.$emit('isActive',this.isActiveObjNew, 'true', this.activeNew)
          if(this.activeTypeNew == 'DrivingCard'){
            this.routerPush()
          }
        } else {
          this.$Toast(res.info)
        }
      })
    },
    _getRegionData: function (parentId) {
      this.$Loading.open()
      // console.log(parentId)
      let url = '/app/json/area/loadAreaList';
      let params1 = {
        token: this.$store.state.login.token,
        parentId: parentId
      };
      this.$http.post(url, params1).then(res => {
        this.$Loading.close()
        let data = res.data;
        if (data.status == 0) {
          let arr = data.data;
          if (arr.length > 0) {
            this.$nextTick(function () {
              this.$refs.regionselect.pushCustomOptions(arr);
            })
          } else {
            this.showSelect = false;
            this.getRegionText();
          }
        } else {
          this.$Toast(data.info)
        }
      }, error => {
        this.$Loading.close()
        console.log('获取失败', error);
        this.$Toast('获取数据失败')
      });
    },
    getRegionText: function () {
      this.$refs.regionselect.reset(null);
    }
  },
  components: {
    photograph: () => import("./photograph.vue"),
    VirtualKeyboard: () => import("@/components/base/virtual-keyboard"),
    orgTree: () => import("@/components/base/org-tree"),
    RegionSelect: () => import("@/components/base/region-select"),
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.stepsContent{
  height: 100%
  width 100%
  background-color #fff
  .certificatesBox{
    padding 5px
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
  }
  .popup{
    /deep/ .van-popup {
      width: 76%;
      font-size: 14px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .popupCard {
    height: 160px;
    flex-direction: column;
    line-height: 26px;
    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p{
        font-size 18px
      }
      span{
        color: #444141;
      }
    }
  }
  .tipsA{
    height 76%;
  }
  .tipsB{
    height 46%;
  }
  .tips{
    border-radius 12px 12px 0 0
    .tipsIcon{
      height 50px;
      display flex;
      justify-content: flex-end
      align-items center
      .icon{
        font-size 24px
        margin-right 20px
        color #b5b1b1
      }
    }
    .tipsContent{
      display flex
      flex-direction column
      justify-content center
      align-items center
      font-size: 14px;
      padding 0 10px
      .topTipsContent{
        height 120px
        width 100%
        border 1px solid #efefef
        border-radius 10px
        margin 0 20px 20px
        padding 10px
        display flex
        justify-content: center
        align-items center
        .topImg{
          width 100%
          height 100%
          display flex
          flex-direction column
          justify-content: center
          align-items center
          img{
            width 105px
            height 75px
          }
          p {
            margin-top 10px
          }
        }
      }
      .topText{
        width: 100%;
        height: 50px;
        text-align: center;
      }
      img{
        width 310px
        height 220px
        border-radius 8px
      }
      span{
        margin-top 20px
      }
    }
  }
  .plateNum{
    border-bottom 1px solid #efefef
    position relative
    .plateNumImg{
      z-index 1
      position absolute
      top 12px
      right 130px
      .img{
        width 40px
        height 20px
      }
    }
  }
}
.show-passwords {
  extend-click();

  img {
    display: block;
    // margin-top:4px;
  }

  .scancode {
    width: 20px;
    height: 20px;
  }
}
.examine {
  height: auto
  flex-direction: column;
  .popupContent {

    .contentText {
      margin 0 14px
      display block
      color #e23f3f
      line-height: 20px;
      font-size 10px
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
</style>

