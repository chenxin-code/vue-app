<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <ul class="tab-container">
        <li
          class="item"
          :class="{ active: activeIndex == index }"
          v-for="(item, index) in tabsTitle"
          :key="index"
          @click="tabclick(index)"
        >{{ item.name }}（{{ item.num }}）</li>
      </ul>
      <div class="scroll-container">
        <scroll
          ref="scroll"
          class="my-wish-list"
          :hasMore="hasMore"
          :pullUpLoad="true"
          @pullingUp="loadMore"
          :data="wishList"
          v-if="wishList.length !== 0">
          <!-- 我的心愿 -->
          <div v-if="activeIndex == 0">
            <div class="item" v-for="(item, index) in wishList" :key="index">
              <p class="title">
                <span class="mechan">{{ item.ouName }}</span>
                <span class="deliver">{{ item.deliverType == 1 ? '自提' : '配送' }}</span>
              </p>
              <van-swipe-cell stop-propagation>
                <div class="prod-content">
                  <img :src="item.phPictureUrl" alt class="prod-img" />
                  <div class="right">
                    <p class="prod-name">{{ item.skuName }}</p>
                    <span class="sort-name">{{ dealWithFeature(item.featureValues) }}</span>
                    <p class="price">￥<span class="num">{{ dealWithPrice(item.price)[0] }}</span>.{{ dealWithPrice(item.price)[1] }}</p>
                  </div>
                </div>
                <van-button
                  slot="right"
                  square
                  text="删除"
                  type="danger"
                  class="delete-button"
                  @click="deleteClick(item)"/>
              </van-swipe-cell>
            </div>
          </div>
          <!-- 已实现心愿 -->
          <div v-else>
            <div class="item" v-for="(item, index) in wishList" :key="index" @click="viewOrderDetail(item)">
              <p class="title">
                <span class="mechan">{{ item.ouName }}</span>
                <span class="deliver">{{ item.deliverType == 1 ? '自提' : '配送' }}</span>
              </p>
              <div class="prod-content">
                <img :src="item.phPictureUrl" alt class="prod-img" />
                <div class="right">
                  <p class="prod-name">{{ item.skuName }}</p>
                  <span class="sort-name">{{ dealWithFeature(item.featureValues) }}</span>
                  <p class="price">￥<span class="num">{{ dealWithPrice(item.price)[0] }}</span>.{{ dealWithPrice(item.price)[1] }}</p>
                </div>
              </div>
              <span class="detail-btn">查看详情</span>
            </div>
          </div>
        </scroll>
        <div class="no-message" v-else>
          <img src="./images/no-message-icon.png" alt class="no-message-img" />
          <p class="title" v-if="activeIndex == 0">您还没有心愿商品呢~</p>
          <p class="title" v-else>您还没有实现心愿商品呢，快喊好友来帮你吧~</p>
        </div>
      </div>
      <div class="btm-btn">
        <div class="btn" @click="openSharePop">请TA来买单</div>
        <div class="btn" @click="jumpProdList">添加心愿</div>
      </div>
    </nav-content>

    <!-- 请他买单弹窗 -->
    <pop-view v-if="showPop" @closeEvent="showPop = false" :popHeight="330" class="share-pop">
      <p class="title">设置分享信息</p>
      <div class="shipping-address public-box" @click="choseAddress">
        <div v-if="$store.state.mall2.selectAddress.id > 0">
          <p class="per-info"><span class="per-name">{{ $store.state.mall2.selectAddress.receiverName }}</span><span class="per-phone">{{ $store.state.mall2.selectAddress.mobile }}</span></p>
          <p class="detail-address">{{ $store.state.mall2.selectAddress.addressFull }}</p>
        </div>
        <div v-else class="no-address-tip">请设置收货信息</div>
        <i class="iconfont mall-gengduojiantou more-icon"></i>
      </div>
      <!-- <div class="self-address public-box">
        <div class="item">
          <p class="label">提货人姓名</p>
          <input type="text" class="form-input" placeholder="请输入提货人姓名" v-model="params.pickuperName" @input="userInput">
        </div>
        <div class="item">
          <p class="label">提货人手机号</p>
          <input type="text" class="form-input" placeholder="请输入提货人手机号" v-model="params.pickuperMobile" @input="phoneInput">
        </div>
      </div> -->
      <div class="leave-message public-box">
        <div class="top-title">
          <p class="msg-title">我想说的话</p>
          <span class="another-btn" @click="getWishText()">随机换一句</span>
        </div>
        <div class="msg-input-c">
          <van-field type="textarea" class="msg-input" v-model="params.wishMsg"/>
        </div>
      </div>
      <span class="next-btn" :class="{ disabled: (params.userAddressId < 0 || !params.wishMsg) }" @click="nextClick">下一步</span>
    </pop-view>
    <!-- 请他买单弹窗end -->

    <!-- 选择分享途径弹窗 -->
    <pop-view
      v-if="isShowShareType"
      @closeEvent="isShowShareType = false"
      :popHeight="190"
      class="chose-share-pop">
      <p class="title">邀请好友为你买单</p>
      <div class="share-btn-c">
        <div class="item" @click="shareToWechat">
          <img src="./images/icon-weixin.png" alt="" class="icon"/>
          <p class="text">微信好友</p>
        </div>
        <div class="item">
          <img src="./images/icon-pengyouquan.png" alt="" class="icon"/>
          <p class="text">朋友圈</p>
        </div>
      </div>
      <span class="cancel-btn" @click="isShowShareType = false">取消</span>
    </pop-view>
    <!-- 选择分享途径弹窗end -->
  </div>
</template>
<script>
import scroll from "@/components/base/scroll/scroll";
import Config from '@/api/config'
export default {
  components: {
    scroll
  },
  data() {
    return {
      activeIndex: 0,
      showPop: false,
      isShowShareType: false,
      tabsTitle: [
        {
          name: "我的心愿",
          num: 0
        },
        {
          name: "已实现心愿",
          num: 0
        }
      ],
      hasMore: true,
      // 我的心愿列表数据
      wishList: [],
      pageInfo: {
        page: 1,
        rows: 10
      },
      params: {
        userAddressId: '',
        wishMsg: '',
        // pickuperMobile: this.$store.state.login.phone,
        // pickuperName: this.$store.state.mall2.pickUpUser,
      }
    };
  },
  mounted() {
    this.getWishList();
    this.getNationalNum();

    // if (
    //   this.$store.state.mall2.pickUpUser == undefined ||
    //   this.$store.state.mall2.pickUpUser == ""
    // ) {
    //   this.$store.state.mall2.pickUpUser = this.$store.state.login.nickName;
    // }
    this.params.userAddressId = this.$store.state.mall2.selectAddress.id;
  },
  methods: {
    // 获取心愿单列表
    getWishList(wishType = 0) {
      this.$Loading.open();

      let paramsData = {
        isWish: wishType,
        token: this.$store.state.login.token
      }

      this.$http.post('/app/jqGrid/wish_order/getUserWishOrderList', paramsData).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.wishList = this.wishList.concat(data.data);
          this.pageInfo.page = data.page;
          if (this.pageInfo.page >= data.total) {
            this.hasMore = false;  
          }
        } else {
          this.$Toast(data.info);  
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    // 获取顶部导航数量
    getNationalNum() {
      this.$http.post('/app/json/wish_order/getUserNationalNum', {}).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.tabsTitle[0].num = data.data.noWishOrderNum;
          this.tabsTitle[1].num = data.data.yesWishOrderNum;
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(err);
      })
    },
    // 上拉加载更多
    loadMore() {
      this.pageInfo.page = ++this.pageInfo.page;
      this.getWishList(this.activeIndex);
    },
    // tab点击
    tabclick(index) {
      if (this.activeIndex == index) {
        return false;
      }
      this.activeIndex = index;
      this.pageInfo = {
        page: 1,
        rows: 10
      }
      this.wishList = [];
      this.getWishList(index);
      this.hasMore = true;
    },
    // 删除
    deleteClick(item) {
      this.$Loading.open();
      this.$http.post('/app/json/wish_order/addWishOrder', {
        skuId: item.skuId,
        storeOuCode: item.storeOuCode
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.$Toast('删除成功');
          this.wishList = [];
          this.pageInfo = {
            page: 1,
            rows: 10
          }
          this.hasMore = true;
          this.getWishList();
          this.getNationalNum();
        } else {
          this.$Toast(data.info);  
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    // 获取想说的话
    getWishText(isDefault = '') {
      this.$Loading.open();
      this.$http.post('/app/json/wish_order/getRandomWishOrderConfig', {
        type: 1,
        isDefault,
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.params.wishMsg = data.data.wishMsg;
        } else {
          this.$Toast(data.info);  
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    // 打开分享弹窗
    openSharePop() {
      if (!this.params.wishMsg) { // 未存在心愿留言
        this.getWishText(1);  
      }
      this.showPop = true;
    },
    // 下一步点击
    nextClick() {
      if (this.params.userAddressId > 0 && this.params.wishMsg) {
        // this.showPop = false;
        // this.isShowShareType = true;
        this.shareToWechat();
      }
    },
    // 分享给微信好友
    shareToWechat() {
      this.$Loading.open();
      this.$http.post('/app/json/wish_order/addWishOrderShare', this.params).then(res => {
        let data = res.data;
        if (data.status == 0) {
          
          // 单纯分享给微信好友
          // this.$bridgefunc.wechatShare({
          //   title: data.data.shareLinkTitle,
          //   sharetext: data.data.shareLinkContent,
          //   imageurl: data.data.shareLinkIcon,
          //   detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/wish_share_page?shareNo=${data.data.shareNo}`
          // })

          // 友盟分享
          console.log(111111, {
            title: data.data.shareLinkTitle,
            sharetext: data.data.shareLinkContent,
            imageurl: data.data.shareLinkIcon,
            detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/wish_share_page?shareNo=${data.data.shareNo}`
          })
          console.log(222222, this.$store.state.globalConfig.wxBaseUrl)
          this.$bridgefunc.share({
            title: data.data.shareLinkTitle,
            sharetext: data.data.shareLinkContent,
            imageurl: data.data.shareLinkIcon,
            detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/wish_share_page?shareNo=${data.data.shareNo}`
          });

        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    // 选择收货地址
    choseAddress() {
      this.$router.push({
        path: "/mall2/addresslist"
      });
    },
    // 手机号输入
    phoneInput() {
      this.params.pickuperMobile = this.params.pickuperMobile.replace(/[^\d]/g, '')
    },
    // 提货人姓名输入
    userInput() {
      this.$store.state.mall2.pickUpUser = this.params.pickuperName;
    },
    // 处理规格信息
    dealWithFeature(featureList) {
      let result = '';
      if ((featureList instanceof Array) && (featureList.length > 0)) {
        featureList.forEach(item => {
          result += `${item.featureName}: ${item.featureValue} `;
        });
      }
      return result;
    },
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum];
    },
    // 添加心愿点击
    jumpProdList() {
      let path = '/mall2/list/' + this.$util.getDataString()
      this.$router.push({
        path: path,
        query: {
          lastPath: this.$route.path,
          entryType: 'wish'
        }
      })
    },
    // 查看已实现心愿
    viewOrderDetail(item) {
      // 查详情获取订单状态
      this.$Loading.open()
      let params = {
        orderId: item.orderId,
        payUserId: item.payUserId,
        orderType: '200017',
        orderPayType: 1,
        tag: 16,
        awardActivity: JSON.stringify({}),
      }
      this.$http.post('/app/json/app_shopping_order/detail', params).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data.state == 17 || data.data.state == 16) {
            params.tag = 16
          } else if (data.data.state == 4) {
            params.tag = 4
          } else if (data.data.state == 6 || data.data.state == 9) {
            params.tag = 9
          } else if (data.data.state == 12) {
            params.tag = 7
          }
          // tab 16 代发货 4 待收货（提货）9 已完成 7 已取消
          this.$router.push({
            path: '/mall2/orderdetail',
            query: params
          })
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`detail err ${err}`)
      })
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
/deep/ .van-swipe-cell__right {
  display: inline-block;
  width: 65px;
  height: 100%;
  font-size: 15px;
  color: #fff;
  text-align: center;
  .delete-button {
    height 100%;
  }
}

.tab-container {
  display: flex;
  padding: 10px 0;

  .item {
    flex: 1;
    text-align: center;
    font-size: 15px;
    position: relative;

    &.active {
      color: $color-theme-r;
    }

    &.active:after {
      content: '';
      display: block;
      width: 100px;
      height: 2px;
      background-color: $color-theme-r;
      position: absolute;
      left: 50%;
      bottom: -5px;
      transform: translateX(-55%);
    }
  }
}

.scroll-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 35px;
  bottom: 55px;
  overflow: hidden;
  height auto;
}

.my-wish-list {
  padding: 0 10px 15px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;

  /deep/ .scroll-content {
    padding-top: 5px;
  }

  .item {
    padding: 15px 10px;
    box-shadow: 0 0 5px #ddd;
    border-radius: 4px;
    margin-top: 10px;
    position relative;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .mechan {
        font-size: 14px;
      }

      .deliver {
        font-size: 12px;
        color: $color-theme-r;
      }
    }

    .prod-content {
      display: flex;
      margin-top: 12px;

      .prod-img {
        display: block;
        width: 75px;
        height: 80px;
      }

      .right {
        flex: 1;
        padding-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .prod-name {
          font-size: 15px;
          line-height: 18px;
          ellipse-2();
        }

        .sort-name {
          font-size: 12px;
          padding-top: 8px;
          color: $color-text-d;
        }

        .price {
          color: $color-theme-r;
          padding-top: 8px;
          font-weight: 700;
          font-size: 13px;
          line-height 15px;
          .num {
            font-size: 18px;
            font-weight: 700;
          }
        }
      }
    }
    
    .detail-btn {
      display block;
      height 28px;
      line-height 28px;
      padding 0 10px;
      background-color $color-theme-r;
      color #fff;
      font-size 14px;
      position absolute;
      right 10px;
      bottom 15px;
      border-radius 19px;

    }
  }
}

.no-message {
  padding: 25px 0;

  .no-message-img {
    display: block;
    width: 180px;
    margin: 0 auto;
  }

  .title {
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
    color: $color-text-d;
  }
}

.btm-btn {
  bdr-t();
  position absolute;
  z-index 10;
  left 0
  right 0;
  bottom 0;
  display flex;
  background-color #fff
  height 55px;
  align-items center;
  justify-content space-around
  .btn {
    width 46%;
    text-align center;
    font-size 16px;
    height 42px;
    line-height 42px;
    border-radius 4px;
    &:first-child {
      background-color $color-theme-r;
      color #fff;
    }
    &:last-child {
      border 1px solid #ccc;
    }
  }
}

.share-pop {
  .public-box {
    border-radius 4px;
    box-shadow 0 0 5px #ddd;
    padding 10px 8px;
    margin 0 10px;
  }
  .title {
    font-size 16px;
    text-align center;
    padding 15px 0;
    font-weight 700;
  }
  .shipping-address {
    min-height 60px;
    position relative;
    .per-info {
      font-size 15px;
      .per-name {
      }
      .per-phone {
        padding-left 10px;
      }
    }
    .detail-address {
      font-size 13px;
      color $color-text-d;
      padding-top 10px;
      line-height 15px;
      padding-right 20px
    }
    .more-icon {
      font-size 12px;
      color $color-text-d;
      position absolute;
      right 10px;
      top 50%;
      transform translateY(-50%);
    }

    .no-address-tip {
      font-size 13px;
      position absolute
      left 10px;
      top 50%;
      transform translateY(-50%)
      color $color-text-d
    }
  }
  .self-address {
    margin-top 10px;
    .item {
      display flex;
      justify-content space-between
      font-size 13px;
      color #333;
      align-items center;
      &:last-child {
        padding-top 10px;
      }
      .form-input {
        font-size 14px;
        text-align right;
      }
    }
  }
  .leave-message {
    margin-top 10px;
    .top-title {
      display flex;
      justify-content space-between
      padding-top 8px;
      font-size 13px;
      color #333;
      .another-btn {
        display block;
        color $color-text-l;
        extend-click();
      }
    }
    .msg-input-c {
      background-color #f6f6f6
      border-radius 5px;
      margin-top 10px;
      padding 15px 10px;
      .msg-input {
        background-color #f6f6f6;
        padding 0;
        width 100%;
      }
    }
  }
  .next-btn {
    position absolute
    left 0;
    right 0
    bottom 0;
    font-size 18px;
    text-align center;
    color #fff;
    height 50px;
    line-height 50px;
    background-color $color-theme-r;
    box-shadow 0 0 5px #ddd;
    &.disabled {
      background-color #cacbca
    }
  }
}

.chose-share-pop {
  .title {
    font-size 16px;
    text-align center;
    padding 15px 0;
    font-weight 700;
  }
  .share-btn-c {
    display flex;
    padding 0 15px;
    .item {
      padding 0 15px;
      .icon {
        display block;
        width 40px;
        margin 0 auto;
      }
      .text {
        color #333;
        text-align center;
        padding-top 10px;
        font-size 12px;
      }
    }
  }
  .cancel-btn {
    position absolute
    left 0;
    right 0
    bottom 0;
    font-size 18px;
    text-align center;
    height 50px;
    line-height 50px;
    box-shadow 0 0 5px #ddd;
  }
}
</style>
