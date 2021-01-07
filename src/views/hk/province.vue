/**Created by liaoyingchao on 2020-05-28.*/

<template>
  <div class="province">
    <nav-top @backEvent="$router.go(-1)" :bgImg="require('./img/nav-bg.png')"></nav-top>
    <nav-content>
      <div class="content">
        <div class="top-div">
          <div class="text">您所在省份</div>
          <div class="loaction">
            <img src="static/images/esh-top/dw.png">
            <span>{{location.province}}</span>
          </div>
        </div>
        <div class="list">
          <div class="item" @click="selectedLocation(item)" v-for="item in areaList">{{item.province}}</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "province",
    components: {},
    data() {
      return {
        location: {
          province: '定位中...'
        },
        areaList: [{
          province: '北京市',
          city: '朝阳区'
        }, {
          province: '广东省',
          city: '广州市'
        }],
      }
    },
    methods: {
      selectedLocation: function (item) {
        this.$store.state.indexData.province = item.province;
        this.$store.state.indexData.city = item.city;
        this.$router.go(-1)
      }
    },
    created() {
      this.$bridgefunc.getLocation((location, result) => {

        this.location = location
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .province {
    width 100%
    height 100%
    overflow hidden
    .content {
      height 100%;
      overflow hidden;
      background-color #efefef;
      .top-div {
        background url("./img/p-bg.png") repeat center center / 100% 100%;
        .text {
          padding 2px 12px 5px;
          color white;
          font-size 14px;
        }
        .loaction {
          padding 5px 12px 15px;
          display flex;
          align-items center;
          color white;
          img {
            margin-right 5px;
            height 20px;
          }
          span {
            font-size 16px;
            font-weight 500;
          }
        }
      }
      .list {
        overflow hidden;
        padding 0 10px;
        .item {
          margin-top 10px
          margin-right 8px;
          float left;
          background-color white;
          padding 10px 16px;
          font-size 16px;
        }
      }
    }
  }
</style>
