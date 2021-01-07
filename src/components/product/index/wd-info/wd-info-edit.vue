<template>
  <EditLayout title="编辑区--微店信息">
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus'

  export default {
    name: 'auxiliary-edit',
    components: {
      BgEdit
    },
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    data() {
      return {
        myCenterStyle: 1,
        templateList: [
          {
            name: '默认',
            img: 'static/images/rubik/1-2.png',
            id: '',
          },
        ],
      };
    },
    methods: {
      selectChanged: function () {
        Bus.$emit('myAssetsRefresh')
      }
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .card {
    background-color: #fff;
    border: 1px dashed #ddd;
    padding: 10px;
    img {
      width 100%;
    }
  }
  .my-padding {
    padding-left 10px;
  }
</style>
