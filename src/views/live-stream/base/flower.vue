/**Created by liaoyingchao on 2020-04-08.*/

<template>
  <div class="flower" ref="FlowerSelf">
    <canvas id="cvs"></canvas>
  </div>
</template>

<script>
  import LikeHeart from "../js/flower";

  export default {
    name: "flower",
    components: {},
    data() {
      return {
        width: 150, //初始宽度
        height: 400, //初始高度
        heartList: [], //初始数组
        heartCount: 0 //累加计数初始值
      }
    },
    methods: {

      getRandomDis() {
        if (Math.random() > 0.5) {
          return -(Math.random() * 43);
        } else {
          return +(Math.random() * 43);
        }
      },
      createHeart() {
        this.heartCount++;
        let positionArray = [
          {
            x: 100,
            y: 400,
            endX: 100,
            endY: 100
          }
        ];
        let img = new Image();
        let path = `static/image/flower/flower_${Math.ceil(Math.random() * 7)}.png`;
        img.src = path;
        let p1 = {
          x: 100 + this.getRandomDis(),
          y: 300 + this.getRandomDis()
        };
        let p2 = {
          x: 100 + this.getRandomDis(),
          y: 200 + this.getRandomDis()
        };
        return new LikeHeart({
          id: this.heartCount,
          x: positionArray[0].x,
          y: positionArray[0].y,
          endX: positionArray[0].endX,
          endY: positionArray[0].endY,
          onFadeOut: this.removeItem,
          noAngel: true,//决定是否从小到大
          // noScale: true,//决定是否左右摆动
          width: 30, //决定心的大小
          height: 30,
          image: img,
          bezierPoint: {
            p0: {
              x: positionArray[0].x,
              y: positionArray[0].y
            },
            p1: p1,
            p2: p2,
            p3: {
              x: positionArray[0].endX,
              y: positionArray[0].endY
            }
          }
        });
      },
      removeItem(item) {
        var array = [];
        for (var i = 0; i < this.heartList.length; i++) {
          if (this.heartList[i].id !== item.id) {
            array.push(this.heartList[i]);
          }
        }
        this.heartList = array;
      },
      aFlower: function () {
        this.heartList.push(this.createHeart());
      },
      manyFlower: function () {
        this.heartList.push(this.createHeart());
        setTimeout(() => {
          this.heartList.push(this.createHeart());
          setTimeout(() => {
            this.heartList.push(this.createHeart());
            setTimeout(() => {
              this.heartList.push(this.createHeart());
              setTimeout(() => {
                this.heartList.push(this.createHeart());
                setTimeout(() => {
                  this.heartList.push(this.createHeart());
                  this.heartList.push(this.createHeart());
                  setTimeout(() => {
                    this.heartList.push(this.createHeart());
                    setTimeout(() => {
                      this.heartList.push(this.createHeart());
                      this.heartList.push(this.createHeart());
                    }, 200)
                  }, 100)
                }, 400)
              }, 100)
            }, 300)
          }, 200)
        }, 300)
      }
    },
    mounted() {
      let selfDom = this.$refs.FlowerSelf
      this.width = selfDom.clientWidth
      // 飘心
      let _this = this
      var ctx = document.getElementById("cvs").getContext("2d");
      (ctx.canvas.width = _this.width),
        (ctx.canvas.height = _this.height),
        (function loop() {
          ctx.clearRect(0, 0, _this.width, _this.height);
          _this.heartList.forEach(function(item) {
            item && item.move(ctx);
          });
          requestAnimationFrame(loop);
        })();
      // setInterval(function() {
      //   _this.heartList.push(_this.createHeart());
      // }, 300);
      // document.getElementById("cvs").addEventListener(
      //   "click",
      //   function() {
      //     console.log(111111)
      //     _this.heartList.push(_this.createHeart());
      //   },
      //   false
      // );
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .flower {
    width 100%
    height 100%
    overflow hidden
  }
</style>
