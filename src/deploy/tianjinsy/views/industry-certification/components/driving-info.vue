<template>
  <div class="userInfo-index">
    <div class="box-shadow">
      <div class="table-view content-show">
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">车牌号</div>
            <div class="right">
              <input type="text" v-model="drivingFromData.plateNum" @focus="plateFocus" @touchstart.stop readonly placeholder="请输入车牌号">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">常用油品</div>
            <div class="right table-view-cell-arrow">
              <input type="text" v-model="commonOil" @click="showModel('commonOil')" readonly placeholder="请输入常用油品">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">网约车类型</div>
            <div class="right table-view-cell-arrow">
              <input type="text" v-model="drivingFromData.vechileTypeName" @click="showModel('OnlineCar')" readonly placeholder="请选择网约车类型">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">常驻地区</div>
            <div class="right table-view-cell-arrow">
              <input type="text" v-model="commonArea" @click="showModel('commonAreas')" readonly placeholder="请选择常驻地区">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">月均用油升数</div>
            <div class="right">
              <input type="number" v-model="drivingFromData.monthOilLitre" placeholder="请输入月均用油升数">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">网约车审批类型</div>
            <div class="right table-view-cell-arrow">
              <input type="text" v-model="onlineCarType" @click="showModel('onlineCarType')" readonly
                     placeholder="请选择网约车审批类型">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clause-box">
      <van-checkbox v-model="checked" checked-color="#F02C2D" icon-size="16px">是否为混动车型（混动车辆需上传行驶证副业照片）</van-checkbox>
    </div>
    
    <div class="box-shadow driving-upload" v-if="checked">
      <div class="img-upload">
        <div class="upload-title">请上传您的"行驶证副页"照片</div>
        <div class="driving-img" @click="upDrivingHandle">
          <img v-if="drivingUrl" :src="drivingUrl" alt="">
          <img v-else class="upload-icon" src="../../../assets/images/upload-icon.png" alt="">
        </div>
        <span class="see-text" @click="seeHandle">查看示例</span>
      </div>
    </div>
    
    <van-popup v-model="showUploadStyle" position="bottom">
      <div class="upload-style">
        <div class="style" @click="onSelect(0)">拍照</div>
        <div class="style" @click="onSelect(1)">相册</div>
        <div class="style" @click="showUploadStyle = false">取消</div>
      </div>
    </van-popup>
    
    <div v-if="coupon">
      <driving-coupon :couponList="couponList" :couponTitle="couponTitle" @couponDataHandle="couponDataHandle"></driving-coupon>
    </div>
  
    <virtual-keyboard :show="keyboardShow" @input="inputKey" @delete="deleteKey" @blur="keyboardShow = false"></virtual-keyboard>
    
  </div>
</template>
<script>
  import mixin from '../mixin'
  import {ImagePreview} from 'vant';
  import VirtualKeyboard from '@/components/base/virtual-keyboard'

  export default {
    components: {
      'driving-coupon': () => import('./driving-coupon'),
      VirtualKeyboard
    },
    mixins: [mixin],
    data() {
      return {
        keyboardShow: false,
        showUploadStyle: false,
        drivingUrl: '',
        phone: '',
        checked: false,
        coupon: false,
        couponList: [],
        couponTitle: '常用油品',

        onlineCarList: [
          {
            dictKey: 0,
            dictValue: '无网约车驾驶员证'
          }, {
            dictKey: 1,
            dictValue: '持网约车驾驶员证'
          }
        ],

        commonOil: '',
        vechileType: '',
        commonArea: '',
        onlineCarType: '',
        couponType: '',
        drivingFromData: {
          plateNum: ''
        },
        // drivingUrl 行驶证副页
      }
    },
    mounted() {
    },
    methods: {
      plateFocus(){
        this.keyboardShow = true
        document.activeElement.blur()
      },
      inputKey(val) { //限制7位
        if (this.drivingFromData.plateNum.length < 8) {
          this.drivingFromData.plateNum = this.drivingFromData.plateNum + val
        }
      },
      deleteKey() {
        this.drivingFromData.plateNum = this.drivingFromData.plateNum.substr(0, this.drivingFromData.plateNum.length - 1)
      },
      seeHandle() {
        ImagePreview({
          images: ['http://tbdmgt.deepermobile.com/download?guid=a6c180da9b6a4ed29937f03a16b00cd4']
        })
      },
      closeCoupon() {
        this.coupon = false
      },
      showModel(type) {
        this.coupon = true
        this.couponType = type
        if (type == 'commonOil') {
          this.couponTitle = '常用油品'
          this.couponList = this.commonOilList
        } else if (type == 'OnlineCar') {
          this.couponTitle = '网约车类型'
          this.couponList = this.OnlineCarList
        } else if (type == 'commonAreas') {
          this.couponTitle = '常驻地区'
          this.couponList = this.commonAreasList
        } else if (type == 'onlineCarType') {
          this.couponTitle = '网约车审批类型'
          this.couponList = this.onlineCarList
        }
      },
      couponDataHandle({dictKey, dictValue}) {
        this.closeCoupon()
        console.log(dictKey, dictValue)
        if (this.couponType == 'commonOil') {
          this.commonOil = dictValue
          this.drivingFromData.commonOil = dictKey
        } else if (this.couponType == 'OnlineCar') {
          this.drivingFromData.vechileTypeName = dictValue
          this.drivingFromData.vechileType = dictKey
        } else if (this.couponType == 'commonAreas') {
          this.commonArea = dictValue
          this.drivingFromData.commonArea = dictKey
        } else if (this.couponType == 'onlineCarType') {
          this.onlineCarType = dictValue
          this.drivingFromData.onlineCarType = dictKey
        }
      },
      upDrivingHandle() {
        this.showUploadStyle = true
      },
      onSelect(op) {
        this.showUploadStyle = false
        if (op == 0) {
          this.getImg('2')
        } else if (op == 1) {
          this.getImg('1')
        }
      },
      getImg(op) {
        let that = this
        this.$bridgefunc.getPhoto(op, img => {
          that.updateImg(img)
          let imgBack = 'data:image/jpg;base64,' + img
          that.drivingUrl = imgBack
        })
      },
      updateImg(image) {
        this.$Loading.open('保存中')
        let url = '/uploadFile'
        let token = this.$store.state.login.token
        let params1 = {
          base64File: image,
          fileType: 'jpg',
          fileName: 'id-card-img',
          bucketName: 'app_img',
          token: token
        }
        let that = this
        this.$http.post(url, params1).then(res => {
          that.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            that.drivingFromData.drivingUrl = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          that.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
    }
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .userInfo-index {
    
    .box-shadow {
      background: #FFFFFF;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding 10px 10px;
    }
    
    .table-view-cell {
      padding 15px 10px;
    }
    
    .clause-box {
      font-size 14px;
      margin-top: 15px;
    }
    
    .driving-upload {
      margin-top: 10px;
    }
    
    .img-upload {
      display flex;
      flex-direction column;
      align-items: center;
      height: 160px;
      justify-content: space-around;
      
      .driving-img {
        display flex
        height: 100px;
        align-items: center;
        justify-content: center;
        width: 100%;
        
        .upload-icon {
          width: 60px;
          height 60px;
        }
        
        img {
          height 100%
        }
      }
      
      .see-text {
        color #F02C2D;
      }
    }
    
    input {
      text-align right;
      /*direction rtl;*/
    }
    
    .upload-style {
      text-align: center;
      
      .style {
        padding: 18px 0;
        background: #fff;
        margin-top: 10px;
        border-radius: 6px;
        
        & + .style {
          border-top: 1px solid $color-line-gray-l;
        }
      }
    }
  }

</style>