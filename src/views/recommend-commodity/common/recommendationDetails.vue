<template>
  <div class="recommendation">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="box">
        <div class="recommendation-box">
          <p>推荐理由</p>
          <div class="box-text">
            <van-cell-group>
              <van-field label type="textarea" v-model="params.referralsReason" :readonly='true' placeholder="请输入推荐理由" maxlength="50" autosize  />
            </van-cell-group>
            <p>{{params.referralsReason.length}}/50</p>
          </div>
        </div>
        <div class="recommendation-list">
          <p>推荐商品</p>
          <div class='list'>
            <DetailList :listData="params.proSkuList" :rowStyle='3'/>
          </div>
        </div>
      </div>
      <div class="recommendation-btn">
        <span @click="delSku">删除推荐</span>
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
      params: {
        referralsReason: ''
      }
    };
  },
  components: {
    DetailList
  },
  computed: {
    ...mapState(["recommendationSku"]),
  },
  mounted() {
    let query = this.$route.query
    this.$request.post('/app/json/app_employee/referralsRecordDetail',{id: query.id}).then(res => {
      let data = res.data
      if (res.status == 0) {
        this.params = data || []
      } else {
        this.$Toast(res.info);
      }
    })
  },
  methods: {
    ...mapMutations(['setRecommendationSku']),
    delSku(skuId){
      this.$request.post('/app/json/app_employee/delReferralsRecord',{id: this.params.id}).then(res => {
        if (res.status == 0) {
          this.$router.go(-1)
        } else {
          this.$Toast(res.info);
        }
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
  .box {
    height calc(100% - 50px);
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
