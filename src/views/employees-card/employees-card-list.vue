<template>
  <div class="employees-card-list">
    <nav-top title="员工卡列表" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="employees-card-list-container" v-if="complete">
      <van-swipe-cell :right-width="65" v-for="(item, index) in list" :key="index">
        <template>
          <van-cell :border="false" :title="item.cardNo"/>
          <div class="delete theme_bg_red" slot="right" @click="deleteBtn(item.cardNo)">
            <span class="text">解除绑定</span>
          </div>
        </template>
      </van-swipe-cell>
      <div class="add-card" @click="addCard">
        <van-icon name="add-o" size="16px" color="#666" />&nbsp;&nbsp;添加员工卡
      </div>
<!--      解除绑定弹框提示-->
      <van-dialog
        v-model="show"
        title="提示"
        show-cancel-button
        @cancel="show = false"
        @confirm="confirm"
      >
        <div class="content">是否解除该员工卡？</div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        complete: false,
        list: [],
        show: false,
        cardNo: '' // 解绑的卡号
      }
    },
    mounted() {
      this.homePage()
    },
    methods: {
      homePage() {
        this.$request.post('/app/json/app_employee_card/homePage', {
          type: '', // 数据类型 1班结 2日结
          timeStr: '', // 日期 2019-09-30 如果传递日期代表是查看历史数据
          clazzNo: '' // 1 2 3 查看历史班结数据,如果查看当前班结数据不传此字段
        }).then(res => {
          if (res.status === 0) {
            this.complete = true
            this.list = res.data.cards
          } else {
            this.$Toast(res.info ? res.info : '获取数据失败')
          }
        })
      },
      addCard() {
        // 添加员工卡
        this.$router.push({path: '/bind-employees-card'})
      },
      deleteBtn(cardNo) {
        // 滑块删除
        this.show = true
        this.cardNo = cardNo
      },
      confirm() {
        // 确定解除
        this.unbindEmployeeCard()
      },
      unbindEmployeeCard() {
        this.$request.post('/app/json/app_employee_card/unbindEmployeeCard', {
          cardNo: this.cardNo // 卡号
        }).then(res => {
          if (res.status === 0) {
            this.$toast('解绑成功')
            this.complete = false
            this.homePage()
          } else {
            this.$toast(res.info ? res.info : '解绑失败')
          }
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .employees-card-list {
    background-color: #f8f8f8 !important

    .employees-card-list-container {
      overflow-y auto
      -webkit-overflow-scrolling touch

      .delete {
        width: 65px; /*no*/
        text-align: center;
        height 100%
        display: flex;
        align-items center
        color: #fff;
        justify-content center
        border-radius 6px
      }
      /deep/ .van-cell {
        padding: 15px
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        background: #fff
        border-radius 6px
      }
      /deep/ .van-swipe-cell__wrapper {
        padding: 11px 15px 0 15px
      }
      /deep/ .van-swipe-cell__right {
        padding: 11px 0 0 0
      }
      .add-card {
        padding: 15px
        display flex
        align-items center
        font-size 14px
        color: $color-text
      }
      .content {
        padding: 15px
        text-align center
      }
      /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
        background $color-theme-r
        color: #fff
      }
    }
  }
</style>
