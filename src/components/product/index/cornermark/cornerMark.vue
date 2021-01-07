<template>
  <div class="mark" :style="cornerMarkStyle" v-if="moduleData">
    <div v-if="moduleData.cornerStyle == '1'" class="style1">
      {{getNum}}
    </div>
    <div v-if="moduleData.cornerStyle == '2'" class="style2">
      {{getNum}}
    </div>
  </div>
</template>

<script>
  // import Bus from '../bus';
  // import linkCenter from '@/utils/linkCenter';
  // import { deepCopy } from '@/utils/util';

  export default {
    name: 'cornerMark',
    props: {
      itemData: {
        type: Object
      },
      moduleData: {
        type: Object
      },
      code: {
        type: String
      }
    },
    data() {
      return {
        num: 0
      };
    },
    computed: {
      cornerMarkStyle() {
        if (!this.moduleData) {
          return ''
        }
        let cornerMarginTop = this.moduleData.cornerMarginTop
        let cornerMarginRight = this.moduleData.cornerMarginRight
        let style = {}
        if (cornerMarginTop) {
          style.top = cornerMarginTop + '%'
        }
        if (cornerMarginRight) {
          style.right = cornerMarginRight + '%'
        }
        return style
      },
      getNum: function () {
        if (this.code) {
          return this.$market.getCartNum(this.code);
        }
        if (this.num > 99) {
          return '99+'
        } else {
          return this.num
        }
      }
    },
    watch: {},
    methods: {
      getMark: function () {
        if (!this.itemData) {
          return ''
        }
        let url = this.itemData.cornerMarkUrl;
        let paramsData = {
          ouCode: ""
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              // this.itemData.cornerMarkKey 基于data的取数规则
              let cornerMarkKey = this.itemData.cornerMarkKey
              this.num = eval(cornerMarkKey) || 0
            }
          },
          error => {
            this.$Message.error("请求数据出错，请稍后重试!");
          }
        );
      }
    },
    created() {
      if (this.$store.state.webtype == -1) {
        this.num = 10
      } else {
        this.getMark()
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">

  .mark {
    position absolute
    top 0
    right 0
    z-index 1;

    .style1 {
      background-color red;
      font-size 10px;
      padding 2px 5px;
      border-radius 20px;
      color white;
    }

    .style2 {
      font-size 16px;
      font-weight 500;
      text-align center;
      color #333;
    }
  }

</style>
