<template>
  <div class="component-purchaseNav">
    <div
      class="purchaseNav-column"
      v-for="(item, index) in navList"
      :key="index"
      @click="enterNav(item, index)"
    >
      <div class="key-dom" :class="index == navIndex ? 'active' : ''">
        <img :src="item.categoryPicurl" alt="" />
        <span>{{ item.categoryName }} </span>
        <img :src="require('../../activity/images/button_roll_default.png')" alt="" class="active_select" v-show="index == navIndex" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "purchaseNav",
  data() {
    return {
      navIndex: 0,
      navList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let url = `/app/json/groupbuying_sku_index_app/queryGroupbuyingCategoryList`;
      this.$http
        .post(url, {})
        .then((res) => {
          this.loading = false;
          this.isLoading = false;
          if (res.data.status == 0) {
            this.navList = res.data.data;
            this.navList.unshift({
              categoryDescribe: "0",
              categoryName: "全部",
              categoryPicurl:
                require("@/components/bulk/activity/images/all-ify-icon.png"),
                // "http://39.105.84.126:28801/download?guid=a2b482ea307a449bb4d003c974b6084f",
              categoryWeight: 1,
              id: "",
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    enterNav(item, index) {
      this.navIndex = index;
      this.$emit("navToMsg", item);
    },
  },
};
</script>
<style>
:root {
  --navWidth: 60px;
  --navHeight: 26px;
}
.component-purchaseNav {
  width: 100%;
  height: 102px;
  display: flex;
  justify-content: flex-start;
  overflow: auto;
  background-image: url('../../activity/images/main_bg_2.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.purchaseNav-column {
  width: 25%;
  height: 100%;
  flex-shrink: 0;
  flex-wrap: nowrap;
}
.key-dom {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  position: relative;
}
.key-dom img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  /* border: 1px solid #f6f6f6; */
}
.key-dom span {
  width: 120%;
  color:  #fff;
  margin-top: 8px;
  width: 43px;
  height: 17px;
  text-align: center;
  line-height: 17px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.key-dom.active img {
  /* border: 1px solid #b52232; */
}
.key-dom.active span {
  color: #F96595;
  background: #fff;
  line-height: 17px;
  text-align: center;
  font-size: 12px;
  width: 43px;
  height: 17px;
  background: #FFFFFF;
  border-radius: 8px;
}
.key-dom .active_select{
  width: 33px;
  height: 11px;
  position: absolute;
  bottom: -2px;
}
</style>