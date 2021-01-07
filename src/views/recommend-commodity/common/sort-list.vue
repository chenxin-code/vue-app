<template>
  <div class="sortList">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="titer">
        <p>共有商品 <span style="color: #f80f16">{{recommendationSku.skuList.length}}</span> 个</p>
        <p @click="complete" style="color: #f80f16">完成</p>
      </div>
      <ul class="sku_Ul">
        <draggable ghost-class="ghost" handle=".handle" :animation='200' :list="recommendationSku.skuList">
          <li v-for="(item, index) in recommendationSku.skuList" :key="index">
            <span v-html="item.skuName"></span>
              <van-icon size='16' class="handle" name="exchange" />
          </li>
        </draggable>
        <div class="more" v-if="recommendationSku.skuList.length">
          <span>暂无更多数据～</span>
        </div>
      </ul>
    </nav-content>
     <van-popup v-model="shareView" class="stateBox" @click-overlay='clickOverlay'>
      <img src="../img/jiantou@2x.png" alt="">
      <p>长按箭头拖拽排序</p>
    </van-popup>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import {mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "sortList",
  data() {
    return {
      shareView: false
    };
  },
  components: {
    draggable
  },
  computed: {
    ...mapState(["recommendationSku"]),
  },
  mounted() {
    let getDragSort = sessionStorage.getItem('dragSort')
    if (!getDragSort) {
      this.shareView = true
    }
  },
  methods: {
    ...mapMutations(['setRecommendationSku']),
    complete() {
      this.$router.go(-1)
    },
    clickOverlay() {
      sessionStorage.setItem("dragSort", true);
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.handle {
  transform: rotate(90deg);
}
/deep/ .nav-content{
  // background-color #f6f6f6
}
.sortList {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .titer {
    padding 12px
    background-color #f6f6f6
    display flex
    justify-content space-between
  }
  .sku_Ul {
    height calc(100% - 50px); 
    overflow-y auto
    li {
      // background-color #fff
      border 1px solid #ccc
      border-radius 6px;
      margin 10px
      padding 12px 10px
      display flex
      justify-content space-between
      align-items center
      span {
        width 86%
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    }
    .more {
      text-align center
      color #9e9d9d
    }
  }
}
  >>> .stateBox {
    z-index: 2001;
    /*height: 180px;*/
    /*line-height: 180px;*/
    width: 100%;
    height 200px
    text-align: center;
    font-size: 16px;
    color white;
    top 260px;

    img {
      width 80px;
      margin 0 0 10px 260px;
    }
  }

  >>> .van-popup {
    background transparent;
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
</style>
