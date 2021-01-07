<template>
  <div class="task-center-reocrd">
    <nav-top title="任务记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="task-center-reocrd-container">
      <div v-if="taskRecordList.length">
        <div class="content" v-for="(item, index) in taskRecordList" :key="index">
          <div class="task">
            <div class="title">{{item.monthStr}}</div>
            <div class="card">
              <div class="table-view">
                <div class="table-view-cell" v-for="(item2, index2) in item.taskListPerMonth" :key="index2">
                  <div class="table-view-cell-text">
                    <div class="left">
                      <div class="info">
                        <div class="text">{{item2.taskName}}</div>
                        <div class="tips">{{item2.completeTimeStr}}</div>
                      </div>
                    </div>
                    <div class="btn">{{item2.taskStateStr}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="noRecord" v-else  style="text-align:center;">
        <img src="./image/record-bgi.png" alt="" height="200">
        <p>暂无任务记录!</p>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        taskRecordList: [],
      }
    },
    mounted() {
      this.getTaskRecordList()
    },
    methods: {
      getTaskRecordList() {
        this.$request.post('/app/json/app_task_manage/taskRecordList', {
        }).then(res => {
          if (res.status === 0) {
            this.taskRecordList = res.data || []
          } else {
            this.$Toast(res.info)
          }
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .task-center-reocrd {
    .task-center-reocrd-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
      padding: 11px 15px
      .content {
        .task {
          .title {
            padding-bottom: 10px
            text-align center
            color: $color-text-l
          }
          .card {
            font-size 14px
            margin-bottom: 10px
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            .left {
              .info {
                line-height 22px
                .tips {
                  font-size 12px
                  color: $color-text-l
                }
              }
            }
            .btn {
              color: $color-theme-r
              text-align center
            }
          }
        }
      }
    }

    .noRecord{
      text-align center;
      font-size 16px;
    }
  }
</style>
