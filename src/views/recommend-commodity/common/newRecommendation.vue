<template>
  <div class="recommendation">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="box" :class="{isHeigthA: !!params.status, isHeigthB: !params.status}">
        <div class="recommendation-box" v-if="params.status">
          <p>推荐理由</p>
          <div class="box-text">
            <van-cell-group>
              <van-field label type="textarea" v-model="referralsReason" placeholder="请输入推荐理由" maxlength="50" autosize  />
            </van-cell-group>
            <p>{{referralsReason.length}}/50</p>
          </div>
        </div>
        <div class="recommendation-list">
          <span class="titer">
            <p>推荐商品</p>
            <p @click="ortListBtn" style="color: #f80f16">推荐排序</p>
          </span>
          <div class='list'>
            <DetailList :listData="recommendationSku.skuList" :rowStyle='2' @delSku='delSku'/>
          </div>
        </div>
      </div>
      <div class="recommendation-btn" v-if="params.status">
        <span @click="setQrcode">生成推荐码</span>
      </div>
    </nav-content>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations } from "vuex";
import DetailList from './base/detail-list'

export default {
  name: "modifyintroduction",
  data() {
    return {
      referralsReason: '',
      params: {
        status: 0
      }
    };
  },
  components: {
    DetailList
  },
  computed: {
    ...mapState(["recommendationSku","mall2"]),
  },
  mounted() {
    this.params = this.$route.query
  },
  methods: {
    ...mapMutations(['setRecommendationSku']),
    delSku(skuId){
      let skuList = JSON.parse(JSON.stringify(this.recommendationSku.skuList))
      this.recommendationSku.skuList.forEach((element,index) => {
        if (element.skuId == skuId) {
          skuList.splice(index, 1)
          return
        }
      });
      console.log(skuList,skuId)
      this.setRecommendationSku({skuList: skuList})
    },
    setQrcode() {
      // referralsReason:这些商品很不错
      // proSkuList:[{"skuId":374581,"storeOuCode":"1095001001001002","salePrice":"0.01"},{"skuId":374575,"storeOuCode":"1","salePrice":"0.01"}]
      if (this.referralsReason) {
        let proSkuList = []
        this.recommendationSku.skuList.forEach(res=>{
          proSkuList.push({
            skuId: res.skuId,
            storeOuCode: res.storeOuCode,
            salePrice: res.salePrice,
            activityPrice: res.activityPrice
          })
        })
        this.$request.post('/app/json/app_employee/addEmployeeReferrals',{referralsReason: this.referralsReason,deliverType:this.mall2.staticDeliverType, proSkuList: proSkuList}).then(res => {
          if (res.status == 0) {
            this.$router.push({
              path: '/recommend-commodity/qrcode',
              query: { qrcode: res.data || ''}
            })
          } else {
            this.$Toast(res.info);
          }
        })
      } else {
        this.$Toast('请输入推荐理由');
      }
    },
    ortListBtn() {
      this.$router.push({
        path: '/recommend-commodity/sort_list',
        // query: recommendationSku.skuList
      })
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
/deep/ .nav-content{
  background-color #f6f6f6
}
.recommendation {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .isHeigthA {
    height calc(100% - 50px);
  }
  .isHeigthB {
    height 100%;
  }
  .box {
    overflow-y auto
  }
  .recommendation-box {
    width: 100%;
    height 140px
    margin-top 10px
    padding 10px
    background: #fff
    display flex
    flex-direction column
    align-items flex-start
    
    .box-text {
      width: 100%;
      height 100%
      margin-top 8px
      background: #f6f6f6;
      border-radius: 6px;
      /deep/ .van-field__control {
        font-size: 14px;
        height: 90% !important;
      }
      /deep/ .van-cell {
        border-top-left-radius: 6px
        border-top-right-radius: 6px
        background: #f6f6f6;
      }
      p {
        text-align: right;
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }
  .recommendation-list {
    width 100%
    background: #fff
    padding 10px
    margin-top 10px
    .titer {
      display flex
      justify-content space-between
    }
    .list {
      /deep/ .row {
        border-bottom 1px solid #f6f6f6
      }
    }
  }

  .recommendation-btn {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 100%;
      height: 50px;
      color: #fff;
      font-size: 16px;
      text-align center
      line-height 50px;
      background-color: #f02e2c;
    }
  }
  /deep/ [class*=van-hairline]::after {
    border 0;
  }
}
</style>
