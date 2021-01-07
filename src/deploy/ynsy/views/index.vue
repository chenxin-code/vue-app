<template>
  <div class="assessment-center">
    <nav-top title="测评中心" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="assessment-center-container" v-if="evaluationCenter">
      <div class="table-view assessment">
        <div class="table-view-cell" v-if="evaluationCenter.departEvaluationState" @click="openDepartment(1)" >
          <div class="table-view-cell-text">部门负责人评价</div>
          <div class="table-view-cell-arrow"></div>
        </div>
        <div class="table-view-cell" v-if="evaluationCenter.evaluationManageState" @click="openDepartment(2)">
          <div class="table-view-cell-text">考评管理</div>
          <div class="table-view-cell-arrow"></div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        evaluationCenter: ''
      }
    },
    mounted() {
      this.evaluationCenterList()
      // this.getAliLoginCodeStr()
    },
    methods: {
      getAliLoginCodeStr:function(){
        this.$Loading.open();
        let url = '/app/json/login/getAliLoginCodeStr';
        this.$http.post(url, {}).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$bridgefunc.aliAuth(data.data,(str) => {
                let authDic = JSON.parse(decodeURIComponent(str));
                if (authDic.user_id == '') {
                  this.$Toast('支付宝授权失败');
                } else {
                  this.zhifubaoLogin(authDic.auth_code)
                }
              });
            } else {
              this.$Toast(data.info ? data.info : '支付宝授权登录失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("支付宝授权登录失败");
          }
        )
      },
      evaluationCenterList() {
        this.$request.post('/app/json/evaluation_center/evaluationCenterList', {}).then(res => {
          if (res.status === 0) {
            this.evaluationCenter = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      openDepartment(type) {
        // 打开部门负责人评价 1是部门负责人评价 2是考评管理
        this.$router.push({path: '/department', query: {type: type}})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .assessment-center {
    .assessment-center-container {
      padding: 11px 15px
      .assessment {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 4px
        .table-view-cell {
          padding: 15px
        }
      }
    }
  }
</style>
