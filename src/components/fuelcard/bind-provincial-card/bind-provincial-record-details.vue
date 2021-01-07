<template>
  <div class="card-binding-index">
    <nav-top title="外省卡绑卡详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="card-binding-content">
      <div class="card-binding">
        <div class="card-information card-status">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">审核状态：</div>
                <div class="right">
                  {{recordsState == 2 ? '审核中' : recordsState == 1 ? '审核成功' : '审核失败'}}
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">申请时间：</div>
                <div class="right">{{bindingData.createTime}}</div>
              </div>
            </div>
            <div class="table-view-cell" v-if="recordsState == 0">
              <div class="table-view-cell-text">
                <div class="left">审核失败原因：</div>
                <div class="right">{{bindingData.approvalMessage}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-information card-status">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">外省卡卡号：</div>
                <div class="right">
                  {{bindingData.cardNo}}
                </div>
              </div>
            </div>
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
        bindingData: {},
        recordsState: ''
      }
    },
    mounted() {
      this.bindingData = this.$route.query.cardInfo ? JSON.parse(this.$route.query.cardInfo) : {}
      console.log(this.bindingData)
      this.recordsState = this.$route.query.recordState
    },
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  
  .card-binding-index {
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    .card-binding-content {
      padding: 10px;
      bottom: 0;
      
      .card-binding {
        position: absolute;
        top: 0px;
        right: 0px;
        left: 0px;
        bottom: 50px;
        padding: 10px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .card-status {
        margin-bottom: 20px;
        
        .right {
          line-height: 28px;
        }
      }
      
      .card-information {
        box-shadow: 0px 5px 6px #f0f0f0;
        margin-bottom: 15px;
        
        .card-type-radio {
          display: flex;
          justify-content: space-around;
        }
        
        .left {
          width: 30%;
        }
        
        .right {
          flex: 1;
          
          input {
            width: 100%;
            line-height: 28px;
            background-color: #fff;
          }
        }
      }
      
    }
  }
</style>
