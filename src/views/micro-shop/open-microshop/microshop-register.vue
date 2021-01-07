<template>
  <div>
    <part1 v-if="status1"></part1>
    <part2 v-if="status2"></part2>
    <part3 v-if="status3"></part3>
    <part4 v-if="status4"></part4>
    <van-popup v-model="closeView" class="successBox" @click-overlay="returnUp">
      <img src="static/image/microShop/guan.png">
      <p>微店已关闭</p>
      <p>如有疑问请联系管理人员</p>
    </van-popup>
  </div>
</template>

<script>
  import part1 from "./openIndex"
  import part2 from "./myshopIndex"
  import part3 from "./renovation"
  import part4 from "../authentication/index"
  import {Toast} from 'vant'
  import {mapGetters} from "vuex";
  import store from "../../../vuex/store";
  import api from "./api"

  export default {
    name: "microshop-register",
    mixins: [api],
    data() {
      return {
        status1: false,//注册店铺
        status2: false,//我的店铺首页
        status3: false,//店铺装修
        status4: false,//实名认证页面
        status5: false,//我的微店首页
        closeView: false
      }
    },
    mounted() {
      if (this.$store.state.globalConfig.microshop_open == 1) {
        this.loadHN()
      } else {
        this.loadState()
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"]),
    },
    methods: {
      loadState() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
        }
        that.stateData(params).then(res => {
          if (res.data.result === 'success') {
            if (this.$store.state.globalConfig.microshop_open == 1) { //河南微店
              store.commit('putaggregate', res.data.data) //vuex的方法，更改数据
            } else {
              if (res.data.data.approvalState == 1) {
                if (res.data.data.state == 1) {  //0 关闭 1 打开
                  if (this.$store.state.globalConfig.auto_create_store_info == 1) { //vue_conf_auto_create_store_info，配置为1名称和简介只读
                    if (!res.data.data.pictureUrl || !res.data.data.backgroundImgUrl) {
                      that.status3 = true
                      that.status2 = false
                      that.status1 = false
                    } else {
                      that.status3 = false
                      that.status2 = true
                      that.status1 = false
                    }
                  } else {
                    if (!res.data.data.storeName || !res.data.data.storeProfile || !res.data.data.pictureUrl || !res.data.data.backgroundImgUrl) {
                      that.status3 = true
                      that.status2 = false
                      that.status1 = false
                    } else {
                      that.status3 = false
                      that.status2 = true
                      that.status1 = false
                    }
                  }

                } else if (res.data.data.state == 0) {
                  that.closeView = true
                }
                let stateObj = res.data.data
                store.commit('putaggregate', stateObj) //vuex的方法，更改数据
              } else {
                that.status1 = true
                that.status2 = false
              }
            }
          } else {
            Toast(res.data.info)
          }
        })
      },
      loadHN() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
        }
        that.stateDatahn(params).then(res => {
          if (res.data.status == 0) {
            let processObj = res.data.data || {}
            if (processObj.closeFlag == 1) { //是否已在后台关闭 1 是 0 否
              that.closeView = true
            } else {
              if (processObj.openFlag == 1) { //是否已开通微店 1 是 0 否
                that.loadState()
                that.status3 = false
                that.status2 = true
                that.status1 = false
              } else {
                if (processObj.certificationFlag == 1) { //certificationFlag实名认证是否通过 1 是 0 否
                  that.status4 = true
                } else {
                  that.status1 = true
                  that.status2 = false
                }
              }
            }
          } else {
            Toast(res.data.info)
          }
        })
      },
      returnUp() {
        this.$router.push({
          path: '/entrance'
        })
      },
    },
    components: {
      part1,
      part2,
      part3,
      part4
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .successBox {
    width: 80%;
    text-align: center;
    font-size: 0.426667rem;
    display: flex;
    flex-direction: column;
    padding: 40px 0;
    border-radius: 10px;

    img {
      width 120px;
      margin auto
    }

    p {
      margin auto
      margin-top 10px;
    }

    p:nth-child(3) {
      color: #7b7b7b;
      font-size: 14px;
    }
  }
</style>
