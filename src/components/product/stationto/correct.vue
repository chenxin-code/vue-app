<template>
  <div>
    <nav-top @backEvent="$router.back()"></nav-top>
    <nav-content>
      <div class="correct-container">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <img class="left logo" :src="logo" alt="">
              <div class="center content">
                <div class="title">{{detail.stationName}}</div>
                <div class="address">{{detail.address}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-view">
          <van-cell title="当前位置是否是油站"></van-cell>
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell title="是" clickable @click="radio = '1'">
                <van-radio checked-color="#f02c2d" class="radio" slot="icon" name="1"/>
              </van-cell>
              <van-cell title="否" clickable @click="radio = '2'">
                <van-radio checked-color="#f02c2d" class="radio" slot="icon" name="2"/>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="table-view">
          <van-cell title="备注"></van-cell>
          <van-field
            v-model="message"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="请输入留言"
            show-word-limit
          />
        </div>
        <van-button class="btn" color="#f02c2d" block type="default" :loading="false" @click="submit">提交</van-button>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'correct',
    data() {
      return {
        logo: require('@/assets/refuel/logo.png'),
        detail: {},
        radio: '1',
        message: ''
      }
    },
    created() {
      if (this.$store.state.globalConfig.logo && this.$store.state.globalConfig.logo != '*') {
        this.cellLogo = this.$store.state.globalConfig.logo;
      }
      if (this.$store.state.refuelStationDetail) {
        this.detail = this.$store.state.refuelStationDetail
      }
    },
    mounted() {
    },
    methods: {
      submit() {
        let params = {
          stationCode: this.detail.stationCode, // (油站编码)
          isStationPos: this.radio, // (当前位置是否是油站 1是，0否)
          userFeedback: this.message, // (备注)
          posxAfter: this.$store.state.currentLocation.posx, // (经度)
          posyAfter: this.$store.state.currentLocation.posy // (纬度)
        }
        this.$request.post('/app/json/station/saveUserStationCorrection', params).then(res => {
          if (res.status === 0) {
            this.$dialog.alert({
              title: '温馨提示',
              message: '感谢您的反馈，若您的纠正反馈被我们采纳，系统将自动会发方我们为您精心准备的小礼品至您的账号'
            }).then(() => {
              this.$router.back()
            })
          } else {
            this.$toast(res.info)

          }
        })
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .correct-container {
    padding 10px;

    .table-view {
      border-radius 5px
      box-shadow 0 1px 5px #eaeaea;

      .logo {
        width 40px;
      }

      .tit {
        padding: 11px 15px
      }

      .radio {
        margin-right: 5px;
      }

      .content {
        .title {
          font-size: 16px;
        }

        .address {
          font-size: 12px;
          padding-top: 6px;
          color gray
        }
      }
    }

    .btn {
      margin-top: 15px;
    }
  }
</style>
