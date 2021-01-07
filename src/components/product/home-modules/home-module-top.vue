<template>
  <div class="home-bottom-top" :class="{topmodulebg: item.bgImageUrl == ''}">
    <div class="bg-div" v-if="item.bgImageUrl != ''">
      <img class="full-img" :src="item.bgImageUrl" />
    </div>
    <div class="content-div" :style="{top: this.$store.state.barHeight + 'px'}">
      <div class="item-div right-item" v-if="item.isShowMsg == '1'" @click="messageEvent()">
        <div class="img-div">
          <img class="full-img" src="../../../assets/home/message.png" />
          <span v-if="!UnreadMessage <= 0" class="unread-message"> {{UnreadMessage}} </span>
        </div>
      </div>
      <div class="item-div left-item" v-if="item.isShowScan == '1'">
        <div class="img-div">
          <img class="full-img" src="../../../assets/home/scan.png" />
        </div>
      </div>
      <div class="item-div left-item" v-if="item.isShowArea == '1'" @click="areaEvent()">
        <div class="area-div font-medium">
          <span>{{area}}</span>
          <img class="area-img" src="../../../assets/home/extend.png" />
          <!--<img class="full-img" src="../../../../static/image/scan.png" />-->
        </div>
      </div>
      <div class="input-bg" v-if="item.isShowSearch == '1'">
        <input class="input-none" type="search" placeholder="请输入" />
        <div class="search-img">
          <img class="full-img" src="../../../assets/home/search.png" />
        </div>
      </div>
      <div class="page-title" v-if="item.isShowSearch != '1'">首页</div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';

export default {
	name: 'home-module-top',
	components: {
		Toast,
	},
	props: ['item', 'area'],
	data() {
		return {
			centerIndex: 100,
			UnreadMessage: '',
    };
	},
	methods: {
		messageEvent: function() {
			this.$emit('messageEvent', '');
		},
		areaEvent: function() {
			this.$emit('areaEvent', '');
		},
		_getUnreadMsgCnt: function() {
      if (!this.$store.state.login.token) {
        return ;
      }
      this.$Loading.open();
			let url = '/app/json/message/getUnreadMsgCnt';
			let _this = this;
			this.$http.post(url, {}).then(
				res => {
        _this.$Loading.close();
          let data = res.data;
          this.UnreadMessage = data.data
				},
				error => {
        _this.$Loading.close();
        console.log('获取未读消息', error);
				}
			);
		},

	},
	created() {
		this._getUnreadMsgCnt();

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.home-bottom-top {
  position: relative;
  width: 100%;
  height: 100%;
  .content-div {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    text-align: center;
    .item-div {
      /* float left */
      /* overflow hidden */
      padding: 8px;
      .img-div {
        position: relative;
        height: 28px;
        width: 28px;
      }
      .area-div {
        padding-top: 5px;
        color: white;
        .area-img {
          margin-left: -2px;
          padding-top: 3px;
          width: 15px;
          height: 15px;
        }
      }
    }
    .input-bg {
      position: relative;
      margin: 5px 3px;
      background-color: #fff;
      border-radius: 5px;
      overflow: hidden;
      .input-none {
        width: 100%;
        height: $font-size-medium;
        padding: 17px 45px 17px 5px;
        border: 0px;
        background: none;
        outline: none;
        font-size: $font-size-medium;
        color: $color-text;
        overflow: hidden;
      }
      .search-img {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 24px;
        height: 24px;
      }
    }
    .left-item {
      float: left;
    }
    .right-item {
      position: relative;
      float: right;
    }
    .page-title {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -50px;
      margin-top: -12px;
      height: 24px;
      width: 100px;
      color: white;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }
  }
}
.topmodulebg {
  background-color: $color-theme-o;
}
.unread-message {
  display: inline-block;
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background-color: #ff5849;
  color: #fff;
}
</style>
