<template>
  <div class="body">
    <nav-top title="加油订单列表" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <van-tabs v-model="active" swipe-threshold="3" color="#F02C2D" @click="changeTab"sticky>
        <van-tab  v-for="(item,index) in tabArr" :key="index" :title="item.name">
        </van-tab>
      </van-tabs>
      <div class="scroll-div">
<!--        finished-text="没有更多了"-->
        <van-list
          v-model="isLoading"
          :finished="finished"
          :offset="200"
          @load="loadMore">
          <div v-if="orderArr.length>0&&active==0">
            <div v-for="(item1,index1) in orderArr" :key="index1">
              <order-item :item="item1"></order-item>
            </div>
          </div>
          <div v-else-if="orderArr.length>0&&active==1">
            <div v-for="(item1,index1) in orderArr" :key="index1">
              <order-item :item="item1"></order-item>
            </div>
          </div>
          <div class="no-list" v-else>
            <div class="img-div">
              <van-empty description="暂无订单" />
              <!--          <img src="./image/拼券.png" />-->
            </div>
            <!--        <div class="tip theme_font_gray">暂无待评价订单</div>-->
          </div>
        </van-list>

      </div>


<!--      <scroll @scroll="scrollHandler" :hasMore="isCanLoadMore" :pullUpLoad="true" :listenScroll="true" :data="orderArr" :startY="scrollTopValue" :probeType="2"  >-->
<!--          <van-tabs v-model="active" swipe-threshold="3" color="#F02C2D" @click="changeTab"sticky>-->
<!--            <van-tab  v-for="(item,index) in tabArr" :key="index" :title="item.name">-->
<!--              <div v-if="orderArr.length>0">-->
<!--                <div v-for="(item1,index1) in orderArr" :key="index1">-->
<!--                  <order-item :item="item1"></order-item>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="no-list" v-else>-->
<!--                <div class="img-div">-->
<!--                  <van-empty description="暂无订单" />-->
<!--                  &lt;!&ndash;          <img src="./image/拼券.png" />&ndash;&gt;-->
<!--                </div>-->
<!--                &lt;!&ndash;        <div class="tip theme_font_gray">暂无待评价订单</div>&ndash;&gt;-->
<!--              </div>-->
<!--            </van-tab>-->

<!--            &lt;!&ndash;              <van-tab title="">内容 2</van-tab>&ndash;&gt;-->
<!--          </van-tabs>-->
<!--      </scroll>-->
    </nav-content>
  </div>
</template>
<script>
  import Scroll from "@/components/base/scroll/scroll";
  import orderItem from './components/order-item'
  import store from "../../../../vuex/store";
  // import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  export default {
        name: "",
        components: {
          Scroll,
          orderItem,
        },
        data() {
            return {
              pageInfo: {
                page: 0,
                rows: 10
              },
              isLoading:false,
              finished:false,
              active:0,
              isCanLoadMore: false,
              scrollTopValue: 0,
              orderArr:[],
              tabArr:[
                {
                  name:'待评价订单',
                  value:'0',
                },
                {
                  name:'已评价订单',
                  value:'1',
                }
              ]
            }
        },
        methods: {
          loadMore(){
            this.getList()
          },
          changeTab(index){
            console.log(index)
            this.pageInfo.page=0
            this.orderArr=[]
            this.loadMore()
          },
          scrollHandler() {},
          getList(){
                    this.isLoading = true;
                    this.pageInfo.page++;
                    this.$Loading.open();
                    let params = {
                      userId:store.state.userInfo.userId,
                      ...this.pageInfo
                    }
                    let url='/app/json/questionaire/findAppraiseListByuserId'
                    if(this.active==1){
                      url='/app/json/questionaire/historyAppraiseList'
                    }
                    this.$http.post(url, params).then(res => {
                      let data = res.data
                      console.log(data)
                      this.isLoading = false;
                      if (data.status == 0) {
                        if (data.data instanceof Array) {
                          this.orderArr.push(...data.data);
                          if (this.orderArr.length >= data.totalRecords) {
                            this.finished = true;
                          }
                        } else {
                          this.finished = true;
                        }
                            // this.orderArr=data.data||[]
                      } else {
                        this.$Toast(data.info);
                        this.finished = true;
                      }
                      this.$Loading.close();
                    }).catch((err) => {
                      this.$Toast(err)
                    })
          },
        },
    created(){
         this.getList()
    }
    }
</script>

<style lang="stylus" scoped>
  .no-list {
  .img-div {
    margin-top: 20px;
    text-align: center;

  img {
    margin-top 40px
    width: 160px;
  }
  }

  .tip {
    margin-top: 10px;
    padding: 10px;
    font-size: 12px;
    text-align: center;
  }
  }
  /deep/.van-tab--active .van-tab__text{
    color #F02C2D
  }
  .van-list{
    height 560px
    overflow scroll
  }
</style>
