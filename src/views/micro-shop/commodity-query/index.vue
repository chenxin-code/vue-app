
<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <van-cell-group>
        <van-field label="商品售价" placeholder="请输入商品售价" required v-model="queryDistributionPro.salePrice" input-align="right" />
        <van-field label="商品编码" placeholder="请输入商品编码" v-model="queryDistributionPro.skuCode" input-align="right" />
        <van-field label="商品名称" placeholder="请输入商品名称" v-model="queryDistributionPro.skuName" input-align="right" />
      </van-cell-group>
      <p style="margin: 10px 16px;color: #f02e2c">商品编码和商品名称至少填写一项</p>
      <div class="list-btn">
        <span @click="queryBtn">查询</span>
      </div>
      <div class="totalRecords">
        查出&nbsp <span style="color: #f02e2c"> {{microShopListSku.length || 0}} </span>&nbsp;条记录
      </div>
      <div class="microshop-list-content">
        <DetailList :listData="microShopListSku" :styleObj="styleObj"/>
        <div v-if="microShopListSku.length" style="text-align: center;color: #999;margin: 12px;">没有更多数据了～</div>
<!--        <div class="microshop-item"  v-for="(item, index) in microShopListSku" :key="index">-->
<!--          <DetailList :listData="array"/>-->

<!--        </div>-->
      </div>
    </nav-content>
  </div>
</template>
<script>
  import DetailList from '../common/base/detail-list'
  export default {
    data() {
      return {
        styleObj: {
          rowStyle: 1,
          btn: true
        },
        queryDistributionPro: {
          salePrice: '', // 当前售价 必填
          skuCode: '', // 商品编码
          skuName: '' // sku名称
        },
        microShopListSku: []
      };
    },
    mounted() { },
    beforeDestroy(){ },
    methods: {
      backEvent() {
        this.$router.go(-1);
      },
      getInteger: function(price) {
        let str = this.$util.toDecimal2(price);
        let arr = str.split(".");
        return arr[0];
      },
      getDecimals: function(price) {
        let str = this.$util.toDecimal2(price);
        let arr = str.split(".");
        return arr[1];
      },
      getSkuNameStr: function(item) {
        let skuName = item.skuName;
        if (item.interfaceType == "2") {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_1 || '京东'}</span>` + skuName;
        } else if (item.interfaceType == "1") {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_2 || '有路'}</span>` + skuName;
        }
        return skuName;
      },
      text(rewardType) {
        // 3 积分 8 油滴 9 豌豆 12 元
        let text = "";
        if (rewardType == 3) {
          text = "积分";
        } else if (rewardType == 8) {
          text = "油滴";
        } else if (rewardType == 9) {
          text = "豌豆";
        } else if (rewardType == 0) {
          text = "元";
        }
        return text;
      },
      queryBtn() {
        if (!this.queryDistributionPro.salePrice) {
          this.$Toast('请输入当前售价')
          return
        }
        if (!(this.queryDistributionPro.skuName || this.queryDistributionPro.skuCode)) {
          this.$Toast('商品编码和商品名称至少填写一项')
          return
        }

        this.$request.post('/app/json/micro_store_front_end/queryDistributionPro', this.queryDistributionPro).then(res => {
          if (res.status === 0) {
            this.microShopListSku = res.data || []
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
    components: {
      DetailList
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .box {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    /deep/ .nav-content {
      padding-top 10px
      background-color #f6f6f6
    }
    .list-btn {
      margin: 0px 14px 14px;
      width auto;
      height: 40px;
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        width: 100%
        height: 100%
        color: #fff;
        font-size: 16px;
         border-radius: 30px;
        display: inline-block;
        background-color: #f02e2c;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .totalRecords {
      height: 50px
      display: flex
      justify-content center
      align-items center
      background-color: #fff
    }
    .microshop-list-content {
      height: calc(100% - 270px)
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
</style>
