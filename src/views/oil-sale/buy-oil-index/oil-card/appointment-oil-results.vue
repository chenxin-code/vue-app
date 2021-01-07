<template>
  <div class="oil-sale-container">
    <nav-top title="预约提油" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="buy-bill-results-container">
      <div class="buy-bill-results-content">
        <div class="bill-results">
          <img src="../../assets/image/ok.png" alt="">
          <div class="text">预约信息提交成功！等待后台确认</div>
        </div>
        <div class="buy-bill">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <ul class="details-list">
                  <li class="details-item">
                    <div class="left">配送方式</div>
                    <div class="right">
                      <div class="switch-bar">
                        <div class="switch-bar-item"
                             :class="[item.type === switchBarType ? 'theme_bg_blue theme_font_white active': '']"
                             v-for="item in switchBar">{{item.name}}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">油品名称</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请选择自提油品" v-model="appointmentOilDetails.matertialName">
                    </div>
                    <!--      油品选择弹框-->
                    <TipsPopup></TipsPopup>
                  </li>
                  <li class="details-item">
                    <div class="left">提油卡号</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请选择提油卡" v-model="appointmentOilDetails.oilCardNo">
                    </div>
                    <!--      提油卡号选择弹框-->
                    <TipsPopup></TipsPopup>
                  </li>
                  <li class="details-item">
                    <div class="left">提油数量</div>
                    <div class="right">
                      <input type="text" placeholder="请输入提油数(t)" v-model="appointmentOilDetails.tonnes">
                    </div>
                  </li>
                  <!-- 配送 -->
                  <li class="details-item" v-if="switchBarType == 2">
                    <div class="left">配送地址</div>
                    <div class="right">
                      <input type="text" class="address" disabled placeholder="请选择配送地址"
                             v-model="appointmentOilDetails.deliveryAddress">
                    </div>
                  </li>
                  <!-- 自提 -->
                  <li class="details-item" v-if="switchBarType == 1">
                    <div class="left">自提油库</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请选择自提油库"
                             v-model="appointmentOilDetails.pickUpOilDepotName">
                    </div>
                    <!--      自提油库选择弹框-->
                    <TipsPopup></TipsPopup>
                  </li>

                  <li class="details-item">
                    <div class="left">收货人</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入提货人" v-model="appointmentOilDetails.consignee">
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">联系方式</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入联系方式" v-model="appointmentOilDetails.consigneePhone">
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import TipsPopup from '../../components/tips-popup'

  export default {
    data() {
      return {
        switchBarType: 2,
        switchBar: [{name: '配送', type: 2}, {name: '自提', type: 1}],
        clickOil: false, // 不可选择油库
        buyBillResults: true, // 撞单成功与否
        tradeStyle: '', // 配送方式
        oilName: '', // 油品名称
        oilCard: '', // 提油卡号
        oilNum: '', // 提油数量
        tradeAddress: '', // 配送地址
        people: '', // 提货人
        phone: '', // 联系方式
        appointmentOilDetails: '' // 成功详情
      }
    },
    mounted() {
      this.appointmentOilDetails = JSON.parse(this.$route.query.appointmentOilDetails)
      this.switchBarType = this.appointmentOilDetails.deliveryType
    },
    methods: {
      openOtherGrabBill() {
        // 查看其他抢单
        this.$router.go(-2)
      }
    },
    components: {
      TipsPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/oil-sale-base.styl"
  .btn-show {
    padding: 5px 15px 5px 15px !important

    .btn {
      border-radius 20px
      padding: 10px 0
      width: 50%
      margin: 0 auto
      color: #fff
      background: #009df8
      text-align center
      font-size: 14px
      font-weight bold
    }
  }

  .switch-bar {
    background: #e0f5fe;
    border-radius 15px;
    display inline-block
    overflow: hidden

    .switch-bar-item {
      display inline-block
      padding 5px 15px;
      text-align: center
      font-size: 12px;

      &.active {
        border-radius inherit;
      }
    }
  }
</style>
