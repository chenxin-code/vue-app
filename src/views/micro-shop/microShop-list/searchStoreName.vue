<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" v-if="$store.state.webtype == 1">
      <div>
        <div
          class="search-div theme_bg_white_f5"
          style="left: 50px; right: 55px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
        >
          <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
          <form class="search-input" action id="form">
            <input
              id="searchInput"
              class
              type="search"
              placeholder="店铺名称"
              v-model="searchStr"
              @input="monitor"
            >
          </form>
        </div>
        <div class="delete-img" @click="searchData">搜索</div>
      </div>
    </nav-top>
    <nav-content>
      <div v-if="$store.state.webtype != 1">
        <div
          class="search-div theme_bg_white_f5"
          style="left: 50px; right: 55px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
        >
          <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
          <form class="search-input" action id="forms">
            <input
              id="searchInputs"
              class
              type="search"
              placeholder="店铺名称"
              v-model="searchStr"
              @input="monitor"
            >
          </form>
        </div>
        <div class="delete-imgs" @click="searchData">搜索</div>
      </div>
      <div class="place">
        <p>按地市查询</p>
        <ul>
          <li v-for="(item,index) in placeList" :key="index" @click="cityData(item)" :class="{'active':item.activeData == true}">{{item.name}}</li>
        </ul>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import eventBus from '@/utils/eventBus.js'
  export default {
    name: "index",
    data() {
      return {
        searchStr: '',
        placeList: [],
        cityObj: {
          cityId: '',
          storeName: ''
        }
      }
    },
    created() {
    },
    mounted() {
      console.log(this.$store.state.globalConfig.micro_store_city_id);
      this.$request.post('/app/json/micro_store_front_end/getCityList', {parentId: 5}).then(res => { //vue_conf_micro_store_city_id
        if (res.status === 0) {
          this.placeList = res.data || []
          this.placeList.forEach(item => {
            this.$set(item,'activeData',false)
          })
          console.log(this.placeList);
        } else {
          this.$Toast(res.info)
        }
      })
    },
    methods: {
      monitor(val) {
        this.searchStr = val.srcElement.value
        this.cityObj.storeName = this.searchStr
      },
      searchData() {
        this.$router.push({
          path: '/micro_sho/microshop_list',
          query: {
            cityObj: this.cityObj
          }
        })
      },
      cityData(data) {
        this.cityObj.cityId = data.id
        this.placeList.forEach(item => {
          item.activeData = false
        })
        data.activeData = true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';

  .search-div {
    position: absolute;
    display: flex;
    align-items: center;

    .didian {
      width: 55px;
      border-right: 1px solid #999;
      height: 18px;
      line-height: 18px;
      margin-right: 10px;
      padding-right: 5px;

      span:nth-child(1) {
        display inline-block;
        width 30px;
        font-size 14px;
        color #999
      }
    }

    .icon-font {
      font-size: $font-size-medium;
    }

    .search-input {
      flex: 1;
      margin-left: 10px;
      font-size: $font-size-medium;

      input {
        background: none;
        width: 100%;
        height: 100%;
      }
    }
  }

  .search {
    float: right;
    display: flex;
    margin-right: 10px;
    justify-content: space-around;
    position: relative;
    z-index: 10;
    padding 0 15px;

    .name {
      margin-right: 10px;
      font-size: 14px;
    }
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
  .delete-img {
    font-size: 14px;
    text-align: right;
    margin-right: 15px;
  }
  .delete-imgs {
    width 94%
    font-size: 14px;
    margin 0 auto
    margin-top 15px
    text-align right
  }
  .place {
    width: 94%;
    margin: 0 auto;
    padding: 20px 5px;
    p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    ul {
      display flex
      flex-wrap wrap
      li{
        width 23%
        background #f6f6f6
        text-align center
        margin 0px 2% 20px 0
        height: 25px;
        line-height: 25px;
        border-radius: 11px;
      }
    }
  }
  .active {
    background #fe0018 !important
    color white
  }
  .searchIcon {
    border: 1px solid #dddddd;
    margin: 8px 12px;
    height: 35px;
    line-height: 35px;
    border-radius: 25px;
    background: white;
    text-align: center;
    font-size: 15px;
    color: #dddddd;
  }
</style>
