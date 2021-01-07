
<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <ul class="card" v-if="authentication.length">
        <li class="cardList" v-for="(item,index) in authentication" :key="index" @click="cardListBtn(item)" >
          <div class="mark" :style="'background-image: url('+`static/image/vocational-certification/${imgBg(item.industryState)}.png`+')'">
            <span class="text">{{cardListType(item.industryState)}}</span>
          </div>
          <img class="item-img" :src="item.clusterImgUrl" alt />
          <p class="item-name">{{item.clusterName || item.categoryName}}</p>
        </li>
      </ul>
      <li v-if="authentication.length" style="text-align: center;margin: 10px 0; color: rgb(179, 175, 175)">暂无更多数据～</li>
      <!-- <span v-if="authentication.length" class="tip theme_font_gray">暂无更多数据～</span> -->
      <div class="no-list" v-if="!authentication.length">
        <div >
          <img src="static/image/mall2/no-data-img.png">
          <span class="tip theme_font_gray">{{funStatus ? '抱歉没有找到分类信息~' : '正在加载数据...'}}</span>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
import mixin from "./mixin";
export default {
  name: "home",
  mixins: [mixin],
  data() {
    return {
      hasMore: true,
      funStatus: false,
      authentication: []
    };
  },
  components: {},
  beforeRouteLeave(to, from, next) {
    if (to.path == "/industryCertification/home") {
      this.$keepaliveHelper.deleteCache(this);
    }
    next();
  }, 
  activated() {
    console.log(2,this.$route.query.lastPath)
    if (this.$route.query.lastPath ==  '/industryCertification/certificationStatus') {
      this.authentication = []
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(this.$route.query.categoryId)
      this.$request.post(this.industryClusterUrl, {categoryId: this.$route.query.categoryId }).then(res => {
        this.funStatus = true
        let data = res.data;
        if (res.status == 0) {
          this.authentication = data || []
        } else {
          this.$Toast(res.info)
        }
      })
    },
    backEvent() {
      this.$router.go(-1);
    },
    cardListBtn(item) {
      this.$router.push({
        path: "/industryCertification/certificationStatus",
        query: {
          id: item.id
        }
      })
    },
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .card {
    width: 100%;
    // height: 100%;
    padding: 0 5px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .cardList {
      height: 150px;
      width: calc(50% - 10px);
      float left
      margin 5px
      margin-bottom 0
      text-align: center;
      position: relative;
      border-radius: 6px;

      .item-img {
        width: 100%;
        height: 110px;
        display: block;
        border-radius: 6px;
      }

      .item-name {
        height: 40px;
        line-height: 40px;
        font-size 14px
      }

      .mark {
        height: 60px;
        width: 60px;
        position: absolute;
        top: 0;
        right: 0px;
        background: no-repeat center center;
        background-size: 100% 100%;

        >:first-child {
          color: #fff;
          display: block;
          margin-top: 13px;
          margin-left: 12px;
          transform: rotate(45deg);
        }
        .text {
          font-size 10px
          margin-top 14px
          margin-left 14px
        }
      }
    }
  }
  .no-list {
    height 60%
    width 100%
    display flex
    justify-content center
    align-items center
    flex-direction column
    img {
      width: 150px;
    }
    .tip {
      display block;
      margin-top: 10px;
      padding: 10px;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
