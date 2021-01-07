<template>
  <div class="mine-userInfo-update-documents">
    <ul class="update-documents">
      <li class="item">
        <label class="item-left">证件类型</label>
        <div class="item-right border"  @click="togglePanel">
          <span>{{selectedCerName}}</span>
          <i class="icon-down"></i>
        </div>
      </li>
      <li class="item">
        <label class="item-left">证件号码</label>
        <div class="item-right">
          <input type="text" placeholder="请输入证件号码" class="input-text" v-model="idNumber"/>
        </div>
      </li>
    </ul>
    <button class="loginout font-medium-x" @click="saveCertificate()">保存</button>
    <div class="mark" v-show="visible" ref="main">
      <div class="closed" @click="cancelFunc()"></div>
      <div class="popmark">
        <div class="chosed">
          <!--<span class="cancel" @click="cancelFunc()">取消</span>-->
          <span class="chose-type">请选择证件类型</span>
          <span class="complete" @click="completeFunc()">完成</span>
        </div>
        <mt-picker v-if="hasValues" valueKey="idTypeName" :slots="slots" @change="onValuesChange"></mt-picker>
      </div>

    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  import { Picker } from 'mint-ui';
  export default {
    name: 'updateDocuments',
    components: {
      Picker,
      Toast
    },
    data() {
      return {
        visible:false,
        userInfo:{},
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center',
            defaultIndex: 0
          }
        ],
        idNumber:'',
        cerDatas: [],
        selectedCerId: '',
        selectedCerName: '',
        hasValues: false,
        isfirst: true
      }
    },
    methods: {
      onValuesChange(picker, values) {
        if (values[0] > values[1]) {
          picker.setSlotValue(1, values[0]);
        }
        // if (this.isfirst) {
        //   this.isfirst = false
        //   return
        // }
        this.selectedCerName = values[0].idTypeName;
        this.selectedCerId = values[0].idTypeCode;
      },
      togglePanel () {
        this.visible = true
      },
      cancelFunc:function (event) {
        this.visible = false;
      },
      completeFunc:function () {

        this.visible = false;
      },
      saveCertificate:function () {
        if (this.selectedCerId == ''){
          Toast({
            message: '请选择证件类型!',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }else  if (this.idNumber == ''){
          Toast({
            message: '请输入证件号码!',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open('保存中')
        let url = '/app/json/user/modifyUserInfo';
        let token = this.$store.state.login.token
        let params1 = {
          realName:this.userInfo.realName?this.userInfo.realName:'',
          gender:this.userInfo.gender?this.userInfo.gender:'',
          email:this.userInfo.email?this.userInfo.email:'',
          idNumber:this.idNumber,
          idType:this.selectedCerId,
          address:this.userInfo.address?this.userInfo.address:'',
          provinceName:this.userInfo.provinceName?this.userInfo.provinceName:'',
          cityName:this.userInfo.cityName?this.userInfo.cityName:'',
          provinceCode:this.userInfo.provinceCode?this.userInfo.provinceCode:'',
          cityCode:this.userInfo.cityCode?this.userInfo.cityCode:'',
          postCode:'',
          userType:'',
          token:token,
        }
        console.log(params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
        let data = res.data;
        console.log('证件信息', data)
        if (data.status == 0) {
          Toast({
            message: data.info ? data.info :'修改证件信息成功',
            position: 'bottom',
            duration: 2000,
          });
          _this.$store.state.userInfo.idNumber = _this.idNumber
          _this.$store.state.userInfo.idType = _this.selectedCerId
          _this.$bridgefunc.vuexStorage(function () {
            _this.$bridgefunc.customGo(-1)
          })
        } else {
          Toast({
            message: data.info ? data.info :'修改证件信息失败',
            position: 'bottom',
            duration: 2000,
          });
        }
      }, error => {
          _this.$Loading.close();
          console.log('修改证件信息失败', error)
          Toast({
            message: '保存失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
      getCertificate: function () {
        this.$Loading.open('请求中')
        let url = 'app/json/home/getIdTypeList';
        let token = this.$store.state.login.token
        let params1 = {
          token:token,
        }
        console.log(params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.cerDatas = data.data
            _this.slots[0].values = _this.cerDatas
            if (_this.selectedCerId != '') {
              for (let i = 0; i < _this.cerDatas.length; i++) {
                let item = _this.cerDatas[i]
                if (_this.selectedCerId == item.idTypeCode) {
                  _this.selectedCerName = item.idTypeName
                  _this.slots[0].defaultIndex = i
                  break
                }
              }
            }
            _this.hasValues = true
          } else {
            Toast({
              message: data.info ? data.info :'获取证件信息失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
          console.log('修改证件信息失败', error)
          Toast({
            message: '获取证件信息失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      }
    },
    created() {
      this.getCertificate()
      this.selectedCerId = this.$route.query.idtype ? this.$route.query.idtype : ''
      this.idNumber = this.$route.query.idnumber ? this.$route.query.idnumber : ''
      this.userInfo = JSON.parse(this.$route.query.userInfo)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .mine-userInfo-update-documents{
    width: 100%;
    height :100%;
    overflow: hidden;
    background-color:#efefef;
    position:absolute;
    .update-documents{
      background :#fff;
      overflow:hidden;
      .item{
        height:50px;
        overflow:hidden;
        padding:0px 5%;
        line-height:50px;
        border-bottom:0.5px solid #eee;
        .item-left{
          float:left;
          width:20%;
          font-size:14px;
        }
        .item-right{
          float:right;
          width:78%;
          padding:0px 3%;
          font-size:14px;
          .input-text{
            width:100%;
          }
        }
        .border{
          border:1px solid #eee;
          height:40px;
          margin-top:5px;
          line-height:40px;
          border-radius:5px;
          -webkit-border-radius:5px;
          position:relative;
          .icon-down{
            position:absolute;
            right:3%;
            top:50%;
            margin-top: -8px;
            width:20px;
            height:20px;
            background:url("../../../../static/image/mine/icon-down.png")0px 0px no-repeat;
            background-size:20px 20px;
          }
        }
      }
    }
    .loginout {
      margin:12px 5% 0px 5%;
      width: 90%;
      height: 44px;
      border-radius: 5px;
      color: #fff;
      background-color: $color-theme-btn-l;
      border: $color-theme-btn-l 1px solid;
    }
    .mark{
      position:absolute;
      left:0px;
      top:0px;
      width:100%;
      height:100%;
      background:rgba(0,0,0,0.5)
      z-index:999;
      .closed{
        margin-top -220px;
        width:100%;
        height:100%;
      }
      .popmark{
        width:100%;
        height:220px;
        background:#fff;
        .chosed{
          position relative
          overflow:hidden;
          width:100%;
          height:40px;
          line-height:40px;
          text-align:center;
          /*.cancel{
            width:20%;
            float:left;
            text-align:center;
            color:#f8ab00;
          }*/
          .chose-type{
            //margin-left 20%
            width:100%;
            text-align:center;
            color: $color-text;
          }
          .complete{
            position absolute
            right 3%;
            width:50px;
            color: $color-theme-btn-l;
          }
        }
      }
    }

  }
</style>
