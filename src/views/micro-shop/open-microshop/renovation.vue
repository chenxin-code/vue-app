<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="店铺装修">
        <div class="shareBox" @click="previewData">预览</div>
    </nav-top>
    <nav-content>
      <van-cell-group>
          <div class="selectDiv" @click="changeName">
            <van-field v-model="mall.storeName" label="店铺名称" :readonly='true' placeholder="店铺名称"/>
            <span class="iconfont mall-gengduojiantou" v-if="!disabled"></span>
          </div>
          <div class="selectDiv" @click="changeProfile">
            <van-field :readonly='true' v-model="mall.storeProfile" label="店铺简介" placeholder="店铺简介"/>
            <span class="iconfont mall-gengduojiantou" v-if="!disabled"></span>
          </div>
        <router-link class="link" :to="{path:'/micro_sho/bank',query:{card:mall.card,bankName:mall.bankName}}" v-if="$store.state.globalConfig.microshop_open == 1">
          <div class="selectDiv">
            <van-field :readonly='true' v-model="mall.card" label="我的银行卡"/>
            <span class="iconfont mall-gengduojiantou"></span>
          </div>
        </router-link>
        <div class="selectDiv" @click="openChangeImgPopup(1)">
          <van-field type="tel" label="店铺头像" disabled/>
          <img class="img1" :src="mall.pictureUrl" alt="">
          <span class="iconfont mall-gengduojiantou"></span>
        </div>
        <div class="selectDiv" @click="openChangeImgPopup(2)">
          <van-field label="店铺背景" disabled/>
          <img class="img1" :src="mall.backgroundImgUrl" alt="">
          <span class="iconfont mall-gengduojiantou"></span>
        </div>
      </van-cell-group>
      <van-action-sheet
        v-model="showFaceBackImg"
        :actions="actions"
        @select="onSelect"
      />
    </nav-content>
  </div>
</template>

<script>
  import Photo from '@/components/commonui/choosephoto'
  import api from './api'
  import store from "../../../vuex/store";
  import {Toast} from 'vant'
  import {mapGetters} from "vuex";
  import Jwx from '@/deploy/hbsy/utils/jwx'
  export default {
    name: "renovation",
    mixins: [api],
    data() {
      return {
        headUrl: '/static/image/microShop/head@2x.png',
        bacUrl: '/static/image/microShop/head@2x.png',
        disabled: false,
        showFaceBackImg: false, // 选择相机还是拍照弹框
        actions: [
          {
            name: '相册',
          },
          {
            name: '拍照'
          },
        ],
        faceOrBack: '', //
        frontOfId: '', //提交时候头像的路径
        backOfId: '', //提交时候背景图的路径
        mall: {}
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    mounted() {
      if (this.$store.state.globalConfig.auto_create_store_info == 1) {
        this.disabled = true
      }
      this.loadIndex()
    },
    methods: {
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }
        that.modifyData(params).then(res => {
          let data = res.data.data || {}
          that.mall = data
          if (that.mall.storeProfile) {
          } else {
            this.content()
          }
        })
      },
      content() {
        this.$request.post('/app/json/news/getNewsList', {values: 62}).then(res => {
          console.log('协议内容1',res);
          if (res.result === "success") {
            let data = res.data || []
            this.mall.storeProfile = data[0].content
          } else {
            this.$Toast(res.info)
          }
        })
      },
      changeProfile() {
        if (this.disabled == false) {
          this.$router.push({
            path: '/micro_sho/modifyintroduction'
          })
        }
      },
      changeName() {
        if (this.disabled == false) {
          this.$router.push({
            path: '/micro_sho/modifyname'
          })
        }
      },
      openChangeImgPopup(type) {
        // 选择相机拍照弹框
        if (type == 1) {
          // 头像
          this.faceOrBack = 1
        } else {
          // 背景图
          this.faceOrBack = 2
        }
        if (this.$store.state.webtype == 6) {
          Jwx.chooseImg().then(res => {
            if (this.faceOrBack == 1) {
              this.mall.pictureUrl = res.imgUrl
              this.frontOfId = res.imgUrl  //获取头像的路径
            } else {
              this.mall.backgroundImgUrl = res.imgUrl
              this.backOfId = res.imgUrl //获取背景图的路径
            }
            this.commit()
          })
        } else {
          this.showFaceBackImg = true
        }
      },
      onSelect(item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭  1 是相册 2 是拍照
        this.showFaceBackImg = false
        if (item.name == '拍照') {
          this.getImg('2')
        } else if (item.name == '相册') {
          this.getImg('1')
        }
      },
      getImg (op) {
        this.$bridgefunc.getPhoto(op, img => {
          this.updateImg(img)
          let imgBack = 'data:image/jpg;base64,' + img
          if (this.faceOrBack == 1) {
            this.mall.pictureUrl = imgBack
          } else {
            this.mall.backgroundImgUrl = imgBack
          }
        })
      },
      updateImg(image) {
        let params = {
          base64File: image,
          fileType: 'jpg',
          fileName: 'id-card-img',
          bucketName: 'default_file'
        }
        this.$Loading.open('保存中...')
        this.$http.post('/uploadFile', params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (this.faceOrBack == 1) {
              this.frontOfId = data.data  //获取头像的路径
              this.commit()
            } else {
              this.backOfId = data.data //获取背景图的路径
              this.commit()
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close();
          this.$Toast('上传图片失败')
        })
      },
      commit() {
        let that = this
        console.log(that.getPutaggregate.id);
        let params = {
          token: this.$store.state.login.token,
          id: that.getPutaggregate.id,
          storeName: '',
          pictureUrl: that.frontOfId,
          backgroundImgUrl: that.backOfId,
          storeProfile: '',
          card: '',
        }

        that.modifyafterData(params).then(res => {
          if (res.data.result === 'success') {
            this.getPutaggregate.pictureUrl = that.frontOfId
            this.getPutaggregate.backgroundImgUrl = that.backOfId
            store.commit('putaggregate', this.getPutaggregate)
            // this.$router.go(-1)
          } else {
            Toast(res.data.info)
          }
        })
      },
      previewData() {
        let that = this
        that.$router.push({
          name: 'micro_sho/preview', //预览
          params: {
            mall: that.mall
          }
        })
      },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .link{
    display block
  }
  .body {
    background #f6f6f6 !important;

    .shareBox {
      float right;
      margin-right 10px;
      width 50px;
      color #3c3c3c
      font-size 14px;
    }

    .van-cell-group {
      margin-top 10px;

      /deep/ .van-field__control {
        text-align: right;
      }

      /deep/ .van-field__control:disabled {
        color: #323233;
      }
    }

    .selectDiv {
      display flex;
      justify-content space-between

      span {
        margin: auto;
        margin-right 10px;
      }

      .img1 {
        /*width: 35px;*/
        height 35px;
        margin: auto;
        margin-left 6px;
        vertical-align: middle;
      }
    }
  }
</style>
