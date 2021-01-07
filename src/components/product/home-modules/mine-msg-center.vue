/**Created by steven on 2018/4/25.*/

<template>
  <div class="mine-msg-center">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <!--<ul class="tab">-->
        <!--<li class="item " v-for="(item,index) in tab" :class="{isActive:selectedItem.id == item.id}"-->
            <!--@click="selectedFunc(item)"><span>{{item.name}}</span></li>-->
      <!--</ul>-->
      <pull-to :bottom-load-method="loadMore"  :isBottomBounce="bottomBounce">
        <ul class="msg-list">
          <li class="item" v-for="(item,index) in listData" @click="jumpFunc(item)">
            <div class="create-time">
              <p class="content theme_bg_red">{{item.createTime}}</p>
            </div>
            <div class="item-content">
              <div class="title-div">
                <p class="tag theme_bg_red theme_font_white">通知</p>
                <p class="title">{{item.sketch}}</p>
              </div>
              <p class="subtitle theme_font_tint">{{item.sketch}}</p>
            </div>
          </li>
        </ul>
      </pull-to>
    </nav-content>

  </div>

</template>

<script>
  import {Toast} from 'mint-ui'
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'

  export default {
    name: "mine-elticket",
    components: {
      Toast,
      PullTo,
    },
    data() {
      return {
        selectedItem:{},

        listData: [],
        bottomBounce:false,
        pageOn:1,
        tab: [
          {"name": "个人消息", "id": "2"},
          {"name": "系统通知", "id": "1"},
        ],
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      getSrc: function (src) {
        return src + '&token=' + (this.$store.state.login.token ? this.$store.state.login.token : '');
      },
      loadMore:function(loaded){
        this.getListData(loaded)
      },
      getListData: function (loaded) {
        this.$Loading.open()
        let url = '/app/json/message/getMsgList';
        let params1 = {
          token: this.$store.state.login.token ? this.$store.state.login.token : '',
          page:{
            index:this.pageOn,
            pageSize:10
          }
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {

            if(this.pageOn == 1){
              this.listData = data.data;
            }else {
              this.listData = this.listData.concat(data.data);
            }
            if(data.data && data.data.length > 10){
              this.pageOn += 1;
              this.bottomBounce = true;
            }else {
              this.bottomBounce = true;
            }

          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000,
            });
          }

          if(loaded){
            loaded('done');
          }
        }, error => {
          if(loaded){
            loaded('done');
          }
          this.$Loading.close();
          this.$Toast('请求失败');
          console.log('获取消息列表', error)
        })
      },
      selectedFunc: function (item) {
        this.selectedItem = item;
        this.pageOn = 1;
        this.listData = [];
        this.getListData();
      },
      jumpFunc: function (item) {
        // if (item.msgType == '2') {
        //   this.$bridgefunc.customPush({
        //     path: '/elticket',
        //     isnativetop: '1'
        //   });
        //   return;
        // }
        this.$router.push({
          path: '/minemsgcenterdetails',
          query: {
            data: item.id,
          }
        })
 
      }
    },
    created() {
      this.selectedFunc(this.tab[0]);
      this.getListData();

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/regularfont.styl'

  .mine-msg-center {
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    background-color white;
    overflow hidden
   /* .tab {
      width: 100%;
      overflow: hidden;
      background: #fff;
      .item {
        width: 50%;
        float: left;
        text-align: center;
        height: 44px;

        span {
          display: inline-block;
          height: 44px;
          line-height: 44px;
          font-size: $font-size-medium-x;
          letter-spacing: 1px;
          border-bottom: 1px solid transparent;
          // font-weight:500;
        }

      }
      .isActive {
        span {
          border-bottom: 2px solid $color-theme-r;
          color: $color-theme-r;
        }
      }
    }*/
    .msg-list {
      margin-top: 10px;
      background: #fff;
      .item {
        .create-time{
          margin-top 10px
          display flex
          justify-content center
          .content{
            font-size $font-size-small
            padding 5px 6px
            border-radius 11px
            color white
            background-color rgb(221,221,221)
          }

        }
        .item-content{
          margin 15px 10px
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
          padding 15px 10px
          border-radius  5px
          .title-div{
            display flex
            align-items center
            .tag{
              font-size $font-size-small
              padding 2px 6px
              border-radius 8px
            }
            .title{
              margin-left 10px
              font-size $font-size-medium
              ellipse()
            }
          }

          .subtitle{
            font-size $font-size-small
            margin-top 10px
            width 100%
            ellipse()
          }
        }

      }
    }

  }
</style>
