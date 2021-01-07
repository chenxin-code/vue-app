/**Created by liaoyingchao on 2019/1/8.*/

<template>
  <div class="floater" :class="hotareaClass({idCode: myData.idCode})" @click.stop="editEvent" v-if="$market.moduleIsShow(myData)" :style="{bottom: positionBottom}">
    <transition-group name="floater">
      <img key="floater_0" class="floater-img" v-if="floaterStatus == 0" :src="myData.imgUrl" :style="getFloaterStyle(myData)" @click="hotEvent();$market.enterNav(myData)"/>
      <img key="floater_1" class="floater-img" v-if="floaterStatus == 1" :src="myData.shymgUrl" :style="getFloaterStyle(myData)" @click="showFinished"/>
      <img key="floater_2" class="floater-img" v-if="floaterStatus == 2" :src="myData.finishedImgUrl" :style="getFloaterStyle(myData)" @click="hotEvent();$market.enterNav(myData)"/>
    </transition-group>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "floater",
    mixins: [hee],
    data() {
      return {
        floaterStatus: 0,
        myTimeout: null
      }
    },
    props: [
      'usePorpData',
      'propData',
    ],
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData
        }
        return this.$store.state.pageData
      },
      myData: function () {
        return this.pageData.floater.data
      },
      positionBottom: function () {
        if (this.myData.positionBottom) {
          return this.myData.positionBottom + '%'
        }
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.myData.idCode + eKey)
      },
      modeleReshow: function () {
        if (this.$store.state.webtype != '-1' && this.floaterStatus == 0) {
          this.$bridgefunc.getItem('sign_in_time', (result) => {
            if (result && result != '' && result != null && result != undefined) {
              if (new Date(result).toDateString() === new Date().toDateString()) {
                this.floaterStatus = 1;
              }
            }
          })
        }
      },
      showFinished: function () {
        this.floaterStatus = 2
        if (this.myTimeout) {
          clearTimeout(this.myTimeout)
          this.myTimeout = null
        }
        this.myTimeout = setTimeout(() => {
          this.floaterStatus = 1
        }, 3000)
      },
      editEvent: function () {
        this.$emit('floterEdit')
      },
      getFloaterStyle: function (d) {
        let styleStr = ''
        let size = d.size;
        let sizePx = size * this.clientWidth / 100
        styleStr += 'width: ' + sizePx + 'px;'
        return styleStr
      }
    },
    mounted() {
      this.modeleReshow()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .floater {
    position absolute;
    right 0px;
    bottom 100px;
    height 40px;
    width 60px;
    font-size 0px;
    z-index 10;
    .floater-img {
      position absolute;
      right 0px;
      top 0px;
    }
  }
  .floater-enter-active, .floater-leave-active {
    transition: all 0.3s ease-in;
  }

  .floater-enter, .floater-leave-to {
    transform: translateX(100%);
  }
</style>
