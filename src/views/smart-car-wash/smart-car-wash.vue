<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <ul class="store-list" v-if="storeList.length > 0">
        <li
          v-for="(item, index) in storeList"
          :key="index"
          class="item">
          <img src="./images/icon-wash.png" alt="" class="left-icon">
          <div class="center-content">
            <p class="store-name">{{ item.storeName }}</p>
            <p class="address-info">
              距您{{ $util.toDecimal2(item.distance / 1000) }}km | {{ item.addressFull }}
            </p>
            <span class="store-state">营业中</span>
          </div>
          <div class="right-btn" @click="goToMap(item)">
            <img src="./images/icon-navigation.png" alt="" class="icon-navigation">
            <p>导航</p>
          </div>
        </li>
      </ul>
      <p class="no-result-message" v-else>暂无店铺~</p>
      <div class="btm-btn">
        <div class="btn-l" @click="$router.push('/wash-recording')">洗车记录</div>
        <div class="btn-r" @click="scanHandler">
          <img src="./images/icon-scan.png" alt="" class="icon-btn">
          扫码洗车
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      storeList: []
    }
  },
  mounted() {
    this.initStoreList()
  },
  methods: {
    scanHandler() {
      // this.$router.push({
      //   path: '/wash-store',
      //   query: {
      //     storeOuCode: 1091001001001004
      //   }
      // })

      this.$bridgefunc.scanCode(res => {
        let tempCode = res.code
        if (tempCode && tempCode.indexOf('smartCarSashStoreOuCode') > -1) {
          this.$router.push({
            path: '/wash-store',
            query: {
              storeOuCode: this.$util.getUrlParam(tempCode, 'smartCarSashStoreOuCode')
            }
          })
        }
      })
    },
    initStoreList() {
      this.$Loading.open()
      this.$http.post('/app/json/store/getWashCarStoreList', {
        posx: this.$store.state.currentLocation.posx,
        posy: this.$store.state.currentLocation.posy
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.storeList.push(...data.data)
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getWashCarStoreListerr err ${err}`)
      })
    },
    goToMap(item) {
      this.$bridgefunc.baiduNav(
				{
					startlong: this.$store.state.currentLocation.posx,
					startlat: this.$store.state.currentLocation.posy,
					endlong: item.posx,
					endlat: item.posy,
					type: "nav"
				}
			)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container {
    background-color RGBA(245, 245, 245, 1)
  }
  .store-list {
    margin 0 15px;
    .item {
      border-radius 5px;
      background-color #fff;
      padding 10px;
      margin-top 10px;
      display flex;
      .left-icon {
        display block;
        width 48px;
        height 48px;
      }
      .center-content {
        flex 1
        padding 0 10px;
        .store-name {
          font-size 15px;
          line-height 18px;
          font-weight 500;
          ellipse()
        }
        .address-info {
          font-size 12px;
          color #666;
          line-height 18px;
          margin-top 5px;
        }
        .store-state {
          display inline-block;
          height 20px;
          line-height 19px;
          border-radius 2px;
          border .5px solid #61C36D;
          background-color #F1F8F2;
          font-size 12px;
          padding 0 2px;
          color #118820
          margin-top 5px;
        }
      }
      .right-btn {
        display flex;
        flex-direction column;
        justify-content flex-end;
        padding 5px 10px;
        font-size 12px;
        font-weight 500;
        .icon-navigation {
          display block;
          margin 0 auto;
          width 20px;
          margin-bottom 5px;
        }
      }
    }
  }
  .no-result-message {
    text-align center;
    font-size 13px;
    padding-top 50px;
    color #999;
  }
  .btm-btn {
    position fixed;
    left 15px;
    right 15px;
    bottom 0;
    padding 10px 0;
    display flex;
    justify-content space-between;
    .btn-l,
    .btn-r {
      width 48%;
      height 44px;
      line-height 43px;
      text-align center;
      border-radius 22px;
      overflow hidden;
      position relative;
      .icon-btn {
        float left;
        display block;
        width 44px;
        height 44px;
      }
    }
    .btn-l {
      border .5px solid #61C36D;
      background-color #F1F8F2;
      font-size 15px;
      font-weight 400;
      color #118820;
    }
    .btn-r {
      background-color #118820;
      font-size 18px;
      color #fff;
      font-weight 500;
    }
  }
</style>