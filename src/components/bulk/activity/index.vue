<template>
    <div class="body">
      <!-- <nav-top @backEvent="$router.go(-1)" title="订单列表"></nav-top> -->
      <!-- <nav-content> -->
        <van-tabs @click="changes" v-model="title">
          <van-tab :title="'全部'">
            <div class="box">
              <div class="div1">
                <div><span>三亚西岛门票（成人票）</span></div>
              </div>
              <div class="div2">
                <img src="static/image/microShop/lvyou.png" alt="">
                <div>
                  <p>截止日期：2020/10/10 20:0</p>
                  <p><span>进行中</span><span>已团1单</span><span>共3件商品></span></p>
                  <p>
                    <span @click="showShare = true">分享</span>
                    <span @click="navToDetail()">本团订单</span>
                  </p>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="'进行中'">

          </van-tab>
          <van-tab :title="'未开始'">

          </van-tab>
          <van-tab :title="'已结束'">
  
          </van-tab>
        </van-tabs>
        <van-share-sheet
          class="copyData"
          v-model="showShare"
          title="分享到"
          :options="options"
          cancel-text=""
          @select="onSelect"
        />
      <!-- </nav-content> -->
    </div>
</template>

<script>
    export default {
      name: "activity",
      // mixins: [api],
      data() {
          return {
            title: '全部',
            state: 1,
            list: [],
            showShare: false,
            options: [
              { name: '微信', icon: 'wechat' },
              { name: '复制链接', icon: 'link' }
            ],
            copybtn:""
          }
      },
      mounted() {
          this.loadData()
      },
      methods: {
        onSelect:function(option){
          if(option.icon == "wechat"){

          }
          else if(option.icon == "link"){
              
          }
        },
        changes(index,title) {
          console.log(index,title);
          let that = this
          if (title == '全部') {
            
          } else if (title == '进行中') {
            
          } else if (title == '未开始') {
           
          } else if (title == '已结束') {
           
          }
        },
        loadData() {

        },
        navToDetail() { //本团订单
          this.$router.push({
            path: '/bulkDetails'
          })
        },
      },
      created() {

      },
    }
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
  .body {
    background-color: #f6f6f6 !important;
    .box {
      border-radius: 8px;
      padding: 15px;
      background white;
      margin: 15px 12px;
      font-size 14px;
      .div1 {
        display flex;
        justify-content space-between
        span {
          font-size 14px;
          margin auto 0
        }
        .state {
          width 75px;
          text-align: right;
        }
        div{
          display flex;
          justify-content space-between
          img {
            width 24px;
            height 24px;
            margin auto
            margin-right 5px;
          }
          span {
            font-size 16px;
            margin auto
            line-height 22px;
          }
        }
      }
      .div2 {
        margin-top:15px;
        display flex;
        justify-content start
        img {
          width: 80px;
          height: 80px;
          border-radius: 6px;
          margin-right: 15px;
        }
        div{
          width:250px;
          display flex;
          flex-direction column
          font-size 14px;
          p:nth-child(1) {
            margin-top: 5px;
            margin-bottom: 10px;
            color:#424242;
          }
          p:nth-child(2) {
            display: flex;
            color:#999999;
            span:nth-child(1){
              color:#C61606;
            }
            span{
              flex: 1;
            }
          }
          p:nth-child(3) {
            margin-top: 20px;
            text-align: right;
            span{
              padding: 4px 15px;
              border-radius: 12px;
              font-size: 12px;
              margin: 0 5px;
            }
            span:nth-child(1){
                border: 1px solid #FF9E4F;
                color: #FF9E4F;
            }
            span:nth-child(2){
              border: 1px solid #DDDDDD;
              color: #333333;
            }
          }
        }
      }
    }
  }
  /deep/ .van-tabs__line {
    background-color: #C61606 !important;
    height: 0.04rem;
  }
  /deep/ .van-tab--active{
    color:#C61606;
  }
</style>
