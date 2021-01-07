<template>
  <div class="evaluation">
    <nav-top :title="title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="evaluation-container" v-if="complete">
      <div class="content">
        <div class="title">被考核人信息</div>
        <div class="card">
          <div class="text">
            <div class="title">员工编号</div>
            <div class="info">{{details.staffCode}}</div>
          </div>
          <div class="text">
            <div class="title">姓名</div>
            <div class="info">{{details.name}}</div>
          </div>
          <div class="text">
            <div class="title">所在部门</div>
            <div class="info">{{details.depart}}</div>
          </div>
          <div class="text">
            <div class="title">职位</div>
            <div class="info">{{details.position}}</div>
          </div>
          <div class="text">
            <div class="title">所在轮岗/借调部门名称</div>
            <div class="info">{{details.loanDepart}}</div>
          </div>
          <div class="text">
            <div class="title">测评等级</div>
            <div class="info">{{details.examinationLevelValue}}</div>
          </div>
        </div>
        <div class="title">被考核人履职情况</div>
        <div class="card" v-for="(item, index) in details.performDuties" :key="index">
          <div class="name">
            <div class="title">{{item.jobTitle}}</div>
            <div class="inp">
              <textarea rows="3" readonly cols="20" v-model="item.describe"></textarea>
            </div>
          </div>
          <div class="text special" @click="openShow(item)">
            <div class="title">完成情况评价</div>
            <div class="info change">
              {{item.completion}}
              <van-icon name="ellipsis"/>
            </div>
          </div>
          <div class="text">
            <div class="title">是否属于公司重点工作</div>
            <div class="info">
              <van-radio-group v-model="item.radio" :disabled="disabled">
                <van-radio checked-color="#F80F16" @click="clickRadio(item, item2)" :name="item2.type" v-for="(item2, index2) in radioList" :key="index2">{{item2.text}}</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="text special" v-if="type == 2" @click="openShow(item)">
            <div class="title">轮岗/借调部门完成情况评价</div>
            <div class="info change">
              {{item.loanCompleteEvaluate}}
              <van-icon name="ellipsis"/>
            </div>
          </div>
          <div class="text" v-if="type == 2">
            <div class="title">轮岗/借调部门是否属于公司重点工作</div>
            <div class="info">
              <van-radio-group v-model="item.loanIsKeyWork.toString()" disabled>
                <van-radio checked-color="#F80F16" @click="clickRadio(item, item2)" :name="item2.type" v-for="(item2, index2) in radioList" :key="index2">{{item2.text}}</van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
        <div class="title">述职报告</div>
        <div class="card">
          <div class="name">
            <div class="inp">
              <textarea rows="3" readonly placeholder="请输入述职报告" v-model="details.debriefing" cols="20"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="btn" @click="nextBtn" v-if="currentIndex != 1">{{type == 1 ? '提交' : '下一步'}}</div>
      <!--      选择完成情况弹框-->
      <van-popup v-model="show" position="bottom">
        <div class="show-title">
          <div class="left">完成情况选择</div>
          <div class="close" @click="show = false">
            <van-icon color="#999" size="20px" name="cross"/>
          </div>
        </div>
        <ul class="list">
          <li class="item"
              @click="changeType(index, item)"
              :class="{active: ind == index}"
              v-for="(item, index) in typeList"
              :key="index">
            <div class="type">{{item.text}}</div>
          </li>
        </ul>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        list: [1, 2, 3],
        show: false, // 完成情况评价
        complete: false,
        typeList: [
          {text: '完成', type: '3'},
          {text: '基本完成', type: '2'},
          {text: '部分完成', type: '1'},
          {text: '未完成', type: '0'},
        ],
        radioList: [
          {text: '是', type: '1'},
          {text: '否', type: '0'}
        ],
        ind: -1,
        type: '',
        details: '',
        info: '', // 当前评价
        title: '',
        disabled: false,
        currentIndex: '' // 1 就是 已考评或者 已评价
      }
    },
    mounted() {
      this.type = this.$route.query.type || ''
      this.currentIndex = this.$route.query.currentIndex || ''
      this.disabled = (this.type == 1 && this.currentIndex != 1) ? false : true
      this.title = this.type == 1 ? '部门负责人评价' : '考评中心'
      this.evaluationDetail()
    },
    methods: {
      evaluationDetail() {
        this.$request.post('/app/json/evaluation_center/evaluationDetail', {id: this.$route.query.id}).then(res => {
          if (res.status === 0) {
            this.details = res.data
            this.details.performDuties.forEach(item => {
              if (this.type == 1 && this.currentIndex != 1) {
                // 部门负责人评价 需要填写 完成情况与 是否属于公司重点工作 必须是未评价
                this.$set(item, 'completion', '选择完成情况')
                this.$set(item, 'completeEvaluate', '')
                this.$set(item, 'radio', '')
              } else {
                // 考评管理 页面只做展示
                let completeEvaluate = ''
                let loanCompleteEvaluate = ''
                if (item.completeEvaluate == 0) {
                  completeEvaluate = '未完成'
                } else if (item.completeEvaluate == 1) {
                  completeEvaluate = '部分完成'
                } else if (item.completeEvaluate == 2) {
                  completeEvaluate = '基本完成'
                } else {
                  completeEvaluate = '完成'
                }
                if (item.loanCompleteEvaluate == 0) {
                  loanCompleteEvaluate = '未完成'
                } else if (item.loanCompleteEvaluate == 1) {
                  loanCompleteEvaluate = '部分完成'
                } else if (item.loanCompleteEvaluate == 2) {
                  loanCompleteEvaluate = '基本完成'
                } else {
                  loanCompleteEvaluate = '完成'
                }
                this.$set(item, 'completion', completeEvaluate) // 完成情况评价
                this.$set(item, 'radio', item.isKeyWork.toString()) // 是否属于公司重点工作
                this.$set(item, 'loanCompleteEvaluate', loanCompleteEvaluate) // 是否属于公司重点工作
              }
            })
            this.complete = true
            console.log(this.details.performDuties)
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      submitEvaluate() {
        let performDuties = []
        this.details.performDuties.forEach(item => {
          performDuties.push({
            id: item.id,
            completeEvaluate: item.completeEvaluate,
            isKeyWork: item.radio
          })
        })
        this.$request.post('/app/json/evaluation_center/submitEvaluate', {
          id: this.$route.query.id,
          performDuties: performDuties,
          secondmentFlag: this.details.secondmentFlag  //是否为轮岗借调部门 0:否 1：是
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('评价成功')
            this.$router.go(-1)
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      changeType(index, info) {
        this.ind = index
        this.details.performDuties.forEach(item => {
          if (item.id == this.info.id) {
            item.completion = info.text
            item.completeEvaluate = info.type
          }
        })
        console.log(this.details.performDuties)
        this.show = false
      },
      clickRadio(details, info) {
        this.details.performDuties.forEach(item => {
          if (item.id == details.id) {
            item.radio = info.type
          }
        })
        console.log(this.details.performDuties)
      },
      openShow(item) {
        // 显示完成情况弹框
        if (this.type == 1 && this.currentIndex != 1) {
          this.show = true
          this.ind = -1
          this.info = item
        }
      },
      nextBtn() {
        // 评分中心
        for (let i = 0; i < this.details.performDuties.length; i++) {
          if (this.details.performDuties[i].completion == '选择完成情况') {
            this.$toast(`${this.details.performDuties[i].jobTitle}完成情况评价未选择`)
            return;
          } else if (!this.details.performDuties[i].radio) {
            this.$toast(`${this.details.performDuties[i].jobTitle}未选择是否属于公司重点工作`)
            return;
          }
        }
        if (this.type == 1) {
          // 提交评价
          this.submitEvaluate()
        } else {
          // 跳转到评分中心
          this.$router.push({path: '/subject', query: {questionaireId: this.details.questionaireId, id: this.details.id}})
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .evaluation {
    .evaluation-container {
      display flex
      flex-direction column

      .content {
        padding: 11px 15px
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding-bottom 50px

        .title {
          color: $color-text
        }

        .card {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          border-radius 6px
          margin: 10px 0
          padding: 11px 15px
          line-height 26px

          .name {
            .title {
              color: $color-text-d
            }

            .inp {
              textarea {
                width: 100%;
                background: $color-background-lll
                border-radius 6px
                border: 0
                display: block
                padding: 11px 15px
              }
            }
          }

          .special {
            padding-top: 3px

            .van-icon {
              padding-left: 5px
            }
          }

          .text {
            display flex
            justify-content space-between
            align-items center

            .title {
              color: $color-text-d
            }

            .change {
              display flex
              justify-content center
              align-items center
            }

            /deep/ .van-radio-group {
              display flex

              .van-radio {
                & + .van-radio {
                  padding-left: 10px
                }
              }
            }
          }
        }
      }

      .btn {
        flex-shrink 0
        background $color-theme-r
        padding: 15px 0
        text-align center
        position absolute
        bottom: 0
        left 0
        right: 0
        color: #fff
      }
    }
  }

  /deep/ .van-popup {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 11px 15px
    overflow-y initial

    .show-title {
      display flex
      justify-content space-between
      align-items center
      font-size 16px
    }

    .list {
      padding: 10px 0

      .item {
        padding: 10px 0
        text-align center
        font-size 16px

        .type {
          width: 80%
          margin: 0 auto
          padding: 15px 0
          border-radius 6px
          border: 1px solid $color-line-gray-l
        }
      }

      .active {
        color: $color-theme-r

        .type {
          border: 1px solid $color-theme-r
        }
      }
    }
  }
</style>
