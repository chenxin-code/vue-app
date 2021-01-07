<template>
  <div class="video-index">
    <nav-top title="视频充值" @backEvent="$router.go(-1)">
      <div class="phone-bill" @click="openPhoneBill">充值记录</div>
    </nav-top>
    <nav-content class="video-index-contsainer" v-if="complete">
<!--      <van-search placeholder="名称搜索" v-model="videoName" />-->
<!--      <div class="bar" ref="allcitybar">-->
<!--        <van-index-bar :index-list="indexList" highlight-color="#07c160">-->
<!--          <template v-for="(value, name) in titleList">-->
<!--            <van-index-anchor  :index="name"/>-->
<!--            <van-cell v-for="(item, index) in value" :key="index" :title="item.areaName" @click="changeVideo(item)"/>-->
<!--          </template>-->
<!--        </van-index-bar>-->
<!--      </div>-->
      <div class="main">
        <div class="top">
          <img :src="videoTitleImageUrl" alt="">
        </div>
        <ul class="list">
          <li class="item" v-for="(item, index) in rechargeProList" :key="index" @click="changeVideo(item)">
            <div class="content">
              <div class="img">
                <img :src="item.phMainUrl" alt="">
              </div>
              <div class="text double-line">{{item.spuName}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="tips" v-if="agreement">
        <div class="title">充值说明</div>
        <div class="content" v-html="agreement"></div>
      </div>
    </nav-content>
<!--    <AdPage :pageAdKeywords="'AD_Key_OuFeiPage'"></AdPage>-->
  </div>
</template>

<script>
  import '@/utils/pinyinUtil'
  // import AdPage from '@/components/product/index/subpage/adpage'

  export default {
    data() {
      return {
        videoName: '', // 视频名称
        rechargeProList: '', // 列表
        titleList: [], // 字母列表
        indexList: [], // 索引列表
        complete: false,
        videoTitleImageUrl: '',
        agreement: ''
      }
    },
    mounted() {
      if (this.$store.state.globalConfig.videoTitleImageUrl) {
        this.videoTitleImageUrl = this.$store.state.globalConfig.videoTitleImageUrl
      } else {
        this.videoTitleImageUrl = require('./image/bg.png')
      }
      this.getRechargeProList()
      this.showagreement()
    },
    methods: {
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', { values: 31 }).then(res => {
          if (res.status == 0) {
            this.agreement = res.data[0] ? res.data[0].content : ''
          }
        })
      },
      changeVideo(item) {
        // 选择视频
        this.$router.push({
          path: '/video-recharge',
          query: {
            spuId: item.spuId,
            spuName: item.spuName,
            spuImage: item.phMainUrl
          }
        })
      },
      openPhoneBill() {
        // 打开视频账单
        this.$router.push({path: '/recharge-bill', query: {name: 'video'}})
      },
      getRechargeProList() {
        // 获取面额
        let productType = ''
        if (this.$store.state.globalConfig.videoRechargeStyle == 1) { // 默认 或者0 卡密充值    1就是直冲
          productType = '510'
        } else {
          productType = '508'
        }
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          productType: productType // 501话费充值，502流量充值 503qq充值 508视频充值 1004易捷卡 510游戏及互娱产品直充
        }
        this.$http.post('/app/json/product_recharge/getRechargeProList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.complete = true
            this.rechargeProList = data.data.spuModels
            // this.formCityData(this.rechargeProList)
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      formCityData(data) {
        let pinyinData = data.map(dic => ({
          areaName: dic.spuName,
          spuId: dic.spuId,
          firstLetter: pinyinUtil.getFirstLetter(dic.spuName.substr(0, 1), false)[0],
          // areaCode: dic.areaCode,  // 可以自选择不同的生成拼音方案和风格。
        }));
        let sortedData = pinyinData.sort((a, b) => {
          return a.firstLetter.localeCompare(b.firstLetter);
        }).map(dic => {

          return {
            areaName: dic.areaName,
            spuId: dic.spuId,
            firstLetter: dic.firstLetter.toLocaleUpperCase(),
            // areaCode: dic.areaCode,  // 可以自选择不同的生成拼音方案和风格。
          }
        });

        console.log(sortedData)
        let tempCityData = {};
        let indexList = []
        for (let i = 0; i < sortedData.length; i++) {
          let cityDic = sortedData[i]
          let key = cityDic.firstLetter
          let arr = tempCityData[key];
          if (!arr) {
            arr = [];
          }
          arr.push(cityDic);
          tempCityData[key] = arr;
        }
        this.titleList = tempCityData

        for(let key in tempCityData) {
          indexList.push(key)
        }
        this.indexList = indexList
      }
    },
    watch: {
      videoName(val) {
        let titleList = []
        this.rechargeProList.forEach(item => {
          if (item.spuName.indexOf(val) > -1) {
            titleList.push(item)
          }
        })
        this.formCityData(titleList)
      }
    },
    components: {
      // AdPage
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../asset/recharge.styl"
  .video-index {
    background-color: #f8f8f8 !important
    /deep/ .van-index-bar__sidebar {
      right: 10px
      .van-index-bar__index {
        line-height 22px
      }
    }
  }
  .video-index-contsainer {
    padding: 11px 15px
    display: flex
    flex-direction column
    .main {
      flex-shrink 0
      .top {
        border-radius 6px
        height: 110px;
        overflow: hidden
        img {
          width: 100%
          height 100%
        }
      }
      .list {
        overflow hidden
        padding: 10px 0
        .item {
          float left
          width: 25%
          padding: 10px 0
          text-align center
          .content {
            .img {
              width: 65px
              height 65px; /*no*/
              margin: 0 auto
              border: 1px solid #eae7e7
              border-radius 6px
              img {
                vertical-align top
                width: 100%
                height: 100%
              }
            }
            .text {
              padding-top: 10px
              height 44px;
            }
          }
        }
      }
    }
    .tips {
      flex: 1
      overflow-y auto
      -webkit-overflow-scrolling touch
      .title {
        font-size 14px
        padding-bottom: 10px
      }
      .content {
        font-size 12px
        line-height 22px
        color: $color-text-d
      }
    }
  }
</style>
