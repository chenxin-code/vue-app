<template>
  <div>
    <div class="editor-container">
      <textarea class='tinymce-textarea' :id="tinymceId"></textarea>
      <!--<div class="editor-btn">-->
        <!--<BaseUpload @successUpload="successUpload" multiple isResetUpload :isUpload='readonly'><span-->
          <!--slot="text">上传图片</span></BaseUpload>-->
      <!--</div>-->
    </div>
    <!--<Spin fix v-if="spinShow">-->
      <!--<Icon type="load-c" size='18' class="demo-spin-icon-load"></Icon>-->
      <!--<div>加载组件中...</div>-->
    <!--</Spin>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import tinymce from 'tinymce'
  import toolbar from './base-editor/toolbar'
  import plugins from './base-editor/plugins'

  export default {
    name: '',
    props: {
      toolbar: {
        type: Array,
        default() {
          return []
        }
      },
      readonly: {
        type: Boolean,
        default: false
      },
      editorHeight: {
        type: Number,
        required: false,
        default: 300
      },
      value: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: `tinymce-${(new Date()).getTime()}`
      }
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        baseUrl: process.env.BASE_URL,
        tinymceId: this.id,
        spinShow: true
      }
    },
    methods: {
      init() {
        window.tinymce.baseURL = `${this.baseUrl}tinymce`
        this.$nextTick(() => {
          let that = this
          // let height = document.body.offsetHeight - 300
          tinymce.init({
            selector: `#${that.tinymceId}`,
            branding: false,
            elementpath: false,
            height: this.editorHeight,
            width: '100%',
            language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            plugins: plugins,
            toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
            autosave_interval: '20s',
            end_container_on_empty_block: true,
            powerpaste_word_import: 'clean',
            nonbreaking_force_tab: true,
            image_advtab: true,
            convert_urls: false,
            table_default_styles: {
              width: '100%',
              borderCollapse: 'collapse'
            },
            init_instance_callback: editor => {
              if (that.value) {
                editor.setContent(that.htmlDecode(that.value))
              }
              that.hasInit = true
              editor.on('NodeChange Change KeyUp SetContent', (e) => {
                that.hasChange = true
                that.$emit('input', editor.getContent() ? editor.getContent() : ' ')
              })
            },
            setup: function (editor) {
              editor.on('init', function (e) {
                that.spinShow = false
                if (that.readonly) {
                  tinymce.activeEditor.setMode('readonly')
                }
              })
              editor.on('keydown', function (e) {
              })
            }
          })
        })
      },
      successUpload(arr) {
        const that = this
        arr.forEach(item => {
          window.tinymce.get(that.tinymceId).insertContent(`<img class="tiny-img" src="${item.url}">`)
        })
      },
      destroyTinymce() {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      },
      htmlDecode(text) {
        let value = text
        if (value && value.indexOf('&lt;') > -1) {
          let temp = document.createElement('div')
          temp.innerHTML = text
          value = temp.innerText || temp.textContent
          temp = null
        }
        return value
      }
    },
    mounted() {
      this.init()
    },
    destroyed() {
      this.destroyTinymce()
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(this.htmlDecode(val) || ''))
        }
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .editor-container {
    position: relative
    .editor-btn {
      position: absolute
      right: 5px;
      top: 5px;
    }
  }
</style>
