<template>
	<div>
		<nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <van-tabs
        :border="false"
        :line-width="45"
        :line-height="2"
        class="reset-tabs"
        color="#c9a063"
        title-active-color="#c9a063"
        v-model="activeTab">
        <van-tab
          v-for="(value, key) in processCardData"
          :key="key"
          :title="key == 'unUseList' ? '未核销' : '已核销'">
          <ul class="card-container" v-if="value.length > 0">
            <li
              v-for="(item, index) in value"
              :key="index"
              class="item"
              @click.stop="cardClick(item)">
              <div class="top-info">
                <img :src="item.equityPic" alt="" class="card-icon">
                <div class="content">
                  <p class="card-name">{{ item.equityName }}</p>
                  <!-- <p class="valid-period" v-if="key == 'unUseList'">时间：{{ dealwithValidTime(item) }}</p> -->
                </div>
                <div v-if="key == 'unUseList'" class="right-info">
                  <div class="arrow-content">
                    <span>去使用</span>
                    <van-icon name="arrow" class="icon-right"/>
                  </div>
                  <div class="details-button" @click.stop="unfoldDesc(item)">展开详情</div>
                </div>
                <img src="../../assets/images/icon-used.png" alt="" class="icon-used" v-else>
              </div>
              <div
                v-if="key == 'unUseList' && item.isUnfold"
                class="desc-info"
                v-html="item.instructions"></div>
            </li>
          </ul>
          <p class="no-result" v-else>暂无数据~</p>
        </van-tab>
      </van-tabs>
    </nav-content>
	</div>
</template>
<script>
  import utils from '../../assets/utils/tools'
  import moment from 'moment'
import { install } from 'vant'
	export default {
		mixins: [utils],
		components: {},
		data() {
			return {
        activeTab: 0,
        processCardData: {
          unUseList: [],
          useList: []
        }
			}
		},
		mounted() {
      if (this.$route.query.equityCardMemberId) {
        this.initInterestList()
      }
    },
		methods: {
      initInterestList() {
        this.$Loading.open()
        this.$http.post('/app/json/app_equity_card/wholeProcessEquity', {
          equityCardMemberId: this.$route.query.equityCardMemberId
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (data.data.unUseList instanceof Array && data.data.unUseList.length > 0) {
              data.data.unUseList.forEach(item => {
                item.isUnfold = false
              })
            }
            this.processCardData.unUseList = data.data.unUseList || []
            this.processCardData.useList = data.data.useList || []
          } else {
            this.$Message.error(`wholeProcessEquity err ${err}`)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Message.error(`wholeProcessEquity err ${err}`)
        })
      },
      dealwithValidTime(item) {
        if (item.validityType == 1) {
          return '无限制'
        } else {
          return `${moment(item.equityStartTime).format('HH:mm')}-${moment(item.equityEndTime).format('HH:mm')}`
        }
      },
      cardClick(item) {
        this.$Loading.open()
        if (this.activeTab == 0) {
          this.$http.post("/app/json/app_equity_card/equityCodeInfo", {
            mchCode: item.mchCode,
            equityMemberId: item.id
          }).then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.useCode(res.data.data, item.mchCode)
            } else {
              this.$Toast(data.info)
            }
          }).catch((err) => {
            this.$Loading.close()
            this.$Toast(err)
          })
        }
      },
      unfoldDesc(item) {
        item.isUnfold = !item.isUnfold
      },
      useCode(item, mchCode){
        this.$router.push({
          path: '/benefits/benefitsCode',
          query: {
           item: JSON.stringify(item),
           mchCode
          }
        })
      }
    },
    beforeRouteLeave(to, from, next) {
			if (to.path != '/benefits/benefitsCode') {
				this.$keepaliveHelper.deleteCache(this)
			}
			next()
		},
	}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.no-result {
  font-size 13px;
  text-align center;
  padding 40px 0;
  color #5d5c5c;
}
.container {
  .reset-tabs {
    height 100%;
    display flex;
    flex-direction column;
    /deep/ .van-tabs__content {
      margin-top 5px;
      flex 1;
      overflow-y auto;
    }
    /deep/ .van-tabs__wrap {
      height 32px;
      .van-tab__text {
        font-size 15px;
        font-weight 500;
      }
    }
    .card-container {
      padding 0 15px;
      margin-bottom 10px;
      .item {
        padding 20px 10px;
        border-radius 10px;
        box-shadow 0 0 10px #ddd;
        margin-top 10px;
        display flex;
        flex-direction column;
        position relative;
        .top-info {
          display flex;
          align-items center;
        }
        .card-icon {
          display inline-block;
          width 75px;
        }
        .content {
          flex 1
          padding 0 10px;
          .card-name {
            font-size 15px;
            font-weight 500;
          }
          .valid-period {
            font-size 12px;
            line-height 15px;
            color #a1a1a1;
            margin-top 25px;
          }
        }
        .right-info {
          .arrow-content {
            font-size 13px;
            display flex;
            align-items center;
            .icon-right {
              font-size 15px;
              color #a1a1a1;
            }
          }

          .details-button {
            margin-top 15px;
            font-size 13px;
            color #f44948;
            extend-click()
          }
        }
        .icon-used {
          display block;
          width 50px;
        }

        .desc-info {
          padding-top 10px;
          transition all .2s;
          /deep/ img {
            width 100%;
          }
        }
      }
    }
  }
}

</style>