<template>
  <!--<transition name="pop_transiton">-->
    <div class="mall2 bottom" v-if="visible">
      <pop-view @closeEvent="visible = false">
        <div class="pop-body">
          <div class="pop-title theme_font_common">有货自提点</div>
          <div class="pop-scroll-div padding-none">
            <sitelist :selectedId="initData.selectedId" :site-list="myList" @selectsite="selectItem"></sitelist>
          </div>
          <!--<div class="bottom-btn theme_font_white theme_bg_red" @click="otherAddress">其他自提点</div>-->
        </div>
      </pop-view>
    </div>
  <!--</transition>-->
</template>

<script>
  import Sitelist from '@/components/mall2/address/site-lists'

  export default {
    name: 'search',
    components: {
      Sitelist
    },
    data() {
      return {
        initData: {
          selectedId: '',
          token: '',
        },
        visible: false,
        addressEvent: null,
        otherAddressEvent: null,
        myList: []
      }
    },
    methods: {
      otherAddress: function () {
        this.otherAddressEvent()
      },
      selectItem: function (item) {
        this.addressEvent(item)
      },
      // 我的自提点
      _getAddressList: function () {//获取我的自提点
        this.$Loading.open();
        let url = '/app/json/user_address/searchSelfliftAddressList';
        let params1 = {
          token: this.initData.token,
          posx:this.initData.posx,
          posy:this.initData.posy,
          page: {
            index: 1,
            pageSize: 50
          },
        }
        if (this.initData.tags) {
          params1.storeOuCodeList = this.initData.tags
        }
        if (this.initData.skuIds) {
          params1.skuIds = this.initData.skuIds
        }

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            if (arr.length) {
              let list = data.data
              let list1 = []
              // let list2 = []
              for (let i = 0; i < list.length; i++) {
                let item = list[i]
                if (item.hasStock == 1) {
                  list1.push(item)
                } else {
                  // list2.push(item)
                }
              }
              this.myList = list1;
              // this.siteList1 =
              // this.siteList2 = list2
            } else {

            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      }
    },
    mounted() {
      this._getAddressList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bottom {
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 199;
    overflow hidden
    .padding-none {
      padding 0px;
    }
  }

</style>
