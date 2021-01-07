<template>
  <div class="change-free-num">
    <nav-top title="选择免密金额" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="change-free-num-info" v-if="pageInitShow">
        <div class="change">
          <van-radio-group v-model="radio">
            <van-cell-group v-for="(item, index) in priceList" :key="index" >
              <van-cell :title="`${item}元\/笔`" clickable @click="getPrice(item, index)">
                <van-radio :name="item" />
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="tips theme_font_tint">支付金额≤{{freePayAmount}}/笔时无需输入密码</div>
        <div class="box">
          <div class="btn theme_bg_red_i" @click="queryBtn">确定</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Cell} from 'mint-ui'
  import {Dialog} from 'vant'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        pageInitShow: false, // 接口返回后渲染页面
        showBook: false, // 协议内容
        radio: '',
        freePayAmount: '', // 免密金额
        isIndex: '',
        priceList: [] // 免密金额列表
      }
    },
    created() {
    },
    mounted() {
      this.getFreeAmountList()
      this.radio = JSON.stringify(this.payInfo.freePayAmount)
      this.freePayAmount = this.payInfo.freePayAmount
    },
    methods: {
      queryBtn() {
        // 确定按钮
        if (!this.freePayAmount) {
          this.$toast('请选择免密金额')
        } else {
          this.setPayInfo(this.$assign({}, this.payInfo, {freePayAmount: JSON.parse(this.freePayAmount), isFreePayPwd: 0}))
          this.$bridgefunc.vuexStorage()
          this.$router.push({path: '/usercenter/identityyz'})
        }
      },
      getPrice(item) {
        this.freePayAmount = item
      },
      getFreeAmountList() {
        // 免密金额列表态
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token
        }
        this.$http.post('/app/json/user/getFreeAmountList', paramsData).then(res => {
          this.pageInitShow = true
          let data = res.data
          if (data.status == 0) {
            this.priceList = data.data
          }
          this.$Loading.close()
        })
      },
      ...mapMutations(['setPayInfo'])
    },
    computed: {...mapGetters(['payInfo'])},
    components: {
      Cell,
      [Dialog.name]: Dialog
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .change-free-num {

    .change-free-num-info {
      padding: 11px 8px
      overflow-y auto
      height 100%
      .change {
        padding: 5px 0
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        border-radius 4px
      }
      .box {
        padding: 0 8px
        .btn {
          text-align center
          padding: 14px 0
          border-radius 20px
          color: #fff
          font-size: 16px
          font-weight: bold
        }
      }
      .tips {
        padding: 15px 15px 50px 15px
      }
    }
  }

  /deep/ .van-cell {
    border-bottom: 0.026667rem solid #ebedf0
  }
  /deep/ .van-cell:last-child {
    border: none
  }
  /deep/ .van-cell:not(:last-child)::after {
    border: none
  }
  /deep/ .van-radio .van-icon-checked {
    color: #F80F16
  }
  /deep/ [class*=van-hairline]::after {
    border: none
  }
</style>
