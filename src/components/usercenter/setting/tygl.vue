/**Created by steven on 2018/11/20.*/

<template>
  <div class="tygl">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="center mine-box-shodow">
        <ul class="setting-list">
          <!--border-bottom-->
          <li class="setting-item public-bar border-bottom" :class="{'icon-more': item.rightText == ''}"
              v-for="(item,index) in settingList" @click="jumpUrl(item)">
            <span class="left-text">{{item.name}}</span>
            <span class="right-text">{{item.rightText}}</span>
          </li>
        </ul>
      </div>
    </nav-content>

  </div>
</template>

<script>

  export default {
    name: "setting",
    components: {},
    data() {
      return {
        settingList: [
          {name:'清除缓存',id:'0',rightText:'0.00KB', len: 0},
          {name: 'APP版本', id: '1', rightText: ''},
          {name: '用户协议', id: '2', rightText: ''},
          {name: '隐私协议', id: '3', rightText: ''},
        ]
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      jumpUrl: function (item) {
        if (item.id == '0') {
          this.clearCache();
        } else if (item.id == '1') {

        } else if (item.id == '2') {
          // 用户协议
          this.$router.push({
            path: '/usercenter/agreement',
            query: {
              value: 17
            }
          })
        } else if (item.id == '3') {
          // 隐私协议
          this.$router.push({
            path: '/usercenter/agreement',
            query: {
              value: 63
            }
          })
        } else if (item.id == '4') {
          this.$router.push({
            path: '/usercenter/platformQualification',
          })
        }
      },
      clearCache: function () {
        this.$bridgefunc.removeItem('browsingHistory', () => {
          this.getCacheLen()
        })
        this.$bridgefunc.removeItem('vuex', () => {
          this.getCacheLen()
        })
      },
      getCacheLen: function () {
        this.settingList[0].len = 0
        this.settingList[0].rightText = '0.0KB'
        this.$bridgefunc.getItem('browsingHistory', (result) => {
          if (!result || result == '' || result == 'null' || result == undefined) {
            return;
          }
          let len = result.length;
          this.settingList[0].len += len
          this.settingList[0].rightText = this.settingList[0].len / 1000 + 'KB'
        })

        this.$bridgefunc.getItem('vuex', (result) => {
          if (!result || result == '' || result == 'null' || result == undefined) {
            return;
          }
          let len = result.length;
          this.settingList[0].len += len
          this.settingList[0].rightText = this.settingList[0].len / 1000 + 'KB'
        })
      },
      getVersion: function () {
        this.$Loading.open();
        let url = '/app/json/home/getVersion';
        this.$http.post(url, {}).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              console.log(data)
            } else {
              this.$Toast(data.info ? data.info : '获取版本信息失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      },
      arrRemoveId: function (list, id) {
        let arr = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].id != id) {
            arr.push(list[i])
          }
        }
        return arr
      },
    },
    created() {
      // 小程序和公众号端去掉app版本
      if (this.$store.state.webtype == 3 || this.$store.state.webtype == 2) {
        this.settingList = this.arrRemoveId(this.settingList, '1')
      }

      if (this.$store.state.globalConfig.isShowQualification == 'true') {
        this.settingList.push({
          name: '平台资质',
          id: '4',
          rightText: ''
        })
      }

      this.$bridgefunc.getCommonArgs((nArgs) => {
        this.settingList[1].rightText = nArgs.appVersion
      })
      this.getCacheLen()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .tygl {
    width 100%
    height 100%
    overflow hidden;

    .center {
      margin 10px
      border-radius: 5px;

      .setting-list {
        .setting-item {
          .right-text {
            margin-right: 10px;
            color: #666;
            font-size: $font-size-medium-s;
          }
        }
      }
    }
  }
</style>
