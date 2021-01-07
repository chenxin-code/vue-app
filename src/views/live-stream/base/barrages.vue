/**Created by liaoyingchao on 2020-04-12.*/

<template>
  <div class="barrages">
    <!--<div @click="addBarrage" style="height: 40px;"> 动画动画动画动画</div>-->
    <div ref="BarragesBody" class="barrages-body">
    </div>
    <!--<div class="" v></div>-->
  </div>
</template>

<script>
  export default {
    name: "barrages",
    components: {},
    data() {
      return {
        abc: false,
        barragesBodyDom: null,
        addTimers: 0,
        barragesNum: 0,
        myClientWidth: 375
      }
    },
    methods: {
      addBarrages: function (Arr) {
        if (!this.barragesBodyDom) {
          return ;
        }
        if (Arr.length > 0) {
          if (this.barragesNum > 9) {
            this.barragesNum = 0
          }
          this.addTimers = 0
          for (let i = 0; i < Arr.length; i++) {
            let item = Arr[i]
            let dom = document.createElement('div'); //1、创建元素
            let innerHTML = `恭喜<span style="color: #e6ca32;margin-right: 6px;">${item.nickName}</span>${item.content}`
            dom.innerHTML = innerHTML;
            dom.classList.add("barrage", "single-line");
            dom.style.top = this.barragesNum * 25 * this.myClientWidth / 375.00 + 'px'
            dom.style.marginLeft = Math.random() * 100 + 'px'
            this.barragesBodyDom.appendChild(dom);//插入到最左边
            setTimeout(() => {
              this.barragesBodyDom.removeChild(dom)
            }, 25000)
            this.barragesNum ++
          }
        } else {
          this.addTimers ++
          if (this.addTimers == 5) {
            this.addTimers = 0
            this.barragesNum = 0
          }
        }
      },
      pushBarrage: function (arr) {

      }
    },
    mounted() {
      this.barragesBodyDom = this.$refs.BarragesBody
      this.myClientWidth = this.$store.state.clientWidth
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" type="text/stylus">
  .barrages {
    .barrages-body {
      position relative;
      width 100%;
      .barrage {
        position absolute;
        left 100%;
        padding 5px 15px;
        background-color rgba(0, 0, 0, 0.3)
        color white;
        font-size 12px;
        border-radius 15px;
        animation: barrage_animation 25s linear;
      }
    }
  }

  @keyframes barrage_animation {
    from {
      left 100%;
    }

    to {
      left -150%;
    }
  }

</style>
