<template>
  <EditLayout title="编辑区--登录">
    <Row type="flex" align="middle" class="row-padding row-bottom-line">
      <Col span="4"> logo
      </Col>
      <Col span="7">
      <div class="center-img-div big-height" @click="selectImg()">
        <img :src="pageCurrentData.logoPath" class="big-img">
      </div>
      </Col>
    </Row>
    <br>
		<Row type="flex" align="middle">
      <Col span="4">
        背景色
      </Col>
      <Col span="12">
        <ColorPicker v-model="pageCurrentData.bgColor" />
      </Col>
    </Row>
  </EditLayout>
</template>

<script>
import { mapGetters } from "vuex";
import BgEdit from '../base/bg-edit';
import Bus from "../bus";

export default {
  name: 'login-edit',
  components: {
		BgEdit,
	},
  data () {
    return {
      bgColor: ""
    }
  }, 
  computed: {
    ...mapGetters(["pageData", "pageCurrentData"])
  },
  created () {
  },
  methods: {
    selectImg: function() {
      Bus.$emit("showImgCenter", item => {
        this.pageCurrentData.logoPath = item.url;
      });
    }
  }
};
</script>

<style>
</style>
