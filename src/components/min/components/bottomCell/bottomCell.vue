<template>
  <div class="bottomCell">
    <ul>
      <li
        v-for="(item, index) in cellData"
        :key="index"
        @click="bottomNavTo(item)"
      >
        <div class="cell_title">
          <img :src="item.icon" alt="" />
          <span>{{ item.title }}</span>
        </div>
        <span v-if="item.phone" class="phone">{{ item.phone }}</span>
        <img
          :src="require('../../images/back.png')"
          alt=""
          v-else
          class="back"
        />
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
  methods: {
    bottomNavTo(item) {
      this.$emit("bottomNavTo", item);
    },
  },
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
      border-bottom: 1px solid #F0F0F0;

      .cell_title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
          width: 18px;
          height: 18px;
        }

        span {
          margin-left: 12px;
          font-size: 13px;
          font-weight: 500;
          color: #121212;
        }
      }

      .back {
        width: 8px;
        height: 11.5px;
      }

      .phone {
        font-size: 13px;
        font-weight: 500;
        color: #121212;
      }
    }

    li:last-child {
      border: none;
    }
  }
}
</style>