/**Created by liaoyingchao on 2018/12/21.*/

<template>
  <EditLayout title="编辑区--海油顶部组件">
    <p class="row-padding">签到链接：
      <a @click.prevent="editLink" href="">{{getLinkText()}}</a>
    </p>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus';
  import {mapGetters} from 'vuex';

  export default {
    name: 'hy-top-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
    data() {
      return {
        linkShow: true,
        toggleMainMixActive: 0,
        memberLevels: [],
        editLineIndex: ''
      };
    },
    methods: {
      getLinkText: function() {
        let str = "请选择跳转页面链接地址";
        if (this.pageCurrentData.link && this.pageCurrentData.link.name && this.pageCurrentData.link.name != "") {
          str = this.pageCurrentData.link.name;
        } else if (this.pageCurrentData.link && this.pageCurrentData.link.url && this.pageCurrentData.link.url != "") {
          str = this.pageCurrentData.link.url;
        }
        return str;
      },
      // 选择要跳转的页面
      editLink: function() {
        Bus.$emit("showLinkCenter", {
          linkSelType: '0',
          linkData: this.pageCurrentData.link,
          callback: item => {
            if (item) {
              this.pageCurrentData.link = item;
            }
          }
        });
      }
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .edit-item {
    padding: 10px;
    border: 1px dashed #dcdddd;
    background-color: #fff;
    img {
      border: 1px solid #dcdddd;
    }
  }
  .remove-item-img {
    float right;
    width 20px;
    height 20px;
    border-radius 10px;
    overflow hidden;
  }
</style>
