<template>
    <div class="body">
      <nav-top title="详情" @backEvent="$router.go(-1)"></nav-top>
      <nav-content>
        <div class="table-view">
          <div class="table-view-cell" v-if="obj.tradeNo">
            <div class="table-view-cell-text">
              <span class="span1">签约号</span>
              <span>{{obj.tradeNo}}</span>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
             <span class="span1">用户名</span>
              <span>{{obj.custName}}</span>
            </div>
          </div>
          <div class="table-view-cell" v-if="obj.plateNo">
            <div class="table-view-cell-text">
              <span class="span1">车牌号</span>
              <span>{{obj.plateNo}}</span>
            </div>
          </div>
          <div class="table-view-cell" v-if="obj.idCardNo">
            <div class="table-view-cell-text">
              <span class="span1">身份证号</span>
              <span>{{obj.idCardNo}}</span>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <span class="span1">签约方式</span>
              <span>{{obj.signPayWay}}</span>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <span class="span1">签约状态</span>
<!--              <span>已签约</span>-->
              <span>已解约</span>
            </div>
          </div>
<!--          <div class="table-view-cell">-->
<!--            <div class="table-view-cell-text">-->
<!--              <span class="span1">签约时间</span>-->
<!--              <span>2019-06-06 11:45:30</span>-->
<!--            </div>-->
<!--          </div>-->
          <div class="table-view-cell" v-if="!rescissionView">
            <div class="table-view-cell-text">
              <span class="span1">解约时间</span>
              <span>{{obj.operateTime}}</span>
            </div>
          </div>
        </div>
        <div class="btn" v-if="rescissionView">解除智慧加油支付</div>
      </nav-content>
    </div>
</template>

<script>
    export default {
        name: "contractDetail",
      data() {
        return {
          rescissionView: false,
          obj: {},
        }
      },
      created() {
        if (this.$route.query.iden == 1) { //1签约，0解约
          this.rescissionView = true
        } else {
          this.rescissionView = false
        }
        this.obj = this.$route.query.detail
      },
      methods: {

      },
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /deep/ .table-view .table-view-cell .table-view-cell-text {
    justify-content: start;
  }
    .body {
      font-size 14px;
      .span1 {
        margin-right 20px;
        width 75px;
      }
      .btn {
        width: 200px;
        height: 40px;
        border: 1px solid #e07122;
        border-radius: 23px;
        text-align: center;
        line-height: 40px;
        color: #ea6b07;
        font-size: 16px;
        margin: 50px auto 0 auto;
      }
    }

  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>
