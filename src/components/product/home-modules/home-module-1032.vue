<template>
  <div class=bottom-1032>
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-div">
      <div class=block-div-1032 @click="itemEvent(item)">
        <div class=layout-div-1032>
          <div class=img-div-small-1032>
            <img class=full-img :src="items.rows[0].imageUrl">
          </div>
          <div class=img-div-small-1032>
            <img class=full-img :src="items.rows[1].imageUrl">
          </div>
        </div>
        <div class=div-long-1032>
          <div class=div-in-long-1032>
            <img class=full-img :src="items.rows[2].imageUrl">
          </div>
        </div>
      </div>
      <div class=block-div-1032 @click="itemEvent(item)">
        <div class=layout-div-1032>
          <div class=img-div-small-1032>
            <img class=full-img :src="items.rows[3].imageUrl">
          </div>
          <div class=img-div-small-1032>
            <img class=full-img :src="items.rows[4].imageUrl">
          </div>
        </div>
        <div class=div-long-1032>
          <div class=div-in-long-1032>
            <img class=full-img :src="items.rows[5].imageUrl">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'

  export default {
    name: 'home-module-1032',
    components: {
      Toast
    },
    props: [
      'items'
    ],
    data() {
      return {
      };
    },
    methods: {
      itemEvent: function (item) {
        // console.log('testFunc', item)
        this.$emit('itemEvent', item)
      }
    },
  }
</script>

<!-- Add scoped attribute to limit CSS to this component only -->
<style lang=stylus scoped type="text/stylus">
  .bottom-1032 {
    width 100%
    overflow hidden
    position relative
    .background-style {
      width 100%
      float left
      position relative
      height: 0;
      padding-bottom: 50%;
    }
    .content-div {
      position absolute
      width 100%
      height: 100%;
    }

    .block-div-1032 {
      width 50%
      float left
      .layout-div-1032 {
        float left
        width: 50%;
        position: relative;
        height: 0;
        padding-bottom: 100%;
        .img-div-small-1032 {
          width: 100%;
          position: relative;
          height: 0;
          padding-bottom: 100%;
        }
      }
      .div-long-1032 {
        float left
        width: 50%;
        position relative
        height 0
        padding-bottom 100%
        .div-in-long-1032 {
          width: 100%;
          position relative
          height 0
          padding-bottom 200%
        }
      }
    }
  }
</style>
