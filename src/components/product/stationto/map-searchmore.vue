/**Created by steven on 2018/4/24.*/

<template>
  <div class="searchmorebot">

    <div class="qrcode-top " :style="{height: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}"
         @backEvent="backEvent">
      <div class="navcontent"
           :style="{top: this.$store.state.barHeight+ 'px','height': this.$market.getNavHeight()+'px','line-height': this.$market.getNavHeight()+'px'}">
        <div  @click="backEvent">
          <i class="iconfont mall-fanhui theme_font_black" style="margin-left: 10px; font-size: 20px;"></i>
        </div>

        <div class="search-div">
          <img class="searchimg" src="static/image/station/search.png" alt="">
          <input v-model="searchText" class="input-none" type="search" placeholder="输入地点或商区名称"  />
        </div>
        <div class="cancel" @click="cancelEvent">
          取消
        </div>

      </div>
    </div>

    <nav-content>
      <div  class="listcontent">
        <div class="list-item"  v-for="item in dataList" @click="backMap(item)">
          <div class="list_name theme_font_black">{{item.name}}</div>
          <div class="list_location theme_font_tint" v-show="item.address && item.address.length">{{item.address}}</div>
        </div>
      </div>
    </nav-content>

  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Config from '@/api/config'
import jsonp from 'jsonp'

export default {
  name: "map-searchmore",
  components: {
    Toast
  },
  data () {
    return {
      searchText:null,
      isActive:false,
      dataList:[],
    }
  },
  methods: {
    cancelEvent:function() {
      if (this.searchText) {
        this.searchText = null
      } else {
        this.$router.push('/stationto')
      }
    },
    backEvent: function () {
      this.$router.go(-1);
    },
    _moveFunc:function (value) {
      this.searchText = '';
      this.isActive = true;
    },
    focusFunc:function () {
      this.isActive = false;
    },
    backMap:function (item) {
      this.$store.state.selectp.lat = item.location.lat
      this.$store.state.selectp.lng = item.location.lng
      let _this = this;
      this.$bridgefunc.vuexStorage(function () {
        _this.backEvent();
      })
    },

  },
  watch:{
    searchText(curVal,oldVal){
      if (curVal) {
        let url = 'https://api.map.baidu.com/place/v2/search?query='+curVal+'&region=131&output=json&ak='+Config.mapak;
        let _this = this;
        jsonp(url, null, (err, data) => {
          if (err) {
            console.error(err.message)
          } else {
            _this.dataList = data.results
          }
        })
      } else {
        this.dataList = [];
      }
    }
  },


  created () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
$searchheight = 44px

.searchmorebot {
  position absolute
  top 0px
  bottom 0px
  left 0px
  right 0px
  background-color  white
  overflow hidden


  .qrcode-top {
    position absolute;
    width 100%;
    overflow hidden
    z-index 5;
  }

  .navcontent{
    position: absolute;
    width 100%
    bottom 0px
    left 0px
    overflow hidden;
    display flex
    justify-content space-between
    align-items center
    .search-div{
      flex 1
      background-color #F2F2F2
      margin 0px 20px
      height 30px
      border-radius 20px
      padding 0px 10px
      display flex
      align-items center
      .searchimg{
        width 20px
        height 20px
        display: block;
        vertical-align: middle;
      }
      .input-none{
        margin-left 5px
        width: 100%;
        height: 25px;
        border: 0px;
        background: none;
        outline: none;
        font-size: $font-size-small;
        overflow: hidden;
      }

    }
    .cancel{
      font-size $font-size-small
      padding 10px
      padding-left 0px
    }

  }

  .listcontent{
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    -webkit-overflow-scrolling touch
    overflow-y auto
    .list-item{
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      margin 10px
      padding 15px 10px

      .list_name{
        font-size $font-size-medium
        ellipse()
      }
      .list_location{
        margin-top 6px
        font-size $font-size-small
        ellipse()
      }
    }
  }

}
</style>
