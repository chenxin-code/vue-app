<template>
  <div class="classification-item" @click="onTravelDetail(item)">
    <div class="item-media">
      <img :src="item.pcMainUrl" alt="" />
    </div>
    <div class="item-content">
      <div class="item-head">
        <div class="item-title">
          {{ item.spuName }}
        </div>
        <div class="item-spu-title">
          {{ item.spuShortName }}
        </div>
        <!-- <div class="item-tag" v-if="tagList && tagList.length > 0">
          <span class="tag" v-for="(item, index) in tagList" :key="index">
            {{ item }}
          </span>
        </div> -->
      </div>
      <div class="item-aipay">
        <div class="item-price">
          <span class="money">
            {{ item.salePrice }}
          </span>
        </div>
        <div class="item-btn">
          <a href="javascript:;" class="link-btn link-pay">
            <span>查看详情</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "keephouse-item-component",
  components: {
    // Home
  },
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    //标签列表
    tagList() {
      const itemClassName = this.item.proMerCategoryName;
      return this.$util.getTagList(itemClassName) || null;
    }
  },
  created() {},
  methods: {
    //跳转售后详情
    onTravelDetail() {
      this.$emit("onTravelDetail", this.item);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@assets/css/theme.less");

.classification-item {
  margin: 12px 12px 0 12px;
  padding: 16px;
  background-color: #fff;
  display: flex;
  border-radius: 8px;
  .item-media {
    img {
      display: block;
      width: 90px;
      height: 90px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
  .item-content {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .item-head {
      flex: 1;
    }
    .item-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121212;
      line-height: 20px;
    }
    .item-spu-title {
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
    .item-tag {
      font-size: 0;
      margin-bottom: 8px;
      .tag {
        display: inline-block;
        padding: 2px;
        margin-right: 3px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        background: #f0f0f0;
        border-radius: 4px;
      }
    }
    .item-aipay {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item-price {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e8374a;
        line-height: 20px;
        .money {
          display: block;
          font-size: 16px;
          &::before {
            content: "¥";
            font-size: 11px;
            margin-right: -3px;
          }
        }
      }
      .item-btn {
        a.link-btn {
          display: block;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #e8374a;
          padding: 5px 12px;
          span {
            display: block;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #e8374a;
            line-height: 14px;
          }
        }
      }
    }
  }
}
</style>
