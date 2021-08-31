<template>
  <div class="choosesertype">
    <nav-top @backEvent="turnback"></nav-top>
    <nav-content v-if="isShow">
      <div class="goods-cell shadow-cell">
        <goods-cell :goods-info="order"></goods-cell>
        <div class="count-info">
          <p class="left-title">申请数量</p>
          <div>
            <!--<counter v-model="goodsCount" :maxValue="order.number"></counter>-->
            <van-stepper v-model="goodsCount" :min="1" :max="order.number" :step="1" integer/>
          </div>
        </div>
      </div>
      <div class="seservices-cell shadow-cell">
        <div class="type-cell" v-for="(seservice,index) in seservices" :key="index" v-show="seservice.isShow==1">
          <div class="left-info">
            <img :src="seservice.icon"/>
            <p>{{seservice.typeTitle}}</p>
          </div>
          <div class="right-info" @click="chooseservice(seservice.type)">
            <p class="theme_font_gray">{{seservice.subtitle}}</p>
            <i class="iconfont mall-gengduojiantou theme_font_gray"></i>
          </div>
        </div>
      </div>
      <van-dialog v-model="changeModal" class="change-modal" :title="contentData.title || '提示'">
        <div v-if="contentData.content" v-html="contentData.content"></div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>
  // import Counter from '@/components/commonui/counter/counter'
  import GoodsCell from '../common/goods-cell'
  import {Indicator, Toast} from 'mint-ui';
  import {Dialog} from "vant";

  export default {
    name: 'choosesertype',
    components: {
      // Counter,
      GoodsCell,
      Indicator,
      Toast
    },
    data() {
      return {
        isShow:false,
        changeModal: false, // 星梦创想的商品换货提示
        contentData: {}, // 内容中心提示
        goodsCount: 1,
        seservices: [
          {
            icon: 'static/image/mall2/tuihuo.png',
            typeTitle: '退货',
            subtitle: '已收货，需要退回商品',
            type: 0,
            isShow: false,
          }, {
            icon: 'static/image/mall2/huanhuo.png',
            typeTitle: '换货',
            subtitle: '已收到货，需要更换已收到的商品',
            type: 1,
            isShow: false,
          }, {
            icon: 'static/image/mall2/weixiu.png',
            typeTitle: '维修',
            subtitle: '已收到货，需要维修已收到的商品',
            type: 2,
            isShow: false,
          }, {
            icon: 'static/image/mall2/bufa.png',
            typeTitle: '补发商品',
            subtitle: '已发货，卖家少发商品',
            type: 3,
            isShow: false,
          },{
            icon: 'static/image/mall2/money.png',
            typeTitle: '退款(无需退货)',
            subtitle: '没收到货，或商家同意不用退货只退款',
            type: 4,
            isShow: false,
          }
        ],
        order: {},
        reApply: '0'
      }
    },
    methods: {
      chooseservice: function (type) {//售后类型
        console.log('售后类型',type)
        if (this.goodsCount == 0) {
          Toast({
            message: '申请数量要大于等于1',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        console.log(this.$store.state.globalConfig.after_sale_whole_order_return)
        if (type == 1 && this.order.interfaceType == 1) { // 换货操作 并且是星梦创想的商品
          this.getNewsList()
          this.changeModal = true
        } else if(type==0&&this.order.supportSingleProReturn==0&&this.$store.state.globalConfig.after_sale_whole_order_return==1){
          let flag=true;
          var that=this
          Dialog.confirm({
            title: '提示',
            message: '该店铺不支持单品退货，如需退货，您购买的该商户所有商品必须全部退货',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            getContainer:'.choosesertype'
          }).then(() => {
            console.log('confirm')
            // on confirm
            that.$router.push({
              path: '/mall2/services',
              query: {
                type: type,
                order: encodeURIComponent(JSON.stringify(that.order)),
                count: that.goodsCount,
                flag:flag
              }
            })

          }).catch(() => {
            ///cancel
          })
        } else {
          this.$router.push({
            path: '/mall2/services',
            query: {
              type: type,
              order: encodeURIComponent(JSON.stringify(this.order)),
              count: this.goodsCount
            }
          })
        }
      },
      showType:function(){
        for (let i = 0; i < this.seservices.length; i++) {
          if (i==0){
            this.seservices[i].isShow = this.order.returnFlag;
          }else if(i==1){
            this.seservices[i].isShow = this.order.changeFlag;
          }else if(i==2){
            this.seservices[i].isShow = this.order.repairFlag;
          }else if(i==3){
            this.seservices[i].isShow = this.order.fillFlag;
          }else if(i==4){
            this.seservices[i].isShow = this.order.onlyRefundFlag;
          }
        }
      },
      _getAfterSalesType: function (id) {//获取服务类型
        let url = '/app/json/app_order_after_sale/AfterSalesType';
        this.$Loading.open();
        let params1 = {
          token: this.$store.state.login.token,
          id: id,
          afterType: this.reApply
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.order = data.data;
            this.showType();
            this.isShow = true;
            if(this.order.onlyRefundFlag == 0 && this.order.fillFlag == 0){
              this.$Toast('该商品已申请售后，请到售后订单查看')
              setTimeout(()=>{
                this.$router.go(-1);
              },2000)
            }
          } else {
            this.isShow = false;
            this.$Toast(data.info)
          }
        }, error => {
          this.isShow = false;
          this.$Loading.close()
          console.log('获取服务类型', error);
          this.$Toast('获取数据失败')
        });
      },
      turnback:function () {//返回
        this.$router.go(-1);
      },
      getNewsList() {
        // 获取内容中心
        this.$request.post('/app/json/news/getNewsList', {values: 48}).then(res => {
          if (res.status == 0) {
            this.contentData = res.data[0] ? res.data[0]: {}
          } else {
            this.$Toast(res.info ? res.info : '获取获取内容中心失败')
          }
        })
      },
    },
    created() {
      let id = this.$route.query.id ? JSON.parse(decodeURIComponent(this.$route.query.id)) : '';
      this.reApply = this.$route.query.reApply ? this.$route.query.reApply : '0'
      this._getAfterSalesType(id);
    },
    activated () {
    },
    beforeRouteLeave (to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .choosesertype {
    width 100%
    height 100%
    overflow hidden
    .goods-cell {
      padding 10px 10px
      .good-info {
        display flex
        align-items center
        img {
          width 73px
          /*height 146px*/
        }
        .right-good {
          .goods-title {
            font-size $font-size-medium-s
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .goods-price {
            margin-top 10px
            font-size $font-size-small
          }

        }
      }
      .count-info {
        margin-top 10px
        display flex
        align-items center
        .left-title {
          flex 1
          font-size $font-size-medium-s
        }
      }

    }
    .seservices-cell {
      padding 10px 10px
      .type-cell {
        display flex
        align-items center
        .left-info {
          flex 1
          padding 10px 0px
          display flex
          align-items center
          img {
            width 15px
            height 15px
          }
          p {
            margin-left 8px
            font-size $font-size-medium-s
          }

        }
        .right-info {

          display flex
          align-items center
          p {
            font-size $font-size-small
          }
          i {
            font-size $font-size-medium-s
          }
        }
      }
    }
  }
  .change-modal{
    max-height 80%
    display flex
    flex-direction column
    /deep/ .van-dialog__header{
      padding-bottom:10px;
      flex-shrink 0
    }
    /deep/ .van-dialog__footer{
     flex-shrink 0
    }
    /deep/ .van-dialog__content{
      padding 11px 15px;
      min-height 200px;
      flex 1
      overflow-x hidden
      overflow-y auto
    }
  }
/deep/.van-dialog__message{
  padding 40px 20px!important
}
</style>
