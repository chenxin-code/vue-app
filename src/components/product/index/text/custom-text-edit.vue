/**Created by liaoyingchao on 2019-04-26.*/

<template>
  <EditLayout title="编辑区--文本块">

    <div class="custom-text-edit">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 上浮距离
        </Col>
        <Col offset="1" span="18">
          <Slider :max="20" :step="0.5" width="300px" v-model="pageCurrentData.floatUp"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 左右留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.sidesMargin"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 上留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.upMargin"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 下留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.downMargin"></Slider>
        </Col>
      </Row>
      <Editor
        class="editor"
        :value="content"
        :setting="editorSetting"
        @editing="editing"
        :max-size="MaxSize"
        :accept="Accept"
        :with-credentials="withCredentials"
        @on-upload-fail="onEditorReady"
        @on-upload-success="onEditorUploadComplete"></Editor>
      <!--:url="Url"-->
    </div>
    <!--<div v-html="content"></div>-->
  </EditLayout>
</template>

<script>
  import Bus from '../bus';
  import {mapGetters} from 'vuex';
  import Editor from '../base/editor'

  export default {
    name: 'custom-text-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      Editor
    },
    data() {
      return {
        editorSetting: { // 配置富文本编辑器高
          height: 300
        },
        // Url: 'http://localhost:9528/api/PublicTransaction-SYS-Web/upload/singleUpload', // 图片对应的上传地址
        MaxSize: 75765, // 文件大小
        Accept: '', // 文件格式
        withCredentials: true,
        content: '' // 富文本编辑器双向绑定的内容
      };
    },
    methods: {
      editing(content) { // editor组件传过来的值赋给content
        this.pageCurrentData.content = content

        Bus.$emit('refreshCustomText')
      },
      editors(content) { // editor组件传过来的值赋给content
        console.log(content)
        this.content = content
        this.pageCurrentData.content = content

        Bus.$emit('refreshCustomText')
      },
      onEditorReady(ins, ina) { // 上传失败的函数
        // console.log('ins')
        // console.log(ins)
        // console.log(ina)
      },
      onEditorUploadComplete(json) { // 处理上传图片后返回数据，添加img标签到编辑框内
        // console.log('json')
        // console.log(json)
        // console.log(json[0].data.filePath)
        // this.content = this.content + '<img src=' + json[0].data.filePath + '>'
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

  .image-div {
    width 100%;
    position relative;
    overflow hidden;

    img {
      background-color #efefef;
      display block;
      width 100%;
      min-height 40px;
    }

    .header-img {
      margin 0 auto;
      width 100px;
      height 100px;
    }

    .tip {
      position absolute;
      left 0px;
      right 0px;
      bottom 0px;
      padding 8px;
      font-size 13px;
      text-align center;
      background-color rgba(255, 255, 255, 0.3)
    }
  }
</style>
