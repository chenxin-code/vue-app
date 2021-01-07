<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="information">
        <van-cell-group>
          <van-field v-model="information.empNo" label="员工编号" input-align="right" :readonly='true'/>
          <van-field v-model="information.realName" label="员工姓名" input-align="right" :readonly='true'/>
          <van-field v-model="information.depId" label="油站编码" input-align="right" :readonly='true'/>
          <van-field v-model="information.depName" label="油站名称" input-align="right" :readonly='true'/>
          <van-field v-model="information.unitName" label="所属分公司" input-align="right" :readonly='true'/>
          <van-field v-model="information.orgid" label="二维码序号" input-align="right" :readonly='true'/>
        </van-cell-group>
      </div>
    </nav-content>
    <div class="bottom-btns" v-if="!information.status">
      <span @click="binding">{{(information.orgid == '未绑定' || information.orgid == '') ? '二维码绑定' : '提交'}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        information: {
          empNo: '', // 员工编码，
          realName: '', // 员工姓名
          depId: '', // 油站编码
          depName: '', // 油站名称
          unitId: '' , // 单位ID
          unitName: '', // 单位名称
          orgid: '' //  绑定二维码序号
        }
      };
    },
    mounted() {
      this.getUserEmpByUserId()
    },
    methods: {
      backEvent() {
        this.$router.go(-1)
      },
      getUserEmpByUserId() {
        this.$request.post('/app/json/user/getUserEmpByUserId').then(res => {
          if (res.status == 0) {
            this.information = Object.assign({},res.data)
            if (!this.information.orgid) {
              this.information.orgid = '未绑定'
              this.information.status = false
            } else {
              this.information.status = true
            }
          } else{
            this.$Toast(res.info)
          }
        })
      },
      binding() {
        if (this.information.orgid == '未绑定' || this.information.orgid == '') {
          this.$bridgefunc.scanCode((dic) => {
            this.information.orgid = dic.code
          })
        } else {
          this.$request.post('/app/json/user/bindUserEmpQrCode',{orgid: this.information.orgid}).then(res => {
            if (res.status == 0) {
              this.information.status = false
            } else{
              this.$Toast(res.info)
            }
          })
        }
      }
    }
  };
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/mixin'
  .information {
    margin 8px 12px
    border-radius 6px
    box-shadow:0px 0px 3px 0.5px #e8e8e8
  }
  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 60px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 340px;
      height: 40px;
      color: #fff;
      font-size: 16px;
      border-radius: 30px;
      display: inline-block;
      background-color: #fe0118;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
