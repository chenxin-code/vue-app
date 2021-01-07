<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" v-if="hasNavTop" :noBack="noBack"></nav-top>
    <nav-content class="container" :style="{top: computedTop() + 'px'}">
      <van-tabs
        color="#C9A063"
        title-active-color="#C9A063"
        v-model="activeTab"
        @click="changeTabs">
        <van-tab title="未激活"></van-tab>
        <van-tab title="生效中"></van-tab>
        <van-tab title="已赠送"></van-tab>
        <van-tab title="已过期"></van-tab>
      </van-tabs>
      <div class="exchange-container" v-if="activeTab == 0">
        <input class="enter-input" type="text" placeholder="请输入兑换码领取会员卡" v-model="dynamicCode">
        <van-button
          class="exchange-btn"
          type="primary"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="exchangeHandler">领取
        </van-button>
      </div>
      <div class="card-list" ref="cardList" :style="{top: activeTab == 0 ? `${112}px` : `${45}px`}">
        <van-list
          v-model="isLoading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="200"
          @load="loadMore">
          <ul class="card-c" v-if="cardList.length !== 0">
            <li
              v-for="(item, index) in cardList"
              :key="index"
              class="item">
              <PublicCard :cardData="item" @resultHandler="cardFeatures"></PublicCard>
            </li>
          </ul>
        </van-list>
      </div>
    </nav-content>
    <!-- 协议 -->
    <MemberProtocol v-model="isShowProModal" @getProtocolResult="getProtocolResult"></MemberProtocol>
  </div>
</template>

<script>
  import cookie from 'js-cookie'
  import PublicCard from './components/public-card.vue'
  import MemberProtocol from './components/member-protocol.vue'
  import {Dialog} from 'vant';

  export default {
    data() {
      return {
        hasNavTop: false,
        noBack: false,
        activeTab: 0,
        tempActiveTab: 0,
        dynamicCode: '',
        isLoading: true,
        finished: false,
        cardList: [],
        isShowProModal: false,
        pageInfo: {
          page: 0,
          rows: 10
        },
        cardId: '', // 激活卡使用
        scrollPosition: 0,
      }
    },
    activated() {
      this.$refs.cardList.scrollTop = this.scrollPosition
    },
    mounted() {
      if (this.$route.query.noBack) {
				this.noBack = true
			}
      if (this.$route.query.hasNavTop == 1) {
        this.hasNavTop = true;
      }
      if (this.$route.query.entryTab !== undefined) {
        this.activeTab = Number(this.$route.query.entryTab);
      }
      this.loadMore();

      this.$nextTick(() => {
        this.$refs.cardList.addEventListener('scroll', (e) => {
          this.scrollPosition = this.$refs.cardList.scrollTop
        })
      })
    },
    components: {
      PublicCard,
      MemberProtocol,
    },
    computed: {
      isNativeTop() {
        return cookie.get('isnativetop') != 1
      },
      top() {
        return this.isNativeTop ? this.$store.state.barHeight + this.$market.getNavHeight() : 0
      }
    },
    methods: {
      computedTop() {
        if (this.hasNavTop) {
          return this.top;
        } else {
          return 0
        }
      },
      // tab切换
      changeTabs(name) {
        if (this.tempActiveTab != name) {
          this.pageInfo = {
            page: 0,
            rows: 10
          }
          this.cardList = []
          this.isLoading = true
          this.finished = false
          this.activeTab = name
          this.tempActiveTab = name
          this.loadMore()
        }
      },
      // 领取点击
      exchangeHandler() {
        if (this.dynamicCode) {
          // 是否完善了个人信息
          this.$Loading.open()
          this.$http.post('/app/json/user/getUserCertificateList', {
            cateType: 0
          }).then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              if (data.data) { // 完善了信息
                this.receivesCard()
              } else { // 未完善信息
                this.$router.push({
                  path: '/perfect_information',
                  query: {
                    cardId: data.id
                  }
                })
              }
            } else {
              this.$Toast(data.info)
            }
          }).catch(err => {
            this.$Loading.close()
            this.$Toast(`getUserCertificateList err ${err}`)
          })
        }
      },
      // 验证身份后领取企业卡
      receivesCard() {
        this.$http.post('/app/json/equity_card/receiveBusinessCard', {
          dynamicCode: this.dynamicCode
        }).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.$Toast('领取成功！')
            this.dynamicCode = ''
            this.pageInfo = {
              page: 0,
              rows: 10
            }
            this.cardList = []
            this.isLoading = true
            this.finished = false
            this.loadMore()
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Toast(`receiveBusinessCard err ${err}`)
        })
      },
      loadMore() {
        this.isLoading = true;
        this.pageInfo.page++;
        this.$Loading.open();
        let params = {
          equityCardState: this.activeTab,
          ...this.pageInfo
        }
        if (this.activeTab == 3) {
          params.equityCardState = 4
        }
        this.$http.post('/app/jqGrid/equity_card/myCardBag', params).then(res => {
          this.isLoading = false;
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.cardList.push(...data.data)
              if (this.cardList.length >= data.totalRecords) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
            this.$Toast(data.info);
          }
          this.$Loading.close();
        }).catch(err => {
          this.$Toast(`myCardBag err ${err}`);
          this.$Loading.close();
        })
      },
      // 同意协议
      getProtocolResult(result) {
        if (result) {
          this.toActivationCard()
        }
      },
      // 激活
      toActivationCard() {
        this.$Loading.open()
        this.$http.post('/app/json/equity_card/activationCard', {
          id: this.cardId
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.pageInfo = {
              page: 0,
              rows: 10
            }
            this.cardList = [];
            this.isLoading = true
            this.finished = false
            this.loadMore()
            Dialog.alert({
              title: '提示',
              message: '激活成功！',
            }).then(() => {

            });
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`activationCard err ${err}`)
        })
      },
      // 权益卡功能按钮点击
      cardFeatures(type, data) {
        // type 1 赠送 2 激活 3 去使用 4 取消赠送 5 查看链接
        if (type == 1) {
          // userId和equityCardId在更改卡状态一键领取的时候使用 cardId在查询卡详情中使用
          this.$router.push({
            path: '/verify_sms',
            query: {
              equityCardName: data.equityCardName,
              backgroundPic: data.backgroundPic,
              userId: data.userId,
              equityCardId: data.equityCardId,
              cardId: data.id,
            }
          })
        } else if (type == 2) {
          // 是否完善了个人信息
          this.$Loading.open()
          this.$http.post('/app/json/user/getUserCertificateList', {
            cateType: 0
          }).then(res => {
            this.$Loading.close()
            let tempData = res.data
            if (tempData.status == 0) {
              if (tempData.data) { // 完善了信息
                this.isShowProModal = true
                this.cardId = data.id
              } else { // 未完善信息
                this.$router.push({
                  path: '/perfect_information',
                  query: {
                    cardId: data.id
                  }
                })
              }
            } else {
              this.$Toast(tempData.info)
            }
          }).catch(err => {
            this.$Loading.close()
            this.$Toast(`getUserCertificateList err ${err}`)
          })
        } else if (type == 3) {
          if (data.receiveType == 5) {
            // 全流程卡
            this.$router.push({
              path: '/interest_card_list',
              query: {
                equityCardMemberId: data.id
              }
            })
          } else {
            let tempEntryType = 0
            this.$router.push({
              path: '/my_interests',
              query: {
                entryType: tempEntryType,
                equityCardName: data.equityCardName,
                equityCardId: data.id
              }
            })
          }
        } else if (type == 4) {
          Dialog.confirm({
            title: '提示',
            message: '确定取消赠送么？',
          })
            .then(() => {
              this.$Loading.open()
              this.$http.post('/app/json/equity_card/updateEquityCardState', {
                equityCardState: 0,
                id: data.id
              }).then(res => {
                this.$Loading.close()
                let data = res.data
                if (data.status == 0) {
                  Dialog.alert({
                    title: '说明',
                    message: '取消赠送成功！',
                  }).then(() => {
                    this.cardList = [];
                    this.isLoading = true
                    this.finished = false
                    this.loadMore()
                  });
                } else {
                  Dialog.alert({
                    title: '说明',
                    message: data.info,
                  }).then(() => {

                  });
                }
              }).catch(err => {
                this.$Loading.close()
                this.$Toast(`giveEquityCard err ${err}`)
              })
            })
            .catch(() => {
              // on cancel
            });
        } else if (type == 5) {
          this.$router.push({
            path: '/presentation_card',
            query: {
              equityCardName: data.equityCardName,
              backgroundPic: data.backgroundPic,
              userId: data.userId,
              equityCardId: data.equityCardId,
              cardId: data.id,
            }
          })
        }
      }
    },
    beforeRouteLeave(to, from, next) {
			if (
        to.path != '/verify_sms' &&
        to.path != '/perfect_information' &&
        to.path != '/my_interests' &&
        to.path != '/interest_card_list' &&
        to.path != '/presentation_card' &&
        to.path != '/perfect_information'
      ) {
				this.$keepaliveHelper.deleteCache(this)
			}
			next()
		},
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .exchange-container {
    margin 20px 20px 0;
    display flex;

    .enter-input {
      flex 1;
      border 1px solid #ddd;
      border-right none;
      border-radius 5px 0 0 5px;
      font-size 16px;
      padding-left 15px;
      -webkit-appearance: none;
    }

    .exchange-btn {
      border-radius 0 5px 5px 0;
      padding 0 24px;

      .van-button__text {
        font-size 15px;
        color #E0C28A
        font-weight 500
      }
    }
  }

  .card-list {
    position absolute;
    left 0
    right 0
    bottom 0;
    padding 0 10px;
    height auto;
    overflow-y: auto;

    .card-c {
      overflow hidden;
      padding 5px;

      .item {
        margin-top 10px;

        &:first-child {
          margin-top 0;
        }
      }
    }
  }
</style>
