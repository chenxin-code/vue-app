<template>
  <div class="phone-bill">
    <nav-top :title="title" @backEvent="$router.go(-2)">
      <!-- <div class="life-pay">北京市</div> -->
    </nav-top>
    <nav-content class="phone-bill-details">
      <div class="phone-bill-content">
        <!-- <div class="new-recharge-title">
          <img src="../image/dfx.png" alt v-if="name == 'ele'" />
          <img src="../image/sfx.png" alt v-else-if="name == 'water'" />
          <img src="../image/rqx.png" alt v-else-if="name == 'gas'" />
          <img src="../image/ghx.png" alt v-else-if="name == 'phone'" />
          <span class="text">{{title}}</span>
        </div> -->
        <div class="inp-num">
          <img src="../image/dsh.png" alt height="130" />
          <p>暂无缴费账单</p>
        </div>
        <div class="content">
          <ul class="list">
            <li class="item">
              <div class="info">
                <div class="details">缴费单位</div>
                <div class="text">{{payUnitName}}</div>
              </div>
            </li>
            <li class="item">
              <div class="info">
                <div class="details" v-if="name == 'phone' || name == 'gas' || name == 'water'">缴费户号</div>
                <div class="details" v-else>客户编号</div>
                <div class="text">{{account}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      name: '', // 缴费名称
      payUnitName: '', // 缴费单位
      account: '', // 户号
    }
  },
  mounted() {
    this.name = this.$route.query.name
    this.payUnitName = this.$route.query.payUnitName
    this.account = this.$route.query.account
    if (this.name == 'ele') {
      this.title = '电费充值'
    } else if (this.name == 'water') {  // 需获取应缴金额
      this.title = '水费充值'
    } else if (this.name == 'gas') {
      this.title = '燃气费充值'
    } else if (this.name == 'phone') {
      this.title = '固话充值'
    }
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
@import '../../asset/recharge.styl';

.phone-bill {
  overflow: auto;
  height: 100%;
}

.phone-bill-content {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 15px 44px 15px;

  .content {
    margin-bottom: 30px;

    .title {
      padding: 15px 0;
      font-size: 20px;
      color: $color-text;
    }

    .list {
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      border-radius: 4px;
      padding: 0 5px;

      .item {
        & + .item {
          border-top: 0.5px solid #ecebeb;
        }

        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 5px;
          font-size: 14px;

          .details {
            color: $color-text-l;
          }

          .address {
            ellipse();
          }

          .text {
            width: 70%;
          }
        }
      }
    }
  }

  .new-recharge-title {
    padding: 20px 11px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius: 4px;
    margin: 10px 0;
    vertical-align: top;
    display: flex;
    justify-content: left;
    align-items: center;
    font-size: 16px;

    img {
      width: 30px;
      display: inline-block;
      padding-right: 10px;
    }
  }

  .inp-num {
    padding: 11px;
    border: 0.5px solid #ecebeb;
    border-radius: 4px;
    margin: 10px 0;
    text-align: center;

    p {
      font-size: 16px;
      color: #92928f;
      margin: 10px 0 15px;
    }
  }

  .num {
    padding: 20px 11px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text {
      font-size: 16px;
    }

    .num-info {
      .info {
        font-size: 22px;
      }
    }
  }
}

.life-pay {
  font-size: 16px;
  color: $color-theme-r;
  text-align: right;
  margin-right: 15px;
}

/deep/ .van-icon {
  font-size: 20px;
  color: $color-text-l;
}

.recharge-popup {
  padding: 11px 15px;
  height: 350px;

  .num {
    text-align: center;
    font-weight: bold;
    padding: 20px 0;

    .text {
      font-weight: bold;
      font-size: 34px;
    }
  }

  .info {
    .details {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      border-bottom: 0.5px solid #ecebeb;

      .title {
        color: $color-text-l;
      }
    }
  }
}

/deep/ .van-action-sheet--withtitle {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>