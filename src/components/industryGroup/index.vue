<template>
  <div class="box">
    <van-popup v-model="showView" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <div class="content">
          <div v-html="getIndustryImportMsg"></div>
        </div>
      </div>
      <div class="popupCardBtn">
        <span @click="toSee">去查看</span>
        <span @click="showView = false">关闭</span>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "industryGroup",
  data() {
    return {
      showView: false,
      getIndustryArr: [],
      getIndustryImportMsg: ''
    }
  },
  computed: {
    ...mapState(["globalConfig"])
  },
  mounted() {
    if (this.$store.state.login.token == '') {
      return ;
    }
    let text = (this.globalConfig.get_industry_msg || '管理员已经将您设置成{}群组成员，您可以在职业群组中查看').split('{}')
    this.$nextTick(() => {
      let params = {
        token: this.$store.state.login.token
      };
      this.$http.post('/app/json/user/getIndustryImportMsg', params).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.getIndustryArr = data.data || []
          if (this.getIndustryArr.length) {
            let htmlStr = ''
            this.getIndustryArr.forEach(res=>{
              htmlStr = `${htmlStr}<span style="color:red">${res.clusterName}${this.getIndustryArr.length - 1 == index ? ' ' : ', '}</span>`
            })
            this.getIndustryImportMsg = `${text[0]}${htmlStr}${text[1]}`
            this.showView = true
          }
        }
      })
    })
  },
  methods: {
    toSee() {
      if (this.getIndustryArr.length == 1) {
        this.$router.push({
          path: '/industryCertification/certificationStatus',
          query: {
            id: this.getIndustryArr[0].clusterId
          }
        })
      } else {
        this.$router.push({
          path: '/industryCertification/home'
        })
      }
      this.showView = false
    }
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.box {
  font-size: 20px;
  /deep/ .van-popup {
    width: 76%;
    font-size: 14px;
    color: #8c8c8c;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popupCard {
    height: 160px;
    flex-direction: column;
    line-height: 26px;

    .popupCardText {
      height 110px
      padding 14px 20px
      .content {
        overflow-y auto
        height 100%
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }

    .popupCardBtn {
      width: 100%;
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;
      font-size 14px
      border-top 0.5px solid #e0e0e0

      span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      >:first-child {
        color blue;
        border-right 0.5px solid #e0e0e0
      }
    }
  }
}
</style>
