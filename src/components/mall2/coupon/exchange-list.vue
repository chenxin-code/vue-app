/**Created by liaoyingchao on 2020-01-16.*/

<template>
  <div class="exchange-list">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list" v-if="listData.length > 0">
          <div class="coupon-wai" v-for="(item, index) in listData">
            <!--<coupon :item="item" :buttonType="3" :showCover="false" @toDetail="toDetail" :isExchanged="true"></coupon>-->
            <coupon :couponLayoutType="1" :disabled="false"
                    :used="true"
                    :item="item" :index="index"
                    @toDetail="toDetail(item)"
                    class="coupon-item"></coupon>
          </div>
        </div>
        <div class="no-data" v-if="listData.length == 0 && loaded">{{$t("loginRegisterLang.noRecordYet")}}
</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import coupon from './base/coupon'

  export default {
    name: "exchange-list",
    components: {
      coupon
    },
    data() {
      return {
        listData: [],
        loaded: false
      }
    },
    methods: {
      toDetail: function (item) {
        this.$router.push({
          name: 'couponexchangedetail',
          params: {
            detail: JSON.stringify(item)
          }
        })
      },
      getExchangeList: function () {
        let url = '/app/json/coupon/queryCouExchangeList'
        this.$Loading.open()
        this.loaded = false
        this.$http.post(url, {}).then(res => {
          this.$Loading.close()
          let data = res.data
          let status = data.status
          this.loaded = true
          if (status == 0) {
             this.listData = data.data
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        })
      }
    },
    created() {
      this.getExchangeList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .exchange-list {
    width 100%
    height 100%
    overflow hidden
    .content {
      width 100%
      height 100%
      overflow hidden
      background-color #f6f6f6;
      .no-data {
        margin-top 20px;
      }
      .list {
        height 100%;
        padding 20px 20px;
        overflow-y auto;
        .coupon-wai {
          margin-bottom 10px;
        }
      }
    }
  }
</style>
