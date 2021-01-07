<template>
  <div class="userInfo-index">
    <div class="box-shadow">
      <div class="table-view content-show">
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">客户姓名</div>
            <div class="right">
              <input type="text" v-model="userFromData.realName" placeholder="请输入客户姓名">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">手机号</div>
            <div class="right">
              <input type="text" v-model="userFromData.phone" placeholder="请输入客户手机号">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">身份证号</div>
            <div class="right">
              <input type="text" v-model="userFromData.idcardNum" placeholder="请输入客户身份证号">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">邀请人手机号</div>
            <div class="right">
              <input type="text" v-model="userFromData.submitPhone" placeholder="请输入邀请人手机号">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clause-box">
      <van-checkbox v-model="isclause" checked-color="#F02C2D" icon-size="16px"></van-checkbox>
      <div class="clause-title">
        我已阅读并同意 <span class="clause" @click="goClauseHandle">《运营型车辆营销专区服务条款》</span>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        phone: '',
        isclause: false,
        userFromData: {}
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      goClauseHandle() {
        this.$router.push({path: '/terms_of_service'})
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .userInfo-index {
    
    .box-shadow {
      background: #FFFFFF;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding 0 10px;
      
      .table-view-cell {
        padding 15px 10px;
      }
    }
    
    .clause-box {
      font-size 14px;
      margin-top: 15px;
      display flex;
      
      .clause-title {
        margin-left: 5px;
      }
      
      .clause {
        color #F02C2D;
      }
      
    }
    
    input {
      text-align right;
      /*direction rtl;*/
    }
  }

</style>