<template>
  <div class="component-channelsearch">
    <div class="back-icon-area" @click="$router.go(-1)">
      <img src="./back-icon.png" alt="" />
    </div>
    <!-- <div class="channel-name">频道名字</div> -->
    <div class="channel-searchio">
      <van-search
        v-model="searchValue"
        placeholder="搜索商品名称"
        @search="onSearch"
        shape="round"
        background="transparent"
      >
      </van-search>
    </div>
  </div>
</template>
<script>
export default {
  name: "channelSearch",
  data(){
    return{
      searchValue: ""
    }
  },
  methods:{
    onSearch(val) {
      this.$emit('searchFun',val)
    }
  }
};
</script>
<style scoped>
  .van-search{
    width: 100%;
  }
.component-channelsearch {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding-top: 14px;
}
.back-icon-area {
  width: 42px;
  height: 28px;
  border-radius: 0px 23px 23px 0px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.back-icon-area img {
  width: 7px;
  height: 12px;
  margin-right: 12px;
}
.back-icon-area:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.27;
  background: #ffffff;
  border-radius: 0px 23px 23px 0px;
}
.channel-name {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 10px;
  height: 100%;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  line-height: 25px;
  letter-spacing: 1.5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.channel-searchio {
  flex: 1;
  flex-shrink: 0;
  height: 100%;
  width: 100%;
  margin: 0px 10px;
  display: flex;
  align-items: center;
  position: relative;
}
.channel-searchio input {
  width: 100%;
  height: 26px;
  background: #fff;
  border: none;
  outline: none;
  border-radius: 13px;
  padding-left: 26px;
}
.channel-searchio input::-webkit-input-placeholder {
  color: #b2b2b2;
  font-size: 12px;
}
.channel-searchio img {
  position: absolute;
  left: 10px;
  width: 10px;
}
</style>
