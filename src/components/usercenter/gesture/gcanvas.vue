/**Created by steven on 2018/11/21.*/

<template>
  <div class="gcanvas">
    <canvas class="canvas" ref="canvas"></canvas>
  </div>
</template>

<script>

  export default {
    name: "gcanvas",
    components: {},
    data() {
      return {
        ctx: '',
        devicePixelRatio: 0,
        r: '',// 公式计算
        lastPoint: [],
        arr: [],
        restPoint: [],
        drawStyle: 'red'
      }
    },
    methods: {
      init() {

        this.initDom();

        this.lastPoint = [];
        this.touchFlag = false;
        this.ctx = this.$refs.canvas.getContext('2d');
        this.createCircle();
        this.bindEvent();
      },
      reset() {
        this.createCircle();
      },
      bindEvent() {

        var self = this;
        let canvas = this.$refs.canvas;
        canvas.addEventListener("touchstart", function (e) {
          e.preventDefault();// 某些android 的 touchmove不宜触发 所以增加此行代码
          var po = self.getPosition(e);

          for (var i = 0; i < self.arr.length; i++) {
            if (Math.abs(po.x - self.arr[i].x) < self.r && Math.abs(po.y - self.arr[i].y) < self.r) {

              self.touchFlag = true;
              self.lastPoint.push(self.arr[i]);
              self.drawPoint(this.drawStyle);
              self.restPoint.splice(i, 1);
              break;
            }
          }
        }, false);
        canvas.addEventListener("touchmove", function (e) {
          if (self.touchFlag) {
            self.update(self.getPosition(e));
          }
        }, false);
        canvas.addEventListener("touchend", function (e) {
          if (self.touchFlag) {
            self.touchFlag = false;
            self.update(undefined,true);
            self.storePass(self.lastPoint);
          }
        }, false);

      },

      initDom() {
        this.devicePixelRatio = window.devicePixelRatio || 1;
        var canvas = this.$refs.canvas;

        var width = window.innerWidth;
        var height = window.innerWidth;
        // 高清屏锁放
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.height = height * this.devicePixelRatio;
        canvas.width = width * this.devicePixelRatio;

      },

      createCircle() {// 创建解锁点的坐标，根据canvas的大小来平均分配半径

        var n = 3;
        var count = 0;
        this.r = this.ctx.canvas.width / (2 + 4 * n);// 公式计算
        this.lastPoint = [];
        this.arr = [];
        this.restPoint = [];
        var r = this.r;
        for (var i = 0; i < n; i++) {
          for (var j = 0; j < n; j++) {
            count++;
            var obj = {
              x: j * 4 * r + 3 * r,
              y: i * 4 * r + 3 * r,
              index: count
            };
            this.arr.push(obj);
            this.restPoint.push(obj);
          }
        }
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (var i = 0; i < this.arr.length; i++) {
          this.drawCle(this.arr[i].x, this.arr[i].y);

        }
      },

      drawCle(x, y) { // 初始化解锁密码面板 小圆圈
        this.ctx.fillStyle = '#DDDDDD';//密码的点点默认的颜色
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
      },
      drawPoint(style) { // 初始化圆心

        for (var i = 0; i < this.lastPoint.length; i++) {
          this.ctx.fillStyle = style;
          this.ctx.beginPath();
          this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r / 2.5, 0, Math.PI * 2, true);
          this.ctx.closePath();
          this.ctx.fill();
        }
      },
      drawStatusPoint(type) { // 初始化状态线条
        for (var i = 0; i < this.lastPoint.length; i++) {
          this.ctx.strokeStyle = type;
          this.ctx.beginPath();
          this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r, 0, Math.PI * 2, true);
          this.ctx.closePath();
          this.ctx.stroke();
        }
      },
      drawLine(style, po, lastPoint) {//style:颜色 解锁轨迹
        this.ctx.beginPath();
        this.ctx.strokeStyle = style;
        this.ctx.lineWidth = 3;
        this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);

        for (var i = 1; i < this.lastPoint.length; i++) {
          this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
        }
        this.ctx.lineTo(po.x, po.y);
        this.ctx.stroke();
        this.ctx.closePath();

      },

      getPosition(e) {// 获取touch点相对于canvas的坐标
        var rect = e.currentTarget.getBoundingClientRect();
        var po = {
          x: (e.touches[0].clientX - rect.left) * this.devicePixelRatio,
          y: (e.touches[0].clientY - rect.top) * this.devicePixelRatio
        };
        return po;
      },
      update(po,isFinish) {// 核心变换方法在touchmove时候调用
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (var i = 0; i < this.arr.length; i++) { // 每帧先把面板画出来
          this.drawCle(this.arr[i].x, this.arr[i].y);
        }
        this.drawPoint(this.drawStyle);// 每帧花轨迹
        this.drawStatusPoint(this.drawStyle);// 每帧花轨迹
        if(isFinish){
          if(this.lastPoint.length){
            this.drawLine(this.drawStyle, this.lastPoint[this.lastPoint.length-1], this.lastPoint);// 每帧画圆心
          }
          return
        }
        this.drawLine(this.drawStyle, po, this.lastPoint);// 每帧画圆心

        for (var i = 0; i < this.restPoint.length; i++) {
          if (Math.abs(po.x - this.restPoint[i].x) < this.r && Math.abs(po.y - this.restPoint[i].y) < this.r) {
            this.lastPoint.push(this.restPoint[i]);
            this.drawPoint(this.drawStyle);
            this.restPoint.splice(i, 1);
            break;
          }
        }
      },

      storePass(psw) {// touchend结束之后对密码和状态的处理
        this.$emit('getGesture',psw);
      },

    },

    mounted() {
      this.init();
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .gcanvas {
    width 100%
    height 100%
    overflow hidden
    .canvas {
      width 375px
      height 375px

    }
  }
</style>
