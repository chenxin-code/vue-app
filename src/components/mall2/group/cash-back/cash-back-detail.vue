<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container" v-if="isLoaded">
      <div class="product-info">
        <div class="left">
          <img :src="joinModel.phPictureUrl" class="prod-img"/>
        </div>
        <div class="right">
          <p class="product-title">{{joinModel.skuName}}</p>
          <p class="price-row">
            <span class="price">￥
            <span class="integer">{{$util.toDecimal2(joinModel.realPrice)}}</span>
            </span>
            <span class="num">x{{joinModel.number}}</span>
          </p>
        </div>
      </div>
      <div class="cash-back-list">
        <div class="item">
          <p class="title">
            商家已累计返现
            <span>{{getCashbackAmount(joinModel)}}</span>
          </p>
          <span class="time">{{joinModel.paidTime}}</span>
        </div>
        <div class="item" v-for="item in returnDetailList">
          <p class="title">
            返现金额
            <span class="red">{{getCashbackAmount(item)}}</span>
          </p>
          <span class="time">{{item.returnTime}}</span>
        </div>
      </div>
      <div class="cash-back-info">
        <p class="title">团购返现</p>
        <p class="content">{{getCashbackGz()}}</p>
      </div>
      <div class="cash-back-info">
        <p class="title">温馨提示</p>
        <p class="content">{{groupModel.groupBuyCashDesc}}</p>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderItemId: '',
      joinModel: {},
      groupModel: {},
      returnDetailList: [],
      isLoaded: false
    };
  },
  methods: {
    getCashbackGz: function () {
      // 2020-02-22 00:00:00 至 2020-02-29 23:59:59 期间售出达2件，每件返现1元；售出达5件，每件返现2元；售出达10件，每件返现3元。
      let str = this.groupModel.startDate + ' 至 ' + this.groupModel.endDate + ' 期间，'
      let unit = '元'
      if (this.groupModel.returnType == 3) {
        unit = '积分'
      }
      for (let i = 0; i < this.groupModel.returnRules.length; i++) {
        let itm = this.groupModel.returnRules[i]
        if (i != 0) {
          str += '；'
        }
        str += '售出达' + itm.number + '件，每件返现' + itm.returnValue + unit
      }
      str += '。'
      return str
    },
    getCashbackAmount: function (item) {
      switch (item.returnType) {
        case 1:
          return '¥' + item.returnElec
        case 2:
          return '¥' + item.returnRedPacket
        case 3:
          return item.returnPoints + '积分'
        default:
          return '返现类型有误'
      }
    },
    getMyCashBackDetail: function () {
      this.$Loading.open();
      let url = '/app/json/app_group_buy_cashback/getMyCashBackDetail';
      let paramsData = {
        orderItemId: this.orderItemId
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.joinModel = data.data.joinModel
            this.groupModel = data.data.groupModel
            this.returnDetailList = data.data.returnDetailList
            this.isLoaded = true
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        }
      );
    }
  },
  created() {
    this.orderItemId = this.$route.query.orderItemId
    this.getMyCashBackDetail()
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.container {
  padding: 0 10px 10px;
  overflow-y: auto;

  .product-info {
    margin-top: 5px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px #ddd;
    display: flex;
    align-item: center;

    .left {
      display: flex;
      align-items: center;

      .prod-img {
        width: 70px;
        height: 70px;
        border-radius: 3px;
        overflow hidden;
      }
    }

    .right {
      flex-grow: 1;
      padding: 5px 10px;
      position: relative;

      .product-title {
        font-size: 15px;
        line-height: 18px;
        height 36px;
        ellipse-2();
      }

      .specification {
        font-size: 12px;
        color: $color-text-d;
        padding-top: 10px;
      }

      .price-row {
        font-size: 12px;
        font-weight: 700;
        color: $color-theme-r;
        padding-top: 10px;
        display flex;
        align-items center;
        .price {
          flex 1;
          .integer {
            font-weight: 600;
            font-size: 16px;
          }
        }

        .num {
          color: $color-text-d;
          font-size: 14px;
        }
      }
    }
  }

  .cash-back-list {
    margin-top: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px #ddd;

    .item {
      padding: 10px 0;
      bdr-b();

      .title {
        font-size: 15px;

        span.red {
          color: $color-theme-r;
        }
      }

      .time {
        display: block;
        font-size: 13px;
        color: $color-text-l;
        padding-top: 10px;
      }
    }

    .item:last-child:after {
      display: none;
    }
  }

  .cash-back-info {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px #ddd;
    .title {
      font-size 15px;
      color $color-theme-r
      font-weight $font-weight-m;
    }
    .content {
      font-size 13px;
      line-height 17px;
      padding-top 10px;
      color #373737;
    }
  }
}
</style>
