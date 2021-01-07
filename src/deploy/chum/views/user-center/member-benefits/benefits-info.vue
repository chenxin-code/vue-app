<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="qrroot">
      <van-tabs color="#C9A063" title-active-color="#C9A063" class="tab-con" :swipeable="true">
        <van-tab v-for="(item,index) in list" :title="item.equityName" :key="index">
          <div class="content" v-html="item.instructions">
            {{ item.instructions }}
          </div>
        </van-tab>
      </van-tabs>
    </nav-content>
  </div>
</template>
<script>
  export default {
    name: "benefitsInfo",
    components: {},
    data() {
      return {
        list: [],
        id: null
      }
    },
    methods: {
      getBenefits() {
        this.$Loading.open()
        let params = null
        let queryUrl = ''
        if (this.$route.query.entryType) {
          queryUrl = '/app/json/equity_card/equityExplain'
          params = {
            ids: this.id.split(',')
          }
        } else {
          queryUrl = '/app/json/equity_card/equityMember'
          params = {
            id: this.id
          }
        }
        this.$http.post(queryUrl, params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.list = res.data.data
          } else {
            this.$Toast(data.info)
          }
        }).catch((err) => {
          this.$Loading.close()
          this.$Toast(err)
        })
      },
    },
    created() {
      this.id = this.$route.query.id
      this.getBenefits()
    }

  }
</script>

<style lang="stylus" scoped>
  .tab-con {
    height 50px
  }

  /deep/ .tab-con .van-tabs__wrap {
    height 50px
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
  }

  /deep/ .van-tabs__nav--line {
    height auto
  }

  .content {
    margin 16px 20px
  }
</style>
