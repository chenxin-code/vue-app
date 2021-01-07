<template>
  <div class="bottom">
    <div class="cells" v-for="(item,idx) in items.rows" @click="itemEvent(item)" :class="{noline: idx == 0}">
      <img class="icon_con" :src=item.imageUrl>
      <div class="title_con font-medium">
        <p>{{item.title}}</p>
      </div>
      <div class="right_con">
        <img class="arrow_con" src="../../../assets/more.png">
        <div v-if="item.code == 20001" class="subtitle_con font-small-l">
          <p>{{getCookie()}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'minelist',
    components: {},
    props: [
      'items'
    ],
    data() {
      return {}
    },
    methods: {
      itemEvent: function (item) {
        // console.log('testFunc', item)
        this.$emit('itemEvent', item)
      },
      getCookie: function () {
        return "4.3M";
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    background-color: white;
    width: 100%;
    height: auto;
    overflow: hidden;

    .cells {
      /*position: relative;*/
      /*float: left;*/
      overflow hidden
      width: 100%;
      height: 50px;
      /*line-height: 50px;*/
      /*background-color: #2b81af;*/
      // border-top: $color-line-gray-l 0.5px solid;
      border-top: $color-line-gray-l 0.5px solid;

      .icon_con {
        float: left;
        margin-left: 10px;
        margin-top: 8px;
        margin-bottom: 8px;
        width: 34px;
        height: 34px;
      }

      .title_con {
        float: left;
        margin-left: 5px;
        width: 50%;
        line-height: 50px;
        text-align: left;
      }

      .right_con {
        margin-right: 2%;
        float: right;

        .subtitle_con {
          float: left;
          margin-right: 15%;
          line-height: 50px;
          text-align: right;
          width: 20%;
        }

        .arrow_con {
          float: right;
          margin-right: 2%;
          margin-top: 15px;
          width: 20px;
          height: 20px;
          /*background-color: #4caf50;*/
        }

      }
    }
    .noline {
      border none
    }
  }

</style>
