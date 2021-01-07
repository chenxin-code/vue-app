<template>
  <div>
    <van-popup
      class="protocol-modal"
      v-model="isShowProModal"
      position="bottom"
      :close-on-click-overlay="false">
      <p class="title">{{ protocolData.title }}</p>
      <div class="content" v-html="protocolData.content"></div>
      <div class="btm-btn">
        <van-button class="btn" round type="default" @click="disagreeHandler">不同意</van-button>
        <van-button class="btn" round
                    color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
                    type="info" @click="agreeHandler">同意
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "member-protocol",
    model: {
      prop: 'isShowProModal',
      event: 'change'
    },
    props: {
      isShowProModal: Boolean
    },
    data() {
      return {
        protocolData: {
          title: '',
          content: '',
        }
      }
    },
    mounted() {
      this.initProtocol()
    },
    methods: {
      initProtocol() {
        this.$http.post('/app/json/news/getNewsList?values=55').then(res => {
          let data = res.data
          if (data.status == 0) {
            this.protocolData = data.data[0] || {};
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Toast(`getNewsList err ${err}`)
        })
      },
      agreeHandler() {
        this.$emit('change', false)
        this.$emit('getProtocolResult', true)
      },
      disagreeHandler() {
        this.$emit('change', false)
        this.$emit('getProtocolResult', false)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .protocol-modal {
    padding 0 20px;

    .title {
      font-size 16px;
      font-weight 600;
      text-align center;
      padding 19px 0;
      bdr-b();
    }

    .content {
      max-height 350px;
      min-height 200px;
      overflow-y auto;
      margin 10px 0;
    }

    .btm-btn {
      display flex;
      margin-bottom 10px;

      .btn {
        height 49px;
        line-height 49px;
        width 45%;
        margin 0 auto;

        .van-button__text {
          font-size 18px
          font-weight 700;
          color #C9A063
        }
      }
    }
  }
</style>
