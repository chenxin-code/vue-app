<template>
  <div class="bottomCell">
    <ul>
      <li v-for="(item, index) in cellData" :key="index">
        <div>
          <img :src="item.icon" alt="" />
          <span>{{ item.title }}</span>
        </div>
        <span v-if="item.phone">{{ item.phone }}</span>
        <img :src="require('../../images/back.png')" alt="" v-else />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "bottomCell",
  props: ["cellData"],
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="stylus" scoped type="text/stylus">
.bottomCell {
  width: 93.6%;
  background: #FFFFFF;
  border-radius: 14px;
  margin: 10px auto 0;
  padding: 0 25px;

  ul {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    li {
      padding: 16px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>