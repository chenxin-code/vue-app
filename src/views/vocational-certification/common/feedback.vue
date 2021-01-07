
<template>
  <div class="feedback">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="top">
        <img src="static/image/vocational-certification/icon8@2x.png" alt="">
        <span>审核未通过</span>
      </div>
      <div class="buttom">
        <p>审核未通过原因：</p>
        <span>{{text}}</span>
      </div>
    </nav-content>
     <div class="bottom-btns">
      <span @click="openingBtn">重新审核</span>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
export default {
  name: "feedback",
  mixins: [mixin],
  components: {},
  data() {
    return {
      text: ''
    };
  },
  mounted() {
    let obj = this.$route.query
    this.$request.post(this.findIdentifyClusterInfoUrl,{clusterId: obj.id}).then(res => {
      if (res.status == 0) {
       this.text = res.data.examineMsg || ''
      } else {
        this.$Toast(res.info)
      }
    })
  },
  methods: {
    backEvent() {
      this.$keepaliveHelper.deleteCache(this);
      this.$router.go(-1);
    },
    openingBtn() {
      this.$request.post('/app/json/user/industryRecertification', {}).then(res => {
        if (res.status == 0) {
          this.$router.push({
            path: "/vocational_certification/authentication",
            query: Object.assign(this.$route.query,{feedback: true})
          });
        } else {
          this.$Toast(res.info)
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.feedback{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color #f6f6f6 !important
  .top{
    height 160px
    width 100%
    margin 10px 0
    display flex
    flex-direction column
    justify-content center
    align-items center
    background-color #fff
    img{
      height 70px
      width 70px
    }
    span{
      font-size 16px
      margin-top 10px
    }
  }
  .buttom{
    width 100%
    padding 20px 10px
    background-color #fff
    p{
      font-size 16px
      margin-bottom 14px
    }
  }
  .bottom-btns {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 50px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 100%;
      height: 50px;
      color: #fff;
      font-size: 16px;
      display: inline-block;
      background-color: #f02e2c;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
