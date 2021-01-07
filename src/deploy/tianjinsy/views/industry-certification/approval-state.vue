<template>
  <div class="approval-index">
    <nav-top title="审批状态" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="approval-content">
      <div class="query-content">
        <div class="query-input">
          <van-search
            v-model="keyWords"
            shape="round"
            placeholder="请输入用户姓名/手机号/车牌号"
          />
        </div>
        <span class="query-btn" @click="queryHandle">搜索</span>
      </div>
      
      <div class="approval-table">
        <div class="approval-thead">
          <div class="t-item">
            <span>姓名</span>
            <span>手机号</span>
            <span>车牌号</span>
            <span>审批状态</span>
          </div>
        </div>
        <div class="approval-tbody">
          <div class="t-item" :key="index">
            <span>{{approvaList.realName}}</span>
            <span>{{approvaList.phone}}</span>
            <span>{{approvaList.plateNum}}</span>
            <span>{{levelExamineStateList[approvaList.examineState]}}</span>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        keyWords: '',
        approvaList: {},
        levelExamineStateList: {
          '0': '待审核',
          '1': '审核通过',
          '2': '审核拒绝'
        }
      }
    },
    mounted() {

    },
    methods: {
      getApprovalData() {
        this.$request.post('/app/json/user_industry/getIndustryMemberInfo', {keyWords: this.keyWords}).then(res => {
          if (res.status == 0) {
            this.approvaList = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      queryHandle() {
        this.getApprovalData()
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .query-content {
    display: flex;
    align-items: center;
    
    .query-input {
      width 78%;
    }
    
    .query-btn {
      display: flex;
      flex: 1;
      background: red;
      color: #fff;
      height: 33px;
      text-align: center;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
      font-size: 14px;
      margin-right: 10px;
    }
  }
  
  .approval-table {
    height 100%;
    
    .t-item {
      height: 30px;
      line-height: 30px;
      display: flex;
      
      span {
        width 25%;
        text-align center;
      }
    }
    
    .approval-thead {
      background: #f2f2f2;
    }
    
    .approval-tbody {
      height 100%;
      overflow auto;
    }
  }
</style>