<template>
  <div class="task-center">
    <nav-top title="任务中心" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="task-center-container">
      <div class="bg-img">
        <div class="record" @click="openRecord">任务记录</div>
      </div>
      <div class="content"
           v-if="taskInfoList.dailyTaskList || taskInfoList.dailyTaskList || taskInfoList.basicsTaskList">
        <div class="task">
          <div class="title">每日任务</div>
          <div class="card" v-if="taskInfoList.dailyTaskList.length">
            <div class="table-view">
              <div class="table-view-cell" v-for="(item, index) in taskInfoList.dailyTaskList" :key="index">
                <div class="table-view-cell-text">
                  <div class="left">
                    <div class="img">
                      <img v-if="item.taskIconUrl" :src="item.taskIconUrl" alt="">
                      <img v-else :src="setImgUrl(item)" alt="">
                    </div>
                    <div class="info">
                      <div class="text">{{item.taskName}}</div>
                      <div class="tips">{{item.taskDes}}</div>
                    </div>
                  </div>
                  <div class="btn" @click="nowGet(item)">{{item.taskStateStr}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-no" v-else>
            <p>暂无任务</p>
          </div>
        </div>
        <div class="task">
          <div class="title">限时任务</div>
          <div class="card" v-if="taskInfoList.timeLimitedTaskList.length">
            <div class="table-view">
              <div class="table-view-cell" v-for="(item, index) in taskInfoList.timeLimitedTaskList" :key="index">
                <div class="table-view-cell-text">
                  <div class="left">
                    <div class="img">
                      <img v-if="item.taskIconUrl" :src="item.taskIconUrl" alt="">
                      <img v-else :src="setImgUrl(item)" alt="">
                    </div>
                    <div class="info">
                      <div class="text">{{item.taskName}}</div>
                      <div class="tips">{{item.taskDes}}</div>
                    </div>
                  </div>
                  <div class="btn" @click="nowGet(item)">{{item.taskStateStr}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-no" v-else>
            <p>暂无任务</p>
          </div>
        </div>
        <div class="task">
          <div class="title">基础任务</div>
          <div class="card" v-if="taskInfoList.basicsTaskList.length">
            <div class="table-view">
              <div class="table-view-cell" v-for="(item, index) in taskInfoList.basicsTaskList" :key="index">
                <div class="table-view-cell-text">
                  <div class="left">
                    <div class="img">
                      <img v-if="item.taskIconUrl" :src="item.taskIconUrl" alt="">
                      <img v-else :src="setImgUrl(item)" alt="">
                    </div>
                    <div class="info">
                      <div class="text">{{item.taskName}}</div>
                      <div class="tips">{{item.taskDes}}</div>
                    </div>
                  </div>
                  <div class="btn" @click="nowGet(item)">{{item.taskStateStr}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-no" v-else>
            <p>暂无任务</p>
          </div>
        </div>
      </div>
      <div class="no-data" v-else>暂无数据~</div>
      <van-dialog confirmButtonText="确定" @confirm="taskJumpHandle" v-model="showTips" title="提示">
        <div class="price-content">恭喜您已成功领取该任务</div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        showTips: false,
        taskInfoList: [],
        imgList: [3001, 3002, 3003, 3006, 3006, 3006, 3007, 3008, 3009, 3010, 3023, 3031, 3032, 3035, 3039, 3050, 3051, 3082, 3083, 3084, 3088, 3102, 3104, 3107],
        taskId: ''
      }
    },
    mounted() {
      this.getTaskInfoList()
    },
    methods: {
      setImgUrl(item) {
        let imgUrl = require('./image/no-data.png')
        console.log(this.imgList.includes(Number(item.orderTypeCode)))
        if (item.orderTypeCode && this.imgList.includes(Number(item.orderTypeCode))) {
          imgUrl = require(`./image/${item.orderTypeCode}.png`)
        }
        return imgUrl
      },
      getTaskInfoList() {
        this.$request.post('/app/json/app_task_manage/taskInfoList', {}).then(res => {
          if (res.status === 0) {
            this.taskInfoList = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      nowGet(item) {
        this.taskId = item.id
        // 立即领取
        if (item.getState == 1) {
          // 可领取状态 0 不可领取 1 可领取
          this.$request.post('/app/json/app_task_manage/getTask', {
            id: item.id
          }).then(res => {
            if (res.status === 0) {
              this.showTips = true
              this.getTaskInfoList()
            } else {
              this.$Toast(res.info)
            }
          })
        }
      },
      openRecord() {
        // 任务记录页面
        this.$router.push({path: '/usercenter/task-center-reocrd'})
      },
      taskJumpHandle(){
        this.taskInfoList.dailyTaskList.forEach(item => {
          if(item.id == this.taskId){
            if(item.jumpUrl && item.takePartInType == 1){
              this.showTips = false
              // window.open(`http://tbdapp.deepermobile.com${item.jumpUrl}`)
              let resultUrl = window.location.href
              window.location.href = `${resultUrl.substring(0, resultUrl.indexOf('/usercenter/task-center'))}${item.jumpUrl}`
            }else{
              this.showTips = false
            }
          }
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .task-center {
    .task-center-container {
      display flex
      flex-direction column

      .bg-img {
        flex-shrink 0
        background url("./image/bg.png") no-repeat
        background-size 100% 100%
        height: 130px
        padding: 11px 15px

        .record {
          text-align right
          color: #fff
        }
      }

      .content {
        flex 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding: 11px 15px

        .task {
          .title {
            padding-bottom: 10px
            font-size 16px
          }

          .card {
            font-size 14px
            margin-bottom: 10px
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px

            .left {
              display flex
              justify-content left

              .img {
                padding-right: 10px

                img {
                  width 20px
                }
              }

              .info {
                line-height 22px

                .tips {
                  font-size 12px
                  color: $color-text-l
                }
              }
            }

            .btn {
              background $color-theme-r
              color: #fff
              border-radius 20px
              padding: 6px 0
              width 70px
              text-align center
            }
          }

          .card-no {
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.373333rem;
            margin-bottom: 0.266667rem;
            -webkit-box-shadow: 0 0 0.4rem 0 rgba(197, 197, 197, 0.5);
            box-shadow: 0 0 0.4rem 0 rgba(197, 197, 197, 0.5);
            background: #fff;
            border-radius: 0.16rem;
          }
        }
      }
    }
  }

  .price-content {
    padding: 20px 0
    text-align center
  }

  /deep/ .van-dialog .van-button {
    color: $color-theme-r
  }
</style>
