<template>
  <div class="package-change" @click="cancelClickBtn">
    <nav-top title="套餐选择" @backEvent="$router.go(-1)">
      <i class="iconfont mall-gengduo" @click.stop="dropmenuShow = !dropmenuShow"></i>
    </nav-top>
    <nav-content class="package-change-container">
      <!--      右上角弹框-->
      <div class="dropmenu" v-show="dropmenuShow" @click.stop>
        <div class="dropmenu-item" v-for="(item, index) in tabList" :key="index" @click="linkTo(item)">{{item.text}}</div>
      </div>
      <div class="main">
        <div class="table-view content" v-if="complete" @click="openPackage(item)" v-for="(item, index) in packageList" :key="index">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <div class="top">
                  <div class="img">
                    <img :src="item.pic" alt="">
                  </div>
                  <div class="title">{{item.name}}</div>
                </div>
                <div class="bottom">
                  <div class="name">套餐类别</div>
                  <ul class="type-list">
                    <li class="type-item" v-for="(item2, index) in item.packageRefuelList" :key="index">{{item2.duration}}天</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="table-view-cell-arrow">前往开通</div>
          </div>
        </div>
        <div class="tab">
          <div class="item" v-for="(item, index) in tabList" :key="index">
            <div class="text" @click="linkTo(item)">{{item.text.substr(0, 2)}}<br />{{item.text.substr(2, 2)}}</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Cookie from 'js-cookie'
  export default {
    data() {
      return {
        tabList: [
          {text: '套餐说明', type: 1},
          {text: '我的邀约', type: 2},
          {text: '历史签约', type: 3},
        ],
        dropmenuShow: false, // 右上角点点点
        complete: false,
        packageList: [],
        list: [],
        // isnativetop: ''
      }
    },
    mounted() {
      // this.isnativetop = Cookie.get('isnativetop')
      this.queryPackageRefuelTypeList()
    },
    methods: {
      cancelClickBtn() {
        this.dropmenuShow = false
        this.tabList.forEach(tab => {
          tab.showClick = false
        })
      },
      linkTo(item) {
        // 右上角菜单
        if (item.type == 1) {
          // 套餐说明
          this.$router.push({path: '/instructions'})
        } else if (item.type == 2) {
          // 我的邀约
          this.$router.push({path: '/my-invitation'})
        } else {
          // 历史签约
          this.$router.push({path: '/history-invitation'})
        }
      },
      queryPackageRefuelTypeList() {
        // 查询套餐列表
        this.$request.post('/app/json/app_package_refuel/queryPackageRefuelTypeList', {
        }).then(res => {
          if (res.status === 0) {
            this.packageList = res.data
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      openPackage(item) { // 1 个人套餐 2家庭套餐
        // 开通套餐
        this.$router.push({path: '/open-package', query: {type: item.packageType, overdueDate: this.$route.query.overdueDate || '', id: item.id}})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .package-change {
    background-color: #f8f8f8 !important
    .package-change-container {
      padding: 11px 15px
      .main {
        .content {
          border-radius 4px
          .left {
            .top, .bottom {
              display flex
              justify-content left
              align-items center
            }
            .top {
              padding-bottom: 10px
              .img {
                width: 30px
                height: 30px
                border-radius 50%
                overflow hidden
                margin-right: 5px
                img {
                  width 100%
                  height 100%
                }
              }
              .text {
                font-size 14px
                color: $color-text
              }
            }
            .bottom {
              .name {
                color: $color-text-d
                font-size 12px
                padding-right: 5px
              }
              .type-list {
                display flex
                justify-content left
                align-items center
                font-size 10px
                .type-item {
                  margin-right: 10px
                  border-radius 20px
                  border: 1px solid #f89191
                  padding: 4px 7px
                  background #fde9ea
                  color: #f89191
                }
                .type-item:nth-child(3n-2) {
                  background #fff2e9
                  border-color  #ffc390
                  color: #f58f3a
                }
                .type-item:nth-child(3n-1) {
                  background #e9f2fd
                  border-color #93c1f7
                  color: #2f83e6
                }
                .type-item:nth-child(3n) {
                  background #fde9ea
                  border-color #f89191
                  color: #e66464
                }
              }
            }
          }
          .table-view-cell-arrow {
            color: $color-text-d
          }
        }

        .tab {
          position absolute
          right: 0
          top: 15px
          z-index: 99999
          .item {
            .text {
              width: 50px
              position: relative;
              right -5px
              border-top-left-radius 20px
              border-bottom-left-radius 20px
              background-color: rgba(0, 0, 0, 0.6);
              color: #fff
              margin-bottom: 10px
              height: 33px;
              display: flex;
              justify-content: center;
              align-items: center
            }
          }
        }

      }
    }
  }
  .no-data {
    text-align center
    padding: 20px 0
    color: $color-text-d
  }
  .iconfont {
    position: absolute;
    right: 10px
    top: 0;
    font-size 20px
  }
  .dropmenu {
    position: absolute;
    top: 0;
    right: 10px
    z-index: 10;
    background: rgba(0, 0, 0, 0.8);
    width: 100px;
    border-radius: 5px;
    text-align: center;
    font-size: 12px;
    line-height: 1.415;
    color: #fff
    padding: 0 5px

    .dropmenu-item {
      padding: 10px 0;
      position relative

      & + .dropmenu-item {
        border-top: 0.5px solid #cccccc
      }
    }
  }

</style>
