/**Created by liaoyingchao on 2020-05-20.*/

<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="system-permissions">
        <div class="tip">为向您提供更好的用户体验，我们在特定场景可能需要向您申请以下手机系统权限</div>
        <div class="list mine-box-shodow">
          <div class="item" :class="{ line_top : index != 0}" v-for="(item, index) in list">
            <div class="info">
              <div class="name">{{item.name}}</div>
              <div class="desc">{{item.description}}</div>
            </div>
            <div class="jiantou" @click="openPromissions(item.code)">
              <span :class="{btn: item.value != 1}">{{item.value == '1' ? '已允许' : '去设置'}}</span>
              <i class="iconfont mall-gengduojiantou"></i>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "system-permissions",
    components: {},
    data() {
      return {
        list: [{
          code: 'location',
          name: '允许访问位置信息权限',
          description: '根据您当前位置提供更契合您需求的页面展示',
          value: '0'
        }, {
          code: 'camera',
          name: '允许访问相机权限',
          description: '进行扫码、拍摄，用于扫码购物、发表评价、更换头像等',
          value: '0'
        }, {
          code: 'photo',
          name: '允许访问相册权限',
          description: '帮助您实现图片的保存和读取',
          value: '0'
        }]
      }
    },
    methods: {
      openPromissions: function (code) {
        this.$bridgefunc.openPermissions(code)
      },
      getPermissions: function () {
        this.$bridgefunc.getPermissions((pArr) => {
          if (pArr) {
            for (let i = 0; i < pArr.length; i++) {
              let p = pArr[i]
              for (let j = 0; j < this.list.length; j++) {
                let item = this.list[j]
                if (p.code == item.code) {
                  if (p.value == 1) {
                    item.value = '1'
                    this.list.splice(j, 1, item)
                    break ;
                  }
                }
              }
            }
          }
        })
      }
    },
    created() {
      this.getPermissions()
      this.$bridgefunc.enterForegroundCallBack(() => {
        this.getPermissions()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .system-permissions {
    width 100%
    height 100%
    overflow hidden
    background-color #f5f5f5;
    .tip {
      font-size 10px;
      line-height 16px;
      padding 10px 12px;
      color #999;
    }
    .list {
      margin 10px
      border-radius 5px
      padding 2px 12px;
      background-color white;
      .item {
        padding 8px 0;
        display flex;
        align-items center;
        .info {
          flex 1;
          padding-right 20px;
          .name {
            font-size 12px;
            line-height 18px;
          }
          .desc {
            color #999;
            font-size 10px;
            line-height 16px;
          }
        }
        .jiantou {
          padding 8px 0;
          display flex;
          align-items center;
          color #666;
          font-size 12px;
          .btn {
            color #4B94F6;
          }
          i {
            margin-left 2px;
            color #666;
            font-size 12px;
          }
        }
      }
    }
  }
</style>
