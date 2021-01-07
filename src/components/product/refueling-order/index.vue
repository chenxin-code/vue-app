<template>
  <div>
    <div class="nav">
      <div class="header">
        <div class="user-info">
          <div class="user-header-img">
            <img v-if="headImg" :src="headImg" class="user-logo" />
            <img v-else width="100%" src="./images/user-logo.png" />
          </div>
          <div class="user-info-right">
            <div class="user-name">
              {{
                $store.state.userInfo.nickName
                  ? $store.state.userInfo.nickName
                  : $store.state.userInfo.userName
              }}
            </div>
          </div>
        </div>
        <div class="account">
          <div class="unit br" @click='toPayList'>
            <h3>主账户余额（元）</h3>
            <span>{{ userInfoData.balance || 0 }}</span>
          </div>
          <div class="unit" @click='toCouponList'>
            <h3>优惠券（张）</h3>
            <span>{{ userInfoData.couponCount || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="search-list"
        style="margin-top: 30px"
      >
        <template v-if="list.length">
          <info style='margin: 10px 0;' v-for="(item, index) in list" :key="index" :item="item"></info>
        </template>
      </van-list>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import info from './components/info'
export default {
  components:{
    info
  },
  data() {
    return {
      userInfoData: {},
      userInfo: {},
      couponListAmount: 0,
      list: [],
      page: 0,
      rows: 10,
      loading: false,
      finished: false
    };
  },
  methods: {
    getPayInfo() {
      this.$http
        .post("/app/json/company_user_app/getCompanyUserDetail")
        .then((res) => {
          let data = res.data;
          console.log(data,'data')
          if(data.status == 0) {
            this.userInfoData = data.data;
          } else {
            this.$toast(res.info)
          }
        });
    },
    getList() {
      this.page++;
      let obj = {
        page: this.page,
        rows: this.rows,
        makeEndTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };
      this.$http
        .post("/app/jqGrid/company_user_app/getUserRefuelOrder", obj)
        .then((res) => {
          let data = res.data;
          this.loading = false;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.list.push(...data.data);
              if (this.list.length >= data.records) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.$toast(res.info);
            this.finished = true;
          }
        });
    },
    onLoad() {
      this.getList()
      this.getPayInfo()
    },
    toCouponList() {
      this.$router.push("/coupon_list")
    },
    toPayList() {
      this.$router.push("/refueling_detail")
    }
  },
  computed: {
    headImg() {
      return this.$store.state.userInfo.avtUrl;
    },
  }
};
</script>

<style lang="stylus" scoped>
.nav {
  padding: 10px;
  color: #fff;
  background: url('./images/bg1.png') no-repeat;
  background-size: 100% 100%;

  .header {
    padding: 20px 10px 40px;
    display: flex;
    justify-content: flex-start;
    position: relative;

    .avatar {
      width: 60px;
      flex: 1;
    }

    .content {
      padding-left: 5px;
      flex: 2;

      .sub-title {
        font-size: 18px;
        line-height: 60px;
      }
    }

    .account {
      width: 90%;
      padding: 10px 0;
      background: #fff;
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      display: flex;
      color: #000;
      text-align: center;

      .br {
        border-right: 0.5px solid #A1A1A1;
      }

      .unit {
        flex: 1;
        line-height: 20px;

        h3 {
          color: #A1A1A1;
        }

        span {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }
}

.user-info {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  z-index: 2;

  .user-header-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    line-height: 70px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .user-info-right {
    flex: 1;
    padding: 0px 10px;

    .user-name {
      font-size: 16px;
      font-weight: 500;
    }
  }
}
.content{
  margin-top: 30px;
  padding: 10px;
  height: calc(100% - 210px);
  overflow-y: auto;
}
</style>