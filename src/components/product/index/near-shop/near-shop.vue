<template>
  <div :style="getMyStyle()">
    <!--<AuxiliaryEdit v-if="!usePorpData && pageData.moduleList[myIndex].editing"></AuxiliaryEdit>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'near-shop',
  components: {
		// AuxiliaryEdit,
	},
	props: ['myIndex', 'usePorpData', 'propData'],
	computed: {
    pageData: function() {
			if (this.usePorpData == true) {
				return this.propData;
			}
			return this.$store.state.pageData;
		},
    moduleData: function() {
			return this.pageData.moduleList[this.myIndex].data;
		},
	},
  methods: {
    getMyStyle: function () {
      let styleStr = this.$market.getModuleBgStyle(this.moduleData)
      styleStr += 'height:'+this.moduleData.height+'px;'
      return styleStr;
    }
  },
  created() {
    if (!this.moduleData.bgColor) {
      this.moduleData.bgColor = '';
    }
  }
};
</script>

<style>

</style>
