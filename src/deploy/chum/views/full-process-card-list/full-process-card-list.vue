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
        v-model="activeTab"
        @change="changeTab">
        <van-tab
          v-for="(value, key) in processCardData"
          :key="key"
          :title="key == 'useList' ? '已使用' : '未使用'">
          <div class="scroll-container" :ref="'scrollContainer' + key">
            <ul class="card-container">
              <li
                v-for="(item, index) in value"
                :key="index"
                class="item"
                @click="cardClick(item)">
                <img :src="item.backgroundPic" alt="" class="card-icon">
                <div class="content">
                  <p class="card-name">{{ item.equityCardName }}</p>
                  <p class="valid-period" v-if="key == 'unUseList'">有效时长：{{ dealwithValidTime(item.invalidTime) }}</p>
                  <p class="valid-period" v-else>有效期：{{ item.receiveTime + '至' + item.invalidTime }}</p>
                </div>
                <van-icon name="arrow" class="icon-right" v-if="key == 'unUseList'"/>
                <div v-else>
                  <img src="../../assets/images/icon-used.png" alt="" class="icon-used" v-if="item.equityCardState != 4">
                  <img src="../../assets/images/icon-expired.png" alt="" class="icon-used" v-else>
                </div>
              </li>
            </ul>
          </div>
        </van-tab>
      </van-tabs>
    </nav-content>
	</div>
</template>
<script>
  import utils from '../../assets/utils/tools'
  import moment from 'moment'
	export default {
		mixins: [utils],
		components: {},
		data() {
			return {
        activeTab: 0,
        processCardData: {
          unUseList: [],
          useList: []
        },
        scrollPosition: 0,
        scrollPosition2: 0,
			}
    },
    activated() {
      for (let key in this.processCardData) {
        if (this.$refs['scrollContainer' + key]) {
          if (key == 'unUseList') {
            this.$refs['scrollContainer' + key][0].scrollTop = this.scrollPosition
          } else {
            this.$refs['scrollContainer' + key][0].scrollTop = this.scrollPosition2
          }
        }
      }
    },
		mounted() {
      this.initCardList()

      this.$nextTick(() => {
        for (let key in this.processCardData) {
          if (this.$refs['scrollContainer' + key]) {
            this.$refs['scrollContainer' + key][0].addEventListener('scroll', (e) => {
              if (key == 'unUseList') {
                this.scrollPosition = this.$refs['scrollContainer' + key][0].scrollTop
              } else {
                this.scrollPosition2 = this.$refs['scrollContainer' + key][0].scrollTop
              }
            })
          }
        }
      })
    },
		methods: {
      initCardList() {
        this.$Loading.open()
        this.$http.post('/app/json/app_equity_card/wholeProcessCard', {}).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.processCardData.unUseList = data.data.unUseList || []
            this.processCardData.useList = data.data.useList || []
          } else {
            this.$Message.error(`wholeProcessCard err ${err}`)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Message.error(`wholeProcessCard err ${err}`)
        })
      },
      dealwithValidTime(endTime) {
        let tempDuration = moment(endTime).diff(moment())
        if (tempDuration) {
          return `${moment.duration(tempDuration).get('h')}小时${moment.duration(tempDuration).get('m')}分钟${moment.duration(tempDuration).get('s')}秒`
        } else {
          return '-'
        }
      },
      cardClick(item) {
        if (this.activeTab == 0) {
          this.$router.push({
            path: '/interest_card_list',
            query: {
              equityCardMemberId: item.id
            }
          })
        }
      },
      changeTab() {
        this.$nextTick(() => {
          for (let key in this.processCardData) {
            if (this.$refs['scrollContainer' + key]) {
              this.$refs['scrollContainer' + key][0].addEventListener('scroll', (e) => {
                if (key == 'unUseList') {
                  this.scrollPosition = this.$refs['scrollContainer' + key][0].scrollTop
                } else {
                  this.scrollPosition2 = this.$refs['scrollContainer' + key][0].scrollTop
                }
              })
            }
          }
        })
      }
    },
    beforeRouteLeave(to, from, next) {
			if (to.path != '/interest_card_list') {
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
.container {
  .reset-tabs {
    height 100%;
    display flex;
    flex-direction column;
    /deep/ .van-tabs__content {
      margin-top 5px;
      flex 1;
      overflow-y hidden;
      .van-tab__pane {
        height 100%;
      }
    }
    /deep/ .van-tabs__wrap {
      height 32px;
      .van-tab__text {
        font-size 15px;
        font-weight 500;
      }
    }
    .scroll-container {
      height 100%;
      overflow-y auto;
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
        align-items center;
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
        .icon-right {
          font-size 15px;
          color #a1a1a1;
        }
        .icon-used {
          display block;
          width 50px;
        }
      }
    }
  }
}

</style>