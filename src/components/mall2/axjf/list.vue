/**Created by liaoyingchao on 2020-04-26.*/

<template>
  <div class="list">
    <nav-top @backEvent="backEvent"></nav-top>
    <PorsList v-if="showList" :componentName="'AXJFShop'" :orderCategory="2" :vipUnitUserCode="vipUnitUserCode" :axPoints="points" @axPointsDetail="axPointsDetail"></PorsList>
  </div>
</template>

<script>
  import PorsList from '@/components/mall2/list/list'

  export default {
    name: "list",
    components: {
      PorsList
    },
    data() {
      return {
        vipUnitUserCode: '',
        vipUserId: '',
        points: 0,
        showList: false
      }
    },
    methods: {
      backEvent: function () {
        let dStr = sessionStorage.getItem('SAVE_AXJF_Enterprise')
        if (dStr) {
          let d = JSON.parse(dStr)
          sessionStorage.removeItem('SAVE_AXJF_Enterprise')
          for (let i = 0; i < this.$store.state.globalConfig.acctList.length; i++) {
            let item = this.$store.state.globalConfig.acctList[i]
            if (item.acctType == "Enterprise") {
              this.$store.state.globalConfig.acctList.splice(i, 1, d)
              this.$bridgefunc.vuexStorage()
              break;
            }
          }
        }
        this.$router.go(-1)
      },
      axPointsDetail: function () {
        this.$router.push({
          path: '/mall2/axjf/pointsdetail',
          query: {
            userId: this.vipUserId,
            vipUnitUserCode: this.vipUnitUserCode,
          }
        })
      },
      getAxPoints: function () {
        this.$Loading.open();
        let url = '/app/json/app_love_donation/getAccountBaseInfo';
        let paramsData = {
          userId: this.vipUserId,
          acctType: '11'
        };
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.points = data.data.balanceUnit
              this.showList = true
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getVipUserId: function () {
        this.$Loading.open();
        let url = '/app/json/app_love_donation/queryBindLoveDonationList';
        let paramsData = {};
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              if (data.data && data.data.length > 0) {
                this.vipUserId = data.data[0].vipUserId
                this.vipUnitUserCode = data.data[0].vipUnitUserCode
                this.getAxPoints()
              } else {
                this.$Toast('没有对应的爱心积分账户！');
              }
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
      for (let i = 0; i < this.$store.state.globalConfig.acctList.length; i++) {
        let item = this.$store.state.globalConfig.acctList[i]
        if (item.acctType == "Enterprise") {
          sessionStorage.setItem('SAVE_AXJF_Enterprise', JSON.stringify(item))
          item.displayName = '爱心积分'
          this.$store.state.globalConfig.acctList.splice(i, 1, item)
          this.$bridgefunc.vuexStorage()
          break ;
        }
      }
      console.log(this.$store.state.globalConfig.acctList)
      this.getVipUserId()
      // this.vipUnitUserCode = this.$route.query.vipUnitUserCode;
      // this.getAxPoints()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .list {
    width 100%
    height 100%
    overflow hidden
  }
</style>
