import { mapGetters } from "vuex";
export default {
  data() {
    return {
      stepsValue: {
        IDcard: '身份证',
        DriverCard: '驾驶证',
        DrivingCard: '行驶证'
      },
      Verification: {
        name: '姓名',
        imgFront: '身份证正面',
        imgBehind: '身份证背面',
        selfImageUrl: '手持身份证',
        idcardNum: '身份证号',
        sex: '性别',
        imageUrl: '驾驶证首页',
        imageUrl2: '驾驶证副页',
        backImageUrl: '驾驶证背面',
        driveCode: '证号',
        driveDocNo: '档案编号',
        licenceCore: '驾驶证背面编号',
        imageUrl3: '行驶证首页',
        plateNum: '车牌号',
        ownerName: '所有人姓名',
        vin: '车辆识别代号',
        engineNum: '发动机号',
        vehType: '车辆类型'
      },
      groupClassify: '/app/json/user/getClusterCategoryList',
      industryClusterUrl: '/app/json/user/industryCluster', // 查询行业认证列表
      checkIdentifyAllDetail: '/app/json/user/checkIdentifyAllDetail', // 查询是否实名认证、驾驶证认证，车辆认证的接口
      identifySubmmitUrl: '/app/json/user/identifySubmmit', // 提交身份证
      driverInfoSubmmitUrl: '/app/json/user/driverInfoSubmmit', // 提交驾驶证
      bindVehicleUrl: '/app/json/user/bindVehicle', // 提交行驶证
      submmitIndustryUrl: '/app/json/user/submmitIndustry', // 资格认证
      findIdentifyClusterInfoUrl: '/app/json/user/findIdentifyClusterInfo', // 是否认证
      openOrCloseIndustryUrl: '/app/json/user/openOrCloseIndustry', // 开启 关闭群租
      checkBindOilCardUrl: '/app/json/user/isOnceBind' // 验证是否绑卡
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {},
  created() { },
  methods: {
    regIdNo(driveCode){ // 身份证
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      return regIdNo.test(driveCode)
    },
    plateNumber(value){ // 车牌号
      let regplateNumber = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;
      return regplateNumber.test(value)
    },
    newEnergy(value) { // 新能源车牌号
      let newEnergy = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$)/;
      return newEnergy.test(value)
    },
    chinese(value) { // 中文
      let han = /^[\u4e00-\u9fa5]+$/
      return han.test(value)
    },
    englishNumbers(value) { // 中文-数字-17位
      let isRnglishNumbers = /^[a-zA-Z0-9]{17}$/
      return isRnglishNumbers.test(value)
    },
    numbers(value) { // 数字-12位
      let isNumbers = /^[0-9]{12}$/
      return isNumbers.test(value)
    },
    gender(idcardNum) { // 性别
     return parseInt(idcardNum.substr(16, 1)) % 2 == 1 ? '男' : '女'
    },
    mergeObj (obj1 = {}, obj2 = {}) { // 原有对象赋值（ 固定key ）
      let obj = new Map(
        [...this.objToStrMap(obj1)].filter(([k, v]) => {
          return this.objToStrMap(obj2).has(k)
        })
      )
      return this.strMapToObj(obj)
    },
    objToStrMap(obj) {
      let strMap = new Map()
      for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k])
      }
      return strMap
    },
    strMapToObj(strMap) {
      let obj = Object.create(null)
      for (let [k, v] of strMap) {
        obj[k] = v
      }
      return obj
    },
    cardListType(type){
      let typeText = ''
      switch (type) {
        case 0: typeText = "";
          break;
        case 1: typeText = "已认证";
          break;
        case 2: typeText = "已关闭";
          break;
        case 3: typeText = "已移除";
          break;
        case 4: typeText = "已解散";
          break;
        case 5: typeText = "待审核";
          break;
        case 6: typeText = "已失败";
          break;
      }
      return typeText
    },
    imgBg(type) {
      let img = ''
      if (type == 0) {
        img = ''
      } else if (type == 1) {
        img = '标签1@2x'
      } else if (type == 5) {
        img = '标签3@2x'
      } else {
        img = '标签2@2x'
      }
      return img
    }
  }
}
