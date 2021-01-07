
<template>
  <div class="photograph">
    <!-- 弹框 选择拍照方式 -->
    <van-action-sheet
      v-model="uploadData.isShowUpload"
      :actions="actions"
      cancel-text="取消"
      @cancel="onCancel"
      @select="onSelect"
    />
  </div>
</template>
<script>
import mixin from "../mixin";
export default {
  name: "photograph",
  mixins: [mixin],
  props: {
    uploadData: {
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  components: {},
  data() {
    return {
      actions: [
        {
          name: "拍照",
          type: '2'
        },
        {
          name: "从相册中选择",
          type: '1'
        }
      ]
    };
  },
  mounted() {},
  methods: {
    onSelect(item) {
      if (this.uploadData.type == 3) {
        if (item.type == 2) {
          this.getImg('3')
        } else {
          this.getImg(item.type)
        }
      } else {
        this.getImg(item.type)
      }
    },
    onCancel() {
      this.$emit('onCancel')
    },
    // 1 是相册 2 是拍照 3 自定义相机拍证件
    getImg (op) {
      this.$bridgefunc.getPhoto(op, img => {
        this.updateImg(img)
      },op == 3? '1':'0')
    },
    updateImg(image) {
      let params = {
        base64File: image,
        fileType: 'jpg',
        fileName: 'id-card-img',
        bucketName: 'app_img'
      }
      this.$Loading.open('保存中...')
      this.$http.post('/uploadFile', params).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.$emit('onCancel')
          this.$emit('picturesData', data.data || '',image)
        } else {
          this.$Toast(data.info)
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
</style>
