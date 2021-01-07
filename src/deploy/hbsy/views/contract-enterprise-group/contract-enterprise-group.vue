<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content v-if="isAllLoad">
      <img :src="clusterImgUrl" alt="" class="content-background" v-if="clusterImgUrl">
      <img src="./images/group-background.png" alt="" class="content-background" v-else>
      <div class="join-btn" @click="submitHandler">
        <img src="./images/submit-btn.png" alt="">
      </div>
      <p class="enter-child-id" @click="openEnterModal" v-if="$route.query.iscluster == 1">内部群组&gt;</p>
    </nav-content>
    <!-- 未开通油滴 -->
    <van-popup v-model="isShowOilPopup" class="has-meal-popup">
      <p class="content">检测到当前用户未开通油滴账户，需开通后方可加入群组</p>
      <div class="btn-container">
        <van-button
          color="#fff"
          class="cancel-btn"
          @click="isShowOilPopup = false"
          type="primary">我再想想</van-button>
        <van-button
          color="#F02C2D"
          class="confirm-btn"
          @click="toOpenOil"
          type="primary">前往开通</van-button>
      </div>
    </van-popup>
    <!-- 其他不能开通提示 -->
    <van-popup v-model="isShowErrorPopup" class="error-popup">
      <p class="title">温馨提示</p>
      <p class="prompt-text">{{ errorText }}</p>
      <van-button
        class="reset-btn"
        color="#fff"
        type="primary"
        @click="isShowErrorPopup = false">取消</van-button>
    </van-popup>
    <!-- 手动输入子群组编码 -->
    <van-popup v-model="isShowEnterModal" class="has-meal-popup" @close="closeEnterModal">
      <p class="title">加入提示</p>
      <van-field v-model="enterChildKey" label="子群组编码：" placeholder="请输入子群组编码" />
      <p class="sub-tip">温馨提示：加入内部群组，获得专享优惠</p>
      <div class="btn-container">
        <van-button
          color="#fff"
          class="cancel-btn"
          @click="isShowEnterModal = false"
          type="primary">算了吧</van-button>
        <van-button
          color="#F02C2D"
          class="confirm-btn"
          @click="confirmEntry"
          type="primary">确认加入</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowOilPopup: false,
      isShowErrorPopup: false,
      errorText: '',
      clusterImgUrl: '',
      isAllLoad: false,
      isShowEnterModal: false,
      enterChildKey: '',
    }
  },
  created() {
    this.initBackground()
  },
  mounted() {
  },
  methods: {
    initBackground() {
      this.$Loading.open()
      this.$http.post('/app/json/user_cluster/queryUserCluster', {
        uuidKey: this.$route.query.key
      }).then(res => {
        this.$Loading.close()
        this.isAllLoad = true
        let data = res.data
        if (data.status == 0) {
          this.clusterImgUrl = data.data.clusterImgUrl
        } else {

        }
      }).catch(err => {
        this.$Loading.close()
        this.isAllLoad = true
      })
    },
    submitHandler() {
      if (this.$store.state.login.token) {
        let requestUrl = ''
        let params = {}
        if (this.$route.query.iscluster == 1) {
          // 群组
          requestUrl = '/app/json/user_cluster/joinClusterByQrCode'
          params.uuidKey = this.$route.query.key
        } else if (this.$route.query.iscluster == 2) {
          // 子群组
          requestUrl = '/app/json/user_cluster/joinChildClusterByQrCode'
          params.clusterChildId = this.$route.query.key
        } else {
          this.$Toast('缺少必要参数 iscluster')
          return false
        }
        this.$Loading.open()
        this.$http.post(requestUrl, params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.$Toast('加入成功！')
            this.$router.replace({
              path: '/refueling-package'
            })
          } else if (data.errorCode == 1106) {
            // 未开通油滴
            this.isShowOilPopup = true
          } else {
            this.isShowErrorPopup = true
            this.errorText = data.info
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`joinClusterByQrCode err ${err}`)
        })
      } else {
        this.$util.toLogin()
      }
    },
    openEnterModal() {
      this.isShowEnterModal = true
    },
    confirmEntry() {
      if (this.enterChildKey) {
        this.$Loading.open()
        this.$http.post('/app/json/user_cluster/joinChildClusterByQrCode', {
          clusterChildId: this.enterChildKey,
          uuidKey: this.$route.query.key
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.$Toast('加入成功！')
            this.$router.replace({
              path: '/refueling-package'
            })
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`joinChildClusterByQrCode err ${err}`)
        })
      } else {
        this.$Toast('请输入子群组编码')
      }
    },
    toOpenOil() {
      window.location.href = '/app-vue/oildrop'
    },
    closeEnterModal() {
      this.enterChildKey = ''
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    // .nav-content {
    //   background url('./images/group-background.png') no-repeat center;
    //   background-size 100% 100%;
    // }
    .content-background {
      display block;
      width 100%;
      height 100%;
    }
    .join-btn {
      position absolute;
      bottom 40px;
      left 15px;
      right 15px;
      z-index 2
      img {
        display block;
        width 100%;
      }
    }
    .enter-child-id {
      font-size 14px;
      line-height 18px;
      color #fff;
      position absolute;
      bottom 15px;
      left 0;
      right 0;
      text-align center;
      font-weight 500;
    }
    .has-meal-popup {
      width 280px;
      border-radius 6px;
      .title {
        font-size 18px;
        font-weight 500;
        text-align center;
        line-height 20px;
        padding 15px 0 8px;
      }
      .sub-tip {
        padding 10px 16px;
        font-size 13px;
        line-height 16px;
        color #333;
      }
      .content {
        font-size 13px;
        color #333;
        line-height 22px;
        padding 46px 49px 0;
        text-align center;
      }
      .btn-container {
        display flex;
        // box-shadow 0 0 10px #ddd;
        bdr-t();
        margin-top 25px;
        .confirm-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #fff;
          }
        }
        .cancel-btn {
          flex 1;
          .van-button__text {
            font-size 15px;
            color #333;
          }
        }
      }
    }
    .error-popup {
      width 280px;
      border-radius 6px;
      .title {
        font-size 15px;
        font-weight 500;
        color #333;
        margin-top 21px;
        text-align center;
      }
      .prompt-text {
        font-size 13px;
        line-height 22px;
        margin-top 15px;
        margin-bottom 25px;
        padding 0 16px;
        text-align center;
      }
      .reset-btn {
        width 100%;
        // box-shadow 0 0 10px rgba(0, 0, 0, .1)
        bdr-t()
        .van-button__text {
          font-size 15px;
          color #333;
        }
      }
    }
  }
</style>